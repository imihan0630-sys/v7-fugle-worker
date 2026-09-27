# Institutional Actor-Total Conflict / Net-Clipping Geometry

Updated: 2026-09-28 Asia/Taipei  
Status: CLASS-A STRUCTURAL DIAGNOSTIC  
Formal Core: LOCKED

This continues the institutional-score semantic audit without outcomes or weight search.

Current Formal contains two different pieces of flow information:

- actor direction: any actor positive => +6; all three positive => another +15;
- aggregate magnitude: `25 * clamp(max(institutionTotalNet/ADV,0),0,1)`.

These are not one monotone axis.

The observer freezes six mutually interpretable actor-total states:
- ALL_POSITIVE_ALIGNED;
- MIXED_ACTORS_TOTAL_POSITIVE;
- MIXED_ACTORS_TOTAL_ZERO;
- MIXED_ACTORS_TOTAL_NEGATIVE;
- NO_POSITIVE_TOTAL_ZERO;
- NO_POSITIVE_TOTAL_NEGATIVE.

A key structural state is MIXED_ACTORS_TOTAL_NEGATIVE/ZERO: one or more actors are buying, so currentBuy contributes +6, while total institutional flow is nonpositive and aggregate intensity contributes 0.

The aggregate component also has two compression regions:
- total <=0: every negative magnitude maps to 0 points;
- total >=1 ADV: every larger positive magnitude maps to 25 points.

This is exact formula behavior, not an argument that clipping is wrong.

The source invariant `foreignNet+trustNet+dealerNet == institutionTotalNet` is mandatory. Violation is provenance/data-quality failure.

Full-scan prevalence requires a complete clean same-scan parent. Selected-only FULL_FORMAL_SCAN persistence and bounded Shadow remain insufficient.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists.
