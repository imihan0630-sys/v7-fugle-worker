import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import {
  buildHistoricalStoreIngestBatch,
  toHistoricalPersistenceRecords,
  CORE_HISTORY_START_DATE,
} from "./historical_store_v0_1.mjs";

export const HISTORICAL_BACKFILL_COORDINATOR_VERSION = "0.1-RESEARCH";
const MARKETS = Object.freeze(["TWSE", "TPEX"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function shiftDate(date, days) {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function minDate(a, b) {
  return a < b ? a : b;
}

function chunks(startDate, endDate, chunkCalendarDays) {
  const out = [];
  let start = startDate;
  while (start <= endDate) {
    const end = minDate(endDate, shiftDate(start, chunkCalendarDays - 1));
    out.push({ fromDate: start, toDate: end });
    start = shiftDate(end, 1);
  }
  return out;
}

export async function buildHistoricalBackfillPlanV0_1({
  planId,
  endDate,
  lastStoredDateByMarket = {},
  startDate = CORE_HISTORY_START_DATE,
  markets = MARKETS,
  chunkCalendarDays = 31,
  datasetLane = "CORE_2017_PLUS",
  createdAt,
} = {}) {
  const id = requiredText(planId, "planId");
  const requestedStart = isoDate(startDate, "startDate");
  const requestedEnd = isoDate(endDate, "endDate");
  if (requestedEnd < requestedStart) throw new Error("endDate cannot be earlier than startDate");
  if (!Number.isInteger(chunkCalendarDays) || chunkCalendarDays < 1 || chunkCalendarDays > 366) {
    throw new Error("chunkCalendarDays must be an integer between 1 and 366");
  }
  if (!Array.isArray(markets) || !markets.length) throw new Error("markets must be a non-empty array");

  const normalizedMarkets = [...new Set(markets.map((x) => requiredText(String(x), "market")))];
  for (const market of normalizedMarkets) {
    if (!MARKETS.includes(market)) throw new Error("unsupported market: " + market);
  }

  const workUnits = [];
  const effectiveStartByMarket = {};
  for (const market of normalizedMarkets) {
    const lastStored = lastStoredDateByMarket[market]
      ? isoDate(lastStoredDateByMarket[market], "lastStoredDateByMarket." + market)
      : null;
    const effectiveStart = lastStored && lastStored >= requestedStart
      ? shiftDate(lastStored, 1)
      : requestedStart;
    effectiveStartByMarket[market] = effectiveStart;
    if (effectiveStart > requestedEnd) continue;
    for (const range of chunks(effectiveStart, requestedEnd, chunkCalendarDays)) {
      workUnits.push({
        workUnitId: [market, range.fromDate, range.toDate].join("|"),
        market,
        ...range,
      });
    }
  }

  const base = {
    planId: id,
    datasetLane: requiredText(datasetLane, "datasetLane"),
    requestedStartDate: requestedStart,
    requestedEndDate: requestedEnd,
    lastStoredDateByMarket: deepFreeze({ ...lastStoredDateByMarket }),
    effectiveStartByMarket: deepFreeze(effectiveStartByMarket),
    markets: Object.freeze(normalizedMarkets),
    chunkCalendarDays,
    workUnits: Object.freeze(workUnits),
    workUnitCount: workUnits.length,
    executionMode: "INCREMENTAL_MARKET_RANGE_CHUNKS",
    noFullReloadWhenCaughtUp: true,
    createdAt: isoTimestamp(createdAt, "createdAt"),
    schemaVersion: "S2_HISTORICAL_BACKFILL_PLAN_V0_1",
  };
  const planHash = await sha256Hex(base);
  return deepFreeze({ ...base, planHash });
}

async function buildCheckpoint(plan, completedWorkUnitIds, rowsPersisted, rollingDigest, capturedAt) {
  const base = {
    planId: plan.planId,
    planHash: plan.planHash,
    completedWorkUnitIds: Object.freeze([...completedWorkUnitIds].sort()),
    completedWorkUnitCount: completedWorkUnitIds.size,
    rowsPersisted,
    rollingDigest,
    capturedAt,
    schemaVersion: "S2_HISTORICAL_BACKFILL_CHECKPOINT_V0_1",
  };
  const checkpointHash = await sha256Hex(base);
  return deepFreeze({ ...base, checkpointHash });
}

export async function runHistoricalBackfillV0_1({
  plan,
  fetchRows,
  persistRecords,
  resumeCheckpoint = null,
  sourceContractByMarket,
  capturedAt,
  onCheckpoint = null,
} = {}) {
  if (!plan || plan.schemaVersion !== "S2_HISTORICAL_BACKFILL_PLAN_V0_1") {
    throw new Error("valid historical backfill plan is required");
  }
  if (typeof fetchRows !== "function") throw new Error("fetchRows callback is required");
  if (typeof persistRecords !== "function") throw new Error("persistRecords callback is required");
  if (!sourceContractByMarket || typeof sourceContractByMarket !== "object") {
    throw new Error("sourceContractByMarket is required");
  }
  if (onCheckpoint !== null && typeof onCheckpoint !== "function") {
    throw new Error("onCheckpoint must be a function");
  }

  const captured = isoTimestamp(capturedAt, "capturedAt");
  if (resumeCheckpoint && resumeCheckpoint.planHash !== plan.planHash) {
    throw new Error("resume checkpoint planHash mismatch");
  }
  const completed = new Set((resumeCheckpoint?.completedWorkUnitIds || []).map(String));
  let rowsPersisted = Number(resumeCheckpoint?.rowsPersisted || 0);
  let rollingDigest = resumeCheckpoint?.rollingDigest || await sha256Hex({
    planId: plan.planId,
    planHash: plan.planHash,
    seed: "S2_HISTORICAL_BACKFILL_V0_1",
  });
  let latestCheckpoint = resumeCheckpoint || null;
  const receipts = [];

  for (const unit of plan.workUnits) {
    if (completed.has(unit.workUnitId)) continue;
    const contract = sourceContractByMarket[unit.market];
    if (!contract) throw new Error("missing source contract for " + unit.market);
    const rows = await fetchRows({ ...unit, plan, sourceContract: contract });
    if (!Array.isArray(rows)) throw new Error("fetchRows must return an array");

    if (rows.length) {
      for (const row of rows) {
        if (row.market && row.market !== unit.market) {
          throw new Error("fetchRows returned row for wrong market");
        }
      }
      const batch = await buildHistoricalStoreIngestBatch({
        batchId: plan.planId + "|" + unit.workUnitId,
        datasetLane: plan.datasetLane,
        sourceId: requiredText(contract.sourceId, "sourceContract.sourceId"),
        sourceName: requiredText(contract.sourceName, "sourceContract.sourceName"),
        sourceUrl: contract.sourceUrl || null,
        capturedAt: captured,
        rows: rows.map((row) => ({ ...row, market: unit.market })),
      });
      const records = toHistoricalPersistenceRecords(batch);
      await persistRecords({ unit, batch, records, plan });
      rowsPersisted += batch.rowCount;
      rollingDigest = await sha256Hex({
        prior: rollingDigest,
        workUnitId: unit.workUnitId,
        batchHash: batch.batchHash,
        rowCount: batch.rowCount,
      });
      receipts.push(deepFreeze({
        workUnitId: unit.workUnitId,
        state: "PERSISTED",
        rowCount: batch.rowCount,
        batchHash: batch.batchHash,
      }));
    } else {
      rollingDigest = await sha256Hex({
        prior: rollingDigest,
        workUnitId: unit.workUnitId,
        state: "NO_ROWS",
      });
      receipts.push(deepFreeze({
        workUnitId: unit.workUnitId,
        state: "NO_ROWS",
        rowCount: 0,
        batchHash: null,
      }));
    }

    completed.add(unit.workUnitId);
    latestCheckpoint = await buildCheckpoint(
      plan,
      completed,
      rowsPersisted,
      rollingDigest,
      captured,
    );
    if (onCheckpoint) await onCheckpoint(latestCheckpoint);
  }

  const base = {
    planId: plan.planId,
    planHash: plan.planHash,
    requestedWorkUnitCount: plan.workUnitCount,
    completedWorkUnitCount: completed.size,
    rowsPersisted,
    allWorkUnitsComplete: completed.size === plan.workUnitCount,
    incremental: true,
    fullReloadPerformed: false,
    receipts: Object.freeze(receipts),
    latestCheckpoint,
    rollingDigest,
    capturedAt: captured,
    schemaVersion: "S2_HISTORICAL_BACKFILL_RUN_V0_1",
  };
  const runHash = await sha256Hex(base);
  return deepFreeze({ ...base, runHash });
}

export { MARKETS };
