import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex, canonicalStringify } from "./decision_archive.mjs";
import { buildDailyResonanceSnapshot } from "./daily_resonance_monitor_v0_1.mjs";
import { buildSystem2PersistenceBatch } from "./persistence_batch.mjs";
import { executeSystem2PersistenceBatch } from "./persistence_executor.mjs";

export const RESONANCE_COMPARISON_FRAME_VERSION = "S2_RESONANCE_COMPARISON_FRAME_V0_1";
function text(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} required`);
  return value.trim();
}
function time(value, field) {
  const s = text(value, field);
  if (!Number.isFinite(Date.parse(s))) throw new Error(`${field} invalid timestamp`);
  return new Date(s).toISOString();
}
function hash(value, field) {
  if (!/^[a-f0-9]{64}$/.test(value || "")) throw new Error(`${field} invalid hash`);
  return value;
}
function clone(value) { return JSON.parse(canonicalStringify(value)); }
const authority = Object.freeze({ finalSelectionEnabled: false, baselineImpact: false,
  livePushEnabled: false, capitalImpact: false, orderImpact: false,
  countsTowardPromotionEvidence: false, system1RuntimeUsed: false });

// A common, immutable input frame. No Challenger formula is selected or run.
export async function buildResonanceComparisonFrameV0_1({ pool, symbol, marketDate, asOf,
  sourceReceipt, monitorInput, costContract = null, regimeReceipt = null } = {}) {
  const clock = time(asOf, "asOf");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(marketDate || "") ||
      new Date(Date.parse(clock) + 8 * 3600000).toISOString().slice(0, 10) !== marketDate) {
    throw new Error("COMPARISON_MARKET_CLOCK_MISMATCH");
  }
  if (pool?.fullMarketScan !== false || !Array.isArray(pool.symbols) ||
      pool.symbols.length > 9 || pool.symbols.length !== pool.symbolCount || pool.state !== "ACTIVE") {
    throw new Error("COMPARISON_REQUIRES_ACTIVE_BOUNDED_POOL");
  }
  const symbols = pool.symbols.map(x => text(x.symbol, "pool symbol"));
  if (new Set(symbols).size !== symbols.length || !symbols.includes(symbol)) throw new Error("COMPARISON_POOL_MEMBERSHIP_MISMATCH");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pool.sourceMarketDate || "") || pool.sourceMarketDate >= marketDate || Date.parse(time(pool.activatedAt, "pool activatedAt")) > Date.parse(clock) ||
      Date.parse(time(pool.sourceDecisionTimestamp, "capacity clock")) > Date.parse(clock)) {
    throw new Error("COMPARISON_FUTURE_POOL");
  }
  const availableAt = time(sourceReceipt?.availableAt, "source availableAt");
  const observedAt = time(sourceReceipt?.observedAt, "source observedAt");
  if (sourceReceipt.pointInTimeEligible !== true || Date.parse(availableAt) > Date.parse(clock) ||
      Date.parse(observedAt) > Date.parse(clock)) throw new Error("COMPARISON_SOURCE_NOT_PIT");
  const source = { sourceId: text(sourceReceipt.sourceId, "sourceId"),
    sourceReceiptHash: hash(sourceReceipt.sourceReceiptHash, "sourceReceiptHash"),
    historyPayloadHash: hash(sourceReceipt.historyPayloadHash, "historyPayloadHash"),
    quotePayloadHash: hash(sourceReceipt.quotePayloadHash, "quotePayloadHash"),
    adjustmentVersion: text(sourceReceipt.adjustmentVersion, "adjustmentVersion"),
    priceSpace: text(sourceReceipt.priceSpace, "priceSpace"), availableAt, observedAt, pointInTimeEligible: true };
  if (!["RAW", "ADJUSTED"].includes(source.priceSpace)) throw new Error("COMPARISON_PRICE_SPACE_INVALID");
  const membership = pool.symbols.find(x => x.symbol === symbol);
  const memberships = [...(membership.strategyMemberships || [])].map(String).sort();
  // A caller cannot choose a different lifecycle or daily finality for one lane.
  const input = { historyBars: clone(monitorInput?.historyBars), currentDailyBar: monitorInput?.currentDailyBar ? clone(monitorInput.currentDailyBar) : null,
    currentDailyBarState: monitorInput?.currentDailyBarState || null, continuityState: monitorInput?.continuityState || "UNVERIFIED",
    priorLifecycleState: monitorInput?.priorLifecycleState || "WATCH", symbol, marketDate, asOf: clock,
    poolIds: [pool.poolId], strategyMemberships: memberships, intraday15mContext: null };
  const baseline = buildDailyResonanceSnapshot(input);
  // Retain only the monitor's normalized OHLCV, never caller extras/outcomes.
  input.historyBars = clone(baseline.bars.filter(x => x.date < marketDate));
  input.currentDailyBar = input.currentDailyBar ? clone(baseline.bars.at(-1)) : null;
  if (baseline.currentDailyBarState === "FINAL" &&
      Date.parse(observedAt) < Date.parse(`${marketDate}T05:30:00.000Z`)) throw new Error("COMPARISON_PRE_CLOSE_FINALITY");
  if (regimeReceipt) {
    if (regimeReceipt.marketDate !== marketDate || time(regimeReceipt.decisionTimestamp, "regime clock") !== clock ||
        Date.parse(time(regimeReceipt.availableAt, "regime availableAt")) > Date.parse(clock)) {
      throw new Error("COMPARISON_REGIME_NOT_PIT");
    }
  }
  if (costContract) {
    text(costContract.version, "cost version");
    if (Date.parse(time(costContract.availableAt, "cost availableAt")) > Date.parse(clock)) throw new Error("COMPARISON_COST_NOT_PIT");
  }
  const base = { schemaVersion: RESONANCE_COMPARISON_FRAME_VERSION, marketDate, asOf: clock, symbol,
    pool: { poolId: text(pool.poolId, "poolId"), poolHash: hash(pool.poolHash, "poolHash"),
      sourceCapacityRunId: text(pool.sourceCapacityRunId, "capacityRunId"),
      sourceCapacityHash: hash(pool.sourceCapacityHash, "capacityHash"),
      sourceMarketDate: pool.sourceMarketDate, sourceDecisionTimestamp: time(pool.sourceDecisionTimestamp, "capacity clock"),
      sourceDenominatorState: ["COMPLETE", "PARTIAL", "UNKNOWN"].includes(pool.sourceDenominatorState)
        ? pool.sourceDenominatorState
        : pool.sourceDenominatorProvenance?.denominatorState || "UNKNOWN",
      sourceDenominatorProvenanceHash:
        pool.sourceDenominatorProvenanceHash || pool.sourceDenominatorProvenance?.provenanceHash || null,
      sourceDenominatorProvenance: clone(pool.sourceDenominatorProvenance || {
        denominatorState: "UNKNOWN",
        unresolvedCount: null,
        unresolvedByState: {},
        blockerCodes: ["LEGACY_PROVENANCE_INCOMPLETE"],
        contributingShadowRuns: [],
        provenanceHash: null,
        legacyProvenanceIncomplete: true,
      }),
      activatedAt: time(pool.activatedAt, "pool activatedAt"), symbols: clone(pool.symbols).sort((a,b)=>a.symbol.localeCompare(b.symbol)) },
    source, monitorInput: input, inputPayloadHash: await sha256Hex(input),
    cost: costContract ? { state: "SUPPLIED_UNVALIDATED", contract: clone(costContract), hash: await sha256Hex(costContract) } : { state: "UNKNOWN", contract: null, hash: null },
    regime: regimeReceipt ? { state: "SUPPLIED_UNVALIDATED", receipt: clone(regimeReceipt), hash: await sha256Hex(regimeReceipt) } : { state: "UNKNOWN", receipt: null, hash: null },
    baseline: { lane: "USER_VIDEO_RESONANCE_V0_1", snapshot: clone(baseline), snapshotHash: await sha256Hex(baseline) },
    ...authority };
  const frameHash = await sha256Hex(base);
  // Identity is observation-specific, not content-specific: changed source
  // content at the same identity must conflict rather than silently append.
  const frameId = "S2-RES-COMP:" + await sha256Hex({ poolId: pool.poolId, symbol, marketDate, asOf: clock });
  return deepFreeze({ ...base, frameId, frameHash });
}

export async function buildResonanceComparisonPairV0_1({ frame, registration = null, challenger = null } = {}) {
  if (frame?.schemaVersion !== RESONANCE_COMPARISON_FRAME_VERSION) throw new Error("valid comparison frame required");
  const { frameId, frameHash, ...base } = frame;
  if (await sha256Hex(base) !== frameHash) throw new Error("COMPARISON_FRAME_HASH_MISMATCH");
  const expectedId = "S2-RES-COMP:" + await sha256Hex({ poolId: frame.pool.poolId, symbol: frame.symbol,
    marketDate: frame.marketDate, asOf: frame.asOf });
  if (frameId !== expectedId) throw new Error("COMPARISON_FRAME_ID_MISMATCH");
  let state = "CHALLENGER_NOT_PREREGISTERED";
  let registrationHash = null;
  if (registration) {
    if (registration.state !== "PREREGISTERED_SHADOW" || registration.lane !== "SYSTEM2_RESONANCE_CHALLENGER_V0_1") {
      throw new Error("COMPARISON_REGISTRATION_NOT_SHADOW");
    }
    text(registration.formulaVersion, "Challenger formulaVersion");
    text(registration.governanceRef, "registration governanceRef");
    if (!registration.parameters || typeof registration.parameters !== "object" ||
        await sha256Hex(registration.parameters) !== registration.parameterHash) throw new Error("COMPARISON_PARAMETER_HASH_MISMATCH");
    if (Date.parse(time(registration.registeredAt, "registeredAt")) > Date.parse(frame.asOf) ||
        Date.parse(time(registration.availableAt, "registration availableAt")) > Date.parse(frame.asOf)) {
      throw new Error("COMPARISON_POST_OBSERVATION_REGISTRATION");
    }
    registrationHash = await sha256Hex(registration);
    state = "CHALLENGER_OBSERVATION_MISSING";
  }
  if (challenger) {
    if (!registration) throw new Error("COMPARISON_UNREGISTERED_CHALLENGER");
    if (challenger.frameId !== frameId || challenger.frameHash !== frameHash ||
        challenger.registrationHash !== registrationHash || challenger.formulaVersion !== registration.formulaVersion ||
        challenger.parameterHash !== registration.parameterHash || challenger.symbol !== frame.symbol ||
        challenger.marketDate !== frame.marketDate || time(challenger.asOf, "Challenger clock") !== frame.asOf) {
      throw new Error("COMPARISON_SHARED_INPUT_OR_VERSION_MISMATCH");
    }
    if (!new Set(["UNKNOWN", "WARMUP", "NONE", "PROVISIONAL", "CONFIRMED", "RETRACTED"]).has(challenger.signalState)) {
      throw new Error("COMPARISON_CHALLENGER_STATE_INVALID");
    }
    if (challenger.signalState === "CONFIRMED" && frame.baseline.snapshot.finality !== "CONFIRMED_DAILY_CLOSE") {
      throw new Error("COMPARISON_CHALLENGER_FINALITY_MISMATCH");
    }
    state = "SHARED_INPUT_BINDING_VERIFIED";
  }
  const payload = { schemaVersion: "S2_RESONANCE_COMPARISON_PAIR_V0_1", frameId, frameHash,
    marketDate: frame.marketDate, asOf: frame.asOf, symbol: frame.symbol, state,
    registration: registration ? clone(registration) : null, registrationHash,
    baselineSnapshotHash: frame.baseline.snapshotHash, challenger: challenger ? {
      frameId, frameHash, registrationHash, formulaVersion: registration.formulaVersion,
      parameterHash: registration.parameterHash, symbol: frame.symbol, marketDate: frame.marketDate,
      asOf: frame.asOf, signalState: challenger.signalState } : null,
    pairedInputVerified: state === "SHARED_INPUT_BINDING_VERIFIED", challengerFormulaExecutionVerified: false,
    outcomeEvaluationReady: false, outcome: null, ...authority };
  return deepFreeze({ ...payload, pairHash: await sha256Hex(payload) });
}

export async function persistResonanceComparisonV0_1({ db, frame, pair } = {}) {
  // Revalidate serialized payloads before immutable persistence.
  const verified = await buildResonanceComparisonPairV0_1({ frame, registration: pair?.registration, challenger: pair?.challenger });
  if (verified.pairHash !== pair?.pairHash) throw new Error("COMPARISON_PAIR_HASH_MISMATCH");
  const pairId = `${frame.frameId}:PAIR:${pair.registration?.formulaVersion || "UNREGISTERED"}:${pair.registrationHash || "NONE"}`;
  const items = [[frame.frameId, "RESONANCE_COMPARISON_FRAME_V0_1", frame],
    [pairId, "RESONANCE_COMPARISON_PAIR_V0_1", pair]];
  if (pair.registration) items.push([`S2-RES-COMP-REG:${pair.registration.formulaVersion}`, "RESONANCE_COMPARISON_REGISTRATION_V0_1", pair.registration]);
  const records = await Promise.all(items.map(async ([id, type, payload]) => ({ table: "s2_infrastructure_checks", row: {
      check_id: id, check_type: type, check_timestamp: type.includes("REGISTRATION") ? pair.registration.availableAt : frame.asOf,
      environment: "system2-research", binding_name: "SYSTEM2_DB",
      schema_version: "1.1", expected_payload_json: canonicalStringify(authority), observed_payload_json: canonicalStringify(payload),
      status: type.includes("PAIR") ? pair.state : "INPUT_FRAME_ONLY", check_hash: await sha256Hex(payload),
      notes: "Comparison input binding only; no Challenger execution or promotion evidence." } })));
  for (const record of records) {
    if (new TextEncoder().encode(record.row.observed_payload_json).length > 750000) throw new Error("COMPARISON_PAYLOAD_TOO_LARGE");
  }
  const batch = await buildSystem2PersistenceBatch({ batchId: pairId, marketDate: frame.marketDate,
    decisionTimestamp: frame.asOf, createdAt: frame.asOf, records });
  await executeSystem2PersistenceBatch({ db, batch });
  for (const record of records) {
    const saved = await db.prepare("SELECT observed_payload_json, check_hash FROM s2_infrastructure_checks WHERE check_id = ? LIMIT 1")
      .bind(record.row.check_id).first();
    if (saved?.check_hash !== record.row.check_hash || saved?.observed_payload_json !== record.row.observed_payload_json) {
      throw new Error("COMPARISON_READBACK_MISMATCH");
    }
  }
  return deepFreeze({ state: "IMMUTABLE_COMPARISON_INPUT_READBACK_VERIFIED", frameId: frame.frameId,
    frameHash: frame.frameHash, pairId, pairHash: pair.pairHash, ...authority });
}
