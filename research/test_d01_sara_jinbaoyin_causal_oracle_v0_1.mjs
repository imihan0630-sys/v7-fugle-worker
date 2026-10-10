import assert from "node:assert/strict";
import {smaAt,gateCompletedBars,computeGeometry,derivePriorStockTrend,
  classifyOpportunity,denominatorSummary} from "./d01_sara_jinbaoyin_causal_oracle_v0_1.mjs";

const base=Date.parse("2026-01-01T00:00:00+08:00"),hour=3600000,day=86400000;
const iso=v=>new Date(v).toISOString();
const signalAt=iso(base+245*hour+5000);
const pullbackStart="2026-01-01T00:00:00+08:00";
function bars() {
  return Array.from({length:245},(_,i)=>{
    const c=i<125?160:i<180?150+(105-150)*(i-125)/55:i<211?80+(i-180)*.35:90+(i-211)*.5;
    const end=base+(i+1)*hour;
    return {endAt:iso(end),availableAt:iso(end+1000),complete:true,
      open:c,high:c+1,low:i>=242?92.9:c-1,close:c};
  });
}
function dailies(direction="UP"){
  const b=Date.parse("2025-10-01T00:00:00+08:00");
  return Array.from({length:80},(_,i)=>{
    const c=direction==="UP"?80+i*.5:direction==="DOWN"?140-i*.5:100;
    const end=b+(i+1)*day;return {endAt:iso(end),availableAt:iso(end+500),
      complete:true,close:c};
  });
}
const validSource={asOf:signalAt,barBucketContractVerified:true,historyCoverageComplete:true,
   lifecycleEligible:true,priceSpace:"RAW_EXECUTION",adjustmentVintageCertified:false};
const gate=more=>gateCompletedBars({bars:bars(),...validSource,...more});
const q={securityIdentity:"SEC_TPEX_EXAMPLE",structuralRootId:"ROOT_01",pullbackStart,
  pullbackWitnessAvailable:true,marketBullKnown:true,marketBull:true};
const trend=direction=>derivePriorStockTrend({dailyBars:dailies(direction),pullbackStart,asOf:signalAt,
  dailyCoverageComplete:true});
const geom=()=>computeGeometry(gate().prefix);
const classify=(category="UP",more={})=>classifyOpportunity({geometry:geom(),
  priorTrend:trend(category),...q,...more});
const tests=[];
const check=(name,fn)=>tests.push([name,fn]);
check("60m input certified with enough physical bars",()=>assert.equal(gate().state,"INPUT_CERTIFIED"));
check("MA240 true 60m rolling window, not daily",()=>assert.ok(smaAt(bars(),240)>120));
check("warmup 244 insufficient for 240 and 5 slope",()=>assert.equal(gate({bars:bars().slice(1)}).reason,"WARMUP_240_AND_SLOPE_INSUFFICIENT"));
check("short source history blocked",()=>assert.equal(gate({bars:bars().slice(-90)}).state,"UNKNOWN_BLOCKED"));
check("unverified provider bucket blocked",()=>assert.equal(gate({barBucketContractVerified:false}).reason,"60M_BUCKET_CONTRACT_UNKNOWN"));
check("partial source coverage blocked",()=>assert.equal(gate({historyCoverageComplete:false}).reason,"SOURCE_COVERAGE_UNKNOWN"));
check("symbol lifecycle unknown blocked",()=>assert.equal(gate({lifecycleEligible:null}).reason,"LIFECYCLE_UNKNOWN_OR_INELIGIBLE"));
check("unknown price space blocked",()=>assert.equal(gate({priceSpace:"ADJUSTED"}).reason,"PRICE_SPACE_UNKNOWN"));
check("PIT-adjusted history requires certified vintage",()=>assert.equal(gate({priceSpace:"TECHNICAL_CONTINUITY",adjustmentVintageCertified:false}).reason,"ADJUSTMENT_VINTAGE_UNKNOWN"));
check("PIT-adjusted certified inputs admitted",()=>assert.equal(gate({priceSpace:"TECHNICAL_CONTINUITY",adjustmentVintageCertified:true}).state,"INPUT_CERTIFIED"));
check("bad cutoff not silently accepted",()=>assert.equal(gate({asOf:"bad"}).reason,"CUTOFF_INVALID"));
check("future appended bar does not change prefix",()=>{
 let bs=bars(),e=base+246*hour;bs.push({endAt:iso(e),availableAt:iso(e+1000),complete:true,open:900,high:901,low:899,close:900});
 assert.deepEqual(gate({bars:bs}).prefix,gate().prefix);
});
check("partial bar in past is blocked",()=>{let x=bars();x.at(-1).complete=false;assert.equal(gate({bars:x}).reason,"PARTIAL_BAR_AT_CUTOFF");});
check("availability after decision blocked",()=>{let x=bars();x.at(-1).availableAt=iso(base+250*hour);assert.equal(gate({bars:x}).reason,"BAR_NOT_CAUSALLY_AVAILABLE");});
check("future revision of old bar blocked",()=>{let x=bars();x[125].availableAt=iso(base+260*hour);assert.equal(gate({bars:x}).reason,"BAR_NOT_CAUSALLY_AVAILABLE");});
check("duplicate end timestamps blocked",()=>{let x=bars();x[100].endAt=x[99].endAt;assert.equal(gate({bars:x}).reason,"BAR_ORDER_OR_DUPLICATE");});
check("unordered completed bars blocked",()=>{let x=bars();[x[100],x[101]]=[x[101],x[100]];assert.equal(gate({bars:x}).reason,"BAR_ORDER_OR_DUPLICATE");});
check("bad ohlc contradictory close blocked",()=>{let x=bars();x[100].high=x[100].close-5;assert.equal(gate({bars:x}).reason,"OHLC_INVALID");});
check("bad ohlc non-positive close blocked",()=>{let x=bars();x[100].close=0;assert.equal(gate({bars:x}).reason,"OHLC_INVALID");});
check("strict research geometry hits synthetic candidate",()=>assert.equal(geom().ready,true));
check("strict proxy not claimed as author source code",()=>assert.equal(geom().proxyVersion,"JBY_RESEARCH_STRICT_A_V0_1"));
check("strict geometry includes long-MA overhead",()=>assert.equal(geom().flags.longOverhead,true));
check("MA60 is rising causally",()=>assert.equal(geom().flags.lowerRising,true));
check("retest witness is necessary under strict proxy",()=>{
let x=bars();for(let i=x.length-5;i<x.length;i++)x[i].low=x[i].close-1;
assert.equal(computeGeometry(x).flags.nearSupport,false);
});
check("long MA no longer overhead means not same proxy",()=>{
let x=bars();for(let i=0;i<125;i++){x[i].close=80;x[i].open=80;x[i].low=79;x[i].high=81;}
assert.equal(computeGeometry(x).ready,false);
});
check("daily higher timeframe prior trend T as of pullback start",()=>assert.equal(trend("UP").category,"PRIOR_UPTREND"));
check("daily higher timeframe prior trend B as of pullback start",()=>assert.equal(trend("DOWN").category,"PRIOR_DOWNTREND"));
check("daily mixed trend explicit",()=>assert.equal(trend("FLAT").category,"MIXED"));
check("daily future bars never enter frozen trend",()=>{
  let orig=trend("UP");let x=dailies("UP");x.push({endAt:"2026-02-01T12:00:00+08:00",availableAt:"2026-02-01T12:00:01+08:00",complete:true,close:9999});
  let t=derivePriorStockTrend({dailyBars:x,pullbackStart,asOf:signalAt,dailyCoverageComplete:true});
  assert.deepEqual(orig,t);
});
check("missing daily history blocked",()=>assert.equal(derivePriorStockTrend({dailyBars:dailies("UP").slice(25),pullbackStart,asOf:signalAt,dailyCoverageComplete:true}).reason,"DAILY_TREND_WARMUP_INSUFFICIENT"));
check("late revision before pullback is blocked",()=>{
  let x=dailies("UP");x[25].availableAt="2026-01-05T12:00:00+08:00";
  assert.equal(derivePriorStockTrend({dailyBars:x,pullbackStart,asOf:signalAt,dailyCoverageComplete:true}).reason,"DAILY_BAR_NOT_KNOWN_AT_PULLBACK");
});
check("missing daily coverage unknown, not flat",()=>assert.equal(derivePriorStockTrend({dailyBars:dailies(),pullbackStart,asOf:signalAt,dailyCoverageComplete:false}).reason,"DAILY_COVERAGE_UNKNOWN"));
check("uptrend pullback assigned cohort T",()=>assert.equal(classify("UP").cohort,"T_TREND_PULLBACK"));
check("downtrend reversal assigned cohort B",()=>assert.equal(classify("DOWN").cohort,"B_BOTTOM_REVERSAL"));
check("market bull but neutral stock assigned M only",()=>assert.equal(classify("FLAT").cohort,"M_MARKET_BULL_ONLY"));
check("market bearish and stock mixed is UNKNOWN",()=>assert.equal(classify("FLAT",{marketBull:false}).state,"UNKNOWN_BLOCKED"));
check("market regime unknown and stock mixed is UNKNOWN",()=>assert.equal(classify("FLAT",{marketBullKnown:false}).reason,"TREND_OR_MARKET_CONTEXT_AMBIGUOUS"));
check("T requires observable actual pullback witness",()=>assert.equal(classify("UP",{pullbackWitnessAvailable:null}).reason,"PULLBACK_WITNESS_UNKNOWN"));
check("unknown security identity blocked",()=>assert.equal(classify("UP",{securityIdentity:null}).reason,"EPISODE_IDENTITY_UNKNOWN"));
check("same structural root and pullbackStart stable episode",()=>assert.equal(classify("UP").episodeId,classify("UP").episodeId));
check("episode differing root is distinct",()=>assert.notEqual(classify("UP").episodeId,classify("UP",{structuralRootId:"ROOT_02"}).episodeId));
check("invalid geometry is not assumed strategy signal",()=>assert.equal(classify("UP",{geometry:{state:"GEOMETRY_EVALUATED",ready:false}}).state,"NOT_GOLD_WRAPPED_SILVER_PROXY"));
check("unknown source geometry blocks classification",()=>assert.equal(classify("UP",{geometry:{state:"UNKNOWN_BLOCKED"}}).reason,"GEOMETRY_OR_TREND_UNVERIFIED"));
check("denominator retains unknown and repeated signals",()=>{
 let t=classify("UP");let b=classify("DOWN",{structuralRootId:"ROOT_02"});let m=classify("FLAT",{structuralRootId:"ROOT_03"});
 let r=denominatorSummary([t,t,b,m,{state:"UNKNOWN_BLOCKED"},{state:"NOT_GOLD_WRAPPED_SILVER_PROXY"}]);
 assert.equal(r.total,6);assert.equal(r.uniqueEpisodes,3);assert.equal(r.duplicates,1);
 assert.equal(r.unknown,1);assert.equal(r.nonSignals,1);
 assert.deepEqual(r.cohorts,{T_TREND_PULLBACK:1,B_BOTTOM_REVERSAL:1,M_MARKET_BULL_ONLY:1});
});
check("missing episodeID counted as unknown not success",()=>{
 let r=denominatorSummary([{state:"COHORT_ASSIGNED",cohort:"T_TREND_PULLBACK"}]);
 assert.equal(r.unknown,1);assert.equal(r.uniqueEpisodes,0);
});
check("denominator does not compute return or win rate",()=>{
 let r=denominatorSummary([classify("UP")]);assert.equal("winRate" in r,false);
});
let passed=0,failed=[];
for(const [name,fn] of tests){
 try{fn();passed++;console.log("PASS "+name);}
 catch(e){failed.push({name,error:e.message});console.error("FAIL "+name+": "+e.message);}
}
console.log(JSON.stringify({suite:"D01 Sara JBY causal research only",pass:passed,total:tests.length,fail:failed.length,failed}));
if(failed.length)process.exitCode=1;
