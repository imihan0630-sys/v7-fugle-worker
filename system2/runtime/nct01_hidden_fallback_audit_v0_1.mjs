import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const NCT01_HIDDEN_FALLBACK_AUDIT_VERSION_V0_1 = "0.1-RESEARCH";

export const NCT01_HIDDEN_FALLBACK_DIMENSIONS_V0_1 = Object.freeze([
  "cachedSystem1SelectionUsed",
  "persistedSystem1SelectionUsed",
  "aliasReconstructionUsed",
  "crossProjectFallbackUsed",
  "staleSharedStateUsed",
]);

const DISPOSITIONS = new Set(["PROVEN_ABSENT", "PRESENT", "UNKNOWN"]);
const SHA40 = /^[a-f0-9]{40}$/;
const SHA64 = /^[a-f0-9]{64}$/;

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return new Date(text).toISOString();
}

function normalizeBlobRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("auditedBlobIdentities must be a non-empty array");
  }
  const seen = new Set();
  return Object.freeze(rows.map((row, index) => {
    if (!row || typeof row !== "object") throw new Error("auditedBlobIdentities[" + index + "] is required");
    const path = requiredText(row.path, "auditedBlobIdentities[" + index + "].path");
    const blobSha = requiredText(row.blobSha, "auditedBlobIdentities[" + index + "].blobSha").toLowerCase();
    if (!SHA40.test(blobSha)) throw new Error("audited blob SHA must be 40 hex");
    if (seen.has(path)) throw new Error("duplicate audited path: " + path);
    seen.add(path);
    return deepFreeze({ path, blobSha });
  }).sort((a, b) => a.path.localeCompare(b.path)));
}

function normalizeDimensionRows(input) {
  const source = input && typeof input === "object" ? input : {};
  const out = {};
  for (const dimension of NCT01_HIDDEN_FALLBACK_DIMENSIONS_V0_1) {
    const value = typeof source[dimension] === "string"
      ? source[dimension].trim().toUpperCase()
      : "UNKNOWN";
    out[dimension] = DISPOSITIONS.has(value) ? value : "UNKNOWN";
  }
  return deepFreeze(out);
}

function normalizeRuntimeEvidence(input) {
  const source = input && typeof input === "object" ? input : {};
  const count = Number(source.runtimeForbiddenAccessCount);
  const digest = typeof source.runtimeEvidenceDigest === "string"
    ? source.runtimeEvidenceDigest.trim().toLowerCase()
    : null;
  const sameExecutionCut = source.sameExecutionCut === true;
  const instrumented = source.instrumented === true;
  const typedEvidence = Array.isArray(source.typedEvidence)
    ? Object.freeze([...new Set(source.typedEvidence.map(String))].sort())
    : Object.freeze([]);
  return deepFreeze({
    instrumented,
    sameExecutionCut,
    runtimeForbiddenAccessCount: Number.isInteger(count) && count >= 0 ? count : null,
    runtimeEvidenceDigest: digest && SHA64.test(digest) ? digest : null,
    typedEvidence,
  });
}

export async function buildNcT01HiddenFallbackAuditV0_1({
  runnerEntryPoint,
  runnerHeadSha,
  auditedBlobIdentities,
  perDimensionDisposition,
  runtimeEvidence,
  forbiddenSourceFamilyVersion,
  auditGeneratedAt,
} = {}) {
  const head = requiredText(runnerHeadSha, "runnerHeadSha").toLowerCase();
  if (!SHA40.test(head)) throw new Error("runnerHeadSha must be 40 hex");
  const blobs = normalizeBlobRows(auditedBlobIdentities);
  const dimensions = normalizeDimensionRows(perDimensionDisposition);
  const runtime = normalizeRuntimeEvidence(runtimeEvidence);
  const staticComplete = Object.values(dimensions).every((value) => value !== "UNKNOWN");
  const runtimeComplete =
    runtime.instrumented === true &&
    runtime.sameExecutionCut === true &&
    Number.isInteger(runtime.runtimeForbiddenAccessCount) &&
    runtime.runtimeEvidenceDigest !== null;
  const hiddenDependencyPresent =
    Object.values(dimensions).some((value) => value === "PRESENT") ||
    Number(runtime.runtimeForbiddenAccessCount || 0) > 0;
  const staticClean = staticComplete &&
    Object.values(dimensions).every((value) => value === "PROVEN_ABSENT");
  const runtimeClean = runtimeComplete && runtime.runtimeForbiddenAccessCount === 0;
  const auditState = hiddenDependencyPresent
    ? "HIDDEN_DEPENDENCY_PRESENT"
    : staticClean && runtimeClean
      ? "CLEAN_PROVEN_ABSENT"
      : "EVIDENCE_INCOMPLETE";

  const transitiveManifestHash = await sha256Hex({
    runnerEntryPoint: requiredText(runnerEntryPoint, "runnerEntryPoint"),
    runnerHeadSha: head,
    auditedBlobIdentities: blobs,
  });

  const base = {
    schemaVersion: "S2_NCT01_HIDDEN_FALLBACK_AUDIT_V0_1",
    auditVersion: NCT01_HIDDEN_FALLBACK_AUDIT_VERSION_V0_1,
    runnerEntryPoint: requiredText(runnerEntryPoint, "runnerEntryPoint"),
    runnerHeadSha: head,
    transitiveManifestHash,
    forbiddenSourceFamilyVersion: requiredText(
      forbiddenSourceFamilyVersion,
      "forbiddenSourceFamilyVersion",
    ),
    auditedBlobIdentities: blobs,
    perDimensionDisposition: dimensions,
    runtimeEvidence: runtime,
    staticComplete,
    runtimeComplete,
    staticClean,
    runtimeClean,
    hiddenDependencyPresent,
    auditState,
    auditGeneratedAt: isoTimestamp(auditGeneratedAt, "auditGeneratedAt"),
  };
  const auditDigest = await sha256Hex(base);
  return deepFreeze({ ...base, auditDigest });
}

export async function validateNcT01HiddenFallbackAuditV0_1(audit) {
  if (!audit || typeof audit !== "object") {
    return deepFreeze({
      hiddenFallbackAudit: deepFreeze(Object.fromEntries(
        NCT01_HIDDEN_FALLBACK_DIMENSIONS_V0_1.map((dimension) => [dimension, false]),
      )),
      auditDigest: null,
      auditState: "EVIDENCE_INCOMPLETE",
      staticComplete: false,
      runtimeComplete: false,
      hiddenDependencyPresent: false,
      runnerHeadSha: null,
      transitiveManifestHash: null,
      auditIntegrityValid: false,
      reauditRequired: true,
    });
  }

  try {
    const { auditDigest, ...hashBase } = audit;
    const recomputedDigest = await sha256Hex(hashBase);
    const expectedManifestHash = await sha256Hex({
      runnerEntryPoint: audit.runnerEntryPoint,
      runnerHeadSha: audit.runnerHeadSha,
      auditedBlobIdentities: audit.auditedBlobIdentities,
    });
    const digestValid =
      typeof auditDigest === "string" &&
      SHA64.test(auditDigest) &&
      auditDigest === recomputedDigest;
    const manifestValid =
      typeof audit.transitiveManifestHash === "string" &&
      SHA64.test(audit.transitiveManifestHash) &&
      audit.transitiveManifestHash === expectedManifestHash;
    const headValid =
      typeof audit.runnerHeadSha === "string" &&
      SHA40.test(audit.runnerHeadSha);
    const dimensions = normalizeDimensionRows(audit.perDimensionDisposition);
    const runtime = normalizeRuntimeEvidence(audit.runtimeEvidence);
    const staticComplete = Object.values(dimensions).every((value) => value !== "UNKNOWN");
    const runtimeComplete =
      runtime.instrumented === true &&
      runtime.sameExecutionCut === true &&
      Number.isInteger(runtime.runtimeForbiddenAccessCount) &&
      runtime.runtimeEvidenceDigest !== null;
    const hiddenDependencyPresent =
      Object.values(dimensions).some((value) => value === "PRESENT") ||
      Number(runtime.runtimeForbiddenAccessCount || 0) > 0;
    const staticClean =
      staticComplete &&
      Object.values(dimensions).every((value) => value === "PROVEN_ABSENT");
    const runtimeClean = runtimeComplete && runtime.runtimeForbiddenAccessCount === 0;
    const integrityValid = digestValid && manifestValid && headValid;
    const auditState = !integrityValid
      ? "EVIDENCE_INCOMPLETE"
      : hiddenDependencyPresent
        ? "HIDDEN_DEPENDENCY_PRESENT"
        : staticClean && runtimeClean
          ? "CLEAN_PROVEN_ABSENT"
          : "EVIDENCE_INCOMPLETE";
    const bools = {};
    for (const dimension of NCT01_HIDDEN_FALLBACK_DIMENSIONS_V0_1) {
      bools[dimension] = dimensions[dimension] === "PRESENT";
    }
    return deepFreeze({
      hiddenFallbackAudit: deepFreeze(bools),
      auditDigest: integrityValid ? auditDigest : null,
      auditState,
      staticComplete,
      runtimeComplete,
      hiddenDependencyPresent,
      runnerHeadSha: headValid ? audit.runnerHeadSha : null,
      transitiveManifestHash: manifestValid ? audit.transitiveManifestHash : null,
      auditIntegrityValid: integrityValid,
      reauditRequired: !integrityValid,
    });
  } catch {
    return deepFreeze({
      hiddenFallbackAudit: deepFreeze(Object.fromEntries(
        NCT01_HIDDEN_FALLBACK_DIMENSIONS_V0_1.map((dimension) => [dimension, false]),
      )),
      auditDigest: null,
      auditState: "EVIDENCE_INCOMPLETE",
      staticComplete: false,
      runtimeComplete: false,
      hiddenDependencyPresent: false,
      runnerHeadSha: null,
      transitiveManifestHash: null,
      auditIntegrityValid: false,
      reauditRequired: true,
    });
  }
}

export function ncT01HiddenFallbackAuditReceiptViewV0_1(audit) {
  const dimensions = normalizeDimensionRows(audit?.perDimensionDisposition);
  const bools = {};
  for (const dimension of NCT01_HIDDEN_FALLBACK_DIMENSIONS_V0_1) {
    bools[dimension] = dimensions[dimension] === "PRESENT";
  }
  const digest = typeof audit?.auditDigest === "string" && SHA64.test(audit.auditDigest)
    ? audit.auditDigest
    : null;
  return deepFreeze({
    hiddenFallbackAudit: deepFreeze(bools),
    auditDigest: digest,
    auditState: typeof audit?.auditState === "string" ? audit.auditState : "EVIDENCE_INCOMPLETE",
    staticComplete: audit?.staticComplete === true,
    runtimeComplete: audit?.runtimeComplete === true,
    hiddenDependencyPresent: audit?.hiddenDependencyPresent === true,
    runnerHeadSha: typeof audit?.runnerHeadSha === "string" ? audit.runnerHeadSha : null,
    transitiveManifestHash:
      typeof audit?.transitiveManifestHash === "string" ? audit.transitiveManifestHash : null,
  });
}
