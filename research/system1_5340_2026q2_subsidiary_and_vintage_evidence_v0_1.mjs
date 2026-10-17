// 5340 official 2026Q2 PDF investment / subsidiary evidence survey V0.1.
// Evidence collection is deliberately NOT a legal, PIT or strategy approval.
import {EXPECTED} from "./system1_5340_2026q2_individual_pdf_eps_review_v0_1.mjs";
export const CONTRACT="S1_S2_5340_SUBSIDIARY_AND_VINTAGE_SOURCE_SURVEY_V0_1";
const SECTIONS=[
 ["ownershipParent","NITTO BOSEKI"],
 ["equityMethodInvestment","採用權益法之投資"],
 ["equityMethodInvestments","採權益法之投資"],
 ["subsidiary","子公司"],
 ["noSubsidiary","無子公司"],
 ["subsidiaryCompany","被投資公司"],
 ["affiliates","關係企業"],
 ["financialInvestment","轉投資"],
 ["basisIndividual","個別財務報告"],
 ["basisConsolidated","合併財務報告"],
 ["investmentHoldings","持有被投資公司"],
 ["subsidiaryControl","控制"]
];
function normalized(text){return String(text||"").replace(/\s+/g,"");}
function occurrences(t,needle,cap=4){let at=-1,locations=[];
 while((at=t.indexOf(needle,at+1))>=0){
  locations.push(at);if(locations.length>=cap)break;
 }
 return locations;
}
export function inspectOriginalSubsidiaryClues({text,originalReceipt}={}){
 if(!originalReceipt||originalReceipt.pdfSha256!==EXPECTED.originalSha256||
 originalReceipt.pdfBytes!==EXPECTED.pdfBytes||originalReceipt.filename!==EXPECTED.twseOriginalFilename||
 originalReceipt.state!=="OFFICIAL_ORIGINAL_PDF_DOWNLOADED_SOURCE_ONLY")
  throw Error("UNTRUSTED_ORIGINAL_REPORT_RECEIPT");
 if(typeof text!=="string"||text.length<20000||text.length>250000)
  throw Error("INVALID_ORIGINAL_DOCUMENT_TEXT");
 const t=normalized(text),map={};
 if(!t.includes(normalized(EXPECTED.issuer))||!t.includes("民國115年及114年4月1日至6月30日"))
  throw Error("ORIGINAL_DOCUMENT_IDENTITY_MISMATCH");
 for(const [key,needle] of SECTIONS){
  const match=normalized(needle);
  let list=occurrences(t,match);
  map[key]={term:needle,found:list.length>0,
   // These clips are hints to independent reviewer, never documentary proof
   // of subsidiaries/no-subsidiaries by themselves.
   hints:list.map(at=>t.slice(Math.max(0,at-85),at+match.length+145).slice(0,280))};
 }
 // IFRS 19's *title* contains 子公司 but describes a future standard;
 // it MUST NOT be treated as issuer ownership evidence.
 const ifrs19=t.includes("不具公共課責性之子公司");
 const candidateNoSubsidiaryAssertions=[
  "本公司無子公司","本公司並無子公司","本公司未持有子公司",
  "本公司無控制之子公司","本公司未設有子公司"
 ];
 const explicitNoSub=candidateNoSubsidiaryAssertions.filter(q=>t.includes(q));
 const requiresIndependentPeriodSpecificProof=true;
 return Object.freeze({schema:CONTRACT,symbol:"5340",reportYear:2026,reportQuarter:2,
  rawOriginalSha256:originalReceipt.pdfSha256,
  originalPdfBytes:originalReceipt.pdfBytes,
  originalFile:originalReceipt.filename,
  sampleOnly:false,sourceClass:"OFFICIAL_TWSE_EBOOK_PDF",searchUsed:false,
  observedIFRS19Title:ifrs19,termClues:map,
  explicitNoSubsidiaryPhrases:explicitNoSub,
  // Even an explicit phrase without original legal scope/issuer context is
  // insufficient to claim an audited company-level legal conclusion.
  subsidiaryStatus2026Q2Certified:false,
  legalIndividualFinancialStatements2026Q2Certified:false,
  firstKnownAt:null,availableAt:null,originalPITVintageCertified:false,
  requiresIndependentPeriodSpecificProof,
  canAdmitSystem1:false,canAdmitSystem2PIT:false,canCreateFrozen:false,canTrade:false,
  status:"ORIGINAL_PDF_SUBSIDIARY_CLUES_OBSERVED_REQUIRES_INDEPENDENT_AUDIT"});
}
