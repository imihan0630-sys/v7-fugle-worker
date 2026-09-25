from pathlib import Path


path = Path("Worker.js")
text = path.read_text(encoding="utf-8")


def replace_once(old, new, label):
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text = text.replace(old, new, 1)


def insert_after_once(marker, addition, label):
    global text
    count = text.count(marker)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 marker, found {count}")
    text = text.replace(marker, marker + addition, 1)


def insert_before_once(marker, addition, label):
    global text
    count = text.count(marker)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 marker, found {count}")
    text = text.replace(marker, addition + marker, 1)


replace_once(
    'const VERSION = "8.10.0-aideen-independent-pool";',
    'const VERSION = "8.11.0-pv-shadow-v0.1-log-only";',
    "runtime version",
)

insert_after_once(
    'const AIDEEN_CANDIDATE_RETENTION_DAYS = 730;',
    r'''
const PV_SHADOW_SCHEMA_VERSION = "PV_SHADOW_V0_1";
const PV_SHADOW_OBSERVABLE_SLOTS = [
  "09:00","09:15","09:30","09:45","10:00","10:15","10:30","10:45","11:00",
  "11:15","11:30","11:45","12:00","12:15","12:30","12:45","13:00"
];
const PV_SHADOW_MIN_HISTORY = 20;
const PV_SHADOW_BASELINE_KEEP_SESSIONS = 80;
''',
    "PV Shadow constants",
)

insert_before_once(
    '  D1_SCHEMA_READY = true;',
    r'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v7_pv_shadow_snapshots (
    snapshot_id TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    market_date TEXT NOT NULL,
    observed_at TEXT NOT NULL,
    observation_type TEXT NOT NULL,
    schema_version TEXT NOT NULL,
    event_key TEXT,
    features_json TEXT NOT NULL,
    context_json TEXT,
    coverage_json TEXT,
    source_json TEXT,
    decision_impact INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v7_pv_shadow_date_type
    ON v7_pv_shadow_snapshots(market_date,observation_type)`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v7_pv_shadow_symbol_time
    ON v7_pv_shadow_snapshots(symbol,observed_at)`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v7_pv_shadow_event
    ON v7_pv_shadow_snapshots(event_key)`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v7_pv_outcomes (
    snapshot_id TEXT NOT NULL,
    horizon TEXT NOT NULL,
    completed_at TEXT,
    direction_return REAL,
    mfe REAL,
    mae REAL,
    range_atr REAL,
    stop_first INTEGER,
    false_break INTEGER,
    acceptance_result TEXT,
    outcome_complete INTEGER NOT NULL DEFAULT 0,
    outcome_json TEXT,
    PRIMARY KEY(snapshot_id,horizon)
  )`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v7_pv_intraday_baselines (
    symbol TEXT PRIMARY KEY,
    schema_version TEXT NOT NULL,
    valid_sessions INTEGER NOT NULL,
    last_market_date TEXT,
    slot_stats_json TEXT NOT NULL,
    corporate_action_reset_at TEXT,
    updated_at TEXT NOT NULL
  )`).run();
''',
    "PV Shadow D1 schema",
)

helpers = r'''
function pvShadowEnabled(env) {
  return String(env?.PV_SHADOW_ENABLED || "false").toLowerCase() === "true";
}

function pvCanonicalize(value) {
  if (Array.isArray(value)) return value.map(pvCanonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(key=>[key,pvCanonicalize(value[key])]));
  }
  return value === undefined ? null : value;
}

function pvCanonicalJson(value) {
  return JSON.stringify(pvCanonicalize(value));
}

async function pvSha256Hex(value) {
  const bytes=new TextEncoder().encode(typeof value==="string"?value:pvCanonicalJson(value));
  const digest=await crypto.subtle.digest("SHA-256",bytes);
  return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("");
}

function pvMedian(values) {
  const sorted=(Array.isArray(values)?values:[]).map(Number).filter(Number.isFinite).sort((a,b)=>a-b);
  if(!sorted.length) return null;
  const middle=Math.floor(sorted.length/2);
  return sorted.length%2 ? sorted[middle] : (sorted[middle-1]+sorted[middle])/2;
}

function pvTaipeiSlot(value) {
  const ms=Date.parse(value);
  if(!Number.isFinite(ms)) return null;
  const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hour12:false})
    .formatToParts(new Date(ms));
  const item=Object.fromEntries(parts.map(part=>[part.type,part.value]));
  const slot=`${item.hour}:${item.minute}`;
  return PV_SHADOW_OBSERVABLE_SLOTS.includes(slot)?slot:null;
}

function pvExpectedSlotsThrough(slotKey) {
  const index=PV_SHADOW_OBSERVABLE_SLOTS.indexOf(slotKey);
  return index<0?[]:PV_SHADOW_OBSERVABLE_SLOTS.slice(0,index+1);
}

function pvNormalizeBar(bar,previousClose=null) {
  const time=String(bar?.date||bar?.time||"");
  const open=toNumber(bar?.open),high=toNumber(bar?.high),low=toNumber(bar?.low),close=toNumber(bar?.close),volume=toNumber(bar?.volume);
  if(!Number.isFinite(Date.parse(time)) || !(open>0) || !(high>0) || !(low>0) || !(close>0) || volume===null || volume<0 || high<Math.max(open,close) || low>Math.min(open,close) || high<low) return null;
  const base=positiveNumber(previousClose);
  const trueRange=Math.max(high-low,base===null?0:Math.abs(high-base),base===null?0:Math.abs(low-base));
  const range=high-low;
  const body=Math.abs(close-open);
  return {time,open,high,low,close,volume,trueRange,range,body,
    closePosition:range>0?(close-low)/range:0.5,
    upperShadowRatio:range>0?(high-Math.max(open,close))/range:0,
    lowerShadowRatio:range>0?(Math.min(open,close)-low)/range:0,
    bodyShare:range>0?body/range:0,
    bullish:close>open,bearish:close<open};
}

function pvEnrichSessionBars(rows,referenceClose=null) {
  const sorted=(Array.isArray(rows)?rows:[]).slice().sort((a,b)=>Date.parse(a?.date||a?.time)-Date.parse(b?.date||b?.time));
  let previousClose=positiveNumber(referenceClose),runningVolume=0,prefixValid=true;
  const bySlot=new Map(),out=[];
  for(const raw of sorted) {
    const normalized=pvNormalizeBar(raw,previousClose);
    if(!normalized) continue;
    previousClose=normalized.close;
    const slotKey=pvTaipeiSlot(normalized.time);
    if(!slotKey || bySlot.has(slotKey)) continue;
    bySlot.set(slotKey,normalized);
  }
  for(const slotKey of PV_SHADOW_OBSERVABLE_SLOTS) {
    const bar=bySlot.get(slotKey);
    if(!bar) {prefixValid=false;continue;}
    runningVolume+=bar.volume;
    const prior=out.slice(-5);
    const avg5=prior.length===5?prior.reduce((sum,x)=>sum+x.volume,0)/5:null;
    out.push({...bar,slotKey,marketDate:taiwanDate(Date.parse(bar.time)),
      cumulativeVolume:prefixValid?runningVolume:null,cumulativeValid:prefixValid,
      localVolumeRatio:avg5>0?bar.volume/avg5:null});
  }
  return out;
}

function pvExtractCompletedSession15(raw,nowMs=Date.now(),referenceClose=null) {
  if(!Array.isArray(raw?.data)) return {marketDate:taiwanDate(nowMs),bars:[],coverageReasons:["INVALID_SOURCE_DATA"]};
  const marketDate=taiwanDate(nowMs);
  const completed=raw.data.filter(bar=>{
    const start=Date.parse(bar?.date);
    return Number.isFinite(start) && taiwanDate(start)===marketDate && start+15*60000<=nowMs && pvTaipeiSlot(bar.date);
  });
  const bars=pvEnrichSessionBars(completed,referenceClose);
  const reasons=[];
  const latest=bars.at(-1);
  if(latest) {
    const expected=pvExpectedSlotsThrough(latest.slotKey);
    const present=new Set(bars.map(x=>x.slotKey));
    if(expected.some(slot=>!present.has(slot))) reasons.push("MISSING_REQUIRED_SESSION_SLOT");
  }
  return {marketDate,bars,coverageReasons:reasons};
}

function pvNormalizeHistoricalSessions(raw,beforeMarketDate) {
  const rows=Array.isArray(raw?.data)?raw.data:[];
  const valid=rows.filter(bar=>Number.isFinite(Date.parse(bar?.date)) && taiwanDate(Date.parse(bar.date))<beforeMarketDate && pvTaipeiSlot(bar.date));
  valid.sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
  const grouped=new Map();
  for(const bar of valid) {
    const date=taiwanDate(Date.parse(bar.date));
    const list=grouped.get(date)||[];list.push(bar);grouped.set(date,list);
  }
  let priorClose=null;
  const sessions=[];
  for(const [marketDate,bars] of [...grouped.entries()].sort((a,b)=>a[0].localeCompare(b[0]))) {
    const normalized=pvEnrichSessionBars(bars,priorClose);
    if(normalized.length) {
      priorClose=normalized.at(-1).close;
      sessions.push({marketDate,bars:normalized.map(bar=>({slotKey:bar.slotKey,time:bar.time,open:bar.open,high:bar.high,low:bar.low,close:bar.close,volume:bar.volume,trueRange:bar.trueRange,cumulativeVolume:bar.cumulativeVolume,cumulativeValid:bar.cumulativeValid}))});
    }
  }
  return sessions.slice(-PV_SHADOW_BASELINE_KEEP_SESSIONS);
}

function pvMergeBaselineSessions(existing,incoming,resetAt=null) {
  const map=new Map();
  for(const session of [...(existing||[]),...(incoming||[])]) {
    if(!session?.marketDate || !Array.isArray(session?.bars)) continue;
    if(resetAt && session.marketDate<String(resetAt).slice(0,10)) continue;
    map.set(session.marketDate,session);
  }
  return [...map.values()].sort((a,b)=>a.marketDate.localeCompare(b.marketDate)).slice(-PV_SHADOW_BASELINE_KEEP_SESSIONS);
}

function pvBaselineStats(cache,marketDate,slotKey) {
  const resetAt=cache?.corporateActionResetAt?String(cache.corporateActionResetAt).slice(0,10):null;
  const sessions=(cache?.sessions||[]).filter(x=>x.marketDate<marketDate && (!resetAt || x.marketDate>=resetAt)).sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
  const rows=sessions.map(session=>({marketDate:session.marketDate,bar:(session.bars||[]).find(bar=>bar.slotKey===slotKey)})).filter(x=>x.bar);
  const last20=rows.slice(-PV_SHADOW_MIN_HISTORY);
  const volumes=last20.map(x=>toNumber(x.bar.volume)).filter(x=>x!==null && x>=0);
  const ranges=last20.map(x=>positiveNumber(x.bar.trueRange)).filter(x=>x!==null);
  const cumulative=last20.filter(x=>x.bar.cumulativeValid===true).map(x=>positiveNumber(x.bar.cumulativeVolume)).filter(x=>x!==null);
  return {
    slotHistoryCount:volumes.length,rangeHistoryCount:ranges.length,cumulativeHistoryCount:cumulative.length,
    slotVolumeMedian20:volumes.length>=PV_SHADOW_MIN_HISTORY?pvMedian(volumes):null,
    slotRangeMedian20:ranges.length>=PV_SHADOW_MIN_HISTORY?pvMedian(ranges):null,
    cumulativeVolumeMedian20:cumulative.length>=PV_SHADOW_MIN_HISTORY?pvMedian(cumulative):null,
    baselineAsOfDate:last20.at(-1)?.marketDate||null,
    corporateActionResetAt:cache?.corporateActionResetAt||null
  };
}

function pvParticipationBand(value) {
  if(!Number.isFinite(value)) return "UNKNOWN";
  if(value<=0.8) return "LOW";
  if(value<1.3) return "NORMAL";
  if(value<2.5) return "ELEVATED";
  return "EXTREME";
}

const PV_GUARD_PRECEDENCE=[
  "INVALID_SOURCE_DATA","UNSUPPORTED_MARKET_STRUCTURE","CORPORATE_ACTION_RESET","REFERENCE_PRICE_UNRESOLVED","DATA_INSUFFICIENT","STALE_OR_INCOMPLETE_BAR",
  "PRICE_CENSORED","AUCTION_MIXED","GAP_DOMINATED","ILLIQUIDITY_WARNING","VI_STATE_UNKNOWN_CONFOUNDER","NORMAL_MARKET"
];

function pvEvaluateGuards(input={}) {
  const flags=[];
  const add=flag=>{if(!flags.includes(flag)) flags.push(flag);};
  if(input.invalidSourceData) add("INVALID_SOURCE_DATA");
  if(input.unsupportedMarketStructure) add("UNSUPPORTED_MARKET_STRUCTURE");
  if(input.corporateActionReset) add("CORPORATE_ACTION_RESET");
  if(input.referencePriceUnresolved) add("REFERENCE_PRICE_UNRESOLVED");
  if(input.dataInsufficient) add("DATA_INSUFFICIENT");
  if(input.staleOrIncompleteBar) add("STALE_OR_INCOMPLETE_BAR");
  if(input.priceCensored) add("PRICE_CENSORED");
  if(input.auctionMixed) add("AUCTION_MIXED");
  if(input.gapDominated) add("GAP_DOMINATED");
  if(input.illiquidityWarning) add("ILLIQUIDITY_WARNING");
  if(input.viStateUnknownConfounder) add("VI_STATE_UNKNOWN_CONFOUNDER");
  if(!flags.length) add("NORMAL_MARKET");
  flags.sort((a,b)=>PV_GUARD_PRECEDENCE.indexOf(a)-PV_GUARD_PRECEDENCE.indexOf(b));
  const primary=flags[0];
  const index=PV_GUARD_PRECEDENCE.indexOf(primary);
  return {pvGuardState:primary,pvGuardFlags:flags,pvInterpretability:index<=5?"INVALID":index<=10?"GUARDED":"VALID"};
}

function pvComputeResponse(bar,baselines,guard) {
  const slotVolumeMedian=positiveNumber(baselines?.slotVolumeMedian20),slotRangeMedian=positiveNumber(baselines?.slotRangeMedian20);
  const cumulativeMedian=positiveNumber(baselines?.cumulativeVolumeMedian20);
  const slotRvol=slotVolumeMedian===null?null:bar.volume/slotVolumeMedian;
  const cumulativePace=cumulativeMedian===null || positiveNumber(bar.cumulativeVolume)===null?null:bar.cumulativeVolume/cumulativeMedian;
  const rangeExpansion=slotRangeMedian===null?null:bar.trueRange/slotRangeMedian;
  const signedProgress=slotRangeMedian===null?null:(bar.close-bar.open)/slotRangeMedian;
  const participation=pvParticipationBand(slotRvol);
  let substate="UNKNOWN";
  if(slotRvol!==null && rangeExpansion!==null && signedProgress!==null) {
    const elevated=participation==="ELEVATED"||participation==="EXTREME";
    if(elevated && bar.close>bar.open && bar.closePosition>=2/3 && bar.upperShadowRatio<0.45 && (signedProgress>=0.25 || (rangeExpansion>=1 && bar.bodyShare>=0.5))) substate="EFFICIENT_UP";
    else if(elevated && bar.close<bar.open && bar.closePosition<=1/3 && bar.lowerShadowRatio<0.45 && (signedProgress<=-0.25 || (rangeExpansion>=1 && bar.bodyShare>=0.5))) substate="EFFICIENT_DOWN";
    else if(elevated && (Math.abs(signedProgress)<0.25 || bar.bodyShare<=0.25 || (bar.closePosition>=1/3 && bar.closePosition<=2/3))) substate="HIGH_EFFORT_LOW_PROGRESS";
    else if(participation==="LOW" && Math.abs(signedProgress)<0.25 && rangeExpansion<1) substate="LOW_EFFORT_LOW_PROGRESS";
    else substate="NORMAL_RESPONSE";
  }
  const response=guard?.pvInterpretability==="INVALID"?"UNKNOWN":guard?.pvInterpretability==="GUARDED"?"GUARDED_RESPONSE":substate;
  return {pvSlotRvol20:slotRvol,pvCumvolPace20:cumulativePace,pvSlotRangeExpansion20:rangeExpansion,pvSignedProgress20:signedProgress,pvBodyShare:bar.bodyShare,
    participationBand:participation,pvResponseState:response,pvResponseDiagnosticSubstate:substate};
}

function pvPersistenceEventKey(scope,symbol,observedAt) {
  return `PVP:${scope}:${symbol}:${observedAt}`;
}

function pvAdvancePersistence(previous,value,{scope="INTRADAY_15M",symbol="UNKNOWN",observedAt=new Date().toISOString(),comparable=true}={}) {
  const prior=previous&&typeof previous==="object"?previous:null;
  if(!comparable || !Number.isFinite(value)) return {...(prior||{state:"UNKNOWN",eventKey:null,consecutiveAbnormalCount:0,belowThresholdCount:0,peakRvol:null,observationsSincePeak:null,reignitionCount:0}),paused:true};
  const abnormal=value>=1.3;
  if(!prior || ["UNKNOWN","NORMAL","NORMALIZED"].includes(prior.state)) {
    if(!abnormal) return {state:"NORMAL",eventKey:null,consecutiveAbnormalCount:0,belowThresholdCount:0,peakRvol:value,observationsSincePeak:0,reignitionCount:0,paused:false};
    return {state:"FRESH_SHOCK",eventKey:pvPersistenceEventKey(scope,symbol,observedAt),consecutiveAbnormalCount:1,belowThresholdCount:0,peakRvol:value,observationsSincePeak:0,reignitionCount:0,paused:false};
  }
  const peak=Number.isFinite(prior.peakRvol)?Math.max(prior.peakRvol,value):value;
  const sincePeak=value>=peak?0:(Number(prior.observationsSincePeak)||0)+1;
  if(abnormal) {
    if(prior.state==="DECAYING") return {...prior,state:"REIGNITED",belowThresholdCount:0,consecutiveAbnormalCount:(Number(prior.consecutiveAbnormalCount)||0)+1,peakRvol:peak,observationsSincePeak:sincePeak,reignitionCount:(Number(prior.reignitionCount)||0)+1,paused:false};
    return {...prior,state:"PERSISTENT",belowThresholdCount:0,consecutiveAbnormalCount:(Number(prior.consecutiveAbnormalCount)||0)+1,peakRvol:peak,observationsSincePeak:sincePeak,paused:false};
  }
  const below=(Number(prior.belowThresholdCount)||0)+1;
  return {...prior,state:below>=2?"NORMALIZED":"DECAYING",belowThresholdCount:below,peakRvol:peak,observationsSincePeak:sincePeak,paused:false};
}

function pvChannel(plan) {
  const explicit=String(plan?.channel||"").toUpperCase();
  if(explicit==="A"||explicit==="B") return explicit;
  return String(plan?.mode||"").toUpperCase()==="MOMENTUM"?"B":"A";
}

function pvAdvanceAcceptance({symbol,marketDate,channel,bar,previousBar,plan,previous,observedAt}) {
  const initial=channel==="B"?"B_PRE_EVENT":"A_PRE_EVENT";
  const prior=previous?.marketDate===marketDate && previous?.channel===channel?previous:{state:initial,eventKey:null,stateHistory:[],marketDate,channel,retestBar:null};
  let state=prior.state||initial,reason="NO_TRANSITION",retestBar=prior.retestBar||null;
  const breakout=positiveNumber(plan?.breakout),buyLow=positiveNumber(plan?.buyLow),buyHigh=positiveNumber(plan?.buyHigh),stop=positiveNumber(plan?.stop);
  if(channel==="B" && breakout!==null) {
    const attempted=bar.high>=breakout || bar.close>=breakout;
    const eventActive=state!=="B_PRE_EVENT";
    if((eventActive||attempted) && (bar.close<breakout*0.995 || (["B_INITIAL_ACCEPTANCE","B_RETEST"].includes(state) && buyLow!==null && bar.close<buyLow))) {state="B_FAILED_REENTRY";reason=bar.close<breakout*0.995?"CLOSE_BELOW_BREAKOUT_0_995":"RETEST_ZONE_LOST";}
    else if(state==="B_RETEST" && previousBar && bar.bullish && (bar.close>previousBar.close || bar.high>previousBar.high) && bar.close>=breakout*0.997) {state="B_REACCELERATION";reason="LATER_BULLISH_PROGRESS_AFTER_RETEST";}
    else if(state==="B_INITIAL_ACCEPTANCE" && buyLow!==null && buyHigh!==null && bar.low<=buyHigh && bar.high>=buyLow) {state="B_RETEST";reason="FROZEN_RETEST_ZONE_OVERLAP";retestBar={time:bar.time,close:bar.close,high:bar.high,low:bar.low};}
    else if(["B_PRE_EVENT","B_BREAKOUT_ATTEMPT"].includes(state) && bar.close>=breakout*1.003 && Number.isFinite(bar.localVolumeRatio) && bar.localVolumeRatio>=1.3 && bar.closePosition>=2/3 && bar.upperShadowRatio<0.45) {state="B_INITIAL_ACCEPTANCE";reason="EXISTING_FORMAL_BREAKOUT_CONFIRMED";}
    else if(state==="B_PRE_EVENT" && attempted) {state="B_BREAKOUT_ATTEMPT";reason="HIGH_OR_CLOSE_REACHED_BREAKOUT";}
  } else if(channel==="A" && buyLow!==null && buyHigh!==null) {
    const overlap=bar.low<=buyHigh && bar.high>=buyLow;
    const active=state!=="A_PRE_EVENT";
    if(active && (bar.close<buyLow || (stop!==null && bar.close<stop))) {state="A_FAILED_REENTRY";reason=stop!==null&&bar.close<stop?"STOP_BROKEN":"ZONE_LOST";}
    else if(state==="A_INITIAL_ACCEPTANCE" && previousBar && bar.low>=previousBar.low && bar.bullish && (bar.close>previousBar.close || bar.high>previousBar.high)) {state="A_REACCELERATION";reason="EXISTING_FORMAL_A_BUY_STRUCTURE";}
    else if(overlap && bar.close>=buyLow && Number.isFinite(bar.localVolumeRatio) && bar.localVolumeRatio<=0.9 && (bar.closePosition>=2/3 || bar.lowerShadowRatio>=Math.max(bar.bodyShare,0.25))) {state="A_INITIAL_ACCEPTANCE";reason="EXISTING_FORMAL_PRE_BUY_SETUP";}
    else if(state==="A_PRE_EVENT" && overlap && bar.close>=buyLow) {state="A_PULLBACK_TEST";reason="BUY_ZONE_OVERLAP_AND_HOLD";}
  }
  if(bar.slotKey==="13:00" && !["B_REACCELERATION","B_FAILED_REENTRY","A_REACCELERATION","A_FAILED_REENTRY"].includes(state)) {
    state=channel==="B"?"B_EXPIRED_AMBIGUOUS":"A_EXPIRED_AMBIGUOUS";reason="OBSERVABLE_SESSION_ENDED_WITHOUT_RESOLUTION";
  }
  const transitioned=state!==prior.state;
  const eventKey=prior.eventKey || (transitioned && state!==initial?`PVACC:${channel}:${symbol}:${observedAt}`:null);
  const history=(prior.stateHistory||[]).map(x=>({...x}));
  if(!history.length) history.push({state:initial,enteredAt:null,reason:"INITIAL"});
  if(transitioned) history.push({state,enteredAt:observedAt,reason});
  return {state,eventKey,stateHistory:history,previousState:prior.state,transitioned,transitionReason:reason,marketDate,channel,retestBar};
}

function pvSessionPhase(slotKey) {
  if(slotKey==="09:00") return "OPEN_AUCTION_MIXED";
  return PV_SHADOW_OBSERVABLE_SLOTS.includes(slotKey)?"CONTINUOUS":"UNKNOWN";
}

function pvSnapshotIdentity(symbol,observedAt,type) {
  return `${PV_SHADOW_SCHEMA_VERSION}:${type}:${symbol}:${observedAt}`;
}

function pvFormalContext(result) {
  const plan=result?.plan||result||{};
  return {channel:pvChannel(plan),planDate:plan.planDate||null,buyLow:toNumber(plan.buyLow),buyHigh:toNumber(plan.buyHigh),breakout:toNumber(plan.breakout),
    maxChase:toNumber(plan.maxChase),stop:toNumber(plan.stop),profitCheck:toNumber(plan.profitCheck),positionStage:plan.positionStage||null,
    totalAllocation:toNumber(plan.totalAllocation),firstAmount:toNumber(plan.firstAmount),secondAmount:toNumber(plan.secondAmount),
    formalDecisionLevel:result?.finalDecision?.level||null,formalDecisionText:result?.finalDecision?.text||null,
    formalPullbackLevel:result?.pullback?.level||null,formalMomentum15Level:result?.momentum15?.level||null,
    formalLocalVolumeRatio:toNumber(result?.frame15?.latest?.volumeRatio)};
}

async function pvSnapshotFingerprint(snapshot) {
  return pvSha256Hex({snapshotId:snapshot.snapshotId,schemaVersion:snapshot.schemaVersion,symbol:snapshot.symbol,marketDate:snapshot.marketDate,
    observedAt:snapshot.observedAt,observationType:snapshot.observationType,eventKey:snapshot.eventKey,features:snapshot.features,
    context:snapshot.context,coverage:snapshot.coverage,source:snapshot.source,decisionImpact:false});
}

function pvDecideImmutableWrite(existingFingerprint,newFingerprint) {
  if(!existingFingerprint) return "INSERT";
  return existingFingerprint===newFingerprint?"DUPLICATE":"MUTATION_CONFLICT";
}

async function pvInsertSnapshotImmutable(env,snapshot) {
  if(!env?.V7_DB) return {stored:false,reason:"D1_UNAVAILABLE"};
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const fingerprint=await pvSnapshotFingerprint(snapshot);
  const existing=await session.prepare("SELECT source_json FROM v7_pv_shadow_snapshots WHERE snapshot_id=?1").bind(snapshot.snapshotId).first();
  if(existing) {
    let previous=null;try{previous=JSON.parse(existing.source_json||"{}").semanticFingerprint||null;}catch(_){previous=null;}
    const action=pvDecideImmutableWrite(previous,fingerprint);
    return action==="DUPLICATE"?{stored:false,duplicate:true,fingerprint}:{stored:false,mutationConflict:true,fingerprint,previousFingerprint:previous};
  }
  const source={...(snapshot.source||{}),semanticFingerprint:fingerprint};
  await session.prepare(`INSERT INTO v7_pv_shadow_snapshots
    (snapshot_id,symbol,market_date,observed_at,observation_type,schema_version,event_key,features_json,context_json,coverage_json,source_json,decision_impact,created_at)
    VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,0,?12)`)
    .bind(snapshot.snapshotId,snapshot.symbol,snapshot.marketDate,snapshot.observedAt,snapshot.observationType,snapshot.schemaVersion,snapshot.eventKey,
      JSON.stringify(snapshot.features),JSON.stringify(snapshot.context),JSON.stringify(snapshot.coverage),JSON.stringify(source),new Date().toISOString()).run();
  return {stored:true,fingerprint};
}

async function pvReadBaseline(env,symbol) {
  if(!env?.V7_DB) return null;
  await ensureD1Schema(env);
  const row=await env.V7_DB.withSession("first-primary").prepare("SELECT * FROM v7_pv_intraday_baselines WHERE symbol=?1").bind(String(symbol)).first();
  if(!row) return null;
  let parsed={};try{parsed=JSON.parse(row.slot_stats_json||"{}");}catch(_){parsed={};}
  return {...parsed,symbol:String(symbol),schemaVersion:row.schema_version,validSessions:Number(row.valid_sessions)||0,lastMarketDate:row.last_market_date||null,corporateActionResetAt:row.corporate_action_reset_at||null};
}

async function pvWriteBaseline(env,symbol,cache) {
  await ensureD1Schema(env);
  const sessions=(cache?.sessions||[]).slice(-PV_SHADOW_BASELINE_KEEP_SESSIONS);
  const lastMarketDate=sessions.at(-1)?.marketDate||null;
  const payload={schemaVersion:PV_SHADOW_SCHEMA_VERSION,source:"FUGLE_HISTORICAL_15M",timeframe:"15",slotTimezone:"Asia/Taipei",slots:PV_SHADOW_OBSERVABLE_SLOTS,sessions};
  await env.V7_DB.withSession("first-primary").prepare(`INSERT INTO v7_pv_intraday_baselines
    (symbol,schema_version,valid_sessions,last_market_date,slot_stats_json,corporate_action_reset_at,updated_at)
    VALUES(?1,?2,?3,?4,?5,?6,?7) ON CONFLICT(symbol) DO UPDATE SET
    schema_version=excluded.schema_version,valid_sessions=excluded.valid_sessions,last_market_date=excluded.last_market_date,
    slot_stats_json=excluded.slot_stats_json,corporate_action_reset_at=excluded.corporate_action_reset_at,updated_at=excluded.updated_at`)
    .bind(String(symbol),PV_SHADOW_SCHEMA_VERSION,sessions.length,lastMarketDate,JSON.stringify(payload),cache?.corporateActionResetAt||null,new Date().toISOString()).run();
  return {stored:true,validSessions:sessions.length,lastMarketDate};
}

async function pvFetchHistorical15(symbol,from,to,env) {
  const url=`https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/${symbol}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&timeframe=15&fields=open,high,low,close,volume&sort=asc`;
  const response=await fetchWithDeadline(url,{headers:{"X-API-KEY":env.FUGLE_API_KEY}});
  if(!response.ok) throw new Error(`${symbol} PV歷史15分K API錯誤 ${response.status}: ${await response.text()}`);
  return response.json();
}

async function pvBootstrapSymbol(env,plan,marketDate) {
  const symbol=String(plan?.symbol||"");
  let cache=await pvReadBaseline(env,symbol);
  if(cache?.schemaVersion===PV_SHADOW_SCHEMA_VERSION && Number(cache.validSessions)>=PV_SHADOW_MIN_HISTORY) return {symbol,skipped:true,validSessions:cache.validSessions};
  const raw=await pvFetchHistorical15(symbol,shiftDateString(marketDate,-180),shiftDateString(marketDate,-1),env);
  const sessions=pvNormalizeHistoricalSessions(raw,marketDate);
  const merged=pvMergeBaselineSessions(cache?.sessions||[],sessions,cache?.corporateActionResetAt||plan?.corporateActionResetAt||null);
  const saved=await pvWriteBaseline(env,symbol,{sessions:merged,corporateActionResetAt:cache?.corporateActionResetAt||plan?.corporateActionResetAt||null});
  return {symbol,skipped:false,...saved};
}

async function bootstrapPvShadowBaselinesSafe(env,plans,marketDate) {
  if(!pvShadowEnabled(env)) return {enabled:false,decisionImpact:false,skipped:true};
  if(!env?.V7_DB) return {enabled:true,decisionImpact:false,ok:false,error:"D1_UNAVAILABLE"};
  const formal=(plans||[]).filter(plan=>plan?.strategyPool!==AIDEEN_POOL_ID);
  const settled=await Promise.allSettled(formal.map(plan=>pvBootstrapSymbol(env,plan,marketDate)));
  const results=settled.map((item,index)=>item.status==="fulfilled"?item.value:{symbol:String(formal[index]?.symbol||""),error:String(item.reason)});
  return {enabled:true,decisionImpact:false,ok:results.every(x=>!x.error),requested:formal.length,bootstrapped:results.filter(x=>!x.skipped&&!x.error).length,results};
}

async function pvReadLatestSnapshot(env,symbol,type,beforeObservedAt) {
  const row=await env.V7_DB.withSession("first-primary").prepare(`SELECT features_json,context_json,market_date,event_key,observed_at
    FROM v7_pv_shadow_snapshots WHERE symbol=?1 AND observation_type=?2 AND observed_at<?3 ORDER BY observed_at DESC LIMIT 1`)
    .bind(String(symbol),type,beforeObservedAt).first();
  if(!row) return null;
  let features={},context={};try{features=JSON.parse(row.features_json||"{}");}catch(_){}try{context=JSON.parse(row.context_json||"{}");}catch(_){}
  return {...row,features,context};
}

function pvPriceCensored(bar,referenceClose) {
  const ref=positiveNumber(referenceClose);
  return ref!==null && (bar.high>=ref*1.099 || bar.low<=ref*0.901);
}

function pvIlliquidityWarning(plan) {
  if(plan?.liquidityException===true) return true;
  const lots=positiveNumber(plan?.avgVolume20Lots);
  if(lots===null) return false;
  return lots<((positiveNumber(plan?.formalClose)||0)>=THOUSAND_STOCK_PRICE?1000:300);
}

async function pvBuildIntradaySnapshot(env,result,scheduledTime) {
  const session=result?.pvShadow?.session15;
  const bar=session?.bars?.at(-1);
  if(!bar) return null;
  const symbol=String(result.symbol),marketDate=bar.marketDate||taiwanDate(Date.parse(bar.time));
  const baseline=await pvReadBaseline(env,symbol)||{sessions:[],validSessions:0,corporateActionResetAt:null};
  const stats=pvBaselineStats(baseline,marketDate,bar.slotKey);
  const referenceClose=positiveNumber(result?.quote?.previousClose);
  const unsupported=String(result?.plan?.marketStructure||"").toUpperCase()==="ESB";
  const resetAt=baseline?.corporateActionResetAt?String(baseline.corporateActionResetAt).slice(0,10):null;
  const dataInsufficient=stats.slotHistoryCount<PV_SHADOW_MIN_HISTORY || stats.rangeHistoryCount<PV_SHADOW_MIN_HISTORY || stats.cumulativeHistoryCount<PV_SHADOW_MIN_HISTORY;
  const guard=pvEvaluateGuards({invalidSourceData:session.coverageReasons?.includes("INVALID_SOURCE_DATA")||session.coverageReasons?.includes("MISSING_REQUIRED_SESSION_SLOT"),
    unsupportedMarketStructure:unsupported,corporateActionReset:!!resetAt&&stats.slotHistoryCount<PV_SHADOW_MIN_HISTORY,
    referencePriceUnresolved:bar.slotKey==="09:00"&&referenceClose===null,dataInsufficient,
    staleOrIncompleteBar:result?.executionData?.formal15Fresh===false,priceCensored:pvPriceCensored(bar,referenceClose),
    auctionMixed:bar.slotKey==="09:00",gapDominated:result?.plan?.pvGapDominated===true,illiquidityWarning:pvIlliquidityWarning(result?.plan),viStateUnknownConfounder:false});
  const response=pvComputeResponse(bar,stats,guard);
  const previous=await pvReadLatestSnapshot(env,symbol,"INTRADAY_15M",bar.time);
  const priorPersistence=previous?.features?.pvPersistenceDetail||null;
  const persistence=pvAdvancePersistence(priorPersistence,response.pvSlotRvol20,{scope:"INTRADAY_15M",symbol,observedAt:bar.time,comparable:guard.pvInterpretability!=="INVALID"});
  const previousAcceptance=previous?.context?.pvAcceptanceDetail||null;
  const previousBar=(session.bars||[]).at(-2)||null;
  const channel=pvChannel(result.plan);
  const acceptance=pvAdvanceAcceptance({symbol,marketDate,channel,bar,previousBar,plan:result.plan,previous:previousAcceptance,observedAt:bar.time});
  const anchorEligible=acceptance.transitioned && ((channel==="B"&&acceptance.state==="B_INITIAL_ACCEPTANCE")||(channel==="A"&&acceptance.state==="A_REACCELERATION"));
  const peak=positiveNumber(persistence.peakRvol);
  const features={
    pvDailyRvol20:null,pvSlotRvol20:response.pvSlotRvol20,pvCumvolPace20:response.pvCumvolPace20,
    pvSlotRangeExpansion20:response.pvSlotRangeExpansion20,pvSignedProgress20:response.pvSignedProgress20,pvBodyShare:response.pvBodyShare,
    pvPeakRvol:peak,pvCurrentToPeakRvolRatio:peak&&response.pvSlotRvol20!==null?response.pvSlotRvol20/peak:null,
    pvResponseState:response.pvResponseState,pvResponseDiagnosticSubstate:response.pvResponseDiagnosticSubstate,
    pvAcceptanceState:acceptance.state,pvPersistenceState:persistence.state,pvPersistenceDetail:persistence,
    pvGuardState:guard.pvGuardState,pvGuardFlags:guard.pvGuardFlags,pvInterpretability:guard.pvInterpretability,
    pvSessionPhase:pvSessionPhase(bar.slotKey),formalLocalVolumeRatio:toNumber(result?.frame15?.latest?.volumeRatio),decisionImpact:false
  };
  const context={...pvFormalContext(result),pvAcceptanceDetail:acceptance,anchorEligible,anchorChannel:channel,anchorClose:bar.close,anchorHigh:bar.high,
    anchorBarStart:bar.time,frozenPlanLevels:{buyLow:toNumber(result?.plan?.buyLow),buyHigh:toNumber(result?.plan?.buyHigh),breakout:toNumber(result?.plan?.breakout),maxChase:toNumber(result?.plan?.maxChase),stop:toNumber(result?.plan?.stop),profitCheck:toNumber(result?.plan?.profitCheck)}};
  const coverage={slotHistoryCount:stats.slotHistoryCount,dailyHistoryCount:0,cumulativeHistoryCount:stats.cumulativeHistoryCount,rangeHistoryCount:stats.rangeHistoryCount,
    baselineAsOfDate:stats.baselineAsOfDate,baselineSource:"FUGLE_HISTORICAL_15M_PRIOR_SESSIONS",coverageReasons:[...(session.coverageReasons||[]),...(dataInsufficient?["MIN_20_VALID_PRIOR_SESSIONS_NOT_MET"]:[])],corporateActionResetAt:stats.corporateActionResetAt};
  const source={sourceBarTimestamp:bar.time,barStart:bar.time,barEnd:new Date(Date.parse(bar.time)+15*60000).toISOString(),sourceFetchedAt:new Date(scheduledTime).toISOString(),sourceFamily:"FUGLE_INTRADAY_15M_LOTS",slotKey:bar.slotKey,completedBar:true,
    dailyIntradayRawCrossDivision:false,baselineVersion:PV_SHADOW_SCHEMA_VERSION};
  return {snapshotId:pvSnapshotIdentity(symbol,bar.time,"INTRADAY_15M"),schemaVersion:PV_SHADOW_SCHEMA_VERSION,symbol,marketDate,observedAt:bar.time,
    observationType:"INTRADAY_15M",eventKey:acceptance.eventKey||persistence.eventKey||null,features,context,coverage,source,decisionImpact:false};
}

function pvBuildSameSessionOutcome(snapshot,bars,horizon,sessionComplete=false) {
  const count=Number(String(horizon).replace("B",""));
  if(![1,2,4].includes(count)) throw new Error("PV same-session horizon must be B1/B2/B4");
  const context=snapshot?.context||{};
  const anchorDate=Number.isFinite(Date.parse(context.anchorBarStart))?taiwanDate(Date.parse(context.anchorBarStart)):null;
  const sessionBars=(bars||[]).filter(bar=>anchorDate&&taiwanDate(Date.parse(bar?.time))===anchorDate);
  const anchorIndex=sessionBars.findIndex(bar=>bar.time===context.anchorBarStart);
  if(anchorIndex<0) return null;
  const future=sessionBars.slice(anchorIndex+1,anchorIndex+1+count);
  if(future.length<count) return sessionComplete?{horizon,outcomeComplete:1,directionReturn:null,mfe:null,mae:null,rangeAtr:null,stopFirst:null,falseBreak:null,acceptanceResult:"INCOMPLETE_SESSION_END"}:null;
  const anchorClose=positiveNumber(context.anchorClose),anchorHigh=positiveNumber(context.anchorHigh)||anchorClose;
  if(anchorClose===null) return null;
  const levels=context.frozenPlanLevels||{},channel=context.anchorChannel||context.channel;
  let failure=null;
  for(const bar of future) {
    if(channel==="B" && ((positiveNumber(levels.breakout)!==null&&bar.close<levels.breakout*0.995)||(positiveNumber(levels.buyLow)!==null&&bar.close<levels.buyLow))) {failure="B_FAILED_REENTRY";break;}
    if(channel==="A" && ((positiveNumber(levels.buyLow)!==null&&bar.close<levels.buyLow)||(positiveNumber(levels.stop)!==null&&bar.close<levels.stop))) {failure=positiveNumber(levels.stop)!==null&&bar.close<levels.stop?"A_STOP_BROKEN":"A_ZONE_LOST";break;}
  }
  const maxHigh=Math.max(...future.map(x=>x.high)),minLow=Math.min(...future.map(x=>x.low));
  let acceptanceResult=failure;
  if(!acceptanceResult && !future.some(x=>x.close>anchorClose)) acceptanceResult=`${channel}_NO_CLOSE_PROGRESS_${horizon}`;
  if(!acceptanceResult && !future.some(x=>x.high>anchorHigh)) acceptanceResult=`${channel}_NO_HIGH_PROGRESS_${horizon}`;
  if(!acceptanceResult) acceptanceResult=`${channel}_FOLLOW_THROUGH_${horizon}`;
  const stop=positiveNumber(levels.stop),profit=positiveNumber(levels.profitCheck);
  let stopFirst=null;
  if(stop!==null) {
    stopFirst=0;
    for(const bar of future) {if(bar.low<=stop){stopFirst=1;break;}if(profit!==null&&bar.high>=profit) break;}
  }
  return {horizon,outcomeComplete:1,directionReturn:future.at(-1).close/anchorClose-1,mfe:maxHigh/anchorClose-1,mae:minLow/anchorClose-1,rangeAtr:null,
    stopFirst,falseBreak:failure?1:0,acceptanceResult};
}

async function pvOutcomeFingerprint(snapshotId,outcome) {
  return pvSha256Hex({snapshotId,horizon:outcome.horizon,directionReturn:outcome.directionReturn,mfe:outcome.mfe,mae:outcome.mae,rangeAtr:outcome.rangeAtr,
    stopFirst:outcome.stopFirst,falseBreak:outcome.falseBreak,acceptanceResult:outcome.acceptanceResult,outcomeComplete:outcome.outcomeComplete});
}

async function pvInsertOutcomeImmutable(env,snapshotId,outcome) {
  const session=env.V7_DB.withSession("first-primary");
  const fingerprint=await pvOutcomeFingerprint(snapshotId,outcome);
  const existing=await session.prepare("SELECT outcome_json,outcome_complete FROM v7_pv_outcomes WHERE snapshot_id=?1 AND horizon=?2").bind(snapshotId,outcome.horizon).first();
  if(existing) {
    let previous=null;try{previous=JSON.parse(existing.outcome_json||"{}").semanticFingerprint||null;}catch(_){}
    const action=pvDecideImmutableWrite(previous,fingerprint);
    return action==="DUPLICATE"?{stored:false,duplicate:true}:{stored:false,mutationConflict:true};
  }
  await session.prepare(`INSERT INTO v7_pv_outcomes(snapshot_id,horizon,completed_at,direction_return,mfe,mae,range_atr,stop_first,false_break,acceptance_result,outcome_complete,outcome_json)
    VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12)`)
    .bind(snapshotId,outcome.horizon,new Date().toISOString(),outcome.directionReturn,outcome.mfe,outcome.mae,outcome.rangeAtr,outcome.stopFirst,outcome.falseBreak,
      outcome.acceptanceResult,outcome.outcomeComplete,JSON.stringify({semanticFingerprint:fingerprint,decisionImpact:false})).run();
  return {stored:true};
}

async function pvFinalizeSameSessionOutcomes(env,snapshot,bars) {
  if(snapshot?.context?.anchorEligible!==true) {
    const rows=await env.V7_DB.withSession("first-primary").prepare(`SELECT snapshot_id,context_json FROM v7_pv_shadow_snapshots
      WHERE symbol=?1 AND market_date=?2 AND observation_type='INTRADAY_15M' ORDER BY observed_at ASC`).bind(snapshot.symbol,snapshot.marketDate).all();
    const candidates=[];
    for(const row of rows?.results||[]) {let context={};try{context=JSON.parse(row.context_json||"{}");}catch(_){}if(context.anchorEligible===true)candidates.push({snapshotId:row.snapshot_id,context});}
    let stored=0;
    for(const candidate of candidates) for(const horizon of ["B1","B2","B4"]) {
      const outcome=pvBuildSameSessionOutcome(candidate,bars,horizon,bars.at(-1)?.slotKey==="13:00");
      if(outcome && (await pvInsertOutcomeImmutable(env,candidate.snapshotId,outcome)).stored) stored+=1;
    }
    return {stored};
  }
  let stored=0;
  for(const horizon of ["B1","B2","B4"]) {
    const outcome=pvBuildSameSessionOutcome(snapshot,bars,horizon,bars.at(-1)?.slotKey==="13:00");
    if(outcome && (await pvInsertOutcomeImmutable(env,snapshot.snapshotId,outcome)).stored) stored+=1;
  }
  return {stored};
}

async function pvRollObservedSession(env,result) {
  const session=result?.pvShadow?.session15;
  if(session?.bars?.at(-1)?.slotKey!=="13:00") return {stored:false,reason:"SESSION_NOT_COMPLETE_IN_CURRENT_CRON"};
  const symbol=String(result.symbol),existing=await pvReadBaseline(env,symbol)||{sessions:[],corporateActionResetAt:null};
  const normalized={marketDate:session.marketDate,bars:session.bars.map(bar=>({slotKey:bar.slotKey,time:bar.time,open:bar.open,high:bar.high,low:bar.low,close:bar.close,volume:bar.volume,trueRange:bar.trueRange,cumulativeVolume:bar.cumulativeVolume,cumulativeValid:bar.cumulativeValid}))};
  const sessions=pvMergeBaselineSessions(existing.sessions||[],[normalized],existing.corporateActionResetAt||null);
  return pvWriteBaseline(env,symbol,{sessions,corporateActionResetAt:existing.corporateActionResetAt||null});
}

async function recordPvIntradayShadowSafe(env,results,scheduledTime,capture15) {
  if(!pvShadowEnabled(env)) return {enabled:false,schemaVersion:PV_SHADOW_SCHEMA_VERSION,decisionImpact:false,skipped:true};
  if(!capture15) return {enabled:true,schemaVersion:PV_SHADOW_SCHEMA_VERSION,decisionImpact:false,skipped:true,reason:"NO_NEW_COMPLETED_15M_BAR"};
  if(!env?.V7_DB) return {enabled:true,schemaVersion:PV_SHADOW_SCHEMA_VERSION,decisionImpact:false,ok:false,error:"D1_UNAVAILABLE"};
  const details=[];let stored=0,duplicates=0,conflicts=0,outcomes=0;
  for(const result of results||[]) {
    if(!result?.ok || result?.plan?.strategyPool===AIDEEN_POOL_ID) continue;
    try {
      const snapshot=await pvBuildIntradaySnapshot(env,result,scheduledTime);
      if(!snapshot) continue;
      const save=await pvInsertSnapshotImmutable(env,snapshot);
      if(save.stored) stored+=1;if(save.duplicate) duplicates+=1;if(save.mutationConflict) conflicts+=1;
      const finalized=await pvFinalizeSameSessionOutcomes(env,snapshot,result.pvShadow.session15.bars);outcomes+=finalized.stored||0;
      const rolled=await pvRollObservedSession(env,result);
      details.push({symbol:result.symbol,snapshotId:snapshot.snapshotId,save,rolled});
    } catch(error) {details.push({symbol:result?.symbol,error:String(error).slice(0,300)});}
  }
  return {enabled:true,schemaVersion:PV_SHADOW_SCHEMA_VERSION,mode:"LOG_ONLY",decisionImpact:false,formalCoreImpact:false,stored,duplicates,mutationConflicts:conflicts,outcomesStored:outcomes,details,
    zeroPvPushes:true,zeroPvActions:true};
}

function pvBuildDailyFeature(history,marketDate) {
  const rows=(Array.isArray(history)?history:[]).filter(x=>x?.date&&positiveNumber(x?.volumeShares)!==null).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const current=rows.find(x=>x.date===marketDate)||null;
  const prior=rows.filter(x=>x.date<marketDate).slice(-PV_SHADOW_MIN_HISTORY);
  const median=prior.length>=PV_SHADOW_MIN_HISTORY?pvMedian(prior.map(x=>x.volumeShares)):null;
  return {current,prior,dailyHistoryCount:prior.length,pvDailyRvol20:current&&median>0?current.volumeShares/median:null,median};
}

async function pvRecordDailySnapshot(env,plan,marketDate,history) {
  const symbol=String(plan.symbol),daily=pvBuildDailyFeature(history,marketDate);
  const observedAt=`${marketDate}T13:30:00+08:00`;
  // Exclude the immutable current snapshot on retries so persistence remains deterministic.
  const previous=await pvReadLatestSnapshot(env,symbol,"AFTER_MARKET",observedAt);
  const guard=pvEvaluateGuards({invalidSourceData:!daily.current,dataInsufficient:daily.dailyHistoryCount<PV_SHADOW_MIN_HISTORY,unsupportedMarketStructure:String(plan?.marketStructure||"").toUpperCase()==="ESB"});
  const persistence=pvAdvancePersistence(previous?.features?.pvPersistenceDetail||null,daily.pvDailyRvol20,{scope:"AFTER_MARKET",symbol,observedAt,comparable:guard.pvInterpretability!=="INVALID"});
  const features={pvDailyRvol20:daily.pvDailyRvol20,pvSlotRvol20:null,pvCumvolPace20:null,pvSlotRangeExpansion20:null,pvSignedProgress20:null,pvBodyShare:null,
    pvPeakRvol:persistence.peakRvol??null,pvCurrentToPeakRvolRatio:persistence.peakRvol&&daily.pvDailyRvol20!==null?daily.pvDailyRvol20/persistence.peakRvol:null,
    pvResponseState:"UNKNOWN",pvAcceptanceState:"UNKNOWN",pvPersistenceState:persistence.state,pvPersistenceDetail:persistence,
    pvGuardState:guard.pvGuardState,pvGuardFlags:guard.pvGuardFlags,pvInterpretability:guard.pvInterpretability,pvSessionPhase:"AFTER_MARKET",formalLocalVolumeRatio:null,decisionImpact:false};
  const anchorClose=positiveNumber(daily.current?.close)||positiveNumber(plan.formalClose);
  const context={...pvFormalContext(plan),anchorEligible:anchorClose!==null,anchorChannel:pvChannel(plan),anchorClose,anchorHigh:positiveNumber(daily.current?.high)||anchorClose,
    anchorBarStart:observedAt,frozenPlanLevels:{buyLow:toNumber(plan.buyLow),buyHigh:toNumber(plan.buyHigh),breakout:toNumber(plan.breakout),maxChase:toNumber(plan.maxChase),stop:toNumber(plan.stop),profitCheck:toNumber(plan.profitCheck)}};
  return pvInsertSnapshotImmutable(env,{snapshotId:pvSnapshotIdentity(symbol,observedAt,"AFTER_MARKET"),schemaVersion:PV_SHADOW_SCHEMA_VERSION,symbol,marketDate,observedAt,
    observationType:"AFTER_MARKET",eventKey:persistence.eventKey||null,features,context,
    coverage:{slotHistoryCount:0,dailyHistoryCount:daily.dailyHistoryCount,baselineAsOfDate:daily.prior.at(-1)?.date||null,baselineSource:"V7_D1_DAILY_HISTORY_SHARES",coverageReasons:daily.dailyHistoryCount<PV_SHADOW_MIN_HISTORY?["MIN_20_VALID_PRIOR_DAILY_SESSIONS_NOT_MET"]:[],corporateActionResetAt:null},
    source:{sourceBarTimestamp:marketDate,barStart:marketDate,barEnd:marketDate,sourceFetchedAt:new Date().toISOString(),sourceFamily:"FUGLE_HISTORICAL_DAILY_SHARES",completedBar:true,dailyIntradayRawCrossDivision:false,baselineVersion:PV_SHADOW_SCHEMA_VERSION},decisionImpact:false});
}

function pvFutureTradingRows(history,marketDate,count) {
  const byDate=new Map((history||[]).filter(x=>x?.date).map(x=>[String(x.date),x]));
  const future=[];
  let cursor=marketDate;
  for(let index=0;index<count;index+=1) {
    cursor=nextTradingDate(cursor);
    const row=byDate.get(cursor);
    if(!row) return null;
    future.push(row);
  }
  return future;
}

function pvBuildDailyOutcome(snapshot,history,horizon) {
  const nextSession=horizon==="NEXT_OPEN"||horizon==="NEXT_SESSION";
  const count=nextSession?1:Number(String(horizon).replace("D",""));
  if(!nextSession && ![1,3,5,10].includes(count)) throw new Error("PV daily horizon must be NEXT_OPEN/NEXT_SESSION/D1/D3/D5/D10");
  const future=pvFutureTradingRows(history,snapshot.marketDate,count);
  if(!future || future.some(x=>positiveNumber(x?.close)===null||positiveNumber(x?.high)===null||positiveNumber(x?.low)===null)) return null;
  const anchor=positiveNumber(snapshot?.context?.anchorClose);if(anchor===null)return null;
  if(horizon==="NEXT_OPEN") {
    const open=positiveNumber(future[0]?.open);
    if(open===null)return null;
    return {horizon,outcomeComplete:1,directionReturn:open/anchor-1,mfe:null,mae:null,rangeAtr:null,stopFirst:null,falseBreak:null,acceptanceResult:"NEXT_OPEN_RETURN"};
  }
  const levels=snapshot.context?.frozenPlanLevels||{},channel=snapshot.context?.anchorChannel||snapshot.context?.channel;
  let failure=null;for(const bar of future){if(channel==="B"&&((positiveNumber(levels.breakout)!==null&&bar.close<levels.breakout*0.995)||(positiveNumber(levels.buyLow)!==null&&bar.close<levels.buyLow))){failure="B_FAILED_REENTRY";break;}if(channel==="A"&&((positiveNumber(levels.buyLow)!==null&&bar.close<levels.buyLow)||(positiveNumber(levels.stop)!==null&&bar.close<levels.stop))){failure="A_FAILED_REENTRY";break;}}
  const stop=positiveNumber(levels.stop),profit=positiveNumber(levels.profitCheck);let stopFirst=stop===null?null:0;
  if(stop!==null)for(const bar of future){if(bar.low<=stop){stopFirst=1;break;}if(profit!==null&&bar.high>=profit)break;}
  return {horizon,outcomeComplete:1,directionReturn:future.at(-1).close/anchor-1,mfe:Math.max(...future.map(x=>x.high))/anchor-1,mae:Math.min(...future.map(x=>x.low))/anchor-1,
    rangeAtr:null,stopFirst,falseBreak:failure?1:0,acceptanceResult:failure||(horizon==="NEXT_SESSION"?`${channel}_NEXT_SESSION`:`${channel}_DAILY_${horizon}`)};
}

async function pvFinalizeDailyOutcomes(env,cachedHistory,marketDate) {
  const from=shiftDateString(marketDate,-45);
  const rows=await env.V7_DB.withSession("first-primary").prepare(`SELECT snapshot_id,symbol,market_date,context_json FROM v7_pv_shadow_snapshots
    WHERE market_date>=?1 AND market_date<?2 ORDER BY market_date ASC,observed_at ASC`).bind(from,marketDate).all();
  let stored=0;
  for(const row of rows?.results||[]) {
    const history=cachedHistory?.[row.symbol];if(!Array.isArray(history))continue;
    let context={};try{context=JSON.parse(row.context_json||"{}");}catch(_){}if(context.anchorEligible!==true)continue;
    const snapshot={marketDate:row.market_date,context};
    for(const horizon of ["NEXT_OPEN","NEXT_SESSION","D1","D3","D5","D10"]){const outcome=pvBuildDailyOutcome(snapshot,history,horizon);if(outcome&&(await pvInsertOutcomeImmutable(env,row.snapshot_id,outcome)).stored)stored+=1;}
  }
  return {stored};
}

async function recordPvDailyShadowSafe(env,plans,marketDate,cachedHistory) {
  if(!pvShadowEnabled(env)) return {enabled:false,schemaVersion:PV_SHADOW_SCHEMA_VERSION,decisionImpact:false,skipped:true};
  if(!env?.V7_DB) return {enabled:true,decisionImpact:false,ok:false,error:"D1_UNAVAILABLE"};
  const details=[];let stored=0;
  for(const plan of plans||[]) {if(plan?.strategyPool===AIDEEN_POOL_ID)continue;try{const save=await pvRecordDailySnapshot(env,plan,marketDate,cachedHistory?.[plan.symbol]||[]);if(save.stored)stored+=1;details.push({symbol:plan.symbol,save});}catch(error){details.push({symbol:plan?.symbol,error:String(error).slice(0,300)});}}
  let outcomes={stored:0};try{outcomes=await pvFinalizeDailyOutcomes(env,cachedHistory,marketDate);}catch(error){outcomes={stored:0,error:String(error).slice(0,300)};}
  return {enabled:true,schemaVersion:PV_SHADOW_SCHEMA_VERSION,mode:"LOG_ONLY",decisionImpact:false,formalCoreImpact:false,stored,outcomesStored:outcomes.stored||0,details,zeroPvPushes:true,zeroPvActions:true};
}

function pvFormalFingerprintPayload(result) {
  const plan=result?.plan||{};
  return {symbol:result?.symbol,sourceRank:plan.sourceRank??null,displayRank:result?.displayRank??null,
    plan:{channel:plan.channel??null,mode:plan.mode??null,buyLow:plan.buyLow??null,buyHigh:plan.buyHigh??null,breakout:plan.breakout??null,maxChase:plan.maxChase??null,stop:plan.stop??null,profitCheck:plan.profitCheck??null,positionStage:plan.positionStage??null,totalAllocation:plan.totalAllocation??null,firstAmount:plan.firstAmount??null,secondAmount:plan.secondAmount??null},
    finalDecision:result?.finalDecision??null,pullback:result?.pullback??null,momentum10:result?.momentum10??null,momentum15:result?.momentum15??null,
    signals:result?.ok?evaluateOperationSignals(result).map(x=>({type:x.type,amount:x.amount??null,shares:x.shares??null})):[]};
}

'''

insert_before_once(
    'async function analyzeStockSmart(stock, env, previousResult, need10, need15, forceFrames) {',
    helpers,
    "PV Shadow helpers",
)

replace_once(
    '''    let frame10 = previousResult?.frame10 || { timeframe: 10, completedBars: 0, latest: null, previous: null, recent: [] };
    let frame15 = previousResult?.frame15 || { timeframe: 15, completedBars: 0, latest: null, previous: null, recent: [] };''',
    '''    let frame10 = previousResult?.frame10 || { timeframe: 10, completedBars: 0, latest: null, previous: null, recent: [] };
    let frame15 = previousResult?.frame15 || { timeframe: 15, completedBars: 0, latest: null, previous: null, recent: [] };
    const pvEnabled=pvShadowEnabled(env);
    let pvSession15=pvEnabled ? (previousResult?.pvShadow?.session15 || {marketDate:taiwanDate(),bars:[],coverageReasons:[]}) : null;''',
    "PV sidecar initialization",
)

replace_once(
    '''        if (labels[i] === 10) frame10 = analyzeFrame(raw, 10);
        if (labels[i] === 15) frame15 = analyzeFrame(raw, 15);''',
    '''        if (labels[i] === 10) frame10 = analyzeFrame(raw, 10);
        if (labels[i] === 15) {
          frame15 = analyzeFrame(raw, 15);
          if(pvEnabled) pvSession15=pvExtractCompletedSession15(raw,Date.now(),quote?.previousClose);
        }''',
    "PV completed 15m sidecar",
)

replace_once(
    '''      frame10, frame15, pullback, momentum10, momentum15, stop, profit, finalDecision,executionData,
      monitorStatus: buildMonitorStatus(finalDecision),''',
    '''      frame10, frame15, pullback, momentum10, momentum15, stop, profit, finalDecision,executionData,
      ...(pvEnabled?{pvShadow:{schemaVersion:PV_SHADOW_SCHEMA_VERSION,decisionImpact:false,session15:pvSession15}}:{}),
      monitorStatus: buildMonitorStatus(finalDecision),''',
    "PV result sidecar",
)

replace_once(
    '''  const executionResearchRecorder = await recordProspectiveExecutionShadow(env,results,scheduledTime,notifications);
  return {...kvSummary,executionResearchRecorder};''',
    '''  const executionResearchRecorder = await recordProspectiveExecutionShadow(env,results,scheduledTime,notifications);
  // PV_SHADOW_V0_1 runs only after every Formal signal/push/live-state path completed.
  // Its fail-open result is metadata only; it cannot change actions, ranking or delivery.
  const pvShadow = await recordPvIntradayShadowSafe(env,results,scheduledTime,forceFrames||need15);
  return {...kvSummary,executionResearchRecorder,pvShadow};''',
    "PV post-Formal monitor hook",
)

replace_once(
    '''  let report = /** @type {any} */ ({ sent: false, simulated: true, skipped: dryRun });''',
    '''  let report = /** @type {any} */ ({ sent: false, simulated: true, skipped: dryRun });
  let pvShadowBootstrap = /** @type {any} */ ({enabled:pvShadowEnabled(env),decisionImpact:false,skipped:true,reason:dryRun?"dry-run":"not-run"});
  let pvShadowDaily = /** @type {any} */ ({enabled:pvShadowEnabled(env),decisionImpact:false,skipped:true,reason:dryRun?"dry-run":"not-run"});''',
    "PV after-market status variables",
)

replace_once(
    '''    await env.STOCKS_KV.put(reportKey, JSON.stringify(report), { expirationTtl: 30 * 86400 });''',
    '''    await env.STOCKS_KV.put(reportKey, JSON.stringify(report), { expirationTtl: 30 * 86400 });
    // Class-A LOG_ONLY starts only after the Formal plan, bridge and daily push are complete.
    // Any bootstrap/snapshot failure is contained and cannot affect Formal completion.
    try { pvShadowBootstrap=await bootstrapPvShadowBaselinesSafe(env,stocks,marketDate); }
    catch(error) { pvShadowBootstrap={enabled:pvShadowEnabled(env),decisionImpact:false,ok:false,error:String(error).slice(0,300)}; }
    try { pvShadowDaily=await recordPvDailyShadowSafe(env,stocks,marketDate,cachedHistory); }
    catch(error) { pvShadowDaily={enabled:pvShadowEnabled(env),decisionImpact:false,ok:false,error:String(error).slice(0,300)}; }''',
    "PV post-Formal after-market hooks",
)

replace_once(
    '''    researchExternalEvidence: {
      saved: researchEvidenceSave?.saved || 0,''',
    '''    pvShadow:{schemaVersion:PV_SHADOW_SCHEMA_VERSION,mode:"LOG_ONLY",decisionImpact:false,formalCoreImpact:false,enabled:pvShadowEnabled(env),bootstrap:pvShadowBootstrap,daily:pvShadowDaily},
    researchExternalEvidence: {
      saved: researchEvidenceSave?.saved || 0,''',
    "PV after-market summary",
)

path.write_text(text, encoding="utf-8")
print("Applied V8.11.0 PV_SHADOW_V0_1 Class-A LOG_ONLY")
