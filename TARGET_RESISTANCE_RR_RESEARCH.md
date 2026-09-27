# Target / Resistance / RR Research

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## TRR-001 — Current Formal target path

Formal target is produced by `nearestRealResistance(f, entry)`.

Eligible levels must be strictly above `entry * 1.01`:
- optional `targetPrice`;
- priorHigh20;
- priorHigh60;
- historical two-left/two-right pivot highs.

The function takes the **minimum eligible level**.

If no eligible level exists:
`target === null -> 上方無可驗證實質壓力，無法計算真實RR`.

If target exists:
`RR=(target-entry)/(entry-stop)`,
then RR<2 is rejected.

Therefore target provenance is upstream of:
- RR eligibility;
- RR's 14% PriorityScore contribution;
- raw RR comparator;
- eventual score-proportional capital.

## TRR-002 — targetPrice provenance is not established

Repository-wide audit finds `targetPrice` read by `nearestRealResistance()` but no repository-side producer/assignment for the Formal field.

However external enrichment is permissive:
`normalizeEnrichmentPayload -> mergeEnrichment(...extra) -> buildMarketFeatures(...stock)`.

Therefore correct status is:
`REPO_PRODUCER_NOT_FOUND / EXTERNAL_INJECTION_FEASIBLE / PRODUCTION_COVERAGE_UNKNOWN`.

Do not call the field absent.
Do not call it an analyst target.
Do not assume it is point-in-time safe.

No source id, as-of/knownAt or selected-target-source identity is currently required by this function.

## TRR-003 — fixed structural flip

Entry=100, stop=95.

Same technical history:
- priorHigh20=100;
- priorHigh60=101;
- all historical pivots <=101.

Without targetPrice:
- no level exceeds 101;
- target=null;
- candidate is rejected before RR.

With targetPrice=115:
- target=115;
- RR=3;
- the same technical geometry can proceed past RR.

Reverse direction:
- historical resistance=120 gives RR=4;
- add targetPrice=105;
- nearest target becomes 105;
- RR=1;
- candidate is rejected.

Thus optional targetPrice can either:
- rescue target-null;
- or compress target/RR enough to reject.

It is not a harmless descriptive field.

## TRR-004 — B new-high dependency

B entry is:
`priorHigh20 * 1.003`.

Therefore priorHigh20 itself can never qualify as a target.

If the B breakout is also at/above the prior 60-session high and retained-history pivots:
- priorHigh60 <= breakout;
- historical pivot highs <= breakout;
- breakout < entry*1.01.

So all historical target sources fail the >1% filter.

Unless a qualifying external targetPrice exists, a B breakout into genuine new-high territory becomes target-null and is rejected.

This is a structural tension worth falsifying:
the strategy is explicitly a breakout strategy, yet its strongest new-high geometry can be more dependent on optional external target data than a breakout with old overhead resistance.

This does **not** prove that new-high breakouts should be admitted. Lack of overhead reference may be intentionally conservative because target/RR cannot be bounded.

## TRR-005 — current Shadow cannot answer the attribution question

Current research snapshots preserve RR/score provenance prospectively after V8.13, but do not preserve:
- raw targetPrice and provenance;
- all eligible resistance candidates;
- selectedTargetSource;
- selected historical pivot date;
- why target was null.

Therefore later outcome data alone cannot identify whether:
- a target-null reject came from true blue-sky breakout geometry;
- targetPrice was missing;
- targetPrice was present but <=1% above entry;
- a nearer targetPrice compressed RR;
- priorHigh60/pivot was selected.

This is an observability gap.

## TRR-006 — prospective falsification

Machine artifact:
`research/target_resistance_rr_provenance_falsification_v0_1.json`.

Prospective evidence should freeze:
- entry / stop;
- targetPrice raw/source/asOf/capturedAt/PIT eligibility;
- priorHigh20/priorHigh60;
- dated pivot candidates;
- eligible levels after the 1.01 filter;
- selected target + source;
- target-null state;
- RR and exact reject reason.

Primary comparison:
target-null B new-high setups versus matched B breakouts with overhead resistance, controlling:
- setup quality;
- ATR/stop distance;
- liquidity/execution;
- sector/regime;
- market/sector RS;
- overheat;
- event/corporate-action state.

Do not backfill old targetPrice from current targets or later-known analyst research.

## TRR-007 — optimization bridge

Current:
`STRUCTURAL_PROVENANCE_RISK_CONFIRMED / NOT_FORMAL_OPTIMIZATION_CANDIDATE`.

Potential future:
`TARGET_RESISTANCE_ADMISSION_REFORMULATION`.

Promotion requires prospective/OOS evidence that target-null or source-specific target behavior causes stable opportunity loss without corresponding downside/execution protection.

Any target formula, null-gate, RR threshold or source-priority change is Class C and requires owner approval.

No Formal behavior changed.
