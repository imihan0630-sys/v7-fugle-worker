import { deepFreeze } from "./factor_snapshot.mjs";
import {
  buildRevisionAuthorityProvenanceMatrixV0_3,
  REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_3,
} from "./revision_authority_provenance_matrix_v0_3.mjs";

export const REVISION_AUTHORITY_PROVENANCE_MATRIX_VERSION_V0_4 = "0.4-RESEARCH";

export const TPEX_5356_AUTHORITY_CONTRACT_V0_4 = deepFreeze({
  controlId: "TPEX_EX_RIGHT_DIVIDEND_CORRECTION_5356_2026",
  symbol: "5356",
  stage: "EX_RIGHT_DIVIDEND_EFFECTIVE_PLAN",
  requiredRoles: Object.freeze([
    { role: "ISSUER", evidenceType: "MOPS_REVISION_CHAIN" },
    {
      role: "EXCHANGE",
      evidenceType: "TPEX_OPERATIONAL_FINAL",
      sourceId: "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
      expectedEffectiveDate: "2026-07-08",
    },
  ]),
});

export const REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_4 = deepFreeze([
  ...REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_3,
  TPEX_5356_AUTHORITY_CONTRACT_V0_4,
]);

function text(value){ return value == null ? "" : String(value).trim(); }

export function buildRevisionAuthorityProvenanceMatrixV0_4({
  mopsMatrix,
  exchangeEvidence = [],
  regulatorEvidence = [],
} = {}) {
  if(!mopsMatrix || typeof mopsMatrix!=="object") throw new Error("mopsMatrix is required");

  const prior = buildRevisionAuthorityProvenanceMatrixV0_3({
    mopsMatrix,exchangeEvidence,regulatorEvidence,
  });

  const mopsRow=(Array.isArray(mopsMatrix.controls)?mopsMatrix.controls:[])
    .find((x)=>text(x.controlId)===TPEX_5356_AUTHORITY_CONTRACT_V0_4.controlId);

  const exchangeRows=(Array.isArray(exchangeEvidence)?exchangeEvidence:[]).filter((x)=>
    x?.directEvidence===true &&
    text(x.controlId)===TPEX_5356_AUTHORITY_CONTRACT_V0_4.controlId &&
    text(x.sourceId)==="TPEX_EX_RIGHT_DIVIDEND_ACTUAL" &&
    text(x.symbol)==="5356" &&
    text(x.effectiveDate)==="2026-07-08"
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
    requiredSourceId:"TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
    pass:exchangeRows.length>0,
    evidence:deepFreeze({
      source:"TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
      directEvidence:exchangeRows.length>0,
      matchingEvidenceCount:exchangeRows.length,
      requiredEffectiveDate:"2026-07-08",
      effectiveDates:Object.freeze(exchangeRows.map((x)=>text(x.effectiveDate)).sort()),
    }),
  });

  const newControl=deepFreeze({
    controlId:TPEX_5356_AUTHORITY_CONTRACT_V0_4.controlId,
    symbol:"5356",
    stage:TPEX_5356_AUTHORITY_CONTRACT_V0_4.stage,
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
    schemaVersion:"S2_REVISION_AUTHORITY_PROVENANCE_MATRIX_V0_4",
    version:REVISION_AUTHORITY_PROVENANCE_MATRIX_VERSION_V0_4,
    priorVersion:prior.version,
    state:allPass
      ? "EXPANDED_FROZEN_AUTHORITY_CONTROL_MATRIX_OBSERVED_V0_4"
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
