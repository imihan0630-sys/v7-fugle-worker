import { deepFreeze } from "./factor_snapshot.mjs";
import { REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_1 } from "./revision_authority_provenance_matrix_v0_1.mjs";

export const REVISION_AUTHORITY_PROVENANCE_MATRIX_VERSION_V0_2 = "0.2-RESEARCH";

const TPEX_3152_CONTRACT = deepFreeze({
  controlId: "TPEX_CAPITAL_REDUCTION_DECISION_CORRECTION_3152_2026",
  symbol: "3152",
  stage: "CAPITAL_REDUCTION_DECISION",
  requiredRoles: Object.freeze([
    { role: "ISSUER", evidenceType: "MOPS_REVISION_CHAIN" },
    {
      role: "EXCHANGE",
      evidenceType: "TPEX_OPERATIONAL_FINAL",
      sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
      expectedEffectiveDate: "2026-06-30",
    },
  ]),
});

export const REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_2 = deepFreeze([
  ...REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_1,
  TPEX_3152_CONTRACT,
]);

function text(value){ return value == null ? "" : String(value).trim(); }

function controlMap(mopsMatrix){
  const rows=Array.isArray(mopsMatrix?.controls) ? mopsMatrix.controls : [];
  return new Map(rows.map((x)=>[text(x.controlId),x]));
}

function exchangeMap(exchangeEvidence){
  const map=new Map();
  for(const row of Array.isArray(exchangeEvidence)?exchangeEvidence:[]){
    const key=[text(row.controlId),text(row.sourceId)].join("|");
    if(!map.has(key)) map.set(key,[]);
    map.get(key).push(row);
  }
  return map;
}

function regulatorMap(regulatorEvidence){
  const map=new Map();
  for(const row of Array.isArray(regulatorEvidence)?regulatorEvidence:[]){
    const id=text(row.controlId);
    if(!map.has(id)) map.set(id,[]);
    map.get(id).push(row);
  }
  return map;
}

export function buildRevisionAuthorityProvenanceMatrixV0_2({
  mopsMatrix,
  exchangeEvidence = [],
  regulatorEvidence = [],
} = {}) {
  if(!mopsMatrix || typeof mopsMatrix!=="object") throw new Error("mopsMatrix is required");
  const mops=controlMap(mopsMatrix);
  const exchange=exchangeMap(exchangeEvidence);
  const regulator=regulatorMap(regulatorEvidence);

  const controls=REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_2.map((contract)=>{
    const mopsRow=mops.get(contract.controlId);
    const roles=contract.requiredRoles.map((required)=>{
      let pass=false;
      let evidence={};

      if(required.role==="ISSUER"){
        pass=mopsRow?.pass===true;
        evidence={
          source:"MOPS/MOPSOV",
          state:mopsRow?.state||"MISSING_MOPS_CONTROL",
          directEvidence:pass,
        };
      }else if(required.role==="EXCHANGE"){
        const rows=exchange.get([contract.controlId,required.sourceId].join("|"))||[];
        const direct=rows.filter((x)=>{
          if(
            x?.directEvidence!==true ||
            text(x.symbol)!==contract.symbol ||
            text(x.sourceId)!==required.sourceId
          ) return false;
          if(required.expectedEffectiveDate){
            return text(x.effectiveDate)===required.expectedEffectiveDate;
          }
          return true;
        });
        pass=direct.length>0;
        evidence={
          source:required.sourceId,
          directEvidence:pass,
          matchingEvidenceCount:direct.length,
          requiredEffectiveDate:required.expectedEffectiveDate||null,
          effectiveDates:Object.freeze(direct.map((x)=>text(x.effectiveDate)).filter(Boolean).sort()),
        };
      }else if(required.role==="REGULATOR"){
        const rows=regulator.get(contract.controlId)||[];
        const direct=rows.filter((x)=>
          x?.directEvidence===true &&
          text(x.symbol)===contract.symbol &&
          /廢止|撤銷|取消/.test(text(x.statusText))
        );
        pass=direct.length>0;
        evidence={
          source:"SFB/FSC",
          directEvidence:pass,
          matchingEvidenceCount:direct.length,
          statuses:Object.freeze(direct.map((x)=>text(x.statusText)).filter(Boolean).sort()),
        };
      }

      return deepFreeze({
        authorityRole:required.role,
        evidenceType:required.evidenceType,
        requiredSourceId:required.sourceId||null,
        pass,
        evidence:deepFreeze(evidence),
      });
    });

    const pass=roles.every((x)=>x.pass===true);
    return deepFreeze({
      controlId:contract.controlId,
      symbol:contract.symbol,
      stage:contract.stage,
      requiredAuthorityRoleCount:roles.length,
      pass,
      roles:Object.freeze(roles),
    });
  });

  const passCount=controls.filter((x)=>x.pass).length;
  const frozenAuthorityRoutingCoverageComplete=
    controls.length===REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_2.length &&
    passCount===controls.length;

  const representativeLaneSourceIds=new Set();
  for(const control of controls.filter((x)=>x.pass)){
    for(const role of control.roles){
      if(role.authorityRole==="EXCHANGE" && role.requiredSourceId){
        representativeLaneSourceIds.add(role.requiredSourceId);
      }
    }
  }

  return deepFreeze({
    schemaVersion:"S2_REVISION_AUTHORITY_PROVENANCE_MATRIX_V0_2",
    version:REVISION_AUTHORITY_PROVENANCE_MATRIX_VERSION_V0_2,
    state:frozenAuthorityRoutingCoverageComplete
      ? "EXPANDED_FROZEN_AUTHORITY_CONTROL_MATRIX_OBSERVED"
      : "EXPANDED_FROZEN_AUTHORITY_CONTROL_MATRIX_PARTIAL",
    frozenControlCount:controls.length,
    frozenControlPassCount:passCount,
    controls:Object.freeze(controls),
    frozenAuthorityRoutingCoverageComplete,
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
