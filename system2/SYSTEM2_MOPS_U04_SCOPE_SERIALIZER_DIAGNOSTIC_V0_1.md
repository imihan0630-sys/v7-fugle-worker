# System 2 MOPS U04 Scope / Serializer Diagnostic V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY DIAGNOSTIC
System 1 Formal Core: LOCKED

## Purpose

Resolve the remaining ambiguity after the physically verified V0.2 bounded query:

1. is 4414 present in the bounded U04 market result but lost by company-scope serialization; or
2. is the frozen 4414 U04 control itself not present in the official bounded result?

The probe also inspects official serializer/helper code and the raw 4110-byte response shell.

## Frozen date/category scope

- TWSE/listed;
- U04 `noticeKind=11`;
- custom ROC date range 1140701..1140705;
- sort ascending.

## Three physical queries

1. company scope, 4414 using visible fields;
2. company scope, 4414 plus compatibility/autocomplete mirror fields;
3. listed-market scope with no company filter.

The third query is the counterfactual control.

If 4414 appears in market scope but not company scope, company serialization remains the blocker.

If market scope returns actual data rows but 4414 is absent, the 4414 frozen positive-control assumption must be rejected rather than forcing more field guesses.

If market scope itself returns no interpretable data rows, the result remains inconclusive.

## Serializer evidence

The probe physically reads:
- `t146sb10`;
- `js/outerScript/t146sb10.js`;
- `js/mops2.js`.

It preserves snippets around:
- `ajax1`;
- `autoComplete`;
- `chkKeyDown`;
- `code1`;
- `TYPEK2`;
- `checkbtn`;
- `serialize` / `FormData`;
- `co_id_2`.

It also preserves raw response row counts, sample rows, detail-link hints and explicit no-data/security markers.

## Authority boundary

This diagnostic cannot promote 6/6 representative authority by itself.

Any final TWSE par-value control still requires:
- a true issuer original/correction/cancellation chain;
- exact action-family match;
- exact TWSE operational/effective-event join;
- preserved historical version semantics.

All downstream trading authority remains false.


## 2026-10-04 serializer correction before acceptance

The first diagnostic run must **not** be accepted as evidence that the 4414 control is invalid.

Two probe defects were found before merge:

1. the response classifier treated a report-title row containing the word `公告` as a data row;
2. the curl replay omitted the fixed `encodeURIComponent=1` prefix that the official `mops2.js::ajax1()` serializer always prepends before serializing the form.

The probe is corrected before acceptance:
- an actual data row now requires a company/security-code-like row or official detail-row markers;
- every bounded POST now includes `encodeURIComponent=1`;
- the physical probe asserts that the official `ajax1` source still contains that serializer prefix.

Therefore the earlier `frozenControlLikelyInvalid=true` observation is rejected as a diagnostic false positive and must not enter the canonical evidence chain.
