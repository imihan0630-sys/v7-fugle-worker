# Credit / Capital Structure Research

Updated: 2026-10-04 00:24 Asia/Taipei
Scope: D22
Status: ACTIVE_RESEARCH / D22-01 L3_WAITING_PANEL / D22-02 L2_ACTIVE / D22-03 L2_MECHANISM_DEFINED / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED

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


## 2026-10-04 continuation｜D22-03 Net Debt / Leverage Structure

### Current maturity
L2 / 40% — mechanism and falsification defined; Taiwan PIT replay not yet validated.

### Mechanism boundary
D22-03 is not a duplicate of D07 accounting leverage. Its research object is financing structure after liquidity-quality classification: gross interest-bearing debt, cash-like offsets, restricted/pledged cash, lease liabilities, supplier-finance-like obligations when separately evidenced, and the maturity/rate/currency composition that determines whether a nominal net-debt number actually reduces refinancing stress.

A single net-debt scalar is therefore insufficient. The primary research representation is a vector with explicit provenance: gross debt; unrestricted cash/cash equivalents; restricted or pledged liquidity; lease liabilities; separately identified financing-like obligations; and scope/basis/knownAt metadata. Net debt is a derived view, never a source fact.

### Support and counterevidence
- Support: structural credit evidence identifies leverage, recovery assumptions and the risk-free rate as material default-risk inputs; firm-exit evidence also finds short-term debt and weak earnings-to-interest capacity jointly important. This supports studying leverage structure together with D22-01/D22-02 rather than as a standalone ratio.
- Counterevidence: high cash does not automatically neutralize solvency or refinancing risk; liquidity can be trapped, pledged, operationally necessary, foreign-subsidiary constrained, or simply small relative to a near-term maturity wall. Conversely, gross leverage can overstate pressure when unrestricted liquidity and committed refinancing capacity are genuinely available.
- Alternative explanation: apparent predictive power can be inherited from D07 leverage/profitability, D22-01 maturity concentration, D22-02 interest coverage, D13 rates, industry capital intensity, or distress-induced cash hoarding. Incremental tests must control these before D22-03 can claim unique value.
- Failure condition: if the structured representation adds no incremental information after D07 + D22-01 + D22-02 + D13, classify REJECTED_OR_REDUNDANT rather than adding another vote.

### PIT / data contract frozen at mechanism stage
1. Every issuer/date observation must preserve statement scope, accounting basis, fiscal period, publication/filing knownAt, and source version.
2. Cash offset must distinguish unrestricted cash/cash equivalents from restricted/pledged balances when evidence permits; missing restriction evidence is UNKNOWN, never assumed unrestricted.
3. Lease liabilities and other financing-like obligations must remain separate components until a preregistered construct defines inclusion. No silent denominator or debt-definition switching.
4. Negative net debt is not automatically LOW_RISK; it may coexist with weak operations, covenant risk, maturity concentration or inaccessible cash.
5. Restatements/reclassifications append a new version. Historical replay uses the first-known eligible version, not the latest revised statement.
6. Corporate actions and major financing transactions require event-time lineage; period-end statements cannot be backfilled with later issuance/repayment knowledge.
7. Financial firms are excluded from the initial comparability lane because deposits/regulatory capital make industrial net-debt semantics non-comparable.

### Validation gates before L3+
- L3: multiple Taiwan non-financial issuers across industries and dates with source-attested knownAt and component replay.
- L4: preregistered OOS or prospective Shadow evidence, with walk-forward splits and no historical Shadow fabrication.
- L5: multi-regime robustness, costs, missingness/coverage, industry/date clustering, multiple-testing/data-mining controls, factor redundancy and stability of component definitions.

### Outcome gate
OUTCOMES_CLOSED. No equity return join, threshold search, sign optimization or ranking experiment was opened in this continuation.

### System-use status
Candidate state remains FALSIFICATION_IN_PROGRESS. Formal Core remains LOCKED. No FORMAL_OPTIMIZATION_CANDIDATE is created at L2.

### Exact next continuation
1. Build D22-03 Taiwan PIT component contract and bounded replay receipts for at least three non-financial issuers spanning at least two industries and more than one reporting date.
2. Explicitly test unrestricted-cash vs total-cash offset, lease-liability inclusion, and gross-debt vs net-debt views without outcomes.
3. Continue D22-02 cross-industry interest-coverage replay and D22-01 multi-date maturity panel in parallel; do not open stock outcomes.

## 2026-10-04 07:43 continuation｜D22-02 / D22-03 promotion + D22-04 launch

### D22-02 current maturity
L3 / 60% — cross-industry, multi-date Taiwan PIT replay validated; outcomes remain CLOSED.

New durable replay:
- `research/d22_02_interest_coverage_replay_v0_1.json`
- Chunghwa Telecom adds telecom-sector evidence and two independently timestamped annual states (2023 and 2024).
- 2023 accounting coverage: operating income NT$46,353m / interest expense NT$319m ≈ 145.31x.
- 2024 accounting coverage: operating income NT$46,873m / interest expense NT$339m ≈ 138.27x.
- Very high coverage coexists with a larger <1y maturity wall in 2024, so interest coverage and maturity timing remain distinct evidence families.

### D22-03 current maturity
L3 / 60% — Taiwan PIT component replay validated; outcomes remain CLOSED.

New durable files:
- `research/d22_03_net_debt_component_replay_v0_1.json`
- `research/d22_03_version_lineage_v0_1.json`

Key falsification:
Chunghwa Telecom 2023→2024 improved from derived net debt about -NT$1.139bn to -NT$3.845bn, while contractual <1y financing rose from about NT$2.2bn to NT$9.2bn and <1y wall/cash from about 6.5% to 25.4%. Negative net debt therefore cannot be used as sufficient evidence of low near-term refinancing pressure.

ASE Technology Holding supplies a third exact-known issuer state:
- 2024-02-01 first-known consolidated FY2023 release;
- cash NT$67,284m;
- short-term borrowings NT$53,042m;
- current portion bonds/long-term borrowings NT$28,616m;
- non-current bonds NT$20,489m;
- non-current long-term borrowings NT$81,365m;
- derived gross interest-bearing debt NT$183,512m;
- derived net debt NT$116,228m;
- reported net-debt/equity ratio 0.38;
- unused credit lines NT$373,763m, with commitment/drawability quality left UNKNOWN.

Version-lineage firewall:
A later filing retrospectively adjusted ASE's 2023 short-term borrowings to about NT$37,737m. Historical replay preserves the 2024-02-01 first-known value and appends the later revision. Latest-restated history must never overwrite first-known PIT state.

### D22-04 current maturity
L2 / 40% — debt-cost / refinancing-risk mechanism, anti-double-count boundary, Taiwan source route and falsification contract defined; issuer-specific market-yield replay still pending.

Durable file:
- `research/d22_04_cost_of_debt_refinancing_risk_contract_v0_1.json`

Ownership:
- D13-06 owns sovereign/risk-free curve;
- D22-04 owns issuer-specific debt-cost / refinancing spread / repricing interaction with exposed debt;
- D07-18 owns enterprise WACC composite.

Key semantic firewall:
legacy coupon != accounting effective cost != current market yield != issuer spread != prospective refinancing cost.

Taiwan source feasibility:
TPEx offers bond trade/quote files, yield-price files, fair values and daily corporate-bond reference/yield-curve data. No-trade or stale observations remain UNKNOWN.

Mechanism example:
Chunghwa Telecom's existing bonds carry legacy coupons around 0.42%-0.69%, including an NT$8.8bn 0.50% tranche maturing July 2025. That legacy coupon is not a forward refinancing quote. Replacement cost remains UNKNOWN until an actual funding transaction or valid PIT market proxy is observed.

### Combined research status
D22-01 L3 / D22-02 L3 / D22-03 L3 / D22-04 L2.
Equity outcomes remain CLOSED.
Formal Core remains LOCKED.
No FORMAL_OPTIMIZATION_CANDIDATE exists yet.

### Exact next continuation
1. Build D22-04 issuer-security-date TPEx debt-cost receipts with actual trade / quote / reference / fair-value provenance.
2. Match duration and currency to the sovereign benchmark; no simple maturity-mismatched subtraction.
3. Construct research-only refinancing-gap challengers and interact only with D22-01 principal actually exposed to repricing.
4. Test benchmark-vs-spread divergent states and no-refinancing/cash-repayment counterfactuals.
5. Continue D22-01~03 multi-date/version-lineage panel expansion while outcomes stay closed.

