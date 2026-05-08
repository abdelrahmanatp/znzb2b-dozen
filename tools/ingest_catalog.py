"""ingest_catalog.py — Ingest Dozen product catalog Markdown files into ChromaDB.

Reads all .md files from the catalog directory, splits each file into per-section
chunks (H2/H3 boundaries), and upserts them into the "dozen_catalog" ChromaDB
collection. Idempotent: chunk IDs are deterministic so re-running does not
produce duplicate entries.

Usage:
    python tools/ingest_catalog.py [--reset] [--verbose] [--docs-path PATH] [--db-path PATH]

Environment variables (loaded from .env at project root):
    CHROMA_DB_PATH      Path to ChromaDB data directory (default: ./chroma_db)
    CATALOG_DOCS_PATH   Path to catalog .md files (default: ./docs/catalog)
"""

from __future__ import annotations

import argparse
import logging
import os
import re
import sys
from pathlib import Path

import chromadb
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

COLLECTION_NAME = "dozen_catalog"
_PROJECT_ROOT = Path(__file__).resolve().parent.parent

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Markdown chunking
# ---------------------------------------------------------------------------


def _slug(text: str) -> str:
    """Convert a heading string to a URL-safe slug.

    Args:
        text: Raw heading text (without leading # characters or whitespace).

    Returns:
        Lowercase string with spaces and non-alphanumeric runs replaced by
        underscores, stripped of leading/trailing underscores.
    """
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")


def chunk_markdown(content: str, filename_stem: str) -> list[dict[str, str]]:
    """Split Markdown content into per-section chunks at H2/H3 boundaries.

    Each chunk contains the section heading line plus all body text up to the
    next H2/H3 heading (or end of file). The H1 title is attached as a prefix
    to the first real section chunk so context is not lost.

    Args:
        content: Full text of the Markdown file.
        filename_stem: Stem of the source filename (e.g. ``"towels"``), used to
            build deterministic chunk IDs.

    Returns:
        A list of dicts, each containing:
        - ``chunk_id``: Deterministic identifier (``"{stem}__{section_slug}"``).
        - ``text``: The chunk text (heading + body).
        - ``source``: Original filename stem with ``.md`` extension.
        - ``category``: The filename stem (e.g. ``"towels"``).
        - ``section``: The heading text (stripped of ``#`` characters).
    """
    lines = content.splitlines(keepends=True)

    h1_title = ""
    chunks: list[dict[str, str]] = []
    current_heading: str | None = None
    current_lines: list[str] = []

    def _flush(heading: str | None, body_lines: list[str]) -> None:
        if heading is None:
            return
        body = "".join(body_lines).strip()
        if not body:
            return
        section_slug = _slug(heading)
        chunk_id = f"{filename_stem}__{section_slug}"
        text = f"{heading}\n\n{body}"
        if h1_title and not chunks:
            # Prepend the H1 title to the very first chunk for context.
            text = f"{h1_title}\n\n{text}"
        chunks.append(
            {
                "chunk_id": chunk_id,
                "text": text,
                "source": f"{filename_stem}.md",
                "category": filename_stem,
                "section": heading,
            }
        )

    for line in lines:
        h2_match = re.match(r"^(##\s+)(.+)", line)
        h3_match = re.match(r"^(###\s+)(.+)", line)
        h1_match = re.match(r"^#\s+(.+)", line)

        if h1_match and not h1_title:
            # Capture the document title; do not start a new chunk for H1.
            h1_title = h1_match.group(1).strip()
            continue

        if h2_match or h3_match:
            _flush(current_heading, current_lines)
            current_heading = h2_match.group(2).strip() if h2_match else h3_match.group(2).strip()  # type: ignore[union-attr]
            current_lines = []
        else:
            current_lines.append(line)

    _flush(current_heading, current_lines)

    # Edge case: file has no H2/H3 — treat the entire file as one chunk.
    if not chunks and content.strip():
        fallback_id = f"{filename_stem}__overview"
        chunks.append(
            {
                "chunk_id": fallback_id,
                "text": content.strip(),
                "source": f"{filename_stem}.md",
                "category": filename_stem,
                "section": h1_title or filename_stem,
            }
        )

    return chunks


# ---------------------------------------------------------------------------
# ChromaDB operations
# ---------------------------------------------------------------------------


def get_or_create_collection(
    client: chromadb.PersistentClient,
    reset: bool,
) -> chromadb.Collection:
    """Return the ``dozen_catalog`` collection, optionally deleting it first.

    Args:
        client: An initialised ChromaDB persistent client.
        reset: If ``True``, delete the existing collection before re-creating.

    Returns:
        The ChromaDB collection object.
    """
    if reset:
        try:
            client.delete_collection(COLLECTION_NAME)
            logger.warning("Deleted existing collection '%s'.", COLLECTION_NAME)
        except Exception as exc:
            logger.warning("Could not delete collection '%s': %s (may not exist)", COLLECTION_NAME, exc)

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )
    return collection


def upsert_chunks(
    collection: chromadb.Collection,
    chunks: list[dict[str, str]],
    verbose: bool,
) -> int:
    """Upsert a list of chunks into the ChromaDB collection.

    Uses ``upsert`` so that re-running the tool on unchanged files is a no-op
    from the data-integrity perspective (same ID → content is overwritten with
    the same value, not duplicated).

    Args:
        collection: Target ChromaDB collection.
        chunks: List of chunk dicts as returned by :func:`chunk_markdown`.
        verbose: If ``True``, log each chunk ID as it is added.

    Returns:
        Number of chunks upserted.
    """
    if not chunks:
        return 0

    ids = [c["chunk_id"] for c in chunks]
    documents = [c["text"] for c in chunks]
    metadatas = [
        {"source": c["source"], "category": c["category"], "section": c["section"]}
        for c in chunks
    ]

    collection.upsert(ids=ids, documents=documents, metadatas=metadatas)

    if verbose:
        for chunk_id in ids:
            logger.info("  + %s", chunk_id)

    return len(chunks)


# ---------------------------------------------------------------------------
# Main ingestion logic
# ---------------------------------------------------------------------------


def ingest_catalog(
    docs_path: Path,
    db_path: Path,
    reset: bool = False,
    verbose: bool = False,
) -> tuple[int, int]:
    """Ingest all catalog Markdown files into ChromaDB.

    Args:
        docs_path: Directory containing the ``.md`` catalog files.
        db_path: Path to the ChromaDB persistent storage directory.
        reset: Delete and re-create the collection before ingesting.
        verbose: Log each chunk ID as it is upserted.

    Returns:
        A ``(total_chunks, total_files)`` tuple.

    Raises:
        FileNotFoundError: If ``docs_path`` does not exist or contains no
            ``.md`` files.
        RuntimeError: If ChromaDB initialisation or upsert fails.
    """
    if not docs_path.exists():
        raise FileNotFoundError(f"Catalog docs path does not exist: {docs_path}")

    md_files = sorted(docs_path.glob("*.md"))
    if not md_files:
        raise FileNotFoundError(f"No .md files found in: {docs_path}")

    logger.info("Connecting to ChromaDB at %s", db_path)
    client = chromadb.PersistentClient(path=str(db_path))
    collection = get_or_create_collection(client, reset=reset)

    total_chunks = 0
    total_files = 0

    for md_file in md_files:
        logger.info("Processing %s …", md_file.name)
        content = md_file.read_text(encoding="utf-8")
        chunks = chunk_markdown(content, md_file.stem)

        if not chunks:
            logger.warning("  No chunks produced from %s — skipping.", md_file.name)
            continue

        count = upsert_chunks(collection, chunks, verbose=verbose)
        logger.info("  %d chunk(s) upserted from %s", count, md_file.name)
        total_chunks += count
        total_files += 1

    return total_chunks, total_files


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Ingest Dozen catalog Markdown files into ChromaDB. "
            "Idempotent — safe to re-run."
        )
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Delete and re-create the 'dozen_catalog' collection before ingesting.",
    )
    parser.add_argument(
        "--confirm-reset",
        action="store_true",
        help="Required alongside --reset to prevent accidental data loss.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print each chunk ID as it is added.",
    )
    parser.add_argument(
        "--docs-path",
        type=Path,
        default=None,
        help="Override CATALOG_DOCS_PATH env var. Path to directory of .md files.",
    )
    parser.add_argument(
        "--db-path",
        type=Path,
        default=None,
        help="Override CHROMA_DB_PATH env var. Path to ChromaDB data directory.",
    )
    return parser.parse_args()


def main() -> None:
    """CLI entry point for catalog ingestion."""
    # Load .env from project root (two levels up from this file).
    load_dotenv(_PROJECT_ROOT / ".env")

    args = _parse_args()

    log_level = logging.INFO if args.verbose else logging.WARNING
    logging.basicConfig(level=log_level, format="%(levelname)s: %(message)s")

    # Resolve paths: CLI arg > env var > sensible default.
    docs_path: Path = args.docs_path or Path(
        os.environ.get("CATALOG_DOCS_PATH", str(_PROJECT_ROOT / "docs" / "catalog"))
    )
    db_path: Path = args.db_path or Path(
        os.environ.get("CHROMA_DB_PATH", str(_PROJECT_ROOT / "chroma_db"))
    )

    if args.reset and not args.confirm_reset:
        print(
            "FAIL: --reset requires --confirm-reset to prevent accidental data loss.",
            file=sys.stderr,
        )
        sys.exit(1)

    try:
        total_chunks, total_files = ingest_catalog(
            docs_path=docs_path,
            db_path=db_path,
            reset=args.reset,
            verbose=args.verbose,
        )
    except FileNotFoundError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:
        print(f"ERROR: Ingestion failed — {exc}", file=sys.stderr)
        logger.exception("Unhandled exception during ingestion.")
        sys.exit(1)

    print(
        f"Ingested {total_chunks} chunks from {total_files} files "
        f"into collection '{COLLECTION_NAME}'"
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
