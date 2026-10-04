import { deepFreeze } from "./factor_snapshot.mjs";
import { buildSupplementalRevisionProvenanceReceiptV0_1 } from "./supplemental_revision_provenance_receipt_v0_1.mjs";

export const SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_VERSION_V0_2 = "0.2-RESEARCH";

export function buildSupplementalRevisionProvenanceReceiptV0_2(args = {}) {
  const prior=buildSupplementalRevisionProvenanceReceiptV0_1(args);
  return deepFreeze({
    ...prior,
    schemaVersion:"S2_SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_V0_2",
    version:SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_VERSION_V0_2,
    priorReceiptVersion:prior.version,
    evidenceStateVersion:"REPRESENTATIVE_AUTHORITY_3_OF_6",
  });
}
