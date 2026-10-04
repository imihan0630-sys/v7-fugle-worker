# System 2 MOPS U04 List Form Contract V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY FORM DISCOVERY
System 1 Formal Core: LOCKED

## Purpose

Continue the last remaining representative-routing investigation:

`TWSE_PAR_VALUE_CHANGE_REFERENCE`.

PR #552 established a physical negative result for direct U04 detail retrieval from GitHub Actions:
- current MOPS direct/session POST returned the official security page;
- MOPSOV direct/session detail POST returned a generic shell without the frozen control;
- the failure is transport/detail-path specific and does not prove the announcement list is unavailable.

The legacy public query page `mopsov.twse.com.tw/mops/web/t146sb10` remains readable.

## This probe

Read the official query-page HTML and freeze:
- form action;
- method;
- form id/name;
- input names/defaults;
- select names;
- option values;
- the exact option whose visible label maps to U04 / 公司法第252及273條及有價證券交付或發放股利前公告;
- visible AJAX/web-route hints.

No query is submitted in V0.1.

## Acceptance

PASS requires the official page itself to expose at least one U04-matching option and a parseable form contract.

PASS does not prove:
- historical list-query execution;
- original/correction enumeration;
- detail retrieval;
- exact public availability;
- representative-control promotion.

## Exact continuation after PASS

1. submit a bounded read-only list query using only the observed official form contract;
2. freeze query parameters and response semantics;
3. search TWSE par-value-related rows without weakening action-family rules;
4. preserve original/correction/cancellation candidates;
5. require exact issuer revision + exact TWSE operational event before any 6/6 promotion.
