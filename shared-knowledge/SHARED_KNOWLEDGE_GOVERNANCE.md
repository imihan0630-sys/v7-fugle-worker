# Shared Knowledge Governance

Updated: 2026-09-26 Asia/Taipei
Status: CANONICAL_SHARED_KNOWLEDGE_POLICY

## Purpose

This directory is the durable shared research/knowledge layer for multiple Taiwan-equity systems in this repository.

It exists so research learned in System 1 (the existing V8 monitoring system) can be reused by System 2 (multi-strategy stock selection), and vice versa, without merging their production code or silently changing either system's formal behavior.

## Core rule

**Share validated market knowledge; keep system-specific behavior isolated.**

GitHub main is canonical. Chat memory is contextual only and is never authoritative for research completion, strategy versions, evidence maturity, or system behavior.

## Knowledge classes

### SHARED
Use for market knowledge that can be reused across systems:
- price/volume relationships;
- K-line and chart-pattern research;
- technical indicators and trend/reversal logic;
- market regime and breadth;
- institutions, ownership concentration, TDCC holder brackets, margin/SBL/crowding;
- fundamentals, valuation and information dynamics;
- industry cycles, supply/demand, capacity, inventory and pricing;
- macro/cross-market transmission;
- event/news mechanisms and event half-life;
- execution, transaction-cost, PIT/OOS/overfit methodology.

### SYSTEM1_ONLY
Use for V8 implementation/operations:
- Formal Core A/B definitions;
- Top6 / 3+3 quota behavior;
- BUY / ADD / REDUCE / SELL / STOP state machine;
- capital allocation and monitoring semantics;
- Cloudflare/3Min/push/runtime-specific behavior.

### SYSTEM2_ONLY
Use for the multi-strategy selection platform:
- strategy catalog and per-strategy weights/floors;
- factor-combination scoring;
- strategy activation by regime;
- simulated portfolio rules;
- strategy performance comparison;
- System 2 UI/API/storage contracts.

## Read order

Any research chat in System 1 or System 2 must read:
1. `shared-knowledge/SHARED_RESEARCH_MASTER_MAP.md`
2. `RESEARCH_ENGINEERING_GOVERNANCE.md`
3. the system-specific master/checkpoint
4. the dedicated research lane evidence/checkpoint

This rule replaces the need to manually re-instruct every chatroom.

## Write routing

When new research is produced:
- reusable market mechanism/evidence -> SHARED;
- V8 Formal/runtime-specific implementation -> SYSTEM1_ONLY;
- System 2 strategy/scoring/performance implementation -> SYSTEM2_ONLY.

A finding may be referenced by multiple systems without copying or rewriting the evidence.

## Evidence and maturity

Shared knowledge must preserve:
- source/provenance and observed/available timestamps when relevant;
- PIT/no-look-ahead semantics;
- positive evidence and explicit counterevidence;
- data gaps as UNKNOWN, never forced to 0/BAD;
- regime/industry/date concentration;
- transaction costs/slippage where executable;
- factor redundancy and incremental value;
- overfit/multiple-testing controls;
- exact status: DISCOVERY / FALSIFICATION_IN_PROGRESS / EVIDENCE_READY / FORMAL_OPTIMIZATION_CANDIDATE / REJECTED_OR_REDUNDANT.

No Shared finding can automatically alter System 1 Formal Core or a live System 2 strategy.

## Promotion boundary

- System 1 promotion follows `RESEARCH_ENGINEERING_GOVERNANCE.md`.
- System 2 may use research in Shadow/simulation first, but any strategy version change that affects live/real-money recommendations must be versioned and validated.
- Shared evidence is reusable evidence, not automatic permission.

## Concurrency

Before updating a shared canonical file:
1. re-read the latest SHA;
2. merge concurrent progress;
3. never overwrite newer research;
4. preserve prior rejected/negative findings.

## Principle

**One shared research brain, multiple isolated decision engines.**
