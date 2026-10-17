// DATA_LANE: rehash original official T/T-1 TWSE+TPEx GZIP and retain every
// four-digit market-T source row, not just the 61-session-complete cohort.
// NO provider GET, D1/R2, Worker, strategy, Frozen, trades or System1 writes.
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {parseOfficialHistoricalA1PayloadV0_1,buildOfficialHistoricalA1UrlV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';
const DIGEST=/^[0-9a-f]{64}$/,DAY=/^\d{4}-\d\d-\d\d$/;
const UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const bad=x=>{throw Error('DATA_A1_FULL_UNIVERSE_'+x)};
const validDay=s=>typeof s==='string'&&DAY.test(s)&&
 Number.isFinite(Date.parse(s+'T00:00:00Z'))&&
 new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const validUtc=s=>typeof s==='string'&&UTC.test(s)&&
 Number.isFinite(Date.parse(s))&&
 new Date(s).toISOString().slice(0,19)===s.slice(0,19);
const bodySha=b=>createHash('sha256').update(b).digest('hex');
const isNum=n=>typeof n==='number'&&Number.isFinite(n);
async function originalRows({market,date,source,originalDirectory,readRaw}){
 const row=source.receipts.find(x=>x.market===market&&x.marketDate===date);
 if(!row||!validUtc(row.capturedAt)||!DIGEST.test(row.originalRawResponseSha256||'')||
   row.providerReportedDate!==date||
   row.sourceUrl!==buildOfficialHistoricalA1UrlV0_1(market,date))
  bad('EXACT_ORIGINAL_RECEIPT_IDENTITY_MISSING');
 let zipped;
 try{zipped=await readRaw(resolve(originalDirectory,market+'-'+date+'.json.gz'))}
 catch{bad('ORIGINAL_GZIP_MISSING')}
 let raw;
 try{raw=gunzipSync(zipped,{maxOutputLength:32*1024*1024})}
 catch{bad('ORIGINAL_GZIP_INVALID')}
 if(raw.length!==row.originalRawResponseBytes||
  bodySha(raw)!==row.originalRawResponseSha256)bad('ORIGINAL_BYTES_SHA_MISMATCH');
 let payload;
 try{payload=JSON.parse(raw.toString('utf8'))}catch{bad('NATIVE_JSON_INVALID')}
 const parsed=parseOfficialHistoricalA1PayloadV0_1({
  market,marketDate:date,observedAt:row.capturedAt,
  sourceUrl:row.sourceUrl,payload
 });
 if(parsed.state!=='READY'||parsed.sourceDateEvidence!==date||
   parsed.rows.length!==row.rowCount||parsed.rows.length<(market==='TWSE'?600:450))
   bad('OFFICIAL_PROVIDER_DATE_OR_COUNT_INVALID');
 return {receipt:row,rows:parsed.rows};
}
export async function buildA1FourDigitOriginalFullUniverseHandoffV0_1({
 source,independentAudit,originalDirectory,
 readRaw=readFile,generatedAtUtc
}={}){
 if(!validUtc(generatedAtUtc)||typeof originalDirectory!=='string'||!originalDirectory||
   typeof readRaw!=='function')bad('OBSERVATION_CLOCK_OR_ORIGINAL_PATH_INVALID');
 if(source?.schemaVersion!=='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'||
  source.state!=='SOURCE_OBSERVED_UNAUDITED'||!validDay(source.marketDate)||
  !Array.isArray(source.calendar?.tradingDates)||
  source.calendar.tradingDates.length!==61||
  source.calendar.tradingDates.at(-1)!==source.marketDate||
  source.calendar.tradingDates.some((x,i,a)=>!validDay(x)||i>0&&x<=a[i-1])||
  !Array.isArray(source.receipts)||source.receipts.length!==122||
  source.receivedMarketDateCount!==122||!DIGEST.test(source.receiptHash||''))
   bad('SIGNED_SOURCE_61_WINDOW_INVALID');
 if(await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(source))!==source.receiptHash)
  bad('ORIGINAL_SOURCE_RECEIPT_HASH_INVALID');
 if(independentAudit?.schemaVersion!=='SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1'||
   independentAudit.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'||
   independentAudit.sourceReceiptHash!==source.receiptHash||
   independentAudit.marketDate!==source.marketDate||
   independentAudit.sourceMarketDatePairsVerified!==122||
   independentAudit.originalFilesRehashedAfterDownload!==122||
   independentAudit.originalFilesDecompressedAndParsed!==122||
   independentAudit.selectionAuthorized!==false||
   independentAudit.strategyPitCertified!==false||
   independentAudit.frozenWritten!==false||
   !validUtc(independentAudit.auditedAtUtc)||
   Date.parse(independentAudit.auditedAtUtc)>Date.parse(generatedAtUtc)||
   !DIGEST.test(independentAudit.auditHash||''))
  bad('INDEPENDENT_AUDIT_SCOPE_UNVERIFIED');
 const {auditHash,...auditedBase}=independentAudit;
 if(await sha256Hex(auditedBase)!==auditHash)bad('INDEPENDENT_AUDIT_HASH_INVALID');
 const T=source.marketDate,previous=source.calendar.tradingDates.at(-2);
 const seenPairs=new Set();
 for(const x of source.receipts){
  if(!['TWSE','TPEX'].includes(x.market)||!source.calendar.tradingDates.includes(x.marketDate)||
    !validUtc(x.capturedAt)||!DIGEST.test(x.originalRawResponseSha256||'')||
    Date.parse(x.capturedAt)>Date.parse(generatedAtUtc))
    bad('SIGNED_SOURCE_PAIR_INVALID');
  const id=x.market+'|'+x.marketDate;
  if(seenPairs.has(id))bad('DUPLICATE_SOURCE_MARKET_DATE');
  seenPairs.add(id);
 }
 if(seenPairs.size!==122)bad('SOURCE_PAIR_COUNT_INVALID');
 const rows=[],marketSummaries=[];
 for(const market of ['TWSE','TPEX']){
  const [current,prior]=await Promise.all([T,previous].map(date=>
   originalRows({market,date,source,originalDirectory,readRaw})));
  const previousMap=new Map(prior.rows.map(x=>[x.symbol,x]));
  const unique=new Set();
  let withPrice=0,withValue=0,priorKnown=0;
  for(const native of current.rows){
   const id=market+'|'+native.symbol;
   if(unique.has(id))bad('DUPLICATE_ORIGINAL_STOCK_ROW');
   unique.add(id);
   const priorBar=previousMap.get(native.symbol)||null;
   const rawRowHash=await sha256Hex(native.sourceFields);
   if(!DIGEST.test(rawRowHash))bad('SOURCE_ROW_HASH_INVALID');
   const signedWindow=source.bySymbol?.[id];
   if(signedWindow){
    const signedT=signedWindow.bars?.find(x=>x.date===T);
    if(!signedT||signedT.sourceRowHash!==rawRowHash||
       signedT.sourceOriginalResponseSha256!==current.receipt.originalRawResponseSha256)
      bad('SIGNED_COMPLETE_WINDOW_ROW_MISMATCH');
   }
   const close=isNum(native.close)?native.close:null;
   const priorClose=isNum(priorBar?.close)?priorBar.close:null;
   const volumeShares=isNum(native.volumeShares)?native.volumeShares:null;
   const tradeValueTwd=isNum(native.tradeValue)?native.tradeValue:null;
   if(close!==null)withPrice++;
   if(tradeValueTwd!==null)withValue++;
   if(priorClose!==null)priorKnown++;
   rows.push({
    market,symbol:native.symbol,companyName:native.companyName,
    marketDate:T,sourceRowHash:rawRowHash,
    originalRawBodySha256:current.receipt.originalRawResponseSha256,
    originalSourceObservedAtUtc:current.receipt.capturedAt,
    priceSpace:'RAW',close,previousSessionRawClose:priorClose,
    previousOfficialTradingDate:previous,
    previousSessionSourceRowHash:priorBar?
      await sha256Hex(priorBar.sourceFields):null,
    volumeShares,volumeUnit:'SHARES',
    tradeValueTwd,tradeValueUnit:'TWD',
    instrumentClassPITStatus:'ORDINARY_EQUITY_CLASS_NOT_INDEPENDENTLY_ATTESTED',
    caAdjustedPriceComparable:false,
    caRevisionAndNegativeScopeCertified:false,
    genuinePublicationFirstKnownAtUtc:null,
    genuinePublicationAvailableAtUtc:null,
    sourceIntegrityIndependentlyAudited:true,
    rowNativeIntegrityRehashedByThisDataProducer:true,
    strategyUseAuthorized:false
   });
  }
  marketSummaries.push({
   market,originalSourceRows:current.rows.length,
   fourDigitInstrumentCount:unique.size,
   verifiedNativeSourceDate:T,previousOfficialTradingDate:previous,
   nativeOriginalSha256:current.receipt.originalRawResponseSha256,
   previousNativeOriginalSha256:prior.receipt.originalRawResponseSha256,
   originalTObservedAtUtc:current.receipt.capturedAt,
   positiveRawCloseCount:withPrice,
   nonNullTradeValueTwdCount:withValue,
   priorSessionRawCloseKnownCount:priorKnown,
   ordinaryEquityCertifiedCount:null
  });
 }
 rows.sort((a,b)=>a.market.localeCompare(b.market)||a.symbol.localeCompare(b.symbol));
 const base={
  schemaVersion:'S2_A1_FOUR_DIGIT_UNIVERSE_HANDOFF_V0_1',
  marketDate:T,previousOfficialTradingDate:previous,
  generatedAtUtc,
  observedAtUtc:marketSummaries.map(x=>x.originalTObservedAtUtc).sort().at(-1),
  originalSourceReceiptHash:source.receiptHash,
  independentSourceAuditHash:independentAudit.auditHash,
  originalSourceRunId:null,originalSourceArtifactId:null,
  independentAuditRunId:null,independentAuditArtifactId:null,
  fourDigitInstrumentCount:rows.length,
  marketSummaries,rows,
  ordinaryShareClassCertified:false,
  full61HistoricalCFIAndCAQualified:false,
  providerPublicationPITCertified:false,
  preMarketDecisionTimelinessAccepted:false,
  tradeValueTwdIsExecutedMoneyFlow:false,
  originalNativeRowsConfirmed:true,
  nativeSourceFamily:'OFFICIAL_TWSE_TPEX_DAILY_A1',
  historicalSourceReplayOnly:true,
  selectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,cloudflareD1Reads:0,cloudflareD1Writes:0,
  cloudflareR2Calls:0,additionalProviderGET:0,system1FormalCoreModified:false
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
async function cli(){
 const [src,audit,originalDir,out]=process.argv.slice(2);
 if(!src||!audit||!originalDir||!out)bad('FOUR_INPUT_PATHS_REQUIRED');
 const [source,independentAudit]=await Promise.all([src,audit].map(x=>
  readFile(x,'utf8').then(JSON.parse)));
 const result=await buildA1FourDigitOriginalFullUniverseHandoffV0_1({
  source,independentAudit,originalDirectory:originalDir,
  generatedAtUtc:new Date().toISOString()
 });
 await mkdir(resolve(out),{recursive:true,mode:0o700});
 await writeFile(resolve(out,'full-universe-a1-source-handoff.json'),
  JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  marketDate:result.marketDate,fourDigitInstrumentCount:result.fourDigitInstrumentCount,
  markets:result.marketSummaries.map(x=>({
   market:x.market,symbols:x.fourDigitInstrumentCount,
   withTwdTurnover:x.nonNullTradeValueTwdCount
  })),originalReceipt:result.originalSourceReceiptHash,
  auditHash:result.independentSourceAuditHash,outputHash:result.receiptHash,
  pitQualified:false,formalSelectedCount:null,frozen:false
 }));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{await cli()}catch(e){console.error(String(e?.message||'UNKNOWN').startsWith('DATA_A1_FULL_UNIVERSE_')?
   e.message:'DATA_A1_FULL_UNIVERSE_FAIL_CLOSED');process.exitCode=2}
}
