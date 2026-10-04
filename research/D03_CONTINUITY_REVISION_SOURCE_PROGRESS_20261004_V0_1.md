# D03 TECHNICAL_CONTINUITY Revision-Source Progress 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Lane: D03-09 ADX / D03-10 Bollinger / shared TECHNICAL_CONTINUITY
Status: OUTCOME_BLIND / PHYSICAL_SOURCE_CAPABILITY_ADVANCED / L3_NOT_YET_AUTHORIZED
Formal Core: LOCKED

## Purpose

Narrow the remaining D03-09 / D03-10 L3 blocker without maturity inflation.

This tranche physically tests whether official Taiwan public disclosure sources can preserve:
- original corporate-action disclosures;
- later corrections as distinct records;
- cancellation/revocation records;
- multiple corporate-action families.

It also separates transport availability from source-content truth.

No forward stock outcomes are inspected.

---

## TI-555 — MOPS modern gateway transport failure is not source-negative evidence

On 2026-10-04, GitHub Actions re-ran the already-accepted MOPS positive control and the new control matrix.

The modern gateway host `mops.twse.com.tw` failed standard TLS verification.

A dedicated read-only TLS diagnostic physically recorded:
- subject organization: Taiwan Stock Exchange Corporation;
- leaf CN: `mops.twse.com.tw`;
- OpenSSL verify return code: 10 / certificate has expired;
- leaf notAfter: 2026-05-31 15:59:59 GMT.

No TLS verification bypass was used.

Therefore:

`MODERN_MOPS_GATEWAY_TRANSPORT_UNAVAILABLE != MOPS_HISTORY_SOURCE_NEGATIVE`.

The prior 2026-10-03/earlier accepted original+correction witness remains valid historical capability evidence; a current transport failure cannot relabel it as absent source content.

`curl -k` / insecure certificate bypass is prohibited.

---

## TI-556 — direct official MOPSOV history path is physically usable with valid TLS

The repository already allowed official redirect host `mopsov.twse.com.tw`.

A dedicated physical read-only probe tested direct official historical access:

`https://mopsov.twse.com.tw/mops/web/ajax_t05st01`

TLS diagnostic:
- organization: Taiwan Stock Exchange Corporation;
- certificate notAfter: 2026-11-28 15:59:59 GMT;
- SHA-256 leaf fingerprint recorded by the workflow;
- standard verification PASS.

Direct 2467 historical query:
- HTTP 200;
- UTF-8 HTML;
- 10,907 bytes;
- two subject matches;
- one correction match;
- direct history positive control PASS.

No certificate bypass, D1 write, Production mutation, selection action or System 1 runtime behavior change occurred.

Conclusion:

`MOPSOV_DIRECT_OFFICIAL_HISTORY = PHYSICALLY_USABLE_READ_ONLY`.

The modern gateway is no longer a single transport point of failure for this research lane.

---

## TI-557 — multi-family correction/cancellation matrix physically passes 5/5

Physical workflow:
`System2 MOPS Revision Control Matrix Readonly`

Accepted run:
`37167344795`

Final state:
`MULTI_FAMILY_CORRECTION_AND_CANCELLATION_CAPABILITY_OBSERVED`.

Controls:

1. **2467 志聖 — DIVIDEND_EX_DATE**
   - original + correction;
   - matching rows = 2;
   - original = 1;
   - correction = 1;
   - distinct version keys = 2.

2. **1459 聯發 — CAPITAL_REDUCTION_SCHEDULE**
   - original 2026-06-23;
   - correction 2026-06-24;
   - matching rows = 2;
   - distinct version keys = 2.

3. **2321 東訊 — CAPITAL_REDUCTION_DECISION**
   - original 2026-03-09;
   - correction 2026-03-10;
   - matching rows = 2;
   - distinct version keys = 2.

4. **1342 八貫 — CASH_CAPITAL_INCREASE correction**
   - original + correction on 2026-06-16;
   - matching rows = 2;
   - distinct version keys = 2.

5. **1342 八貫 — CASH_CAPITAL_INCREASE cancellation**
   - official row on 2026-07-01 explicitly contains 撤銷;
   - cancellation control PASS.

Matrix summary:
- controlCount = 5;
- passCount = 5;
- correctionControlPassCount = 4/4;
- cancellationControlPassCount = 1/1;
- actionFamilyObservedCount = 4.

This falsifies the hypothesis that official historical material information cannot represent cross-family correction/cancellation chronology.

---

## TI-558 — capability PASS is not completeness certification

Even after 5/5:

- `boundedIntervalCoverageComplete=false`;
- `actionFamilyCoverageComplete=false`;
- `cancellationHistoryComplete=false`;
- `knownAtVersionClockCertified=false`;
- `revisionCoverageComplete=false`;
- `symbolSessionCompletenessCertified=false`;
- `technicalContinuityCertified=false`.

Reason:

A positive-control matrix establishes representational capability and transport feasibility.

It does **not** prove:
- every relevant company/action family appears;
- every historical correction/cancellation is discoverable;
- no pagination/truncation omission exists;
- every displayed date/time is a promotion-grade first-known clock;
- TWSE and TPEx source-family coverage is complete;
- every corporate-action event maps losslessly to the continuity transform.

Therefore:

`MULTI_FAMILY_CAPABILITY_PASS != REVISION_HISTORY_COMPLETE`.

---

## TI-559 — exact bounded-completeness contract needed next

A future bounded revision-history acceptance must freeze, before looking at technical outcomes:

### Query identity
- official host;
- endpoint;
- stockCode / market;
- ROC year / month or explicit bounded interval;
- request parameter fingerprint;
- transport mode;
- capturedAt;
- payload hash / bytes.

### Returned population
- complete returned row count;
- all row version keys;
- date/time/sequence;
- row content hash;
- correction/cancellation flag;
- action-family classifier;
- OTHER / UNKNOWN retained rather than dropped.

### Truncation/pagination proof
- page count / continuation semantics if present;
- no hidden additional page under the same bounded query;
- explicit failure if list-size ceiling is ambiguous;
- repeated query hash/reconciliation where appropriate.

### Version-clock proof
- source-reported date/time preserved;
- later correction never rewrites earlier row;
- display time is not silently promoted to firstKnownAt until owner/source semantics are certified;
- capture time remains distinct from source event time.

### Cross-source reconciliation
- relevant exchange final-result event;
- MOPS revision/cancellation versions;
- exchange official-document channel where required;
- unresolved mismatch => UNKNOWN/BLOCKED.

No absence claim is valid unless the bounded population itself is certified complete.

---

## TI-560 — immutable parent blocker is now owner-approved but still not physical

Latest main includes:
`research/SYSTEM1_SHADOW_COHORT_MEMBERSHIP_CLASS_B_HANDOFF_20261004.md`

Status:
`OWNER_APPROVED_CLASS_B / IMPLEMENTATION_PENDING / FORMAL_CORE_LOCKED`.

The owner has approved implementation of the additive shared research persistence/membership substrate.

However current canonical parent/persistence records still state:
- `CURRENT_PRODUCTION_IMMUTABLE_PARENT = NOT_IMPLEMENTED`;
- `RUNTIME_IMPLEMENTATION = NOT_IMPLEMENTED`;
- `D1_SCHEMA_IMPLEMENTATION = NOT_IMPLEMENTED`.

The handoff explicitly assigns implementation to Codex and requires guarded implementation/CI plus separate Production approval if concrete runtime/D1 deployment crosses that boundary.

Therefore D03 must not pretend that approval equals a physical parent receipt.

`OWNER_APPROVED_IMPLEMENTATION != PHYSICAL_IMMUTABLE_PARENT_GENERATION`.

---

## TI-561 — D03-10 Bollinger residual L3 gate

Bollinger remains the first re-review target because it is finite-window.

Required physical evidence remains:

1. approved immutable parent generation actually persisted/read back;
2. exact parent keyset / captureGeneration;
3. certified bounded TECHNICAL_CONTINUITY receipt;
4. exact 20 eligible-session continuity-corrected closes;
5. formulaVersion `BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1`;
6. population standard deviation semantics;
7. price-limit/special-session provenance;
8. replay/prefix exactness;
9. complete expected-parent attempt accounting.

The new MOPSOV 5/5 result satisfies **source capability reduction only**.
It does not satisfy items 1-3.

Therefore:

`D03_10_BOLLINGER = L2_REMAINS`.

---

## TI-562 — D03-09 ADX residual L3 gate

ADX requires everything Bollinger needs plus recursive-state authority:

- canonical H/L/C continuity path;
- Wilder state construction;
- FULL_REPLAY or replay-certified TRUSTED_PRIOR_STATE;
- source/state lineage hashes;
- invalidation/replay after historical continuity changes;
- exact +DM/-DM/TR/DX/ADX replay certification.

A positive MOPS revision matrix cannot certify recursive ADX state.

Therefore:

`D03_09_ADX = L2_REMAINS`.

---

## TI-563 — maturity decision

Current active D03 modules = 12.

This tranche materially narrows the shared continuity source blocker but does not satisfy the curriculum definition of L3 for D03-09 or D03-10.

Therefore:

- D03-09 = L2 / 40%;
- D03-10 = L2 / 40%;
- D03 overall = **56.7% unchanged**.

This is intentional anti-inflation.

The next honest percentage transitions are:

- Bollinger L2 -> L3 => D03 **58.3%**;
- then ADX L2 -> L3 => D03 **60.0%**.

Those transitions require physical evidence, not source-capability optimism.

---

## Current state

`MOPS_MODERN_GATEWAY_TLS = EXPIRED_ON_2026_10_04_PHYSICAL_RUN`

`MOPSOV_DIRECT_OFFICIAL_HISTORY = TLS_VALID / HTTP_200 / PHYSICAL_PASS`

`MULTI_FAMILY_CORRECTION_AND_CANCELLATION_CAPABILITY = 5_OF_5_PHYSICAL_PASS`

`BOUNDED_REVISION_COMPLETENESS = NOT_YET_PROVEN`

`IMMUTABLE_PARENT_CLASS_B = OWNER_APPROVED / IMPLEMENTATION_PENDING`

`CURRENT_PRODUCTION_IMMUTABLE_PARENT = NOT_IMPLEMENTED`

`D03_10_BOLLINGER = L2_REMAINS`

`D03_09_ADX = L2_REMAINS`

`D03_MATURITY = 56.7_PERCENT`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

## Exact next continuation

1. Do not retry the expired modern MOPS gateway as though transport retries prove source completeness.
2. Keep the direct official MOPSOV read-only path as the physically validated historical capability path.
3. Freeze and execute bounded query-completeness / truncation / version-clock tests outcome-blind.
4. Let the owner-approved Codex Class-B implementation lane build the shared immutable parent/membership substrate; D03 consumes it after physical merge/readback, not before.
5. Once bounded continuity + physical immutable parent exist, re-review Bollinger L3 first.
6. ADX follows only after recursive replay certification.
7. Raw D03 3-session source-version gate remains independently 2/3 until a genuine next Taiwan completed trading session.
8. TI-005/TI-006 outcomes remain closed.
