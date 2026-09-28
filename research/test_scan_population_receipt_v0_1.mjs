import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import {
  buildScanPopulationEntries,
  buildScanPopulationReceipt,
} from "./scan_population_receipt_v0_1.mjs";

const rows=[
  {symbol:"1101",market:"TWSE"},
  {symbol:"2330",market:"TWSE"},
  {symbol:"3105",market:"TPEx"},
  {symbol:"9999",market:"TPEx"},
];

const admissions={
  "1101":{usable:true,status:"VALID_EXACT_SESSIONS",reason:null,verifiedNoTradeDates:[]},
  "2330":{usable:true,status:"VALID_WITH_VERIFIED_NO_TRADE_GAPS",reason:null,verifiedNoTradeDates:["2026-09-15"]},
  "3105":{usable:false,status:"DATA_INCOMPLETE",reason:"MISSING_OFFICIAL_TRADED_BAR"},
  // 9999 intentionally missing -> UNKNOWN
};

const built=buildScanPopulationEntries({
  normalizedRows:rows,
  historyAdmissionBySymbol:admissions,
  featureReadySymbols:new Set(["1101","2330"]),
});
assert.equal(built.consistencyValid,true);
assert.deepEqual(built.entries.map(x=>[x.symbol,x.historyAdmissionState,x.featureBuildState,x.parentExpected]),[
  ["1101","ADMITTED","READY",true],
  ["2330","ADMITTED","READY",true],
  ["3105","BLOCKED","NOT_ATTEMPTED",false],
  ["9999","UNKNOWN","NOT_ATTEMPTED",false],
]);

const base={
  scanDate:"2026-09-29",
  captureGeneration:"G1_test",
  populationSchemaVersion:"SCAN_POPULATION_V1",
  normalizationVersion:"NORMALIZE_MARKET_ROWS_V1",
  sourceConfigFingerprint:"SRC_FP",
  historyAdmissionBySymbol:admissions,
  featureReadySymbols:new Set(["1101","2330"]),
};

const a=await buildScanPopulationReceipt({...base,normalizedRows:rows},webcrypto);
const b=await buildScanPopulationReceipt({...base,normalizedRows:[rows[3],rows[1],rows[0],rows[2]]},webcrypto);

assert.equal(a.valid,true);
assert.equal(a.scanPopulationReceiptId,b.scanPopulationReceiptId);
assert.equal(a.normalizedMarketKeysetHash,b.normalizedMarketKeysetHash);
assert.equal(a.historyAdmittedKeysetHash,b.historyAdmittedKeysetHash);
assert.equal(a.featureReadyKeysetHash,b.featureReadyKeysetHash);
assert.equal(a.normalizedCount,4);
assert.equal(a.historyAdmittedCount,2);
assert.equal(a.historyBlockedCount,1);
assert.equal(a.historyUnknownCount,1);
assert.equal(a.featureReadyParentExpectedCount,2);
assert.equal(a.historyReasonCounts.MISSING_OFFICIAL_TRADED_BAR,1);
assert.equal(a.historyReasonCounts.HISTORY_ADMISSION_MISSING,1);

// Same count, substituted symbol changes normalized keyset hash.
const substituted=await buildScanPopulationReceipt({
  ...base,
  normalizedRows:[rows[0],rows[1],rows[2],{symbol:"8888",market:"TWSE"}],
},webcrypto);
assert.notEqual(substituted.normalizedMarketKeysetHash,a.normalizedMarketKeysetHash);

// Feature-ready symbol cannot bypass failed history admission.
const invalid=await buildScanPopulationReceipt({
  ...base,
  normalizedRows:rows,
  featureReadySymbols:new Set(["1101","3105"]),
},webcrypto);
assert.equal(invalid.valid,false);
assert.equal(invalid.status,"POPULATION_CONSISTENCY_FAIL");
assert.ok(invalid.reasons.includes("FEATURE_READY_WITHOUT_HISTORY_ADMISSION:3105"));

// Duplicate normalized symbol is fatal.
assert.throws(
  ()=>buildScanPopulationEntries({
    normalizedRows:[rows[0],rows[0]],
    historyAdmissionBySymbol:admissions,
    featureReadySymbols:new Set(),
  }),
  /DUPLICATE_NORMALIZED_SYMBOL/
);

console.log(JSON.stringify({
  ok:true,
  normalized:a.normalizedCount,
  admitted:a.historyAdmittedCount,
  blocked:a.historyBlockedCount,
  unknown:a.historyUnknownCount,
  expectedParents:a.featureReadyParentExpectedCount,
}));
