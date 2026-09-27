# ANNOUNCEMENT_RISK — Readiness / Lexical Veto Research

Updated: 2026-09-27 Asia/Taipei  
Status: STRUCTURAL_FALSIFICATION / OUTCOMES CLOSED  
Formal Core: LOCKED

## AR-001 — Scope

This lane audits the current System 1 Formal announcement veto only. It does not duplicate the broader Event-Risk lane.

Current order:
1. the preceding source-completeness gate requires `announcementsVerified===true`;
2. Formal then rejects when any retained `officialAnnouncements` title matches:
   `/停止交易|重大損失|重整|退票|財報不實/`.

No threshold or veto change is authorized.

## AR-002 — Source semantics

The official synchronization script fetches:
- TWSE `t187ap04_L`;
- TPEx `mopsfin_t187ap04_O`;

and requires HTTP success before it posts the payload to the trusted quality-data route.

The Worker validator checks the declared endpoint strings and requires both payloads to be arrays. It then:
- validates symbol/date/title for rows it processes;
- keeps only announcements from scanDate back 30 calendar days;
- groups retained rows by symbol;
- returns `sourcesVerified:true`.

There is no minimum announcement count or per-market row-count acceptance floor.

Thus an empty official response is not automatically invalid, but the persisted snapshot does not retain enough transport/raw-response evidence to prove later that a zero-event snapshot was a witnessed official empty response rather than simply an accepted trusted empty injection.

This is a provenance limitation, not evidence that a live scan used bad data.

## AR-003 — Global verification is not per-symbol coverage

After the snapshot exists, `announcementsVerified` is assigned globally to every market row.

A symbol with no retained event array is treated as a verified empty set by `(officialAnnouncements || [])`.

That is internally consistent with current Formal semantics, but it means:
- `sourcesVerified` is not a stock-level denominator;
- event count is not market-symbol coverage;
- a promotion-grade scarcity study needs the same-generation parent Formal-reach population plus immutable source receipt.

## AR-004 — Fixed lexical counterexamples

The deployed regex is intentionally simple and literal. It cannot resolve negation, event status or synonyms.

Potential false-positive representations:
- `澄清：本公司並無重大損失`;
- `重整計畫執行完畢，恢復正常營運`.

Both contain deployed keywords.

Potential false-negative representations:
- `本公司股票自明日起停止買賣`;
- `財務報告涉有不實`.

Neither necessarily contains the exact deployed keywords.

These are structural representation counterexamples only. They do **not** prove that removing or widening/narrowing the veto improves selection.

## AR-005 — 30-day state is presence, not unresolved-risk state

The validator retains title/date over a fixed 30-calendar-day window. The Formal gate does not encode:
- event category id;
- correction/revision linkage;
- resolved/unresolved status;
- negation;
- disclosure time;
- firstKnownAt.

Therefore a title hit means “matching text exists in retained 30-day official重大訊息 rows”, not “a currently unresolved severe risk is proven”.

## AR-006 — Evidence boundary

Before any D1/D3/D5/D10/D20/MFE/MAE inference:
- exact parent Formal reach must be immutable and same-generation;
- source fetch/ingestion time and source response identity must be preserved;
- exact regex version must be pinned;
- missing lineage remains UNKNOWN;
- first-failure counts are not marginal effects.

Machine artifacts:
- `research/announcement_risk_readiness_observer_v0_1.mjs`;
- `research/announcement_risk_readiness_falsification_v0_1.json`;
- `tests/test_announcement_risk_readiness_observer_v0_1.mjs`.

Decision:
`ANNOUNCEMENT_SOURCE_VERIFICATION_IS_SCAN_GLOBAL / VERIFIED_EMPTY_LACKS_PERSISTED_TRANSPORT_WITNESS / TITLE_REGEX_SEMANTICALLY_INCOMPLETE / HISTORICAL_PIT_NOT_CERTIFIED / PROSPECTIVE_CAPTURE_WARRANTED / FORMAL_UNCHANGED`.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists.
