import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  source+"\nexport {researchStratifiedRejectSample};"
).toString("base64")+"#"+Date.now());

assert.ok(source.includes("REJECT_REASON_STRATIFIED_V0_1"));
assert.ok(source.includes("reasonPopulationCount"));
assert.ok(source.includes("rejectedReasonPopulationCounts"));
assert.ok(source.includes("byExclusionReasonSample"));

const row=(symbol,reason,close=100)=>({
  f:{symbol:String(symbol),close},
  result:{ok:false,basePassed:true,rrPassed:false,reason}
});

const rows=[];
for(let i=0;i<20;i++) rows.push(row(1100+i,"REASON_A",100));
for(let i=0;i<3;i++) rows.push(row(2100+i,"REASON_B",100));
for(let i=0;i<7;i++) rows.push(row(3100+i,"REASON_C",1200));
for(let i=0;i<1;i++) rows.push(row(4100+i,"REASON_D",1200));

const a=mod.researchStratifiedRejectSample(rows,"2026-09-27",2);
const b=mod.researchStratifiedRejectSample([...rows].reverse(),"2026-09-27",2);

assert.equal(a.schemaVersion,"reject-reason-stratified-sample-v0.1");
assert.equal(a.unit,"EXACT_REASON_X_PRICE_POOL");
assert.equal(a.outcomeSelected,false);
assert.equal(a.populationCounts.GENERAL.REASON_A,20);
assert.equal(a.populationCounts.GENERAL.REASON_B,3);
assert.equal(a.populationCounts.THOUSAND.REASON_C,7);
assert.equal(a.populationCounts.THOUSAND.REASON_D,1);

const count=(samples,reason,pool)=>samples.filter(x=>x.reason===reason&&x.pool===pool).length;
assert.equal(count(a.samples,"REASON_A","GENERAL"),2);
assert.equal(count(a.samples,"REASON_B","GENERAL"),2,"minority reason must not be starved by a larger earlier-sorted reason");
assert.equal(count(a.samples,"REASON_C","THOUSAND"),2);
assert.equal(count(a.samples,"REASON_D","THOUSAND"),1);

for(const s of a.samples){
  assert.equal(s.reasonPopulationCount,a.populationCounts[s.pool][s.reason]);
  assert.equal(s.reasonSampleCount,Math.min(2,s.reasonPopulationCount));
  assert.ok(s.reasonSampleRank>=1 && s.reasonSampleRank<=2);
}

const key=x=>x.pool+"|"+x.reason+"|"+x.row.f.symbol;
assert.deepEqual(a.samples.map(key),b.samples.map(key),"sampling must be deterministic and input-order independent");

const oldStyle=[...rows]
  .sort((x,y)=>String(x.result.reason).localeCompare(String(y.result.reason))||String(x.f.symbol).localeCompare(String(y.f.symbol)))
  .filter(x=>x.f.close<1000)
  .slice(0,6);
assert.equal(oldStyle.filter(x=>x.result.reason==="REASON_B").length,0,
  "synthetic witness must reproduce old reason-starvation failure");

console.log(JSON.stringify({
  ok:true,
  researchOnly:true,
  formalCoreImpact:false,
  oldReasonBCount:0,
  newReasonBCount:count(a.samples,"REASON_B","GENERAL"),
  populationCounts:a.populationCounts,
  sampled:a.samples.map(x=>({pool:x.pool,reason:x.reason,symbol:x.row.f.symbol,population:x.reasonPopulationCount,sampleRank:x.reasonSampleRank}))
},null,2));
