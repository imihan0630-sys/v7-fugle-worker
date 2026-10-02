import { buildHistoricalStoreIngestBatch, toHistoricalA1BarRows } from "./historical_store_v0_1.mjs";
import { executeHistoricalIngestBatchBulkV0_1 } from "./historical_bulk_persistence_v0_1.mjs";
import { canonicalStringify } from "./decision_archive.mjs";
import { deepFreeze } from "./factor_snapshot.mjs";

// Only current-session observations enter this lane. Never infer publication
// time, historical first knowledge, or corporate-action continuity.
export async function persistDailyProspectiveHistoryV0_1({ db, source, runId }) {
  if (source?.state !== "READY" || source.snapshotBatch?.pointInTimeEligible !== true) {
    return deepFreeze({ state: "SKIPPED_SOURCE_NOT_READY", rowCount: 0 });
  }
  const { marketDate, observedAt, snapshotBatch } = source;
  const observed = new Date(observedAt);
  const local = new Date(observed.getTime() + 8 * 3600000).toISOString();
  if (local.slice(0, 10) !== marketDate || local.slice(11, 16) < "13:30" ||
      snapshotBatch.marketDate !== marketDate || Date.parse(observedAt) > Date.parse(source.decisionTimestamp)) {
    throw new Error("PROSPECTIVE_HISTORY_CLOCK_MISMATCH");
  }
  const plans = [];
  for (const market of ["TWSE", "TPEX"]) {
    const part = snapshotBatch.markets[market];
    if (part?.state !== "READY" || !part.snapshots?.length) throw new Error("PROSPECTIVE_HISTORY_MARKET_NOT_READY");
    const prior = (await db.prepare("SELECT * FROM s2_historical_a1_bars WHERE market_date = ? AND market = ? AND availability_basis = ?")
      .bind(marketDate, market, "PROSPECTIVE_OBSERVATION").all()).results || [];
    const rows = [];
    for (const current of part.snapshots) {
      if (current.marketDate !== marketDate || current.market !== market ||
          current.provenance?.availableAt !== observedAt || current.provenance?.pointInTimeEligible !== true) {
        throw new Error("PROSPECTIVE_HISTORY_ROW_CLOCK_MISMATCH");
      }
      // Reuse first observation for exact official content only. Corrections
      // retain a separate immutable hash and remain ambiguous to history replay.
      const matches = prior.filter(x => x.symbol === current.symbol && x.source_row_hash === current.sourceRowHash &&
        x.source_id === current.provenance.sourceId && x.price_space === "RAW");
      if (matches.length > 1) throw new Error("PROSPECTIVE_HISTORY_DUPLICATE_FIRST_KNOWN");
      const saved = matches[0];
      if (saved && (!saved.available_at || saved.available_at !== saved.observed_at ||
          Date.parse(saved.available_at) > observed.getTime())) throw new Error("PROSPECTIVE_HISTORY_INVALID_FIRST_KNOWN");
      rows.push({ ...current, priceSpace: "RAW", continuityState: "UNVERIFIED",
        observedAt: saved?.observed_at || observed.toISOString(),
        availableAt: saved?.available_at || observed.toISOString(), availabilityBasis: "PROSPECTIVE_OBSERVATION" });
    }
    plans.push(await buildHistoricalStoreIngestBatch({ batchId: `${runId}:PROSPECTIVE:${market}`,
      capturedAt: observed.toISOString(), sourceId: part.sourceId, sourceName: part.sourceName,
      sourceUrl: part.sourceUrl, rows }));
  }
  const receipts = [];
  // Validate both markets before writing either one. Shared writer concurrency
  // serializes daily runs; partial failures never produce diagnostic completion.
  for (const plan of plans) {
    const result = await executeHistoricalIngestBatchBulkV0_1({ db, ingestBatch: plan });
    const expected = toHistoricalA1BarRows(plan);
    for (let i = 0; i < expected.length; i += 80) {
      const group = expected.slice(i, i + 80);
      const saved = (await db.prepare(`SELECT * FROM s2_historical_a1_bars WHERE bar_id IN (${group.map(() => "?").join(",")})`)
        .bind(...group.map(x => x.bar_id)).all()).results || [];
      const map = new Map(saved.map(x => [x.bar_id, x]));
      for (const row of group) {
        const actual = map.get(row.bar_id);
        // Batch/capture metadata belongs to the first immutable insert.
        const fields = Object.keys(row).filter(k => !["batch_id", "captured_at"].includes(k));
        if (!actual || canonicalStringify(fields.map(k => actual[k])) !== canonicalStringify(fields.map(k => row[k]))) {
          throw new Error("PROSPECTIVE_HISTORY_READBACK_MISMATCH");
        }
      }
    }
    receipts.push({ ...result, market: plan.rows[0].market, readbackVerified: true });
  }
  return deepFreeze({ state: "PROSPECTIVE_HISTORY_READBACK_VERIFIED", rowCount: plans.reduce((n, p) => n + p.rowCount, 0),
    availabilityBasis: "PROSPECTIVE_OBSERVATION", firstKnownSemantics: "FIRST_SAVED_OBSERVATION_UPPER_BOUND",
    continuityState: "UNVERIFIED", selectionAuthority: false, receipts });
}
