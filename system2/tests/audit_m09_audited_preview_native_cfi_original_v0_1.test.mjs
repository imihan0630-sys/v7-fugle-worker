import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {auditM09ThirtyNativeOriginalsV0_1 as audit}
 from '../scripts/audit_m09_audited_preview_native_cfi_original_v0_1.mjs';
const SHA=b=>createHash('sha256').update(b).digest('hex');
const at='2026-10-15T02:30:00Z';
const sample=(code,market,type='Stocks',board=market==='TWSE'?'TWSE LISTED':'TPEx LISTED')=>{
 const cfi=type==='Stocks'?'ESVUFR':type==='TDR'?'EDSDDR':'CEOGEU';
 const s=['<!doctype html><html><body><table><tr><td>1</td><td>TW0002330008</td><td>',
  code,'</td><td>CO</td><td>',board,'</td><td>',type,
  '</td><td>TECH</td><td>1994/09/05</td><td>',cfi,'</td><td></td></tr></table></body></html>'].join('');
 return {raw:Buffer.from(s),cfi,type,board};
};
async function fixture(){
 const raws={},obs=[];
 for(let i=0;i<30;i++){
  const symbol=String(1000+i),market=i%2===0?'TWSE':'TPEX';
  const isTib=i===0,isDr=i===1;
  const {raw,cfi,type,board}=sample(symbol,market,isDr?'TDR':'Stocks',
   isTib?'TAIWAN INNOVATION BOARD':undefined);
  raws[symbol]=raw;
  obs.push({market,symbol,
   currentNativeIdentityStatus:isDr?'CURRENT_NATIVE_NON_SHARE_EXPLICIT':'CURRENT_NATIVE_STOCK_CFI_OBSERVED',
   nativeExchangeBoard:isTib?'TWSE_INNOVATION_BOARD_TIB':market+'_MAIN',
   nativeMarketMatchesPreliminaryMarket:true,
   nativeTypeLabel:type,nativeMarketLabel:board,cfi,isin:'TW0002330008',
   originalProviderSha256:SHA(raw),originalProviderBytes:raw.length,
   originalSourceStatus:'NATIVE_SINGLE_CFI_ROW_OBSERVED',
   positiveOrdinaryEquityPitAdmitted:false,historicalSecurityClassPitCertified:false});
 }
 const base={schemaVersion:'S2_M09_AUDITED_PRELIMINARY_NATIVE_CFI_V0_1',
  evidenceClass:'ONLY_CURRENT_AS_OBSERVED_NATIVE_INSTRUMENT_TYPE_NOT_HISTORICAL_PIT',
  preliminaryDenominator:30,perSymbolNativeRequestsMade:30,
  originalMarketDate:'2026-10-14',originalA1SourceReceiptHash:'a'.repeat(64),
  independentA1AuditHash:'b'.repeat(64),originalPreliminaryWatchHash:'c'.repeat(64),
  currentNativeObservationFinishedUtc:at,
  currentNativeStockCfiObserved:29,currentNativeNonShareExplicit:1,
  currentNativeUnverified:0,currentNativeInnovationBoardStocks:1,
  historicalOrdinarySharePitCertified:0,
  historicalOrdinarySharePitDenominatorCertified:false,
  formalShortMomentumQualified:false,selectedCount:null,frozenD1Written:false,
  observations:obs};
 return {sourceReceipt:{...base,receiptHash:await sha256Hex(base)},
  readOriginal:async(code)=>raws[code],sourceRunId:111,auditedAtUtc:'2026-10-15T02:35:00Z',raws};
}
test('independent original bytes rehash all 30 and reproduce TWSE innovation subtype',async()=>{
 const f=await fixture(),r=await audit(f);
 assert.equal(r.auditedSymbolDenominator,30);
 assert.equal(r.originalProviderResponsesRehashed,30);
 assert.equal(r.nativeCurrentStockRowsReproduced,29);
 assert.equal(r.nativeCurrentNonShareRowsReproduced,1);
 assert.equal(r.taiwanInnovationBoardRowsReproduced,1);
 assert.equal(r.innovationBoardSpecialStrategyEligibilityCertified,false);
 assert.equal(r.historicalOrdinarySharePITCertified,false);
 assert.equal(r.historicalOrdinarySharePITCount,0);
 assert.equal(r.selectedCount,null);assert.equal(r.frozenD1Written,false);
 const {auditHash,...base}=r;assert.equal(auditHash,await sha256Hex(base));
});
test('real shorter 2/2 preview rehashes its actual signed denominator, never fabricates 30',async()=>{
 const f=await fixture(),r=f.sourceReceipt;
 r.observations=r.observations.slice(0,2);
 r.preliminaryDenominator=2;r.perSymbolNativeRequestsMade=2;
 r.currentNativeStockCfiObserved=1;r.currentNativeNonShareExplicit=1;
 r.currentNativeInnovationBoardStocks=1;
 r.receiptHash=await sha256Hex(
  Object.fromEntries(Object.entries(r).filter(([k])=>k!=='receiptHash')));
 const audited=await audit(f);
 assert.equal(audited.auditedSymbolDenominator,2);
 assert.equal(audited.originalProviderResponsesRehashed,2);
 assert.equal(audited.nativeCurrentStockRowsReproduced,1);
 assert.equal(audited.historicalOrdinarySharePITCertified,false);
});
test('signed 31-security preview cannot be accepted by independent audit',async()=>{
 const f=await fixture();
 f.sourceReceipt.preliminaryDenominator=31;
 f.sourceReceipt.perSymbolNativeRequestsMade=31;
 f.sourceReceipt.receiptHash=await sha256Hex(
  Object.fromEntries(Object.entries(f.sourceReceipt).filter(([k])=>k!=='receiptHash')));
 await assert.rejects(()=>audit(f),
  /M09_INDEPENDENT_NATIVE_CFI_SOURCE_RECEIPT_SCOPE_HASH_OR_CLOCK_INVALID/);
});
test('one altered source body is never a certified 30/30 witness',async()=>{
 const f=await fixture(),read=f.readOriginal;
 f.readOriginal=async(code)=>code==='1004'?Buffer.from('tampered'):read(code);
 await assert.rejects(()=>audit(f),/M09_INDEPENDENT_NATIVE_CFI_ORIGINAL_BYTE_SHA_MISMATCH/);
});
test('tampered source signed aggregate hash fails before original read',async()=>{
 const f=await fixture();let reads=0;
 f.sourceReceipt.currentNativeStockCfiObserved=30;
 f.readOriginal=async()=>{reads++;throw Error('NOT_CALLED')};
 await assert.rejects(()=>audit(f),/M09_INDEPENDENT_NATIVE_CFI_SOURCE_RECEIPT_SCOPE_HASH_OR_CLOCK_INVALID/);
 assert.equal(reads,0);
});
test('audit cannot reuse retrospective time earlier than native source observation',async()=>{
 const f=await fixture();f.auditedAtUtc='2026-10-14T15:45:00Z';
 await assert.rejects(()=>audit(f),/M09_INDEPENDENT_NATIVE_CFI_SOURCE_RECEIPT_SCOPE_HASH_OR_CLOCK_INVALID/);
});
test('fake native market or class differs from original and is rejected',async()=>{
 const f=await fixture();f.sourceReceipt.observations[0].nativeExchangeBoard='TWSE_MAIN';
 const {receiptHash,...base}=f.sourceReceipt;
 f.sourceReceipt.receiptHash=await sha256Hex(base);
 await assert.rejects(()=>audit(f),/M09_INDEPENDENT_NATIVE_CFI_PRIMARY_INDEPENDENT_CLASS_DIFFERENCE/);
});
test('workflows only run independent readback after signed main source success',async()=>{
 const w=await readFile('.github/workflows/system2-m09-native-preview-cfi-independent-audit.yml','utf8');
 assert.match(w,/workflow_run:/);
 assert.match(w,/types: \[completed\]/);
 assert.match(w,/github.event.workflow_run.conclusion == 'success'/);
 assert.match(w,/github.event.workflow_run.event == 'push'/);
 assert.match(w,/contents: read/);assert.match(w,/actions: read/);
 assert.doesNotMatch(w,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
});
