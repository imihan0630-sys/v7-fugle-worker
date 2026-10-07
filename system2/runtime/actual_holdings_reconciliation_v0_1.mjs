import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const ACTUAL_HOLDINGS_RECONCILIATION_VERSION_V0_1 = "0.1-RESEARCH";

const text=(v)=>v==null?"":String(v).trim();

function bySymbol(snapshot) {
  const rows=Array.isArray(snapshot?.holdings)?snapshot.holdings:[];
  return new Map(rows.map((row)=>[text(row.symbol),row]).filter(([symbol])=>symbol));
}

function materiallyDifferent(a,b,{abs=1e-9,rel=1e-6}={}) {
  if(a==null&&b==null) return false;
  if(a==null||b==null) return true;
  const x=Number(a),y=Number(b);
  if(!Number.isFinite(x)||!Number.isFinite(y)) return String(a)!==String(b);
  return Math.abs(x-y)>Math.max(abs,Math.max(Math.abs(x),Math.abs(y))*rel);
}

function possibleCorporateAction(prior,current) {
  if(!prior||!current) return false;
  const q0=Number(prior.quantity),q1=Number(current.quantity);
  const c0=Number(prior.averageCost),c1=Number(current.averageCost);
  if(![q0,q1,c0,c1].every(Number.isFinite)||q0<=0||q1<=0||c0<=0||c1<=0) return false;
  const quantityRatio=q1/q0;
  const costRatio=c1/c0;
  if(Math.abs(quantityRatio-1)<0.10) return false;
  const inverseProduct=quantityRatio*costRatio;
  return Math.abs(inverseProduct-1)<=0.08;
}

export async function reconcileActualHoldingsSnapshotsV0_1({
  previousSnapshot=null,
  currentSnapshot,
}={}) {
  if(!currentSnapshot||typeof currentSnapshot!=="object") throw new Error("currentSnapshot is required");
  const prior=bySymbol(previousSnapshot);
  const current=bySymbol(currentSnapshot);
  const symbols=[...new Set([...prior.keys(),...current.keys()])].sort();
  const events=[];

  for(const symbol of symbols){
    const before=prior.get(symbol)||null;
    const after=current.get(symbol)||null;
    const types=[];
    let reviewRequired=false;

    if(!before&&after){
      types.push("NEW_POSITION");
    }else if(before&&!after){
      types.push("CLOSED");
    }else{
      const quantityChanged=Number(before.quantity)!==Number(after.quantity);
      const avgCostChanged=materiallyDifferent(before.averageCost,after.averageCost,{rel:1e-5});
      if(quantityChanged){
        types.push("QUANTITY_CHANGED");
        if(Number(after.quantity)>Number(before.quantity)) types.push("INCREASED");
        else if(Number(after.quantity)<Number(before.quantity)) types.push("REDUCED");
      }
      if(avgCostChanged) types.push("AVG_COST_CHANGED");
      if(!quantityChanged&&!avgCostChanged) types.push("UNCHANGED");
      if(possibleCorporateAction(before,after)){
        types.push("POSSIBLE_CORPORATE_ACTION");
        types.push("REVIEW_REQUIRED");
        reviewRequired=true;
      }
    }

    if(after?.validationState && after.validationState!=="CONFIRMED"){
      types.push("REVIEW_REQUIRED");
      reviewRequired=true;
    }

    const eventBase={
      previousSnapshotId:previousSnapshot?.snapshotId||null,
      snapshotId:currentSnapshot.snapshotId||null,
      symbol,
      eventTypes:[...new Set(types)],
      priorRow:before,
      currentRow:after,
      tradeInference:"NOT_INFERRED",
      reviewRequired,
      explanation:{
        quantityDelta:before&&after?Number(after.quantity)-Number(before.quantity):null,
        averageCostDelta:before&&after&&Number.isFinite(Number(before.averageCost))&&Number.isFinite(Number(after.averageCost))
          ?Number(after.averageCost)-Number(before.averageCost):null,
        exactTradePrice:null,
        exactTradeTime:null,
        orderId:null,
        note:"Snapshot reconciliation describes exposure change only; it does not invent intermediate fills, orders, prices or timestamps.",
      },
    };
    const eventHash=await sha256Hex(eventBase);
    events.push(deepFreeze({
      eventId:`S2-AH-RECON:${eventHash}`,
      eventHash,
      ...eventBase,
    }));
  }

  const summary={};
  for(const event of events){
    for(const type of event.eventTypes) summary[type]=(summary[type]||0)+1;
  }
  const receiptBase={
    version:ACTUAL_HOLDINGS_RECONCILIATION_VERSION_V0_1,
    previousSnapshotId:previousSnapshot?.snapshotId||null,
    snapshotId:currentSnapshot.snapshotId||null,
    events:events.map(e=>({eventId:e.eventId,eventHash:e.eventHash,symbol:e.symbol,eventTypes:e.eventTypes})),
  };
  const reconciliationHash=await sha256Hex(receiptBase);
  return deepFreeze({
    schemaVersion:"S2_ACTUAL_HOLDINGS_RECONCILIATION_V0_1",
    ...receiptBase,
    reconciliationHash,
    eventCount:events.length,
    summary:deepFreeze(summary),
    events:deepFreeze(events),
    unknownTradeDetailsPreserved:true,
    brokerExecutionInferred:false,
    realOrderAuthority:false,
    liveCapitalAuthority:false,
  });
}
