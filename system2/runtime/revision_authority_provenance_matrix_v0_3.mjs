import { deepFreeze } from "./factor_snapshot.mjs";
import {
  buildRevisionAuthorityProvenanceMatrixV0_2,
  REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_2,
} from "./revision_authority_provenance_matrix_v0_2.mjs";

export const REVISION_AUTHORITY_PROVENANCE_MATRIX_VERSION_V0_3 = "0.3-RESEARCH";

export const TPEX_6548_AUTHORITY_CONTRACT_V0_3 = deepFreeze({
  controlId: "TPEX_PAR_VALUE_CHANGE_CORRECTION_6548_2022",
  symbol: "6548",
  stage: "PAR_VALUE_CHANGE_EFFECTIVE_PLAN",
  requiredRoles: Object.freeze([
    { role: "ISSUER", evidenceType: "MOPS_REVISION_CHAIN" },
    {
      role: "EXCHANGE",
      evidenceType: "TPEX_OPERATIONAL_FINAL",
      sourceId: "TPEX_PAR_VALUE_CHANGE_REFERENCE",
      expectedEffectiveDate: "2022-09-05",
    },
  ]),
});

export const REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_3 = deepFreeze([
  ...REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_2,
  TPEX_6548_AUTHORITY_CONTRACT_V0_3,
]);

function text(value){ return value == null ? "" : String(value).trim(); }

export function buildRevisionAuthorityProvenanceMatrixV0_3({
  mopsMatrix,
  exchangeEvidence = [],
  regulatorEvidence = [],
} = {}) {
  if(!mopsMatrix || typeof mopsMatrix!=="object") throw new Error("mopsMatrix is required");

  const prior = buildRevisionAuthorityProvenanceMatrixV0_2({
    mopsMatrix,exchangeEvidence,regulatorEvidence,
  });

  const mopsRow=(Array.isArray(mopsMatrix.controls)?mopsMatrix.controls:[])
    .find((x)=>text(x.controlId)===TPEX_6548_AUTHORITY_CONTRACT_V0_3.controlId);

  const exchangeRows=(Array.isArray(exchangeEvidence)?exchangeEvidence:[]).filter((x)=>
    x?.directEvidence===true &&
    text(x.controlId)===TPEX_6548_AUTHORITY_CONTRACT_V0_3.controlId &&
    text(x.sourceId)==="TPEX_PAR_VALUE_CHANGE_REFERENCE" &&
    text(x.symbol)==="6548" &&
    text(x.effectiveDate)==="2022-09-05"
  );

  const issuerRole=deepFreeze({
    authorityRole:"ISSUER",
    evidenceType:"MOPS_REVISION_CHAIN",
    requiredSourceId:null,
    pass:mopsRow?.pass===true,
    evidence:deepFreeze({
      source:"MOPS/MOPSOV",
      state:mopsRow?.state||"MISSING_MOPS_CONTROL",
      directEvidence:mopsRow?.pass===true,
    }),
  });
  const exchangeRole=deepFreeze({
    authorityRole:"EXCHANGE",
    evidenceType:"TPEX_OPERATIONAL_FINAL",
    requiredSourceId:"TPEX_PAR_VALUE_CHANGE_REFERENCE",
    pass:exchangeRows.length>0,
    evidence:deepFreeze({
      source:"TPEX_PAR_VALUE_CHANGE_REFERENCE",
      directEvidence:exchangeRows.length>0,
      matchingEvidenceCount:exchangeRows.length,
      requiredEffectiveDate:"2022-09-05",
      effectiveDates:Object.freeze(exchangeRows.map((x)=>text(x.effectiveDate)).sort()),
    }),
  });

  const newControl=deepFreeze({
    controlId:TPEX_6548_AUTHORITY_CONTRACT_V0_3.controlId,
    symbol:"6548",
    stage:TPEX_6548_AUTHORITY_CONTRACT_V0_3.stage,
    requiredAuthorityRoleCount:2,
    pass:issuerRole.pass && exchangeRole.pass,
    roles:Object.freeze([issuerRole,exchangeRole]),
  });

  const controls=Object.freeze([...prior.controls,newControl]);
  const allPass=controls.every((x)=>x.pass===true);
  const representativeLaneSourceIds=new Set();
  for(const control of controls.filter((x)=>x.pass)){
    for(const role of control.roles){
      if(role.authorityRole==="EXCHANGE" && role.requiredSourceId){
        representativeLaneSourceIds.add(role.requiredSourceId);
      }
    }
  }

  return deepFreeze({
    schemaVersion:"S2_REVISION_AUTHORITY_PROVENANCE_MATRIX_V0_3",
    version:REVISION_AUTHORITY_PROVENANCE_MATRIX_VERSION_V0_3,
    priorVersion:prior.version,
    state:allPass
      ? "EXPANDED_FROZEN_AUTHORITY_CONTROL_MATRIX_OBSERVED_V0_3"
      : "EXPANDED_FROZEN_AUTHORITY_CONTROL_MATRIX_PARTIAL",
    frozenControlCount:controls.length,
    frozenControlPassCount:controls.filter((x)=>x.pass).length,
    controls,
    frozenAuthorityRoutingCoverageComplete:allPass,
    representativeExchangeLaneCount:representativeLaneSourceIds.size,
    representativeExchangeLaneSourceIds:Object.freeze([...representativeLaneSourceIds].sort()),

    authorityRevisionCoverageComplete:false,
    publicAvailabilityLatencyCertified:false,
    knownAtVersionClockCertified:false,
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
