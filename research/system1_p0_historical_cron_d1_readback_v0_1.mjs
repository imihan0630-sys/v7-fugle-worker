// System 1 P0: fixed historical slot, D1 SELECT-only incident witness.
// Classifier is pure and never infers invocation absence from missing audit rows.
export const TARGET_DATE="2026-10-15";
export const WINDOW_START="2026-10-15T15:30:00.000Z";
export const WINDOW_END="2026-10-15T16:06:00.000Z";
export const LEASE_KEY="V7_AFTER_MARKET_LEASE:2026-10-15";
export const CRON_SELECT="SELECT id,cron_expression,scheduled_time,scheduled_at,started_at,finished_at,job_type,status,skipped,detail,error FROM v7_cron_runs WHERE scheduled_at>=?1 AND scheduled_at<?2 AND job_type='AFTER_MARKET_SCAN' ORDER BY scheduled_at ASC LIMIT 10";
export const LEASE_SELECT="SELECT state_key,updated_at,snapshot_json FROM v7_signal_delivery_state WHERE state_key=?1 LIMIT 1";
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
  const lease=safeLease(leaseRows);
  const buckets=new Map(SLOTS.map(s=>[s,[]]));
  let invalid=0;
  for(const row of cronRows){
    const utc=Date.parse(String(row?.scheduled_at||""));
    const time=Number.isFinite(utc)?new Date(utc).toISOString().slice(0,16):"";
    const expression=String(row?.cron_expression||"").toLowerCase().replace(/\s+/g," ").trim();
    if(row?.job_type!=="AFTER_MARKET_SCAN"||!buckets.has(time)||
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
  if(anomalous)state="CRON_READBACK_INCONSISTENT_FAIL_CLOSED";
  else if(present)state="PERSISTED_CRON_AUDIT__FORMAL_PARENT_UNVERIFIED";
  else if(lease.present)state="LEASE_PRESENT__CRON_AUDIT_MISSING_OR_UNVERIFIED";
  return {schema:"S1_P0_HISTORIC_CRON_D1_SELECT_V0_1",date,observedAt,
    state,windowUtc:{start:WINDOW_START,end:WINDOW_END},
    expectedSlots:2,queriedCronRows:cronRows.length,invalidOrUnexpectedRows:invalid,
    slotEvidence,lease,
    scheduledInvocationsProven:false,
    // Persisted audit rows prove DB rows exist, not all original Cloudflare trigger deliveries.
    persistedAuditSlots:present,
    formalParentProven:false,kvReadbackProven:false,handsetReceiptProven:false,
    historicalCronAbsenceProven:false,quotaRootCauseGloballyProven:false,
    queryOnly:true,noD1Write:true,noKVWrite:true,noWorkerDeploy:true,
    noBusinessPOST:true,noPush:true,noTrade:true};
}
