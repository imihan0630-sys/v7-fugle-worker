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
    'const VERSION = "8.9.4-hybrid-watch-consensus";',
    'const VERSION = "8.9.5-hybrid-watch-directional";',
    "runtime version"
)

replace_once(
'''  const fundamental=fundamentalScore(f),inst=institutionalScore(f);
  if (financialDataCount(f)<3 || fundamental<45 || inst<45) return null;

  const foreignDays=toNumber(f.foreignBuyDays)||0;
  const trustDays=toNumber(f.trustBuyDays)||0;
  const dealerDays=toNumber(f.dealerBuyDays)||0;
  const net=toNumber(f.institutionTotalNet)||0;
  const smartMoneyPersistent=foreignDays>=2 || trustDays>=2 || dealerDays>=3 || (inst>=55 && net>0);
  const smartMoneyForming=net>0 || foreignDays>=1 || trustDays>=1 || dealerDays>=2;

  // 正式Hybrid仍要求「持續性」；只有WATCH可接受「共識形成中」，而且仍須有正向法人證據。
  if (reason==="Smart Money持續性不足" && (!smartMoneyForming || smartMoneyPersistent)) return null;
  if (reason!=="Smart Money持續性不足" && !smartMoneyPersistent) return null;''',
'''  const fundamental=fundamentalScore(f),inst=institutionalScore(f);
  if (financialDataCount(f)<3 || fundamental<45) return null;

  const foreignDays=toNumber(f.foreignBuyDays)||0;
  const trustDays=toNumber(f.trustBuyDays)||0;
  const dealerDays=toNumber(f.dealerBuyDays)||0;
  const net=toNumber(f.institutionTotalNet)||0;
  const smartMoneyPersistent=foreignDays>=2 || trustDays>=2 || dealerDays>=3 || (inst>=55 && net>0);
  // WATCH刻意把「方向／持續」與正式Hybrid的「強度分數」拆開：
  // 已連買且總法人淨額為正，代表共識正在形成；綜合強度不足仍不得直接進正式Hybrid。
  const smartMoneyDirectional=net>0 && (foreignDays>=2 || trustDays>=2 || dealerDays>=3);
  const smartMoneyEarly=net>0 && inst>=45 && (foreignDays>=1 || trustDays>=1 || dealerDays>=2);
  const smartMoneyForming=smartMoneyDirectional || smartMoneyEarly;

  if (reason==="Smart Money持續性不足" && !smartMoneyForming) return null;
  if (reason!=="Smart Money持續性不足" && !smartMoneyPersistent) return null;''',
"directional Smart Money WATCH"
)

replace_once(
'''  if (ret20<-12 || entry<ma20*0.97) return null;''',
'''  // WATCH可以容許尚未站回20日線，但只允許「可修復距離」；真正升級仍必須站回觸發價。
  if (ret20<-12 || entry<ma20*0.94) return null;''',
"repairable MA20 distance"
)

replace_once(
'''    hybridSmartMoneyPersistent:smartMoneyPersistent,hybridSmartMoneyForming:smartMoneyForming,
    foreignBuyDays:foreignDays,trustBuyDays:trustDays,dealerBuyDays:dealerDays,institutionTotalNet:net,''',
'''    hybridSmartMoneyPersistent:smartMoneyPersistent,hybridSmartMoneyForming:smartMoneyForming,
    hybridSmartMoneyDirectional:smartMoneyDirectional,hybridSmartMoneyEarly:smartMoneyEarly,
    foreignBuyDays:foreignDays,trustBuyDays:trustDays,dealerBuyDays:dealerDays,institutionTotalNet:net,''',
"directional audit fields"
)

replace_once(
'''    policy:"正式Hybrid仍要求Smart Money持續性；WATCH允許『共識形成中』但必須已有正向法人證據、基本面>=45、Smart Money>=45、剩餘空間>=10%且不得過熱。WATCH不占3席、不占20萬；15分K確認後才升級。"''',
'''    policy:"正式Hybrid仍維持Smart Money強度＋持續性硬門檻；WATCH只接受『法人淨額為正＋外資/投信至少連買2日或自營商3日』等方向性共識，或原Smart Money>=45的早期正向證據；基本面>=45、剩餘空間>=10%、不得過熱。可在20日線下最多約6%進WATCH，但必須盤中站回觸發價才升級。WATCH不占3席、不占20萬。"''',
"watch policy text"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.9.5 Hybrid WATCH directional-consensus refinement")
