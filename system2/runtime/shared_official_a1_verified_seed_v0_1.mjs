// Shared TWSE/TPEx official A1 original-blob replay: same repo, source-only.
// Accept only an already-known verified original provider receipt+raw hash.
// Never reinterpret a late downloaded vintage as publication-time PIT proof.
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {buildOfficialHistoricalA1UrlV0_1,parseOfficialHistoricalA1PayloadV0_1}
 from './official_historical_a1_source_v0_1.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const ISO=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const ID=/^[a-f0-9]{64}$/i;
function text(v){return typeof v==='string'&&v.length>0;}
export async function loadTrustedOfficialA1OriginalsV0_1({
 evidenceFile,originalDir,neededTradingDates,now=()=>new Date(),
 read=readFile
}={}){
 if(!text(evidenceFile)||!text(originalDir)||
   !Array.isArray(neededTradingDates)||neededTradingDates.length!==61||
   new Set(neededTradingDates).size!==61||
   neededTradingDates.some((x,i)=>!DAY.test(x)||i>0&&x<=neededTradingDates[i-1]))
  throw Error('SEED_SOURCE_OR_TARGET_DATES_INVALID');
 const saved=JSON.parse(await read(evidenceFile,'utf8'));
 if(saved?.schemaVersion!=='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'||
    !Array.isArray(saved.receipts)||!Array.isArray(saved.calendar?.tradingDates))
   throw Error('SEED_ORIGINAL_RECEIPT_SCHEMA_UNVERIFIED');
 const used=new Set(),found=new Map(),needed=new Set(neededTradingDates);
 for(const r of saved.receipts){
  if(!['TWSE','TPEX'].includes(r?.market)||!DAY.test(r.marketDate||'')||
     !ID.test(r.originalRawResponseSha256||'')||
     !ISO.test(r.capturedAt||'')||!Number.isFinite(Date.parse(r.capturedAt))||
     Date.parse(r.capturedAt)>now().getTime())
   throw Error('SEED_SOURCE_RECEIPT_IDENTITY_INVALID');
  const key=r.market+'|'+r.marketDate;
  if(used.has(key))throw Error('SEED_SOURCE_DUPLICATE_DATE_MARKET');
  used.add(key);
  if(!needed.has(r.marketDate))continue;
  const canonical=buildOfficialHistoricalA1UrlV0_1(r.market,r.marketDate);
  if(r.sourceUrl!==canonical)throw Error('SEED_NONCANONICAL_OFFICIAL_ENDPOINT');
  // Path assembled ONLY from validated market/date, not a downloaded path.
  const compressed=await read(join(resolve(originalDir),r.market+'-'+r.marketDate+'.json.gz'));
  const raw=gunzipSync(compressed);
  if(hash(raw)!==r.originalRawResponseSha256||
     raw.byteLength!==r.originalRawResponseBytes)
   throw Error('SEED_ORIGINAL_BYTES_OR_SIZE_HASH_MISMATCH');
  const parsed=parseOfficialHistoricalA1PayloadV0_1({
   market:r.market,marketDate:r.marketDate,observedAt:r.capturedAt,
   payload:JSON.parse(raw.toString('utf8')),sourceUrl:canonical,
  });
  if(parsed.state!=='READY'||parsed.rows.length!==r.rowCount||
     parsed.rows.length<(r.market==='TWSE'?600:450)||
     parsed.rows.some(row=>row.marketDate!==r.marketDate))
   throw Error('SEED_ORIGINAL_PROVIDER_DATA_SEMANTIC_MISMATCH');
  found.set(canonical,Object.freeze({
   market:r.market,date:r.marketDate,sha256:r.originalRawResponseSha256,
   observedAt:r.capturedAt,sourceUrl:canonical,raw
  }));
 }
 return Object.freeze({
  storedOriginals:found,
  trustedReusedOriginalCount:found.size,
  neededPairCount:neededTradingDates.length*2,
  missingPairs:neededTradingDates.flatMap(date=>['TWSE','TPEX'].filter(m=>
   !found.has(buildOfficialHistoricalA1UrlV0_1(m,date)))
    .map(market=>Object.freeze({market,date}))),
  seedSourceReceiptHash:saved.receiptHash||null,
  originalObservationRetained:true,
  pitPublicationTimeCertified:false,
  expiryAndLongTermStorageNotEstablished:true,
 });
}
export function createSourceCacheFetchV0_1(cache,physicalFetch){
 if(!(cache?.storedOriginals instanceof Map)||typeof physicalFetch!=='function')
   throw Error('OFFICIAL_SOURCE_CACHE_FETCH_SHAPE_INVALID');
 return async function fetchOfficialMaybeCache(url,options={}){
  if(options?.method!=='GET')throw Error('OFFICIAL_SOURCE_GET_ONLY');
  const match=cache.storedOriginals.get(String(url));
  if(!match)return physicalFetch(url,options);
  return new Response(match.raw,{status:200,headers:{
   'content-type':'application/json','x-source-cache-replayed':'verified-hash'
  }});
 };
}
