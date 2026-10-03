import {collectVerifiedC1C2} from "./system1_c1_c2_collection_v0_1.mjs";
import {auditC3LiveInputs,buildC4DailyComparison,buildC5DailyReport} from "./system1_evidence_automation_v0_1.mjs";
import {buildC3EntryExperiment} from "./system1_c3_c4_c5_shadow_v0_1.mjs";

const DATE=/^\d{4}-\d{2}-\d{2}$/;
const ts=x=>typeof x==="string"&&/(?:Z|[+-]\d\d:\d\d)$/.test(x)?Date.parse(x):NaN;
const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;

function blocked(code,detail=null){const e=new Error(code);e.code=code;e.detail=detail;return e;}
function uniq(values){return [...new Set(values)];}
function readJsonField(value,code){
  try{return typeof value==="string"?JSON.parse(value):value;}
  catch{throw blocked(code);}
}

export function verifyC3CohortRows(rows,targetTradeDate,c2Ledger=null){
  if(!DATE.test(String(targetTradeDate||""))) throw blocked("C3_POSTSESSION_TARGET_DATE_REQUIRED");
  if(!Array.isArray(rows)||!rows.length) throw blocked("C3_POSTSESSION_COHORT_NOT_FOUND");
  if(rows.length>3) throw blocked("C3_POSTSESSION_COHORT_EXCEEDS_BOUND");
  const fields=["generation_id","source_session_date","target_trade_date","source_c1_content_digest",
    "source_c1_universe_digest","source_c2_fingerprint","cohort_digest"];
  for(const field of fields){
    const values=uniq(rows.map(x=>String(x?.[field]??"")));
    if(values.length!==1||!values[0]) throw blocked("C3_POSTSESSION_COHORT_PROVENANCE_MISMATCH",field);
  }
  if(rows[0].target_trade_date!==targetTradeDate) throw blocked("C3_POSTSESSION_TARGET_DATE_MISMATCH");
  const symbols=rows.map(x=>String(x?.symbol||""));
  if(symbols.some(x=>!x)||new Set(symbols).size!==symbols.length) throw blocked("C3_POSTSESSION_COHORT_SYMBOL_INVALID");
  const classes=new Set(["FULL_SHORT_PASS","CONDITIONAL_SAFETY_UNKNOWN"]);
  if(rows.some(x=>!classes.has(String(x?.classification||"")))) throw blocked("C3_POSTSESSION_COHORT_CLASSIFICATION_INVALID");
  const out={
    generationId:rows[0].generation_id,sourceSessionDate:rows[0].source_session_date,targetTradeDate,
    sourceC1ContentDigest:rows[0].source_c1_content_digest,sourceC1UniverseDigest:rows[0].source_c1_universe_digest,
    sourceC2Fingerprint:rows[0].source_c2_fingerprint,cohortDigest:rows[0].cohort_digest,
    symbols:[...symbols].sort(),rows:[...rows].sort((a,b)=>String(a.symbol).localeCompare(String(b.symbol)))
  };
  if(c2Ledger){
    if(c2Ledger.generationId!==out.generationId||c2Ledger.sessionDate!==out.sourceSessionDate||
       c2Ledger.sourceContentDigest!==out.sourceC1ContentDigest||c2Ledger.universeDigest!==out.sourceC1UniverseDigest||
       c2Ledger.fingerprint!==out.sourceC2Fingerprint) throw blocked("C3_POSTSESSION_C2_COHORT_MISMATCH");
  }
  return out;
}

export function adaptC3QuoteRows(quoteRows,cohort){
  if(!Array.isArray(quoteRows)) throw blocked("C3_POSTSESSION_QUOTE_ROWS_REQUIRED");
  const cohortSymbols=new Set(cohort.symbols),seen=new Set(),out=[];
  for(const row of quoteRows){
    if(row?.generation_id!==cohort.generationId||row?.target_trade_date!==cohort.targetTradeDate)
      throw blocked("C3_POSTSESSION_QUOTE_GENERATION_MISMATCH");
    const symbol=String(row?.symbol||""),barStart=String(row?.bar_start||"");
    if(!cohortSymbols.has(symbol)||!Number.isFinite(ts(barStart))) throw blocked("C3_POSTSESSION_QUOTE_SCOPE_INVALID");
    const key=symbol+"|"+barStart;
    if(seen.has(key)) throw blocked("C3_POSTSESSION_QUOTE_DUPLICATE");
    seen.add(key);
    if(row?.source_family!=="FUGLE_INTRADAY_QUOTE_RAW_CONTEXT"||!Number.isFinite(ts(String(row?.source_fetched_at||""))))
      throw blocked("C3_POSTSESSION_QUOTE_PROVENANCE_INVALID");
    const q=readJsonField(row.quote_json,"C3_POSTSESSION_QUOTE_JSON_INVALID");
    const explicitLimit=typeof q?.isLimitUpPrice==="boolean"?q.isLimitUpPrice:null;
    out.push({
      symbol,barStart,verified:explicitLimit!==null,
      limitUp:explicitLimit,
      marketState:typeof q?.executionMarketState==="string"?q.executionMarketState:null,
      quoteTimestamp:typeof q?.quoteTimestamp==="string"?q.quoteTimestamp:null,
      bidDepth5:finite(q?.bidDepth5),askDepth5:finite(q?.askDepth5),depthImbalance:finite(q?.depthImbalance),
      spreadPct:finite(q?.spreadPct),rawDepthOnly:true,depthScoreDerived:false
    });
  }
  return out.sort((a,b)=>a.symbol.localeCompare(b.symbol)||ts(a.barStart)-ts(b.barStart));
}

function verifyBarRows(barRows,cohort){
  if(!Array.isArray(barRows)) throw blocked("C3_POSTSESSION_BAR_ROWS_REQUIRED");
  const cohortSymbols=new Set(cohort.symbols),seen=new Set();
  for(const row of barRows){
    if(row?.generation_id!==cohort.generationId||row?.target_trade_date!==cohort.targetTradeDate)
      throw blocked("C3_POSTSESSION_BAR_GENERATION_MISMATCH");
    const symbol=String(row?.symbol||""),barStart=String(row?.bar_start||"");
    if(!cohortSymbols.has(symbol)||!Number.isFinite(ts(barStart))) throw blocked("C3_POSTSESSION_BAR_SCOPE_INVALID");
    const key=symbol+"|"+barStart;
    if(seen.has(key)) throw blocked("C3_POSTSESSION_BAR_DUPLICATE");
    seen.add(key);
    if(row?.source_family!=="FUGLE_INTRADAY_CANDLES_15M"||!Number.isFinite(ts(String(row?.source_fetched_at||""))))
      throw blocked("C3_POSTSESSION_BAR_PROVENANCE_INVALID");
  }
  return barRows;
}

export function buildC4ReadinessFromCohort(c2Ledger,cohortSymbols,{totalCapital=200000,gridNTD=1000,perNameCapRatio=0.35}={}){
  const pairMap=new Map(c2Ledger.pairs.map(x=>[String(x.symbol),x]));
  const candidates=[],missing=[];
  for(const symbol of cohortSymbols){
    const pair=pairMap.get(symbol),ctx=pair?.selectionContext,g=ctx?.entryGeometry;
    const priorityScore=finite(ctx?.priorityScore),entry=finite(g?.entry),stop=finite(g?.stop);
    if(!(priorityScore>0)&&priorityScore!==0){missing.push({symbol,field:"priorityScore"});continue;}
    if(!(entry>0)||!(stop>0)||stop>=entry){missing.push({symbol,field:"entryOrStop"});continue;}
    candidates.push({symbol,priorityScore,entry,stop});
  }
  if(missing.length||candidates.length!==cohortSymbols.length){
    return {schemaVersion:"SYSTEM1_C4_POSTSESSION_READINESS_V0_1",status:"INPUT_BLOCKED",
      reason:"PRIORITY_SCORE_OR_GEOMETRY_NOT_PRESERVED",missing,candidateN:candidates.length,
      expectedN:cohortSymbols.length,economicSuperiority:"UNKNOWN",researchOnly:true,decisionImpact:false,formalCoreImpact:false,noTrade:true};
  }
  return {schemaVersion:"SYSTEM1_C4_POSTSESSION_READINESS_V0_1",status:"READY",
    comparison:buildC4DailyComparison(candidates,{totalCapital,gridNTD,perNameCapRatio}),
    economicSuperiority:"UNKNOWN",researchOnly:true,decisionImpact:false,formalCoreImpact:false,noTrade:true};
}

export function buildSystem1PostSessionPacket({
  targetTradeDate,cohortRows,barRows,quoteRows,c1Diagnosis,c2Ledger,
  costs={brokerFeeBpsPerSide:14.25,sellTaxBps:30,slippageBpsPerSide:5},
  capital={totalCapital:200000,gridNTD:1000,perNameCapRatio:0.35}
}={}){
  const cohort=verifyC3CohortRows(cohortRows,targetTradeDate,c2Ledger);
  verifyBarRows(barRows,cohort);
  const barStateReceipts=adaptC3QuoteRows(quoteRows,cohort);
  const audit=auditC3LiveInputs(c2Ledger,{
    captureRows:barRows,barStateReceipts,formalBaselineReceipts:[],scopeSymbols:cohort.symbols
  });
  const c3=buildC3EntryExperiment(c2Ledger,audit.readyReceipts,{costs});
  const c5=buildC5DailyReport(c1Diagnosis,c2Ledger);
  const c4=buildC4ReadinessFromCohort(c2Ledger,cohort.symbols,capital);
  return {
    schemaVersion:"SYSTEM1_POSTSESSION_EVIDENCE_PACKET_V0_1",
    targetTradeDate,sourceSessionDate:cohort.sourceSessionDate,generationId:cohort.generationId,
    cohort:{symbols:cohort.symbols,cohortDigest:cohort.cohortDigest,n:cohort.symbols.length},
    capture:{barRows:barRows.length,quoteRows:quoteRows.length,audit},
    c3,c4,c5,
    interpretation:{
      boundedC3SampleIsNotFullC2Denominator:true,
      formalNotAdmittedIsNotEquivalentToFormalNoTrigger:true,
      formalBaselineUnknownMustNotCountAsNoTrigger:true,
      c4BlockedMustNotBeBackfilledWithAlternateScore:true
    },
    economicSuperiority:"UNKNOWN",formalCoreLocked:true,researchOnly:true,decisionImpact:false,
    formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
  };
}

export async function collectSystem1PostSessionEvidence({
  origin,token,targetTradeDate,request=fetch,timeoutMs=30000
}={}){
  if(!token) throw blocked("AUTHORIZATION_BLOCKED");
  if(!DATE.test(String(targetTradeDate||""))) throw blocked("C3_POSTSESSION_TARGET_DATE_REQUIRED");
  const base=String(origin||"").replace(/\/$/,"");
  const headers={"x-admin-token":token,accept:"application/json","cache-control":"no-cache"};
  const get=async(path)=>{
    let response,body;
    try{response=await request(base+path,{method:"GET",headers,signal:AbortSignal.timeout(timeoutMs)});}
    catch{throw blocked("C3_POSTSESSION_TRANSPORT_FAILED",path);}
    try{body=await response.json();}catch{throw blocked("C3_POSTSESSION_INVALID_JSON",path);}
    if([401,403].includes(response.status)) throw blocked("AUTHORIZATION_BLOCKED",path);
    if(!response.ok||body?.ok===false) throw blocked("C3_POSTSESSION_HTTP_FAILED",path);
    return body;
  };
  const cohortBody=await get("/api/research/c3-capture-cohort?targetTradeDate="+encodeURIComponent(targetTradeDate));
  const preCohort=verifyC3CohortRows(cohortBody?.rows,targetTradeDate);
  const {diagnosis,paired}=await collectVerifiedC1C2({
    origin:base,token,scanDate:preCohort.sourceSessionDate,request,timeoutMs
  });
  const cohort=verifyC3CohortRows(cohortBody.rows,targetTradeDate,paired);
  const [barsBody,quotesBody]=await Promise.all([
    get("/api/research/c3-capture-bars?generationId="+encodeURIComponent(cohort.generationId)),
    get("/api/research/c3-capture-quotes?generationId="+encodeURIComponent(cohort.generationId))
  ]);
  return buildSystem1PostSessionPacket({
    targetTradeDate,cohortRows:cohortBody.rows,barRows:barsBody?.rows||[],quoteRows:quotesBody?.rows||[],
    c1Diagnosis:diagnosis,c2Ledger:paired
  });
}
