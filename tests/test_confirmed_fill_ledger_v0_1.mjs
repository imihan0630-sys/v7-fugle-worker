import assert from "node:assert/strict";
import {validateConfirmedFillEvent,validateAppendOnlySequence} from "../research/confirmed_fill_ledger_v0_1.mjs";

const base={
  executionEventId:"BROKER:20260929:2330:1",
  symbol:"2330",
  action:"BUY",
  source:"BROKER_IMPORT",
  sourceRecordId:"ord-1-fill-1",
  occurredAt:"2026-09-29T01:10:00Z",
  confirmedAt:"2026-09-29T01:10:02Z",
  fillPrice:1000,
  filledShares:10,
  sharesBefore:0,
  sharesAfter:10,
  averageCostAfter:1000,
  planScanDate:"2026-09-28",
  signalEventId:"2026-09-29:2330:NONE:BUY",
  reconciliationStatus:"CONFIRMED"
};

{
  const r=validateConfirmedFillEvent(base);
  assert.equal(r.ok,true);
  assert.equal(r.normalized.sharesAfter,10);
}
{
  const r=validateConfirmedFillEvent({...base,executionEventId:base.signalEventId});
  assert.equal(r.ok,false);
  assert.ok(r.errors.includes("SIGNAL_ID_MUST_NOT_BE_EXECUTION_ID"));
}
{
  const r=validateConfirmedFillEvent({...base,action:"ADD",sharesBefore:10,filledShares:5,sharesAfter:14,executionEventId:"x",sourceRecordId:"x"});
  assert.equal(r.ok,false);
  assert.ok(r.errors.includes("POSITION_TRANSITION_MISMATCH"));
}
{
  const r=validateConfirmedFillEvent({...base,action:"REDUCE",sharesBefore:10,filledShares:10,sharesAfter:0,executionEventId:"r",sourceRecordId:"r"});
  assert.equal(r.ok,false);
  assert.ok(r.errors.includes("REDUCE_MUST_LEAVE_POSITION"));
}
{
  const r=validateConfirmedFillEvent({...base,action:"SELL",sharesBefore:10,filledShares:4,sharesAfter:6,executionEventId:"s",sourceRecordId:"s",averageCostAfter:1000});
  assert.equal(r.ok,false);
  assert.ok(r.errors.includes("SELL_MUST_CLOSE_POSITION"));
}
{
  const seq=[
    base,
    {...base,executionEventId:"BROKER:20260929:2330:2",sourceRecordId:"ord-2-fill-1",action:"ADD",filledShares:5,sharesBefore:10,sharesAfter:15,fillPrice:1010,averageCostAfter:1003.33,occurredAt:"2026-09-29T02:00:00Z",confirmedAt:"2026-09-29T02:00:02Z"},
    {...base,executionEventId:"BROKER:20260929:2330:3",sourceRecordId:"ord-3-fill-1",action:"REDUCE",filledShares:5,sharesBefore:15,sharesAfter:10,fillPrice:1050,averageCostAfter:1003.33,occurredAt:"2026-09-29T03:00:00Z",confirmedAt:"2026-09-29T03:00:02Z"},
    {...base,executionEventId:"BROKER:20260929:2330:4",sourceRecordId:"ord-4-fill-1",action:"SELL",filledShares:10,sharesBefore:10,sharesAfter:0,fillPrice:1060,averageCostAfter:null,occurredAt:"2026-09-29T04:00:00Z",confirmedAt:"2026-09-29T04:00:02Z"}
  ];
  const r=validateAppendOnlySequence(seq);
  assert.equal(r.ok,true);
}
{
  const seq=[
    base,
    {...base,executionEventId:"bad2",sourceRecordId:"bad2",action:"ADD",filledShares:5,sharesBefore:9,sharesAfter:14,fillPrice:1010,averageCostAfter:1003,occurredAt:"2026-09-29T02:00:00Z",confirmedAt:"2026-09-29T02:00:02Z"}
  ];
  const r=validateAppendOnlySequence(seq);
  assert.equal(r.ok,false);
  assert.ok(r.errors.some(x=>x.errors.includes("CROSS_EVENT_POSITION_CHAIN_BREAK")));
}
{
  const correction={...base,executionEventId:"corr1",sourceRecordId:"corr1",reconciliationStatus:"CORRECTED",correctsExecutionEventId:"missing"};
  const r=validateAppendOnlySequence([correction]);
  assert.equal(r.ok,false);
  assert.ok(r.errors.some(x=>x.errors.includes("CORRECTION_TARGET_NOT_PRIOR_EVENT")));
}

console.log(JSON.stringify({
  ok:true,
  class:"A",
  appendOnlyConfirmedFillContract:true,
  signalExecutionIdentitySeparated:true,
  positionTransitionInvariant:true,
  correctionIsAppendOnly:true,
  decisionImpact:false
}));
