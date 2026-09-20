import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  source+"\nexport {researchStableHash,buildShadowCandidateArchive};"
).toString("base64")+"#"+Date.now());

assert.ok(source.includes("CREATE TABLE IF NOT EXISTS trade_research_shadow_candidates"));
for(const marker of [
  "CREATE TABLE IF NOT EXISTS trade_research_shadow_candidates",
  "QUALIFIED_NOT_SELECTED",
  "NEAR_MISS",
  "REJECTED_AFTER_BASE",
  "BROAD_CONTROL",
  "shadowOnly:true",
  "formalScoreUsed:false",
  "tradeEligible:false",
  "persistShadowCandidateArchive",
  "readShadowCandidateSummary",
  "researchShadowArchive"
]) assert.ok(source.includes(marker),marker);

assert.equal(mod.researchStableHash("2026-09-21|2330"),mod.researchStableHash("2026-09-21|2330"));
assert.notEqual(mod.researchStableHash("2026-09-21|2330"),mod.researchStableHash("2026-09-21|2317"));

function history(close=100){
  const rows=[];
  const end=new Date("2026-09-21T00:00:00Z");
  for(let i=69;i>=0;i--){
    const d=new Date(end);d.setUTCDate(d.getUTCDate()-i);
    const c=close-7+(69-i)*0.1;
    rows.push({date:d.toISOString().slice(0,10),open:c-0.2,high:c+0.7,low:c-0.8,close:c,volumeShares:1800000,tradeValue:c*1800000});
  }
  return rows;
}
function feature(symbol,close=100){
  return {
    symbol,name:"測試"+symbol,industry:"測試產業",close,historyDays:70,history:history(close),
    ma10:95,ma20:94,ma60:90,prevMa20:93,priorHigh20:99,recentHigh10:99,recentLow5Prev:92,priorLow20:88,
    todayLow:98,volumeTodayVsPrev5:1.4,volumeContraction5to20:.9,dailyClosePosition:.9,dailyUpperShadowRatio:.1,
    lateStage:false,bullishStack:true,justTurnBullish:false,ret20:10,ret60:20,marketReturn20:2,sectorReturn20:4,
    avgVolume20Lots:1500,avgAmount20:150000000,marketCapYi:200,chipConcentration:55,
    foreignBuyDays:2,trustBuyDays:1,dealerBuyDays:0,institutionTotalNet:100000,
    revenueYoY:15,revenueQoQ:8,revenueYTDYoY:12,eps:3,grossMargin:30,operatingMargin:15,
    researchMarketContext:{regime:"BULL_BROAD",aboveMa20Pct:65},researchSectorRank:2
  };
}
const sector={score:75,breadth:65,avgChange:1.2,amountVs20DayAverage:1.1};
const audits=[];
const selectedF=feature("1101");
const selectedResult={...selectedF,ok:true,basePassed:true,rrPassed:true,channel:"B",signalLevel:"A",priorityScore:90,rewardRisk:3,sectorFlow:75,relativeStrength:8,sectorRelativeStrength:6,setupQuality:90};
audits.push({f:selectedF,sector,result:selectedResult});
for(let i=0;i<4;i++){
  const f=feature(String(1200+i));
  audits.push({f,sector,result:{...f,ok:true,basePassed:true,rrPassed:true,channel:"A",signalLevel:"B",priorityScore:80-i,rewardRisk:2.5,sectorFlow:75,relativeStrength:7,sectorRelativeStrength:5,setupQuality:78}});
}
for(let i=0;i<4;i++){
  const f=feature(String(1300+i));
  audits.push({f,sector,result:{ok:false,basePassed:true,rrPassed:false,reason:"A拉回承接/B突破後承接皆未形成候選"}});
}
for(let i=0;i<4;i++){
  const f=feature(String(1400+i));
  audits.push({f,sector,result:{ok:false,basePassed:true,rrPassed:false,reason:"基本面品質明顯不足"}});
}
for(let i=0;i<20;i++){
  const f=feature(String(1500+i));
  audits.push({f,sector,result:{ok:false,basePassed:false,rrPassed:false,reason:"市值低於10億"}});
}
const selected=[selectedResult];
const before=JSON.stringify(selected);
const rankFn=(a,b)=>(b.priorityScore||0)-(a.priorityScore||0);
const features=audits.map(x=>x.f);
const scored=audits.filter(x=>x.result.ok===true).map(x=>x.result);
const basePoolDiagnostics=audits.filter(x=>x.result.basePassed===true).map(x=>({f:x.f,sector}));
const nearMisses=audits.filter(x=>String(x.result.reason||"").includes("A拉回承接/B突破後承接")).map(x=>({symbol:x.f.symbol}));
const archive=mod.buildShadowCandidateArchive(features,scored,basePoolDiagnostics,nearMisses,selected,{"測試產業":sector},rankFn,"2026-09-21");
assert.equal(JSON.stringify(selected),before,"shadow archive must not mutate formal selection");
assert.equal(archive.researchOnly,true);
assert.equal(archive.decisionImpact,false);
assert.equal(archive.rows.filter(x=>x.cohort==="SELECTED").length,1);
assert.ok(archive.rows.some(x=>x.cohort==="QUALIFIED_NOT_SELECTED"));
assert.ok(archive.rows.some(x=>x.cohort==="NEAR_MISS"));
assert.ok(archive.rows.some(x=>x.cohort==="REJECTED_AFTER_BASE"));
assert.ok(archive.rows.some(x=>x.cohort==="BROAD_CONTROL"));
assert.ok(archive.rows.every(x=>x.snapshot?.provenance?.shadowOnly===true));
assert.ok(archive.rows.every(x=>x.snapshot?.shadow?.tradeEligible===false));
assert.ok(archive.rows.every(x=>x.snapshot?.shadow?.pushEligible===false));

console.log(JSON.stringify({
  ok:true,
  version:"8.7.2-or-later",
  shadowArchive:true,
  cohorts:archive.counts,
  formalSelectionMutated:false,
  decisionImpact:false
}));
