# Trading Frictions, Turnover & Rebalancing Research

Status: RESEARCH_ONLY / CONCEPT_BUILD / Formal Core LOCKED
Updated: 2026-09-25 15:14 Asia/Taipei

## Boundary
This lane studies explicit and implicit trading costs, turnover drag, and no-trade/rebalancing logic. It does not change Formal selection, ranking, entry/add/reduce/sell/stop, capital allocation, monitoring, push, or ABF re-add. Any future change to those behaviors is Class C; shared-runtime capture is at least Class B.

## TF-001 — Taiwan explicit-cost ledger
Official TWSE guidance states that stock securities transaction tax is levied on the seller at 0.3% of traded value; the day-trading offsetting transaction tax is 0.15% through 2027-12-31. Brokerage commissions are broker-specific rather than a universal fixed rate. Therefore research must never hard-code one user's commission discount as market truth.

Research ledger per fill:
- buy commission actually charged or UNKNOWN;
- sell commission actually charged or UNKNOWN;
- sell-side transaction tax according to trade type/date;
- other broker/exchange charges only when evidenced;
- gross and net return stored separately.

Counter-mechanism: a high gross-alpha strategy can be destroyed by turnover, but a low-turnover strategy can still be poor after opportunity cost. Cost control is not alpha by itself.

Sources:
- https://www.twse.com.tw/en/about/company/guide.html
- https://www.twse.com.tw/en/products/system/trading.html

## TF-002 — Round-trip hurdle, not a single universal percentage
Define ex-post realized friction:
explicitCost = actual commissions + taxes + evidenced fees.
implicitCost = implementation shortfall / spread / slippage where valid quote or decision-price provenance exists.
totalFriction = explicitCost + implicitCost.

For prospective research, compute a scenario ladder rather than one guessed hurdle:
- ACTUAL when broker fill/fee evidence exists;
- QUOTED/SPREAD when decision-time quotes exist;
- STRESS scenarios for slippage, clearly labeled hypothetical.

Never substitute the TWSE standard/ceiling-like reference for the user's actual negotiated commission. Missing actual commission = UNKNOWN.

## TF-003 — Turnover drag and churn
Turnover must be measured at portfolio and position level:
- one-way traded notional / capital;
- round-trip turnover;
- turnover caused by FIRST, ADD, REDUCE, RE-ADD separately;
- repeated same-symbol churn within a rolling window.

Primary question: does incremental gross edge after a state transition exceed incremental friction plus uncertainty margin?

Opposing case: suppressing turnover mechanically can delay valid exits or prevent re-entry after genuine recovery. Therefore turnover is a diagnostic, not an automatic veto.

## TF-004 — No-trade region / hysteresis concept
A no-trade band is worth Shadow testing when desired position changes are small relative to friction and estimation uncertainty. This is a classic portfolio-control idea: avoid trading when the benefit of moving toward a target is smaller than the cost of doing so.

For this system, do not invent a target-weight optimizer. Research-only analogue:
- compare KEEP vs TRADE counterfactual at each ADD/REDUCE/RE-ADD decision;
- freeze the decision-time plan and cost assumptions;
- evaluate subsequent D1/D3/D5/D10 outcome and avoided/incurred friction.

Counter-mechanism: wide hysteresis can create path dependence and leave stale risk on book. Any future live hysteresis rule would alter Formal execution and is Class C.

## TF-005 — FIRST / ADD / REDUCE / RE-ADD cost asymmetry
These actions are economically different:
- FIRST: pays entry friction for new exposure;
- ADD: pays friction while increasing concentration;
- REDUCE: pays sell tax/commission but may buy risk reduction;
- RE-ADD: pays a second entry cost and creates whipsaw risk after a prior reduction.

Research should report gross benefit, net benefit, and avoided-risk value separately. A REDUCE that lowers later MAE can be useful even if price subsequently rises; a RE-ADD can be useful only if recovery benefit exceeds renewed friction and whipsaw risk.

No action is labeled good/bad solely from next-day price.

## TF-006 — Implementation shortfall provenance
Decision price, order-submission time, fill price, fill time, side, quantity and contemporaneous spread/depth are required for trusted implementation-shortfall decomposition.

If only end-of-day prices exist:
- do not fabricate slippage;
- do not infer spread crossing;
- keep implicit cost UNKNOWN;
- explicit tax/commission may still be modeled separately if trade type and fee evidence are valid.

This aligns with the existing Execution Recorder coverage gate: absence of a row is not zero cost.

## TF-007 — Tick size, spread and price-tier controls
Taiwan uses discrete tick-size bands; historical Taiwan evidence shows tick-size changes affect quoted spread, execution costs, depth and trade size. Therefore friction comparisons across low-price and high-price stocks must normalize by ticks and/or basis points and retain price tier.

A one-tick spread is not economically equivalent at NT$20 and NT$2,000.

Source:
- Kuo, Huang & Chen (2010), Asia-Pacific Journal of Financial Studies, DOI 10.1111/j.2041-6156.2010.01020.x

## TF-008 — Tax changes are regime breaks
Taiwan evidence around transaction-tax changes shows taxes can affect volume/liquidity/market quality; historical samples spanning tax regimes cannot be pooled blindly.

Controls:
- effective tax regime at decision date;
- day-trade vs ordinary sale;
- instrument type;
- never apply current tax rules backward without date validation.

Positive mechanism: lower explicit friction can make shorter-horizon edge tradable.
Counter-mechanism: more trading after a tax cut does not prove more alpha; turnover may rise while signal quality is unchanged.

Sources:
- TWSE 2025 Guide to Investing in Taiwan
- Chou & Wang (2006), Journal of Futures Markets, DOI 10.1002/fut.20238
- Wu & Wang (2020), Accounting Review 70

## TF-009 — Cost-aware evaluation protocol
For every candidate strategy/action cohort:
1. freeze signal/action timestamp and gross outcome;
2. attach explicit cost with provenance;
3. attach implicit cost only when decision/fill/quote evidence exists;
4. compute gross vs net D1/D3/D5/D10 and MFE/MAE;
5. cluster by independent market date and symbol/event;
6. split by liquidity, price/tick tier, action type and market regime;
7. report coverage of ACTUAL / MODELED / UNKNOWN costs;
8. run sensitivity scenarios without selecting the cheapest scenario after seeing results.

Falsification: reject a friction-aware improvement if apparent benefit disappears under plausible costs, depends on one low-cost subgroup/date cluster, or is explained by lower turnover alone without preserved gross edge.

## TF-010 — Cross-lane redundancy and priority
Do not create another liquidity score. Reuse:
- Microstructure: spread, depth, execution state, implementation-shortfall semantics;
- Price-Volume: participation/acceptance states;
- Portfolio Risk: concentration/heat/cash attribution;
- existing trade state machine for FIRST/ADD/REDUCE.

Incremental Trading-Frictions fields should be limited to cost provenance, realized/modelled friction, turnover/churn, and KEEP-vs-TRADE counterfactual outcomes.

Highest-value next empirical target:
ABF REDUCE -> RECOVERY_WATCH -> RE-ADD path, because repeated reduction/re-entry has asymmetric taxes/commissions and whipsaw cost. This remains research-only until actual reduced shares/state provenance is trusted.

## Bias / governance audit
- selection bias: compare all eligible action opportunities, not only executed winners;
- look-ahead: cost assumptions and decision prices frozen at decision time;
- data snooping: fixed scenario ladder before outcome inspection;
- market-source bias: official tax rules separated from broker-specific fees;
- Factor Zoo/redundancy: no new generic liquidity/volume score;
- overfitting: no optimized no-trade threshold yet;
- coverage: implicit cost UNKNOWN without decision/fill/quote provenance;
- zero-pick: no effect; this lane does not alter selection;
- transaction costs: primary object of study, not an afterthought;
- date clustering: market date is an inference cluster;
- UNKNOWN: never coerced to zero.

## Exact next continuation
1. TF-011 audit current Worker/research schemas for existing commission/tax/slippage/turnover/action fields before proposing anything new.
2. TF-012 map which historical executed actions have trusted actual quantity/fill/fee provenance; quantify coverage only if exhaustive readout is proven.
3. TF-013 freeze a minimal research-only cost ledger and ACTUAL/MODELED/UNKNOWN semantics.
4. TF-014 define KEEP-vs-TRADE counterfactual for REDUCE and RE-ADD without hindsight.
5. TF-015 specify a prospective Shadow experiment and stopping/coverage gates.
6. Do not implement shared runtime or Formal behavior without governance classification/approval.


---

## TF-011 — Current schema audit: signal journal is not an execution-cost ledger

### Existing source capabilities verified
V8.5 trade journal currently records plan-level and signal-event data.

`v8_trade_journal_plans` includes:
- planned buy range / breakout / max-chase;
- stop / reduce / profit-check prices;
- allocation and planned share fields;
- priority score / reward-risk.

`v8_trade_journal_signals` includes:
- event time;
- signal type;
- position stage;
- market price observed at signal;
- signal amount / signal shares;
- episode / reason / instruction.

V8.1.2 position reconciliation separately stores:
- `actualShares`;
- `averageCost`;
- `firstEntryConfirmedAt`;
- `positionStage`.

V8.8 execution snapshots provide quote/execution-state research context.

### Critical gap
No first-class fields were found in these audited paths for:
- actual per-fill price;
- order/submission identifier;
- partial fills;
- actual buy/sell commission;
- actual transaction tax;
- broker rebates/refunds;
- realized implementation shortfall;
- actual per-action turnover/friction.

Position reconciliation proves a point-in-time holding state when filled in, but it is not an immutable fill ledger.

### Current performance metric semantics
`journalTradeStats()` explicitly:
- uses the first formal BUY signal's `market_price` as entry;
- uses the first later SELL or STOP_LOSS signal's `market_price` as exit;
- computes `(exitPrice-entryPrice)/entryPrice`;
- leaves ADD / REDUCE / PROFIT_CHECK in the event log but excludes them from the main win-rate return path.

Therefore existing `returnPct` is:
**formal signal-price gross return**, not verified fill return and not after-cost net return.

Rename conceptually in research:
- `signalGrossReturnPct`
not:
- `realizedReturnPct`
- `netReturnPct`.

No production rename is made in this research turn.

Status: CURRENT JOURNAL SEMANTICS AUDITED; NET-PERFORMANCE CLAIM PROHIBITED.

---

## TF-012 — Historical execution-cost coverage cannot currently be claimed complete

### Quantity / position provenance
V8.1.2 can hold actual shares, average cost and first-entry-confirmed time for current Formal positions, when they have been reconciled.

This supports:
- current position quantity;
- blended average cost;
- existence/time of confirmed first entry.

It does **not** reconstruct:
- each fill;
- each ADD;
- each REDUCE;
- each RE-ADD;
- sell-side fee/tax cash flow;
- partial fills/cancellations.

### Historical signal provenance
The trade journal contains historical Formal signal events, but signals are not fills.

### Coverage conclusion
Without an exhaustive broker/fill ledger:
- actual fill coverage = NOT_ESTABLISHED;
- actual fee/tax coverage = NOT_ESTABLISHED;
- historical implementation shortfall coverage = NOT_ESTABLISHED;
- historical action-level net return = UNKNOWN unless separately evidenced.

Do not quote a coverage percentage from convenience rows.

### What may be modeled
If a historical action has:
- reliable action date;
- side;
- quantity/notional;
- trade class;
- a pre-declared commission assumption/provenance,
then an explicit-cost **MODELED** estimate may be calculated.

It must never be upgraded to ACTUAL.

Status: HISTORICAL NET-COST COVERAGE UNKNOWN.

---

## TF-013 — Minimal research-only cost ledger and evidence semantics

### Identity
- eventId
- episodeId
- planScanDate
- tradeDate
- symbol
- pool
- actionType: FIRST / ADD / REDUCE / SELL / STOP_LOSS / RE_ADD
- side

### Decision / execution
- decisionAt
- orderSubmittedAt
- fillAt
- decisionPrice
- arrivalMid
- fillPrice
- shares
- lotType: REGULAR / ODD / UNKNOWN
- grossNotional

### Explicit cost
- commissionNTD
- transactionTaxNTD
- otherVerifiedFeeNTD
- explicitCostNTD
- taxClass: ORDINARY / VERIFIED_DAY_TRADE / OTHER / UNKNOWN

### Implicit cost
- spreadAtDecisionTicks
- spreadAtDecisionBps
- implementationShortfallNTD
- executionMarketState

### Evidence
For every field:
- source
- observedAt
- quality

Cost quality states:
- ACTUAL — directly evidenced from broker/fill/fee record;
- PARTIAL_ACTUAL — some realized fields, others missing;
- MODELED — formula/scenario with frozen assumptions;
- UNKNOWN — insufficient evidence.

### Episode aggregation
- cumulativeExplicitCostNTD
- cumulativeImplicitCostNTD
- frictionDebtNTD
- cumulativeTurnoverNTD

### Naming rule
Never place modeled and actual numbers into the same field without a provenance flag.

Status: MINIMUM COST LEDGER V1 FROZEN; SCHEMA ONLY, NO RUNTIME CHANGE.

---

## TF-014 — KEEP vs TRADE counterfactual for REDUCE and RE-ADD

The goal is to test whether position changes create value **after friction**, without hindsight.

### Decision-time freeze
At each legitimate REDUCE or RE-ADD decision:
- freeze current shares;
- decision price / contemporaneous executable proxy;
- current stop/risk state;
- sector/regime/liquidity state;
- reason for state transition;
- cost-quality state.

Future prices may be used only as outcomes.

### REDUCE comparison
**TRADE path**
- reduce the action-specified quantity;
- deduct actual/modeled friction;
- retain smaller residual position.

**KEEP path**
- retain the pre-reduction quantity;
- pay no reduction friction at that time.

Compare over fixed horizons:
- net P&L;
- MAE/MFE;
- drawdown;
- planned/stressed portfolio heat;
- loss avoided;
- upside forgone;
- friction debt created.

A REDUCE is not judged wrong merely because price later rises.

### RE-ADD comparison
**TRADE path**
- add the eligible quantity;
- deduct re-entry friction;
- measure added upside/downside.

**KEEP-REDUCED path**
- preserve reduced size.

Compare:
- incremental net P&L;
- recovery capture;
- additional MAE;
- whipsaw recurrence;
- total REDUCE→RE-ADD friction debt.

### Pairing rule
Pair on the same symbol, same episode and same decision timestamp.
Do not compare executed winners against unrelated non-trades.

Status: HINDSIGHT-FREE KEEP-vs-TRADE COUNTERFACTUAL FROZEN.

---

## TF-015 — Prospective Shadow experiment for action friction

### Cohort
Capture every Formal position/state that becomes eligible for the researched action opportunity:
- REDUCE opportunity;
- recovery watch;
- RE-ADD eligibility/opportunity;
- ADD opportunity where later studied.

Do not capture only executed or profitable cases.

### Primary outcomes
At frozen horizons D1/D3/D5/D10 and episode close:
- signal gross return;
- net-explicit result;
- net-all-in result where fill evidence exists;
- MFE / MAE;
- avoided loss;
- missed upside;
- frictionDebtNTD;
- turnoverNTD;
- stop / re-reduction event.

### Coverage report
Every run must publish:
- number of eligible action opportunities;
- ACTUAL / PARTIAL_ACTUAL / MODELED / UNKNOWN counts;
- missing decision/fill/fee fields;
- independent market dates;
- concentration by symbol/date.

### Pre-run guards
Do not infer benefit when:
- eligible-opportunity denominator is incomplete;
- action coverage is convenience-sampled;
- results are dominated by one market date/symbol;
- cost assumptions are selected after seeing outcomes;
- actual and modeled costs are mixed without labels.

The exact minimum sample/count thresholds must be frozen **before** the first inferential run, not invented after seeing results.

### Promotion gate
A live execution change requires:
- stable independent-date net benefit;
- acceptable drawdown/stop behavior;
- cost provenance adequate for the claim;
- no degradation hidden by gross returns;
- explicit owner approval because execution behavior is Formal Core.

Status: PROSPECTIVE SHADOW PROTOCOL V1 FROZEN.

---

## TF-016 — Commission/minimum-fee uncertainty is nonlinear at small notional

Current TWSE rules allow securities brokers to set transaction-amount fee schedules, discounts, and per-order minimum fees. The rules also require notification when a broker's rate exceeds 0.1425%.

Primary source:
- TWSE Operating Rules Article 94:
  https://twse-regulation.twse.com.tw/EN/law/DOC01_print.aspx?FLCODE=FL007304&FLNO=94

### Consequence
For a small odd-lot order, a fixed minimum fee can dominate basis-point cost.
For a larger order, the negotiated percentage rate may dominate.

Therefore the research engine should never use:
`commissionBps = constant`
as market truth.

### Scenario hierarchy when actual account fees are absent
1. ACTUAL broker statement if available;
2. broker-specific published/contracted schedule;
3. explicitly named sensitivity scenarios;
4. UNKNOWN.

No “standard commission” is silently substituted for user reality.

Status: FEE-UNCERTAINTY HIERARCHY FROZEN.

---

## TF-017 — Turnover must be decomposed by cause, not only totaled

Portfolio turnover can rise for very different reasons.

Research buckets:
- NEW_ENTRY_TURNOVER
- ADD_TURNOVER
- RISK_REDUCTION_TURNOVER
- STOP_EXIT_TURNOVER
- PROFIT_EXIT_TURNOVER
- RE_ADD_TURNOVER
- CHURN_TURNOVER
- REBALANCE_TURNOVER
- UNKNOWN_CAUSE

### Why
High turnover from timely stop exits is not economically equivalent to high turnover from repeated REDUCE→RE-ADD whipsaw.

### Episode metrics
- one-way turnover / capital;
- gross turnover / capital;
- same-symbol round-trip turnover;
- action count per episode;
- friction per NT$ turnover;
- gross edge per NT$ turnover;
- net edge per NT$ turnover.

Status: CAUSE-ATTRIBUTED TURNOVER FROZEN.

---

## TF-018 — Partial fills and cancel/replace break signal-price accounting

A Formal signal can occur once while execution happens through:
- no fill;
- partial fill;
- multiple fills;
- cancel/replace;
- delayed fill;
- different prices.

Therefore:
- signalShares != actualSharesFilled;
- signalTime != fillTime;
- signal marketPrice != volume-weighted fill price.

### Required realized execution unit
For multiple fills:
`VWAP_fill = sum(fillPrice_j * fillShares_j) / sum(fillShares_j)`

Keep:
- requestedShares;
- filledShares;
- unfilledShares;
- fillCount;
- firstFillAt;
- lastFillAt;
- cancelReplaceCount where evidenced.

### Urgency trade-off
More aggressive execution can reduce missed-opportunity risk but worsen spread/slippage.
Passive execution can reduce crossing cost but increase non-fill/adverse-selection risk.

No universal “limit order is cheaper” assumption.

Status: FILL-COMPLETENESS LAYER REQUIRED FOR REALIZED COST.

---

## TF-019 — Auction and odd-lot friction need separate treatment

Do not compare ordinary continuous-market fills directly with:
- opening call auction;
- closing call auction;
- intraday odd-lot call-auction mechanics;
- VI/trial/non-continuous states.

### Reason
Price formation, queue behavior, waiting time and fill probability differ structurally.

### Research cohorts
- REGULAR_CONTINUOUS
- REGULAR_OPEN_AUCTION
- REGULAR_CLOSE_AUCTION
- ODD_LOT_INTRADAY
- NON_CONTINUOUS_VI_TRIAL
- UNKNOWN

Existing microstructure state flags should be reused when available.

Status: MARKET-MECHANISM COST COHORTS FROZEN.

---

## TF-020 — Trading-frictions concept convergence

### What is research-ready now
Without changing runtime, existing data can support:
- signal-price gross outcomes;
- action counts;
- planned/signal turnover proxies;
- current position reconciliation state;
- explicit legal tax scenario modeling where trade class is known;
- KEEP-vs-TRADE counterfactual design.

### What remains evidence-blocked
Trusted realized net performance requires:
- actual fills;
- actual per-trade fees/tax or sufficiently verified broker accounting;
- exhaustive eligible-action denominator;
- adequate decision-time quote/execution provenance.

### Highest-value next evidence target
ABF REDUCE → RECOVERY_WATCH → RE-ADD remains the best first friction study because:
- the system already identified missed recovery as a practical problem;
- sell tax + re-entry commission/slippage make churn economically asymmetric;
- downside avoided and recovery captured can both be measured;
- it directly tests whether the new recovery-state concept adds net value rather than gross hindsight value.

### Lane status
Trading Frictions concept lane:
**CONCEPT_COMPLETE / EVIDENCE_PENDING**

Do not invent more cost indicators until fill/cost evidence improves.

Formal Core remains LOCKED.
No selection, BUY, ADD, REDUCE, RE-ADD, SELL, stop, capital, monitor or push behavior changed.

## Exact next continuation after TF-020

Open next genuinely under-studied lane:
**Event Risk, Gap Risk & Overnight Information**

First topics:
- overnight gap decomposition;
- earnings/revenue/major-announcement event windows;
- gap-through-stop risk;
- Taiwan price-limit carryover / multi-day exit constraints;
- weekend/holiday information accumulation;
- event-risk interaction with FIRST/ADD/FULL and portfolio heat;
- positive and counter evidence;
- point-in-time event calendar and no-look-ahead provenance.
