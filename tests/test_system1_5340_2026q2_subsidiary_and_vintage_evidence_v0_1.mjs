import assert from "node:assert/strict";
import {EXPECTED} from "../research/system1_5340_2026q2_individual_pdf_eps_review_v0_1.mjs";
import {inspectOriginalSubsidiaryClues as inspect} from "../research/system1_5340_2026q2_subsidiary_and_vintage_evidence_v0_1.mjs";
const receipt={pdfSha256:EXPECTED.originalSha256,pdfBytes:EXPECTED.pdfBytes,
 filename:EXPECTED.twseOriginalFilename,state:"OFFICIAL_ORIGINAL_PDF_DOWNLOADED_SOURCE_ONLY"};
const text=[
 "建 榮 工 業 材 料 股 份 有 限 公 司",
 "民國 115 年及 114 年 4 月 1 日至 6 月 30 日",
 "NITTO BOSEKI 為本公司之母公司",
 "國際財務報導準則第19號「不具公共課責性之子公司：揭露」",
 "公司投資交易與其他權益工具投資",
 "公允價值 及關係企業 公司沿革",
 "額外財務資訊".repeat(3500)
].join("\n");
let count=0;
function t(name,fn){fn();count++;console.log("PASS "+name);}
t("strict official PDF identity",()=>{
 const r=inspect({text,originalReceipt:receipt});
 assert.equal(r.rawOriginalSha256,EXPECTED.originalSha256);
 assert.equal(r.originalFile,EXPECTED.twseOriginalFilename);
 assert.equal(r.symbol,"5340");assert.equal(r.reportQuarter,2);
});
t("parent-of-issuer does not prove issuer owns subsidiaries",()=>{
 const r=inspect({text,originalReceipt:receipt});
 assert.equal(r.termClues.ownershipParent.found,true);
 assert.equal(r.subsidiaryStatus2026Q2Certified,false);
 assert.equal(r.legalIndividualFinancialStatements2026Q2Certified,false);
});
t("IFRS19 textual reference not ownership proof",()=>{
 const r=inspect({text,originalReceipt:receipt});
 assert.equal(r.observedIFRS19Title,true);
 assert.equal(r.termClues.subsidiary.found,true);
 assert.equal(r.canAdmitSystem1,false);
 assert.equal(r.canAdmitSystem2PIT,false);
});
t("2026Q2 native investment disclosures negative but no legal promotion",()=>{
 const native=text+[
 "十二、附註揭露事項",
 "母子公司間業務關係及重大交易往來情形：無。",
 "(二)轉投資事業相關資訊 無。",
 "(三)大陸投資資訊 無。"
 ].join("\n");
 const r=inspect({text:native,originalReceipt:receipt});
 assert.equal(r.periodSpecificDisclosureEvidenceObserved,true);
 assert.equal(r.periodSpecificNegativeDisclosureFlags.noInvestmentBusinessInfo,true);
 assert.equal(r.periodSpecificNegativeDisclosureFlags.noParentSubsidiaryTransactions,true);
 assert.equal(r.periodSpecificNegativeDisclosureFlags.noMainlandInvestmentInfo,true);
 assert.equal(r.subsidiaryStatus2026Q2Certified,false);
 assert.equal(r.legalIndividualFinancialStatements2026Q2Certified,false);
 assert.equal(r.originalPITVintageCertified,false);
 assert.equal(r.canAdmitSystem1,false);
 assert.equal(r.canAdmitSystem2PIT,false);
});
t("missing note-12 source is not negative disclosure proof",()=>{
 const r=inspect({text:text+"母子公司間業務關係及重大交易往來情形：無",originalReceipt:receipt});
 assert.equal(r.periodSpecificDisclosureEvidenceObserved,false);
});
t("explicit no-sub string still requires independent validation",()=>{
 const r=inspect({text:text+"\n本公司無子公司",originalReceipt:receipt});
 assert.equal(r.explicitNoSubsidiaryPhrases.includes("本公司無子公司"),true);
 assert.equal(r.subsidiaryStatus2026Q2Certified,false);
});
t("no original source fingerprint must reject",()=>{
 assert.throws(()=>inspect({text,originalReceipt:{...receipt,pdfSha256:"a".repeat(64)}}),/UNTRUSTED/);
});
t("not same official PDF identity must reject",()=>{
 assert.throws(()=>inspect({text,originalReceipt:{...receipt,filename:"other.pdf"}}),/UNTRUSTED/);
});
t("not enough content must reject",()=>{
 assert.throws(()=>inspect({text:"EPS 0.54",originalReceipt:receipt}),/INVALID_ORIGINAL/);
});
t("issuer or quarter swapped must reject",()=>{
 assert.throws(()=>inspect({text:text.replace("建 榮 工 業 材 料 股 份 有 限 公 司","其他公司"),originalReceipt:receipt}),/IDENTITY/);
 assert.throws(()=>inspect({text:text.replace("115 年及 114 年 4 月 1 日","115 年及 114 年 7 月 1 日"),originalReceipt:receipt}),/IDENTITY/);
});
t("original source time, legal basis and trading remain blocked",()=>{
 const r=inspect({text,originalReceipt:receipt});
 assert.equal(r.firstKnownAt,null);assert.equal(r.availableAt,null);
 assert.equal(r.originalPITVintageCertified,false);
 assert.equal(r.canCreateFrozen,false);assert.equal(r.canTrade,false);
});
console.log(JSON.stringify({suite:"5340 exact original PDF subsidiary clue vs issuer-legal/PIT review",tests:count,
 passed:true,legalStatusAdmitted:false,pointInTimeAdmitted:false,noFormalWrites:true}));
