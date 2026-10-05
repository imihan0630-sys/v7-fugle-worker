# D03 System 2 Resonance Dedup Acceptance Oracle V0.1

Updated: 2026-10-05 Asia/Taipei  
Room: 03｜技術指標與趨勢動能研究室  
Classification: Class A research / Shadow acceptance oracle  
Tickets: SDA-001, SDA-004  
Formal Core impact: NONE / LOCKED  
Outcome access: CLOSED

## Purpose

Turn the TI-717~724 semantic bridge into deterministic acceptance criteria for the future System 2 research/shadow consumer. This artifact does not modify the System 2 runtime, lifecycle state, signal, notification or order behavior.

The oracle answers one bounded question:

> Given the current three daily resonance conditions, what must the raw-condition count and deduplicated technical-evidence count be under every possible Boolean combination?

## TI-725 — all eight entry combinations are frozen

For conditions A/B/C:
- A = price above EMA16 and EMA16 rising;
- B = EMA16 above EMA64;
- C = Impulse MACD bullish.

All three map to `PRICE_OHLC` and `RG_D03_PRICE_TREND`.

The complete truth table is:

| A | B | C | Raw lifecycle count | Deduplicated family count | Effective independent evidence count |
|---|---|---|---:|---:|---:|
| false | false | false | 0 | 0 | 0 |
| true | false | false | 1 | 1 | 1 |
| false | true | false | 1 | 1 | 1 |
| false | false | true | 1 | 1 | 1 |
| true | true | false | 2 | 1 | 1 |
| true | false | true | 2 | 1 | 1 |
| false | true | true | 2 | 1 | 1 |
| true | true | true | 3 | 1 | 1 |

The exit-side truth table is symmetric. `entryCount` and `exitCount` remain valid lifecycle fields; neither is an Alpha vote count.

## TI-726 — missing lineage fails closed without erasing the raw observation

If an active condition has no registered lineage:
- its raw Boolean observation remains observable;
- `lineageStatus=UNKNOWN`;
- `dedupedEvidenceFamilyCount=null`;
- `effectiveIndependentEvidenceCount=null`;
- the condition cannot be treated as an additional independent family;
- the runtime must not silently coerce the unknown result to 0, PASS or BAD.

This distinguishes “no active signal” from “active signal whose ancestry is unresolved.”

## TI-727 — duplicate registration and cosmetic aliases cannot inflate counts

The same `conditionId` registered twice must be normalized to one raw condition identity and one redundancy-family contribution.

An alias with a new display name but the same feature lineage, formula version and redundancy group may remain visible for explanation, but:
- it cannot increase `dedupedEvidenceFamilyCount`;
- it cannot increase `effectiveIndependentEvidenceCount`;
- it cannot reset the parameter-family experiment budget.

## TI-728 — mapping drift is a hard acceptance failure

For the current V0.1 bridge, any consumer that maps one of A/B/C outside `RG_D03_PRICE_TREND` fails acceptance unless a newer versioned D16/00 closure receipt explicitly authorizes reclassification.

Examples of invalid silent drift:
- treating EMA16-above-EMA64 as a separate long-trend family;
- treating Impulse MACD as an independent momentum family only because its name/formula differs;
- treating price-above-EMA16 and EMA16 slope as two evidence votes;
- converting semantic-basis IDs into independent evidence families.

## TI-729 — parameter drift cannot bypass the family budget

The current Impulse MACD family is:
`PF_D03_SYSTEM2_IMPULSE_MACD_34_9_HLC3_V0_1`.

Changing HLC3, SMMA34, ZLEMA34, SMA9, seeds, warm-up, source or threshold requires a new `factorVersion`, but it remains charged to the same broader D03 price-trend experiment family. A consumer that changes parameters without versioning fails acceptance.

## TI-730 — support, counterevidence and alternative explanations

Support for one-family deduplication:
- all three inputs are deterministic transforms of the same daily OHLC history;
- A and B share EMA16 directly;
- C uses a different smoother but still has no external information root;
- current runtime already states `sameFamilyIndependenceClaim=false`.

Counterhypothesis:
- C may respond to a different path feature than A/B and may improve state discrimination.

Why the counterhypothesis does not authorize a second vote:
- different response shape is not source independence;
- a sibling residual effect may overlap with residual information in A/B;
- direct sibling comparison, common support, multiplicity correction and OOS/prospective evidence are still missing.

Alternative explanations for apparent 3-of-3 success:
- broad market/sector trend;
- volatility regime;
- delayed confirmation that selects already-extended moves;
- survivorship from reviewing only completed signals;
- transaction cost and gap risk;
- repeated dates from one market episode.

## TI-731 — PIT, OOS and cost boundary

This oracle checks lineage mechanics only. It does not open outcomes or prove profitability.

Promotion-grade inference still requires:
- decision-time daily-bar finality and continuity;
- no look-ahead or repainting;
- purged OOS/prospective Shadow;
- walk-forward and date-cluster-aware evaluation;
- parameter-family multiple-testing control;
- direct trend/return, D01 structure, D02 participation, D04 volatility and D18 Regime controls where applicable;
- turnover, transaction costs, gaps, price limits, suspensions and fillability;
- raw-versus-deduplicated rank/Top6 sensitivity;
- D16 validation and 00 closure.

## TI-732 — result and routing

Companion artifacts:
- `research/d03_system2_resonance_dedup_acceptance_cases_20261005_v0_1.json`;
- `research/test_d03_system2_resonance_dedup_acceptance_v0_1.mjs`.

The deterministic oracle covers:
- all 8 Boolean entry combinations;
- symmetric exit semantics;
- duplicate condition registration;
- missing-lineage fail-closed behavior;
- redundancy-group mapping drift;
- parameter-family drift;
- exact 3-raw-to-1-family acceptance.

This is implementation-ready acceptance evidence, not implementation completion.

Current:
- D03 = 56.7%;
- D03-09 = L2 / 40%;
- D03-10 = L2 / 40%;
- raw receipt gate = 2/3;
- outcomes = CLOSED;
- `SYSTEM2_RUNTIME_DEDUP_DIAGNOSTICS = MISSING`;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

## Exact next continuation point

1. System 2 implementation owner adds the six required research/shadow lineage diagnostics while preserving the current lifecycle state machine.
2. The implementation must execute this oracle and return a machine receipt showing 3 raw conditions -> 1 `RG_D03_PRICE_TREND` family.
3. D03 reviews that receipt for mapping/parameter drift.
4. System 1 still requires equivalent diagnostics for D03-derived selection evidence.
5. D16 and 00 retain residual/multiplicity/OOS and cross-domain closure ownership.
6. Protected PR #600 path remains independently owner-gated; Bollinger and ADX maturity gates are unchanged.

