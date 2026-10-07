import assert from "node:assert/strict";
import {
  evaluateHistoricalRevisionLineageV0_1,
  selectHistoricalRevisionAsOfV0_1,
} from "../runtime/historical_revision_lineage_v0_1.mjs";

function row(overrides={}){
  return {
    canonicalKey:"TPEX|1234|2021-01-14|RAW",
    marketDate:"2021-01-14",
    market:"TPEX",
    symbol:"1234",
    priceSpace:"RAW",
    open:10,high:11,low:9,close:10,
    volumeShares:1000,tradeValue:10000,transactions:100,change:0,
    sourceRowHash:"cold-hash",
    observedAt:"2026-10-06T01:55:00Z",
    availableAt:"2021-01-14T06:00:00Z",
    availabilityBasis:"SESSION_CLOSE_FINALITY",
    pitReplayEligible:true,
    capturedAt:"2026-10-06T01:55:00Z",
    barHash:"cold-bar",
    ...overrides,
  };
}
const cold=row();
const fresh=row({
  volumeShares:1200,
  tradeValue:12000,
  transactions:120,
  sourceRowHash:"fresh-hash",
  observedAt:"2026-10-07T00:30:00Z",
  availableAt:"2021-01-14T06:00:00Z",
  availabilityBasis:"SESSION_CLOSE_FINALITY",
  barHash:"fresh-source-bar",
});
const baselinePersisted=row();
const revisedPersisted=row({
  volumeShares:1200,
  tradeValue:12000,
  transactions:120,
  sourceRowHash:"fresh-hash",
  observedAt:"2026-10-07T00:30:00Z",
  availableAt:"2026-10-07T00:30:00Z",
  availabilityBasis:"PROSPECTIVE_OBSERVATION",
  capturedAt:"2026-10-07T00:30:00Z",
  barHash:"revised-bar",
});

const lineage=evaluateHistoricalRevisionLineageV0_1({
  coldRows:[cold],
  freshOfficialRows:[fresh],
  persistedRows:[baselinePersisted,revisedPersisted],
});
assert.equal(lineage.state,"PIT_REVISION_LINEAGE_READY");
assert.equal(lineage.changedKeyCount,1);
assert.equal(lineage.canonicalA1ChangeCount,1);
assert.equal(lineage.readyKeyCount,1);
assert.equal(lineage.pitRevisionLineageReady,true);
assert.equal(lineage.coldHistoryMutated,false);

const before=selectHistoricalRevisionAsOfV0_1({
  rows:[baselinePersisted,revisedPersisted],
  decisionTimestamp:"2026-10-06T23:59:59Z",
});
assert.equal(before.sourceRowHash,"cold-hash");
const after=selectHistoricalRevisionAsOfV0_1({
  rows:[baselinePersisted,revisedPersisted],
  decisionTimestamp:"2026-10-07T00:30:00Z",
});
assert.equal(after.sourceRowHash,"fresh-hash");

const missingRevision=evaluateHistoricalRevisionLineageV0_1({
  coldRows:[cold],
  freshOfficialRows:[fresh],
  persistedRows:[baselinePersisted],
});
assert.equal(missingRevision.state,"PIT_REVISION_LINEAGE_BLOCKED");
assert.ok(missingRevision.blockerSample.some((x)=>x.includes("REVISION_REVISED_VERSION_MISSING")));

await assert.rejects(
  async()=>selectHistoricalRevisionAsOfV0_1({
    rows:[
      baselinePersisted,
      revisedPersisted,
      {...revisedPersisted,sourceRowHash:"other-hash",barHash:"other-bar"},
    ],
    decisionTimestamp:"2026-10-07T00:30:00Z",
  }),
  /REVISION_AMBIGUITY_AT_SAME_AVAILABILITY/,
);

const sourceOnlyFresh=row({
  sourceRowHash:"source-only-new",
  observedAt:"2026-10-07T01:00:00Z",
  barHash:"source-only-fresh",
});
const sourceOnlyRevised=row({
  sourceRowHash:"source-only-new",
  observedAt:"2026-10-07T01:00:00Z",
  availableAt:"2026-10-07T01:00:00Z",
  availabilityBasis:"PROSPECTIVE_OBSERVATION",
  capturedAt:"2026-10-07T01:00:00Z",
  barHash:"source-only-revised",
});
const sourceOnly=evaluateHistoricalRevisionLineageV0_1({
  coldRows:[cold],
  freshOfficialRows:[sourceOnlyFresh],
  persistedRows:[baselinePersisted,sourceOnlyRevised],
});
assert.equal(sourceOnly.state,"PIT_REVISION_LINEAGE_READY");
assert.equal(sourceOnly.canonicalA1ChangeCount,0);
assert.equal(sourceOnly.sourceRevisionOnlyCount,1);

console.log("System2 historical revision lineage V0.1 tests passed");
