"""rag_query.py — RAG-based product catalog Q&A for Dozen Hotel Supplies.

Retrieves the top-k most relevant catalog chunks from ChromaDB and passes them
to Claude Haiku to generate an accurate, grounded answer. Works both as a CLI
tool and as an importable library function.

Usage (CLI):
    python tools/rag_query.py --query "What GSM are your bath towels?"
    python tools/rag_query.py --query "Do you have pool towels?" --k 3

Library usage:
    from tools.rag_query import query_catalog
    answer = query_catalog("What sizes do bath towels come in?")

Environment variables (loaded from .env at project root):
    ANTHROPIC_API_KEY   Required. Claude API key.
    CHROMA_DB_PATH      Path to ChromaDB data directory (default: ./chroma_db)
"""

from __future__ import annotations

import argparse
import logging
import os
import sys
from pathlib import Path

import anthropic
import chromadb
from dotenv import load_dotenv
from jinja2 import Environment, FileSystemLoader, TemplateNotFound

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

COLLECTION_NAME = "dozen_catalog"
CLAUDE_MODEL = "claude-haiku-4-5-20251001"
DEFAULT_K = 5
_PROJECT_ROOT = Path(__file__).resolve().parent.parent
_PROMPTS_DIR = Path(__file__).resolve().parent / "prompts"
_PROMPT_TEMPLATE_FILE = "answer_question.txt"

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Prompt rendering
# ---------------------------------------------------------------------------


def _render_prompt(catalog_context: str, question: str) -> str:
    """Render the answer_question.txt Jinja2 prompt template.

    Args:
        catalog_context: Concatenated catalog chunk texts to inject into the
            template's ``{{ catalog_context }}`` variable.
        question: The prospect's natural language question, injected into
            ``{{ question }}``.

    Returns:
        The fully rendered prompt string ready to send to Claude.

    Raises:
        TemplateNotFound: If ``tools/prompts/answer_question.txt`` is missing.
    """
    env = Environment(
        loader=FileSystemLoader(str(_PROMPTS_DIR)),
        autoescape=False,
        keep_trailing_newline=True,
    )
    try:
        template = env.get_template(_PROMPT_TEMPLATE_FILE)
    except TemplateNotFound as exc:
        raise TemplateNotFound(
            f"Prompt template not found at {_PROMPTS_DIR / _PROMPT_TEMPLATE_FILE}"
        ) from exc

    return template.render(catalog_context=catalog_context, question=question)


# ---------------------------------------------------------------------------
# ChromaDB retrieval
# ---------------------------------------------------------------------------


def _retrieve_chunks(
    question: str,
    db_path: Path,
    k: int,
) -> list[dict[str, str]]:
    """Query ChromaDB for the top-k chunks most relevant to *question*.

    Args:
        question: Natural language query string.
        db_path: Path to the ChromaDB persistent storage directory.
        k: Number of top results to return.

    Returns:
        A list of dicts, each with keys ``"text"``, ``"source"``,
        ``"category"``, and ``"section"``.

    Raises:
        RuntimeError: If the ``dozen_catalog`` collection does not exist or
            the query fails.
    """
    client = chromadb.PersistentClient(path=str(db_path))

    try:
        collection = client.get_collection(COLLECTION_NAME)
    except Exception as exc:
        raise RuntimeError(
            f"ChromaDB collection '{COLLECTION_NAME}' not found at {db_path}. "
            "Run tools/ingest_catalog.py first."
        ) from exc

    results = collection.query(
        query_texts=[question],
        n_results=k,
        include=["documents", "metadatas"],
    )

    documents: list[str] = (results.get("documents") or [[]])[0]
    metadatas: list[dict] = (results.get("metadatas") or [[]])[0]

    chunks = []
    for doc, meta in zip(documents, metadatas):
        chunks.append(
            {
                "text": doc,
                "source": meta.get("source", ""),
                "category": meta.get("category", ""),
                "section": meta.get("section", ""),
            }
        )

    logger.info(
        "Retrieved %d chunk(s) for query: %r",
        len(chunks),
        question[:80],
    )
    return chunks


# ---------------------------------------------------------------------------
# Claude call
# ---------------------------------------------------------------------------


def _call_claude(prompt: str, api_key: str) -> str:
    """Send the rendered prompt to Claude Haiku and return the reply text.

    Args:
        prompt: Fully rendered prompt string (system + user content combined
            as a single user message, matching the template design).
        api_key: Anthropic API key.

    Returns:
        Claude's reply as a plain string.

    Raises:
        anthropic.APIError: On any API-level error.
    """
    client = anthropic.Anthropic(api_key=api_key)

    message = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    )

    # Extract text from the first content block.
    content_block = message.content[0]
    if hasattr(content_block, "text"):
        return content_block.text.strip()
    raise RuntimeError(f"Unexpected Claude response block type: {type(content_block).__name__}")


# ---------------------------------------------------------------------------
# Public library function
# ---------------------------------------------------------------------------


def query_catalog(
    question: str,
    k: int = DEFAULT_K,
    db_path: Path | None = None,
    api_key: str | None = None,
) -> str:
    """Answer a natural language product question using the Dozen catalog.

    Retrieves the top-*k* most relevant catalog chunks from ChromaDB and
    passes them to Claude Haiku via the ``answer_question.txt`` prompt template.

    This function is the primary importable entry point for other tools in the
    pipeline (e.g. the inbound conversation handler).

    Args:
        question: The prospect's product question.
        k: Number of catalog chunks to retrieve (default: 5).
        db_path: Override the ChromaDB path. Falls back to the ``CHROMA_DB_PATH``
            env var, then ``<project_root>/chroma_db``.
        api_key: Override the Anthropic API key. Falls back to the
            ``ANTHROPIC_API_KEY`` env var.

    Returns:
        Claude's answer as a plain string (email body, no greeting/sign-off).

    Raises:
        RuntimeError: If the ChromaDB collection is missing or Claude call fails.
        ValueError: If no ``ANTHROPIC_API_KEY`` is available.
        TemplateNotFound: If the prompt template file is missing.
    """
    # Ensure .env is loaded — safe to call multiple times.
    load_dotenv(_PROJECT_ROOT / ".env")

    resolved_api_key: str = api_key or os.environ.get("ANTHROPIC_API_KEY", "")
    if not resolved_api_key:
        raise ValueError(
            "ANTHROPIC_API_KEY is not set. Add it to .env or pass it explicitly."
        )

    resolved_db_path: Path = db_path or Path(
        os.environ.get("CHROMA_DB_PATH", str(_PROJECT_ROOT / "chroma_db"))
    )

    chunks = _retrieve_chunks(question, resolved_db_path, k)

    # Build the catalog context block: each chunk separated by a divider.
    catalog_context = "\n\n---\n\n".join(
        f"[Source: {c['source']} | Section: {c['section']}]\n{c['text']}"
        for c in chunks
    )

    prompt = _render_prompt(catalog_context=catalog_context, question=question)

    logger.info("Sending prompt to Claude (%s) …", CLAUDE_MODEL)
    answer = _call_claude(prompt, resolved_api_key)
    logger.info("Claude response received (%d chars).", len(answer))

    return answer


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Answer a product question using the Dozen catalog RAG pipeline."
    )
    parser.add_argument(
        "--query",
        required=True,
        metavar="QUESTION",
        help='Natural language product question (e.g. "What GSM are your bath towels?").',
    )
    parser.add_argument(
        "--k",
        type=int,
        default=DEFAULT_K,
        metavar="N",
        help=f"Number of catalog chunks to retrieve (default: {DEFAULT_K}).",
    )
    parser.add_argument(
        "--db-path",
        type=Path,
        default=None,
        help="Override CHROMA_DB_PATH env var.",
    )
    return parser.parse_args()


def main() -> None:
    """CLI entry point for the RAG catalog query tool."""
    load_dotenv(_PROJECT_ROOT / ".env")

    args = _parse_args()

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY is not set in .env", file=sys.stderr)
        sys.exit(1)

    try:
        answer = query_catalog(
            question=args.query,
            k=args.k,
            db_path=args.db_path,
            api_key=api_key,
        )
    except (RuntimeError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:
        print(f"ERROR: Unexpected failure — {exc}", file=sys.stderr)
        logger.exception("Unhandled exception in rag_query.")
        sys.exit(1)

    print(answer)
    sys.exit(0)


if __name__ == "__main__":
    main()
