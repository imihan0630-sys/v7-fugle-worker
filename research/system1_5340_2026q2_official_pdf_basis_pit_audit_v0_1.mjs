// Read-only research on an exact, already checked 5340 TWSE 2026Q2 PDF text.
// Determine which legal accounting and timestamp claims are supported by the
// native document vs remaining UNKNOWN. No official gate or trading influence.
import {EXPECTED} from "./system1_5340_2026q2_individual_pdf_eps_review_v0_1.mjs";
const MAX=220000;
export const BASIS_AUDIT_VERSION="S1_5340_Q2_ORIGINAL_PDF_BASIS_PIT_V0_1";
function no(code){throw Error("5340_BASIS_PIT_"+code);}
function compact(t){return t.replace(/[\s\u00a0\u3000]+/g,"");}
function excerpt(src,needle,before=70,after=160){
 const at=src.lastIndexOf(needle);
 return at<0?null:src.slice(Math.max(0,at-before),at+needle.length+after)
  .replace(/\s+/g," ").trim().slice(0,240);
}
export function reviewBasisAndPit({text,sourceReceipt}={}){
 if(!sourceReceipt||sourceReceipt.pdfSha256!==EXPECTED.originalSha256||
    sourceReceipt.pdfBytes!==EXPECTED.pdfBytes||
    sourceReceipt.filename!==EXPECTED.twseOriginalFilename||
    sourceReceipt.expectedUploadTaipei!==EXPECTED.twseUploadDateTaipei||
    sourceReceipt.state!=="OFFICIAL_ORIGINAL_PDF_DOWNLOADED_SOURCE_ONLY")
  no("ORIGINAL_RECEIPT_UNTRUSTED");
 if(typeof text!=="string"||text.length<20000||text.length>MAX)
  no("ORIGINAL_TEXT_INVALID");
 const c=compact(text);
 if(!c.includes(compact(EXPECTED.issuer))||
    !c.includes("民國115年及114年4月1日至6月30日")||
    !c.includes("民國115年及114年1月1日至6月30日"))
  no("ISSUER_AND_PERIOD_NOT_PROVEN");
 const headings={
  auditorReview:c.includes("會計師核閱報告"),
  securitiesIssuerStatements:c.includes("證券發行人財務報告編製準則"),
  ias34:c.includes("國際會計準則第34號")||c.includes("國際會計準則第34"),
  companyHistory:c.includes("公司沿革"),
  reportingApprovalSection:c.includes("通過財務報告之日期及程序"),
  separateStatementsLabel:c.includes("個別財務報告")||c.includes("個體財務報告"),
  consolidatedStatementsLabel:c.includes("合併財務報告")
 };
 // An IFRS 19 standard entitled "Subsidiaries without Public Accountability"
 // is NOT evidence the issuer itself owns a subsidiary.
 const subsidiaryNegations=["本公司無子公司","本公司並無子公司","本公司未有子公司",
  "本公司無投資子公司","本公司未設有子公司"];
 const explicitNoSubsidiaries=subsidiaryNegations.find(x=>c.includes(x))||null;
 const approvalMatches=[...c.matchAll(/本財務報告已於民國(\d{3})年(\d{1,2})月(\d{1,2})日經董事會通過發布/g)];
 const approvedDates=[...new Set(approvalMatches.map(m=>{
  const y=Number(m[1])+1911,mm=Number(m[2]),dd=Number(m[3]);
  const iso=y+"-"+String(mm).padStart(2,"0")+"-"+String(dd).padStart(2,"0");
  return new Date(iso+"T00:00:00Z").toISOString().slice(0,10)===iso?iso:null;
 }).filter(Boolean))];
 const issuerBoardApprovedOn=approvedDates.length===1?approvedDates[0]:null;
 const noteApproval=excerpt(c,"通過財務報告之日期及程序",20,380);
 const companyHistory=excerpt(c,"公司沿革",20,440);
 const legalPolicy=excerpt(c,"證券發行人財務報告編製準則",45,155);
 // Do not treat the date of board approval or the PDF's CreationDate as
 // first external/public availability (nor infer same-day PIT from upload).
 const verdict={
  schema:BASIS_AUDIT_VERSION,issuer:"5340",reportPeriod:"2026Q2",
  originalPdfSha256:EXPECTED.originalSha256,
  originalFilename:EXPECTED.twseOriginalFilename,
  eBookIndexUploadRocTaipei:EXPECTED.twseUploadDateTaipei,
  eBookIndexReportedUploadTaipeiISO:"2026-08-06T16:36:32+08:00",
  issuerBoardApprovedOn,boardApprovalIsNotPublicationProof:true,
  sourceHtmlBasis:"RAW_HTML_BASIS_UNVERIFIED",
  // E-book listing's statement-type tag and original PDF contents separately.
  eBookListedStatementBasis:sourceReceipt.index?.indexBasisTextVerified===true&&
   sourceReceipt.index?.basis==="INDIVIDUAL"?"IFRSs個別財報":null,
  rawIndexBasisCertified:sourceReceipt.index?.indexBasisTextVerified===true&&
   sourceReceipt.index?.basis==="INDIVIDUAL",
  auditorAndAccountingBasisObserved:headings.auditorReview&&
   headings.securitiesIssuerStatements&&headings.ias34,
  headings,explicitNoSubsidiariesStatementObserved:Boolean(explicitNoSubsidiaries),
  explicitNoSubsidiariesTerm:explicitNoSubsidiaries,
  legalIndividualStatementEligibility2026Q2Certified:false,
  firstKnownAt:null,availableAt:null,issuerFirstPublicationTimestamp:null,
  firstKnownAtProven:false,sourceVersionAsOf20261016Certified:false,
  uploadTimeIsNotPublicationProof:true,
  observedEvidenceHints:{
   noteApproval,companyHistory,legalPolicy
  },
  status:"OFFICIAL_REPORT_ACCOUNTING_EVIDENCE_OBSERVED_LEGAL_AND_PIT_INDEPENDENT_AUDIT_PENDING",
  formalEligible:false,system2PitAEligible:false,system2PitBEligible:false,
  frozenEligible:false,tradingDecisionEligible:false
 };
 // Caller cannot promote merely by providing a synthetic no-subsidiary phrase.
 return Object.freeze(verdict);
}
