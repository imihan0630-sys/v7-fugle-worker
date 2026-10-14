// Current TWSE ISIN/CFI source witness, not historical PIT or ordinary-share admission.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const urls={TWSE:'https://isin.twse.com.tw/isin/C_public.jsp?strMode=2',
 TPEX:'https://isin.twse.com.tw/isin/C_public.jsp?strMode=4'};
const digest=b=>createHash('sha256').update(b).digest('hex');
const norm=s=>String(s||'').normalize('NFKC').replace(/[\u3000\s]+/g,'').trim();
const cell=s=>String(s||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ')
 .replace(/&amp;/gi,'&').replace(/&#(\d+);/g,(_,c)=>String.fromCodePoint(+c))
 .replace(/[\u3000\s]+/g,' ').trim();
export function parseCurrentIsinCfiV0_1({html,market}={}){
 if(!urls[market]||typeof html!=='string'||!/ISIN|有價證券|證券編碼/i.test(html))
  throw Error('ISIN_TABLE_OR_MARKET_UNVERIFIED');
 const rows=new Map(),counts=new Map();
 for(const tr of html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)||[]){
  const td=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(x=>cell(x[1]));
  if(td.length<5)continue;
  const id=td[0].match(/^([1-9]\d{3})(?:\s|$)/);
  if(!id)continue;
  const isin=td.find(x=>/^[A-Z]{2}[A-Z0-9]{10}$/.test(x));
  const cfi=td.find(x=>/^[A-Z]{6}$/.test(x));
  if(!isin||!cfi)continue;
  const symbol=id[1],name=td[0].slice(symbol.length).trim();
  if(!name)continue;
  if(rows.has(symbol))throw Error('ISIN_DUPLICATE_SECURITY_CODE');
  rows.set(symbol,{symbol,name,isin,cfi,market});
  counts.set(cfi,(counts.get(cfi)||0)+1);
 }
 return {rows,counts:[...counts].map(([cfi,count])=>({cfi,count}))
    .sort((a,b)=>b.count-a.count||a.cfi.localeCompare(b.cfi))};
}
async function readOfficial(fetchImpl,url){
 const res=await fetchImpl(url,{method:'GET',redirect:'follow',
  headers:{accept:'text/html','user-agent':'Mozilla/5.0 System2-Current-ISIN-Research/0.1'},
  signal:AbortSignal.timeout(45000)});
 if(!res?.ok||res.status!==200)throw Error('REGISTRY_HTTP_NOT_200');
 if(Number(res.headers?.get?.('content-length')||0)>40000000)throw Error('REGISTRY_BODY_OVERSIZE');
 const b=Buffer.from(await res.arrayBuffer());
 if(b.length<1000||b.length>40000000)throw Error('REGISTRY_BODY_INVALID');
 return b;
}
export async function observeCurrentIsinCfiV0_1({watch,fetchImpl=globalThis.fetch,
 clock=()=>new Date()}={}){
 if(watch?.schemaVersion!=='S2_PRELIMINARY_PV_WATCH_V0_2'||
    watch.watchVersion!=='PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2'||
    watch.marketDate!=='2026-10-13'||watch.selectedCount!==null||
    watch.frozenWritten!==false||watch.ordinaryEquityOnlyUniverseCertified!==false||
    !Array.isArray(watch.watchlist)||watch.watchlist.length!==30)
  throw Error('ISIN_V02_WATCH_SCOPE_INVALID');
 const {receiptHash,...unsigned}=watch;
 if(!/^[a-f0-9]{64}$/.test(receiptHash||'')||
    await sha256Hex(unsigned)!==receiptHash)
  throw Error('ISIN_WATCH_HASH_MISMATCH');
 const observedAtUtc=clock().toISOString();
 if(Date.parse(observedAtUtc)<Date.parse(watch.observedAtUtc))
  throw Error('ISIN_RETROACTIVE_CLOCK_FORBIDDEN');
 const lanes=[],maps={};
 for(const market of ['TWSE','TPEX']){
  try{
   const raw=await readOfficial(fetchImpl,urls[market]);
   const parsed=parseCurrentIsinCfiV0_1({html:raw.toString('utf8'),market});
   if(parsed.rows.size<350)throw Error('REGISTRY_POSITIVE_CFI_COVERAGE_INSUFFICIENT');
   maps[market]=parsed.rows;
   lanes.push({market,state:'CURRENT_NATIVE_CFI_ROWS_OBSERVED',
    observedAtUtc,sourceUrl:urls[market],rawSha256:digest(raw),
    rawBytes:raw.length,fourDigitCfiRows:parsed.rows.size,
    currentCfiDistribution:parsed.counts.slice(0,30)});
  }catch(e){
   maps[market]=new Map();
   const m=String(e?.message||'');
   lanes.push({market,state:'CURRENT_CFI_SOURCE_UNAVAILABLE_FAIL_CLOSED',
    sourceUrl:urls[market],observedAtUtc,
    blocker:/HTTP/.test(m)?'HTTP_NOT_200':/OVERSIZE|BODY/.test(m)?'BODY_INVALID':
     /COVERAGE/.test(m)?'CFI_DENOMINATOR_INSUFFICIENT':'SOURCE_UNVERIFIED',
    rawSha256:null,fourDigitCfiRows:null});
  }
 }
 const preview=[],seen=new Set();
 for(const item of watch.watchlist){
  const k=item.market+'|'+item.symbol;
  if(seen.has(k)||!maps[item.market]||!/^[1-9]\d{3}$/.test(item.symbol||'')||
     item.strategyRank!==null||item.companyActionPitStatus!=='UNKNOWN_NOT_CLEARED')
   throw Error('ISIN_PREVIEW_IDENTITY_OR_AUTHORITY_INVALID');
  seen.add(k);
  const match=maps[item.market].get(item.symbol);
  preview.push({symbol:item.symbol,market:item.market,companyName:item.companyName,
   currentIsin:match?.isin||null,currentCfi:match?.cfi||null,
   currentNameMatch:!!match&&norm(match.name)===norm(item.companyName),
   historicalOrdinaryEquityPITCertified:false,rank:null,selectedCount:null});
 }
 const base={schemaVersion:'S2_NATIVE_CFI_PREVIEW_OBSERVATION_V0_1',
  observedAtUtc,originalMarketDate:watch.marketDate,sourceWatchHash:receiptHash,
  lanes,previewCount:preview.length,cfiMatchedCount:preview.filter(x=>x.currentCfi).length,
  exactNameMatchedCount:preview.filter(x=>x.currentNameMatch).length,preview,
  cfiToOrdinaryShareMappingCertified:false,
  historicalSecurityClassPITCertified:false,companyActionPITCertified:false,
  selectedCount:null,zeroPickDay:null,frozenWritten:false,formalRankAuthorized:false,
  officialRawHtmlPublished:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalRuntimeTouched:false};
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('probe_current_isin_cfi_readonly_v0_1.mjs')){
 try{
  const p=process.env.S2_V02_WATCH_RECEIPT;
  if(!p)throw Error('ORIGINAL_V02_RECEIPT_REQUIRED');
  const w=JSON.parse(await readFile(p,'utf8'));
  const r=await observeCurrentIsinCfiV0_1({watch:w});
  await mkdir('/tmp/s2-current-cfi',{recursive:true,mode:0o700});
  await writeFile('/tmp/s2-current-cfi/receipt.json',JSON.stringify(r,null,2)+'\n',
   {flag:'wx',mode:0o600});
  console.log(JSON.stringify({preview:r.previewCount,cfiMatched:r.cfiMatchedCount,
   nameMatched:r.exactNameMatchedCount,
   lanes:r.lanes.map(x=>({market:x.market,state:x.state,count:x.fourDigitCfiRows,
     blocker:x.blocker||null,cfiTop:x.currentCfiDistribution?.slice(0,5)||null})),
   receiptHash:r.receiptHash,formalOrdinaryEquityCertified:false}));
  if(r.lanes.some(x=>x.state!=='CURRENT_NATIVE_CFI_ROWS_OBSERVED'))process.exitCode=2;
 }catch(e){
  console.error('S2_ISIN_FAIL_CLOSED_'+String(e.message||'UNKNOWN').replace(/[^A-Z0-9_]/gi,'_').slice(0,90));
  process.exitCode=2;
 }
}
