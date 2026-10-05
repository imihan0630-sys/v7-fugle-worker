# System 2 TWSE Par-Value T05ST02 Daily Discovery V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY ANNUAL DAILY-INDEX DISCOVERY
System 1 Formal Core: LOCKED

## Purpose

Continue the sole remaining representative-routing gap:

`TWSE_PAR_VALUE_CHANGE_REFERENCE`.

Do not repeat the exhausted paths:
- TWSE par-value final-result-derived candidate scan;
- current-starred company scan;
- U04 issuer-announcement scan.

V0.1 uses a different enumeration direction:

**official MOPS daily whole-market material-information index -> par-value revision candidates -> later company-history validation.**

This avoids requiring the symbol to be known before discovery.

## Physical source precheck

Official legacy endpoint:

`https://mopsov.twse.com.tw/mops/web/ajax_t05st02`

A physical single-day request for ROC 114/06/02 returned HTTP-readable TWSE material-information rows.

The same direct request against the newer `mops.twse.com.tw` host returned the official security-block page, so V0.1 uses only the physically readable official MOPSOV host and explicitly detects security-block responses.

## Frozen scope

- market: TWSE only (`TYPEK=sii`);
- target announcement year: 2025;
- query dates: 2025-01-01 through 2026-01-01 inclusive;
- 366 daily endpoint requests;
- the final 2026-01-01 query is included because the daily report states that it can contain prior-day post-17:30 announcements;
- rows are deduplicated by announcement date/time/symbol/subject;
- only announcement rows whose actual reported date is in 2025 are retained.

## Candidate semantics

A par-value subject must mention a direct par-value semantic such as:
- 股票面額;
- 每股面額;
- 面額變更 / 變更面額;
- 無面額.

A revision candidate additionally requires explicit revision semantics such as:
- 更正;
- 修正;
- 補充;
- 撤銷 / 取消;
- 修改 / 更新;
- explicit prior/original-announcement change wording.

Generic `變更` inside the phrase `股票面額變更` is not by itself treated as a revision.

## Acceptance

Transport qualification for the annual index requires all 366 query dates to be readable without a security-block/transport failure.

A positive candidate is discovery only.

Any positive symbol must still pass:
1. company-history original + later correction/cancellation chain validation;
2. same par-value action family;
3. immutable source-reported version identity;
4. exact TWSE operational/effective-event join;
5. source-clock checks.

No positive is also a valid result.

## Authority boundary

Always false in this discovery artifact:
- representativeControlFrozen;
- exchangeOperationalJoinProven;
- authorityRevisionCoverageComplete;
- exact public availability / knownAt;
- revisionCoverageComplete;
- NO_EVENT;
- technical continuity;
- all trading authority.
