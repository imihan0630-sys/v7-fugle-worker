import test from 'node:test';
import assert from 'node:assert/strict';
import {readDestinationD1AccountQuotaV0_1 as read,validateDestinationQuotaGroupV0_1 as validate}
 from '../migration/build00_destination_account_quota_analytics_readonly_v0_1.mjs';
const db='1'.repeat(32),day='2026-10-11';
function snapshot({date=day,id=db,r=2200,w=105,q=11,z=1}={}){
 return {data:{viewer:{accounts:[{d1AnalyticsAdaptiveGroups:[{
  dimensions:{date,databaseId:id},
  sum:{rowsRead:r,rowsWritten:w,readQueries:q,writeQueries:z}
 }]}]}}};
}
test('original complete one-database GraphQL receipt is accepted only as shape evidence',()=>{
 assert.deepEqual(validate(snapshot(),day,db),{
  rowsReadLowerBound:2200,rowsWrittenLowerBound:105,
  readQueriesLowerBound:11,writeQueriesLowerBound:1});
});
test('missing account is not 0 usage',()=>{
 assert.throws(()=>validate({data:{viewer:{accounts:[]}}},day,db),/ACCOUNT_COVERAGE_MISSING/);
});
test('unseen database 0 groups is NOT counted as 0 writes',()=>{
 const x=snapshot();x.data.viewer.accounts[0].d1AnalyticsAdaptiveGroups=[];
 assert.throws(()=>validate(x,day,db),/DATABASE_DAY_UNIVERSE_UNVERIFIED/);
});
test('more than one source/target database same account not accepted',()=>{
 const x=snapshot();x.data.viewer.accounts[0].d1AnalyticsAdaptiveGroups.push({
  dimensions:{date:day,databaseId:'2'.repeat(32)},
  sum:{rowsRead:0,rowsWritten:0,readQueries:0,writeQueries:0}});
 assert.throws(()=>validate(x,day,db),/DATABASE_DAY_UNIVERSE_UNVERIFIED/);
});
test('wrong UTC day cannot bleed quota into the next 08:00 Taipei reset',()=>{
 assert.throws(()=>validate(snapshot({date:'2026-10-12'}),day,db),/WRONG_DATABASE_OR_UTC_DAY/);
});
test('wrong DB prevents source-account quota contamination',()=>{
 assert.throws(()=>validate(snapshot({id:'3'.repeat(32)}),day,db),/WRONG_DATABASE_OR_UTC_DAY/);
});
test('fractional, negative, NaN, null and unknown counted values fail closed',()=>{
 for(const w of [-1,NaN,1.1,null,undefined,'0',Number.MAX_SAFE_INTEGER+10]){
  assert.throws(()=>validate(snapshot({w}),day,db),/USAGE_VALUES_INVALID/);
 }
});
test('account grouping cannot be missing to invent a current usable headroom',()=>{
 const x=snapshot();delete x.data.viewer.accounts[0].d1AnalyticsAdaptiveGroups;
 assert.throws(()=>validate(x,day,db),/DATABASE_DAY_UNIVERSE_UNVERIFIED/);
});
test('live client refuses unknown account identity before ANY provider request',async()=>{
 let requests=0;
 await assert.rejects(()=>read({accountId:'a'.repeat(32),
  metadataToken:'sample',analyticsToken:'sample',
  fetchImpl:async()=>{requests++;throw Error('MUST_NOT_CALL_NETWORK')}}),/ACCOUNT_IDENTITY_MISMATCH/);
 assert.equal(requests,0);
});
test('live client refuses missing analytics token before ANY provider request',async()=>{
 let requests=0;
 await assert.rejects(()=>read({accountId:'0'.repeat(32),
  metadataToken:'a',fetchImpl:async()=>{requests++;throw Error('MUST_NOT_CALL_NETWORK')}}),
  /ACCOUNT_IDENTITY_MISMATCH|ACCOUNT_ANALYTICS_TOKEN_REQUIRED/);
 assert.equal(requests,0);
});
test('code cannot grant spendable rowsWritten from lagged GraphQL sampling',async()=>{
 const {readFileSync}=await import('node:fs');
 const text=readFileSync('system2/migration/build00_destination_account_quota_analytics_readonly_v0_1.mjs','utf8');
 assert.match(text,/realTimeSpendableAccountRowsWritten:null/);
 assert.match(text,/providerAnalyticsFreshnessUpperBoundSeconds:null/);
 assert.match(text,/D1CopyAuthorizedByThisReceipt:false/);
 assert.match(text,/sameDayIndexAndRetryBilledRowsMeasured:false/);
 assert.match(text,/sourceEncryptedBackupPITIndependentAuditPassed:false/);
});
test('Cloudflare request surface excludes D1 query/execute, import, Worker deploy and source access',async()=>{
 const {readFileSync}=await import('node:fs');
 const text=readFileSync('system2/migration/build00_destination_account_quota_analytics_readonly_v0_1.mjs','utf8');
 assert.match(text,/\/d1\/database\?per_page=100/);
 assert.match(text,/\/graphql/);
 for(const forbidden of ['d1/database/'+db+'/query','wrangler deploy','INSERT INTO ',
  'UPDATE s2_','DROP TABLE ','/workers/scripts/','/export']) {
  assert(!text.includes(forbidden));
 }
});
