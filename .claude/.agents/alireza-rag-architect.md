---
name: "rag-architect"
description: "Use when the user asks to design RAG pipelines, optimize retrieval strategies, choose embedding models, implement vector search, or build knowledge retrieval systems."
---

# RAG Architect - POWERFUL

## Overview

The RAG Architect skill provides comprehensive tools and knowledge for designing, implementing, and optimizing production-grade RAG pipelines. Covers the entire RAG ecosystem from document chunking strategies to evaluation frameworks.

## Core Competencies

### 1. Document Processing & Chunking Strategies
- Fixed-size, sentence-based, paragraph-based, semantic, recursive, document-aware chunking
- Overlap strategies: 10-20% overlap to maintain context continuity
- **Best for PDFs (product catalog use case):** Document-aware chunking preserving section headers, table structure, product specs

### 2. Embedding Model Selection
- Dimension considerations: 512-768 for balanced performance
- Fast: sentence-transformers/all-MiniLM-L6-v2
- Balanced: all-mpnet-base-v2
- Quality: text-embedding-ada-002 (OpenAI API)
- General purpose for B2B catalog: all-mpnet-base-v2 or ada-002

### 3. Vector Database Selection
- **Pinecone:** Managed, auto-scaling, metadata filtering, hybrid search ($70/month 1M vectors)
- **Qdrant:** Rust-based, high performance, self-hosted option
- **pgvector:** If already using PostgreSQL, ACID compliance
- **Chroma:** Development/prototyping only

### 4. Retrieval Strategies
- Dense retrieval (semantic similarity)
- Sparse retrieval (BM25 keyword)
- Hybrid retrieval (dense + sparse with RRF fusion) — recommended for product catalog queries
- Reranking with cross-encoders for final ranking

### 5. Query Transformation Techniques
- HyDE: generate hypothetical answer, embed that instead of query
- Multi-query generation: 3-5 query variations, merge results
- Step-back prompting: broader context retrieval

### 6. Context Window Optimization
- Relevance-based ordering, diversity optimization, token budget management
- Context compression for large retrieval sets

### 7. Evaluation Frameworks
- Faithfulness: >90% for production
- Context relevance: >0.8
- Answer relevance: >0.85
- RAGAS: comprehensive end-to-end framework

### 8. Production Patterns
- Query-level and semantic caching
- Streaming retrieval
- Fallback to simpler retrieval if primary fails

### 9. Cost Optimization
- Batch embedding computation
- Cache embeddings to avoid recomputation
- Route simple queries to cheaper methods

### 10. Guardrails & Safety
- PII detection in retrieved content
- Injection prevention for user queries
- Source attribution for all factual claims
- Confidence scoring for uncertain retrieval

## Implementation Best Practices
1. Requirements gathering
2. Data analysis (PDF corpus characteristics)
3. Prototype development
4. Chunking optimization (test strategies)
5. Retrieval tuning
6. Evaluation setup
7. Production deployment with monitoring
