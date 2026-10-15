import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {buildSharedOfficialA1MarketManifestV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {admitSharedOfficialA1ToShortMomentumStage1V0_1 as admit}
 from '../runtime/shared_official_a1_stage1_admission_v0_1.mjs';
import {buildCorporateActionCompletenessReceiptV0_2}
 from '../runtime/corporate_action_continuity_archive_v0_1.mjs';

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
 const sourceReceipt={...sourceBase,receiptHash:await sha256Hex(sourceBase),
   originalCount:122,originals:receipts.map(x=>({market:x.market,date:x.marketDate,
     sourceSha256:x.originalRawResponseSha256,originalBytes:x.originalRawResponseBytes,
     gzipBytes:500,observedAt:x.capturedAt})),
   sharedOriginalSourceReuse:{trustedReusedMarketDatePairs:0},
   retrospectiveDiagnosticOnly:false,retrospectiveSelectionClaimDisabled:true,
   genuineProspectiveDecisionCapture:false};
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
 // This is synthetic proof for regression ONLY; no real corporate-action
 // source was consulted and this cannot prove physical historical PIT.
 const requiredSourceContracts=['TWSE','TPEX'].flatMap(exchange=>
  ['EX_RIGHT_DIVIDEND','CAPITAL_REDUCTION','PAR_VALUE_CHANGE'].map(actionFamilyId=>({
   exchange,actionFamilyId,sourceClass:'HISTORICAL_ACTUAL_RESULT_RANGE'
  })));
 const sourceCoverage=requiredSourceContracts.map((r,i)=>({
  ...r,sourceId:'SYNTH_CA_'+i,coverageState:'COMPLETE',
  requestedStartDate:dates[0],requestedEndDate:marketDate,
  responseRangeVerified:true,parserComplete:true,revisionCoverageComplete:true,
  observedRowCount:1,emptyRangeSemanticsCertified:false,missingSourceDates:[]
 }));
 const suspensionEvidenceByExchange=Object.fromEntries(
  ['TWSE','TPEX'].map(exchange=>[exchange,{
   coverageState:'COMPLETE',requestedStartDate:dates[0],requestedEndDate:marketDate,
   sourceId:'SYNTH_SUSP_'+exchange,sourceFamily:'SUSPENSION',
   sourceContractVersion:'SYNTH_ONLY',receiptDigest:H,
   observedAt:'2026-10-13T13:17:00Z',availableAt:'2026-10-13T13:17:00Z',
   availabilitySemantics:'PROSPECTIVE_OBSERVED'
  }]));
 const companyActionCompletenessReceipt=await buildCorporateActionCompletenessReceiptV0_2({
  startDate:dates[0],endDate:marketDate,universeVersion:'SYNTH_PIT_ONLY',
  universeCoverageComplete:true,requiredSourceContracts,sourceCoverage,
  eventVersions:[],suspensionCoverageByExchange:{TWSE:'COMPLETE',TPEX:'COMPLETE'},
  suspensionEvidenceByExchange,generatedAt:'2026-10-13T13:18:00Z'
 });
 assert.equal(companyActionCompletenessReceipt.noEventMayBeClaimed,true);
 const caAuditBase={
  schemaVersion:'S2_CA_PIT_INDEPENDENT_AUDIT_V0_1',
  verdict:'ACCEPTED_SOURCE_COMPLETENESS_ONLY',
  auditorSeparation:'INDEPENDENT_READBACK_PROCESS',
  originalSourceEvidenceRehashed:true,marketDate,
  caReceiptHash:companyActionCompletenessReceipt.receiptHash,
  sourceLedgerHash:sourceLedger.ledgerSha256,auditedAtUtc:'2026-10-13T13:20:00Z'
 };
 const companyActionIndependentAuditReceipt={
  ...caAuditBase,auditHash:await sha256Hex(caAuditBase)
 };
 const continuityBySymbol={'2330':{symbol:'2330',market:'TWSE',marketDate,
   state:'CLEAR_NO_ACTION',originalCorporateActionEvidenceVerified:true,
   evidenceSha256:companyActionCompletenessReceipt.receiptHash,
   independentAuditHash:companyActionIndependentAuditReceipt.auditHash,
   startSession:dates[0],endSession:marketDate,availableAt:'2026-10-13T13:21:00Z'}};
 // Synthetic official CFI/ISIN + separate source readback — never physical proof.
 const classBase={schemaVersion:'S2_OFFICIAL_INSTRUMENT_CLASS_PIT_SOURCE_V0_1',
  sourceClass:'ORIGINAL_NATIVE_ISIN_CFI_SECURITY_CLASS',
  evidenceScope:'ONLY_POSITIVELY_ATTESTED_SYMBOLS',marketDate,
  sourceLedgerHash:sourceLedger.ledgerSha256,originalProviderReceiptHash:H,
  firstCapturedAtUtc:'2026-10-13T13:10:00Z',
  securities:[{symbol:'2330',market:'TWSE',classification:'ORDINARY_COMMON_SHARE',
   positiveCommonShareAttested:true,cfi:'ESVUFR',nativeSourceRowSha256:H,
   effectiveFromDate:dates[0],effectiveThroughDate:null,
   availableAtUtc:'2026-10-13T13:11:00Z'}]};
 const instrumentSourceReceipt={...classBase,receiptHash:await sha256Hex(classBase)};
 const classAuditBase={
  schemaVersion:'S2_OFFICIAL_INSTRUMENT_CLASS_INDEPENDENT_AUDIT_V0_1',
  verdict:'ACCEPTED_POSITIVE_ORDINARY_EQUITY_ROWS_ONLY',
  auditorSeparation:'INDEPENDENT_ORIGINAL_SOURCE_READBACK',
  originalProviderBytesRehashed:true,cfiNativeClassificationVerified:true,
  historicalNativeEffectivePeriodsIndependentlyVerified:true,
  nativeEffectivePeriodRows:[{
   symbol:'2330',market:'TWSE',cfi:'ESVUFR',originalNativeRowSha256:H,
   originalEffectiveFromDate:dates[0],originalEffectiveThroughDate:null,
   explicitOriginalNativeDateRangeVerified:true,
   originalProviderHistoricalVersionReadbackVerified:true,
   originalObservedAtUtc:'2026-10-13T13:12:00Z',
  }],
  sourceReceiptHash:instrumentSourceReceipt.receiptHash,
  sourceLedgerHash:sourceLedger.ledgerSha256,marketDate,
  auditedAtUtc:'2026-10-13T13:18:00Z'
 };
 const instrumentIndependentAuditReceipt={
  ...classAuditBase,auditHash:await sha256Hex(classAuditBase)};
 return {manifest,sourceReceipt,auditReceipt,sourceLedger,continuityBySymbol,
  companyActionCompletenessReceipt,companyActionIndependentAuditReceipt,
  instrumentSourceReceipt,instrumentIndependentAuditReceipt,evaluationAtUtc};
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
test('collector hash stays valid after create-only persistence metadata is appended',async()=>{
 const p=await fixture();p.sourceReceipt.originalCount=999;
 const out=await admit(p);
 assert.equal(out.evaluationState,'EVALUATED_OFFLINE_RESEARCH_ONLY');
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

test('re-signed present-day CFI without provider-native historical effective period is refused',async()=>{
 const p=await fixture();
 p.instrumentIndependentAuditReceipt.historicalNativeEffectivePeriodsIndependentlyVerified=false;
 const {auditHash,...base}=p.instrumentIndependentAuditReceipt;
 p.instrumentIndependentAuditReceipt.auditHash=await sha256Hex(base);
 await assert.rejects(()=>admit(p),/STAGE1_INSTRUMENT_PIT_INDEPENDENT_AUDIT_UNVERIFIED/);
});
test('historical native period beginning AFTER 61-session window cannot certify lookback',async()=>{
 const p=await fixture();
 // Both upstream and independently re-signed audit agree on a class
 // period that did NOT exist for the first part of the 61 daily bars.
 p.instrumentSourceReceipt.securities[0].effectiveFromDate=dates[30];
 let {receiptHash,...base}=p.instrumentSourceReceipt;
 p.instrumentSourceReceipt.receiptHash=await sha256Hex(base);
 p.instrumentIndependentAuditReceipt.nativeEffectivePeriodRows[0].originalEffectiveFromDate=dates[30];
 p.instrumentIndependentAuditReceipt.sourceReceiptHash=p.instrumentSourceReceipt.receiptHash;
 let {auditHash,...auditBase}=p.instrumentIndependentAuditReceipt;
 p.instrumentIndependentAuditReceipt.auditHash=await sha256Hex(auditBase);
 const out=await admit(p);
 assert.equal(out.evaluation.qualifiedNotSelectedCount,0);
 assert.equal(out.evaluation.observations[0].reasonCodes[0],
  'PIT_ORDINARY_EQUITY_INSTRUMENT_CLASS_UNVERIFIED');
});
test('forged signed CFI symbol with mismatched independent original-row CFI cannot be admitted',async()=>{
 const p=await fixture();
 p.instrumentSourceReceipt.securities[0].cfi='ESZZZZ';
 let {receiptHash,...base}=p.instrumentSourceReceipt;
 p.instrumentSourceReceipt.receiptHash=await sha256Hex(base);
 p.instrumentIndependentAuditReceipt.sourceReceiptHash=p.instrumentSourceReceipt.receiptHash;
 let {auditHash,...auditBase}=p.instrumentIndependentAuditReceipt;
 p.instrumentIndependentAuditReceipt.auditHash=await sha256Hex(auditBase);
 const out=await admit(p);
 assert.equal(out.evaluation.qualifiedNotSelectedCount,0);
 assert.equal(out.evaluation.observations[0].reasonCodes[0],
  'PIT_ORDINARY_EQUITY_INSTRUMENT_CLASS_UNVERIFIED');
});
test('self-signed fake historical date with only matching CFI still denied by separate native period proof',async()=>{
 const p=await fixture();
 p.instrumentSourceReceipt.securities[0].effectiveFromDate='2026-09-20';
 let {receiptHash,...base}=p.instrumentSourceReceipt;
 p.instrumentSourceReceipt.receiptHash=await sha256Hex(base);
 p.instrumentIndependentAuditReceipt.sourceReceiptHash=p.instrumentSourceReceipt.receiptHash;
 let {auditHash,...auditBase}=p.instrumentIndependentAuditReceipt;
 p.instrumentIndependentAuditReceipt.auditHash=await sha256Hex(auditBase);
 const out=await admit(p);
 assert.equal(out.evaluation.qualifiedNotSelectedCount,0);
 assert.equal(out.evaluation.observations[0].reasonCodes[0],
  'PIT_ORDINARY_EQUITY_INSTRUMENT_CLASS_UNVERIFIED');
});
test('positive native historical period audit must be observed no later than auditor time',async()=>{
 const p=await fixture();
 p.instrumentIndependentAuditReceipt.nativeEffectivePeriodRows[0].originalObservedAtUtc='2026-10-13T13:19:00Z';
 let {auditHash,...base}=p.instrumentIndependentAuditReceipt;
 p.instrumentIndependentAuditReceipt.auditHash=await sha256Hex(base);
 await assert.rejects(()=>admit(p),
  /STAGE1_INSTRUMENT_PIT_INDEPENDENT_ORIGINAL_EFFECTIVE_PERIOD_ROW_INVALID/);
});

test('full synthetic CA receipts but absent independently verified instrument class remain UNKNOWN',async()=>{
 const p=await fixture();p.instrumentSourceReceipt=null;p.instrumentIndependentAuditReceipt=null;
 const r=await admit(p);
 assert.equal(r.evaluationState,'INCOMPLETE_SOURCE_OR_STRATEGY_EVIDENCE');
 assert.equal(r.evaluation.qualifiedNotSelectedCount,0);
 assert.deepEqual(r.evaluation.observations[0].reasonCodes,
  ['PIT_ORDINARY_EQUITY_INSTRUMENT_CLASS_UNVERIFIED']);
 assert.equal(r.selectedCount,null);
});
test('an attempted self-signed current DR identity does not enter ordinary class',async()=>{
 const p=await fixture();
 const b={...p.instrumentSourceReceipt,
  securities:[{...p.instrumentSourceReceipt.securities[0],
   classification:'DEPOSITARY_RECEIPT',cfi:'EDVUFR'}]};
 delete b.receiptHash;b.receiptHash=await sha256Hex(b);
 p.instrumentSourceReceipt=b;
 const a={...p.instrumentIndependentAuditReceipt,sourceReceiptHash:b.receiptHash};
 delete a.auditHash;a.auditHash=await sha256Hex(a);
 p.instrumentIndependentAuditReceipt=a;
 const o=await admit(p);
 assert.equal(o.evaluation.qualifiedNotSelectedCount,0);
 assert.equal(o.evaluation.observations[0].reasonCodes[0],
  'PIT_ORDINARY_EQUITY_INSTRUMENT_CLASS_UNVERIFIED');
});
test('official names explicitly -DR quarantine even re-signed matching positive native class',async()=>{
 const p=await fixture();
 const o=p.sourceLedger.observations[0];o.companyName='美德醫療-DR';
 const {ledgerSha256,...base}=p.sourceLedger;
 p.sourceLedger.ledgerSha256=await sha256Hex(base);
 p.companyActionIndependentAuditReceipt.sourceLedgerHash=p.sourceLedger.ledgerSha256;
 const {auditHash:oldCaAuditHash,...caAuditBase}=p.companyActionIndependentAuditReceipt;
 p.companyActionIndependentAuditReceipt.auditHash=await sha256Hex(caAuditBase);
 p.continuityBySymbol['2330'].independentAuditHash=
  p.companyActionIndependentAuditReceipt.auditHash;
 p.instrumentSourceReceipt.sourceLedgerHash=p.sourceLedger.ledgerSha256;
 const {receiptHash,...b}=p.instrumentSourceReceipt;
 p.instrumentSourceReceipt.receiptHash=await sha256Hex(b);
 p.instrumentIndependentAuditReceipt.sourceLedgerHash=p.sourceLedger.ledgerSha256;
 p.instrumentIndependentAuditReceipt.sourceReceiptHash=p.instrumentSourceReceipt.receiptHash;
 const {auditHash,...a}=p.instrumentIndependentAuditReceipt;
 p.instrumentIndependentAuditReceipt.auditHash=await sha256Hex(a);
 // Existing manifest lineage is unchanged; only current source ledger changed.
 const out=await admit(p);
 assert.equal(out.evaluation.qualifiedNotSelectedCount,0);
 assert.equal(out.evaluation.observations[0].reasonCodes[0],
  'PIT_ORDINARY_EQUITY_INSTRUMENT_CLASS_UNVERIFIED');
});
test('class receipt sibling without audit cannot override missing PIT',async()=>{
 const p=await fixture();p.instrumentIndependentAuditReceipt=null;
 await assert.rejects(()=>admit(p),/STAGE1_INSTRUMENT_PIT_PARTIAL_EVIDENCE_NOT_ACCEPTED/);
});
test('re-signed instrument class with future availableAt cannot backdate an ordinary share',async()=>{
 const p=await fixture();
 p.instrumentSourceReceipt.securities[0].availableAtUtc='2026-10-14T02:00:00Z';
 const {receiptHash,...b}=p.instrumentSourceReceipt;
 p.instrumentSourceReceipt.receiptHash=await sha256Hex(b);
 const a={...p.instrumentIndependentAuditReceipt,
  sourceReceiptHash:p.instrumentSourceReceipt.receiptHash};
 delete a.auditHash;a.auditHash=await sha256Hex(a);
 p.instrumentIndependentAuditReceipt=a;
 const r=await admit(p);
 assert.equal(r.evaluation.qualifiedNotSelectedCount,0);
 assert.equal(r.evaluation.observations[0].reasonCodes[0],
  'PIT_ORDINARY_EQUITY_INSTRUMENT_CLASS_UNVERIFIED');
});
test('instrument class audit after freeze clock is not a PIT-eligible proof',async()=>{
 const p=await fixture();
 const a={...p.instrumentIndependentAuditReceipt,auditedAtUtc:'2026-10-14T13:00:00Z'};
 delete a.auditHash;a.auditHash=await sha256Hex(a);
 p.instrumentIndependentAuditReceipt=a;
 await assert.rejects(()=>admit(p),/STAGE1_INSTRUMENT_PIT_INDEPENDENT_AUDIT_UNVERIFIED/);
});

test('unknown corporate-action continuity remains incomplete, never selected',async()=>{
 const p=await fixture();p.continuityBySymbol['2330'].state='UNVERIFIED';
 const out=await admit(p);
 assert.equal(out.evaluationState,'INCOMPLETE_SOURCE_OR_STRATEGY_EVIDENCE');
 assert.equal(out.evaluation.observations[0].reasonCodes[0],'PIT_CORPORATE_ACTION_CONTINUITY_UNVERIFIED');
 assert.equal(out.selectedCount,null);assert.equal(out.zeroPickDay,null);
});

test('fabricated bare continuity true + arbitrary SHA never clears PIT without both attestations',async()=>{
 const p=await fixture();
 p.companyActionCompletenessReceipt=null;
 p.companyActionIndependentAuditReceipt=null;
 const out=await admit(p);
 assert.equal(out.evaluationState,'INCOMPLETE_SOURCE_OR_STRATEGY_EVIDENCE');
 assert.equal(out.evaluation.qualifiedNotSelectedCount,0);
 assert.equal(out.evaluation.observations[0].reasonCodes[0],
   'PIT_CORPORATE_ACTION_CONTINUITY_UNVERIFIED');
 assert.equal(out.selectionAuthorized,false);
});
test('tampered independently bound CA proof cannot be used even with old true flag',async()=>{
 const p=await fixture();
 p.companyActionIndependentAuditReceipt.caReceiptHash='f'.repeat(64);
 await assert.rejects(()=>admit(p),/STAGE1_CA_PIT_INDEPENDENT_CA_AUDIT_UNVERIFIED/);
});
test('CA audit created AFTER strategy evaluation cannot backdate no-event proof',async()=>{
 const p=await fixture();
 const a={...p.companyActionIndependentAuditReceipt,
   auditedAtUtc:'2026-10-14T00:00:00Z'};
 delete a.auditHash;
 p.companyActionIndependentAuditReceipt={...a,auditHash:await sha256Hex(a)};
 await assert.rejects(()=>admit(p),/STAGE1_CA_PIT_INDEPENDENT_CA_AUDIT_UNVERIFIED/);
});
test('a re-signed CA receipt missing one mandatory action-family lane fails closed',async()=>{
 const p=await fixture(),c={...p.companyActionCompletenessReceipt};
 c.requiredSourceContracts=c.requiredSourceContracts.slice(1);
 delete c.receiptHash;c.receiptHash=await sha256Hex(c);
 p.companyActionCompletenessReceipt=c;
 const a={...p.companyActionIndependentAuditReceipt,caReceiptHash:c.receiptHash};
 delete a.auditHash;a.auditHash=await sha256Hex(a);
 p.companyActionIndependentAuditReceipt=a;
 await assert.rejects(()=>admit(p),/STAGE1_CA_PIT_SIX_FAMILY_REVISION_SOURCE_COVERAGE_UNVERIFIED/);
});
test('a known active event cannot be silently labelled CLEAR_NO_ACTION',async()=>{
 const p=await fixture(),c={...p.companyActionCompletenessReceipt};
 c.eventReconciliation={...c.eventReconciliation,
  groups:[{exchange:'TWSE',symbol:'2330',actionFamilyId:'EX_RIGHT_DIVIDEND',
   state:'READY_ACTIVE',currentEvent:{effectiveDate:'2026-09-15',
    eventVersionId:'SYNTH-ACTIVE-CA'}}]};
 delete c.receiptHash;c.receiptHash=await sha256Hex(c);
 p.companyActionCompletenessReceipt=c;
 const a={...p.companyActionIndependentAuditReceipt,caReceiptHash:c.receiptHash};
 delete a.auditHash;a.auditHash=await sha256Hex(a);
 p.companyActionIndependentAuditReceipt=a;
 p.continuityBySymbol['2330'].evidenceSha256=c.receiptHash;
 p.continuityBySymbol['2330'].independentAuditHash=a.auditHash;
 const out=await admit(p);
 assert.equal(out.evaluation.qualifiedNotSelectedCount,0);
 assert.equal(out.evaluation.observations[0].reasonCodes[0],
   'PIT_CORPORATE_ACTION_CONTINUITY_UNVERIFIED');
});

test('duplicate cross-market symbol history fails closed',async()=>{
 const p=await fixture();const h=p.sourceReceipt.bySymbol['TWSE|2330'];
 p.sourceReceipt.bySymbol['TPEX|2330']={...h,market:'TPEX',bars:h.bars.map(x=>({...x,market:'TPEX'}))};
 p.sourceReceipt.sourceRowSymbolWindowsCompleteCount=2;
 const base=official61SessionSourceReceiptHashBaseV0_1(p.sourceReceipt);
 p.sourceReceipt={...p.sourceReceipt,receiptHash:await sha256Hex(base)};
 await assert.rejects(()=>admit(p),/HISTORY_IDENTITY_INVALID/);
});
test('future-dated independent audit is rejected',async()=>{
 const p=await fixture();p.auditReceipt.auditedAtUtc='2026-10-13T15:00:00Z';
 const {auditHash,...base}=p.auditReceipt;p.auditReceipt={...base,auditHash:await sha256Hex(base)};
 await assert.rejects(()=>admit(p),/AUDIT_CLOCK_INVALID/);
});
