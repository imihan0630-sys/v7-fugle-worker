from pathlib import Path

# V8.13.0 Class-A PriorityScore provenance shadow.
# Research-only persistence. No Formal selection/ranking/capital/signal/push logic changes.

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")

def replace_once(old, new, label):
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text = text.replace(old, new, 1)

replace_once(
    'const VERSION = "8.12.0-history-source-revalidation-v2-3";',
    'const VERSION = "8.13.0-priority-score-provenance-shadow";',
    "runtime version",
)

replace_once(
'''    signalLevel:item?.signalLevel||null,
    market,''',
'''    signalLevel:item?.signalLevel||null,
    ranking:{
      priorityScore:toNumber(item?.priorityScore),
      rewardPerRisk:toNumber(item?.rewardPerRisk),
      rewardRisk:toNumber(item?.rewardRisk),
      marketConsensusScore:toNumber(item?.marketConsensusScore),
      marketConsensusSources:Number(item?.marketConsensusSources||0),
      marketConsensusBonus:toNumber(item?.marketConsensusBonus)||0,
      setupQuality:toNumber(item?.setupQuality),
      sectorFlow:toNumber(item?.sectorFlow),
      relativeStrength:toNumber(item?.relativeStrength),
      definitionVersion:"FORMAL_PRIORITY_SCORE_BASE_V1_PLUS_MARKET_CONSENSUS_7_5_30",
      comparatorVersion:"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30",
      pointInTimeObserved:true,
      decisionImpact:false
    },
    market,''',
    "priority-score research provenance",
)

path.write_text(text, encoding="utf-8")
print("Applied V8.13.0 PriorityScore provenance shadow")
