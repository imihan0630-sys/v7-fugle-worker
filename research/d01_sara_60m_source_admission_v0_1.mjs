// D01 Sara 60-minute physical-source admission; Class A, no fetch/market scan or outcomes.
const BLOCK=(reason,extra={})=>({state:"SOURCE_BLOCKED",reason,...extra});
const dateOk=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+"T00:00:00+08:00"));
export function validateRequest(q){
 if(!q||q.timeframe!=="60")return BLOCK("NOT_60_MINUTES");
 if(!dateOk(q.from)||!dateOk(q.to)||q.from>q.to)return BLOCK("DATE_RANGE_INVALID");
 if(q.from<"2023-05-23")return BLOCK("MINUTE_HISTORY_BEGINS_2023_05_23");
 const from=Date.parse(q.from+"T00:00:00+08:00"),to=Date.parse(q.to+"T00:00:00+08:00");
 if(to-from>=365*86400000)return BLOCK("REQUEST_RANGE_ONE_YEAR_OR_MORE");
 if(q.adjusted!==undefined)return BLOCK("MINUTE_ADJUSTED_NOT_DOCUMENTED");
 if(!/^\d{4,6}$/.test(q.symbol||""))return BLOCK("SYMBOL_INVALID");
 return {state:"REQUEST_VALID",route:"/historical/candles/"+q.symbol,timeframe:"60",
   minSourceDate:"2023-05-23",minuteAdjustedSupported:false};
}
export function validatePayload(payload,owner){
 if(!owner?.queryReceiptId||!owner?.queryHash)return BLOCK("OWNER_QUERY_PROVENANCE_MISSING");
 if(owner?.containsActualRows!==true||!payload||!Array.isArray(payload.data))
   return BLOCK("CONNECTOR_CONTENT_ID_ONLY_NOT_ROWS");
 if(payload.timeframe!=="60"||payload.symbol!==owner.symbol||payload.exchange!==owner.exchange)
   return BLOCK("PAYLOAD_IDENTITY_OR_PERIOD_CONFLICT");
 if(payload.data.length===0)return BLOCK("EMPTY_DATA_NOT_COVERAGE_PROOF");
 if(owner.bucketTimestampSemantics!=="OPEN"&&owner.bucketTimestampSemantics!=="END")
   return BLOCK("BAR_TIMESTAMP_MEANING_UNVERIFIED");
 if(owner.bucketEndReceiptVerified!==true||owner.sessionCalendarVerified!==true)
   return BLOCK("BUCKET_END_OR_SESSION_NOT_VERIFIED");
 if(owner.rawPriceSpaceCertified!==true)return BLOCK("RAW_PRICE_SPACE_NOT_CERTIFIED");
 if(owner.corporateActionCoverageCertified!==true)return BLOCK("CORPORATE_ACTION_CONTINUITY_UNKNOWN");
 if(owner.volumeUnit!=="LOTS"&&owner.volumeUnit!=="SHARES")
   return BLOCK("VOLUME_UNIT_UNKNOWN");
 if(owner.exchange==="TWSE"||owner.exchange==="TPEX"){
   if(owner.instrumentClass==="ORDINARY_COMMON"&&owner.volumeUnit!=="LOTS")
      return BLOCK("MINUTE_COMMON_STOCK_VOLUME_IS_LOTS");
 }
 let prev=-Infinity;
 for(const b of payload.data){
   const ts=Date.parse(b.date);
   if(!/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(b.date)||!Number.isFinite(ts)||ts<=prev)
      return BLOCK("BAR_DATE_TZ_ORDER_OR_DUPLICATE");
   if(![b.open,b.high,b.low,b.close].every(v=>Number.isFinite(v)&&v>0)||
     b.low>Math.min(b.open,b.close)||b.high<Math.max(b.open,b.close)||b.high<b.low)
      return BLOCK("BAR_OHLC_INVALID");
   if(!Number.isFinite(b.volume)||b.volume<0)return BLOCK("BAR_VOLUME_INVALID");
   const end=Date.parse(b.certifiedEndAt),known=Date.parse(b.firstKnownAt);
   if(!Number.isFinite(end)||!Number.isFinite(known)||known<end)
      return BLOCK("BAR_END_OR_FIRST_KNOWN_UNVERIFIED");
   if(b.bucketOwnerReceiptId!==owner.bucketReceiptId)return BLOCK("BAR_BUCKET_OWNER_MISMATCH");
   if(b.sourceRevisionId===undefined||b.sourceRevisionId===null)
      return BLOCK("BAR_REVISION_UNKNOWN");
   prev=ts;
 }
 return {state:"PHYSICAL_SOURCE_ADMISSIBLE",symbol:owner.symbol,count:payload.data.length,
   sourceRoot:owner.queryHash,knownAtBound:true,priceSpace:"RAW_EXECUTION",
   adjustment: "INTRADAY_RAW_WITH_SEPARATE_CORPORATE_ACTIONS",
   volumeUnit:owner.volumeUnit};
}
export function validateDecisionPrefix(payload,decisionAt){
 const t=Date.parse(decisionAt);
 if(!Number.isFinite(t)||!Array.isArray(payload?.data))return BLOCK("DECISION_OR_DATA_MISSING");
 const rows=[];
 for(const b of payload.data){
   const end=Date.parse(b.certifiedEndAt),known=Date.parse(b.firstKnownAt);
   if(!Number.isFinite(end)||!Number.isFinite(known))return BLOCK("PIT_TIMESTAMP_UNVERIFIED");
   if(end<=t&&known<=t)rows.push(b);
   if(end<=t&&known>t)return BLOCK("RETROSPECTIVE_REVISION_NOT_AVAILABLE_AT_DECISION");
 }
 return rows.length>=245
   ?{state:"PREFIX_READY",observedCompletedBars:rows.length,asOf:decisionAt}
   :BLOCK("PREFIX_WARMUP_INSUFFICIENT",{observedCompletedBars:rows.length});
}
