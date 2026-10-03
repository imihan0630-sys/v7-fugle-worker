import assert from "node:assert/strict";
import {
  HISTORICAL_VALUATION_REPLAY_VERSION,
  parseTwseBwibbuDaily,
  markFiscalDenominatorTransitions,
  averageRankPercentile,
  buildHistoricalPercentile,
} from "./historical_valuation_replay_core_v0_1.mjs";

const fields=["證券代號","證券名稱","收盤價","殖利率(%)","股利年度","本益比","股價淨值比","財報年/季"];
const payload={
  stat:"OK",
  date:"20261002",
  fields,
  data:[
    ["1101","台泥","25.35","3.16",114,"-","0.82","115/2"],
    ["1102","亞泥","35.60","6.46",114,"9.83","0.68","115/2"],
  ],
};

const parsed=parseTwseBwibbuDaily(payload);
assert.equal(parsed.ok,true);
assert.equal(parsed.rowCount,2);
assert.equal(parsed.rows[0].pe,null);
assert.equal(parsed.rows[0].peState,"SOURCE_NA_OR_UNKNOWN");
assert.equal(parsed.rows[0].pb,0.82);
assert.equal(parsed.rows[0].pbState,"KNOWN");
assert.equal(parsed.rows[1].pe,9.83);
assert.equal(parsed.rows[1].pb,0.68);
assert.equal(parsed.rows[1].fiscalReportPeriod,"115/2");
assert.equal(parsed.rows[1].decisionImpact,false);

const reorderedFields=["財報年/季","股價淨值比","本益比","證券名稱","證券代號","收盤價"];
const reordered=parseTwseBwibbuDaily({
  stat:"OK",date:"20261002",fields:reorderedFields,
  data:[["115/2","0.68","9.83","亞泥","1102","35.60"]],
});
assert.equal(reordered.ok,true);
assert.equal(reordered.rows[0].symbol,"1102");
assert.equal(reordered.rows[0].pe,9.83);
assert.equal(reordered.rows[0].pb,0.68);

const drift=parseTwseBwibbuDaily({
  stat:"OK",date:"20261002",
  fields:["證券代號","證券名稱","收盤價","本益比","財報年/季"],
  data:[["1102","亞泥","35.60","9.83","115/2"]],
});
assert.equal(drift.ok,false);
assert.equal(drift.state,"SCHEMA_DRIFT");
assert.deepEqual(drift.missingHeaders,["股價淨值比"]);

const duplicate=parseTwseBwibbuDaily({
  stat:"OK",date:"20261002",fields,
  data:[
    ["1102","亞泥","35.60","6.46",114,"9.83","0.68","115/2"],
    ["1102","亞泥","35.60","6.46",114,"9.83","0.68","115/2"],
  ],
});
assert.equal(duplicate.ok,false);
assert.equal(duplicate.state,"DUPLICATE_SYMBOL");

const fiscalSeries=markFiscalDenominatorTransitions([
  {tradeDate:"2026-08-12",symbol:"9904",fiscalReportPeriod:"115/1",pe:6.60,pb:0.47},
  {tradeDate:"2026-08-13",symbol:"9904",fiscalReportPeriod:"115/2",pe:5.06,pb:0.38},
]);
assert.equal(fiscalSeries[0].fiscalDenominatorChangedToday,false);
assert.equal(fiscalSeries[1].fiscalDenominatorChangedToday,true);
assert.equal(fiscalSeries[1].priorFiscalReportPeriod,"115/1");

assert.deepEqual(
  averageRankPercentile([10,12,12,15],12,{minValid:4}),
  {state:"KNOWN",reason:null,percentile:0.5,validObservationCount:4},
);
assert.deepEqual(
  averageRankPercentile([12,12,12,12],12,{minValid:4}),
  {state:"KNOWN",reason:null,percentile:0.5,validObservationCount:4},
);
assert.equal(averageRankPercentile([10,12,12,15],10,{minValid:4}).percentile,0);
assert.equal(averageRankPercentile([10,12,12,15],15,{minValid:4}).percentile,1);
assert.equal(averageRankPercentile([10,12,12],12,{minValid:4}).state,"UNKNOWN");
assert.equal(averageRankPercentile([10,12,12,15],null,{minValid:4}).reason,"CURRENT_VALUE_UNAVAILABLE");

const history=[
  {tradeDate:"2026-01-02",symbol:"1102",pe:10,pb:1.0},
  {tradeDate:"2026-01-05",symbol:"1102",pe:12,pb:1.1},
  {tradeDate:"2026-01-06",symbol:"1102",pe:12,pb:1.1},
  {tradeDate:"2026-01-07",symbol:"1102",pe:15,pb:1.2},
];
const pct=buildHistoricalPercentile(history,{metric:"pe",windowValid:4});
assert.equal(pct[0].state,"UNKNOWN");
assert.equal(pct[3].state,"KNOWN");
assert.equal(pct[3].percentile,1);

assert.equal(HISTORICAL_VALUATION_REPLAY_VERSION,"HISTORICAL_VALUATION_REPLAY_V0_1");
console.log(JSON.stringify({
  ok:true,
  parser:"TWSE_BWIBBU_D_HEADER_MAPPED",
  fiscalDenominatorTransition:"PASS",
  percentileTieRule:"AVERAGE_RANK_PERCENT_RANK",
  minimumHistory:"PASS",
  replayVersion:HISTORICAL_VALUATION_REPLAY_VERSION,
  decisionImpact:false,
}));
