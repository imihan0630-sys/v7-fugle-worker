import assert from "node:assert/strict";

// Pure/manual-only plan. Never write D1 before validating the exact
// worker-generated three-trading-session gap inventory.
export function planMissingInstitutionDates(status,targetDate){
  assert.match(String(targetDate||""),/^\d{4}-\d{2}-\d{2}$/,"Institution target YYYY-MM-DD required");
  assert.equal(status?.marketDate,targetDate,"Institution status date mismatch");
  assert.ok(Array.isArray(status.validDates),"Institution validDates unavailable");
  assert.ok(Array.isArray(status.missingDates),"Institution missingDates unavailable");
  const valid=status.validDates;
  const missing=status.missingDates;
  const all=[...valid,...missing];
  assert.equal(all.length,3,"Expected exactly three authority-declared trading dates");
  assert.equal(new Set(all).size,all.length,"Duplicate institution trading dates");
  for(const date of all){
    assert.match(String(date),/^\d{4}-\d{2}-\d{2}$/,"Bad institution trading date");
    assert.ok(date<=targetDate,"Future institution trading date forbidden");
    const delta=Date.parse(targetDate+"T00:00:00Z")-Date.parse(date+"T00:00:00Z");
    assert.ok(Number.isFinite(delta)&&delta>=0&&delta<=14*86400000,
      "Institution three-trading-date inventory outside 14 days");
  }
  assert.ok(all.includes(targetDate),"Target trading date missing from institutional authority inventory");
  if(status.ready===true&&status.historicalReadback===true){
    assert.equal(missing.length,0,"Ready status has missing institution dates");
    return {alreadyReady:true,repairDates:[],tradingDateCount:3};
  }
  assert.equal(status.ready,false,"Inconsistent institution readiness; manual mutation denied");
  assert.ok(missing.length>0,"Incomplete institution readback without known missing date; manual mutation denied");
  return {alreadyReady:false,repairDates:[...missing],tradingDateCount:3};
}
