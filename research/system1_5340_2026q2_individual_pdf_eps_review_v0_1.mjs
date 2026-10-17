// Strict pure review of original 5340 2026Q2 TWSE PDF quarterly EPS.
// No network, production activity, PIT certification, or selection impact.
export const EXPECTED={
 issuer:"建榮工業材料股份有限公司",symbol:"5340",year:2026,quarter:2,
 twseOriginalFilename:"202602_5340_AI2.pdf",
 twseSource:"https://doc.twse.com.tw",
 twseUploadDateTaipei:"115/08/06 16:36:32",
 pdfBytes:700181,
 originalSha256:"9728d6ad33ba7c066e88378cb724a17f772797a65d445588fec35249414fcef2"
};
function fail(code){throw Error("S1_5340_Q2_INDIVIDUAL_PDF_"+code);}
function numberToken(t){
 const x=String(t).trim().replaceAll(",",""),n=Number(x);
 if(!/^-?\d+(?:\.\d{1,4})?$/.test(x)||!Number.isFinite(n)||Math.abs(n)>1000)fail("EPS_AMOUNT_INVALID");
 return n;
}
export function parseOriginal2026Q2IndividualEps({text,sha256,byteLength,originalFilename,sourceHost,twseUploadDateTaipei}={}){
 if(originalFilename!==EXPECTED.twseOriginalFilename||sourceHost!==EXPECTED.twseSource||
    twseUploadDateTaipei!==EXPECTED.twseUploadDateTaipei||sha256!==EXPECTED.originalSha256||
    byteLength!==EXPECTED.pdfBytes)fail("SOURCE_RECEIPT_IDENTITY_OR_SHA_MISMATCH");
 if(typeof text!=="string"||text.length<20000)fail("DOCUMENT_TEXT_NOT_AVAILABLE");
 const normalized=text.replace(/\s+/g,"");
 if(!normalized.includes(EXPECTED.issuer))fail("ISSUER_ORIGINAL_MISMATCH");
 if(!normalized.includes("民國115年及114年4月1日至6月30日")||
    !normalized.includes("民國115年及114年1月1日至6月30日"))
  fail("QUARTER_OR_YTD_OFFICIAL_PERIOD_MISMATCH");
 if(!normalized.includes("會計師核閱報告"))fail("AUDITOR_REVIEW_NOT_PRESENT");
 const lines=text.split(/\r?\n/);
 function row(code,name){
  const candidates=lines.map(x=>x.replace(/\s+/g," ").trim())
    .filter(x=>new RegExp("^"+code+"\\s+"+name+"\\s+").test(x));
  if(candidates.length!==1)fail("EPS_ROW_NOT_UNIQUE_"+code);
  const raw=candidates[0].slice(candidates[0].indexOf(name)+name.length);
  const matches=[...raw.matchAll(/\$\s*(-?\d+(?:,\d{3})*(?:\.\d{1,4})?)/g)]
    .map(m=>numberToken(m[1]));
  if(matches.length!==4)fail("EPS_FOUR_PERIOD_COLUMNS_UNVERIFIED_"+code);
  return matches;
 }
 const [q2,priorQ2,ytdEps,priorYtdEps]=row("9750","基本每股盈餘");
 const diluted=row("9850","稀釋每股盈餘");
 if([q2,priorQ2,ytdEps,priorYtdEps,...diluted].some(x=>Math.abs(x)>100))
  fail("EPS_ABNORMAL_MAGNITUDE");
 return Object.freeze({schema:"S1_5340_2026Q2_OFFICIAL_INDIVIDUAL_EPS_PDF_REVIEW_V0_1",
  sourceType:"TWSE_OFFICIAL_EBOOK_ORIGINAL",sourceHost,originalFilename,
  stock:"5340",reportYear:2026,reportQuarter:2,
  originalDocumentSha256:sha256,originalPdfBytes:byteLength,
  originalUploadTaipei:twseUploadDateTaipei,statementBasis:"INDIVIDUAL_FROM_EBOOK_LIST",
  amountsInNtdPerShare:true,
  basicEPS:Object.freeze({quarterCurrent:q2,quarterPriorYear:priorQ2,
   yearToDateCurrent:ytdEps,yearToDatePriorYear:priorYtdEps}),
  dilutedEPS:Object.freeze({quarterCurrent:diluted[0],quarterPriorYear:diluted[1],
   yearToDateCurrent:diluted[2],yearToDatePriorYear:diluted[3]}),
  sourceEpsRowParserPass:true,originalPublisherDocTextPass:true,
  legalIndividualBasis2026Q2Verified:false,issuerSubsidiaryStatus2026Q2Verified:false,
  completePeriodFinancialBasisVerified:false,pointInTimeAsOfCutoffVerified:false,
  originalEarliestMarketAvailabilityVerified:false,system1FormalEligible:false,
  system2PitAEligible:false,system2PitBEligible:false,frozenEligible:false,
  canTrade:false,canIssueBuy:false,
  status:"ORIGINAL_INDIVIDUAL_PDF_EPS_ROW_VERIFIED_LEGAL_AND_PIT_PENDING"});
}
