import assert from "node:assert/strict";
import {
  computeD08HistoricalValuationPercentilesV0_1,
  validateD08ScanDateAgainstRawSnapshotV0_1,
} from "../runtime/d08_historical_valuation_percentile_engine_v0_1.mjs";

function dateAt(i){
  const d=new Date(Date.UTC(2020,0,1));
  d.setUTCDate(d.getUTCDate()+i);
  return d.toISOString().slice(0,10);
}
const rows=[];
for(let i=0;i<1300;i++){
  rows.push({marketDate:dateAt(i),symbol:"1102",pe:10+(i%20),pb:0.5+(i%10)/10});
}
const scan=rows[1299].marketDate;
const r=computeD08HistoricalValuationPercentilesV0_1({historyRows:rows,metric:"pe",scanDate:scan});
assert.equal(r.windows.trailing252.state,"KNOWN");
assert.equal(r.windows.trailing252.validObservationCount,252);
assert.equal(r.windows.trailing756.validObservationCount,756);
assert.equal(r.windows.trailing1260.validObservationCount,1260);
assert.equal(r.windows.expanding.validObservationCount,1300);
assert.equal(r.windows.expanding.historyStartDate,rows[0].marketDate);

const withFuture=[...rows,{marketDate:dateAt(1400),symbol:"1102",pe:1,pb:0.1}];
const noFuture=computeD08HistoricalValuationPercentilesV0_1({historyRows:withFuture,metric:"pe",scanDate:scan});
assert.equal(noFuture.futureRowsExcluded,1);
assert.equal(noFuture.windows.expanding.validObservationCount,1300);
assert.equal(noFuture.windows.expanding.percentile,r.windows.expanding.percentile);

const missingCurrent=rows.map((x,i)=>i===1299?{...x,pe:null}:x);
const m=computeD08HistoricalValuationPercentilesV0_1({historyRows:missingCurrent,metric:"pe",scanDate:scan});
assert.equal(m.currentState,"UNKNOWN");
assert.equal(m.windows.trailing252.state,"UNKNOWN");
assert.equal(m.windows.trailing252.reason,"CURRENT_VALUE_UNAVAILABLE");

const short=computeD08HistoricalValuationPercentilesV0_1({
  historyRows:rows.slice(0,120),metric:"pb",scanDate:rows[119].marketDate,
});
assert.equal(short.windows.trailing252.state,"UNKNOWN");
assert.equal(short.windows.trailing252.reason,"INSUFFICIENT_VALID_HISTORY");
assert.equal(short.windows.expanding.state,"UNKNOWN");

assert.deepEqual(
  validateD08ScanDateAgainstRawSnapshotV0_1({
    symbol:"1102",scanDate:scan,
    dailyRow:{...rows[1299],fiscalReportPeriod:"115/2"},
    rawRow:{marketDate:scan,symbol:"1102",valuationObserved:true,pe:rows[1299].pe,pb:rows[1299].pb,fiscalReportPeriod:"115/2"},
  }),
  {ok:true,state:"MATCHED",symbol:"1102",scanDate:scan}
);
assert.throws(()=>validateD08ScanDateAgainstRawSnapshotV0_1({
  symbol:"1102",scanDate:scan,
  dailyRow:{...rows[1299],fiscalReportPeriod:"115/2"},
  rawRow:{marketDate:scan,symbol:"1102",valuationObserved:true,pe:999,pb:rows[1299].pb,fiscalReportPeriod:"115/2"},
}),/CURRENT_RAW_SNAPSHOT_MISMATCH:PE/);

assert.deepEqual(
  validateD08ScanDateAgainstRawSnapshotV0_1({
    symbol:"1101",scanDate:scan,dailyRow:null,
    rawRow:{marketDate:scan,symbol:"1101",valuationObserved:false,pe:null,pb:null,fiscalReportPeriod:null},
  }),
  {ok:true,state:"MATCHED_SOURCE_ROW_MISSING",symbol:"1101",scanDate:scan}
);
assert.throws(()=>validateD08ScanDateAgainstRawSnapshotV0_1({
  symbol:"1101",scanDate:scan,dailyRow:{marketDate:scan,symbol:"1101",pe:null,pb:0.8},
  rawRow:{marketDate:scan,symbol:"1101",valuationObserved:false,pe:null,pb:null,fiscalReportPeriod:null},
}),/CURRENT_RAW_SNAPSHOT_MISMATCH:OBSERVATION_PRESENCE/);

console.log(JSON.stringify({
  ok:true,
  guard:"D08_HISTORICAL_VALUATION_PERCENTILE_ENGINE",
  windows:["252","756","1260","EXPANDING_SINCE_AVAILABLE"],
  rawSnapshotCrosscheck:true,
  outcomeAccess:false,
  formalCoreImpact:false,
}));
