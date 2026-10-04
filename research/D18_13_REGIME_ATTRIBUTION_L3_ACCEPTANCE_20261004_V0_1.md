# D18-13 Regime Performance Attribution L3 Acceptance — 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System 2 policy impact: NONE

## Scope

This packet evaluates D18-13 Regime Performance Attribution only.

L3 is accepted because an executable research-only joiner now binds:
1. the frozen strategy decision;
2. the frozen PIT-safe D18 observable regime vector;
3. the later outcome snapshot.

The join is immutable, replayable and maturity-aware.

This is attribution feasibility only.
It does NOT establish regime-policy value or authorize switching.

## Executable implementation

Implementation:
`system2/runtime/d18_regime_attribution_v0_1.mjs`

Test:
`system2/tests/d18_regime_attribution_v0_1.test.mjs`

## Identity contract

The attribution receipt freezes:
- decisionId;
- decisionHash;
- symbol;
- marketDate;
- decisionTimestamp;
- strategyId;
- strategyVersion;
- candidateState;
- regimeVectorHash/version;
- outcomeHash;
- outcomeUpdatedAt;
- requested horizon;
- requested cost-scenario id;
- complete regime-dimension state snapshot.

The join is rejected when decision/outcome/regime identity clocks do not match.

## Outcome maturity semantics

Requested horizons are limited to D1/D3/D5/D10/D20.

MATURED:
- requested horizon is present in outcome.maturedHorizons;
- stock horizon return exists;
- performanceEligible=true;
- requested cost scenario, when requested, exists.

IMMATURE:
- the outcome object exists, but the requested horizon has not matured.

UNKNOWN:
- performanceEligible=false;
- corporate-action state prevents performance use;
- requested cost scenario is missing/incomplete.

IMMATURE and UNKNOWN are never converted to 0 return or BAD performance.

## Return semantic firewall

The receipt preserves separately:
- stock horizon return;
- benchmark return;
- industry return;
- relative benchmark return;
- relative industry return;
- MFE / MAE;
- selected cost-scenario signal return;
- simulated execution return, only when the outcome snapshot actually contains it.

A cost-adjusted signal return remains:
SIGNAL_RETURN_MINUS_COST_SCENARIO_NOT_REALIZED_FILL_RETURN.

It is not relabeled realized strategy P&L.

## Regime semantic firewall

Only dimensions with state=KNOWN and discrete non-null values enter discreteRegimeLabels.

CONTEXT_RAW dimensions remain raw context.
UNKNOWN dimensions remain explicitly enumerated.

Therefore:
- unresolved U2B breadth cannot become a discrete breadth label;
- unresolved size/global inputs cannot be imputed;
- attribution groups cannot silently mix raw and discrete regime semantics.

## PIT / replay gates

Required:
- frozen decisionHash;
- D18 vectorVersion exact match;
- regimeVector.pointInTimeEligible=true;
- regime marketDate and decisionTimestamp equal decision identity;
- outcome decisionId/symbol/marketDate/decisionTimestamp equal decision identity;
- outcomeHash exists;
- outcomeUpdatedAt >= decisionTimestamp;
- attribution observedAt >= outcomeUpdatedAt.

Verified:
- same inputs -> same attribution receiptHash;
- wrong decisionId -> reject;
- regime clock mismatch -> reject;
- non-PIT regime vector -> reject;
- not-yet-mature horizon -> IMMATURE;
- non-performance-eligible outcome -> UNKNOWN;
- missing cost scenario -> UNKNOWN.

## Attribution vs policy

Frozen output flags:
- attributionOnly=true;
- policyValueEvaluated=false;
- switchingRuleApplied=false;
- dynamicWeightApplied=false;
- rankingImpact=false;
- selectionImpact=false;
- capitalImpact=false.

A conditional-return difference is descriptive attribution.
It cannot justify activation, deactivation or dynamic weighting.

## L3 promotion-gate review

Per `research/D16_D18_PROMOTION_GATE_V0_1.md`:

1. executable/tested builder: PASS.
2. source/version/availableAt provenance: PASS through immutable decision/regime/outcome identities.
3. replay test: PASS.
4. UNKNOWN fail-closed: PASS.
5. no historical backfill: PASS; outcome joins only after maturity.
6. source coverage audited: PASS via upstream Prediction/Outcome/Regime contracts; unavailable dimensions remain explicit.

## Why not L4

No prospective/OOS attribution conclusion is claimed.

L4 still requires:
- accumulated frozen attribution receipts over multiple decision dates;
- more than one relevant regime episode;
- independent-date reporting;
- regime occupancy;
- complete outcome joins;
- identical cost treatment;
- no single date/episode domination;
- untouched OOS/prospective evidence.

D18-13 therefore stops at L3.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## Exact next

1. Persist prospective attribution receipts after outcomes mature.
2. Report unconditional and conditional performance from the same frozen strategy population.
3. Count independent dates/episodes, not stock rows only.
4. Keep attribution separate from D18-08/09 policy research.
5. D18-14 needs a dedicated date-level chronological walk-forward assembler using these frozen attribution receipts before L3.
