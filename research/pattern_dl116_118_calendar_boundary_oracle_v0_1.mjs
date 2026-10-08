// D01 DL-116~118 exchange-calendar / partial-bar / revision-fanout oracle v0.1

const SCALES=new Set(["D1","W1","M1"]);
const MARKET_TZ="Asia/Taipei";
const TZ_OFFSET_MINUTES=480;

function dateParts(dateText){
  const m=String(dateText||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m)return null;
  const y=Number(m[1]),mo=Number(m[2]),d=Number(m[3]);
  const dt=new Date(Date.UTC(y,mo-1,d));
  if(dt.getUTCFullYear()!==y||dt.getUTCMonth()!==mo-1||dt.getUTCDate()!==d)return null;
  return {y,mo,d};
}

export function localDateFromTimestamp(ts,offsetMinutes=TZ_OFFSET_MINUTES){
  const ms=Date.parse(ts);
  if(!Number.isFinite(ms))return null;
  const local=new Date(ms+offsetMinutes*60000);
  return [
    local.getUTCFullYear(),
    String(local.getUTCMonth()+1).padStart(2,"0"),
    String(local.getUTCDate()).padStart(2,"0")
  ].join("-");
}

export function isoWeekKey(dateText){
  const p=dateParts(dateText);
  if(!p)return null;
  const date=new Date(Date.UTC(p.y,p.mo-1,p.d));
  const day=date.getUTCDay()||7;
  date.setUTCDate(date.getUTCDate()+4-day);
  const weekYear=date.getUTCFullYear();
  const yearStart=new Date(Date.UTC(weekYear,0,1));
  const week=Math.ceil((((date-yearStart)/86400000)+1)/7);
  return `${weekYear}-W${String(week).padStart(2,"0")}`;
}

export function localPeriodKey(dateText,scale){
  const p=dateParts(dateText);
  if(!p)return null;
  if(scale==="D1")return dateText;
  if(scale==="W1")return isoWeekKey(dateText);
  if(scale==="M1")return `${p.y}-${String(p.mo).padStart(2,"0")}`;
  return null;
}

function validOHLC(r){
  const o=Number(r.open),h=Number(r.high),l=Number(r.low),c=Number(r.close);
  if(![o,h,l,c].every(Number.isFinite))return false;
  if([o,h,l,c].some(x=>x<0))return false;
  if(h<l||h<Math.max(o,c)||l>Math.min(o,c))return false;
  return true;
}

function hasOutcomeFields(r={}){
  if(r.outcomeFieldsPresent===true)return true;
  return ["futureReturn","MFE","MAE","laterSuccess","laterFailure"].some(k=>r[k]!==undefined&&r[k]!==null);
}

export function aggregateOHLC(rows=[]){
  if(!Array.isArray(rows)||!rows.length)return {status:"AGGREGATE_BLOCKED"};
  if(rows.some(r=>!validOHLC(r)))return {status:"AGGREGATE_BLOCKED"};
  return {
    status:"AGGREGATE_READY",
    open:Number(rows[0].open),
    high:Math.max(...rows.map(r=>Number(r.high))),
    low:Math.min(...rows.map(r=>Number(r.low))),
    close:Number(rows[rows.length-1].close),
    constituentIds:rows.map(r=>String(r.id||r.marketDate||""))
  };
}

export function buildHigherTimeframeAsOf(input={}){
  const {
    market,marketTimezone,calendarVersion,calendarFirstObservableAt,scale,targetPeriodKey,
    predictorFreezeAt,expectedEligibleSessions=[],observations=[],semanticSpace,sourceHistoryHash
  }=input;

  if(!SCALES.has(scale))return {status:"UNKNOWN_BLOCKED",reason:"SCALE_UNSUPPORTED"};
  if(marketTimezone!==MARKET_TZ)return {status:"UNKNOWN_BLOCKED",reason:"TIMEZONE_MISMATCH"};
  if(!calendarVersion||!calendarFirstObservableAt||!predictorFreezeAt||!market||!semanticSpace||!sourceHistoryHash)
    return {status:"UNKNOWN_BLOCKED",reason:"PROVENANCE_INCOMPLETE"};
  if(Date.parse(calendarFirstObservableAt)>Date.parse(predictorFreezeAt))
    return {status:"UNKNOWN_BLOCKED",reason:"CALENDAR_NOT_KNOWN_AT_FREEZE"};

  const freezeDate=localDateFromTimestamp(predictorFreezeAt);
  if(!freezeDate)return {status:"UNKNOWN_BLOCKED",reason:"FREEZE_TIME_INVALID"};

  const expected=[...expectedEligibleSessions];
  if(!expected.length)return {status:"UNKNOWN_BLOCKED",reason:"EXPECTED_SESSION_SET_EMPTY"};
  if(new Set(expected).size!==expected.length)return {status:"UNKNOWN_BLOCKED",reason:"EXPECTED_SESSION_DUPLICATE"};
  if(expected.some(d=>!dateParts(d)))return {status:"UNKNOWN_BLOCKED",reason:"EXPECTED_SESSION_DATE_INVALID"};
  if(expected.some(d=>localPeriodKey(d,scale)!==targetPeriodKey))
    return {status:"UNKNOWN_BLOCKED",reason:"EXPECTED_SESSION_PERIOD_MISMATCH"};

  const due=expected.filter(d=>d<=freezeDate);
  const future=expected.filter(d=>d>freezeDate);
  if(!due.length){
    return {
      status:"WAITING_PROSPECTIVE",
      dueSessionCount:0,futureSessionCount:future.length,
      targetPeriodKey,calendarVersion,marketTimezone
    };
  }

  // Critical prefix rule: ignore future observations BEFORE validating market/semantic/OHLC fields.
  const dueSet=new Set(due);
  const dueObs=observations.filter(r=>dueSet.has(r.marketDate));

  const counts=new Map();
  for(const r of dueObs)counts.set(r.marketDate,(counts.get(r.marketDate)||0)+1);
  if([...counts.values()].some(n=>n>1))
    return {status:"DATA_BLOCKED",reason:"DUPLICATE_DUE_SESSION"};

  const byDate=new Map(dueObs.map(r=>[r.marketDate,r]));
  const missing=due.filter(d=>!byDate.has(d));
  if(missing.length)return {status:"DATA_BLOCKED",reason:"MISSING_DUE_SESSION",missing};

  const ordered=due.map(d=>byDate.get(d));
  for(const r of ordered){
    if(r.market!==market)return {status:"UNKNOWN_BLOCKED",reason:"MARKET_MIX"};
    if(r.marketTimezone&&r.marketTimezone!==marketTimezone)return {status:"UNKNOWN_BLOCKED",reason:"TIMEZONE_MIX"};
    if(r.semanticSpace!==semanticSpace)return {status:"UNKNOWN_BLOCKED",reason:"SEMANTIC_SPACE_MIX"};
    if(!validOHLC(r))return {status:"DATA_BLOCKED",reason:"INVALID_OHLC"};
    if(r.finalized!==true)return {status:"DATA_BLOCKED",reason:"UNFINALIZED_DUE_BAR"};
    if(!r.finalizedAt||Date.parse(r.finalizedAt)>Date.parse(predictorFreezeAt))
      return {status:"DATA_BLOCKED",reason:"FINALIZED_AFTER_FREEZE"};
    if(!r.firstObservableAt||Date.parse(r.firstObservableAt)>Date.parse(predictorFreezeAt))
      return {status:"DATA_BLOCKED",reason:"OBSERVABLE_AFTER_FREEZE"};
    if(hasOutcomeFields(r))return {status:"DATA_BLOCKED",reason:"OUTCOME_FIELD_CONTAMINATION"};
  }

  const agg=aggregateOHLC(ordered);
  if(agg.status!=="AGGREGATE_READY")return {status:"DATA_BLOCKED",reason:"AGGREGATE_INVALID"};

  const state=future.length?"PARTIAL_AS_OF":"FINALIZED_AS_OF";
  const expectedSessionIdentity=expected.join("|");
  const dueSessionIdentity=due.join("|");
  const constituentIdentity=agg.constituentIds.join("|");
  const calendarIdentityHash=[market,marketTimezone,calendarVersion,scale,targetPeriodKey,expectedSessionIdentity].join("::");
  const derivedIdentityHash=[calendarIdentityHash,dueSessionIdentity,semanticSpace,sourceHistoryHash,constituentIdentity].join("::");
  const derivedValueHash=[agg.open,agg.high,agg.low,agg.close].join("|");

  return {
    status:state,
    dueSessionCount:due.length,
    futureSessionCount:future.length,
    expectedEligibleSessions:expected,
    dueSessions:due,
    targetPeriodKey,
    marketTimezone,
    calendarVersion,
    semanticSpace,
    sourceHistoryHash,
    calendarIdentityHash,
    derivedIdentityHash,
    derivedValueHash,
    aggregate:agg
  };
}

export function classifyDerivedRevision(oldR={},newR={}){
  if(!oldR||!newR||!oldR.status||!newR.status)
    return {status:"UNKNOWN_BLOCKED"};
  if(!["FINALIZED_AS_OF","PARTIAL_AS_OF"].includes(oldR.status)||
     !["FINALIZED_AS_OF","PARTIAL_AS_OF"].includes(newR.status))
    return {status:"UNKNOWN_BLOCKED"};
  if(oldR.semanticSpace!==newR.semanticSpace||oldR.targetPeriodKey!==newR.targetPeriodKey)
    return {status:"UNKNOWN_BLOCKED"};

  const sameCalendar=oldR.calendarIdentityHash===newR.calendarIdentityHash;
  const sameSource=oldR.sourceHistoryHash===newR.sourceHistoryHash;
  const sameValue=oldR.derivedValueHash===newR.derivedValueHash;
  const sameDerivedIdentity=oldR.derivedIdentityHash===newR.derivedIdentityHash;

  if(sameCalendar&&sameSource&&sameValue&&sameDerivedIdentity)
    return {status:"IDENTICAL_REPLAY"};
  if(!sameCalendar&&sameValue)
    return {status:"CALENDAR_DEFINITION_REVISION"};
  if(sameCalendar&&!sameSource&&sameValue)
    return {status:"PROVENANCE_ONLY_REVISION"};
  if(!sameValue)
    return {status:"DERIVED_VALUE_REVISION"};
  return {status:"UNKNOWN_BLOCKED"};
}

export function revisionRootAccounting(receipts=[]){
  const primitive=new Set();
  const calendar=new Set();
  let rawRepresentationCount=0;
  for(const r of receipts){
    for(const x of (r.primitiveRevisionRootIds||[]))primitive.add(x);
    for(const x of (r.calendarRevisionRootIds||[]))calendar.add(x);
    rawRepresentationCount+=Number(r.revisionRepresentationCount||0);
  }
  return {
    status:"REVISION_ROOTS_ACCOUNTED",
    primitivePriceRevisionRootCount:primitive.size,
    calendarRevisionRootCount:calendar.size,
    effectiveIndependentRevisionRootCount:primitive.size+calendar.size,
    rawRevisionRepresentationCount:rawRepresentationCount
  };
}

export function validateNoRevisionVoteInflation({receipts=[],claimedIndependentVotes}={}){
  const a=revisionRootAccounting(receipts);
  if(!Number.isInteger(claimedIndependentVotes)||claimedIndependentVotes<0)
    return {...a,status:"CLAIMED_VOTE_COUNT_INVALID"};
  if(claimedIndependentVotes>a.effectiveIndependentRevisionRootCount)
    return {...a,status:"REVISION_FANOUT_VOTE_INFLATION"};
  return {...a,status:"REVISION_VOTE_ACCOUNTING_VALID"};
}
