import assert from "node:assert/strict";
import {EXPECTED} from "../research/system1_5340_2026q2_individual_pdf_eps_review_v0_1.mjs";
import {reviewBasisAndPit} from "../research/system1_5340_2026q2_official_pdf_basis_pit_audit_v0_1.mjs";
const receipt={
 pdfSha256:EXPECTED.originalSha256,pdfBytes:EXPECTED.pdfBytes,
 filename:EXPECTED.twseOriginalFilename,
 expectedUploadTaipei:EXPECTED.twseUploadDateTaipei,
 state:"OFFICIAL_ORIGINAL_PDF_DOWNLOADED_SOURCE_ONLY"
};
const source=[
 "建 榮 工 業 材 料 股 份 有 限 公 司",
 "民國115年及114年4月1日至6月30日",
 "民國115年及114年1月1日至6月30日",
 "會計師核閱報告",
 "依證券發行人財務報告編製準則及國際會計準則第34號期中財務報導",
 "公司沿革","通過財務報告之日期及程序",
 "國際財務報導準則第19號「不具公共課責性之子公司：揭露」",
 "測試附註資料".repeat(2000),
 "通過財務報告之日期及程序 本財務報表於民國115年8月6日經董事會通過發布",
].join("\n");
let total=0;
const check=(label,fn)=>{fn();total++;console.log("PASS "+label)};
check("native document auditor IAS34 and issuer regulation",()=>{
 const x=reviewBasisAndPit({text:source,sourceReceipt:receipt});
 assert.equal(x.auditorAndAccountingBasisObserved,true);
 assert.equal(x.headings.companyHistory,true);
 assert.equal(x.headings.reportingApprovalSection,true);
 assert.equal(x.explicitNoSubsidiariesStatementObserved,false);
 assert.equal(x.legalIndividualStatementEligibility2026Q2Certified,false);
 assert.equal(x.firstKnownAt,null);assert.equal(x.availableAt,null);
 assert.equal(x.firstKnownAtProven,false);
 assert.equal(x.sourceVersionAsOf20261016Certified,false);
 assert.equal(x.formalEligible,false);assert.equal(x.system2PitAEligible,false);
 assert.equal(x.system2PitBEligible,false);assert.equal(x.tradingDecisionEligible,false);
 assert(x.observedEvidenceHints.noteApproval.includes("董事會通過"));
});
check("IFRS19 future standard cannot imply issuer has a subsidiary",()=>{
 const x=reviewBasisAndPit({text:source,sourceReceipt:receipt});
 assert.equal(x.explicitNoSubsidiariesStatementObserved,false);
});
check("even explicit no subsidiaries is research signal not legal authorization",()=>{
 const x=reviewBasisAndPit({text:source+"\n本公司無子公司",sourceReceipt:receipt});
 assert.equal(x.explicitNoSubsidiariesStatementObserved,true);
 assert.equal(x.legalIndividualStatementEligibility2026Q2Certified,false);
 assert.equal(x.system2PitBEligible,false);
});
check("source SHA substitution rejected",()=>{
 assert.throws(()=>reviewBasisAndPit({text:source,sourceReceipt:{...receipt,pdfSha256:"0".repeat(64)}}),/ORIGINAL_RECEIPT_UNTRUSTED/);
});
check("source upload change rejected",()=>{
 assert.throws(()=>reviewBasisAndPit({text:source,sourceReceipt:{...receipt,expectedUploadTaipei:"115/08/07 16:36:32"}}),/ORIGINAL_RECEIPT_UNTRUSTED/);
});
check("source PDF non-original state rejected",()=>{
 assert.throws(()=>reviewBasisAndPit({text:source,sourceReceipt:{...receipt,state:"INIT"}}),/ORIGINAL_RECEIPT_UNTRUSTED/);
});
check("stale wrong year fiscal period rejected",()=>{
 assert.throws(()=>reviewBasisAndPit({text:source.replace("115年及114年4月1日","114年及113年4月1日"),sourceReceipt:receipt}),/ISSUER_AND_PERIOD_NOT_PROVEN/);
});
check("news excerpt too short rejected",()=>{
 assert.throws(()=>reviewBasisAndPit({text:"news reports 5340 EPS=0.54",sourceReceipt:receipt}),/ORIGINAL_TEXT_INVALID/);
});
check("issuer mismatch rejected",()=>{
 assert.throws(()=>reviewBasisAndPit({text:source.replace("建 榮 工 業 材 料 股 份 有 限 公 司","別家公司"),sourceReceipt:receipt}),/ISSUER_AND_PERIOD_NOT_PROVEN/);
});
console.log(JSON.stringify({suite:"5340 official 2026Q2 accountant note & PIT provenance research",tests:total,passed:true,
 legalBasisCertified:false,historicalPITCertified:false,noFormalChanges:true}));
