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
    'const VERSION = "8.9.3-hybrid-watch-layer";',
    'const VERSION = "8.9.4-hybrid-watch-consensus";',
    "runtime version"
)

old=r'''function scoreHybridWatchCandidate(f,sector,strictReason) {
  if (!["早期價格接受尚未成立","Hybrid綜合信心低於B級"].includes(String(strictReason||""))) return null;
  const entry=positiveNumber(f.close),ma20=positiveNumber(f.ma20);
  if (!entry || !ma20) return null;

  const ret5=toNumber(f.ret5) ?? 0;
  const ret20=toNumber(f.ret20) ?? 0;
  const change=toNumber(f.changePercent) ?? 0;
  const volumeRatio=toNumber(f.volumeTodayVsPrev5) ?? 0;
  const closePos=toNumber(f.dailyClosePosition) ?? 0.5;
  const upperShadow=toNumber(f.dailyUpperShadowRatio) ?? 0;
  if (ret5>18 || ret20>30 || change>=9.5 || volumeRatio>2.8 || upperShadow>0.38) return null;
  if (ret20<-12 || entry<ma20*0.97) return null;
  if (Number.isFinite(sector?.breadth) && sector.breadth<35) return null;
  if (Number.isFinite(sector?.avgChange) && sector.avgChange<-1.5) return null;

  const target=nearestRealResistance(f,entry);
  if (target===null || target<=entry) return null;
  const upsidePct=(target/entry-1)*100;
  if (upsidePct<10) return null;

  const fundamental=fundamentalScore(f),inst=institutionalScore(f);
  if (financialDataCount(f)<3 || fundamental<45 || inst<45) return null;

  const triggerPrice=Math.max(ma20, strictReason==="Hybrid綜合信心低於B級" ? entry*1.005 : entry);
  const maxChase=Math.min(entry*1.03,target*0.97);
  if (!(maxChase>=triggerPrice)) return null;

  const atr=Math.max(entry*0.02,((toNumber(f.atrPercent)||0)/100)*entry);
  const structureLow=positiveNumber(f.recentLow5Prev)||ma20;
  let stop=Math.min(ma20*0.975,structureLow-atr*0.10);
  if (!(stop>0 && stop<entry)) stop=entry*0.94;

  const watchScore=clamp(fundamental*0.40+inst*0.40+Math.min(100,50+upsidePct*2)*0.20,0,100);
  const missingCondition = strictReason==="早期價格接受尚未成立"
    ? "等待價格接受：15分K站穩關鍵價、守低且強收"
    : "等待最後價格確認：15分K轉強且不追高";
  return {
    ...f,mode:"HYBRID",channel:"H",watchState:"HYBRID_WATCH",watchReason:strictReason,
    watchScore:round(watchScore,1),referenceClose:entry,
    watchTriggerPrice:round(triggerPrice,2),watchMaxChase:round(maxChase,2),
    watchStop:round(stop,2),watchTarget:round(target,2),hybridUpsidePct:round(upsidePct,1),
    hybridFundamentalScore:round(fundamental,1),hybridSmartMoneyScore:round(inst,1),
    missingCondition,
    selectedReason:"Hybrid WATCH｜基本面與Smart Money已通過；"+missingCondition+"；剩餘空間"+round(upsidePct,1)+"%"
  };
}'''

new=r'''function scoreHybridWatchCandidate(f,sector,strictReason) {
  const reason=String(strictReason||"");
  const allowed=new Set(["Smart Money持續性不足","尚未出現價格接受","早期價格接受尚未成立","Hybrid綜合信心低於B級"]);
  if (!allowed.has(reason)) return null;

  const entry=positiveNumber(f.close),ma20=positiveNumber(f.ma20);
  if (!entry || !ma20) return null;

  // WATCH可以比正式Hybrid早一步，但不能把資料缺漏、流動性差、過熱或重大風險股收進來。
  if ((f.historyDays||0)<60 || toNumber(f.marketCapYi)===null || f.marketCapYi<30) return null;
  if ((toNumber(f.avgVolume20Lots)||0)<300 || toNumber(f.chipConcentration)===null) return null;
  if (!(f.quarterRevenue>0) || !f.financialBasis || f.valuationObserved!==true || f.announcementsVerified!==true) return null;
  if ((f.officialAnnouncements||[]).some(item=>/停止交易|重大損失|重整|退票|財報不實/.test(item.title))) return null;

  const fundamental=fundamentalScore(f),inst=institutionalScore(f);
  if (financialDataCount(f)<3 || fundamental<45 || inst<45) return null;

  const foreignDays=toNumber(f.foreignBuyDays)||0;
  const trustDays=toNumber(f.trustBuyDays)||0;
  const dealerDays=toNumber(f.dealerBuyDays)||0;
  const net=toNumber(f.institutionTotalNet)||0;
  const smartMoneyPersistent=foreignDays>=2 || trustDays>=2 || dealerDays>=3 || (inst>=55 && net>0);
  const smartMoneyForming=net>0 || foreignDays>=1 || trustDays>=1 || dealerDays>=2;

  // 正式Hybrid仍要求「持續性」；只有WATCH可接受「共識形成中」，而且仍須有正向法人證據。
  if (reason==="Smart Money持續性不足" && (!smartMoneyForming || smartMoneyPersistent)) return null;
  if (reason!=="Smart Money持續性不足" && !smartMoneyPersistent) return null;

  const ret5=toNumber(f.ret5) ?? 0;
  const ret20=toNumber(f.ret20) ?? 0;
  const change=toNumber(f.changePercent) ?? 0;
  const volumeRatio=toNumber(f.volumeTodayVsPrev5) ?? 0;
  const closePos=toNumber(f.dailyClosePosition) ?? 0.5;
  const upperShadow=toNumber(f.dailyUpperShadowRatio) ?? 0;
  if (ret5>18 || ret20>30 || change>=9.5 || volumeRatio>2.8 || upperShadow>0.38) return null;
  if (ret20<-12 || entry<ma20*0.97) return null;
  if (Number.isFinite(sector?.breadth) && sector.breadth<35) return null;
  if (Number.isFinite(sector?.avgChange) && sector.avgChange<-1.5) return null;

  const target=nearestRealResistance(f,entry);
  if (target===null || target<=entry) return null;
  const upsidePct=(target/entry-1)*100;
  if (upsidePct<10) return null;

  const triggerMultiplier=reason==="Smart Money持續性不足" ? 1.005 :
    reason==="尚未出現價格接受" ? 1.01 :
    reason==="Hybrid綜合信心低於B級" ? 1.005 : 1;
  const triggerPrice=Math.max(ma20,entry*triggerMultiplier);
  const maxChase=Math.min(entry*1.03,target*0.97);
  if (!(maxChase>=triggerPrice)) return null;

  const atr=Math.max(entry*0.02,((toNumber(f.atrPercent)||0)/100)*entry);
  const structureLow=positiveNumber(f.recentLow5Prev)||ma20;
  let stop=Math.min(ma20*0.975,structureLow-atr*0.10);
  if (!(stop>0 && stop<entry)) stop=entry*0.94;

  const upsideScore=Math.min(100,50+upsidePct*2);
  const formingPenalty=reason==="Smart Money持續性不足" ? 6 : 0;
  const watchScore=clamp(fundamental*0.40+inst*0.40+upsideScore*0.20-formingPenalty,0,100);
  const missingCondition =
    reason==="Smart Money持續性不足" ? "Smart Money共識形成中：已有正向法人證據，等待15分K價格確認" :
    reason==="尚未出現價格接受" ? "等待價格修復：15分K站回關鍵價並守低強收" :
    reason==="早期價格接受尚未成立" ? "等待價格接受：15分K站穩關鍵價、守低且強收" :
    "等待最後價格確認：15分K轉強且不追高";
  const smartMoneyLabel=reason==="Smart Money持續性不足"
    ? "Smart Money共識形成中"
    : "Smart Money持續性已通過";

  return {
    ...f,mode:"HYBRID",channel:"H",watchState:"HYBRID_WATCH",watchReason:reason,
    watchScore:round(watchScore,1),referenceClose:entry,
    watchTriggerPrice:round(triggerPrice,2),watchMaxChase:round(maxChase,2),
    watchStop:round(stop,2),watchTarget:round(target,2),hybridUpsidePct:round(upsidePct,1),
    hybridFundamentalScore:round(fundamental,1),hybridSmartMoneyScore:round(inst,1),
    hybridSmartMoneyPersistent:smartMoneyPersistent,hybridSmartMoneyForming:smartMoneyForming,
    foreignBuyDays:foreignDays,trustBuyDays:trustDays,dealerBuyDays:dealerDays,institutionTotalNet:net,
    missingCondition,
    selectedReason:"Hybrid WATCH｜基本面"+round(fundamental,1)+"分；"+smartMoneyLabel+"（資金分"+round(inst,1)+"／外資"+foreignDays+"日／投信"+trustDays+"日／法人淨額"+round(net,1)+"）；"+missingCondition+"；剩餘空間"+round(upsidePct,1)+"%"
  };
}'''

replace_once(old,new,"Hybrid WATCH forming-consensus logic")

replace_once(
'''  const hybridScored=[];
  const hybridWatchScored=[];
  const hybridExclusions={};''',
'''  const hybridScored=[];
  const hybridWatchScored=[];
  const hybridWatchAudit=[];
  const hybridExclusions={};''',
"Hybrid WATCH audit init"
)

replace_once(
'''      const watch=scoreHybridWatchCandidate(f,sector,result.reason);
      if (watch) hybridWatchScored.push(watch);
      continue;''',
'''      const watch=scoreHybridWatchCandidate(f,sector,result.reason);
      hybridWatchAudit.push({
        symbol:String(f.symbol||""),name:f.name||"",strictReason:String(result.reason||""),
        watchEligible:Boolean(watch),close:toNumber(f.close),ma20:toNumber(f.ma20),
        ret5:toNumber(f.ret5),ret20:toNumber(f.ret20),avgVolume20Lots:toNumber(f.avgVolume20Lots),
        fundamentalScore:round(fundamentalScore(f),1),smartMoneyScore:round(institutionalScore(f),1),
        foreignBuyDays:toNumber(f.foreignBuyDays)||0,trustBuyDays:toNumber(f.trustBuyDays)||0,
        dealerBuyDays:toNumber(f.dealerBuyDays)||0,institutionTotalNet:toNumber(f.institutionTotalNet)||0,
        watchScore:watch?.watchScore??null,triggerPrice:watch?.watchTriggerPrice??null,
        upsidePct:watch?.hybridUpsidePct??null
      });
      if (watch) hybridWatchScored.push(watch);
      continue;''',
"Hybrid WATCH audit rows"
)

replace_once(
'''  diagnostics.hybridWatch = {
    state:"HYBRID_WATCH",count:hybridWatchPlans.length,max:HYBRID_WATCH_MAX,occupiesHybridSlot:false,capitalReserved:0,
    shortlist:hybridWatchPlans.map(x=>({rank:x.rank,symbol:x.symbol,name:x.name,watchScore:x.watchScore,
      triggerPrice:x.triggerPrice,maxChase:x.maxChase,stop:x.stop,profitCheck:x.profitCheck,
      missingCondition:x.missingCondition,watchReason:x.watchReason})),
    policy:"基本面＋Smart Money＋剩餘空間先通過；只差價格確認者進WATCH。WATCH不占3席、不占20萬；15分K確認後才升級。"
  };''',
'''  diagnostics.hybridWatch = {
    state:"HYBRID_WATCH",count:hybridWatchPlans.length,max:HYBRID_WATCH_MAX,occupiesHybridSlot:false,capitalReserved:0,
    shortlist:hybridWatchPlans.map(x=>({rank:x.rank,symbol:x.symbol,name:x.name,watchScore:x.watchScore,
      triggerPrice:x.triggerPrice,maxChase:x.maxChase,stop:x.stop,profitCheck:x.profitCheck,
      missingCondition:x.missingCondition,watchReason:x.watchReason})),
    audit:hybridWatchAudit
      .sort((a,b)=>(Number(b.watchEligible)-Number(a.watchEligible))||(b.watchScore||-1)-(a.watchScore||-1)||String(a.symbol).localeCompare(String(b.symbol)))
      .slice(0,60),
    policy:"正式Hybrid仍要求Smart Money持續性；WATCH允許『共識形成中』但必須已有正向法人證據、基本面>=45、Smart Money>=45、剩餘空間>=10%且不得過熱。WATCH不占3席、不占20萬；15分K確認後才升級。"
  };''',
"Hybrid WATCH diagnostics policy"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.9.4 Hybrid WATCH forming-consensus refinement")
