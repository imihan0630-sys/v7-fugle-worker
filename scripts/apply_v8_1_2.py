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
    'const VERSION = "8.1.1-acceptance-state-health";',
    'const VERSION = "8.1.2-position-reconciliation";',
    "runtime version"
)

route_anchor='''    // ==================================================
    // 第21條：只重算未建倉交易計畫；不執行下單、不更動實際持股。
    if (url.pathname === "/api/capital") {'''

route='''    // V8.1.2：實際持股／成交回填。只允許更新既有標的的執行欄位，
    // 不改選股、買區、停損、資金配置、3Min或推播。
    if (url.pathname === "/api/positions") {
      if (!isAuthorized(request, env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if (!env.STOCKS_KV) return json({error:"Missing STOCKS_KV"},503,true);
      const stored=await env.STOCKS_KV.get(KV_KEY,"json");
      if(!stored || !Array.isArray(stored.stocks)) return json({error:"尚無正式交易計畫"},409,true);
      if(request.method==="GET") {
        return json({
          version:VERSION,
          updatedAt:stored.updatedAt || null,
          source:stored.source || null,
          positions:stored.stocks.map(stock=>({
            symbol:String(stock.symbol||""),
            name:stock.name||"",
            positionStage:normalizePositionStage(stock.positionStage),
            actualShares:Number.isInteger(Number(stock.actualShares)) ? Number(stock.actualShares) : null,
            averageCost:positiveNumber(stock.averageCost),
            firstEntryConfirmedAt:Number.isFinite(Date.parse(stock.firstEntryConfirmedAt)) ? new Date(stock.firstEntryConfirmedAt).toISOString() : null,
            actualPositionKnown:Number.isInteger(Number(stock.actualShares)) && Number(stock.actualShares)>0
          })),
          noPlanChanges:true,noPush:true,noThreeMinWrite:true
        },200,true);
      }
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      try {
        const body=await request.json();
        const patches=Array.isArray(body?.positions) ? body.positions : null;
        if(!patches || patches.length<1 || patches.length>stored.stocks.length) throw new Error("positions必須為1至目前標的數的陣列");
        const seen=new Set();
        const currentBySymbol=new Map(stored.stocks.map(stock=>[String(stock.symbol),stock]));
        const patchBySymbol=new Map();
        for(const item of patches) {
          const symbol=String(item?.symbol||"").trim();
          if(!currentBySymbol.has(symbol)) throw new Error(`未知標的 ${symbol}，禁止新增或替換交易計畫`);
          if(seen.has(symbol)) throw new Error(`${symbol} 重複回填`);
          seen.add(symbol);
          const stage=normalizePositionStage(item.positionStage);
          // normalizePositionStage 對未知值會回NONE，因此另外嚴格核對原輸入。
          const stageRaw=String(item.positionStage??"").toUpperCase().trim();
          if(!["NONE","FIRST","FULL","第一筆","已加碼","滿倉","1","2"].includes(stageRaw)) throw new Error(`${symbol} positionStage無效`);
          const rawShares=item.actualShares;
          const shares=rawShares===null || rawShares===undefined || rawShares==="" ? null : Number(rawShares);
          if(shares!==null && (!Number.isInteger(shares) || shares<0)) throw new Error(`${symbol} actualShares必須為非負整數`);
          const rawCost=item.averageCost;
          const averageCost=rawCost===null || rawCost===undefined || rawCost==="" ? null : Number(rawCost);
          if(averageCost!==null && (!Number.isFinite(averageCost) || averageCost<=0)) throw new Error(`${symbol} averageCost必須大於0`);
          const rawTime=item.firstEntryConfirmedAt;
          const parsedTime=rawTime===null || rawTime===undefined || rawTime==="" ? null : Date.parse(rawTime);
          if(rawTime!==null && rawTime!==undefined && rawTime!=="" && !Number.isFinite(parsedTime)) throw new Error(`${symbol} firstEntryConfirmedAt格式錯誤`);
          if(Number.isFinite(parsedTime) && parsedTime>Date.now()+5*60*1000) throw new Error(`${symbol} firstEntryConfirmedAt不可在未來`);
          const firstEntryConfirmedAt=Number.isFinite(parsedTime) ? new Date(parsedTime).toISOString() : null;
          if(stage==="NONE") {
            if(shares!==null && shares!==0) throw new Error(`${symbol} NONE持倉的actualShares必須為0或空值`);
            if(averageCost!==null || firstEntryConfirmedAt!==null) throw new Error(`${symbol} NONE持倉不得保留成本或成交時間`);
            patchBySymbol.set(symbol,{positionStage:"NONE",actualShares:null,averageCost:null,firstEntryConfirmedAt:null});
          } else {
            if(!Number.isInteger(shares) || shares<=0) throw new Error(`${symbol} 有持倉時actualShares必須大於0`);
            if(averageCost===null) throw new Error(`${symbol} 有持倉時必須提供averageCost`);
            if(firstEntryConfirmedAt===null) throw new Error(`${symbol} 有持倉時必須提供firstEntryConfirmedAt`);
            patchBySymbol.set(symbol,{positionStage:stage,actualShares:shares,averageCost,firstEntryConfirmedAt});
          }
        }

        const immutableView=stock=>{
          const copy={...stock};
          delete copy.positionStage;delete copy.actualShares;delete copy.averageCost;delete copy.firstEntryConfirmedAt;
          return copy;
        };
        const beforeImmutable=stored.stocks.map(immutableView);
        const nextStocks=stored.stocks.map(stock=>{
          const patch=patchBySymbol.get(String(stock.symbol));
          return patch ? {...stock,...patch} : stock;
        });
        const next={
          ...stored,
          updatedAt:new Date().toISOString(),
          source:"Position Reconciliation",
          stocks:nextStocks
        };
        await env.STOCKS_KV.put(KV_KEY,JSON.stringify(next));
        const actual=await env.STOCKS_KV.get(KV_KEY,"json");
        if(!actual || actual.updatedAt!==next.updatedAt) throw new Error("持股回填KV讀回失敗");
        if(JSON.stringify(actual.stocks.map(immutableView))!==JSON.stringify(beforeImmutable)) throw new Error("持股回填意外改動交易計畫欄位");
        if(JSON.stringify(actual.stocks)!==JSON.stringify(nextStocks)) throw new Error("持股回填讀回內容不一致");

        const audit={
          updatedAt:next.updatedAt,
          symbols:[...patchBySymbol.keys()],
          positions:[...patchBySymbol.entries()].map(([symbol,item])=>({symbol,...item})),
          noPlanChanges:true,noPush:true,noThreeMinWrite:true
        };
        await env.STOCKS_KV.put("V7_POSITION_RECONCILIATION",JSON.stringify(audit),{expirationTtl:90*86400});
        return json({ok:true,verified:true,updatedAt:next.updatedAt,count:patchBySymbol.size,
          positions:audit.positions,noPlanChanges:true,noPush:true,noThreeMinWrite:true},200,true);
      } catch(err) {
        return json({ok:false,error:String(err),noPlanChanges:true,noPush:true,noThreeMinWrite:true},400,true);
      }
    }

''' + route_anchor
replace_once(route_anchor,route,"position reconciliation route")

# Add position coverage to system overview without changing pending status until real data is supplied.
old='''    externalValidation:{
      provided:Boolean(external),
      compared:Boolean(comparison),
      marketDate:scanDate,
      overlapCount:Number(comparison?.overlapCount || 0),
      v7OnlyCount:Array.isArray(comparison?.v7OnlySymbols) ? comparison.v7OnlySymbols.length : null,
      externalOnlyCount:Array.isArray(comparison?.externalOnlySymbols) ? comparison.externalOnlySymbols.length : null
    }
  };'''

new='''    externalValidation:{
      provided:Boolean(external),
      compared:Boolean(comparison),
      marketDate:scanDate,
      overlapCount:Number(comparison?.overlapCount || 0),
      v7OnlyCount:Array.isArray(comparison?.v7OnlySymbols) ? comparison.v7OnlySymbols.length : null,
      externalOnlyCount:Array.isArray(comparison?.externalOnlySymbols) ? comparison.externalOnlySymbols.length : null
    },
    positions:{
      total:Array.isArray(config?.stocks) ? config.stocks.length : 0,
      holdingCount:Array.isArray(config?.stocks) ? config.stocks.filter(stock=>normalizePositionStage(stock.positionStage)!=="NONE").length : 0,
      knownHoldingShares:Array.isArray(config?.stocks) ? config.stocks.filter(stock=>normalizePositionStage(stock.positionStage)!=="NONE" && Number.isInteger(Number(stock.actualShares)) && Number(stock.actualShares)>0).length : 0,
      completeForHoldings:Array.isArray(config?.stocks) ? config.stocks.filter(stock=>normalizePositionStage(stock.positionStage)!=="NONE").every(stock=>Number.isInteger(Number(stock.actualShares)) && Number(stock.actualShares)>0 && positiveNumber(stock.averageCost)!==null && Number.isFinite(Date.parse(stock.firstEntryConfirmedAt))) : false
    }
  };'''
replace_once(old,new,"system overview position coverage")

old_box='''    <div class="box"><div class="muted">推播Outbox</div><div class="big">${overview.pushOutbox.unresolved}</div><div>未結案｜逾10分：${overview.pushOutbox.staleUnresolved}</div></div>
  </div>'''
new_box='''    <div class="box"><div class="muted">推播Outbox</div><div class="big">${overview.pushOutbox.unresolved}</div><div>未結案｜逾10分：${overview.pushOutbox.staleUnresolved}</div></div>
    <div class="box"><div class="muted">實際持股回填</div><div class="big">${overview.positions.knownHoldingShares}/${overview.positions.holdingCount}</div><div>有持倉標的已知股數｜${overview.positions.completeForHoldings?"完整":"待回填"}</div></div>
  </div>'''
replace_once(old_box,new_box,"system dashboard position box")

path.write_text(text,encoding="utf-8")
print("Applied V8.1.2 position reconciliation")
