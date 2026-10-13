import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const def={
 TWSE:{url:'https://openapi.twse.com.tw/v1/opendata/t187ap03_L',code:'公司代號',name:'公司簡稱'},
 TPEX:{url:'https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap03_O',code:'SecuritiesCompanyCode',name:'CompanyAbbreviation'}
};
const digest=b=>createHash('sha256').update(b).digest('hex');
const clean=x=>String(x||'').normalize('NFKC').trim().replace(/\s+/g,'');
function deny(s){throw Error('S2_CURRENT_COMPANY_MATCH_'+s);}
async function lookup(market,fetchImpl,at){
 const x=def[market];const r=await fetchImpl(x.url,{method:'GET',
  headers:{accept:'application/json','user-agent':'System2-Current-Company-Match/0.1'},
  signal:AbortSignal.timeout(30000)});
 if(!r?.ok||r.status!==200)deny('PROVIDER_NOT_READY_'+market);
 if(Number(r.headers?.get?.('content-length')||0)>8000000)deny('TOO_LARGE_'+market);
 const b=Buffer.from(await r.arrayBuffer());
 if(b.length<500||b.length>8000000)deny('PROVIDER_BODY_'+market);
 const data=JSON.parse(b.toString('utf8'));
 if(!Array.isArray(data)||data.length<500||!(x.code in data[0])||!(x.name in data[0]))
  deny('UNRECOGNIZED_COMPANY_SCHEMA_'+market);
 const m=new Map();
 for(const v of data){
  const k=String(v[x.code]||'').trim();
  if(!/^[1-9]\d{3}$/.test(k))continue;
  if(m.has(k))deny('DUPLICATE_'+market);
  m.set(k,clean(v[x.name]));
 }
 if(m.size<450)deny('COMPANY_COUNT_TOO_SMALL_'+market);
 return {entries:m,evidence:{market,source:x.url,rawSha256:digest(b),size:m.size,observedAtUtc:at}};
}
export async function reconcileRealV02CompanyPreviewV0_1({
 watch,fetchImpl=globalThis.fetch,clock=()=>new Date()
}={}){
 if(watch?.schemaVersion!=='S2_PRELIMINARY_PV_WATCH_V0_2'||
  watch.watchVersion!=='PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2'||
  watch.marketDate!=='2026-10-13'||watch.selectedCount!==null||
  watch.frozenWritten!==false||watch.ordinaryEquityOnlyUniverseCertified!==false||
  !Array.isArray(watch.watchlist)||watch.watchlist.length!==watch.displayedCount||
  watch.watchlist.length!==30||!/^[a-f0-9]{64}$/.test(watch.receiptHash||''))
  deny('ORIGINAL_V02_NOT_VERIFIED');
 const {receiptHash,...plain}=watch;
 if(await sha256Hex(plain)!==receiptHash)deny('TAMPERED_PRELIMINARY_HASH');
 const now=clock().toISOString();
 if(Date.parse(now)<Date.parse(watch.observedAtUtc))deny('CURRENT_ISSUER_CLOCK_BACKDATED');
 const [twse,tpex]=await Promise.all(['TWSE','TPEX'].map(m=>lookup(m,fetchImpl,now)));
 const maps={TWSE:twse.entries,TPEX:tpex.entries};let exact=0,codeOnly=0,missing=0;
 const checked=[],seen=new Set();
 for(const item of watch.watchlist){
  const key=item.market+'|'+item.symbol;
  if(!maps[item.market]||seen.has(key)||!/^[1-9]\d{3}$/.test(item.symbol||'')||
    item.strategyRank!==null||item.companyActionPitStatus!=='UNKNOWN_NOT_CLEARED')
   deny('PREVIEW_ROW_INVALID');
  seen.add(key);
  const n=maps[item.market].get(item.symbol);
  const status=n===undefined?'COMPANY_NOT_FOUND':
    n===clean(item.companyName)?'ISSUER_CODE_NAME_MATCH':'COMPANY_CODE_ONLY_NAME_DIFFERS';
  if(status==='ISSUER_CODE_NAME_MATCH')exact++;
  else if(status==='COMPANY_CODE_ONLY_NAME_DIFFERS')codeOnly++;
  else missing++;
  checked.push({symbol:item.symbol,companyName:item.companyName,market:item.market,
    issuerCurrentStatus:status,fiveSessionReturnPct:item.fiveSessionReturnPct,
    ordinaryEquityInstrumentCertified:false,formalRank:null,selectedCount:null});
 }
 const s={schemaVersion:'S2_REAL_V02_ISSUER_IDENTITY_READBACK_V0_1',
  sourceV02Sha256:watch.receiptHash,originalMarketDate:watch.marketDate,
  observedAtUtc:now,inspectedPreviewRows:checked.length,
  exactCodeAndNameCount:exact,codeOnlyNameMismatchCount:codeOnly,
  issuerNotFoundCount:missing,officialCurrentIssuerSources:[twse.evidence,tpex.evidence],
  currentIssuerClassOnly:true,ordinaryEquityClassCertified:false,
  historicalCompanyActionPITCertified:false,formalSelectionAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenDecisionWritten:false,
  originalV02NotRewritten:true,system1FormalTouched:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,preview:checked};
 return {...s,receiptHash:await sha256Hex(s)};
}
if(process.argv[1]?.endsWith('/reconcile_real_v02_current_company_once_v0_1.mjs')){
 const p=process.env.S2_V02_ORIGINAL_RECEIPT;
 if(!p)deny('MISSING_ARTIFACT');
 const r=await reconcileRealV02CompanyPreviewV0_1({
  watch:JSON.parse(await readFile(p,'utf8'))});
 await mkdir('/tmp/s2-real-company-match',{recursive:true,mode:0o700});
 await writeFile('/tmp/s2-real-company-match/receipt.json',JSON.stringify(r,null,2)+'\n',
  {flag:'wx',mode:0o600});
 console.log(JSON.stringify({preview:r.inspectedPreviewRows,exact:r.exactCodeAndNameCount,
  codeOnly:r.codeOnlyNameMismatchCount,missing:r.issuerNotFoundCount,
  hash:r.receiptHash,ordinaryEquityCertified:false}));
}
