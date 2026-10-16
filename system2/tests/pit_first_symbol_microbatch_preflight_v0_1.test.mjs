import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {preflightFirstPitSymbolV0_1 as admit}
 from '../runtime/pit_first_symbol_microbatch_preflight_v0_1.mjs';

// ALL POSITIVE CASES BELOW ARE SYNTHETIC CONTRACT TESTS. They do not attest
// any actually acquired historical CFI/CA originals and are never counted
// as real PIT progress or permission to write D1.
const FAMILIES=[
 'TWSE_EX_RIGHT_DIVIDEND_ACTUAL','TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE','TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE','TPEX_PAR_VALUE_CHANGE_REFERENCE',
];
const hashChar=c=>c.repeat(64);
const cut='2026-10-19T15:45:00.000Z';
const before='2026-10-19T15:35:00.000Z';
const artifact='2026-10-19T13:00:00.000Z';
const day='2026-10-19';
function syntheticSessions(){
 const a=[];for(let t=Date.parse(day+'T00:00:00Z');a.length<61;t-=86400000){
  const w=new Date(t).getUTCDay();if(w>0&&w<6)a.unshift(new Date(t).toISOString().slice(0,10));
 } return a;
}
async function signedFixture(){
 const tradingDates=syntheticSessions();
 const s={symbol:'2330',market:'TWSE',marketDate:day,
  pitVerdict:'PIT_SCOPE_INDEPENDENTLY_ACCEPTED',
  history:{sessionCount:61,firstSessionDate:tradingDates[0],lastSessionDate:day,
   originalProviderBytesSha256:hashChar('a'),originalSourceAuditSha256:hashChar('b'),
   originalArchiveCapturedAtUtc:artifact,lastBarAvailableAtUtc:before,
   all61BarsIndividualOriginalVersionAndAsOfClocksAudited:true,
   all61BarHashesBoundToOfficialCalendar:true},
  instrumentClass:{nativeInstrumentClass:'ORDINARY_COMMON_SHARE',
   historicalNativeVersionsIndependentlyAudited:true,
   effectivePeriods:[{from:tradingDates[0],through:day,nativeCfi:'ESVUFR',
    originalNativeSha256:hashChar('c'),originalCapturedAtUtc:artifact,
    firstKnownAtUtc:artifact,availableAtUtc:artifact}]},
  corporateActions:{scopeFirstSessionDate:tradingDates[0],scopeLastSessionDate:day,
   allCorrectionsAndCancellationsIndependentlyAudited:true,
   allSuspensionsAndReinstatementsIndependentlyAudited:true,
   authoritativeNegativeNoEventScopeIndependentlyAudited:true,
   sixNativeFamilies:FAMILIES.map((sourceId,i)=>({
    sourceId,originalNativeSha256:hashChar(String(i+1)),
    originalCapturedAtUtc:artifact,availableAtUtc:artifact}))},
 };
 const h={schemaVersion:'S2_DATA_SYMBOL_PIT_SCOPE_HANDOFF_V0_1',
  marketDate:day,decisionCutAtUtc:cut,sourceSecurityWindowCount:1935,
  sourceOriginalReceiptHash:hashChar('d'),sourceIndependentAuditHash:hashChar('e'),
  officialTradingDates:tradingDates,officialTradingDatesOriginalSha256:hashChar('f'),
  symbols:[s],selectionAuthorized:false,shadowAuthorized:false,
  frozenD1Written:false,selectedCount:null,zeroPickDay:null};
 const a={schemaVersion:'S2_AUDIT_SYMBOL_PIT_SCOPE_RECEIPT_V0_1',
  dataHandoffReceiptHash:null,marketDate:day,decisionCutAtUtc:cut,
  verdict:'PIT_SCOPE_INDEPENDENTLY_ACCEPTED',auditRunId:9876,auditArtifactId:6543,
  originalArchiveSha256:hashChar('9'),originalArchiveCapturedAtUtc:before,
  independentVerifiedAtUtc:'2026-10-20T01:00:00.000Z',
  originalProviderBytesIndependentlyRehashed:true,
  originalDecisionCutArchiveIndependentlyWitnessed:true,
  classPeriodsPerSymbolIndependentlyAudited:true,
  caRevisionAndNegativeScopeIndependentlyAudited:true,
  auditedSymbols:[{symbol:'2330',market:'TWSE',dataSymbolSha256:null,
   verdict:'PIT_SCOPE_INDEPENDENTLY_ACCEPTED'}]};
 return reseal({h,a});
}
async function reseal({h,a}){
 delete h.receiptHash;h.receiptHash=await sha256Hex(h);
 a.dataHandoffReceiptHash=h.receiptHash;
 a.auditedSymbols[0].dataSymbolSha256=await sha256Hex(h.symbols[0]);
 delete a.receiptHash;a.receiptHash=await sha256Hex(a);
 return {dataHandoff:h,independentAudit:a,
  expectedIndependentAuditHash:a.receiptHash};
}
test('REAL repository DATA currently has zero historical PIT accepted; this new path remains inactive',async()=>{
 const real=JSON.parse(readFileSync('system2/migration/evidence/S2_DATA_ISSUE1068_PIT_SOURCE_HANDOFF_20261016_V0_1.json','utf8'));
 assert.equal(real.handoffScope.pitEligibleSymbolCount,0);
 assert.equal(real.handoffScope.unresolvedSymbolCount,1935);
 const r=await admit({});
 assert.equal(r.pitScopeIndependentlyAcceptedCount,0);
 assert.equal(r.pitEvidenceUnknownCount,null);
 assert.equal(r.strategyActuallyAssessedCount,null);
 assert.equal(r.selectedCount,null);assert.equal(r.zeroPickDay,null);
});
test('SYNTHETIC one-symbol independently hash-bound positive microbatch still cannot select/freeze',async()=>{
 const r=await admit(await signedFixture());
 assert.equal(r.state,'PIT_SYMBOL_MICROBATCH_ADMITTED_FOR_STAGE1_RESEARCH_ONLY');
 assert.equal(r.sourceSecurityWindowCount,1935);
 assert.equal(r.pitScopeIndependentlyAcceptedCount,1);
 assert.equal(r.pitEvidenceUnknownCount,1934);
 assert.equal(r.eligibleForStage1ResearchSymbols[0].symbol,'2330');
 assert.equal(r.strategyActuallyAssessedCount,null);
 assert.equal(r.rankedCount,null);assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);assert.equal(r.fullMarketSelectionAuthorized,false);
 assert.equal(r.qualifiedShadowAuthorized,false);assert.equal(r.frozenD1Written,false);
 assert.equal(r.cloudflareD1Writes,0);assert.equal(r.system1FormalCoreChanged,false);
});
test('no independent out-of-band audit pin rejects self-hashed producer',async()=>{
 const x=await signedFixture();
 for(const change of [
  {...x,expectedIndependentAuditHash:null},
  {...x,expectedIndependentAuditHash:hashChar('0')},
  {...x,independentAudit:null},
 ]){
  await assert.rejects(admit(change),/AUDIT_NOT_EXTERNALLY_PINNED|EXTERNAL_INDEPENDENT_AUDIT_OR_CUT_INVALID/);
 }
});
test('changing signed data or fake selection/Frozen authority is not accepted',async()=>{
 for(const mutation of [
  x=>x.h.selectedCount=0,x=>x.h.zeroPickDay=true,
  x=>x.h.selectionAuthorized=true,x=>x.h.frozenD1Written=true,
  x=>x.h.officialTradingDates[60]='2026-10-18',
 ]){
  const {dataHandoff:h,independentAudit:a}=await signedFixture();
  mutation({h,a});
  const x=await reseal({h,a});
  await assert.rejects(admit(x),/DATA_ORIGINAL_SCOPE_OR_HASH_INVALID/);
 }
});
test('late original cut, fabricated source, missing CA negative family or historical CFI span must fail',async()=>{
 const cases=[
  [x=>x.h.symbols[0].history.originalArchiveCapturedAtUtc='2026-10-19T16:00:00.000Z',
   /SYMBOL_A1_HISTORICAL_ASOF_NOT_ATTESTED/],
  [x=>x.h.symbols[0].history.all61BarsIndividualOriginalVersionAndAsOfClocksAudited=false,
   /SYMBOL_A1_HISTORICAL_ASOF_NOT_ATTESTED/],
  [x=>x.h.symbols[0].instrumentClass.effectivePeriods[0].from=day,
   /CLASS_61_SESSION_EFFECTIVE_PERIOD_GAP_OR_OVERLAP/],
  [x=>x.h.symbols[0].instrumentClass.effectivePeriods[0].originalCapturedAtUtc='2026-10-19T16:00:00.000Z',
   /CLASS_NATIVE_VERSION_OR_CLOCK_INVALID/],
  [x=>x.h.symbols[0].corporateActions.sixNativeFamilies.pop(),
   /CORPORATE_ACTION_NEGATIVE_OR_REVISION_SCOPE_UNVERIFIED/],
  [x=>x.h.symbols[0].corporateActions.authoritativeNegativeNoEventScopeIndependentlyAudited=false,
   /CORPORATE_ACTION_NEGATIVE_OR_REVISION_SCOPE_UNVERIFIED/],
  [x=>x.h.symbols[0].corporateActions.sixNativeFamilies[0].availableAtUtc='2026-10-19T16:00:00.000Z',
   /SIX_NATIVE_CA_FAMILY_OR_CLOCK_INVALID/],
  [x=>x.h.symbols[0].corporateActions.sixNativeFamilies[0].sourceId='FAKE_CA',
   /SIX_NATIVE_CA_FAMILY_OR_CLOCK_INVALID/],
  [x=>x.a.originalDecisionCutArchiveIndependentlyWitnessed=false,
   /EXTERNAL_INDEPENDENT_AUDIT_OR_CUT_INVALID/],
 ];
 for(const [patch,reason] of cases){
  const {dataHandoff:h,independentAudit:a}=await signedFixture();
  patch({h,a});const x=await reseal({h,a});
  await assert.rejects(admit(x),reason);
 }
});
test('forged signed audit, mismatched symbol digest, and wrong audit scope fail closed',async()=>{
 const x=await signedFixture();x.independentAudit.auditedSymbols[0].dataSymbolSha256=hashChar('0');
 await assert.rejects(admit(x),/EXTERNAL_INDEPENDENT_AUDIT_OR_CUT_INVALID/);
 const y=await signedFixture();y.independentAudit.auditedSymbols[0].dataSymbolSha256=hashChar('0');
 delete y.independentAudit.receiptHash;
 y.independentAudit.receiptHash=await sha256Hex(y.independentAudit);
 y.expectedIndependentAuditHash=y.independentAudit.receiptHash;
 await assert.rejects(admit(y),/SYMBOL_INDEPENDENT_AUDIT_BINDING_INVALID/);
});
test('BUILD code does not fetch official source, mutate Cloudflare, select or issue a trade',()=>{
 const s=readFileSync('system2/runtime/pit_first_symbol_microbatch_preflight_v0_1.mjs','utf8');
 assert.doesNotMatch(s,/\bfetch\s*\(|INSERT INTO|UPDATE\s+|DELETE FROM|api\.cloudflare\.com/);
 assert.match(s,/originalDecisionCutArchiveIndependentlyWitnessed/);
 assert.match(s,/authoritativeNegativeNoEventScopeIndependentlyAudited/);
});
