// P0 FREE research-only CPU sharding oracle. This is NOT a deployed monitor.
// Pure deterministic plan + fail-closed 9-symbol epoch merge. No reads, writes, signals or push.
const code=x=>String(x?.symbol??x?.plan?.symbol??"").trim();
const isCode=s=>/^[1-9][0-9]{3}$/.test(s);
export function buildIndependentMonitorShards({formal,aideen,shardSize=3}={}){
 if(!Array.isArray(formal)||!Array.isArray(aideen)||
    !Number.isSafeInteger(shardSize)||shardSize<1||shardSize>3)
   throw Error("INVALID_CPU_SHARD_INPUT");
 const names=["FORMAL","AIDEEN_APP"];
 const entries=[...formal.map(x=>({pool:names[0],symbol:code(x)})),
                ...aideen.map(x=>({pool:names[1],symbol:code(x)}))];
 const keys=entries.map(x=>x.pool+":"+x.symbol);
 if(formal.length!==5||aideen.length!==4||entries.some(x=>!isCode(x.symbol))||
    new Set(keys).size!==keys.length)
   throw Error("PROTECTED_FORMAL5_AIDEEN4_POPULATION_NOT_EXACT");
 const groups=[];
 for(let i=0;i<entries.length;i+=shardSize)groups.push(entries.slice(i,i+shardSize));
 if(groups.some(x=>x.length>shardSize)||groups.flat().length!==9||
    new Set(groups.flat().map(x=>x.pool+":"+x.symbol)).size!==9)
   throw Error("INVALID_SHARD_PARTITION");
 return Object.freeze({schema:"S1_P0_FREE_CPU_SHARD_ORACLE_V0_1",
  expectedKeys:keys,groups,shardSize,cycles:groups.length,
  maxConsecutiveMinutesWithoutQuote:groups.length,
  originalWorkerQuoteFreshSeconds:90,
  sequentialOneCronRotationMeets90SecondFreshness:groups.length*60<=90,
  noOriginalCronMutation:true,noBusinessStrategyMutation:true,
  noOfficialPlanWrite:true,noD1Write:true,noKVWrite:true,noTrade:true,noPush:true,
  notAuthorizedForProduction:true});
}
export function chooseBoundedShard({plan,minuteOfDay}={}){
 if(!plan||!Array.isArray(plan.groups)||!Number.isInteger(minuteOfDay)||minuteOfDay<0||minuteOfDay>=1440)
  throw Error("SHARD_CADENCE_UNVERIFIED");
 const index=minuteOfDay%plan.groups.length;
 return {index,entries:plan.groups[index],expectedKeys:plan.expectedKeys,
   id:"same-trading-day-single-shard-"+index,noSourceMutation:true};
}
export function auditShardAggregate({plan,tradeDate,now,prior,updates,maxAgeSeconds=90}={}){
 if(!plan?.notAuthorizedForProduction||!Array.isArray(plan.expectedKeys)||
   !/^\d{4}-\d{2}-\d{2}$/.test(String(tradeDate||""))||
   !Number.isFinite(Date.parse(now))||
   !Number.isInteger(maxAgeSeconds)||maxAgeSeconds<1||maxAgeSeconds>90)
  throw Error("AGGREGATE_EPOCH_OR_CLOCK_UNVERIFIED");
 const expected=new Set(plan.expectedKeys),merged=new Map();
 const all=[...(Array.isArray(prior)?prior:[]),...(Array.isArray(updates)?updates:[])];
 let rejected=[];
 for(const row of all){
  const k=String(row?.pool||row?.plan?.strategyPool||"FORMAL")+":"+code(row);
  if(!expected.has(k)){rejected.push({key:k,reason:"UNKNOWN_POOL_IDENTITY"});continue;}
  const micros=Number(row?.quote?.lastUpdated);
  const timeMs=Number.isFinite(micros)&&micros>=1e14&&micros<1e17?Math.trunc(micros/1000):NaN;
  const age=Math.round((Date.parse(now)-timeMs)/1000);
  const dateValid=Number.isFinite(timeMs)&&new Intl.DateTimeFormat("en-CA",{
   timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"
  }).format(new Date(timeMs))===tradeDate;
  const valid=Boolean(row?.ok===true&&row?.tradeDate===tradeDate&&
    dateValid&&age>=-60&&age<=maxAgeSeconds&&row?.quote?.isTrial!==true&&
    row?.executionData?.quoteFresh===true);
  if(!valid){rejected.push({key:k,reason:"MISSING_OR_STALE_OR_TRIAL_VENDOR_EVIDENCE"});continue;}
  const previous=merged.get(k);
  if(!previous||timeMs>previous.timeMs)merged.set(k,{key:k,row,timeMs,ageSeconds:age});
  if(previous&&timeMs===previous.timeMs&&JSON.stringify(previous.row)!==JSON.stringify(row))
   rejected.push({key:k,reason:"SAME_TIMESTAMP_CONFLICT_NOT_ATOMIC"});
 }
 const missing=plan.expectedKeys.filter(k=>!merged.has(k));
 const ok=missing.length===0&&rejected.length===0&&merged.size===plan.expectedKeys.length;
 return {schema:"S1_P0_FREE_SHARD_AGGREGATE_OFFLINE_V0_1",
   tradeDate,readyForCandidateValidationOnly:ok,
   mayPublishToFormalLive:false,maySendPush:false,officialSelectionDone:false,
   expectedCount:plan.expectedKeys.length,confirmedCount:merged.size,
   missingKeys:missing,rejected,
   oldestVendorAgeSeconds:merged.size?Math.max(...[...merged.values()].map(x=>x.ageSeconds)):null,
   originalWorkerQuoteFreshSeconds:90,neverLoosenQuoteClock:true,
   noD1Write:true,noKVWrite:true,noTrade:true,notProductionAuthorized:true};
}
