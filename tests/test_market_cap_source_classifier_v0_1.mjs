import assert from "node:assert/strict";
import {classifyMarketCapSourceV0_1} from "../research/market_cap_source_classifier_v0_1.mjs";

const official={sharesOutstanding:100_000_000};
let r=classifyMarketCapSourceV0_1({officialStock:official,customStock:{marketCapYi:12.5},close:10});
assert.equal(r.marketCapYi,12.5);
assert.equal(r.sourceType,"CUSTOM_EXPLICIT_MARKET_CAP");
assert.equal(r.sourceQualityState,"SOURCE_ID_OR_PIT_INCOMPLETE");

r=classifyMarketCapSourceV0_1({officialStock:official,customStock:{sharesOutstanding:50_000_000},close:20});
assert.equal(r.marketCapYi,10);
assert.equal(r.sourceType,"CUSTOM_SHARES_X_CLOSE");

r=classifyMarketCapSourceV0_1({
  officialStock:official,customStock:{},close:20,
  officialSourceEvidence:{sourceDate:"2026-09-27",capturedAt:"2026-09-27T18:10:00+08:00",pointInTimeEligible:true}
});
assert.equal(r.marketCapYi,20);
assert.equal(r.sourceType,"OFFICIAL_SHARES_X_CLOSE");
assert.equal(r.sourceQualityState,"SOURCE_ID_AND_PIT_POSITIVE");

r=classifyMarketCapSourceV0_1({officialStock:official,customStock:{sharesOutstanding:null},close:20});
assert.equal(r.marketCapYi,null,"custom null overwrite must not silently recover overwritten official sharesOutstanding");
assert.equal(r.sourceType,"INVALID_SHARES_SOURCE");

r=classifyMarketCapSourceV0_1({
  officialStock:official,
  customStock:{marketCapYi:"N/A",marketCap100m:99,sharesOutstanding:50_000_000},
  close:20
});
assert.equal(r.marketCapYi,10,"invalid first non-null explicit alias falls through to shares, not the lower explicit alias");
assert.equal(r.sourceType,"CUSTOM_SHARES_X_CLOSE");
assert.equal(r.mergeSemantics.explicitSelectedField,"marketCapYi");
assert.equal(r.mergeSemantics.ignoredLowerExplicitAlias.exists,true);
assert.equal(r.mergeSemantics.ignoredLowerExplicitAlias.key,"marketCap100m");

r=classifyMarketCapSourceV0_1({
  officialStock:{sharesOutstanding:100_000_000},
  customStock:{sharesOutstanding:"1,000,000"},
  close:20
});
assert.equal(r.marketCapYi,null,"current toNumber semantics do not strip commas from custom shares");
assert.equal(r.sourceType,"INVALID_SHARES_SOURCE");

console.log(JSON.stringify({
  status:"PASS",
  cases:[
    "custom explicit wins",
    "custom shares override official",
    "official shares path with positive provenance",
    "custom null overwrite stays unavailable",
    "invalid first explicit alias shadows lower alias then falls to shares",
    "comma-formatted custom shares remain invalid under current toNumber"
  ]
},null,2));
