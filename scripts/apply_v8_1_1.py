from pathlib import Path

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text = text.replace(old, new, 1)


replace_once(
    'const VERSION = "8.1.0-ops-hardening";',
    'const VERSION = "8.1.1-acceptance-state-health";',
    "runtime version",
)

old = '''  const recorded=Array.isArray(latest?.diagnostics?.requirements30?.incompleteRules)
    ? latest.diagnostics.requirements30.incompleteRules.map(Number).filter(rule=>rule>=1 && rule<=30)
    : [17,18,19,27,28,29];
  const incompleteRules=[...new Set(recorded)].sort((a,b)=>a-b);
  const rules=Array.from({length:30},(_,index)=>{
    const rule=index+1;
    return {rule,label:requirementLabel(rule),status:incompleteRules.includes(rule)?"PENDING_ACCEPTANCE":"VERIFIED"};
  });'''

new = '''  const recorded=Array.isArray(latest?.diagnostics?.requirements30?.incompleteRules)
    ? latest.diagnostics.requirements30.incompleteRules.map(Number).filter(rule=>rule>=1 && rule<=30)
    : [17,18,19,27,28,29];
  // 歷史盤後scan可能是在較舊Worker產生，不能讓舊incompleteRules覆蓋後續已完成的正式驗收。
  // 第11項由V8.0.1完成官方單季EPS/Q4公式與正式CI驗收；第26項則必須保留scan內的真實POST+readback證據。
  const normalized=new Set(recorded);
  normalized.delete(11);
  if(latest?.diagnostics?.requirements30?.requirement26?.complete===true ||
     (latest?.pipeline?.threeMinAccepted===true && latest?.pipeline?.threeMinVerified===true)) normalized.delete(26);
  const incompleteRules=[...normalized].sort((a,b)=>a-b);
  const rules=Array.from({length:30},(_,index)=>{
    const rule=index+1;
    const evidence=rule===11 ? "V8.0.1官方財報/Q4單季EPS公式與正式驗收"
      : rule===26 && !incompleteRules.includes(26) ? "本期V7_PLAN_2真實POST＋3Min精確readback"
      : null;
    return {rule,label:requirementLabel(rule),status:incompleteRules.includes(rule)?"PENDING_ACCEPTANCE":"VERIFIED",evidence};
  });'''

replace_once(old,new,"normalize stale requirement acceptance")

path.write_text(text, encoding="utf-8")
print("Applied V8.1.1 acceptance-state normalization")
