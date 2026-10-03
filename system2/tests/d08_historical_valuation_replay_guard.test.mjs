import assert from "node:assert/strict";
import {
  parseTwseBwibbuDaily,
  markFiscalDenominatorTransitions,
  averageRankPercentile,
} from "../../research/historical_valuation_replay_core_v0_1.mjs";

// Research-only bridge guard: this file exists only so System2 Research CI
// executes the D08 parser contract. It creates no System2 runtime authority.
const fields=["證券代號","證券名稱","收盤價","殖利率(%)","股利年度","本益比","股價淨值比","財報年/季"];
const parsed=parseTwseBwibbuDaily({
  stat:"OK",
  date:"20261002",
  fields,
  data:[
    ["1101","台泥","25.35","3.16",114,"-","0.82","115/2"],
    ["1102","亞泥","35.60","6.46",114,"9.83","0.68","115/2"],
  ],
});
assert.equal(parsed.ok,true);
assert.equal(parsed.rows[0].pe,null);
assert.equal(parsed.rows[0].pb,0.82);
assert.equal(parsed.rows[1].pe,9.83);

const transition=markFiscalDenominatorTransitions([
  {tradeDate:"2026-08-12",symbol:"9904",fiscalReportPeriod:"115/1",pe:6.60,pb:0.47},
  {tradeDate:"2026-08-13",symbol:"9904",fiscalReportPeriod:"115/2",pe:5.06,pb:0.38},
]);
assert.equal(transition[1].fiscalDenominatorChangedToday,true);

assert.equal(averageRankPercentile([10,12,12,15],12,{minValid:4}).percentile,0.5);
assert.equal(averageRankPercentile([10,12,12],12,{minValid:4}).state,"UNKNOWN");

console.log(JSON.stringify({
  ok:true,
  guard:"D08_HISTORICAL_VALUATION_REPLAY",
  system2RuntimeImpact:false,
  formalCoreImpact:false,
}));
