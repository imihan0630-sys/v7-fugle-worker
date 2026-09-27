import { deepFreeze } from "./factor_snapshot.mjs";

const CAPTURE_STRATEGIES_V0_1 = deepFreeze({
  SHORT_MOMENTUM: {
    shadowSpecId: "S2-SM-LS-001",
    sources: [
      { sourceId: "A1_TW_DAILY_OHLCV_DERIVED", role: "REQUIRED" },
      { sourceId: "A2_TAIEX", role: "CONTEXT_ONLY" },
      { sourceId: "A3_THREE_INSTITUTION_FLOW", role: "OPTIONAL" },
      { sourceId: "A4_TDCC_CONCENTRATION", role: "OPTIONAL" },
      { sourceId: "B1_TPEX_SMALL_CAP_REGIME", role: "CONTEXT_ONLY" },
      { sourceId: "B2_BREADTH_SECTOR_ROTATION", role: "CONTEXT_ONLY" },
    ],
  },
  SWING_GROWTH: {
    shadowSpecId: "S2-SG-LS-001",
    sources: [
      { sourceId: "A5_QUARTERLY_FINANCIALS", role: "REQUIRED" },
      { sourceId: "B2_INDUSTRY_THESIS_PROSPECTIVE", role: "REQUIRED" },
      { sourceId: "A6_PE_PB_VALUATION", role: "OPTIONAL" },
      { sourceId: "A7_OFFICIAL_ANNOUNCEMENTS", role: "OPTIONAL" },
      { sourceId: "A4_TDCC_CONCENTRATION", role: "OPTIONAL" },
    ],
  },
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

export function buildProspectiveCapturePlan({
  capturePlanId,
  marketDate,
  decisionTimestamp,
  universeVersion,
  strategyIds = ["SHORT_MOMENTUM", "SWING_GROWTH"],
  createdAt,
} = {}) {
  const ids = [...strategyIds].map((x, i) => requiredText(String(x), `strategyIds[${i}]`));
  if (new Set(ids).size !== ids.length) throw new Error("strategyIds contains duplicates");

  const strategies = ids.map((strategyId) => {
    const spec = CAPTURE_STRATEGIES_V0_1[strategyId];
    if (!spec) throw new Error(`strategy not activated for capture V0.1: ${strategyId}`);
    return {
      strategyId,
      shadowSpecId: spec.shadowSpecId,
      expectedSources: spec.sources,
    };
  });

  return deepFreeze({
    capturePlanId: requiredText(capturePlanId, "capturePlanId"),
    contractVersion: "0.1",
    mode: "AFTER_CLOSE_DECISION_CAPTURE",
    marketDate: requiredText(marketDate, "marketDate"),
    decisionTimestamp: assertTimestamp(decisionTimestamp, "decisionTimestamp"),
    timezone: "Asia/Taipei",
    universeVersion: requiredText(universeVersion, "universeVersion"),
    strategies,
    intradayEnabled: false,
    outcomeJoinEnabled: false,
    notificationsEnabled: false,
    historicalBackfillAllowed: false,
    exactCronFrozen: false,
    decisionClockState: "UNFROZEN_BLOCKED_DEPENDENCIES",
    sourceArrivalMeasurementContractVersion: "0.1",
    persistenceBinding: "SYSTEM2_DB",
    requiredSchemaVersion: "0.5",
    createdAt: assertTimestamp(createdAt, "createdAt"),
    schemaVersion: "S2_CAPTURE_PLAN_V0_1",
  });
}

export { CAPTURE_STRATEGIES_V0_1 };
