import {
  resolveSystem2CaptureArm,
  resolveSystem2ResonanceArm,
  buildSystem2HealthPayload,
} from "./worker_core.mjs";
import { buildResonancePageHtml } from "./resonance_page.mjs";
import {
  taipeiMarketDateV0_1,
  classifyResonanceScheduleTimeV0_1,
  buildResonanceWatchPoolFromCapacityRowV0_1,
} from "../runtime/daily_resonance_integration_v0_1.mjs";
import {
  loadLatestCapacityRunForResonanceV0_1,
  persistResonanceWatchPoolV0_1,
  loadActiveResonanceWatchPoolV0_1,
  readLatestResonanceApiV0_1,
} from "../runtime/daily_resonance_persistence_v0_1.mjs";
import { runBoundedDailyResonanceWorkerCycleV0_1 } from "../runtime/daily_resonance_worker_cycle_v0_1.mjs";

async function readSchemaVersion(db) {
  if (!db || typeof db.prepare !== "function") return "BINDING_MISSING";
  const row = await db.prepare(
    "SELECT schema_value FROM s2_schema_meta WHERE schema_key = 'schema_version' LIMIT 1",
  ).first();
  return row?.schema_value || "UNKNOWN";
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
    },
  });
}

async function readPoolPayload(db, marketDate) {
  const pool = await loadActiveResonanceWatchPoolV0_1(db, marketDate);
  if (!pool) {
    return {
      schemaVersion: "SYSTEM2_RESONANCE_WATCH_POOL_API_V0_1",
      marketDate,
      state: "NO_ACTIVE_PRESELECTED_POOL",
      symbolCount: 0,
      symbols: [],
      maxUniqueSymbols: 9,
      fullMarketScan: false,
    };
  }
  return {
    schemaVersion: "SYSTEM2_RESONANCE_WATCH_POOL_API_V0_1",
    marketDate,
    state: pool.state,
    poolId: pool.poolId,
    sourceMarketDate: pool.sourceMarketDate,
    symbolCount: pool.symbolCount,
    symbols: pool.symbols,
    maxUniqueSymbols: 9,
    fullMarketScan: false,
  };
}

async function handleScheduledResonance(controller, env) {
  const arm = resolveSystem2ResonanceArm(env);
  if (!arm.enabled) return { handled: false, state: arm.state };
  const scheduledDate = new Date(controller?.scheduledTime || Date.now());
  const asOf = scheduledDate.toISOString();
  const marketDate = taipeiMarketDateV0_1(scheduledDate);
  const window = classifyResonanceScheduleTimeV0_1(scheduledDate);

  if (window.afterMarketPoolRefresh && !window.intradayMonitor) {
    const capacityRow = await loadLatestCapacityRunForResonanceV0_1(env.SYSTEM2_DB);
    if (!capacityRow) {
      console.log(JSON.stringify({ service: "system2-shadow-research", event: "resonance-pool-refresh", state: "NO_CAPACITY_RECEIPT", marketDate }));
      return { handled: true, state: "NO_CAPACITY_RECEIPT" };
    }
    const pool = await buildResonanceWatchPoolFromCapacityRowV0_1({ capacityRow, activatedAt: asOf });
    await persistResonanceWatchPoolV0_1(env.SYSTEM2_DB, pool);
    console.log(JSON.stringify({ service: "system2-shadow-research", event: "resonance-pool-refresh", state: pool.state, poolId: pool.poolId, symbolCount: pool.symbolCount, maxUniqueSymbols: 9, fullMarketScan: false }));
    return { handled: true, state: pool.state };
  }

  if (!window.intradayMonitor) return { handled: true, state: "OUTSIDE_RESONANCE_WINDOW" };
  const pool = await loadActiveResonanceWatchPoolV0_1(env.SYSTEM2_DB, marketDate);
  if (!pool) {
    console.log(JSON.stringify({ service: "system2-shadow-research", event: "resonance-monitor", state: "NO_ACTIVE_PRESELECTED_POOL", marketDate, fullMarketScan: false }));
    return { handled: true, state: "NO_ACTIVE_PRESELECTED_POOL" };
  }
  if (!env.FUGLE_API_KEY) throw new Error("SYSTEM2_RESONANCE_FUGLE_SECRET_MISSING");
  const receipt = await runBoundedDailyResonanceWorkerCycleV0_1({
    db: env.SYSTEM2_DB,
    pool,
    marketDate,
    asOf,
    officialSessionCloseConfirmed: window.officialCloseConfirmedByClock,
    fugleApiKey: env.FUGLE_API_KEY,
  });
  console.log(JSON.stringify({ service: "system2-shadow-research", event: "resonance-monitor", runId: receipt.runId, state: receipt.runState, symbolCount: receipt.symbolCount, succeededCount: receipt.succeededCount, blockedCount: receipt.blockedCount, failureCount: receipt.failureCount, fullMarketScan: false }));
  return { handled: true, state: receipt.runState };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== "GET") return new Response("Not found", { status: 404 });

    if (url.pathname === "/health") {
      const schemaVersion = await readSchemaVersion(env.SYSTEM2_DB);
      return json(buildSystem2HealthPayload({ schemaVersion, env }));
    }
    if (url.pathname === "/" || url.pathname === "/resonance") {
      return new Response(buildResonancePageHtml(), {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
          "referrer-policy": "no-referrer",
        },
      });
    }
    if (url.pathname === "/api/system2/resonance") {
      return json(await readLatestResonanceApiV0_1(env.SYSTEM2_DB, {
        marketDate: url.searchParams.get("marketDate"),
        symbol: url.searchParams.get("symbol"),
      }));
    }
    if (url.pathname === "/api/system2/resonance/pool") {
      const marketDate = url.searchParams.get("marketDate") || taipeiMarketDateV0_1(new Date());
      return json(await readPoolPayload(env.SYSTEM2_DB, marketDate));
    }
    const symbolMatch = url.pathname.match(/^\/api\/system2\/resonance\/([0-9A-Za-z._-]+)$/);
    if (symbolMatch) {
      const payload = await readLatestResonanceApiV0_1(env.SYSTEM2_DB, {
        marketDate: url.searchParams.get("marketDate"),
        symbol: symbolMatch[1],
      });
      return json(payload, payload.symbolCount ? 200 : 404);
    }
    return new Response("Not found", { status: 404 });
  },

  async scheduled(controller, env, ctx) {
    const resonancePromise = handleScheduledResonance(controller, env);
    if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(resonancePromise);
    else await resonancePromise;

    const capture = resolveSystem2CaptureArm(env);
    if (capture.enabled) throw new Error("CAPTURE_SOURCE_ADAPTERS_NOT_CONFIGURED");
  },
};
