// RESEARCH ONLY: derive PROVEN PRESENT corporate-action conflict evidence
// from original six official response bodies and an independently source-only
// audited 61-session A1 preliminary watch. Absence never proves NO_EVENT.
// This replay cannot retroactively make actions known at a prior decision T.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {summarizeOfficialContinuityNativeOriginalV0_1}
 from '../runtime/official_continuity_source_capability_v0_1.mjs';
const H=/^[a-f0-9]{64}$/i,CODE=/^[1-9]\d{3}$/;
const EXPECTED=[
 'TWSE_EX_RIGHT_DIVIDEND_ACTUAL','TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE','TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE','TPEX_PAR_VALUE_CHANGE_REFERENCE'
];
const hash=x=>createHash('sha256').update(x).digest('hex');
const unsigned=(o,key)=>Object.fromEntries(Object.entries(o||{}).filter(([k])=>k!==key));
const utc=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&
 /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d/.test(x);
const isDay=x=>/^\d{4}-\d\d-\d\d$/.test(x||'')&&
 Number.isFinite(Date.parse(x+'T00:00:00Z'))&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
function denial(reason){throw Error('M09_CA_NEGATIVE_REPLAY_'+reason)}
function nativeDate(x){
 let s=String(x??'').trim().replace(/[年月日]/g,'/').replace(/[.\-]/g,'/');
 const parts=s.split('/').filter(Boolean);
 try{
  if(parts.length===3){
   let y=Number(parts[0]);if(y<1912)y+=1911;
   const d=new Date(Date.UTC(y,Number(parts[1])-1,Number(parts[2])));
   const formatted=d.toISOString().slice(0,10);
   return isDay(formatted)&&
    formatted===String(y).padStart(4,'0')+'-'+String(+parts[1]).padStart(2,'0')+'-'+String(+parts[2]).padStart(2,'0')?formatted:null;
  }
  s=s.replace(/\D/g,'');
  if(s.length===7||s.length===8){
   let y=s.length===7?Number(s.slice(0,3))+1911:+s.slice(0,4);
   const offset=s.length===7?3:4;
   const date=String(y).padStart(4,'0')+'-'+s.slice(offset,offset+2)+'-'+s.slice(offset+2,offset+4);
   return isDay(date)?date:null;
  }
 }catch{}
 return null;
}
function rowsFromNative(original){
 let parsed;
 try{parsed=JSON.parse(original.toString('utf8').replace(/^\uFEFF/,''));}
 catch{denial('NOT_OFFICIAL_NATIVE_JSON')}
 const tables=Array.isArray(parsed?.tables)?parsed.tables:
   Array.isArray(parsed?.fields)&&Array.isArray(parsed?.data)?[parsed]:[];
 if(!tables.length)denial('NO_OFFICIAL_ACTION_TABLE');
 const t=tables.find(v=>Array.isArray(v?.fields)&&Array.isArray(v?.data)&&
   v.fields.some(f=>['股票代號','證券代號','代號'].includes(String(f||'').trim()))&&
   v.fields.some(f=>['資料日期','恢復買賣日期','除權息日期'].includes(String(f||'').trim())));
 if(!t)denial('OFFICIAL_ACTION_TABLE_SYMBOL_OR_EVENT_DATE_MISSING');
 const fields=t.fields.map(f=>String(f??'').trim());
 const codeIdx=fields.findIndex(x=>['股票代號','證券代號','代號'].includes(x));
 const dateIdx=fields.findIndex(x=>['資料日期','恢復買賣日期','除權息日期'].includes(x));
 return {rows:t.data,codeIdx,dateIdx};
}
export async function replayM09CaObservedNegativeOverlapV0_1({
 sourceReceipt,independentSourceAudit,preliminaryWatch,caReceipt,
 originalBySourceId={},
}={}){
 if(sourceReceipt?.schemaVersion!=='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'||
    sourceReceipt?.state!=='SOURCE_OBSERVED_UNAUDITED'||
    sourceReceipt?.receivedMarketDateCount!==122||
    !H.test(sourceReceipt?.receiptHash||'')||
    !Array.isArray(sourceReceipt?.calendar?.tradingDates)||
    sourceReceipt.calendar.tradingDates.length!==61||
    sourceReceipt.calendar.tradingDates.at(-1)!==sourceReceipt.marketDate||
    new Set(sourceReceipt.calendar.tradingDates).size!==61)
  denial('SOURCE_RECEIPT_OR_CALENDAR_INCOMPLETE');
 const dates=sourceReceipt.calendar.tradingDates;
 if(dates.some((d,i)=>!isDay(d)||(i>0&&d<=dates[i-1])))
  denial('CALENDAR_DATES_INVALID');
 if(independentSourceAudit?.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'||
    independentSourceAudit?.sourceReceiptHash!==sourceReceipt.receiptHash||
    independentSourceAudit?.sourceMarketDatePairsVerified!==122||
    !H.test(independentSourceAudit.auditHash||'')||
    independentSourceAudit.selectionAuthorized!==false)
  denial('INDEPENDENT_A1_AUDIT_NOT_BOUND');
 if(preliminaryWatch?.schemaVersion!=='S2_PRELIMINARY_PV_WATCH_V0_2'||
    preliminaryWatch?.marketDate!==sourceReceipt.marketDate||
    preliminaryWatch?.originalSourceReceiptHash!==sourceReceipt.receiptHash||
    preliminaryWatch?.independentSourceAuditHash!==independentSourceAudit.auditHash||
    preliminaryWatch?.selectedCount!==null||
    preliminaryWatch?.finalSelectionAuthorized!==false||
    !Array.isArray(preliminaryWatch?.watchlist)||
    preliminaryWatch.watchlist.length!==preliminaryWatch.displayedCount||
    !H.test(preliminaryWatch?.receiptHash||'')||
    await sha256Hex(unsigned(preliminaryWatch,'receiptHash'))!==preliminaryWatch.receiptHash)
  denial('PRELIMINARY_WATCH_IDENTITY_OR_HASH_INVALID');
 if(caReceipt?.schemaVersion!=='S2_M09_SIX_CA_NATIVE_ORIGINAL_SOURCE_RECEIPT_V0_1'||
    caReceipt?.requestedEndDate!==sourceReceipt.marketDate||
    caReceipt?.requestedStartDate>dates[0]||
    !utc(caReceipt.firstPhysicalObservedAtUtc)||
    !utc(caReceipt.completedAtUtc)||
    caReceipt?.noEventMayBeClaimed!==false||
    caReceipt?.continuityCertified!==false||
    caReceipt?.selectionAuthorized!==false||
    !Array.isArray(caReceipt?.sourceReceipts)||
    caReceipt.sourceReceipts.length!==6||
    new Set(caReceipt.sourceReceipts.map(r=>r.sourceId)).size!==6||
    !EXPECTED.every(x=>caReceipt.sourceReceipts.some(r=>r.sourceId===x))||
    !H.test(caReceipt?.receiptHash||'')||
    await sha256Hex(unsigned(caReceipt,'receiptHash'))!==caReceipt.receiptHash)
  denial('CA_SOURCE_OR_RECEIPT_INVALID');
 const dateSet=new Set(dates);
 const preview=new Set(),affectedPreview=new Map(),allAffected=new Set();
 for(const r of preliminaryWatch.watchlist){
  const k=r.market+'|'+r.symbol;
  if(!['TWSE','TPEX'].includes(r.market)||!CODE.test(r.symbol||'')||preview.has(k))
   denial('WATCHLIST_DUPLICATE_OR_NONSTOCK_CODE');
  preview.add(k);
 }
 const perSource=[],actionKeys=new Set();
 for(const rec of caReceipt.sourceReceipts){
  const market=rec.sourceId.split('_')[0];
  if(rec.exchange!==market||rec.sourceClass!=='HISTORICAL_ACTUAL_RESULT_RANGE'||
     rec.state!=='RANGE_SCHEMA_CANDIDATE_NOT_VINTAGE_CERTIFIED'||
     rec.originalBytesReadBackLocally!==true||
     !H.test(rec.originalSha256||'')||
     !utc(rec.capturedAtUtc)||!isDay(caReceipt.requestedStartDate)||!isDay(caReceipt.requestedEndDate))
    denial('SOURCE_FAMILY_NOT_PHYSICALLY_CONFIRMED');
  const raw=originalBySourceId[rec.sourceId];
  if(!Buffer.isBuffer(raw)||hash(raw)!==rec.originalSha256||
     raw.length!==rec.originalBytes)
    denial('ORIGINAL_BYTES_HASH_OR_LENGTH_MISMATCH');
  const summary=summarizeOfficialContinuityNativeOriginalV0_1({
   originalText:raw.toString('utf8'),startDate:caReceipt.requestedStartDate,
   endDate:sourceReceipt.marketDate
  });
  if(summary.state!=='STRUCTURE_READY'||summary.responseRangeVerified!==true)
   denial('NATIVE_RANGE_SEMANTICS_UNVERIFIED');
  const {rows,codeIdx,dateIdx}=rowsFromNative(raw);
  let inTradingWindow=0,invalidNativeDate=0,rawFourDigitEventRows=0;
  for(const row of rows){
   if(!Array.isArray(row))continue;
   const code=String(row[codeIdx]??'').trim();
   if(!CODE.test(code))continue;
   rawFourDigitEventRows++;
   const date=nativeDate(row[dateIdx]);
   if(date===null){invalidNativeDate++;continue;}
   if(!dateSet.has(date))continue;
   const id=market+'|'+code+'|'+rec.sourceId+'|'+date;
   if(actionKeys.has(id))continue;
   actionKeys.add(id);inTradingWindow++;
   const key=market+'|'+code;
   allAffected.add(key);
   if(preview.has(key)){
    if(!affectedPreview.has(key))affectedPreview.set(key,[]);
    affectedPreview.get(key).push({sourceId:rec.sourceId,eventDate:date,
     knowledgeTimeClass:'LATE_OBSERVED_SOURCE_NOT_REPROVEN_AT_2026_10_14_FREEZE'});
   }
  }
  if(invalidNativeDate>0)denial('FOUR_DIGIT_ACTION_EVENT_DATE_UNPARSEABLE');
  perSource.push({sourceId:rec.sourceId,market,
   originalRawSha256:rec.originalSha256,
   originalBytes:rec.originalBytes,
   capturedAtUtc:rec.capturedAtUtc,
   rawFourDigitEventRows,
   eventRowsIn61TradingDates:inTradingWindow,
   rangeReverifiedFromActualBytes:true});
 }
 const flagged=[...affectedPreview.entries()].sort(([a],[b])=>a.localeCompare(b))
   .map(([key,events])=>({market:key.split('|')[0],symbol:key.split('|')[1],
    sourceEventCount:events.length,events:events.sort((a,b)=>a.eventDate.localeCompare(b.eventDate))}));
 const base={
  schemaVersion:'S2_M09_CA_NEGATIVE_REPLAY_61_SESSION_V0_1',
  observedResultClass:'RETROSPECTIVE_CA_CONFLICT_DISCOVERY_NOT_PIT_FROZEN_SELECTION',
  marketDate:sourceReceipt.marketDate,
  firstTradingDate:dates[0],lastTradingDate:dates.at(-1),
  tradingSessions:61,
  initialA1ReceiptHash:sourceReceipt.receiptHash,
  independentA1AuditHash:independentSourceAudit.auditHash,
  previewReceiptHash:preliminaryWatch.receiptHash,
  caRawSixSourceReceiptHash:caReceipt.receiptHash,
  caRawFirstObservedAtUtc:caReceipt.firstPhysicalObservedAtUtc,
  caRawCompletedAtUtc:caReceipt.completedAtUtc,
  originalCaSourceCount:6,
  originalCaShaRehashed:6,
  eventRowsIn61TradingDates:actionKeys.size,
  uniqueMarketSymbolKeysWithKnownEvents:allAffected.size,
  preliminaryPreviewCount:preview.size,
  previewWithProvenPresentCaIn61Sessions:flagged.length,
  previewWithoutObservedCaNotClearedCount:preview.size-flagged.length,
  perSource,flaggedPreview:flagged,
  retroactivePitAdmission:false,asKnownAtPreviousDecisionClock:false,
  completeHistoricalRevisionAndCancellationEvidence:false,
  noEventOrNoActionMayBeCertified:false,
  positiveOrdinaryEquityClassAttested:false,
  sourceOnlyRiskExclusionCandidate:true,
  formalStrategySelectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreTouched:false
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('/replay_m09_ca_observed_negative_overlap_v0_1.mjs')){
 const root=process.env.S2_M09_CA_REPLAY_ROOT||'/tmp/s2-m09-ca-negative-replay';
 const [sourceReceipt,independentSourceAudit,preliminaryWatch,caReceipt]=
 await Promise.all([
  readFile(resolve(root,'a1/official-61-2026-10-14.json'),'utf8'),
  readFile(resolve(root,'audit/s2-shared-a1-independent-audit/audit-receipt.json'),'utf8'),
  readFile(resolve(root,'audit/s2-a1-stage1-readonly/preliminary-pv-watch.json'),'utf8'),
  readFile(resolve(root,'ca/receipt.json'),'utf8')
 ]).then(arr=>arr.map(JSON.parse));
 const byId={};
 for(const r of caReceipt.sourceReceipts){
  byId[r.sourceId]=gunzipSync(await readFile(resolve(root,'ca',r.sourceId+'-'+caReceipt.requestedEndDate+'.json.gz')));
 }
 const receipt=await replayM09CaObservedNegativeOverlapV0_1({
  sourceReceipt,independentSourceAudit,preliminaryWatch,caReceipt,originalBySourceId:byId
 });
 await mkdir(resolve(root,'output'),{recursive:true,mode:0o700});
 await writeFile(resolve(root,'output/negative-overlap-receipt.json'),
  JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  marketDate:receipt.marketDate,windowStart:receipt.firstTradingDate,
  sourceRehashCount:receipt.originalCaShaRehashed,
  eventRows:receipt.eventRowsIn61TradingDates,
  uniqueEventCodes:receipt.uniqueMarketSymbolKeysWithKnownEvents,
  preliminaryPreviewCount:receipt.preliminaryPreviewCount,
  observedEventConflicts:receipt.previewWithProvenPresentCaIn61Sessions,
  noEventCertified:false,selectedCount:null,receiptHash:receipt.receiptHash
 }));
}
