# Credit / Capital Structure Checkpoint

Updated: 2026-10-04 03:20 Asia/Taipei
Scope: D22｜信用市場／資本結構／融資壓力／股債傳導
Status: ACTIVE_RESEARCH / D22-01 L3_WAITING_PANEL / D22-02 L2_ACTIVE / D22-03 L2_MECHANISM_DEFINED / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED

## Governance
- Canonical continuation checkpoint for D22.
- Separate D07 accounting leverage/cash-flow information, D11 corporate-action events and D13 macro/rate context from D22 contractual/credit information.
- Missing bond/rating/covenant/facility/source-time evidence remains UNKNOWN.
- Formal Core remains LOCKED.
- No outcome opening, threshold tuning, sign flipping, synthetic bucket splitting, historical Shadow fabrication or silent UNKNOWN coercion.

## D22-01｜Debt Maturity Wall / Refinancing Schedule
Level: L3 / 60%.

### Durable conclusion
Taiwan historical PIT maturity disclosures are replayable, but predictive value is not yet established.

### This-round falsification repairs
1. Entity scope: primary cross-issuer comparison now requires consolidated-group receipts. Prior Taiwan Cement parent-only receipt was replaced by consolidated data.
2. Accounting basis: each issuer/date must carry an explicit basis tag; D07 and D22 inputs cannot silently mix incompatible Taiwan-FSC vs IFRS-as-issued totals.
3. Double count: balance-sheet current financing and contractual <1y financing cash flow are alternate representations, not additive.
4. knownAt: audit/board authorization date is not automatically public first-known time.
5. Macro timing: same-calendar-date U.S. Treasury data may be future information in Taiwan time. Use the latest completed U.S. session known before the decision point.

### Revalidated issuer/date state
- TSMC 2023: contractual <1y financing NT$54,552m; carrying current financing NT$36,583m; source timing 2024-04-18.
- UMC 2023: contractual <1y financing NT$31,450,552k; carrying current financing NT$29,536,797k; official SEC-source availability no later than 2024-03-25; earlier public release UNKNOWN.
- Taiwan Cement 2023 consolidated: contractual <1y financing NT$36,718,292k; carrying current financing NT$36,895,130k; undrawn facilities NT$185,440,051k; exact public knownAt UNKNOWN.

### D07 / D13 prereg baseline status
- Compatible-basis D07 descriptive baselines are available for TSMC, UMC and Taiwan Cement.
- UMC D13: latest completed U.S. Treasury session 2024-03-22, 10Y 4.22%, 20-session change -4 bp; CBC 2.0%.
- TSMC D13: latest completed U.S. Treasury session 2024-04-17, 10Y 4.59%, 20-session change +29 bp; CBC 2.0%.
- Taiwan Cement remains outcome-timing blocked until public knownAt is proven.

### Outcome gate
OUTCOMES_CLOSED.
TSMC and UMC pass the current technical pre-outcome gates, but only two issuer/date rows from one reporting period exist. This is insufficient for OOS, walk-forward, independent-date, industry or regime evidence. D22-01 therefore waits on panel expansion rather than opening equity returns early.

### Durable files
- `research/d22_01_maturity_replay_v0_1.json`
- `research/d22_01_incremental_value_prereg_v0_1.json`
- `research/d22_01_scope_and_double_count_audit_v0_1.json`
- `research/d22_01_d07_baseline_readiness_v0_1.json`
- `research/d22_01_d13_baseline_readiness_v0_1.json`
- `research/d22_01_pre_outcome_eligibility_v0_1.json`

## D22-02｜Interest Coverage / Debt Service
Level: L2 / 40%.

### Mechanism
Interest coverage measures earnings capacity relative to financing cost. It complements D22-01: maturity timing and debt-service capacity are distinct.

### Strong counterevidence
- A universal ICR distress cutoff is prohibited; external evidence shows substantial firm/industry/time threshold heterogeneity.
- Fixed-rate debt can delay market-rate pass-through into interest expense.
- Reported finance costs can contain debt interest, lease interest and other finance costs; capitalized borrowing costs add another semantic layer.
- High ICR does not eliminate principal maturity risk; low ICR alone does not prove default.

### Taiwan PIT semantic examples
- UMC 2023: operating income / debt+lease interest = 39.28x; operating income / total finance costs = 36.86x.
- Taiwan Cement 2023 consolidated: operating income / debt+lease interest = 3.00x; operating income / total finance costs = 2.83x; capitalized interest NT$32,190k.

The ratio changes materially from denominator definition alone, so source-line taxonomy must be frozen before cross-company comparison or outcome opening.

### Durable file
- `research/d22_02_interest_coverage_contract_v0_1.json`

## D22-03｜Net Debt / Leverage Structure
Level: L2 / 40%.

### Durable conclusion
Mechanism, anti-double-count boundary and PIT component contract are frozen. D22-03 is not authorized to reuse D07 accounting leverage as an independent credit vote. Gross debt, unrestricted cash, restricted/pledged cash, lease liabilities and separately evidenced financing-like obligations are distinct components; derived net debt is not a source fact.

### Falsification firewall
- Missing restriction/accessibility evidence remains UNKNOWN.
- Negative net debt is not automatically low risk.
- Later financing actions are not backfilled into earlier statement states.
- Restatements append versions; first-known eligible data drives historical replay.
- If D22-03 adds no information after D07 + D22-01 + D22-02 + D13, classify REJECTED_OR_REDUNDANT.
- Outcomes remain CLOSED; no threshold search, sign optimization or historical Shadow fabrication.

### Durable file
- `research/d22_03_net_debt_leverage_structure_contract_v0_1.json`

## System-use status
- No D22-01 or D22-02 feature is authorized for System 1 or System 2 Formal use.
- Candidate state: FALSIFICATION_IN_PROGRESS.
- FORMAL_OPTIMIZATION_CANDIDATE threshold has NOT been reached.

## Exact next continuation
Primary active modules: D22-02 and D22-03.
1. collect multiple Taiwan non-financial issuer/date PIT interest-coverage receipts, including at least one additional industry and multiple dates;
2. freeze numerator/denominator taxonomy, negative EBIT, near-zero denominator, lease-interest, other-finance-cost and capitalized-interest handling;
3. build machine-readable ICR replay and compare accounting ICR vs cash-interest coverage vs D22-01 principal-inclusive debt service with outcomes closed;
4. promote D22-02 to L3 only after cross-industry Taiwan PIT replayability is demonstrated;
5. in parallel expand D22-01 multi-issuer/multi-date Historical PIT panel; do not open equity outcomes until independent-date evidence design is defensible.
