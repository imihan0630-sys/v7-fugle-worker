import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const exported="\nexport {researchRevenueEvidenceMapV8711,researchMergeRevenueEvidenceV8711,researchTwseSblShortEvidenceFromPayload,researchOfficialStatusForMarketV8711,researchExternalEvidenceCoverageV8711};";
const mod=await import("data:text/javascript;base64,"+Buffer.from(source+exported).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\\.(?:[7-9]|[1-9]\\d+)\\.\\d+[^"]*";/);

for(const marker of [
  "research-external-evidence-v2",
  "mopsfin_t187ap05_O",
  "ACTUAL_SBL_SHORT_SALE",
  "RAW_DAILY_ONLY_NO_CONTIGUOUS_HISTORY",
  "UNKNOWN_TPEX_SBL_NOT_CAPTURED_V8_7_11",
  "sourceReportPeriodIsNotFirstKnownTime"
]) assert.ok(source.includes(marker),marker);

const twse=mod.researchRevenueEvidenceMapV8711([{
  "公司代號":"2330","資料年月":"11508","營業收入-當月營收":"335000000",
  "營業收入-上月比較增減(%)":"4.69","營業收入-去年同月增減(%)":"34"
}],"TWSE","twse");
const tpex=mod.researchRevenueEvidenceMapV8711([{
  "公司代號":"6488","資料年月":"11508","營業收入-當月營收":"123000000",
  "營業收入-上月比較增減(%)":"3.2","營業收入-去年同月增減(%)":"18.4"
}],"TPEX","tpex");
const providers={twseMonthlyRevenue:{status:"AVAILABLE"},tpexMonthlyRevenue:{status:"AVAILABLE"}};
const listed=mod.researchMergeRevenueEvidenceV8711("2330",twse,tpex,providers);
const otc=mod.researchMergeRevenueEvidenceV8711("6488",twse,tpex,providers);
assert.equal(listed.status,"AVAILABLE");
assert.equal(listed.sourceMarket,"TWSE");
assert.equal(otc.status,"AVAILABLE");
assert.equal(otc.sourceMarket,"TPEX");
assert.equal(otc.pointInTimeHistoryStatus,"CURRENT_SNAPSHOT_ONLY");
assert.equal(otc.firstKnownAt,null);

const sblPayload={
  date:"20260918",
  fields:["代號","名稱","前日餘額","賣出","買進","現券","今日餘額","次一營業日限額","前日餘額","當日賣出","當日還券","當日調整","當日餘額","次一營業日可限額","備註"],
  data:[["2330","台積電","100","2","3","0","99","10000","5000","700","200","10","5510","20000",""]]
};
const sbl=mod.researchTwseSblShortEvidenceFromPayload(sblPayload,"2026-09-21");
assert.equal(sbl.dateMatched,true);
assert.equal(sbl.map.get("2330").sblShortSale,700);
assert.equal(sbl.map.get("2330").sblShortBalance,5510);
assert.equal(sbl.map.get("2330").shortSideScope,"ACTUAL_SBL_SHORT_SALE");
assert.equal(sbl.map.get("2330").flowWindowStatus,"RAW_DAILY_ONLY_NO_CONTIGUOUS_HISTORY");
assert.equal(sbl.pointInTimeEligible,true);
assert.equal(sbl.map.get("2330").evidenceAvailableBeforeScan,true);
const sameDay=mod.researchTwseSblShortEvidenceFromPayload({...sblPayload,date:"20260921"},"2026-09-21");
assert.equal(sameDay.pointInTimeEligible,false);
assert.equal(sameDay.map.size,0);

const twseStatus=mod.researchOfficialStatusForMarketV8711("TWSE","AVAILABLE",new Map(),"2330","UNKNOWN_TPEX");
assert.equal(twseStatus.status,"AVAILABLE");
assert.equal(twseStatus.flag,false);
const otcStatus=mod.researchOfficialStatusForMarketV8711("TPEX","AVAILABLE",new Map(),"6488","UNKNOWN_TPEX_ATTENTION_NOT_CAPTURED_V8_7_11");
assert.equal(otcStatus.status,"UNKNOWN_TPEX_ATTENTION_NOT_CAPTURED_V8_7_11");
assert.equal(otcStatus.flag,null);

const outcomes=[
  {externalEvidence:{revenue:{status:"AVAILABLE",sourceMarket:"TWSE"},sblShort:{status:"AVAILABLE",shortSideScope:"ACTUAL_SBL_SHORT_SALE"},margin:{status:"AVAILABLE"},officialAttention:{status:"AVAILABLE"},disposition:{status:"AVAILABLE"}}},
  {externalEvidence:{revenue:{status:"AVAILABLE",sourceMarket:"TPEX"},sblShort:{status:"UNKNOWN_TPEX_SBL_NOT_CAPTURED_V8_7_11"},margin:{status:"UNKNOWN_TPEX_MARGIN_NOT_CAPTURED_V8_7_11"},officialAttention:{status:"UNKNOWN_TPEX_ATTENTION_NOT_CAPTURED_V8_7_11"},disposition:{status:"UNKNOWN_TPEX_DISPOSITION_NOT_CAPTURED_V8_7_11"}}}
];
const coverage=mod.researchExternalEvidenceCoverageV8711(outcomes);
assert.equal(coverage.schemaVersion,"research-external-evidence-v2");
assert.equal(coverage.twseRevenueAvailable,1);
assert.equal(coverage.tpexRevenueAvailable,1);
assert.equal(coverage.actualSblShortAvailable,1);
assert.equal(coverage.formalCoreImpact,false);

console.log(JSON.stringify({
  ok:true,
  crossMarketRevenue:true,
  actualSblShort:true,
  tpexAbsenceNotFalse:true,
  noFakeRollingFlow:true,
  pointInTimeProvenance:true,
  formalCoreImpact:false
}));
