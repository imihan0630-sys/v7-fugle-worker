import {reconstructBuySuggestedShares} from "../research/buy_signal_quantity_reconstruction_v0_1.mjs";
import {counterfactualInitialBuyOrderability} from "../research/counterfactual_initial_buy_orderability_v0_1.mjs";

const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");

const res=await fetch(origin+"/api/journal?days=365",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json();
if(!res.ok) throw new Error("journal HTTP "+res.status+": "+String(data?.error||"unknown"));

const signals=Array.isArray(data?.signalRows)?data.signalRows:[];
const plans=Array.isArray(data?.planRows)?data.planRows:[];
const days=Array.isArray(data?.days)?data.days:[];

const dayMap=new Map(days.map(d=>[String(d.scan_date||""),d]));
const plansByDate=new Map();
for(const p of plans){
  const d=String(p.scan_date||"");
  if(!plansByDate.has(d)) plansByDate.set(d,[]);
  plansByDate.get(d).push(p);
}

const buys=signals.filter(s=>String(s?.signal_type||"").toUpperCase()==="BUY");
const positive=[];
for(const s of buys){
  const row={
    sourceType:"V8_TRADE_JOURNAL_SIGNAL",
    eventId:s.event_id,
    signalType:s.signal_type,
    symbol:s.symbol,
    occurredAt:s.occurred_at,
    signalAmount:s.signal_amount,
    marketPrice:s.market_price
  };
  const q=reconstructBuySuggestedShares(row);
  const scanDate=String(s.plan_scan_date||"");
  const datePlans=plansByDate.get(scanDate)||[];
  const plan=datePlans.find(p=>String(p.symbol||"")===String(s.symbol||""))||null;
  const day=dayMap.get(scanDate)||null;
  const currentPlanLinked=Boolean(plan);
  let equalCapitalOrderability=null;
  if(datePlans.length>=2 && day && Number.isFinite(Number(day.total_capital))){
    const deployment=datePlans.reduce((sum,p)=>sum+(Number(p.total_allocation)||0),0);
    const equalAllocation=deployment/datePlans.length;
    equalCapitalOrderability=counterfactualInitialBuyOrderability(
      datePlans.map(p=>({symbol:String(p.symbol),allocation:equalAllocation})),
      [{symbol:String(s.symbol),triggerPrice:Number(s.market_price)}]
    );
  }
  positive.push({
    eventId:s.event_id,tradeDate:s.trade_date,planScanDate:scanDate,symbol:String(s.symbol||""),
    occurredAt:s.occurred_at,marketPrice:Number(s.market_price),signalAmount:Number(s.signal_amount),
    reconstruction:q,currentPlanLinked,
    planPreview:{
      buyHigh:plan?Number(plan.buy_high):null,
      storedFirstShares:plan?Number(plan.first_shares):null,
      recomputedPreviewShares:(plan&&Number.isFinite(Number(plan.buy_high))&&Number(plan.buy_high)>0&&Number.isFinite(Number(s.signal_amount)))
        ?Math.floor(Number(s.signal_amount)/Number(plan.buy_high)):null,
      liveMinusStoredFirstShares:(plan&&Number.isFinite(Number(plan.first_shares))&&q?.reconstructable)
        ?q.suggestedShares-Number(plan.first_shares):null
    },
    planSelectedCount:datePlans.length,
    daySelectedCount:day?Number(day.selected_count):null,
    planCountMatchesDay:day?Number(day.selected_count)===datePlans.length:null,
    equalCapitalOrderability
  });
}

const exits=signals.filter(s=>["SELL","STOP_LOSS"].includes(String(s?.signal_type||"").toUpperCase()) && Number.isFinite(Number(s?.market_price)));
const output={
  ok:true,
  schemaVersion:"POSITIVE_SIGNAL_PRODUCTION_AUDIT_V0_1",
  readOnly:true,
  decisionImpact:false,
  endpoint:"/api/journal?days=365",
  caveat:"Reader is bounded LIMIT 6000 with no truncation flag; absence is never treated as NO-BUY.",
  totalSignalRows:signals.length,
  positiveBuyRows:buys.length,
  reconstructableBuyRows:positive.filter(x=>x.reconstruction?.reconstructable===true).length,
  planLinkedBuyRows:positive.filter(x=>x.currentPlanLinked).length,
  multiNamePositiveBuyRows:positive.filter(x=>x.planSelectedCount>=2).length,
  equalCapitalOrderableRows:positive.filter(x=>x.equalCapitalOrderability?.status==="ORDERABLE").length,
  previewShareDriftRows:positive.filter(x=>Number.isFinite(x.planPreview?.liveMinusStoredFirstShares)&&x.planPreview.liveMinusStoredFirstShares!==0).length,
  positiveTerminalExitRows:exits.length,
  buys:positive,
  terminalSignalRows:exits.map(s=>({
    eventId:s.event_id,tradeDate:s.trade_date,planScanDate:s.plan_scan_date,symbol:s.symbol,
    signalType:s.signal_type,occurredAt:s.occurred_at,marketPrice:Number(s.market_price),
    semantics:"POSITIVE_TERMINAL_SIGNAL_PRICE_NOT_BROKER_FILL"
  })),
  interpretation:"Positive-row production audit only. BUY presence can support exact signal-price/amount/suggestedShares reconstruction. Plan first_shares is preview-at-plan-price and may differ from live suggestedShares recomputed at trigger price. Missing rows remain UNKNOWN. SELL/STOP rows are terminal signal-price evidence only."
};
console.log(JSON.stringify(output,null,2));
