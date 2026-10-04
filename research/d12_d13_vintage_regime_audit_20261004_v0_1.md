# D12/D13 vintage and regime audit — 2026-10-04

Status: RESEARCH_ONLY / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED
Continuation: after DR-069 / MC-156.

## MC-157 H.4.1 reserve-regime guard
Federal Reserve July 2026 Monetary Policy Report says reserves around USD 3.1tn remained ample after reserve-management purchases. Federal Reserve 2026 research shows distributional frictions may emerge before aggregate reserves become scarce. A fixed aggregate reserve threshold is therefore not portable across regimes. Preserve aggregate quantity plus money-market/distribution controls.

## MC-158 H.4.1 statistic identity
The 2026-10-01 H.4.1 reports week-average Reserve Bank credit down USD 9.604bn, reverse repos up USD 13.117bn, and deposits other than reserve balances down USD 42.806bn; Wednesday stocks are separate observations. Future receipts must preserve series identity, statistic/frequency, reference date and release date. Do not splice week averages and Wednesday stocks or reduce the table to one balance-sheet-change score.

## MC-159 CBC BOP population guard
CBC Q1 2026 BOP: nonresident portfolio investment net asset decrease USD 25.34bn, mainly reduced Taiwanese equities. Q2: nonresident portfolio investment net asset increase USD 1.90bn, mainly holdings of corporate bonds issued overseas by Taiwanese firms. The same BOP heading can change instrument/location composition across quarters. It is not equivalent to daily TWSE foreign equity flow.

## MC-160 prospective BOP schedule
CBC Q2 release dated 2026-08-20 schedules the next BOP release for 2026-11-20 16:20 Taipei. A schedule-only prospective receipt is valid; future realization remains UNKNOWN until observed after publication.

## MC-161 CBO projection-vintage falsification
CBO February 2026 baseline used trade policy as of 2025-11-20, economic developments/laws as of 2025-12-03 and budget-law cutoff 2026-01-14. CBO August 2026 later reported that tariff-policy changes following a Supreme Court decision increased projected 2027-2036 deficits by USD 0.9tn versus the February baseline. Structural projections are assumption-dependent vintages. Revision deltas must separate changed policy/law assumptions from changed economic estimates.

## MC-162 Taiwan transmission sign remains unidentified
Tariff changes can alter U.S. demand, trade diversion, sector margins, USD/rates and fiscal expectations simultaneously. No scalar tariff direction is identified. Required controls include exposed versus diversion sectors and rates/USD/global-equity states.

## DR-070 TAIFEX Delta effective-date guard
TAIFEX states 06:45 discloses current-day tradable-series Delta; 14:30/16:30 pre-disclose next-business-day Delta. A pre-18:10 afternoon file is known information but not current-session market state. Preserve publication timestamp and effective trading date separately.

## DR-071 dealer-Gamma partial identification
Series-level Greeks plus participant-class aggregate Call/Put positions do not identify strike-expiry-position-side dealer inventory. Signed dealer GEX remains UNKNOWN without joint inventory evidence. Only unsigned concentration or explicitly assumption-bounded scenarios are admissible at this stage.

## Validation and maturity
No Taiwan outcomes inspected. PIT, independent dates, OOS/walk-forward and prospective Shadow remain required. Missing evidence stays UNKNOWN.
D12 remains 40.0%. D13 remains 41.1%. No L3 promotion.
FORMAL_OPTIMIZATION_CANDIDATE = NONE. Formal Core LOCKED.

## Exact next continuation
1. Preserve a schedule-only CBC BOP 2026-11-20 16:20 receipt; realization UNKNOWN.
2. Preserve future H.4.1 series-specific vintages.
3. Continue CBO assumption-cutoff/legal-policy vintage lineage.
4. Acquire a permitted raw TAIFEX option-chain parent with publication/effective/session identities.
