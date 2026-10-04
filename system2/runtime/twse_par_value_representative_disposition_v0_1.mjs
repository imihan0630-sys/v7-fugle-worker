import { deepFreeze } from "./factor_snapshot.mjs";

export const TWSE_PAR_VALUE_REPRESENTATIVE_DISPOSITION_VERSION_V0_1 = "0.1-RESEARCH";

export const TWSE_PAR_VALUE_REQUIRED_EVIDENCE_V0_1 = deepFreeze([
  {
    id:"FINAL_RESULT_DERIVED_2020_2026",
    expectedResult:"NEGATIVE_NO_REVISION_CHAIN",
    sourceFamily:"TWSE_FINAL_RESULT_PLUS_MOPS_T05ST01",
  },
  {
    id:"FINAL_RESULT_ENDPOINT_2010_2019",
    expectedResult:"ZERO_OFFICIAL_PAR_VALUE_EVENTS",
    sourceFamily:"TWSE_FINAL_RESULT_PLUS_MOPS_T05ST01",
  },
  {
    id:"STARRED_PRE2020_ISSUER_SCAN",
    expectedResult:"NEGATIVE_NO_REVISION_CHAIN",
    sourceFamily:"MOPS_T05ST01_STARRED_UNIVERSE",
  },
  {
    id:"MOPS_U04_2025_FROZEN",
    expectedResult:"NEGATIVE_NO_QUALIFYING_ROWS",
    sourceFamily:"MOPS_U04_COMPANY_LAW",
  },
  {
    id:"TWTB7U_HISTORICAL_DATE",
    expectedResult:"HISTORICAL_DATE_NOT_OBSERVED",
    sourceFamily:"TWSE_TWTB7U",
  },
  {
    id:"TWSE_OFFICIAL_DOCUMENT_2025",
    expectedResult:"BOUNDED_NEGATIVE_NO_REVISION_ROWS",
    sourceFamily:"TWSE_OFFICIAL_DOCUMENT_ARCHIVE",
  },
]);

function requiredText(value,field){
  if(typeof value!=="string"||!value.trim()) throw new Error(field+" is required");
  return value.trim();
}

export function buildTwseParValueRepresentativeDispositionV0_1({
  evidence = [],
  generatedAt = new Date().toISOString(),
} = {}) {
  if(!Array.isArray(evidence)) throw new Error("evidence must be an array");
  if(!Number.isFinite(Date.parse(generatedAt))) throw new Error("generatedAt must be ISO timestamp");

  const byId=new Map();
  for(const row of evidence){
    if(!row||typeof row!=="object") throw new Error("evidence row must be object");
    const id=requiredText(row.id,"evidence.id");
    if(byId.has(id)) throw new Error("duplicate evidence id "+id);
    byId.set(id,row);
  }

  const evidenceResults=TWSE_PAR_VALUE_REQUIRED_EVIDENCE_V0_1.map((required)=>{
    const row=byId.get(required.id);
    const pass=
      row?.physicallyObserved===true &&
      String(row?.result||"")===required.expectedResult &&
      typeof row?.evidenceRef==="string" &&
      row.evidenceRef.trim().length>0;
    return deepFreeze({
      id:required.id,
      sourceFamily:required.sourceFamily,
      expectedResult:required.expectedResult,
      observedResult:row?.result??null,
      physicallyObserved:row?.physicallyObserved===true,
      evidenceRef:row?.evidenceRef??null,
      pass,
    });
  });

  const allRequiredEvidencePass=evidenceResults.every(x=>x.pass);
  const sourceFamilies=[...new Set(evidenceResults.map(x=>x.sourceFamily))].sort();

  return deepFreeze({
    schemaVersion:"S2_TWSE_PAR_VALUE_REPRESENTATIVE_DISPOSITION_V0_1",
    version:TWSE_PAR_VALUE_REPRESENTATIVE_DISPOSITION_VERSION_V0_1,
    generatedAt:new Date(generatedAt).toISOString(),
    state:allRequiredEvidencePass
      ?"HISTORICAL_REPRESENTATIVE_REVISION_CONTROL_NOT_ESTABLISHED_WITHIN_EXHAUSTED_OFFICIAL_PATHS"
      :"REPRESENTATIVE_DISPOSITION_EVIDENCE_INCOMPLETE",
    requiredEvidenceCount:TWSE_PAR_VALUE_REQUIRED_EVIDENCE_V0_1.length,
    passedEvidenceCount:evidenceResults.filter(x=>x.pass).length,
    evidenceResults:Object.freeze(evidenceResults),
    exhaustedEvidenceRouteCount:evidenceResults.filter(x=>x.pass).length,
    materiallyDistinctSourceFamilyCount:sourceFamilies.length,
    sourceFamilies:Object.freeze(sourceFamilies),

    researchDispositionComplete:allRequiredEvidencePass,
    representativeControlEstablished:false,
    representativeAuthorityReadyCount:5,
    representativeRoutingCoverageComplete:false,
    remainingRepresentativeGap:"TWSE_PAR_VALUE_CHANGE_REFERENCE",
    remainingGapDisposition:allRequiredEvidencePass
      ?"HISTORICAL_CONTROL_NOT_ESTABLISHED_WITHIN_EXHAUSTED_OFFICIAL_PATHS"
      :"EVIDENCE_INCOMPLETE",
    blindRepeatAuthorized:false,
    reopenOnNewOfficialEvidence:true,
    absoluteHistoricalNonExistenceClaimed:false,
    structuralHistoricalUnavailabilityProven:false,
    boundedNegativeEvidenceOnly:true,
    nextAuthorizedResearch:Object.freeze([
      "BOUNDED_REVISION_COMPLETENESS",
      "SHARED_SUSPENSION_SESSION_INTEGRATION",
    ]),

    publicAvailabilityLatencyCertified:false,
    knownAtVersionClockCertified:false,
    authorityRevisionCoverageComplete:false,
    revisionCoverageComplete:false,
    noEventMayBeClaimed:false,
    suspensionCoverageComplete:false,
    symbolSessionCompletenessCertified:false,
    technicalContinuityCertified:false,
    historyMutationPerformed:false,
    strategyEvaluationPerformed:false,
    capacityRunProduced:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
