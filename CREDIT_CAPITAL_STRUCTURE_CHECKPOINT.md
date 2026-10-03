# Credit / Capital Structure Checkpoint

Updated: 2026-10-04 07:22 Asia/Taipei
Scope: D22｜信用市場／資本結構／融資壓力／股債傳導
Status: ACTIVE_RESEARCH / D22-01 L3 / D22-02 L3 / D22-03 L3 / D22-04 L2_ACTIVE / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED

## Governance
- Canonical continuation checkpoint for D22.
- GitHub latest main + tracker + dedicated evidence files are authoritative.
- Formal Core remains LOCKED.
- Missing evidence remains UNKNOWN; never coerce missing bond/rating/covenant/facility/trade/source-time data to zero, bad or pass.
- No equity-outcome opening, threshold search, sign flipping, synthetic maturity-bucket splitting, historical Shadow fabrication or latest-restatement backfill.
- D07 accounting primitives, D13 risk-free rates, D22 maturity/coverage/net-debt/debt-cost transforms are dependency-linked and must not become duplicate votes.

## D22-01｜Debt Maturity Wall / Refinancing Schedule
Level: L3 / 60%.
Status: WAITING_MULTI_ISSUER_MULTI_DATE_PANEL / OUTCOMES_CLOSED.

Durable conclusion:
- Taiwan issuer/date contractual maturity evidence is PIT-replayable.
- Carrying current debt and contractual maturity cash flows are alternate representations, not additive.
- Entity scope and accounting basis must be tagged.
- Total contractual obligations are not the financing wall.
- A maturity wall is exposure, not default prediction.
- Equity outcomes remain closed because the independent-date panel is still too small for OOS/walk-forward/regime claims.

Durable files:
- `research/d22_01_maturity_replay_v0_1.json`
- `research/d22_01_incremental_value_prereg_v0_1.json`
- `research/d22_01_scope_and_double_count_audit_v0_1.json`
- `research/d22_01_d07_baseline_readiness_v0_1.json`
- `research/d22_01_d13_baseline_readiness_v0_1.json`
- `research/d22_01_pre_outcome_eligibility_v0_1.json`

## D22-02｜Interest Coverage / Debt Service
Level: L3 / 60%.
Status: CROSS_INDUSTRY_MULTI_DATE_TAIWAN_PIT_REPLAY_VALIDATED / OUTCOMES_CLOSED.

Durable conclusion:
- Universal ICR distress thresholds such as 1.5x/2x/3x are prohibited without Taiwan cross-sector PIT evidence.
- Numerator/denominator source taxonomy matters: debt interest, lease interest, other finance cost, total finance cost and cash interest are distinct.
- Negative/near-zero EBIT or near-zero interest denominator requires explicit distress/undefined handling.
- High ICR does not eliminate a near-term principal maturity wall.

New multi-date replay:
- UMC 2023 and Taiwan Cement 2023 remain semantic cross-industry examples.
- Chunghwa Telecom 2023 official 20-F accepted 2024-04-17T06:05:47Z: operating income NT$46,353m, accounting interest expense NT$319m, accounting coverage about 145.31x.
- Chunghwa Telecom 2024 official 20-F accepted 2025-04-16T06:02:44Z: operating income NT$46,873m, accounting interest expense NT$339m, accounting coverage about 138.27x.
- The same issuer retains very high accounting coverage while its <1y financing maturity wall grows materially, proving D22-02 does not subsume D22-01.

Durable files:
- `research/d22_02_interest_coverage_contract_v0_1.json`
- `research/d22_02_interest_coverage_replay_v0_1.json`

## D22-03｜Net Debt / Leverage Structure
Level: L3 / 60%.
Status: TAIWAN_PIT_COMPONENT_REPLAY_VALIDATED / VERSION_LINEAGE_FROZEN / OUTCOMES_CLOSED.

Boundary:
- D07-06 owns accounting balance-sheet/leverage primitives.
- D22-03 owns credit/funding structure after liquidity-quality classification.
- Gross debt + cash primitives are shared receipts; D22-03 cannot count the same ratio again as a new credit vote.
- Net debt is derived, never a source fact.
- Restricted/pledged/unavailable cash remains separate or UNKNOWN.
- Carrying debt and D22-01 contractual maturity cash flow are not additive.

Divergent-state falsification:
- Chunghwa Telecom 2023: cash NT$33,824m; gross interest-bearing debt excl. lease about NT$32,685m; derived net debt about -NT$1,139m; contractual <1y financing about NT$2,200m; wall/cash about 6.5%.
- Chunghwa Telecom 2024: cash NT$36,260m; gross interest-bearing debt excl. lease about NT$32,415m; derived net debt about -NT$3,845m; contractual <1y financing about NT$9,200m; wall/cash about 25.4%.
- Headline net cash improved while near-term contractual financing concentration rose sharply. Therefore negative net debt is not sufficient evidence of low near-term refinancing pressure.

Third exact-known issuer:
- ASE Technology Holding 2023 first-known consolidated full-year state was publicly filed on 2024-02-01.
- First-known values include cash NT$67,284m; short-term borrowings NT$53,042m; current portion of bonds/long-term borrowings NT$28,616m; non-current bonds NT$20,489m; non-current long-term borrowings NT$81,365m; derived gross interest-bearing debt NT$183,512m and derived net debt NT$116,228m.
- Reported net-debt/equity ratio was 0.38; unused credit lines were NT$373,763m, but commitment/drawability quality is not assumed.

Version-lineage falsification:
- A later comparative filing retrospectively adjusted ASE 2023 short-term borrowings to about NT$37,737m.
- Historical replay preserves the 2024-02-01 first-known state and appends later revisions; it never backfills later restated values into the earlier state.

Durable files:
- `research/d22_03_net_debt_leverage_structure_contract_v0_1.json`
- `research/d22_03_net_debt_component_replay_v0_1.json`
- `research/d22_03_version_lineage_v0_1.json`

## D22-04｜Cost of Debt / Refinancing Risk
Level: L2 / 40%.
Status: MECHANISM_AND_FALSIFICATION_DEFINED / TAIWAN_SOURCE_ROUTE_FEASIBLE / OUTCOMES_CLOSED.

Ownership boundary:
- D13-06 owns sovereign/risk-free yield-curve state.
- D22-04 owns issuer-specific debt cost, refinancing spread/premium and repricing interaction with actually exposed debt.
- D07-18 owns the enterprise WACC composite and must not count the same rate/debt-cost shock again.

Frozen semantics:
- Legacy coupon != current market yield != prospective refinancing cost.
- Accounting effective cost is backward-looking and can be distorted by mix/timing/capitalized interest/lease/fees/FX.
- Market yield can embed credit, liquidity, option and technical effects; stale/no-trade observations remain UNKNOWN.
- Issuer spread requires currency/duration-consistent benchmark matching.
- Prospective refinancing cost is contingent on actual refinancing; cash repayment, pre-funding or channel changes can remove assumed rollover.

Taiwan source route:
- TPEx supports corporate-bond trade/quote data, yield/price files, reference rates, fair values and yield-curve files.
- The source route is feasible, but issuer-security-date clean replay has not yet passed L3.

Chunghwa Telecom mechanism example:
- Existing bonds carried very low legacy coupons around 0.42%-0.69%, including an NT$8.8bn 0.50% tranche maturing in July 2025.
- Low legacy coupon can keep historical interest expense low while saying little about the future replacement rate.
- The actual future refinancing rate remains UNKNOWN until a replacement transaction or PIT market proxy is defined.

Durable file:
- `research/d22_04_cost_of_debt_refinancing_risk_contract_v0_1.json`

## System-use status
- No D22-01 through D22-04 finding is authorized for System 1 or System 2 Formal use.
- Current candidate state: FALSIFICATION_IN_PROGRESS.
- FORMAL_OPTIMIZATION_CANDIDATE threshold has NOT been reached.

## Exact next continuation
Primary active module: D22-04.
1. build Taiwan corporate-bond issuer-security-date PIT debt-cost receipts from TPEx, tagging actual trade / quote / reference / fair-value provenance;
2. match each issuer/security yield to a currency- and remaining-maturity-consistent sovereign benchmark;
3. preserve no-trade/stale states as UNKNOWN;
4. construct research-only refinance-gap challengers: matched market yield minus legacy coupon/effective cost, interacted with D22-01 actually repricing principal;
5. test divergent states: stable benchmark + wider issuer spread; rising benchmark + stable spread; high maturity wall + cash repayment/no refinancing;
6. keep equity outcomes CLOSED until cross-issuer/multi-date replay and D13/D22-01/D22-02/D22-03 redundancy controls are ready;
7. in parallel continue D22-01~03 multi-date/version-lineage panel expansion.
