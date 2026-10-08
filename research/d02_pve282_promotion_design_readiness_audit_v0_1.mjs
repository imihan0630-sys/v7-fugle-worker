import fs from "node:fs";

export const PVE282_SCHEMA="D02_PVE282_PROMOTION_DESIGN_READINESS_AUDIT_V0_1";
const WAVE1=new Set(["D02-02:H001","D02-03:H20","D02-06:H003"]);

export function classifyPve282({registry,d14={},d16={}}={}){
  const entries=registry?.entries||{};
  const targetReadiness={};
  for(const [key,e] of Object.entries(entries)){
    const metricFrozen=typeof e.metric==="string"&&e.metric.length>0;
    const horizonFrozen=typeof e.outcomeHorizon==="string"&&e.outcomeHorizon.length>0&&!/not yet|not singularly|no single/i.test(e.outcomeHorizon);
    const numericalFrozen=e.targetStatus==="FROZEN"&&
      (Number.isFinite(Number(e.thresholdValue))||Number.isFinite(Number(e.maxHalfWidth)))&&
      typeof e.targetHash==="string"&&e.targetHash.length>0;

    let state,reasons=[];
    if(numericalFrozen){
      state="READY";
    }else if(metricFrozen&&horizonFrozen){
      state="PARTIAL_NUMERIC_JUSTIFICATION_MISSING";
      reasons.push("NUMERICAL_TARGET_NOT_FROZEN");
      if(key!=="D02-01:SEMANTIC_GOVERNANCE"&&e.costTreatment==="ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION"&&d14.universalEconomicCostAnchorReady!==true)
        reasons.push("UNIVERSAL_D14_ECONOMIC_COST_ANCHOR_NOT_READY");
      if(key==="D02-01:SEMANTIC_GOVERNANCE")reasons.push("SEMANTIC_MATERIALITY_TOLERANCE_NOT_FROZEN");
    }else{
      state="BLOCKED_PRIMARY_METRIC_OR_HORIZON_NOT_FROZEN";
      if(!metricFrozen)reasons.push("PRIMARY_METRIC_NOT_FROZEN");
      if(!horizonFrozen)reasons.push("PRIMARY_HORIZON_NOT_FROZEN");
      if(key==="D02-11:LIQUIDITY_COUNTERFACTUAL"&&d14.d02_11CostQualityAnchorReady!==true)
        reasons.push("D14_D02_11_COST_QUALITY_ANCHOR_NOT_READY");
    }

    targetReadiness[key]=Object.freeze({
      state,metricFrozen,horizonFrozen,numericalFrozen,
      targetStatus:e.targetStatus??null,
      reasons:Object.freeze(reasons)
    });
  }

  const methodReadiness={};
  for(const key of WAVE1){
    const e=entries[key]||{};
    const receiptId=e.actualMethodReceiptId??null;
    const receiptVersion=e.actualMethodVersion??null;
    const receiptHash=e.actualMethodHash??null;
    const exactReceiptFrozen=Boolean(receiptId&&receiptVersion&&receiptHash);
    methodReadiness[key]=Object.freeze({
      state:exactReceiptFrozen?"READY":"BLOCKED_D16_MODEL_METHOD_RECEIPT_MISSING",
      exactReceiptFrozen,
      actualMethodReceiptId:receiptId,
      unrelatedSda022MethodReusable:false,
      reasons:Object.freeze(exactReceiptFrozen?[]:["D02_SPECIFIC_MODEL_METHOD_RECEIPT_NOT_FROZEN"])
    });
  }

  const targetStates=Object.values(targetReadiness).reduce((a,x)=>(a[x.state]=(a[x.state]||0)+1,a),{});
  const methodStates=Object.values(methodReadiness).reduce((a,x)=>(a[x.state]=(a[x.state]||0)+1,a),{});
  const allPromotionDesignReady=
    Object.values(targetReadiness).every(x=>x.state==="READY")&&
    Object.values(methodReadiness).every(x=>x.state==="READY");

  return Object.freeze({
    schemaVersion:PVE282_SCHEMA,
    targetReadiness:Object.freeze(targetReadiness),
    methodReadiness:Object.freeze(methodReadiness),
    counts:Object.freeze({targetStates:Object.freeze(targetStates),methodStates:Object.freeze(methodStates)}),
    d14Snapshot:Object.freeze({
      statutoryTaxSemanticsKnown:d14.statutoryTaxSemanticsKnown===true,
      ownerCommissionKnown:d14.ownerCommissionKnown===true,
      brokerConfirmedSlippageAvailable:d14.brokerConfirmedSlippageAvailable===true,
      universalEconomicCostAnchorReady:d14.universalEconomicCostAnchorReady===true,
      d02_11CostQualityAnchorReady:d14.d02_11CostQualityAnchorReady===true
    }),
    d16Snapshot:Object.freeze({
      unrelatedSda022MethodFreezeExists:d16.unrelatedSda022MethodFreezeExists===true,
      unrelatedSda022MethodReusable:false
    }),
    allPromotionDesignReady,
    outcomeAccessAuthorized:false,
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false
  });
}

if(import.meta.url===`file://${process.argv[1]}`){
  const registry=JSON.parse(fs.readFileSync(new URL("./d02_l4_effect_target_registry_v0_4.json",import.meta.url),"utf8"));
  const result=classifyPve282({
    registry,
    d14:{
      statutoryTaxSemanticsKnown:true,
      ownerCommissionKnown:false,
      brokerConfirmedSlippageAvailable:false,
      universalEconomicCostAnchorReady:false,
      d02_11CostQualityAnchorReady:false
    },
    d16:{unrelatedSda022MethodFreezeExists:true}
  });
  console.log(JSON.stringify(result,null,2));
}
