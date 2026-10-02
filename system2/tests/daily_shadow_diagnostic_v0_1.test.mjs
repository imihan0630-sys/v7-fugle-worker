import assert from "node:assert/strict";
import { runDailyShadowDiagnosticV0_1, readDailyShadowDiagnosticV0_1, DAILY_SHADOW_DIAGNOSTIC_CHECK_TYPE } from "../runtime/daily_shadow_diagnostic_orchestrator_v0_1.mjs";
import { fetchDailyShadowA1SnapshotV0_1 } from "../runtime/daily_shadow_a1_source_v0_1.mjs";

class Db {
  rows = new Map(); writes = []; failShard = false;
  prepare(sql) {
    const db = this;
    return { sql, params: [], bind(...params) { this.params = params; return this; },
      async first() {
        if (/check_type =/.test(sql)) {
          return [...db.rows.values()].filter(x => x.check_type === this.params[0] &&
            (!this.params[1] || JSON.parse(x.observed_payload_json).marketDate === this.params[1])).at(-1) || null;
        }
        const table = sql.match(/FROM (s2_\w+)/)[1];
        return db.rows.get(`${table}:${this.params[0]}`) || null;
      } };
  }
  async batch(statements) {
    if (this.failShard && statements.some(x => x.params.includes("DAILY_SHADOW_DIAGNOSTIC_SHARD_V0_1"))) throw new Error("mock write interruption");
    return statements.map(s => {
      const [, table, names] = s.sql.match(/INSERT INTO (s2_\w+) \(([^)]+)\)/);
      const row = Object.fromEntries(names.split(", ").map((k, i) => [k, s.params[i]]));
      this.rows.set(`${table}:${row.check_id || row.receipt_id}`, row);
      this.writes.push({ table, row });
      return { success: true };
    });
  }
}
const date = "2026-10-02", clock = "2026-10-02T10:35:00.000Z";
const revision = "a".repeat(40);
const now = () => new Date(clock);
const twse = [{ Code: "2330", Name: "台積電", Date: "20261002", OpeningPrice: "100", HighestPrice: "110", LowestPrice: "99", ClosingPrice: "105", TradeVolume: "1000000", TradeValue: "105000000" }];
const tpex = [{ SecuritiesCompanyCode: "6488", CompanyName: "環球晶", Date: "20261002", Open: "100", High: "110", Low: "99", Close: "105", TradingShares: "1000000", TransactionAmount: "105000000" }];
const sourceFetch = args => fetchDailyShadowA1SnapshotV0_1({ ...args, minimumByMarket: { TWSE: 1, TPEX: 1 }, fetchImpl: async url => ({ ok: true, status: 200, json: async () => String(url).includes("twse") ? twse : tpex }) });
const calendarProbe = async () => ({ marketDate: date, state: "READY", expectedTradingDay: true });
const historyProbe = async () => ({ marketDate: date, decisionTimestamp: clock, state: "HISTORY_COVERAGE_INCOMPLETE", currentUniverseCount: 2,
  historyReadyCount: 0, continuityReadyCount: 0, ambiguousSymbolCount: 0, historyCoverage: 0, continuityCoverage: 0, diagnostics: [] });
const base = { runId: "TEST:1", revision, now, sourceFetch, calendarProbe, historyProbe };

const db = new Db();
const run = await runDailyShadowDiagnosticV0_1({ db, ...base });
assert.equal(run.persistenceState, "IMMUTABLE_D1_READBACK_VERIFIED");
assert.equal(run.state, "INPUTS_NOT_READY");
assert.equal(run.symbolCount, 2);
assert.equal(run.unknownFactorCount, 14);
assert.equal(run.knownFactorCount, 0);
assert.equal(run.zeroPickDay, null);
assert.equal(run.capacityRunId, null);
assert.equal(run.selectedCount, null);
assert.equal(run.finalSelectionEnabled, false);
assert.equal(run.countsTowardDecisionClockReadiness, false);
assert.equal(db.writes.at(-1).row.check_type, DAILY_SHADOW_DIAGNOSTIC_CHECK_TYPE);
assert(db.writes.every(x => ["s2_infrastructure_checks", "s2_source_session_receipts"].includes(x.table)));
const factors = db.writes.filter(x => x.row.observed_payload_json).map(x => JSON.parse(x.row.observed_payload_json))
  .find(x => x.kind === "FACTOR_OBSERVATIONS");
assert.equal(factors.rows[0].factors.coreMetrics.close, 105);
assert.equal(factors.rows[0].factors.coreMetrics.ret20, null);
assert(factors.rows[0].factors.factorObservations.every(x => x.rawValue === null && x.state === "UNKNOWN"));
assert.equal((await readDailyShadowDiagnosticV0_1(db, { marketDate: date })).receipt.runId, run.runId);
assert.equal((await readDailyShadowDiagnosticV0_1(db, { marketDate: "2026-10-01" })).receipt, null);
const writesBefore = db.writes.length;
const replay = await runDailyShadowDiagnosticV0_1({ db, ...base, sourceFetch: () => { throw new Error("must not refetch"); } });
assert.equal(replay.persistenceState, "SKIPPED_IDENTICAL_COMPLETED_RUN");
assert.equal(db.writes.length, writesBefore);
await assert.rejects(() => runDailyShadowDiagnosticV0_1({ db, ...base, revision: "b".repeat(40) }), /IMMUTABLE_CONFLICT/);

const interrupted = new Db(); interrupted.failShard = true;
await assert.rejects(() => runDailyShadowDiagnosticV0_1({ db: interrupted, ...base }), /interruption/);
assert.equal((await readDailyShadowDiagnosticV0_1(interrupted)).receipt, null);

const before = await runDailyShadowDiagnosticV0_1({ db: new Db(), ...base, now: () => new Date("2026-10-02T03:00:00Z"),
  calendarProbe: () => { throw new Error("must not fetch before close"); } });
assert.equal(before.state, "BEFORE_CLOSE_DIAGNOSTIC_SKIP");
const holiday = await runDailyShadowDiagnosticV0_1({ db: new Db(), ...base, calendarProbe: async () => ({ marketDate: date, state: "READY", expectedTradingDay: false }),
  sourceFetch: () => { throw new Error("must not fetch holiday source"); } });
assert.equal(holiday.state, "NON_TRADING_DAY_DIAGNOSTIC_SKIP");
const calendarError = await runDailyShadowDiagnosticV0_1({ db: new Db(), ...base, calendarProbe: () => { throw new Error("unavailable"); } });
assert.equal(calendarError.state, "TRADING_CALENDAR_UNAVAILABLE");
const sourceError = await runDailyShadowDiagnosticV0_1({ db: new Db(), ...base, sourceFetch: () => { throw new Error("bad json"); } });
assert.equal(sourceError.state, "INPUTS_NOT_READY");
assert.equal(sourceError.symbolCount, 0);
assert.equal(sourceError.zeroPickDay, null);
const missingPolicy = await runDailyShadowDiagnosticV0_1({ db: new Db(), ...base,
  historyProbe: async () => ({ ...(await historyProbe()), state: "READY", historyReadyCount: 2, continuityReadyCount: 2, historyCoverage: 1, continuityCoverage: 1 }) });
assert.equal(missingPolicy.state, "ASSESSOR_POLICY_BLOCKED");
assert.equal(missingPolicy.zeroPickDay, null);
await assert.rejects(() => runDailyShadowDiagnosticV0_1({ db: new Db(), ...base, historyProbe: async () => ({ ...(await historyProbe()), decisionTimestamp: "2099-01-01T00:00:00Z" }) }), /HISTORY_CLOCK_MISMATCH/);
await assert.rejects(() => runDailyShadowDiagnosticV0_1({ db: new Db(), ...base, sourceFetch: async () => ({ ...(await sourceFetch({ marketDate: date, now })), decisionTimestamp: "2099-01-01T00:00:00Z" }) }), /SOURCE_CLOCK_MISMATCH/);
await assert.rejects(() => readDailyShadowDiagnosticV0_1(db, { marketDate: "invalid" }), /marketDate/);
db.writes.at(-1).row.observed_payload_json = "{}";
await assert.rejects(() => readDailyShadowDiagnosticV0_1(db), /HASH_MISMATCH/);
console.log("Daily diagnostic orchestration: PIT/policy/UNKNOWN/immutable completion/readback tests PASS");
