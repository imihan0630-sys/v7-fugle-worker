from pathlib import Path

# V8.15.0 Class-A valuation-gate provenance shadow.
# Research-only persistence. No Formal selection/ranking/capital/signal/push logic changes.

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.14.0-sector-gate-provenance-shadow";',
    'const VERSION = "8.15.0-valuation-gate-provenance-shadow";',
    "runtime version"
)

replace_once(
'''  const snapshot=buildResearchSnapshot(item,scanDate);
  const channelDebug=buildChannelDebug(f,sector);''',
'''  const snapshot=buildResearchSnapshot(item,scanDate);
  const pe=toNumber(f?.pe), pb=toNumber(f?.pb);
  const sectorPositivePe=(sector?.items||[]).map(x=>toNumber(x?.pe)).filter(x=>x!==null&&x>0);
  const sectorMedianPe=sectorPositivePe.length>=3?median(sectorPositivePe):null;
  const relativePe=(pe!==null&&pe>0&&sectorMedianPe!==null&&sectorMedianPe>0)?pe/sectorMedianPe:null;
  const revenueQuarterYoY=toNumber(f?.revenueQuarterYoY);
  const epsYoY=toNumber(f?.epsYoY);
  const growthException=(revenueQuarterYoY!==null&&revenueQuarterYoY>25)||(epsYoY!==null&&epsYoY>25);
  const gateEvaluable=relativePe!==null;
  snapshot.valuationGateProvenance={
    auditVersion:"VALUATION_GATE_AUDIT_V0_1",
    gateVersion:"FORMAL_RELATIVE_PE_2_5_GROWTH_25",
    stockPe:pe,stockPb:pb,
    valuationObserved:f?.valuationObserved===true,
    valuationDate:f?.valuationDate||null,
    valuationSource:f?.valuationSource||null,
    sectorMedianPe,
    positivePePeerCount:sectorPositivePe.length,
    relativePe:relativePe===null?null:round(relativePe,4),
    revenueQuarterYoY,epsYoY,growthException,
    gateEvaluable,
    wouldRejectCurrentRule:gateEvaluable?(relativePe>2.5&&!growthException):null,
    thresholds:{relativePeMax:2.5,growthExceptionPct:25,minPositivePePeers:3},
    pointInTimeObserved:true,
    decisionImpact:false,
    pbSubstitutesForMissingPe:false
  };
  const channelDebug=buildChannelDebug(f,sector);''',
    "valuation provenance"
)

replace_once(
'''  const sectorGateRejected=(basePoolDiagnostics||[])
    .map(row=>({...row,result:scoreCandidate(row.f,row.sector),debug:buildChannelDebug(row.f,row.sector)}))''',
'''  const valuationRejected=(basePoolDiagnostics||[])
    .map(row=>({...row,result:scoreCandidate(row.f,row.sector),debug:buildChannelDebug(row.f,row.sector)}))
    .filter(row=>row.result?.ok!==true && String(row.result?.reason||"")==="相對本產業估值過高且成長不足")
    .sort((a,b)=>(a.debug.missingCount-b.debug.missingCount)||(b.debug.nearScore-a.debug.nearScore)||String(a.f.symbol).localeCompare(String(b.f.symbol)));
  byPool(valuationRejected,6,x=>x.f).forEach((row,index)=>add(row.f,row.result,"VALUATION_REJECTED",index+1,false));

  const sectorGateRejected=(basePoolDiagnostics||[])
    .map(row=>({...row,result:scoreCandidate(row.f,row.sector),debug:buildChannelDebug(row.f,row.sector)}))''',
    "valuation rejected cohort"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.15.0 valuation-gate provenance shadow")
