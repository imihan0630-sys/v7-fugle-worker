import assert from 'node:assert/strict';
import {buildIndicatorSnapshot} from './technical_indicator_core_v0_1.mjs';
import {validateTechnicalSource,buildGuardedTechnicalSnapshot} from './technical_indicator_source_guard_v0_1.mjs';

const days=Array.from({length:50},(_,i)=>{
  const date=new Date(Date.UTC(2026,0,1+i)).toISOString().slice(0,10);
  const close=100+i;
  return {symbol:'TEST',date,open:close,high:close+1,low:close-1,close,
    symbolSessionVerified:true,technicalContinuity:true,corporateActionContinuityResolved:true,
    observedRawBarIdentity:`synthetic-${i}`,sourceBarHash:`hash-${i}`,
    rawFieldProvenance:{open:'OBSERVED',high:'OBSERVED',low:'OBSERVED',close:'OBSERVED'}};
});
const context={symbol:'TEST',source:'SYNTHETIC',continuitySpace:'TECHNICAL_CONTINUITY',
  pointInTimeEligible:true,asOf:'2026-03-01T12:00:00+08:00',
  sourceAvailableAt:'2026-02-20T12:00:00+08:00',
  parentDecisionReceiptId:'synthetic-parent',rawHistoryAdmissionReceiptId:'synthetic-raw',
  continuityReceiptId:'synthetic-continuity',
  symbolSessionContractVersion:'synthetic-session-v1',continuityEngineVersion:'synthetic-engine-v1'};
const probe=(mutate,overrides={})=>{
  const rows=days.map(x=>({...x}));
  mutate?.(rows);
  return buildGuardedTechnicalSnapshot(rows,{...context,...overrides});
};
const valid=probe();
assert.equal(valid.dataQualityState,'VALID');
assert.equal(valid.guardVersion,'TECHNICAL_SOURCE_GUARD_V0_1');
const reference=buildIndicatorSnapshot(days,{strictSemantics:true,source:'SYNTHETIC',
  continuitySpace:'TECHNICAL_CONTINUITY'});
for(const family of ['kd','rsi','macd']) assert.deepEqual(valid[family],reference[family]);
const blocked=(mutate,reason,overrides={})=>{
  const result=probe(mutate,overrides);
  assert.equal(result.dataQualityState,'BLOCKED',reason);
  assert.equal(result.blockedReason,reason);
  assert.equal(result.kd,null);assert.equal(result.rsi,null);assert.equal(result.macd,null);
};
blocked(r=>{r[20].close=null},'INVALID_OR_NONPOSITIVE_PRICE');
blocked(r=>{r[20].close=''},'INVALID_OR_NONPOSITIVE_PRICE');
blocked(r=>{r[20].close=true},'INVALID_OR_NONPOSITIVE_PRICE');
blocked(r=>{r[20].close=-1},'INVALID_OR_NONPOSITIVE_PRICE');
blocked(r=>{r[20].close=0},'INVALID_OR_NONPOSITIVE_PRICE');
blocked(r=>{r[20].close='0x64'},'INVALID_OR_NONPOSITIVE_PRICE');
blocked(r=>{r[20].close=110},'OHLC_GEOMETRY');
blocked(r=>{r[20].open=110},'OHLC_GEOMETRY');
blocked(r=>{r[20].high=r[20].close;r[20].rawFieldProvenance={...r[20].rawFieldProvenance,high:'SYNTHESIZED'}},'OHLC_OBSERVATION_PROVENANCE_UNVERIFIED');
blocked(r=>{r[20].sourceBarHash=null},'OHLC_OBSERVATION_PROVENANCE_UNVERIFIED');
blocked(r=>{r[20].rawFieldProvenance=null},'OHLC_OBSERVATION_PROVENANCE_UNVERIFIED');
blocked(r=>{r[20].symbol='OTHER'},'ROW_SYMBOL_MISMATCH');
blocked(r=>{r[20].date=r[19].date},'DUPLICATE_OR_OUT_OF_ORDER_DATE');
blocked(r=>{r[20].date='2026-02-30'},'INVALID_TRADE_DATE');
blocked(r=>{r[20].technicalContinuity=false},'CONTINUITY_UNVERIFIED');
blocked(r=>{r[20].noTradePseudoBar=true},'PSEUDO_BAR');
blocked(null,'PIT_UNVERIFIED',{sourceAvailableAt:'2026-03-02T12:00:00+08:00'});
blocked(null,'PIT_UNVERIFIED',{pointInTimeEligible:false});
blocked(null,'PRICE_SPACE_UNVERIFIED',{continuitySpace:'RAW_EXECUTION'});
blocked(null,'MISSING_SOURCE_IDENTITY',{source:null});
blocked(null,'MISSING_UPSTREAM_RECEIPT',{continuityReceiptId:null});
const numericStrings=days.map(r=>({...r,open:String(r.open),high:String(r.high),
  low:String(r.low),close:String(r.close)}));
assert.equal(validateTechnicalSource(numericStrings,context).valid,true);
const future=days.map(r=>({...r}));
future[49].date='2026-03-02';
assert.equal(validateTechnicalSource(future,context).reason,'FUTURE_BAR');
const constrained=probe(r=>{r[20].priceLimitConstrained=true});
assert.equal(constrained.dataQualityState,'VALID');
assert.equal(constrained.interpretationState,'CONSTRAINED');
assert.equal(probe(r=>{r[20].open=null;r[20].rawFieldProvenance={...r[20].rawFieldProvenance,open:'MISSING'}}).dataQualityState,'VALID');
assert.deepEqual(probe(),valid,'same input must replay exactly');
console.log('PASS: isolated source-guard adversarial and replay assertions; zero outcome joins');
