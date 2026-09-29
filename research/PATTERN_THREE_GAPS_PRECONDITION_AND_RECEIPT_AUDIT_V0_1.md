# Pattern Three-Gaps Precondition and Receipt Audit V0.1

Updated: 2026-09-28 Asia/Taipei
Status: DETECTOR-FREE PRECONDITION EXECUTABLE / RUNTIME NO-GO
Classification: Class A isolated research QA
Formal Core impact: NONE

## Research question

Can the Pattern lane safely prepare Three Gaps research without prematurely implementing a named detector, inventing historical Shadow observations, or changing Formal behavior? The narrow answer is yes only for a fail-closed precondition validator. The detector, gap count and directional interpretation remain unauthorized and unimplemented.

The validator asks whether one proposed adjacent bar pair has immutable raw provenance, explicit OPEN, a matching TECHNICAL_CONTINUITY version, complete corporate-action coverage with point-in-time clocks, an official market calendar and auditable symbol/date membership. Availability and `knownAt` gates use timezone-bearing timestamps, not date-only approximations. It returns readiness only. It never calculates the size or sign of a gap.

## Canonical History Source receipt audit

V8.12.0 persists `HISTORY_PRESENCE_V1` by market and market date after receiving a complete official full-market daily-bar response. Its semantics are `RAW_OFFICIAL_BAR_PRESENCE_BEFORE_FORMAL_FILTERS`. If a symbol appears in `tradedSymbols`, the receipt supports `OFFICIAL_TRADED_BAR_PRESENT`. If the symbol does not appear, it supports only `NO_OFFICIAL_TRADED_BAR` for that response.

The negative finding is decisive: absence from `tradedSymbols` does not identify why the symbol had no official daily bar. The same observation can be compatible with a verified suspension, a listing boundary, delisting, an eligible but zero-trade day, a special mechanism, or another symbol-specific condition. Therefore the receipt cannot be relabeled as `VERIFIED_SYMBOL_SUSPENSION`, cannot prove `VERIFIED_SYMBOL_NOT_ELIGIBLE`, and cannot by itself establish consecutive eligible symbol sessions.

This is not a reason to fork session logic. Pattern reuses the receipt exactly as a parent presence/absence observation. A missing provider bar when the receipt says the symbol traded is `MISSING_OFFICIAL_TRADED_BAR`. A missing provider bar when the receipt says the symbol did not trade is not fabricated as a candle; its reason remains unknown. A missing or incomplete receipt remains `UNKNOWN`.

## Two non-equivalent adjacency contracts

`OBSERVED_TRADE_ADJACENCY` means consecutive observed official traded bars. When every intervening open-market date has a complete full-market receipt and the symbol is absent, the pair can be measurement-ready, but the result is explicitly `READY_WITH_UNKNOWN_NO_TRADE_REASON`. This does not claim that intervening dates were suspensions or ineligible sessions.

`ELIGIBLE_SYMBOL_SESSION_ADJACENCY` is stricter. The same no-bar receipt is insufficient because it does not classify eligibility. Each intervening date needs an independent official symbol-session status proving non-eligibility. Without that evidence the validator returns `DATA_BLOCKED`. This prevents denominator drift: the observed-trade sequence and the eligible-session sequence are different empirical objects and may not be silently substituted for one another.

## Corporate-action and price-space gate

A raw `adjusted=false` request is not proof that the returned payload is immutable raw execution space. Both request and response modes must be recorded and verified. Each raw bar must link to the same receipt and source-history hash; each continuity bar must link to its raw bar and one exact TECHNICAL_CONTINUITY receipt/version.

Corporate-action coverage cannot be inferred from an empty event array. A complete registry coverage receipt is required for the pair window. An event effective inside the pair must have `knownAt <= asOfDate`, a verified mechanical factor, proof that the transform was applied, and proof that residual market movement was preserved. A future-known action applied to an earlier snapshot is a provenance conflict. An unapplied future action is ignored so prefix replay remains invariant.

## Executable falsification cases

Fourteen cases are frozen in `test_pattern_three_gaps_precondition_v0_1.mjs`: ordinary readiness; missing OPEN; adjusted-response conflict; continuity lineage/version conflict; observed-trade adjacency across a no-bar date; rejection of that same evidence for eligible-session adjacency; independent official non-eligibility evidence; traded-bar/session contradiction; resolved ex-right transform; future-known action leakage; incomplete action-registry coverage; prefix replay; missing official traded bar; and incomplete full-market presence evidence.

The important counterexample is not merely an error case. The exact same canonical receipt permits the observed-trade adjacency statement while blocking the eligible-session adjacency statement. This shows why a single Boolean `sessionVerified` field would erase material uncertainty.

## Bias, redundancy and non-promotion

The validator reduces survivorship and denominator ambiguity but creates no alpha evidence. It does not address selection bias, date clustering, regime dependence, transaction costs, multiple testing or redundancy versus overnight return, volatility, price limits, round-number proximity, price-volume and corporate-action controls. Those remain mandatory if clean prospective outcomes ever become available.

No historical outcomes were inspected, no missing bars were backfilled, no named-family threshold was tuned, and no Three Gaps direction was assigned. The executable contract is complementary to canonical source admission and TECHNICAL_CONTINUITY; it is not a replacement for either. Runtime OPEN retention, immutable raw response proof, complete security-specific session status and continuity persistence remain unresolved Class B dependencies.

## Decision and exact continuation

The detector-free precondition layer is accepted as isolated Class A research QA. Three Gaps detector implementation remains `NO_GO`; D01 maturity is unchanged, R09 is not opened, and no Formal optimization candidate exists.

Next, freeze this contract. Do not add a detector or tune thresholds. Audit real prospective parent receipts only after immutable raw OPEN, TECHNICAL_CONTINUITY, corporate-action clocks, official calendars and symbol-session evidence exist together. Until then, preserve `UNKNOWN`, keep both adjacency modes separate, and keep any shared-runtime retention or persistence change proposal-first under Class B governance.
