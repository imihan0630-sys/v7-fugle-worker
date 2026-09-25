import { createHash } from "node:crypto";

export const PATTERN_OBSERVER_ADAPTER_VERSION = "PATTERN_OBSERVER_ADAPTER_V0_1";

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  }
  return value;
}

export function stableObserverHash(value) {
  return createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
}

function blocked(reason, extra = {}) {
  return {
    status: "BLOCKED",
    reason,
    researchOnly: true,
    decisionImpact: false,
    ...extra
  };
}

export function buildPatternCacheRecord({
  parentReference,
  geometryEnvelope,
  rawExecutionEnvelope,
  detectorSnapshot,
  asOfDate,
  detectorVersion,
  semanticContractVersion = "CA_SEMANTIC_SPACES_V0_1"
} = {}) {
  if (!parentReference || parentReference.status !== "VALID") {
    return blocked("SHADOW_PARENT_REFERENCE_INVALID");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(asOfDate || ""))) {
    return blocked("AS_OF_DATE_INVALID", { shadowParentKey: parentReference.shadowParentKey });
  }
  if (!geometryEnvelope || geometryEnvelope.status !== "VALID" ||
      geometryEnvelope.semanticSpace !== "TECHNICAL_CONTINUITY") {
    return blocked("GEOMETRY_SERIES_NOT_READY", { shadowParentKey: parentReference.shadowParentKey });
  }
  if (!rawExecutionEnvelope || rawExecutionEnvelope.status !== "VALID" ||
      rawExecutionEnvelope.semanticSpace !== "RAW_EXECUTION") {
    return blocked("RAW_EXECUTION_SERIES_NOT_READY", { shadowParentKey: parentReference.shadowParentKey });
  }
  if (!detectorSnapshot || detectorSnapshot.status !== "VALID") {
    return blocked("DETECTOR_SNAPSHOT_NOT_READY", { shadowParentKey: parentReference.shadowParentKey });
  }
  if (detectorSnapshot.asOfDate && String(detectorSnapshot.asOfDate) !== String(asOfDate)) {
    return blocked("DETECTOR_ASOF_MISMATCH", { shadowParentKey: parentReference.shadowParentKey });
  }

  const record = {
    adapterVersion: PATTERN_OBSERVER_ADAPTER_VERSION,
    detectorVersion: String(detectorVersion || detectorSnapshot.detectorVersion || ""),
    semanticContractVersion,
    shadowParentKey: parentReference.shadowParentKey,
    parentSnapshotHash: parentReference.parentSnapshotHash,
    scanDate: parentReference.scanDate,
    symbol: parentReference.symbol,
    asOfDate: String(asOfDate),
    geometry: {
      semanticSpace: geometryEnvelope.semanticSpace,
      sourceId: geometryEnvelope.sourceId,
      payloadHash: geometryEnvelope.payloadHash
    },
    rawExecution: {
      semanticSpace: rawExecutionEnvelope.semanticSpace,
      sourceId: rawExecutionEnvelope.sourceId,
      payloadHash: rawExecutionEnvelope.payloadHash
    },
    detectorSnapshotHash: detectorSnapshot.snapshotHash || stableObserverHash(detectorSnapshot),
    patternState: detectorSnapshot,
    researchOnly: true,
    decisionImpact: false,
    formalCoreImpact: false
  };
  return {
    ...record,
    status: "VALID",
    recordHash: stableObserverHash(record)
  };
}

export function comparePatternCacheRecords(a, b) {
  if (!a || !b || a.status !== "VALID" || b.status !== "VALID") {
    return blocked("CACHE_RECORD_INVALID");
  }
  if (a.shadowParentKey !== b.shadowParentKey || a.asOfDate !== b.asOfDate) {
    return {
      status: "DIFFERENT_RECORD_IDENTITY",
      sameIdentity: false,
      provenanceConflict: false,
      researchOnly: true,
      decisionImpact: false
    };
  }
  const sameParent = a.parentSnapshotHash === b.parentSnapshotHash;
  const sameGeometry = a.geometry?.payloadHash === b.geometry?.payloadHash;
  const sameRaw = a.rawExecution?.payloadHash === b.rawExecution?.payloadHash;
  const sameDetector = a.detectorSnapshotHash === b.detectorSnapshotHash;
  const exact = sameParent && sameGeometry && sameRaw && sameDetector;
  return {
    status: exact ? "SAME_RECORD_EXACT" : "PROVENANCE_CONFLICT",
    sameIdentity: true,
    sameParent,
    sameGeometry,
    sameRaw,
    sameDetector,
    provenanceConflict: !exact,
    researchOnly: true,
    decisionImpact: false
  };
}

export function buildPatternObservability(records = []) {
  const rows = Array.isArray(records) ? records : [];
  const valid = rows.filter(x => x?.status === "VALID");
  const blockedRows = rows.filter(x => x?.status === "BLOCKED");
  const blockedReasons = {};
  for (const row of blockedRows) {
    const key = String(row?.reason || "UNKNOWN");
    blockedReasons[key] = (blockedReasons[key] || 0) + 1;
  }

  const boolRate = (field) => {
    const known = valid.filter(x => typeof x?.[field] === "boolean");
    if (!known.length) return null;
    return known.filter(x => x[field] === true).length / known.length;
  };

  const numericMedian = (field) => {
    const values = valid.map(x => Number(x?.[field])).filter(Number.isFinite).sort((a,b)=>a-b);
    if (!values.length) return null;
    const m = Math.floor(values.length / 2);
    return values.length % 2 ? values[m] : (values[m-1] + values[m]) / 2;
  };

  return {
    observabilityVersion: "PATTERN_OBSERVABILITY_V0_1",
    totalRecords: rows.length,
    validRecords: valid.length,
    blockedRecords: blockedRows.length,
    coverageRate: rows.length ? valid.length / rows.length : null,
    blockedReasons,
    prefixExactRate: boolRate("prefixExact"),
    replayExactRate: boolRate("replayExact"),
    scaleAgreementMedian: numericMedian("scaleAgreement"),
    computeMsMedian: numericMedian("computeMs"),
    researchOnly: true,
    decisionImpact: false,
    formalCoreImpact: false
  };
}

export function attachPatternQaMetrics(record, {
  prefixExact = null,
  replayExact = null,
  scaleAgreement = null,
  computeMs = null
} = {}) {
  if (!record || record.status !== "VALID") return blocked("CACHE_RECORD_INVALID");
  const out = {
    ...record,
    prefixExact: typeof prefixExact === "boolean" ? prefixExact : null,
    replayExact: typeof replayExact === "boolean" ? replayExact : null,
    scaleAgreement: Number.isFinite(Number(scaleAgreement)) ? Number(scaleAgreement) : null,
    computeMs: Number.isFinite(Number(computeMs)) ? Number(computeMs) : null
  };
  return { ...out, qaHash: stableObserverHash(out) };
}
