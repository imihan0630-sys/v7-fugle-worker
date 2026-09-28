import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const BACKTEST_QUERY_CONTRACT_VERSION = "0.1-RESEARCH";

export const BACKTEST_CONDITION_FIELDS = deepFreeze([
  "candidateState",
  "archiveCohort",
  "strategyValidity",
  "entryReadiness",
  "market",
  "coreMetrics.close",
  "coreMetrics.ma5",
  "coreMetrics.ma10",
  "coreMetrics.ma20",
  "coreMetrics.ma60",
  "coreMetrics.ma5Slope1Pct",
  "coreMetrics.ma10Slope1Pct",
  "coreMetrics.ma20Slope1Pct",
  "coreMetrics.ret20",
  "coreMetrics.ret60",
  "coreMetrics.volatility20",
  "coreMetrics.priorHigh20",
  "coreMetrics.priorHigh60",
  "coreMetrics.priorLow20",
  "coreMetrics.distanceToPriorHigh20",
  "coreMetrics.distanceToMa20",
  "coreMetrics.gapPct",
  "coreMetrics.closePosition",
  "coreMetrics.upperShadowRatio",
  "coreMetrics.lowerShadowRatio",
  "coreMetrics.atr14Pct",
  "coreMetrics.avgVolume5PriorLots",
  "coreMetrics.avgVolume20PriorLots",
  "coreMetrics.avgVolume60PriorLots",
  "coreMetrics.avgAmount20Prior",
  "coreMetrics.relativeVolume20Prior",
  "coreMetrics.volumeContraction5to20Prior",
  "coreMetrics.maOrder5gt10gt20",
  "regime.labels",
  "industryId",
]);

export const BACKTEST_OPERATORS = deepFreeze([
  "GT",
  "GTE",
  "LT",
  "LTE",
  "EQ",
  "NE",
  "BETWEEN",
  "IN",
  "CONTAINS",
  "IS_KNOWN",
  "IS_UNKNOWN",
]);

const FIELD_SET = new Set(BACKTEST_CONDITION_FIELDS);
const OP_SET = new Set(BACKTEST_OPERATORS);
const MODES = new Set(["ALL", "ANY"]);
const POPULATION_MODES = new Set(["FULL_REPLAY", "BASE_COHORT_ARCHIVE"]);
const STRATIFICATIONS = new Set([
  "YEAR",
  "CANDIDATE_STATE",
  "ARCHIVE_COHORT",
  "MARKET",
  "REGIME_LABEL",
  "INDUSTRY",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(`${field} must be YYYY-MM-DD`);
  return text;
}

function normalizedCondition(row, index) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error(`conditions[${index}] must be an object`);
  }
  const conditionId = requiredText(row.conditionId || `C${index + 1}`, `conditions[${index}].conditionId`);
  const field = requiredText(row.field, `conditions[${index}].field`);
  if (field.toLowerCase().includes("outcome") || field.toLowerCase().includes("future")) {
    throw new Error("future/outcome fields are forbidden in decision-time conditions");
  }
  if (!FIELD_SET.has(field)) throw new Error(`unsupported condition field: ${field}`);
  const operator = requiredText(row.operator, `conditions[${index}].operator`).toUpperCase();
  if (!OP_SET.has(operator)) throw new Error(`unsupported condition operator: ${operator}`);

  let value = row.value ?? null;
  let values = Array.isArray(row.values) ? [...row.values] : null;

  if (operator === "BETWEEN") {
    if (!values || values.length !== 2 || !values.every(Number.isFinite)) {
      throw new Error("BETWEEN requires two finite values");
    }
    if (values[0] > values[1]) throw new Error("BETWEEN lower bound cannot exceed upper bound");
  } else if (operator === "IN") {
    if (!values || values.length === 0) throw new Error("IN requires non-empty values");
  } else if (operator === "IS_KNOWN" || operator === "IS_UNKNOWN") {
    value = null;
    values = null;
  } else if (operator === "CONTAINS") {
    if (typeof value !== "string" || !value.trim()) throw new Error("CONTAINS requires text value");
    value = value.trim();
  } else if (["GT", "GTE", "LT", "LTE"].includes(operator)) {
    if (!Number.isFinite(value)) throw new Error(`${operator} requires a finite numeric value`);
  }

  return deepFreeze({ conditionId, field, operator, value, values: values ? Object.freeze(values) : null });
}

export async function buildBacktestConditionQueryV0_1({
  queryId,
  dateFrom,
  dateTo,
  datasetVersion,
  strategyId,
  strategyVersion,
  policyId = null,
  policyVersion = null,
  populationMode = "FULL_REPLAY",
  conditionMode = "ALL",
  conditions = [],
  stratifyBy = ["YEAR", "CANDIDATE_STATE"],
  retainMatchedRows = false,
  createdAt,
} = {}) {
  const from = isoDate(dateFrom, "dateFrom");
  const to = isoDate(dateTo, "dateTo");
  if (from > to) throw new Error("dateFrom cannot be after dateTo");
  const pop = requiredText(populationMode, "populationMode");
  if (!POPULATION_MODES.has(pop)) throw new Error("unsupported populationMode");
  const mode = requiredText(conditionMode, "conditionMode").toUpperCase();
  if (!MODES.has(mode)) throw new Error("unsupported conditionMode");
  if (!Array.isArray(conditions)) throw new Error("conditions must be an array");
  if (conditions.length > 50) throw new Error("conditions exceeds maximum of 50");
  const normalized = conditions.map(normalizedCondition);
  const ids = normalized.map((x) => x.conditionId);
  if (new Set(ids).size !== ids.length) throw new Error("conditionId values must be unique");

  if (!Array.isArray(stratifyBy)) throw new Error("stratifyBy must be an array");
  const strata = stratifyBy.map((x) => requiredText(x, "stratifyBy item").toUpperCase());
  for (const key of strata) if (!STRATIFICATIONS.has(key)) throw new Error(`unsupported stratification: ${key}`);

  const base = {
    queryId: requiredText(queryId, "queryId"),
    dateFrom: from,
    dateTo: to,
    datasetVersion: requiredText(datasetVersion, "datasetVersion"),
    strategyId: requiredText(strategyId, "strategyId"),
    strategyVersion: requiredText(strategyVersion, "strategyVersion"),
    policyId: policyId ? requiredText(policyId, "policyId") : null,
    policyVersion: policyVersion ? requiredText(policyVersion, "policyVersion") : null,
    populationMode: pop,
    conditionMode: mode,
    conditions: Object.freeze(normalized),
    stratifyBy: Object.freeze(strata),
    retainMatchedRows: retainMatchedRows === true,
    decisionTimeFieldsOnly: true,
    outcomeFieldsAllowedInConditions: false,
    populationWarning:
      pop === "BASE_COHORT_ARCHIVE"
        ? "Base cohort archive is not a complete market population and must not be used to discover arbitrary full-market conditions."
        : null,
    createdAt: requiredText(createdAt, "createdAt"),
    schemaVersion: "S2_BACKTEST_CONDITION_QUERY_V0_1",
  };
  const queryHash = await sha256Hex(base);
  return deepFreeze({ ...base, queryHash });
}

export { STRATIFICATIONS };
