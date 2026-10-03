import assert from 'node:assert/strict';
import {normalizeOptionRow,validateUnique,auditSlice} from './d12_option_row_validator_v0_1.mjs';
const base={product:'TXO',session:'REGULAR',sourceDate:'20261002',expiryDate:'20261007',expiryMonthWeek:'202610W1',strike:47000,callPut:'買權',bestBid:800,bestAsk:810,last:805,settlement:805,volume:10,openInterest:20};
let n=0; const ok=name=>console.log(`${++n}. ${name}: PASS`);
{
 const r=normalizeOptionRow(base); assert.equal(r.callPut,'CALL'); assert.equal(r.mid,805); assert.equal(r.quoteState,'PRIMARY_ELIGIBLE'); ok('clean two-sided quote');
}
{
 const r=normalizeOptionRow({...base,bestBid:0,bestAsk:10}); assert.equal(r.mid,null); assert.equal(r.quoteState,'ZERO_BID_EXCLUDED'); ok('zero bid excluded');
}
{
 assert.throws(()=>normalizeOptionRow({...base,bestBid:11,bestAsk:10}),/crossed quote/); ok('crossed quote rejected');
}
{
 assert.throws(()=>normalizeOptionRow({...base,strike:-1}),/strike must be > 0/); ok('negative strike rejected');
}
{
 const a=normalizeOptionRow({...base,strike:47000,bestBid:800,bestAsk:800});
 const b=normalizeOptionRow({...base,strike:47100,bestBid:700,bestAsk:700});
 assert.equal(auditSlice([a,b]).monotonic,'PASS'); ok('call monotonic pass');
}
{
 const a=normalizeOptionRow({...base,strike:47000,bestBid:800,bestAsk:800});
 const b=normalizeOptionRow({...base,strike:47100,bestBid:900,bestAsk:900});
 assert.equal(auditSlice([a,b]).monotonic,'FAIL'); ok('call monotonic violation detected');
}
{
 const rows=[
  normalizeOptionRow({...base,strike:47000,bestBid:900,bestAsk:900}),
  normalizeOptionRow({...base,strike:47100,bestBid:800,bestAsk:800}),
  normalizeOptionRow({...base,strike:47200,bestBid:650,bestAsk:650})];
 assert.equal(auditSlice(rows).convexity,'FAIL'); ok('convexity violation detected');
}
{
 const a=normalizeOptionRow(base); assert.throws(()=>validateUnique([a,a]),/duplicate series/); ok('duplicate rejected');
}
{
 const p1=normalizeOptionRow({...base,callPut:'賣權',strike:47000,bestBid:100,bestAsk:100});
 const p2=normalizeOptionRow({...base,callPut:'賣權',strike:47100,bestBid:120,bestAsk:120});
 assert.equal(auditSlice([p1,p2]).monotonic,'PASS'); ok('put monotonic pass');
}
{
 assert.throws(()=>normalizeOptionRow({...base,expiryDate:'20261001'}),/expiryDate precedes sourceDate/); ok('expired row rejected');
}
console.log(`PASS ${n} assertions`);
