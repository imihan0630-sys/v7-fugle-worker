# System 2 MOPS U04 Announcement Detail Capability V0.1

Updated: 2026-10-04 Asia/Taipei  
Status: RESEARCH_ONLY / READ_ONLY CAPABILITY PROBE  
System 1 Formal Core: LOCKED

## Purpose

Investigate an official MOPS announcement surface that is independent from the already exhausted historical material-information path used for the last remaining representative lane:

`TWSE_PAR_VALUE_CHANGE_REFERENCE`.

TWSE's public MOPS navigation exposes the announcement family commonly labeled:

`依公司法第252條及273條及有價證券交付前辦理之公告`

TWSE's data-service catalog labels that family U04.

Public technical indexing also indicates that the MOPS announcement-detail renderer uses:

`/mops/web/ajax_t67sb02`

with detail keys including:
- company code;
- announcement date;
- announcement sequence;
- market TYPEK.

This third-party route clue is not accepted as source authority by itself.

## Frozen positive control

The first physical probe uses a publicly indexed announcement that is expected to exist in the official MOPS announcement system:

- company: 4414 如興;
- date: 2025-07-03;
- sequence: 1;
- TYPEK: sii;
- expected subject family: `減資換發股票作業相關事項公告`;
- expected revision semantic: 更正/修正.

The probe POSTs directly to the official MOPS host and passes only if the official response itself contains the expected company/symbol/subject/revision semantics and is not the MOPS security-error page.

## What a PASS would prove

A PASS proves only that:
- the official detail endpoint is physically reachable from GitHub Actions;
- the key tuple can retrieve a specific announcement;
- announcement text can preserve a correction semantic.

It does not yet prove:
- how to enumerate historical U04 announcements;
- list-query parameters;
- complete revision chains;
- immutable first-known history;
- exact public availability;
- the final TWSE par-value representative control.

## Exact next after PASS

1. identify the official U04/list-query action behind `t146sb10`;
2. freeze bounded historical query parameters;
3. enumerate TWSE par-value-relevant U04 rows;
4. preserve original/correction/cancellation announcement versions;
5. require an exact TWSE operational/effective-event join before any 6/6 promotion.

## Fail-closed boundary

All downstream readiness flags remain false. No selection, notification, capital, order, or System1 runtime authority is changed.
