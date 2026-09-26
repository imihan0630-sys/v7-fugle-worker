from pathlib import Path

# V8.14.0 Class-A sector-gate provenance shadow.
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
    'const VERSION = "8.13.0-priority-score-provenance-shadow";',
    'const VERSION = "8.14.0-sector-gate-provenance-shadow";',
    "runtime version",
)

replace_once(
'''  return {
    schemaVersion:"research-market-v1",scanDate,researchOnly:true,decisionImpact:false,
    regime,marketReturn20:market20===null?null:round(market20,2),
    advanceCount:adv,declineCount:dec,flatCount:flat,
    advancePct:rows.length?round(adv/rows.length*100,2):null,
    aboveMa20Pct:features.length?round(above20/features.length*100,2):null,
    aboveMa60Pct:features.length?round(above60/features.length*100,2):null,
    newHigh20Pct:features.length?round(newHigh20/features.length*100,2):null,
    topSectors:sectors
  };''',
'''  return {
    schemaVersion:"research-market-v2-sector-universe-provenance",scanDate,researchOnly:true,decisionImpact:false,
    universe:{
      marketScope:"TWSE_TPEX_COMBINED_FORMAL_NORMALIZED",
      advanceDefinition:"FORMAL_NORMALIZED_TODAY_ROWS",
      advanceDenominator:rows.length,
      trendDefinition:"HISTORY_ADMITTED_FEATURE_ROWS",
      trendDenominator:features.length,
      formalPriceFloorApplied:true,
      nonCommonInstrumentFilterApplied:true,
      officialWholeMarketBreadth:false,
      note:"advancePct is research breadth of Formal-normalized rows, not official whole-market breadth"
    },
    regime,marketReturn20:market20===null?null:round(market20,2),
    advanceCount:adv,declineCount:dec,flatCount:flat,
    advancePct:rows.length?round(adv/rows.length*100,2):null,
    aboveMa20Pct:features.length?round(above20/features.length*100,2):null,
    aboveMa60Pct:features.length?round(above60/features.length*100,2):null,
    newHigh20Pct:features.length?round(newHigh20/features.length*100,2):null,
    topSectors:sectors
  };''',
    "market breadth universe provenance",
)

replace_once(
'''  const snapshot=buildResearchSnapshot(item,scanDate);
  snapshot.sourceCompleteness="SHADOW_PROSPECTIVE";''',
'''  const snapshot=buildResearchSnapshot(item,scanDate);
  const channelDebug=buildChannelDebug(f,sector);
  const sectorBreadth=toNumber(sector?.breadth);
  const sectorAvgChange=toNumber(sector?.avgChange);
  const sectorAmountVs20=toNumber(sector?.amountVs20DayAverage);
  const sectorGateChecks={
    breadthGte40:sectorBreadth===null?null:sectorBreadth>=40,
    avgChangeGteMinus1:sectorAvgChange===null?null:sectorAvgChange>=-1,
    amountVs20Gte0_5:sectorAmountVs20===null?null:sectorAmountVs20>=0.5
  };
  const sectorGateValues=Object.values(sectorGateChecks);
  const sectorGatePass=sectorGateValues.some(v=>v===false)?false:(sectorGateValues.every(v=>v===true)?true:null);
  snapshot.sector={
    ...(snapshot.sector||{}),
    gateProvenance:{
      auditVersion:"SECTOR_GATE_AUDIT_V0_1",
      gateVersion:"FORMAL_SECTOR_GATE_BREADTH40_AVGCHANGE_MINUS1_AMOUNT0_5",
      inputs:{breadth:sectorBreadth,avgChange:sectorAvgChange,amountVs20DayAverage:sectorAmountVs20},
      checks:sectorGateChecks,
      pass:sectorGatePass,
      thresholds:{breadthMin:40,avgChangeMin:-1,amountVs20DayAverageMin:0.5},
      pointInTimeObserved:true,
      decisionImpact:false
    }
  };
  snapshot.shadowTechnicalContext={
    A:{pass:channelDebug?.A?.pass===true,missing:Array.isArray(channelDebug?.A?.missing)?channelDebug.A.missing:[]},
    B:{pass:channelDebug?.B?.pass===true,missing:Array.isArray(channelDebug?.B?.missing)?channelDebug.B.missing:[]},
    missingCount:journalInteger(channelDebug?.missingCount),
    nearScore:journalInteger(channelDebug?.nearScore),
    fullFormalCounterfactual:false,
    note:"Technical A/B context only; this does not bypass sector gate or prove full Formal eligibility/RR.",
    researchOnly:true,
    decisionImpact:false
  };
  snapshot.sourceCompleteness="SHADOW_PROSPECTIVE";''',
    "sector gate provenance",
)

replace_once(
'''  const scoredSymbols=new Set((scored||[]).map(x=>String(x.symbol)));
  const baseCandidates=(basePoolDiagnostics||[])''',
'''  const scoredSymbols=new Set((scored||[]).map(x=>String(x.symbol)));
  const sectorGateRejected=(basePoolDiagnostics||[])
    .map(row=>({...row,result:scoreCandidate(row.f,row.sector),debug:buildChannelDebug(row.f,row.sector)}))
    .filter(row=>row.result?.ok!==true && String(row.result?.reason||"")==="產業廣度、漲幅或資金活躍度偏弱")
    .sort((a,b)=>(a.debug.missingCount-b.debug.missingCount)||(b.debug.nearScore-a.debug.nearScore)||String(a.f.symbol).localeCompare(String(b.f.symbol)));
  byPool(sectorGateRejected,6,x=>x.f).forEach((row,index)=>add(row.f,row.result,"SECTOR_GATE_REJECTED",index+1,false));

  const baseCandidates=(basePoolDiagnostics||[])''',
    "bounded sector gate rejected cohort",
)

path.write_text(text, encoding="utf-8")
print("Applied V8.14.0 sector-gate provenance shadow")
