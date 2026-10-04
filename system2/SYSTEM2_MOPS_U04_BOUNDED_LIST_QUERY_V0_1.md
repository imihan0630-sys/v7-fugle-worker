# System 2 MOPS U04 Bounded List Query V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY BOUNDED QUERY
System 1 Formal Core: LOCKED

## Purpose

Execute the first bounded read-only U04 list query using the official form contract physically verified by PR #561.

Last remaining representative-routing gap:
`TWSE_PAR_VALUE_CHANGE_REFERENCE`.

## Frozen official form contract

- page: `https://mopsov.twse.com.tw/mops/web/t146sb10`
- action: `/mops/web/ajax_t146sb10`
- market: `TYPEK=sii`
- company input: `co_id_1`
- U04 option: `noticeKind=11`
- date fields: `yymmdd1`, `yymmdd2`

## Frozen control

4414 如興 was chosen because the alternate announcement path has a publicly indexed correction-family control around 2025-07-03:
`減資換發股票作業相關事項公告`.

This V0.1 list probe does not assume the UI date-mode encoding.

It tests exactly four bounded combinations:
1. noticeDate=1 + Gregorian 20250701..20250705;
2. noticeDate=2 + Gregorian 20250701..20250705;
3. noticeDate=1 + ROC 1140701..1140705;
4. noticeDate=2 + ROC 1140701..1140705.

Everything else remains identical.

## Positive criteria

A bounded control is positive only when the official list response itself contains:
- 4414 or 如興;
- the frozen U04 subject family;
- correction/revision semantics;
- HTTP 200;
- no MOPS security-block page.

A no-data page is not automatically evidence that no U04 announcement exists.

## Boundaries

PASS on one bounded control still does not prove:
- complete historical U04 coverage;
- detail retrieval;
- exact first-known/public availability;
- the TWSE par-value representative control.

All trading and production authority remains false.
