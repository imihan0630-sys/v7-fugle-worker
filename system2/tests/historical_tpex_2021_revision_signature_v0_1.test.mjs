import assert from "node:assert/strict";
import {
  classifyHistoricalTpex2021RevisionSignatureV0_1,
} from "../runtime/historical_tpex_2021_revision_signature_v0_1.mjs";

function observedSignature(overrides = {}) {
  const { transportMode = "PRIMARY", ...reconciliationOverrides } = overrides;
  return {
    transportMode,
    reconciliation: {
      missingFromColdCount: 0,
      absentFromFreshOfficialCount: 0,
      sourceRowHashMismatchCount: 780,
      canonicalA1ValueMismatchCount: 698,
      sourceRevisionOnlyCount: 82,
      sourceRevisionDateCount: 1,
      sourceRevisionByDate: [{ marketDate: "2021-01-14", count: 780 }],
      ...reconciliationOverrides,
    },
  };
}

{
  const classified = classifyHistoricalTpex2021RevisionSignatureV0_1(observedSignature());
  assert.equal(classified.state, "KNOWN_CANONICAL_A1_REVISION");
  assert.equal(classified.action, "PERSIST_PROSPECTIVE_CANONICAL_OVERLAY");
  assert.equal(classified.canonicalOverlayRequired, true);
}

{
  const classified = classifyHistoricalTpex2021RevisionSignatureV0_1(observedSignature({
    canonicalA1ValueMismatchCount: 0,
    sourceRevisionOnlyCount: 780,
  }));
  assert.equal(classified.state, "KNOWN_SOURCE_REVISION_ONLY_CANONICAL_A1_STABLE");
  assert.equal(
    classified.action,
    "RETAIN_IMMUTABLE_COLD_BASELINE_WITHOUT_CANONICAL_OVERLAY",
  );
  assert.equal(classified.canonicalOverlayRequired, false);
}

const unknownSignatures = [
  observedSignature({ transportMode: "LEGACY_JSON_FALLBACK" }),
  observedSignature({ sourceRowHashMismatchCount: 779 }),
  observedSignature({ canonicalA1ValueMismatchCount: 697, sourceRevisionOnlyCount: 83 }),
  observedSignature({ canonicalA1ValueMismatchCount: 0, sourceRevisionOnlyCount: 779 }),
  observedSignature({ missingFromColdCount: 1 }),
  observedSignature({ absentFromFreshOfficialCount: 1 }),
  observedSignature({ sourceRevisionDateCount: 2 }),
  observedSignature({ sourceRevisionByDate: [{ marketDate: "2021-01-15", count: 780 }] }),
  observedSignature({ sourceRevisionByDate: [{ marketDate: "2021-01-14", count: 779 }] }),
];

for (const unknown of unknownSignatures) {
  assert.throws(
    () => classifyHistoricalTpex2021RevisionSignatureV0_1(unknown),
    /UNRECOGNIZED_TPEX_2021_REVISION_SIGNATURE/,
  );
}

console.log("historical_tpex_2021_revision_signature_v0_1 tests passed");
