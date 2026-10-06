# Trading Frictions, Turnover & Rebalancing Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: TF-001 through TF-020 complete.
Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.
Next: Event Risk, Gap Risk & Overnight Information.

## Durable conclusions

- Explicit, implicit and opportunity costs are separate layers.
- Current Taiwan ordinary stock sell-side transaction tax is 0.3%; verified eligible same-day offsetting stock transactions use 0.15% through 2027-12-31. Broker commission discounts/minimum fees are account-specific and must not be guessed.
- Existing V8.5 trade-journal main performance return is formal signal-price gross return: first BUY signal market price to first later SELL/STOP_LOSS signal market price. It is not a verified fill return and not an after-cost net return.
- Existing plan/signal journal plus V8.1.2 position reconciliation provide useful plan, signal, actualShares, averageCost and first-entry-confirmed state, but no audited first-class per-fill commission/tax/slippage ledger was found.
- Historical actual fill/fee coverage remains NOT_ESTABLISHED; missing fields stay UNKNOWN.
- Minimal research-only cost ledger is frozen with ACTUAL / PARTIAL_ACTUAL / MODELED / UNKNOWN provenance.
- Gross, net-explicit and net-all-in outcomes must remain separate.
- FIRST/ADD staging has both friction and risk-control effects.
- REDUCE -> RE-ADD creates friction debt; evaluate against avoided downside, missed upside and recovery capture, not hindsight price alone.
- KEEP-vs-TRADE counterfactual is frozen at the exact decision timestamp/episode to prevent hindsight.
- Prospective action-friction protocol must capture all eligible action opportunities, not only executed winners.
- Commission/minimum-fee nonlinearity is especially relevant to small-notional/odd-lot trades.
- Turnover must be decomposed by cause; risk-reduction turnover and whipsaw churn are not equivalent.
- Signal events are not fills. Partial/multiple fills require actual fill quantity/time/VWAP semantics.
- Auction, odd-lot, VI/trial and normal continuous executions are separate cost cohorts.
- ABF REDUCE -> RECOVERY_WATCH -> RE-ADD is the highest-value first evidence target when actual reduced shares and cost provenance are trustworthy.
- No new cost indicator should be invented until evidence quality improves.
- Formal Core remains LOCKED; no live behavior changed.

## Exact next continuation

Open new durable lane: Event Risk, Gap Risk & Overnight Information.
Start with overnight gap decomposition, event windows, gap-through-stop risk, Taiwan price-limit carryover/multi-day exit constraints, weekend/holiday information accumulation, interaction with FIRST/ADD/FULL and portfolio heat, and point-in-time event provenance.


## PR-053 — net execution sizing evidence ladder cross-links Trading Frictions (2026-09-27)

Portfolio Risk must not invent a separate transaction-cost model. PR-053 reuses the existing Trading Frictions evidence hierarchy and turns it into a fail-closed claim-eligibility ladder.

A sizing sample can reach execution economics only after all non-cost prerequisites are positively established:
- selected-generation certification;
- positive durable Formal BUY signal;
- counterfactual orderability at the shared initial trigger;
- confirmed fill positively attributed back to the durable signal;
- same selected names and same planned deployment across allocator comparators;
- counterfactual execution rule frozen;
- untriggered planned capital explicitly remains cash;
- attributed terminal fill or a predeclared fixed execution horizon with valid mark.

Claim tiers are:
1. NOT_EXECUTION_ELIGIBLE;
2. GROSS_EXECUTION_SIZING_EDGE_ELIGIBLE;
3. NET_EXPLICIT_SIZING_EDGE_ELIGIBLE;
4. NET_ALL_IN_SIZING_EDGE_ELIGIBLE.

### Cost evidence remains component-wise

Commission, tax and slippage each retain:
`ACTUAL / PARTIAL_ACTUAL / MODELED / UNKNOWN`.

Rules:
- UNKNOWN commission is never zero;
- modeled commission/tax is never labeled ACTUAL;
- missing commission blocks NET_EXPLICIT and NET_ALL_IN;
- missing slippage may still allow NET_EXPLICIT when commission/tax are sufficiently specified, but blocks NET_ALL_IN;
- any modeled component prevents the label `ACTUAL_NET_EXECUTION`.

This deliberately separates:
`Can the arithmetic be computed?`
from
`How strong is the evidence behind the computed net result?`

### Current Production classification

Current Production has one durable positive BUY for 3006, but:
- its plan date is single-name and therefore non-identifying for allocator comparison;
- Confirmed Fill Ledger is not implemented;
- no attributed terminal fill exists.

So the strongest current sizing claim remains:
`NOT_EXECUTION_ELIGIBLE`.

Artifacts:
`research/net_execution_sizing_evidence_ladder_v0_1.mjs`;
`research/net_execution_sizing_evidence_ladder_spec_v0_1.json`.

Status:
`EVIDENCE_LADDER_FROZEN / CURRENT_PRODUCTION_NOT_EXECUTION_ELIGIBLE`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-054 — transaction-tax class must be positively evidenced (2026-09-27)

Portfolio Risk reuses Trading Frictions tax semantics and adds a fail-closed provenance classifier.

Evidence hierarchy:
- ACTUAL: broker statement/import or verified external record directly reports the tax amount;
- MODELED verified day-trade eligible: actual same-account, same-symbol, same-day buy+sell fills **plus** independently verified reduced-tax eligibility;
- MODELED ordinary stock sale: Taiwan stock sell fill plus positively false reduced-tax eligibility;
- UNKNOWN: eligibility/class is not positively evidenced.

The classifier deliberately does **not** contain a hard-coded tax rate. A modeled class still needs a date-valid official/broker rate source before tax NTD can be calculated.

Forbidden shortcuts:
- same-day BUY+SELL signals -> day-trade tax;
- same-day fills alone -> reduced tax;
- current legal rate applied backward without date validation;
- modeled tax labeled ACTUAL;
- UNKNOWN silently defaulted to ordinary or reduced rate.

This matters for sizing research because allocator changes can alter executed quantities while tax class is a separate transaction fact. Tax uncertainty must not be hidden inside a generic transaction-cost percentage.

Artifacts:
`research/transaction_tax_evidence_classifier_v0_1.mjs`;
`research/transaction_tax_evidence_classifier_spec_v0_1.json`.

Status:
`TAX_CLASS_PROVENANCE_FAIL_CLOSED / RATE_LOOKUP_SEPARATE`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-055 — commission provenance requires complete broker schedule semantics (2026-09-27)

Trading Frictions already rejects a universal commission assumption. PR-055 converts that rule into a fail-closed classifier for Portfolio Risk sizing research.

Evidence hierarchy:
- ACTUAL: charged commission directly evidenced by broker statement/import or verified external record;
- MODELED: broker-specific schedule is complete enough to reproduce the fee;
- UNKNOWN: anything less.

A MODELED fee requires all of:
- broker-specific rate;
- broker-specific minimum commission;
- verified calculation method;
- verified rounding policy;
- applicable execution channel;
- executed notional;
- verified schedule source.

The initial weaker idea that `rate + minimum` alone is sufficient was explicitly rejected before merge. It can be wrong when rounding, odd-lot/channel exceptions, promotions or other schedule mechanics differ.

For the currently implemented model, only the positively verified method:
`MAX_RATE_MINIMUM`
is accepted, with an explicit ROUND/FLOOR/CEIL/NONE policy.

### Sizing consequence

Alternative sizing can cross minimum-fee kinks, so equal total portfolio deployment does not imply equal incremental commission.

Forbidden:
- infer the owner's negotiated rate from a market reference threshold;
- invent a universal minimum;
- use planned/signal notional as ACTUAL executed notional;
- label modeled fees ACTUAL;
- convert UNKNOWN commission to zero.

Artifacts:
`research/commission_evidence_classifier_v0_1.mjs`;
`research/commission_evidence_classifier_spec_v0_1.json`.

Status:
`COMMISSION_PROVENANCE_FAIL_CLOSED / COMPLETE_BROKER_SCHEDULE_REQUIRED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## D14-RR-001 — REDUCE exists; native RE-ADD lifecycle does not (2026-09-28)

A current-main source audit falsified a hidden assumption in D14-11 / D15-11:

`REDUCE -> RE-ADD already exists as a Formal lifecycle.`

It does not.

Current runtime:
- can emit BUY;
- can emit ADD;
- can emit REDUCE;
- can emit SELL / STOP_LOSS;
- normalizes positionStage only to NONE / FIRST / FULL;
- contains no native RE-ADD signal type;
- contains no REDUCED / RE-ADD_ELIGIBLE runtime stage.

The signal-state store manages de-duplication/delivery state. It does not prove a broker fill or mutate the actual portfolio into a REDUCED state.

Therefore:
`REDUCE signal -> realized reduction -> REDUCED state -> RE-ADD fill`
must not be reconstructed from current signal rows.

### Friction accounting boundary

For a future completed same-symbol, same-quantity cycle with positively linked actual fills:

`gross timing capture = q × (reduce fill price - re-add fill price)`.

Explicit net timing capture can then subtract positively evidenced:
- REDUCE sell commission;
- REDUCE sell tax;
- RE-ADD buy commission.

If actual fill prices are used, realized slippage is already embedded in those prices. A second generic slippage subtraction would double count execution friction.

If signal/reference prices are used instead, any slippage assumption must be explicit and the result remains MODELED rather than ACTUAL.

Quantity mismatch is not simplified into the same identity; it requires inventory-aware accounting.

Artifacts:
`research/reduce_readd_friction_v0_1.mjs`;
`research/reduce_readd_friction_spec_v0_1.json`;
`tests/test_reduce_readd_friction_v0_1.mjs`.

Status:
`RUNTIME_READD_ABSENT / FRICTION_EVIDENCE_CONTRACT_READY / REALIZED_READD_ANALYSIS_BLOCKED`.

No Formal change and no FORMAL_OPTIMIZATION_CANDIDATE.


## D14-ML-001 — mechanism-aware mixed-lot receipt contract (2026-09-30)

D14-07 / D14-08 / D14-14 now have an isolated research receipt schema and deterministic validator.

### Two mechanism models are required

- Regular-lot intraday matching: `CONTINUOUS_WITH_BLOCK_INTERVALS`.
- Intraday odd-lot matching: `DISCRETE_MATCH_OPPORTUNITIES`.

The 2026-09-29 four-clock contract remains necessary, but two shortcuts were falsified:

1. after first eligibility, continuous elapsed time is not enough when a volatility interruption temporarily disables matching;
2. intraday odd-lot execution must not be represented as continuous eligible milliseconds between periodic call auctions.

For regular-lot fills, the receipt can derive:
`eligibleExposureToFill = scalarPostEligibilityLatency - evidenced mechanism-block overlap`.

For odd-lot fills, `eligibleExposureToFillMs` is intentionally null. The receipt instead counts:
- actual matching opportunities from decision through fill;
- opportunities after submission through fill;
- opportunities before submission;
- prior submitted opportunities without fill.

A prior unfilled call auction does not by itself prove the order was marketable or that execution quality was poor.

### Fail-closed provenance

The validator rejects:
- regular/odd benchmark mismatch;
- benchmark observed after submission;
- missing mechanism-state provenance;
- interruption without blocked interval;
- simulated disclosure used as fill;
- fill outside the submission lifecycle or inside a block;
- parent/leg quantity mismatch or overfill;
- overlapping/cyclic replacement lineage;
- duplicate fill IDs, including cross-leg;
- odd-lot fill not aligned to an evidenced matching opportunity.

Artifacts:
- `research/d14_mixed_lot_execution_receipt_v0_1.mjs`
- `research/d14_mixed_lot_execution_receipt_spec_v0_1.json`
- `research/d14_mixed_lot_execution_receipt_v0_1_20260930.md`
- `tests/test_d14_mixed_lot_execution_receipt_v0_1.mjs`

D14-07 / D14-08 / D14-14 remain **L2 / 40%**. Source and schema feasibility are not prospective multi-date evidence.

Exact next continuation:
capture at least three independent mixed-lot sessions with immutable decision, mechanism, submit and broker-fill provenance, then perform a readiness review. No automatic maturity promotion and no Formal change.

## D14-OC-001 — order-type choice mechanism + falsification contract (2026-10-03)

D14-15 now has a frozen research contract for market/limit and ROD/IOC/FOK choice under Taiwan matching semantics.

Durable boundaries:
- order type changes execution priority, persistence, partial-fill and non-fill exposure;
- no globally superior order type is assumed;
- conditional-on-fill price improvement is not sufficient evidence because non-fill opportunity cost and adverse selection must remain in the sample;
- opening/closing call auction, continuous regular-lot trading, volatility interruption and discrete odd-lot matching are separate mechanism cohorts;
- signal price, plan shares, push suggestedShares and simulated matches are never broker fills;
- realized execution claims require broker-confirmed fill provenance.

Falsified shortcuts:
- market order is always worse;
- filled limit order price improvement proves better execution;
- market order guarantees immediate full fill;
- close price can stand in for counterfactual execution;
- one order type can be declared optimal across names/regimes.

Artifact:
`research/d14_order_choice_contract_v0_1_20261003.md`.

Status:
`MECHANISM_FALSIFICATION_CONTRACT_FROZEN / TAIWAN_PIT_REPLAY_PENDING / FORMAL_CORE_UNCHANGED`.

D14-15 is L2 / 40%. Exact next continuation: collect at least three independent prospective Taiwan sessions with executed plus unexecuted/cancelled/rejected opportunities, mechanism-state provenance, deterministic replay and broker-confirmed fills. Three dates trigger readiness review only; no automatic L3 promotion.


## 00 routed H12 Room10 counterpart delta — 2026-10-04

H12 state:
`PARTIAL_EVIDENCE_RECEIVED / ROOM05_COMPLETE / ROOMS10_13_PENDING`.

Accepted Room05 evidence:
- `research/d06_securities_lending_economics_h12_v0_1.md`;
- `research/d06_18_borrow_fee_identifiability_rule_vintage_v0_1.md`.

Do not redo D06 borrowing/fee semantics.

Room10 remaining D14-19 delta:
- freeze short establish / maintain / recall / forced-buy-in / exit feasibility state machine;
- distinguish factual non-orderability from expensive/undesirable execution;
- only a strategy that requires a short may use factual inability to establish/maintain as strategy-specific HARD_INVALIDATION;
- borrow scarcity/fee cannot be re-scored as another Alpha vote;
- define PIT/replay clocks and divergent states;
- confirm capability boundary with ordinary long-only stock selection.

No Formal change is authorized by H12 research.


## 00 routed H02 exact remaining delta — 2026-10-04

H02 state:
`PARTIAL_EVIDENCE_RECEIVED / D14_17_UMBRELLA_CONTRACT_PENDING`.

Accepted:
- D14-03 Signal Price vs Fill Price measurement identity, L3/60%;
- D14-04 Slippage child metric family, L2/40%.

Do not repeat those child studies.

Room10 remaining D14-17 work:
1. define the full implementation-shortfall / market-impact ontology;
2. freeze decision/signal/arrival/benchmark/fill/VWAP identities;
3. decompose explicit cost, spread/slippage, market impact, delay, partial-fill and opportunity cost;
4. preserve ACTUAL / PARTIAL_ACTUAL / MODELED / UNKNOWN provenance;
5. define replay/schema ownership and D14-12 Execution Alpha downstream interface;
6. show whether D14-03/D14-04 are fully representable as child capabilities without semantic loss;
7. return MERGE_ELIGIBLE / KEEP_SEPARATE / EVIDENCE_INSUFFICIENT plus maturity map.

D14-17 remains L0/0 until its own mechanism/falsification contract is completed.


## D14-EX-001 — VWAP/TWAP/Participation execution scheduling contract (2026-10-06)

D14-16 now has a frozen mechanism/falsification contract.

Durable boundaries:
- TWAP is a deterministic time-slicing baseline, not a universal optimum.
- VWAP-style scheduling may use only a volume profile forecast known at decision time; realized future full-day volume is forbidden look-ahead.
- Participation scheduling adapts to observed eligible volume but can underfill when liquidity falls and can conflict with signal half-life.
- unfilled/cancelled/rejected/partial/expired quantity remains in the parent-order denominator;
- opening/closing auctions, continuous regular-lot, volatility interruption and discrete odd-lot matching remain separate mechanism cohorts;
- plan/signal/push/simulated match never become broker-confirmed fills;
- missing commission/tax/slippage/mechanism/fill provenance remains UNKNOWN;
- multiple schedule parameters/horizons/participation caps count as multiple tests;
- inference clusters by independent decision/session, not child order.

Ownership:
- D14-15 = order-type semantics;
- D14-16 = parent-to-child scheduling;
- D14-17 = implementation-shortfall / market-impact ontology;
- D14-18 = signal-decay / urgency.

Artifact:
`research/D14_16_VWAP_TWAP_PARTICIPATION_EXECUTION_CONTRACT_20261006_V0_1.md`.

Status:
`D14_16_MECHANISM_FALSIFICATION_CONTRACT_FROZEN / TAIWAN_PIT_REPLAY_PENDING / FORMAL_CORE_UNCHANGED`.

D14-16 advances to L2 / 40% for mechanism + falsification semantics only.
Exact next continuation: collect at least three independent prospective Taiwan sessions with immutable decision/mechanism/order lifecycle evidence, preserve unexecuted opportunities, and require broker-confirmed fills for realized execution claims. Three sessions trigger readiness review only; no automatic L3 promotion.

No Formal change and no FORMAL_OPTIMIZATION_CANDIDATE.


## D14-EX-002 — D14-17 implementation shortfall / market-impact contract freeze — 2026-10-06

Evidence: `research/D14_17_IMPLEMENTATION_SHORTFALL_MARKET_IMPACT_CONTRACT_20261006_V0_1.md`.

D14-17 now has a frozen mechanism/falsification contract:
- immutable parent-order identity and decision-time benchmark;
- delay, spread/price concession, market-impact, explicit fee/tax, and unexecuted opportunity-cost decomposition;
- filled-only survivor-bias firewall;
- market/sector/news alternative-explanation firewall for causal impact claims;
- same-day child-order clustering control;
- capital-scale/liquidity transportability warning;
- mechanism provenance for regular-lot, odd-lot, auction, interruption and limit states;
- broker-confirmed fills required for realized execution claims;
- PIT/OOS/walk-forward and multiple-testing controls;
- missing evidence remains UNKNOWN, never 0/BAD.

Boundary remains:
- D14-15 = order-type semantics;
- D14-16 = parent-to-child scheduling;
- D14-17 = implementation-shortfall / market-impact ontology and attribution;
- D14-18 = alpha decay / urgency.

D14-17 advances to L2 / 40% for mechanism + falsification semantics only.
Exact next continuation: collect at least three independent prospective Taiwan sessions with immutable decision/mechanism/order-lifecycle evidence, preserve unexecuted opportunities, use mechanism-matched benchmarks, and require broker-confirmed fills for realized execution claims. Three sessions trigger readiness review only; no automatic L3 promotion.
Formal Core unchanged. FORMAL_OPTIMIZATION_CANDIDATE: NONE.
