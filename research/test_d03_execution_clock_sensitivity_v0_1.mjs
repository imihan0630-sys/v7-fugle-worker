import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec=JSON.parse(readFileSync(new URL('./d03_execution_clock_sensitivity_schema_20261006_v0_1.json',import.meta.url)));

function hhmm(iso){
  if(!iso) return null;
  const m=String(iso).match(/T(\d\d):(\d\d)/);
  if(!m) throw new Error('INVALID_TIME:'+iso);
  return Number(m[1])*60+Number(m[2]);
}
function epochMs(iso){
  if(!iso) return null;
  const t=Date.parse(iso);
  if(!Number.isFinite(t)) throw new Error('INVALID_TIMESTAMP:'+iso);
  return t;
}
function parseHHMM(s){
  const [h,m]=s.split(':').map(Number); return h*60+m;
}
function venueById(id){
  return Object.values(spec.executionVenues).find(v=>v.venueId===id);
}

export function evaluateExecutionReceipt(r){
  if(!r||typeof r!=='object') throw new Error('RECEIPT_REQUIRED');
  for(const f of spec.requiredReceiptFields){
    if(!(f in r)||r[f]===null||r[f]===undefined||r[f]==='') throw new Error('MISSING_FIELD:'+f);
  }
  if(!spec.allowedFillStates.includes(r.fillStatus)) throw new Error('INVALID_FILL_STATUS');
  if(!spec.allowedTerminalStates.includes(r.terminalState)) throw new Error('INVALID_TERMINAL_STATE');
  const v=venueById(r.executionVenueId);
  if(!v) throw new Error('UNKNOWN_VENUE');

  if(r.marketRuleVersionCompatible!==true || r.venueRuleVersionCompatible!==true || r.tradingUnitRuleVersionCompatible!==true){
    return {status:'MARKET_RULE_VERSION_INCOMPATIBLE'};
  }
  if(r.executionPolicySelectedAfterOutcome===true){
    return {status:'EXECUTION_POLICY_SELECTION_UNCONTROLLED'};
  }
  if(r.commonSupportValid!==true){
    return {status:'VENUE_SUPPORT_BIASED'};
  }

  const knownEpoch=epochMs(r.signalKnownAt);
  const submittedEpoch=epochMs(r.orderSubmittedAt);
  const knownLocal=hhmm(r.signalKnownAt);
  const submitted=hhmm(r.orderSubmittedAt);
  if(submittedEpoch!==null && knownEpoch!==null && knownEpoch>submittedEpoch){
    return {status:'SIGNAL_FINALITY_TOO_LATE_FOR_VENUE'};
  }

  if(r.executionVenueId==='TWSE_CLOSING_CALL_AUCTION' && r.factorRequiresFinalClose===true){
    return {status:'SAME_CLOSING_AUCTION_LOOKAHEAD_FORBIDDEN'};
  }

  if(r.executionVenueId==='TWSE_AFTER_HOURS_FIXED_PRICE_BOARD_LOT'){
    if(r.closingPriceExists!==true || r.venueEligible!==true){
      return {status:'AFTER_HOURS_FIXED_PRICE_UNAVAILABLE'};
    }
    if(r.standardTradingUnitCompatible!==true){
      return {status:'AFTER_MARKET_ODD_LOT_REQUIRED'};
    }
    const [start,end]=v.orderWindow.map(parseHHMM);
    if(submitted<start || submitted>end){
      return knownLocal>end ? {status:'NEXT_OPEN_EXECUTION_REQUIRED'} : {status:'SIGNAL_FINALITY_TOO_LATE_FOR_VENUE'};
    }
    if(r.fillStatus==='NO_FILL') return {status:'NO_FILL'};
    if(r.fillStatus==='PARTIAL_FILL') return {status:'PARTIAL_FILL'};
    if(r.fillStatus==='FULL_FILL') return {status:'EXECUTION_CLOCK_METHOD_READY',sameNumericalCloseLaterClock:true};
    return {status:'POST_CLOSE_FIXED_PRICE_ELIGIBLE_UNCERTAIN_FILL',sameNumericalCloseLaterClock:true};
  }

  if(r.executionVenueId==='TWSE_AFTER_MARKET_ODD_LOT'){
    const [start,end]=v.orderWindow.map(parseHHMM);
    if(submitted<start || submitted>end){
      return knownLocal>end ? {status:'NEXT_OPEN_EXECUTION_REQUIRED'} : {status:'SIGNAL_FINALITY_TOO_LATE_FOR_VENUE'};
    }
    if(r.executionPriceSource==='SAME_DAY_OFFICIAL_CLOSE'){
      throw new Error('ODD_LOT_PRICE_CANNOT_BE_ASSUMED_OFFICIAL_CLOSE');
    }
    if(r.fillStatus==='NO_FILL') return {status:'NO_FILL'};
    if(r.fillStatus==='PARTIAL_FILL') return {status:'PARTIAL_FILL'};
    if(r.fillStatus==='FULL_FILL') return {status:'EXECUTION_CLOCK_METHOD_READY'};
    return {status:'COST_OR_FILLABILITY_UNRESOLVED'};
  }

  if(r.executionVenueId==='TWSE_NEXT_SESSION_OPENING_CALL'){
    if(r.fillStatus==='NO_FILL') return {status:'NO_FILL'};
    if(r.fillStatus==='PARTIAL_FILL') return {status:'PARTIAL_FILL'};
    if(r.fillStatus==='FULL_FILL') return {status:'EXECUTION_CLOCK_METHOD_READY'};
    return {status:'COST_OR_FILLABILITY_UNRESOLVED'};
  }

  if(r.executionVenueId==='TWSE_NEXT_SESSION_FIRST_EXECUTABLE_CONTINUOUS'){
    if(r.fillStatus==='NO_FILL') return {status:'NO_FILL'};
    if(r.fillStatus==='PARTIAL_FILL') return {status:'PARTIAL_FILL'};
    if(r.fillStatus==='FULL_FILL') return {status:'EXECUTION_CLOCK_METHOD_READY'};
    return {status:'COST_OR_FILLABILITY_UNRESOLVED'};
  }

  return {status:'COST_OR_FILLABILITY_UNRESOLVED'};
}

function base(extra={}){
  return {
    receiptVersion:'R1',
    factorId:'D03-08',
    factorVersion:'FV1',
    signalKnownAt:'2026-10-06T13:35:00+08:00',
    decisionCutoffAt:'2026-10-06T13:35:00+08:00',
    executionVenueId:'TWSE_AFTER_HOURS_FIXED_PRICE_BOARD_LOT',
    marketRuleVersion:'MR1',
    venueRuleVersion:'VR1',
    tradingUnitRuleVersion:'TU1',
    sessionCalendarVersion:'CAL1',
    orderSubmittedAt:'2026-10-06T14:05:00+08:00',
    matchEligibleAt:'2026-10-06T14:30:00+08:00',
    executionPriceSource:'SAME_DAY_OFFICIAL_CLOSE',
    fillModelVersion:'FM1',
    fillStatus:'PENDING',
    requestedQuantity:1000,
    executedQuantity:0,
    fallbackPolicyId:'FB1',
    executionPolicyFamilyId:'EPF1',
    commonSupportHash:'CS1',
    terminalState:'POST_CLOSE_FIXED_PRICE_ELIGIBLE_UNCERTAIN_FILL',
    marketRuleVersionCompatible:true,
    venueRuleVersionCompatible:true,
    tradingUnitRuleVersionCompatible:true,
    executionPolicySelectedAfterOutcome:false,
    commonSupportValid:true,
    factorRequiresFinalClose:true,
    closingPriceExists:true,
    venueEligible:true,
    standardTradingUnitCompatible:true,
    ...extra
  };
}

let out=evaluateExecutionReceipt(base());
assert.equal(out.status,'POST_CLOSE_FIXED_PRICE_ELIGIBLE_UNCERTAIN_FILL');
assert.equal(out.sameNumericalCloseLaterClock,true);

out=evaluateExecutionReceipt(base({fillStatus:'FULL_FILL',executedQuantity:1000,terminalState:'EXECUTION_CLOCK_METHOD_READY'}));
assert.equal(out.status,'EXECUTION_CLOCK_METHOD_READY');
assert.equal(out.sameNumericalCloseLaterClock,true);

out=evaluateExecutionReceipt(base({
  executionVenueId:'TWSE_CLOSING_CALL_AUCTION',
  orderSubmittedAt:'2026-10-06T13:29:00+08:00',
  matchEligibleAt:'2026-10-06T13:30:00+08:00',
  fillStatus:'FULL_FILL',
  executedQuantity:1000,
  terminalState:'SAME_CLOSING_AUCTION_LOOKAHEAD_FORBIDDEN'
}));
assert.equal(out.status,'SIGNAL_FINALITY_TOO_LATE_FOR_VENUE');

out=evaluateExecutionReceipt(base({
  signalKnownAt:'2026-10-06T13:24:00+08:00',
  decisionCutoffAt:'2026-10-06T13:24:00+08:00',
  executionVenueId:'TWSE_CLOSING_CALL_AUCTION',
  orderSubmittedAt:'2026-10-06T13:26:00+08:00',
  matchEligibleAt:'2026-10-06T13:30:00+08:00',
  fillStatus:'FULL_FILL',
  executedQuantity:1000,
  terminalState:'SAME_CLOSING_AUCTION_LOOKAHEAD_FORBIDDEN'
}));
assert.equal(out.status,'SAME_CLOSING_AUCTION_LOOKAHEAD_FORBIDDEN');

assert.equal(evaluateExecutionReceipt(base({standardTradingUnitCompatible:false,requestedQuantity:500})).status,'AFTER_MARKET_ODD_LOT_REQUIRED');
assert.equal(evaluateExecutionReceipt(base({closingPriceExists:false})).status,'AFTER_HOURS_FIXED_PRICE_UNAVAILABLE');
assert.equal(evaluateExecutionReceipt(base({venueEligible:false})).status,'AFTER_HOURS_FIXED_PRICE_UNAVAILABLE');
assert.equal(evaluateExecutionReceipt(base({signalKnownAt:'2026-10-06T14:31:00+08:00',orderSubmittedAt:'2026-10-06T14:31:00+08:00'})).status,'NEXT_OPEN_EXECUTION_REQUIRED');
assert.equal(evaluateExecutionReceipt(base({fillStatus:'NO_FILL',terminalState:'NO_FILL'})).status,'NO_FILL');
assert.equal(evaluateExecutionReceipt(base({fillStatus:'PARTIAL_FILL',executedQuantity:400,terminalState:'PARTIAL_FILL'})).status,'PARTIAL_FILL');
assert.equal(evaluateExecutionReceipt(base({executionPolicySelectedAfterOutcome:true})).status,'EXECUTION_POLICY_SELECTION_UNCONTROLLED');
assert.equal(evaluateExecutionReceipt(base({commonSupportValid:false})).status,'VENUE_SUPPORT_BIASED');
assert.equal(evaluateExecutionReceipt(base({marketRuleVersionCompatible:false})).status,'MARKET_RULE_VERSION_INCOMPATIBLE');

out=evaluateExecutionReceipt(base({
  factorRequiresFinalClose:false,
  executionVenueId:'TWSE_AFTER_MARKET_ODD_LOT',
  signalKnownAt:'2026-10-06T13:35:00+08:00',
  orderSubmittedAt:'2026-10-06T13:45:00+08:00',
  matchEligibleAt:'2026-10-06T14:30:00+08:00',
  executionPriceSource:'VENUE_CALL_AUCTION_MATCH',
  standardTradingUnitCompatible:false,
  fillStatus:'PENDING',
  terminalState:'COST_OR_FILLABILITY_UNRESOLVED'
}));
assert.equal(out.status,'COST_OR_FILLABILITY_UNRESOLVED');

assert.throws(()=>evaluateExecutionReceipt(base({
  factorRequiresFinalClose:false,
  executionVenueId:'TWSE_AFTER_MARKET_ODD_LOT',
  signalKnownAt:'2026-10-06T13:35:00+08:00',
  orderSubmittedAt:'2026-10-06T13:45:00+08:00',
  matchEligibleAt:'2026-10-06T14:30:00+08:00',
  executionPriceSource:'SAME_DAY_OFFICIAL_CLOSE',
  standardTradingUnitCompatible:false
})),/ODD_LOT_PRICE_CANNOT_BE_ASSUMED_OFFICIAL_CLOSE/);

out=evaluateExecutionReceipt(base({
  executionVenueId:'TWSE_NEXT_SESSION_OPENING_CALL',
  signalKnownAt:'2026-10-06T13:35:00+08:00',
  orderSubmittedAt:'2026-10-07T08:45:00+08:00',
  matchEligibleAt:'2026-10-07T09:00:00+08:00',
  executionPriceSource:'NEXT_SESSION_AUCTION_MATCH',
  fillStatus:'FULL_FILL',
  executedQuantity:1000,
  terminalState:'EXECUTION_CLOCK_METHOD_READY'
}));
assert.equal(out.status,'EXECUTION_CLOCK_METHOD_READY');

assert.equal(spec.invariants.noFillIsNotZeroReturn,true);
assert.equal(spec.invariants.partialFillUsesExecutedQuantity,true);
assert.equal(spec.invariants.pathSearchConsumesPolicyBudget,true);
assert.equal(spec.semanticRefinement.sameNumericalCloseAtLaterVenueMayBeValid,true);

console.log(JSON.stringify({
  status:'PASS',
  cases:17,
  sameClosingAuctionLookaheadBlocked:true,
  sameNumericalCloseLaterVenueCanBeCausal:true,
  postCloseFillNotGuaranteed:true,
  boardLotOddLotSeparated:true,
  noClosingPriceBlocksFixedPrice:true,
  lateFinalityRoutesNextSession:true,
  noFillNotZeroReturn:true,
  partialFillExplicit:true,
  executionPolicySearchControlled:true,
  marketRuleVersionBound:true,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
