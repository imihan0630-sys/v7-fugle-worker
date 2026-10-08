import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const NCT01_RUNTIME_GUARD_VERSION_V0_1 = "0.1-RESEARCH";

export const NCT01_ALLOWED_NETWORK_ORIGINS_V0_1 = Object.freeze([
  "https://api.cloudflare.com",
  "https://openapi.twse.com.tw",
  "https://www.tpex.org.tw",
  "https://www.twse.com.tw",
]);

const READ_QUERY_PREFIX_RE = /^(SELECT|WITH)\b/i;
const READ_ONLY_PRAGMA_RE = /^PRAGMA\s+(?:(?:main|temp)\.)?(?:table_info|table_xinfo|index_list|index_info|index_xinfo|foreign_key_list|database_list|page_count|page_size|compile_options)\b(?:\s*\([^;]*\))?\s*$/i;
const BLOCKED_SQL_RE = /\b(INSERT|UPDATE|DELETE|REPLACE|CREATE|DROP|ALTER|VACUUM|ATTACH|DETACH)\b/i;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function normalizeSql(sql) {
  const text = requiredText(sql, "sql").trim();
  const withoutTrailing = text.replace(/;+\s*$/, "");
  if (withoutTrailing.includes(";")) throw new Error("NCT01_READ_ONLY_SQL_REQUIRED:MULTI_STATEMENT");
  return withoutTrailing;
}

export function assertNcT01ReadOnlySqlV0_1(sql) {
  const text = normalizeSql(sql);
  if (BLOCKED_SQL_RE.test(text)) {
    throw new Error("NCT01_READ_ONLY_SQL_REQUIRED");
  }
  if (READ_QUERY_PREFIX_RE.test(text)) return text;
  if (READ_ONLY_PRAGMA_RE.test(text)) return text;
  throw new Error("NCT01_READ_ONLY_SQL_REQUIRED");
}

function inputUrl(input) {
  if (input instanceof URL) return new URL(input.toString());
  if (typeof input === "string") return new URL(input);
  if (input && typeof input.url === "string") return new URL(input.url);
  throw new Error("NCT01_NETWORK_URL_REQUIRED");
}

function redirectOptions(options, status) {
  const current = { ...(options || {}), redirect: "manual" };
  const method = String(current.method || "GET").toUpperCase();
  if (status === 303 || ((status === 301 || status === 302) && method === "POST")) {
    current.method = "GET";
    delete current.body;
  }
  return current;
}

function frozenSorted(values) {
  return Object.freeze([...new Set(values.map(String))].sort());
}

export function createNcT01RuntimeGuardV0_1({
  executionCutId,
  fetchImpl = globalThis.fetch,
  allowedOrigins = NCT01_ALLOWED_NETWORK_ORIGINS_V0_1,
  maxRedirects = 5,
} = {}) {
  const cutId = requiredText(executionCutId, "executionCutId");
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  if (!Array.isArray(allowedOrigins) || allowedOrigins.length === 0) {
    throw new Error("allowedOrigins must be a non-empty array");
  }
  if (!Number.isInteger(maxRedirects) || maxRedirects < 0 || maxRedirects > 10) {
    throw new Error("maxRedirects must be an integer from 0 to 10");
  }

  const originList = frozenSorted(allowedOrigins.map((value) => new URL(value).origin));
  const originSet = new Set(originList);
  const observedOrigins = new Set();
  const forbiddenOrigins = new Set();
  const forbiddenCapabilities = new Set();

  const state = {
    networkGuardActive: true,
    d1GuardActive: false,
    capabilityGuardActive: true,
    allowedNetworkRequestCount: 0,
    forbiddenOriginAttemptCount: 0,
    allowedReadQueryCount: 0,
    rejectedMutationAttemptCount: 0,
    forbiddenCapabilityAttemptCount: 0,
    databaseName: null,
    databaseIdentityDigest: null,
    dbMetrics: null,
  };

  function assertAllowedOrigin(url) {
    const origin = url.origin;
    observedOrigins.add(origin);
    if (!originSet.has(origin)) {
      forbiddenOrigins.add(origin);
      state.forbiddenOriginAttemptCount += 1;
      throw new Error("NCT01_FORBIDDEN_NETWORK_ORIGIN:" + origin);
    }
  }

  async function guardedFetch(input, options = {}) {
    let url = inputUrl(input);
    let nextOptions = { ...(options || {}), redirect: "manual" };

    for (let hop = 0; hop <= maxRedirects; hop += 1) {
      assertAllowedOrigin(url);
      state.allowedNetworkRequestCount += 1;
      const response = await fetchImpl(url.toString(), nextOptions);
      if (!REDIRECT_STATUSES.has(Number(response?.status))) return response;

      const location = response?.headers?.get?.("location");
      if (!location) return response;
      if (hop === maxRedirects) throw new Error("NCT01_NETWORK_REDIRECT_LIMIT_EXCEEDED");
      const nextUrl = new URL(location, url);
      assertAllowedOrigin(nextUrl);
      url = nextUrl;
      nextOptions = redirectOptions(nextOptions, Number(response.status));
    }

    throw new Error("NCT01_NETWORK_REDIRECT_LIMIT_EXCEEDED");
  }

  function rejectUnsafeSql(sql) {
    try {
      return assertNcT01ReadOnlySqlV0_1(sql);
    } catch (error) {
      state.rejectedMutationAttemptCount += 1;
      throw error;
    }
  }

  function denyForbiddenCapabilityV0_1(capability) {
    const name = requiredText(capability, "capability");
    forbiddenCapabilities.add(name);
    state.forbiddenCapabilityAttemptCount += 1;
    throw new Error("NCT01_FORBIDDEN_CAPABILITY:" + name);
  }

  async function wrapD1(db) {
    if (!db || typeof db.prepare !== "function" || typeof db.batch !== "function") {
      throw new Error("remote D1 adapter is required");
    }
    if (db?.database?.name !== "system2-research") {
      throw new Error("NCT01_D1_DATABASE_NOT_ISOLATED");
    }
    if (state.d1GuardActive) throw new Error("NCT01_D1_GUARD_ALREADY_BOUND");

    state.databaseName = db.database.name;
    state.databaseIdentityDigest = db.database.uuidDigestInput
      ? await sha256Hex({
          databaseName: db.database.name,
          databaseIdentity: String(db.database.uuidDigestInput),
        })
      : null;
    state.dbMetrics = db.metrics || null;
    state.d1GuardActive = true;

    function wrapStatement(statement, sql) {
      if (!statement || typeof statement !== "object") {
        throw new Error("NCT01_D1_STATEMENT_INVALID");
      }
      return {
        ...statement,
        bind(...params) {
          if (typeof statement.bind !== "function") throw new Error("NCT01_D1_BIND_UNAVAILABLE");
          return wrapStatement(statement.bind(...params), sql);
        },
        async first() {
          if (typeof statement.first !== "function") throw new Error("NCT01_D1_FIRST_UNAVAILABLE");
          state.allowedReadQueryCount += 1;
          return statement.first();
        },
        async all() {
          if (typeof statement.all !== "function") throw new Error("NCT01_D1_ALL_UNAVAILABLE");
          state.allowedReadQueryCount += 1;
          return statement.all();
        },
        async run() {
          if (typeof statement.run !== "function") throw new Error("NCT01_D1_RUN_UNAVAILABLE");
          state.allowedReadQueryCount += 1;
          return statement.run();
        },
      };
    }

    return {
      ...db,
      prepare(sql) {
        const text = rejectUnsafeSql(sql);
        return wrapStatement(db.prepare(text), text);
      },
      async batch(statements) {
        if (!Array.isArray(statements)) throw new Error("batch statements must be an array");
        const checked = [];
        for (const statement of statements) {
          if (!statement || typeof statement !== "object" || statement.__remoteD1Statement !== true) {
            state.rejectedMutationAttemptCount += 1;
            throw new Error("NCT01_READ_ONLY_SQL_REQUIRED:FOREIGN_STATEMENT");
          }

          let suppliedSql;
          let suppliedParams;
          try {
            suppliedSql = statement.sql;
            suppliedParams = statement.params;
          } catch {
            state.rejectedMutationAttemptCount += 1;
            throw new Error("NCT01_READ_ONLY_SQL_REQUIRED:MUTABLE_STATEMENT_ACCESS");
          }

          if (typeof suppliedSql !== "string" || !Array.isArray(suppliedParams)) {
            state.rejectedMutationAttemptCount += 1;
            throw new Error("NCT01_READ_ONLY_SQL_REQUIRED:FOREIGN_STATEMENT");
          }

          const text = rejectUnsafeSql(suppliedSql);
          const params = Object.freeze([...suppliedParams]);
          checked.push(Object.freeze({
            __remoteD1Statement: true,
            sql: text,
            params,
          }));
        }
        state.allowedReadQueryCount += checked.length;
        return db.batch(Object.freeze(checked));
      },
      async rawQuery(sql, params = []) {
        if (typeof db.rawQuery !== "function") throw new Error("NCT01_D1_RAW_QUERY_UNAVAILABLE");
        const text = rejectUnsafeSql(sql);
        state.allowedReadQueryCount += 1;
        return db.rawQuery(text, params);
      },
    };
  }

  async function buildRuntimeEvidenceV0_1() {
    const rowsRead = Number(state.dbMetrics?.rowsRead || 0);
    const rowsWritten = Number(state.dbMetrics?.rowsWritten || 0);
    const rowWriteViolationCount = Number.isFinite(rowsWritten) && rowsWritten > 0
      ? Math.max(1, Math.trunc(rowsWritten))
      : 0;

    const guardComplete =
      state.networkGuardActive === true
      && state.d1GuardActive === true
      && state.capabilityGuardActive === true
      && state.databaseName === "system2-research"
      && typeof state.databaseIdentityDigest === "string"
      && /^[a-f0-9]{64}$/.test(state.databaseIdentityDigest);

    const runtimeForbiddenAccessCount =
      state.rejectedMutationAttemptCount
      + state.forbiddenOriginAttemptCount
      + state.forbiddenCapabilityAttemptCount
      + rowWriteViolationCount;

    const allowedOriginContractHash = await sha256Hex({
      contractVersion: "S2_NCT01_ALLOWED_NETWORK_ORIGINS_V0_1",
      allowedOrigins: originList,
    });

    const ledgerBase = {
      schemaVersion: "S2_NCT01_RUNTIME_GUARD_LEDGER_V0_1",
      guardVersion: NCT01_RUNTIME_GUARD_VERSION_V0_1,
      executionCutId: cutId,
      guardComplete,
      d1: {
        databaseName: state.databaseName,
        databaseIdentityDigest: state.databaseIdentityDigest,
        allowedReadQueryCount: state.allowedReadQueryCount,
        rejectedMutationAttemptCount: state.rejectedMutationAttemptCount,
        rowsRead: Number.isFinite(rowsRead) ? rowsRead : null,
        rowsWritten: Number.isFinite(rowsWritten) ? rowsWritten : null,
        rowWriteViolationCount,
      },
      network: {
        allowedOriginContractHash,
        allowedOrigins: originList,
        observedOrigins: frozenSorted([...observedOrigins]),
        forbiddenOrigins: frozenSorted([...forbiddenOrigins]),
        allowedNetworkRequestCount: state.allowedNetworkRequestCount,
        forbiddenOriginAttemptCount: state.forbiddenOriginAttemptCount,
      },
      capabilities: {
        contractVersion: "S2_NCT01_FORBIDDEN_CAPABILITY_SURFACE_V0_1",
        system1Top6RankCapabilityExposed: false,
        system1SelectedListCapabilityExposed: false,
        finalSelectionPushCapitalOrderCapabilityExposed: false,
        d1PersistenceExecutorCapabilityExposed: false,
        forbiddenCapabilitiesObserved: frozenSorted([...forbiddenCapabilities]),
        forbiddenCapabilityAttemptCount: state.forbiddenCapabilityAttemptCount,
      },
      derivation:
        "runtimeForbiddenAccessCount=rejectedMutationAttemptCount+forbiddenOriginAttemptCount+forbiddenCapabilityAttemptCount+rowWriteViolationCount",
      runtimeForbiddenAccessCount,
    };
    const runtimeEvidenceDigest = await sha256Hex(ledgerBase);
    const ledger = deepFreeze({ ...ledgerBase, runtimeEvidenceDigest });

    return deepFreeze({
      ledger,
      runtimeEvidence: deepFreeze({
        instrumented: guardComplete,
        sameExecutionCut: guardComplete,
        runtimeForbiddenAccessCount,
        runtimeEvidenceDigest,
        typedEvidence: Object.freeze([
          "NCT01_RUNTIME_GUARD_LEDGER_SHA256:" + runtimeEvidenceDigest,
          "D1_ALLOWED_READ_QUERY_COUNT:" + state.allowedReadQueryCount,
          "D1_REJECTED_MUTATION_ATTEMPT_COUNT:" + state.rejectedMutationAttemptCount,
          "NETWORK_ALLOWED_REQUEST_COUNT:" + state.allowedNetworkRequestCount,
          "NETWORK_FORBIDDEN_ORIGIN_ATTEMPT_COUNT:" + state.forbiddenOriginAttemptCount,
          "FORBIDDEN_CAPABILITY_ATTEMPT_COUNT:" + state.forbiddenCapabilityAttemptCount,
          "D1_ROWS_WRITTEN:" + (Number.isFinite(rowsWritten) ? rowsWritten : "UNKNOWN"),
        ]),
      }),
    });
  }

  return Object.freeze({
    version: NCT01_RUNTIME_GUARD_VERSION_V0_1,
    executionCutId: cutId,
    allowedOrigins: originList,
    fetch: guardedFetch,
    wrapD1,
    denyForbiddenCapabilityV0_1,
    buildRuntimeEvidenceV0_1,
  });
}
