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


## EA-012 — The benchmark must match the actual Taiwan execution mechanism

Implementation shortfall literature is clear that delayed/partial execution and unfilled opportunity cost belong in execution quality; a cheaper fill among survivors is not enough.

For this system, a second constraint is equally important:
**the benchmark must be executable in the same market mechanism as the intended action.**

Three benchmark classes are now separated:

1. `SELECTION_CLOSE_REFERENCE`
   - useful as the paper decision reference;
   - not assumed executable;
   - cannot be called an arrival fill benchmark.

2. `NEXT_SESSION_REGULAR_OPEN`
   - regular-lot opening-auction reference;
   - only executable if the intended leg is regular-lot AND a pre-open order was actually eligible/submittable;
   - otherwise reference-only.

3. `FIRST_ELIGIBLE_OBSERVED_QUOTE`
   - preferred execution benchmark when freshness and mechanism are verified;
   - must match REGULAR versus ODD_LOT venue/mechanism.

This prevents a benchmark from looking artificially good simply because it uses a price the strategy could not actually access.

Status: BENCHMARK_EXECUTABILITY_GUARD FROZEN.


## EA-013 — Taiwan odd-lot execution is a separate market-mechanism problem, not a rounding detail

Current TWSE and TPEx rules separate intraday odd-lot trading from regular continuous trading.

Current 2026 mechanism:
- odd-lot unit = 1–999 shares;
- orders accepted 09:00–13:30;
- first odd-lot call auction at 09:10;
- since 2024-12-02, matching occurs every 5 seconds;
- odd-lot best-five / execution prices are disclosed separately;
- an odd-lot volatility interruption can delay a match by two minutes.

Official sources:
- TWSE trading mechanism: https://www.twse.com.tw/en/products/system/trading.html
- TPEx odd-lot rules: https://www.tpex.org.tw/en-us/mainboard/trading/rules/odd-lot.html

Fugle's official REST contract independently supports `type=oddlot` on:
- intraday quote;
- ticker;
- candles;
- trades;
- volumes.

Source:
https://developer.fugle.tw/docs/data/http-api/intraday/quote/

### Current-system audit
The current V8.8.1 recorder calls:
`/stock/intraday/quote/{symbol}`
without `type=oddlot`.

Therefore its best bid/ask, depth, open and avgPrice describe the default regular-lot quote path, not a verified odd-lot execution path.

This matters because the Formal capital engine produces integer-share recommendations. Existing tests contain examples such as:
- firstShares=77;
- firstShares=1273.

Those are not one homogeneous regular-lot order:
- 77 = pure ODD_LOT;
- 1273 = 1000-share regular leg + 273-share odd-lot leg.

A single regular-lot quote cannot be treated as the executable benchmark for the entire 1273-share recommendation.

Status: CURRENT EXECUTION RECORDER = REGULAR-LOT CONTEXT ONLY FOR BENCHMARK PURPOSES / ODD-LOT EXECUTION ALPHA DATA-GATED.


## EA-014 — Odd-lot and regular-lot prices are empirically non-identical

A 2023 NTU study on 950 TWSE-listed firms using 2020-10-26 through 2022-12-16 intraday odd-lot data reports:
- odd-lot liquidity increased materially after the new market opened;
- high-price stocks had relatively strong odd-lot liquidity;
- the 09:10 odd-lot opening price could differ systematically from the regular-lot opening price;
- the sign of that odd-lot/regular-lot opening gap varied with regular-market/opening conditions.

This directly falsifies the shortcut:
`regular-lot price ≈ odd-lot executable price`.

Important transportability limit:
that thesis studies the old 3-minute odd-lot matching regime. TWSE shortened the interval to 5 seconds on 2024-12-02. The existence of a distinct mechanism/price path is relevant, but the old spread magnitude must not be transplanted into 2026.

Sources:
- NTU thesis DOI 10.6342/NTU202303876
- TWSE 2024/2025 odd-lot market update.

Status: MECHANISM DIFFERENCE SUPPORTED / 2026 EFFECT SIZE UNKNOWN.


## EA-015 — Execution intent denominator is the action tranche, not automatically the full planned position

The current Formal architecture separates:
- FIRST = first tranche, normally 60% of allocated capital;
- ADD = second tranche, normally 40%.

Therefore FIRST execution quality must use the FIRST intended shares as its parent denominator.

It is incorrect to treat second-tranche shares as "unfilled FIRST shares" merely because the full plan eventually targets a larger position.

Required identity:
- FIRST parent quantity = frozen firstShares at the FIRST decision;
- ADD parent quantity = frozen secondShares / authorized ADD quantity at the ADD decision;
- any later REDUCE / RE-ADD has its own action denominator.

For a mixed-lot parent quantity, split:
- regularShares = floor(q/1000)*1000;
- oddLotShares = q mod 1000.

The two legs require separate mechanism-aware execution evidence before aggregation.

Status: ACTION-TRANCHE DENOMINATOR FROZEN.


## EA-016 — Formal BUY signal price is not an actual fill

Cross-lane Trading-Frictions research already proved that the trade journal stores formal signal market prices, not a broker fill ledger.

Therefore:
- persisted formal BUY = positive evidence that the strategy emitted BUY;
- firstBuyPrice can remain a conditional SIGNAL-price timing diagnostic;
- it cannot be silently upgraded to actual execution price;
- actual implementation shortfall requires ACTUAL fill evidence;
- a MODELED fill scenario must be labeled MODELED;
- signal market price alone is unsupported as fill evidence.

The isolated PR #104 helper now fails closed when fill evidence quality is not ACTUAL or explicitly MODELED.

Status: SIGNAL-vs-FILL FIREWALL FROZEN.


## EA-017 — Implementation-shortfall decomposition added without creating a policy score

Draft PR #104 now contains a pure Class-A implementation-shortfall-style helper.

For an intended BUY quantity Q, frozen decision benchmark P0, horizon price Ph, actual/modelled fills q_j at p_j and explicit cost C:

- execution-price cost = sum[(p_j - P0) * q_j]
- unfilled opportunity cost = (Ph - P0) * (Q - sum q_j)
- total shortfall = execution-price cost + unfilled opportunity cost + C
- bps denominator = P0 * Q

Properties:
- unfilled shares stay in the denominator;
- missed winner can create positive opportunity cost;
- avoided loser can create negative opportunity cost;
- fill coverage must be complete;
- fill evidence quality is explicit;
- no composite Execution Alpha score is created.

Latest branch head for this tranche: `5371e62dae80164bd0fdc5c8c10b8c0c2ce54a4e`.
CI status must be checked independently before treating the engineering tranche as validated.

### Consequence for the current research program
Execution Alpha now has two independent completeness gates:
1. event/date recorder completeness (BUY vs NO-BUY truth);
2. execution-mechanism completeness (regular/odd/mixed-lot benchmark truth).

Passing only one is insufficient.

No historical 2026-09-24 BUY/NO-BUY reconstruction is authorized.
No Formal BUY rule, share sizing, capital rule or push behavior changed.

Status: EXECUTION BENCHMARK SEMANTICS DEEPENED / ODD-LOT PROVENANCE GAP FOUND / FORMAL CORE LOCKED.


## EA-018 — aggregation must be leg-aware and quantity-weighted

A mixed-lot parent action cannot be scored by averaging regular-lot and odd-lot percentages equally.

For a parent intended quantity Q with regular leg Qr and odd-lot leg Qo:
- preserve each leg's own executable benchmark, fills, costs and unfilled opportunity cost;
- aggregate parent shortfall in NTD first;
- divide only once by the sum of leg decision notionals;
- never average leg bps with equal weights unless their decision notionals are exactly equal.

This prevents a small odd-lot residual from dominating a 1,000+ share regular leg, while still preventing the odd-lot leg from disappearing.

Aggregation gate:
- parent status VALID only if every required leg has mechanism-matched benchmark provenance and complete execution/non-execution coverage;
- otherwise parent status DATA_QUALITY_BLOCKED with named blocked legs.
- A valid regular leg cannot silently impute the missing odd-lot leg.

## EA-019 — partial fill and cancel/replace are lifecycle states, not one fill

Implementation shortfall must preserve the parent-action lifecycle:
INTENT -> SUBMITTED -> PARTIAL_FILL* -> CANCEL/REPLACE* -> FINAL_FILLED or FINAL_UNFILLED.

Required fields for later prospective evidence:
parentActionId, actionType (FIRST/ADD/REDUCE/RE_ADD), intendedShares, lotLeg, decisionKnownAt, submitAt, fillAt, cancelAt, replaceAt, fillShares, fillPrice, explicitCost, evidenceQuality.

A replacement order remains part of the same parent action unless Formal logic creates a new action. Summing fills without parent identity can double-count replaced quantity.

Until broker/order lifecycle evidence exists, Formal signal logs remain SIGNAL evidence only and actual-fill implementation shortfall remains DATA_QUALITY_BLOCKED.

## EA-020 — idle-capital cost must be benchmarked, not assumed zero

A NO-BUY/partially unfilled action leaves capital available. Opportunity cost is therefore not simply the stock's later return.

Prospective research must keep at least:
- stock opportunity path from the frozen executable benchmark;
- cash/idle benchmark return for the same horizon;
- whether capital was actually available for another Formal plan;
- portfolio capacity utilization.

Do not assume idle cash earned 0 or that it was immediately redeployed. Both are scenarios until portfolio-level evidence exists.

This matters to the system's core problem: a strict BUY policy can improve per-fill price while lowering total capital utilization. The two effects must be reported separately before any optimization proposal.

## EA-021 — first optimization bridge question is now falsifiable

The first possible Formal optimization is NOT "loosen BUY conditions".

The research question is:
Does the current waiting policy create a persistent excess of complete-coverage MISSED_UPSIDE relative to AVOIDANCE_BENEFIT after costs, while conditional BUY price improvement is too small to compensate, across independent dates/regimes and frozen A/B/pool/liquidity strata?

Only if that survives counterevidence should a later FORMAL_OPTIMIZATION_CANDIDATE consider relaxing a specific entry gate. If avoidance benefit offsets missed upside, or results cluster by strategy/regime, a universal relaxation is rejected; interaction-specific research is required.

Current status: FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY.
