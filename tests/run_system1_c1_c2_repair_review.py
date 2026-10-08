"""Offline branch review only. Not connected to production deployment."""
from pathlib import Path
import os, re, subprocess, sys, json
workflow=Path('.github/workflows/v7-regression.yml').read_text(encoding='utf-8')
scripts=re.findall(r'python3 (scripts/\S+\.py)',workflow)
tail={"scripts/apply_v8_15_1.py","scripts/apply_v8_15_2.py","scripts/apply_v8_15_3.py","scripts/apply_v8_15_4.py","scripts/apply_v8_16_0.py","scripts/apply_v8_17_0.py","scripts/apply_v8_18_0.py","scripts/apply_v8_19_0.py","scripts/apply_v8_19_1_pve250_prod_stamp.py","scripts/apply_v8_20_0.py","scripts/apply_v8_20_1.py"}
for script in scripts:
    if script not in tail:
        subprocess.run([sys.executable,script],check=True)
baseline=Path('Worker.js').read_text(encoding='utf-8')
subprocess.run([sys.executable,'scripts/apply_v8_15_1.py'],check=True)
if "scripts/apply_v8_15_2.py" in scripts:
    subprocess.run([sys.executable,'scripts/apply_v8_15_2.py'],check=True)
if "scripts/apply_v8_15_3.py" in scripts:
    subprocess.run([sys.executable,'scripts/apply_v8_15_3.py'],check=True)
if "scripts/apply_v8_15_4.py" in scripts:
    subprocess.run([sys.executable,'scripts/apply_v8_15_4.py'],check=True)
class_b_baseline=Path('Worker.js').read_text(encoding='utf-8')
subprocess.run([sys.executable,'scripts/apply_v8_16_0.py'],check=True)
v816_candidate=Path('Worker.js').read_text(encoding='utf-8')
subprocess.run([sys.executable,'scripts/apply_v8_17_0.py'],check=True)
v817_candidate=Path('Worker.js').read_text(encoding='utf-8')
subprocess.run([sys.executable,'scripts/apply_v8_18_0.py'],check=True)
v818_candidate=Path('Worker.js').read_text(encoding='utf-8')
subprocess.run([sys.executable,'scripts/apply_v8_19_0.py'],check=True)
v819_candidate=Path('Worker.js').read_text(encoding='utf-8')
if "scripts/apply_v8_19_1_pve250_prod_stamp.py" in scripts:
    subprocess.run([sys.executable,'scripts/apply_v8_19_1_pve250_prod_stamp.py'],check=True)
v8191_candidate=Path('Worker.js').read_text(encoding='utf-8')
if "scripts/apply_v8_20_0.py" in scripts:
    subprocess.run([sys.executable,'scripts/apply_v8_20_0.py'],check=True)
if "scripts/apply_v8_20_1.py" in scripts:
    subprocess.run([sys.executable,'scripts/apply_v8_20_1.py'],check=True)
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
class_b_before=functions(class_b_baseline)
v816_functions=functions(v816_candidate)
v817_functions=functions(v817_candidate)
v818_functions=functions(v818_candidate)
v819_functions=functions(v819_candidate)
v819_changed=[name for name,body in v818_functions.items() if body!=v819_functions.get(name)]
if set(v819_changed)!={'runAfterMarketScanCore','persistC1PopulationReceipt','persistCompletedC1Safe','verifyC1StoredGeneration'}:
    raise SystemExit('Unexpected C1 scan-origin inventory plumbing changes: '+str(v819_changed))
v818_changed=[name for name,body in v817_functions.items() if body!=v818_functions.get(name)]
if set(v818_changed)!={'runAfterMarketScanCore','selectTomorrowCandidates','buildC1PopulationReceipt','persistC1PopulationReceipt','verifyC1StoredGeneration'}:
    raise SystemExit('Unexpected valuation vintage plumbing changes: '+str(v818_changed))
v817_changed=[name for name,body in v816_functions.items() if body!=v817_functions.get(name)]
if set(v817_changed)!={'buildC1PopulationReceipt','persistCompletedC1Safe'}:
    raise SystemExit('Unexpected Shadow cohort plumbing changes: '+str(v817_changed))
class_b_changed=[name for name,body in class_b_before.items() if body!=v816_functions.get(name)]
class_b_new=sorted(set(v816_functions)-set(class_b_before))
if set(class_b_changed)!={'buildC1PopulationReceipt','persistC1PopulationReceipt','selectTomorrowCandidates'}:
    raise SystemExit('Unexpected Class-B plumbing changes: '+str(class_b_changed))
if set(class_b_new)!={'c1ZeroPickOrdinals','buildC1ZeroPickChild','finalizeC1ZeroPickReceipt'}:
    raise SystemExit('Unexpected Class-B helper changes: '+str(class_b_new))
changed=[name for name,body in before.items() if body!=after.get(name)]
allowed={'c1ChunkRows','c1ImmutableDecision','persistC1PopulationReceipt','readC1PopulationReceipt',
         'runAfterMarketScanCore','selectTomorrowCandidates','persistCompletedC1Safe','verifyC1StoredGeneration'}
if "scripts/apply_v8_15_2.py" in scripts or "scripts/apply_v8_15_3.py" in scripts:
    allowed.update({'ensureD1Schema','runBackgroundMonitor'})
if "scripts/apply_v8_15_3.py" in scripts:
    allowed.update({'c1ProjectFeature','c1DerivedState'})
if "scripts/apply_v8_15_4.py" in scripts:
    allowed.update({'buildC1PopulationReceipt'})
if set(changed)-allowed: raise SystemExit('Unexpected protected function changes: '+str(sorted(set(changed)-allowed)))
selector=after['selectTomorrowCandidates'].replace(',env.V7_VALUATION_SOURCE_VINTAGE);',');').replace(
    '  let c1ZeroPickContext=null;\n'
    '  try { c1ZeroPickContext={ordinals:c1ZeroPickOrdinals(featureRows,todayRows),consensusReference:env.V7_MARKET_CONSENSUS}; }\n'
    '  catch(error) { c1ZeroPickContext={ordinals:null,consensusReference:null}; }\n', ''
).replace('selected,scanDate,c1ZeroPickContext);','selected,scanDate);').replace(
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
  'scanOriginInventoryChangedFunctions':v819_changed,'valuationVintageChangedFunctions':v818_changed,'shadowCohortChangedFunctions':v817_changed,'classBChangedFunctions':class_b_changed,'classBNewFunctions':class_b_new,
  'formalC1BindingCandidate':"8.20.0-formal-c1-binding-ledger" if "scripts/apply_v8_20_0.py" in scripts else None,
  'crossMidnightRecoveryCandidate':"8.20.1-cross-midnight-recovery-readback" if "scripts/apply_v8_20_1.py" in scripts else None,
  'total':len(results),'changedFunctions':changed,'protectedFunctionCount':len(before)-len(changed),
  'selectorUnchangedExceptCaptureFirewall':True,'fixtureOnly':True,'formalCoreImpact':False,'results':results}
Path('artifacts/system1-c1-c2-repair-review.json').write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
print(json.dumps(receipt),flush=True)
if any(r['exitCode'] for r in results): raise SystemExit(1)
