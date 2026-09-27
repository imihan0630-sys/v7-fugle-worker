import {explicitLiquidityReasonMatrix,sampleLiquidityExceptionPass} from "../research/liquidity_admission_control_sampler_v0_1.mjs";
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
  "liquidityAdmissionPopulationReceipt",
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
assert.ok(lowAudit.exceptionFailureReasons.includes("SPREAD_MISSING"));
assert.ok(lowAudit.exceptionFailureReasons.includes("DEPTH_EVIDENCE_MISSING"));
assert.equal(lowAudit.formalMissingnessEffect,"MISSING_EXCEPTION_INPUTS_CAUSE_FORMAL_EXCEPTION_FAILURE");

const exception=base("1102",{avgVolume20Lots:500,avgAmount20:60000000,spreadPercent:.2,orderBookDepthGood:true,marketCapYi:200});
const exAudit=mod.buildLiquidityAdmissionResearchAudit(exception);
assert.equal(exAudit.exceptionInputCoverage,"COMPLETE");
assert.equal(exAudit.liquidityExceptionPass,true);

const small=base("1103",{marketCapYi:20,avgVolume20Lots:1200,foreignBuyDays:0,trustBuyDays:0,dealerBuyDays:0,institutionTotalNet:0,chipConcentration:0});
const mid=base("1104",{marketCapYi:50,avgVolume20Lots:1100});
const thousandLow=base("3001",{close:1200,marketCapYi:200,avgVolume20Lots:250});

const features=[low,small,mid,thousandLow,exception];
const res=mod.buildLiquidityAdmissionRejectedResearch(features,()=>sector,"2026-09-27");

const explicit=explicitLiquidityReasonMatrix(res.populationCounts);
assert.equal(explicit.LIQ_LOW_AVG_VOLUME_REJECTED.GENERAL,1);
assert.equal(explicit.LIQ_LOW_AVG_VOLUME_REJECTED.THOUSAND,1);
assert.equal(explicit.LIQ_SMALLCAP_SPECIAL_REASON_REJECTED.THOUSAND,0,"unobserved preregistered reason x pool must be explicit zero");
assert.equal(explicit.LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED.THOUSAND,0);

const independentPassRows=features.map(f=>{
  const a=mod.buildLiquidityAdmissionResearchAudit(f);
  return {symbol:f.symbol,pool:Number(f.close)>=1000?"THOUSAND":"GENERAL",belowPrimaryMin:a.belowPrimaryMin,liquidityExceptionPass:a.liquidityExceptionPass};
});
const passSample=sampleLiquidityExceptionPass(independentPassRows,{scanDate:"2026-09-27",capPerPool:6});
assert.equal(passSample.semanticPopulationCount,1);
assert.equal(passSample.sampledCount,1);
assert.equal(passSample.rows[0].symbol,"1102");
assert.equal(passSample.rows[0].membership,"LIQ_LOW_VOLUME_EXCEPTION_PASS");
assert.equal(passSample.rows[0].sampleMembershipMeta.populationCount,1);

assert.equal(res.populationCounts.LIQ_LOW_AVG_VOLUME_REJECTED.GENERAL,1);
assert.equal(res.populationCounts.LIQ_LOW_AVG_VOLUME_REJECTED.THOUSAND,1);
assert.equal(res.populationCounts.LIQ_SMALLCAP_SPECIAL_REASON_REJECTED.GENERAL,1);
assert.equal(res.populationCounts.LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED.GENERAL,1);
assert.equal(res.exceptionPassCounts.GENERAL,1);
assert.equal(res.belowPrimaryMinTotal,3);
assert.equal(res.belowPrimaryMinExceptionInputCoverageCounts.ABSENT,2);
assert.equal(res.belowPrimaryMinExceptionInputCoverageCounts.COMPLETE,1);
assert.equal(res.belowPrimaryMinFailureReasonCounts.SPREAD_MISSING,2);
assert.equal(res.belowPrimaryMinFailureReasonCounts.DEPTH_EVIDENCE_MISSING,2);
assert.ok(res.samples.some(x=>x.cohort==="LIQ_LOW_AVG_VOLUME_REJECTED"&&x.f.symbol==="1101"));
assert.ok(res.samples.some(x=>x.cohort==="LIQ_SMALLCAP_SPECIAL_REASON_REJECTED"&&x.f.symbol==="1103"));
assert.ok(res.samples.some(x=>x.cohort==="LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED"&&x.f.symbol==="1104"));
assert.ok(res.samples.every(x=>x.result.basePassed===false));
assert.equal(res.outcomeSelected,false);
assert.equal(res.decisionImpact,false);

const reversed=mod.buildLiquidityAdmissionRejectedResearch([...features].reverse(),()=>sector,"2026-09-27");
const reversePassRows=[...independentPassRows].reverse();
const reversePassSample=sampleLiquidityExceptionPass(reversePassRows,{scanDate:"2026-09-27",capPerPool:6});
assert.deepEqual(passSample.rows.map(x=>x.symbol),reversePassSample.rows.map(x=>x.symbol),"exception-pass sample must be input-order invariant");
const key=x=>x.cohort+"|"+x.pool+"|"+x.f.symbol;
assert.deepEqual(res.samples.map(key),reversed.samples.map(key),"liquidity samples must be deterministic and input-order independent");

console.log(JSON.stringify({
  ok:true,researchOnly:true,formalCoreImpact:false,
  populationCounts:res.populationCounts,
  exceptionPassCounts:res.exceptionPassCounts,
  exceptionInputCoverageCounts:res.exceptionInputCoverageCounts,
  belowPrimaryMinExceptionInputCoverageCounts:res.belowPrimaryMinExceptionInputCoverageCounts,
  belowPrimaryMinFailureReasonCounts:res.belowPrimaryMinFailureReasonCounts,
  explicitReasonMatrix:explicit,
  exceptionPassSample:{population:passSample.semanticPopulationCount,sampled:passSample.sampledCount,symbols:passSample.rows.map(x=>x.symbol)},
  samples:res.samples.map(x=>({cohort:x.cohort,pool:x.pool,symbol:x.f.symbol,population:x.reasonPopulationCount}))
},null,2));
