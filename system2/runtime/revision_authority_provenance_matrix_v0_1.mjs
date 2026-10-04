import { deepFreeze } from "./factor_snapshot.mjs";

export const REVISION_AUTHORITY_PROVENANCE_MATRIX_VERSION = "0.1-RESEARCH";

export const REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_1 = deepFreeze([
  {
    controlId: "DIVIDEND_CORRECTION_2467_2026_05",
    symbol: "2467",
    stage: "DIVIDEND_EX_DATE",
    requiredRoles: [
      { role: "ISSUER", evidenceType: "MOPS_REVISION_CHAIN" },
      {
        role: "EXCHANGE",
        evidenceType: "TWSE_OPERATIONAL_FINAL",
        sourceId: "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
      },
    ],
  },
  {
    controlId: "CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",
    symbol: "1459",
    stage: "CAPITAL_REDUCTION_SCHEDULE",
    requiredRoles: [
      { role: "ISSUER", evidenceType: "MOPS_REVISION_CHAIN" },
      {
        role: "EXCHANGE",
        evidenceType: "TWSE_OPERATIONAL_FINAL",
        sourceId: "TWSE_CAPITAL_REDUCTION_REFERENCE",
      },
    ],
  },
  {
    controlId: "CAPITAL_REDUCTION_DECISION_CORRECTION_2321_2026_03",
    symbol: "2321",
    stage: "CAPITAL_REDUCTION_DECISION",
    requiredRoles: [
      { role: "ISSUER", evidenceType: "MOPS_REVISION_CHAIN" },
    ],
  },
  {
    controlId: "CASH_CAPITAL_INCREASE_CORRECTION_1342_2026_06",
    symbol: "1342",
    stage: "CASH_CAPITAL_INCREASE_SCHEDULE",
    requiredRoles: [
      { role: "ISSUER", evidenceType: "MOPS_REVISION_CHAIN" },
    ],
  },
  {
    controlId: "CASH_CAPITAL_INCREASE_CANCELLATION_1342_2026_07",
    symbol: "1342",
    stage: "CASH_CAPITAL_INCREASE_CANCELLATION",
    requiredRoles: [
      { role: "ISSUER", evidenceType: "MOPS_CANCELLATION_CHAIN" },
      { role: "REGULATOR", evidenceType: "SFB_FSC_REVOCATION_RECORD" },
    ],
  },
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

export function buildRevisionAuthorityProvenanceMatrixV0_1({
  mopsMatrix,
  exchangeEvidence = [],
  regulatorEvidence = [],
} = {}) {
  if(!mopsMatrix || typeof mopsMatrix!=="object") throw new Error("mopsMatrix is required");
  const mops=controlMap(mopsMatrix);
  const exchange=exchangeMap(exchangeEvidence);
  const regulator=regulatorMap(regulatorEvidence);

  const controls=REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_1.map((contract)=>{
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
        const direct=rows.filter((x)=>
          x?.directEvidence===true &&
          text(x.symbol)===contract.symbol &&
          text(x.sourceId)===required.sourceId
        );
        pass=direct.length>0;
        evidence={
          source:required.sourceId,
          directEvidence:pass,
          matchingEvidenceCount:direct.length,
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
    controls.length===REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_1.length &&
    passCount===controls.length;

  return deepFreeze({
    schemaVersion:"S2_REVISION_AUTHORITY_PROVENANCE_MATRIX_V0_1",
    version:REVISION_AUTHORITY_PROVENANCE_MATRIX_VERSION,
    state:frozenAuthorityRoutingCoverageComplete
      ? "FROZEN_AUTHORITY_CONTROL_MATRIX_OBSERVED"
      : "FROZEN_AUTHORITY_CONTROL_MATRIX_PARTIAL",
    frozenControlCount:controls.length,
    frozenControlPassCount:passCount,
    controls:Object.freeze(controls),
    frozenAuthorityRoutingCoverageComplete,

    // A representative frozen control matrix is not bounded-market completeness.
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
