// D01 DL-119~121 session attribution / timezone / nontrading oracle v0.1

const MARKET_TZ="Asia/Taipei";
const OFFSET_MINUTES=480;
const DATE_RE=/^\d{4}-\d{2}-\d{2}$/;

function validDate(x){
  if(!DATE_RE.test(String(x||"")))return false;
  const [y,m,d]=x.split("-").map(Number);
  const z=new Date(Date.UTC(y,m-1,d));
  return z.getUTCFullYear()===y&&z.getUTCMonth()===m-1&&z.getUTCDate()===d;
}

function explicitTimezone(ts){
  return typeof ts==="string" && /(Z|[+-]\d{2}:\d{2})$/.test(ts);
}

function taipeiDate(ts){
  const ms=Date.parse(ts);
  if(!Number.isFinite(ms))return null;
  const d=new Date(ms+OFFSET_MINUTES*60000);
  return [
    d.getUTCFullYear(),
    String(d.getUTCMonth()+1).padStart(2,"0"),
    String(d.getUTCDate()).padStart(2,"0")
  ].join("-");
}

export function deriveCanonicalMarketDate(input={}){
  const {
    marketTimezone,exchangeReportedMarketDate=null,eventTimestamp=null,
    timestampSemantic=null,providerBatchDate=null
  }=input;

  if(marketTimezone!==MARKET_TZ)
    return {status:"MARKET_DATE_BLOCKED",reason:"TIMEZONE_CONTRACT_MISMATCH"};

  if(exchangeReportedMarketDate!==null){
    if(!validDate(exchangeReportedMarketDate))
      return {status:"MARKET_DATE_BLOCKED",reason:"EXCHANGE_REPORTED_DATE_INVALID"};
    return {
      status:"MARKET_DATE_READY",
      marketDate:exchangeReportedMarketDate,
      basis:"EXCHANGE_REPORTED_MARKET_DATE",
      providerBatchDate:validDate(providerBatchDate)?providerBatchDate:null
    };
  }

  if(eventTimestamp!==null){
    if(!explicitTimezone(eventTimestamp))
      return {status:"MARKET_DATE_BLOCKED",reason:"TIMESTAMP_TIMEZONE_AMBIGUOUS"};
    if(!["TRADE_EVENT","SESSION_OBSERVATION"].includes(timestampSemantic))
      return {status:"MARKET_DATE_BLOCKED",reason:"TIMESTAMP_SEMANTIC_NOT_SESSION_SAFE"};
    const marketDate=taipeiDate(eventTimestamp);
    if(!marketDate)return {status:"MARKET_DATE_BLOCKED",reason:"TIMESTAMP_INVALID"};
    return {
      status:"MARKET_DATE_READY",
      marketDate,
      basis:"TIMESTAMP_DERIVED_MARKET_DATE",
      providerBatchDate:validDate(providerBatchDate)?providerBatchDate:null
    };
  }

  if(providerBatchDate!==null)
    return {status:"MARKET_DATE_BLOCKED",reason:"PROVIDER_BATCH_DATE_NOT_SESSION_DATE"};

  return {status:"MARKET_DATE_BLOCKED",reason:"NO_SESSION_DATE_EVIDENCE"};
}

export function classifySessionAttribution(s={}){
  if(s.exchangeCalendarKnown!==true)return {status:"UNKNOWN_BLOCKED",reason:"EXCHANGE_CALENDAR_UNKNOWN"};
  if(s.exchangeOpen!==true)return {status:"EXCHANGE_CLOSED"};
  if(s.symbolLifecycleKnown!==true)return {status:"UNKNOWN_BLOCKED",reason:"SYMBOL_LIFECYCLE_UNKNOWN"};
  if(s.suspensionKnown!==true)return {status:"UNKNOWN_BLOCKED",reason:"SUSPENSION_STATE_UNKNOWN"};

  if(s.symbolExpectedToTrade!==true || s.suspended===true)
    return {status:"SYMBOL_NOT_EXPECTED_TO_TRADE"};

  if(s.officialTradeObserved===true && s.rawRowPresent===true)
    return {status:"SYMBOL_TRADED"};
  if(s.officialTradeObserved===true && s.rawRowPresent!==true)
    return {status:"DATA_MISSING"};
  if(s.officialTradeObserved===false && s.rawRowPresent===true)
    return {status:"CONTRADICTION_BLOCKED"};
  if(s.officialTradeObserved===false && s.rawRowPresent===false)
    return {status:"SYMBOL_EXPECTED_NO_TRADE_CONFIRMED"};

  return {status:"UNKNOWN_BLOCKED",reason:"TRADE_STATUS_UNKNOWN"};
}

export function classifyAttributionRevision(oldA={},newA={}){
  const roots=[
    ["calendarAttributionRootId","OFFICIAL_CALENDAR_REVISION"],
    ["timezoneAttributionRootId","VENDOR_TIMEZONE_ATTRIBUTION_REVISION"],
    ["symbolLifecycleRootId","SYMBOL_LIFECYCLE_REVISION"],
    ["rawObservationRootId","RAW_DATA_PIPELINE_REVISION"],
    ["tradeStatusRootId","TRADE_STATUS_REVISION"]
  ];
  const changed=roots.filter(([k])=>(oldA[k]??null)!==(newA[k]??null));
  if(!changed.length)return {status:"IDENTICAL_ATTRIBUTION",changedRoots:[]};
  if(changed.length>1)return {status:"MULTI_ROOT_REVISION",changedRoots:changed.map(x=>x[0])};
  return {status:changed[0][1],changedRoots:[changed[0][0]]};
}

export function validateCommonSupport(a={},b={}){
  const fields=[
    "market","marketDate","marketTimezone","calendarAttributionRootId",
    "symbolLifecycleRootId","timezoneAttributionRootId","semanticSpace",
    "sourceVintageId","sourceHistoryHash"
  ];
  const drift=fields.filter(k=>(a[k]??null)!==(b[k]??null));
  return {status:drift.length?"COMMON_SUPPORT_MISMATCH":"COMMON_SUPPORT_VALID",drift};
}

export function classifyGapBridge(g={}){
  if(g.priorTraded!==true||g.currentTraded!==true)
    return {status:"GAP_ENDPOINTS_NOT_BOTH_TRADED"};
  if(g.attributionResolved!==true)
    return {status:"ATTRIBUTION_UNCERTAIN_INTERVAL"};

  const xs=Array.isArray(g.interveningStates)?g.interveningStates:[];
  if(!xs.length)return {status:"DIRECT_ADJACENT_TRADED_SESSIONS"};

  if(xs.some(x=>["DATA_MISSING","UNKNOWN_BLOCKED","CONTRADICTION_BLOCKED"].includes(x)))
    return {status:"DATA_MISSING_INTERVAL"};

  const uniq=new Set(xs);
  if(uniq.size===1&&uniq.has("EXCHANGE_CLOSED"))
    return {status:"MARKET_CLOSED_ONLY"};
  if(uniq.size===1&&uniq.has("SYMBOL_NOT_EXPECTED_TO_TRADE"))
    return {status:"SYMBOL_NOT_EXPECTED_TO_TRADE_INTERVAL"};
  if(uniq.size===1&&uniq.has("SYMBOL_EXPECTED_NO_TRADE_CONFIRMED"))
    return {status:"EXPECTED_TO_TRADE_NO_TRADE_CONFIRMED"};

  if(uniq.has("SYMBOL_NOT_EXPECTED_TO_TRADE")||uniq.has("SYMBOL_EXPECTED_NO_TRADE_CONFIRMED")||uniq.has("EXCHANGE_CLOSED"))
    return {status:"MIXED_INTERVAL"};

  return {status:"ATTRIBUTION_UNCERTAIN_INTERVAL"};
}

export function validateNoPseudoBars({interveningStates=[],syntheticBarsCreated=0}={}){
  if(!Number.isInteger(syntheticBarsCreated)||syntheticBarsCreated<0)
    return {status:"SYNTHETIC_BAR_COUNT_INVALID"};
  if(interveningStates.length&&syntheticBarsCreated>0)
    return {status:"PSEUDO_BAR_PROHIBITED"};
  return {status:"NO_PSEUDO_BAR_VIOLATION"};
}

export function buildGapRoot({priorBarId,currentBarId,interveningStates=[]}={}){
  if(!priorBarId||!currentBarId)return {status:"GAP_ROOT_BLOCKED"};
  return {
    status:"GAP_ROOT_READY",
    gapRootId:[priorBarId,currentBarId].join("->"),
    calendarSpacingStateCount:interveningStates.length,
    effectiveIndependentGapRootCount:1
  };
}

export function validateGapCommonSupport(a={},b={},stratifiedComparison=false){
  const fields=[
    "attributionClass","semanticSpace","priceLimitPolicyId",
    "suspensionPolicyId","calendarTimezonePolicyId"
  ];
  const drift=fields.filter(k=>(a[k]??null)!==(b[k]??null));
  if(!drift.length)return {status:"GAP_COMMON_SUPPORT_VALID",drift:[]};
  if(stratifiedComparison===true)return {status:"GAP_STRATIFIED_COMPARISON_REQUIRED",drift};
  return {status:"GAP_COMMON_SUPPORT_MISMATCH",drift};
}
