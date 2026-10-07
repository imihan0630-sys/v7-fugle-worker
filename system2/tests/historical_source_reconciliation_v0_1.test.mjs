import assert from "node:assert/strict";
import {
  reconcileHistoricalSourceRowsV0_1,
  CANONICAL_HISTORICAL_A1_VALUE_FIELDS,
} from "../runtime/historical_source_reconciliation_v0_1.mjs";

function row(overrides={}){
  return {
    market:"TPEX",
    marketDate:"2020-02-27",
    symbol:"6488",
    priceSpace:"RAW",
    open:100,
    high:105,
    low:99,
    close:103,
    volumeShares:1000,
    tradeValue:102000,
    transactions:50,
    change:2,
    sourceRowHash:"a".repeat(64),
    ...overrides,
  };
}

{
  const r=reconcileHistoricalSourceRowsV0_1({
    coldRows:[row()],
    freshOfficialRows:[row()],
  });
  assert.equal(r.state,"PASS");
  assert.equal(r.dataIntegrityState,"PASS");
  assert.equal(r.sourceVersionState,"STABLE");
  assert.equal(r.sourceRowHashMismatchCount,0);
  assert.equal(r.canonicalA1ValueMismatchCount,0);
  assert.equal(r.canonicalRevisionLineageRequired,false);
}

{
  const r=reconcileHistoricalSourceRowsV0_1({
    coldRows:[row()],
    freshOfficialRows:[row({sourceRowHash:"b".repeat(64)})],
  });
  assert.equal(r.state,"PASS_SOURCE_REVISION_OBSERVED");
  assert.equal(r.dataIntegrityState,"PASS");
  assert.equal(r.sourceVersionState,"SOURCE_REVISION_OBSERVED_CANONICAL_A1_STABLE");
  assert.equal(r.sourceRowHashMismatchCount,1);
  assert.equal(r.sourceRevisionOnlyCount,1);
  assert.equal(r.canonicalA1ValueMismatchCount,0);
  assert.equal(r.canonicalRevisionLineageRequired,false);
  assert.deepEqual(r.sourceRevisionByDate,[{marketDate:"2020-02-27",count:1}]);
  assert.equal(r.sourceRevisionOnlySample[0].canonicalA1Stable,true);
}

{
  const r=reconcileHistoricalSourceRowsV0_1({
    coldRows:[row()],
    freshOfficialRows:[row({close:104,sourceRowHash:"b".repeat(64)})],
  });
  assert.equal(r.state,"BLOCKED");
  assert.equal(r.dataIntegrityState,"BLOCKED");
  assert.equal(r.sourceVersionState,"SOURCE_REVISION_WITH_CANONICAL_A1_CHANGE");
  assert.equal(r.sourceRowHashMismatchCount,1);
  assert.equal(r.canonicalA1ValueMismatchCount,1);
  assert.equal(r.canonicalRevisionLineageRequired,true);
  assert.deepEqual(r.canonicalA1ValueMismatchSample[0].differingFields,["close"]);
}

{
  const r=reconcileHistoricalSourceRowsV0_1({
    coldRows:[row()],
    freshOfficialRows:[],
  });
  assert.equal(r.state,"BLOCKED");
  assert.equal(r.absentFromFreshOfficialCount,1);
}

{
  const r=reconcileHistoricalSourceRowsV0_1({
    coldRows:[],
    freshOfficialRows:[row()],
  });
  assert.equal(r.state,"BLOCKED");
  assert.equal(r.missingFromColdCount,1);
}

assert.ok(CANONICAL_HISTORICAL_A1_VALUE_FIELDS.includes("open"));
assert.ok(CANONICAL_HISTORICAL_A1_VALUE_FIELDS.includes("tradeValue"));
assert.ok(!CANONICAL_HISTORICAL_A1_VALUE_FIELDS.includes("companyName"));
assert.ok(!CANONICAL_HISTORICAL_A1_VALUE_FIELDS.includes("sourceRowHash"));

console.log("historical_source_reconciliation_v0_1 tests passed");
