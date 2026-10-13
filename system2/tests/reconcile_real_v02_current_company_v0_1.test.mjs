import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {reconcileRealV02CompanyPreviewV0_1 as run}
 from '../scripts/reconcile_real_v02_current_company_once_v0_1.mjs';
async function fixture(){const x={schemaVersion:'S2_PRELIMINARY_PV_WATCH_V0_2',
 watchVersion:'PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2',
 marketDate:'2026-10-13',observedAtUtc:'2026-10-13T22:00:00Z',
 ordinaryEquityOnlyUniverseCertified:false,selectedCount:null,
 frozenWritten:false,displayedCount:30,
 watchlist:Array.from({length:30},(_,i)=>({
  market:i<15?'TWSE':'TPEX',symbol:String((i<15?1000:5000)+i),
  companyName:'COMPANY'+i,strategyRank:null,
  companyActionPitStatus:'UNKNOWN_NOT_CLEARED',fiveSessionReturnPct:3+i
 }))};return {...x,receiptHash:await sha256Hex(x)}}
const fetchImpl=async url=>{const market=url.includes('twse.com.tw')?'TWSE':'TPEX',
 offset=market==='TWSE'?1000:5000,rows=Array.from({length:850},(_,j)=>{
 const sym=String(offset+j);const name='COMPANY'+j;
 return market==='TWSE'?{'公司代號':sym,'公司簡稱':name}:
 {'SecuritiesCompanyCode':sym,'CompanyAbbreviation':name};
 });return{ok:true,status:200,headers:{get:()=>null},
 arrayBuffer:async()=>Buffer.from(JSON.stringify(rows))};};
test('real-shape original preview is verified, not ordinary security certified',async()=>{
 const r=await run({watch:await fixture(),fetchImpl,
  clock:()=>new Date('2026-10-14T02:00:00Z')});
 assert.equal(r.inspectedPreviewRows,30);
 assert.equal(r.ordinaryEquityClassCertified,false);
 assert.equal(r.selectedCount,null);
});
test('changed original preview without a new hash rejects',async()=>{
 const x=await fixture();x.watchlist[0].companyName='TAMPER';
 await assert.rejects(()=>run({watch:x,fetchImpl}),/TAMPERED_PRELIMINARY_HASH/);
});
test('historical clock backdating rejects',async()=>{
 await assert.rejects(()=>run({watch:await fixture(),fetchImpl,
  clock:()=>new Date('2026-10-13T20:00:00Z')}),/CURRENT_ISSUER_CLOCK_BACKDATED/);
});
