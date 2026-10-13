// System2 research-only bridge from the shared official A1 capture to the
// pre-existing SHORT_MOMENTUM Stage1 evaluator. It verifies evidence; it does
// not create an audit attestation, select stocks, freeze decisions or write D1.
import {assertSharedOfficialA1ConsumerBoundaryV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {sha256Hex} from './decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from './source_first_official_61_session_collector_v0_1.mjs';
import {evaluateSourceFirstShortMomentumV0_1}
 from './source_first_short_momentum_evaluator_v0_1.mjs';

const SHA=/^[a-f0-9]{64}$/i;
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const iso=x=>typeof x==='string'&&
 /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(x)&&Number.isFinite(Date.parse(x));
const strip=(value,key)=>Object.fromEntries(Object.entries(value||{}).filter(([k])=>k!==key));
function assertClock(value,evaluationAtUtc,code){
 if(!iso(value)||Date.parse(value)>Date.parse(evaluationAtUtc))throw Error(code);
}
function assertDates(dates,marketDate){
 if(!Array.isArray(dates)||dates.length!==61||new Set(dates).size!==61||
    dates.some((d,i)=>!DAY.test(d)||(i>0&&d<=dates[i-1]))||dates.at(-1)!==marketDate)
   throw Error('SHARED_A1_ADMISSION_CALENDAR_INVALID');
}
async function assertReceipt(sourceReceipt,evaluationAtUtc){
 if(sourceReceipt?.schemaVersion!=='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'||
    sourceReceipt.state!=='SOURCE_OBSERVED_UNAUDITED'||!DAY.test(sourceReceipt.marketDate||'')||
    !SHA.test(sourceReceipt.receiptHash||'')||sourceReceipt.plannedMarketDateRequests!==122||
    sourceReceipt.receivedMarketDateCount!==122||sourceReceipt.requestCount!==122||
    sourceReceipt.sourceQuotaD1Reads!==0||sourceReceipt.sourceQuotaD1Writes!==0||
    sourceReceipt.assessorExecuted!==false||sourceReceipt.selectedCount!==null||
    sourceReceipt.frozenDecisionsDurablyReadBack!==false||
    !Array.isArray(sourceReceipt.errors)||sourceReceipt.errors.length!==0)
   throw Error('SHARED_A1_ADMISSION_SOURCE_RECEIPT_NOT_COMPLETE');
 if(await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(sourceReceipt))!==
    sourceReceipt.receiptHash)
   throw Error('SHARED_A1_ADMISSION_SOURCE_RECEIPT_HASH_MISMATCH');
 const dates=sourceReceipt.calendar?.tradingDates;
 assertDates(dates,sourceReceipt.marketDate);
 if(sourceReceipt.calendar?.state!=='SOURCE_OBSERVED_UNAUDITED'||
    sourceReceipt.calendar.marketDate!==sourceReceipt.marketDate||
    sourceReceipt.calendar.verifiedOfficialReadback!==false||
    !SHA.test(sourceReceipt.calendar.originalCalendarHash||''))
   throw Error('SHARED_A1_ADMISSION_SOURCE_CALENDAR_NOT_UNAUDITED');
 assertClock(sourceReceipt.calendar.observedAt,evaluationAtUtc,
   'SHARED_A1_ADMISSION_SOURCE_CALENDAR_CLOCK_INVALID');
 const receiptByKey=new Map();
 if(!Array.isArray(sourceReceipt.receipts)||sourceReceipt.receipts.length!==122)
   throw Error('SHARED_A1_ADMISSION_SOURCE_PAIR_DENOMINATOR_INVALID');
 for(const row of sourceReceipt.receipts){
   const key=row?.market+'|'+row?.marketDate;
   if(!['TWSE','TPEX'].includes(row?.market)||!dates.includes(row?.marketDate)||
      receiptByKey.has(key)||!SHA.test(row?.originalRawResponseSha256||'')||
      row.rawProviderBytesPreserved!==true||row.providerReportedDate!==row.marketDate)
     throw Error('SHARED_A1_ADMISSION_SOURCE_PAIR_INVALID');
   assertClock(row.capturedAt,evaluationAtUtc,'SHARED_A1_ADMISSION_SOURCE_PAIR_CLOCK_INVALID');
   receiptByKey.set(key,row);
 }
 for(const date of dates)for(const market of ['TWSE','TPEX'])
   if(!receiptByKey.has(market+'|'+date))throw Error('SHARED_A1_ADMISSION_SOURCE_PAIR_MISSING');
 const histories=sourceReceipt.bySymbol;
 if(!histories||typeof histories!=='object'||Array.isArray(histories)||
    Object.keys(histories).length!==sourceReceipt.sourceRowSymbolWindowsCompleteCount)
   throw Error('SHARED_A1_ADMISSION_HISTORY_DENOMINATOR_INVALID');
 const historyBySymbol={};
 for(const [key,h] of Object.entries(histories)){
   if(key!==h?.market+'|'+h?.symbol||!['TWSE','TPEX'].includes(h.market)||
      !/^[1-9]\d{3}$/.test(h.symbol||'')||historyBySymbol[h.symbol]||
      h.marketDate!==sourceReceipt.marketDate||h.providerMarketDate!==sourceReceipt.marketDate||
      h.priceSpace!=='RAW'||h.volumeUnit!=='SHARES'||h.originalProviderResponseVerified!==true||
      !SHA.test(h.originalResponseSha256||'')||!Array.isArray(h.bars)||h.bars.length!==61)
     throw Error('SHARED_A1_ADMISSION_HISTORY_IDENTITY_INVALID');
   assertClock(h.observedAt,evaluationAtUtc,'SHARED_A1_ADMISSION_HISTORY_CLOCK_INVALID');
   const originalHashes=[];
   for(let i=0;i<h.bars.length;i++){
     const bar=h.bars[i],source=receiptByKey.get(h.market+'|'+dates[i]);
     if(bar?.date!==dates[i]||bar.marketDate!==dates[i]||bar.symbol!==h.symbol||
        bar.market!==h.market||bar.priceSpace!=='RAW'||
        bar.sourceOriginalResponseSha256!==source.originalRawResponseSha256||
        !SHA.test(bar.sourceRowHash||''))
       throw Error('SHARED_A1_ADMISSION_HISTORY_LINEAGE_INVALID');
     assertClock(bar.availableAt,evaluationAtUtc,'SHARED_A1_ADMISSION_HISTORY_AVAILABILITY_INVALID');
     originalHashes.push(bar.sourceOriginalResponseSha256);
   }
   if(await sha256Hex(originalHashes)!==h.originalResponseSha256)
     throw Error('SHARED_A1_ADMISSION_HISTORY_ROOT_MISMATCH');
   historyBySymbol[h.symbol]=h;
 }
 return {dates,historyBySymbol,receiptByKey};
}
async function assertAudit({auditReceipt,manifest,sourceReceipt,evaluationAtUtc}){
 if(auditReceipt?.schemaVersion!=='SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1'||
    auditReceipt.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'||
    auditReceipt.marketDate!==sourceReceipt.marketDate||
    auditReceipt.manifestSha256!==manifest.manifestSha256||
    auditReceipt.sourceReceiptHash!==sourceReceipt.receiptHash||
    auditReceipt.sourceMarketDatePairsVerified!==122||
    auditReceipt.originalFilesRehashedAfterDownload!==122||
    auditReceipt.originalFilesDecompressedAndParsed!==122||
    auditReceipt.officialCalendarTradingDatesVerified!==61||
    auditReceipt.sourceUrlAndProviderDateVerified!==true||
    auditReceipt.independentOfficialCalendarReadbackVerified!==true||
    auditReceipt.auditorSeparation!=='INDEPENDENT_READBACK_PROCESS'||
    auditReceipt.strategyPitCertified!==false||auditReceipt.selectionAuthorized!==false||
    !SHA.test(auditReceipt.auditHash||''))
   throw Error('SHARED_A1_ADMISSION_INDEPENDENT_AUDIT_NOT_ACCEPTED');
 assertClock(auditReceipt.auditedAtUtc,evaluationAtUtc,
   'SHARED_A1_ADMISSION_AUDIT_CLOCK_INVALID');
 if(await sha256Hex(strip(auditReceipt,'auditHash'))!==auditReceipt.auditHash)
   throw Error('SHARED_A1_ADMISSION_AUDIT_HASH_MISMATCH');
}
function assertManifestPairs(manifest,sourceReceipt){
 if(manifest.sourceCoverage!=='COMPLETE_SOURCE_CAPTURE_PIT_UNAUDITED'||
    manifest.sourceMarketDatePairsValidated!==122||manifest.sourceMarketDatePairsExpected!==122||
    manifest.originalOfficialProvenanceHash!==sourceReceipt.receiptHash||
    manifest.independentlyApprovedStrategyPIT!==false||
    manifest.sourceRowsEligibleAsSystem2FrozenSelection!==false||
    !Array.isArray(manifest.sourceBlobs)||manifest.sourceBlobs.length!==122)
   throw Error('SHARED_A1_ADMISSION_MANIFEST_NOT_COMPLETE');
 const actual=new Map(sourceReceipt.receipts.map(x=>[x.market+'|'+x.marketDate,x]));
 for(const blob of manifest.sourceBlobs){
   const row=actual.get(blob?.market+'|'+blob?.marketDate);
   if(!row||blob.originalSha256!==row.originalRawResponseSha256||
      blob.firstCapturedAtUtc!==row.capturedAt||blob.pointInTimeReplayPromoted!==false)
     throw Error('SHARED_A1_ADMISSION_MANIFEST_SOURCE_LINEAGE_MISMATCH');
 }
}

export async function admitSharedOfficialA1ToShortMomentumStage1V0_1({
 manifest,sourceReceipt,auditReceipt,sourceLedger,continuityBySymbol={},evaluationAtUtc,
}={}){
 if(!iso(evaluationAtUtc))throw Error('SHARED_A1_ADMISSION_EVALUATION_CLOCK_INVALID');
 const boundary=assertSharedOfficialA1ConsumerBoundaryV0_1(manifest,{
   system:'SYSTEM2',purpose:'READ_ONLY_SOURCE_RESEARCH'
 });
 if(boundary.sourceMarketDatePairsValidated!==122||
    boundary.sourceCompleteness!=='COMPLETE_SOURCE_CAPTURE_PIT_UNAUDITED')
   throw Error('SHARED_A1_ADMISSION_CONSUMER_BOUNDARY_INCOMPLETE');
 const verified=await assertReceipt(sourceReceipt,evaluationAtUtc);
 assertManifestPairs(manifest,sourceReceipt);
 await assertAudit({auditReceipt,manifest,sourceReceipt,evaluationAtUtc});
 if(sourceLedger?.marketDate!==sourceReceipt.marketDate||
    !SHA.test(sourceLedger?.ledgerSha256||'')||
    await sha256Hex(strip(sourceLedger,'ledgerSha256'))!==sourceLedger.ledgerSha256)
   throw Error('SHARED_A1_ADMISSION_CURRENT_LEDGER_HASH_OR_DATE_INVALID');
 const calendarReceipt={
   state:'READY',verifiedOfficialReadback:true,marketDate:sourceReceipt.marketDate,
   observedAt:auditReceipt.auditedAtUtc,
   originalCalendarHash:sourceReceipt.calendar.originalCalendarHash,
   tradingDates:[...verified.dates],
 };
 const evaluation=await evaluateSourceFirstShortMomentumV0_1({
   sourceLedger,historyBySymbol:verified.historyBySymbol,continuityBySymbol,
   calendarReceipt,evaluationAtUtc,independentOriginalVerification:true,
 });
 const base={
   schemaVersion:'S2_SHARED_OFFICIAL_A1_STAGE1_ADMISSION_V0_1',
   classification:'OFFLINE_RESEARCH_INPUT_ADMISSION_ONLY',
   marketDate:sourceReceipt.marketDate,evaluationAtUtc,
   manifestSha256:manifest.manifestSha256,sourceReceiptHash:sourceReceipt.receiptHash,
   independentAuditHash:auditReceipt.auditHash,currentSourceLedgerHash:sourceLedger.ledgerSha256,
   admittedSymbolHistoryCount:Object.keys(verified.historyBySymbol).length,
   evaluationHash:evaluation.evaluationHash,evaluationState:evaluation.state,
   selectedCount:null,zeroPickDay:null,selectionAuthorized:false,
   durableFrozenDecisionWritten:false,durableFrozenDecisionReadbackVerified:false,
   cloudflareD1Reads:0,cloudflareD1Writes:0,system1FormalCoreTouched:false,
   livePush:false,orders:false,
 };
 return Object.freeze({...base,admissionHash:await sha256Hex(base),evaluation});
}
