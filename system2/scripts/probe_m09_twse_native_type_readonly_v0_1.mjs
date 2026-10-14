// System2 M09 — bounded free native TWSE historical type-capability discovery.
// No source reclassification, no full market row publishing, no Cloudflare,
// no PIT promotion, no Frozen selectedCount; only a signed aggregate receipt.
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const DAY=/^\d{4}-\d\d-\d\d$/;
const UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const CODE=/^[1-9]\d{3}$/;
const norm=x=>String(x??'').replace(/<[^>]+>/g,'').trim();
const validDay=x=>DAY.test(x||'')&&Number.isFinite(Date.parse(x+'T00:00:00Z'))&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const validUtc=x=>UTC.test(x||'')&&Number.isFinite(Date.parse(x));
const RAWMAX=22_000_000;
export const TWSE_M09_TYPE_SOURCE='https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX';
function extractedProviderDay(payload){
 const direct=String(payload?.date||payload?.reportDate||'').trim();
 if(/^\d{8}$/.test(direct))return direct.slice(0,4)+'-'+direct.slice(4,6)+'-'+direct.slice(6,8);
 const roc=String(payload?.title||'').match(/(?:^|\D)(\d{2,3})年(\d{1,2})月(\d{1,2})日/);
 if(roc)return String(1911+Number(roc[1])).padStart(4,'0')+'-'+roc[2].padStart(2,'0')+'-'+roc[3].padStart(2,'0');
 return null;
}
export async function probeM09TwseNativeTypeV0_1({
 requestedDate,rawBytes,observedAtUtc,
}={}){
 if(!validDay(requestedDate)||!validUtc(observedAtUtc))throw Error('M09_NATIVE_TYPE_REQUEST_CLOCK_INVALID');
 if(!Buffer.isBuffer(rawBytes)||rawBytes.length<120||rawBytes.length>RAWMAX)
  throw Error('M09_NATIVE_TYPE_ORIGINAL_BYTES_INVALID');
 const originalSha256=createHash('sha256').update(rawBytes).digest('hex');
 let payload;
 try{payload=JSON.parse(rawBytes.toString('utf8').replace(/^\uFEFF/,''));}
 catch{throw Error('M09_NATIVE_TYPE_NOT_JSON');}
 const providerDay=extractedProviderDay(payload);
 const tables=Array.isArray(payload?.tables)?payload.tables:
  (Array.isArray(payload?.data)&&Array.isArray(payload?.fields)?
   [{title:payload.title||null,fields:payload.fields,data:payload.data}]:[]);
 const schemaSamples=[],evidence={},typedRows=new Map();
 let rawRows=0,categorizedAggregateOnly=false,ambiguousCodes=0,stockRows=0;
 const classes=new Set(['一般股票','普通股','上市股票','股票','台灣存託憑證','臺灣存託憑證','存託憑證']);
 const ordinary=new Set(['一般股票','普通股','上市股票']);
 const isDepositary=v=>/存託憑證|depositary receipt/i.test(v);
 for(const t of tables){
  const fields=Array.isArray(t?.fields)?t.fields.map(norm):[];
  const rows=Array.isArray(t?.data)?t.data:[];
  const title=norm(t?.title||t?.name);
  const symbolCol=fields.findIndex(f=>/^(證券代號|股票代號|代號|SecurityCode)$/.test(f));
  const nameCol=fields.findIndex(f=>/^(證券名稱|股票名稱|名稱)$/.test(f));
  const typeCol=fields.findIndex(f=>/^(有價證券種類|證券種類|有價證券類別|股票種類|證券類型|交易類別)$/.test(f));
  rawRows+=rows.length;
  if(schemaSamples.length<24)schemaSamples.push({title:title.slice(0,85),
   fields:fields.slice(0,15),rows:rows.length,symbolColumnFound:symbolCol>=0,
   explicitTypeColumnFound:typeCol>=0});
  if(symbolCol<0){
   if(rows.some(row=>Array.isArray(row)&&row.some(cell=>classes.has(norm(cell)))))
    categorizedAggregateOnly=true;
   continue;
  }
  for(const row of rows){
   if(!Array.isArray(row)||!CODE.test(norm(row[symbolCol])))continue;
   stockRows++;
   const symbol=norm(row[symbolCol]),issuer=nameCol>=0?norm(row[nameCol]):'';
   const category=typeCol>=0?norm(row[typeCol]):
    (ordinary.has(title)||isDepositary(title)?title:'');
   // Do not infer stock class from a four-digit code, issuer name, or
   // a marketwide summary. Only same-row explicit type/typed stock table.
   if(!category||(!ordinary.has(category)&&!isDepositary(category)))continue;
   if(/[-‐‑‒–—]\s*DR$/i.test(issuer.normalize('NFKC'))&&ordinary.has(category))continue;
   if(typedRows.has(symbol)){ambiguousCodes++;typedRows.delete(symbol);continue;}
   typedRows.set(symbol,category);
  }
 }
 let positive=0,depositary=0;
 for(const category of typedRows.values()){
  if(ordinary.has(category))positive++;
  if(isDepositary(category))depositary++;
 }
 const sourceDateExact=providerDay===requestedDate;
 const potentialPerSymbol=sourceDateExact&&positive>0&&ambiguousCodes===0;
 const base={
  schemaVersion:'S2_M09_NATIVE_TWSE_TYPE_CAPABILITY_V0_1',
  classification:'SOURCE_CAPABILITY_ONLY_NO_INSTRUMENT_ADMISSION',
  requestedDate,providerDate:providerDay,sourceDateExact,
  observedAtUtc,originalSource:'TWSE_MI_INDEX',
  originalSourceUrl:TWSE_M09_TYPE_SOURCE+
   '?date='+requestedDate.replaceAll('-','')+'&type=ALLBUT0999&response=json',
  originalSha256,originalBytes:rawBytes.length,
  transportNative:true,tableCount:tables.length,rowCount:rawRows,
  sourceSchemaSamples:schemaSamples,
  fourDigitQuotedRowsInspected:stockRows,
  explicitOrdinaryFourDigitRows:positive,
  explicitDepositaryFourDigitRows:depositary,
  ambiguousDuplicateCodes:ambiguousCodes,
  aggregateStockAndDepositaryCategoryObserved:categorizedAggregateOnly,
  state:potentialPerSymbol?'PER_SYMBOL_EXPLICIT_TYPE_CANDIDATE_UNAUDITED':
   sourceDateExact?'AGGREGATE_OR_TYPE_UNVERIFIED':'EXACT_DATE_NOT_PROVEN',
  // A separate independent original-byte readback would still be mandatory.
  separatelyIndependentlyAudited:false,perSymbolPITSourceRowsCertified:false,
  historicalCompanyActionPITCertified:false,
  ordinaryEquityAdmissionEnabled:false,selectedCount:null,zeroPickDay:null,
  frozenDecisionWritten:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalRuntimeTouched:false,
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
export async function runM09TwseNativeTypeV0_1({
 requestedDate='2026-10-13',fetchImpl=globalThis.fetch,now=()=>new Date()
}={}){
 if(!validDay(requestedDate))throw Error('M09_NATIVE_TYPE_DATE_INVALID');
 const url=TWSE_M09_TYPE_SOURCE+
  '?date='+requestedDate.replaceAll('-','')+'&type=ALLBUT0999&response=json';
 const at=now().toISOString();
 let r;
 try{
  const response=await fetchImpl(url,{method:'GET',redirect:'follow',
   headers:{accept:'application/json','user-agent':'System2-M09-NativeType-Research/0.1'},
   signal:AbortSignal.timeout(26000)});
  if(!response?.ok||response.status!==200)throw Error('HTTP_'+response?.status);
  if(Number(response.headers?.get?.('content-length')||0)>RAWMAX)
   throw Error('OVERSIZE');
  const bytes=Buffer.from(await response.arrayBuffer());
  r=await probeM09TwseNativeTypeV0_1({requestedDate,rawBytes:bytes,observedAtUtc:at});
 }catch(e){
  // No data equals UNKNOWN, not equity rejection.
  const base={schemaVersion:'S2_M09_NATIVE_TWSE_TYPE_CAPABILITY_V0_1',
   classification:'SOURCE_CAPABILITY_ONLY_NO_INSTRUMENT_ADMISSION',
   state:'ORIGINAL_SOURCE_UNAVAILABLE_FAIL_CLOSED',requestedDate,observedAtUtc:at,
   sourceUrl:url,blocker:/HTTP_/.test(String(e?.message))?'SOURCE_HTTP_UNAVAILABLE':
    /OVERSIZE/.test(String(e?.message))?'SOURCE_OVERSIZE':'SOURCE_TRANSPORT_OR_SCHEMA_UNKNOWN',
   providerDate:null,originalSha256:null,explicitOrdinaryFourDigitRows:0,
   perSymbolPITSourceRowsCertified:false,separatelyIndependentlyAudited:false,
   ordinaryEquityAdmissionEnabled:false,selectedCount:null,zeroPickDay:null,
   frozenDecisionWritten:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
   system1FormalRuntimeTouched:false};
  r=Object.freeze({...base,receiptHash:await sha256Hex(base)});
 }
 return r;
}
if(process.argv[1]?.endsWith('/probe_m09_twse_native_type_readonly_v0_1.mjs')){
 const receipt=await runM09TwseNativeTypeV0_1({});
 await mkdir('/tmp/s2-m09-native-type',{recursive:true,mode:0o700});
 await writeFile('/tmp/s2-m09-native-type/receipt.json',JSON.stringify(receipt,null,2)+'\n',
  {flag:'wx',mode:0o600});
 console.log(JSON.stringify({state:receipt.state,requestedDate:receipt.requestedDate,
  providerDate:receipt.providerDate,originalBytes:receipt.originalBytes??null,
  originalSha256:receipt.originalSha256??null,tableCount:receipt.tableCount??null,
  fourDigitQuotedRowsInspected:receipt.fourDigitQuotedRowsInspected??null,
  explicitOrdinaryFourDigitRows:receipt.explicitOrdinaryFourDigitRows,
  explicitDepositaryFourDigitRows:receipt.explicitDepositaryFourDigitRows??null,
  aggregateStockAndDepositaryCategoryObserved:
   receipt.aggregateStockAndDepositaryCategoryObserved??null,
  receiptHash:receipt.receiptHash,formalClassPromotion:false}));
}
