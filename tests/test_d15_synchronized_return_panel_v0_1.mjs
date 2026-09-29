import assert from "node:assert/strict";
import {validateSynchronizedReturnPanel,sampleRiskDiagnostics} from "../research/d15_synchronized_return_panel_v0_1.mjs";

const asOf="2026-09-30T18:00:00+08:00";
const dates=Array.from({length:61},(_,i)=>{
  const d=new Date(Date.UTC(2026,5,1+i,12));
  return d.toISOString().slice(0,10);
});

function symbolReceipt(symbol,closes,overrides={}){
  return {
    symbol,
    returnSpace:"PRICE_INDEX_COMPARABLE",
    sourceReceiptId:"src-"+symbol,
    sourceHistoryHash:"hist-"+symbol,
    continuityReceiptId:"cont-"+symbol,
    symbolSessionContractVersion:"session-v1",
    corporateActionRegistryVersion:"ca-v1",
    sourceAvailableAt:"2026-09-30T17:00:00+08:00",
    bars:dates.map((date,i)=>({
      date,
      close:closes[i],
      availableAt:"2026-09-30T17:00:00+08:00",
      symbolSessionVerified:true,
      corporateActionContinuityResolved:true,
      pseudoBar:false,
      sourceBarHash:symbol+"-"+date,
      priceLimitConstrained:false
    })),
    ...overrides
  };
}

const a=dates.map((_,i)=>100*Math.exp(i*0.001));
const b=dates.map((_,i)=>50*Math.exp(i*0.001));
const c=dates.map((_,i)=>80*Math.exp(-i*0.001));

function base(){
  return {
    parentDecisionReceiptId:"parent-20260930",
    asOf,
    panelVersion:"D15_SYNC_RETURN_PANEL_V0_1",
    returnSpace:"PRICE_INDEX_COMPARABLE",
    commonSupportPolicy:"EXACT_LISTWISE_COMMON_SUPPORT",
    selectedSymbols:["A","B","C"],
    parentSelectedSymbols:["A","B","C"],
    commonSessions:dates,
    symbols:[symbolReceipt("A",a),symbolReceipt("B",b),symbolReceipt("C",c)]
  };
}

let x=validateSynchronizedReturnPanel(base());
assert.equal(x.valid,true);
assert.equal(x.status,"VALID");
assert.equal(x.synchronizedReturnObservations,60);
const d=sampleRiskDiagnostics(x);
assert.equal(d.status,"READY_SAMPLE_DIAGNOSTICS");
assert.ok(Math.abs(d.correlation[0][1]-1)<1e-10);
assert.ok(Math.abs(d.correlation[0][2]+1)<1e-10);

// Mixed semantic spaces are invalid.
const mixed=base();
mixed.symbols[1].returnSpace="TOTAL_RETURN_COMPARABLE";
x=validateSynchronizedReturnPanel(mixed);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["MIXED_RETURN_SPACE"]);

// RAW_EXECUTION is never silently promoted to covariance input.
const raw=base();
raw.returnSpace="RAW_EXECUTION";
for(const item of raw.symbols)item.returnSpace="RAW_EXECUTION";
x=validateSynchronizedReturnPanel(raw);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["UNAPPROVED_RETURN_SPACE"]);

// Corporate-action continuity missing must remain UNKNOWN.
const ca=base();
ca.symbols[0].bars[20].corporateActionContinuityResolved=false;
x=validateSynchronizedReturnPanel(ca);
assert.equal(x.valid,false);
assert.equal(x.status,"UNKNOWN");
assert.deepEqual(x.reasons,["CORPORATE_ACTION_CONTINUITY_UNRESOLVED"]);

// No pairwise deletion: a missing date in one name invalidates the panel.
const support=base();
support.symbols[2].bars.splice(30,1);
x=validateSynchronizedReturnPanel(support);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["COMMON_SUPPORT_MISMATCH"]);

// A missing/suspension pseudo-bar cannot be injected as zero return.
const pseudo=base();
pseudo.symbols[1].bars[10].pseudoBar=true;
x=validateSynchronizedReturnPanel(pseudo);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["PSEUDO_BAR_PROHIBITED"]);

// Source observed after decision cutoff is look-ahead.
const late=base();
late.symbols[1].sourceAvailableAt="2026-10-01T08:00:00+08:00";
x=validateSynchronizedReturnPanel(late);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["SOURCE_NOT_KNOWN_BY_ASOF"]);

// Parent membership cannot drift.
const membership=base();
membership.parentSelectedSymbols=["A","B","D"];
x=validateSynchronizedReturnPanel(membership);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["PARENT_SELECTED_SET_MISMATCH"]);

// Price-limit constrained rows remain observable but are explicitly stratified.
const constrained=base();
constrained.symbols[0].bars[5].priceLimitConstrained=true;
x=validateSynchronizedReturnPanel(constrained);
assert.equal(x.valid,true);
assert.equal(x.status,"VALID_CONSTRAINED");
assert.equal(x.constrainedBars,1);

// Minimum common support is frozen before inference.
const short=base();
short.commonSessions=dates.slice(0,20);
short.symbols=short.symbols.map(item=>({...item,bars:item.bars.slice(0,20)}));
x=validateSynchronizedReturnPanel(short);
assert.equal(x.valid,false);
assert.equal(x.status,"INSUFFICIENT_HISTORY");

// Mechanical split witness: raw path can manufacture a -50% return; comparable path does not.
// The validator prevents using RAW_EXECUTION, and the corrected comparable series remains flat.
const rawReset=[...Array(30).fill(100),...Array(31).fill(50)];
const comparable=Array(61).fill(50);
assert.ok(Math.abs(Math.log(rawReset[30]/rawReset[29])-Math.log(0.5))<1e-12);
const flatPanel=base();
flatPanel.symbols[0]=symbolReceipt("A",comparable);
flatPanel.symbols[1]=symbolReceipt("B",comparable);
flatPanel.symbols[2]=symbolReceipt("C",comparable);
x=validateSynchronizedReturnPanel(flatPanel);
assert.equal(x.valid,true);
const flat=sampleRiskDiagnostics(x);
assert.equal(flat.status,"READY_SAMPLE_DIAGNOSTICS");
assert.equal(flat.sampleVolatility.A,0);

console.log(JSON.stringify({
  ok:true,
  contract:"D15_SYNCHRONIZED_RETURN_PANEL_V0_1",
  observations:60,
  failClosed:[
    "mixed return spaces","RAW_EXECUTION","unresolved corporate action",
    "pairwise support mismatch","pseudo bar","look-ahead source","parent membership drift"
  ],
  finding:"Official OHLC availability is not enough; inference requires exact common support plus verified comparable-price/session/continuity provenance."
},null,2));
