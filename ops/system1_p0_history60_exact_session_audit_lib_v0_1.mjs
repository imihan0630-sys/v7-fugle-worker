// Session-alignment is diagnostic only: a truly suspended/newly listed stock
// can legitimately have no trade on an exchange-wide trading session.
export function auditHistoricalBars({symbol,bars,requiredTradingDates,targetDate}={}){
 const symbolOk=/^[1-9][0-9]{3}$/.test(String(symbol||""));
 const dateOk=x=>/^\d{4}-\d{2}-\d{2}$/.test(String(x||""));
 if(!symbolOk||!dateOk(targetDate)||!Array.isArray(requiredTradingDates)||
    requiredTradingDates.length!==60||requiredTradingDates.at(-1)!==targetDate||
    new Set(requiredTradingDates).size!==60||
    requiredTradingDates.some((x,i)=>!dateOk(x)||(i>0&&x<=requiredTradingDates[i-1])))
   throw Error("AUDIT_60_SESSION_INPUT_INVALID");
 if(!Array.isArray(bars))return {symbol,state:"INVALID_HISTORY_JSON",barCount:0};
 const ordered=bars.map(x=>({date:String(x?.date||""),close:Number(x?.close),
   high:Number(x?.high),low:Number(x?.low)}));
 const invalid=ordered.some(x=>!dateOk(x.date)||!(x.close>0)||
   !Number.isFinite(x.high)||!Number.isFinite(x.low)||x.high<x.low||
   x.close>x.high||x.close<x.low);
 const ordering=ordered.some((x,i)=>i>0&&x.date<=ordered[i-1].date);
 const validBarDates=ordered.filter(x=>x.date<=targetDate);
 const barCount=validBarDates.length;
 const lastBarDate=validBarDates.at(-1)?.date||null;
 const available=new Set(validBarDates.map(x=>x.date));
 const missing=requiredTradingDates.filter(d=>!available.has(d));
 const current=lastBarDate===targetDate;
 const has60=barCount>=60;
 // A completed 60 historical K window is distinct from 60 exchange calendar
 // session matches. The latter cannot itself infer halt/listing eligibility.
 const state=invalid||ordering?"INVALID_RAW_BAR_ORDER_OR_PRICES":
  !has60?"FEWER_THAN_60_COMPLETED_BARS":
  !current?"LATEST_COMPLETED_QUOTE_NOT_PRESENT":
  missing.length?"CALENDAR_GAP_NEEDS_LISTING_OR_HALT_PROVENANCE":
  "60_BARS_AND_60_MARKET_SESSIONS_PRESENT";
 return {symbol,state,barCount,lastBarDate,
  has60Bars:has60,hasLatestCompletedSession:current,
  strictCalendarAligned:missing.length===0&&current&&has60&&!invalid&&!ordering,
  requiredMarketSessionMissingCount:missing.length,
  requiredMarketSessionMissingDates:missing,invalidBars:invalid,invalidOrdering:ordering};
}
