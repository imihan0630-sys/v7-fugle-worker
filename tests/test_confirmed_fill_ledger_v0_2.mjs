import assert from "node:assert/strict";
import {validateLedgerEvent,materializeAsKnown} from "../research/confirmed_fill_ledger_v0_2.mjs";

const baseline={
  ledgerEventId:"BASE:FORMAL:2330:20260929",
  eventKind:"POSITION_BASELINE",
  accountKey:"FORMAL_PRIMARY",
  symbol:"2330",
  source:"MANUAL_CONFIRMED",
  sourceRecordId:"baseline-2330-20260929",
  effectiveAt:"2026-09-29T00:30:00Z",
  confirmedAt:"2026-09-29T00:31:00Z",
  sharesAfter:100,
  averageCostAfter:950,
  reconciliationStatus:"CONFIRMED"
};
const reduce={
  ledgerEventId:"FILL:2330:R1",
  eventKind:"FILL",
  accountKey:"FORMAL_PRIMARY",
  symbol:"2330",
  source:"MANUAL_CONFIRMED",
  sourceRecordId:"reduce-1",
  effectiveAt:"2026-09-29T02:00:00Z",
  confirmedAt:"2026-09-29T02:01:00Z",
  action:"REDUCE",
  fillPrice:1020,
  filledShares:40,
  sharesBefore:100,
  sharesAfter:60,
  averageCostAfter:950,
  reconciliationStatus:"CONFIRMED",
  signalEventId:"2026-09-29:2330:FULL:REDUCE"
};

{
  const r=validateLedgerEvent(baseline);
  assert.equal(r.ok,true);
  assert.equal(r.normalized.semantics,"OBSERVED_LEDGER_START_STATE_NOT_EXECUTION");
}
{
  const r=validateLedgerEvent({...baseline,filledShares:100,fillPrice:950,action:"BUY",sharesBefore:0});
  assert.equal(r.ok,false);
  assert.ok(r.errors.includes("BASELINE_MUST_NOT_PRETEND_TO_BE_FILL"));
}
{
  const r=materializeAsKnown([baseline,reduce],"2026-09-29T03:00:00Z");
  assert.equal(r.ok,true);
  assert.equal(r.states["FORMAL_PRIMARY|2330"].shares,60);
}
{
  // First recorded action is a REDUCE with no baseline: impossible to prove historical state.
  const r=materializeAsKnown([reduce],"2026-09-29T03:00:00Z");
  assert.equal(r.ok,false);
  assert.ok(r.errors.some(x=>x.errors.includes("MISSING_LEDGER_BASELINE")));
}
{
  // A clean zero -> BUY can start without a baseline.
  const buy={...reduce,ledgerEventId:"FILL:2454:B1",symbol:"2454",sourceRecordId:"buy-1",action:"BUY",sharesBefore:0,filledShares:10,sharesAfter:10,fillPrice:1400,averageCostAfter:1400,signalEventId:"sig-buy"};
  const r=materializeAsKnown([buy],"2026-09-29T03:00:00Z");
  assert.equal(r.ok,true);
  assert.equal(r.states["FORMAL_PRIMARY|2454"].startedBy,"ZERO_TO_BUY");
}
{
  // A correction confirmed later must not rewrite the earlier as-known view.
  const correction={...reduce,ledgerEventId:"CORR:R1",sourceRecordId:"corr-r1",reconciliationStatus:"CORRECTED",correctsLedgerEventId:"FILL:2330:R1",confirmedAt:"2026-09-30T01:00:00Z",filledShares:30,sharesBefore:100,sharesAfter:70,averageCostAfter:950};
  const before=materializeAsKnown([baseline,reduce,correction],"2026-09-29T23:59:59Z");
  assert.equal(before.ok,true);
  assert.equal(before.states["FORMAL_PRIMARY|2330"].shares,60);
  const after=materializeAsKnown([baseline,reduce,correction],"2026-09-30T02:00:00Z");
  assert.equal(after.ok,true);
  assert.equal(after.states["FORMAL_PRIMARY|2330"].shares,70);
}
{
  // Account scope prevents same-symbol holdings in different accounts from being mixed.
  const second={...baseline,ledgerEventId:"BASE:ALT:2330",accountKey:"ALT",sourceRecordId:"alt-base",sharesAfter:25,averageCostAfter:970};
  const r=materializeAsKnown([baseline,second],"2026-09-29T03:00:00Z");
  assert.equal(r.ok,true);
  assert.equal(r.states["FORMAL_PRIMARY|2330"].shares,100);
  assert.equal(r.states["ALT|2330"].shares,25);
}

console.log(JSON.stringify({
  ok:true,
  version:"CONFIRMED_FILL_LEDGER_V0_2",
  positionBaselineSeparatedFromFill:true,
  preBaselineHistoryUnknown:true,
  zeroToBuyCanStartLedger:true,
  correctionIsPointInTime:true,
  accountScopeSeparated:true,
  decisionImpact:false
}));
