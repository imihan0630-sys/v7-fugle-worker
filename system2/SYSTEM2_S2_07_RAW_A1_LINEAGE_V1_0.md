# System 2 S2-07 RAW A1 Lineage V1.0

Updated: 2026-10-07 Asia/Taipei  
Status: RESEARCH_ONLY / BUILD_LANE / PHYSICALLY_VERIFIED  
Formal Core: LOCKED  
Trading authority: NONE

## Purpose

Bind only the four V0.9 physically positive corporate-action native-session cases to existing System 2 RAW A1 lineage without mutating RAW bars, generating adjusted prices, or promoting technical continuity.

The bounded cases are:

- 3086 / TPEX / PAR_VALUE_CHANGE / resume 2026-04-20
- 4806 / TPEX / CAPITAL_REDUCTION / resume 2026-10-02
- 5381 / TPEX / CAPITAL_REDUCTION / resume 2026-04-13
- 6241 / TPEX / CAPITAL_REDUCTION / resume 2026-08-25

No other V0.9/V0.7 event may enter V1.0.

## Positive bounded lineage grade

A case may become:

`BOUNDED_RAW_A1_LINEAGE_READY`

only when all of the following hold:

1. upstream native symbol-session evidence is `BOUNDED_NATIVE_SYMBOL_SESSION_EVIDENCE_READY`;
2. the corporate-action native sourceId and sourceRowHash are present;
3. the immediate official market session before `stopTradingStart` is resolvable;
4. the resume/effective date is an official market session;
5. there is exactly one canonical RAW A1 row for the pre-suspension session;
6. there is exactly one canonical RAW A1 row for the resume/effective session;
7. no RAW A1 row exists for the symbol on any official market session inside the certified suspension window;
8. no bounded-date RAW A1 revision ambiguity exists;
9. each participating RAW row has exact market/symbol/RAW canonical key plus barId, barHash, sourceId, sourceRowHash, observedAt, availableAt and PIT-replay eligibility.

## What V1.0 does not prove

A positive bounded lineage result does **not** prove:

- exchange-wide suspension-history completeness;
- no-suspension history;
- all-history event completeness;
- exact public knownAt for the corporate action;
- technical continuity;
- correct adjustment factor;
- adjusted-price continuity;
- strategy/assessor readiness;
- ranking or capacity readiness;
- final/live selection;
- notification/push eligibility;
- capital/order authority.

`continuity_state` on an existing RAW A1 row is read as provenance only. V1.0 does not rewrite it.

## Fail-closed blockers

Examples include:

- `NATIVE_SYMBOL_SESSION_EVIDENCE_NOT_READY`
- `NATIVE_SESSION_PROVENANCE_MISSING`
- `PRE_SUSPENSION_OFFICIAL_SESSION_NOT_RESOLVED`
- `RESUME_OFFICIAL_SESSION_NOT_VERIFIED`
- `PRE_SUSPENSION_RAW_A1_BAR_MISSING`
- `RESUME_RAW_A1_BAR_MISSING`
- `RAW_A1_REVISION_AMBIGUITY`
- `SUSPENDED_SESSION_RAW_A1_BAR_PRESENT`
- `RAW_A1_CANONICAL_KEY_MISMATCH`
- `RAW_A1_IMMUTABLE_PROVENANCE_MISSING`
- `RAW_A1_PIT_PROVENANCE_NOT_READY`

Missing A1 coverage remains UNKNOWN/BLOCKED. It is never backfilled or fabricated by this lane.

## Physical probe

The readonly physical probe:

`system2/scripts/probe_s2_07_raw_a1_lineage_readonly_v1_0.mjs`

will:

1. read the V0.9 physical receipt;
2. freeze the same four positive cases;
3. build the official market trading calendar;
4. read only the isolated `system2-research` D1;
5. query existing `s2_historical_a1_bars` RAW rows for each bounded lineage window;
6. evaluate lineage;
7. report exact blockers and D1 read metrics;
8. assert `rowsWritten=0`.

The workflow must not issue INSERT / UPDATE / DELETE, deploy a Worker, write a secret, mutate R2, or touch System 1 production files.

## Authority firewall

V1.0 freezes:

- `rawBarsMutated=false`
- `adjustedPriceGenerated=false`
- `continuityTransformPerformed=false`
- `technicalContinuityCertified=false`
- `symbolSessionCompletenessCertified=false`
- `selectionAuthority=false`
- `finalSelectionEnabled=false`
- `livePushEnabled=false`
- `capitalImpact=false`
- `orderImpact=false`
- `system1RuntimeUsed=false`

## Next gate

Only cases with physically positive V1.0 RAW A1 lineage may proceed to a later technical-continuity contract.

Cases blocked by missing persisted RAW A1 coverage remain blocked and must not be repaired by BUILD_LANE through ad-hoc history writes. Historical population remains subject to DATA_LANE ownership and canonical data governance.


## Physical execution result

Authoritative main execution:

- implementation merge: `4c2350b499f3412b6a2be650c5d601ace2eea760` (PR #718);
- readonly workflow: `System2 S2-07 RAW A1 Lineage V1.0 Readonly`;
- run `37496251790` / job `112381430570`: PASS;
- System2 Research CI `37496251753`: PASS;
- V8 Regression `37496251698`: PASS.

Observed result:

- 4 bounded V0.9-positive cases evaluated;
- 1 lineage-ready case: 4806;
- 3 blocked cases: 5381, 6241, 3086;
- each blocked case lacks both the pre-suspension and resume-date persisted RAW A1 row in isolated D1;
- 4806 has exactly one pre-suspension RAW row and one resume-date RAW row, with zero RAW rows during certified suspended official sessions;
- D1 read-only metrics: 6 requests, 12 rows read, 0 rows written.

The 4806 participating RAW rows retain `continuityState=UNVERIFIED`. Therefore V1.0 proves bounded source/session lineage only; it does not certify technical continuity or any adjustment transform.

Durable evidence:

- `system2/evidence/S2_07_RAW_A1_LINEAGE_V1_0_PHYSICAL_20261007.md`
- `system2/evidence/S2_07_RAW_A1_LINEAGE_V1_0_PHYSICAL_20261007.json`

Exact continuation:

1. BUILD_LANE may advance 4806 only into a bounded technical-continuity contract/probe;
2. 5381 / 6241 / 3086 remain blocked on canonical RAW A1 population and stay DATA_LANE-dependent;
3. BUILD_LANE must not fill those historical gaps ad hoc;
4. no result generalizes to the other 13 V0.9-blocked events or to selection/trading authority.
