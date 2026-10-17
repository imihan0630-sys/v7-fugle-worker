// System 2 DATA_LANE #1068. Reuse immutable GitHub provider originals ONLY.
// Native 3287 dividend is positive source evidence, NEVER audited CA NO_EVENT,
// fully adjusted strategy factor, PIT-A, or Frozen. No provider GETs/Cloudflare.
import {createHash} from 'node:crypto';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
const H=/^[0-9a-f]{64}$/;
const sha=b=>createHash('sha256').update(b).digest('hex');
const deny=s=>{throw new Error('S2_3287_KNOWN_CA_'+s)};
const num=x=>{
 if(typeof x!=='string'&&!Number.isFinite(x))deny('NON_NUMERIC');
 const n=Number(String(x).replace(/,/g,''));
 if(!Number.isFinite(n))deny('NON_NUMERIC');
 return n;
};
export function verify3287NativeDividendBoundary({before,after,caRow,cut='2026-10-16T15:45:00.000Z',caObserved='2026-10-16T13:48:52.509Z',todayObserved='2026-10-16T16:44:22.393Z'}={}){
 const fields=['115/08/26','3287'];
 if(!Array.isArray(caRow)||caRow[0]!==fields[0]||caRow[1]!==fields[1]||
  !String(caRow[2]||'').trim().includes('廣寰科')||
  num(caRow[3])!==39||num(caRow[4])!==37.5||
  num(caRow[6])!==1.5||caRow[8]!=='除息'||
  num(caRow[13])!==1.5)deny('OFFICIAL_CA_POSITIVE_MISMATCH');
 if(!before||!after||before.date!=='2026-08-25'||after.date!=='2026-08-26'||
    before.symbol!=='3287'||after.symbol!=='3287'||
    num(before.close)!==39||num(before.nextDayReference)!==37.5||
    num(after.close)!==37||after.nativeChangeLabel.trim()!=='除息')
  deny('ORIGINAL_NATIVE_DAILY_CROSSWALK_MISMATCH');
 if(!Number.isFinite(Date.parse(cut))||!Number.isFinite(Date.parse(caObserved))||
  !Number.isFinite(Date.parse(todayObserved))||
  Date.parse(caObserved)>Date.parse(cut)||Date.parse(todayObserved)<=Date.parse(cut))
  deny('FALSE_ASOF_CLOCK_OR_BACKDATE');
 const originalRawReturnPct=100*(num(after.close)/num(before.close)-1);
 const officialReferenceReturnPct=100*(num(after.close)/num(caRow[4])-1);
 const candidateReferenceRatio=num(caRow[4])/num(before.close);
 return {
  symbol:'3287',market:'TPEX',knownEventDate:'2026-08-26',
  cashDividendPerShare:1.5,previousOfficialClose:39,
  exchangeOfficialExDividendReference:37.5,actualExDateClose:37,
  referenceSupportedByPriorSessionNative:true,
  exDividendLabelSupportedByCurrentSessionNative:true,
  originalRawReturnPct,officialReferenceReturnPct,candidateReferenceRatio,
  candidateAdjustmentFormulaApproved:false,
  authoritativeOtherActionsExcluded:false,
  full61AdjustedPricesCertified:false,
  currentPitaFullUsedInputCertified:false,
  onlyKnownPositiveEventCrosswalk:true
 };
}

// This is DATA source-price-window exposure only. BUILD owns the actual
// SHORT_MOMENTUM 7-factor manifest, scoring, exclusions and admission gates.
// Absence of this ONE known CA crossing is NOT proof of no other CA event.
const nativeMetricSourceWindowsV0_1=Object.freeze([
 ['ma5','LAST_5_INCLUDING_T','PRICE'],
 ['ma10','LAST_10_INCLUDING_T','PRICE'],
 ['ma20','LAST_20_INCLUDING_T','PRICE'],
 ['ma60','LAST_60_INCLUDING_T','PRICE'],
 ['ma20Slope1Pct','LAST_21_INCLUDING_T','PRICE'],
 ['ret20','T_VS_20_PRIOR','PRICE'],
 ['ret60','T_VS_60_PRIOR','PRICE'],
 ['priorHigh20','PRIOR_20_EXCLUDING_T','PRICE'],
 ['priorHigh60','PRIOR_60_EXCLUDING_T','PRICE'],
 ['priorLow20','PRIOR_20_EXCLUDING_T','PRICE'],
 ['atr14Pct','LAST_15_INCLUDING_T','PRICE'],
 ['volatility20','LAST_21_INCLUDING_T','PRICE'],
 ['distanceToMa20','LAST_20_INCLUDING_T','PRICE'],
 ['distanceToPriorHigh20','LAST_21_INCLUDING_T','PRICE'],
 ['currentCandleShape','T_DAY_ONLY','PRICE'],
 ['currentVolumeShares','T_DAY_ONLY','VOLUME'],
 ['avgVolume20PriorLots','PRIOR_20_EXCLUDING_T','VOLUME'],
 ['relativeVolume20Prior','LAST_21_INCLUDING_T','VOLUME'],
 ['avgAmount20Prior','PRIOR_20_EXCLUDING_T','MONETARY_TURNOVER']
]);
const validDay=d=>typeof d==='string'&&/^\d{4}-\d\d-\d\d$/.test(d)&&
 Number.isFinite(Date.parse(d+'T00:00:00Z'))&&
 new Date(Date.parse(d+'T00:00:00Z')).toISOString().slice(0,10)===d;
const indices=(kind,n)=>{
 if(kind==='T_DAY_ONLY')return [n-1,n-1];
 const m=/^LAST_(5|10|15|20|21|60)_INCLUDING_T$/.exec(kind);
 if(m)return [n-Number(m[1]),n-1];
 const p=/^PRIOR_(20|60)_EXCLUDING_T$/.exec(kind);
 if(p)return [n-1-Number(p[1]),n-2];
 if(kind==='T_VS_20_PRIOR')return [n-21,n-1];
 if(kind==='T_VS_60_PRIOR')return [n-61,n-1];
 deny('UNKNOWN_METRIC_SOURCE_WINDOW');
};
// Only date boundaries/identities are classified. No adjusted OHLC, technical
// indicator, strategy score, sector ranking or authoritative CA NO_EVENT.
export function classify3287KnownExdivWindowExposureV0_1({dates,
 knownEventDate='2026-08-26',priorSession='2026-08-25'}={}){
 if(!Array.isArray(dates)||dates.length!==61||
   dates[0]!=='2026-07-21'||dates.at(-1)!=='2026-10-16'||
   dates.some((d,i)=>!validDay(d)||(i>0&&d<=dates[i-1]))||
   new Set(dates).size!==61)
    deny('SOURCE_DATE_WINDOW_NOT_AN_ORIGINAL_61_SESSION_CALENDAR');
 const prior=dates.indexOf(priorSession),event=dates.indexOf(knownEventDate);
 if(prior<0||event!==prior+1||priorSession!== '2026-08-25'||
    knownEventDate!=='2026-08-26')
   deny('NATIVE_EXDIV_EVENT_NOT_CONSECUTIVE_SESSIONS');
 const metrics=nativeMetricSourceWindowsV0_1.map(([id,kind,sourceKind])=>{
   const [start,end]=indices(kind,dates.length);
   if(start<0||end>=dates.length||start>end)deny('METRIC_WINDOW_OOB');
   const crosses=sourceKind==='PRICE'&&start<=prior&&end>=event;
   return {
     metricId:id,sourceKind,sourceWindowKind:kind,
     firstDate:dates[start],lastDate:dates[end],
     startIndex:start,endIndex:end,
     crossesKnownNativeExdivPriceBoundary:crosses,
     risk:crosses?'KNOWN_POSITIVE_EXDIV_CROSSES_RAW_PRICE_SPACE__REQUIRES_APPROVED_CONTINUITY':
      sourceKind==='PRICE'?'NOT_CROSSING_THIS_KNOWN_EVENT__OTHER_CA_STILL_UNKNOWN':
      'NON_PRICE_NATIVE_INPUT__OTHER_SOURCE_PIT_STILL_UNKNOWN',
     allRelevantCorporateActionsIndependentlyExcluded:false,
     fullFeaturePriceContinuityAudited:false
   };
 });
 return {
  sourceWindowDefinition:'DATA_DIAGNOSTIC_INPUT_METRIC_WINDOWS_NOT_STRATEGY_FACTOR_SCORE',
  knownEventDate,priorEventSession:priorSession,knownEventIndex:event,
  priorEventIndex:prior,postEventTradingSessionCount:dates.length-1-event,
  metricSourceWindows:metrics,
  priceMetricsCrossingKnownExdiv:metrics.filter(m=>m.crossesKnownNativeExdivPriceBoundary).map(m=>m.metricId),
  cannotInferNoOtherCorporateAction:true,
  fullPitaFactorAuditAccepted:false,
  strategyScoringAuthorized:false
 };
}

const datesFrom=x=>x?.calendar?.tradingDates;
export async function verify3287RealArchivedSources({a1Dir,caDir,read=readFile}={}){
 if(!a1Dir||!caDir)deny('MISSING_ORIGINAL_ARTIFACT_DIR');
 const a1=JSON.parse(await read(resolve(a1Dir,'official-61-2026-10-16.json'),'utf8'));
 const ca=JSON.parse(await read(resolve(caDir,'source-original-six-ca.json'),'utf8'));
 const outer=JSON.parse(await read(resolve(caDir,'pita-ca-sourceonly-receipt.json'),'utf8'));
 const dates=datesFrom(a1);
 if(a1.marketDate!=='2026-10-16'||!Array.isArray(dates)||dates.length!==61||
  dates[0]!=='2026-07-21'||dates.at(-1)!=='2026-10-16'||
  new Set(dates).size!==61||dates.some((d,i)=>i>0&&d<=dates[i-1])||
  a1.receivedMarketDateCount!==122||!H.test(a1.receiptHash||'')||
  ca.schemaVersion!=='S2_M09_SIX_CA_NATIVE_ORIGINAL_SOURCE_RECEIPT_V0_1'||
  ca.requestedStartDate!=='2026-07-21'||ca.requestedEndDate!=='2026-10-16'||
  !Array.isArray(ca.sourceReceipts)||ca.sourceReceipts.length!==6||
  outer.exactSignedSixCAReceiptHash!==ca.receiptHash||
  ca.noEventMayBeClaimed!==false||ca.sourceContractCoverageComplete!==false||
  ca.entireRangeCorrectionAndCancellationCoverageCertified!==false)
  deny('SOURCE_RECEIPT_OR_CALENDAR_INVALID');
 const byDay=new Map(a1.receipts.filter(x=>x.market==='TPEX').map(x=>[x.marketDate,x]));
 if(byDay.size!==61||!a1.bySymbol?.['TPEX|3287']||
   a1.bySymbol['TPEX|3287'].bars.length!==61)deny('MISSING_NATIVE_TPEX_61');
 const symbols=a1.bySymbol['TPEX|3287'].bars;
 const originalBodies=[],originalRows=[];
 let before=null,after=null,todayObserved=null;
 for(let i=0;i<61;i++){
  const d=dates[i],receipt=byDay.get(d),bar=symbols[i];
  const raw=gunzipSync(await read(resolve(a1Dir,'original-json',`TPEX-${d}.json.gz`)),{maxOutputLength:9_000_000});
  if(!receipt||!H.test(receipt.originalRawResponseSha256||'')||
   sha(raw)!==receipt.originalRawResponseSha256||raw.length!==receipt.originalRawResponseBytes||
   !receipt.capturedAt||bar.date!==d||bar.market!=='TPEX'||bar.symbol!=='3287'||
   bar.sourceOriginalResponseSha256!==sha(raw)||bar.firstKnownAt!==receipt.capturedAt)
   deny('A1_ORIGINAL_SHA_OR_CLOCK_MISMATCH');
  const q=JSON.parse(raw.toString('utf8'));
  if(q.date!==d.replaceAll('-','')||q.stat!=='ok'||!Array.isArray(q.tables)||
    q.tables.length<1)deny('A1_NATIVE_DATE_OR_TABLE_INVALID');
  // Official TPEx daily response holds 上櫃股票行情 + 管理股票. Only the
  // former is the normal-stock source table, and its identity is explicit.
  const candidates=q.tables.filter(t=>t.title==='上櫃股票行情'&&Array.isArray(t.fields)&&
    t.fields.includes('代號')&&t.fields.includes('次日 參考價'));
  if(candidates.length!==1)deny('A1_NATIVE_STANDARD_EQUITY_TABLE_NOT_UNIQUE');
  const tab=candidates[0], f=tab.fields;
  const n=(field,r)=>r[f.indexOf(field)];
  if(!Array.isArray(f)||f.indexOf('代號')<0||f.indexOf('次日 參考價')<0)
   deny('A1_NATIVE_FIELDS_MISSING');
  const rows=tab.data.filter(r=>String(n('代號',r)).trim()==='3287');
  if(rows.length!==1)deny('A1_ISSUER_ROW_NOT_UNIQUE');
  const row=rows[0],parts={
   date:d,symbol:'3287',close:n('收盤',row),
   nextDayReference:n('次日 參考價',row),nativeChangeLabel:String(n('漲跌',row))
  };
  for(const [field,key] of [['收盤','close'],['開盤','open'],['最高','high'],
   ['最低','low'],['成交股數','volumeShares'],['成交金額(元)','tradeValue'],
   ['成交筆數','transactions']])
   if(num(n(field,row))!==bar[key])deny('NATIVE_ISSUER_ROW_NOT_MATCHING_BAR');
  originalBodies.push(sha(raw));originalRows.push(bar.sourceRowHash);
  if(d==='2026-08-25')before=parts;
  if(d==='2026-08-26')after=parts;
  if(d==='2026-10-16')todayObserved=receipt.capturedAt;
 }
 const familyIds=[
 'TWSE_EX_RIGHT_DIVIDEND_ACTUAL','TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE','TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE','TPEX_PAR_VALUE_CHANGE_REFERENCE'
 ];
 let positive=[],nativeCAFamilyHashes=[];
 for(const id of familyIds){
  const r=ca.sourceReceipts.find(x=>x.sourceId===id);
  if(!r||!H.test(r.originalSha256||'')||!r.capturedAtUtc||
    Date.parse(r.capturedAtUtc)>=Date.parse('2026-10-16T15:45:00.000Z')||
    !r.originalBytesReadBackLocally||
    r.effectiveVintageRevisionRetractionCoverageVerified!==false)
   deny('CA_SOURCE_ID_CLOCK_OR_AUTHORITY');
  const body=gunzipSync(await read(resolve(caDir,`${id}-2026-10-16.json.gz`)),{maxOutputLength:9_000_000});
  if(sha(body)!==r.originalSha256||body.length!==r.originalBytes)
   deny('CA_NATIVE_BODY_SHA_INVALID');
  nativeCAFamilyHashes.push({sourceId:id,nativeBodySha256:sha(body),observedAtUtc:r.capturedAtUtc});
  const q=JSON.parse(body.toString('utf8')),t=id.startsWith('TPEX_')?q.tables?.[0]:q;
  const index=t?.fields?.findIndex(x=>['股票代號','證券代號','代號'].includes(String(x).trim()));
  if(index===undefined||index<0||!Array.isArray(t.data))deny('CA_NATIVE_ISSUER_FIELD_MISSING');
  const matches=t.data.filter(row=>String(row[index]).trim()==='3287');
  if(id==='TPEX_EX_RIGHT_DIVIDEND_ACTUAL')positive=matches;
  // Other families with zero current rows are NOT authoritative negative NO_EVENT.
 }
 if(positive.length!==1)deny('3287_EX_DIVIDEND_POSITIVE_NOT_UNIQUE');
 const event=verify3287NativeDividendBoundary({
  before,after,caRow:positive[0],caObserved:nativeCAFamilyHashes[3].observedAtUtc,todayObserved});
 const eventWindowExposure=classify3287KnownExdivWindowExposureV0_1({dates});
 const base={
  schemaVersion:'S2_DATA_3287_EX_DIV_20260826_SOURCE_CROSSWALK_V0_1',
  symbol:'3287',market:'TPEX',marketDate:'2026-10-16',
  a1SourceRunId:38934081985,a1OriginalArtifactId:12060640574,
  a1SourceReceiptHash:a1.receiptHash,allTpexOriginalRowsChecked:61,
  tpexOriginalBodyHashListSha256:sha(JSON.stringify(originalBodies)),
  tpexSourceBarRowHashListSha256:sha(JSON.stringify(originalRows)),
  sixCaOriginalRunId:38910741802,sixCaOriginalArtifactId:12050321595,
  sixCaNativeReceiptHash:ca.receiptHash,sixCaProducerReceiptHash:outer.receiptHash,
  sixNativeCAFamiliesByteRehashed:6,nativeCAFamilyHashes,
  officialExDividendNativeRowPosition:230,
  exDividendSourceRowSnapshot:positive[0],event,eventWindowExposure,
  firstNativeCaObservedAtUtc:nativeCAFamilyHashes[3].observedAtUtc,
  actualTMarketBarObservedAtUtc:todayObserved,
  originalResearchDecisionCutAtUtc:'2026-10-16T15:45:00.000Z',
  originalDecisionCutMissed:true,
  fullPitaAccepted:false,independentPitaAuditAccepted:false,
  issuerNativeTradeabilityCertified:false,authoritativeOtherActionsExcluded:false,
  currentSourceAsOfOriginalPublicationOnEventDateProven:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  externalOfficialProviderGets:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false
 };
 return {...base,receiptHash:sha(JSON.stringify(base))};
}
if(process.argv[1]?.endsWith('issue1068_pita_3287_known_native_ca_crosswalk_v0_1.mjs')){
 const [a1Dir,caDir,outDir]=process.argv.slice(2);
 const x=await verify3287RealArchivedSources({a1Dir,caDir});
 if(!outDir)deny('OUTPUT_DIR_REQUIRED');
 await mkdir(outDir,{recursive:true});
 await writeFile(resolve(outDir,'3287-native-exdiv-sourceonly.json'),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({symbol:x.symbol,eventDate:x.event.knownEventDate,
  sixCaSources:x.sixNativeCAFamiliesByteRehashed,realBars:x.allTpexOriginalRowsChecked,
  previousClose:x.event.previousOfficialClose,exReference:x.event.exchangeOfficialExDividendReference,
  rawReturnPct:x.event.originalRawReturnPct,refSpaceReturnPct:x.event.officialReferenceReturnPct,
  originalDecisionCutMissed:true,knownExdivPriceCrossingMetrics:x.eventWindowExposure.priceMetricsCrossingKnownExdiv,pitEligible:false,selectedCount:null,frozen:false,
  receiptHash:x.receiptHash}));
}
