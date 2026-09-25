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
