# Stock Selection Shadow Launch Gate V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CANONICAL_SELECTION_LAUNCH_GOVERNANCE
Owner: 00｜研究總控室
Formal Core impact: NONE
Purpose: define the shortest safe path from current research/audit state to usable System 1 stock-selection Shadow evidence without requiring all D01-D22 or all SDA tickets to close.

## Core principle

The system does NOT need all 21 SDA tickets CLOSED before Selection Shadow begins.

It DOES need the launch-critical information-lineage, circularity and validation infrastructure to be sufficiently observable and fail-closed before Shadow results are interpreted as evidence.

Selection Shadow, Promotion Review and Trading Shadow are separate gates.

## Gate S0 — Research / audit foundation

State: PASS

Required:
- D01/D02/D03 same-root risk identified;
- D03 alias/parameter-family semantics frozen;
- D09 leave-one-out circularity semantics frozen;
- D16 repeated-OOS/holdout-consumption contract frozen;
- D18 ex-ante Regime governance frozen;
- canonical SDA queue and independent 00 closure authority exist.

Current evidence:
- SDA-001/004 research controls + System1 PR #608 core diagnostics;
- SDA-009 Room07 leave-one-out contract;
- SDA-016 Room11 V0.2 oracle T01-T30;
- SDA-017 Room11 V0.2 oracle T01-T40.

S0 does not prove Alpha and authorizes no Formal mutation.

## Gate S1 — Selection Shadow instrumentation ready

State: PARTIAL / NOT YET PASS

Purpose:
System 1 can emit complete research-only selection diagnostics on genuine same-generation inputs while Formal selection remains unchanged.

Blocking requirements:
1. SDA-001/004 System1 diagnostic schema is complete:
   - explicit redundancyGroupContributions;
   - explicit dominantInformationRoots;
   - stable overlap identity by factorId + factorVersion.
2. SDA-009 System1 diagnostic exists:
   - candidateSelfContribution;
   - inclusive vs leave-one-out sector state;
   - gateFlip;
   - rankDelta;
   - raw vs leave-one-out Top6 sensitivity;
   - membershipVersion/classificationSchemeId;
   - UNKNOWN fail-closed behavior.
3. diagnostic input binds a verified genuine same-generation parent receipt / generationId / source receipt.
4. incomplete lineage blocks aggregate Shadow interpretation instead of silently dropping rows.
5. research outputs remain decisionImpact=false and do not alter Formal ranking/Top6.

Already satisfied:
- System1 PR #608 core lineage/dedup engine is merged;
- alias/parameter-family core guard is merged;
- D09 semantic contract is frozen.

S1 PASS means:
Shadow diagnostics may run prospectively.
It does NOT mean deduplicated or leave-one-out results may replace Formal selection.

## Gate S2 — Prospective selection comparison ready

State: NOT_READY / WAITING_GENUINE_RECEIPTS

Purpose:
Compare current Formal selection against research-only alternatives on genuine prospective decision-time data.

Required:
1. first genuine System1 SDA receipt under S1-complete schema;
2. first genuine D09 inclusive-vs-leave-one-out receipt;
3. pre-outcome experiment registration under SDA-016;
4. frozen target / horizon / benchmark / cost treatment before result inspection;
5. exact common support:
   same decision dates, same eligible candidate population and explicit UNKNOWN/missing rows;
6. no historical lineage backfill from today's enriched data;
7. repeated holdout inspection is recorded as development consumption;
8. negative/null/no-selection dates stay in the evidence set.

Useful but not mandatory for the first S2 receipt:
- clean D02 H001 price-volume receipt;
- D04 volatility-context prospective receipt;
- D06 institutional/passive primitive lineage receipt.

Those lanes add challenger/context evidence as they become clean; their absence must remain visible rather than silently imputed.

S2 PASS means:
we have a legitimate prospective comparison dataset.
It still does NOT authorize Formal optimization.

## Gate S3 — Promotion Review eligible

State: NOT_READY

Purpose:
Decide whether any Shadow alternative has enough evidence to ask the owner for a Formal change.

Required for a candidate change:
- D16 common-support residual incrementality;
- OOS / prospective / Shadow evidence with holdout-consumption accounting;
- multiple-testing family accounting;
- date/event/regime dependence handling;
- missingness/admission/maturity coverage reporting;
- net-cost interpretation where the proposed change affects tradable selections;
- no same-root evidence inflation;
- no candidate-self-contribution circularity;
- no hidden target/benchmark/horizon mutation;
- clear baseline vs challenger definition;
- positive and negative cases preserved.

For Regime-conditioned promotion:
- SDA-017 V0.2 support/episode/fit-clock gates must additionally pass;
- regime construction must be decision-time frozen;
- unsupported states remain UNKNOWN/ABSTAIN;
- genuine prospective multi-episode evidence is required.

S3 PASS creates only:
FORMAL_OPTIMIZATION_CANDIDATE = ELIGIBLE_FOR_OWNER_REVIEW

It does NOT implement a Formal change.

## Gate S4 — Formal selection change

State: OWNER_APPROVAL_REQUIRED

Requirements:
1. explicit owner approval for the named change;
2. Class B/C classification under repository governance;
3. exact protected-output impact statement;
4. deterministic tests / regression / rollback;
5. deployment/readback evidence if Production is changed;
6. post-change prospective monitoring.

No generic "繼續" authorizes S4.

## Trading Shadow gate T1 — separate from Selection Shadow

State: NOT_READY FOR PROMOTION CLAIMS

Selection quality does not prove execution/trading quality.

Before a research selection is interpreted as trade-ready, at minimum:
- SDA-006: liquidity/capacity provenance distinguishes displayed quote/depth from own executable fillability;
- SDA-014: prospective fill/unfilled/cancel/reject opportunity accounting exists;
- SDA-015: pre-trade risk input / portfolio decision versioning separates selection from sizing;
- costs, fills and actual lifecycle remain explicit;
- account-specific execution constraints are not inferred from research quotes.

T1 may lag S1/S2.
This must not delay pure Selection Shadow diagnostics.

## Current launch bottleneck order

Highest-value shortest-path work:
1. System1 complete SDA-001/004 three schema deltas.
2. System1 implement SDA-009 leave-one-out diagnostic.
3. Produce first genuine same-generation S1 Shadow receipt.
4. Register that prospective comparison under SDA-016 before opening outcomes.
5. Accumulate S2 prospective comparison dates.
6. D16 evaluate residual incrementality / multiplicity / dependence.
7. Only then prepare any S3 owner-review candidate.

Parallel but non-blocking to first Selection Shadow:
- D02 PVE-245 cleanup;
- D06 SDA-007 primitive lineage;
- D04 prospective volatility evidence;
- D20/D19 challenger evidence;
- D12/D13 macro/derivatives challenger evidence.

System2 SDA-017 remains important for future Regime-conditioned policy, but lack of a completed Regime engine must not be misrepresented as preventing a plain System1 Selection Shadow that does not use Regime to alter Formal decisions.

## Anti-shortcut rules

Forbidden shortcuts:
- waiting for 100% curriculum maturity before any Shadow;
- treating maturity percentage as launch evidence;
- using synthetic fixtures as genuine market evidence;
- retroactively repairing historical lineage and calling it prospective;
- letting incomplete rows disappear from common support;
- promoting dedupedShadowScore merely because it differs from rawScore;
- using one good date as OOS validation;
- using D18 Regime labels after outcomes to explain winners;
- using execution backtests to hide selection weakness or selection results to infer fillability.

## Current verdict

Research foundation S0 = PASS.
Selection Shadow instrumentation S1 = PARTIAL.
Prospective comparison S2 = NOT_READY.
Promotion review S3 = NOT_READY.
Formal mutation S4 = OWNER_APPROVAL_REQUIRED.
Trading Shadow promotion gate T1 = NOT_READY.

This verdict is a governance snapshot and must be recomputed from latest main whenever the relevant SDA engineering/evidence changes.
