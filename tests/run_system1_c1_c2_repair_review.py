"""Offline branch review only. Not connected to production deployment."""
from pathlib import Path
import os, re, subprocess, sys, json
workflow=Path('.github/workflows/v7-regression.yml').read_text(encoding='utf-8')
for script in re.findall(r'python3 (scripts/\S+\.py)',workflow):
    subprocess.run([sys.executable,script],check=True)
baseline=Path('Worker.js').read_text(encoding='utf-8')
subprocess.run([sys.executable,'scripts/apply_v8_15_1.py'],check=True)
candidate=Path('Worker.js').read_text(encoding='utf-8')
def functions(source):
    matches=list(re.finditer(r'^(?:async )?function (\w+)\(',source,re.M))
    result={}
    for m in matches:
        end=re.search(r'^}\s*$',source[m.end():],re.M)
        if not end: raise SystemExit('Missing function boundary: '+m.group(1))
        result[m.group(1)]=source[m.start():m.end()+end.end()].rstrip()
    return result
before,after=functions(baseline),functions(candidate)
changed=[name for name,body in before.items() if body!=after.get(name)]
allowed={'c1ChunkRows','c1ImmutableDecision','persistC1PopulationReceipt','readC1PopulationReceipt',
         'runAfterMarketScanCore','selectTomorrowCandidates'}
if set(changed)-allowed: raise SystemExit('Unexpected protected function changes: '+str(sorted(set(changed)-allowed)))
selector=after['selectTomorrowCandidates'].replace(
    '  let c1PopulationReceipt=null,c1CaptureError=null;\n'
    '  try { c1PopulationReceipt=buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,c1FormalResults,selected,scanDate); }\n'
    '  catch(error) { c1CaptureError=String(error).slice(0,300); }',
    '  const c1PopulationReceipt=buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,c1FormalResults,selected,scanDate);'
).replace('    c1PopulationReceipt,c1CaptureError,','    c1PopulationReceipt,')
if selector!=before['selectTomorrowCandidates']: raise SystemExit('Formal selector changed beyond C1 firewall')
Path('Worker-review.mjs').write_text(candidate,encoding='utf-8')
subprocess.run(['node','--check','Worker-review.mjs'],check=True)
env=os.environ.copy();env['V7_TEST_WORKER_PATH']=str(Path('Worker.js').resolve())
commands=re.findall(r'^          node (tests/\S+)([^\n]*)',workflow,re.M)
extra=['tests/test_v8_15_1_c1_capture_integrity.mjs','tests/test_system1_selection_isolated_v0_1.mjs',
       'tests/test_system1_c1_readiness_v0_1.mjs','tests/test_system1_c2_paired_ledger_v0_1.mjs',
       'tests/test_system1_c1_c2_collection_v0_1.mjs']
commands += [(name,'') for name in extra if name not in [c[0] for c in commands]]
results=[]
for name,args in commands:
    result=subprocess.run(['node',name]+args.split(),env=env,capture_output=True,text=True,encoding='utf-8')
    results.append({'test':name,'exitCode':result.returncode})
    print(('PASS ' if result.returncode==0 else 'FAIL ')+name,flush=True)
    if result.returncode: print((result.stdout+result.stderr)[-5000:],flush=True)
Path('artifacts').mkdir(exist_ok=True)
receipt={'schemaVersion':'SYSTEM1_C1_C2_REPAIR_REVIEW_V0_1','passed':sum(r['exitCode']==0 for r in results),
  'total':len(results),'changedFunctions':changed,'protectedFunctionCount':len(before)-len(changed),
  'selectorUnchangedExceptCaptureFirewall':True,'fixtureOnly':True,'formalCoreImpact':False,'results':results}
Path('artifacts/system1-c1-c2-repair-review.json').write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
print(json.dumps(receipt),flush=True)
if any(r['exitCode'] for r in results): raise SystemExit(1)
