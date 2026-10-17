// System1 P0 postclose notification contract, pure/offline only.
// No Worker, D1, KV, Cron, webhook or trade I/O in this module.
const DATE=/^\d{4}-\d{2}-\d{2}$/;
const safeText=x=>String(x??"").replace(/[<>]/g,"").slice(0,140);
const confirmedDate=date=>DATE.test(String(date))&&
  !Number.isNaN(Date.parse(date+"T00:00:00Z"))&&
  new Date(date+"T00:00:00Z").toISOString().slice(0,10)===date;
const states=Object.freeze({
  SELECTED:"VERIFIED_SELECTION",
  ZERO:"VERIFIED_ZERO",
  ERROR:"POSTCLOSE_FAILED_OR_INCOMPLETE",
  UNKNOWN:"POSTCLOSE_STATUS_UNVERIFIED"
});
const noParentReasons=new Set([
 "FORMAL_SCAN_NOT_SAVED_AFTER_READY_SOURCES","FORMAL_SCAN_NOT_SAVED_SOURCE_UNVERIFIED",
 "FORMAL_SCAN_STALE_DATE","FORMAL_SCAN_NOT_COMPLETE",
 "PRIMARY_MONITOR_KV_NOT_VERIFIED","DAILY_SELECTION_REPORT_NOT_SENT",
 "DAILY_SELECTION_SIGNAL_ID_NOT_VERIFIED","DAILY_SELECTION_OUTBOX_NOT_ACCEPTED"
]);
export function classifyPostcloseNotice({targetDate,chain,attempt=null}={}){
 if(!confirmedDate(targetDate))throw Error("EXACT_MARKET_DATE_REQUIRED");
 const category=String(chain?.category||"GET_CHAIN_UNVERIFIED");
 const count=chain?.formalSelectedCount;
 const authenticated=chain?.formalSelectionAuthenticated===true&&
  chain?.primaryMonitorReadbackVerified===true&&chain?.formalScanDate===targetDate;
 const validCount=Number.isSafeInteger(count)&&count>=0&&count<=6;
 // Positive or 0 formal state must be backed by exact formal/KV equality;
 // an orphan outbox, old plan, empty monitor or status=SUCCESS alone never suffices.
 const formalComplete=authenticated&&validCount&&chain?.sourcesReady===true&&
  !["GET_READ_ERROR","FORMAL_SCAN_STALE_DATE","FORMAL_SCAN_NOT_COMPLETE",
    "FORMAL_SCAN_NOT_SAVED_AFTER_READY_SOURCES",
    "FORMAL_SCAN_NOT_SAVED_SOURCE_UNVERIFIED",
    "PRIMARY_MONITOR_KV_NOT_VERIFIED"].includes(category);
 const outboxAccepted=chain?.dailyReportOutboxAccepted===true;
 const upstreamFailure=attempt?.status==="FAILED"&&attempt?.requestedDate===targetDate;
 const sourceIncomplete=chain?.sourcesReady!==true;
 let kind=states.UNKNOWN;
 if(upstreamFailure||noParentReasons.has(category)||chain?.ok===false)
   kind=states.ERROR;
 if(formalComplete&&!upstreamFailure)
   kind=count===0?states.ZERO:states.SELECTED;
 if(category==="GET_READ_ERROR"||Object.keys(chain?.readErrors||{}).length>0||
   !chain||chain.targetDate!==targetDate)
   kind=states.UNKNOWN;
 // A read error must never be mistaken for a confirmed 0 or actual failed scan.
 const originalSuccessOutbox=kind===states.SELECTED||kind===states.ZERO
   ? outboxAccepted&&chain?.ok===true:false;
 const shouldSendBackup=!originalSuccessOutbox;
 const key="SYSTEM1_POSTCLOSE_STATUS:"+targetDate;
 const detail=kind===states.ZERO?
  "已確認正式盤後選股 0 檔；不強制湊股，維持現金。":
  kind===states.SELECTED?
  "正式盤後選股已驗證 "+count+" 檔；原始每日結果送達仍需獨立驗收。":
  kind===states.ERROR?
  "盤後選股未完成或鏈路未驗證成功；不是 0 檔，保留既有計畫。":
  "盤後狀態無法驗證；不是 0 檔，禁止沿用舊資料當作今日新推薦。";
 const title=kind===states.ZERO?"✅ V7盤後選股｜確認0檔":
  kind===states.SELECTED?"📋 V7盤後選股｜已確認 "+count+" 檔":
  kind===states.ERROR?"⚠️ V7盤後選股異常｜未完成":
   "⚠️ V7盤後狀態無法確認";
 return {schema:"SYSTEM1_P0_POSTCLOSE_NOTICE_V0_1",targetDate,signalId:key,
   kind,shouldSendBackup,suppressionReason:originalSuccessOutbox?
   "ORIGINAL_DAILY_OUTBOX_ACCEPTED_NOT_HANDSET_PROOF":null,
   title,message:[detail,
     sourceIncomplete&&kind===states.ERROR?"資料來源完整性：未驗證。":null,
     "狀態代碼："+safeText(category),
     "不改動持倉、停損、資金、原計畫，亦不重新選股或重送原交易訊號。",
     "本通知是狀態回報，不是進場建議。"].filter(Boolean).join("\n"),
   actualZeroProven:kind===states.ZERO,
   originalSuccessOutboxAccepted:originalSuccessOutbox,
   phoneReceiptProven:false,backupWebhookReceiptProven:false,
   noPriorDayReplay:true,noBusinessPOST:true,noD1Write:true,
   noKVWrite:true,noWorkerChange:true,noPlanMutation:true,noTrade:true};
}
