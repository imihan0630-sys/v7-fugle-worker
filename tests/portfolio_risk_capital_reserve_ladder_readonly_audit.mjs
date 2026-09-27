import {planReserveLadder,initialBuySignalBudgetSnapshot,theoreticalFirstStageCapitalCeiling} from "../research/capital_reserve_ladder_v0_1.mjs";

const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");
const res=await fetch(origin+"/api/journal?days=730",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json();
if(!res.ok) throw new Error("journal HTTP "+res.status);

const days=Array.isArray(data?.days)?data.days:[],plans=Array.isArray(data?.planRows)?data.planRows:[],signals=Array.isArray(data?.signalRows)?data.signalRows:[];
const dayMap=new Map(days.map(d=>[String(d.scan_date||""),d])),byDate=new Map();
for(const p of plans){
 const d=String(p.scan_date||""); if(!byDate.has(d)) byDate.set(d,[]);
 const allocation=Number(p.total_allocation);
 const rawFirst=Number(p.first_amount), rawSecond=Number(p.second_amount);
 const hasStoredAmounts=Number.isFinite(rawFirst)&&Number.isFinite(rawSecond);
 const reconstructedFirst=Number.isFinite(allocation)?Math.round(allocation*0.6):null;
 const reconstructedSecond=Number.isFinite(allocation)&&reconstructedFirst!==null?allocation-reconstructedFirst:null;
 byDate.get(d).push({
  symbol:String(p.symbol||""),priorityScore:p.priority_score,totalAllocation:p.total_allocation,
  buyHigh:p.buy_high,firstShares:p.first_shares,secondShares:p.second_shares,
  firstAmount:hasStoredAmounts?rawFirst:reconstructedFirst,
  secondAmount:hasStoredAmounts?rawSecond:reconstructedSecond,
  trancheAmountProvenance:hasStoredAmounts?"STORED":"FORMAL_60_40_RECONSTRUCTED"
 });
}
const dates=[];
for(const [scanDate,ps] of [...byDate.entries()].sort()){
 const day=dayMap.get(scanDate)||{};
 dates.push({scanDate,selectedCount:Number(day.selected_count),ladder:planReserveLadder(ps,Number(day.total_capital))});
}
const positiveInitialBuys=[];
for(const s of signals.filter(x=>String(x?.signal_type||"").toUpperCase()==="BUY")){
 const scanDate=String(s.plan_scan_date||""),ps=byDate.get(scanDate)||[];
 const plan=ps.find(p=>p.symbol===String(s.symbol||""));
 if(!plan) continue;
 const snapshot=initialBuySignalBudgetSnapshot(plan,{
   symbol:String(s.symbol||""),signalType:"BUY",signalAmount:s.signal_amount,marketPrice:s.market_price
  });
 positiveInitialBuys.push({
  eventId:s.event_id,planScanDate:scanDate,occurredAt:s.occurred_at,symbol:String(s.symbol||""),
  trancheAmountProvenance:plan.trancheAmountProvenance,
  formalTrancheReconstructionAccepted:plan.trancheAmountProvenance==="STORED"||snapshot.signalAmountMatchesFirstTranche===true,
  snapshot:(plan.trancheAmountProvenance==="STORED"||snapshot.signalAmountMatchesFirstTranche===true)
    ?snapshot
    :{status:"UNKNOWN",reason:"FORMAL_60_40_RECONSTRUCTION_NOT_CONFIRMED_BY_SIGNAL_AMOUNT"}
 });
}
console.log(JSON.stringify({
 ok:true,schemaVersion:"CAPITAL_RESERVE_LADDER_PRODUCTION_AUDIT_V0_1",
 readOnly:true,decisionImpact:false,endpoint:"/api/journal?days=730",
 theoreticalFirstStageCeilings:[
  theoreticalFirstStageCapitalCeiling(1),theoreticalFirstStageCapitalCeiling(2),theoreticalFirstStageCapitalCeiling(3)
 ],
 planDates:dates,
 positiveInitialBuys,
 evidenceBoundary:{
  planReserve:"modeled from Formal plan geometry",
  signalBudget:"positive durable BUY events only; missing plan tranche amounts may be reconstructed from frozen Formal 60/40 only when the positive signal amount exactly confirms the reconstructed first tranche",
  actualBrokerCash:"UNKNOWN",
  absentSignals:"UNKNOWN_NOT_NO_TRIGGER",
  fills:"UNKNOWN_WITHOUT_CONFIRMED_FILL_LEDGER"
 }
},null,2));
