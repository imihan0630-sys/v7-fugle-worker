import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildOfficialTradingDatesV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import { fetchOfficialHistoricalA1DateV0_1 } from "../runtime/official_historical_a1_source_v0_1.mjs";
import {
  buildBoundedRawA1SessionPlanV0_10,
  evaluateBoundedRawA1LineageV0_10,
  summarizeBoundedRawA1LineageV0_10,
} from "../runtime/s2_07_raw_a1_lineage_v0_10.mjs";

const RECEIPT_URL=new URL("../evidence/S2_07_NATIVE_SCHEDULE_INTEGRATION_V0_9_PHYSICAL_20261007.json",import.meta.url);
const CALENDAR_START="2026-03-20";
const CALENDAR_END="2026-10-02";
const receipt=JSON.parse(await readFile(RECEIPT_URL,"utf8"));
assert.equal(receipt.schemaVersion,"S2_S2_07_NATIVE_SCHEDULE_INTEGRATION_PHYSICAL_RECEIPT_V0_9");
assert.equal(receipt.readyCases.length,4);
assert.equal(receipt.boundaries.rawA1LineageBound,false);

const calendar=await buildOfficialTradingDatesV0_1({fromDate:CALENDAR_START,toDate:CALENDAR_END});
assert.ok(calendar.tradingDateCount>0);

const plans=receipt.readyCases.map(row=>buildBoundedRawA1SessionPlanV0_10({
  market:row.market,
  symbol:row.symbol,
  stopTradingStart:row.stopTradingStart,
  resumeTradingDate:row.resumeTradingDate,
  boundedNativeSymbolSessionEvidenceReady:true,
  marketSessions:calendar.tradingDates,
}));
for(const plan of plans){
  assert.equal(plan.market,"TPEX");
  assert.ok(plan.priorTradingSession);
  assert.equal(plan.resumeIsMarketSession,true);
}

const requiredDates=[...new Set(plans.flatMap(x=>x.requiredDates))].sort();
const dateResults=new Map();
for(const marketDate of requiredDates){
  const observedAt=new Date().toISOString();
  const result=await fetchOfficialHistoricalA1DateV0_1({
    market:"TPEX",
    marketDate,
    observedAt,
    retryAttempts:4,
    retryDelayMs:350,
  });
  assert.equal(result.marketDate,marketDate);
  assert.equal(result.sourceDateEvidence,marketDate);
  assert.equal(result.rawPriceSpace,"RAW");
  const sourcePopulationHash=await sha256Hex({
    marketDate,
    sourceId:result.sourceId,
    sourceDateEvidence:result.sourceDateEvidence,
    sourceDateEvidenceBasis:result.sourceDateEvidenceBasis,
    sourceRows:(result.rows||[]).map(x=>x.sourceFields),
  });
  dateResults.set(marketDate,{...result,sourcePopulationHash});
  await new Promise(resolve=>setTimeout(resolve,120));
}

const rows=[];
for(const plan of plans){
  const observations=[];
  for(const marketDate of plan.requiredDates){
    const result=dateResults.get(marketDate);
    assert.ok(result,"missing fetched date "+marketDate);
    const symbolRow=(result.rows||[]).find(x=>String(x.symbol)===plan.symbol)||null;
    const tradableOhlcObserved=!!symbolRow&&
      [symbolRow.open,symbolRow.high,symbolRow.low,symbolRow.close].every(Number.isFinite);
    observations.push({
      marketDate,
      sourceId:result.sourceId,
      sourceUrl:result.sourceUrl,
      sourceDateEvidence:result.sourceDateEvidence,
      sourceDateEvidenceBasis:result.sourceDateEvidenceBasis,
      transportMode:result.transportMode,
      rawPriceSpace:result.rawPriceSpace,
      sourcePopulationHash:result.sourcePopulationHash,
      symbolRowObserved:!!symbolRow,
      symbolRowHash:symbolRow?await sha256Hex(symbolRow.sourceFields):null,
      tradableOhlcObserved,
    });
  }
  rows.push(evaluateBoundedRawA1LineageV0_10({plan,observations}));
}
const summary=summarizeBoundedRawA1LineageV0_10(rows);
assert.equal(summary.eventCount,4);
assert.equal(summary.suspendedSessionsTreatedAsMissingData,false);
assert.equal(summary.historicalPublicationTimestampProven,false);
assert.equal(summary.pitHistoricalPublicationClockCertified,false);
assert.equal(summary.technicalContinuityCertified,false);
assert.equal(summary.historyMutationPerformed,false);
assert.equal(summary.selectionAuthority,false);
assert.equal(summary.orderImpact,false);
for(const row of rows){
  assert.equal(row.suspendedSessionsTreatedAsMissingData,false);
  assert.equal(row.technicalContinuityCertified,false);
  assert.equal(row.historyMutationPerformed,false);
  assert.equal(row.system1RuntimeUsed,false);
}

console.log(JSON.stringify({
  result:"S2_07_RAW_A1_LINEAGE_V0_10_COMPLETE",
  calendar:{source:calendar.source,tradingDateCount:calendar.tradingDateCount,fromDate:CALENDAR_START,toDate:CALENDAR_END},
  fetchedExactDateCount:requiredDates.length,
  summary,
  events:rows,
  boundaries:{
    certifiedSuspensionSessionsMayBeRemovedFromExpectedTradableBars:true,
    suspendedSessionsTreatedAsMissingData:false,
    priceAdjustmentPerformed:false,
    historicalPublicationTimestampProven:false,
    pitHistoricalPublicationClockCertified:false,
    technicalContinuityCertified:false,
    tradingAuthority:false,
  },
},null,2));
