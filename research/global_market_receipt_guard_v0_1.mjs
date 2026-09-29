import { createHash } from "node:crypto";

export const GLOBAL_MARKET_RECEIPT_GUARD_VERSION = "0.1.0";

const REQUIRED_FIELDS = [
  "receiptId",
  "domainModule",
  "instrumentFamily",
  "instrumentId",
  "sourceMarket",
  "sourceTimezone",
  "sourceSessionDate",
  "observedAt",
  "capturedAt",
  "knownAtTaipei",
  "firstEligibleTaiwanDecision",
  "sourceId",
  "sourceUrlOrContract",
  "provider",
  "providerEntitlement",
  "dataLatencyClass",
  "revisionStatus",
  "staleFlag",
  "staleReason",
  "pointInTimeEligible",
  "missingReason",
  "rulesRegimeVersion",
  "payloadVersion"
];

const LATENCY_CLASSES = new Set([
  "REALTIME",
  "DELAYED",
  "END_OF_DAY",
  "OFFICIAL_RELEASE",
  "ASSESSMENT",
  "EVENT_PUBLICATION",
  "UNKNOWN"
]);

const INSTRUMENT_FAMILIES = new Set([
  "DXY",
  "FX",
  "UST_RATE",
  "US_EQUITY",
  "ASIA_EQUITY",
  "TAIFEX_NIGHT",
  "OIL",
  "INDUSTRIAL_METAL",
  "PRECIOUS_METAL",
  "CRITICAL_MINERAL_PRICE",
  "CRITICAL_MINERAL_EVENT",
  "MACRO_SCHEDULE",
  "MACRO_RELEASE"
]);

function requiredText(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} must be non-empty text`);
  }
  return value.trim();
}

function parseTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!/[zZ]|[+-]\d{2}:\d{2}$/.test(text)) {
    throw new Error(`${field} must include an explicit timezone offset`);
  }
  const parsed = new Date(text);
  if (Number.isNaN(parsed.valueOf())) throw new Error(`${field} is invalid`);
  return parsed;
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue(value[key])])
    );
  }
  return value;
}

export function stableStringify(value) {
  return JSON.stringify(stableValue(value));
}

export function sha256(value) {
  return createHash("sha256").update(String(value), "utf8").digest("hex");
}

export function computeReceiptHash(receipt) {
  const copy = { ...receipt };
  delete copy.receiptHash;
  delete copy.validation;
  return sha256(stableStringify(copy));
}

export function validateGlobalMarketReceipt(receipt, context = {}) {
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) {
    throw new Error("receipt must be an object");
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in receipt)) throw new Error(`missing required field: ${field}`);
  }

  requiredText(receipt.receiptId, "receiptId");
  requiredText(receipt.domainModule, "domainModule");
  const family = requiredText(receipt.instrumentFamily, "instrumentFamily");
  if (!INSTRUMENT_FAMILIES.has(family)) {
    throw new Error("instrumentFamily is unsupported");
  }
  requiredText(receipt.instrumentId, "instrumentId");
  requiredText(receipt.sourceMarket, "sourceMarket");
  requiredText(receipt.sourceTimezone, "sourceTimezone");
  requiredText(receipt.sourceSessionDate, "sourceSessionDate");
  requiredText(receipt.sourceId, "sourceId");
  requiredText(receipt.sourceUrlOrContract, "sourceUrlOrContract");
  requiredText(receipt.provider, "provider");
  requiredText(receipt.providerEntitlement, "providerEntitlement");
  requiredText(receipt.revisionStatus, "revisionStatus");
  requiredText(receipt.rulesRegimeVersion, "rulesRegimeVersion");
  requiredText(receipt.payloadVersion, "payloadVersion");

  const latency = requiredText(receipt.dataLatencyClass, "dataLatencyClass");
  if (!LATENCY_CLASSES.has(latency)) {
    throw new Error("dataLatencyClass is unsupported");
  }

  if (![true, false, null].includes(receipt.pointInTimeEligible)) {
    throw new Error("pointInTimeEligible must be true, false, or null");
  }
  if (typeof receipt.staleFlag !== "boolean") {
    throw new Error("staleFlag must be boolean");
  }
  if (receipt.staleFlag && (!receipt.staleReason || String(receipt.staleReason).trim() === "")) {
    throw new Error("staleReason is required when staleFlag=true");
  }

  const observedAt = parseTimestamp(receipt.observedAt, "observedAt");
  const capturedAt = parseTimestamp(receipt.capturedAt, "capturedAt");
  const knownAt = parseTimestamp(receipt.knownAtTaipei, "knownAtTaipei");
  const firstEligible = parseTimestamp(
    receipt.firstEligibleTaiwanDecision,
    "firstEligibleTaiwanDecision"
  );

  if (observedAt > capturedAt) {
    throw new Error("observedAt cannot be later than capturedAt");
  }
  if (knownAt > capturedAt) {
    throw new Error("knownAtTaipei cannot be later than capturedAt");
  }
  if (firstEligible < knownAt) {
    throw new Error("firstEligibleTaiwanDecision cannot precede knownAtTaipei");
  }

  if (
    receipt.pointInTimeEligible === true &&
    (latency === "UNKNOWN" || /UNKNOWN|NOT_FROZEN/i.test(receipt.providerEntitlement))
  ) {
    throw new Error(
      "PIT-eligible receipt requires known latency and provider entitlement"
    );
  }

  if (
    receipt.pointInTimeEligible === true &&
    receipt.missingReason &&
    String(receipt.missingReason).trim() !== ""
  ) {
    throw new Error("PIT-eligible receipt cannot carry a missingReason");
  }

  const decisionTimestamp = context.decisionTimestamp
    ? parseTimestamp(context.decisionTimestamp, "context.decisionTimestamp")
    : null;

  const futureReasons = [];
  if (decisionTimestamp) {
    if (knownAt > decisionTimestamp) {
      futureReasons.push("KNOWN_AFTER_DECISION");
    }
    if (firstEligible > decisionTimestamp) {
      futureReasons.push("FIRST_ELIGIBLE_AFTER_DECISION");
    }
  }

  if (receipt.pointInTimeEligible === true && futureReasons.length > 0) {
    throw new Error(`future-information violation: ${futureReasons.join(",")}`);
  }

  const qualityReasons = [];
  if (receipt.pointInTimeEligible !== true) {
    qualityReasons.push(
      receipt.pointInTimeEligible === false
        ? "PIT_EXPLICITLY_INELIGIBLE"
        : "PIT_UNKNOWN"
    );
  }
  if (latency === "UNKNOWN") qualityReasons.push("LATENCY_UNKNOWN");
  if (/UNKNOWN|NOT_FROZEN/i.test(receipt.providerEntitlement)) {
    qualityReasons.push("ENTITLEMENT_UNKNOWN");
  }
  if (receipt.staleFlag) qualityReasons.push("STALE");
  if (receipt.missingReason && String(receipt.missingReason).trim() !== "") {
    qualityReasons.push("MISSING");
  }
  if (futureReasons.length) qualityReasons.push(...futureReasons);

  const cleanCoverageEligible =
    receipt.pointInTimeEligible === true &&
    latency !== "UNKNOWN" &&
    !/UNKNOWN|NOT_FROZEN/i.test(receipt.providerEntitlement) &&
    !receipt.staleFlag &&
    !receipt.missingReason &&
    futureReasons.length === 0;

  return Object.freeze({
    guardVersion: GLOBAL_MARKET_RECEIPT_GUARD_VERSION,
    valid: true,
    cleanCoverageEligible,
    qualityState: cleanCoverageEligible ? "CLEAN" : "NOT_CLEAN",
    qualityReasons: Object.freeze(qualityReasons),
    receiptHash: computeReceiptHash(receipt)
  });
}

export function sealGlobalMarketReceipt(receipt, context = {}) {
  const validation = validateGlobalMarketReceipt(receipt, context);
  return Object.freeze({
    ...receipt,
    receiptHash: validation.receiptHash,
    validation
  });
}

export function verifySealedReceipt(receipt, context = {}) {
  if (!receipt?.receiptHash) throw new Error("receiptHash is required");
  const expected = computeReceiptHash(receipt);
  if (expected !== receipt.receiptHash) throw new Error("receipt hash mismatch");
  return validateGlobalMarketReceipt(receipt, context);
}

export function appendReceiptDigest(previousDigest, sealedReceipt) {
  const prior = previousDigest || "GENESIS";
  const hash = sealedReceipt?.receiptHash || computeReceiptHash(sealedReceipt);
  return sha256(`${prior}|${hash}`);
}

export { LATENCY_CLASSES, INSTRUMENT_FAMILIES, REQUIRED_FIELDS };
