import { deepFreeze } from "./factor_snapshot.mjs";

export const HISTORICAL_TPEX_2021_REVISION_SIGNATURE_VERSION = "0.1-RESEARCH";

const TARGET_DATE = "2021-01-14";
const SOURCE_ROW_REVISION_COUNT = 780;

function normalizedSignature(reconciliation = {}) {
  return {
    missingFromColdCount: Number(reconciliation.missingFromColdCount),
    absentFromFreshOfficialCount: Number(reconciliation.absentFromFreshOfficialCount),
    sourceRowHashMismatchCount: Number(reconciliation.sourceRowHashMismatchCount),
    canonicalA1ValueMismatchCount: Number(reconciliation.canonicalA1ValueMismatchCount),
    sourceRevisionOnlyCount: Number(reconciliation.sourceRevisionOnlyCount),
    sourceRevisionDateCount: Number(reconciliation.sourceRevisionDateCount),
    sourceRevisionByDate: Array.isArray(reconciliation.sourceRevisionByDate)
      ? reconciliation.sourceRevisionByDate.map((entry) => ({
          marketDate: String(entry?.marketDate || ""),
          count: Number(entry?.count),
        }))
      : [],
  };
}

export function classifyHistoricalTpex2021RevisionSignatureV0_1(reconciliation = {}) {
  const signature = normalizedSignature(reconciliation);
  const commonKnownShape =
    signature.missingFromColdCount === 0
    && signature.absentFromFreshOfficialCount === 0
    && signature.sourceRowHashMismatchCount === SOURCE_ROW_REVISION_COUNT
    && signature.sourceRevisionDateCount === 1
    && signature.sourceRevisionByDate.length === 1
    && signature.sourceRevisionByDate[0].marketDate === TARGET_DATE
    && signature.sourceRevisionByDate[0].count === SOURCE_ROW_REVISION_COUNT;

  if (
    commonKnownShape
    && signature.canonicalA1ValueMismatchCount === 698
    && signature.sourceRevisionOnlyCount === 82
  ) {
    return deepFreeze({
      state: "KNOWN_CANONICAL_A1_REVISION",
      action: "PERSIST_PROSPECTIVE_CANONICAL_OVERLAY",
      canonicalOverlayRequired: true,
      immutableColdBaselineRequired: true,
      signature,
      schemaVersion: "S2_HISTORICAL_TPEX_2021_REVISION_SIGNATURE_V0_1",
    });
  }

  if (
    commonKnownShape
    && signature.canonicalA1ValueMismatchCount === 0
    && signature.sourceRevisionOnlyCount === SOURCE_ROW_REVISION_COUNT
  ) {
    return deepFreeze({
      state: "KNOWN_SOURCE_REVISION_ONLY_CANONICAL_A1_STABLE",
      action: "RETAIN_IMMUTABLE_COLD_BASELINE_WITHOUT_CANONICAL_OVERLAY",
      canonicalOverlayRequired: false,
      immutableColdBaselineRequired: true,
      signature,
      schemaVersion: "S2_HISTORICAL_TPEX_2021_REVISION_SIGNATURE_V0_1",
    });
  }

  throw new Error(
    "UNRECOGNIZED_TPEX_2021_REVISION_SIGNATURE: " + JSON.stringify(signature),
  );
}
