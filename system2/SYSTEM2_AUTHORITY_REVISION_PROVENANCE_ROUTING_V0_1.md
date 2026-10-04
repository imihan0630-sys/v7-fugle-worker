# System 2 — Authority-Side Revision Provenance Routing V0.1

Updated: 2026-10-04 Asia/Taipei  
Status: RESEARCH_ONLY / SOURCE_OWNERSHIP_CONTRACT  
System 1 Formal Core: LOCKED

## Purpose

A corporate-action revision chain must not assume that one website owns every stage of the event.

System 2 separates **issuer disclosure**, **regulator case status**, and **exchange operational/effective action** so corrections, withdrawals, revocations, effective dates and resumptions preserve the authority that actually owns the fact.

## Source ownership

### Issuer / company disclosure — MOPS

Use MOPS / MOPSOV for:
- original issuer announcement;
- issuer correction;
- issuer decision to apply for withdrawal/cancellation;
- issuer announcement that a regulator/exchange approval was received;
- company-reported source clock (`sourceReportedAt`).

MOPS historical source-reported clock semantics are independently versioned. A MOPS display time is not automatically exact public `availableAt`.

### Regulator / securities issuance case — FSC / SFB

Use FSC/SFB official sources for regulator-owned facts where applicable:
- issuance application processing status;
- effective / suspended / resumed filing status;
- approved withdrawal / revocation / rescission / cancellation;
- regulator document number and regulator decision date;
- annual official application-case datasets and daily official news.

The official SFB “受理申報(請)案件情形查詢” page is a canonical regulator discovery surface:
`https://www.sfb.gov.tw/ch/home.jsp?id=1016&parentpath=0,6,52`

For the current 115-year case snapshot, the page exposes an official Excel/ODS dataset updated by SFB/FSC. The dated file itself is evidence; a newer file must not silently rewrite an older archived snapshot.

### Exchange operational/effective plan — TWSE / TPEx

Use exchange-owned official sources for:
- listing / new-share listing or resumption date;
- suspension / resumption of trading;
- exchange effective plan or exchange-owned operational schedule;
- exchange official-document announcements where applicable.

Do not force regulator-owned capital-raising withdrawal into the TWSE lane merely because the company is listed.

## Example: 1342 八貫 2026 cash-capital-increase withdrawal

The issuer-side MOPS chain already shows:
1. original cash-capital-increase plan;
2. correction;
3. issuer decision to apply for withdrawal;
4. issuer announcement that FSC approved the withdrawal and a regulator document number was received.

The regulator-side question is separate:
- can the FSC/SFB official case dataset or official daily publication independently establish the withdrawal/revocation status and/or document number?

Until physically verified, regulator-side direct evidence remains `UNKNOWN/PARTIAL`; MOPS must not be relabeled as FSC-origin evidence.

## Provenance fields

Every revision node should be able to preserve:
- `authorityRole`: ISSUER / REGULATOR / EXCHANGE;
- `authorityName`;
- `sourceUrl`;
- `sourceDocumentId`;
- `sourceReportedAt`;
- `observedAt`;
- `availableAtPolicy`;
- `eventAction`: ORIGINAL / CORRECTION / WITHDRAWAL_REQUEST / WITHDRAWAL_APPROVED / REVOCATION / CANCELLATION / EFFECTIVE_PLAN / SUSPEND / RESUME;
- `supersedesVersionId`;
- `evidenceHash`;
- `pitEligibility`;
- `unknownReason`.

## Integrity rules

- Do not collapse issuer-reported receipt of approval into direct regulator evidence.
- Do not infer exact public availability from document date alone.
- Do not infer “no regulator action” from absence in a single dataset until that dataset's coverage semantics are certified.
- A later official annual spreadsheet may change; archive dated bytes/hash before using it for historical reconstruction.
- Cross-source disagreement is preserved and escalated, not silently reconciled in favor of the later record.

## Current authority

This routing contract is Class A research/source infrastructure only.

It does not set:
- `authorityRevisionCoverageComplete=true`;
- `revisionCoverageComplete=true`;
- `knownAtVersionClockCertified=true`;
- `noEventMayBeClaimed=true`;
- `technicalContinuityCertified=true`;
- any selection / push / capital / order authority.

## Physical probe

`system2/scripts/probe_sfb_authority_revision_provenance_readonly_v0_1.py`

The probe:
1. verifies the official SFB case-status index is readable;
2. verifies the frozen 115-year official XLSX is linked by the official page;
3. downloads the XLSX read-only;
4. parses the OpenXML workbook using Python standard library only;
5. searches the official rows for 1342 / 八貫 / regulator document number / 撤銷;
6. reports direct regulator-side evidence if present, otherwise retains a valid negative/partial result.

No D1/R2 mutation or trading authority is involved.

## 2026-10-04 physical regulator-side provenance acceptance

PR #475 merged as `a9dc408e1303f0470359f77dff6f833379862355`.

Physical checks:
- SFB Authority Revision Provenance Readonly `37175107437`: PASS.
- System2 Research CI `37175107386`: PASS.
- V8 Regression `37175107447`: PASS.
- official SFB/FSC 115-year case workbook was directly read and parsed;
- 1342 八貫現金增資 had a direct regulator-side row with status `廢止/撤銷`;
- `targetAuthorityEvidenceDirectlyObserved=true`.

This proves representative regulator provenance for the frozen 1342 control. It does not establish bounded-market regulator revision completeness.

Still false:
- `authorityRevisionCoverageComplete=false`;
- `revisionCoverageComplete=false`;
- `knownAtVersionClockCertified=false`.
