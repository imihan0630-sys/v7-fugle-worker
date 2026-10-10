// Research-only catalog and fail-closed read model for the owner-requested "財經達人策略".
// No Cloudflare, provider, D1, Worker, scan, score, holdings, order, or push effects.
const freeze = (v) => Object.freeze(v);
const text = (v) => typeof v === "string" ? v.trim() : "";
const DATE = /^\\d{4}-\\d{2}-\\d{2}$/;
const ISO = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/;

export const EXPERT_STRATEGY_STATUS_V0_1 = freeze({
  SOURCE_REVIEW_REQUIRED: "SOURCE_REVIEW_REQUIRED",
  SOURCE_DOCUMENTED_ASSUMPTIONS_OPEN: "SOURCE_DOCUMENTED_ASSUMPTIONS_OPEN",
  OWNER_DERIVED_HYPOTHESIS: "OWNER_DERIVED_HYPOTHESIS",
  NOT_SCANNED: "NOT_SCANNED",
  SOURCE_NOT_READY: "SOURCE_NOT_READY",
  RECEIPT_UNVERIFIED: "RECEIPT_UNVERIFIED",
  STRATEGY_IDENTITY_MISMATCH: "STRATEGY_IDENTITY_MISMATCH",
  MARKET_DATE_MISMATCH: "MARKET_DATE_MISMATCH",
  PIT_OR_COVERAGE_UNVERIFIED: "PIT_OR_COVERAGE_UNVERIFIED",
  RESULTS_AWAIT_INDEPENDENT_AUDIT: "RESULTS_AWAIT_INDEPENDENT_AUDIT",
});

// These are leads to research, not claims of complete/publicly executable formulas.
export const EXPERT_STRATEGY_EXPERTS_V0_1 = freeze([
  freeze({ expertId: "SARA_WANG", name: "莎拉（Sara Wang）", sourceState: "PRIMARY_AUTHOR_PUBLIC_SOURCE_FOUND" }),
  freeze({ expertId: "AIDEN", name: "愛德恩", sourceState: "SOURCE_REVIEW_REQUIRED" }),
  freeze({ expertId: "WARRANT_BRO", name: "權證小哥", sourceState: "SOURCE_REVIEW_REQUIRED" }),
  freeze({ expertId: "ASHIU", name: "阿修", sourceState: "SOURCE_REVIEW_REQUIRED" }),
  freeze({ expertId: "DANIEL", name: "丹尼爾", sourceState: "SOURCE_REVIEW_REQUIRED" }),
]);

const saraSource = freeze([
  freeze({ url: "https://www.cmoney.tw/notes/note-detail.aspx?nid=849592", role: "AUTHOR_CASE_EXPLANATION" }),
  freeze({ url: "https://www.cmoney.tw/notes/note-detail.aspx?nid=997474", role: "PUBLIC_STRATEGY_DESCRIPTION" }),
]);
export const EXPERT_STRATEGY_CATALOG_V0_1 = freeze([
  freeze({
    strategyId: "SARA_GOLD_WRAPPED_SILVER_V0_1", expertId: "SARA_WANG",
    title: "金包銀", attribution: "AUTHOR_PUBLIC_DESCRIPTION",
    status: "SOURCE_DOCUMENTED_ASSUMPTIONS_OPEN", timeframe: "60m",
    summary: "60分K；上方120/240MA壓力、下方60MA生命線支撐，5/10/20MA夾於兩者間，等待結構轉強。",
    unresolved: freeze(["Exact executable inequalities, input adjustment and bar completion", "Market/regime, entry, stop, invalidation and no-chase implementation", "PIT-complete 60m history and independent outcome validation"]),
    sources: saraSource, executable: false, physicalSelectionAuthorized: false,
  }),
  freeze({
    strategyId: "S2_GOLD_UPTREND_PULLBACK_V0_1", expertId: "SARA_WANG",
    title: "金包銀 × 上升趨勢回檔（System 2 研究變體）",
    attribution: "OWNER_DERIVED_NOT_AUTHOR_FORMULA", status: "OWNER_DERIVED_HYPOTHESIS", timeframe: "60m_and_daily",
    summary: "額外研究上升趨勢回檔的適配 Regime 是否能提升金包銀策略成本後期望值；不是原作者公開配方。",
    unresolved: freeze(["Define uptrend and pullback ex-ante without future leakage", "Falsify base strategy vs additional confluence across regimes", "PIT/OOS/Shadow, transaction-cost, slippage and redundancy verification"]),
    sources: saraSource, executable: false, physicalSelectionAuthorized: false,
  }),
]);

export function listExpertStrategyCatalogV0_1() {
  return freeze({
    schemaVersion: "SYSTEM2_EXPERT_STRATEGY_CATALOG_V0_1",
    researchOnly: true, sourcesVerifiedAsExecutable: false,
    experts: EXPERT_STRATEGY_EXPERTS_V0_1,
    strategies: EXPERT_STRATEGY_CATALOG_V0_1,
    liveScanAuthorized: false, physicalD1ReadWriteAuthorized: false, tradingAuthority: false,
  });
}

// Caller-provided receipts are not authenticated physical D1 readbacks.
// This adapter must NEVER turn a caller-controlled flag, claimed count or stock array into a certified pick.
export function resolveExpertStrategyViewV0_1({ strategyId, marketDate, asOf = null, receipt = null } = {}) {
  const strategy = EXPERT_STRATEGY_CATALOG_V0_1.find((s) => s.strategyId === strategyId);
  if (!strategy) throw new Error("EXPERT_STRATEGY_UNKNOWN_ID");
  if (!DATE.test(text(marketDate)) || new Date(marketDate + "T00:00:00Z").toISOString().slice(0, 10) !== marketDate) {
    throw new Error("EXPERT_STRATEGY_INVALID_MARKET_DATE");
  }
  if (asOf !== null && (!ISO.test(text(asOf)) || !Number.isFinite(Date.parse(asOf)))) {
    throw new Error("EXPERT_STRATEGY_INVALID_AS_OF");
  }
  const base = {
    schemaVersion: "SYSTEM2_EXPERT_STRATEGY_VIEW_V0_1",
    strategyId: strategy.strategyId, expertId: strategy.expertId, strategyTitle: strategy.title,
    strategyStatus: strategy.status, marketDate, asOf,
    selectedCount: null, symbols: freeze([]),
    lastQualifiedRunId: null, certifiedZeroPick: false,
    sourcePITVerified: false, fullUniverseVerified: false, physicallyReadBack: false,
    mayEnterSystem2Capacity: false, mayEnterSystem1Formal: false,
    scanTriggered: false, physicalD1Mutation: false, tradingAuthority: false,
  };
  if (receipt === null) return freeze({ ...base, resultState: "NOT_SCANNED" });
  if (typeof receipt !== "object" || Array.isArray(receipt)) {
    return freeze({ ...base, resultState: "RECEIPT_UNVERIFIED" });
  }
  if (text(receipt.strategyId) !== strategyId || text(receipt.expertId) !== strategy.expertId) {
    return freeze({ ...base, resultState: "STRATEGY_IDENTITY_MISMATCH" });
  }
  if (text(receipt.marketDate) !== marketDate) {
    return freeze({ ...base, resultState: "MARKET_DATE_MISMATCH" });
  }
  if (asOf && receipt.frozenAt && (!ISO.test(text(receipt.frozenAt)) || !Number.isFinite(Date.parse(receipt.frozenAt)) || Date.parse(receipt.frozenAt) > Date.parse(asOf))) {
    return freeze({ ...base, resultState: "PIT_OR_COVERAGE_UNVERIFIED" });
  }
  if (!strategy.executable) return freeze({ ...base, resultState: "SOURCE_NOT_READY" });
  // Future registered strategies still require an independently authenticated server-side frozen receipt adapter.
  return freeze({ ...base, resultState: "RESULTS_AWAIT_INDEPENDENT_AUDIT" });
}
