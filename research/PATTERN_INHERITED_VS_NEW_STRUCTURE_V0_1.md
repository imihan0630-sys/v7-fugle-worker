# D01 DL-036 — Inherited Polarity Memory vs New Post-Break Structure V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / LINEAGE_FIREWALL / SDA_001_SDA_002_REMEDIATION / FORMAL_CORE_LOCKED

## 1. Purpose

DL-034 froze role-reversal eligibility.
DL-035 separated retest arrival, retest response, generic breakout momentum, salience and selection.

DL-036 addresses a new ambiguity:

> When price breaks an old resistance/support and later revisits approximately the same price region, is the future response inherited from the old opposite-role structure, or did a new post-break structure form near the same price after the crossing?

Spatial overlap alone cannot answer this.

The same price area may contain:
- inherited old-role lineage;
- a genuinely new post-break structural root;
- a causal extension/version of the old root;
- two co-located roots;
- no valid new structure at all.

The scientific identity rule must be causal and outcome-blind.

## 2. Audit ownership

DL-036 explicitly advances two standing audit tickets.

### SDA-001 — Same-root PRICE_OHLC multi-vote

D01 structural objects, breakout state, higher-low geometry, momentum and other price-derived representations share PRICE_OHLC ancestry.

DL-036 therefore freezes:
- informationRoot = PRICE_OHLC;
- representationFamily = D01_PRICE_GEOMETRY;
- structuralRootId != independentEvidenceId;
- co-located old/new structural roots do NOT automatically create two independent votes;
- effectiveIndependentEvidenceCount remains 1 by default inside the same parent/decision unless D16 establishes residual incrementality on common support.

### SDA-002 — Pattern hindsight / future-pivot confirmation

Every structural candidate must retain:
- firstObservableAt;
- confirmedAt;
- anchor timestamps;
- asOf-safe snapshot;
- failure / not-confirmed / divergent states.

A post-break structure confirmed after a retest opportunity cannot explain that earlier retest.

Future bars may never rewrite an earlier predictor snapshot.

## 3. Two identities must be preserved

### A. STRUCTURAL_LINEAGE

Answers:
Is this the same structural root, a new root, or unresolved?

### B. INFORMATION_LINEAGE

Answers:
Does this representation add independent information beyond the same PRICE_OHLC parent?

A NEW structural root can still belong to the same PRICE_OHLC information root.

Therefore:
NEW_ROOT != NEW_INDEPENDENT_VOTE.

## 4. Frozen lineage classes

### L0 — INHERITED_ROLE_ONLY

At first retest opportunity:
- old root / role episode is valid;
- no independent new post-break structure is confirmed before the opportunity.

Interpretation:
only inherited-role lineage is available.

### L1 — SAME_ROOT_CAUSAL_EXTENSION

A post-break geometry update:
- retains old/root anchors;
- adds only causal later anchors;
- satisfies DL-030 extension rules.

Interpretation:
new structural version of the same root, not a new root.

### L2 — NEW_POST_BREAK_ROOT_PRETEST

A new structure is independently confirmed before first retest opportunity and:
- its root identity is based on causally available anchors;
- its anchor lineage is not merely a legal extension of the old root;
- firstObservableAt and confirmedAt are both <= predictor freeze time;
- no future retest bar is used to certify it.

Interpretation:
distinct structural lineage exists before the test.

### L3 — COLOCATED_DUAL_LINEAGE_PRETEST

Both are valid before first retest:
- inherited role episode from old root;
- separately certified new post-break root;
- boundaries overlap spatially.

Interpretation:
two structural lineages co-exist.

But under SDA-001:
effective independent PRICE_OHLC evidence count remains 1 unless D16 proves residual incrementality.

### L4 — NEW_STRUCTURE_CONFIRMED_AFTER_TEST

A seemingly relevant new structure is confirmed only at or after first retest opportunity.

Interpretation:
post-hoc for that retest.
It cannot enter that predictor snapshot.

### L5 — SPATIAL_OVERLAP_WITHOUT_LINEAGE

New detector geometry overlaps the old zone but causal anchor lineage / timing is insufficient.

Interpretation:
identity unresolved.
Do not force same-root or new-root classification from price proximity.

### L6 — NEW_POST_BREAK_ROOT_NONOVERLAP

A valid new structure forms after breakout but is not spatially co-located with the old zone.

Interpretation:
new structure exists, but it is not evidence for old-zone polarity memory.

## 5. Spatial overlap is descriptive, not identity

Allowed descriptors:
- intersectionWidth;
- unionWidth;
- intervalOverlapRatio;
- centerDistancePrice;
- centerDistanceAtr;
- exactBoundaryEquality.

No overlap threshold is allowed to define:
- same root;
- new root;
- independent evidence.

Do not choose a 50%, 70% or ATR overlap cutoff after outcomes.

## 6. Post-break candidate timing

For any candidate new post-break structure record:
- candidateFirstObservableAt;
- candidateConfirmedAt;
- candidateAnchorIds;
- candidateAnchorOccurredAt;
- detectorVersion;
- boundaryVersion/hash;
- source provenance.

Hard rule:

candidateConfirmedAt > firstRetestOpportunityAt
=> NEW_STRUCTURE_CONFIRMED_AFTER_TEST.

candidateConfirmedAt == firstRetestOpportunityAt
=> not eligible for the same opportunity unless the entire confirmation state was available before the predictor-freeze instant.

Session-date equality is insufficient.
Decision timestamp / bar-close ordering is required.

## 7. Retest bar cannot certify its own predictor

A common hindsight trap is:

1. price revisits the old level;
2. that same revisit creates a swing low/high;
3. later bars confirm the swing;
4. the analyst labels that swing as a new support/resistance structure;
5. the analyst then claims the new structure predicted the original revisit response.

DL-036 prohibits this.

If any candidate anchor or pivot confirmation requires:
- the retest bar itself after predictor freeze;
- a later confirmation bar;
- future topology evidence;

the structure is not available for that retest predictor.

## 8. Same-root extension vs new-root formation

Use DL-030 lineage first.

If the candidate retains old anchors and causally adds later anchors:
SAME_ROOT_CAUSAL_EXTENSION.

If old anchors are removed/replaced and a new independently certified post-break anchor family forms:
candidate NEW_POST_BREAK_ROOT.

If lineage is ambiguous:
SPATIAL_OVERLAP_WITHOUT_LINEAGE / IDENTITY_UNRESOLVED.

Do not use outcome quality to resolve ambiguity.

## 9. Co-location does not create confluence votes

Suppose:
- old resistance flips to support candidate;
- a post-break consolidation creates a new support structure at nearly the same price;
- both are valid before the retest.

This is useful research state:
COLOCATED_DUAL_LINEAGE_PRETEST.

It is NOT automatically:
"two bullish confirmations."

Both are derived from PRICE_OHLC geometry.

Machine lineage defaults:
- informationRoot = PRICE_OHLC;
- redundancyGroup = D01_PRICE_GEOMETRY_SAME_PARENT;
- rawRepresentationCount = 2;
- effectiveIndependentEvidenceCount = 1;
- independentVoteAllowed = false.

Only D16 residual/common-parent evidence can justify a distinct incremental contribution.

## 10. New structure may be a mediator

A new post-break structure can itself be caused by the breakout path.

Example:
old resistance breaks;
price consolidates above;
a new local base forms;
price later retests.

For TOTAL inherited-polarity estimand:
do not automatically control away the new structure, because it may be a post-break mediator.

For PATH_CONDITIONAL / MECHANISM estimands:
new-structure state may be included explicitly with its post-treatment status declared.

DL-036 freezes semantics, not the causal estimator.

## 11. Negative and divergent states are mandatory

The research manifest must preserve:
- old-role candidate with no new structure;
- new post-break structure without old-role history;
- old/new co-location;
- same-root causal extension;
- overlapping geometry that remains unresolved;
- new structure confirmed after retest;
- new structure confirmed before retest but far from old zone;
- candidate that never confirms.

Named-success cases alone are prohibited.

## 12. Future comparison families

### C0 — INHERITED_ONLY
Old role valid, no pretest new root.

### C1 — NEW_ONLY
New pretest root near the relevant area, but no certified inherited role.

### C2 — DUAL_COLOCATED
Both inherited role and new pretest root.

### C3 — SAME_ROOT_EXTENSION
Old root plus causal version extension.

### C4 — POST_HOC_NEW_STRUCTURE
New structure only becomes confirmed after the tested opportunity.

Future D16 analysis must preserve these classes and common support.

## 13. Incrementality questions

Future D16 questions are separate:

Q1:
Does inherited old-role history add representation beyond a new post-break structure?

Q2:
Does a new post-break structure add representation beyond inherited polarity history?

Q3:
Does C2 dual lineage outperform C0/C1 after common-parent PRICE_OHLC residualization?

Q4:
Does any apparent C2 "confluence" disappear once duplicate price information is de-duplicated?

Q5:
Do conclusions survive no-lookahead removal of L4 post-hoc cases?

None authorizes independent votes by default.

## 14. Information-root firewall for SDA-001

Every D01 structural representation in this tranche exports:

- informationRoot = PRICE_OHLC;
- representationFamily = D01_PRICE_GEOMETRY;
- parentDecisionId;
- structuralRootId;
- structuralVersionId;
- roleEpisodeId where relevant;
- redundancyGroup;
- rawRepresentationCount;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus.

Default:
residualIncrementalityStatus = NOT_VALIDATED.
effectiveIndependentEvidenceCount = 1.

A second structural root does not increase the count automatically.

## 15. Hindsight firewall for SDA-002

Every candidate exports:
- firstObservableAt;
- confirmedAt;
- predictorFreezeAt;
- latestAnchorAt;
- futureBarRequired boolean;
- replaySafe boolean;
- divergenceState.

Rules:
- confirmedAt > predictorFreezeAt => POST_HOC_NOT_ELIGIBLE;
- futureBarRequired = true => POST_HOC_NOT_ELIGIBLE;
- replaySafe != true => DATA_BLOCKED;
- missing negative/divergent cases => RESEARCH_COVERAGE_INCOMPLETE.

## 16. Required future D16 controls

For C0/C1/C2/C3 comparisons:
- same parent / same opportunity where possible;
- breakout quality;
- D02 acceptance/persistence;
- salience;
- volatility/liquidity/regime;
- DL-031 age;
- DL-032 scale migration;
- DL-033 displacement/path;
- DL-035 retest-arrival selection;
- pretest new-structure timing;
- common PRICE_OHLC ancestry.

D16 owns residual incrementality and dependence-aware inference.

## 17. Required manifest fields

Per parent / opportunity:
- parentDecisionId;
- symbol;
- timeframe;
- semanticSpace;
- oldStructuralRootId;
- oldStructuralVersionId;
- roleEpisodeId;
- oldBoundaryLower;
- oldBoundaryUpper;
- breakoutConfirmedAt;
- predictorFreezeAt;
- firstRetestOpportunityAt;
- newCandidateId;
- newCandidateFirstObservableAt;
- newCandidateConfirmedAt;
- newCandidateRootId;
- newCandidateVersionId;
- newBoundaryLower;
- newBoundaryUpper;
- newAnchorIds;
- newLatestAnchorAt;
- intervalOverlapRatio;
- centerDistancePrice;
- centerDistanceAtr;
- lineageClass;
- informationRoot;
- representationFamily;
- redundancyGroup;
- rawRepresentationCount;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- replaySafe;
- futureBarRequired;
- divergenceState;
- manifestVersion/hash.

No future return / bounce outcome belongs in this manifest.

## 18. Current decision

SPATIAL_OVERLAP_EQUALS_SAME_ROOT =
FALSE.

NEW_STRUCTURAL_ROOT_EQUALS_NEW_INDEPENDENT_VOTE =
FALSE.

RETEST_BAR_CAN_CERTIFY_ITS_OWN_PREDICTOR =
FALSE.

POST_TEST_CONFIRMATION_CAN_EXPLAIN_PRIOR_TEST =
FALSE.

SAME_ROOT_EXTENSION_COUNTS_AS_NEW_ROOT =
FALSE.

DUAL_COLOCATED_DEFAULT_INDEPENDENT_EVIDENCE_COUNT =
1.

INFORMATION_ROOT =
PRICE_OHLC.

RESIDUAL_INCREMENTALITY_STATUS =
NOT_VALIDATED.

SDA_001_STATUS =
REMEDIATION_IN_PROGRESS.

SDA_002_STATUS =
REMEDIATION_IN_PROGRESS.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 19. Exact next continuation

1. Build deterministic old/new structural-lineage classifier, overlap descriptors and no-lookahead eligibility helper.
2. Add adversarial cases for retest-bar self-confirmation, later pivot confirmation, same-root extension, dual co-location and unresolved overlap.
3. Export SDA-001 informationRoot/redundancyGroup/effectiveIndependentEvidenceCount diagnostics without changing Formal scoring.
4. Hand C0-C4 and residual/common-parent inference semantics to D16.
5. Preserve SDA-001/SDA-002 as REMEDIATION_IN_PROGRESS until machine guards, D16 evidence and 00 closure exist.
6. Next D01 science: quantify topology identity robustness when multiple detector parameterizations generate the same apparent post-break root, without creating an indicator zoo.
7. No outcome join / no runtime wiring / no Formal change.
