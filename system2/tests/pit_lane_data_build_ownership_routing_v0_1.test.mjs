import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const POLICY='system2/SYSTEM2_PIT_DATA_BUILD_OWNERSHIP_AND_HANDOFF_V0_1.md';
const GOV='system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md';
const FILES=[
 'system2/prompts/PIT_DATA_LANE_CONTINUATION_V0_1.md',
 'system2/prompts/PIT_BUILD_LANE_CONTINUATION_V0_1.md',
];
const txt=async p=>readFile(p,'utf8');

test('both existing registered rooms automatically load canonical PIT policy and their different lane prompts',async()=>{
 const registry=JSON.parse(await txt('shared-knowledge/ROOM_BOOTSTRAP_REGISTRY.json'));
 assert.equal(registry.rules.system2PitDataBuildOwnership,POLICY);
 const build=registry.identities.filter(i=>i.id==='SYSTEM2');
 const data=registry.identities.filter(i=>i.id==='SYSTEM2_DATA');
 assert.equal(build.length,1);
 assert.equal(data.length,1);
 for(const [room,prompt] of [[build[0],FILES[1]],[data[0],FILES[0]]]){
  assert.ok(room.checkpoints.includes(POLICY));
  assert.ok(room.checkpoints.includes(GOV));
  assert.ok(room.checkpoints.includes(prompt));
  assert.ok(!room.checkpoints.includes(room===build[0]?FILES[0]:FILES[1]));
  for(const name of [POLICY,prompt])assert.ok((await txt(name)).length>800,name);
 }
 assert.equal(build[0].lane||'BUILD_LANE','BUILD_LANE');
 assert.equal(data[0].lane,'DATA_LANE');
});

test('PIT workflow ownership appears on latest room checkpoints, not merely in chat memory',async()=>{
 const [history,build,gov,policy]=await Promise.all([
  txt('system2/SYSTEM2_HISTORICAL_DATA_CHECKPOINT.md'),
  txt('system2/SYSTEM2_CHECKPOINT.md'),
  txt(GOV),txt(POLICY),
 ]);
 for(const s of [history,build,gov])assert.ok(s.includes(POLICY.replace('system2/','')));
 assert.match(history,/DATA_LANE/);
 assert.match(build,/BUILD_LANE/);
 assert.match(gov,/one conflict unit -> one active modification owner at a time/);
 assert.match(policy,/PIT_SOURCE_HANDOFF/);
 assert.match(policy,/firstKnownAt/);
 assert.match(policy,/NO_EVENT/);
 assert.match(policy,/FROZEN_PHYSICALLY_ACCEPTED/);
 assert.match(policy,/61/);
});

test('PIT original evidence is DATA and selection-scoring/Shadow/Frozen consumer is BUILD; no false permission',async()=>{
 const [data,build,policy]=await Promise.all([
  txt(FILES[0]),txt(FILES[1]),txt(POLICY)
 ]);
 assert.match(data,/DATA_LANE/);
 assert.match(data,/CI/);
 assert.match(data,/歷史普通股 CFI/);
 assert.match(data,/firstKnownAt/);
 assert.match(data,/不得自行開發或更動 SHORT_MOMENTUM 逐股評分/);
 assert.match(build,/BUILD_LANE/);
 assert.match(build,/SHORT_MOMENTUM/);
 assert.match(build,/不得再做歷史 CFI 原始有效日抓取/);
 assert.match(build,/選股分母/);
 assert.match(build,/選股/);
 assert.match(policy,/不會|auto-run|auto-start|auto-run|auto-run|auto-run|auto-run/);
 // No literal grant or evidence of already certified PIT across all names.
 assert.doesNotMatch(policy,/M09.*6\/6.*PASS/);
 assert.doesNotMatch(data,/PIT 已全部過關/);
});
