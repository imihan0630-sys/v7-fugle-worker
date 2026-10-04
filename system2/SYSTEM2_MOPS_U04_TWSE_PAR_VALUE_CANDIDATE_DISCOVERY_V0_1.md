# System 2 MOPS U04 TWSE Par-Value Candidate Discovery V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OFFICIAL-EVENT-DERIVED ISSUER DISCOVERY
System 1 Formal Core: LOCKED

## Purpose

Search alternate official issuer evidence for the only remaining representative-routing gap:

`TWSE_PAR_VALUE_CHANGE_REFERENCE`.

The final-result path is already exhausted for 2010..2026 and must not be repeated blindly.

This discovery starts only from physically observed TWSE par-value-change final-result events.

## Frozen 2025 candidates

From the official final-result lane:

- 4763 — effective 2025-06-30;
- 6919 — effective 2025-07-21;
- 2327 — effective 2025-08-25;
- 8422 — effective 2025-11-17.

No price/performance information is used to choose candidates.

## U04 query semantics

Official endpoint:
`/mops/web/ajax_t146sb10`

Frozen semantics:
- `encodeURIComponent=1` as required by the physical `mops2.js::ajax1()` serializer;
- listed/TWSE market;
- `selecttype=2` (company-law announcements);
- `noticeKind=11` (公司法第252及273條 / 有價證券交付或發放股利前公告);
- explicit ROC dates;
- ascending order.

For each official event:
- query company scope;
- query listed-market scope as a counterfactual;
- search from 75 calendar days before the official effective date through 7 calendar days after.

## Candidate criteria

Issuer evidence requires an actual official company/security row containing the candidate symbol.

A revision par-value candidate requires the same actual row to contain:
- correction/revision/cancellation language; and
- par-value/share-exchange/capital-reduction semantics.

Report titles do not count as data rows.

## Promotion boundary

Discovery is not promotion.

Any positive must still be manually/fail-closed reviewed for:
- original row plus later correction/cancellation row;
- same action family and company event;
- immutable source-reported version identity;
- exact join to the already-known TWSE operational effective date.

If no positive exists, preserve the negative result and widen only through another preregistered official-evidence path. Never weaken the 6/6 criterion merely to fill the matrix.
