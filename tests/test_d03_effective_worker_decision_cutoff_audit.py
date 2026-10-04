from pathlib import Path
import re, json

path=Path("Worker-review.mjs")
if not path.exists():
    raise SystemExit("Worker-review.mjs missing; run C1/C2 repair review first")
text=path.read_text(encoding="utf-8")

def function_body(name):
    marker=re.search(rf'^(?:async )?function {re.escape(name)}\(',text,re.M)
    if not marker:
        raise SystemExit(f"function missing: {name}")
    start=marker.start()
    brace=text.find("{",marker.end()-1)
    depth=0
    quote=None
    escape=False
    backtick=chr(96)
    for i in range(brace,len(text)):
        ch=text[i]
        if quote:
            if escape: escape=False
            elif ch=="\\": escape=True
            elif ch==quote: quote=None
            continue
        if ch in ("'", '"', backtick):
            quote=ch
            continue
        if ch=="{": depth+=1
        elif ch=="}":
            depth-=1
            if depth==0:
                return text[start:i+1]
    raise SystemExit(f"unterminated function: {name}")

core=function_body("runAfterMarketScanCore")
selector=function_body("selectTomorrowCandidates")
c1=function_body("buildC1PopulationReceipt")

budget_anchor='const storedBudget = await env.STOCKS_KV.get(KV_KEY, "json");'
capital_anchor='const totalCapital = positiveNumber(storedBudget?.totalCapital) || positiveNumber(env.V7_TOTAL_CAPITAL) || DEFAULT_TOTAL_CAPITAL;'
selection_anchor='const scan = selectTomorrowCandidates('

for anchor in [budget_anchor,capital_anchor,selection_anchor]:
    if core.count(anchor)!=1:
        raise SystemExit(f"anchor count !=1: {anchor}")

budget_i=core.index(budget_anchor)
capital_i=core.index(capital_anchor)
select_i=core.index(selection_anchor)
if not (budget_i < capital_i < select_i):
    raise SystemExit("unexpected budget/capital/selection ordering")

between=core[capital_i+len(capital_anchor):select_i]
for forbidden in ["await ","fetch(","STOCKS_KV.get","V7_DB.","fetchWithDeadline("]:
    if forbidden in between:
        raise SystemExit("external/async read between final capital input and selector: "+forbidden)

if selector.lstrip().startswith("async function"):
    raise SystemExit("selector unexpectedly async")
for forbidden in ["await ","fetch(","fetchWithDeadline(","STOCKS_KV.get","V7_DB."]:
    if forbidden in selector:
        raise SystemExit("selector contains external/async read: "+forbidden)

if 'const decisionAt=new Date().toISOString();' not in c1:
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
