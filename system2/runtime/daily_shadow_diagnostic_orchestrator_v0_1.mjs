import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex, canonicalStringify } from "./decision_archive.mjs";
import { fetchDailyShadowA1SnapshotV0_1 } from "./daily_shadow_a1_source_v0_1.mjs";
import { probeTwseTradingDate } from "./twse_trading_calendar_readonly.mjs";
import { probePitHistoryCoverageV0_1, loadPitPriorA1BarsV0_1 } from "./daily_shadow_history_reader_v0_1.mjs";
import { buildDailyShadowInputPreflightV0_1 } from "./daily_shadow_input_preflight_v0_1.mjs";
import { buildA1HistoryPrimitiveBundle } from "./a1_history_primitives_v0_1.mjs";
import { buildShadowSourceSessionReceipt } from "./shadow_source_session_receipt.mjs";
import { toSourceSessionRow } from "./storage_rows.mjs";
import { buildSystem2PersistenceBatch } from "./persistence_batch.mjs";
import { executeSystem2PersistenceBatch } from "./persistence_executor.mjs";
import { persistDailyProspectiveHistoryV0_1 } from "./daily_shadow_prospective_history_v0_1.mjs";

export const DAILY_SHADOW_DIAGNOSTIC_VERSION = "S2_DAILY_SHADOW_DIAGNOSTIC_V0_1";
export const DAILY_SHADOW_DIAGNOSTIC_CHECK_TYPE = "DAILY_SHADOW_DIAGNOSTIC_COMPLETE_V0_1";

function clockParts(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  return { marketDate: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute) };
}

async function checkRecord(id, type, payload, capturedAt, status = "DIAGNOSTIC") {
  const hash = await sha256Hex(payload);
  return { table: "s2_infrastructure_checks", row: {
    check_id: id, check_type: type, check_timestamp: capturedAt,
    environment: "system2-research", binding_name: "SYSTEM2_DB", schema_version: "1.1",
    expected_payload_json: canonicalStringify({ diagnosticOnly: true, selectionAuthority: false }),
    observed_payload_json: canonicalStringify(payload), status, check_hash: hash,
    notes: "Immutable daily research diagnostic; not a decision, prediction or capacity receipt.",
  } };
}

async function applyRecords(db, id, marketDate, clock, records) {
  const batch = await buildSystem2PersistenceBatch({
    batchId: id, marketDate, decisionTimestamp: clock, createdAt: clock, records,
  });
  return executeSystem2PersistenceBatch({ db, batch });
}

// Observation-time diagnostics are separate from the owner-gated Decision Clock collector.
// No injectable assessor/capacity callback can bypass that boundary.
export async function runDailyShadowDiagnosticV0_1({
  db, runId, revision, fetchImpl = globalThis.fetch, now = () => new Date(),
  calendarProbe = probeTwseTradingDate, sourceFetch = fetchDailyShadowA1SnapshotV0_1,
  historyProbe = probePitHistoryCoverageV0_1, historyLoad = loadPitPriorA1BarsV0_1,
} = {}) {
  if (!db?.prepare || !db?.batch) throw new Error("SYSTEM2_DB adapter required");
  if (typeof runId !== "string" || !/^[A-Za-z0-9._:-]+$/.test(runId)) throw new Error("safe runId required");
  if (typeof revision !== "string" || !/^[a-f0-9]{40}$/.test(revision)) throw new Error("exact Git revision required");
  const start = now();
  const { marketDate, minutes } = clockParts(start);
  const startedAt = start.toISOString();
  const markerId = `S2-DAILY-DIAGNOSTIC:${marketDate}:${runId}`;
  const prior = await db.prepare(
    "SELECT observed_payload_json, check_hash FROM s2_infrastructure_checks WHERE check_id = ? LIMIT 1",
  ).bind(markerId).first();
  if (prior) {
    const receipt = JSON.parse(prior.observed_payload_json);
    if (await sha256Hex(receipt) !== prior.check_hash || receipt.revision !== revision) {
      throw new Error("IMMUTABLE_CONFLICT daily diagnostic marker");
    }
    return deepFreeze({ ...receipt, persistenceState: "SKIPPED_IDENTICAL_COMPLETED_RUN" });
  }

  let calendar;
  let source = null;
  let history = null;
  let preflight = null;
  let sourceSession = null;
  let prospectiveHistory = { state: "NOT_OBSERVED", rowCount: 0 };
  let state;
  const shards = [];
  let symbolCount = 0;
  let knownFactorCount = 0;
  let unknownFactorCount = 0;
  let factorFailureCount = 0;
  if (minutes < 13 * 60 + 30) {
    state = "BEFORE_CLOSE_DIAGNOSTIC_SKIP";
  } else {
    try { calendar = await calendarProbe({ marketDate, fetchImpl }); }
    catch { calendar = { marketDate, state: "SOURCE_ERROR", expectedTradingDay: null }; }
    if (calendar.marketDate !== marketDate || calendar.state !== "READY" || typeof calendar.expectedTradingDay !== "boolean") {
      state = "TRADING_CALENDAR_UNAVAILABLE";
    } else if (!calendar.expectedTradingDay) {
      state = "NON_TRADING_DAY_DIAGNOSTIC_SKIP";
    } else {
      try { source = await sourceFetch({ marketDate, fetchImpl, now }); }
      catch { source = { marketDate, state: "INVALID_PAYLOAD", observedAt: now().toISOString(), snapshotBatch: null }; }
      const clock = source.decisionTimestamp || source.observedAt;
      if (source.marketDate !== marketDate || clockParts(new Date(clock)).marketDate !== marketDate ||
          Date.parse(clock) > now().getTime() || Date.parse(source.observedAt) > Date.parse(clock)) {
        throw new Error("SOURCE_CLOCK_MISMATCH");
      }
      if (source.snapshotBatch && (source.snapshotBatch.marketDate !== marketDate || source.snapshotBatch.decisionTimestamp !== clock)) {
        throw new Error("SOURCE_BATCH_CLOCK_MISMATCH");
      }
      try {
        history = source.snapshotBatch ? await historyProbe({ db, snapshotBatch: source.snapshotBatch, decisionTimestamp: clock }) : null;
      } catch { history = null; }
      history ||= {
        marketDate, decisionTimestamp: clock, state: "NOT_EVALUATED_OR_HISTORY_SOURCE_ERROR",
        currentUniverseCount: 0, historyReadyCount: 0, continuityReadyCount: 0,
        ambiguousSymbolCount: 0, historyCoverage: null, continuityCoverage: null, diagnostics: [],
      };
      if (history.marketDate !== marketDate || history.decisionTimestamp !== clock) throw new Error("HISTORY_CLOCK_MISMATCH");
      preflight = buildDailyShadowInputPreflightV0_1({ marketDate, decisionTimestamp: clock, a1Source: source, historyCoverage: history });
      state = preflight.state;
      sourceSession = await buildShadowSourceSessionReceipt({
        receiptId: `${markerId}:SOURCE`, marketDate, decisionTimestamp: clock, capturedAt: source.observedAt,
        expectedSources: [{ sourceId: "A1_FULL_MARKET", role: "REQUIRED" }, { sourceId: "PIT_HISTORY", role: "REQUIRED" }, { sourceId: "MARKET_REGIME", role: "REQUIRED" }],
        observedSources: [{ sourceId: "A1_FULL_MARKET", state: source.state === "READY" ? "KNOWN" : "UNKNOWN",
          capturedAt: source.observedAt, availableAt: source.observedAt, pointInTimeEligible: source.snapshotBatch?.pointInTimeEligible === true,
          payloadHash: source.snapshotBatch?.batchHash }],
      });
      const diagnosticRows = [];
      const coverage = new Map((history.diagnostics || []).map(x => [x.symbol, x]));
      // Incomplete/duplicate/future source batches are archived but never evaluated.
      if (source.state === "READY" && source.snapshotBatch?.pointInTimeEligible === true) {
        for (const symbol of source.snapshotBatch.symbols) {
          const current = source.snapshotBatch.bySymbol[symbol];
          let priorBars = [];
          let historyError = null;
          try {
            if (coverage.get(symbol)?.historyReady) {
              priorBars = await historyLoad({ db, symbol, market: current.market, marketDate, decisionTimestamp: clock });
              if (priorBars.some(x => x.marketDate >= marketDate || !x.pitReplayEligible ||
                !x.availableAt || Date.parse(x.availableAt) > Date.parse(clock))) throw new Error("PIT_HISTORY_REJECTED");
            }
            const factors = await buildA1HistoryPrimitiveBundle({
              bundleId: `${markerId}:FACTOR:${symbol}`, symbol, marketDate, decisionTimestamp: clock,
              observedAt: source.observedAt, availableAt: current.provenance.availableAt,
              bars: [...priorBars, current], sourceId: current.provenance.sourceId,
              sourceName: current.provenance.sourceName, sourceUrl: current.provenance.sourceUrl,
              priceSpace: "RAW", volumeUnit: "SHARES",
              // Prior continuity does not establish today's corporate-action continuity.
              continuityState: "UNVERIFIED",
            });
            knownFactorCount += factors.factorObservations.filter(x => x.state === "KNOWN").length;
            unknownFactorCount += factors.factorObservations.filter(x => x.state === "UNKNOWN").length;
            diagnosticRows.push({ symbol, market: current.market, sourceRowHash: current.sourceRowHash,
              firstKnownAt: source.observedAt, firstKnownSemantics: "THIS_OBSERVATION_UPPER_BOUND_ONLY",
              history: coverage.get(symbol) || null, factors });
          } catch {
            historyError = "PIT_HISTORY_OR_FACTOR_INVALID";
            factorFailureCount += 1;
            diagnosticRows.push({ symbol, market: current.market, state: "UNKNOWN", reason: historyError, factors: null });
          }
        }
      }
      symbolCount = diagnosticRows.length;
      // Small immutable shards avoid D1's per-value size limit. All source rows remain archived.
      const payloads = [{ kind: "SOURCE_METADATA", source: { ...source, snapshotBatch: null },
        batchMetadata: source.snapshotBatch ? { ...source.snapshotBatch, markets: undefined, bySymbol: undefined, symbols: undefined } : null,
        marketMetadata: source.snapshotBatch ? Object.fromEntries(Object.entries(source.snapshotBatch.markets).map(([key, value]) => [key, { ...value, snapshots: undefined }])) : null,
        history: { ...history, diagnostics: undefined }, sourceSession }];
      for (let i = 0; i < (history.diagnostics || []).length; i += 100) {
        payloads.push({ kind: "HISTORY_COVERAGE", rows: history.diagnostics.slice(i, i + 100) });
      }
      for (const market of ["TWSE", "TPEX"]) {
        const rows = source.snapshotBatch?.markets?.[market]?.snapshots || [];
        for (let i = 0; i < rows.length; i += 20) payloads.push({ kind: "SOURCE_ROWS", market, rows: rows.slice(i, i + 20) });
      }
      for (let i = 0; i < diagnosticRows.length; i += 10) payloads.push({ kind: "FACTOR_OBSERVATIONS", rows: diagnosticRows.slice(i, i + 10) });
      for (let i = 0; i < payloads.length; i += 1) {
        const payload = { runId: markerId, marketDate, decisionTimestamp: clock, ordinal: i, ...payloads[i] };
        const record = await checkRecord(`${markerId}:SHARD:${i}`, "DAILY_SHADOW_DIAGNOSTIC_SHARD_V0_1", payload, source.observedAt);
        if (new TextEncoder().encode(record.row.observed_payload_json).length > 750000) throw new Error("DIAGNOSTIC_SHARD_TOO_LARGE");
        shards.push(record);
      }
    }
  }
  const completedAt = now().toISOString();
  if (clockParts(new Date(completedAt)).marketDate !== marketDate) throw new Error("DIAGNOSTIC_CROSSED_MARKET_DATE");
  if (source) prospectiveHistory = await persistDailyProspectiveHistoryV0_1({ db, source, runId: markerId });
  const receipt = deepFreeze({
    schemaVersion: DAILY_SHADOW_DIAGNOSTIC_VERSION, runId: markerId, revision, marketDate,
    startedAt, completedAt, decisionTimestamp: source?.decisionTimestamp || null,
    decisionClockMode: "DIAGNOSTIC_OBSERVATION_TIME_NOT_CAPTURE_CLOCK", state,
    calendar: calendar || null, preflight, prospectiveHistory, symbolCount, knownFactorCount, unknownFactorCount, factorFailureCount,
    sourceSessionHash: sourceSession?.sourceSessionHash || null,
    sourceTransports: source?.transports || null,
    regime: { state: "UNKNOWN", reason: "VALIDATED_REGIME_SOURCES_NOT_WIRED", labels: [] },
    strategyEvaluation: "BLOCKED_ASSESSOR_POLICY_NOT_FROZEN", ranking: "NOT_EXECUTED",
    capacity: "NOT_PRODUCED", predictionSnapshot: "NOT_PRODUCED", zeroPickDay: null,
    capacityRunId: null, selectedCount: null, finalSelectionEnabled: false,
    generalCaptureEnabled: false, livePushEnabled: false, capitalImpact: false, orderImpact: false,
    system1RuntimeUsed: false, countsTowardDecisionClockReadiness: false,
    shardManifest: shards.map(x => ({ checkId: x.row.check_id, hash: x.row.check_hash })),
  });
  const clock = receipt.decisionTimestamp || startedAt;
  if (sourceSession) await applyRecords(db, `${markerId}:SOURCE`, marketDate, clock,
    [{ table: "s2_source_session_receipts", row: toSourceSessionRow(sourceSession) }]);
  for (let i = 0; i < shards.length; i += 20) {
    await applyRecords(db, `${markerId}:SHARDS:${i}`, marketDate, clock, shards.slice(i, i + 20));
  }
  for (const shard of shards) {
    const saved = await db.prepare("SELECT observed_payload_json, check_hash FROM s2_infrastructure_checks WHERE check_id = ? LIMIT 1")
      .bind(shard.row.check_id).first();
    if (!saved || saved.check_hash !== shard.row.check_hash || saved.observed_payload_json !== shard.row.observed_payload_json) {
      throw new Error("DAILY_DIAGNOSTIC_SHARD_READBACK_MISMATCH");
    }
  }
  // Completion is committed last; interrupted writes cannot appear as a complete run.
  await applyRecords(db, markerId, marketDate, clock,
    [await checkRecord(markerId, DAILY_SHADOW_DIAGNOSTIC_CHECK_TYPE, receipt, completedAt, state)]);
  const saved = await db.prepare("SELECT observed_payload_json, check_hash FROM s2_infrastructure_checks WHERE check_id = ? LIMIT 1").bind(markerId).first();
  if (!saved || saved.check_hash !== await sha256Hex(receipt) || saved.observed_payload_json !== canonicalStringify(receipt)) {
    throw new Error("DAILY_DIAGNOSTIC_READBACK_MISMATCH");
  }
  return deepFreeze({ ...receipt, persistenceState: "IMMUTABLE_D1_READBACK_VERIFIED" });
}

export async function readDailyShadowDiagnosticV0_1(db, { marketDate } = {}) {
  const filter = marketDate ? " AND json_extract(observed_payload_json, '$.marketDate') = ?" : "";
  if (marketDate && !/^\d{4}-\d{2}-\d{2}$/.test(marketDate)) throw new Error("marketDate must be YYYY-MM-DD");
  const row = await db.prepare(`SELECT observed_payload_json, check_hash FROM s2_infrastructure_checks WHERE check_type = ?${filter} ORDER BY check_timestamp DESC, check_id DESC LIMIT 1`)
    .bind(DAILY_SHADOW_DIAGNOSTIC_CHECK_TYPE, ...(marketDate ? [marketDate] : [])).first();
  if (!row) return { schemaVersion: DAILY_SHADOW_DIAGNOSTIC_VERSION, state: "DIAGNOSTIC_NOT_YET_OBSERVED", receipt: null };
  const receipt = JSON.parse(row.observed_payload_json);
  if (await sha256Hex(receipt) !== row.check_hash) throw new Error("DAILY_DIAGNOSTIC_HASH_MISMATCH");
  return { schemaVersion: DAILY_SHADOW_DIAGNOSTIC_VERSION, state: receipt.state, receipt };
}
