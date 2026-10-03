# D02 pre-PVE-240 weekend block — OBV algebra, divergence decomposition, accumulation/distribution ownership

Updated: 2026-10-03 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_BLIND / PVE_CURSOR_UNCHANGED_AT_239 / FORMAL_UNCHANGED
Main at write start: `6b77103a3f5ae9230c816b374ed7217d0d78d7fa`

## 1. Why this block is valid before the next live cohort

PVE-240 is reserved for the first genuine completed market session after the approved cross-midnight recovery repair.

2026-10-03 is a weekend and cannot create that prospective market session.

This block therefore does not consume PVE-240. It addresses concrete pre-existing contradictions / formula-provenance gaps in D02-07/08/09:
- `obvSlopeN` is named but its estimator is not frozen;
- `normalizedOBVChangeN` is algebraically duplicate with the already frozen signed-volume-balance primitive;
- D02-09 “divergence” currently mixes multiple different relational constructions;
- D02-08 can accidentally relabel D02-06/07/09 observables as hidden actor intent.

## 2. OBV algebraic decomposition

Standard OBV:
`OBV_t = OBV_(t-1) + s_t * V_t`

where:
- s_t = +1 when close rises;
- s_t = -1 when close falls;
- s_t = 0 when close is unchanged.

For an N-session interval:

`OBV_t - OBV_(t-N) = Σ(s_i * V_i)`

Frozen signed-volume balance:

`SVB_N = Σ(s_i * V_i) / Σ(V_i)`

Therefore the previously proposed:
`normalizedOBVChangeN = (OBV_t - OBV_(t-N)) / Σ(V_i)`

is exactly:

`normalizedOBVChangeN == SVB_N`

on the same eligible rows and denominator semantics.

This is exact identity, not “high correlation”.

### Endpoint slope consequence

If `obvSlopeN` means:
`(OBV_t - OBV_(t-N)) / N`

then:
`obvSlopeN = Σ(s_i*V_i)/N`.

It is the same signed-volume numerator under a different scale and cannot receive independent evidence weight.

If `obvSlopeN` instead means OLS regression slope over OBV levels, it introduces time-position weights and is no longer identical to endpoint difference, but:
- it still uses only the same signed-volume increments;
- it creates a formula-version / estimator choice;
- the current repo has not frozen that choice;
- testing both endpoint and OLS variants would create researcher degrees of freedom / multiple-testing risk.

Decision:
the generic `obvSlopeN` label is DATA_SEMANTICS_INCOMPLETE until estimator semantics are explicit.
For V0.1 residual research, `signedVolumeBalance20` remains the canonical OBV-family primitive.

## 3. Raw OBV level is unnecessary for pivot divergence

For two confirmed same-type price pivots P1 -> P2:

`OBV(P2) - OBV(P1) = Σ_{P1<P<=P2}(s_i*V_i)`.

Therefore a classical OBV divergence can be represented without the arbitrary cumulative OBV starting level.

### Bearish candidate
- price P2 > price P1 (higher high);
- OBV(P2) < OBV(P1).

This is exactly equivalent to:
- price higher high;
- interval signed-volume sum < 0.

If total interval volume > 0, it is also equivalent in sign to:
`pivotSignedVolumeBalance < 0`.

### Bullish candidate
- price P2 < price P1 (lower low);
- OBV(P2) > OBV(P1).

Equivalent to:
- price lower low;
- interval signed-volume sum > 0;
- `pivotSignedVolumeBalance > 0` when denominator is valid.

Thus raw cumulative OBV is not required to define the primary price-vs-OBV disagreement.

## 4. Repaint-safe / PIT clock inherited from D03 and Pattern

D02 must not invent independent visual pivots.

Primary price-volume pivot divergence reuses the D03/Pattern rule:
- two most recent consecutive confirmed price pivots;
- same pivot type;
- same Pattern swing scale;
- no skipping intervening pivots;
- no all-pair search;
- no strongest-divergence cherry-pick.

Required clocks:
- `pivotAt` = historical price extreme date;
- `confirmedAt` = later causal confirmation date;
- legal divergence availability is no earlier than the later required `confirmedAt` plus valid volume/source continuity receipts.

Any price move from pivotAt to confirmedAt is confirmation-lag cost and cannot be credited as post-divergence alpha.

Historical divergence episode identity is immutable.

## 5. D02 cannot copy D03's L3 promotion yet

D03-12 has already validated repaint-safe price-pivot and indicator-state PIT feasibility.

D02-09 does not automatically inherit that maturity.

Current D02 daily-volume evidence still has a known continuity blocker:
- `pvBuildDailyFeature` does not apply corporate-action/reset semantics to its 20-session daily denominator;
- AFTER_MARKET coverage persists `corporateActionResetAt:null`;
- daily `pvDailyRvol20` is quarantined across unresolved structural volume-unit / corporate-action boundaries.

The signed-volume family is directly volume-magnitude dependent and requires:
- explicit volumeUnit;
- stable tradingUnit;
- sub-lot completeness suitable for the use;
- symbol-session validity;
- no pseudo/no-trade bars;
- corporate-action / structural-unit continuity.

Therefore:
D02-09 remains L2 / 40%.
A reusable pivot clock is not enough to claim Taiwan PIT price-volume data feasibility.

## 6. D02-09 divergence family must be typed, not a generic label

The word “divergence” currently hides different mechanisms.

### Family A — PIVOT_SIGNED_VOLUME
Input:
- Pattern-owned confirmed price pivots;
- D02-07-owned signed-volume balance between pivots.

Meaning:
price structural progression disagrees with close-signed volume path.

This is the clean OBV-family version.

### Family B — PARTICIPATION_TRAJECTORY
Input:
- price progress / accepted structure;
- same-slot RVOL and/or cumulative participation trajectory.

Meaning:
price continues while normalized participation fades/rises.

This is not OBV and should not share the same numeric field.

### NOT D02-09 — EFFORT_RESULT
“High volume but little price progress” is contemporaneous effort-vs-result and remains D02-06 ownership.

### NOT D02-09 — hidden actor intent
Neither divergence family proves accumulation/distribution, institutional buying, informed flow or exhaustion.

## 7. Anti-double-count matrix for D02-07 / D02-08 / D02-09

### D02-07 OBV
Role:
compact close-signed volume comparator.

Canonical V0.1 primitive:
`signedVolumeBalance20`.

No independent raw-OBV level vote.
No duplicate normalizedOBVChange vote.
Generic obvSlope remains formula-incomplete.

### D02-09 Price-volume divergence
Role:
relational/lifecycle transformation using already-owned price and volume primitives.

It owns no new market-data primitive.
It may earn a distinct predictive role only if the relational state adds residual value beyond:
- the price inputs;
- the volume inputs;
- D02-06 effort/result;
- persistence/acceptance.

### D02-08 Accumulation/distribution proxy
Role:
latent-mechanism interpretation consumer, not an OHLCV primitive.

If it is built from:
- high-volume/low-progress -> that is D02-06 evidence;
- OBV/SVB -> that is D02-07 evidence;
- price-volume divergence -> that is D02-09 relational evidence.

None identifies hidden actor intent.

A genuinely distinct future D02-08 evidence path requires independent microstructure data (side-pressure / trade classification / replenishment / resiliency) from the D05 dependency lane.

Without that independent data family, D02-08 remains a strong merge candidate rather than a separate vote.

## 8. Primary future incremental tests

### D02-07
A = direct price/return path.
B = A + direct volume/RVOL/turnover.
C = B + response/persistence/acceptance.
D = C + signedVolumeBalance20.

Only D-vs-C tests OBV-family residual value.

Do not test raw OBV, normalizedOBVChange20 and signedVolumeBalance20 as three factors.

### D02-09 Family A
A = price-pivot progression only.
B = A + interval signedVolumeBalance.
C = B + direct participation/response controls.

The divergence relation is useful only if B/C improve future path discrimination beyond the primitive inputs.

### D02-09 Family B
A = price progression / structural state.
B = A + current participation state.
C = B + participation-trajectory disagreement.

Again, relational value must exceed its component inputs.

## 9. Falsification / failure conditions

Reject or merge the OBV/divergence representation if:
- signedVolumeBalance adds no stable OOS/prospective value after direct PV states;
- divergence relation adds no value beyond price + volume primitives;
- performance exists only under one pivot scale/window chosen after outcomes;
- event shocks dominate the signed-volume path;
- volume continuity/units are incomplete;
- confirmation lag removes the apparent edge;
- low coverage / selection conditioning creates the result;
- multiple divergence variants are searched and only the best is reported.

## 10. Current maturity and structural recommendation

No maturity change:
- D02-07 = L2 / 40%;
- D02-08 = L2 / 40%;
- D02-09 = L2 / 40%;
- D02 aggregate remains 48.3%.

Research classifications:
- D02-07: COMPARATOR_ONLY / EXACT_DUPLICATE_PRUNING_REQUIRED;
- D02-09: RELATIONAL_TRANSFORM_ONLY / NO_PRIMITIVE_VOTE / PIT_VOLUME_LINEAGE_BLOCKED;
- D02-08: LATENT_MECHANISM_CONSUMER / STRONG_MERGE_CANDIDATE_IF_NO_INDEPENDENT_MICROSTRUCTURE_EVIDENCE.

These are research recommendations only.
No module merge/retirement is executed here.

PVE cursor remains 239.
PVE-240 remains reserved for the first genuine completed market session after the cross-midnight repair.

Formal Core remains LOCKED.


## 11. SVB versus CMF research-budget decision

CMF uses:

`CLV = ((C-L)-(H-C))/(H-L) = (2C-H-L)/(H-L)`.

If:
`closePosition = (C-L)/(H-L)`,

then:
`CLV = 2*closePosition - 1`.

CMF is a volume-weighted finite-window average of this close-location transform.

Therefore CMF is not algebraically identical to signedVolumeBalance:
- SVB signs full bar/session volume using close-to-close direction;
- CMF weights volume using within-bar close location.

But both remain deterministic OHLCV compressions.

Current D02 already owns:
- close-position / response geometry;
- direct volume / RVOL;
- effort-vs-result;
- acceptance/rejection.

Research-budget rule:
1. primary OBV-family compact comparator = `signedVolumeBalance20`;
2. CMF = robustness comparator only, not simultaneous independent factor;
3. do not outcome-test SVB + CMF + OBV slope + OBV divergence as four separate votes;
4. CMF may replace/challenge SVB later only under a preregistered comparison, not after seeing which performs better.

Reason:
prospective independent dates are scarce. Outcome budget should test unresolved primitive/relational information, not multiple deterministic compressions of the same OHLCV family.
