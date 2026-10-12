import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const py='system2/migration/issue1068_real_archive_pit_batch_plan_offline_v0_1.py';
const bridge='system2/migration/secure_cross_environment_sql_transfer_20261011.mjs';
const p=readFileSync(py,'utf8');
const b=readFileSync(bridge,'utf8');
for(const source of [py,bridge]){
  const x=spawnSync(source.endsWith('.py')?'python3':'node',
    [source.endsWith('.py')?'-m':'--check',...(source.endsWith('.py')?['py_compile',source]:[source])],
    {encoding:'utf8',timeout:30000});
  assert.equal(x.status,0,`${source} syntax must pass: ${x.stderr}`);
}
for (const invalid of ['/tmp/source-d1-nonexistent-file.db', '']){
  const x=spawnSync('python3',[py,invalid],{encoding:'utf8',timeout:30000});
  assert.equal(x.status,2,'missing source file must fail closed');
  assert.match(x.stderr,/SOURCE_ARCHIVE_PIT_BATCH_PLAN_FAIL_CLOSED/);
}
assert(p.includes('PRAGMA query_only=ON'));
assert(p.includes('SOURCE_ROWS = 113222'));
assert(p.includes('SOURCE_BARS = 84688'));
assert(p.includes('pit_replay_eligible=1'));
assert(p.includes('sourcePITFirstKnownAtIndependentlyProven":False'));
assert(p.includes('permissionToImport":False'));
assert(p.includes('operationalBudgetBilledWrites'));
assert(b.includes('DEST_PIT_PLAN'));
assert(b.includes('out.permissionToImport=false'));
assert(b.includes('ORIGINAL_PIT_BATCH_AUDIT_INVALID_OR_OVERPROMOTED'));
console.log('SOURCE_113222_ORIGINAL_OFFLINE_PIT_BATCH_FAIL_CLOSED_NEGATIVES_PASS');
