import assert from "node:assert/strict";
import {validateLedgerEvent,materializeAsKnown} from "../research/confirmed_fill_ledger_v0_2_1.mjs";

const baseline={
  ledgerEventId:"BASE:FORMAL:2330:E1",ledgerEpochId:"EPOCH-20260929",eventKind:"POSITION_BASELINE",
  accountKey:"FORMAL_PRIMARY",symbol:"2330",source:"MANUAL_CONFIRMED",sourceRecordId:"base-1",
  effectiveAt:"2026-09-29T00:30:00Z",confirmedAt:"2026-09-29T00:31:00Z",
  sharesAfter:100,averageCostAfter:950,reconciliationStatus:"CONFIRMED"
};
const reduce={
  ledgerEventId:"FILL:2330:R1",ledgerEpochId:"EPOCH-20260929",eventKind:"FILL",
  accountKey:"FORMAL_PRIMARY",symbol:"2330",source:"MANUAL_CONFIRMED",sourceRecordId:"reduce-1",
  effectiveAt:"2026-09-29T02:00:00Z",confirmedAt:"2026-09-29T02:01:00Z",
  planScanDate:"2026-09-28",action:"REDUCE",fillPrice:1020,filledShares:40,sharesBefore:100,sharesAfter:60,
  averageCostAfter:950,reconciliationStatus:"CONFIRMED",signalEventId:"2026-09-29:2330:FULL:REDUCE"
};

assert.equal(validateLedgerEvent(baseline).ok,true);
assert.equal(validateLedgerEvent(reduce).ok,true);
{
  const r=validateLedgerEvent({...reduce,planScanDate:null});
  assert.equal(r.ok,false);assert.ok(r.errors.includes("PLAN_SCAN_DATE_REQUIRED_FOR_FILL"));
}
{
  const r=validateLedgerEvent({...reduce,ledgerEpochId:""});
  assert.equal(r.ok,false);assert.ok(r.errors.includes("LEDGER_EPOCH_ID_REQUIRED"));
}
{
  const r=materializeAsKnown([baseline,reduce],"2026-09-29T03:00:00Z");
  assert.equal(r.ok,true);assert.equal(r.states["FORMAL_PRIMARY|2330|EPOCH-20260929"].shares,60);
}
{
  const r=materializeAsKnown([reduce],"2026-09-29T03:00:00Z");
  assert.equal(r.ok,false);assert.ok(r.errors.some(x=>x.errors.includes("MISSING_LEDGER_BASELINE")));
}
{
  const buy={...reduce,ledgerEventId:"B",ledgerEpochId:"E2",symbol:"2454",sourceRecordId:"b",planScanDate:"2026-09-28",action:"BUY",sharesBefore:0,filledShares:10,sharesAfter:10,fillPrice:1400,averageCostAfter:1400,signalEventId:"sig-b"};
  const r=materializeAsKnown([buy],"2026-09-29T03:00:00Z");
  assert.equal(r.ok,true);assert.equal(r.states["FORMAL_PRIMARY|2454|E2"].startedBy,"ZERO_TO_BUY");
}
{
  const otherEpoch={...baseline,ledgerEventId:"BASE:E2",ledgerEpochId:"E2",sourceRecordId:"base-e2",sharesAfter:20,averageCostAfter:960};
  const r=materializeAsKnown([baseline,otherEpoch],"2026-09-29T03:00:00Z");
  assert.equal(r.ok,true);
  assert.equal(r.states["FORMAL_PRIMARY|2330|EPOCH-20260929"].shares,100);
  assert.equal(r.states["FORMAL_PRIMARY|2330|E2"].shares,20);
}
{
  const correction={...reduce,ledgerEventId:"CORR:R1",sourceRecordId:"corr-r1",reconciliationStatus:"CORRECTED",correctsLedgerEventId:"FILL:2330:R1",confirmedAt:"2026-09-30T01:00:00Z",filledShares:30,sharesBefore:100,sharesAfter:70,averageCostAfter:950};
  const before=materializeAsKnown([baseline,reduce,correction],"2026-09-29T23:59:59Z");
  assert.equal(before.states["FORMAL_PRIMARY|2330|EPOCH-20260929"].shares,60);
  const after=materializeAsKnown([baseline,reduce,correction],"2026-09-30T02:00:00Z");
  assert.equal(after.states["FORMAL_PRIMARY|2330|EPOCH-20260929"].shares,70);
}

console.log(JSON.stringify({ok:true,version:"CONFIRMED_FILL_LEDGER_V0_2_1",planLinkRequiredForFill:true,ledgerEpochRequired:true,baselineNotFill:true,pointInTimeCorrection:true,decisionImpact:false}));
