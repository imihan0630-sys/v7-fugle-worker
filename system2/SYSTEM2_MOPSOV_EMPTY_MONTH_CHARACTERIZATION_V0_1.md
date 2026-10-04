# System 2 MOPSOV Empty Company-Month Characterization V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY_CHARACTERIZATION
System 1 Formal Core: LOCKED

## Purpose

Characterize how the official MOPSOV historical material-information endpoint behaves for a company-month with zero parsed rows.

A zero-row parser result must not automatically become "no event". Before any empty-month certification, System 2 must distinguish a genuine empty official response from transport failure, error page, access block, parser failure or an incomplete query.

## Frozen controls

Expected empty controls:
- 1459 / ROC 115 / month 1;
- 1342 / ROC 115 / month 3;
- 1342 / ROC 115 / month 8;
- 1342 / ROC 115 / month 9.

Positive controls:
- 2467 / ROC 115 / month 5;
- 1459 / ROC 115 / month 6;
- 1342 / ROC 115 / month 7.

These controls come from the physically reconciled MOPSOV multi-control sample and are frozen before this characterization run.

## Characterization fields

For each response preserve:
- HTTP status;
- content type;
- payload bytes;
- SHA-256;
- parsed row count;
- candidate official no-data phrases;
- candidate error/access-block phrases;
- basic HTML/form/table structure flags;
- short normalized visible-text sample.

## Acceptance for characterization

The run may PASS only if:
- all responses return HTTP 200;
- all responses are HTML;
- all frozen empty controls parse to zero rows;
- all positive controls parse to non-zero rows;
- empty payload hashes do not collide with positive payload hashes;
- no known error/access-block phrase is present.

A PASS is only a characterization milestone.

It does **not** set `emptyMonthSemanticsCertified=true`.

## Next gate

Use the physical characterization to freeze an endpoint-specific empty-month signature. The subsequent certification must fail closed on signature drift and must retain positive controls.

Only after that may a bounded MOPS supplemental revision source distinguish "confirmed empty month" from missing/unusable source evidence.

## Authority firewall

No D1/R2 mutation, no strategy evaluation, no capacity, no selection, no push, no capital, no orders, no System 1 runtime.
