# Hybrid Selection Execution Directive V0.1

Updated: 2026-10-03 11:46 Asia/Taipei
Status: OWNER_APPROVED / EXECUTION_ACTIVE / SHADOW_FIRST / FORMAL_CORE_LOCKED
Owner room: 00｜研究總控室（governance only）
Scope: System 1 + System 2 selection-decision architecture

## Decision

Adopt Hybrid（混合式）decision architecture as the canonical forward design:

1. HARD_INVALIDATION（硬否決）
2. PRIMARY_ALPHA（主要 Alpha）
3. SUPPORTIVE（輔助證據）
4. CONTEXT_ONLY（情境資訊）
5. CONFIDENCE／UNCERTAINTY（可信度／不確定性）

New knowledge defaults to RESEARCH_ONLY. UNKNOWN != FAIL and UNKNOWN != 0.

The objective is **Opportunity Capture Efficiency（有效機會捕捉效率） under bounded risk**, not maximum pick count and not maximum gate count.

## Authority boundary

- Research-only isolated Class A implementation: APPROVED.
- Shared-runtime / indirect production-risk Class B: proposal + owner approval required before merge/deploy.
- Formal selection/ranking/capital/entry/exit/monitoring Class C: LOCKED until prospective evidence packet + explicit owner approval.
- 00｜研究總控室 owns governance, routing, acceptance and progress audit only. Engineering occurs in the dedicated System 1 / System 2 execution rooms.

## Track A — System 1 Hybrid Shadow Challenger

### A0 — Immutable baseline
Freeze/read back current Formal gate definitions, A/B setup, ranking, quotas, entry/fill and allocation semantics from latest main and actual Production.

### A1 — Full gate-overlap observer
For every eligible symbol/date:
- evaluate every current gate independently as PASS / FAIL / UNKNOWN;
- retain firstFailureReason separately;
- preserve full denominators, not bounded top-N rejected samples;
- record exact data vintage / first-known provenance.

### A2 — Gate role inventory
Assign every current gate to one of the five Hybrid roles with rationale and dependencies.
No existing hard gate is automatically preserved; no gate is softened merely to increase picks.

### A3 — Zero-pick decomposition
Separate:
- genuine no-opportunity,
- optional/supportive gate rejection,
- source/UNKNOWN failure,
- setup-not-ready,
- entry wait/no-fill,
- sizing/capital reserve.

### A4 — Hybrid Challenger
Run production baseline and isolated Challenger on matched dates/universe/source snapshots.
Initial experiments may reclassify only preregistered optional gates; source/PIT/tradability/event/risk safeguards stay hard.

### A5 — Evaluation
At minimum report:
- after-cost return,
- candidate / trigger / fill funnels,
- opportunity capture and missed opportunities,
- false acceptance and stop-first,
- zero-pick causes,
- MFE / MAE,
- drawdown / tail risk,
- capital utilization,
- turnover / fill feasibility,
- Regime and strategy attribution.

No Formal change from higher pick count alone.

## Track B — System 2 Hybrid Contract

### B0 — Freeze strategy identities
Do not make all strategies share one universal evidence checklist.

### B1 — Machine-readable role map
For every strategy input freeze:
- evidence family,
- role,
- source ID,
- readyAt / firstKnownAt semantics,
- missingness handling,
- horizon,
- expected direction or interpretation,
- redundancy family.

### B2 — Strategy-specific primary evidence
SHORT_MOMENTUM prioritizes technical/price-volume/flow/regime mechanisms.
SWING_GROWTH prioritizes industry/fundamental/expectation/catalyst mechanisms.
Other strategies must define their own PRIMARY_ALPHA families rather than inherit all 22 domains.

### B3 — Uncertainty channel
Maintain confidence separately from alpha:
- stale/missing/disagreeing supportive evidence widens uncertainty;
- UNKNOWN does not silently become zero, neutral or fail;
- ABSTAIN（不交易） is valid.

### B4 — Probability / EV research
Where evidence permits, evaluate calibrated probability and expected value against simpler rank/score baselines. Bayesian Updating（貝氏更新） is optional and must prove incremental value.

### B5 — Final-selection owner gate
No general final-selection activation until preregistered policy, PIT inputs, prospective Shadow, costs, calibration, risk and rollback evidence are ready.

## Cross-system acceptance gates

A Hybrid candidate is eligible for formal owner review only if:
1. same-date matched baseline exists;
2. PIT / provenance / replay passes;
3. independent prospective Shadow or OOS evidence exists;
4. after-cost value improves or opportunity capture improves without unacceptable risk deterioration;
5. false acceptance is controlled;
6. zero-pick/source failures are separately measured;
7. calibration/uncertainty is meaningful where probabilities are used;
8. redundant evidence is not double counted;
9. relevant Regimes are represented;
10. rollback is explicit.

## Current execution state

- Shared Hybrid governance: APPROVED.
- System 1 Hybrid Shadow engineering: AUTHORIZED Class A, not yet evidence-proven.
- System 2 Hybrid strategy-contract engineering: AUTHORIZED research/design Class A, final-selection authority remains disabled.
- System 1 Production Formal: unchanged.
- System 2 general live/final selection: unchanged / owner-gated.

## Curriculum role eligibility overlay — 2026-10-03

Canonical curriculum-level role eligibility:
`shared-knowledge/HYBRID_ROLE_ELIGIBILITY_AUDIT_20261003_V0_1.md`

Machine-readable overlay:
`shared-knowledge/hybrid_role_eligibility_audit_20261003_v0_1.json`

Execution registry:
`shared-knowledge/HYBRID_ROLE_EXECUTION_REGISTRY_20261003_V0_1.md`

This overlay constrains role claims but does not assign live strategy roles.

System 1 A2 must map actual current gates against the overlay.
System 2 B1 may consume the overlay when building strategy-specific role maps.
No universal 354-module vote/score is permitted.
Formal Core remains unchanged.

## System1 A2 role inventory completion — 2026-10-03

A2 governance inventory:
`shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md`

System1 current fail-fast gates are now separated conceptually into:
- true safety / owner-policy hard constraints;
- confidence / missing-data states;
- strategy-specific PRIMARY_ALPHA;
- supportive/context evidence.

Important: this is role classification only. It does not soften any production gate. Prospective matched-date evidence remains mandatory before any Class-C proposal.

## System1 S1-S2 causal Shadow contracts — 2026-10-03

System1 low-BUY investigation now uses:
- full blocking sets instead of firstFailure attribution;
- minimal-unblock classes;
- reach funnel through A/B -> RR -> Grade -> Rankable;
- symbol + date-cluster outcome reporting;
- explicit missingness-confounding controls;
- four-state TARGET semantics.

Canonical registry:
`shared-knowledge/SYSTEM1_S1_S2_SHADOW_EXECUTION_REGISTRY_20261003_V0_1.md`

UNKNOWN remains UNKNOWN. Candidate-count expansion is not success. Formal Core remains locked.

