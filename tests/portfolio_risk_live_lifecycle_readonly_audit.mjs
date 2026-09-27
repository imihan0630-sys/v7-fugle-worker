import assert from "node:assert/strict";

const origin=String(process.env.V7_WORKER_ORIGIN||"").replace(/\/$/,"");
const token=String(process.env.V7_ADMIN_TOKEN||"");
assert.ok(origin,"V7_WORKER_ORIGIN required");
assert.ok(token,"V7_ADMIN_TOKEN required");

async function getJson(path){
  const r=await fetch(origin+path,{headers:{"x-admin-token":token,"accept":"application/json"}});
  const text=await r.text();
  if(!r.ok) throw new Error(path+" HTTP "+r.status+" "+text.slice(0,300));
  return JSON.parse(text);
}

const [journal,positions]=await Promise.all([
  getJson("/api/journal?days=365"),
  getJson("/api/positions")
]);

const signals=Array.isArray(journal?.signalRows)?journal.signalRows:[];
const positionRows=Array.isArray(positions?.positions)?positions.positions:[];

const ownershipTypes=new Set(["BUY","ADD","REDUCE","SELL","STOP_LOSS"]);
const ownershipSignals=signals.filter(x=>ownershipTypes.has(String(x?.signal_type||"")));
const signalTypeCounts={};
for(const row of signals){
  const type=String(row?.signal_type||"UNKNOWN");
  signalTypeCounts[type]=(signalTypeCounts[type]||0)+1;
}
const withSuggestedShares=ownershipSignals.filter(x=>Number.isInteger(Number(x?.signal_shares))&&Number(x.signal_shares)>0).length;
const withMarketPrice=ownershipSignals.filter(x=>Number.isFinite(Number(x?.market_price))&&Number(x.market_price)>0).length;

const journalKeys=[...new Set(signals.flatMap(x=>Object.keys(x||{})))].sort();
const requiredFillFields=["execution_confirmed","fill_price","filled_shares","position_shares_after","broker_execution_id"];
const presentFillFields=requiredFillFields.filter(k=>journalKeys.includes(k));

const holdings=positionRows.filter(x=>String(x?.positionStage||"NONE").toUpperCase()!=="NONE");
const completeCurrentHoldings=holdings.filter(x=>
  Number.isInteger(Number(x?.actualShares))&&Number(x.actualShares)>0&&
  Number.isFinite(Number(x?.averageCost))&&Number(x.averageCost)>0&&
  Number.isFinite(Date.parse(x?.firstEntryConfirmedAt))
);

const result={
  schemaVersion:"PORTFOLIO_RISK_LIVE_LIFECYCLE_AUDIT_V0_1",
  observedAt:new Date().toISOString(),
  readOnly:true,
  productionWrites:false,
  journal:{
    recordedDays:Number(journal?.recordedDays||0),
    plans:Number(journal?.plans||0),
    signals:Number(journal?.signals||signals.length),
    signalTypeCounts,
    ownershipSignals:ownershipSignals.length,
    ownershipSignalsWithSuggestedShares:withSuggestedShares,
    ownershipSignalsWithMarketPrice:withMarketPrice,
    responseFieldKeys:journalKeys,
    explicitConfirmedFillFieldsPresent:presentFillFields,
    advisoryFieldSemantics:[
      "signal_shares = monitor/action suggestion field, not broker-confirmed fill quantity",
      "market_price = signal observation price, not guaranteed execution price",
      "position_stage = plan/monitor state at signal time, not append-only broker position ledger"
    ]
  },
  currentPositions:{
    rows:positionRows.length,
    holdings:holdings.length,
    holdingsWithCompleteCurrentSnapshot:completeCurrentHoldings.length,
    snapshotOnly:true
  },
  reconstructability:{
    actualLiveLifecycleHistorical:false,
    actualLiveHeatHistorical:false,
    currentSnapshotCanDescribeNow:completeCurrentHoldings.length===holdings.length && holdings.length>0,
    reasons:[
      "NO_APPEND_ONLY_CONFIRMED_FILL_LEDGER_IN_CURRENT_JOURNAL_CONTRACT",
      "SIGNAL_EVENTS_ARE_NOT_EXECUTION_CONFIRMATIONS",
      "CURRENT_POSITION_RECONCILIATION_IS_MUTABLE_SNAPSHOT_NOT_EVENT_HISTORY",
      "REDUCE_OR_ADD_HISTORY_CANNOT_BE_INFERRED_FROM_CURRENT_SHARES_WITHOUT_CONFIRMED_FILL_SEQUENCE"
    ],
    requiredForFutureHistoricalReconstruction:[
      "append-only confirmed execution event id",
      "confirmed fill timestamp",
      "confirmed fill price",
      "confirmed filled shares",
      "side/action BUY/ADD/REDUCE/SELL",
      "position shares before and after",
      "average cost after",
      "source/provenance and reconciliation status",
      "stable link to plan scan date and symbol"
    ]
  },
  rule:"Do not use suggested signal shares or mutable current position snapshots to fabricate historical actual holdings or actual-live portfolio heat."
};

console.log(JSON.stringify(result,null,2));
