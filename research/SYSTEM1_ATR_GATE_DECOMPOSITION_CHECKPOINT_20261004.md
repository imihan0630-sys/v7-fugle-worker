# System 1 ATR gate decomposition audit V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / DAILY_COLLECTOR_WIRED / CI_PENDING / FORMAL_CORE_LOCKED

## Purpose

Split the current Formal ATR_QUALITY rejection into two economically distinct observed states over the complete immutable V8.17+ C1 population:

- LOW_ATR_FAIL: atrPercent < 1;
- PASS: 1 <= atrPercent <= 10;
- HIGH_ATR_FAIL: atrPercent > 10;
- UNKNOWN: missing/non-finite ATR input.

The current Formal path collapses both tails into one rejection reason. This audit preserves the existing thresholds but prevents low-volatility and high-volatility mechanisms from being mixed in future scarcity and outcome analysis.

## Existing authority reused

- `research/formal_gate_overlap_observer_v0_1.mjs`
- `research/volatility_atr_conditioning_observability_audit_v0_1.json`
- `VOLATILITY_REGIME_RESEARCH.md`
- `shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md`
- `research/SYSTEM1_SHADOW_COHORT_MEMBERSHIP_IMPLEMENTATION_20261004.md`
- `research/SYSTEM1_FIRST_FAILURE_MASKING_CHECKPOINT_20261004.md`

The earlier ATR observability audit was blocked on promotion-grade immutable parentage. V8.17 resolves that parent/denominator blocker prospectively. Historical pre-capture rows remain non-PIT for this purpose.

## Implementation

Pure Class-A analyzer:

`research/system1_atr_gate_decomposition_audit_v0_1.mjs`

Inputs:
- immutable adapted C1 rows;
- same-generation gate-overlap diagnosis;
- optional same-date firstFailure masking evidence.

No ATR gate, stop formula, RR formula, ranking or trade rule is changed.

## Observer parity

The analyzer independently classifies the stored `feature.atrPercent` and checks parity with the existing frozen `ATR_QUALITY` observer:

- missing -> UNKNOWN;
- [1,10] -> PASS;
- below 1 or above 10 -> FAIL.

Any disagreement increments:

`observerParityMismatchN`

and sets:

`evidenceTrust = DATA_QUALITY_BLOCKED`.

## Outputs

Overall and by:
- A / B / no channel;
- GENERAL / THOUSAND price pool;
- market-cap band.

For each slice:
- PASS;
- LOW_ATR_FAIL;
- HIGH_ATR_FAIL;
- UNKNOWN;
- evaluable fail rate;
- low/high fail rates;
- ATR min/max/mean/median;
- A/B pass count;
- target pass count;
- RR pass count;
- grade pass count;
- selected count.

## Downstream overlap among ATR failures

For ATR-failed rows, the audit reports same-scan independently observed:
- AB_SETUP PASS;
- TARGET_AVAILABLE PASS;
- REWARD_RISK PASS;
- FINAL_SIGNAL_GRADE PASS.

It also splits RR PASS by LOW_ATR_FAIL versus HIGH_ATR_FAIL.

This is overlap observability only.

It does **not** mean:
- Formal would reach those later gates after removing ATR;
- the stock would rank;
- the stock would enter Top3;
- the stock would trigger/fill;
- the trade would be profitable.

## firstFailure masking

When same-date `firstFailureMasking` is available, report:
- ATR firstFailure count;
- full observed ATR fail count;
- ATR fails hidden behind earlier firstFailure reasons.

Again, hidden fail is descriptive overlap, not marginal contribution.

## Daily collection

The existing verified C1 evidence path now appends:

`atrGateDecomposition`

No new:
- endpoint;
- HTTP/provider call;
- scheduler;
- D1 schema;
- Worker hook;
- Production deployment

is introduced.

## Interpretation guardrails

This audit does not prove:
- 1% is too high;
- 10% is too low;
- low ATR is good/bad;
- high ATR is good/bad;
- ATR should become supportive;
- an ATR-failed row would otherwise become a candidate;
- a wider ATR range would improve return.

Permitted future use:
- keep low/high ATR mechanisms separate;
- quantify prospective incidence by channel/pool/cap;
- identify whether ATR is often the only early context barrier before independently valid setup/target/RR evidence;
- pre-register matched outcome comparisons with date/sector/liquidity/channel controls.

Threshold search is prohibited at this stage.

## Formal boundary

No Formal ATR threshold, stop geometry, target, RR, A/B, grade, score, comparator, quota, capital, BUY/ADD/REDUCE/SELL/STOP, 15m, push, order, Worker, D1, Production or System2 behavior changes.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after exact-head Regression, Repair CI and isolated review are green.
2. Let the existing daily C1 workflow emit the first genuine V8.17+ ATR decomposition receipt.
3. Accumulate independent dates before judging low/high ATR burden.
4. Join mature prospective outcomes separately for LOW_ATR_FAIL and HIGH_ATR_FAIL.
5. Any ATR threshold or stop/RR interaction change is Class-C and requires explicit owner approval.
