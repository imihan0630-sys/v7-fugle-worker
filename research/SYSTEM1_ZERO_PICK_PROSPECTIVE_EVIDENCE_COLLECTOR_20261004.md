# System 1 zero-pick prospective evidence collector checkpoint

Date: 2026-10-04. Scope: collector-only / research-only. Implementation base:
`1d41285cc6ee7c802d641824052118cbccf1477b` (re-fetched main; supersedes handoff SHA).
V8.16.0 capture and deployment remain the already-completed PR #421 / #426 work.

`FIRST_PROSPECTIVE_C1_CHILD_READBACK=PENDING_NEXT_GENUINE_TRADING_SESSION`

## Implemented continuation

`adaptC1PopulationPages()` now deep-copies the original optional `zeroPickRankObservation`
from the verified immutable C1 generation. Its absence stays absent for legacy rows.
Existing diagnosis ignores the child. The paired collector adds an independent
`zeroPickProspective` section to the same `system1-c1-evidence.json`; original C1
summary/diagnosis, C2 paired artifact and C3 registration semantics are unchanged.

`system1_zero_pick_evidence_collector_v0_1.mjs` validates:

- V8.16+ capture schema, SHA256_FINALIZED state, same-generation pagination headers,
  feature population, research firewall and no-repair/provider-delta declarations.
- Original observation and tuple schema/lineage, symbol/pool/generation/session/decision
  identity, finite ranking fields (zero is valid), pool-local ordinal bounds/uniqueness,
  stored derived-source agreement, and recomputed canonical SHA-256 fingerprint.
- Request-local knownAt equals decisionAt and is never represented as source-event time;
  feature/sector event times remain null. Exact-date consensus retains updatedAt when
  present and rejects a later timestamp. Absent/wrong-date consensus has null accepted
  reference/event time and zero source count, score and bonus.
- COMPLETE requires a finalized tuple; INCOMPLETE requires null rankInput and reasons.
  Runtime source-rejection INCOMPLETE children may lack source metadata and remain
  unrankable. The collector never fills missing fields or rebuilds tuples.

Each row retains the original child and validation errors. Invalid tuples and invalid
capture headers fail closed for zero-pick research. They do not fail the existing
C1/C2 collection or change C3 registration. Core C1 digest/generation/pagination or
Formal pipeline failures retain their existing collection-blocking behavior.

Summary includes child/complete/incomplete/invalid/finalized counts and pool counts.
`LEGACY_NO_ZERO_PICK_CHILD` is an expected pre-V8.16 condition, not fabricated failure;
unversioned older fixtures are distinguished explicitly. A V8.16 feature row missing
its child is invalid. No retroactive backfill is allowed.

## Eligibility is separate from capture integrity

`legitimateZeroPick` requires the existing linked, verified completed scan proof,
strict numeric selectedCount=0 and every stored Formal selected flag=false.
Missing selected-count proof or non-zero selections still permit integrity verification,
but cannot make `readyForMatchedC5Join` true. A complete capture is not itself proof of
P1-A F9 eligibility. `eligibleForZeroPickCounterfactual=false` and
`cashEconomicComparisonAllowed=false` remain explicit until the existing matched C5
eligibility/pipeline is supplied independently. No all-F9 averaging or cash comparison
is performed by this collector.

`economicSuperiority=UNKNOWN`; `formalOptimizationCandidate=NONE`; Formal Core LOCKED.
Fixtures and offline SQLite/D1 readbacks do not change the pending first genuine sample.

## Automation and validation

The existing `.github/workflows/system1-c1-evidence.yml` schedule and endpoints are
unchanged. No extra job, provider request, business scan or weekend workflow dispatch.
The same artifact upload now includes the child automatically. Existing C3 requests
remain governed by the unchanged original registration branch.

Tests cover COMPLETE/INCOMPLETE, zero, fingerprint corruption, future PIT, exact/absent/
wrong-date consensus, immutable identity and pagination, pool-local ordinal stability,
legacy/no repair, malformed child isolation, actual CLI artifact serialization,
C1/C2/C3 parity and actual guarded-runtime offline D1-to-collector compatibility.
The collector test is included in Regression, Repair CI and the existing isolated
repair review runner. The protected-function allowlist is unchanged.

No Worker, guarded patch, D1 schema, runtime source module, Formal behavior, System 2,
Production deploy workflow or live state is changed. Changed paths do not match the
Cloudflare push-deploy filter. Repository CI, not live market evidence, establishes
engineering acceptance.

## Next continuation

After the next genuine completed trading-session scan, let the existing daily workflow
read the immutable generation. Inspect `zeroPickProspective` counts, errors, original
fingerprints and generation linkage. Record the first genuine child readback separately;
only then update the pending checkpoint based on real evidence. Non-zero-pick sessions
may establish capture integrity but cannot establish zero-pick economic superiority.
Do not repair old observations with later data or promote a single session to Formal.
