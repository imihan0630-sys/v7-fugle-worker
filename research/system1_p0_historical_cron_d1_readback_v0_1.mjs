// System 1 P0: fixed historical slot, D1 SELECT-only incident witness.
// Classifier is pure and never infers invocation absence from missing audit rows.
export const TARGET_DATE="2026-10-15";
export const WINDOW_START="2026-10-15T15:30:00.000Z";
export const WINDOW_END="2026-10-15T16:06:00.000Z";
export const LEASE_KEY="V7_AFTER_MARKET_LEASE:2026-10-15";
export const CRON_SELECT="SELECT id,cron_expression,scheduled_time,scheduled_at,started_at,finished_at,job_type,status,skipped,detail,error FROM v7_cron_runs WHERE scheduled_at>=?1 AND scheduled_at<?2 AND job_type='AFTER_MARKET_SCAN' ORDER BY scheduled_at ASC LIMIT 10";
export const LEASE_SELECT="SELECT state_key,updated_at,snapshot_json FROM v7_signal_delivery_state WHERE state_key=?1 LIMIT 1";

// Pure REST D1 SELECT meta validator, unit-testable without Cloudflare.
// Cloudflare's rows_written MUST explicitly be the numeric integer 0.
export function requireVerifiedSelectMetrics(meta,returnedRowCount) {
  if(!meta||typeof meta!=="object"||
    !Object.prototype.hasOwnProperty.call(meta,"rows_written"))
    throw Error("D1_ROWS_WRITTEN_WITNESS_MISSING");
  if(!Number.isSafeInteger(meta.rows_written)||meta.rows_written!==0)
    throw Error("D1_SELECT_WRITE_OR_METRICS_UNVERIFIED");
  const read=meta.rows_read===undefined?returnedRowCount:meta.rows_read;
  if(!Number.isSafeInteger(read)||read<0)
    throw Error("D1_SELECT_READ_METRICS_UNVERIFIED");
  return {written:0,read};
}

const SLOTS=["2026-10-15T15:35","2026-10-15T15:55"];
function errorClass(raw) {
  const message=String(raw||"");
  if(!message)return null;
  if(/quota|row.write.limit|rows.written|exceeded.*rows/i.test(message))return "D1_QUOTA_OR_WRITE_LIMIT";
  if(/cpu|exceededResources|resource.limit/i.test(message))return "WORKER_CPU_OR_RESOURCE";
  if(/DATA_INCOMPLETE/i.test(message))return "PRECOMMIT_DATA_INCOMPLETE";
  if(/timeout|timed.out/i.test(message))return "TIMEOUT";
  return "OTHER_ERROR_NOT_ATTRIBUTED";
}
function safeLease(rows){
  if(!Array.isArray(rows)||rows.length>1)throw Error("LEASE_READBACK_NOT_BOUNDED");
  if(!rows.length)return {present:false,updatedAt:null,snapshotStatus:null,snapshotScanDate:null};
  const row=rows[0];
  if(row?.state_key!==LEASE_KEY)throw Error("FOREIGN_LEASE_KEY");
  let snapshot=null,parseError=false;
  if(row.snapshot_json!==null&&row.snapshot_json!==undefined){
    try{snapshot=JSON.parse(String(row.snapshot_json));}catch{parseError=true;}
  }
  return {present:true,updatedAt:row.updated_at||null,
    updatedOnTargetUtcDay:String(row.updated_at||"").slice(0,10)===TARGET_DATE,
    snapshotStatus:typeof snapshot?.status==="string"?snapshot.status:null,
    snapshotScanDate:typeof snapshot?.scanDate==="string"?snapshot.scanDate:null,
    snapshotParseFailed:parseError,
    // Snapshot is mutable and may have been overwritten after the event.
    sameInvocationProof:false};
}
export function classifyHistoricalCronD1({date=TARGET_DATE,cronRows=null,leaseRows=null,readError=null,observedAt=null}={}){
  if(date!==TARGET_DATE)throw Error("UNAUTHORIZED_HISTORICAL_TARGET");
  if(readError)return {schema:"S1_P0_HISTORIC_CRON_D1_SELECT_V0_1",date,
    state:"PHYSICAL_D1_READ_UNAVAILABLE",readErrorClass:String(readError).slice(0,70),
    scheduledInvocationsProven:false,formalParentProven:false,
    noD1Write:true,noKVWrite:true,noWorkerDeploy:true,noBusinessPOST:true,noPush:true,noTrade:true};
  if(!Array.isArray(cronRows)||cronRows.length>10)throw Error("CRON_ROWS_MISSING_OR_UNBOUNDED");
  // LIMIT 10 is not a completeness certificate: exactly ten returned rows
  // may mean additional rows were truncated. Never accept a full page.
  const pageLimitReached=cronRows.length===10;
  const lease=safeLease(leaseRows);
  const buckets=new Map(SLOTS.map(s=>[s,[]]));
  let invalid=0;
  for(const row of cronRows){
    const utc=Date.parse(String(row?.scheduled_at||""));
    const time=Number.isFinite(utc)?new Date(utc).toISOString().slice(0,16):"";
    const expression=String(row?.cron_expression||"").toLowerCase().replace(/\s+/g," ").trim();
    const scheduledMs=Number(row?.scheduled_time);
    const id=Number(row?.id);
    const startMs=Date.parse(String(row?.started_at||""));
    const endMs=Date.parse(String(row?.finished_at||""));
    const validReceipt=Number.isSafeInteger(id)&&id>0&&
      Number.isSafeInteger(scheduledMs)&&scheduledMs===utc&&
      Number.isFinite(startMs)&&Number.isFinite(endMs)&&endMs>=startMs&&
      ["SUCCESS","FAILED","SKIPPED"].includes(row?.status)&&
      (row.status==="SKIPPED")===(Number(row.skipped)===1);
    if(row?.job_type!=="AFTER_MARKET_SCAN"||!buckets.has(time)||!validReceipt||
       !["35,55 15 * * mon-fri","35 15 * * mon-fri","55 15 * * mon-fri"].includes(expression)){
      invalid++;continue;
    }
    buckets.get(time).push(row);
  }
  const slotEvidence=SLOTS.map((slot,i)=>{
    const rows=buckets.get(slot);
    const row=rows.length===1?rows[0]:null;
    return {slotUtc:slot+":00.000Z",slotTaipei:i===0?"2026-10-15 23:35":"2026-10-15 23:55",
      persistedRows:rows.length,persistedCronAudit:rows.length===1,
      status:row?.status||null,skipped:row?Number(row.skipped)===1:null,
      errorClass:row?errorClass(row.error):null,cronRunId:row&&Number.isSafeInteger(row.id)?row.id:null,
      startedAt:row?.started_at||null,finishedAt:row?.finished_at||null,
      executionAbsentProven:false};
  });
  const anomalous=invalid>0||slotEvidence.some(x=>x.persistedRows>1);
  const present=slotEvidence.filter(x=>x.persistedCronAudit).length;
  let state="NO_PERSISTED_CRON_OR_LEASE__INVOCATION_UNKNOWN";
  if(pageLimitReached)state="CRON_READBACK_PAGE_LIMIT_REACHED_FAIL_CLOSED";
  else if(anomalous)state="CRON_READBACK_INCONSISTENT_FAIL_CLOSED";
  else if(present)state="PERSISTED_CRON_AUDIT__FORMAL_PARENT_UNVERIFIED";
  else if(lease.present)state="LEASE_PRESENT__CRON_AUDIT_MISSING_OR_UNVERIFIED";
  return {schema:"S1_P0_HISTORIC_CRON_D1_SELECT_V0_1",date,observedAt,
    state,windowUtc:{start:WINDOW_START,end:WINDOW_END},
    expectedSlots:2,queriedCronRows:cronRows.length,readbackPageLimitReached:pageLimitReached,
    invalidOrUnexpectedRows:invalid,
    slotEvidence,lease,
    scheduledInvocationsProven:false,
    // Persisted audit rows prove DB rows exist, not all original Cloudflare trigger deliveries.
    persistedAuditSlots:present,
    formalParentProven:false,kvReadbackProven:false,handsetReceiptProven:false,
    historicalCronAbsenceProven:false,quotaRootCauseGloballyProven:false,
    queryOnly:true,noD1Write:true,noKVWrite:true,noWorkerDeploy:true,
    noBusinessPOST:true,noPush:true,noTrade:true};
}
