from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.9.5-hybrid-watch-directional";',
    'const VERSION = "8.9.6-hybrid-watch-audit";',
    "runtime version"
)

replace_once(
'''        symbol:String(f.symbol||""),name:f.name||"",strictReason:String(result.reason||""),
        watchEligible:Boolean(watch),close:toNumber(f.close),ma20:toNumber(f.ma20),
        ret5:toNumber(f.ret5),ret20:toNumber(f.ret20),avgVolume20Lots:toNumber(f.avgVolume20Lots),
        fundamentalScore:round(fundamentalScore(f),1),smartMoneyScore:round(institutionalScore(f),1),''',
'''        symbol:String(f.symbol||""),name:f.name||"",industry:f.industry||"未分類",strictReason:String(result.reason||""),
        watchEligible:Boolean(watch),close:toNumber(f.close),ma20:toNumber(f.ma20),
        ma20DistancePct:(positiveNumber(f.close)&&positiveNumber(f.ma20))?round((f.close/f.ma20-1)*100,2):null,
        ret5:toNumber(f.ret5),ret20:toNumber(f.ret20),avgVolume20Lots:toNumber(f.avgVolume20Lots),
        sectorBreadth:toNumber(sector?.breadth),sectorAvgChange:toNumber(sector?.avgChange),sectorScore:toNumber(sector?.score),
        nearestResistance:(()=>{const e=positiveNumber(f.close);return e?nearestRealResistance(f,e):null;})(),
        nearestUpsidePct:(()=>{const e=positiveNumber(f.close),r=e?nearestRealResistance(f,e):null;return e&&r?round((r/e-1)*100,2):null;})(),
        fundamentalScore:round(fundamentalScore(f),1),smartMoneyScore:round(institutionalScore(f),1),''',
"Hybrid WATCH detailed audit"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.9.6 Hybrid WATCH detailed audit")
