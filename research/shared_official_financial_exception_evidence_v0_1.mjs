// Shared System1 / System2 financial-source exception contract V0.1.
// Research-only source evidence, not a bypass for Formal EPS, PIT/Frozen or orders.
// No network, Cloudflare, secret, production writes or source/body publication.
import {createHash} from "node:crypto";

export const OFFICIAL_MOPS_QUARTER_SOURCE =
  "https://mopsov.twse.com.tw/mops/web/ajax_t164sb04";
const SYMBOL=/^[1-9][0-9]{3}$/, SHA=/^[a-f0-9]{64}$/;
const DATE=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const FAIL="NOT_AN_AUTHORIZED_FORMAL_OR_PIT_SELECTION";
function clock(value){
 if(typeof value!=="string"||!DATE.test(value)||!Number.isFinite(Date.parse(value)))return null;
 return new Date(value).toISOString();
}
function scope(symbol,year,quarter){
 if(!SYMBOL.test(String(symbol))||!Number.isInteger(year)||year<2017||year>2030||
    ![1,2,3].includes(quarter))throw Error("OFFICIAL_EXCEPTION_REQUEST_SCOPE_REJECTED");
}
function frozen(obj){if(obj&&typeof obj==="object"){for(const x of Object.values(obj))frozen(x);Object.freeze(obj);}return obj;}
export function planOfficialFinancialException({symbols,year,quarter}={}){
 if(!Array.isArray(symbols)||symbols.length===0||symbols.length>6||
    new Set(symbols).size!==symbols.length)throw Error("OFFICIAL_EXCEPTION_SYMBOL_BUDGET_OR_DUPLICATE");
 for(const s of symbols)scope(s,year,quarter);
 if(quarter===1)return frozen({state:"Q1_PREVIOUS_Q4_SPECIAL_CONTRACT_REQUIRED",
  requests:[],researchOnly:true,sourceDiscoveryOnly:true,formalEligible:false});
 const seasons=[quarter,quarter-1],requests=[];
 for(const symbol of symbols)for(const season of seasons)
  requests.push({symbol,year,quarter:season,sourceUrl:OFFICIAL_MOPS_QUARTER_SOURCE,
   method:"POST",contentType:"application/x-www-form-urlencoded",
   bodyFields:{encodeURIComponent:"1",step:"1",firstin:"1",off:"1",TYPEK:"all",
    isnew:"false",co_id:symbol,year:String(year-1911),
    season:String(season).padStart(2,"0")},maxBodyBytes:300000});
 return frozen({schema:"S1_S2_OFFICIAL_EXCEPTION_PLAN_V0_1",sourceClass:"OFFICIAL_MOPS",
  sourceDiscoveryOnly:true,researchOnly:true,formalEligible:false,
  requestCount:requests.length,maximumQueries:12,requests});
}

export function inspectOfficialMopsHtml({symbol,year,quarter,html,sourceUrl,
 observedAt,originalParser}={}){
 scope(symbol,year,quarter);
 if(sourceUrl!==OFFICIAL_MOPS_QUARTER_SOURCE)throw Error("OFFICIAL_EXCEPTION_UNTRUSTED_URL");
 if(typeof html!=="string"||Buffer.byteLength(html,"utf8")<150||
    Buffer.byteLength(html,"utf8")>300000)throw Error("OFFICIAL_EXCEPTION_RAW_BODY_INVALID");
 const seen=clock(observedAt);if(!seen)throw Error("OFFICIAL_EXCEPTION_OBSERVED_TIME_INVALID");
 // Do not trust a string supplied as "basis" by web search. Identify original
 // source markup using exact company/year/season keys and original statement type.
 const prefix="CO_ID="+symbol+"&SYEAR="+year+"&SSEASON="+quarter+"&REPORT_ID=";
 const markerC=html.includes(prefix+"C"),markerA=html.includes(prefix+"A");
 const consolidated=html.includes("合併綜合損益表");
 const individual=html.includes("個體綜合損益表")||html.includes("個別綜合損益表");
 const unit=html.includes("新台幣仟元");
 const markerConflict=markerC&&markerA;
 let basis="UNKNOWN",state="OFFICIAL_REPORT_ID_OR_BASIS_UNVERIFIED";
 if(markerConflict||consolidated&&individual)
  state="OFFICIAL_REPORT_BASIS_CONFLICT";
 else if(markerC&&consolidated&&unit){
  basis="CONSOLIDATED";state="CONSOLIDATED_C_ORIGINAL_PARSER_REQUIRED";
 }else if(markerA&&individual&&unit){
  basis="INDIVIDUAL";state="INDIVIDUAL_A_REQUIRES_SEPARATE_POLICY_REVIEW";
 }
 let parsedByOriginal=false;
 let parserReason=null;
 // Independently supplied original System1 parser; no permissive fallback.
 // No EPS value is emitted or used for scoring in this research contract.
 if(state==="CONSOLIDATED_C_ORIGINAL_PARSER_REQUIRED"){
  if(typeof originalParser==="function"){
   try{
    const result=originalParser(html,symbol,year,quarter);
    parsedByOriginal=result?.quarterEpsVerified===true&&
      Number.isFinite(result?.quarterEPS);
    if(!parsedByOriginal)parserReason="ORIGINAL_EPS_PARSER_NOT_VERIFIED";
   }catch(_){parserReason="ORIGINAL_EPS_PARSER_REJECTED";}
  }else parserReason="ORIGINAL_EPS_PARSER_UNAVAILABLE";
  state=parsedByOriginal?"CONSOLIDATED_C_SOURCE_PARSER_PASS":
   "CONSOLIDATED_C_ORIGINAL_PARSER_UNVERIFIED";
 }
 return frozen({schema:"S1_S2_OFFICIAL_EXCEPTION_ORIGINAL_EVIDENCE_V0_1",
  symbol,year,quarter,sourceUrl,sourceType:"OFFICIAL_MOPS_ORIGINAL",
  contentSha256:createHash("sha256").update(html).digest("hex"),
  contentLength:Buffer.byteLength(html,"utf8"),observedAt:seen,
  exactReportId:markerConflict?"CONFLICT":markerC?"C":markerA?"A":null,
  basis,hasOfficialUnit:unit,originalParserVerified:parsedByOriginal,
  parserReason,state,officialPublicationTimestamp:null,
  publicationTimestampProven:false,
  // A real original HTML payload can be observed later than a historical decision.
  // This record cannot establish its own historical official issue time.
  historicalPointInTimeCertified:false,
  sourceOnly:true,formalEligible:false,canWriteKV:false,canWriteD1:false,
  canIssueTrade:false,guard:FAIL});
}

export function classifyOfficialFinancialException({symbol,year,quarter,
  decisionCutoffAt=null,reports=[],searchHints=[]}={}){
 scope(symbol,year,quarter);
 if(!Array.isArray(reports)||reports.length>4||!Array.isArray(searchHints)||
    searchHints.length>10)throw Error("OFFICIAL_EXCEPTION_EVIDENCE_BUDGET_INVALID");
 const cut=decisionCutoffAt===null?null:clock(decisionCutoffAt);
 if(decisionCutoffAt!==null&&!cut)throw Error("OFFICIAL_EXCEPTION_CUTOFF_INVALID");
 const required=[quarter,quarter-1];
 if(quarter===1)return frozen({status:"Q1_Q4_REQUIRES_SEPARATE_OFFICIAL_CONTRACT",
  symbol,year,quarter,sourceReady:false,pointInTimeReady:false,
  formalEligible:false,searchHintsAcceptedAsProof:false,guard:FAIL});
 const sources=reports.filter(r=>r?.symbol===symbol&&r?.year===year&&required.includes(r?.quarter));
 const byPeriod=new Map();
 for(const r of sources){
  // Reject manufactured receipts missing the original-data fingerprint,
  // although only the DATA producer / independent audit can certify its origin.
  if(r.sourceUrl!==OFFICIAL_MOPS_QUARTER_SOURCE||!SHA.test(String(r.contentSha256||""))||
   !clock(r.observedAt)||r.sourceOnly!==true||r.formalEligible!==false)
   throw Error("OFFICIAL_EXCEPTION_BAD_OR_UNTRUSTED_RECEIPT");
  if(byPeriod.has(r.quarter))return frozen({status:"DUPLICATE_VERSION_REQUIRES_ORIGINAL_RECONCILIATION",
   symbol,year,quarter,sourceReady:false,pointInTimeReady:false,
   formalEligible:false,searchHintsAcceptedAsProof:false,guard:FAIL});
  byPeriod.set(r.quarter,r);
 }
 const item=required.map(q=>byPeriod.get(q));
 let status;
 if(item.some(x=>!x))status="OFFICIAL_ORIGINAL_MISSING_OR_UNVERIFIED";
 else if(item.some(x=>x.basis==="INDIVIDUAL"))
  status="INDIVIDUAL_BASIS_REQUIRES_SEPARATE_POLICY_REVIEW";
 else if(item.some(x=>x.basis!=="CONSOLIDATED"||
    x.exactReportId!=="C"||x.originalParserVerified!==true))
  status="OFFICIAL_SCHEMA_OR_PARSER_UNVERIFIED";
 else if(!cut)status="SOURCE_C_PARSED_PIT_NOT_ASSESSED";
 else if(item.some(x=>Date.parse(x.observedAt)>Date.parse(cut)))
  status="POST_CUTOFF_DISCOVERY_HISTORICAL_PIT_UNPROVEN";
 else status="SOURCE_C_PARSED_PRE_CUTOFF_PROSPECTIVE_WITNESS";
 const sourceReady=status==="SOURCE_C_PARSED_PIT_NOT_ASSESSED"||
  status==="SOURCE_C_PARSED_PRE_CUTOFF_PROSPECTIVE_WITNESS";
 return frozen({schema:"S1_S2_OFFICIAL_EXCEPTION_CLASSIFICATION_V0_1",symbol,year,quarter,
  status,sourceReady,pointInTimeReady:false,firstObservedAt:
    item.every(Boolean)?item.map(x=>x.observedAt).sort()[0]:null,
  latestObservedAt:item.every(Boolean)?item.map(x=>x.observedAt).sort().at(-1):null,
  decisionCutoffAt:cut,officialPublicationTimestampProven:false,
  receiptDigests:item.filter(Boolean).map(x=>x.contentSha256),
  searchHintCount:searchHints.length,searchHintsAcceptedAsProof:false,
  noHistoricalBackfill:true,reviewOnly:true,formalEligible:false,
  system2FrozenEligible:false,zeroPicksCertified:false,canIssueTrade:false,
  guard:FAIL});
}
