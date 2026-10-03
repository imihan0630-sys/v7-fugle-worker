from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.15.3-c3-quote-context";',
    'const VERSION = "8.15.4-c4-priority-provenance";',
    "version"
)

replace_once(
'''        ok:result.ok===true,firstFailure:result.ok===true?null:String(result.reason||""),
        basePassed:result.basePassed===true,rrPassed:result.rrPassed===true,
        selected:selectedRanks.has(symbol),selectedRank:selectedRanks.get(symbol)||null''',
'''        ok:result.ok===true,firstFailure:result.ok===true?null:String(result.reason||""),
        basePassed:result.basePassed===true,rrPassed:result.rrPassed===true,
        priorityScore:c1Number(result.priorityScore),
        priorityScoreProvenance:"FORMAL_RUNTIME_RESULT_AT_C1_DECISION",
        selected:selectedRanks.has(symbol),selectedRank:selectedRanks.get(symbol)||null''',
    "C1 formal priority score provenance"
)

path.write_text(text.replace("\r\n","\n"),encoding="utf-8",newline="\n")
print("Applied V8.15.4 C4 priority-score provenance; Formal ranking unchanged")
