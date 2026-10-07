# BR-071 — D09-12 Breadth-Regime D16 Handoff V0.1

Status: RESEARCH_ONLY / OUTCOME_BLIND_D16_HANDOFF / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-12
Observed main before write: 70dd4e9c928284b6f3f7feefbf9ef514aff94db3

Parent: BR-066 same-day breadth-regime joint receipt for 2026-10-07.

Independent unit = SAME_CLOCK_MARKET_DATE_RECEIPT.
Fields within one date are not independent observations.
The interaction must remain vector-valued: cap-weighted index direction, TWSE stock breadth, trend context, volatility direction, TPEx availability, and optional equal-weight/median context when certified.
Do not collapse the vector into one market-health scalar.

Preregistered descriptive cells include index-up/down crossed with breadth-positive/negative, trend-up/down crossed with breadth state, and volatility-expanding/contracting crossed with breadth state.
No winning cell is selected before outcomes.

D16 must freeze before predictive access:
- date-level dependence and serial correlation;
- same-clock source-completeness rules;
- TPEx missingness policy;
- common-support market/setup controls;
- no post-outcome relabeling;
- multiplicity across cells and horizons;
- redundancy tests against D09-04 standalone breadth and D18 standalone regime variables;
- POWER_INSUFFICIENT fail-closed behavior.

BR-066 and BR-040 share the same 2026-10-07 TWSE stock-direction evidence root; reuse does not create a second independent vote.

Current same-clock joint receipt N = 1.
Predictive outcomes opened by Room07 = 0.
Inference readiness = POWER_INSUFFICIENT.
D09-12 remains L3/60.

Exact next: Room11/D16 freezes the date-level interaction method; Room07 accumulates independent same-clock receipts under unchanged semantics; add TPEx/equal-weight/median context only when certified at the same clock; no L4 before prospective/OOS outcomes under the frozen method.

Formal Core unchanged.
