# System 2 Shadow Run Provenance V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH-ONLY / PROVENANCE CONTRACT / NOT DEPLOYED

## Purpose

Close the remaining audit gap between:
raw/source availability -> full-market accounting -> frozen decisions -> later outcome joining.

A future Shadow（影子模擬） outcome may be joined only when the run proves:
1. required source availability at decision time;
2. complete eligible-universe accounting;
3. frozen decision identities;
4. ranking/capacity/lifecycle provenance used by that run.

## Source Session Receipt（資料來源批次收據）

Each decision clock freezes:
- expected source IDs and roles;
- observed source IDs/versions;
- source state;
- sourceDate / availableAt / capturedAt;
- PIT（時點一致性） eligibility;
- payload hash where available;
- semantic version;
- required blockers;
- optional/context gaps.

Required-source failure states include:
- MISSING;
- UNKNOWN;
- STALE;
- INVALID;
- PIT_NOT_ELIGIBLE;
- PIT_FUTURE_VIOLATION;
- disallowed NOT_APPLICABLE.

Optional/context gaps are preserved but do not automatically block the run.

State:
- SOURCE_SESSION_READY
- SOURCE_SESSION_INCOMPLETE

Missing required evidence never becomes neutral or zero.

## Run Fingerprint（執行批次指紋）

The fingerprint links:
- source-session hash;
- full-universe Shadow accounting receipt;
- decision hashes;
- ordering hashes;
- ranking-experiment hashes;
- capacity hash;
- lifecycle hashes;
- strategy/version;
- Shadow spec;
- universe version;
- decision clock.

Hash arrays are canonicalized before hashing so irrelevant insertion order cannot change the fingerprint.

State:
- RUN_FINGERPRINT_COMPLETE
- RUN_FINGERPRINT_INCOMPLETE

Outcome joining is allowed only for COMPLETE.

## Anti-bias role

This contract prevents:
- adding a later source after the decision and treating it as known earlier;
- dropping failed/incomplete symbols before performance analysis;
- changing ranking/capacity records after seeing outcomes;
- mixing strategy versions or universe versions silently;
- joining outcomes to a run whose source session was incomplete.

## Current boundary

This proves provenance semantics only.

It does NOT:
- schedule daily capture;
- deploy a System 2 database;
- calculate alpha;
- authorize any live recommendation;
- change System 1/V8.

Physical persistence still requires an isolated System 2 database/binding.
