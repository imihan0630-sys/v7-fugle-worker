import fs from "node:fs/promises";
import {
  fetchOfficialFullMarketDailyPayloadV0_1,
  normalizeOfficialFullMarketDailyPayloadV0_1,
} from "../runtime/official_full_market_daily_history_adapter_v0_1.mjs";

const dates = (process.env.S2_HISTORY_SMOKE_DATES || "2017-01-03,2026-09-24")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);

const MIN_COUNTS = {
  TWSE: Number(process.env.S2_HISTORY_SMOKE_MIN_TWSE || 400),
  TPEX: Number(process.env.S2_HISTORY_SMOKE_MIN_TPEX || 300),
};

async function fetchWithRetry(args, attempts = 3) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchOfficialFullMarketDailyPayloadV0_1(args);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }
  throw lastError;
}

const observedAt = new Date().toISOString();
const receipts = [];

for (const marketDate of dates) {
  for (const market of ["TWSE", "TPEX"]) {
    const payload = await fetchWithRetry({ market, marketDate });
    const normalized = await normalizeOfficialFullMarketDailyPayloadV0_1({
      market,
      marketDate,
      payload,
      observedAt,
    });

    if (normalized.ordinarySymbolCount < MIN_COUNTS[market]) {
      throw new Error(
        market + " " + marketDate + " ordinary symbol count "
        + normalized.ordinarySymbolCount + " below smoke minimum " + MIN_COUNTS[market],
      );
    }

    receipts.push({
      market,
      marketDate,
      sourceId: normalized.sourceId,
      sourceUrl: normalized.sourceUrl,
      ordinarySymbolCount: normalized.ordinarySymbolCount,
      availableAt: normalized.availableAt,
      payloadHash: normalized.payloadHash,
      sampleSymbols: normalized.rows.slice(0, 10).map((x) => x.symbol),
      has2330: normalized.rows.some((x) => x.symbol === "2330"),
      has2456: normalized.rows.some((x) => x.symbol === "2456"),
      has6488: normalized.rows.some((x) => x.symbol === "6488"),
    });
  }
}

const oldTwse = receipts.find((x) => x.market === "TWSE" && x.marketDate === "2017-01-03");
const recentTwse = receipts.find((x) => x.market === "TWSE" && x.marketDate === "2026-09-24");
if (!oldTwse?.has2456) {
  throw new Error("anti-survivorship witness 2456 is missing from TWSE 2017-01-03 payload");
}
if (recentTwse?.has2456) {
  throw new Error("anti-survivorship witness 2456 unexpectedly remains in TWSE 2026-09-24 payload");
}

const result = {
  ok: true,
  observedAt,
  dates,
  receipts,
  assertions: {
    historicalDelistedWitness: {
      symbol: "2456",
      oldDatePresent: oldTwse?.has2456 === true,
      recentDateAbsent: recentTwse?.has2456 === false,
    },
    noSystem2D1Write: true,
    noSystem1Mutation: true,
  },
  schemaVersion: "S2_HISTORICAL_SOURCE_SMOKE_RECEIPT_V0_1",
};

await fs.mkdir("artifacts", { recursive: true });
await fs.writeFile(
  "artifacts/system2-historical-source-smoke-v0_1.json",
  JSON.stringify(result, null, 2) + "\n",
  "utf8",
);

console.log(JSON.stringify(result, null, 2));
