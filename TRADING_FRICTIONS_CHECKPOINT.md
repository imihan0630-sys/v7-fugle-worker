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
