// Independent P0 business success: actual same-session Formal plan visible in
// the PRIMARY Cloudflare monitor KV and the existing daily push accepted.
// Legacy 3Min full exact readback is P1 here; it must not hide an otherwise
// complete primary monitor/push, or falsely certify handset delivery.
export function assessP0PrimaryMonitorDelivery({targetDate,formal,monitor}={}){
  const base={schema:"S1_P0_FORMAL_PRIMARY_MONITOR_PUSH_V0_1",targetDate,
    ok:false,formalSaved:false,monitorExact:false,dailyPushAccepted:false,
    phoneReceiptVerified:false,threeMinSeparate:true,noBusinessRetry:true};
  const done=(reason,extra={})=>({...base,reason,...extra});
  if(!/^20\d{2}-\d{2}-\d{2}$/.test(String(targetDate||"")))
    return done("INVALID_SESSION");
  if(formal?.scanDate!==targetDate||formal?.dryRun!==false)
    return done("FORMAL_DATE_OR_PRODUCTION_MODE_NOT_VERIFIED");
  if(!Number.isInteger(formal?.selectedCount)||formal.selectedCount<0||
      formal.selectedCount>6||!Array.isArray(formal?.stocks)||
      formal.stocks.length!==formal.selectedCount)
    return done("FORMAL_0_TO_6_PLAN_UNVERIFIED");
  if(formal?.config?.verified!==true||!formal?.config?.updatedAt)
    return done("FORMAL_CONFIG_WRITE_READBACK_NOT_VERIFIED",{formalSaved:true});
  const count=formal.stocks.length;
  const symbols=formal.stocks.map(stock=>String(stock?.symbol||""));
  if(symbols.some(x=>!/^\d{4}$/.test(x))||new Set(symbols).size!==symbols.length)
    return done("FORMAL_STOCK_IDENTITY_INVALID",{formalSaved:true});
  if(monitor?.source!=="KV" || monitor?.updatedAt!==formal.config.updatedAt||
     !Array.isArray(monitor?.stocks)||monitor.stocks.length!==count)
    return done("MONITOR_KV_CURRENT_PLAN_NOT_VERIFIED",{formalSaved:true});
  const bySymbol=new Map(monitor.stocks.map(stock=>[String(stock?.symbol||""),stock]));
  if(bySymbol.size!==count)return done("MONITOR_KV_CURRENT_PLAN_NOT_VERIFIED",{formalSaved:true});
  // Compare all original stock fields that were intentionally present in the
  // persisted Formal plan. Loading the monitor may supply additional display
  // defaults, but no stock identity/risk/capital field may disagree.
  const riskKeys=["symbol","planDate","positionStage","formalClose","buyLow","buyHigh",
    "breakout","stop","profitCheck","allocationRatio","totalAllocation",
    "firstAmount","secondAmount","firstShares","secondShares","totalShares"];
  for(const expected of formal.stocks){
    const actual=bySymbol.get(String(expected.symbol));
    if(!actual)return done("MONITOR_KV_CURRENT_PLAN_NOT_VERIFIED",{formalSaved:true});
    for(const k of riskKeys){
      if(Object.prototype.hasOwnProperty.call(expected,k) &&
         JSON.stringify(expected[k])!==JSON.stringify(actual[k]))
        return done("MONITOR_KV_RISK_OR_CAPITAL_MISMATCH",{formalSaved:true,symbol:expected.symbol,field:k});
    }
  }
  const ready={formalSaved:true,monitorExact:true,selectedCount:count,
    threeMinVerified:formal?.threeMin?.verified===true};
  if(formal?.dailyReport?.sent!==true || formal?.dailyReport?.simulated!==false)
    return done("DAILY_SELECTION_PUSH_NOT_ACCEPTED",ready);
  return {...base,...ready,ok:true,dailyPushAccepted:true,
    reason:"FORMAL_PRIMARY_MONITOR_AND_PUSH_ACCEPTED_NOT_HANDSET_PROOF"};
}
