import assert from "node:assert/strict";
import {validateTpexInstitutionSemanticFixture,EXPECTED_FIELDS} from "./tpex_institution_semantic_validator_v0_1.mjs";

function row(){
  const r=Array(24).fill("0");
  r[0]="6488";r[1]="測試";
  // foreign main
  r[2]="100";r[3]="40";r[4]="60";
  // foreign dealer
  r[5]="0";r[6]="0";r[7]="0";
  // foreign aggregate
  r[8]="100";r[9]="40";r[10]="60";
  // trust
  r[11]="20";r[12]="5";r[13]="15";
  // dealer prop
  r[14]="30";r[15]="10";r[16]="20";
  // dealer hedge
  r[17]="5";r[18]="10";r[19]="-5";
  // dealer aggregate
  r[20]="35";r[21]="20";r[22]="15";
  // official total excludes foreign dealer
  r[23]="90";
  return r;
}
const payload=r=>({stat:"ok",tables:[{fields:[...EXPECTED_FIELDS],data:[r]}]});

{
  const out=validateTpexInstitutionSemanticFixture(payload(row()));
  assert.equal(out.state,"SEMANTIC_SCHEMA_PASS");
  assert.equal(out.mismatchCounts.officialTotal,0);
  assert.equal(out.mismatchCounts.currentParserTotal,0);
}

// Interior triplet swap leaves the generic fields vector identical but breaks arithmetic fingerprint.
{
  const r=row();
  const a=r.slice(8,11),b=r.slice(11,14);
  r.splice(8,3,...b);r.splice(11,3,...a);
  const out=validateTpexInstitutionSemanticFixture(payload(r));
  assert.equal(out.fieldVectorIsGenericRepeatedTriplets,true);
  assert.equal(out.state,"SEMANTIC_SCHEMA_MISMATCH");
  assert.ok(out.mismatchCounts.foreignAggregateNet>0 || out.mismatchCounts.officialTotal>0);
}

// Interior label rename is caught by exact generic field vector.
{
  const p=payload(row());
  p.tables[0].fields[22]="淨買賣股數";
  const out=validateTpexInstitutionSemanticFixture(p);
  assert.equal(out.state,"INVALID_INPUT");
}

// A legitimate-looking foreign-dealer nonzero official relation can pass semantic identities,
// while the current parser's row[10]+trust+dealer total assumption diverges.
{
  const r=row();
  r[5]="10";r[6]="0";r[7]="10";
  r[8]="110";r[9]="40";r[10]="70";
  // official total remains foreign-main net 60 + trust 15 + dealer 15 = 90
  r[23]="90";
  const out=validateTpexInstitutionSemanticFixture(payload(r));
  assert.equal(out.state,"SEMANTIC_SCHEMA_PASS");
  assert.equal(out.foreignDealerNonzeroRows,1);
  assert.equal(out.mismatchCounts.officialTotal,0);
  assert.equal(out.mismatchCounts.currentParserTotal,1);
}

// Dealer aggregate corruption fails.
{
  const r=row();r[22]="14";
  const out=validateTpexInstitutionSemanticFixture(payload(r));
  assert.equal(out.state,"SEMANTIC_SCHEMA_MISMATCH");
  assert.ok(out.mismatchCounts.dealerAggregateNet>0);
}

console.log(JSON.stringify({
  ok:true,
  genericFieldFingerprintInsufficientAlone:true,
  arithmeticFingerprintDetectsInteriorSwap:true,
  foreignDealerNonzeroCompatibilityRiskFrozen:true,
  formalCoreImpact:false
},null,2));
