import assert from "node:assert/strict";
import {buildTargetResistanceProvenanceReceipt} from "../research/target_resistance_provenance_receipt_v0_1.mjs";

function historyFromHighs(highs){
  return highs.map((high,i)=>({date:"2026-08-"+String(i+1).padStart(2,"0"),high,low:high-1,close:high-0.5}));
}

{
  const r=buildTargetResistanceProvenanceReceipt({
    feature:{symbol:"X",priorHigh20:100,priorHigh60:101,history:historyFromHighs([98,99,100,101,100,99,100])},
    entry:100,stop:95,channel:"B"
  });
  assert.equal(r.state,"TARGET_NULL");
  assert.equal(r.rewardRisk,null);
  assert.equal(r.formalRejectReason,"上方無可驗證實質壓力，無法計算真實RR");
}

{
  const r=buildTargetResistanceProvenanceReceipt({
    feature:{symbol:"X",targetPrice:115,priorHigh20:100,priorHigh60:101,history:historyFromHighs([98,99,100,101,100,99,100])},
    entry:100,stop:95,channel:"B"
  });
  assert.equal(r.selectedTarget,115);
  assert.equal(r.rewardRisk,3);
  assert.equal(r.state,"RR_PASS");
  assert.equal(r.targetPriceProvenanceState,"PIT_PROVENANCE_UNKNOWN");
  assert.equal(r.formalSelectedTargetUsesUnprovenExternalSource,true);
}

{
  const r=buildTargetResistanceProvenanceReceipt({
    feature:{symbol:"X",targetPrice:115,priorHigh60:120,history:historyFromHighs([99,100,101,100,99,98])},
    entry:100,stop:95,
    targetPriceMeta:{source:"VERIFIED_PROVIDER",asOf:"2026-09-27",capturedAt:"2026-09-27T14:00:00+08:00",pointInTimeEligible:true}
  });
  assert.equal(r.selectedTarget,115);
  assert.equal(r.targetPriceProvenanceState,"PIT_PROVENANCE_COMPLETE");
  assert.equal(r.formalSelectedTargetUsesUnprovenExternalSource,false);
}

{
  const r=buildTargetResistanceProvenanceReceipt({
    feature:{targetPrice:105,priorHigh60:120,history:historyFromHighs([98,99,100,101,100,99])},
    entry:100,stop:95
  });
  assert.equal(r.selectedTarget,105);
  assert.equal(r.rewardRisk,1);
  assert.equal(r.state,"LOW_RR");
}

{
  const r=buildTargetResistanceProvenanceReceipt({
    feature:{priorHigh60:120,history:historyFromHighs([99,100,102,100,99,98])},
    entry:100,stop:95
  });
  assert.equal(r.selectedTarget,102);
  assert.equal(r.selectedTargetSource,"HISTORICAL_5BAR_PIVOT");
  assert.equal(r.rewardRisk,0.4);
  assert.equal(r.state,"LOW_RR");
}

{
  const r=buildTargetResistanceProvenanceReceipt({
    feature:{priorHigh60:120,history:historyFromHighs([99,100,100.8,100,99,98])},
    entry:100,stop:95
  });
  const pivot=r.candidates.find(x=>x.source==="HISTORICAL_5BAR_PIVOT");
  assert.equal(pivot.value,100.8);
  assert.equal(pivot.formalEligible,false);
  assert.equal(pivot.exclusionReason,"NOT_ABOVE_ENTRY_1PCT");
  assert.equal(r.selectedTarget,120);
  assert.equal(r.rewardRisk,4);
}

{
  const r=buildTargetResistanceProvenanceReceipt({
    feature:{targetPrice:120,priorHigh60:120,history:historyFromHighs([98,99,100,99,98,97])},
    entry:100,stop:95
  });
  assert.equal(r.selectedTarget,120);
  assert.equal(r.selectedTargetSource,"MULTIPLE_EQUAL_LEVELS");
  assert.equal(r.selectedSourceCount,2);
}

{
  const r=buildTargetResistanceProvenanceReceipt({
    feature:{priorHigh20:100,priorHigh60:100.9,history:historyFromHighs([99,100,100.8,100.4,99,98])},
    entry:100,stop:95,channel:"B"
  });
  assert.equal(r.state,"TARGET_NULL");
  assert.equal(r.eligibleResistanceLevels.length,0);
}

{
  const r=buildTargetResistanceProvenanceReceipt({
    feature:{priorHigh60:120,history:historyFromHighs([98,99,100,99,98,97])},
    entry:100,stop:100
  });
  assert.equal(r.state,"RR_NOT_EVALUABLE_INVALID_RISK");
  assert.equal(r.rewardRisk,null);
}

console.log(JSON.stringify({
  ok:true,
  mirrorsFormalPriceSelection:true,
  targetNullSeparatedFromLowRr:true,
  onePercentBandVisible:true,
  pivotSourceAndDateCaptured:true,
  externalTargetPITQualitySeparateFromFormalUse:true,
  zeroMarketCallsByConstruction:true,
  formalCoreImpact:false
}));
