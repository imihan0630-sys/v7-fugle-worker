import assert from "node:assert/strict";
import {
  buildMopsExactVersionObservationV1_6,
  buildProspectiveMopsExactVersionPopulationReceiptV1_6,
} from "../runtime/s2_07_mops_exact_version_population_v1_6.mjs";

const lanePlan=[
  ["TWSE_CAPITAL_REDUCTION_REFERENCE",9,"CAPITAL_REDUCTION"],
  ["TWSE_PAR_VALUE_CHANGE_REFERENCE",1,"PAR_VALUE_CHANGE"],
  ["TPEX_CAPITAL_REDUCTION_REFERENCE",9,"CAPITAL_REDUCTION"],
  ["TPEX_PAR_VALUE_CHANGE_REFERENCE",4,"PAR_VALUE_CHANGE"],
];
const events=[];
let n=1000;
for(const [sourceId,count,family] of lanePlan){
  for(let i=0;i<count;i+=1){
    events.push({sourceId,symbol:String(n++),effectiveDate:"2026-10-02",family});
  }
}
assert.equal(events.length,23);

function row(symbol,{date="2026-10-07",time="06:00:00",seqNo="1",text="公告本公司辦理減資相關事宜"}={}){
  return {
    stockCode:symbol,
    date,
    time,
    seqNo,
    spokeDateRaw:date.replaceAll("-",""),
    spokeTimeRaw:time.replaceAll(":",""),
    typek:"otc",
    correctionOrCancellationHint:false,
    rowText:text,
  };
}

const observations=[];
for(const event of events){
  observations.push(await buildMopsExactVersionObservationV1_6({
    stockCode:event.symbol,
    row:row(event.symbol),
    observedAt:"2026-10-07T06:01:00+08:00",
    sourceQueryRef:event.symbol+"|2026|10",
  }));
}
assert.ok(observations.every(o=>o.eligible===true));
assert.equal(new Set(observations.map(o=>o.sourceClockVersionKey)).size,1,"fixture deliberately shares local source-clock key");
assert.equal(new Set(observations.map(o=>o.versionKey)).size,23,"global MOPS keys must include stock code");
assert.ok(observations.every(o=>/^S2-MOPS-V:[0-9a-f]{64}$/.test(o.versionKey)));
assert.ok(observations.every(o=>/^[0-9a-f]{64}$/.test(o.versionPayloadHash)));

const diagnostics=events.map(e=>({
  symbol:e.symbol,
  transportReady:true,
  annualQueriesReady:true,
  monthShardQueriesReady:true,
  annualNoPaginationHint:true,
  monthShardNoPaginationHint:true,
  monthShardQueryCount:2,
  annualVsMonthKeysetExact:true,
  monthOnlyVersionCount:0,
  yearOnlyVersionCount:0,
}));

const receipt=await buildProspectiveMopsExactVersionPopulationReceiptV1_6({
  frozenEvents:events,
  observations,
  queryDiagnostics:diagnostics,
  capturedAt:"2026-10-07T06:02:00+08:00",
});
assert.equal(receipt.state,"PROSPECTIVE_MOPS_EXACT_VERSION_POPULATION_CAPTURED_COMPLETENESS_PENDING");
assert.equal(receipt.prospectiveExactVersionCaptureReady,true);
assert.equal(receipt.frozenEventCount,23);
assert.equal(receipt.frozenUniqueSymbolCount,23);
assert.equal(receipt.uniqueGlobalVersionKeyCount,23);
assert.equal(receipt.coveredSymbolCount,23);
assert.equal(receipt.sourceClockVersionKeyCollisionCount,1);
assert.equal(receipt.expectedMopsKeysetComplete,false);
assert.equal(receipt.noRevisionGapThroughCut,false);
assert.equal(receipt.preParentEvidenceCutReady,false);
assert.equal(receipt.technicalContinuityCertified,false);
assert.equal(receipt.scheduleAdded,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

const late=await buildMopsExactVersionObservationV1_6({
  stockCode:"2330",
  row:row("2330",{time:"09:00:00"}),
  observedAt:"2026-10-07T08:59:59+08:00",
});
assert.equal(late.eligible,false);
assert.equal(late.state,"OBSERVATION_PRECEDES_SOURCE_REPORTED_CLOCK");

const badDiagnostics=diagnostics.map(x=>({...x}));
badDiagnostics[0].monthShardNoPaginationHint=false;
const blocked=await buildProspectiveMopsExactVersionPopulationReceiptV1_6({
  frozenEvents:events,
  observations,
  queryDiagnostics:badDiagnostics,
  capturedAt:"2026-10-07T06:02:00+08:00",
});
assert.equal(blocked.prospectiveExactVersionCaptureReady,false);
assert.ok(blocked.blockers.includes("MOPS_QUERY_TRANSPORT_OR_SHARD_CAPTURE_INCOMPLETE"));

const mutated=[...observations,{...observations[0],versionPayloadHash:"f".repeat(64),firstObservedAt:"2026-10-07T06:01:30.000Z"}];
const conflict=await buildProspectiveMopsExactVersionPopulationReceiptV1_6({
  frozenEvents:events,
  observations:mutated,
  queryDiagnostics:diagnostics,
  capturedAt:"2026-10-07T06:02:00+08:00",
});
assert.equal(conflict.prospectiveExactVersionCaptureReady,false);
assert.ok(conflict.blockers.includes("MOPS_EXACT_VERSION_PAYLOAD_CONFLICT"));

console.log("S2-07 MOPS exact-version population V1.6 tests PASS");
