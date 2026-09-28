import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

function getPath(object, path) {
  if (path === "industryId") return object?.industryId ?? object?.extra?.industryId ?? null;
  const parts = String(path).split(".");
  let value = object;
  for (const part of parts) {
    if (value === null || value === undefined) return null;
    value = value[part];
  }
  return value === undefined ? null : value;
}

function known(value) {
  return value !== null && value !== undefined && !(typeof value === "number" && !Number.isFinite(value));
}

function equalValue(a, b) {
  if (typeof a === "number" || typeof b === "number") {
    return Number.isFinite(Number(a)) && Number.isFinite(Number(b)) && Number(a) === Number(b);
  }
  return a === b;
}

function evaluateCondition(sample, condition) {
  const value = getPath(sample, condition.field);
  switch (condition.operator) {
    case "IS_KNOWN":
      return known(value);
    case "IS_UNKNOWN":
      return !known(value);
    case "GT":
      return Number.isFinite(value) && value > condition.value;
    case "GTE":
      return Number.isFinite(value) && value >= condition.value;
    case "LT":
      return Number.isFinite(value) && value < condition.value;
    case "LTE":
      return Number.isFinite(value) && value <= condition.value;
    case "EQ":
      return equalValue(value, condition.value);
    case "NE":
      return !equalValue(value, condition.value);
    case "BETWEEN":
      return Number.isFinite(value) && value >= condition.values[0] && value <= condition.values[1];
    case "IN":
      return condition.values.some((x) => equalValue(value, x));
    case "CONTAINS":
      return Array.isArray(value)
        ? value.map(String).includes(String(condition.value))
        : typeof value === "string" && value.includes(String(condition.value));
    default:
      throw new Error("unsupported condition operator: " + condition.operator);
  }
}

function pinnedPopulationMatch(sample, query) {
  if (!sample || typeof sample !== "object") return false;
  if (typeof sample.marketDate !== "string" || sample.marketDate < query.dateFrom || sample.marketDate > query.dateTo) {
    return false;
  }
  if (sample.strategyId !== query.strategyId || sample.strategyVersion !== query.strategyVersion) {
    return false;
  }
  if (query.policyId !== null && sample.policyId !== query.policyId) return false;
  if (query.policyVersion !== null && sample.policyVersion !== query.policyVersion) return false;
  return true;
}

function conditionsMatch(sample, query) {
  if (!query.conditions.length) return true;
  const values = query.conditions.map((condition) => evaluateCondition(sample, condition));
  return query.conditionMode === "ALL" ? values.every(Boolean) : values.some(Boolean);
}

function stratumKeys(sample, type) {
  switch (type) {
    case "YEAR":
      return [String(sample.marketDate || "").slice(0, 4) || "UNKNOWN"];
    case "CANDIDATE_STATE":
      return [sample.candidateState || "UNKNOWN"];
    case "ARCHIVE_COHORT":
      return [sample.archiveCohort || "UNARCHIVED"];
    case "MARKET":
      return [sample.market || "UNKNOWN"];
    case "REGIME_LABEL": {
      const labels = sample.regime?.labels;
      return Array.isArray(labels) && labels.length ? labels.map(String) : ["UNKNOWN"];
    }
    case "INDUSTRY":
      return [sample.industryId || sample.extra?.industryId || "UNKNOWN"];
    default:
      throw new Error("unsupported stratification: " + type);
  }
}

function buildStratification(samples, type) {
  const counts = {};
  for (const sample of samples) {
    for (const key of stratumKeys(sample, type)) counts[key] = (counts[key] || 0) + 1;
  }
  return {
    type,
    totalAssignments: Object.values(counts).reduce((a, b) => a + b, 0),
    counts: Object.freeze(Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)))),
  };
}

export async function runBacktestConditionQueryV0_1({
  query,
  samples = [],
} = {}) {
  if (!query || query.schemaVersion !== "S2_BACKTEST_CONDITION_QUERY_V0_1") {
    throw new Error("valid backtest condition query is required");
  }
  if (!Array.isArray(samples)) throw new Error("samples must be an array");

  const population = samples.filter((sample) => pinnedPopulationMatch(sample, query));
  const matched = population.filter((sample) => conditionsMatch(sample, query));

  const conditionPassCounts = {};
  for (const condition of query.conditions) {
    conditionPassCounts[condition.conditionId] = population.filter((sample) =>
      evaluateCondition(sample, condition),
    ).length;
  }

  const candidateStateCounts = {};
  for (const sample of matched) {
    const key = sample.candidateState || "UNKNOWN";
    candidateStateCounts[key] = (candidateStateCounts[key] || 0) + 1;
  }

  const base = {
    queryId: query.queryId,
    queryHash: query.queryHash,
    populationMode: query.populationMode,
    strategyId: query.strategyId,
    strategyVersion: query.strategyVersion,
    policyId: query.policyId,
    policyVersion: query.policyVersion,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    inputSampleCount: samples.length,
    pinnedPopulationCount: population.length,
    matchedCount: matched.length,
    matchRate: population.length ? matched.length / population.length : null,
    conditionPassCounts: deepFreeze(conditionPassCounts),
    candidateStateCounts: deepFreeze(candidateStateCounts),
    stratifications: Object.freeze(
      query.stratifyBy.map((type) => deepFreeze(buildStratification(matched, type))),
    ),
    matchedRows: query.retainMatchedRows ? Object.freeze(matched) : Object.freeze([]),
    matchedSampleIds: Object.freeze(matched.map((x) => x.sampleId || null).filter(Boolean)),
    decisionTimeFieldsOnly: true,
    futureOutcomeFieldsUsed: false,
    outcomePerformanceComputed: false,
    populationWarning: query.populationWarning,
    schemaVersion: "S2_BACKTEST_CONDITION_RESULT_V0_1",
  };
  const resultHash = await sha256Hex(base);
  return deepFreeze({ ...base, resultHash });
}

export async function runBacktestThresholdSweepV0_1({
  query,
  samples = [],
  conditionId,
  values = [],
} = {}) {
  if (!query || query.schemaVersion !== "S2_BACKTEST_CONDITION_QUERY_V0_1") {
    throw new Error("valid backtest condition query is required");
  }
  if (!Array.isArray(values) || values.length === 0) throw new Error("values must be a non-empty array");
  if (values.length > 100) throw new Error("threshold sweep exceeds maximum of 100 values");
  const id = String(conditionId || "").trim();
  const index = query.conditions.findIndex((x) => x.conditionId === id);
  if (index < 0) throw new Error("conditionId not found in query");
  const target = query.conditions[index];
  if (!["GT", "GTE", "LT", "LTE", "EQ"].includes(target.operator)) {
    throw new Error("threshold sweep requires a scalar comparison operator");
  }
  if (!values.every(Number.isFinite)) throw new Error("threshold sweep values must be finite numbers");

  const rows = [];
  for (const value of values) {
    const conditions = query.conditions.map((condition, i) =>
      i === index ? { ...condition, value } : condition,
    );
    const ephemeral = {
      ...query,
      queryId: query.queryId + "|SWEEP|" + id + "|" + String(value),
      queryHash: await sha256Hex({
        baseQueryHash: query.queryHash,
        conditionId: id,
        value,
      }),
      conditions,
      retainMatchedRows: false,
    };
    const result = await runBacktestConditionQueryV0_1({ query: ephemeral, samples });
    rows.push({
      value,
      pinnedPopulationCount: result.pinnedPopulationCount,
      matchedCount: result.matchedCount,
      matchRate: result.matchRate,
      resultHash: result.resultHash,
    });
  }

  const base = {
    baseQueryId: query.queryId,
    baseQueryHash: query.queryHash,
    conditionId: id,
    field: target.field,
    operator: target.operator,
    values: Object.freeze([...values]),
    rows: Object.freeze(rows),
    outcomePerformanceComputed: false,
    note: "This sweep compares decision-time population coverage only; outcome performance must be joined separately under PIT-safe outcome rules.",
    schemaVersion: "S2_BACKTEST_THRESHOLD_SWEEP_V0_1",
  };
  const sweepHash = await sha256Hex(base);
  return deepFreeze({ ...base, sweepHash });
}

export { evaluateCondition, getPath };
