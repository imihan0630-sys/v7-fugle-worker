import { gzipSync, gunzipSync } from "node:zlib";
import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex, canonicalStringify } from "./decision_archive.mjs";

export const HISTORICAL_PACK_RESEARCH_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function barTuple(row) {
  return [
    row.marketDate,
    row.open ?? null,
    row.high ?? null,
    row.low ?? null,
    row.close ?? null,
    row.volumeShares ?? null,
    row.tradeValue ?? null,
    row.transactions ?? null,
    row.change ?? null,
    row.continuityState || "UNVERIFIED",
    row.sourceRowHash || null,
  ];
}

function nameTimeline(rows) {
  const out = [];
  let last = Symbol("NONE");
  for (const row of rows) {
    const name = row.companyName || null;
    if (name !== last) {
      out.push([row.marketDate, name]);
      last = name;
    }
  }
  return out;
}

function groupKey(row) {
  const year = requiredText(row.marketDate, "row.marketDate").slice(0, 4);
  return [
    requiredText(row.market, "row.market"),
    requiredText(row.symbol, "row.symbol"),
    year,
    requiredText(row.priceSpace, "row.priceSpace"),
  ].join("|");
}

export async function buildHistoricalA1PacksResearchV0_1({
  rows = [],
  capturedAt,
} = {}) {
  if (!Array.isArray(rows)) throw new Error("rows must be an array");
  const captured = requiredText(capturedAt, "capturedAt");
  const groups = new Map();

  for (const row of rows) {
    if (!row || typeof row !== "object") throw new Error("historical row must be an object");
    const key = groupKey(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  const packs = [];
  for (const [key, group] of groups.entries()) {
    group.sort((a, b) => a.marketDate.localeCompare(b.marketDate));
    const [market, symbol, year, priceSpace] = key.split("|");
    const canonicalPayload = {
      market,
      symbol,
      year: Number(year),
      priceSpace,
      sourceId: group[0]?.sourceId || null,
      sourceName: group[0]?.sourceName || null,
      availabilityPolicy: "SESSION_CLOSE_FINALITY_PER_MARKET_DATE",
      nameTimeline: nameTimeline(group),
      bars: group.map(barTuple),
    };
    const payloadText = canonicalStringify(canonicalPayload);
    const payloadHash = await sha256Hex(canonicalPayload);
    const gz = gzipSync(Buffer.from(payloadText, "utf8"), { level: 9 });
    const gzipBase64 = gz.toString("base64");
    const packId = "S2HP-A1-" + payloadHash;

    packs.push(deepFreeze({
      packId,
      market,
      symbol,
      year: Number(year),
      priceSpace,
      firstMarketDate: group[0].marketDate,
      lastMarketDate: group.at(-1).marketDate,
      barCount: group.length,
      payloadHash,
      payloadJsonBytes: Buffer.byteLength(payloadText, "utf8"),
      gzipBytes: gz.byteLength,
      base64Bytes: Buffer.byteLength(gzipBase64, "utf8"),
      gzipBase64,
      capturedAt: captured,
      schemaVersion: "S2_HISTORICAL_A1_PACK_RESEARCH_V0_1",
    }));
  }

  packs.sort((a, b) =>
    a.year - b.year || a.market.localeCompare(b.market) || a.symbol.localeCompare(b.symbol));

  return deepFreeze({
    packCount: packs.length,
    barCount: packs.reduce((sum, x) => sum + x.barCount, 0),
    payloadJsonBytes: packs.reduce((sum, x) => sum + x.payloadJsonBytes, 0),
    gzipBytes: packs.reduce((sum, x) => sum + x.gzipBytes, 0),
    base64Bytes: packs.reduce((sum, x) => sum + x.base64Bytes, 0),
    packs: Object.freeze(packs),
    capturedAt: captured,
    schemaVersion: "S2_HISTORICAL_A1_PACK_SET_RESEARCH_V0_1",
  });
}

export async function unpackHistoricalA1PackResearchV0_1(pack) {
  if (!pack || pack.schemaVersion !== "S2_HISTORICAL_A1_PACK_RESEARCH_V0_1") {
    throw new Error("valid historical pack is required");
  }
  const text = gunzipSync(Buffer.from(requiredText(pack.gzipBase64, "gzipBase64"), "base64"))
    .toString("utf8");
  const payload = JSON.parse(text);
  const hash = await sha256Hex(payload);
  if (hash !== pack.payloadHash) throw new Error("historical pack payload hash mismatch");
  if (!Array.isArray(payload.bars) || payload.bars.length !== pack.barCount) {
    throw new Error("historical pack bar count mismatch");
  }
  return deepFreeze(payload);
}
