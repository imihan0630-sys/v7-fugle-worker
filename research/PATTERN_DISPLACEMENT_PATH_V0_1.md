# D01 DL-033 — Structural Aging vs Absolute Displacement / Long Excursion Path V0.1

Updated: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / DISPLACEMENT_PATH_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-031 separated age from observability and interaction history.
DL-032 separated age from volatility/regime scale migration.

DL-033 freezes another confound:

> An old structural object may appear different because price spent a long time far away and later returned, not because elapsed age itself changed structural memory.

Age and excursion path must remain separate.

## 2. Core distinction

Freeze three families:

A. AGE
- rootAgeEligibleSessions;
- versionAgeEligibleSessions.

B. CURRENT LOCATION
- signed distance to frozen zone;
- absolute distance;
- ATR-normalized distance;
- percent-of-reference distance.

C. PATH SINCE LAST VALID INTERACTION
- maximum absolute excursion;
- cumulative absolute path distance;
- maximum one-sided excursion above/below;
- eligible sessions since last interaction;
- number of direction changes if causally defined;
- return-trip duration when a later valid interaction opportunity exists.

No family substitutes for another.

## 3. Frozen zone geometry

The structural zone remains the same persisted causal object.

Do not move the zone toward current price.
Do not re-anchor it to recent highs/lows merely because price spent a long time away.
A causal new structural version must follow the existing D01 anchor/version rules.

## 4. Distance semantics

For frozen lower/upper boundary:

INSIDE_ZONE:
distance = 0.

ABOVE_ZONE:
signedDistancePrice = close - upper.

BELOW_ZONE:
signedDistancePrice = close - lower.

Absolute distance is |signedDistancePrice|.

Normalized forms may use:
- current ATR;
- formation ATR as a sensitivity descriptor;
- current reference price.

Normalization is descriptive.
It does not change object identity.

## 5. Excursion path is history, not age

Two roots can have equal age but different path:

ROOT_A:
stayed near the zone for most of its life.

ROOT_B:
moved 8 ATR away, spent 40 sessions far away, then returned.

Calling both "age 60" hides materially different price history.

Likewise:
a young root can experience a rapid 8 ATR excursion and return.

Therefore path descriptors are required before attributing response differences to age.

## 6. No arbitrary near/far thresholds

D01 does not define:
- >2 ATR = far;
- <1 ATR = near;
- N sessions away = stale.

Continuous distance/path descriptors remain primary.

If future D16 work uses bins, thresholds must be preregistered and sensitivity-tested.

## 7. Opportunity conditioning

A valid structural response study begins at a real interaction opportunity.

Before that opportunity, freeze:
- root/version age;
- current location;
- full causal path summaries since last interaction;
- DL-032 scale/regime descriptors;
- prior interaction/bounce/break/reclaim history.

Non-approach days are not failures.

## 8. Long absence vs long excursion

These are not identical.

LONG_TIME_WITHOUT_INTERACTION:
time since last interaction is large.

LARGE_EXCURSION:
price moved far away.

A root can have:
- long no-interaction time with modest distance;
- short no-interaction time with large distance;
- both;
- neither.

No combined "staleness score" is defined.

## 9. Return-path direction

A return from above and a return from below may have different semantics relative to support/resistance orientation.

Store:
- excursionSide;
- returnApproachSide;
- orientation;
- role-reversal/lifecycle state if already certified.

Do not infer intent or psychology from the path.

## 10. Path completeness firewall

Path summaries require complete eligible-session continuity from the last valid interaction or the chosen causal landmark through asOf.

If any unresolved session/source gap exists:
PATH_SUMMARY_DATA_BLOCKED.

Do not impute the missing maximum excursion or path length.

## 11. Corporate-action / semantic-space firewall

All path prices must use the same canonical TECHNICAL_CONTINUITY semantic space as the frozen zone.

Raw discontinuities from splits/dividends cannot be counted as excursion.

## 12. Current distance is not future opportunity

A far-away current state is not a failed structural test.

It is location state only.

Future response inference occurs only when a valid opportunity is reached under the frozen DL-026 opportunity semantics.

## 13. Future nested comparison

P0:
age + interaction history + DL-032 scale/regime context.

P1:
P0 + current distance/location.

P2:
P1 + max/cumulative excursion path.

P3:
P2 + time-since-last-interaction / return-trip descriptors.

Interpretation:

D0_AGE_SURVIVES_PATH:
age remains after path/location controls.

D1_CURRENT_DISTANCE_CONFOUND:
age vanishes after current-location controls.

D2_EXCURSION_PATH_CONFOUND:
age vanishes after excursion-history controls.

D3_RETURN_RECENCY_CONFOUND:
age vanishes after return-trip/last-interaction recency controls.

D4_NOT_EVALUABLE:
path provenance/common support insufficient.

None proves alpha.

## 14. Common support

Old/young comparisons require overlap in:
- current distance;
- max excursion;
- cumulative path;
- return-side/orientation;
- time since last interaction;
- interaction history;
- DL-032 scale/regime context.

No extrapolation beyond support.

## 15. External evidence context

Support/resistance research is explicitly path-dependent.
Chung and Bellotti show prior bounce history and elapsed time can carry separate information.
Henderson et al. (2026) model support/resistance through path-dependent regime transitions.

These motivate preserving path state separately from age.
They do not prove D01 alpha.

## 16. Required manifest fields

Per root/asOf or root/opportunity:
- structuralRootId;
- structuralVersionId;
- objectEpisodeId;
- orientation;
- frozenBoundaryLower;
- frozenBoundaryUpper;
- asOf;
- rootAgeEligibleSessions;
- versionAgeEligibleSessions;
- lastInteractionAt;
- eligibleSessionsSinceLastInteraction;
- signedDistancePrice;
- absoluteDistancePrice;
- currentDistanceAtr;
- currentDistancePct;
- maxAbsExcursionPrice;
- maxAbsExcursionAtr;
- maxAboveExcursionPrice;
- maxBelowExcursionPrice;
- cumulativeAbsPathPrice;
- cumulativeAbsPathAtr;
- excursionSide;
- returnApproachSide;
- pathStartAt;
- pathCompletenessReceipt;
- scale/regime receipt from DL-032;
- opportunity receipt;
- manifestVersion/hash.

No future-return field.

## 17. Current decision

AGE_EQUALS_DISTANCE =
FALSE.

AGE_EQUALS_EXCURSION =
FALSE.

NON_APPROACH_DAY_IS_FAILURE =
FALSE.

ARBITRARY_FAR_THRESHOLD =
NOT_DEFINED.

PATH_GAP_IMPUTATION =
PROHIBITED.

ZONE_REANCHOR_TO_CURRENT_PRICE =
PROHIBITED.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 18. Exact next continuation

1. Build deterministic distance/path summary helper and adversarial tests.
2. Preserve age, current location, excursion path and interaction recency separately.
3. Hand P0-P3 common-support inference to D16.
4. Keep path summaries fail-closed under continuity gaps.
5. Execute DL-022..DL-033 research Node tests only through a reproducible approved research-test path.
6. Next D01 science: separate structural persistence from role reversal / polarity flip so an old resistance becoming support is not misclassified as either decay or fresh independent structure.
7. No outcome join / no runtime wiring / no Formal change.
