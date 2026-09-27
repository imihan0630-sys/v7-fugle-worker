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
