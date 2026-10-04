import { deepFreeze } from "./factor_snapshot.mjs";
import { buildSupplementalRevisionProvenanceReceiptV0_4 } from "./supplemental_revision_provenance_receipt_v0_4.mjs";

export const SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_VERSION_V0_5 = "0.5-RESEARCH";

export function buildSupplementalRevisionProvenanceReceiptV0_5({
  twseParValueDisposition,
  ...args
} = {}) {
  if(!twseParValueDisposition || typeof twseParValueDisposition!=="object"){
    throw new Error("twseParValueDisposition is required");
  }
  if(twseParValueDisposition.researchDispositionComplete!==true){
    throw new Error("TWSE par-value representative disposition must be complete");
  }
  if(twseParValueDisposition.representativeAuthorityReadyCount!==5){
    throw new Error("TWSE par-value disposition must preserve representativeAuthorityReadyCount=5");
  }
  if(twseParValueDisposition.representativeControlEstablished!==false){
    throw new Error("TWSE par-value disposition must not fabricate representative control");
  }

  const prior=buildSupplementalRevisionProvenanceReceiptV0_4(args);
  if(prior.representativeAuthorityReadyCount!==5){
    throw new Error("prior supplemental receipt must remain representative 5/6");
  }

  return deepFreeze({
    ...prior,
    schemaVersion:"S2_SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_V0_5",
    version:SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_VERSION_V0_5,
    priorReceiptVersion:prior.version,
    evidenceStateVersion:"REPRESENTATIVE_AUTHORITY_5_OF_6_WITH_TWSE_PAR_VALUE_DISPOSITION",
    representativeRoutingResearchDispositionComplete:true,
    representativeRoutingReadyCount:5,
    representativeRoutingDispositionedGapCount:1,
    remainingRepresentativeGap:twseParValueDisposition.remainingRepresentativeGap,
    remainingRepresentativeGapDisposition:twseParValueDisposition.remainingGapDisposition,
    representativeRoutingCoverageComplete:false,
    blindRepresentativeSearchRepeatAuthorized:false,
    reopenRepresentativeSearchOnNewOfficialEvidence:true,

    revisionCoverageComplete:false,
    noEventMayBeClaimed:false,
    technicalContinuityCertified:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
