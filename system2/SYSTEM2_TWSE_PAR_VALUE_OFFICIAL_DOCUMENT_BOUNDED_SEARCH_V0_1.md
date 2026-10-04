# System 2 TWSE Par-Value Official-Document Bounded Search V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY BOUNDED HISTORICAL SEARCH
System 1 Formal Core: LOCKED

## Purpose

Use the physically established TWSE official-document historical query contract from PR #596 to search for a genuine exchange-owned correction/revision/cancellation chain for the only remaining representative-routing gap:

`TWSE_PAR_VALUE_CHANGE_REFERENCE`.

## Source contract

Official TWSE endpoint:
`/rwd/zh/announcement/announcement`

PR #596 physically established the endpoint by:
- deriving it from official page `data-api` + `cfg.apiHost.rwd`;
- reproducing same-origin AJAX request semantics;
- recovering known document `1140010257` for symbol 4763 on 2025-06-06.

## Frozen bounded interval

2025-01-01 through 2025-12-31 only.

Frozen candidates:
- 4763 / effective 2025-06-30;
- 6919 / effective 2025-07-21;
- 2327 / effective 2025-08-25;
- 8422 / effective 2025-11-17.

Expected operational positive-control references:
- 4763: 1140010257 and 1140011819;
- 6919: 1140012018;
- 2327: 1140014444;
- 8422: 1140020022.

All expected references must be recovered before a negative revision result is accepted.

## Query completeness

For each candidate:
- query the full 2025 interval by stock code;
- require returned `data.length == total`.

Also query the same full-year interval for:
- 股票面額;
- 換發新股;
- 更正;
- 修正;
- 撤銷;
- 取消;
- 改期;
- 調整.

Global rows are joined back to candidates by stock code or company name derived from official baseline documents.

## Revision semantics

Par-value context:
`股票面額 / 面額變更 / 變更股票面額 / 換發新股 / 換發股票 / 換發新股票`.

Revision hints:
`更正 / 修正 / 撤銷 / 取消 / 作廢 / 改期 / 延後 / 提前 / 展延 / 調整`.

A positive row is still only a candidate. Promotion requires a coherent original -> later correction/cancellation chain for the same company/action and an exact join to the known operational effective event.

## Negative-result semantics

`OFFICIAL_DOCUMENT_BOUNDED_NEGATIVE` is accepted only when:
- all frozen operational references are recovered;
- every query is complete by `data.length == total`;
- no candidate has a par-value row carrying revision semantics.

This is bounded evidence, not proof that no such historical event ever existed.

## Authority boundary

This search never by itself sets:
- representativeAuthorityReadyCount=6;
- revisionCoverageComplete=true;
- noEventMayBeClaimed=true;
- exact knownAt;
- technical continuity;
- any trading authority.
