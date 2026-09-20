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
    'const VERSION = "8.7.2-shadow-candidate-firewall";',
    'const VERSION = "8.7.3-validation-firewall";',
    "runtime version"
)

replace_once(
'''    const outcome=path?.horizons?.["d"+horizon]?.returnPct;
    return {scanDate:String(row.scan_date),symbol:String(row.symbol),snapshot:row.snapshot,outcome:Number.isFinite(outcome)?outcome:null,
      regime:row.snapshot?.market?.regime||row.market_regime||"UNKNOWN",
      sourceCompleteness:row.snapshot?.sourceCompleteness||"UNKNOWN"};''',
'''    const horizonResult=path?.horizons?.["d"+horizon]||null;
    const outcome=horizonResult?.returnPct;
    return {scanDate:String(row.scan_date),symbol:String(row.symbol),snapshot:row.snapshot,outcome:Number.isFinite(outcome)?outcome:null,
      outcomeEndDate:horizonResult?.asOfDate?String(horizonResult.asOfDate):null,
      regime:row.snapshot?.market?.regime||row.market_regime||"UNKNOWN",
      sourceCompleteness:row.snapshot?.sourceCompleteness||"UNKNOWN"};''',
    "factor outcome end date"
)

replace_once(
'''  const splitIndex=Math.max(1,Math.floor(dates.length*0.7));
  const trainDates=new Set(dates.slice(0,splitIndex)),holdoutDates=new Set(dates.slice(splitIndex));''',
'''  const splitIndex=Math.max(1,Math.floor(dates.length*0.7));
  const rawTrainDates=dates.slice(0,splitIndex);
  const holdoutDateList=dates.slice(splitIndex);
  const firstHoldoutDate=holdoutDateList[0]||null;
  const maxOutcomeEndByDate=new Map();
  for(const sample of samples) {
    if(!sample.outcomeEndDate) continue;
    const prev=maxOutcomeEndByDate.get(sample.scanDate);
    if(!prev || sample.outcomeEndDate>prev) maxOutcomeEndByDate.set(sample.scanDate,sample.outcomeEndDate);
  }
  const purgedTrainDateList=rawTrainDates.filter(date=>{
    const end=maxOutcomeEndByDate.get(date);
    return firstHoldoutDate ? Boolean(end && end<firstHoldoutDate) : true;
  });
  const purgedBoundaryDates=rawTrainDates.filter(date=>!purgedTrainDateList.includes(date));
  const trainDates=new Set(purgedTrainDateList),holdoutDates=new Set(holdoutDateList);''',
    "purged forward split"
)

replace_once(
'''    trainDates:trainDates.size,holdoutDates:holdoutDates.size,factors,
    interpretation:"因子研究只做描述與樣本外一致性檢查，不直接改正式選股分數。CONTEXT因子不以單調高低判定。",
    multipleTestingGuard:"同時研究多因子容易產生資料探勘偏誤；未達升級門檻前不將單次漂亮結果視為有效規則。歷史重建樣本可研究，但不能取代前瞻正式快照。"''',
'''    trainDates:trainDates.size,holdoutDates:holdoutDates.size,factors,
    validation:{
      method:"PURGED_FORWARD_HOLDOUT",
      horizonTradingDays:horizon,
      firstHoldoutDate,
      rawTrainDates:rawTrainDates.length,
      purgedTrainDates:purgedTrainDateList.length,
      purgedBoundaryDates,
      holdoutDates:holdoutDateList.length,
      rule:"訓練樣本的結果觀察窗必須在第一個holdout選股日前結束；跨越邊界的訓練日期直接purge，避免D+N重疊標籤偷看未來。"
    },
    multipleTesting:{
      trackedFactorDefinitions:RESEARCH_FACTOR_CATALOG.length,
      rule:"研究因子與參數變體都視為試驗次數；漂亮結果不得只挑贏家報告，後續累積足夠樣本後再導入PBO/Deflated Sharpe等多重測試校正。"
    },
    interpretation:"因子研究只做描述與樣本外一致性檢查，不直接改正式選股分數。CONTEXT因子不以單調高低判定。",
    multipleTestingGuard:"同時研究多因子容易產生資料探勘偏誤；未達升級門檻前不將單次漂亮結果視為有效規則。歷史重建樣本可研究，但不能取代前瞻正式快照。"''',
    "validation metadata"
)

replace_once(
'''  if((study?.holdoutDates||0)<5) reasons.push("樣本外期間少於5個選股日");''',
'''  if(study?.validation?.method!=="PURGED_FORWARD_HOLDOUT") reasons.push("尚未使用purged forward holdout防止重疊標籤洩漏");
  if((study?.trainDates||0)<10) reasons.push("purge後訓練選股日少於10個");
  if((study?.holdoutDates||0)<5) reasons.push("樣本外期間少於5個選股日");''',
    "promotion validation gate"
)

replace_once(
'''    completenessAudit,shadowCandidates,pathPerformance:paths,factorStudy:study,promotionGate:promotion,
    hypotheses:RESEARCH_FACTOR_CATALOG''',
'''    completenessAudit,shadowCandidates,pathPerformance:paths,factorStudy:study,promotionGate:promotion,
    validationFirewall:{
      method:study?.validation?.method||null,
      overlapPurge:study?.validation||null,
      multipleTesting:study?.multipleTesting||null,
      formalCoreImpact:false
    },
    hypotheses:RESEARCH_FACTOR_CATALOG''',
    "dashboard validation firewall"
)

replace_once(
'''  <div class="panel"><h2>Shadow 對照樣本</h2><div id="shadow" class="muted"></div></div>
  <div class="panel"><h2>選股後路徑</h2>''',
'''  <div class="panel"><h2>Shadow 對照樣本</h2><div id="shadow" class="muted"></div></div>
  <div class="panel"><h2>驗證防火牆</h2><div id="validation" class="muted"></div></div>
  <div class="panel"><h2>選股後路徑</h2>''',
    "validation firewall UI"
)

replace_once(
'''    const sh=d.shadowCandidates||{};document.getElementById("shadow").innerHTML="累積 "+esc(sh.total||0)+" 筆／"+esc(sh.dates||0)+" 個選股日｜"+esc(Object.entries(sh.byCohort||{}).map(x=>x[0]+" "+x[1]).join("｜")||"等待下一個正式盤後選股日")+"<br>"+esc(sh.policy||"");
    const ps=d.pathPerformance?.summary?.horizons||{};''',
'''    const sh=d.shadowCandidates||{};document.getElementById("shadow").innerHTML="累積 "+esc(sh.total||0)+" 筆／"+esc(sh.dates||0)+" 個選股日｜"+esc(Object.entries(sh.byCohort||{}).map(x=>x[0]+" "+x[1]).join("｜")||"等待下一個正式盤後選股日")+"<br>"+esc(sh.policy||"");
    const vf=d.validationFirewall||{},pv=vf.overlapPurge||{},mt=vf.multipleTesting||{};
    document.getElementById("validation").innerHTML="方法："+esc(vf.method||"-")+"｜原訓練日 "+esc(pv.rawTrainDates??"-")+"｜purge後 "+esc(pv.purgedTrainDates??"-")+"｜邊界剔除 "+esc((pv.purgedBoundaryDates||[]).length)+"｜holdout "+esc(pv.holdoutDates??"-")+"<br>目前追蹤因子定義："+esc(mt.trackedFactorDefinitions??"-")+"｜正式核心影響：0<br>"+esc(pv.rule||"")+"<br>"+esc(mt.rule||"");
    const ps=d.pathPerformance?.summary?.horizons||{};''',
    "render validation firewall"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.3 purged validation firewall")
