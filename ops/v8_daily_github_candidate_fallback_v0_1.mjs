// Production V8 authoritative-scanner compute, NO formal write, plan overwrite, trade or push.
// The GitHub job is a resilience fallback for user-visible candidates after Cloudflare Cron exceededResources.
// A successful fallback MUST NEVER be mislabeled as a formal archived V8 plan.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
const origin="https://fugle-test.imihan0630.workers.dev";
const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const taipeiDay=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const previousTaipeiDay=new Date(Date.parse(taipeiDay+"T00:00:00Z")-86400000).toISOString().slice(0,10);
const chosen=String(process.env.FALLBACK_MARKET_DATE||previousTaipeiDay).trim();
if(!/^2026-\d{2}-\d{2}$/.test(chosen)||chosen>taipeiDay)throw Error("INVALID_EXPLICIT_MARKET_DAY");
if((Date.parse(taipeiDay+"T00:00:00Z")-Date.parse(chosen+"T00:00:00Z"))>7*86400000)throw Error("DATE_MORE_THAN_SEVEN_DAYS_OLD");
assert.ok(token,"V7_ADMIN_TOKEN must exist; no credentials substitution");
const runKind=process.env.GITHUB_EVENT_NAME==="schedule"?"GITHUB_SCHEDULED_FALLBACK":"AUTHORIZED_ONCE_OR_TEST";
const output={schemaVersion:"V8_DAILY_FREE_GITHUB_SELECTION_FALLBACK_V0_1",createdAt:new Date().toISOString(),marketDate:chosen,runKind,
  source:"DEPLOYED_ORIGINAL_V8_WORKER",scope:"DAILY_SELECTION_CANDIDATES_ONLY_NOT_FORMAL_ARCHIVED_PLAN",
  noPlanChanges:true,noConfigChanges:true,noThreeMinWrite:true,noPush:true,noTrade:true,
  sourceStatuses:{},status:"STARTED",selections:[],selectedCount:null,formalPersisted:false,
  completeness:{},error:null};
const header={"x-admin-token":token,accept:"application/json"};
async function get(path){
  const resp=await fetch(origin+path,{headers:header,signal:AbortSignal.timeout(25000)});
  if(!resp.ok)throw Error("V8_ADMIN_GET_HTTP_"+resp.status+"_"+path.split("?")[0]);
  return resp.json();
}
try {
  const [market,institution,quality,formal]=await Promise.all([
    get("/api/market-data/status?marketDate="+chosen),
    get("/api/institution-status?marketDate="+chosen),
    get("/api/quality-status?marketDate="+chosen),
    get("/api/scan/status")
  ]);
  output.sourceStatuses={
    marketReady:market.marketDate===chosen&&market.ready===true&&market.markets?.TWSE?.ready===true&&market.markets?.TPEx?.ready===true,
    institutionReady:institution.marketDate===chosen&&institution.ready===true,
    qualityReady:quality.marketDate===chosen&&quality.index?.ready===true&&quality.tdcc?.ready===true&&
      ["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"].every(k=>quality.datasets?.[k]?.ready===true),
    formalScanDate:formal?.scanDate||null,
    formalPipelineComplete:formal?.pipeline?.complete===true
  };
  if(output.sourceStatuses.formalScanDate===chosen&&output.sourceStatuses.formalPipelineComplete){
    output.status="FORMAL_ALREADY_COMPLETE_NO_FALLBACK_EXECUTED";
    output.selectedCount=Number.isInteger(formal.selectedCount)?formal.selectedCount:null;
    output.formalPersisted=true;
    output.selections=Array.isArray(formal.stocks)?formal.stocks.slice(0,6).map(x=>({symbol:x.symbol,name:x.name,signalLevel:x.signalLevel,channel:x.channel})):[];
  }else if(!output.sourceStatuses.marketReady||!output.sourceStatuses.institutionReady||!output.sourceStatuses.qualityReady){
    output.status="REQUIRED_OFFICIAL_SOURCES_INCOMPLETE_NOT_ZERO_PICK";
    process.exitCode=2;
  }else{
    // Exactly one call. The deployed V8 Worker enforces dryRun=true and omits all plan/push writes.
    const resp=await fetch(origin+"/api/scan-preview",{method:"POST",
      headers:{...header,"content-type":"application/json"},body:JSON.stringify({marketDate:chosen}),
      signal:AbortSignal.timeout(235000)});
    const raw=await resp.text();
    let answer=null;try{answer=JSON.parse(raw)}catch{}
    if(!resp.ok||!answer?.dryRun||answer.scanDate!==chosen||answer?.pipeline?.selectionCompleted!==true){
      throw Error("V8_PREVIEW_NOT_VERIFIED_HTTP_"+resp.status+"_"+String(answer?.error||"NON_JSON").slice(0,260));
    }
    assert.ok(Number.isInteger(answer.selectedCount)&&answer.selectedCount>=0&&answer.selectedCount<=6);
    assert.ok(Array.isArray(answer.stocks)&&answer.stocks.length===answer.selectedCount);
    const stocks=answer.stocks.map(s=>({
      symbol:String(s.symbol||""),
      name:String(s.name||""),
      signalLevel:String(s.signalLevel||""),
      channel:String(s.channel||""),
      buyLow:Number.isFinite(s.buyLow)?s.buyLow:null,
      buyHigh:Number.isFinite(s.buyHigh)?s.buyHigh:null,
      stop:Number.isFinite(s.stop)?s.stop:null,
      priorityScore:Number.isFinite(s.priorityScore)?s.priorityScore:null
    }));
    assert.ok(stocks.every(s=>/^[1-9][0-9]{3}$/.test(s.symbol)&&["A","B"].includes(s.signalLevel)));
    const missing=answer?.diagnostics?.quarterEpsReview?.missingSymbols;
    const epsReady=answer?.diagnostics?.quarterEpsReview?.ready===true&&Array.isArray(missing)&&missing.length===0;
    const h60=Number(answer?.diagnostics?.history60DayCount??0);
    const coverageComplete=answer?.diagnostics?.historyCoverageComplete===true;
    // There is no reliable zero-pick if source coverage or EPS verification is insufficient.
    if(!epsReady||h60<1||(stocks.length===0&&!coverageComplete)){
      output.status="DATA_INCOMPLETE_NOT_ZERO_PICK";
      output.completeness={epsReady,history60DayCount:h60,historyCoverageComplete:coverageComplete};
      process.exitCode=2;
    }else{
      output.status=coverageComplete?"VERIFIED_V8_SELECTION_DRY_RUN_CANDIDATES":"V8_SELECTION_DRY_RUN_PARTIAL_HISTORY_COVERAGE";
      output.selectedCount=answer.selectedCount;
      output.selections=stocks;
      output.completeness={epsReady,history60DayCount:h60,historyCoverageComplete:coverageComplete,
        unverifiedHistorySymbols:Number(answer.diagnostics?.historyInsufficientCount||0)};
    }
  }
}catch(error){
  output.status="FAILED_CANNOT_CLAIM_FORMAL_SELECTION";
  output.error=error?.name==="TimeoutError"?"V8_WORKER_PREVIEW_TIMEOUT":String(error.message||error).slice(0,380);
  process.exitCode=2;
}finally{
  const core={marketDate:output.marketDate,status:output.status,selectedCount:output.selectedCount,selections:output.selections,
    completeness:output.completeness,sourceStatuses:output.sourceStatuses};
  output.candidateReceiptHash=createHash("sha256").update(JSON.stringify(core)).digest("hex");
  await mkdir("artifacts",{recursive:true});
  await writeFile("artifacts/v8-nightly-candidates-"+chosen+".json",JSON.stringify(output,null,2)+"\n");
  console.log("V8_NIGHTLY_GITHUB_FALLBACK_RESULT="+JSON.stringify(output));
}
