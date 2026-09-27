import assert from "node:assert/strict";
import {auditTargetResistanceGeometry,classifyTargetRrGradeScarcity} from "../research/target_rr_scarcity_observer_v0_1.mjs";

const history=(points)=>{
  const rows=[];
  for(let i=0;i<points.length;i++) rows.push({date:"2026-07-"+String(i+1).padStart(2,"0"),high:points[i],low:points[i]-2,close:points[i]-1});
  rows.push({date:"2026-09-27",high:100,low:98,close:100});
  return rows;
};

// target-null: all known levels are within/under 1% band.
{
  const g=auditTargetResistanceGeometry({feature:{priorHigh20:100,priorHigh60:101,history:history([98,99,100,99,98])},entry:100});
  assert.equal(g.selectedTarget,null);
  assert.equal(g.targetNull,true);
  assert.equal(g.targetNullReason,"NO_CANDIDATE_STRICTLY_ABOVE_ENTRY_X_1_01");
  const s=classifyTargetRrGradeScarcity({geometry:g,stop:95,setupQuality:75,upstreamFormalGatesObservedPass:true});
  assert.equal(s.state,"TARGET_NULL");
  assert.equal(s.rewardRisk,null);
}

// external target can rescue target-null geometry but provenance remains unproven.
{
  const g=auditTargetResistanceGeometry({feature:{targetPrice:115,priorHigh20:100,priorHigh60:101,history:history([98,99,100,99,98])},entry:100});
  assert.equal(g.selectedTarget,115);
  assert.equal(g.selectedTargetSourceUnique,"TARGET_PRICE");
  assert.equal(g.targetPrice.canonicalProvenanceState,"NO_CANONICAL_REPO_SOURCE_ASOF_KNOWNAT_CONTRACT");
  const s=classifyTargetRrGradeScarcity({geometry:g,stop:95,setupQuality:75,upstreamFormalGatesObservedPass:true});
  assert.equal(s.state,"TARGET_RR_GRADE_PASS");
  assert.equal(s.rewardRisk,3);
}

// nearer targetPrice can compress an otherwise high RR to LOW_RR.
{
  const g=auditTargetResistanceGeometry({feature:{targetPrice:105,priorHigh60:120,history:history([98,99,100,99,98])},entry:100});
  assert.equal(g.selectedTarget,105);
  const s=classifyTargetRrGradeScarcity({geometry:g,stop:95,setupQuality:75,upstreamFormalGatesObservedPass:true});
  assert.equal(s.state,"LOW_RR");
  assert.equal(s.rewardRisk,1);
}

// minor local pivot can dominate farther major level.
{
  const g=auditTargetResistanceGeometry({feature:{priorHigh60:120,history:history([99,100,102,100,99])},entry:100});
  assert.equal(g.selectedTarget,102);
  assert.ok(g.selectedTargetSources.some(x=>x.source==="LOCAL_PIVOT_HIGH"));
  const s=classifyTargetRrGradeScarcity({geometry:g,stop:95,setupQuality:75,upstreamFormalGatesObservedPass:true});
  assert.equal(s.state,"LOW_RR");
  assert.ok(Math.abs(s.rewardRisk-0.4)<1e-12);
}

// sub-1% overhead is excluded while farther level is selected.
{
  const g=auditTargetResistanceGeometry({feature:{priorHigh60:120,history:history([99,100,100.8,100,99])},entry:100});
  assert.equal(g.selectedTarget,120);
  assert.ok(g.excludedByOnePercentBand.some(x=>x.source==="LOCAL_PIVOT_HIGH"&&x.price===100.8));
}

// same-price multiple sources must not invent a unique source.
{
  const g=auditTargetResistanceGeometry({feature:{targetPrice:120,priorHigh60:120,history:history([99,100,120,100,99])},entry:100});
  assert.equal(g.selectedTarget,120);
  assert.ok(g.selectedTargetSources.length>=2);
  assert.equal(g.selectedTargetSourceUnique,null);
  assert.equal(g.selectedTargetSourceTie,true);
}

// RR passed but final grade can still reject.
{
  const g=auditTargetResistanceGeometry({feature:{priorHigh60:120,history:history([98,99,100,99,98])},entry:100});
  const s=classifyTargetRrGradeScarcity({geometry:g,stop:95,setupQuality:60,upstreamFormalGatesObservedPass:true});
  assert.equal(s.rewardRisk,4);
  assert.equal(s.state,"FINAL_GRADE_REJECTED");
}

// B-style new-high geometry: priorHigh20 cannot be its own target and priorHigh60 below threshold yields target-null.
{
  const entry=100*1.003;
  const g=auditTargetResistanceGeometry({feature:{priorHigh20:100,priorHigh60:100.2,history:history([98,99,100.2,99,98])},entry});
  assert.equal(g.targetNull,true);
  assert.equal(g.blueSkyLikeHistoricalContext,true);
}

// upstream pass must remain explicit; observer pass is not Formal qualification by itself.
{
  const g=auditTargetResistanceGeometry({feature:{priorHigh60:120,history:history([98,99,100,99,98])},entry:100});
  const s=classifyTargetRrGradeScarcity({geometry:g,stop:95,setupQuality:75,upstreamFormalGatesObservedPass:false});
  assert.equal(s.state,"TARGET_RR_GRADE_PASS");
  assert.match(s.warning,/Do not interpret/);
}

console.log(JSON.stringify({ok:true,targetNullSeparated:true,lowRrSeparated:true,gradeSeparated:true,sourceTiesPreserved:true,formalCoreImpact:false},null,2));
