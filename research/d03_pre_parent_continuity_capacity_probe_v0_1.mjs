import assert from "node:assert/strict";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../system2/runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../system2/runtime/official_continuity_event_parser_v0_1.mjs";

const START="2026-08-15";
const END="2026-10-02";
const fetchedAt=new Date().toISOString();
const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const rows=[];
for(const [sourceId,source] of Object.entries(urls)){
  if(source.sourceClass!=="HISTORICAL_ACTUAL_RESULT_RANGE") continue;
  const response=await fetch(source.url,{
    headers:{accept:"application/json,text/plain,*/*","user-agent":"D03-PreParent-Continuity-Capacity/0.1"},
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,sourceId+" HTTP "+response.status);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,sourceUrl:source.url,rawText,fetchedAt,
    requestedStartDate:START,requestedEndDate:END,
  });
  assert.equal(parsed.responseRangeVerified,true,sourceId+" range");
  assert.equal(parsed.parserComplete,true,sourceId+" parser");
  const symbolMonths=new Set();
  const symbols=new Set();
  for(const e of parsed.events||[]){
    if(e?.symbol) symbols.add(String(e.symbol));
    const date=String(e?.effectiveDate||"");
    if(e?.symbol && /^\d{4}-\d{2}-\d{2}$/.test(date)){
      symbolMonths.add(String(e.symbol)+"|"+date.slice(0,7));
    }
  }
  rows.push({
    sourceId,
    eventCount:Number(parsed.eventCount||0),
    uniqueSymbolCount:symbols.size,
    uniqueSymbolMonthCount:symbolMonths.size,
    historicalFirstKnownUnknownCount:Number(parsed.historicalFirstKnownUnknownCount||0),
  });
}
assert.equal(rows.length,6);
const summary={
  schemaVersion:"D03_PRE_PARENT_CONTINUITY_CAPACITY_PROBE_V0_1",
  interval:{startDate:START,endDate:END},
  fetchedAt,
  lanes:rows,
  totalEventCount:rows.reduce((a,b)=>a+b.eventCount,0),
  sumUniqueSymbolMonthCountAcrossLanes:rows.reduce((a,b)=>a+b.uniqueSymbolMonthCount,0),
  maxLaneUniqueSymbolMonthCount:Math.max(...rows.map(x=>x.uniqueSymbolMonthCount)),
  note:"Counts estimate event-driven query cardinality only; cross-lane symbol-month duplicates are not deduplicated in the sum and no completeness/promotion claim is made.",
  outcomesAccessed:false,
  formalCoreImpact:"NONE",
};
console.log(JSON.stringify(summary,null,2));
