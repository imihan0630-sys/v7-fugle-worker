// M09 Class A: compare a REAL independently A1-audited preliminary watch
// against official present-day single-security ISIN/CFI records. MAX 30 GET.
// Current security class is NOT historical type as-of T, NOT selection PIT.
import {createHash} from 'node:crypto';
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gzipSync,gunzipSync} from 'node:zlib';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {probeM09OfficialSingleSecurityOriginalV0_1}
 from './probe_m09_official_single_security_cfi_original_readonly_v0_1.mjs';
const OUT='/tmp/s2-m09-preview-native-cfi';
const H=/^[a-f0-9]{64}$/i;
const CODE=/^[1-9][0-9]{3}$/;
const sha=x=>createHash('sha256').update(x).digest('hex');
const strip=(o,key)=>Object.fromEntries(Object.entries(o||{}).filter(([k])=>k!==key));
const validDay=d=>typeof d==='string'&&/^\\d{4}-\\d\\d-\\d\\d$/.test(d)&&
 Number.isFinite(Date.parse(d+'T00:00:00Z'))&&
 new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
const validCalendar=dates=>Array.isArray(dates)&&dates.length===61&&
 dates.every((d,i)=>validDay(d)&&(i===0||d>dates[i-1]));
function deny(code){throw Error('M09_PREVIEW_NATIVE_CFI_'+code)}
function nativeMarketMatch(nativeLabel,expected){
 const label=String(nativeLabel||'').trim().toUpperCase();
 if(expected==='TWSE'&&label==='TAIWAN INNOVATION BOARD')
  return {matched:true,board:'TWSE_INNOVATION_BOARD_TIB'};
 if(expected==='TWSE'&&label==='TWSE LISTED')
  return {matched:true,board:'TWSE_MAIN'};
 if(expected==='TPEX'&&label==='TPEX LISTED')
  return {matched:true,board:'TPEX_MAIN'};
 return {matched:false,board:'UNKNOWN_OR_MISMATCH'};
}

function validateWatch(sourceReceipt,independentA1Audit,watch){
 if(sourceReceipt?.schemaVersion!=='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'||
  sourceReceipt.state!=='SOURCE_OBSERVED_UNAUDITED'||
  sourceReceipt.receivedMarketDateCount!==122||
  !H.test(sourceReceipt.receiptHash||'')||
  !validCalendar(sourceReceipt.calendar?.tradingDates)||
  sourceReceipt.calendar.tradingDates.at(-1)!==sourceReceipt.marketDate)
  deny('A1_ORIGINAL_SOURCE_NOT_COMPLETE');
 if(independentA1Audit?.schemaVersion!=='SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1'||
  independentA1Audit.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'||
  independentA1Audit.sourceReceiptHash!==sourceReceipt.receiptHash||
  independentA1Audit.marketDate!==sourceReceipt.marketDate||
  independentA1Audit.sourceMarketDatePairsVerified!==122||
  independentA1Audit.originalFilesRehashedAfterDownload!==122||
  independentA1Audit.originalFilesDecompressedAndParsed!==122||
  independentA1Audit.auditorSeparation!=='INDEPENDENT_READBACK_PROCESS'||
  independentA1Audit.selectionAuthorized!==false||
  !H.test(independentA1Audit.auditHash||''))
  deny('INDEPENDENT_A1_AUDIT_NOT_BOUND');
 if(watch?.schemaVersion!=='S2_PRELIMINARY_PV_WATCH_V0_2'||
  watch.watchVersion!=='PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2'||
  watch.marketDate!==sourceReceipt.marketDate||
  watch.originalSourceReceiptHash!==sourceReceipt.receiptHash||
  watch.independentSourceAuditHash!==independentA1Audit.auditHash||
  watch.state!=='PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION'||
  watch.ordinaryEquityOnlyUniverseCertified!==false||
  watch.finalSelectionAuthorized!==false||watch.selectedCount!==null||
  watch.frozenWritten!==false||!H.test(watch.receiptHash||'')||
  !Array.isArray(watch.watchlist)||watch.watchlist.length===0||
  watch.watchlist.length!==watch.displayedCount||
  watch.watchlist.length>30)
  deny('ORIGINAL_PRELIMINARY_WATCH_INVALID');
 const seen=new Set();
 for(const row of watch.watchlist){
  const code=row?.symbol,market=row?.market,identity=market+'|'+code;
  if(!['TWSE','TPEX'].includes(market)||!CODE.test(code||'')||
    seen.has(identity)||row?.strategyRank!==null)
   deny('PREVIEW_SYMBOL_OR_AUTHORITY_INVALID');
  seen.add(identity);
 }
}
export async function probeM09AuditedPreviewNativeCfiV0_1({
 sourceReceipt,independentA1Audit,preliminaryWatch,now=()=>new Date(),
 fetchImpl=globalThis.fetch,persistRaw,
 probeOne=probeM09OfficialSingleSecurityOriginalV0_1
}={}){
 validateWatch(sourceReceipt,independentA1Audit,preliminaryWatch);
 // SOURCE provenance was previously a plausible-looking hex label only.
 // Recompute all signed original 61-session fields before even one CFI GET.
 let sourceHashCorrect=false;
 try{
  sourceHashCorrect=(await sha256Hex(
   official61SessionSourceReceiptHashBaseV0_1(sourceReceipt)))===sourceReceipt.receiptHash;
 }catch{}
 if(!sourceHashCorrect)deny('A1_ORIGINAL_SOURCE_HASH_MISMATCH');
 if(await sha256Hex(strip(preliminaryWatch,'receiptHash'))!==preliminaryWatch.receiptHash)
  deny('PRELIMINARY_WATCH_HASH_MISMATCH');
 if(await sha256Hex(strip(independentA1Audit,'auditHash'))!==independentA1Audit.auditHash)
  deny('A1_INDEPENDENT_AUDIT_HASH_MISMATCH');
 if(typeof fetchImpl!=='function'||typeof persistRaw!=='function')
  deny('FETCH_AND_CREATE_ONLY_RAW_REQUIRED');
 const startAtUtc=now().toISOString(),observations=[];
 for(let i=0;i<preliminaryWatch.watchlist.length;i+=4){
  const group=preliminaryWatch.watchlist.slice(i,i+4);
  const controls=group.map(r=>({code:r.symbol,hint:'ACTUAL_A1_PRELIMINARY_'+r.market}));
  const result=await probeOne({controls,now,fetchImpl,persistRaw});
  // Each 1–4-source batch is itself receipt-signed. A producer-returned
  // native class is never accepted just because it has a valid CFI label.
  if(result?.schemaVersion!=='S2_M09_NATIVE_SINGLE_ISIN_CFI_TRANSPORT_V0_1'||
    !H.test(result.receiptHash||'')||
    await sha256Hex(strip(result,'receiptHash'))!==result.receiptHash)
   deny('SIGNED_NATIVE_SOURCE_BATCH_NOT_VERIFIED');
  if(result.controlsChecked!==controls.length||
    !Array.isArray(result.sourceReceipts)||
    result.sourceReceipts.length!==controls.length||
    result.ordinaryCommonSharePITCertified!==false||result.selectedCount!==null)
   deny('NATIVE_SOURCE_RESPONSE_SCOPE_CHANGED');
  for(let j=0;j<group.length;j++){
   const item=group[j],n=result.sourceReceipts[j];
   if(n?.state==='NATIVE_SINGLE_CFI_ROW_OBSERVED'&&
     (!H.test(n.originalSha256||'')||!Number.isSafeInteger(n.originalBytes)||
      n.originalBytes<150||n.rawByteReadback!==true||
      typeof n.observedAtUtc!=='string'||
      !Number.isFinite(Date.parse(n.observedAtUtc))))
    deny('NATIVE_PROVENANCE_NOT_VERIFIED');
   if(n.code!==item.symbol||n.controlIntent!=='ACTUAL_A1_PRELIMINARY_'+item.market)
    deny('NATIVE_SOURCE_CODE_ORDER_MISMATCH');
   const nativeMatch=nativeMarketMatch(n.nativeMarketLabel,item.market);
   const sameNativeMarket=n.state==='NATIVE_SINGLE_CFI_ROW_OBSERVED'&&
    nativeMatch.matched;
   const currentObservedShare=sameNativeMarket&&
    n.nativeTypeLabel==='Stocks'&&/^ES[A-Z]{4}$/.test(n.cfi||'');
   const explicitNonShare=sameNativeMarket&&
    ((n.nativeTypeLabel==='TDR'&&/^ED[A-Z]{4}$/.test(n.cfi||''))||
     (n.nativeTypeLabel==='ETF'&&/^CE[A-Z]{4}$/.test(n.cfi||'')));
   observations.push({
    market:item.market,symbol:item.symbol,
    currentNativeIdentityStatus:currentObservedShare?'CURRENT_NATIVE_STOCK_CFI_OBSERVED':
      explicitNonShare?'CURRENT_NATIVE_NON_SHARE_EXPLICIT':
      'NATIVE_CLASS_UNKNOWN',
    nativeTypeLabel:n.nativeTypeLabel,nativeMarketLabel:n.nativeMarketLabel,
    nativeMarketMatchesPreliminaryMarket:sameNativeMarket,
    nativeExchangeBoard:nativeMatch.board,
    innovationBoardSpecialEligibilityStillUnverified:nativeMatch.board==='TWSE_INNOVATION_BOARD_TIB',
    cfi:n.cfi,isin:n.isin,
    requestedAtUtc:startAtUtc,observedAtUtc:n.observedAtUtc,
    originalProviderSha256:n.originalSha256,
    originalProviderBytes:n.originalBytes,
    originalProviderByteReadbackVerified:n.rawByteReadback,
    originalSourceStatus:n.state,
    historicalSecurityClassPitCertified:false,
    positiveOrdinaryEquityPitAdmitted:false
   });
  }
 }
 const nativeCurrentShareRows=observations.filter(x=>x.currentNativeIdentityStatus==='CURRENT_NATIVE_STOCK_CFI_OBSERVED').length;
 const explicitNonShares=observations.filter(x=>x.currentNativeIdentityStatus==='CURRENT_NATIVE_NON_SHARE_EXPLICIT').length;
 const unknown=observations.length-nativeCurrentShareRows-explicitNonShares;
 const innovationBoardRows=observations.filter(x=>x.nativeExchangeBoard==='TWSE_INNOVATION_BOARD_TIB').length;
 const base={
  schemaVersion:'S2_M09_AUDITED_PRELIMINARY_NATIVE_CFI_V0_1',
  evidenceClass:'ONLY_CURRENT_AS_OBSERVED_NATIVE_INSTRUMENT_TYPE_NOT_HISTORICAL_PIT',
  originalMarketDate:preliminaryWatch.marketDate,
  originalA1SourceReceiptHash:sourceReceipt.receiptHash,
  independentA1AuditHash:independentA1Audit.auditHash,
  originalPreliminaryWatchHash:preliminaryWatch.receiptHash,
  currentNativeObservationStartedUtc:startAtUtc,
  currentNativeObservationFinishedUtc:now().toISOString(),
  preliminaryDenominator:preliminaryWatch.watchlist.length,
  perSymbolNativeRequestsMade:observations.length,
  currentNativeStockCfiObserved:nativeCurrentShareRows,
  currentNativeNonShareExplicit:explicitNonShares,
  currentNativeUnverified:unknown,
  currentNativeInnovationBoardStocks:innovationBoardRows,
  innovationBoardSpecialStrategyEligibilityCertified:false,
  currentNativeRowsAllObserved:unknown===0,
  historicalOrdinarySharePitCertified:0,
  historicalOrdinarySharePitDenominatorCertified:false,
  asKnownAtPreviousMarketDate:false,
  originalSourceRowsIndependentlyRehashedSeparateRun:false,
  acceptedA1SourceIntegrityOnly:true,
  caPITContinuityCertified:false,
  formalShortMomentumQualified:false,
  selectionRank:null,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreTouched:false,observations
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('/probe_m09_audited_preview_native_cfi_readonly_v0_1.mjs')){
 const sourceRoot='/tmp/s2-source-for-independent-readback';
 const filename=(await readdir(sourceRoot)).find(p=>/^official-61-\d{4}-\d\d-\d\d\.json$/.test(p));
 if(!filename)deny('A1_61_OFFICIAL_RECEIPT_NOT_FOUND');
 const [s,a,w]=await Promise.all([
  readFile(resolve(sourceRoot,filename),'utf8'),
  readFile('/tmp/s2-shared-a1-independent-audit/audit-receipt.json','utf8'),
  readFile('/tmp/s2-a1-stage1-readonly/preliminary-pv-watch.json','utf8')
 ]).then(x=>x.map(JSON.parse));
 await mkdir(OUT,{recursive:true,mode:0o700});
 const rawSaver=async({code,raw,originalSha256})=>{
  const p=resolve(OUT,'native-'+code+'.html.gz');
  await writeFile(p,gzipSync(raw,{level:6}),{flag:'wx',mode:0o600});
  const restored=gunzipSync(await readFile(p));
  return {verified:sha(restored)===originalSha256,
   sha256:sha(restored),byteLength:restored.length};
 };
 const receipt=await probeM09AuditedPreviewNativeCfiV0_1({
  sourceReceipt:s,independentA1Audit:a,preliminaryWatch:w,persistRaw:rawSaver
 });
 await writeFile(resolve(OUT,'preview-native-cfi.json'),
  JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  state:receipt.evidenceClass,originalMarketDate:receipt.originalMarketDate,
  preliminaryDenominator:receipt.preliminaryDenominator,
  perSymbolNativeRequestsMade:receipt.perSymbolNativeRequestsMade,
  currentNativeStockCfiObserved:receipt.currentNativeStockCfiObserved,
  currentNativeNonShareExplicit:receipt.currentNativeNonShareExplicit,
  currentNativeUnverified:receipt.currentNativeUnverified,
  currentNativeInnovationBoardStocks:receipt.currentNativeInnovationBoardStocks,
  historicalOrdinarySharePitCertified:0,
  noSelection:true,selectedCount:null,
  receiptHash:receipt.receiptHash
 }));
}
