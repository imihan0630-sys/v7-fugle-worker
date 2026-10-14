import test from "node:test";
import assert from "node:assert/strict";
import {verifyNativeAuditEvidenceV0_1,auditPass} from "./commander.mjs";
const repo="imihan0630-sys/v7-fugle-worker",fakeHash="a".repeat(64),runId=38150147134,artifactId=11706652537;
const issue={state:"closed",labels:[{name:"s2cmd:audited-pass"}]};
const comment={user:{login:"imihan0630-sys"},body:"[S2CMD-INDEPENDENT-AUDIT-PASS M01]\nhttps://github.com/"+repo+"/actions/runs/"+runId+"\nArtifact #"+artifactId+"\nSHA-256: "+fakeHash};
function native(overrides={}){
 return async path=>{
  if(path==="/actions/runs/"+runId)return {...{id:runId,status:"completed",conclusion:"success",repository:{full_name:repo}},...overrides.run};
  if(path==="/actions/runs/"+runId+"/artifacts?per_page=100")return {...{total_count:1,artifacts:[{id:artifactId,expired:false,digest:"sha256:"+fakeHash}]},...overrides.artifacts};
  throw Error("UNEXPECTED_PROVIDER_QUERY");
 };
}
test("native GitHub original successful run + exact artifact/digest required after human audit",async()=>{
 assert.equal(auditPass(issue,"M01",[comment]),true);
 assert.equal(await verifyNativeAuditEvidenceV0_1({repo,token:"EXISTING_GITHUB_TOKEN",issue,id:"M01",comments:[comment],fetchJson:native()}),true);
});
test("never accept written PASS if original run/artifact invalid",async()=>{
 for(const changes of [
 {run:{conclusion:"failure"}},{run:{status:"in_progress"}},{run:{repository:{full_name:"other/repo"}}},
 {artifacts:{total_count:0,artifacts:[]}},{artifacts:{total_count:1,artifacts:[{id:artifactId,expired:true,digest:"sha256:"+fakeHash}]}},
 {artifacts:{total_count:1,artifacts:[{id:artifactId,expired:false,digest:"sha256:"+"b".repeat(64)}]}},
 {artifacts:{total_count:1,artifacts:[{id:artifactId+1,expired:false,digest:"sha256:"+fakeHash}]}}
 ]){
  assert.equal(await verifyNativeAuditEvidenceV0_1({repo,token:"existing",issue,id:"M01",comments:[comment],fetchJson:native(changes)}),false);
 }
});
test("owner/audit closure is still mandatory; no recipient automatically passes",async()=>{
 for(const args of [
 {issue:{...issue,state:"open"},comments:[comment]},{issue:{...issue,labels:[]},comments:[comment]},
 {issue,comments:[{...comment,user:{login:"other"}}]}, {issue,comments:[]},
 {issue,comments:[{...comment,body:comment.body.replace("M01","M02")}]}
 ])assert.equal(await verifyNativeAuditEvidenceV0_1({repo,token:"existing",id:"M01",fetchJson:native(),...args}),false);
});
test("incomplete native artifact list fails closed, not provisional PASS",async()=>{
 await assert.rejects(()=>verifyNativeAuditEvidenceV0_1({repo,token:"existing",issue,id:"M01",comments:[comment],fetchJson:native({artifacts:{total_count:101,artifacts:[]}})}),/INCOMPLETE/);
 await assert.rejects(()=>verifyNativeAuditEvidenceV0_1({repo,token:"existing",issue,id:"M01",comments:[comment],fetchJson:async()=>{throw Error("PROVIDER_403");}}),/PROVIDER_403/);
});
