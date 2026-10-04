# System 1 Shadow Cohort Membership Class-B handoff

Date: 2026-10-04 Asia/Taipei
Status: OWNER_APPROVED_CLASS_B_AND_PR_454_PRODUCTION / V8_17_0_DEPLOYED / FIRST_GENUINE_SESSION_READBACK_PENDING / FORMAL_CORE_LOCKED
Mode: Codex
Model: GPT-6 Astra
Reasoning: High

## Authority

Owner explicit approval in the controlling Chat room:

> 批准 Shadow Cohort Membership Class-B 實裝。

This approval authorizes the additive research persistence / membership implementation described by:
- `SHADOW_COHORT_SEMANTICS_CLASS_B_PROPOSAL.md`
- `research/shadow_cohort_membership_spec_v0_1.json`

It does **not** authorize any Formal Core, selection-gate, ranking, capital, signal, push, order, System 2, or live-trading behavior change.

GitHub latest `main` remains the only authority. The implementation room must re-fetch latest `main` before making changes. The main observed when this checkpoint was created was:
`0b172cf53f3d750703e25086d67ad2370b0f2f32`

Do not treat that SHA as future authority.

## Objective

Implement the shared immutable Shadow Cohort research parent / membership / quality-overlay path so rejected and comparison populations can be captured with unbiased, overlapping, provenance-safe research membership semantics.

The implementation is intended to support, without changing Formal selection:
- reason-stratified rejected populations;
- `LIQUIDITY_REJECTED_CONTROL`;
- P1/P2 gate falsification;
- target/RR research;
- ATR/volatility research;
- broad-control vs residual-control estimands;
- first-failure vs independent gate-overlap separation;
- future matched prospective outcome joins.

## Required pre-read

At minimum read latest:
1. `AGENTS.md`
2. `shared-knowledge/ROOM_BOOTSTRAP.md`
3. this checkpoint
4. `SHADOW_COHORT_SEMANTICS_CLASS_B_PROPOSAL.md`
5. `research/shadow_cohort_membership_spec_v0_1.json`
6. `shared-knowledge/SYSTEM1_SELECTION_REDESIGN_GOVERNANCE_V0_1.md`
7. `shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md`
8. `RESEARCH_WORKLIST.md`
9. `LIQUIDITY_ADMISSION_RESEARCH.md`
10. `research/liquidity_gate_rejected_control_spec_v0_1.json`
11. `research/formal_gate_evidence_persistence_feasibility_v0_1.json`
12. `research/target_rr_persistence_feasibility_v0_1.json`
13. `research/volatility_atr_conditioning_observability_audit_v0_1.json`
14. current V8.16.0 zero-pick/C1 implementation and collector checkpoints
15. latest guarded runtime patch chain and relevant regression/repair/isolated-review workflows

## Frozen design intent

Keep separate:
- Formal state;
- research membership;
- quality state.

Overlapping research memberships are allowed and required where the estimand requires them.

Do not replace:
- PVE-156 complete qualified-list / cutline ownership;
- V8.16 immutable C1 receipt semantics;
- existing Formal firstFailure semantics.

The implementation must preserve the distinction between:
- `INDEPENDENT_BROAD_MARKET_CONTROL`;
- `RESIDUAL_CONTROL`.

They answer different questions and must never be silently combined.

Historical Shadow rows must not be rewritten. Quality corrections are append-only overlays.

Same identity + same semantic fingerprint may be idempotent.
Same identity + different semantic fingerprint is a provenance conflict and must not overwrite the original record.

## Formal firewall

Forbidden without a new explicit approval:
- Formal A/B changes;
- price floor changes;
- liquidity-threshold changes;
- sector/fundamental/ATR/target/RR/grade gate changes;
- comparator/ranking changes;
- Top6 or 3+3 changes;
- capital/allocation changes;
- BUY/ADD/REDUCE/SELL/STOP changes;
- 15m confirmation changes;
- push/order changes;
- System 2 changes;
- using candidate-count lift as economic success;
- UNKNOWN -> PASS/0 conversion;
- historical reconstruction presented as prospective evidence.

Formal Core remains LOCKED.

## Engineering requirements

Prefer one shared immutable research parent and additive overlays rather than separate duplicated persistence stacks for liquidity, ATR, target/RR, or each gate family.

The implementation must preserve:
- PIT / same-session provenance;
- outcome-blind sampling;
- deterministic sampling/fingerprints;
- firstFailure as descriptive metadata only;
- independent PASS/FAIL/UNKNOWN gate evidence where available;
- reason x pool denominator counts;
- overlapping membership where contract requires it;
- explicit quality states;
- idempotency and immutable conflict handling;
- readback verification;
- research-only / no-decision-impact flags;
- fail-open behavior to Formal execution.

No extra provider calls merely to populate the cohort persistence layer unless an existing approved research contract explicitly requires and budgets them; any such expansion must be separately reviewed.

## First implementation target

Start with the minimum shared persistence substrate that unlocks the already-frozen studies:

1. immutable population receipt / denominator identity;
2. candidate membership overlay with overlapping memberships;
3. append-only cohort quality overlay;
4. deterministic reason x pool sampling and exact denominator counts;
5. read-only research readback / collector support;
6. tests proving legacy Formal/Shadow behavior parity and no production decision impact.

Then wire `LIQUIDITY_REJECTED_CONTROL` as the first concrete consumer only if it can reuse the shared parent without altering Formal eligibility.

Do not implement every future ATR/target/fundamental study in the first tranche merely because they can reuse the parent.

## Validation

Before merge, require at minimum:
- guarded diff / protected-function review;
- existing V8 Regression PASS;
- V8 Repair CI PASS;
- System1 isolated offline repair review PASS;
- deterministic idempotency/conflict tests;
- overlapping-membership tests;
- broad-control vs residual-control separation tests;
- reason x pool denominator and deterministic sample tests;
- UNKNOWN preservation tests;
- legacy Shadow parity tests;
- zero provider-call delta for the persistence substrate unless explicitly justified;
- D1/storage scale checks if schema/runtime persistence is added;
- no System2 touch;
- no Formal output difference on frozen fixtures.

If runtime/D1 schema changes are required, use guarded patch chain and a version determined from latest `VERSIONING.md`; do not guess the next version number.

## Production boundary

Owner approval here authorizes implementation of the Class-B research persistence capability.

It does **not** automatically authorize production deployment of a concrete runtime PR.

If the final implementation changes the guarded runtime / D1 production schema or triggers Cloudflare deployment, present:
- exact PR;
- exact head SHA;
- CI results;
- protected-function parity;
- storage/resource risk;
- rollback path;
- runtime/version diff;

and obtain explicit owner production approval before merge/deploy unless current repository governance explicitly states that this exact approved Class-B scope includes deployment.

## Exact next action — deployment completed 2026-10-04

Owner subsequently explicitly approved: 「批准 PR #454 合併與 Production 部署」.
PR #454 is merged and V8.17.0 Production deployment plus version/configuration/research-dashboard
readback succeeded. The implementation and deployment stages are complete; do not restart them.

Canonical current checkpoint: `research/SYSTEM1_SHADOW_COHORT_MEMBERSHIP_IMPLEMENTATION_20261004.md`.
Deployment evidence: `research/system1_shadow_cohort_deployment_20261004_v0_1.json`.
Next: after the first genuine post-deployment trading session and successful normal scan,
verify the same immutable C1 generation and cohort membership/quality pagination using the
existing evidence workflow. No historical backfill, business scan for testing or fake weekend sample.

`FIRST_PROSPECTIVE_SHADOW_COHORT_READBACK=PENDING_NEXT_GENUINE_TRADING_SESSION`
Formal Core LOCKED; economicSuperiority UNKNOWN; formalOptimizationCandidate NONE.
