import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {probeM09TwseNativeTypeV0_1 as probe,
 runM09TwseNativeTypeV0_1 as run} from '../scripts/probe_m09_twse_native_type_readonly_v0_1.mjs';
const observedAtUtc='2026-10-14T08:30:00Z';
const inspect=async payload=>probe({requestedDate:'2026-10-13',
 rawBytes:Buffer.from(JSON.stringify(payload)),observedAtUtc});
const table=(title,fields,data)=>({title,fields,data});
test('native aggregate 1.一般股票 / 2.台灣存託憑證 cannot certify even one symbol',async()=>{
 const receipt=await inspect({stat:'OK',date:'20261013',tables:[
  table('大盤統計資訊',['成交統計','成交金額'],[
   ['1.一般股票','100000'],['2.台灣存託憑證','30000']]) ]});
 assert.equal(receipt.sourceDateExact,true);
 assert.equal(receipt.explicitOrdinaryFourDigitRows,0);
 assert.equal(receipt.aggregateStockAndDepositaryCategoryObserved,true);
 assert.equal(receipt.state,'AGGREGATE_OR_TYPE_UNVERIFIED');
 assert.equal(receipt.ordinaryEquityAdmissionEnabled,false);
 assert.equal(receipt.perSymbolPITSourceRowsCertified,false);
 assert.equal(receipt.selectedCount,null);
});
test('explicit native per-symbol group distinguishes ordinary rows from DR and publishes counts ONLY',async()=>{
 const receipt=await inspect({stat:'OK',date:'20261013',tables:[
  table('一般股票',['證券代號','證券名稱','收盤價'],[
   ['2330','台積電','100'],['2317','鴻海','200']]),
  table('台灣存託憑證',['證券代號','證券名稱','收盤價'],[
   ['9103','美德醫療-DR','6']]) ]});
 assert.equal(receipt.state,'PER_SYMBOL_EXPLICIT_TYPE_CANDIDATE_UNAUDITED');
 assert.equal(receipt.explicitOrdinaryFourDigitRows,2);
 assert.equal(receipt.explicitDepositaryFourDigitRows,1);
 assert.equal(receipt.ordinaryEquityAdmissionEnabled,false);
 assert(!JSON.stringify(receipt).includes('台積電'));
 assert(!JSON.stringify(receipt).includes('9103'));
});
test('native same-row type label can be counted without trusting code shape',async()=>{
 const receipt=await inspect({stat:'OK',date:'20261013',tables:[
  table('每日行情',['證券代號','證券名稱','證券種類'],[
   ['2330','台積電','一般股票'],['9103','美德醫療-DR','台灣存託憑證'],
   ['8000','UNKNOWN','ETF']]) ]});
 assert.equal(receipt.explicitOrdinaryFourDigitRows,1);
 assert.equal(receipt.explicitDepositaryFourDigitRows,1);
 assert.equal(receipt.fourDigitQuotedRowsInspected,3);
});
test('typed row under mismatched provider date cannot be PIT or per-symbol positive',async()=>{
 const r=await inspect({stat:'OK',date:'20261012',tables:[
  table('一般股票',['證券代號','證券名稱'],[['2330','台積電']])]});
 assert.equal(r.sourceDateExact,false);
 assert.equal(r.state,'EXACT_DATE_NOT_PROVEN');
 assert.equal(r.perSymbolPITSourceRowsCertified,false);
});
test('a duplicate typed symbol cannot be silently admitted',async()=>{
 const r=await inspect({stat:'OK',date:'20261013',tables:[
  table('一般股票',['證券代號','證券名稱'],[
   ['2330','台積電'],['2330','台積電2']])]});
 assert.equal(r.ambiguousDuplicateCodes,1);
 assert.equal(r.state,'AGGREGATE_OR_TYPE_UNVERIFIED');
 assert.equal(r.explicitOrdinaryFourDigitRows,0);
});
test('invalid JSON, truncated body and impossible requested day fail closed',async()=>{
 await assert.rejects(()=>probe({requestedDate:'2026-02-30',
  rawBytes:Buffer.from('{}'),observedAtUtc}),/REQUEST_CLOCK_INVALID/);
 await assert.rejects(()=>probe({requestedDate:'2026-10-13',
  rawBytes:Buffer.from('Not official'),observedAtUtc}),/ORIGINAL_BYTES_INVALID/);
 await assert.rejects(()=>probe({requestedDate:'2026-10-13',
  rawBytes:Buffer.from('Not real body '.repeat(25)),observedAtUtc}),/NOT_JSON/);
});
test('HTTP 503 produces a signed negative receipt but no promotion',async()=>{
 const r=await run({requestedDate:'2026-10-13',fetchImpl:async()=>({
  ok:false,status:503}),now:()=>new Date(observedAtUtc)});
 assert.equal(r.state,'ORIGINAL_SOURCE_UNAVAILABLE_FAIL_CLOSED');
 assert.equal(r.blocker,'SOURCE_HTTP_UNAVAILABLE');
 assert.equal(r.explicitOrdinaryFourDigitRows,0);
 const {receiptHash,...base}=r;
 assert.equal(await sha256Hex(base),receiptHash);
 assert.equal(r.ordinaryEquityAdmissionEnabled,false);
});
test('read-only probe must not mutate formal runtime or Cloudflare',async()=>{
 const {readFile}=await import('node:fs/promises');
 const [src,workflow]=await Promise.all([
  readFile('system2/scripts/probe_m09_twse_native_type_readonly_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-m09-twse-native-type-readonly.yml','utf8')]);
 assert.match(workflow,/contents: read/);
 assert.doesNotMatch(workflow,/contents: write|schedule:|secrets\./);
 assert.doesNotMatch(src,/wrangler|api\.cloudflare\.com|INSERT INTO|CREATE TABLE|git push/);
});
