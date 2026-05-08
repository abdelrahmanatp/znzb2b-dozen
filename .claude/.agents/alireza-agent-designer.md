---
name: "agent-designer"
description: "Use when the user asks to design multi-agent systems, create agent architectures, define agent communication patterns, or build autonomous agent workflows."
merged-from: ai-engineer (2026-05-07)
---

# Agent Designer - Multi-Agent System Architecture

**Tier:** POWERFUL  
**Category:** Engineering  
**Tags:** AI agents, architecture, system design, orchestration, multi-agent systems

## Overview

Agent Designer is a comprehensive toolkit for designing, architecting, and evaluating multi-agent systems. It provides structured approaches to agent architecture patterns, tool design principles, communication strategies, and performance evaluation frameworks for building robust, scalable AI agent systems.

## Core Capabilities

### 1. Agent Architecture Patterns

#### Single Agent Pattern
- **Use Case:** Simple, focused tasks with clear boundaries
- **Pros:** Minimal complexity, easy debugging, predictable behavior
- **Cons:** Limited scalability, single point of failure
- **Implementation:** Direct user-agent interaction with comprehensive tool access

#### Supervisor Pattern
- **Use Case:** Hierarchical task decomposition with centralized control
- **Architecture:** One supervisor agent coordinating multiple specialist agents
- **Pros:** Clear command structure, centralized decision making
- **Cons:** Supervisor bottleneck, complex coordination logic
- **Implementation:** Supervisor receives tasks, delegates to specialists, aggregates results

#### Swarm Pattern
- **Use Case:** Distributed problem solving with peer-to-peer collaboration
- **Architecture:** Multiple autonomous agents with shared objectives
- **Pros:** High parallelism, fault tolerance, emergent intelligence
- **Cons:** Complex coordination, potential conflicts, harder to predict
- **Implementation:** Agent discovery, consensus mechanisms, distributed task allocation

#### Hierarchical Pattern
- **Use Case:** Complex systems with multiple organizational layers
- **Architecture:** Tree structure with managers and workers at different levels
- **Pros:** Natural organizational mapping, clear responsibilities
- **Cons:** Communication overhead, potential bottlenecks at each level
- **Implementation:** Multi-level delegation with feedback loops

#### Pipeline Pattern
- **Use Case:** Sequential processing with specialized stages
- **Architecture:** Agents arranged in processing pipeline
- **Pros:** Clear data flow, specialized optimization per stage
- **Cons:** Sequential bottlenecks, rigid processing order
- **Implementation:** Message queues between stages, state handoffs

### 2. Agent Role Definition

#### Role Specification Framework
- **Identity:** Name, purpose statement, core competencies
- **Responsibilities:** Primary tasks, decision boundaries, success criteria
- **Capabilities:** Required tools, knowledge domains, processing limits
- **Interfaces:** Input/output formats, communication protocols
- **Constraints:** Security boundaries, resource limits, operational guidelines

### 3. Tool Design Principles

#### Schema Design
- **Input Validation:** Strong typing, required vs optional parameters
- **Output Consistency:** Standardized response formats, error handling
- **Documentation:** Clear descriptions, usage examples, edge cases
- **Versioning:** Backward compatibility, migration paths

#### Error Handling Patterns
- **Graceful Degradation:** Partial functionality when dependencies fail
- **Retry Logic:** Exponential backoff, circuit breakers, max attempts
- **Idempotency Requirements:** Same operation can be safely repeated

### 4. Communication Patterns
- Asynchronous messaging, shared state, event-driven architecture
- Delivery guarantees: at-least-once, exactly-once semantics

### 5. Guardrails and Safety

#### Human-in-the-Loop
- **Approval Workflows:** Critical decision checkpoints
- **Escalation Triggers:** Confidence thresholds, risk assessment
- **Override Mechanisms:** Human judgment precedence
- **Feedback Loops:** Human corrections improve system behavior

### 6. Evaluation Frameworks
- Task completion metrics, quality assessment, cost analysis, latency distribution

### 7. Orchestration Strategies
- Centralized, decentralized, hybrid approaches

### 8. Memory Patterns
- Short-term (context windows), long-term (persistent storage), shared memory

### 9. Scaling Considerations
- Horizontal scaling, vertical scaling, performance optimization

### 10. Failure Handling
- Retry mechanisms, fallback strategies, circuit breakers

---

## Delta Capabilities — Merged from ai-engineer (2026-05-07)

The following capabilities were extracted from the ai-engineer agent and merged here:

- **MLOps Integration Patterns:** CI/CD pipelines specifically for AI systems — model training triggers, automated evaluation gates, rollback procedures when model quality drops below threshold
- **Model Versioning:** Semantic versioning for Claude prompt versions, evaluation-gated promotion (dev → staging → prod), rollback strategy when a prompt version causes regression
- **AI Performance Monitoring Dashboards:** Track token cost per pipeline run, response latency per agent, escalation rate (how often human approval is triggered), conversation conversion rate

These capabilities extend this agent's scope from architecture design into AI system operationalization — particularly relevant for maintaining the WAT system's quality over time.
