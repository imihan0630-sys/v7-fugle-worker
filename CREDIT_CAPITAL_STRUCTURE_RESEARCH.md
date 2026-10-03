# Credit / Capital Structure Research

Updated: 2026-10-03 14:04 Asia/Taipei
Scope: D22
Status: ACTIVE_RESEARCH / D22-01 L3_EVIDENCE / FORMAL_CORE_UNCHANGED

## D22-01｜Debt Maturity Wall / Refinancing Schedule

### Research question
Can contractual financing-maturity structure provide incremental Taiwan-equity information beyond D07 accounting leverage/liquidity controls and D13 rate context?

### Current maturity
L3 — Taiwan PIT data feasibility validated.

This means historical issuer/date maturity evidence can be obtained and replayed with first-known timing. It does not mean predictive alpha, trading usefulness or Formal eligibility has been established.

### Positive mechanism
Near-term refinancing pressure can differ materially from static leverage because timing, funding-cost repricing, liquidity quality, facility availability and contingent drains interact. A highly levered issuer with long fixed-rate debt and strong liquidity can have lower near-term refinancing pressure than a less levered issuer facing a concentrated maturity wall.

### Strong falsification findings
1. Total contractual obligations are not a refinancing wall.
2. Balance-sheet carrying amount, current classification, principal schedule and contractual undiscounted cash flow are distinct semantics.
3. Operating payables, purchase commitments, leases and contingent drains can dominate gross contractual outflows and contaminate a refinancing factor.
4. Contractual maturity is not expected maturity; early repayment, refinancing, exchange, extension or redemption must create a new PIT state rather than rewrite old history.
5. Unused facilities are not automatically cash-equivalent; commitment quality, tenor, currency, covenants and draw conditions matter.
6. If D22 adds no value after D07 and D13 controls, it must be classified REJECTED_OR_REDUNDANT.

### Historical PIT evidence now established
- TSMC 2023 official Form 20-F filed 2024-04-18: contractual long-term debt payments differ from carrying/current amounts; non-financing purchase obligations dominate total contractual obligations.
- UMC 2023 official Form 20-F filing announced 2024-04-25 and archived annual-report/financial-statement paths remain available.
- Taiwan Cement 2023 official financial statements approved 2024-02-27: maturity table uses earliest required repayment date and undiscounted principal+estimated interest; unused bank facilities are separately disclosed.

### Common-support rule
- Preserve each issuer's raw maturity buckets.
- Finer buckets may be aggregated upward to a coarser common support.
- Coarse buckets must never be synthetically split into finer intervals.
- Cross-issuer comparisons must use only intervals directly supported by all compared issuers.

### Outcome gate
Equity outcomes remain CLOSED until the following are frozen:
- D07 PIT baseline controls;
- D13 PIT rate baseline;
- outcome horizon(s);
- issuer/date sampling frame;
- common-support mapping;
- double-count reconciliation;
- facility-quality semantics.

No threshold search, sign flipping, post-hoc bucket tuning or outcome-informed feature definition is permitted before OOS / walk-forward / prospective Shadow testing.

### Current candidate status
FALSIFICATION_IN_PROGRESS

No System 1 / System 2 Formal change is authorized.

## Exact next continuation
1. Build machine-readable mini replay data for TSMC 2023, UMC 2023 and Taiwan Cement 2023.
2. Validate source version / knownAt / publishedAt semantics for each receipt.
3. Complete double-count reconciliation between balance-sheet current portions and contractual maturity tables.
4. Freeze D07 + D13 baseline and outcome horizons before opening equity outcomes.
5. Run research-only OOS / walk-forward / prospective Shadow tests for incremental information.
