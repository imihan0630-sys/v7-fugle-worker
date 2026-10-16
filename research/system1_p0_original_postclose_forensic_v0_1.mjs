// P0 read-only historic Formal incident classifier. No credentials or runtime writes.
// Preserve uncertainty: D1 /api/cron/status only exposes 20 newest rows, so an old
// missing 23:35 row is NOT proof that the original Cron never ran.
const ymd=s=>/^20\d{2}-\d{2}-\d{2}$/.test(String(s||"")) && new Date(String(s)+"T00:00:00Z").toISOString().slice(0,10)===s;
const isoDate=row=>String(row?.scheduled_at||row?.scheduledAt||"").slice(0,10);
export function classifySystem1OriginalPostclose({date,observedAt,version=null,cron=null,scan=null,
  recommendations=null,config=null,quality=null,marketData=null,outbox=null,overview=null,errors={}}={}){
  if(!ymd(date))throw Error("INVALID_ORIGINAL_DATE");
  const officialCron=(cron?.recent||[]).filter(x=>x?.job_type==="AFTER_MARKET_SCAN" && isoDate(x)===date);
  const observedFormalCron=officialCron.map(x=>({
    scheduledAt:x.scheduled_at||null,status:x.status||null,
    errorClass:/DATA_INCOMPLETE/.test(String(x.error||""))?"PRECOMMIT_DATA_INCOMPLETE":
      /exceededResources|CPU/i.test(String(x.error||""))?"CPU_LIMIT":
      x.error?"OTHER_OR_UNCLASSIFIED":"NONE",
    id:Number.isInteger(x.id)?x.id:null
  }));
  const recent=Array.isArray(cron?.recent)?cron.recent:[];
  const priorWindowExhausted=recent.length>=20 && observedFormalCron.length===0;
  const attempted=recommendations?.attempt||null;
  const attemptStatus=attempted?.requestedDate===date?attempted.status||"UNKNOWN":"NO_SAME_DATE_ATTEMPT_VISIBLE";
  const stocks=Array.isArray(config?.stocks)?config.stocks:[];
  const selected=Number.isInteger(scan?.selectedCount)?scan.selectedCount:null;
  const scanCompleted=scan?.scanDate===date&&scan?.dryRun===false&&
    scan?.config?.verified===true&&selected!==null&&selected>=0&&selected<=6&&
    Array.isArray(scan?.stocks)&&scan.stocks.length===selected;
  const kvMatches=scanCompleted && config?.source==="KV"&&
    config?.updatedAt===scan.config.updatedAt&&stocks.length===selected &&
    scan.stocks.every(expected=>stocks.some(x=>String(x.symbol)===String(expected.symbol)));
  const signalId="DAILY_SELECTION:"+date;
  const pushRows=Array.isArray(outbox?.recent)?outbox.recent.filter(x=>x.signal_id===signalId):[];
  const orphanPush=outbox?.configured===true&&pushRows.length===1&&
    pushRows[0]?.delivery_state==="ACCEPTED"&&!scanCompleted;
  const pushAccepted=outbox?.configured===true&&outbox?.readError!==true&&pushRows.length===1&&
    pushRows[0]?.delivery_state==="ACCEPTED"&&scan?.dailyReport?.signalId===signalId&&
    scan?.dailyReport?.sent===true&&scan?.dailyReport?.simulated===false;
  const kinds=["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"];
  const qualityReady=quality?.marketDate===date&&quality?.index?.ready===true&&quality?.tdcc?.ready===true&&
    kinds.every(k=>quality?.datasets?.[k]?.ready===true);
  const getErrors=Object.fromEntries(Object.entries(errors).map(([key,value])=>[key,String(value).slice(0,30)]));
  let verdict="P0_FORMAL_CHAIN_NOT_PROVEN";
  if(Object.keys(getErrors).length)verdict="GET_READBACK_INCOMPLETE";
  else if(scanCompleted&&kvMatches&&pushAccepted)verdict="FORMAL_PRIMARY_KV_AND_PUSH_ACCEPTED_NOT_HANDSET";
  else if(scanCompleted&&!kvMatches)verdict="FORMAL_SAVED_BUT_PRIMARY_KV_MISMATCH";
  else if(scanCompleted&&!pushAccepted)verdict="FORMAL_SAVED_BUT_DAILY_PUSH_UNVERIFIED";
  else if(orphanPush)verdict="DAILY_OUTBOX_ACCEPTED_WITHOUT_FORMAL_RECORD";
  else if(attemptStatus==="FAILED")verdict="ORIGINAL_FORMAL_LAST_ATTEMPT_FAILED";
  else if(config?.updatedAt&&!scanCompleted&&stocks.length===0)verdict="EMPTY_PRIMARY_KV_WITHOUT_CONFIRMED_FORMAL";
  else if(!scanCompleted)verdict="FORMAL_SCAN_MISSING_OR_UNVERIFIED";
  return {
    schema:"S1_P0_ORIGINAL_POSTCLOSE_GET_FORENSIC_V0_2",
    date,observedAt:observedAt||null,verdict,complete:verdict==="FORMAL_PRIMARY_KV_AND_PUSH_ACCEPTED_NOT_HANDSET",
    version:version?.version||overview?.version||null,workerCronExpected:cron?.expected||null,
    actualCron:{observedFormalCron,visibleRows:recent.length,
      mostRecent:recent[0]?.scheduled_at||null,oldestVisible:recent.at(-1)?.scheduled_at||null,
      previousSessionEvictedFromLast20:priorWindowExhausted,
      previousSessionCronExecutionProven:observedFormalCron.length>0,
      causeEstablished:observedFormalCron.some(x=>x.errorClass==="PRECOMMIT_DATA_INCOMPLETE"||x.errorClass==="CPU_LIMIT")},
    sourceMarket:{marketDate:marketData?.marketDate||null,
      ready:marketData?.marketDate===date&&marketData?.ready===true,
      TWSE:marketData?.markets?.TWSE?.count??null,TPEx:marketData?.markets?.TPEx?.count??null},
    sourceQuality:{marketDate:quality?.marketDate||null,ready:qualityReady,
      missing:kinds.filter(k=>quality?.datasets?.[k]?.ready!==true),
      quarterEpsCount:quality?.datasets?.QUARTER_EPS?.count??null},
    formal:{scanDate:scan?.scanDate||null,selectedCount:selected,scanCompleted,
      attemptedDate:attempted?.requestedDate||null,attemptStatus,
      attemptGeneratedAt:attempted?.generatedAt||null},
    monitor:{source:config?.source||null,stockCount:stocks.length,
      updatedAt:config?.updatedAt||null,exactSymbolParity:kvMatches===true,
      latestPlanDate:overview?.latestPlan?.scanDate||null},
    dailyPush:{exactSignalId:signalId,matchedOutboxRows:pushRows.length,
      outboxDeliveryState:pushRows[0]?.delivery_state||null,
      outboxSignalType:pushRows[0]?.signal_type||null,
      outboxCreatedAt:pushRows[0]?.created_at||null,
      outboxUpdatedAt:pushRows[0]?.updated_at||null,
      outboxAcceptedAt:pushRows[0]?.accepted_at||null,
      outboxHttpStatus:pushRows[0]?.http_status??null,
      accepted:pushAccepted,acceptedWithoutFormalRecord:orphanPush===true,
      phoneReceiptProven:false},
    readErrors:getErrors,diagnosticOnly:true,zeroSelectionNotInferred:!scanCompleted,
    noBusinessPOST:true,noWorkerWrite:true,noD1Write:true,noKVWrite:true,noPush:true,noTrade:true
  };
}
