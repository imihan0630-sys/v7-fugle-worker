# Credit / Capital Structure Checkpoint

Updated: 2026-10-03 02:10 Asia/Taipei
Scope: D22｜信用市場／資本結構／融資壓力／股債傳導
Status: ACTIVE_RESEARCH / D22-01 L2 / FORMAL_CORE_UNCHANGED

## Governance
- Canonical continuation checkpoint for D22.
- Separate accounting leverage (D07), corporate-action events (D11) and macro rates (D13) from market-implied / contractual credit risk.
- Missing bond/rating/covenant evidence remains UNKNOWN; do not infer a clean bill of health from absence.
- Contractual maturity is not expected maturity; disclosed buckets must be preserved as reported and must never be split into fabricated finer intervals.
- Formal Core remains LOCKED. D22 evidence is research-only until PIT/OOS/Prospective Shadow/cost/redundancy/multi-regime gates pass.

## D22-01 evidence checkpoint — 2026-10-03

### Mechanism frozen
Refinancing risk is not equivalent to accounting leverage. The research object is the interaction of:
1. contractual debt maturity timing and concentration;
2. actually available liquidity and committed facilities;
3. refinancing channel availability;
4. refinancing cost / rate exposure;
5. contingent liquidity drains and supplier-finance concentration.

A high-leverage issuer with long fixed-rate maturities and ample liquidity can have lower near-term refinancing risk than a lower-leverage issuer with a concentrated 6–12 month maturity wall.

### Data semantics / PIT contract
- IFRS 7 liquidity-risk maturity analysis is based on remaining contractual maturities; disclosed cash flows can be contractual undiscounted cash flows and therefore are not interchangeable with balance-sheet carrying amounts.
- Taiwan official-report feasibility is confirmed at the disclosure level: TWSE consolidated financial statements disclose liquidity-risk maturity buckets and explicitly identify contractual undiscounted cash flows.
- TSMC official annual-report evidence provides issuer-level maturity buckets and individual bond maturity dates, confirming that issuer disclosures can support a PIT debt-maturity dataset.
- Reverse factoring / supplier-finance arrangements can concentrate liquidity obligations and create withdrawal risk; omission can understate effective refinancing/liquidity pressure.
- Required timestamps: periodEnd, publishedAt, capturedAt, knownAt. Missing evidence stays UNKNOWN.
- Preserve original maturity buckets. No synthetic annual interpolation from a 1–5 year bucket.

### Falsification / failure conditions
- A maturity wall does not imply default: issuers may pre-fund, refinance early, extend, exchange, redeem or repay debt.
- Contractual maturity can differ materially from expected maturity.
- Financial institutions and non-financial corporates require separate comparability treatment.
- Apparent equity-credit lead/lag may be driven by common macro/rate/liquidity shocks rather than causal credit information.
- Sparse bond trading / stale quotes can create false spread signals.
- Supplier-finance and contingent liquidity commitments can make a simple bond+bank-debt wall incomplete.

### Challenger features for later testing
Research-only candidates:
- near-term contractual maturities / cash;
- near-term contractual maturities / (cash + verified undrawn committed facilities);
- near-term contractual maturities / operating cash flow;
- maturity concentration;
- maturity wall × refinancing-cost change;
- maturity wall × rating/spread/covenant deterioration;
- maturity wall × floating-rate exposure.

No candidate is authorized for System 1/System 2 Formal use.

## Exact next continuation
Continue D22-01 from L2 toward L3:
1. collect multiple Taiwan issuer × multiple date official maturity disclosures across non-financial industries;
2. store source receipt + periodEnd/publishedAt/capturedAt/knownAt and raw maturity buckets;
3. define common-support mapping without fabricated precision;
4. verify replayability and distinguish contractual from expected maturity;
5. test whether the information adds value beyond D07 leverage and D13 rate context before any outcome/predictive claim.
