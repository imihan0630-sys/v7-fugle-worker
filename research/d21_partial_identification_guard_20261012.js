"use strict";
// D21 research-only partial-identification synthetic guard. No historical data and no trading output.
function classifyTransfer(x) {
  if (!Number.isInteger(x.planned) || x.planned < 0) return {status:"UNKNOWN",reason:"INVALID_PLANNED"};
  if (!(x.knownAt && x.decisionAt && x.knownAt <= x.decisionAt)) return {status:"UNKNOWN",reason:"PIT_UNPROVEN"};
  if (!x.eventLinkVerified || !x.finalPeriod || !x.revisionsComplete || !Number.isInteger(x.untransferred)) {
    return {status:"BOUNDED_ONLY",lower:0,upper:x.planned,marketSale:"UNKNOWN"};
  }
  if (x.untransferred < 0 || x.untransferred > x.planned) return {status:"UNKNOWN",reason:"INCONSISTENT_REMAINDER"};
  const transferred=x.planned-x.untransferred;
  const marketSale=(x.method==="EXCHANGE_SALE" && x.actualExecutionReceipt && x.executionKnownAt && x.executionKnownAt <= x.decisionAt) ? "VERIFIED" : "UNKNOWN";
  return {status:"CONDITIONAL_TRANSFER_VOLUME",transferred,marketSale};
}
function classifyMonthly(x) {
  if (!x.rawTransactionReceipts || !x.classifiedMethods || !x.knownAtVerified) return {status:"UNKNOWN",netBalanceDelta:x.netBalanceDelta??null,marketGross:"UNKNOWN"};
  return {status:"SOURCE_READY_NOT_AUTOMATICALLY_BULLISH_OR_BEARISH"};
}
function classifyPledge(x) {
  if (!x.rawSetupOrReleaseReceipt || !x.controllerIdentityVerified || !x.knownAtVerified) return {status:"UNKNOWN",distress:"UNKNOWN"};
  return {status:"EVENT_OBSERVED",distress:x.loanCovenantEvidence ? "REQUIRES_CONTEXT" : "UNKNOWN"};
}
function runTests() {
  let n=0;const ok=(b,name)=>{if(!b)throw new Error(name);n++};
  const base={planned:100,untransferred:20,eventLinkVerified:true,finalPeriod:true,revisionsComplete:true,knownAt:"2026-10-01",decisionAt:"2026-10-05",method:"EXCHANGE_SALE"};
  const c=patch=>classifyTransfer({...base,...patch});
  ok(c({planned:null}).status==="UNKNOWN","missing planned");
  ok(c({planned:-1}).status==="UNKNOWN","negative planned");
  ok(c({knownAt:null}).reason==="PIT_UNPROVEN","unknown knownAt");
  ok(c({knownAt:"2026-10-06"}).reason==="PIT_UNPROVEN","future leak");
  ok(c({eventLinkVerified:false}).status==="BOUNDED_ONLY","unlinked");
  ok(c({finalPeriod:false}).status==="BOUNDED_ONLY","not final");
  ok(c({revisionsComplete:false}).status==="BOUNDED_ONLY","revision gap");
  ok(c({untransferred:null}).status==="BOUNDED_ONLY","missing untransferred");
  ok(c({untransferred:120}).status==="UNKNOWN","invalid remainder");
  ok(c({untransferred:100}).transferred===0,"conditional zero");
  ok(c({untransferred:0}).transferred===100,"conditional full");
  ok(c({method:"GIFT"}).marketSale==="UNKNOWN","gift not sale");
  ok(c({actualExecutionReceipt:false}).marketSale==="UNKNOWN","method not proof");
  ok(c({actualExecutionReceipt:true,executionKnownAt:"2026-10-06"}).marketSale==="UNKNOWN","execution future leak");
  ok(c({actualExecutionReceipt:true,executionKnownAt:"2026-10-04"}).marketSale==="VERIFIED","execution with verified receipt");
  ok(classifyMonthly({netBalanceDelta:0}).marketGross==="UNKNOWN","zero delta not zero gross");
  ok(classifyMonthly({netBalanceDelta:-500}).status==="UNKNOWN","negative delta not sell");
  ok(classifyPledge({rawSetupOrReleaseReceipt:false,controllerIdentityVerified:true,knownAtVerified:true}).status==="UNKNOWN","pledge balance not event");
  ok(classifyPledge({rawSetupOrReleaseReceipt:true,controllerIdentityVerified:false,knownAtVerified:true}).status==="UNKNOWN","controller unknown");
  ok(classifyPledge({rawSetupOrReleaseReceipt:true,controllerIdentityVerified:true,knownAtVerified:true}).distress==="UNKNOWN","no covenant");
  return n;
}
if (typeof require!=="undefined" && typeof module!=="undefined" && require.main===module) console.log("SYNTHETIC_ONLY_PASS "+runTests());
