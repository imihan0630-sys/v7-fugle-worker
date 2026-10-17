import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {verifyOriginalV8SourceTopology,rankWithExactOriginalComparator,SCHEMA} from
 "../research/system1_p0_eps_quarantine_v8_source_parity_v0_1.mjs";
import {reviewEpsQuarantineShadow,INPUT_KIND,REQUIRED_C_URL} from
 "../research/system1_p0_eps_candidate_quarantine_shadow_v0_1.mjs";

const source=await readFile("Worker.js","utf8");
let tested=0;
const eq=(a,b)=>{assert.deepEqual(a,b);tested++};
const ok=(v)=>{assert.ok(v);tested++};
const verdict=verifyOriginalV8SourceTopology(source);
eq(verdict.status,"EXACT_ORIGINAL_SOURCE_TOPOLOGY_PASS");
eq(verdict.schema,SCHEMA);
eq(verdict.noSourceRewrite,true);
eq(verdict.postScorePreQuotaInsertionLocationVerified,true);
eq(verdict.originalScoringLoops,2);
eq(verdict.perPoolMaximum,3);
eq(verdict.originalEpsFailureStillPresent,true);
eq(verdict.holdingsGuardPresent,true);
eq(verdict.canTrade,false);
eq(verdict.actualLiveSelectionValidated,false);
eq(verdict.originalD1Readback,false);
ok(/^[a-f0-9]{64}$/.test(verdict.originalWorkerSha256));
const score=(symbol,close,rank)=>({
 symbol,close,channel:"A",signalLevel:"A",
 rewardPerRisk:rank,priorityScore:rank,setupQuality:rank,
 sectorFlow:rank,relativeStrength:rank
});
const pool=[score("3236",100,9),score("5340",120,8),score("3147",80,7),
 score("2340",35,6),score("8111",70,5),score("4167",1050,4),
 score("6122",1030,3),score("3008",1020,2),score("3443",1010,1)];
eq(rankWithExactOriginalComparator(source,pool).map(x=>x.symbol),
 ["3236","5340","3147","2340","8111","4167","6122","3008","3443"]);
const exact=(overrides={})=>({
 quarterEpsSource:REQUIRED_C_URL,
 epsBasis:"MOPS合併綜合損益表直接公告單季EPS",
 quarterEpsYear:2026,quarterEpsQuarter:2,quarterEpsVerified:true,quarterEPS:0,
 previousQuarterEpsVerified:true,previousQuarterEpsYear:2026,
 previousQuarterEpsQuarter:1,previousQuarterEPS:-0.3,...overrides
});
const make=(removed=[],holdings=[])=>{
 const stocks=Object.fromEntries(pool.filter(c=>!removed.includes(c.symbol)).map(c=>[c.symbol,exact()]));
 return {
  marketDate:"2026-10-16",officialMarketDate:"2026-10-16",
  year:2026,quarter:2,preScored:pool,
  cohortKind:INPUT_KIND,verifiedOriginalSelectorCohort:true,originalFullUniverseScanComplete:true,
  globalGates:Object.fromEntries(["TWSE","TPEx","HISTORY60","INSTITUTION","FINANCIAL","VALUATION","ANNOUNCEMENTS","INDEX","TDCC"].map(x=>[x,true])),
  quarterSnapshot:{asOfDate:"2026-10-16",year:2026,quarter:2,count:Object.keys(stocks).length,stocks},
  holdings
 };
};
let a=reviewEpsQuarantineShadow(make());
const genuineGroupExpected=[
 ...rankWithExactOriginalComparator(source,pool.filter(c=>c.close<1000)).slice(0,3),
 ...rankWithExactOriginalComparator(source,pool.filter(c=>c.close>=1000)).slice(0,3)
];
eq(a.selected.map(x=>x.symbol),
 rankWithExactOriginalComparator(source,genuineGroupExpected).map(x=>x.symbol));
a=reviewEpsQuarantineShadow(make(["5340"],[{
 symbol:"2340",positionStage:"FIRST",actualShares:1000,stop:35.5
}]));
const filtered=pool.filter(c=>c.symbol!=="5340");
const group=[
 ...rankWithExactOriginalComparator(source,filtered.filter(c=>c.close<1000)).slice(0,3),
 ...rankWithExactOriginalComparator(source,filtered.filter(c=>c.close>=1000)).slice(0,3)
];
eq(a.selected.map(x=>x.symbol),rankWithExactOriginalComparator(source,group).map(x=>x.symbol));
eq(a.quarantined.map(c=>c.symbol),["5340"]);
eq(a.hasActualPositions,true);
eq(a.canMutateHoldings,false);
eq(a.canTrade,false);
a=reviewEpsQuarantineShadow(make(["3236","5340","3147","2340","8111"]));
eq(a.remainingGeneral,3);
eq(a.remainingThousand,0);
eq(a.selected.filter(c=>c.pool==="GENERAL").length,0);
eq(a.zeroPicksCertified,false);
a=reviewEpsQuarantineShadow(make(pool.map(x=>x.symbol)));
eq(a.status,"ALL_PRE_CANDIDATES_QUARANTINED_NOT_ZERO");
eq(a.zeroPicksCertified,false);
eq(a.selectedCount,0);
const bad=[
 ["rank",source.replace("b.rewardPerRisk - a.rewardPerRisk ||","b.priorityScore - a.priorityScore ||")],
 ["EPS",source.replace("if(!dryRun && epsMissing.length) throw new Error","if(false && epsMissing.length) throw new Error")],
 ["pool",source.replace("thousandScored.sort(rankFn);","thousandScored.sort(()=>0);")],
 ["score",source.replace("const result = scoreCandidate(f, sector);","const result = {ok:true};")],
 ["holdings",source.replace('throw new Error("OPEN_POSITION_PROTECTED：', 'throw new Error("POSITION_REPLACED:')],
 ["other",source.replace('const quarterEps=await readQualitySnapshot(env,"QUARTER_EPS",marketDate);','const quarterEps={stocks:{}};')],
 ["zero",source.slice(0,1500)]
];
for(const [label,mutant] of bad){
 const result=verifyOriginalV8SourceTopology(mutant);
 eq(result.status,"SOURCE_PARITY_NOT_ESTABLISHED");
 eq(result.canTrade,false);
 ok(result.reason.length>3);
}
assert.throws(()=>rankWithExactOriginalComparator(bad[0][1],pool),/ORIGINAL_V8_SOURCE_REJECTED/);tested++;
assert.throws(()=>rankWithExactOriginalComparator(source,[{symbol:"x",rewardPerRisk:NaN}]),/RANK_ROWS_INVALID/);tested++;
console.log("System1 real Worker.js source-topology & EPS quarantine ranking: "+tested+" assertions PASS; original production unchanged.");
