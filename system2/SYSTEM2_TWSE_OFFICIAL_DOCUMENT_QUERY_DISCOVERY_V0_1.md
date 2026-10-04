# System 2 TWSE Official-Document Query Discovery V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY SOURCE DISCOVERY
System 1 Formal Core: LOCKED

## Purpose

Discover the actual machine query contract behind the official TWSE 公文公告 historical search page before issuing a bounded search for the final representative-routing gap:

`TWSE_PAR_VALUE_CHANGE_REFERENCE`.

The official document archive is materially distinct from:
- TWTB8U final-result history;
- historical MOPS t05st01;
- MOPS U04 company-law announcement search;
- TWTB7U current/forecast list.

## Why discovery comes first

Search-engine indexing already shows historical 2025 par-value operational documents for the frozen candidates, but search-engine absence cannot prove no correction exists.

The system must identify the official page's own stable query endpoint and parameters instead of inventing an API.

## Discovery method

Read-only:
1. fetch the official TWSE 公文公告 list page;
2. enumerate same-host script assets;
3. scan page/scripts for announcement/query/date/keyword route hints;
4. extract same-host URL candidates;
5. read the page's `data-api` and the official runtime `cfg.apiHost.rwd` value rather than hard-coding an assumed host/path;
6. mechanically derive the candidate RWD endpoint;
7. validate it against known official document `1140010257` for symbol 4763 on 2025-06-06;
8. do not perform the final four-company bounded correction search unless this positive control physically passes.

## Frozen downstream candidates

Once the query contract is established, the next bounded query will target 2025 only and preserve these frozen par-value events:
- 4763 / effective 2025-06-30;
- 6919 / effective 2025-07-21;
- 2327 / effective 2025-08-25;
- 8422 / effective 2025-11-17.

Search terms will include company code/name plus correction semantics such as:
`更正 / 修正 / 撤銷 / 取消 / 改期`.

## Authority boundary

This artifact does not establish:
- a correction chain;
- a representative control;
- 6/6 representative authority;
- revision completeness;
- exact knownAt;
- any selection/push/capital/order authority.


## Positive-control acceptance

A stable query endpoint is established only if the endpoint is mechanically derived from official page/runtime configuration and a 2025-06-06 bounded query returns both known TWSE document number `1140010257` and symbol `4763`.

HTTP 200 alone is insufficient.
