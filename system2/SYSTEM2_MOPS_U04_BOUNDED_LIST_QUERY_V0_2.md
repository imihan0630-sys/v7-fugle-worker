# System 2 MOPS U04 Bounded List Query V0.2

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY REFINED QUERY
System 1 Formal Core: LOCKED

## Purpose

Refine the bounded U04 query after V0.1 established:
- custom date mode is `noticeDate=1`;
- date input uses 3-digit ROC year;
- the U04 report surface is reachable;
- `co_id_1` alone is insufficient to return the frozen 4414 control.

PR #568 also froze the official submit-JavaScript evidence.

## Official submit-script guard

Before querying, V0.2 physically reads:
`/mops/web/js/outerScript/t146sb10.js`

The script must still show assignments for:
- `form1.co_id_1`;
- `form1.co_id_2`;
- `form1.date`;
- `form1.noticeKind`;
- `form1.sort`;
- `form1.noticeDate`.

Any drift fails closed.

## Bounded 4414 query matrix

Common frozen fields:
- `scope=1`;
- `co_id_1=4414`;
- `co_id_2=4414`;
- `typek=sii`;
- `selecttype=0`;
- `date=4`;
- `noticeDate=1`;
- `yymmdd1=1140701`;
- `yymmdd2=1140705`;
- `noticeKind=11`;
- `sort=1`.

Exactly four variants are tested:
1. visible-form fields only;
2. plus uppercase `TYPEK=sii`;
3. plus autocomplete mirrors `code1=4414, TYPEK2=sii, checkbtn=1`;
4. same mirrors with empty checkbtn.

## Positive criteria

The official list response must contain 4414/如興, the frozen U04 subject family, and correction semantics, with no security or validation error.

No result does not prove structural absence.

## Boundaries

Even a positive bounded list control does not by itself freeze the final TWSE par-value representative control. Exact exchange operational/effective-event joining remains mandatory.
