// System1 P0 after-close read-only operational verdict.
// No live scan, plan mutation, trading or delivery: proof means only GET evidence.
const dayPattern=/^\d{4}-\d{2}-\d{2}$/;
const taipeiParts=now=>{
  const t=now instanceof Date?now:new Date(now);
  if(Number.isNaN(t.getTime()))throw Error("INVALID_TAIPEI_TIME");
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",
    year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t);
  const p=name=>parts.find(x=>x.type===name)?.value;
  return {date:`${p("year")}-${p("month")}-${p("day")}`,time:`${p("hour")}:${p("minute")}`};
};
export function resolveScheduledPostcloseTarget(now=new Date()){
  const {date,time}=taipeiParts(now);
  // Existing GitHub 23:55 Taipei nominal after-market health check.
  // GitHub can delay this to early next morning; never accidentally inspect
  // that new day's incomplete market session or claim a green skip.
  if(time>="23:55")return {status:"EXACT_SAME_EVENING",targetDate:date,localDate:date,localTime:time};
  if(time<"07:00"){
    const yesterday=new Date(Date.parse(date+"T12:00:00Z")-86400000).toISOString().slice(0,10);
    return {status:"FROZEN_PRIOR_CALENDAR_DAY_READONLY",targetDate:yesterday,localDate:date,localTime:time};
  }
  return {status:"POSTCLOSE_DATE_UNRESOLVED_FAIL_CLOSED",targetDate:null,localDate:date,localTime:time};
}
// GitHub scheduled official source sync may finish *after* the original
// Worker 23:35 selection Cron. This date resolver is for the subsequent
// source-complete workflow_run, NEVER authorization for a business POST.
export function resolveSourceReadyHandoffTarget(now=new Date()){
  const {date,time}=taipeiParts(now);
  if(time>="23:35")
    return {status:"SAME_EVENING_SOURCE_COMPLETE_GET_ONLY",targetDate:date,localDate:date,localTime:time};
  if(time>="18:10")
    return {status:"SOURCE_COMPLETED_BEFORE_FORMAL_DUE",targetDate:null,localDate:date,localTime:time};
  if(time<"07:00"){
    const prior=new Date(Date.parse(date+"T12:00:00Z")-86400000).toISOString().slice(0,10);
    return {status:"DELAYED_PRIOR_SOURCE_COMPLETE_GET_ONLY",targetDate:prior,localDate:date,localTime:time};
  }
  return {status:"SOURCE_COMPLETE_CLOCK_UNPROVABLE_NO_POST",targetDate:null,localDate:date,localTime:time};
}

// Validate the genuine Formal -> PRIMARY monitoring KV -> D1 push outbox.
// Optional 3Min/GitHub mirror failure cannot turn a good primary result red;
// conversely a generic pipeline flag cannot replace physical KV readback.
export function classifyPostcloseBusinessChain({targetDate,scanStatus=null,monitor=null,institution=null,quality=null,outbox=null,readErrors={}}={}){
  if(!dayPattern.test(String(targetDate||""))||new Date(targetDate+"T00:00:00Z").toISOString().slice(0,10)!==targetDate)
    throw Error("ORIGINAL_SESSION_DATE_REQUIRED");
  const qualityKinds=["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"];
  const qualityReady=quality?.marketDate===targetDate&&quality?.index?.ready===true&&
    quality?.tdcc?.ready===true&&qualityKinds.every(k=>quality?.datasets?.[k]?.ready===true);
  const institutionReady=institution?.marketDate===targetDate&&institution?.ready===true;
  const sourcesReady=qualityReady&&institutionReady;
  const scanDate=scanStatus?.scanDate||null;
  const selected=Number.isInteger(scanStatus?.selectedCount)?scanStatus.selectedCount:null;
  const stocks=Array.isArray(scanStatus?.stocks)?scanStatus.stocks:null;
  const ids=stocks?.map(x=>String(x?.symbol||""))||[];
  const selectedValid=selected!==null&&selected>=0&&selected<=6&&stocks?.length===selected&&
    ids.every(id=>/^\d{4}$/.test(id))&&new Set(ids).size===ids.length;
  const formalSaved=scanDate===targetDate&&scanStatus?.dryRun===false&&
    scanStatus?.testMode!==true&&scanStatus?.config?.verified===true&&
    !!scanStatus?.config?.updatedAt&&selectedValid;
  const keys=["symbol","planDate","positionStage","formalClose","buyLow","buyHigh",
    "breakout","stop","profitCheck","allocationRatio","totalAllocation",
    "firstAmount","secondAmount","firstShares","secondShares","totalShares"];
  const primaryMonitorExact=formalSaved&&monitor?.source==="KV"&&
    monitor?.updatedAt===scanStatus?.config?.updatedAt&&Array.isArray(monitor?.stocks)&&
    monitor.stocks.length===selected&&(()=>{
      const byId=new Map(monitor.stocks.map(x=>[String(x?.symbol||""),x]));
      if(byId.size!==selected)return false;
      return stocks.every(expected=>{
        const actual=byId.get(String(expected.symbol));
        return actual&&keys.every(key=>!Object.prototype.hasOwnProperty.call(expected,key)||
          JSON.stringify(expected[key])===JSON.stringify(actual[key]));
      });
    })();
  const pushed=scanStatus?.dailyReport?.sent===true&&scanStatus?.dailyReport?.simulated===false;
  const expectedSignalId=`DAILY_SELECTION:${targetDate}`;
  const hasDailySignal=scanStatus?.dailyReport?.signalId===expectedSignalId;
  const acceptedRows=Array.isArray(outbox?.recent)?
    outbox.recent.filter(row=>String(row?.signal_id||"")===expectedSignalId):[];
  const outboxAccepted=outbox?.configured===true&&outbox?.readError!==true&&
    acceptedRows.length===1&&acceptedRows[0]?.delivery_state==="ACCEPTED"&&hasDailySignal;
  let category="GET_CHAIN_UNVERIFIED";
  if(Object.keys(readErrors).length)category="GET_READ_ERROR";
  else if(!scanDate)category=sourcesReady?"FORMAL_SCAN_NOT_SAVED_AFTER_READY_SOURCES":"FORMAL_SCAN_NOT_SAVED_SOURCE_UNVERIFIED";
  else if(scanDate!==targetDate)category="FORMAL_SCAN_STALE_DATE";
  else if(!formalSaved)category="FORMAL_SCAN_NOT_COMPLETE";
  else if(!primaryMonitorExact)category="PRIMARY_MONITOR_KV_NOT_VERIFIED";
  else if(!pushed)category="DAILY_SELECTION_REPORT_NOT_SENT";
  else if(!hasDailySignal)category="DAILY_SELECTION_SIGNAL_ID_NOT_VERIFIED";
  else if(!outboxAccepted)category="DAILY_SELECTION_OUTBOX_NOT_ACCEPTED";
  else category="POSTCLOSE_PRIMARY_MONITOR_AND_DAILY_OUTBOX_ACCEPTED_NOT_HANDSET_RECEIPT";
  return {schema:"S1_P0_OVERNIGHT_FORMAL_DELIVERY_GET_ONLY_V0_2",targetDate,
    category,ok:category==="POSTCLOSE_PRIMARY_MONITOR_AND_DAILY_OUTBOX_ACCEPTED_NOT_HANDSET_RECEIPT",
    qualityReady,institutionReady,sourcesReady,
    formalScanDate:scanDate,formalPipelineComplete:scanStatus?.pipeline?.complete===true,
    formalSelectedCount:selected,formalSelectionAuthenticated:formalSaved,
    primaryMonitorReadbackVerified:primaryMonitorExact===true,
    optionalThreeMinVerified:scanStatus?.threeMin?.verified===true,
    dailyReportApiAccepted:pushed,dailyReportOutboxAccepted:outboxAccepted,
    handsetReceiptVerified:false,
    missingDataKinds:qualityKinds.filter(k=>quality?.datasets?.[k]?.ready!==true),
    readErrors:Object.fromEntries(Object.entries(readErrors).map(([k,v])=>[k,String(v).slice(0,60)])),
    mayCountAsZeroPicks:formalSaved&&selected===0,
    mayRetryAmbiguousPost:false,readOnly:true,noBusinessPOST:true,
    noWorkerWrite:true,noD1Write:true,noKVWrite:true,no3MinWrite:true,noPush:true,noTrade:true};
}
