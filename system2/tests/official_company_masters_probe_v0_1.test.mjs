import test from 'node:test';
import assert from 'node:assert/strict';
import {probeOfficialCompanyMastersV0_1 as probe}
 from '../scripts/probe_official_company_masters_readonly_v0_1.mjs';
const now=()=>new Date('2026-10-14T03:30:00Z');
function body(mkt,rows=850){
 return Buffer.from(JSON.stringify(Array.from({length:rows},(_,i)=>{
 const code=String((mkt==='TWSE'?1000:5000)+i);
 return mkt==='TWSE'?{'公司代號':code,'公司簡稱':'COMPANY'+code}:
  {'SecuritiesCompanyCode':code,'Company Abbreviation':'COMPANY'+code};
 })));
}
function fetcher(config={}){
 return async url=>{
  const m=url.includes('twse.com.tw')?'TWSE':'TPEX';
  const raw=config.empty?Buffer.from('[]'):body(m);
  return {ok:!config.bad,status:config.bad?503:200,
   headers:{get:()=>null},arrayBuffer:async()=>raw};
 };
}
test('two official distinct markets identity proved only as current company profiles',async()=>{
 const r=await probe({fetchImpl:fetcher(),clock:now});
 assert.equal(r.officialCompanyProfileLanesReady,2);
 assert.equal(r.lanes[0].fourDigitCompanyCount,850);
 assert.equal(r.lanes[1].fourDigitCompanyCount,850);
 assert.equal(r.ordinaryEquityClassCertified,false);
 assert.equal(r.noHistoricAvailableAtBackfill,true);
 assert.equal(r.selectedCount,null);
});
test('one official transport denial is not all-ready',async()=>{
 const r=await probe({fetchImpl:fetcher({bad:true}),clock:now});
 assert.equal(r.allCurrentCompanyProfilesObserved,false);
 assert.equal(r.lanes.every(x=>x.state==='OFFICIAL_COMPANY_PROFILE_NOT_CONFIRMED'),true);
});
test('empty HTTP 200 is not positive company master',async()=>{
 const r=await probe({fetchImpl:fetcher({empty:true}),clock:now});
 assert.equal(r.allCurrentCompanyProfilesObserved,false);
 assert.equal(r.lanes[0].rowCount,null);
});
test('historical PIT certification never follows from current source',async()=>{
 const r=await probe({fetchImpl:fetcher(),clock:now});
 assert.equal(r.isFinalSecurityMaster,false);
 assert.equal(r.lanes.some(x=>x.independentOrdinaryEquitySecurityClassCertified),false);
 assert.equal(r.frozenWritten,false);
});
test('bounded read-only program cannot change Worker or Cloudflare',async()=>{
 const {readFile}=await import('node:fs/promises');
 const s=await readFile('system2/scripts/probe_official_company_masters_readonly_v0_1.mjs','utf8');
 assert.doesNotMatch(s,/INSERT INTO|api\.cloudflare\.com|git push|DELETE FROM/);
});
