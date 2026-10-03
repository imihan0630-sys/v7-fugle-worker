import assert from 'node:assert/strict';

function classifyOrigin(x){
 const valid=[];
 if(x.structuralReceipt===true) valid.push('STRUCTURAL_DIGESTION_NO_IDENTIFIED_SHOCK');
 if(x.marketSectorReceipt===true) valid.push('MARKET_OR_SECTOR_DRIVEN_PULLBACK');
 if(x.eventReceipt===true) valid.push('EVENT_INFORMATION_PULLBACK');
 if(x.priceLimitReceipt===true) valid.push('PRICE_LIMIT_OR_CONSTRAINED_DISCOVERY');
 if(x.liquidityReceipt?.pressureProvenance===true &&
    x.liquidityReceipt?.depthSpreadContext===true &&
    x.liquidityReceipt?.priceResponse===true &&
    x.liquidityReceipt?.persistenceOrReplenishmentState===true &&
    x.liquidityReceipt?.captureCompleteness===true)
   valid.push('LIQUIDITY_PRESSURE_CANDIDATE');
 if(valid.length===0) return 'UNKNOWN_ORIGIN';
 if(valid.length>1) return 'MULTIPLE_ORIGINS';
 return valid[0];
}

assert.equal(classifyOrigin({
 lowerShadow:true,highVolume:true,laterRebound:true
}),'UNKNOWN_ORIGIN');

assert.equal(classifyOrigin({
 liquidityReceipt:{
  pressureProvenance:true,depthSpreadContext:true,priceResponse:true,
  persistenceOrReplenishmentState:false,captureCompleteness:true
 }
}),'UNKNOWN_ORIGIN');

assert.equal(classifyOrigin({
 liquidityReceipt:{
  pressureProvenance:true,depthSpreadContext:true,priceResponse:true,
  persistenceOrReplenishmentState:true,captureCompleteness:true
 }
}),'LIQUIDITY_PRESSURE_CANDIDATE');

assert.equal(classifyOrigin({
 structuralReceipt:true,eventReceipt:true
}),'MULTIPLE_ORIGINS');

const pullbackLowAt='2026-10-02T09:45:00+08:00';
const reversalConfirmedAt='2026-10-02T10:30:00+08:00';
assert.ok(Date.parse(reversalConfirmedAt)>Date.parse(pullbackLowAt));

console.log(JSON.stringify({
 status:'PASS',
 candleOnlyOrigin:'UNKNOWN_ORIGIN',
 liquidityWithoutReplenishment:'UNKNOWN_ORIGIN',
 fullLiquidityReceipt:'LIQUIDITY_PRESSURE_CANDIDATE',
 multipleOrigin:'MULTIPLE_ORIGINS',
 maturity:'L2_REMAINS'
},null,2));
