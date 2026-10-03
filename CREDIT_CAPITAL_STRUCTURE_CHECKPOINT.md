# Credit / Capital Structure Checkpoint

Updated: 2026-10-03 14:04 Asia/Taipei
Scope: D22｜信用市場／資本結構／融資壓力／股債傳導
Status: ACTIVE_RESEARCH / D22-01 L3_EVIDENCE / FORMAL_CORE_UNCHANGED

## Governance
- Canonical continuation checkpoint for D22.
- Separate accounting leverage (D07), corporate-action events (D11) and macro rates (D13) from market-implied / contractual credit risk.
- Missing bond/rating/covenant/facility evidence remains UNKNOWN; do not infer safety from absence.
- Contractual maturity is not expected maturity; disclosed buckets must be preserved as reported and must never be split into fabricated finer intervals.
- Formal Core remains LOCKED. D22 evidence is research-only until PIT/OOS/Prospective Shadow/cost/redundancy/multi-regime gates pass.

## D22-01 evidence checkpoint — 2026-10-03

### Maturity promotion
Research evidence supports D22-01 at L3 = Taiwan PIT data feasibility validated.
This promotion means only that historical issuer/date maturity evidence can be obtained, timestamped and replayed without look-ahead. It does NOT imply predictive alpha, trading value, or Formal eligibility.

### Mechanism frozen
Refinancing risk is not equivalent to accounting leverage. The research object is the interaction of:
1. financing maturity timing and concentration;
2. actually available liquidity and verified facilities;
3. refinancing channel availability;
4. refinancing cost / rate exposure;
5. contingent liquidity drains and supplier-finance concentration.

A high-leverage issuer with long fixed-rate maturities and ample liquidity can have lower near-term refinancing risk than a lower-leverage issuer with a concentrated 6–12 month maturity wall.

### PIT / replay evidence
Historical issuer/date receipts now support replay feasibility across at least:
- TSMC 2023: official 2023 Form 20-F, filed 2024-04-18; carrying long-term debt, current portion and contractual principal+interest maturity buckets differ materially. Long-term debt contractual payments: <1y NT$27,262m; 1-3y NT$227,952m; 3-5y NT$304,110m; >5y NT$583,364m. Total contractual cash obligations are dominated by non-financing purchase obligations, proving total contractual wall != financing maturity wall.
- UMC 2023: official 2023 Form 20-F filing announced 2024-04-25 plus archived annual financial statements; balance-sheet current classification and contractual undiscounted maturity cash flows are distinct semantics. Historical official archive path is independently replayable.
- Taiwan Cement 2023: official 2023 financial statements approved by the board 2024-02-27. Liquidity table uses earliest required repayment date and undiscounted cash flows including principal and estimated interest. Unused bank facilities at 2023-12-31 were NT$70,139,767k. Maturity rows separately disclose non-interest-bearing, lease, floating-rate and fixed-rate liabilities.

### Data semantics / anti-contamination rules
- Carrying amount != current classification != principal repayment schedule != contractual undiscounted cash flow.
- Total contractual obligations != financing maturity wall.
- Financing wall must distinguish interest-bearing short-term borrowings, current maturities of long-term debt, bonds and other financing obligations.
- Operating payables, purchase commitments, leases and contingent drains require separate classes; do not pool them into refinancing risk.
- Preserve raw reported maturity buckets.
- Common-support comparison may aggregate finer buckets upward; synthetic disaggregation of coarse buckets is forbidden.
- Later refinancing, extension, exchange, redemption or early repayment creates a new PIT state and must never rewrite an older state.
- Verified facility capacity must remain separate from cash. Facility amount without evidence on commitment, tenor, currency, covenant and draw conditions cannot be treated as fully cash-equivalent.
- Supplier finance / reverse factoring and derecognized-but-contingent payment obligations can create hidden liquidity drains; missing evidence stays UNKNOWN.

### Minimum replay schema
Per issuer/date receipt preserve:
- periodEnd
- publishedAt
- capturedAt
- knownAt
- sourceUrl / sourceType / documentVersion
- liabilityClass
- financingFlag
- amountSemantics
- rawMaturityBucket
- normalizedCommonSupportBucket
- amount
- currency / unit
- fixedFloatingUnknown
- verifiedFacilityAmount
- facilityQuality fields if disclosed
- contingentLiquidityDrain
- dataQuality / UNKNOWN reasons

### Falsification / failure conditions
- A maturity wall is exposure, not default prediction.
- Contractual maturity can differ materially from expected maturity.
- Financial institutions and non-financial corporates require separate comparability treatment.
- Apparent equity-credit lead/lag may be driven by common macro/rate/liquidity shocks rather than causal credit information.
- Sparse bond trading / stale quotes can create false spread signals.
- A facility headline may overstate usable liquidity.
- If D22-01 adds no information after D07 leverage/liquidity controls and D13 rate context, classify it REJECTED_OR_REDUNDANT rather than promote it.

### Pre-registered next-stage baseline before opening equity outcomes
No outcome optimization is authorized yet.
Baseline controls must be frozen before return labels are opened:
1. D07 baseline: net debt/leverage, interest coverage, cash/liquidity and operating cash flow controls available PIT.
2. D13 baseline: risk-free rate level/change and rate-regime context available PIT.
3. D22 challenger: financing maturity concentration, verified liquidity buffer quality, floating-rate repricing exposure, contingent liquidity drains.
4. Compare incremental information over baseline, not raw standalone correlation.
5. Use OOS / walk-forward / prospective Shadow only after replay table passes source/timestamp/reconciliation checks.
6. No threshold search, sign flipping, bucket tuning or outcome-informed feature definition.

### System-use status
- No D22-01 feature is authorized for System 1 or System 2 Formal use.
- Candidate status: FALSIFICATION_IN_PROGRESS.
- FORMAL_OPTIMIZATION_CANDIDATE threshold has NOT been reached.

## Durable artifacts added this round
- `research/d22_01_maturity_replay_v0_1.json`: machine-readable PIT replay seed created. TSMC 2023 and Taiwan Cement 2023 row-level amounts revalidated; UMC official historical source/version is revalidated but row values remain UNKNOWN pending row-level revalidation rather than being copied from memory.
- `research/d22_01_incremental_value_prereg_v0_1.json`: D07 + D13 baseline controls, common-support exposure, primary/secondary outcome horizons, test order and falsification gates frozen before outcome opening.

## Exact next continuation
Continue D22-01 from L3 toward L4:
1. revalidate UMC 2023 row-level contractual maturity amounts from the official source and populate the replay seed without memory carry-forward;
2. add capturedAt / immutable receipt hash semantics where supported;
3. complete double-count reconciliation between balance-sheet current portions and contractual maturity tables;
4. validate common-support <1y financing exposure and facility-quality UNKNOWN semantics across the three issuers;
5. audit D07 baseline PIT field readiness; block rather than impute missing controls;
6. only after the above gates pass, open outcomes once under the preregistered 60-trading-day max-drawdown primary horizon and run research-only OOS / walk-forward / prospective Shadow tests;
7. promote only if independent-date evidence survives redundancy, regime, industry/date-cluster, coverage, cost and overfit controls.
