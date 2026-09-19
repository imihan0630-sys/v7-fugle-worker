from pathlib import Path

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count=text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text=text.replace(old,new,1)


replace_once(
    'const VERSION = "8.1.0-ops-hardening";',
    'const VERSION = "8.1.1-acceptance-ledger";',
    "runtime version",
)

replace_once(
'''  const recorded=Array.isArray(latest?.diagnostics?.requirements30?.incompleteRules)
    ? latest.diagnostics.requirements30.incompleteRules.map(Number).filter(rule=>rule>=1 && rule<=30)
    : [17,18,19,27,28,29];
  const incompleteRules=[...new Set(recorded)].sort((a,b)=>a-b);
  const rules=Array.from({length:30},(_,index)=>{
    const rule=index+1;
    return {rule,label:requirementLabel(rule),status:incompleteRules.includes(rule)?"PENDING_ACCEPTANCE":"VERIFIED"};
  });''',
'''  const recorded=Array.isArray(latest?.diagnostics?.requirements30?.incompleteRules)
    ? latest.diagnostics.requirements30.incompleteRules.map(Number).filter(rule=>rule>=1 && rule<=30)
    : [17,18,19,27,28,29];
  // 歷史盤後快照不會因後續獨立驗收而重寫；以正式驗收帳本覆蓋已完成的舊缺口，
  // 避免總控頁把已驗收項目（例如第11項）重新顯示成未完成。
  const acceptanceLedger={
    11:{
      verified:true,
      acceptedVersion:"8.0.1-requirement11-q4-eps",
      acceptedDate:"2026-09-19",
      evidence:"Q1-Q4單季EPS路徑、YoY/QoQ、營收/毛利/營益、估值與官方公告資料已完成正式唯讀驗收"
    },
    26:{
      verified:latest?.diagnostics?.requirements30?.requirement26?.complete===true &&
        latest?.pipeline?.threeMinAccepted===true && latest?.pipeline?.threeMinVerified===true,
      acceptedVersion:"8.0.4-3min-current-plan-recovery",
      acceptedDate:"2026-09-19",
      evidence:"目前有效V7_PLAN_2已由3Min正式接受並精確readback"
    }
  };
  const incompleteRules=[...new Set(recorded.filter(rule=>acceptanceLedger[rule]?.verified!==true))].sort((a,b)=>a-b);
  const rules=Array.from({length:30},(_,index)=>{
    const rule=index+1;
    return {
      rule,
      label:requirementLabel(rule),
      status:incompleteRules.includes(rule)?"PENDING_ACCEPTANCE":"VERIFIED",
      acceptance:acceptanceLedger[rule] || null
    };
  });''',
    "acceptance ledger",
)

replace_once(
'''      incompleteRules,
      rules
    },''',
'''      incompleteRules,
      rules,
      acceptanceLedger
    },''',
    "overview ledger output",
)

path.write_text(text,encoding="utf-8")
print("Applied V8.1.1 acceptance ledger")
