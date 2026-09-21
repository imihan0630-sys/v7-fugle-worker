import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const exported="\nexport {RESEARCH_EXPERIMENT_CATALOG,RESEARCH_MICROSTRUCTURE_CUTOFF,researchRevenueEvidenceMap,researchMarginEvidenceFromPayload,researchTwoEngineStudy,researchExternalEvidenceCoverage};";
const mod=await import("data:text/javascript;base64,"+Buffer.from(source+exported).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\.\d+\.\d+[^"]*";/);

for(const marker of [
  "research-external-evidence-v1",
  "trade_research_external_evidence",
  "R07_MEDIAN_SPLIT_TWO_ENGINE_COMPARISON",
  "MARGIN_SHORT_ONLY_NOT_SBL",
  "CONTINUOUS_TRADING"
]) assert.ok(source.includes(marker),marker);

const r08=mod.RESEARCH_EXPERIMENT_CATALOG.find(x=>x.id==="R08");
assert.ok(r08);
assert.equal(r08.status,"ACCUMULATING");
assert.equal(r08.parameterVariants,1);
assert.equal(mod.RESEARCH_MICROSTRUCTURE_CUTOFF,"2020-03-23");

const revenue=mod.researchRevenueEvidenceMap([{
  "公司代號":"2330",
  "資料年月":"11508",
  "營業收入-當月營收":"335,000,000",
  "營業收入-上月營收":"320,000,000",
  "營業收入-去年當月營收":"250,000,000",
  "營業收入-上月比較增減(%)":"4.69",
  "營業收入-去年同月增減(%)":"34.00",
  "累計營業收入-前期比較增減(%)":"28.50"
}]);
assert.equal(revenue.get("2330").status,"AVAILABLE");
assert.equal(revenue.get("2330").revenueYoY,34);
assert.equal(revenue.get("2330").revenueMoM,4.69);
assert.equal(revenue.get("2330").persistenceStatus,"ACCUMULATING_DISTINCT_DATA_MONTHS");

const marginPayload={
  date:"20260921",
  tables:[{
    fields:["股票代號","股票名稱","融資買進","融資賣出","融資前日餘額","融資今日餘額","融券買進","融券賣出","融券前日餘額","融券今日餘額"],
    data:[["2330","台積電","100","80","1000","1020","5","12","50","57"]]
  }]
};
const margin=mod.researchMarginEvidenceFromPayload(marginPayload,"2026-09-21");
assert.equal(margin.dateMatched,true);
assert.equal(margin.map.get("2330").marginShortSale,12);
assert.equal(margin.map.get("2330").shortSideScope,"MARGIN_SHORT_ONLY_NOT_SBL");
const mismatch=mod.researchMarginEvidenceFromPayload({...marginPayload,date:"20260920"},"2026-09-21");
assert.equal(mismatch.dateMatched,false);
assert.equal(mismatch.map.size,0);

const outcomes=[];
for(let d=0;d<20;d++) {
  const date="2026-10-"+String(1+d).padStart(2,"0");
  const strengths=[-2,-1,1,2];
  const attentions=[0.8,1.2,0.7,1.3];
  for(let j=0;j<4;j++) {
    const quiet=j===2;
    const ret5=quiet?2.0: j===3?0.8:0;
    outcomes.push({
      scanDate:date,
      symbol:String(2300+d*10+j),
      horizons:{
        d5:{returnPct:ret5,mfePct:ret5+1,maePct:-1},
        d10:{returnPct:ret5+0.5,mfePct:ret5+1.5,maePct:-1.2},
        d20:{returnPct:ret5+1,mfePct:ret5+2,maePct:-1.5}
      },
      snapshot:{
        market:{regime:d<10?"RISK_ON":"RANGE"},
        price:{residualSectorRs20:strengths[j]},
        volume:{volumeTodayVsPrev5:attentions[j]}
      },
      externalEvidence:j===2?{revenue:{status:"AVAILABLE"},margin:{status:"AVAILABLE"},officialAttention:{status:"AVAILABLE"},disposition:{status:"AVAILABLE"}}:null
    });
  }
}
const study=mod.researchTwoEngineStudy(outcomes);
assert.equal(study.researchOnly,true);
assert.equal(study.decisionImpact,false);
assert.equal(study.formalCoreImpact,false);
assert.equal(study.experimentId,"R08");
assert.equal(study.status,"DESCRIPTIVE_READY");
assert.equal(study.paired.d5.pairedDates,20);
assert.ok(study.byEngine.QUIET_UNDERREACTION_PROXY.n>0);
assert.ok(study.byEngine.ATTENTION_CONTINUATION_PROXY.n>0);

const coverage=mod.researchExternalEvidenceCoverage(outcomes);
assert.equal(coverage.formalCoreImpact,false);
assert.equal(coverage.evidenceRows,20);
assert.equal(coverage.revenueAvailable,20);

console.log(JSON.stringify({
  ok:true,
  experiment:"R08",
  twoEngine:true,
  officialEvidence:true,
  sourceDateGuard:true,
  formalCoreImpact:false
}));
