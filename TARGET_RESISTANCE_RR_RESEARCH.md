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


## TRR-008 — local-pivot / 1% band counterfactuals

The current function name `nearestRealResistance` is stronger than the encoded semantics.

A historical pivot needs only:
- its high >= two previous highs;
- its high >= two next highs;
- price > entry*1.01.

There is no encoded:
- prominence;
- number of prior tests;
- rejection strength;
- age/recency weighting;
- volume confirmation;
- ATR-normalized importance;
- zone width;
- major/base/micro hierarchy.

All eligible levels then compete only by price; the nearest wins.

### Opposing fixed witnesses

Entry=100, stop=95.

**Minor-pivot conservative witness**
- local 5-bar pivot =102;
- priorHigh60=120.
- target=102 because it is nearer.
- RR=(102-100)/5=0.4 -> rejected.

A minimally-defined local pivot can therefore dominate the major historical level.

**Sub-1% optimistic witness**
- local overhead high=100.8;
- priorHigh60=120.
- 100.8 is ignored because it is not >101.
- target=120.
- RR=4 -> passes.

So the same 1% rule can ignore nearby overhead structure and inflate target/RR.

**Sub-1% target-null witness**
- overhead levels 100.8 and 100.9 only.
- both are ignored.
- target=null -> rejected.

Thus the 1% rule is not simply conservative or permissive.
Its effect depends on whether a farther qualifying level exists.

### Cross-lane implication

Pattern research already freezes:
- repeated-resistance progression;
- major-zone lifecycle;
- MICRO/BASE/MAJOR hierarchy;
- available-air style geometry;
- no hard major-zone veto before prospective evidence.

That lane is the correct independent robustness comparator.
Do not silently substitute Pattern zones into Formal RR.

Future analysis should ask whether the current nearest-single-level target adds useful downside protection beyond:
- major-zone distance;
- local breakout state;
- ATR/stop;
- existing priorHigh20/priorHigh60;
- Pattern lifecycle state.

No target rule change is authorized.


## TargetPrice Production injection provenance audit — 2026-09-27

Repository audit found no official or repository-owned producer that assigns `targetPrice`.

The only proven injection paths are the generic custom enrichment inputs:
- `V7_ENRICHMENT_JSON`;
- `V7_ENRICHMENT_API_URL`.

`normalizeEnrichmentPayload()` preserves custom stock objects as-is, so `targetPrice` can reach Formal if an external custom source supplies it. This proves technical feasibility, not live coverage or provenance.

Important negative findings:
- `/api/version` does not expose custom-enrichment configured/readiness state;
- persisted after-market summary does not store `customAvailable`, custom fetch failure, targetPrice coverage or targetPrice provenance coverage;
- generic `enrichmentAvailable` / `enrichmentStocks` can be true from official data alone and cannot prove custom success;
- market-consensus narrative may mention analyst target prices, but the V7.5.30 consensus path does not map those numbers into `f.targetPrice`.

Custom API failure is currently caught and converted to an empty custom payload while Formal scan continues. If Production actually depends on custom `targetPrice`, this could change target/RR state. But live dependency is not proven, so this is classified as:
`POTENTIAL_SOURCE_AVAILABILITY_COUPLING / NOT_YET_PRODUCTION_DEFECT`.

Safe current states:
- live custom-source configuration = UNKNOWN;
- targetPrice live coverage = UNKNOWN;
- targetPrice source identity = UNKNOWN;
- targetPrice asOf / knownAt = UNKNOWN.

Do not convert any of those UNKNOWNs to zero/absent.

Minimum prospective source-state contract is frozen in:
`research/target_price_injection_provenance_audit_v0_1.json`.

Shared runtime observability capture is Class B proposal-first. Target/RR rule changes remain Class C.
