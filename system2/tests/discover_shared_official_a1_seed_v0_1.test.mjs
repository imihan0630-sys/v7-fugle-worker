import test from 'node:test';
import assert from 'node:assert/strict';
import {discoverSharedA1PreviousSourceArtifactV0_1 as discover}
 from '../scripts/discover_shared_official_a1_seed_v0_1.mjs';

function run(id,{status='completed',conclusion='success',head_branch='main'}={}){
 return {id,status,conclusion,head_branch};
}
function artifact(id,overrides={}){
 return {name:'s2-shared-official-a1-'+id,expired:false,size_in_bytes:100,
  workflow_run:{id,head_branch:'main'},...overrides};
}
function server(runs,artifactsById){
 const requests=[];
 const apiFetch=async endpoint=>{
  requests.push(endpoint);
  if(endpoint.includes('/actions/workflows/'))return {workflow_runs:runs};
  const id=Number(endpoint.match(/\/actions\/runs\/(\d+)\/artifacts/)?.[1]);
  if(!Number.isSafeInteger(id))throw Error('TEST_UNEXPECTED_REQUEST');
  return {artifacts:artifactsById[id]??[]};
 };
 return {apiFetch,requests};
}
test('reuse only successful completed MAIN and exact same-run nonexpired original artifact',async()=>{
 const mock=server([
  run(90,{conclusion:'failure'}),
  run(89,{conclusion:'cancelled'}),
  run(88,{head_branch:'feature'}),
  run(87,{status:'in_progress'}),
  run(86),run(85),run(84),run(83),run(82)
 ],{
  90:[artifact(90)],89:[artifact(89)],88:[artifact(88)],
  87:[artifact(87)],
  86:[artifact(86,{name:'s2-shared-official-a1-86-forged'})],
  85:[artifact(85,{workflow_run:{id:999}})],
  84:[artifact(84,{expired:true})],
  83:[artifact(83,{size_in_bytes:0})],
  82:[artifact(82)]
 });
 const result=await discover({token:'test',currentRunId:100,apiFetch:mock.apiFetch});
 assert.deepEqual(result,{runId:82,artifactName:'s2-shared-official-a1-82',
  kind:'VERIFIED_PRIOR_PIPELINE_ARTIFACT_AVAILABLE'});
 const probes=mock.requests.filter(x=>x.startsWith('/actions/runs/'));
 assert.deepEqual(probes,[86,85,84,83,82].map(id=>'/actions/runs/'+id+'/artifacts?per_page=30'));
});
test('current run cannot discover itself, and no validated result safely falls back to legacy public seed',async()=>{
 const mock=server([run(100),run(99,{conclusion:'failure'}),run(98)],{
  100:[artifact(100)],99:[artifact(99)],
  98:[artifact(98,{expired:true})]
 });
 const result=await discover({token:'test',currentRunId:100,apiFetch:mock.apiFetch});
 assert.equal(result.runId,38317682441);
 assert.equal(result.kind,'INITIAL_REAL_PROVIDER_UNAUDITED_SEED');
 assert.deepEqual(mock.requests.filter(x=>x.startsWith('/actions/runs/')),
  ['/actions/runs/98/artifacts?per_page=30']);
});
test('missing builtin token or malformed GitHub original listing fail closed',async()=>{
 const apiFetch=async()=>({workflow_runs:null});
 await assert.rejects(()=>discover({apiFetch}),/GITHUB_BUILTIN_READONLY_TOKEN_REQUIRED/);
 await assert.rejects(()=>discover({token:'test',apiFetch}),
  /GITHUB_SHARED_A1_RUNS_LIST_UNVERIFIED/);
});
