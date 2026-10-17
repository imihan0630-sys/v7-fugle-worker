import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {GUARDED_FLOWS,inspectActiveWriterWorkflowV0_1 as inspect,
 inspectCanonicalFourWriterFlowsV0_1 as canonical} from '../remediation/m12_active_step_writer_interlock_integrity_v0_1.mjs';
const root=new URL('../../',import.meta.url);
const originals=Object.fromEntries(Object.entries(GUARDED_FLOWS).map(([k,v])=>
 [k,readFileSync(fileURLToPath(new URL(v.file,root)),'utf8')]));
test('original four independently parsed active interlocks are all non-authorizing',()=>{
 const all=canonical();assert.equal(all.length,4);
 for(const x of all){assert.ok(x.stepCount>=4);assert.ok(x.secretBoundStepCount>=1);
  assert.equal(x.d1WriteAuthorized,false);assert.equal(x.nativeCloudflareAtomicLeaseVerified,false);
  assert.equal(x.fullCloudflareWriterCensusVerified,false);}
});
const edits=[
 ['comment-only lock spoof', 'RAW_COPY',s=>s.replace('      group: s2-dest-d1-historical-and-diagnostic-writer','      group: bypass-writer\n      # group: s2-dest-d1-historical-and-diagnostic-writer')],
 ['wrong job environment','RAW_COPY',s=>s.replace('    environment: system2-schema-only','    environment: system2-research')],
 ['comment-only interlock', 'RAW_COPY',s=>s.replace('        run: node system2/scripts/dest_d1_writer_run_interlock_v0_1.mjs','        # run: node system2/scripts/dest_d1_writer_run_interlock_v0_1.mjs\n        run: echo ignore')],
 ['interlock id removed','RAW_COPY',s=>s.replace('        id: day_interlock','        id: bypass')],
 ['writer ID wrong', 'RAW_COPY',s=>s.replace('S2_DEST_WRITER_CLASS: RAW_COPY','S2_DEST_WRITER_CLASS: DAILY_DIAGNOSTIC')],
 ['raw write gate deleted','RAW_COPY',s=>s.replace("        if: steps.day_interlock.outputs.allowed == 'true'\n        env:\n          S2_SCHEMA_DEST_ACCOUNT_ID","        if: true\n        env:\n          S2_SCHEMA_DEST_ACCOUNT_ID")],
 ['raw write unconditional','RAW_COPY',s=>s.replace("        if: steps.day_interlock.outputs.allowed == 'true'\n        env:\n          S2_SCHEMA_DEST_ACCOUNT_ID","        env:\n          S2_SCHEMA_DEST_ACCOUNT_ID")],
 ['raw early secret injected','RAW_COPY',s=>s.replace('      - name: Fail-closed no competing destination D1 writer','      - name: Fail-closed no competing destination D1 writer\n        env:\n          TEST_SECRET: ${{ secrets.S2_SCHEMA_DEST_D1_WRITE_TOKEN }}')],
 ['raw writer changed to other step', 'RAW_COPY',s=>s.replace('run: node system2/migration/owner_override_raw_d1_import_20261012.mjs','run: node malicious_script.mjs')],
 ['disable github native read','RAW_COPY',s=>s.replace('  actions: read','  actions: none')],
 ['schema unguarded apply','MANUAL_SCHEMA_APPLY',s=>s.replace("if: inputs.action == 'VERIFY_ONLY' || steps.day_interlock.outputs.allowed == 'true'","if: inputs.action == 'VERIFY_ONLY' || true")],
 ['schema allow skip preflight','MANUAL_SCHEMA_APPLY',s=>s.replace("if: inputs.action == 'APPLY_ONCE'","if: always()")],
 ['schema unrecognized code','MANUAL_SCHEMA_APPLY',s=>s.replace('run: node system2/migration/run_destination_schema_only_manual_v0_1.mjs','run: node altered-schema.mjs')],
 ['schema wrong job lock','MANUAL_SCHEMA_APPLY',s=>s.replace('      cancel-in-progress: false','      cancel-in-progress: true')],
 ['diagnostic omit budget action','DAILY_DIAGNOSTIC',s=>s.replace('uses: ./.github/actions/system2-d1-budget-gate','uses: actions/cache@v4')],
 ['diagnostic budget not gated','DAILY_DIAGNOSTIC',s=>s.replace("if: steps.day_interlock.outputs.allowed == 'true'\n        id: quota","if: always()\n        id: quota")],
 ['diagnostic write gate widened','DAILY_DIAGNOSTIC',s=>s.replace("if: steps.quota.outputs.physical_allowed == 'true'","if: always() || steps.quota.outputs.physical_allowed == 'true'")],
 ['diagnostic job push bypass','DAILY_DIAGNOSTIC',s=>s.replace("github.event_name != 'push'","github.event_name == 'push'")],
 ['warmup write branch bypass','RECENT_A1_WARMUP',s=>s.replace("if: steps.quota.outputs.physical_allowed == 'true'","if: true")],
 ['warmup crosswriter identity spoof','RECENT_A1_WARMUP',s=>s.replace('S2_DEST_WRITER_CLASS: RECENT_A1_WARMUP','S2_DEST_WRITER_CLASS: RAW_COPY')],
 ['warmup active guard commented','RECENT_A1_WARMUP',s=>s.replace('        run: node system2/scripts/dest_d1_writer_run_interlock_v0_1.mjs','        # run: node system2/scripts/dest_d1_writer_run_interlock_v0_1.mjs')],
];
for(const [name,id,mutate] of edits)test('fail-closed adversarial: '+name,()=>{
 const bad=mutate(originals[id]);assert.notEqual(bad,originals[id],'mutation must actually alter source');
 assert.throws(()=>inspect(bad,id),/M12_ACTIVE_STEP_GUARD_/);
});
test('no false atomic permit if real active-step inspection passes',()=>{
 for(const [id,s] of Object.entries(originals)){
  const result=inspect(s,id);assert.equal(result.d1WriteAuthorized,false);
 }
});
