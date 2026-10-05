# System 1 — SDA-001 / SDA-004 / SDA-016 Class A implementation

Status: ENGINEERING_IMPLEMENTED / VALIDATION_PENDING (not ticket closure)
Classification: CLASS_A_OFFLINE_RESEARCH_SHADOW_ONLY
Formal Core: LOCKED / no runtime change / no version increment
Baseline: latest main fetched at implementation start, aaa04683e5bc9677367ccee9069cc09ec86c37f7.
This SHA records the reviewed input, not future authority; always re-fetch main.

## Completed delta

Reused the frozen D03 JSON registry and TI-701–716 semantics, the canonical
alpha-lineage guard and existing experiment preregistration policy. No R1/R2,
indicator formula, D03 research or Formal scoring was redesigned.

- SDA-001: `system1_sda_shadow_v0_1.mjs` produces a deterministic, generation-
  referenced receipt with factor lineage, root overlap matrix, overlapping
  signal indices, redundancy-group contributions, raw active signal count,
  deduplicated family count, rank sensitivity and raw-vote/dedup Shadow Top6.
  The supplied immutable Formal selected symbols are preserved separately.
- SDA-004: versioned registrations resolve D03-11 to D03-02, pin the canonical
  D03 registry digest, reject conflicting duplicate versions and mapping drift,
  and bind aliases to the original parameter/experiment family. Identical
  duplicate registrations are idempotent. Registry/receipt digests use canonical
  JSON + SHA256 with domain separation. `extendFactorRegistry` enforces an
  externally retained prior digest; `freezeFactorExperiment` binds the registry
  digest, exact candidate parameters/versions and canonical parameter family.
  Cross-family experiments require a separate D16 contract. No new formula evaluation is introduced.
- SDA-016: `experiment_holdout_guard_v0_1.mjs` freezes experiment version,
  target/benchmark definitions and hashes, candidate set, factor/parameter
  family, horizon, MDE, multiplicity/stop policy and holdout identity. Append-only
  hash-linked events retain negative/null/failed outcomes, reject silent changes,
  track first inspection/use count and lock outcomes. Repeated inspection marks
  the shared holdout as development data. New experiment versions or renamed
  holdouts with the same dataset digest cannot restore OOS eligibility.
- `tests/run_system1_sda_shadow_v0_1.mjs` offers an explicit local CLI, exclusive
  ledger writer lock, expected-head compare-and-swap, fsync/readback and
  create-only diagnostic receipts. There is no schedule, provider or Production
  connection, collector mutation, D1 write, business scan or historical repair.

## Frozen diagnostic interpretation

`BINARY_ACTIVE_CONNECTED_ROOT_FAMILY_V0_1` counts declared active conditions;
these are diagnostic scores, never priorityScore or a replacement Formal rank.
Known active signals sharing any information root, redundancy group or direct
parent/child link collapse transitively to one family. A mixed D02 price/volume
signal remains a residual candidate, not a proven additional vote. Cosmetic
values/transforms do not affect this binary family score. Different windows
remain in the same canonical D03 parameter family.

`effectiveIndependentEvidenceCount=0` in this conservative first implementation.
There is deliberately no proof-label bypass or promotion API. Deduplicated
family count may be positive but does not establish independent Alpha.
Missing lineage/registration, non-boolean activity, missing/future observation
clock or outcome-only factors are INCOMPLETE. Any incomplete eligible candidate
blocks the aggregate Shadow ranking; no favorable complete-case Top6 is emitted.
Within complete data, both Shadow rankings use the identical supplied Formal-
eligible set, GENERAL <1000 / THOUSAND >=1000, 3 per pool, no cross-pool fill,
and stable input order for ties. Actual Formal selection is only a reference.

A registry entry contains factorId, factorVersion, moduleId (canonical D03 ID,
or null for a supplied D01/D02/other contract), experimentVersion, parameters,
optional aliasOf `[factorId, factorVersion]`, and lineage. D03 lineage comes
from the pinned registry, not caller overrides. Other-domain contracts require
all canonical lineage fields; this module cannot certify their source truth.

Signal fields: factorId, factorVersion, active (boolean), firstObservableAt
(timezone-qualified instant). Candidate fields: symbol, officialClose,
formalEligible, signals. The diagnostic input also requires generationId,
decisionAt, sourceReceiptDigest, registry, formalSelectedSymbols.

The parent digest is a binding reference, not authentication of C1 pages.
Use only already-verified same-generation C1 inputs. Legacy receipts without
lineage are not repaired from today's data. The existing collector is unchanged;
automatic genuine-session integration is a separate continuation, not claimed
by synthetic fixtures or this explicit offline CLI.

## Holdout guard scope and operation

The current policy is `SINGLE_INSPECTION_THEN_DEVELOPMENT`. D16 has not yet
frozen a generic sequential-valid exception, so unsupported policies are
rejected. First inspection does not authorize promotion; every state retains
`promotionAuthorized=false`, `d16SemanticReview=PENDING` and independent 00
closure pending. Outcome locking requires an inspection by that experiment,
not merely another experiment's inspection of the same holdout. Negative and
failed variants remain in the ledger/family budget.

The ledger is a local append-only protocol, not tamper-proof storage. Callers
must retain the latest head in a separately trusted checkpoint; verification
rejects truncation, mutation, reordering or stale writes relative to that head.
A malicious writer controlling both ledger and trusted head is outside this
Class A guarantee. Inspect calls must be recorded before outcome access;
this module cannot observe manual/out-of-band peeking. Dataset overlap with
*different* digests requires D16 semantic review; digest equality only catches
exactly identical holdouts. No historic preregistration is fabricated.
A crash can leave a lock or incomplete final line; the CLI fails closed and
requires inspection/recovery against the retained head, never silent reset.

```sh
node tests/run_system1_sda_shadow_v0_1.mjs diagnose input.json NEW-receipt.json
node tests/run_system1_sda_shadow_v0_1.mjs ledger-append event.json ledger.ndjson EXPECTED_HEAD
```

A new ledger starts with 64 zeroes as EXPECTED_HEAD. Event input contains
`eventId`, `at`, and `action`. Actions are REGISTER (experimentId/version +
frozen spec), INSPECT (+ inspectionId), LOCK_OUTCOME (+ result/outcomeDigest).
Use `definitionHash()` for target/benchmark hashes, and `freezeFactorExperiment()`
to bind `factorRegistryDigest` and the canonical frozen parameter family. Preserve returned head
before the next write. Tests contain executable complete input examples.

## Validation and protected outputs

- Dedicated adversarial/CLI suite and frozen D03 contract fixture: PASS.
- Full isolated review: 101/101 PASS, 451 protected functions; exact-head GitHub
  CI results are recorded in the PR. This includes prior main's existing
  guarded capture patches, not additional runtime changes from this task.
- Runtime Worker, guarded patches, runtime-bound research modules, schema,
  Formal eligibility/ranking/Top6/capital/plans/signals/15m/push/orders, System 2,
  existing C1/C2 collector and C3 registration: unchanged by this diff.
- Provider-call delta = 0; Production/D1 resource delta = 0. Offline overlap
  construction is O(signals²) per candidate; no live CPU claim is made.
- No Cloudflare deploy-trigger file changes. Rollback: revert this additive
  Class A commit; preserve append-only ledgers/receipts and externally held heads.

## Exact next action

1. Complete PR exact-head Regression, Repair CI and isolated review; fix ordinary
   failures, then merge only this Class A diff if checks and latest-main scope
   remain clean. No runtime/Production approval is conveyed.
2. D03 reviews consumer mapping drift; D01/D02 supply exact factor registrations
   and observation clocks for already-verified genuine C1 inputs. Produce the
   first genuine-session receipt without backfilling old lineages.
3. D16 freezes generic consumption/parameter-budget semantics and supplies
   common-support residual/OOS/multiple-testing evidence. Extend only via a new
   contract version; do not relax the conservative current guard in place.
4. System 2 may evaluate reuse of the shared offline ledger/contract in its own
   lane. No System 2 file or behavior changed here.
5. 00 performs independent cross-domain readback; no SDA ticket is CLOSED by
   this implementation or test pass.

FIRST_GENUINE_SDA_SHADOW_DIAGNOSTIC=PENDING_VERIFIED_LINEAGE_INPUT
D16_RESIDUAL_OOS_VALIDATION=PENDING
ROOM00_INDEPENDENT_CLOSURE=PENDING
economicSuperiority=UNKNOWN
formalOptimizationCandidate=NONE
