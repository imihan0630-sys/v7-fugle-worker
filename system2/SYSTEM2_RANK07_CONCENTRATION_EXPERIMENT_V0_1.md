# System 2 RANK-07 Concentration Experiment V0.1

Updated: 2026-09-27 Asia/Taipei
Status: PREREGISTERED MEASUREMENT / NO HARD CAP / SOURCE-AWARE

## Research question

Should System 2 eventually constrain industry, size, strategy or regime concentration inside the max-12 global candidate pool?

Do not assume yes.

## Positive mechanism for a future cap

A concentration control might:
- reduce correlated thesis failures;
- reduce one-industry crowding;
- preserve opportunity diversity;
- reduce drawdown from a sector reversal.

## Counter-mechanism

A hard cap can destroy genuine leadership information:
- strong bull phases often concentrate in a few industries;
- an early structural cycle can legitimately produce many high-quality names in one group;
- arbitrary diversification can replace strong candidates with weaker ones;
- the correct concentration limit may depend on regime and strategy horizon.

Therefore V0.1 measures concentration only.

## V0.1 measurable now

### Industry concentration

For each global pool snapshot:
- global unique symbol count;
- known industry count;
- UNKNOWN classification count;
- known-industry coverage;
- symbol count by industry;
- largest industry count;
- largest industry share of global pool;
- known-only industry HHI（赫芬達爾—赫希曼指數）.

UNKNOWN classification remains UNKNOWN and is never relabeled as "Other".

Industry classification version/provenance must be frozen with the receipt.

### Strategy membership concentration

Because one symbol may belong to multiple strategies:
- count unique symbols;
- count memberships by strategy;
- count multi-strategy symbols;
- preserve that membership counts may exceed unique-symbol count.

This is not a portfolio exposure calculation.

## Not ready in V0.1

### Size concentration

Large-cap / mid-cap / small-cap concentration is blocked until a PIT-safe market-cap or size-bucket contract is frozen.

Do not infer size solely from stock price.

### Regime concentration

Regime labels are market/date context, not independent symbol buckets.
Regime concentration is therefore mainly a time-series performance concentration question and belongs in later outcome aggregation, not a same-day pool cap.

## No hard-cap rule

V0.1 explicitly does NOT implement:
- max N stocks per industry;
- max X% per industry;
- HHI threshold;
- max strategy-membership share;
- forced diversification.

Any future cap must be a versioned challenger tested against the uncapped baseline.

## Future cap experiment

If evidence later supports testing a cap, compare:
A. no cap baseline;
B. warning only;
C. soft priority penalty;
D. hard cap.

Mandatory opportunity-cost cohort:
every stock excluded only by concentration control must be preserved and followed.

Measure:
- MFE / MAE;
- trigger/profitable-trigger conversion;
- drawdown contribution;
- industry reversal loss;
- excluded-name opportunity cost;
- zero-pick/capacity utilization;
- date/regime/industry concentration.

## Falsification

Reject a concentration cap if:
- it mainly discards future winners in genuine sector leadership;
- risk improvement vanishes after strategy/regime controls;
- it reduces candidate quality more than it reduces correlated loss;
- benefit is crisis-only;
- unknown classifications materially drive the result.

## Current decision

Measure and warn only.
No concentration-based admission, eviction, ranking or sizing rule is authorized in V0.1.
