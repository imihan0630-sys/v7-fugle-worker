# Institutional Score — Outcome-Blind Overlap / Rank-Compression Diagnostics

Updated: 2026-09-28 Asia/Taipei  
Status: CLASS-A STRUCTURAL DIAGNOSTIC  
Formal Core: LOCKED

IC-013 through IC-015 already freeze the theory. This artifact only makes the structural questions executable.

The 3-session streak score is split into:
- **current-day direction base**: the first positive day for each actor;
- **persistence beyond day 1**: only day 2/3 continuation;
- **nonlinear current-direction bonus**: +6 any actor positive, +15 all three positive;
- **aggregate net intensity**;
- **large-holder ownership concentration**.

This prevents a 3-day streak score from being described as if all of its points were independent persistence information. The first-day streak points and +6/+15 bonuses are driven by the same current-session direction state, while only the additional day-2/day-3 points represent persistence beyond today.

For clean ready history, current net signs and the endpoint of the streak must agree. A mismatch is a provenance/version invariant failure, not an economic observation.

Clamp diagnostics remain outcome-blind:
- preClamp;
- Formal score after cap 100;
- lost headroom;
- number of different preClamp pairs flattened to the same 100;
- institutional-component score tie groups.

This is **institutional-component compression only**. It does not claim final Formal rank ties because the deployed ordering also uses post-consensus PriorityScore and lexicographic RR, consensus, setup, sector and RS inputs.

A complete clean same-scan parent is mandatory. Current selected-only FULL_FORMAL_SCAN persistence and bounded Shadow cannot estimate full-scan frequency.

The complete streak-only state space is also frozen outcome-blind: 3 actors × {0,1,2,3} consecutive-buy days gives 64 theoretical states, but streak+interaction weighting maps them to 41 distinct point totals. The maximum is 87 before net intensity or ownership; 9 of 64 theoretical states are already >=70, spanning scores 71/73/75/77/79/83/87. These are formula-geometry counts, **not** live frequencies.

The 10–30bn special-reason path uses institutionalScore >=70 together with 1.5x liquidity. That threshold is a separate eligibility effect: compression at the 100 cap does not alter whether a row already above 70 clears that condition. Report >=70 occupancy separately from score saturation.

No weight, gate, threshold or formula change is proposed.
