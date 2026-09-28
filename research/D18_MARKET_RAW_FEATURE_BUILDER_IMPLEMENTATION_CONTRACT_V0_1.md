# D18 Market Raw Feature Builder Implementation Contract V0.1

Updated: 2026-09-29 Asia/Taipei
Status: RESEARCH-ONLY / CLASS-A DESIGN / NOT WIRED
Formal Core impact: NONE

## Exact engineering boundary
The first executable builder is an isolated research component. It may read frozen A1/A2/A3/B2 receipts or fixtures, but must not alter shared fetch routing, production storage schema, schedules, ranking, selection, capital, signal or notification behavior.

If implementation requires a shared runtime path, shared storage migration, production capture scheduling or any formal-output dependency, reclassify as Class B before merge/deploy.

## V0.1 same-day A1 receipt
Inputs:
- marketDate and after-close decisionTimestamp;
- observedAt / availableAt;
- sourceSessionHash;
- universeVersion/hash;
- TWSE daily ordinary-share rows;
- TPEx daily ordinary-share rows.

Output state is KNOWN only when both market coverage contracts pass and source availableAt <= decisionTimestamp.

Raw outputs only:
- up/down/flat counts;
- advanceShare;
- medianReturn;
- totalTradeValue;
- medianTradeValue;
- top10TradeValueShare;
- top20TradeValueShare;
- returnDispersion.

No HIGH/LOW labels, score, strategy weight or policy action.

## Mandatory fail-closed tests
1. missing TWSE => UNKNOWN;
2. missing TPEx => UNKNOWN;
3. either market below frozen minimum => UNKNOWN;
4. duplicate symbol => INVALID/BLOCK, never double-count;
5. missing direction field => UNKNOWN;
6. missing trade-value field => affected activity/concentration fields UNKNOWN; do not coerce zero;
7. availableAt later than decisionTimestamp => UNKNOWN;
8. target-date mismatch => UNKNOWN;
9. identical normalized inputs + version => identical feature hash;
10. row-order permutation => identical feature hash after canonical sort;
11. current/future row in historical replay => BLOCK;
12. sourceSessionHash/universeVersion absent => BLOCK.

## Important refinement: field-level readiness
Do not unnecessarily make the entire receipt UNKNOWN when one family is missing.

Breadth fields depend on complete directional coverage.
Activity/concentration fields depend on complete non-negative trade-value coverage.
A missing trade-value value must not erase otherwise valid breadth, but must make activity/concentration UNKNOWN.

The receipt therefore needs per-family state/reason, not only one global state.

## Canonicalization requirement
Before hashing:
- normalize market identifier and symbol;
- sort by market then symbol;
- preserve exact target marketDate;
- reject duplicate market+symbol;
- use deterministic numeric normalization.

This prevents harmless API row-order changes from producing false new data generations.

## Denominator rule
advanceShare denominator is the frozen eligible ordinary-share universe represented by the validated receipt, not only rows with a known direction. If direction coverage is incomplete, breadth is UNKNOWN rather than silently shrinking the denominator.

## Return semantic warning
Official daily payloads may expose change amount and/or change percent. A change amount is sufficient for UP/DOWN/FLAT direction but is NOT a percentage return.

medianReturn and returnDispersion require a true percentage-return field or a PIT-safe prior-close calculation. They must remain UNKNOWN if only change amount is available.

This is a critical correction to the earlier conceptual readiness audit: breadth direction can be zero-new-call while return-distribution metrics may require a stronger field contract.

## L3 gate
D18-04 may move from L2 toward L3 only after executable tests prove the above semantics. A design document does not upgrade maturity.

Trend/volatility history features remain separate Phase B work.
