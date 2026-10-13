// System2 #1132: bounded, current-time official company-profile source probe.
// Observation of a live master DOES NOT certify historic identity or trading strategy.
// No public raw master body, no credential, Cloudflare, order, selection or Frozen.
import {createHash} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
const SOURCES=Object.freeze({
 TWSE:'https://openapi.twse.com.tw/v1/opendata/t187ap03_L',
 TPEX:'https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap03_O',
});
const sha=x=>createHash('sha256').update(x).digest('hex');
const fields={
 TWSE:['公司代號','公司名稱','公司簡稱'],
 TPEX:['SecuritiesCompanyCode','Company Code','CompanyCode','公司代號','Securities Code','公司代碼','SecuritiesCode','Company Abbreviation','Company Name']
};
const keys=Object.freeze({TWSE:['公司代號','公司代碼','SecuritiesCompanyCode','Company Code','CompanyCode'],
 TPEX:['SecuritiesCompanyCode','Company Code','CompanyCode','公司代號','公司代碼','Securities Code','SecuritiesCode']});
const names=Object.freeze({TWSE:['公司簡稱','公司名稱','Company Name','Company Abbreviation'],
 TPEX:['Company Abbreviation','Company Name','公司簡稱','公司名稱','CompanyName','CompanyShortName']});
function requireResponse(r){
 if(r?.ok!==true||r.status!==200)throw Error('OFFICIAL_MASTER_HTTP_NOT_200');
}
export async function probeOfficialCompanyMastersV0_1({
 fetchImpl=globalThis.fetch,clock=()=>new Date()
}={}){
 if(typeof fetchImpl!=='function'||typeof clock!=='function')throw Error('PROBE_IO_INVALID');
 const observedAtUtc=clock().toISOString(),lanes=[];
 for(const market of ['TWSE','TPEX']){
  const url=SOURCES[market];const lane={market,url,observedAtUtc,
    marketDate:'OBSERVED_NOW_NOT_HISTORICAL_PIT',
    sourceType:'ISSUER_COMPANY_PROFILE_NOT_EXCHANGE_SECURITIES_TYPE_FINAL',
    rawBodyPublished:false,historicalPITCertified:false};
  try{
   const response=await fetchImpl(url,{
    method:'GET',headers:{accept:'application/json',
      'user-agent':'System2-Official-Master-ReadOnly/0.1'},
    signal:AbortSignal.timeout(30000)
   });
   requireResponse(response);
   if(Number(response.headers?.get?.('content-length')||0)>8_000_000)
     throw Error('PROBE_BODY_TOO_LARGE');
   const raw=Buffer.from(await response.arrayBuffer());
   if(raw.length<500||raw.length>8_000_000)throw Error('PROBE_BODY_BOUNDS_INVALID');
   const payload=JSON.parse(raw.toString('utf8'));
   if(!Array.isArray(payload)||payload.length<500)
     throw Error('PROBE_OFFICIAL_COMPANY_ROWS_TOO_FEW');
   const first=payload[0];
   if(!first||typeof first!=='object'||Array.isArray(first))
     throw Error('PROBE_COMPANY_ENTRY_INVALID');
   const actualKeys=Object.keys(first);
   const codeKey=keys[market].find(k=>actualKeys.includes(k))||null;
   const nameKey=names[market].find(k=>actualKeys.includes(k))||null;
   if(!codeKey||!nameKey)throw Error('PROBE_COMPANY_KEY_SCHEMA_UNRECOGNIZED');
   const codes=new Set();let invalid=0;
   for(const entry of payload){
    const code=String(entry?.[codeKey]??'').trim();
    const name=String(entry?.[nameKey]??'').trim();
    if(!/^[1-9]\d{3}$/.test(code)||name.length===0){invalid++;continue;}
    if(codes.has(code))throw Error('PROBE_DUPLICATED_OFFICIAL_COMPANY_CODE');
    codes.add(code);
   }
   if(codes.size<450)throw Error('PROBE_INSUFFICIENT_COMMON_COMPANY_IDENTITY');
   lanes.push({...lane,state:'OFFICIAL_COMPANY_PROFILE_CURRENT_SOURCE_CONFIRMED',
     rowCount:payload.length,fourDigitCompanyCount:codes.size,
     malformedOrNonFourDigitRows:invalid,
     sampleFields:actualKeys.sort(),
     codeField:codeKey,nameField:nameKey,
     rawBytes:raw.length,rawResponseSha256:sha(raw),
     independentOrdinaryEquitySecurityClassCertified:false});
  }catch(e){
   const msg=String(e?.message||'');
   const reason=/HTTP/.test(msg)?'PROVIDER_HTTP_NOT_200':
    /SCHEMA_UNRECOGNIZED/.test(msg)?'PROVIDER_FIELD_SCHEMA_UNRECOGNIZED':
    /TOO_FEW|INSUFFICIENT/.test(msg)?'PROVIDER_COMPANY_DENOMINATOR_TOO_SMALL':
    /BOUNDS|TOO_LARGE/.test(msg)?'PROVIDER_RESPONSE_SIZE_INVALID':
    /DUPLICATED/.test(msg)?'PROVIDER_DUPLICATE_CODES':
    'PROVIDER_TRANSPORT_OR_RESPONSE_PARSE_FAILURE';
   lanes.push({...lane,state:'OFFICIAL_COMPANY_PROFILE_NOT_CONFIRMED',reason,
     rowCount:null,fourDigitCompanyCount:null,rawResponseSha256:null,
     independentOrdinaryEquitySecurityClassCertified:false});
  }
 }
 const all=lanes.every(x=>x.state==='OFFICIAL_COMPANY_PROFILE_CURRENT_SOURCE_CONFIRMED');
 const result={schemaVersion:'S2_OFFICIAL_COMPANY_MASTER_CURRENT_READONLY_PROBE_V0_1',
  observedAtUtc,allCurrentCompanyProfilesObserved:all,
  officialCompanyProfileLanesReady:lanes.filter(x=>x.state.includes('SOURCE_CONFIRMED')).length,
  expectedLanes:2,lanes,
  isFinalSecurityMaster:false,ordinaryEquityClassCertified:false,
  noHistoricAvailableAtBackfill:true,noFinalSelectionOrRank:true,
  selectedCount:null,certifiedZeroPick:null,frozenWritten:false,
  publicOriginalDataRetained:false,system1FormalTouched:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0};
 result.receiptSha256=sha(JSON.stringify(result));
 return Object.freeze(result);
}
if(process.argv[1]?.endsWith('/probe_official_company_masters_readonly_v0_1.mjs')){
 const result=await probeOfficialCompanyMastersV0_1();
 await mkdir('/tmp/s2-official-company-master-probe',{recursive:true,mode:0o700});
 await writeFile('/tmp/s2-official-company-master-probe/receipt.json',
  JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({observedAtUtc:result.observedAtUtc,
  profileSourcesReady:result.officialCompanyProfileLanesReady,
  lanes:result.lanes.map(x=>({market:x.market,state:x.state,rowCount:x.rowCount,
   companies:x.fourDigitCompanyCount,reason:x.reason||null,
   fields:x.sampleFields||[],hash:x.rawResponseSha256||null})),
  ordinaryEquityClassCertified:false,selectionAuthorized:false,
  receiptHash:result.receiptSha256}));
 if(!result.allCurrentCompanyProfilesObserved)process.exitCode=2;
}
