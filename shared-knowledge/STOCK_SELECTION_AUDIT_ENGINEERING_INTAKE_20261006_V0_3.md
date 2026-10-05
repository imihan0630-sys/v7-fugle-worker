# Stock Selection Audit — Engineering / Research Intake 2026-10-06 V0.3

Updated: 2026-10-06 Asia/Taipei
Status: LATEST_MAIN_INTAKE_COMPLETE / NO_TICKET_CLOSED
Owner: 00｜研究總控室
Formal Core impact: NONE

## Scope

Latest-main changes after the staged Selection Shadow Launch Gate were audited against frozen SDA remaining deltas.

Primary reviewed items:
- System1 PR #644 — V8.19 C1 scan-origin / generation inventory;
- SDA-016 V0.4 validation oracle;
- D16 admission-sensitivity receipt V0.2;
- D18 replication-support receipt V0.1;
- D02 PVE-246 root-cause certification;
- D03 mixed-root residual selection-identification addendum;
- D06 revision-clock / informative-missingness guards;
- D01/D02 pattern-volume-at-price context.

No unrelated System2 S2-07 progress is credited to SDA-016/SDA-017.

## SDA-016 — validator self-confirmation / holdout contamination

New accepted research authority:
- validation oracle is now V0.4 with 48 blocking tests;
- closure still requires all blocking tests plus independent Room00 readback;
- new requirements explicitly cover authoritative Formal-decision -> exact C1-generation binding, same-session generation ambiguity, generation-set finalization, adaptive parent selection and mutable historical pointers;
- D16 admission-sensitivity receipt V0.2 defaults to no evidence when parent/admission/positivity/missingness identity is incomplete.

System1 PR #644 readback:
- PR remains OPEN / DRAFT / NOT_MERGED / NOT_DEPLOYED;
- exact-head CI and dedicated 12-case contract pass;
- accepted candidate scope adds immutable scanOrigin and same-session generation inventory;
- no historical scan-origin backfill;
- corrupt/missing modern provenance fails closed;
- inventory uses existing canonical C1 table;
- engineering is a useful provenance partial pass.

Still NOT solved by PR #644:
- immutable historical authoritative Formal decision -> exact C1 generation ledger;
- finalized same-session generation-set receipt;
- shared System1/System2 holdout-consumption authority;
- genuine deployed V8.19 readback;
- complete V0.4 T01-T48 pass.

Decision:
SDA-016 remains REMEDIATION_IN_PROGRESS.
PR #644 must not be counted as closure or prospective evidence.
Its merge/deploy remains behind its explicit owner-approval gate.

## SDA-017 — post-hoc Regime mining / support fragmentation

New accepted research authority:
- latest SDA-017 oracle V0.3 has 48 blocking tests;
- D18 replication-support receipt V0.1 freezes multi-axis support rather than one scalar effective N;
- structuralEpisodeN, replicationEpisodeN and mechanicalFragmentN remain distinct;
- learned/fitted Regime dimensions require decision-time fit lineage;
- narrow calendar recurrence / one replication cluster cannot establish general Regime support.

Current engineering readback:
- no new System2 SDA-017 episode/support observer implementation found in this intake;
- S2-07 bounded revision/query-integrity work is unrelated and receives no SDA-017 credit.

Decision:
SDA-017 remains REMEDIATION_IN_PROGRESS / ENGINE_PENDING.

## SDA-003 — D02 H001 / live 15m evidence

PVE-246 converts three previously broad blockers into certified root causes:

A. After-market cron identity regression
- actual Cloudflare schedule is combined 23:35+23:55;
- runtime recognizes only the exact single 23:35 expression;
- both events are misclassified as INTRADAY_MONITOR and skipped.

B. Historical 15m baseline starvation
- intended 180-day bootstrap exists;
- bootstrap is downstream of successful after-market scan;
- the cron misclassification prevents it from running;
- fallback session growth also failed because the live monitor did not reach the completed 13:00 slot.

C. Raw source provenance loss
- provider / endpoint / rawPayloadHash are dropped before persisted PV snapshot construction;
- semanticFingerprint is not an acceptable substitute.

Important:
- remediation is not implemented yet;
- the historical provider call has not been physically proven under a repaired path;
- 2026-10-05 remains permanently non-clean;
- clean H001 prospective dates remain zero.

Decision:
SDA-003 remains VALIDATION_PENDING, now with ROOT_CAUSE_CERTIFIED / SYSTEM1_REMEDIATION_PENDING.

## SDA-001 / SDA-004 — same-root / mixed-root residual proof

New D03 evidence strengthens, but does not close, the promotion firewall:
- common support is necessary but not sufficient;
- observed complete cases may identify only an observed subpopulation;
- restricted-support results must carry the exact support identity and cannot be promoted as full-target evidence;
- positivity failure blocks target-population graduation;
- admission/missingness/imputation/evaluation cutoffs must be frozen pre-outcome;
- contract-semantics test receipt passes 12 cases but claims no empirical incrementality.

New D01/D02 pattern-volume-at-price evidence:
- D02-12 remains the owner of price-by-volume profile;
- D01 consumes, does not reconstruct a second profile engine;
- roots are PRICE_OHLC + TRADED_VOLUME;
- shared price ancestry is explicit;
- default effectiveIndependentEvidenceCount remains 1;
- historical profile synthesis from OHLCV is prohibited;
- traded volume is not current order-book liquidity and not investor cost-basis inventory;
- residual incrementality remains unvalidated.

Decision:
SDA-001 / SDA-004 remain REMEDIATION_IN_PROGRESS.
These artifacts are accepted as research-semantic strengthening, not an additional independent vote.

## SDA-007 — D06 lineage / missingness / revision semantics

New accepted controls:
- T/T+1/T+2 calendar rollover is not equated with actual revision publication;
- canonical table parsing outranks extraction-layer row-count summaries;
- disappearing later-vintage rows are not coerced to zero;
- eligibility-censoring, provider-removal, coverage/schema change and UNKNOWN removal causes are distinct;
- margin-short vs SBL universe mismatch is explicit and dropped SBL-only rows remain visible.

Decision:
SDA-007 remains REMEDIATION_IN_PROGRESS.
Learning semantics are stronger, while System1/System2 primitive receipt lineage and D16 residual validation remain pending.

## SDA-002 — D01 hindsight / future confirmation

No new closure credit:
- D01 semantics continue to deepen;
- latest queue still records adversarial test execution as pending;
- new pattern-volume context correctly forbids late/historical synthetic profiles but does not substitute for execution of the pending D01 adversarial suites.

Decision:
SDA-002 remains REMEDIATION_IN_PROGRESS.

## Selection Shadow Launch Gate impact

S0 = PASS, unchanged.

S1 = PARTIAL, unchanged.
Still blocking:
1. System1 SDA-001/004 three diagnostic schema deltas;
2. System1 SDA-009 leave-one-out diagnostic;
3. genuine same-generation parent binding / receipt.

PR #644 is useful toward provenance but is not merged/deployed and still does not establish authoritative Formal->C1 binding.

S2 = NOT_READY, unchanged.
The expanded SDA-016 V0.4 contract makes the prospective-comparison evidence standard clearer, not easier.

S3 = NOT_READY.
S4 = OWNER_APPROVAL_REQUIRED.
T1 = NOT_READY.

## Owner gates preserved

Generic continuation does NOT authorize:
- merge or deploy of System1 PR #644;
- Formal selection changes;
- any Class B/C action not already explicitly approved;
- unblocking SDA-010/SDA-012 protected dependencies.

## Exact next

Highest-value non-owner-gated work:
1. System1 Class-A: finish SDA-001/004 three output-schema deltas.
2. System1 Class-A: implement SDA-009 leave-one-out Shadow diagnostic.
3. System1 remediation design/test for PVE-246 may proceed only within correct A/B classification; production-changing schedule/persistence/runtime work must stop at the existing approval boundary.
4. System2: implement SDA-017 episode/support observer against 48-test oracle when assigned lane is available.
5. System1/System2: converge SDA-016 shared consumption authority; PR #644 alone is not sufficient.
6. Room11 revalidates only newly landed engineering deltas.
7. 00 continues event-driven intake and remains independent closure authority for SDA-016/SDA-017.
