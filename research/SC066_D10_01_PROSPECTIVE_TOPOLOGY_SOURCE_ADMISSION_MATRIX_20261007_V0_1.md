# SC-066 — D10-01 Prospective Topology Source Admission Matrix V0.1

Status: RESEARCH_ONLY / ADMISSION_MATRIX_FROZEN / NO_MORE_SCHEMA_EXPANSION_WITHOUT_REAL_RECEIPT / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-01
Audit linkage: SDA-010
Date: 2026-10-07 Asia/Taipei
Parents:
- SC-062 prospective topology receipt contract
- SC-063 first post-freeze null observation
- SC-064 versioned graph timing contract
- SC-065 shared exposure primitive / no-double-vote contract
Observed main before write: `d66df5702c4052f7c942f653c98a12bea4d8ec6c`

## Purpose

Freeze deterministic admission/rejection rules for the first genuinely new post-freeze topology disclosure.

After this matrix, Room07 must not keep adding topology schema merely because no future receipt has arrived. Further schema expansion requires a real receipt that exposes a genuinely missing field.

## Source admission classes

### A. Direct issuer / exchange timestamped material disclosure

Examples:
- named supplier contract;
- named customer/supplier termination;
- new manufacturing source/facility;
- capacity reservation;
- alternate-source activation;
- supplier disruption with explicit alternate path.

Admission:
`ADMIT_PRIMARY` when captured prospectively.

Allowed graph effects:
- add scheduled edge;
- activate edge if economically active now;
- amend/expire/cancel edge;
- add event-revealed edge with knownAt at disclosure time.

Required:
- capturedAt;
- source-reported date/time when available;
- issuer;
- counterparty/source identity;
- relation scope;
- effective period if disclosed.

Missing capacity/qualification/common-mode remains UNKNOWN.

### B. Post-freeze issuer annual report

Admission:
`ADMIT_PRIMARY_PERIODIC`.

Allowed:
- update supplier set;
- procurement concentration;
- qualification strategy;
- common-mode statements;
- period-level relation status.

Firewall:
if the report newly reveals a relationship that existed before publication, `knownAt` for research decisions is publication/capture time unless an earlier authoritative disclosure is independently available.

Do not backfill prior decisions.

### C. Post-freeze sustainability / business-continuity report

Admission:
`ADMIT_PRIMARY_CONTEXT`.

Best for:
- qualification/audit process;
- geography;
- utility/common-mode dependencies;
- alternate resource plans.

Do not infer:
- supplier-specific economic weight;
- spare capacity;
- supplier identity when anonymized.

### D. Issuer investor presentation / press release

Admission:
`ADMIT_PRIMARY_EVENT_OR_PLAN` if issuer-hosted and prospectively captured.

Forward-looking plans:
`PLANNED_OR_SCHEDULED`, never ACTIVE merely because announced.

### E. Exchange/news mirror of an issuer material announcement

Admission:
`DISCOVERY_OR_SECONDARY_CLOCK`.

Can support:
- discovery;
- source-reported announcement text/time;
- cross-check.

Cannot alone certify:
- exact original official retrievability second for promotion-grade PIT if direct primary capture is missing.

### F. Media / analyst / supply-chain rumor

Admission:
`DISCOVERY_ONLY`.

No graph mutation without authoritative confirmation.

### G. Event disclosure revealing a new structural relationship

Admission:
`ADMIT_AT_EVENT_KNOWN_AT`.

Rule:
- event can reveal the edge now;
- it cannot make the edge known before now;
- pre-event graph remains immutable.

### H. No qualifying disclosure

Admission:
`NULL_OBSERVATION`.

Store denominator row.
Do not drop quiet dates.

## Deterministic decision sequence

1. Is the source authoritative enough for graph mutation?
   - no -> DISCOVERY_ONLY.
2. Was it captured after SC-062 freeze?
   - no -> historical calibration only.
3. Is capturedAt preserved?
   - no -> PIT_INELIGIBLE.
4. Does the source disclose a structural relation or structural state change?
   - no -> NULL / CONTEXT_ONLY.
5. Is counterparty/path identity explicit?
   - no -> IDENTITY_PARTIAL.
6. Is effectiveFrom disclosed?
   - yes -> preserve it separately from knownAt.
   - no -> do not fabricate.
7. Is capacity/exposure weight disclosed?
   - no -> UNKNOWN.
8. Is qualification/substitution disclosed?
   - no -> UNKNOWN.
9. Are common-mode dependencies disclosed?
   - no -> COMMON_MODE_UNKNOWN.
10. Emit append-only graph version.
11. Bind one D10 structural primitive id.
12. Downstream D17 references that id; it does not recreate it.

## Promotion-grade minimum for D10-01 L3 reconsideration

A receipt may trigger L3 reconsideration only when:
- post-SC-062;
- primary/accepted authoritative source;
- prospective capturedAt;
- sourcePublishedAt or bounded source clock preserved;
- structural mutation/state directly observed;
- knownAt/effectiveFrom split passes;
- identity guessing absent;
- UNKNOWN fields preserved;
- prior graph replays unchanged;
- no stock outcome used.

A NULL observation never promotes L3 by itself, but remains required denominator evidence.

## Stop rule

After SC-066:
`NO_MORE_D10_01_SCHEMA_EXPANSION_WITHOUT_REAL_NEW_RECEIPT`.

Room07 now shifts active research effort to other open L2 modules while monitoring the frozen gate.

Exact next active research lane:
D10-02 / SC-056 prospective physical-chain lead-lag continuation.

D10-01 background exact next:
first real post-freeze qualifying topology receipt.

Formal Core unchanged.
