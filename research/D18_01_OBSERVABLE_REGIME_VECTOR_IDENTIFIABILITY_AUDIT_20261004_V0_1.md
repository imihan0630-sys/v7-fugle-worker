# D18-01 Observable Regime Vector Identifiability Audit — 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / IDENTIFIABILITY_AUDIT_COMPLETE / L3_NOT_JUSTIFIED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System 1 impact: NONE
System 2 policy impact: NONE

## Purpose

Continue from latest main after D18-02, D18-03 and D18-05 reached L3 PIT data-feasibility.

Question:
Can D18-01 Market Regime Taxonomy itself now move to L3?

Answer:
No.

The existing executable sublanes prove only that some dimensions can be generated PIT-safely. They do not yet prove one complete, immutable, replayable observable regime vector across the canonical dimensions.

## Frozen evidence inventory

### Executable PIT sublanes
- Trend context: D18-02, A2 TAIEX context builder, L3.
- Volatility direction: D18-03, same A2 builder, L3.
- Sector rotation context: D18-05, adjacent-session B2 consumer builder, L3.

### Partial / blocked sublanes
- Breadth: D18-04 remains L2. TWSE official aggregate parser is validated, but TPEx machine transport/clock and U2B continuity remain incomplete.
- Activity/liquidity: raw A1 trade-value primitives are derivable, but 20-session frozen market-history context and one accepted D18 builder are not yet complete.
- Concentration/dispersion: deterministic from complete same-day A1 rows, but accepted market-level builder/provenance is incomplete.
- Institutional context: A3 source family exists prospectively, but a D18 Taiwan-wide aggregate context receipt must preserve both-venue completeness and observedAt semantics.
- Size leadership: PIT market-cap vintage lineage remains blocked.
- Global transmission: canonical durable source receipts and Taiwan decision-clock alignment remain incomplete.

## Identifiability firewall

D18-01 is a vector/taxonomy module, not a vote-counting module.

A partial vector must not be converted into:
- a scalar RISK_ON/RISK_OFF score;
- a majority vote across available dimensions;
- an imputed neutral value for UNKNOWN lanes;
- a policy gate;
- a strategy-weight map.

UNKNOWN is structural evidence about observability and must remain explicit.

## Vector completeness schema

A future immutable D18-01 receipt should carry, per dimension:
- dimensionId;
- dimensionVersion;
- state = KNOWN / UNKNOWN;
- rawValue or rawContext;
- observedAt / availableAt;
- sourceReceiptRefs;
- sourceSessionHash / historyWindowHash where applicable;
- pointInTimeEligible;
- unknownReasons[];
- coverage numerator / denominator where applicable.

Top-level receipt:
- marketDate;
- decisionTimestamp;
- regimeVectorVersion;
- dimensionVersions;
- knownDimensionCount;
- requiredDimensionCount;
- dimensionCoveragePct;
- unknownDimensionIds[];
- vectorHash;
- selectionImpact=false;
- policyApplied=false.

No minimum dimensionCoveragePct threshold is authorized by this audit. Any threshold would be a new preregistered experiment.

## Why partial availability is not missing-at-random

The probability that a dimension is UNKNOWN can depend on market state:
- cross-market publication timing can deteriorate around source/transport instability;
- breadth and return-distribution completeness can depend on venue/session coverage;
- institutional or size-source availability can vary with source vintage and corporate-action lineage;
- history-dependent features can fail around continuity gaps;
- global-source alignment can fail on holiday/session mismatch.

Therefore complete-case regime vectors may be selected.

Required first analysis before any Regime × Strategy outcome study:
P(dimension KNOWN | PIT-safe observable market context), by independent date and episode.

Do not estimate strategy policy value only on dates where all dimensions happen to be known unless the missingness mechanism is shown not to distort the target population.

## Regime × Strategy multiplicity firewall

The vector has multiple dimensions. Testing every dimension × every strategy × multiple horizons creates a multiplicity family.

Required order:
1. freeze one dimension and one strategy interaction;
2. preserve static-strategy control;
3. use independent-date / episode-aware inference;
4. keep outcome-free occupancy and UNKNOWN-rate diagnostics separate;
5. only after adequate occupancy preregister one policy challenger;
6. charge identical transaction-cost/slippage assumptions;
7. treat any new threshold, persistence rule, dimension subset or weighting map as a new experiment/version.

Do not search the regime cube for the historically best spread.

## Transition / whipsaw firewall

Raw state transitions are descriptive.

No 2-day/3-day confirmation, hysteresis, persistence or cooldown rule is authorized here. Such rules can reduce false switching but can also delay recognition and miss recovery. They require a separate preregistered walk-forward policy experiment.

A transition rule must be judged on:
- false-switch frequency;
- recognition delay;
- turnover/churn;
- missed-opportunity cost;
- OOS episode robustness;
- identical cost treatment.

## Falsification of the composite-regime hypothesis

A future composite regime is weakened or falsified if:
1. single-dimension baselines explain the same strategy interaction;
2. incremental dimensions add no OOS information after trend/volatility/breadth controls;
3. UNKNOWN rates are high or state-dependent;
4. results rely on one episode;
5. thresholds/persistence choices are unstable;
6. turnover/slippage erase gross benefit;
7. prospective Shadow diverges from replay;
8. the policy loses to a frozen static strategy or exposure-matched control.

## Alternative explanations

Apparent regime interaction can be caused by:
- strategy's own embedded trend/volatility filters;
- sector composition;
- liquidity and price-limit constraints;
- changing eligible-universe composition;
- source coverage changes;
- date clustering;
- one crisis/rally episode;
- post-hoc taxonomy selection.

These must be controlled before claiming incremental Regime value.

## Maturity decision

D18-01 stays L2 / 40%.

Reason:
mechanism and falsification are defined, and several subdimensions now have L3 executable PIT feasibility, but the complete canonical vector is not yet executable with sufficient provenance across all required lanes.

D18 overall stays at latest-main formal maturity. No engineering artifact alone changes maturity.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## Exact next continuation

1. Do not force D18-01 L3.
2. Complete the lowest-risk missing domestic lanes first:
   - D18-04 both-venue breadth + U2B continuity;
   - activity/concentration receipt from frozen complete A1 market snapshots;
   - A3 both-venue institutional aggregate receipt.
3. Keep size/global UNKNOWN until their PIT lineage is genuinely available.
4. Build one immutable vector aggregator only after component receipts have explicit versions/provenance; aggregator must preserve UNKNOWN and cannot invent a completeness threshold.
5. Accumulate prospective occupancy/UNKNOWN rates before any strategy outcome join.
6. First policy experiment must preregister one strategy × one regime dimension with static/exposure-matched controls, multiple episodes and identical costs.
