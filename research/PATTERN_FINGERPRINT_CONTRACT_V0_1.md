# D01 DL-014 — Pattern Identity / Observation Fingerprint Contract V0.1

Updated: 2026-10-02 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / FINGERPRINT_SEMANTICS_FROZEN / NO_RUNTIME_WIRING

## 1. Problem

A Pattern structural episode can persist across multiple decision parents/dates.

Its immutable structural identity should remain stable.

But its as-of observation legitimately evolves:
- FORMING -> MATURE -> BREAKOUT;
- availableAir changes as price moves;
- major-zone lifecycle changes;
- overlap/context states change.

One hash cannot safely mean both:
"same structural object"
and
"same as-of observation".

## 2. Frozen two-layer fingerprint

### A. structuralIdentityFingerprint

Purpose:
certify the immutable structural object/relation identity.

Pattern episode binds:
- symbol;
- semanticSpaceId;
- detectorFamilyVersion;
- latentFamily;
- scale;
- ordered confirmed anchor IDs;
- immutable anchor pivotAt/confirmedAt;
- initialConfirmedAt;
- immutable boundary IDs/versions/coordinates owned by the structural object.

RG2 relation binds:
- symbol;
- semanticSpaceId;
- relationDefinitionVersion;
- localBoundaryId/version + immutable coordinates;
- parentZoneId/version + immutable coordinates.

This fingerprint MUST NOT bind:
- current lifecycle state;
- latest price;
- availableAir;
- touchCount;
- above-zone streak;
- outcome.

If the same episode/relation item key produces a different structuralIdentityFingerprint:
PROVENANCE_CONFLICT.

### B. observationPayloadHash

Purpose:
certify one exact as-of Pattern observation attached to one immutable decision parent.

Binds:
- parentDecisionReceiptId;
- captureGeneration;
- parentScopeId;
- evidence_item_key;
- observerVersion;
- as_of / available_at;
- structuralIdentityFingerprint;
- current lifecycle/maturity state;
- DL-008 timeframe / effective-horizon / boundary provenance;
- DL-009/010 RG2 current geometry/lifecycle fields;
- explicit cross-lane receipt references actually consumed;
- dataQuality/status reason fields.

Does NOT bind:
- later outcome;
- created_at retry timestamp;
- database insertion order;
- later source revision not available at as_of.

Same generic child identity + different observationPayloadHash:
PROVENANCE_CONFLICT.

Different later parent/as_of + same structural episode key:
a different observation row is allowed and expected.

## 3. ROOT hash

ROOT attempt is parent-level observer coverage, not a structural episode.

ROOT payload hash binds:
- exact parent linkage/generation/scope;
- observerVersion;
- attempt status;
- status/reason;
- source/continuity availability summary;
- episode item-key set emitted for this parent;
- QA flags for this parent attempt.

ROOT must not infer alpha or aggregate episode signs.

## 4. Episode-set integrity per parent

A multi-object Pattern parent can emit zero/many episode rows.

ROOT should commit to:
sorted deterministic episode item keys
or an episodeItemKeysetHash.

This detects:
- missing episode row;
- duplicate episode row;
- foreign episode attached to the parent;
without treating episode count as parent coverage.

## 5. Cross-day episode de-dup

Same structuralEpisodeKey across different parentDecisionReceiptIds:
same structural object observed on different decision dates.

Do not collapse those rows for state reconstruction.

For inference effective N:
cluster by structural episode/relation episode as preregistered.

Thus:
persistence rows are longitudinal observations,
not independent event replications.

## 6. Multi-scale immutable vs mutable fields

Immutable / identity-bound:
- relationDefinitionVersion;
- aggregationBoundaryVersion definition label;
- timeframe definition;
- detector family/version;
- source semantic-space version;
- confirmed anchor identities;
- local/parent boundary IDs/versions/coordinates.

As-of mutable:
- barCompletionState;
- featureAgeEligibleSessions;
- current overlap/alignment state;
- availableAir;
- current parent lifecycle;
- current child lifecycle;
- current constrained/blocked observation state.

A definition-version change creates new observer/relation lineage.
It does not rewrite old rows.

## 7. Cross-lane receipt fingerprinting

Do not hash copied large source payloads inside Pattern.

Bind immutable references:
- sourceReceiptId/hash;
- continuity receipt reference;
- session receipt reference;
- round-price control receipt/version when consumed;
- D02/regime child reference when consumed.

If a later source revision appears:
create/refer to a new source receipt.
Never update the old Pattern row to point backward to the revision.

## 8. Outcome firewall

Outcome fields are excluded from:
- structuralIdentityFingerprint;
- observationPayloadHash;
- ROOT payload hash.

Outcome joins happen later under separate analysis identity.

This prevents detector/payload identity from becoming outcome-dependent.

## 9. Current decision

STRUCTURAL_IDENTITY_FINGERPRINT = FROZEN_V0_1.
OBSERVATION_PAYLOAD_HASH = FROZEN_V0_1.
ROOT_EPISODE_SET_COMMITMENT = REQUIRED_DESIGN.
OUTCOME_IN_FINGERPRINT = PROHIBITED.
RUNTIME_IMPLEMENTATION = NO_GO.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 10. Exact next continuation

1. Add fingerprint field requirements to Pattern shared-child v0.3.
2. Define pure canonical payload builders/test fixtures; execution can remain pending if no Node receipt is available.
3. Audit cross-parent episode clustering semantics for future RG2 inference.
4. Do not wire persistence before shared immutable parent runtime exists.
