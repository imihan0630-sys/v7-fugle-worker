# D15-22｜Taiwan Plan-Time Risk Attribution Replay — 2026-09-18 V0.1

Updated: 2026-10-04 Asia/Taipei
Status: LAYER_A_TAIWAN_PIT_REPLAY_COMPLETE
Formal Core impact: NONE

## Source provenance
The existing Production read-only audit preserves conservative buyHigh plan geometry:
- 2006: PriorityScore 69.9; stop-risk 2.6167%; allocation 50,000 NTD; projected risk 1,308.35 NTD.
- 3105: PriorityScore 89.4; stop-risk 5.0028%; allocation 64,000 NTD; projected risk 3,201.79 NTD.
- 6133: PriorityScore 74.9; stop-risk 3.6542%; allocation 54,000 NTD; projected risk 1,973.27 NTD.

The durable frontier receipt independently reports total projected risk 6,483.4292 NTD; tiny difference from rounded displayed stop-risk percentages is rounding only.

## Current allocation attribution
Using displayed conservative stop-risk percentages:
- 2006 risk share ≈ 20.18%.
- 3105 risk share ≈ 49.38%.
- 6133 risk share ≈ 30.44%.
Total ≈ 6,483.41 NTD.

3105 receives 64/168 = 38.10% of deployed capital but contributes ≈49.38% of conservative planned stop-risk. This is a mechanical consequence of both higher capital allocation and the widest displayed stop-risk fraction.

## Equal-capital comparator
Same selected names and same 168,000 NTD deployment:
56k / 56k / 56k.

Projected risks:
- 2006 ≈ 1,465.35
- 3105 ≈ 2,801.57
- 6133 ≈ 2,046.35
Total ≈ 6,313.27 NTD.

Current minus equal-capital projected risk ≈ +170.14 NTD.
Thus current PriorityScore sizing adds about 170 NTD of conservative plan stop-risk versus equal capital on this witness, holding stop geometry and selected names fixed.

This is sizing-risk attribution, not realized loss and not evidence that equal capital has higher economic utility.

## Equal-planned-stop-risk diagnostic comparator
Existing research documents the diagnostic allocation approximately:
70k / 41k / 57k.

Using displayed stop-risk fractions:
projected total ≈ 5,965.73 NTD.
Risk shares ≈ 30.70% / 34.38% / 34.91%.

Current minus this diagnostic comparator ≈ +517.68 NTD projected risk.

Caveat: this comparator was originally diagnostic and not necessarily an executable Formal portfolio under every constraint. It must not be promoted as a production recommendation.

## Falsification result
Rejected on this Taiwan witness:
"3105's high plan-risk share is explained only by receiving more capital."

Even equal capital leaves 3105 as the largest plan-risk contributor because its conservative stop-risk fraction is widest.

Also rejected:
"capital concentration and stop-risk concentration are interchangeable."
They are not. Current deployed capital shares are approximately 29.76% / 38.10% / 32.14%, while plan-risk shares are approximately 20.18% / 49.38% / 30.44%.

## Evidence boundary
This replay validates Layer A plan-time risk attribution only.
It does not validate:
- covariance component risk;
- realized loss attribution;
- broker holdings risk;
- Information Ratio;
- economic superiority of any comparator.

Layer B remains blocked by PIT synchronized covariance.
Layer C remains blocked by synchronized portfolio/benchmark return series.

## Maturity recommendation
D15-22 qualifies for L3/60 for Taiwan plan-time Layer A data feasibility and replay.
Layer B/C remain UNKNOWN and do not inherit L3.
No FORMAL_OPTIMIZATION_CANDIDATE.
