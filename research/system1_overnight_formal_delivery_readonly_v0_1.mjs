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
export function classifyPostcloseBusinessChain({targetDate,scanStatus=null,institution=null,quality=null,outbox=null,readErrors={}}={}){
  if(!dayPattern.test(String(targetDate||""))||new Date(targetDate+"T00:00:00Z").toISOString().slice(0,10)!==targetDate)
    throw Error("ORIGINAL_SESSION_DATE_REQUIRED");
  const qualityKinds=["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"];
  const qualityReady=quality?.marketDate===targetDate && quality?.index?.ready===true &&
    quality?.tdcc?.ready===true && qualityKinds.every(k=>quality?.datasets?.[k]?.ready===true);
  const institutionReady=institution?.marketDate===targetDate&&institution?.ready===true;
  const sourcesReady=qualityReady&&institutionReady;
  const scanDate=scanStatus?.scanDate||null;
  const selected=Number.isInteger(scanStatus?.selectedCount)?scanStatus.selectedCount:null;
  const pipelineComplete=scanStatus?.pipeline?.complete===true;
  const simulationRejected=scanStatus?.dryRun!==true && scanStatus?.testMode!==true;
  const matchesSelected=selected!==null&&selected>=0&&Array.isArray(scanStatus?.stocks)&&selected===scanStatus.stocks.length;
  const hasBridge=scanStatus?.pipeline?.externalPlanVerified===true||
    scanStatus?.planBridge?.github?.verified===true||
    scanStatus?.planBridge?.firebase?.verified===true||
    scanStatus?.threeMin?.verified===true;
  const pushed=scanStatus?.dailyReport?.sent===true&&scanStatus?.dailyReport?.simulated!==true;
  const expectedSignalId=`DAILY_SELECTION:${targetDate}`;
  const outboxAccepted=Array.isArray(outbox?.recent) &&
    outbox.recent.some(row=>String(row?.signal_id)===expectedSignalId&&row?.delivery_state==="ACCEPTED");
  let category="GET_CHAIN_UNVERIFIED";
  if(Object.keys(readErrors).length) category="GET_READ_ERROR";
  else if(!scanDate) category=sourcesReady?"FORMAL_SCAN_NOT_SAVED_AFTER_READY_SOURCES":"FORMAL_SCAN_NOT_SAVED_SOURCE_UNVERIFIED";
  else if(scanDate!==targetDate) category="FORMAL_SCAN_STALE_DATE";
  else if(!pipelineComplete||!simulationRejected||!matchesSelected) category="FORMAL_SCAN_NOT_COMPLETE";
  else if(selected>0&&!hasBridge) category="EXTERNAL_MONITOR_PLAN_NOT_VERIFIED";
  else if(!pushed) category="DAILY_SELECTION_REPORT_NOT_SENT";
  else if(!outboxAccepted) category="DAILY_SELECTION_OUTBOX_NOT_ACCEPTED";
  else category="POSTCLOSE_GET_CHAIN_CONFIRMED_NOT_HANDSET_RECEIPT";
  return {schema:"S1_P0_OVERNIGHT_FORMAL_DELIVERY_GET_ONLY_V0_1",targetDate,
    category,ok:category==="POSTCLOSE_GET_CHAIN_CONFIRMED_NOT_HANDSET_RECEIPT",
    qualityReady,institutionReady,sourcesReady,
    formalScanDate:scanDate,formalPipelineComplete:pipelineComplete,
    formalSelectedCount:selected,formalSelectionAuthenticated:scanDate===targetDate&&pipelineComplete&&simulationRejected&&matchesSelected,
    externalPlanReadbackVerified:selected>0&&hasBridge,
    dailyReportApiAccepted:pushed,dailyReportOutboxAccepted:outboxAccepted,
    handsetReceiptVerified:false,
    missingDataKinds:qualityKinds.filter(k=>quality?.datasets?.[k]?.ready!==true),
    readErrors:Object.fromEntries(Object.entries(readErrors).map(([k,v])=>[k,String(v).slice(0,60)])),
    mayCountAsZeroPicks:scanDate===targetDate&&pipelineComplete&&selected===0&&matchesSelected,
    mayRetryAmbiguousPost:false,readOnly:true,noBusinessPOST:true,
    noWorkerWrite:true,noD1Write:true,noKVWrite:true,no3MinWrite:true,noPush:true,noTrade:true};
}
