from pathlib import Path
import re, json

path=Path("Worker-review.mjs")
if not path.exists():
    raise SystemExit("Worker-review.mjs missing; run C1/C2 repair review first")
text=path.read_text(encoding="utf-8")

def function_body(name):
    lines=text.splitlines()
    start=None
    pattern=re.compile(rf'^(?:async )?function {re.escape(name)}\(')
    function_start=re.compile(r'^(?:async )?function \w+\(')
    for i,line in enumerate(lines):
        if pattern.search(line):
            start=i
            break
    if start is None:
        raise SystemExit(f"function missing: {name}")
    stop=len(lines)
    for i in range(start+1,len(lines)):
        if function_start.search(lines[i]):
            stop=i
            break
    return "\n".join(lines[start:stop])

core=function_body("runAfterMarketScanCore")
selector=function_body("selectTomorrowCandidates")
c1=function_body("buildC1PopulationReceipt")

budget_matches=list(re.finditer(r'const\s+storedBudget\s*=\s*await\s+env\.STOCKS_KV\.get\(\s*KV_KEY\s*,\s*["\' ]?json["\' ]?\s*\)',core))
capital_matches=list(re.finditer(r'const\s+totalCapital\s*=\s*positiveNumber\(storedBudget\?\.totalCapital\).*?DEFAULT_TOTAL_CAPITAL\s*;',core,re.S))
selection_matches=list(re.finditer(r'const\s+scan\s*=\s*selectTomorrowCandidates\s*\(',core))

if len(budget_matches)!=1:
    raise SystemExit("storedBudget semantic anchor count !=1: "+str(len(budget_matches)))
if len(capital_matches)!=1:
    raise SystemExit("totalCapital semantic anchor count !=1: "+str(len(capital_matches)))
if len(selection_matches)!=1:
    raise SystemExit("selection semantic anchor count !=1: "+str(len(selection_matches)))

budget_i=budget_matches[0].start()
capital_i=capital_matches[0].start()
capital_end=capital_matches[0].end()
select_i=selection_matches[0].start()
if not (budget_i < capital_i < select_i):
    raise SystemExit("unexpected budget/capital/selection ordering")

between=core[capital_end:select_i]
for forbidden in ["await ","fetch(","STOCKS_KV.get","V7_DB.","fetchWithDeadline("]:
    if forbidden in between:
        print("----- BETWEEN FINAL CAPITAL INPUT AND SELECTOR -----")
        print(between)
        raise SystemExit("external/async read between final capital input and selector: "+forbidden)

if selector.lstrip().startswith("async function"):
    raise SystemExit("selector unexpectedly async")
for forbidden in ["await ","fetch(","fetchWithDeadline(","STOCKS_KV.get","V7_DB."]:
    if forbidden in selector:
        raise SystemExit("selector contains external/async read: "+forbidden)

if not re.search(r'const\s+decisionAt\s*=\s*new\s+Date\(\)\.toISOString\(\)\s*;',c1):
    raise SystemExit("C1 decisionAt receipt stamp missing")
if "decisionCutoffAt" in c1:
    raise SystemExit("decisionCutoffAt already exists in effective C1; audit expectation stale")

c1_call='buildC1PopulationReceipt('
call_pos=selector.rfind(c1_call)
if call_pos<0:
    raise SystemExit("C1 build call missing from selector")
formal_map_pos=selector.find("c1FormalResults")
if formal_map_pos<0 or formal_map_pos>call_pos:
    raise SystemExit("C1 call not downstream of formal result capture")

receipt={
  "schemaVersion":"D03_EFFECTIVE_WORKER_DECISION_CUTOFF_AUDIT_V0_1",
  "status":"PASS",
  "effectiveWorkerVersion":re.search(r'const VERSION = "([^"]+)";',text).group(1),
  "finalFormalAsyncInput":"STOCKS_KV total-capital read",
  "candidateCutoffAnchor":"immediately after totalCapital resolution and immediately before selectTomorrowCandidates call",
  "asyncOrExternalReadsBetweenAnchorAndSelector":0,
  "selectorIsSynchronous":True,
  "selectorExternalReadsObserved":False,
  "c1DecisionAtExists":True,
  "c1DecisionCutoffAtExists":False,
  "c1BuildDownstreamOfFormalResultCapture":True,
  "decisionAtMaySubstituteForCutoff":False,
  "productionMutationPerformed":False,
  "formalCoreImpact":False
}
print(json.dumps(receipt,ensure_ascii=False,indent=2))
