# D03 ADX / Bollinger L3 Blocker Audit V0.1

Updated: 2026-10-03 Asia/Taipei  
Lane: D03-09 ADX / D03-10 Bollinger Bands  
Classification: Class A（研究專用）  
Formal Core impact: NONE / LOCKED

## Purpose

After D03 reached 55.0%, this audit tests whether either remaining low-maturity indicator module can honestly advance from L2 to L3 under the canonical curriculum definition:

L3 = TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED.

Conclusion:

- D03-09 ADX remains L2/40.
- D03-10 Bollinger remains L2/40.
- D03 aggregate remains 55.0%.

The blockers are data-lineage/runtime provenance blockers, not missing indicator formulas.

## TI-526 — formula maturity and PIT data maturity are separate

Both ADX14 and Bollinger20x2 now have frozen research formula semantics and adversarial QA.

ADX:
- WILDER_ADX14_TALIB_STYLE_NO_ROUNDING_V0_1;
- +DM/-DM/TR/DX/ADX initialization semantics;
- directionless trend-strength interpretation;
- replay/state-lineage fields specified.

Bollinger:
- BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1;
- population standard deviation baseline;
- SMA20 / upper / lower / BBW / %B semantics;
- finite-window edge cases frozen.

Therefore both materially satisfy isolated formula/mechanism readiness.

But R0 formula readiness is not R1 PIT source readiness.

## TI-527 — ADX has a recursive-state blocker, not a raw-history-length blocker

Repository capability already includes:
- deeper historical fetch capability;
- history-cache targets beyond the ordinary 65-bar feature window;
- formula contracts and canonical state-lineage design.

This does NOT make ADX L3.

ADX is a cascaded recursive indicator:
TR/+DM/-DM smoothing -> +DI/-DI -> DX -> ADX smoothing.

Its promotion-grade state requires:
- canonical TECHNICAL_CONTINUITY history;
- formulaVersion;
- stateLineageId;
- canonical replay or trusted prior state;
- replay certification;
- exact source-history / transform hashes;
- immutable parent/capture generation.

The observer-state contract explicitly states:
CACHE_STATE != SOURCE_OF_TRUTH.

The current shared runtime status still states TECHNICAL_CONTINUITY production/runtime availability is BLOCKED.

Therefore:
`DEEP_HISTORY_AVAILABLE != ADX_PIT_REPLAY_VALIDATED`.

A local 150/200-bar reconstruction today cannot be relabeled as what the system knew at an earlier parent decision.

## TI-528 — arbitrary warm-up cannot repair recursive lineage

Earlier deterministic evidence showed:
- full-history ADX14 ≈ 16.076280;
- 65-bar local reconstruction ≈ 16.905634;
- 150-bar reconstruction ≈ 16.076396.

This proves seed sensitivity and suggests deeper history reduces one example's discrepancy.

It does NOT establish:
- 150 as a universal safe threshold;
- canonical corporate-action replay;
- source-version equivalence;
- prior-state equivalence across corrections.

If an old corporate-action transform or source row changes, recursive state must be replayed from a trusted anchor.

Waiting N bars is not a provenance repair.

Thus:
`ADX_WARMUP_BARS_AS_UNIVERSAL_CERTIFICATION = REJECTED`.

## TI-529 — ADX L3 exact missing evidence

D03-09 can move to L3 only when an outcome-blind Taiwan parent sample demonstrates:

1. exact immutable parent identity;
2. continuityReceiptId valid;
3. canonical H/L/C history under the parent cutoff;
4. formulaVersion fixed;
5. stateLineageId fixed;
6. FULL_REPLAY or TRUSTED_PRIOR_STATE certification;
7. replay-exact readback;
8. constrained/price-limit provenance;
9. every expected parent accounted VALID/BLOCKED/UNKNOWN.

No return outcome is needed for L3.

Current blocker:
`R1_SOURCE_READY = BLOCKED`.

Hence:
`D03_09_ADX = L2_REMAINS`.

## TI-530 — Bollinger is easier than ADX but still not L3 today

Bollinger20x2 is finite-window.

For a valid as-of parent it needs:
- exact 20 eligible-session continuity-corrected closes;
- formulaVersion / stdDefinition;
- symbol-session provenance;
- constrained/price-limit state;
- immutable parent identity.

Unlike ADX:
- no recursive seed persists once the exact clean 20-bar window is known;
- an old contaminated observation ceases direct influence after it leaves the certified 20 eligible-session window.

This materially lowers the state-construction burden.

But current observer readiness still says:
- runtime TECHNICAL_CONTINUITY absent/blocked;
- exact prospective parent lineage not armed;
- price-limit/constraint provenance remains required.

Therefore raw 20-bar availability is insufficient.

`FINITE_WINDOW_EASIER != SOURCE_PROVENANCE_COMPLETE`.

## TI-531 — Bollinger L3 exact missing evidence

D03-10 can advance to L3 on the first promotion-grade outcome-blind prospective parent capture that proves:

1. immutable parent/capture generation;
2. exact 20 eligible symbol-session closes;
3. valid TECHNICAL_CONTINUITY receipt;
4. formulaVersion = BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1;
5. stdDefinition = POPULATION;
6. price-limit / special-session provenance;
7. prefix/replay exactness;
8. complete expected-parent attempt accounting.

Because Bollinger is finite-window, no recursive state cache is required.

But until those receipts physically exist:
`D03_10_BOLLINGER = L2_REMAINS`.

## TI-532 — apparent numerical observability must not be confused with inference readiness

A current number can be calculated from raw OHLC and still fail promotion-grade PIT semantics.

Examples:
- BBW from 20 raw closes with an unresolved split boundary;
- ADX from 200 current-history bars whose transformed lineage was unavailable at the historical decision;
- valid numeric +DI/-DI/ADX on a price-limit constrained path with latent pressure censored;
- %B on a valid finite window attached to an unfrozen parent generation.

These are numerical observations, not certified research evidence.

Frozen hierarchy:
R0 FORMULA_QA_READY
-> R1 SOURCE_READY
-> R2 PROSPECTIVE_COVERAGE_READY
-> R3 DESCRIPTIVE_READY
-> R4 OUTCOME_JOIN_READY
-> R5 INCREMENTAL_INFERENCE_READY.

D03 L3 requires the source/PIT feasibility layer, not merely R0.

## TI-533 — no maturity inflation from “blocker clarified”

This tranche improves continuation precision but does not change module maturity.

D03-09:
- remains L2/40.

D03-10:
- remains L2/40.

D03:
- remains 55.0%.

No Formal optimization candidate.

## Exact next continuation

1. Do not add D03-specific provider pulls for ADX/Bollinger.
2. Wait for the shared TECHNICAL_CONTINUITY + immutable parent observer path.
3. When that path is available, Bollinger finite-window L3 can likely be tested first because its certification only requires an exact clean 20-session window.
4. ADX L3 additionally requires canonical recursive state replay / trusted prior state certification.
5. Preserve TI-005 KD-vs-RSI then TI-006 MACD-vs-direct-trend as the first efficacy queue after raw source gate completion.
6. D03-05, D03-09 and D03-10 are now the principal remaining L2 modules; each is blocked for a different reason and none should be promoted from theory alone.

Status:
`D03_09 = L2_R1_SOURCE_BLOCKED`
`D03_10 = L2_R1_SOURCE_BLOCKED`
`BOLLINGER_FINITE_WINDOW_CERTIFICATION = SIMPLER_THAN_ADX_BUT_NOT_YET_PHYSICAL`
`ADX_RECURSIVE_LINEAGE = CANONICAL_REPLAY_REQUIRED`
`D03_MATURITY = 55.0_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`
