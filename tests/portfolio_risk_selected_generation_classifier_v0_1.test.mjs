import assert from "node:assert/strict";
import {classifySelectedGeneration} from "../research/portfolio_risk_selected_generation_classifier_v0_1.mjs";

const full={
 sourceCompleteness:"FULL_FORMAL_SCAN",
 ranking:{
  priorityScoreDefinitionVersion:"V8.13.0",
  rankingComparatorVersion:"POST_CONSENSUS_PRIORITY_THEN_RR",
  postConsensusPriorityScore:89.4,
  rewardPerRisk:3.71,
  marketConsensusBonus:4
 }
};
const plan={scan_date:"2026-09-29",symbol:"3105",recorded_at:"2026-09-29T08:01:02.003Z"};
const snap={scan_date:"2026-09-29",symbol:"3105",updated_at:"2026-09-29T08:01:02.003Z",snapshot:full};
const day={selected_count:3,plan_count:3};
assert.equal(classifySelectedGeneration(plan,snap,day).certified,true);

for(const [name,p,s,d,reason] of [
 ["date",{...plan,scan_date:"2026-09-30"},snap,day,"SCAN_DATE_MISMATCH"],
 ["symbol",{...plan,symbol:"6133"},snap,day,"SYMBOL_MISMATCH"],
 ["timestamp",plan,{...snap,updated_at:"2026-09-29T08:01:03.003Z"},day,"WRITER_TIMESTAMP_MISMATCH"],
 ["partial",plan,{...snap,snapshot:{...full,sourceCompleteness:"PARTIAL_CURRENT_SCAN_RECONSTRUCTION"}},day,"NOT_FULL_FORMAL_SCAN"],
 ["missing provenance",plan,{...snap,snapshot:{sourceCompleteness:"FULL_FORMAL_SCAN"}},day,"MISSING_PRIORITYSCOREDEFINITIONVERSION"],
 ["journal incomplete",plan,snap,{selected_count:3,plan_count:2},"JOURNAL_COMPLETENESS_UNVERIFIED"]
 ]){
  const out=classifySelectedGeneration(p,s,d);
  assert.equal(out.certified,false,name);
  assert.ok(out.reasons.includes(reason),name+" reason");
}
console.log(JSON.stringify({ok:true,cases:7,policy:"fail-closed selected-generation classifier; no Production read/write"},null,2));
