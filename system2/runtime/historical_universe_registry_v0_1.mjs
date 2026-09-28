import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { CORE_HISTORY_START_DATE } from "./historical_store_v0_1.mjs";

export const HISTORICAL_UNIVERSE_REGISTRY_VERSION = "0.1-RESEARCH";
const MARKETS = new Set(["TWSE", "TPEX"]);
const MEMBER_STATES = new Set(["CURRENT", "DELISTED"]);
const START_BASES = new Set([
  "OFFICIAL_LISTING_DATE",
  "HISTORY_FIRST_TRADING_DATE",
  "DATASET_START_CLAMP",
  "UNKNOWN",
]);
const END_BASES = new Set(["OPEN_ENDED_CURRENT", "OFFICIAL_DELISTING_DATE"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoDate(value, field, { optional = false } = {}) {
  if ((value === null || value === undefined || value === "") && optional) return null;
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function ordinarySymbol(value) {
  return /^[1-9][0-9]{3}$/.test(String(value || "").trim());
}

function maxDate(a, b) {
  return a > b ? a : b;
}

function normalizeSourceRow(row, index) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error("sourceRows[" + index + "] must be an object");
  }
  const market = requiredText(row.market, "sourceRows[" + index + "].market");
  if (!MARKETS.has(market)) throw new Error("unsupported market: " + market);
  const symbol = requiredText(row.symbol, "sourceRows[" + index + "].symbol");
  if (!ordinarySymbol(symbol)) throw new Error("historical universe accepts ordinary four-digit equities only");
  const memberState = requiredText(row.memberState, "sourceRows[" + index + "].memberState");
  if (!MEMBER_STATES.has(memberState)) throw new Error("unsupported memberState: " + memberState);
  const listingDate = isoDate(row.listingDate, "sourceRows[" + index + "].listingDate", { optional: true });
  const delistingDate = isoDate(row.delistingDate, "sourceRows[" + index + "].delistingDate", { optional: true });
  if (memberState === "CURRENT" && delistingDate) {
    throw new Error("CURRENT membership cannot have delistingDate");
  }
  if (memberState === "DELISTED" && !delistingDate) {
    throw new Error("DELISTED membership requires delistingDate");
  }
  if (listingDate && delistingDate && listingDate > delistingDate) {
    throw new Error("listingDate cannot be after delistingDate");
  }
  return {
    market,
    symbol,
    companyName: row.companyName ? String(row.companyName).trim() : null,
    memberState,
    listingDate,
    delistingDate,
    industry: row.industry ? String(row.industry).trim() : null,
    sourceId: row.sourceId ? String(row.sourceId).trim() : null,
    sourceName: row.sourceName ? String(row.sourceName).trim() : null,
    sourceUrl: row.sourceUrl ? String(row.sourceUrl).trim() : null,
    sourceRowHash: row.sourceRowHash ? String(row.sourceRowHash).trim() : null,
  };
}

function firstTradingDateFor(firstTradingDateByMarketSymbol, market, symbol) {
  const key = market + "|" + symbol;
  const raw = firstTradingDateByMarketSymbol?.[key]
    ?? firstTradingDateByMarketSymbol?.[symbol]
    ?? null;
  return raw ? isoDate(raw, "firstTradingDateByMarketSymbol." + key, { optional: true }) : null;
}

function deriveStart(row, firstTradingDate, datasetStart) {
  if (row.listingDate) {
    if (row.listingDate < datasetStart) {
      return {
        effectiveFrom: datasetStart,
        startBasis: "DATASET_START_CLAMP",
        startEvidenceDate: row.listingDate,
        replayEligible: true,
        flags: ["LISTING_PREDATES_DATASET_START"],
      };
    }
    return {
      effectiveFrom: row.listingDate,
      startBasis: "OFFICIAL_LISTING_DATE",
      startEvidenceDate: row.listingDate,
      replayEligible: true,
      flags: [],
    };
  }
  if (firstTradingDate) {
    return {
      effectiveFrom: maxDate(firstTradingDate, datasetStart),
      startBasis: "HISTORY_FIRST_TRADING_DATE",
      startEvidenceDate: firstTradingDate,
      replayEligible: true,
      flags: ["LISTING_DATE_UNAVAILABLE_HISTORY_FIRST_BAR_USED"],
    };
  }
  return {
    effectiveFrom: null,
    startBasis: "UNKNOWN",
    startEvidenceDate: null,
    replayEligible: false,
    flags: ["LISTING_START_UNKNOWN"],
  };
}

export async function buildHistoricalUniverseRegistryV0_1({
  registryId,
  sourceRows = [],
  firstTradingDateByMarketSymbol = {},
  datasetStartDate = CORE_HISTORY_START_DATE,
  observedAt,
} = {}) {
  const id = requiredText(registryId, "registryId");
  const datasetStart = isoDate(datasetStartDate, "datasetStartDate");
  const observed = isoTimestamp(observedAt, "observedAt");
  if (!Array.isArray(sourceRows)) throw new Error("sourceRows must be an array");

  const normalized = sourceRows.map(normalizeSourceRow);
  const byMembershipKey = new Map();

  for (const row of normalized) {
    const key = row.market + "|" + row.symbol + "|" + row.memberState + "|" + (row.delistingDate || "OPEN");
    if (byMembershipKey.has(key)) {
      const prior = byMembershipKey.get(key);
      if (JSON.stringify(prior) !== JSON.stringify(row)) {
        throw new Error("conflicting duplicate universe source row: " + key);
      }
      continue;
    }
    byMembershipKey.set(key, row);
  }

  const memberships = [];
  for (const row of byMembershipKey.values()) {
    const firstTradingDate = firstTradingDateFor(
      firstTradingDateByMarketSymbol,
      row.market,
      row.symbol,
    );
    const start = deriveStart(row, firstTradingDate, datasetStart);
    const effectiveTo = row.memberState === "DELISTED" ? row.delistingDate : null;
    const endBasis = row.memberState === "DELISTED"
      ? "OFFICIAL_DELISTING_DATE"
      : "OPEN_ENDED_CURRENT";

    if (start.effectiveFrom && effectiveTo && start.effectiveFrom > effectiveTo) {
      throw new Error("effectiveFrom cannot be after effectiveTo for " + row.market + "|" + row.symbol);
    }

    const qualityFlags = [...start.flags];
    if (!row.sourceId) qualityFlags.push("SOURCE_ID_MISSING");
    if (!row.sourceRowHash) qualityFlags.push("SOURCE_ROW_HASH_MISSING");

    const base = {
      registryId: id,
      market: row.market,
      symbol: row.symbol,
      companyName: row.companyName,
      industry: row.industry,
      memberState: row.memberState,
      datasetStartDate: datasetStart,
      listingDate: row.listingDate,
      delistingDate: row.delistingDate,
      firstTradingDate,
      effectiveFrom: start.effectiveFrom,
      effectiveTo,
      startBasis: start.startBasis,
      endBasis,
      startEvidenceDate: start.startEvidenceDate,
      replayEligible: start.replayEligible,
      sourceId: row.sourceId,
      sourceName: row.sourceName,
      sourceUrl: row.sourceUrl,
      sourceRowHash: row.sourceRowHash,
      observedAt: observed,
      qualityFlags: Object.freeze([...new Set(qualityFlags)]),
      schemaVersion: "S2_HISTORICAL_UNIVERSE_MEMBERSHIP_V0_1",
    };
    const membershipHash = await sha256Hex(base);
    memberships.push(deepFreeze({
      ...base,
      membershipId: "S2U-" + membershipHash,
      membershipHash,
    }));
  }

  memberships.sort((a, b) =>
    a.market.localeCompare(b.market)
      || a.symbol.localeCompare(b.symbol)
      || String(a.effectiveFrom || "").localeCompare(String(b.effectiveFrom || ""))
      || String(a.effectiveTo || "").localeCompare(String(b.effectiveTo || "")),
  );

  const symbolMarketKeys = new Set(memberships.map((x) => x.market + "|" + x.symbol));
  const replayEligibleCount = memberships.filter((x) => x.replayEligible).length;
  const unknownStartCount = memberships.length - replayEligibleCount;

  const base = {
    registryId: id,
    registryVersion: HISTORICAL_UNIVERSE_REGISTRY_VERSION,
    datasetStartDate: datasetStart,
    observedAt: observed,
    membershipCount: memberships.length,
    symbolMarketCount: symbolMarketKeys.size,
    replayEligibleCount,
    unknownStartCount,
    currentCount: memberships.filter((x) => x.memberState === "CURRENT").length,
    delistedCount: memberships.filter((x) => x.memberState === "DELISTED").length,
    memberships: Object.freeze(memberships),
    survivorshipPolicy: "CURRENT_PLUS_DELISTED_MARKET_INTERVALS",
    futureDelistingInfoExposedToStrategy: false,
    schemaVersion: "S2_HISTORICAL_UNIVERSE_REGISTRY_V0_1",
  };
  const registryHash = await sha256Hex(base);
  return deepFreeze({ ...base, registryHash });
}

export async function buildHistoricalUniverseSnapshotV0_1({
  snapshotId,
  registry,
  marketDate,
  capturedAt,
} = {}) {
  const id = requiredText(snapshotId, "snapshotId");
  if (!registry || registry.schemaVersion !== "S2_HISTORICAL_UNIVERSE_REGISTRY_V0_1") {
    throw new Error("valid historical universe registry is required");
  }
  const date = isoDate(marketDate, "marketDate");
  const captured = isoTimestamp(capturedAt, "capturedAt");

  const members = registry.memberships
    .filter((x) =>
      x.replayEligible === true
      && x.effectiveFrom !== null
      && x.effectiveFrom <= date
      && (x.effectiveTo === null || x.effectiveTo >= date),
    )
    .map((x) => deepFreeze({
      symbol: x.symbol,
      companyName: x.companyName,
      market: x.market,
      industry: x.industry,
      membershipId: x.membershipId,
      membershipHash: x.membershipHash,
      membershipStateAtReplay: "ACTIVE",
    }))
    .sort((a, b) => a.market.localeCompare(b.market) || a.symbol.localeCompare(b.symbol));

  const seen = new Set();
  for (const row of members) {
    const key = row.market + "|" + row.symbol;
    if (seen.has(key)) throw new Error("overlapping active membership for " + key + " on " + date);
    seen.add(key);
  }

  const base = {
    snapshotId: id,
    registryId: registry.registryId,
    registryHash: registry.registryHash,
    marketDate: date,
    capturedAt: captured,
    memberCount: members.length,
    members: Object.freeze(members),
    strategyVisibleFields: Object.freeze([
      "symbol",
      "companyName",
      "market",
      "industry",
      "membershipStateAtReplay",
    ]),
    futureMembershipEndExposed: false,
    historicalReplayOnly: true,
    schemaVersion: "S2_HISTORICAL_UNIVERSE_SNAPSHOT_V0_1",
  };
  const snapshotHash = await sha256Hex(base);
  return deepFreeze({ ...base, snapshotHash });
}

export function toHistoricalUniverseMembershipRows(registry) {
  if (!registry || !Array.isArray(registry.memberships)) throw new Error("registry.memberships is required");
  return Object.freeze(registry.memberships.map((x) => Object.freeze({
    membership_id: x.membershipId,
    registry_id: registry.registryId,
    market: x.market,
    symbol: x.symbol,
    company_name: x.companyName,
    industry: x.industry,
    member_state: x.memberState,
    dataset_start_date: x.datasetStartDate,
    listing_date: x.listingDate,
    delisting_date: x.delistingDate,
    first_trading_date: x.firstTradingDate,
    effective_from: x.effectiveFrom,
    effective_to: x.effectiveTo,
    start_basis: x.startBasis,
    end_basis: x.endBasis,
    replay_eligible: x.replayEligible ? 1 : 0,
    source_id: x.sourceId,
    source_name: x.sourceName,
    source_url: x.sourceUrl,
    source_row_hash: x.sourceRowHash,
    quality_flags_json: JSON.stringify(x.qualityFlags),
    observed_at: x.observedAt,
    membership_hash: x.membershipHash,
    schema_version: x.schemaVersion,
  })));
}

export function toHistoricalUniverseSnapshotRows(snapshot) {
  if (!snapshot || !Array.isArray(snapshot.members)) throw new Error("snapshot.members is required");
  return Object.freeze(snapshot.members.map((x) => Object.freeze({
    snapshot_id: snapshot.snapshotId,
    snapshot_hash: snapshot.snapshotHash,
    registry_id: snapshot.registryId,
    registry_hash: snapshot.registryHash,
    market_date: snapshot.marketDate,
    market: x.market,
    symbol: x.symbol,
    company_name: x.companyName,
    industry: x.industry,
    membership_id: x.membershipId,
    membership_hash: x.membershipHash,
    captured_at: snapshot.capturedAt,
    schema_version: snapshot.schemaVersion,
  })));
}

export { MARKETS, MEMBER_STATES, START_BASES, END_BASES };
