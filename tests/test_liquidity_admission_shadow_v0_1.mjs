import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  source+"\nexport {buildLiquidityAdmissionResearchAudit,buildLiquidityAdmissionRejectedResearch};"
).toString("base64")+"#"+Date.now());

for(const marker of [
  "LIQUIDITY_ADMISSION_AUDIT_V0_1",
  "LIQ_LOW_AVG_VOLUME_REJECTED",
  "LIQ_SMALLCAP_SPECIAL_REASON_REJECTED",
  "LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED",
  "liquidityAdmissionResearch",
  "fullFormalCounterfactual:false"
]) assert.ok(source.includes(marker),marker);

const base=(symbol,overrides={})=>({
  symbol:String(symbol),name:"L"+symbol,industry:"測試",close:100,historyDays:65,
  marketReturn20:2,sectorReturn20:3,marketCapYi:200,changePercent:1,
  avgVolume20Lots:1500,avgAmount20:150000000,chipConcentration:50,
  revenueYoY:10,revenueMoM:5,revenueYTDYoY:8,eps:3,grossMargin:30,operatingMargin:12,
  epsYoY:10,grossMarginYoY:2,operatingMarginYoY:3,
  quarterRevenue:100,financialBasis:"TEST",revenueQoQ:5,revenueQuarterYoY:10,
  valuationObserved:true,priceBookRatio:2,announcementsVerified:true,
  foreignBuyDays:1,trustBuyDays:1,dealerBuyDays:0,institutionTotalNet:100000,
  ma5:105,ma10:103,ma20:100,ma60:95,prevMa5:104,prevMa10:102,prevMa20:99,
  bullishStack:true,justTurnBullish:false,lateStage:false,ret20:10,ret60:15,
  priorHigh20:99,priorHigh60:115,priorLow20:90,recentHigh10:99,recentLow5Prev:96,
  todayLow:99,volumeTodayVsPrev5:1.5,volumeContraction5to20:.9,
  dailyClosePosition:.9,dailyUpperShadowRatio:.1,atrPercent:2,
  history:[],
  ...overrides
});
const sector={score:75,breadth:60,avgChange:1,amountVs20DayAverage:1};

const low=base("1101",{avgVolume20Lots:500,spreadPercent:null,orderBookDepthGood:undefined,depthScore:null});
const lowAudit=mod.buildLiquidityAdmissionResearchAudit(low);
assert.equal(lowAudit.minLots,1000);
assert.equal(lowAudit.belowPrimaryMin,true);
assert.equal(lowAudit.exceptionInputCoverage,"ABSENT");
assert.equal(lowAudit.liquidityExceptionPass,false);

const exception=base("1102",{avgVolume20Lots:500,avgAmount20:60000000,spreadPercent:.2,orderBookDepthGood:true,marketCapYi:200});
const exAudit=mod.buildLiquidityAdmissionResearchAudit(exception);
assert.equal(exAudit.exceptionInputCoverage,"COMPLETE");
assert.equal(exAudit.liquidityExceptionPass,true);

const small=base("1103",{marketCapYi:20,avgVolume20Lots:1200,foreignBuyDays:0,trustBuyDays:0,dealerBuyDays:0,institutionTotalNet:0,chipConcentration:0});
const mid=base("1104",{marketCapYi:50,avgVolume20Lots:1100});
const thousandLow=base("3001",{close:1200,marketCapYi:200,avgVolume20Lots:250});

const features=[low,small,mid,thousandLow,exception];
const res=mod.buildLiquidityAdmissionRejectedResearch(features,()=>sector,"2026-09-27");

assert.equal(res.populationCounts.LIQ_LOW_AVG_VOLUME_REJECTED.GENERAL,1);
assert.equal(res.populationCounts.LIQ_LOW_AVG_VOLUME_REJECTED.THOUSAND,1);
assert.equal(res.populationCounts.LIQ_SMALLCAP_SPECIAL_REASON_REJECTED.GENERAL,1);
assert.equal(res.populationCounts.LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED.GENERAL,1);
assert.equal(res.exceptionPassCounts.GENERAL,1);
assert.ok(res.samples.some(x=>x.cohort==="LIQ_LOW_AVG_VOLUME_REJECTED"&&x.f.symbol==="1101"));
assert.ok(res.samples.some(x=>x.cohort==="LIQ_SMALLCAP_SPECIAL_REASON_REJECTED"&&x.f.symbol==="1103"));
assert.ok(res.samples.some(x=>x.cohort==="LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED"&&x.f.symbol==="1104"));
assert.ok(res.samples.every(x=>x.result.basePassed===false));
assert.equal(res.outcomeSelected,false);
assert.equal(res.decisionImpact,false);

const reversed=mod.buildLiquidityAdmissionRejectedResearch([...features].reverse(),()=>sector,"2026-09-27");
const key=x=>x.cohort+"|"+x.pool+"|"+x.f.symbol;
assert.deepEqual(res.samples.map(key),reversed.samples.map(key),"liquidity samples must be deterministic and input-order independent");

console.log(JSON.stringify({
  ok:true,researchOnly:true,formalCoreImpact:false,
  populationCounts:res.populationCounts,
  exceptionPassCounts:res.exceptionPassCounts,
  exceptionInputCoverageCounts:res.exceptionInputCoverageCounts,
  samples:res.samples.map(x=>({cohort:x.cohort,pool:x.pool,symbol:x.f.symbol,population:x.reasonPopulationCount}))
},null,2));
