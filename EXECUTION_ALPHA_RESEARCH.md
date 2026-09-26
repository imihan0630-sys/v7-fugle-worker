# Execution Alpha Research

Updated: 2026-09-26 Asia/Taipei

Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## Purpose
Execution Alpha asks whether waiting for formal intraday entry conditions improves realized entry quality after missed opportunities, missing observations and costs. It is not merely "BUY price below selection-day close".

## EA-001 — current metric semantic audit
V8.7.4 currently joins selected plans to the first persisted formal BUY and computes entryTimingPct=(formalClose-firstBuyPrice)/formalClose and buyBandMidAlphaPct=(buyBandMid-firstBuyPrice)/buyBandMid.
These are useful conditional price-improvement diagnostics for OBSERVED BUY rows. They are not unconditional Execution Alpha because plans without a persisted BUY are excluded.
Required naming: conditionalEntryPriceImprovementPct for the existing concept; never generalize its conditional mean to all selected plans.

## EA-002 — selection-to-execution funnel
Every selected plan/date must end in one research state:
- BUY_OBSERVED_COMPLETE_COVERAGE
- NO_BUY_OBSERVED_COMPLETE_COVERAGE
- UNKNOWN_RECORDER_INCOMPLETE
- UNKNOWN_MONITOR_GAP
- UNKNOWN_SIGNAL_PERSISTENCE
- UNKNOWN_SOURCE_STALE
- NOT_YET_MATURE

Missing recorder/signal rows are never NO_BUY by themselves.
Required denominators: selectedPlans, coverageEligiblePlans, completeCoveragePlans, buyObservedPlans, noBuyObservedPlans, unknownPlans by reason, buyTriggerRateCompleteCoverageOnly and unknownRate.

## EA-003 — opportunity-cost decomposition
For plans with complete coverage compare the waiting policy with frozen research benchmarks:
1. selection close: reference only, not assumed executable;
2. next-session OPEN when PIT/official bar is available;
3. first eligible observed quote after open only when recorder coverage proves it exists;
4. formal first BUY price when BUY occurs.

BUY plans: conditional entry-price improvement plus subsequent D1/D3/D5/D10 path from actual BUY timestamp/session where data permits.
Complete-coverage NO-BUY plans: missed-opportunity path from the same frozen benchmark, including favorable/adverse excursion and end-horizon return. This is opportunity cost, not a synthetic trade.
Unconditional policy value must combine BUY and NO-BUY states; it may not discard NO-BUY plans.

## EA-004 — trigger-survivorship falsification
Waiting-policy evidence weakens when conditional BUY entries look cheaper but complete-coverage NO-BUY plans subsequently have materially stronger return/MFE; benefit exists only in one date/industry/regime; costs erase it; stale quotes/monitor gaps drive it; or stricter waiting reduces capital use without better risk-adjusted path quality.
Support requires entry improvement surviving costs and missed-opportunity penalty across independent dates/regimes with a controlled UNKNOWN denominator.

## EA-005 — joins and clocks
Primary plan key = plan_scan_date + symbol. Keep selection close timestamp, plan date, scheduled monitor time, observedAt/featureKnownAt, first formal BUY occurredAt, quote lastTradeAt and horizon sessions separate.
A persisted BUY row is positive evidence BUY occurred. Absence of BUY is not negative evidence unless monitor/recorder completeness for that plan/date is proven.
Recorder exact-date completeness remains the blocking gate for historical NO-BUY classification. Current newest-first LIMIT 500 / recent 80 cannot prove it.

## EA-006 — execution context semantics
V8.8.1 can preserve opening gap, Fugle avgPrice proxy, bid/ask spread, five-level depth imbalance and quote mechanism flags when available. They are research covariates, not entry rules.
Do not call sessionAvgPrice an independently reconstructed VWAP; preserve FUGLE_INTRADAY_QUOTE_AVG_PRICE semantics. Unknown freshness/mechanism remains UNKNOWN.

## EA-007 — bias/governance
Mandatory: trigger survivorship, selection bias, date/industry/regime clustering, stale-source bias, monitor-availability bias, costs/slippage, multiple horizons, capital-idle opportunity cost and no historical Shadow fabrication.
No new entry threshold/window may be selected from outcomes. Any alternative waiting horizon is a new registered experiment.

## Current decision
2026-09-24 plan-level BUY/NO-BUY remains DATA_QUALITY_BLOCKED / UNKNOWN until exact-date completeness is observable.
Observed persisted BUY rows may be used only for clearly labeled conditional entry-price-improvement diagnostics; they cannot establish unconditional Execution Alpha.

Next evidence program:
1. exact-date completeness Class-B proposal remains frozen/unpromoted;
2. Class-A research may define coverage-aware Execution Alpha diagnostics/tests on synthetic fixtures;
3. prospective complete-coverage days should accumulate BUY and NO-BUY opportunity-cost cohorts once completeness is observable;
4. no Formal Core change without later evidence and explicit strategy decision.


## EA-008 — do not equate NO-BUY with loss
A complete-coverage NO-BUY can have either sign:
- MISSED_UPSIDE: the frozen benchmark path rises materially after the system abstains;
- AVOIDANCE_BENEFIT: the frozen benchmark path falls materially after abstention;
- NEUTRAL_OR_AMBIGUOUS: path/cost difference is small or mixed.

Therefore a stricter entry policy can create value by avoiding bad selections even while lowering participation. Conversely, cheap observed BUY prices can coexist with poor total policy value if the system systematically misses strong winners.

Report five dimensions separately before any composite:
1. participation/BUY trigger rate on complete coverage;
2. conditional entry-price improvement for observed BUY;
3. post-entry path quality for BUY;
4. missed-upside versus avoidance-benefit distribution for complete NO-BUY;
5. capital-idle exposure/time and assumed cash benchmark.

Do not optimize a weighted composite until these components mature independently.

## EA-009 — selection/execution interaction
Execution research must be stratified by frozen selection context rather than treating every plan as exchangeable: A/B channel, pool, scan date, regime, liquidity/price bucket and pre-existing plan quality fields where available. These are descriptive strata, not new thresholds.

Key falsification question: does waiting improve weak/volatile selections by avoiding bad entries while unnecessarily suppressing high-quality momentum selections? If yes, the problem is interaction/heterogeneity rather than a universally too-strict or too-loose BUY rule.

No subgroup may be promoted from a tiny date cluster. Report independent dates and UNKNOWN coverage for each stratum.


## EA-010 — execution is an immediacy / price-improvement / non-execution trade-off

External market-microstructure evidence strengthens the reason R02 cannot be interpreted from BUY rows alone.

Limit-order research separates at least three components:
1. price improvement when waiting succeeds;
2. execution probability / time-to-execution;
3. opportunity cost and adverse selection when waiting does not execute.

Taiwan-specific order-choice evidence is consistent with this framework:
- TWSE traders vary marketable-quote aggressiveness with transitory volatility, depth and investor type;
- the 2015 Taiwan price-limit expansion study reports changes in aggressiveness, order duration/fill rate and market quality;
- Taiwan order-execution-quality studies show aggressiveness is related to execution speed/quality and price movement.

Therefore "formal BUY entered below selection close" is only the price-improvement leg of a larger execution policy.

### Required accounting identity
Every selected plan must remain in the denominator until it is explicitly classified as:
- complete BUY;
- complete NO-BUY;
- a named UNKNOWN;
- not yet mature.

Conditional BUY price improvement can be positive while total waiting-policy value is poor if strong winners are disproportionately left unexecuted.

Conversely, a lower trigger rate is not automatically bad if complete NO-BUY plans disproportionately avoid adverse paths.

### No composite optimization yet
Do not invent a weighted Execution Alpha score combining:
- participation;
- entry improvement;
- post-entry path;
- missed upside;
- avoided downside;
- idle cash.

Each component must mature separately first.

Status: EXECUTION_POLICY_DECOMPOSITION_SUPPORTED / COMPOSITE_VALUE_NOT_AUTHORIZED.


## EA-011 — coverage-aware diagnostic v0.1 implemented in isolated Draft PR #104

A fresh Class-A branch from current main now contains:
`research/execution_alpha_coverage_v0_1.mjs`

The module is pure research accounting only:
- no Worker import;
- no network;
- no D1/storage write;
- no monitoring/signal/push;
- no Formal selection/ranking/capital impact.

It implements the frozen EA-002 states and reports:
- selected/mature/complete-coverage denominators;
- BUY and NO-BUY counts;
- named UNKNOWN counts;
- complete-coverage BUY trigger rate;
- UNKNOWN rate among mature plans;
- conditional BUY entry-price improvement;
- BUY post-entry D5 when supplied;
- complete NO-BUY benchmark D5/MFE/MAE when supplied;
- idle-session summary.

The implementation intentionally returns `unconditionalExecutionAlpha:null`.
No optimized composite policy-value estimator exists in v0.1.

Synthetic falsification fixture includes:
- one observed BUY with cheaper entry;
- one NO-BUY missed winner;
- one NO-BUY avoided loser;
- one recorder-incomplete UNKNOWN;
- one not-yet-mature plan.

This proves the accounting can represent conflicting opportunity-cost signs without converting missing data to NO-BUY.

Draft PR: #104.
Production baseline independently re-read before engineering:
`8.11.0-pv-shadow-v0.1-log-only`, TEST_MODE=false, KV/D1 present.

Validated research head: `c9e23b01907dbeca7a130236816d56ac8db8764b`.
CI:
- V8 Repair `36210097574`: SUCCESS;
- V8 Regression `36210097500`: SUCCESS.

Draft PR #104 remains unmerged / un-deployed. Formal Core and production runtime are unchanged.
