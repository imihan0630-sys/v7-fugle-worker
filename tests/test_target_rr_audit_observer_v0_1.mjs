import assert from "node:assert/strict";
import {buildTargetRrAudit,TARGET_RR_AUDIT_REASONS as R} from "../research/target_rr_audit_observer_v0_1.mjs";

function baseB(overrides={}){
  const history=[];
  for(let i=0;i<12;i++) history.push({date:`2026-09-${String(i+1).padStart(2,"0")}`,high:99+i*0.1});
  history.push({date:"2026-09-13",high:101});
  return {
    close:101,atrPercent:2,priorHigh20:100,priorHigh60:101,targetPrice:null,
    history:[...history,{date:"2026-09-24",high:101.5}],
    ...overrides
  };
}

{
  const a=buildTargetRrAudit(baseB(),{channel:"B",formalResult:{ok:false,reason:R.TARGET_NULL_REASON}});
  assert.equal(a.formalStage,"TARGET_NULL_REJECTED");
  assert.equal(a.rr.state,"TARGET_NULL");
  assert.equal(a.resistance.selectedTarget,null);
  assert.equal(a.stageConsistent,true);
}

{
  const a=buildTargetRrAudit(baseB({
    targetPrice:115,targetPriceSource:"EXTERNAL_X",targetPriceAsOf:"2026-09-24",
    targetPriceCapturedAt:"2026-09-24T18:00:00+08:00",targetPricePointInTimeEligible:true
  }),{channel:"B",formalResult:{ok:true}});
  assert.equal(a.rr.state,"RR_PASS");
  assert.equal(a.resistance.selectedTarget,115);
  assert.equal(a.resistance.selectedTargetSources[0].source,"TARGET_PRICE");
  assert.equal(a.targetPrice.provenanceState,"COMPLETE");
  assert.equal(a.stageConsistent,true);
}

{
  const a=buildTargetRrAudit(baseB({priorHigh60:120,targetPrice:103}),{
    channel:"B",formalResult:{ok:false,reason:R.LOW_RR_REASON}
  });
  assert.equal(a.resistance.selectedTarget,103);
  assert.equal(a.rr.state,"LOW_RR");
  assert.equal(a.stageConsistent,true);
}

{
  const f=baseB({priorHigh60:120});
  f.history=[
    {date:"2026-09-01",high:99},{date:"2026-09-02",high:100},{date:"2026-09-03",high:102},
    {date:"2026-09-04",high:101},{date:"2026-09-05",high:100},
    {date:"2026-09-24",high:101.5}
  ];
  const a=buildTargetRrAudit(f,{channel:"B",formalResult:{ok:false,reason:R.LOW_RR_REASON}});
  assert.equal(a.resistance.selectedTarget,102);
  assert.equal(a.resistance.selectedTargetSources[0].source,"LOCAL_5BAR_PIVOT");
  assert.equal(a.rr.state,"LOW_RR");
}

{
  const f=baseB({priorHigh60:120});
  f.history=[
    {date:"2026-09-01",high:99},{date:"2026-09-02",high:100},{date:"2026-09-03",high:101.1},
    {date:"2026-09-04",high:100.5},{date:"2026-09-05",high:100},
    {date:"2026-09-24",high:101.5}
  ];
  const a=buildTargetRrAudit(f,{channel:"B",formalResult:{ok:true}});
  assert.equal(a.resistance.selectedTarget,120);
  const ignored=a.resistance.candidates.find(x=>x.source==="LOCAL_5BAR_PIVOT");
  assert.equal(ignored.eligible,false);
  assert.equal(a.rr.state,"RR_PASS");
}

{
  const f=baseB({
    targetPrice:120,priorHigh60:120,
    targetPriceSource:"EXTERNAL_X",targetPriceAsOf:"2026-09-24",
    targetPriceCapturedAt:"2026-09-24T18:00:00+08:00",targetPricePointInTimeEligible:true
  });
  const a=buildTargetRrAudit(f,{channel:"B",formalResult:{ok:true}});
  assert.equal(a.resistance.selectedTarget,120);
  assert.equal(a.resistance.selectedSourceAmbiguous,true);
  assert.deepEqual(a.resistance.selectedTargetSources.map(x=>x.source).sort(),["PRIOR_HIGH60","TARGET_PRICE"]);
}

{
  const a=buildTargetRrAudit(baseB({targetPrice:115}),{
    channel:"B",formalResult:{ok:false,reason:"基本面品質明顯不足"}
  });
  assert.equal(a.formalStage,"NOT_EVALUABLE_UNDER_FORMAL_ORDER");
  assert.equal(a.rr.state,"RR_PASS");
  assert.equal(a.stageConsistent,true);
}

{
  const a=buildTargetRrAudit(baseB({targetPrice:115}),{
    channel:"B",formalResult:{ok:false,reason:R.FINAL_GRADE_REASON}
  });
  assert.equal(a.formalStage,"FINAL_GRADE_REJECTED_AFTER_RR_PASS");
  assert.equal(a.rr.state,"RR_PASS");
  assert.equal(a.stageConsistent,true);
}

{
  const a=buildTargetRrAudit(baseB({targetPrice:115,targetPriceSource:null}),{channel:"B",formalResult:{ok:true}});
  assert.equal(a.targetPrice.present,true);
  assert.equal(a.targetPrice.provenanceState,"UNKNOWN");
}

{
  const a=buildTargetRrAudit({close:100,atrPercent:2,support:100,recentLow5Prev:97,priorHigh20:110,priorHigh60:115,history:[]},{
    channel:"A",formalResult:{ok:true}
  });
  assert.equal(a.geometry.stopBinding,"STRUCTURE_LOW_MINUS_ATR_0_12");
  assert.equal(a.rr.state,"RR_PASS");
}

console.log(JSON.stringify({
  ok:true,
  observer:"TARGET_RR_AUDIT_OBSERVER_V0_1",
  targetNullSeparated:true,
  lowRrSeparated:true,
  finalGradeSeparated:true,
  ambiguousSourcePreserved:true,
  externalTargetProvenanceUnknownPreserved:true,
  formalDecisionImpact:false
}));


// Independent test-local mirror of current Formal target selection.
// Purpose: prevent the research observer from drifting away from Worker semantics.
function formalNearestTargetMirror(f,entry){
  const levels=[];
  const add=value=>{const n=Number(value);if(Number.isFinite(n)&&n>entry*1.01) levels.push(n);};
  add(f.targetPrice);add(f.priorHigh20);add(f.priorHigh60);
  const hs=Array.isArray(f.history)?f.history.slice(0,-1):[];
  for(let i=2;i<hs.length-2;i+=1){
    const h=Number(hs[i]?.high);
    if(!Number.isFinite(h)||h<=entry*1.01) continue;
    const p1=Number(hs[i-1]?.high),p2=Number(hs[i-2]?.high),n1=Number(hs[i+1]?.high),n2=Number(hs[i+2]?.high);
    if([p1,p2,n1,n2].some(x=>!Number.isFinite(x))) continue;
    if(h>=p1&&h>=p2&&h>=n1&&h>=n2) levels.push(h);
  }
  return levels.length?Math.min(...levels):null;
}

{
  const fixtures=[
    baseB(),
    baseB({targetPrice:115}),
    baseB({priorHigh60:120,targetPrice:103}),
    baseB({priorHigh60:120,targetPrice:null})
  ];
  for(const f of fixtures){
    const a=buildTargetRrAudit(f,{channel:"B",formalResult:{ok:true}});
    assert.equal(
      a.resistance.selectedTarget,
      formalNearestTargetMirror(f,a.geometry.entry),
      "research observer target must equal current Formal target selection"
    );
  }
}

// Strict 1% equality is excluded because Formal uses > entry*1.01, not >=.
{
  const f=baseB({priorHigh20:100,priorHigh60:101.303,targetPrice:null});
  const a=buildTargetRrAudit(f,{channel:"B",formalResult:{ok:false,reason:R.TARGET_NULL_REASON}});
  assert.ok(Math.abs(a.resistance.thresholdPrice-101.303)<1e-9);
  const h60=a.resistance.candidates.find(x=>x.source==="PRIOR_HIGH60");
  assert.equal(h60.eligible,false);
}

// Missing channel geometry remains UNKNOWN and cannot be re-labeled TARGET_NULL.
{
  const a=buildTargetRrAudit(baseB(),{channel:null,formalResult:{ok:false,reason:R.TARGET_NULL_REASON}});
  assert.equal(a.status,"UNKNOWN");
  assert.equal(a.geometry.reason,"CHANNEL_NOT_A_OR_B");
}

// Missing target-price provenance remains UNKNOWN even if the value participates in Formal geometry.
{
  const a=buildTargetRrAudit(baseB({targetPrice:115,targetPriceSource:null,targetPriceAsOf:null,targetPriceCapturedAt:null}),{
    channel:"B",formalResult:{ok:true}
  });
  assert.equal(a.targetPrice.present,true);
  assert.equal(a.targetPrice.provenanceState,"UNKNOWN");
  assert.equal(a.resistance.selectedTarget,115);
}
