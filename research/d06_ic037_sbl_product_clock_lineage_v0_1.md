# D06 IC-037 — SBL product-clock lineage falsification

Updated: 2026-09-29 Asia/Taipei
Status: SOURCE_CLOCK_FALSIFICATION_ADVANCED / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

Official TWSE product contracts falsify the shorthand that all securities-borrowing balance data share one publication clock.

- Aggregate SBL balance TWT72U: 20:30 each trading day.
- Securities-firm segregated-account loan balances TWTBJU/TWTBKU/TWTBLU: 20:00 each trading day.
- Client/broker-finance borrowing products are separate semantic products and must not be substituted for either family.
- Current official Chinese/English storefront metadata for some related borrowing-balance products can disagree on production time. Conflicting contract metadata must be CONFLICT/UNKNOWN, never resolved by choosing the earlier time.

PIT rule: bind each feature to market + exact product/file code + semantic role + product/version + sourceDate + production-contract status + actual receipt. Composite firstKnownAt is the maximum actual firstKnownAt of required components. Product substitution changes feature semantics and cannot be treated as missing-value fill.

Research implication: historical D06-09/Crowding tests must freeze or stratify product lineage, otherwise apparent SBL effects may be product-definition/time-vintage artifacts. No outcomes inspected. No threshold/score/Formal change. D06-09 remains L2. FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact next continuation — IC-038
1. Add exact product/file code and contractClockStatus VERIFIED|CONFLICT|UNKNOWN to the outcome-blind D06 receipt ledger.
2. Prospectively capture actual receipt times for the exact TWSE products intended for research.
3. Resolve TPEx day-trading/margin/SBL clocks only from their own contracts or prospective receipts.
4. Keep D06-14 outcome preregistration closed until receipt coverage exists; monotonic high-day-trading remains a negative control.
5. Preserve margin financing, margin short, aggregate SBL, segregated-account borrowing and actual SBL short-sale flow as separate evidence families.
6. Continue PF ETF units-delta + PCF receipt validation separately.
7. Formal Core remains LOCKED.
