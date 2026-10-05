# Stock Selection Audit — Incremental Intake 2026-10-06 V0.2

Updated: 2026-10-06 Asia/Taipei
Status: INCREMENTAL_RESEARCH_RECEIPTS_INTAKEN / NO_TICKET_CLOSED
Owner: 00｜研究總控室
Formal Core impact: NONE

## Scope

Latest-main commits after the previous 00 intake were reviewed for whether they close an SDA delta, create a new blind-spot root cause, strengthen an existing firewall, or are unrelated to current SDA closure work.

Reviewed artifacts:
- research/d19_12_annual_calendar_knownat_receipt_20261006_v0_1.json
- research/d20_l4_prospective_coverage_ledger_v0_1.json
- research/room09_d12_d13_continuation_20261006_v0_1.md
- research/d07_18_wacc_cost_of_capital_foundation_v0_1.json
- System2 S2-07 bounded revision query-integrity artifacts

## SDA-019 — D20 behavioral-story / observable-identification risk

New accepted evidence:
- deterministic primary social sampling now has its first durable primary parent;
- D20-06 primary coverage = 1 eligible aggregate parent / 1 independent date;
- D20-11 primary coverage = 1 eligible narrative parent / 1 independent date;
- zero/low-engagement observations remain in the cohort;
- missed/rotation-disabled slots remain UNKNOWN and are not backfilled;
- D20-13 live borrow-rate/displayed-supply receipt count remains 0.

Audit interpretation:
- this is real prospective collection progress, not Alpha proof;
- current counts remain far below the preregistered 50-parent / 20-date gates;
- D20-13 remains source-blocked;
- behavioral residual value beyond D03/D06/D17 remains unproven.

Decision:
VALIDATION_PENDING / FIRST_PRIMARY_SOCIAL_PARENT_DURABLE / COVERAGE_AND_RESIDUAL_EVIDENCE_IMMATURE.

## SDA-018 — D19 factor zoo / survivorship / calendar-anomaly data mining

New accepted evidence:
- D19-12 obtains a bounded historical annual-calendar knownAt witness for effective year 2018;
- publication is observed no later than 2017-12-15;
- scheduled-holiday knownAt is therefore supported for that annual calendar;
- emergency/typhoon closure clock remains a separate event-specific problem.

Audit interpretation:
- one annual-calendar knownAt receipt does not validate a calendar anomaly;
- it narrows only the scheduled-holiday source-clock problem;
- it does not resolve factor-family multiplicity, D03/D09 redundancy, PIT industry membership, TPEx universe, costs or OOS incrementality.

Decision:
REMEDIATION_IN_PROGRESS / D19_12_SCHEDULED_CALENDAR_KNOWNAT_FIRST_RECEIPT / FACTOR_CHALLENGER_GATES_STILL_OPEN.

## SDA-013 — D13 macro vintage/timezone hindsight and D18 input duplication

New accepted evidence:
- source/reference date, publication/availability time, observation time and first eligible Taiwan decision remain separate clocks;
- U.S. Treasury observations carrying U.S. date 2026-10-05 are rejected for Taiwan 2026-10-05 18:10 merely from calendar-date equality;
- H.4.1, Treasury, CBC, TWSE and TAIFEX retain heterogeneous source clocks;
- no single market-date key is accepted as a safe cross-market join key.

Audit interpretation:
- this strengthens the SDA-013 clock firewall;
- canonical machine macroReceiptId/sourceVintage/releaseClock/exposure lineage is still missing across consumers;
- prospective first-eligible-Taiwan-decision receipts remain required.

Decision:
REMEDIATION_IN_PROGRESS / CLOCK_FIREWALL_DEEPENED / CANONICAL_RECEIPT_AND_PROSPECTIVE_TRANSPORT_PENDING.

## SDA-012 — D12 derivatives same-parent / roll / provenance risk

New accepted evidence:
- preserved 2026-10-02 16:39:21 TAIFEX afternoon Delta is correctly mapped to 2026-10-05 rather than treated as a same-day 2026-10-02 regular-session object;
- official 2026-10-05 regular-session TX/TXO data now make a same-effective-date research lane feasible;
- exact quote/reference clock, forward/spot, volatility, rate/dividend and new-series exclusions still must align on common contract support;
- aggregate participant option tables still do not identify exact signed dealer GEX.

Audit interpretation:
- this is useful PIT/provenance narrowing;
- it does not resolve protected H04/H11/COV-07 dependencies;
- missing model inputs remain UNKNOWN;
- no derivatives Alpha or independent vote is validated.

Decision:
BLOCKED_DEPENDENCY / SAME_EFFECTIVE_DATE_LANE_FEASIBLE / PROTECTED_GATES_AND_COMMON_SUPPORT_STILL_OPEN.

## D07-18 WACC cross-domain audit — no new ticket

The new D07-18 foundation is accepted as an anti-double-count contract:
- D13-06 owns the risk-free curve parent;
- D22-04 owns issuer debt-cost/refinancing parent;
- D07-06 supplies accounting leverage/balance-sheet primitives;
- D07-18 owns WACC/cost-of-capital composition;
- D08 may consume WACC as valuation context but must not re-score the same WACC move as another independent vote.

Blind-spot decision:
- do not create a new SDA ticket merely because WACC is a new module;
- WACC remains covered by SDA-008, SDA-013, SDA-021 and the global one-primitive/one-receipt-many-consumers guard;
- a Treasury/risk-free shock cannot become four confirmations by appearing in D13 risk-free, D22 debt cost, D07 WACC and D08 valuation.

Required future machine behavior if D07-18 reaches a system consumer:
- parentReceiptIds for risk-free, debt-cost, tax and capital-structure inputs;
- no independent evidence count from deterministic recomposition;
- modelVersion / betaWindow / ERP version / weight vintage;
- MODEL_UNSTABLE or UNKNOWN when reasonable model choices change sign/rank materially;
- D16 residual test before any independent Alpha promotion.

## System2 S2-07 query-integrity work

The new bounded revision query-integrity artifacts are valid System2 data-engineering progress.

Audit mapping:
- they do not satisfy SDA-017 Regime episode/support requirements;
- they do not satisfy SDA-016 shared holdout-consumption authority;
- therefore no SDA-016/017 ticket-state change is credited from S2-07 query-integrity work.

This prevents unrelated System2 progress from being accidentally counted as Regime/validation remediation.

## Formal isolation

No artifact reviewed here changes Formal A/B eligibility, ranking, Top6, weights, thresholds, capital, order lifecycle, notifications or production selection behavior.

Formal Core remains LOCKED.

## Exact next

1. Continue event-driven intake; do not re-research accepted D19/D20/D12/D13/D07 semantics.
2. SDA-019: accumulate primary scheduled social parents and first D20-13 live-source receipt; no backfill.
3. SDA-018: keep factor Challenger gates open; one scheduled-calendar knownAt witness is source-clock evidence only.
4. SDA-013: obtain prospective official U.S. rate/H.4.1 release receipts mapped to first eligible Taiwan decision and converge machine receipt lineage.
5. SDA-012: remain blocked behind H04/H11/COV-07 until owner/dependency conditions are actually resolved.
6. D07-18: reuse existing cross-domain primitive lineage; no new independent vote from WACC composition.
