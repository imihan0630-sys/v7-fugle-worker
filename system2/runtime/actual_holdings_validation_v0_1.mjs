import { deepFreeze } from "./factor_snapshot.mjs";

export const ACTUAL_HOLDINGS_SOURCE_TYPE_V0_1 = "USER_UPLOADED_BROKER_SCREENSHOT";
export const ACTUAL_HOLDINGS_VALIDATION_VERSION_V0_1 = "0.1-RESEARCH";

const CORE_CONFIDENCE_FLOOR = 0.90;
const OVERALL_CONFIDENCE_FLOOR = 0.90;
const DEFAULT_MAX_SCREENSHOT_AGE_HOURS = 72;
const SOURCE_IMAGE_HASH_RE = /^[0-9a-f]{64}$/i;
const SYMBOL_RE = /^[0-9]{4,6}$/;

const text = (value) => value == null ? "" : String(value).trim();
const uniqueSorted = (values) => [...new Set(values)].sort();

function isoOrNull(value) {
  const s = text(value);
  if (!s || !Number.isFinite(Date.parse(s))) return null;
  return new Date(s).toISOString();
}

function normalizeName(value) {
  return text(value).replace(/[\s*＊·・.-]+/g, "").toUpperCase();
}

function strictNumber(value, { integer = false, allowNegative = false } = {}) {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return { ok: false, value: null, reason: "NON_FINITE" };
    if (!allowNegative && value < 0) return { ok: false, value: null, reason: "NEGATIVE_NOT_ALLOWED" };
    if (integer && !Number.isInteger(value)) return { ok: false, value: null, reason: "INTEGER_REQUIRED" };
    return { ok: true, value };
  }
  const raw = text(value);
  if (!raw) return { ok: false, value: null, reason: "MISSING" };
  if (/[,，]/.test(raw)) {
    if (!/^-?\d{1,3}(?:[,，]\d{3})*(?:\.\d+)?$/.test(raw)) {
      return { ok: false, value: null, reason: "AMBIGUOUS_THOUSANDS_OR_DECIMAL" };
    }
  } else if (!/^-?\d+(?:\.\d+)?$/.test(raw)) {
    return { ok: false, value: null, reason: "INVALID_NUMERIC_TEXT" };
  }
  const parsed = Number(raw.replace(/[，,]/g, ""));
  if (!Number.isFinite(parsed)) return { ok: false, value: null, reason: "NON_FINITE" };
  if (!allowNegative && parsed < 0) return { ok: false, value: null, reason: "NEGATIVE_NOT_ALLOWED" };
  if (integer && !Number.isInteger(parsed)) return { ok: false, value: null, reason: "INTEGER_REQUIRED" };
  return { ok: true, value: parsed };
}

function confidence(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= 1 ? n : null;
}

function issue(code, severity, message, extra = {}) {
  return Object.freeze({ code, severity, message, ...extra });
}

function optionalNumber(value, opts = {}) {
  if (value == null || text(value) === "") return { ok: true, value: null };
  return strictNumber(value, opts);
}

function rowConfidence(row) {
  const parts = [
    confidence(row?.confidence?.symbol),
    confidence(row?.confidence?.quantity),
    confidence(row?.confidence?.averageCost),
  ].filter((x) => x !== null);
  if (!parts.length) return null;
  return Math.min(...parts);
}

export function normalizeConfirmedHoldingRowV0_1(row) {
  const symbol = text(row?.symbol);
  const quantity = strictNumber(row?.quantity, { integer: true });
  const averageCost = strictNumber(row?.averageCost);
  if (!SYMBOL_RE.test(symbol)) throw new Error("confirmed holding symbol must be 4-6 numeric characters");
  if (!quantity.ok || quantity.value <= 0) throw new Error("confirmed holding quantity must be positive integer");
  if (!averageCost.ok || averageCost.value <= 0) throw new Error("confirmed holding averageCost must be positive");

  const marketPrice = optionalNumber(row?.marketPrice);
  const marketValue = optionalNumber(row?.marketValue);
  const unrealizedPnL = optionalNumber(row?.unrealizedPnL, { allowNegative: true });
  const unrealizedPnLPercent = optionalNumber(row?.unrealizedPnLPercent, { allowNegative: true });

  for (const [name, parsed] of Object.entries({ marketPrice, marketValue, unrealizedPnL, unrealizedPnLPercent })) {
    if (!parsed.ok) throw new Error(`confirmed holding ${name} invalid: ${parsed.reason}`);
  }
  return deepFreeze({
    symbol,
    companyName: text(row?.companyName) || null,
    quantity: quantity.value,
    averageCost: averageCost.value,
    marketPrice: marketPrice.value,
    marketValue: marketValue.value,
    unrealizedPnL: unrealizedPnL.value,
    unrealizedPnLPercent: unrealizedPnLPercent.value,
    currency: text(row?.currency) || "UNKNOWN",
    rowConfidence: confidence(row?.rowConfidence ?? row?.extractionConfidence),
    validationState: "CONFIRMED",
  });
}

export function validateActualHoldingsScreenshotExtractionV0_1({
  extraction,
  symbolNameReference = {},
  maxScreenshotAgeHours = DEFAULT_MAX_SCREENSHOT_AGE_HOURS,
  now = null,
} = {}) {
  if (!extraction || typeof extraction !== "object" || Array.isArray(extraction)) {
    throw new Error("extraction object is required");
  }
  const issues = [];
  const sourceType = text(extraction.sourceType);
  const receivedAt = isoOrNull(extraction.receivedAt);
  const screenshotCapturedAt = isoOrNull(extraction.screenshotCapturedAt);
  const clockNow = isoOrNull(now) || receivedAt || new Date().toISOString();
  const sourceImageSha256 = text(extraction?.sourceImage?.sha256).toLowerCase();
  const sourceImageRef = text(extraction?.sourceImage?.referenceId || extraction?.sourceImage?.provenanceRef) || null;
  const sourceImageName = text(extraction?.sourceImage?.fileName) || null;

  if (sourceType !== ACTUAL_HOLDINGS_SOURCE_TYPE_V0_1) {
    issues.push(issue(
      "SOURCE_NOT_AUTHORIZED",
      "BLOCKING",
      "Only user-uploaded broker screenshots are authorized for current System 2 actual-holdings ingestion.",
      { observedSourceType: sourceType || null },
    ));
  }
  if (!receivedAt) issues.push(issue("RECEIVED_AT_INVALID", "BLOCKING", "receivedAt must be an ISO timestamp."));
  if (!SOURCE_IMAGE_HASH_RE.test(sourceImageSha256)) {
    issues.push(issue("SOURCE_IMAGE_HASH_MISSING_OR_INVALID", "BLOCKING", "Source image SHA-256 provenance is required."));
  }
  if (!screenshotCapturedAt) {
    issues.push(issue("SCREENSHOT_ASOF_UNKNOWN", "REVIEW", "Screenshot as-of time is unknown and must be explicitly confirmed."));
  } else {
    const ageHours = (Date.parse(clockNow) - Date.parse(screenshotCapturedAt)) / 3_600_000;
    if (ageHours < -0.0834) {
      issues.push(issue("SCREENSHOT_TIME_AFTER_RECEIPT", "REVIEW", "Screenshot time is materially later than receipt time."));
    } else if (ageHours > maxScreenshotAgeHours) {
      issues.push(issue("SCREENSHOT_STALE", "REVIEW", "Screenshot exceeds the default freshness window.", { ageHours }));
    }
  }

  const overallConfidence = confidence(extraction.extractionConfidence);
  if (overallConfidence === null || overallConfidence < OVERALL_CONFIDENCE_FLOOR) {
    issues.push(issue("EXTRACTION_CONFIDENCE_LOW_OR_UNKNOWN", "REVIEW", "Overall extraction confidence is below the V0.1 review floor."));
  }

  const rawRows = Array.isArray(extraction.rows) ? extraction.rows : [];
  if (!rawRows.length) issues.push(issue("NO_HOLDINGS_ROWS", "BLOCKING", "At least one holdings row is required."));

  const normalizedRows = [];
  const seen = new Map();

  rawRows.forEach((raw, index) => {
    const rowIssues = [];
    const symbol = text(raw?.symbol);
    const quantity = strictNumber(raw?.quantity, { integer: true });
    const averageCost = strictNumber(raw?.averageCost);
    const marketPrice = optionalNumber(raw?.marketPrice);
    const marketValue = optionalNumber(raw?.marketValue);
    const unrealizedPnL = optionalNumber(raw?.unrealizedPnL, { allowNegative: true });
    const unrealizedPnLPercent = optionalNumber(raw?.unrealizedPnLPercent, { allowNegative: true });

    if (!SYMBOL_RE.test(symbol)) rowIssues.push(issue("SYMBOL_INVALID", "BLOCKING", "symbol must be 4-6 numeric characters.", { rowIndex: index }));
    if (!quantity.ok || quantity.value <= 0) rowIssues.push(issue("QUANTITY_INVALID", "BLOCKING", "quantity must be a positive integer.", { rowIndex: index, reason: quantity.reason }));
    if (!averageCost.ok || averageCost.value <= 0) rowIssues.push(issue("AVERAGE_COST_INVALID", "BLOCKING", "averageCost must be positive and unambiguous.", { rowIndex: index, reason: averageCost.reason }));

    for (const [field, parsed] of Object.entries({ marketPrice, marketValue, unrealizedPnL, unrealizedPnLPercent })) {
      if (!parsed.ok) rowIssues.push(issue(`${field.toUpperCase()}_INVALID`, "REVIEW", `${field} could not be parsed deterministically.`, { rowIndex: index, reason: parsed.reason }));
    }

    const fieldConfidence = {
      symbol: confidence(raw?.confidence?.symbol),
      quantity: confidence(raw?.confidence?.quantity),
      averageCost: confidence(raw?.confidence?.averageCost),
    };
    for (const [field, value] of Object.entries(fieldConfidence)) {
      if (value === null || value < CORE_CONFIDENCE_FLOOR) {
        rowIssues.push(issue("CORE_FIELD_LOW_CONFIDENCE", "REVIEW", `${field} confidence is below the V0.1 floor.`, { rowIndex: index, field, confidence: value }));
      }
    }

    const expectedName = symbolNameReference?.[symbol];
    if (expectedName && raw?.companyName && normalizeName(expectedName) !== normalizeName(raw.companyName)) {
      rowIssues.push(issue("COMPANY_SYMBOL_MISMATCH", "REVIEW", "companyName does not match the supplied deterministic symbol-name reference.", {
        rowIndex: index,
        symbol,
        extractedCompanyName: text(raw.companyName),
        expectedCompanyName: text(expectedName),
      }));
    }

    if (quantity.ok && quantity.value > 0 && marketPrice.ok && marketPrice.value !== null && marketValue.ok && marketValue.value !== null) {
      const expected = quantity.value * marketPrice.value;
      const denom = Math.max(Math.abs(expected), 1);
      const relativeError = Math.abs(marketValue.value - expected) / denom;
      if (relativeError > 0.03) {
        rowIssues.push(issue("MARKET_VALUE_RECONCILIATION_MISMATCH", "REVIEW", "marketValue differs materially from quantity × marketPrice.", {
          rowIndex: index,
          relativeError,
        }));
      }
    }

    const ambiguityFlags = Array.isArray(raw?.ambiguityFlags) ? raw.ambiguityFlags.map(text).filter(Boolean) : [];
    if (ambiguityFlags.length) {
      rowIssues.push(issue("EXTRACTION_AMBIGUITY_FLAGGED", "REVIEW", "Extraction layer reported ambiguity flags.", { rowIndex: index, ambiguityFlags: uniqueSorted(ambiguityFlags) }));
    }

    const normalized = {
      symbol: symbol || null,
      companyName: text(raw?.companyName) || null,
      quantity: quantity.ok ? quantity.value : null,
      averageCost: averageCost.ok ? averageCost.value : null,
      marketPrice: marketPrice.ok ? marketPrice.value : null,
      marketValue: marketValue.ok ? marketValue.value : null,
      unrealizedPnL: unrealizedPnL.ok ? unrealizedPnL.value : null,
      unrealizedPnLPercent: unrealizedPnLPercent.ok ? unrealizedPnLPercent.value : null,
      currency: text(raw?.currency) || text(extraction.currency) || "UNKNOWN",
      rowConfidence: rowConfidence(raw),
      rawText: text(raw?.rawText) || null,
      issues: rowIssues,
    };
    normalizedRows.push(normalized);

    if (symbol) {
      const prior = seen.get(symbol);
      if (prior) {
        const sameCore =
          prior.quantity === normalized.quantity &&
          prior.averageCost === normalized.averageCost &&
          prior.companyName === normalized.companyName;
        issues.push(issue(
          sameCore ? "DUPLICATE_SYMBOL_ROW" : "DUPLICATE_SYMBOL_CONFLICT",
          "REVIEW",
          sameCore ? "The same symbol appears more than once." : "The same symbol appears with conflicting holdings values.",
          { symbol },
        ));
      } else {
        seen.set(symbol, normalized);
      }
    }
    issues.push(...rowIssues);
  });

  const blocking = issues.filter((x) => x.severity === "BLOCKING");
  const review = issues.filter((x) => x.severity === "REVIEW");
  const validationState = blocking.length
    ? "REJECTED"
    : review.length
      ? "REVIEW_REQUIRED"
      : "VALIDATED_PENDING_CONFIRMATION";

  return deepFreeze({
    schemaVersion: "S2_ACTUAL_HOLDINGS_SCREENSHOT_VALIDATION_V0_1",
    validationVersion: ACTUAL_HOLDINGS_VALIDATION_VERSION_V0_1,
    sourceType: sourceType || null,
    brokerName: text(extraction.brokerName) || null,
    accountAlias: text(extraction.accountAlias) || null,
    receivedAt,
    screenshotCapturedAt,
    sourceImage: {
      sha256: SOURCE_IMAGE_HASH_RE.test(sourceImageSha256) ? sourceImageSha256 : null,
      referenceId: sourceImageRef,
      fileName: sourceImageName,
    },
    extractionVersion: text(extraction.extractionVersion) || "UNKNOWN",
    extractionConfidence: overallConfidence,
    rawExtraction: extraction,
    normalizedRows: deepFreeze(normalizedRows),
    issues: deepFreeze(issues),
    blockingIssueCodes: deepFreeze(uniqueSorted(blocking.map((x) => x.code))),
    reviewIssueCodes: deepFreeze(uniqueSorted(review.map((x) => x.code))),
    validationState,
    reviewState: "NOT_CONFIRMED",
    actualHoldingsWriteEligible: false,
    unknownPreserved: true,
    failClosed: true,
    brokerApiUsed: false,
    brokerApiAuthorized: false,
    realOrdersEnabled: false,
    liveCapitalAuthority: false,
    orderRoutingAuthorized: false,
  });
}
