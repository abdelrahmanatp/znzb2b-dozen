# Contract — alireza-rag-architect

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/alireza-rag-architect.md`

## Role in this project
Build the product catalog knowledge base the Dozen AI sales agent queries — ingesting all catalog PDFs, selecting chunking strategy and embedding model, setting up vector retrieval, and implementing faithfulness evaluation.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| catalog-knowledge-base | Implementation | lead — end-to-end RAG pipeline build |
| inbound-email-response | Implementation | reviewer — validates retrieval quality before AI agent uses catalog |
| campaign-performance-report | Ongoing | parallel — monitors catalog retrieval metrics weekly |

## Inputs (what this agent needs to start)
- Product catalog PDFs in `_context/` directory (all lines: towels, bed linen, bedding, F&B, bathrobes, slippers, kitchen)
- Structured product data markdown from `technical-writer` (if available)
- Architecture decision from `alireza-agent-designer` on vector DB choice
- RAG query prompt from `alireza-senior-prompt-engineer`

## Outputs (what this agent delivers)
- Chunked and embedded product catalog in chosen vector DB
- `tools/catalog_ingestion.py` — Python script to ingest/update catalog (python-pro implements, this agent designs)
- Evaluation report: faithfulness score, context relevance score, top-5 test queries with results
- Chunking strategy decision document: which strategy chosen and why (for catalog PDFs)

## Handoffs (who receives the output)
- Downstream agent: `python-pro` — receives tool spec for catalog_ingestion.py
- Downstream agent: `alireza-senior-prompt-engineer` — receives retrieval quality data to iterate RAG query prompt
- Expected acknowledgement: faithfulness score ≥ 90%, context relevance ≥ 0.8 before handoff to production

## Tools / MCPs this agent uses
- Python RAG evaluation scripts (RAGAS framework)
- Vector DB (Chroma for dev, Pinecone for production — TBD)
- Embedding API (text-embedding-ada-002 or sentence-transformers)
- Read for PDF ingestion

## Success criteria (how output is judged)
- Faithfulness: >90% (answers are grounded in catalog content, no hallucinated specs)
- Context relevance: >0.8 (retrieved chunks match the query)
- Test queries passing: "What sizes does the bath towel come in?", "What's the price of the Bianca set?", "Do you have pool towels?", "Can you embroider logos?", "What GSM are your bathrobes?"
- Reviewer: `security-auditor` verifies no PII in catalog data; `qa-expert` runs test query suite

## Improvement loop
- Who gives feedback: `data-analyst` (tracks how often AI agent returns "I don't know" — signals retrieval failure)
- When: after first 50 inbound inquiries are handled
- What happens: re-chunk or re-embed sections with poor retrieval performance

## Escalation triggers
- If faithfulness score < 80% after two tuning attempts → escalate to Abbie (may need structured data input from Dozen instead of PDF parsing)
- If catalog PDF quality is too poor to parse accurately → flag immediately; request structured data from client
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: product catalog PDFs in `_context/` directory (✅ present)
- Vector DB choice confirmed by `alireza-agent-designer`
- Tool/MCP status: embedding API key in `.env`

## Open questions at hire time
- Vector DB: Chroma (Phase 1 simplicity) vs Pinecone (production scalability) — [to be finalized in /workflow]
- Embedding model: local sentence-transformers (free, slower) vs text-embedding-ada-002 (paid, faster) — [to be decided]
- Catalog update process: when Dozen adds new products, how does catalog get re-indexed? — [to be finalized in /workflow]
