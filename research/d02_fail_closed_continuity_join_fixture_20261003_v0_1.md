# D02 fail-closed continuity join fixture V0.1
Updated: 2026-10-03 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / RESEARCH_ONLY / DETERMINISTIC_FIXTURE_PASS
PVE cursor: 239
Formal Core: LOCKED

## Purpose
Validate the frozen D02 continuity inheritance contract without production wiring, outcome inspection, or historical-to-prospective relabeling. The fixture tests whether D02 preserves decision-time provenance and fails closed when owner evidence is absent, late, or semantically insufficient.

## Frozen decision function
Inputs:
- observationKnownAt and featureKnownAt;
- expected symbol-session set;
- source rows keyed by symbol/session with volume unit/value and sourceFetchedAt;
- Corporate Actions receipt identity/version/eventFamily/knownAt/effectiveSession/unit factor/denominator semantics;
- verified suspension/non-session receipt;
- optional confirmed Pattern pivot identity/pivotAt/confirmedAt/scale/spec version.

Outputs:
- continuityJoinStatus;
- rawActivityEligible;
- comparableParticipationEligible;
- pivotVolumeEligible;
- unknownReasons;
- consumed owner receipt IDs/versions;
- exact comparable-session set/hash and missingExpectedSessionCount.

Rules:
1. Owner receipt with knownAt > featureKnownAt is unavailable at decision time.
2. Missing required owner coverage is UNKNOWN/BLOCKED, never NO_EVENT.
3. UNIT_SCALE requires a PIT-valid bridge or reset-clean >=20 post-reset comparable sessions.
4. SUPPLY_CHANGE may preserve RAW_ACTIVITY, but COMPARABLE_PARTICIPATION requires PIT denominator normalization or fully post-break >=20-session baseline.
5. Verified suspension removes that date from expected symbol sessions; it is not a zero-volume bar.
6. Missing expected source session cannot be replaced by an older row.
7. Valid confirmed pivot does not override a blocked volume path.
8. Later corrections append a new observation version and never rewrite the old decision-time state.

## Deterministic cases

### F01 CLEAN_OWNER_RECEIPTS
Setup: all required owner receipts known before feature cutoff; no unresolved unit break; expected sessions exactly match source sessions; >=20 comparable sessions.
Expected: continuityJoinStatus=PASS; rawActivityEligible=true; comparableParticipationEligible=true; missingExpectedSessionCount=0.
Falsifies: an implementation that blocks clean evidence merely because owner data are external dependencies.

### F02 MISSING_CA_RECEIPT
Setup: source rows exist, but required Corporate Actions coverage for the relevant interval is absent.
Expected: continuityJoinStatus=UNKNOWN_BLOCKED; raw/comparable eligibility not promoted; unknownReasons includes missing CA coverage.
Falsifies: missing receipt => NO_EVENT or clean continuity.

### F03 LATE_KNOWN_CA_CORRECTION
Setup: V1 owner receipt available at featureKnownAt; a corrected V2 with materially different unit/denominator semantics becomes known later.
Expected at original decision: consume V1 only and persist V1 identity. Expected after correction: append a new versioned observation using V2; never mutate the original decision record.
Falsifies: retroactive backfill that makes earlier features look cleaner than what was knowable then.

### F04 VERIFIED_SUSPENSION
Setup: official exchange session exists, but a verified symbol suspension receipt known by cutoff removes the symbol-date from expected sessions.
Expected: date excluded from expected comparable-session set; no zero-volume pseudo-bar; no missingExpectedSession increment for that verified suspension.
Falsifies: suspension == zero volume == missing row.

### F05 MISSING_EXPECTED_SOURCE_SESSION
Setup: an expected tradable symbol-session has no source row; an older row exists and positive-only/latest-N logic could otherwise pull it in.
Expected: continuityJoinStatus=DATA_BLOCKED; missingExpectedSessionCount>=1; older row forbidden from substituting; exact baseline identity preserved as incomplete.
Falsifies: numeric history count=20 implies semantic completeness.

### F06 VALID_PIVOT_BLOCKED_VOLUME
Setup: Pattern pivot is confirmed with legal pivotAt/confirmedAt and correct scale, but the between-pivot volume path crosses unresolved UNIT_SCALE or contains a missing expected source session.
Expected: pivot chronology remains valid; pivotVolumeEligible=false; D02-09 divergence observation blocked; no divergence outcome sample created.
Falsifies: valid price pivot implies valid price-volume divergence.

## Cross-case invariants
- Outcome independence: all expected states are determined without returns/MFE/MAE/false-break labels.
- Validity independence: a downstream threshold not flipping cannot rescue an invalid volume path.
- Version monotonicity: later knowledge can create a later observation version, never rewrite an earlier featureKnownAt.
- Population integrity: blocked rows remain explicit UNKNOWN/BLOCKED records and are not silently dropped into a cleaner denominator.
- Dependency ownership: D02 references owner receipts; it does not copy or fork authoritative Corporate Actions, session, or Pattern histories.
- No double maturity: dependency readiness is not D02 maturity evidence.

## Result
All six fixture cases have deterministic expected states under the frozen contract. The fixture therefore passes at the research-contract level.

This PASS does NOT prove:
- production/runtime wiring;
- complete dual-exchange owner coverage;
- prospective immutable collection;
- clean prospective date;
- economic/predictive value;
- OOS or Walk-forward performance.

Classification:
PRE_PVE_240_FAIL_CLOSED_JOIN_FIXTURE_PASS / RUNTIME_COMPLIANCE_UNPROVEN / OUTCOMES_UNUSED / PVE_239 / FORMAL_UNCHANGED.

Maturity remains D02 48.3%; D02-07 L2/40; D02-09 L2/40.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact continuation
Before PVE-240, the next safe work is a boundary/robustness matrix for the same join contract: simultaneous SUPPLY_CHANGE+UNIT_SCALE, multiple revisions around feature cutoff, partial owner coverage, duplicated source rows, conflicting session receipts, and baseline hash instability. Keep outcome-blind and research-only. PVE-240 remains reserved for the first genuine completed post-repair market session and Gate 0-6 must pass before Gate 7 outcomes.
