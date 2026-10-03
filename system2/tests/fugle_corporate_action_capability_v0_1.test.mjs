import assert from "node:assert/strict";
import {
  buildFugleCorporateActionCapabilityUrlsV0_1,
  probeFugleCorporateActionCapabilityV0_1,
} from "../runtime/fugle_corporate_action_capability_v0_1.mjs";

const urls=buildFugleCorporateActionCapabilityUrlsV0_1({
  startDate:"2026-06-01",
  endDate:"2026-10-02",
});
assert.match(urls.dividends,/corporate-actions\/dividends/);
assert.match(urls.capitalChanges,/corporate-actions\/capital-changes/);
assert.match(urls.dividends,/start_date=2026-06-01/);
assert.match(urls.capitalChanges,/end_date=2026-10-02/);

const dividendPayload={
  data:[
    {
      date:"2026-08-26",exchange:"TPEx",symbol:"6752",name:"fixture",
      previousClose:158.5,referencePrice:150.95,dividend:7.548635,
      dividendType:"權",cashDividend:0,stockDividendShares:50.007,
    },
    {
      date:"2026-09-01",exchange:"TWSE",symbol:"2330",name:"fixture",
      previousClose:1200,referencePrice:1190,dividend:10,
      dividendType:"息",cashDividend:10,stockDividendShares:0,
    },
  ],
};
const capitalPayload={
  start_date:"2026-06-01",end_date:"2026-10-02",sort:"asc",
  data:[
    {
      symbol:"4530",name:"fixture",actionType:"capital_reduction",exchange:"TPEx",
      haltDate:"2026-07-10",resumeDate:"2026-07-20",
      raw:{previousClose:20,referencePrice:25,reason:"fixture"},
    },
    {
      symbol:"1234",name:"fixture",actionType:"par_value_change",exchange:"TWSE",
      haltDate:"2026-08-01",resumeDate:"2026-08-10",
      raw:{previousClose:50,referencePrice:100,parValueBefore:10,parValueAfter:5},
    },
  ],
};
const calls=[];
const ready=await probeFugleCorporateActionCapabilityV0_1({
  apiKey:"secret-fixture",
  startDate:"2026-06-01",
  endDate:"2026-10-02",
  observedAt:"2026-10-03T06:59:00.000Z",
  fetchImpl:async (url,options)=>{
    calls.push({url,headers:options.headers});
    assert.equal(options.headers["X-API-KEY"],"secret-fixture");
    return {
      ok:true,status:200,
      json:async()=>String(url).includes("/dividends")?dividendPayload:capitalPayload,
    };
  },
});
assert.equal(calls.length,2);
assert.equal(ready.state,"SOURCE_CAPABILITY_READY");
assert.equal(ready.dividends.rowCount,2);
assert.equal(ready.dividends.exchangeCounts.TWSE,1);
assert.equal(ready.dividends.exchangeCounts.TPEX,1);
assert.equal(ready.dividends.priceReferenceReadyCount,2);
assert.equal(ready.dividends.outOfRangeCount,0);
assert.equal(ready.capitalChanges.rowCount,2);
assert.equal(ready.capitalChanges.priceReferenceReadyCount,2);
assert.equal(ready.capitalChanges.actionTypeCounts.capital_reduction,1);
assert.equal(ready.capitalChanges.actionTypeCounts.par_value_change,1);
assert.equal(ready.sourceCoverageComplete,false);
assert.equal(ready.noEventMayBeClaimed,false);
assert.equal(ready.symbolSessionCompletenessCertified,false);
assert.equal(ready.technicalContinuityCertified,false);
assert.equal(ready.continuityTransformPerformed,false);
assert.equal(ready.historyMutationPerformed,false);
assert.equal(ready.selectionAuthority,false);
assert.equal(ready.system1RuntimeUsed,false);

const blocked=await probeFugleCorporateActionCapabilityV0_1({
  apiKey:"secret-fixture",
  startDate:"2026-06-01",
  endDate:"2026-10-02",
  observedAt:"2026-10-03T06:59:00.000Z",
  fetchImpl:async (url)=>({
    ok:false,
    status:String(url).includes("/dividends")?403:401,
    json:async()=>({message:"plan blocked"}),
  }),
});
assert.equal(blocked.state,"SOURCE_CAPABILITY_PLAN_OR_AUTH_BLOCKED");
assert.equal(blocked.transports.dividends.errorCode,"PLAN_OR_AUTH_BLOCKED");
assert.equal(blocked.transports.capitalChanges.errorCode,"PLAN_OR_AUTH_BLOCKED");
assert.equal(blocked.dividends,null);
assert.equal(blocked.capitalChanges,null);
assert.equal(blocked.technicalContinuityCertified,false);

const partial=await probeFugleCorporateActionCapabilityV0_1({
  apiKey:"secret-fixture",
  startDate:"2026-06-01",
  endDate:"2026-10-02",
  observedAt:"2026-10-03T06:59:00.000Z",
  fetchImpl:async (url)=>String(url).includes("/dividends")
    ? {ok:true,status:200,json:async()=>dividendPayload}
    : {ok:false,status:503,json:async()=>({})},
});
assert.equal(partial.state,"SOURCE_CAPABILITY_INCOMPLETE");
assert.equal(partial.dividends.rowCount,2);
assert.equal(partial.capitalChanges,null);
assert.equal(partial.noEventMayBeClaimed,false);

await assert.rejects(
  probeFugleCorporateActionCapabilityV0_1({
    apiKey:"secret-fixture",
    startDate:"2026-06-01",
    endDate:"2026-10-02",
    observedAt:"2026-10-03T06:59:00.000Z",
    fetchImpl:async (url)=>({
      ok:true,status:200,
      json:async()=>String(url).includes("/dividends")
        ? {data:[{...dividendPayload.data[0],date:"2026-12-01"}]}
        : capitalPayload,
    }),
  }),
  /must be YYYY-MM-DD|payload|range|date/i,
);

console.log("System2 Fugle corporate-action capability probe tests passed");
