# D18 Builder Falsification Matrix V0.1

Status: RESEARCH-ONLY / PRE-IMPLEMENTATION TEST ORACLE

| Case | Breadth | Activity/Concentration | Expected reason |
|---|---|---|---|
| both markets complete, true pct return + trade value | KNOWN | KNOWN | PASS |
| TPEx missing/thin | UNKNOWN | UNKNOWN | MARKET_COVERAGE_INCOMPLETE |
| TWSE missing/thin | UNKNOWN | UNKNOWN | MARKET_COVERAGE_INCOMPLETE |
| future availableAt | UNKNOWN | UNKNOWN | PIT_FUTURE |
| duplicate market+symbol | BLOCK | BLOCK | DUPLICATE_SYMBOL |
| direction known, one trade value missing | KNOWN | UNKNOWN | TRADE_VALUE_INCOMPLETE |
| direction known only from change amount, no true pct return | counts/advanceShare KNOWN; medianReturn/dispersion UNKNOWN | unaffected if trade value complete | RETURN_SCALE_UNPROVEN |
| row order permuted | same hash | same hash | CANONICAL_ORDER |
| target-date mismatch | UNKNOWN | UNKNOWN | TARGET_DATE_NOT_READY |

## Counterexample discovered
A daily endpoint can provide Change/ChangeAmount without ChangePercent. Its sign can support UP/DOWN/FLAT, but treating the numeric change amount as a return percentage corrupts medianReturn and returnDispersion across stocks with different price levels.

Therefore D18 breadth must separate:
- direction family;
- true return-distribution family.

This falsifies the stronger earlier assumption that all same-day A1 breadth/return-distribution fields are equally zero-new-call ready.

## Promotion implication
D18-04 remains L2 until executable tests exist. The conceptual readiness of advance/decline breadth is stronger than median-return/dispersion readiness and must be tracked separately.
