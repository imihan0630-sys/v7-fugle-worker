// DATA_LANE only: evidence-bound, in-memory native B5 profile handoff.
// Reuses existing B2 official source parser; performs NO network GET, scoring,
// strategy, Worker, D1/R2, Frozen, selection or System1 side effects.
import { createHash } from 'node:crypto';
import {
  parseIndustryProfiles, B2_OFFICIAL_ENDPOINTS_V0_1
} from '../runtime/b2_industry_snapshot_observer.mjs';

const MARKETS=['TWSE','TPEX'];
const FOUR=/^[1-9][0-9]{3}$/;
const SHA=/^[0-9a-f]{64}$/;
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const CLOCK=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
function fail(code){throw Error('B5_DATA_'+code);}
function validDay(s){
  return typeof s==='string'&&DAY.test(s)&&
    Number.isFinite(Date.parse(s+'T00:00:00Z'))&&
    new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
}
function iso(s){
  if(typeof s!=='string'||!CLOCK.test(s)||!Number.isFinite(Date.parse(s))||
    new Date(s).toISOString().slice(0,19)!==s.slice(0,19))
    fail('CLOCK_INVALID');
  return s;
}
function hash(s){return createHash('sha256').update(s).digest('hex');}
function pick(row,keys){
 for(const key of keys){
   if(row&&row[key]!==undefined&&row[key]!==null&&
      String(row[key]).trim())return {field:key,value:String(row[key]).trim()};
 }
 return null;
}
function nativeIndustry(row){
 return pick(row,['SecuritiesIndustryCode','產業別','Industry']);
}
function symbolOf(row){
 return pick(row,['公司代號','公司代號 ','Code','SecuritiesCompanyCode'])?.value||'';
}
function checkSource(market,s,marketDate,asOfUtc){
 const endpoint=market==='TWSE'?
   B2_OFFICIAL_ENDPOINTS_V0_1.TWSE_PROFILE:B2_OFFICIAL_ENDPOINTS_V0_1.TPEX_PROFILE;
 if(!s||s.market!==market||s.sourceUrl!==endpoint||
    typeof s.rawBody!=='string'||!s.rawBody.length)
   fail('NATIVE_SOURCE_IDENTITY_INVALID');
 const seen=iso(s.observedAtUtc);
 let rows;
 try {rows=JSON.parse(s.rawBody);} catch {fail('ORIGINAL_JSON_INVALID');}
 if(!Array.isArray(rows)||rows.length===0||rows.some(x=>!x||typeof x!=='object'||Array.isArray(x)))
   fail('ORIGINAL_ROWS_INVALID');
 const parsed=parseIndustryProfiles(rows,market);
 const counts=new Map();
 const meta=new Map();
 for(const row of rows){
   const id=symbolOf(row);
   if(!FOUR.test(id))continue;
   counts.set(id,(counts.get(id)||0)+1);
   if(!meta.has(id))meta.set(id,nativeIndustry(row));
 }
 return {
   market,sourceUrl:endpoint,observedAtUtc:seen,
   originalRawBodySha256:hash(Buffer.from(s.rawBody,'utf8')),
   originalRawBodyBytes:Buffer.byteLength(s.rawBody,'utf8'),
   nativeRowCount:rows.length,
   requestedEvaluationMarketDate:marketDate,
   nativeReportedMarketDate:null,
   sourceObservedBeforeEvaluation:Date.parse(seen)<=Date.parse(asOfUtc),
   originalsProviderPublishedAtUtc:null,
   originalFirstKnownAtUtc:null,
   originalHistoricalAvailableAtUtc:null,
   currentProfileNotHistoricalMembership:true,
   parsed:parsed.profiles,counts,meta
 };
}
/**
 * Source-only B5 current-industry join against an externally supplied A1
 * instrument population. A signed A1 identity is NOT independently rehashed
 * here; all output remains SOURCE_EVIDENCE_SUBMITTED, never PIT or strategy.
 */
export function buildB5OriginalIndustrySourceHandoffV0_1({
 marketDate,evaluationAtUtc,a1SourceReceiptHash,universe,profileOriginals
}={}){
 if(!validDay(marketDate))fail('MARKET_DATE_INVALID');
 iso(evaluationAtUtc);
 if(typeof a1SourceReceiptHash!=='string'||!SHA.test(a1SourceReceiptHash))
   fail('A1_RECEIPT_HASH_INVALID');
 if(!Array.isArray(universe)||universe.length===0||
    !Array.isArray(profileOriginals)||profileOriginals.length!==2)
   fail('SCOPE_INVALID');
 const all=new Set(),perMarket={TWSE:[],TPEX:[]};
 for(const x of universe){
   if(!MARKETS.includes(x?.market)||typeof x.symbol!=='string'||!FOUR.test(x.symbol))
     fail('INSTRUMENT_ID_INVALID');
   const key=x.market+'|'+x.symbol;
   if(all.has(key))fail('DUPLICATE_UNIVERSE_INSTRUMENT');
   all.add(key);perMarket[x.market].push(x.symbol);
 }
 const sourceByMarket={};
 for(const market of MARKETS){
   const originals=profileOriginals.filter(x=>x?.market===market);
   if(originals.length!==1)fail('MISSING_OR_DUPLICATE_MARKET_ORIGINAL');
   sourceByMarket[market]=checkSource(market,originals[0],marketDate,evaluationAtUtc);
 }
 const mapping=[],summaries=[];
 for(const market of MARKETS){
   const source=sourceByMarket[market];
   let mapped=0, unknown=0, conflict=0;
   for(const symbol of perMarket[market].sort()){
     const duplicates=(source.counts.get(symbol)||0)>1;
     const row=source.parsed[symbol];
     const original=source.meta.get(symbol);
     const futureProfile=Boolean(row?.profileDate&&row.profileDate>marketDate);
     const conflicting=duplicates||futureProfile;
     const canDisplay=Boolean(row?.industry&&original)&&!conflicting;
     if(conflicting)conflict++;
     else if(canDisplay)mapped++;
     else unknown++;
     mapping.push({
       market,symbol,
       officialIndustryRawValue:canDisplay?original.value:null,
       nativeIndustryField:canDisplay?original.field:null,
       nativeProfileDate:row?.profileDate||null,
       currentIndustryState:conflicting?'PROFILE_IDENTITY_CONFLICT':
         canDisplay?'CURRENT_PROFILE_SOURCE_ONLY':'OFFICIAL_INDUSTRY_UNKNOWN',
       sourceObservedBeforeEvaluation:source.sourceObservedBeforeEvaluation,
       instrumentOrdinaryShareClassCertified:false,
       industryHistoricalEffectiveWindowCertified:false,
       nativeClassificationVersion:null,
       independentB5Audited:false,
       strategyUseAuthorized:false
     });
   }
   const denominator=perMarket[market].length;
   summaries.push({
     market,sourceUrl:source.sourceUrl,
     originalRawBodySha256:source.originalRawBodySha256,
     originalRawBodyBytes:source.originalRawBodyBytes,
     originalNativeRowCount:source.nativeRowCount,
     observedAtUtc:source.observedAtUtc,
     beforeEvaluation:source.sourceObservedBeforeEvaluation,
     a1SourceInstrumentDenominator:denominator,
     mapped,unknown,conflict,
     totalAccountsFor: mapped+unknown+conflict===denominator,
     nativeRowsNotJoinedToA1:[...source.counts.keys()].filter(x=>
       !perMarket[market].includes(x)).length,
     independentB5Audited:false,
     officialPublicationAtUtc:null,firstKnownAtUtc:null,availableAtUtc:null
   });
 }
 const base={
   schemaVersion:'S2_DATA_B5_ORIGINAL_SOURCE_SCOPE_V0_1',
   marketDate,evaluationAtUtc,a1SourceReceiptHash,
   a1UniverseIndependentVerifiedByThisFunction:false,
   sourceScope:'PROSPECTIVE_CURRENT_PROFILE_ONLY',
   officialB5FullMarketIndependentAccepted:false,
   certifiedOrdinaryShareDenominator:null,
   originalHistoricalB5EffectiveWindowAccepted:false,
   originalSourceAuditState:'PENDING_INDEPENDENT_AUDIT',
   mappedInstrumentCount:summaries.reduce((a,b)=>a+b.mapped,0),
   unknownInstrumentCount:summaries.reduce((a,b)=>a+b.unknown,0),
   conflictInstrumentCount:summaries.reduce((a,b)=>a+b.conflict,0),
   sourceLateAtEvaluation:summaries.some(x=>!x.beforeEvaluation),
   summaries,mapping,
   independentPITAccepted:false,selectedCount:null,zeroPickDay:null,
   frozenD1Written:false,selectionAuthorized:false
 };
 return Object.freeze({...base,receiptHash:hash(JSON.stringify(base))});
}
