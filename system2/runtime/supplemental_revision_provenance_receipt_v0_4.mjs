import { deepFreeze } from "./factor_snapshot.mjs";
import { buildSupplementalRevisionProvenanceReceiptV0_3 } from "./supplemental_revision_provenance_receipt_v0_3.mjs";

export const SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_VERSION_V0_4 = "0.4-RESEARCH";

export function buildSupplementalRevisionProvenanceReceiptV0_4(args = {}) {
  const prior=buildSupplementalRevisionProvenanceReceiptV0_3(args);
  return deepFreeze({
    ...prior,
    schemaVersion:"S2_SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_V0_4",
    version:SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_VERSION_V0_4,
    priorReceiptVersion:prior.version,
    evidenceStateVersion:"REPRESENTATIVE_AUTHORITY_5_OF_6",
  });
}
