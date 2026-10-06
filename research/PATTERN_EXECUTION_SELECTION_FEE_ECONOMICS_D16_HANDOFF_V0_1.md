# D01 DL-056 — D16 Execution-Selection / Fee-Economics Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes execution-selection and fee-regime semantics.
D16 owns future selection/cost/residual inference.

## Two separate estimands

1. SIGNAL / STRUCTURAL RESPONSE
2. EXECUTION QUALITY / FILL SELECTION

Do not infer one from the other.

## Opportunity denominator

All structural opportunities must retain:
- no order;
- submitted;
- rejected;
- filled;
- partial;
- cancelled;
- unfilled at study end;
- unknown.

Completed fills alone cannot define the sample.

## Fee regime

Use only local PIT receipts.

Foreign maker-taker research is a mechanism comparator, not proof of TWSE ordinary-equity maker/taker economics.

## Execution style

PASSIVE_EXECUTION_VERIFIED and AGGRESSIVE_EXECUTION_VERIFIED require real-order semantics.

Hypothetical order proxies remain proxies.

## Timing

Ex-ante fee schedule can be baseline if known/effective by predictor freeze.

Realized fill, fee, rebate, cancellation and markout are post-treatment unless already known.

## Future ladder

X0 RAW_ZONE_REJECTION
X1 DL055_QUEUE_LATENCY_HIDDEN_CONTROLLED
X2 EXECUTION_STYLE_SELECTION_CONTROLLED
X3 UNFILLED_CANCELLED_DENOMINATOR_INCLUDED
X4 EX_ANTE_FEE_REGIME_CONTROLLED
X5 REALIZED_EXECUTION_COST_SEPARATED
X6 GENERIC_EXECUTION_SELECTION_CONTROLLED
X7 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
X8 MULTI_DATE_MULTI_BROKER_OR_FEE_REGIME_REPLICATION

## Anti-double-count

Execution style, fee, queue and fill receipts are linked mechanism evidence.

effectiveIndependentEvidenceCount = 1 by default.

## Promotion boundary

No execution-cost advantage is a Pattern alpha vote by default.
No Formal ranking/gating/Top6/capital/runtime change is authorized.
Formal Core remains LOCKED.
