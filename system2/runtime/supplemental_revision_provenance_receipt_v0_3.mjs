import { deepFreeze } from "./factor_snapshot.mjs";
import { buildSupplementalRevisionProvenanceReceiptV0_2 } from "./supplemental_revision_provenance_receipt_v0_2.mjs";

export const SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_VERSION_V0_3 = "0.3-RESEARCH";

export function buildSupplementalRevisionProvenanceReceiptV0_3(args = {}) {
  const prior=buildSupplementalRevisionProvenanceReceiptV0_2(args);
  return deepFreeze({
    ...prior,
    schemaVersion:"S2_SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_V0_3",
    version:SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_VERSION_V0_3,
    priorReceiptVersion:prior.version,
    evidenceStateVersion:"REPRESENTATIVE_AUTHORITY_4_OF_6",
  });
}
