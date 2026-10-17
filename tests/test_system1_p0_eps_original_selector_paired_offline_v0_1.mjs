// Real original selectTomorrowCandidates FUNCTION BODY, synthetic fixture inputs.
// This is a bounded deterministic selector topology/re-ranking test; not a
// real same-day official-source/PIT/Cloudflare/full-market/Formal acceptance.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {runInNewContext} from "node:vm";
const original=await readFile("Worker.js","utf8");
const candidate=await readFile("artifacts/reviewonly/system1_eps_quarantine_dryrun_worker.mjs","utf8");
const START="function selectTomorrowCandidates(";
const END="function buildIndependentPoolPreview(";
const extract=(src,start,end)=>{
 const p=src.indexOf(start),q=src.indexOf(end,p+start.length);
 assert.ok(p>=0&&q>p&&src.indexOf(start,p+start.length)<0,"unique function boundaries");
 return src.slice(p,q);
};
const sourceOld=extract(original,START,END);
const sourceNew=extract(candidate,START,END);
assert.ok(sourceOld.length>6000&&sourceNew.length>sourceOld.length);
assert.equal(sourceOld.includes("shadowEpsSnapshot"),false);
assert.equal(sourceNew.includes("shadowEpsSnapshot"),true);
assert.equal(original.includes("system1ShadowEpsCandidateStatus"),false);
const declaration=extract(candidate,"function system1ShadowEpsCandidateStatus(",START);
const stub={
 THOUSAND_STOCK_PRICE:1000,MAX_STOCKS_PER_POOL:3,DEFAULT_TOTAL_CAPITAL:200000,
 buildMarketFeatures: x=>({...x}),toNumber:x=>typeof x==="number"&&Number.isFinite(x)?x:null,
 buildTodaySectorStats:()=>({電子:{score:55,breadth:65,avgChange:0.6,amountVs20DayAverage:1}}),
 percentile:(a,p)=>a[Math.floor((a.length-1)*p/100)],
 round:(v,n=2)=>Number.isFinite(v)?Math.round(v*10**n)/10**n:null,
 scoreCandidate:(f,sector)=>({
  ...f,ok:true,basePassed:true,rrPassed:true,channel:"A",signalLevel:"A",
  rewardPerRisk:f.rank,rewardRisk:f.rank,
  priorityScore:f.rank,setupQuality:f.rank,sectorFlow:sector.score,relativeStrength:f.rank,
  close:f.close
 }),
 buildChannelDebug:()=>({}),buildConditionDistribution:()=>({}),
 buildIndependentPoolPreview:(item,rank)=>({symbol:item.symbol,rank,signalLevel:item.signalLevel}),
 positiveNumber:x=>typeof x==="number"&&x>0?x:null,
 average:xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:0,
 allocateAndBuildPlans:(selected)=>selected.map(item=>({
   symbol:item.symbol,close:item.close,pool:item.close>=1000?"THOUSAND":"GENERAL",
   rank:item.rank,channel:item.channel,signalLevel:item.signalLevel
 }))
};
function makeSelector(source,includeHelper){
 const context={...stub};
 const code=(includeHelper?declaration:"")+"\n"+source+"\nselectTomorrowCandidates";
 return runInNewContext(code,context,{timeout:1000});
}
const old=makeSelector(sourceOld,false);
const next=makeSelector(sourceNew,true);
const marketDate="2026-10-16";
const quoteDate="2026-09-15";
const fixtures=[
 ["3236",250,9],["5340",300,8],["3147",150,7],["2340",45,6],["8111",70,5],
 ["4167",1100,4],["6122",1200,3],["3008",1450,2],["3443",1050,1]
].map(([symbol,close,rank])=>({
 symbol,close,rank,ret20:9,return20StartDate:quoteDate,
 industry:"電子",marketCapYi:150,historyDays:65,priceEarningsRatio:22
}));
const rows=fixtures.map(x=>({symbol:x.symbol,close:x.close,industry:x.industry,market:"TWSE"}));
const state=Object.fromEntries(fixtures.map(x=>[x.symbol,x]));
const envBase={
 V7_TOTAL_CAPITAL:200000,
 V7_OFFICIAL_INDEX:{asOfDate:marketDate,return20:10,history:[
  {date:quoteDate,close:100},{date:marketDate,close:110}]}
};
const good=(change={})=>({
 quarterEpsSource:"https://mopsov.twse.com.tw/mops/web/ajax_t164sb04",
 epsBasis:"MOPS合併綜合損益表直接公告單季EPS",
 quarterEpsVerified:true,quarterEPS:0,quarterEpsYear:2026,quarterEpsQuarter:2,
 previousQuarterEpsVerified:true,previousQuarterEPS:-0.7,
 previousQuarterEpsYear:2026,previousQuarterEpsQuarter:1,...change
});
const makeSnap=(omitted=[],changed={})=>{
 const stocks=Object.fromEntries(fixtures.filter(x=>!omitted.includes(x.symbol)).map(x=>[
  x.symbol,good(changed[x.symbol]||{})]));
 return {asOfDate:marketDate,year:2026,quarter:2,count:Object.keys(stocks).length,stocks};
};
const baseline=()=>old({stocks:state},rows,envBase,marketDate);
const shadow=(snapshot)=>next({stocks:state},rows,{
 ...envBase,__S1_EPS_QUARANTINE_DRYRUN_ONLY:snapshot
},marketDate);
const plainNew=()=>next({stocks:state},rows,envBase,marketDate);
const asPlain=x=>JSON.parse(JSON.stringify(x));
const symbols=x=>asPlain(x.candidates.map(v=>v.symbol));
let checks=0;
const eq=(a,b)=>{assert.deepEqual(asPlain(a),asPlain(b));checks++};
const ok=(v)=>{assert.ok(v);checks++};
const originalResult=baseline();
eq(plainNew(),originalResult); // Non-Shadow candidate equals entire original selector output.
eq(symbols(originalResult),["3236","5340","3147","4167","6122","3008"]);
let a=shadow(makeSnap());
eq(symbols(a),symbols(originalResult));
eq(a.diagnostics.epsReviewUniverse,originalResult.diagnostics.epsReviewUniverse);
eq(a.diagnostics.epsQuarantineShadow.quarantinedSymbols,[]);
eq(a.diagnostics.epsQuarantineShadow.zeroPicksCertified,false);
eq(a.diagnostics.finalPoolMerge.finalGeneralSelected,3);
eq(a.diagnostics.finalPoolMerge.finalThousandSelected,3);
a=shadow(makeSnap(["5340"]));
eq(symbols(a),["3236","3147","2340","4167","6122","3008"]);
eq(a.diagnostics.epsQuarantineShadow.quarantinedSymbols,["5340"]);
eq(a.diagnostics.finalPoolMerge.finalGeneralSelected,3);
eq(a.diagnostics.finalPoolMerge.finalThousandSelected,3);
eq(a.diagnostics.epsReviewUniverse,originalResult.diagnostics.epsReviewUniverse);
a=shadow(makeSnap(["4167"]));
eq(symbols(a),["3236","5340","3147","6122","3008","3443"]);
eq(a.diagnostics.epsQuarantineShadow.quarantinedSymbols,["4167"]);
a=shadow(makeSnap(["3236","5340","3147","2340","8111"]));
eq(symbols(a),["4167","6122","3008"]);
eq(a.diagnostics.finalPoolMerge.unusedGeneralSlots,3);
eq(a.diagnostics.finalPoolMerge.unusedThousandSlots,0);
eq(a.diagnostics.epsQuarantineShadow.zeroPicksCertified,false);
a=shadow(makeSnap(fixtures.map(x=>x.symbol)));
eq(symbols(a),[]);
eq(a.diagnostics.epsQuarantineShadow.allCandidatesQuarantined,true);
eq(a.diagnostics.epsQuarantineShadow.zeroPicksCertified,false);
eq(a.diagnostics.epsQuarantineShadow.originalCandidateCount,fixtures.length);
eq(a.diagnostics.epsReviewUniverse,originalResult.diagnostics.epsReviewUniverse);
a=shadow(makeSnap([],{5340:{epsBasis:"MOPS個別綜合損益表"}}));
eq(a.diagnostics.epsQuarantineShadow.quarantinedSymbols,["5340"]);
eq(symbols(a),["3236","3147","2340","4167","6122","3008"]);
a=shadow(makeSnap([],{3236:{quarterEPS:-2},5340:{quarterEPS:0}}));
eq(symbols(a),symbols(originalResult));
a=shadow(makeSnap([],{5340:{previousQuarterEPS:null},4167:{quarterEpsVerified:false}}));
eq(a.diagnostics.epsQuarantineShadow.quarantinedSymbols,["5340","4167"]);
eq(symbols(a),["3236","3147","2340","6122","3008","3443"]);
eq(a.diagnostics.finalPoolMerge.policy,"3+3獨立名額，不跨池補位");
eq(a.diagnostics.epsQuarantineShadow.canTrade,false);
eq(a.diagnostics.epsQuarantineShadow.productionActivated,false);
eq(a.diagnostics.epsQuarantineShadow.officialSourcePITCertified,false);
ok(originalResult.diagnostics.scanned===fixtures.length);
ok(originalResult.diagnostics.with60Days===fixtures.length);
console.log("System1 extracted original V8 selector paired synthetic 2-pool: "+checks+
 " assertions PASS; real D1/PIT/live Formal not tested.");
