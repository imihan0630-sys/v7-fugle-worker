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

## 2026-10-04 physical characterization acceptance

PR #450 physically characterized official MOPSOV company-month responses with frozen empty and positive controls.

- Merge commit: `af1d526cb628ecaba64375a15e99ba0fbaaa6831`.
- Empty Month Characterization Readonly run `37169012904`: PASS.
- System2 Research CI `37169012900`: PASS.
- V8 Regression `37169012896`: PASS.
- controlCount=7: 4 empty controls + 3 positive controls.
- allHttp200=true.
- allHtml=true.
- allEmptyRowsZero=true.
- allPositiveRowsNonZero=true.
- allEmptyPayloadsIdentical=true.
- uniqueEmptyPayloadHashCount=1.
- frozen empty payload SHA-256:
  `9d2e63bf800085e3953d9e675f72cd95131758de64546ad898a5beee56a39e5d`.
- frozen empty payload size: 2540 bytes.
- normalized visible text for all four empty controls:
  `公開資訊觀測站 資料庫中查無需求資料`.
- positive-control hashes did not collide with the empty signature.
- no known error/access-block phrase was observed.
- empty structure: HTML/body/table/MOPS present; no company form and no stock code.
- positive controls had non-zero rows and normal company-specific form/stock-code structure.
- read-only boundary PASS.

Important discovery:
the generic candidate phrase list used before the physical run did not include the exact official text `資料庫中查無需求資料`; the physical run discovered this exact phrase. The next certification must use the physically observed official signature rather than retroactively claiming characterization had already certified it.

This milestone remains characterization only:
- `emptyMonthSemanticsCertified=false`;
- `revisionCoverageComplete=false`;
- `knownAtVersionClockCertified=false`;
- `technicalContinuityCertified=false`;
- `selectionAuthority=false`.

Next: freeze and physically verify an endpoint-specific empty-month certification that requires the exact official no-data signature plus same-endpoint positive controls and fails closed on drift.
