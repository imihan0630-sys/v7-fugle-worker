// DATA_LANE / #1068 — as-of 2026-10-16 source-only 2330 tradeability.
// Reuses exact saved same-date A1 TWSE original (NO re-GET) and performs TWO
// bounded official TWTAWU suspension-status GETs: known-positive 1218 control
// and T-day query. Missing row NEVER becomes authoritative NO_SUSPENSION.
// An A1 traded row means actually TRADED IN T SESSION, not guaranteed
// ongoing tradeability at T23:45, tomorrow or next open.
// Class A original-source proof only; no D1/R2/selection/Frozen/production.
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gzipSync,gunzipSync} from 'node:zlib';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildTwtaWuDiagnosticUrlV0_1,parseTwtaWuJsonRowsV0_1,
 TWTAWU_POSITIVE_CONTROL}
 from '../runtime/twtawu_positive_json_csv_parity_diagnostic_v0_1.mjs';
import {parseOfficialHistoricalA1PayloadV0_1,
 buildOfficialHistoricalA1UrlV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const fail=x=>{throw Error('S2_PITA_2330_STATUS_'+x)};
const DAY='2026-10-16',CUT='2026-10-16T15:45:00.000Z',
 SRC='c00391008b8a292dcec991afe102a07ea3e3a49ec42950a90491f3f13fe1a6cf';
const statusSources=[
 {id:'TWTAWU_KNOWN_POSITIVE_1218',range:{startDate:'2026-08-13',endDate:'2026-08-14'}},
 {id:'TWTAWU_T_SESSION',range:{startDate:DAY,endDate:DAY}},
];
function todayTaipei(d){
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',
   month:'2-digit',day:'2-digit'}).format(d);
}
const utc=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&
 new Date(Date.parse(x)).toISOString()===x;
const goodClock=(x,first)=>utc(x)&&
 Date.parse(x)>=+first&&Date.parse(x)<Date.parse(CUT);

async function sourceRead({source,fetchImpl,now,persistNative,begin}){
 const url=buildTwtaWuDiagnosticUrlV0_1('json',source.range);
 let response;
 try{
  response=await fetchImpl(url,{
   method:'GET',redirect:'follow',
   headers:{Accept:'application/json,text/plain,*/*',
    'User-Agent':'System2-PITA-T-Trade-Status-SourceOnly/0.1',
    Referer:'https://www.twse.com.tw/zh/trading/historical/twtawu.html'},
   signal:AbortSignal.timeout(20000)
  });
 }catch{fail(source.id+'_GET_TRANSPORT_FAILED')}
 if(response?.status!==200||response?.ok!==true)fail(source.id+'_HTTP_NOT_200');
 if(Number(response.headers?.get?.('content-length')||0)>2_000_000)
   fail(source.id+'_RESPONSE_OVERSIZE');
 let raw;
 try{raw=Buffer.from(await response.arrayBuffer())}
 catch{fail(source.id+'_BODY_UNREADABLE')}
 const at=now().toISOString();
 if(!goodClock(at,begin)||raw.length<40||raw.length>2_000_000)
   fail(source.id+'_RESPONSE_CLOCK_OR_SIZE');
 let payload;
 try{payload=JSON.parse(raw.toString('utf8'))}
 catch{fail(source.id+'_NATIVE_JSON_UNREADABLE')}
 if(!payload||typeof payload!=='object'||Array.isArray(payload)||
    typeof payload.stat!=='string')fail(source.id+'_NATIVE_STAT_UNKNOWN');
 const original=sha(raw);
 const saved=await persistNative({id:source.id,raw,originalSha256:original,
   firstPhysicalObservedAtUtc:at,url});
 if(saved?.verified!==true||saved.sha256!==original||saved.byteLength!==raw.length)
   fail(source.id+'_ORIGINAL_BYTE_READBACK_FAILED');
 let rows=[],parseState='QUERY_STATUS_NON_OK_UNCERTIFIED';
 if(payload.stat==='OK'){
  try{rows=parseTwTaWuJsonRowsSafe(raw)}
  catch{fail(source.id+'_NATIVE_ROW_SCHEMA_INVALID')}
  parseState='NATIVE_ROWS_PARSED_NO_COMPLETENESS_AUTHORITY';
 }
 if(source.id==='TWTAWU_KNOWN_POSITIVE_1218'){
   const witness=JSON.stringify({
    symbol:TWTAWU_POSITIVE_CONTROL.symbol,
    suspendedDate:TWTAWU_POSITIVE_CONTROL.suspendedDate,
    resumedDate:TWTAWU_POSITIVE_CONTROL.resumedDate
   });
   if(parseState!=='NATIVE_ROWS_PARSED_NO_COMPLETENESS_AUTHORITY'||
      !rows.includes(witness))fail('KNOWN_POSITIVE_1218_ORIGINAL_NOT_PRESENT');
 }
 const matches=source.id==='TWTAWU_T_SESSION'
  ?rows.map(x=>JSON.parse(x)).filter(x=>x.symbol==='2330'): [];
 return {sourceId:source.id,sourceUrl:url,rangeStartDate:source.range.startDate,
  rangeEndDate:source.range.endDate,upstreamStat:payload.stat,
  httpStatus:200,originalNativeBodyBytes:raw.length,
  originalNativeBodySha256:original,
  firstPhysicalObservedAtUtc:at,rawBytesGzipRehashed:true,
  parseState,parsedSourceRowCount:rows.length,
  native2330MatchedRows:matches,
  absenceCertifiesNoSuspension:false,authoritativeCompletenessCertified:false,
  nativeSuspensionEventObservedFor2330:matches.length>0
 };
}
function parseTwTaWuJsonRowsSafe(bytes){
 return parseTwtaWuJsonRowsV0_1(bytes.toString('utf8'));
}

export async function capturePita2330TradeStatusOriginalV0_1({
 now=()=>new Date(),fetchImpl=globalThis.fetch,
 readA1NativeOriginal,persistNative,expectedA1NativeIdentity=null
}={}){
 if(typeof now!=='function'||typeof fetchImpl!=='function'||
    typeof readA1NativeOriginal!=='function'||typeof persistNative!=='function')
   fail('SOURCE_IO_REQUIRED');
 const begin=now();
 if(!(begin instanceof Date)||!Number.isFinite(+begin)||
    todayTaipei(begin)!==DAY||+begin<Date.parse('2026-10-16T05:30:00.000Z')||
    +begin>=Date.parse(CUT))fail('TARGET_CUT_EXPIRED_OR_NOT_TAIPEI_T');
 let raw;
 try{raw=Buffer.from(await readA1NativeOriginal())}
 catch{fail('EXISTING_REAL_A1_ORIGINAL_UNREADABLE')}
 const expected=expectedA1NativeIdentity||{sha256:SRC,bytes:246183,rows:1086};
 if(!/^[a-f0-9]{64}$/.test(expected.sha256||'')||
    !Number.isInteger(expected.bytes)||expected.bytes<200||
    !Number.isInteger(expected.rows)||expected.rows<500||
    sha(raw)!==expected.sha256||raw.length!==expected.bytes)
   fail('EXISTING_REAL_A1_ORIGINAL_SHA_INVALID');
 let a1;
 try{
  a1=parseOfficialHistoricalA1PayloadV0_1({
   market:'TWSE',marketDate:DAY,payload:JSON.parse(raw.toString('utf8')),
   observedAt:'2026-10-16T13:31:18.152Z',
   sourceUrl:buildOfficialHistoricalA1UrlV0_1('TWSE',DAY)
  });
 }catch{fail('A1_NATIVE_DATE_PARSER_INVALID')}
 const matched=a1.rows.filter(x=>x.symbol==='2330');
 if(a1.state!=='READY'||a1.sourceDateEvidence!==DAY||
   matched.length!==1||a1.rows.length!==expected.rows||
   !(matched[0].volumeShares>0&&matched[0].transactions>0&&
     matched[0].tradeValue>0))
   fail('A1_2330_ACTUAL_T_SESSION_TRADES_UNVERIFIED');
 const receipt=[];
 for(const source of statusSources){
   receipt.push(await sourceRead({source,fetchImpl,now,persistNative,begin}));
 }
 const end=now().toISOString();
 if(!goodClock(end,begin))fail('FINAL_CAPTURE_CUT_EXPIRED');
 const positiveControl=receipt[0],target=receipt[1];
 const base={
  schemaVersion:'S2_DATA_PITA_2330_T_SESSION_TWTAWU_POSITIVE_STATUS_V0_1',
  stock:'2330',market:'TWSE',marketDate:DAY,
  sourceDateReadbackCutUtc:CUT,
  existingA1OriginalRunId:38908458028,
  existingA1OriginalArtifactId:12049690326,
  existingA1BodySha256:SRC,
  existingA1OriginalFirstObservedAtUtc:'2026-10-16T13:31:18.152Z',
  existingA1OriginalByteRehashed:true,
  currentSessionStockActuallyTraded:true,
  currentSessionStockVolumeShares:matched[0].volumeShares,
  currentSessionStockTradeCount:matched[0].transactions,
  currentSessionStockTradeValue:matched[0].tradeValue,
  nativeA1StockRowSha256:await sha256Hex(matched[0].sourceFields),
  tradingStatusSources:receipt,
  controlKnown1218SuspensionConfirmed:positiveControl.parsedSourceRowCount>=1,
  currentDateTwTaWuNative2330Rows:target.native2330MatchedRows.length,
  observed20261016SourceTradeableState:
    target.native2330MatchedRows.length>0?'POSSIBLE_SUSPENSION_EVENT_FOUND_REVIEW_REQUIRED':
      'T_SESSION_A1_TRADED_TWTAWU_ABSENCE_NOT_AUTHORITATIVE',
  tradeableAtDecisionCutIndependentlyCertified:false,
  issuerSuspensionAndReinstatementComplete:false,
  authoritativeNegativeNoSuspensionCertified:false,
  sourceOnlyEvidencePositive:true,
  dataOnlySourceWitness:true,
  selectionAuthorized:false,pitEligible:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false,
  actualOriginalStatusCompletedAtUtc:end
 };
 return {...base,receiptHash:await sha256Hex(base)};
}

if(process.argv[1]?.endsWith('/capture_pita_2330_t_trade_status_native_readonly_v0_1.mjs')){
 const out='/tmp/s2-pita-2330-20261016-native-status';
 await mkdir(out,{recursive:true,mode:0o700});
 const persistNative=async({id,raw,originalSha256})=>{
  const path=resolve(out,id+'.json.gz');
  await writeFile(path,gzipSync(raw),{flag:'wx',mode:0o600});
  const check=gunzipSync(await readFile(path));
  return {verified:sha(check)===originalSha256,
    sha256:sha(check),byteLength:check.length};
 };
 const data=await capturePita2330TradeStatusOriginalV0_1({
   readA1NativeOriginal:async()=>gunzipSync(
     await readFile('/tmp/s2-pita-2330-20261016-original/TWSE-2026-10-16-original.json.gz')
   ),persistNative});
 await writeFile(resolve(out,'2330-asof-trading-status-sourceonly.json'),
   JSON.stringify(data,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({symbol:data.stock,marketDate:data.marketDate,
  actualA1Trades:data.currentSessionStockActuallyTraded,
  volumeShares:data.currentSessionStockVolumeShares,
  statusSources:2,targetNativeStatusRows:data.currentDateTwTaWuNative2330Rows,
  knownPositiveControl:data.controlKnown1218SuspensionConfirmed,
  originalDataSignedHash:data.receiptHash,
  authoritativeNegativeSuspension:false,
  independentlyCertifiedTradeability:false,PIT_A_Certified:false,
  selectedCount:null,frozen:false,d1Writes:0}));
}
