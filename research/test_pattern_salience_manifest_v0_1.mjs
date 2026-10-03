import assert from "node:assert/strict";
import {
 buildSalienceManifest,classifyCandidateMatchability,summarizeMatchability
} from "./pattern_salience_manifest_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const parent={zoneId:"M1",zoneVersion:"1",symbol:"2330",parentConfirmedAt:"2026-09-20",lower:100,upper:102};

t("SM01 empty pool stays explicit",()=>{
 const r=buildSalienceManifest({trueParent:parent});
 assert.equal(r.controlPoolStatus,"CONTROL_POOL_EMPTY");
 assert.equal(r.pseudoCandidateCount,0);
});

t("SM02 all pseudo candidates retained",()=>{
 const r=buildSalienceManifest({trueParent:parent,pseudoCandidates:[
  {candidateId:"p1",lower:90,upper:92},{candidateId:"p2",lower:110,upper:112}
 ]});
 assert.equal(r.pseudoCandidateCount,2);
 assert.equal(r.rows.length,3);
});

t("SM03 duplicate candidate id QA fails",()=>{
 const r=buildSalienceManifest({trueParent:parent,pseudoCandidates:[
  {candidateId:"p1",lower:90,upper:92},{candidateId:"p1",lower:110,upper:112}
 ]});
 assert.equal(r.status,"QA_FAIL");
});

t("SM04 duplicate geometry diagnosed",()=>{
 const r=buildSalienceManifest({trueParent:parent,pseudoCandidates:[
  {candidateId:"p1",lower:90,upper:92},{candidateId:"p2",lower:90,upper:92}
 ]});
 assert.equal(r.geometryDuplicateGroups.length,1);
 assert.deepEqual(r.geometryDuplicateGroups[0].candidateIds,["p1","p2"]);
});

t("SM05 missing opportunity provenance not matchable",()=>{
 const r=classifyCandidateMatchability({opportunityComplete:false});
 assert.equal(r.status,"NOT_MATCHABLE_MISSING_PROVENANCE");
});

t("SM06 opportunity only gives E1",()=>{
 const r=classifyCandidateMatchability({opportunityComplete:true,mechanicalComplete:false});
 assert.equal(r.status,"E1_ONLY");
});

t("SM07 mechanical complete gives E2",()=>{
 const r=classifyCandidateMatchability({opportunityComplete:true,mechanicalComplete:true,salienceComplete:false});
 assert.equal(r.status,"E2_ONLY");
});

t("SM08 full provenance gives E3",()=>{
 const r=classifyCandidateMatchability({opportunityComplete:true,mechanicalComplete:true,salienceComplete:true});
 assert.equal(r.status,"E3_READY");
});

t("SM09 outside common support overrides completeness",()=>{
 const r=classifyCandidateMatchability({
  opportunityComplete:true,mechanicalComplete:true,salienceComplete:true,outsideCommonSupport:true
 });
 assert.equal(r.status,"NOT_MATCHABLE_OUTSIDE_COMMON_SUPPORT");
});

t("SM10 coverage summary keeps losses visible",()=>{
 const r=summarizeMatchability([
  {opportunityComplete:true,mechanicalComplete:true,salienceComplete:true},
  {opportunityComplete:true,mechanicalComplete:true,salienceComplete:false},
  {opportunityComplete:false},
  {opportunityComplete:true,mechanicalComplete:true,salienceComplete:true,outsideCommonSupport:true}
 ]);
 assert.equal(r.e3,1);
 assert.equal(r.outsideCommonSupport,1);
 assert.equal(r.missingProvenance,1);
});

t("SM11 manifest is outcome closed",()=>{
 const r=buildSalienceManifest({trueParent:parent});
 assert.equal(r.outcomeOpened,false);
});

t("SM12 true row is exactly one",()=>{
 const r=buildSalienceManifest({trueParent:parent,pseudoCandidates:[{candidateId:"p1",lower:90,upper:92}]});
 assert.equal(r.rows.filter(x=>x.candidateType==="TRUE_ZONE").length,1);
});

console.log(`SUMMARY ${pass}/12 PASS`);
