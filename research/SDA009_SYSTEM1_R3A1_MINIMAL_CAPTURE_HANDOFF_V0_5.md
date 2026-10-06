# SDA-009 System1 R3A1 Minimal Capture Handoff V0.5

Status: READY_FOR_SYSTEM1_ENGINEERING_INTAKE
Source owner: 07｜產業與供應鏈研究室
Engineering owner: System 1
Audit ticket: `SDA-009`
Observed main before handoff: `2b99996834ae4cb6911d743e023fcf1dfa1cdfa2`
Formal Core mutation authorized: NONE

## Objective

Implement only the minimum prospective C1 capture required to make SDA-009 leave-one-out replay identifiable.

Do not implement a new Formal ranking policy.
Do not change gates, thresholds, 3+3 quotas, capital, signals, push, monitoring or trading behavior.

## Existing code anchor

The current effective build creates C1 through:

`buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,formalResults,selected,scanDate)`

The row map already has:
- `raw`: exact normalized same-session market row;
- `f`: feature row when admitted;
- `sector`: production sector state used by the candidate;
- `result`: actual Formal result.

The function also receives the complete production `sectorStats`.

Therefore R3A1 requires capture only, not a second production calculator.

## R3A1 row delta

Inside the existing C1 row projection add:

- `currentChangePercent: c1Number(raw?.changePercent)`
- `currentTradeValue: c1Number(raw?.tradeValue)`

Preserve explicit null values.

Do not copy from `f.changePercent` as the only source because feature-blocked rows still belong to the production sector denominator.

## R3A1 generation delta

Create the exact runtime industry membership projection from the complete C1 parent rows:

- market;
- symbol;
- industry.

Sort deterministically and persist:
- `classificationSchemeId = SYSTEM1_RUNTIME_INDUSTRY_LABEL_V1`;
- `membershipVersion`;
- `membershipDigest`.

Use the complete C1 parent, not a sampled Shadow cohort.

Create the exact production sector decision projection directly from the already-built `sectorStats`:

- industry;
- stockCount;
- historicalCoverage;
- amount;
- breadth;
- avgChange;
- amountVs20DayAverage;
- score.

Sort deterministically and persist:
- `sectorDecisionStateVersion`;
- `sectorDecisionStateProjection`;
- `sectorDecisionStateDigest`.

Use the repository canonical hash helper rather than ad-hoc JSON ordering.

## Unclassified handling

The runtime fallback `未分類` is preserved exactly for replay identity.

Add research interpretation state:
`UNCLASSIFIED_PSEUDO_BUCKET`.

This does not change Formal grouping.

No alpha/economic interpretation is authorized for this bucket.

## R3A1 acceptance tests

Must prove:

1. provider-call delta = 0;
2. Formal selected symbols unchanged;
3. Formal plan payload unchanged;
4. Formal ranking tuple unchanged;
5. capital allocation unchanged;
6. push/signal behavior unchanged;
7. C1 population count unchanged;
8. C1 universe digest semantics remain valid;
9. row currentChangePercent matches the same normalized raw row;
10. row currentTradeValue matches the same normalized raw row;
11. membership digest is order-invariant;
12. one industry-label mutation changes membership digest;
13. one production sector-score mutation changes sectorDecisionStateDigest;
14. `未分類` remains visible and is labeled pseudo-bucket for research;
15. C1 readback preserves all new fields;
16. no legacy generation is retroactively backfilled or reinterpreted;
17. effective comparator identity remains `PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30`;
18. protected-output parity passes.

## First prospective parity receipt

For the first genuine post-implementation generation:

A. load complete verified C1 parent;

B. verify membership projection/digest;

C. reconstruct inclusive sector primitives from:
- currentChangePercent;
- currentTradeValue;
- industry;
- feature.historyDays;
- feature.avgAmount20;

D. compare reconstructed:
- breadth;
- avgChange;
- amountVs20DayAverage
against production-inclusive C1 sector values;

E. reconstruct production score-relevant sector projection and require exact canonical equality/digest match against `sectorDecisionStateProjection` / `sectorDecisionStateDigest`.

Only when D and E pass:
`SDA-009-R3A1-PARITY = PASS`.

## R3A2 intentionally deferred field

Do not enlarge R3A1 just to finish ranking.

For a candidate currently rejected at the sector gate, exact resurrected post-consensus ranking later needs:
- `marketConsensusSources` or exact `marketConsensusBonus`.

That belongs to `SDA-009-R3A2` after R3A1 parity succeeds.

## Counterfactual outputs after R3A1

Allowed after parity:
- mechanical gate LOO;
- sector-score LOO;
- local self-contribution;
- max-normalizer externality;
- classification/pseudo-bucket state.

Not yet automatically authorized:
- resurrected candidate pool rank;
- full 3+3 seat change;
- capital-allocation change.

Those require R3A2 ranking/selection identifiability.

## Research references

- `research/SDA009_R3_CAPTURE_AND_COUNTERFACTUAL_CONTRACT_V0_5.md`
- `research/sda009_r3_capture_and_counterfactual_contract_v0_5.json`
- `research/sda009_r3_capture_contract_v0_5.mjs`
- `research/test_sda009_r3_capture_contract_v0_5.mjs`
- `research/SDA009_R3_V0_4_CHECKPOINT_20261006.md`

## Exact engineering next

Implement R3A1 as an additive research-only C1 capture change.
Run deterministic and protected-output parity tests.
Do not merge/deploy beyond existing governance without the required System1 approval path.
