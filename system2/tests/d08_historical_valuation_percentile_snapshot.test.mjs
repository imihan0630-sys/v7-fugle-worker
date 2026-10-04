import assert from "node:assert/strict";
import { buildD08HistoricalValuationPercentileSnapshotV0_1 } from "../runtime/d08_historical_valuation_percentile_snapshot_v0_1.mjs";

function dateAt(i){
  const d=new Date(Date.UTC(2020,0,1)); d.setUTCDate(d.getUTCDate()+i);
  return d.toISOString().slice(0,10);
}
const scan=dateAt(1299);
const h1=[],h2=[];
for(let i=0;i<1300;i++){
  h1.push({marketDate:dateAt(i),symbol:"1102",pe:10+(i%15),pb:0.6+(i%8)/10,fiscalReportPeriod:i<1200?"115/1":"115/2"});
  h2.push({marketDate:dateAt(i),symbol:"1101",pe:i===1299?null:(12+(i%12)),pb:0.8+(i%6)/10,fiscalReportPeriod:i<1200?"115/1":"115/2"});
}
const members=[{symbol:"1101"},{symbol:"1102"}];
const rawRows=[
  {marketDate:scan,symbol:"1101",valuationObserved:true,pe:null,pb:h2[1299].pb,peState:"SOURCE_NA_OR_UNKNOWN",pbState:"KNOWN",fiscalReportPeriod:"115/2"},
  {marketDate:scan,symbol:"1102",valuationObserved:true,pe:h1[1299].pe,pb:h1[1299].pb,peState:"KNOWN",pbState:"KNOWN",fiscalReportPeriod:"115/2"},
];
const snap=buildD08HistoricalValuationPercentileSnapshotV0_1({
  scanDate:scan,members,rawRows,
  historyBySymbol:new Map([["1101",h2],["1102",h1]]),
  semanticRegistryHash:"registry",scanDateListHash:"dates",
});
assert.equal(snap.coverage.memberCount,2);
assert.equal(snap.coverage.peKnownCount,1);
assert.equal(snap.coverage.pbKnownCount,2);
assert.equal(snap.coverage.pe1260KnownCount,1);
assert.equal(snap.coverage.pb1260KnownCount,2);
assert.equal(snap.coverage.peExpandingKnownCount,1);
assert.equal(snap.coverage.pbExpandingKnownCount,2);
const r1101=snap.rows.find(r=>r.symbol==="1101");
assert.equal(r1101.pePercentiles.trailing252.state,"UNKNOWN");
assert.equal(r1101.pePercentiles.trailing252.reason,"CURRENT_VALUE_UNAVAILABLE");
assert.equal(r1101.pbPercentiles.trailing1260.state,"KNOWN");
assert.equal(r1101.fiscalTransition.state,"KNOWN");
assert.equal(r1101.fiscalTransition.changed,false);

assert.throws(()=>buildD08HistoricalValuationPercentileSnapshotV0_1({
  scanDate:scan,members,rawRows:rawRows.slice(0,1),
  historyBySymbol:new Map([["1101",h2],["1102",h1]]),
  semanticRegistryHash:"registry",scanDateListHash:"dates",
}),/RAW_SNAPSHOT_COHORT_ROW_MISSING/);

const snap2=buildD08HistoricalValuationPercentileSnapshotV0_1({
  scanDate:scan,members,rawRows,
  historyBySymbol:new Map([["1101",h2],["1102",h1]]),
  semanticRegistryHash:"registry",scanDateListHash:"dates",
});
assert.equal(snap.snapshotPayloadHash,snap2.snapshotPayloadHash);
console.log(JSON.stringify({
  ok:true,
  guard:"D08_HISTORICAL_VALUATION_PERCENTILE_SNAPSHOT",
  fullCohortAccounting:true,
  semanticIdempotency:true,
  outcomeAccess:false,
  formalCoreImpact:false,
}));
