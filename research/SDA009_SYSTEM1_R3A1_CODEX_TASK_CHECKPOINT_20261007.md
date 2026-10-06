# SDA-009 System1 R3A1 Codex Task Checkpoint — 2026-10-07

Status: READY_FOR_CODEX_SYSTEM1_IMPLEMENTATION
Task: `SDA-009-R3A1`
Repository: `imihan0630-sys/v7-fugle-worker`
Observed main at handoff creation: `f6f58fe1b28c4782cde106f125013794387ee630`
Authoritative branch rule: re-read latest `main` before implementation; do not treat this SHA as future authority.

Recommended mode: Codex
Recommended model: GPT-6 Astra
Reasoning effort: High

## Objective

Implement the minimum additive research-only C1 capture required for `SDA-009` R3A1, produce deterministic/protected-output evidence, and prepare the first genuine prospective parity receipt.

Do not redesign the research semantics.

## Read first

1. `shared-knowledge/ROOM_BOOTSTRAP.md`
2. `shared-knowledge/ROOM_BOOTSTRAP_REGISTRY.json`
3. System1 current formal checkpoint / requirements
4. `research/SDA009_SYSTEM1_R3A1_MINIMAL_CAPTURE_HANDOFF_V0_5.md`
5. `research/SDA009_ROOM07_RESEARCH_COMPLETION_AND_D16_HANDOFF_20261007.md`
6. `research/sda009_r3_capture_contract_v0_5.mjs`
7. `research/sda009_r3a1_acceptance_oracle_v0_6.mjs`

## Exact implementation delta

In the effective C1 build path, capture per row:
- `currentChangePercent` from the exact normalized same-session raw row;
- `currentTradeValue` from the exact normalized same-session raw row.

At generation level capture:
- `classificationSchemeId`;
- `membershipVersion`;
- `membershipDigest`;
- `sectorDecisionStateVersion`;
- `sectorDecisionStateProjection`;
- `sectorDecisionStateDigest`.

Use the already-built production `sectorStats`.
Do not build a competing production sector calculator.

No new provider calls.

## Required protected behavior

Must remain unchanged:
- Formal gate behavior;
- A/B semantics;
- priority/ranking behavior;
- 3+3 quotas;
- capital/allocation;
- BUY/ADD/REDUCE/SELL/STOP;
- 15-minute Formal semantics;
- signal/push/order behavior;
- existing C1 parent semantics except additive research capture.

## Required evidence

- deterministic tests;
- providerCallDelta=0 proof;
- Formal protected-output comparison;
- C1 population/readback integrity;
- membership-digest mutation tests;
- sector-decision-digest mutation tests;
- unclassified pseudo-bucket visibility;
- no legacy backfill;
- effective comparator identity retained.

## First genuine prospective acceptance

After deployment/approved evidence path produces a new valid C1 generation, run:
`research/sda009_r3a1_acceptance_oracle_v0_6.mjs`.

Required:
- `state=PASS`;
- `authorization.r3a1ParityPass=true`.

If blocked, return the exact blocker. Do not weaken parity rules.

## Approval boundary

Research semantics are frozen.

This task authorizes implementation/testing of the additive research diagnostic only within existing System1 governance.

It does NOT independently authorize:
- Formal Core behavior changes;
- new trading behavior;
- capital/risk changes;
- production deployment if current System1 governance requires separate owner approval;
- SDA-009 closure.

## Return contract

Return:
- files changed;
- implementation class under current governance;
- tests/checks;
- protected-output parity;
- whether merge/deploy approval is required;
- first genuine receipt if available;
- exact blocker if no genuine receipt;
- exact next action.

## Exact next after R3A1 PASS

Proceed to `SDA-009-R3A2`:
capture same-generation market consensus input for all feature-admitted rows and emit the two separately labeled counterfactuals:
- `SDA009_FOCAL_SELF_ATTRIBUTION_V0_1`;
- `SDA009_FULL_SELF_EXCLUDED_POLICY_V0_1`.

Then return the genuine receipt to Room07 and D16.
