// DATA_LANE #1068 — exact 61-session date exposure to one *positive*
// 2330 TWSE ex-dividend native event, not a strategy factor scorer.
// Inputs are TWO physically replayed, immutable SOURCE-ONLY receipts with
// separately retained original-provider SHA and actual observation clocks.
// A known event-crossing price window is BLOCKED for raw-price equivalence.
// No crossing of this *known* event NEVER means "NO_EVENT" or PIT PASS.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const deny=x=>{throw Error('S2_DATA_2330_CA_EXPOSURE_'+x)};
const H=/^[a-f0-9]{64}$/,DAY=/^\d{4}-\d\d-\d\d$/;
const CUT='2026-10-16T15:45:00.000Z';
const firstReceiptHash='773e65085186e0b6a019f320d4b2bdd3a07d8480ad70efc0f8e8e455f8d136e9';
const referenceReceiptHash='502dfbf79003573d4c58009dce44e62de673ef3648ad1a892a90c6503b04a3d7';
const iso=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&new Date(x).toISOString()===x;
const signed=async x=>{
 if(!x||!H.test(x.receiptHash||''))return false;
 const {receiptHash,...base}=x;return receiptHash===await sha256Hex(base);
};
const desc=[
 ['CURRENT_20_CLOSE_PRICE','LAST_20_INCLUDING_T','PRICE'],
 ['PRIOR_20_CLOSE_PRICE','LAST_20_EXCLUDING_T','PRICE'],
 ['CURRENT_60_CLOSE_PRICE','LAST_60_INCLUDING_T','PRICE'],
 ['PRIOR_60_HIGH_LOW','LAST_60_EXCLUDING_T','PRICE'],
 ['CURRENT_20_PRIOR_CLOSE_RETURN','T_VS_20_PRIOR','PRICE'],
 ['CURRENT_60_PRIOR_CLOSE_RETURN','T_VS_60_PRIOR','PRICE'],
 ['CURRENT_1D_CLOSE_RETURN','T_VS_1_PRIOR','PRICE'],
 ['CURRENT_20_PRIOR_VOLUME','LAST_20_EXCLUDING_T','VOLUME'],
 ['CURRENT_20_PRIOR_TRADE_VALUE','LAST_20_EXCLUDING_T','MONETARY_TURNOVER'],
];
const window=(length,kind)=>{
 if(kind==='LAST_20_INCLUDING_T')return [length-20,length-1];
 if(kind==='LAST_20_EXCLUDING_T')return [length-21,length-2];
 if(kind==='LAST_60_INCLUDING_T')return [length-60,length-1];
 if(kind==='LAST_60_EXCLUDING_T')return [length-61,length-2];
 if(kind==='T_VS_20_PRIOR')return [length-21,length-1];
 if(kind==='T_VS_60_PRIOR')return [length-61,length-1];
 if(kind==='T_VS_1_PRIOR')return [length-2,length-1];
 deny('UNKNOWN_WINDOW_KIND');
};
// Symbolically checks temporal membership; does not choose an adjustment
// formula or silently delete a required metric from BUILD's manifest.
export function classifyKnownEventExposureV0_1({
 dates,knownEventDate='2026-09-16',previousTradeDate='2026-09-15'
}={}){
 if(!Array.isArray(dates)||dates.length!==61||
    dates.some((d,i)=>!DAY.test(d)||(i>0&&d<=dates[i-1]))||
    dates.at(-1)!=='2026-10-16'||dates.at(0)!=='2026-07-21'||
    !dates.includes(knownEventDate)||!dates.includes(previousTradeDate)||
    dates.indexOf(previousTradeDate)+1!==dates.indexOf(knownEventDate))
   deny('ORIGINAL_61_TRADING_DATE_OR_EVENT_BOUNDARY_INVALID');
 const results=desc.map(([id,kind,sourceKind])=>{
   const [start,end]=window(dates.length,kind);
   const includesPrevious=start<=dates.indexOf(previousTradeDate)&&end>=dates.indexOf(previousTradeDate);
   const includesExDate=start<=dates.indexOf(knownEventDate)&&end>=dates.indexOf(knownEventDate);
   const crossesRawPriceBreak=sourceKind==='PRICE'&&includesPrevious&&includesExDate;
   return {
     id,sourceKind,sourceWindowId:kind,firstDate:dates[start],lastDate:dates[end],
     startIndex:start,endIndex:end,
     containsExDividendDate:includesExDate,
     crossesKnownExDividendRawPriceBoundary:crossesRawPriceBreak,
     evidenceState:crossesRawPriceBreak?'KNOWN_CA_PRICE_SPACE_CROSSING__ADJUST_OR_EXCLUDE_REQUIRED':
      sourceKind==='PRICE'?'DOES_NOT_CROSS_THIS_KNOWN_EVENT__OTHER_CA_UNKNOWN':
      'NON_PRICE_FIELD__CA_SOURCE_COMPLETENESS_UNKNOWN',
     authoritativeNoOtherActionEventsCertified:false,
     adjustedPriceFeatureComputed:false,
   };
 });
 return {knownEventIndex:dates.indexOf(knownEventDate),
  priorEventIndex:dates.indexOf(previousTradeDate),
  subsequentTradingSessionsCount:dates.length-1-dates.indexOf(knownEventDate),
  exposureRows:results};
}
export async function attest2330KnownEventWindowV0_1({a1,reference}={}){
 if(!(await signed(a1))||!(await signed(reference))||
   a1.receiptHash!==firstReceiptHash||
   reference.receiptHash!==referenceReceiptHash||
   a1.schemaVersion!=='S2_DATA_PITA_2330_61_NATIVE_SOURCE_READBACK_V0_1'||
   reference.schemaVersion!=='S2_DATA_PITA_2330_EXDIV_NATIVE_PRICE_REFERENCE_V0_1'||
   a1.stock!=='2330'||a1.market!=='TWSE'||a1.marketDate!=='2026-10-16'||
   reference.symbol!=='2330'||reference.market!=='TWSE'||reference.marketDate!=='2026-10-16'||
   a1.targetResearchCutUtc!==CUT||reference.existingDecisionCutUtc!==CUT||
   a1.originalNativeDaysRehashed!==61||a1.nativeDailyBarHashesMatched!==61||
   reference.officialA1ProducerArtifactId!==12002806667||
   reference.officialCAProducerArtifactId!==12050321595||
   reference.previousCloseRaw!==2385||reference.exDateCloseRaw!==2380||
   reference.officialExDividendReference!==2377.99||
   reference.rawTwoDayChangePercent!==-0.209644||
   reference.exDividendReferenceChangePercent!==0.084525||
   reference.rawTwoDayChangePercent>=0||reference.exDividendReferenceChangePercent<=0||
   reference.originalIssuerPublicationOnExDateProven!==false||
   reference['61DayAdjustedFeatureContinuityAudited']!==false||
   reference.authoritativeNegativeNoEventProven!==false||
   a1.onlyA1SourceEvidenceVerified!==true||
   a1.independentFullPitAuditLaneAccepted!==false||
   reference.independentAuditLaneFullPITAccepted!==false||
   a1.pitSymbolEligibleCount!==0||
   reference.currentSymbolPitEligible!==false)
    deny('SOURCE_ONLY_61_OR_KNOWN_CA_REFERENCE_IDENTITY_INVALID');
 const lineage=a1.originalResponseVersionLineage;
 if(!Array.isArray(lineage)||lineage.length!==61||
    !iso(a1.actualNewSourceCapturedAtUtc)||
    !iso(reference.caNativeOriginalFirstObservedAtUtc)||
    Date.parse(a1.actualNewSourceCapturedAtUtc)>=Date.parse(CUT)||
    Date.parse(reference.caNativeOriginalFirstObservedAtUtc)>=Date.parse(CUT)||
    lineage.some(o=>!H.test(o.originalNativeBodySha256||'')||
      !H.test(o.nativeRowSourceFieldsSha256||'')||
      !iso(o.actualFirstPhysicalObservedAtUtc)||
      Date.parse(o.actualFirstPhysicalObservedAtUtc)>=Date.parse(CUT)||
      o.originalHistoricalPublicationTimestampCertified!==false))
    deny('REAL_NATIVE_ORIGINAL_ROW_HASH_AND_ASOF_CLOCK_INVALID');
 const dates=lineage.map(o=>o.marketDate);
 const {knownEventIndex,priorEventIndex,subsequentTradingSessionsCount,exposureRows}=
    classifyKnownEventExposureV0_1({dates,
      knownEventDate:reference.exDividendDate,
      previousTradeDate:reference.previousTradingDate});
 if(lineage[priorEventIndex].originalNativeBodySha256!==reference.sourceA1PreviousBodySha256||
    lineage[knownEventIndex].originalNativeBodySha256!==reference.sourceA1ExDateBodySha256||
    lineage[priorEventIndex].nativeRowSourceFieldsSha256!==reference.sourceA1PreviousRowSha256||
    lineage[knownEventIndex].nativeRowSourceFieldsSha256!==reference.sourceA1ExDateRowSha256)
    deny('SAME_2330_NATIVE_ROWS_NOT_PINNED_TO_EXDIV_CROSSWALK');
 const base={
  schemaVersion:'S2_DATA_2330_KNOWN_NATIVE_EXDIV_61_DATE_EXPOSURE_V0_1',
  originalDateScope:'2026-07-21..2026-10-16',
  marketDate:'2026-10-16',market:'TWSE',symbol:'2330',decisionCutUtc:CUT,
  originalA1SourceArtifactId:12049278372,
  originalExdivCrosswalkArtifactId:12051974485,
  underlyingCAOriginalArtifactId:12050321595,
  original61SourceReceiptHash:a1.receiptHash,
  originalExdivReferenceReceiptHash:reference.receiptHash,
  originalNative61DatesVerified:61,
  knownNativeEventDate:reference.exDividendDate,
  knownNativePreviousDate:reference.previousTradingDate,
  knownEventIndex,priorEventIndex,subsequentTradingSessionsCount,
  sourceNativeDividendReference:reference.officialExDividendReference,
  originalTwoDayRawReturnPercent:reference.rawTwoDayChangePercent,
  originalTwoDayReferenceBasedReturnPercent:reference.exDividendReferenceChangePercent,
  asOfNativeOriginalSourceClocksBeforeCut:true,
  windowExposure:exposureRows,
  windowsCrossingKnownPriceBoundary:exposureRows.filter(x=>x.crossesKnownExDividendRawPriceBoundary).length,
  exdivPriceFeatureAdjustmentProven:false,
  historicalIssuerPublicationOnExDateCertified:false,
  authoritativeNoOtherEventsCertified:false,
  full61BarCAContinuityCertified:false,
  independentAUDITLaneStrategyScopeAccepted:false,
  pitEligible:false,selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  shadowAuthorized:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false,
 };
 return {...base,receiptHash:await sha256Hex(base)};
}
if(process.argv[1]?.endsWith('/issue1068_pita_2330_native_ca_window_exposure_v0_1.mjs')){
 const old=JSON.parse(await readFile(
  '/tmp/s2-data-2330-61/native/sourceonly-2330-61-native-verdict.json','utf8'));
 const ca=JSON.parse(await readFile(
  '/tmp/s2-data-2330-event/native/original-2330-exdiv-price-reference.json','utf8'));
 const out=await attest2330KnownEventWindowV0_1({a1:old,reference:ca});
 const dir='/tmp/s2-data-2330-window-ca-exposure';
 await mkdir(dir,{recursive:true,mode:0o700});
 await writeFile(resolve(dir,'source-only-2330-ca-exposed-windows.json'),
  JSON.stringify(out,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  result:'REAL_61_DATE_SOURCE_AND_EXDIV_WINDOW_EXPOSURE_REPLAY',
  originalNativeSessions:out.originalNative61DatesVerified,
  exDividendSessionIndex:out.knownEventIndex,
  crossingWindows:out.windowsCrossingKnownPriceBoundary,
  actualRawTwoDayReturn:out.originalTwoDayRawReturnPercent,
  officialReferenceTwoDayReturn:out.originalTwoDayReferenceBasedReturnPercent,
  adjustedFactorApproved:false,CA_NoEventCertified:false,
  independentStrategyPIT:false,selectedCount:null,frozen:false,
  receiptHash:out.receiptHash
 }));
}
