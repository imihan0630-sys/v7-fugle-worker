import assert from "node:assert/strict";
import fs from "node:fs";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { fetchHistoricalTwseCalendarV0_1 } from "../runtime/historical_twse_calendar_v0_1.mjs";

const years=[2017,2018];
const outputs=[];

function weekdayName(date){
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][
    new Date(date+"T12:00:00Z").getUTCDay()
  ];
}

for(const year of years){
  const evidencePath="system2/evidence/S2_HISTORICAL_TWSE_"+year+"_PHYSICAL_VERIFICATION_V0_1.json";
  const evidence=JSON.parse(fs.readFileSync(evidencePath,"utf8"));
  const expectedSessions=evidence?.verifierOutput?.sourceReconciliation?.officialTradingDates;
  const calendar=await fetchHistoricalTwseCalendarV0_1({year});
  assert.equal(calendar.year,year);
  assert.equal(calendar.tradingDatesExact,true);
  assert.equal(calendar.tradingDates.length,expectedSessions);
  assert.ok(calendar.tradingDates.every((date)=>date.startsWith(String(year)+"-")));

  const weekdayCounts={};
  const monthCounts={};
  for(const marketDate of calendar.tradingDates){
    const weekday=weekdayName(marketDate);
    const month=Number(marketDate.slice(5,7));
    weekdayCounts[weekday]=(weekdayCounts[weekday]||0)+1;
    monthCounts[month]=(monthCounts[month]||0)+1;
  }
  assert.equal(Object.values(weekdayCounts).reduce((a,b)=>a+b,0),expectedSessions);
  assert.equal(Object.values(monthCounts).reduce((a,b)=>a+b,0),expectedSessions);

  const stateHash=await sha256Hex({
    year,
    source:calendar.source,
    tradingDates:calendar.tradingDates,
    weekdayCounts,
    monthCounts,
  });

  outputs.push({
    year,
    expectedSessions,
    actualSessions:calendar.tradingDates.length,
    source:calendar.source,
    queryYearConvention:calendar.queryYearConvention,
    firstTradingDate:calendar.tradingDates[0],
    lastTradingDate:calendar.tradingDates.at(-1),
    weekdayCounts,
    monthCounts,
    stateHash,
    physicalEvidencePath:evidencePath,
    physicalEvidenceContentSha:null,
    sourceReconciliation:{
      freshOfficialRowCount:evidence.verifierOutput.sourceReconciliation.freshOfficialRowCount,
      coldRowCount:evidence.verifierOutput.sourceReconciliation.coldRowCount,
      missingFromColdCount:evidence.verifierOutput.sourceReconciliation.missingFromColdCount,
      absentFromFreshOfficialCount:evidence.verifierOutput.sourceReconciliation.absentFromFreshOfficialCount,
      sourceRowHashMismatchCount:evidence.verifierOutput.sourceReconciliation.sourceRowHashMismatchCount,
    },
  });
}

assert.equal(outputs[0].year,2017);
assert.equal(outputs[1].year,2018);
assert.equal(outputs[0].actualSessions,246);
assert.equal(outputs[1].actualSessions,247);
assert.notEqual(outputs[0].stateHash,outputs[1].stateHash);

const multiYearHash=await sha256Hex(outputs.map((x)=>({
  year:x.year,
  actualSessions:x.actualSessions,
  stateHash:x.stateHash,
  weekdayCounts:x.weekdayCounts,
  monthCounts:x.monthCounts,
})));

console.log(JSON.stringify({
  result:"PASS_D19_12_DATE_INTRINSIC_MULTI_YEAR_PIT",
  smokeVersion:"D19_12_DATE_INTRINSIC_MULTI_YEAR_SMOKE_V0_1",
  validatedStates:["WEEKDAY","MONTH_OF_YEAR"],
  years:outputs,
  independentYearAdded:2018,
  multiYearHash,
  interpretation:{
    sameFeatureSemanticsAcrossIndependentYears:true,
    futureTradingDateKnowledgeRequired:false,
    returnOutcomesOpened:false,
    holidayStatesPromoted:false,
    turnOfMonthPromoted:false,
    l4PromotionAuthorized:false,
    formalCoreChanged:false,
  }
},null,2));
