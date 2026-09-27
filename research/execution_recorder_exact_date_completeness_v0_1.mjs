// B-145 exact-date recorder completeness — proposal classifier only.
// Pure Class-A test artifact describing a future Class-B runtime contract.
// No Worker import, no network, no storage write.

function txt(v){return String(v??"").trim()}
function int(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isInteger(x)&&x>=0?x:null}

export function classifyExactDateRecorderCompleteness(query={},receipts=[]){
  const requested=txt(query.requestedTradeDate);
  const total=int(query.totalMatchingRows);
  const returned=int(query.returnedRows);
  const hasMore=typeof query.hasMore==="boolean"?query.hasMore:null;
  const truncated=typeof query.truncated==="boolean"?query.truncated:null;
  const pageComplete=query.paginationComplete===true;
  const perEvent=query.perEventCounts&&typeof query.perEventCounts==="object"?query.perEventCounts:null;
  const perSymbol=query.perSymbolCounts&&typeof query.perSymbolCounts==="object"?query.perSymbolCounts:null;

  const reasons=[];
  if(!/^\d{4}-\d{2}-\d{2}$/.test(requested)) reasons.push("REQUESTED_TRADE_DATE_REQUIRED");
  if(total===null||returned===null) reasons.push("ROW_COUNTS_REQUIRED");
  if(hasMore===null||truncated===null) reasons.push("TRUNCATION_STATE_REQUIRED");
  if(!perEvent||!perSymbol) reasons.push("PER_EVENT_AND_SYMBOL_COUNTS_REQUIRED");
  if(total!==null&&returned!==null&&returned>total) reasons.push("RETURNED_EXCEEDS_TOTAL");
  if(pageComplete&&hasMore===true) reasons.push("PAGINATION_CONTRADICTION");
  if(pageComplete&&truncated===true) reasons.push("PAGINATION_CONTRADICTION");
  if(pageComplete&&total!==null&&returned!==null&&returned!==total) reasons.push("PAGINATION_TOTAL_MISMATCH");

  const sameDateReceipts=(receipts||[]).filter(r=>txt(r?.tradeDate)===requested);
  const receiptProblems=[];
  let expectedPairs=0,attempted=0,stored=0,skipped=0;
  for(const r of sameDateReceipts){
    const symbols=Array.isArray(r?.expectedSymbols)?[...new Set(r.expectedSymbols.map(txt).filter(Boolean))]:null;
    const events=Array.isArray(r?.expectedEventTypes)?[...new Set(r.expectedEventTypes.map(txt).filter(Boolean))]:null;
    const a=int(r?.attemptedCount),s=int(r?.storedCount),k=int(r?.skippedCount);
    if(!txt(r?.runId)||!Number.isFinite(Number(r?.scheduledTime))||!txt(r?.recordedAt)) receiptProblems.push("RECEIPT_IDENTITY_INCOMPLETE");
    if(!symbols||!events) receiptProblems.push("RECEIPT_EXPECTED_SET_MISSING");
    if(a===null||s===null||k===null) receiptProblems.push("RECEIPT_COUNTS_MISSING");
    if(r?.failOpen===true||txt(r?.errorClass)) receiptProblems.push("RECORDER_FAIL_OPEN_OR_ERROR");
    if(symbols&&events) expectedPairs+=symbols.length*events.length;
    if(a!==null) attempted+=a;if(s!==null) stored+=s;if(k!==null) skipped+=k;
  }

  const rowContractReady=reasons.length===0&&pageComplete&&hasMore===false&&truncated===false;
  const receiptsExist=sameDateReceipts.length>0;
  const receiptContractReady=receiptsExist&&receiptProblems.length===0&&attempted===expectedPairs&&stored+skipped===attempted;

  if(total===0&&rowContractReady&&receiptContractReady&&expectedPairs===0){
    return {status:"COMPLETE_NO_EVENT_EXPECTED",complete:true,noBuyEligible:false,reasons:[],expectedPairs,totalMatchingRows:0};
  }

  if(rowContractReady&&receiptContractReady&&stored===total){
    return {
      status:"COMPLETE",complete:true,noBuyEligible:true,reasons:[],
      expectedPairs,attempted,stored,skipped,totalMatchingRows:total,
      caveat:"Completeness makes row absence interpretable only for events the frozen expected-event contract says should have been recordable. It does not convert signal price into fill evidence."
    };
  }

  const all=[...reasons,...receiptProblems];
  if(!pageComplete||hasMore===true||truncated===true) all.push("PAGINATION_NOT_COMPLETE");
  if(!receiptsExist) all.push("RUN_RECEIPT_MISSING");
  if(receiptsExist&&attempted!==expectedPairs) all.push("ATTEMPTED_COUNT_MISMATCH");
  if(receiptsExist&&stored+skipped!==attempted) all.push("STORED_SKIPPED_COUNT_MISMATCH");
  if(total!==null&&stored!==total&&receiptContractReady) all.push("ROW_RECEIPT_COUNT_MISMATCH");
  return {status:all.includes("RECORDER_FAIL_OPEN_OR_ERROR")?"INCOMPLETE":"UNKNOWN",complete:false,noBuyEligible:false,reasons:[...new Set(all)],expectedPairs,totalMatchingRows:total};
}
