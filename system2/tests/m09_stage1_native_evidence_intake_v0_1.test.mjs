import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {bindM09Stage1NativeEvidenceV0_1 as bind} from '../runtime/m09_stage1_native_evidence_intake_v0_1.mjs';
const H='a'.repeat(64),T='2026-10-16',NOW='2026-10-17T13:00:00Z';
const ledger={marketDate:T,ledgerSha256:H,observations:[
 {market:'TWSE',symbol:'2330'},{market:'TPEX',symbol:'3287'}]};
const receipt={marketDate:T,receiptHash:H};
const audit={auditHash:H,auditedAtUtc:'2026-10-16T11:00:00Z'};
const manifest={effectiveTradingDay:T,manifestSha256:H};
const source={manifest,sourceReceipt:receipt,auditReceipt:audit,
 sourceLedger:ledger,evaluationAtUtc:NOW};
const empty=()=>({
 schemaVersion:'S2_M09_STAGE1_NATIVE_EVIDENCE_HANDOFF_V0_1',
 scope:'EXPLICIT_OFFLINE_INDEPENDENT_AUDIT_RECEIPT_HANDOFF',
 strategyId:'SHORT_MOMENTUM',strategyVersion:'V0.1-CONTRACT',
 assessorPolicyId:'S2-ASSESSOR-SM-LAUNCH-001',assessorPolicyVersion:'0.1-LAUNCH',
 marketDate:T,manifestSha256:H,sourceReceiptHash:H,independentA1AuditHash:H,
 sourceLedgerHash:H,originalNativeEvidenceManifestHash:H,
 firstKnownAtUtc:'2026-10-16T11:00:00Z',
 observedAtUtc:'2026-10-16T11:01:00Z',
 availableAtUtc:'2026-10-16T11:02:00Z',
 selectedCount:null,zeroPickDay:null,selectionAuthorized:false,
 rankAuthorized:false,frozenD1Written:false,shadowAuthorized:false,
 system1FormalCoreChanged:false,cloudflareD1Writes:0,
 continuityBySymbol:{},companyActionCompletenessReceipt:null,
 companyActionIndependentAuditReceipt:null,
 instrumentSourceReceipt:null,instrumentIndependentAuditReceipt:null
});
const signed=async x=>({...x,receiptHash:await sha256Hex(x)});
const go=(e)=>bind({...source,evidenceBundle:e});
test('normal daily A1 has no external native proof: fail-closed defaults',async()=>{
 const r=await go(null);
 assert.equal(r.state,'NO_EXTERNAL_NATIVE_EVIDENCE__KEEP_ALL_PIT_UNKNOWN');
 assert.equal(r.companyActionCompletenessReceipt,null);
 assert.deepEqual(r.continuityBySymbol,{});
 assert.equal(r.stage1EligibilityGrantedByThisModule,false);
});
test('no native families in a correctly signed external bundle stays unknown',async()=>{
 const r=await go(await signed(empty()));
 assert.equal(r.state,'EXPLICIT_BUNDLE_NO_NATIVE_FAMILIES');
 assert.equal(r.physicalNativeOriginalVerifiedByThisModule,false);
 assert.equal(r.stage1EligibilityGrantedByThisModule,false);
});
test('one independently formatted CA pair is not equal to CFI',async()=>{
 const x=empty();
 x.companyActionCompletenessReceipt={schemaVersion:'not-verified-here'};
 x.companyActionIndependentAuditReceipt={schemaVersion:'not-verified-here'};
 const r=await go(await signed(x));
 assert.equal(r.state,'EXPLICIT_CA_ONLY__CFI_STILL_UNKNOWN');
 assert.equal(r.instrumentSourceReceipt,null);
});
test('source/strategy/ledger/market date drift cannot be substituted',async()=>{
 for(const [field,v] of [
  ['sourceReceiptHash','b'.repeat(64)],['sourceLedgerHash','b'.repeat(64)],
  ['manifestSha256','b'.repeat(64)],['marketDate','2026-10-15'],
  ['strategyVersion','V999'],['assessorPolicyVersion','0.2']]){
  const x=empty();x[field]=v;
  await assert.rejects(go(await signed(x)),/STRATEGY_SOURCE_OR_LEDGER_LINEAGE_INVALID/);
 }
});
test('self-hash tampering, date manipulation and non-PIT time fail',async()=>{
 const p=await signed(empty());p.firstKnownAtUtc='2026-10-14T10:00:00Z';
 await assert.rejects(go(p),/BUNDLE_FORMAT_OR_HASH_INVALID/);
 for(const [field,v] of [
  ['availableAtUtc','2026-10-18T00:00:00Z'],
  ['observedAtUtc','2026-10-18T00:00:00Z'],
  ['firstKnownAtUtc','2026-10-16T11:03:00Z']]){
  const x=empty();x[field]=v;
  await assert.rejects(go(await signed(x)),/SOURCE_AFTER_DECISION_OR_CLOCK_INVALID/);
 }
});
test('supplied no-event without independent CA pair cannot be imported',async()=>{
 const x=empty();x.continuityBySymbol={'2330':{
  symbol:'2330',market:'TWSE',marketDate:T,state:'CLEAR_NO_ACTION'
 }};
 await assert.rejects(go(await signed(x)),/UNVERIFIED_NO_EVENT_OR_ADJUSTMENT/);
});
test('partial CA or CFI native audit pairs reject instead of fabricating an audit',async()=>{
 const x=empty();x.companyActionCompletenessReceipt={schemaVersion:'fixture'};
 await assert.rejects(go(await signed(x)),/CA_PARTIAL_UNAUDITED/);
 const y=empty();y.instrumentIndependentAuditReceipt={schemaVersion:'fixture'};
 await assert.rejects(go(await signed(y)),/CFI_PARTIAL_UNAUDITED/);
});
test('all downstream selection/rank/Frozen/Cloudflare claim mutations forbidden',async()=>{
 for(const [field,v] of [['selectedCount',0],['zeroPickDay',true],
  ['selectionAuthorized',true],['rankAuthorized',true],
  ['frozenD1Written',true],['shadowAuthorized',true],
  ['system1FormalCoreChanged',true],['cloudflareD1Writes',1]]){
  const x=empty();x[field]=v;
  await assert.rejects(go(await signed(x)),/UNAUTHORIZED_PROMOTION/);
 }
});
test('cross-market continuity symbol swaps and duplicate unsupported symbol reject',async()=>{
 const x=empty();x.companyActionCompletenessReceipt={};
 x.companyActionIndependentAuditReceipt={};
 x.continuityBySymbol={'2330':{symbol:'2330',market:'TPEX',marketDate:T}};
 await assert.rejects(go(await signed(x)),/CONTINUITY_IDENTITY_OR_DATE_INVALID/);
 const y=empty();y.companyActionCompletenessReceipt={};
 y.companyActionIndependentAuditReceipt={};
 y.continuityBySymbol={'9999':{symbol:'9999',market:'TWSE',marketDate:T}};
 await assert.rejects(go(await signed(y)),/CONTINUITY_IDENTITY_OR_DATE_INVALID/);
});
test('normal workflow does not implicitly configure native proof environment',async()=>{
 const r=await readFile('.github/workflows/system2-shared-official-a1-independent-audit.yml','utf8');
 const runner=await readFile('system2/scripts/run_shared_official_a1_stage1_readonly_v0_1.mjs','utf8');
 assert.doesNotMatch(r,/S2_M09_NATIVE_PIT_EVIDENCE_FILE/);
 assert.match(runner,/S2_M09_NATIVE_PIT_EVIDENCE_FILE/);
 assert.match(runner,/M09_NATIVE_BUNDLE_MIXED_DIRECT_INJECTION_FORBIDDEN/);
});
