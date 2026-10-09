# Room11 BR074 D16 method receipt — 2026-10-10

Status: RESEARCH_ONLY / METHOD_FROZEN / OUTCOMES_CLOSED / POWER_INSUFFICIENT
Request: research/BR074_D09_04_D16_VALIDATION_DEPENDENCY_REQUEST_20261008.md
Independent unit: one official TWSE market-date breadth root. N=3 (2026-10-02, 07, 08). No stock, horizon, sector or consumer multiplies date N.

Estimand: TWSE breadth = (advancers - decliners)/(advancers + decliners + unchanged). Unmatched and N/A are excluded with explicit reason counts. Predictive question, not yet tested: incremental date-level association with later official-session benchmark returns D5/D20/D60 conditional on PIT-safe frozen baseline. No causal or trading claim.

Primary date weights: equal across unique official sessions. D5/D20/D60 form one multiple-testing family; overlapping labels require chronological purging and date/episode dependence-aware inference. The market-date, source hash, availableAt, decision clock, official-session calendar and label maturity must be bound before outcomes.

Common support: same-cut index trend, D09-05 above-MA, D09-10 concentration, D09-12 breadth×regime, and D18 context only when their PIT source receipts exist. Missing TPEx means TWSE-only, not Taiwan-wide. D18-04 U2B readiness cannot be inherited from aggregate breadth. Missing result stays UNKNOWN, never 0.

Finite-sample falsification (synthetic arithmetic only): three hypothetical exchangeable symmetric date-level differences admit 2^3=8 sign flips. Minimum one-sided exact p=0.125, two-sided p=0.25; neither reaches 5%. This test is invalid without exchangeability/symmetry. Five one-sided or six two-sided dates only permit p-resolution below 5% under ideal assumptions, not adequate power. Seven deterministic arithmetic assertions passed; no market outcomes were opened.

Mechanism: breadth could add state information beyond cap-weighted index trend.
Falsification: frozen, cost-consistent common-support and exposure-matched controls across multiple independent episodes.
Alternatives: trend, liquidity, sector concentration, volatility, event-related missingness.
Failure: future source, inconsistent denominator, selected horizon, repeated date, unknown imputed zero, one-episode dominance or unmatched costs.

Disposition: BR074_D16_METHOD_RECEIPT=FROZEN; D09_04_PREDICTIVE_OUTCOME_ACCESS=CLOSED; POWER_INSUFFICIENT=TRUE; FORMAL_OPTIMIZATION_CANDIDATE=NONE.
Next: Room07 appends independent official dates outcome-blind. Room11 audits real clock/coverage/episode independence and freezes label+test plan before outcome access. D18-06 official TRI market-level L3 acceptance remains distinct from blocked security-level S0/S1 effective-denominator evidence; reconcile tracker without promoting S0/S1.
