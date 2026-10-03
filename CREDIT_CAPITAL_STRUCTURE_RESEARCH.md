# Credit / Capital Structure Research

Updated: 2026-10-03 19:03 Asia/Taipei
Scope: D22
Status: ACTIVE_RESEARCH / D22-01 L3_WAITING_PANEL / D22-02 L2_ACTIVE / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED

## D22-01｜Debt Maturity Wall / Refinancing Schedule

### Current maturity
L3 — Taiwan PIT data feasibility validated.

This means issuer/date contractual maturity evidence can be obtained, timestamped and replayed. It does not imply predictive alpha or Formal eligibility.

### Durable mechanism
Refinancing pressure is not accounting leverage. It depends on financing maturity timing/concentration, liquidity quality, refinancing channels, funding-cost/rate exposure, and contingent liquidity drains.

### 2026-10-03 scope / timing / double-count falsification
The replay seed exposed three data hazards before outcomes were opened:
1. Entity-scope contamination: the earlier Taiwan Cement receipt was parent-only while TSMC and UMC were consolidated. The primary cross-issuer replay now requires consolidated-group scope.
2. Double counting: balance-sheet current financing and contractual <1y financing cash flow are alternate representations. Never add them.
3. Same-calendar-date macro look-ahead: a U.S. Treasury yield observed after Taiwan information time cannot be used merely because the calendar date matches. D13 uses the latest completed U.S. session known before the Taiwan decision point.

### Revalidated replay state
- TSMC 2023: consolidated, IFRS-as-issued Form 20-F. Contractual <1y financing cash flow NT$54,552m; carrying current financing NT$36,583m. Source timing 2024-04-18.
- UMC 2023: consolidated, Taiwan-FSC-endorsed IFRS. Contractual <1y financing cash flow NT$31,450,552k; carrying current financing NT$29,536,797k. Official SEC-source availability verified no later than 2024-03-25; earlier public release remains UNKNOWN.
- Taiwan Cement 2023: consolidated scope repaired. Contractual <1y financing cash flow NT$36,718,292k; carrying current financing NT$36,895,130k. Undrawn financing facilities NT$185,440,051k; facility commitment/drawability quality is not assumed. Public first-known timestamp remains UNKNOWN.

### Baseline readiness
D07 descriptive baselines are now frozen on compatible accounting bases for TSMC, UMC and Taiwan Cement.
D13 rate baseline timing is frozen for currently timing-eligible rows:
- UMC: latest completed U.S. Treasury session before Taiwan decision point = 2024-03-22, 10Y 4.22%; 20 U.S.-session change = -4 bp; CBC discount rate = 2.0%.
- TSMC: latest completed U.S. Treasury session before the filing timestamp = 2024-04-17, 10Y 4.59%; 20 U.S.-session change = +29 bp; CBC discount rate = 2.0%.

### Outcome gate
Equity outcomes remain CLOSED.
TSMC and UMC pass the currently defined scope/basis/double-count/D07/D13 timing gates, but two issuer/date observations from the same reporting year cannot support OOS, walk-forward, independent-date, industry or regime claims.
Taiwan Cement remains timing-blocked until a public knownAt is proven.
The correct next move is panel expansion, not opening returns early.

### Durable files
- `research/d22_01_maturity_replay_v0_1.json`
- `research/d22_01_incremental_value_prereg_v0_1.json`
- `research/d22_01_scope_and_double_count_audit_v0_1.json`
- `research/d22_01_d07_baseline_readiness_v0_1.json`
- `research/d22_01_d13_baseline_readiness_v0_1.json`
- `research/d22_01_pre_outcome_eligibility_v0_1.json`

### Current status
L3 / WAITING_MULTI_ISSUER_MULTI_DATE_PANEL / OUTCOMES_CLOSED / FALSIFICATION_IN_PROGRESS.

No System 1 or System 2 Formal change is authorized.

## D22-02｜Interest Coverage / Debt Service

### Current maturity
L2 — mechanism and falsification contract defined.

### Mechanism
Interest coverage measures earnings capacity relative to financing cost. It complements D22-01 rather than replacing it: D22-01 asks when principal/financing cash flows mature; D22-02 asks whether earnings or cash generation can absorb financing cost. Fixed-rate debt can delay rate pass-through, while floating-rate or near-refinancing debt can transmit higher market rates faster.

### Counterevidence / threshold firewall
A single universal threshold is forbidden. External firm-level evidence shows the same ICR can map to different default rates across industries, firms and time. Therefore 1.5x/2x/3x cannot become a Taiwan hard gate without PIT cross-sector validation.

### Taiwan semantic evidence
UMC 2023:
- operating income NT$57,890,661k;
- debt + lease interest NT$1,473,729k;
- total finance costs NT$1,570,374k;
- operating-income / debt+lease-interest = 39.28x;
- operating-income / total-finance-costs = 36.86x.

Taiwan Cement 2023 consolidated:
- operating income NT$10,030,160k;
- bank borrowing interest NT$1,764,108k;
- corporate bond interest NT$1,459,152k;
- lease interest NT$125,315k;
- other finance costs NT$194,109k;
- total finance costs NT$3,542,684k;
- capitalized interest NT$32,190k;
- operating-income / debt+lease-interest = 3.00x;
- operating-income / total-finance-costs = 2.83x.

The examples establish that numerator/denominator taxonomy can materially alter the ratio. "Finance costs" cannot be treated as a universal plug-in denominator without source-line provenance.

### Falsification rules
- Negative/near-zero EBIT and near-zero interest expense require explicit handling; naive ranking is forbidden.
- Capitalized borrowing cost is recorded separately; do not mechanically add it back without a preregistered construct.
- Interest income is not netted against debt interest unless a separate net-interest construct is explicitly tested.
- A high ICR can coexist with a large principal maturity wall; a low ICR can be temporary or buffered, subject to evidence.
- Entity scope and accounting basis must match the D22-01 firewall.
- If D22-02 adds no information after D07 operating cash flow/leverage and D22-01 maturity timing, classify it REJECTED_OR_REDUNDANT.

### Durable file
- `research/d22_02_interest_coverage_contract_v0_1.json`

### Exact next continuation
1. Build issuer/date PIT interest-coverage replay receipts for at least one additional non-financial industry and multiple dates.
2. Freeze treatment of negative EBIT, near-zero denominators, lease interest, other finance costs and capitalized interest.
3. Compare accounting ICR, cash-interest coverage and D22-01 principal-inclusive debt-service coverage while equity outcomes remain closed.
4. Promote D22-02 to L3 only after Taiwan cross-industry PIT replayability is demonstrated.
5. In parallel, expand D22-01 to multiple issuer/date states; do not open outcomes until a defensible independent-date panel exists.
