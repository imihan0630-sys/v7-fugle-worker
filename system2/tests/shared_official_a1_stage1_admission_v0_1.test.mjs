import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildSharedOfficialA1MarketManifestV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {admitSharedOfficialA1ToShortMomentumStage1V0_1 as admit}
 from '../runtime/shared_official_a1_stage1_admission_v0_1.mjs';

const H='a'.repeat(64),marketDate='2026-10-13',evaluationAtUtc='2026-10-13T14:30:00Z';
const dates=Array.from({length:61},(_,i)=>{
 const d=new Date('2026-08-14T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
 return d.toISOString().slice(0,10);
});
async function fixture(){
 const receipts=[];
 for(const date of dates)for(const market of ['TWSE','TPEX'])receipts.push({
   market,marketDate:date,sourceId:'OFFICIAL_'+market,sourceUrl:'https://example.test/'+market+'/'+date,
   providerReportedDate:date,originalRawResponseSha256:await sha256Hex({market,date}),
   originalRawResponseBytes:1000,capturedAt:'2026-10-13T13:00:00Z',rowCount:700,
   sourceDateEvidenceBasis:'PROVIDER_REPORTED_DATE',rawProviderBytesPreserved:true,
   reusedOriginalEvidence:false,
 });
 const bars=[];
 for(let i=0;i<dates.length;i++){
   const close=100+i,source=receipts.find(x=>x.market==='TWSE'&&x.marketDate===dates[i]);
   bars.push({symbol:'2330',market:'TWSE',date:dates[i],marketDate:dates[i],priceSpace:'RAW',
    open:close-.2,high:close+.5,low:close-.5,close,volumeShares:1000000+i*10000,
    tradeValue:(1000000+i*10000)*close,transactions:1000,companyName:'台積電',
    sourceRowHash:i===60?H:'b'.repeat(64),firstKnownAt:'2026-10-13T13:00:00Z',
    availableAt:'2026-10-13T13:00:00Z',sourceOriginalResponseSha256:source.originalRawResponseSha256,
    sourceId:'OFFICIAL_TWSE'});
 }
 const originalResponseSha256=await sha256Hex(bars.map(x=>x.sourceOriginalResponseSha256));
 const calendar={state:'SOURCE_OBSERVED_UNAUDITED',marketDate,tradingDates:dates,
   originalCalendarHash:await sha256Hex({dates}),observedAt:'2026-10-13T12:55:00Z',
   providerSource:'TWSE_OFFICIAL',verifiedOfficialReadback:false};
 const sourceBase={schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',marketDate,calendar,
   state:'SOURCE_OBSERVED_UNAUDITED',requestCount:122,plannedMarketDateRequests:122,
   receivedMarketDateCount:122,sourceWindowFirstDate:dates[0],sourceWindowLastDate:marketDate,
   sourceRowSymbolWindowsCompleteCount:1,markets:['TWSE','TPEX'],receipts,errors:[],
   bySymbol:{'TWSE|2330':{symbol:'2330',market:'TWSE',marketDate,providerMarketDate:marketDate,
     priceSpace:'RAW',volumeUnit:'SHARES',originalProviderResponseVerified:true,
     originalResponseSha256,observedAt:'2026-10-13T13:00:00Z',
     independentCurrentDailyCrossSourceEquivalenceVerified:false,bars}},
   sourceQuotaD1Reads:0,sourceQuotaD1Writes:0,assessorExecuted:false,
   qualifiedCandidates:null,selectedCount:null,frozenDecisionsDurablyReadBack:false,
   independentProviderAudited:false,noSystem1RuntimeMutations:true};
 const sourceReceipt={...sourceBase,receiptHash:await sha256Hex(sourceBase)};
 const manifest=buildSharedOfficialA1MarketManifestV0_1({sourceReceipt,
   issuedAtUtc:'2026-10-13T13:10:00Z',runId:'TEST',commitSha:H});
 const ledgerBase={schemaVersion:'S2_SOURCE_FIRST_PROSPECTIVE_LEDGER_V0_1',
   classification:'REAL_SOURCE_OBSERVATION_NOT_STRATEGY_SELECTION',marketDate,
   observedAt:'2026-10-13T13:05:00Z',freezeAtUtc:'2026-10-13T13:06:00Z',sourceState:'READY',
   sourceBlockers:[],sourceBatchHash:H,sourceTransports:{},sourceOrdinarySymbolCount:1,
   noUsablePriceSymbolCount:0,observations:[{symbol:'2330',companyName:'台積電',market:'TWSE',
     marketDate,open:bars.at(-1).open,high:bars.at(-1).high,low:bars.at(-1).low,
     close:bars.at(-1).close,volumeShares:bars.at(-1).volumeShares,
     tradeValue:bars.at(-1).tradeValue,priceState:'USABLE',sourceRowHash:H,
     observedAt:'2026-10-13T13:05:00Z',availableAt:'2026-10-13T13:05:00Z',sourceId:'OFFICIAL_TWSE'}],
   strategyId:'SHORT_MOMENTUM',strategyVersion:'V0.1-CONTRACT',
   assessorPolicyId:'S2-ASSESSOR-SM-LAUNCH-001',assessorPolicyVersion:'0.1-LAUNCH',
   selectionState:'NOT_EXECUTED_REQUIRED_PIT_HISTORY_AND_CONTINUITY_MISSING',
   qualifiedCandidateCount:null,selectedCount:null,zeroPickDay:null,strategyDecisionSnapshots:[],
   run:{repository:null,runId:null,attempt:null,codeSha:null},
   storageClass:'GITHUB_ACTIONS_TEMPORARY_ARTIFACT_NOT_DURABLE_FROZEN_DECISION',
   originalProviderBytesRetainedByThisCode:false,realQualifiedStockSelectionPerformed:false,
   immutableDecisionReadbackVerified:false,sourceD1Reads:0,sourceD1Writes:0,
   system1FormalCoreTouched:false,livePush:false,orders:false};
 const sourceLedger={...ledgerBase,ledgerSha256:await sha256Hex(ledgerBase)};
 const auditBase={schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
   verdict:'ACCEPTED_SOURCE_INTEGRITY_ONLY',marketDate,manifestSha256:manifest.manifestSha256,
   sourceReceiptHash:sourceReceipt.receiptHash,auditedAtUtc:'2026-10-13T13:20:00Z',
   sourceMarketDatePairsVerified:122,originalFilesRehashedAfterDownload:122,
   originalFilesDecompressedAndParsed:122,officialCalendarTradingDatesVerified:61,
   sourceUrlAndProviderDateVerified:true,independentOfficialCalendarReadbackVerified:true,
   auditorSeparation:'INDEPENDENT_READBACK_PROCESS',strategyPitCertified:false,
   selectionAuthorized:false};
 const auditReceipt={...auditBase,auditHash:await sha256Hex(auditBase)};
 const continuityBySymbol={'2330':{symbol:'2330',marketDate,state:'CLEAR_NO_ACTION',
   originalCorporateActionEvidenceVerified:true,evidenceSha256:H,startSession:dates[0],
   endSession:marketDate,availableAt:'2026-10-13T13:15:00Z'}};
 return {manifest,sourceReceipt,auditReceipt,sourceLedger,continuityBySymbol,evaluationAtUtc};
}

test('independent 122/122 audit admits source into existing Stage1 research evaluator only',async()=>{
 const out=await admit(await fixture());
 assert.equal(out.evaluationState,'EVALUATED_OFFLINE_RESEARCH_ONLY',JSON.stringify(out));
 assert.equal(out.admittedSymbolHistoryCount,1);
 assert.equal(out.evaluation.qualifiedNotSelectedCount,1);
 assert.equal(out.evaluation.observations[0].state,'QUALIFIED_NOT_SELECTED');
 assert.equal(out.selectedCount,null);assert.equal(out.zeroPickDay,null);
 assert.equal(out.selectionAuthorized,false);assert.equal(out.durableFrozenDecisionWritten,false);
 assert.equal(out.cloudflareD1Reads,0);assert.equal(out.cloudflareD1Writes,0);
 assert.equal(out.system1FormalCoreTouched,false);
});
test('121/122 source capture cannot enter the evaluator',async()=>{
 const p=await fixture();p.sourceReceipt.receipts.pop();
 await assert.rejects(()=>admit(p),/SOURCE_RECEIPT_HASH_MISMATCH|SOURCE_PAIR_DENOMINATOR/);
});
test('tampered source receipt root is rejected',async()=>{
 const p=await fixture();p.sourceReceipt.bySymbol['TWSE|2330'].bars[0].close=999;
 await assert.rejects(()=>admit(p),/SOURCE_RECEIPT_HASH_MISMATCH/);
});
test('audit cannot self-promote strategy PIT or selection authority',async()=>{
 const p=await fixture();p.auditReceipt.strategyPitCertified=true;
 const {auditHash,...base}=p.auditReceipt;p.auditReceipt={...base,auditHash:await sha256Hex(base)};
 await assert.rejects(()=>admit(p),/INDEPENDENT_AUDIT_NOT_ACCEPTED/);
});
test('manifest/source lineage mismatch is rejected before evaluation',async()=>{
 const p=await fixture();p.manifest={...p.manifest,originalOfficialProvenanceHash:'f'.repeat(64)};
 await assert.rejects(()=>admit(p),/MANIFEST_HASH_MISMATCH/);
});
test('unknown corporate-action continuity remains incomplete, never selected',async()=>{
 const p=await fixture();p.continuityBySymbol['2330'].state='UNVERIFIED';
 const out=await admit(p);
 assert.equal(out.evaluationState,'INCOMPLETE_SOURCE_OR_STRATEGY_EVIDENCE');
 assert.equal(out.evaluation.observations[0].reasonCodes[0],'PIT_CORPORATE_ACTION_CONTINUITY_UNVERIFIED');
 assert.equal(out.selectedCount,null);assert.equal(out.zeroPickDay,null);
});
test('duplicate cross-market symbol history fails closed',async()=>{
 const p=await fixture();const h=p.sourceReceipt.bySymbol['TWSE|2330'];
 p.sourceReceipt.bySymbol['TPEX|2330']={...h,market:'TPEX',bars:h.bars.map(x=>({...x,market:'TPEX'}))};
 p.sourceReceipt.sourceRowSymbolWindowsCompleteCount=2;
 const {receiptHash,...base}=p.sourceReceipt;p.sourceReceipt={...base,receiptHash:await sha256Hex(base)};
 await assert.rejects(()=>admit(p),/HISTORY_IDENTITY_INVALID/);
});
test('future-dated independent audit is rejected',async()=>{
 const p=await fixture();p.auditReceipt.auditedAtUtc='2026-10-13T15:00:00Z';
 const {auditHash,...base}=p.auditReceipt;p.auditReceipt={...base,auditHash:await sha256Hex(base)};
 await assert.rejects(()=>admit(p),/AUDIT_CLOCK_INVALID/);
});
