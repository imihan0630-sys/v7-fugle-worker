import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {dirname} from "node:path";

const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
assert.ok(token,"Missing V7_ADMIN_TOKEN");
const origin="https://fugle-test.imihan0630.workers.dev";
const headers={"x-admin-token":token,accept:"application/json","cache-control":"no-cache"};

async function get(path){
  const response=await fetch(origin+path,{headers,signal:AbortSignal.timeout(45000)});
  const text=await response.text();let data=null;try{data=JSON.parse(text);}catch{}
  if(!response.ok||!data)throw new Error(`${path} HTTP ${response.status}: ${text.slice(0,300)}`);
  return data;
}

const [cron,finalize,scan,runtime]=await Promise.all([
  get("/api/cron/status?historyAudit="+Date.now()),
  get("/api/finalize/status?historyAudit="+Date.now()),
  get("/api/scan/status?historyAudit="+Date.now()),
  fetch(origin+"/api/version?historyAudit="+Date.now(),{headers:{accept:"application/json","cache-control":"no-cache"},signal:AbortSignal.timeout(30000)}).then(r=>r.json())
]);

const historyRuns=(cron.recent||[]).filter(x=>x?.job_type==="HISTORY_WARMUP");
const parsed=historyRuns.map(x=>{
  const detail=String(x.detail||"");
  const progress=detail.match(/全市場已處理\s*(\d+)\/(\d+)/);
  const complete=detail.match(/歷史底庫已處理完成；(\d+)\/(\d+)/);
  const pair=progress||complete;
  return {
    id:x.id,status:x.status,scheduledAt:x.scheduled_at,finishedAt:x.finished_at,
    detail,error:x.error||null,fugleCalls:x.fugle_calls,
    resolved:pair?Number(pair[1]):null,target:pair?Number(pair[2]):null
  };
});
const numeric=parsed.filter(x=>Number.isInteger(x.resolved)&&Number.isInteger(x.target));
const latestNumeric=numeric[0]||null;
const failures=parsed.filter(x=>x.status==="FAILED");

const readiness=finalize?.readiness||{};
const result={
  schemaVersion:"SYSTEM1_HISTORY_INVENTORY_READONLY_V0_3",
  diagnosticExecutionStatus:"PASS",
  historyAcceptanceStatus:readiness?.checks?.historyReady===false
    ?"BLOCKED_REPORTED_NOT_READY"
    :readiness?.checks?.historyReady===true
      ?"REPORTED_READY_RAW_COVERAGE_UNVERIFIED"
      :"UNKNOWN_REPORTED_READINESS_MISSING",
  rawHistoryEvidenceGrade:"STATUS_ENDPOINTS_ONLY",
  raw60DayHistoryInventoryVerified:false,
  operationalRecoveryPass:false,
  observedAt:new Date().toISOString(),
  runtimeVersion:runtime?.version||cron?.version||null,
  productionReadiness:{
    historyReady:readiness?.checks?.historyReady??null,
    cached:Number(readiness?.history?.cached??0),
    target:Number(readiness?.history?.target??0),
    resolved:Number(readiness?.history?.resolved??0),
    institution3DaysReady:readiness?.checks?.institution3DaysReady??null
  },
  lastSuccessfulFormalScan:{
    scanDate:scan?.scanDate||null,
    generatedAt:scan?.generatedAt||null,
    selectedCount:scan?.selectedCount??null,
    ordinaryStocks:scan?.market?.ordinaryStocks??null,
    with60Days:scan?.diagnostics?.with60Days??null,
    historyCacheCount:scan?.diagnostics?.historyCacheCount??null,
    historyCacheTarget:scan?.diagnostics?.historyCacheTarget??null,
    historyWarmupResolved:scan?.diagnostics?.historyWarmupResolved??null,
    historyCoverageComplete:scan?.diagnostics?.historyCoverageComplete??null
  },
  recentHistoryWarmupRuns:parsed,
  latestNumericProgress:latestNumeric,
  historyWarmupFailureCount:failures.length,
  interpretation:{
    cronProgressIsAdmissionAware:true,
    readinessResolvedMatchesLatestCron:latestNumeric
      ? Number(readiness?.history?.resolved??-1)===latestNumeric.resolved
      : null,
    directD1RawInventoryNotUsed:true,
    noFormalDecisionMade:true
  },
  readOnly:true,mutationPerformed:false,noPlanChanges:true,noTrade:true,noPush:true
};
const outputPath=String(process.env.HISTORY_INVENTORY_OUTPUT||"artifacts/system1-history-inventory-readonly.json");
mkdirSync(dirname(outputPath),{recursive:true});
writeFileSync(outputPath,JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify(result,null,2));
