import assert from "node:assert/strict";
import { fetchOfficialHistoricalA1DateV0_1 } from "../runtime/official_historical_a1_source_v0_1.mjs";

const cases = [
  { market: "TWSE", marketDate: "2017-01-03", minimumOrdinarySymbols: 500 },
  { market: "TPEX", marketDate: "2017-01-03", minimumOrdinarySymbols: 500 },
  { market: "TWSE", marketDate: "2026-09-24", minimumOrdinarySymbols: 600 },
  { market: "TPEX", marketDate: "2026-09-24", minimumOrdinarySymbols: 600 },
];

const observedAt = new Date().toISOString();
const summaries = [];

for (const testCase of cases) {
  const receipt = await fetchOfficialHistoricalA1DateV0_1({
    market: testCase.market,
    marketDate: testCase.marketDate,
    observedAt,
  });

  assert.equal(receipt.state, "READY");
  assert.equal(receipt.sourceDateEvidence, testCase.marketDate);
  assert.ok(
    receipt.ordinarySymbolCount >= testCase.minimumOrdinarySymbols,
    `${testCase.market} ${testCase.marketDate} ordinary-symbol coverage too low: ${receipt.ordinarySymbolCount}`,
  );
  assert.equal(
    receipt.rows.every((row) => row.marketDate === testCase.marketDate),
    true,
  );
  assert.equal(
    receipt.rows.every((row) => row.market === testCase.market),
    true,
  );
  assert.equal(
    receipt.rows.every((row) => /^[1-9][0-9]{3}$/.test(row.symbol)),
    true,
  );

  summaries.push({
    market: testCase.market,
    marketDate: testCase.marketDate,
    ordinarySymbolCount: receipt.ordinarySymbolCount,
    sourceDateEvidenceBasis: receipt.sourceDateEvidenceBasis,
    firstSymbols: receipt.rows.slice(0, 5).map((row) => row.symbol),
    availabilitySemantics: receipt.availabilitySemantics,
    continuityState: receipt.continuityState,
  });
}

console.log(JSON.stringify({
  ok: true,
  smokeVersion: "S2_OFFICIAL_HISTORICAL_A1_SMOKE_V0_1",
  observedAt,
  summaries,
}, null, 2));
