import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

const PURPOSES = new Set(["GLOBAL_ADMISSION", "ACTIVE_INTRADAY_MONITOR"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function positiveIntOrNull(value, field) {
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${field} must be a positive integer or null`);
  return value;
}

export async function buildStrategyOrderingReceipt(input) {
  if (!input || typeof input !== "object") throw new Error("ordering receipt input is required");

  const purpose = requiredText(input.purpose, "purpose");
  if (!PURPOSES.has(purpose)) throw new Error(`unsupported purpose: ${purpose}`);

  const strategyId = requiredText(input.strategyId, "strategyId");
  const strategyVersion = requiredText(input.strategyVersion, "strategyVersion");
  const rows = [...(input.orderedCandidates || [])];

  const seenSymbols = new Set();
  const normalizedRows = rows.map((row, index) => {
    if (!row || typeof row !== "object") throw new Error(`orderedCandidates[${index}] is required`);
    const symbol = requiredText(row.symbol, `orderedCandidates[${index}].symbol`);
    if (seenSymbols.has(symbol)) throw new Error(`duplicate ordered symbol: ${symbol}`);
    seenSymbols.add(symbol);

    const rowStrategyId = requiredText(row.strategyId, `orderedCandidates[${index}].strategyId`);
    const rowStrategyVersion = requiredText(
      row.strategyVersion,
      `orderedCandidates[${index}].strategyVersion`,
    );
    if (rowStrategyId !== strategyId || rowStrategyVersion !== strategyVersion) {
      throw new Error(`strategy mismatch for ordered symbol ${symbol}`);
    }

    return {
      ordinal: index + 1,
      symbol,
      decisionId: requiredText(row.decisionId, `orderedCandidates[${index}].decisionId`),
      strategyId,
      strategyVersion,
      strategyValidity: requiredText(
        row.strategyValidity,
        `orderedCandidates[${index}].strategyValidity`,
      ),
      entryReadiness: requiredText(
        row.entryReadiness,
        `orderedCandidates[${index}].entryReadiness`,
      ),
      strategyLocalRank: positiveIntOrNull(
        row.strategyLocalRank,
        `orderedCandidates[${index}].strategyLocalRank`,
      ),
      strategyLocalRankVersion: row.strategyLocalRankVersion
        ? requiredText(
            row.strategyLocalRankVersion,
            `orderedCandidates[${index}].strategyLocalRankVersion`,
          )
        : undefined,
      reasonCodes: Object.freeze([...(row.reasonCodes || [])].map(String)),
      warnings: Object.freeze([...(row.warnings || [])].map(String)),
    };
  });

  const base = {
    orderingReceiptId: requiredText(input.orderingReceiptId, "orderingReceiptId"),
    marketDate: requiredText(input.marketDate, "marketDate"),
    decisionTimestamp: requiredText(input.decisionTimestamp, "decisionTimestamp"),
    purpose,
    strategyId,
    strategyVersion,
    orderingPolicyId: requiredText(input.orderingPolicyId, "orderingPolicyId"),
    orderingPolicyVersion: requiredText(
      input.orderingPolicyVersion,
      "orderingPolicyVersion",
    ),
    orderedCandidates: normalizedRows,
    candidateCount: normalizedRows.length,
    capturedAt: requiredText(input.capturedAt, "capturedAt"),
    schemaVersion: "S2_STRATEGY_ORDERING_V0_1",
  };

  const orderingHash = await sha256Hex(base);

  return deepFreeze({
    ...base,
    orderingHash,
  });
}

export { PURPOSES };
