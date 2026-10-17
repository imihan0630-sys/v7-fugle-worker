// DATA_LANE / #1068 — source-only candidate for **one known** 2330
// official TWSE ex-dividend reference boundary, not an adjusted-strategy bar.
// No company-action event absence claim, no historical issuer-version proof,
// no strategy factor, rankings, buy eligibility, Frozen or Cloudflare writes.
// Native event 2026-09-16/prev 09-15; actual originals observed before
// the 2026-10-16 23:45 Taipei candidate cut.
// Proposal: scale PRE-event OHLC by (TWSE ex-ref / previous native close),
// carry post-event native raw OHLC unchanged. Do NOT call this a
// provider-official fully-adjusted series or safe to compute factors on.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const H=/^[0-9a-f]{64}$/,CUT='2026-10-16T15:45:00.000Z';
const OLD='ff5aa17607fa9cc191599111b27b762a02f599456992f1baf7ee7b854387cfd9';
const CURRENT='074c5e83afde3e4dd7dfb7295eb7483215848a84edb5b78493fd673592d9f18a';
const READBACK='773e65085186e0b6a019f320d4b2bdd3a07d8480ad70efc0f8e8e455f8d136e9';
const EXDIV='502dfbf79003573d4c58009dce44e62de673ef3648ad1a892a90c6503b04a3d7';
const deny=s=>{throw Error('S2_PITA_2330_PRICE_SPACE_CANDIDATE_'+s)};
const iso=s=>typeof s==='string'&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString()===s;
const signed=async x=>{
 if(!x||typeof x!=='object'||!H.test(x.receiptHash||''))return false;
 const {receiptHash,...v}=x;return await sha256Hex(v)===receiptHash;
};
const rounded=n=>Math.round(n*1e6)/1e6;
export function makeSingleKnownExdivReferenceCandidateV0_1({
 dates,rawBars,exDate='2026-09-16',priorDate='2026-09-15',
 priorNativeClose=2385,exchangeReference=2377.99
}={}){
 if(!Array.isArray(dates)||dates.length!==61||new Set(dates).size!==61||
    dates[0]!=='2026-07-21'||dates.at(-1)!=='2026-10-16'||
    !Array.isArray(rawBars)||rawBars.length!==61||
    !Number.isFinite(priorNativeClose)||priorNativeClose<=0||
    !Number.isFinite(exchangeReference)||exchangeReference<=0||
    exchangeReference>=priorNativeClose)deny('DATE_OR_REFERENCE_NOT_PINNED');
 const idx=dates.indexOf(exDate),prev=dates.indexOf(priorDate);
 if(idx<1||idx!==prev+1||idx!==41)deny('KNOWN_EVENT_DAY_OR_SESSION_BOUNDARY_INVALID');
 if(rawBars.some((r,i)=>r?.marketDate!==dates[i]||r.market!=='TWSE'||
     r.symbol!=='2330'||!H.test(r.rawRowSha256||'')||
     ![r.open,r.high,r.low,r.close].every(x=>Number.isFinite(x)&&x>0)||
     r.high<Math.max(r.open,r.close)||r.low>Math.min(r.open,r.close)))
   deny('ORIGINAL_NATIVE_OHLC_OR_ROW_IDENTITY_INVALID');
 if(rawBars[prev].close!==priorNativeClose||
    rawBars[idx].close!==2380)deny('EVENT_NATIVE_PRE_POST_CLOSE_MISMATCH');
 const factor=exchangeReference/priorNativeClose;
 const series=rawBars.map((r,i)=>{
   const multiplier=i<idx?factor:1;
   return {
     marketDate:r.marketDate,rawSourceRowSha256:r.rawRowSha256,
     priceSpace:'SINGLE_KNOWN_EVENT_REFERENCE_RATIO_PROPOSAL',
     proposedOHLC:{
       open:rounded(r.open*multiplier),high:rounded(r.high*multiplier),
       low:rounded(r.low*multiplier),close:rounded(r.close*multiplier)
     },
     priceMultiplier:multiplier,
     knownEventPreSide:i<idx,
     trueNativeOHLCUnchanged:false,
   };
 });
 if(series.length!==61||
    series.filter(x=>x.knownEventPreSide).length!==41||
    series.some(x=>x.proposedOHLC.high<Math.max(x.proposedOHLC.open,x.proposedOHLC.close)||
      x.proposedOHLC.low>Math.min(x.proposedOHLC.open,x.proposedOHLC.close))||
    Math.abs(series[idx-1].proposedOHLC.close-exchangeReference)>1e-6)
   deny('TRANSFORM_BOUNDARY_OR_REFERENCE_RECONCILIATION_INVALID');
 return {
  referenceRatio:factor,
  knownNativeExDateIndex:idx,
  preEventReferenceScaledSessions:idx,
  unchangedPostEventSessions:61-idx,
  rawPreEventClose:priorNativeClose,
  proposedPreviousCloseAtReference:series[idx-1].proposedOHLC.close,
  nativeExDividendReference:exchangeReference,
  proposedExDateClose:series[idx].proposedOHLC.close,
  nativeExDateClose:rawBars[idx].close,
  referenceBasedExDateReturnPct:rounded((rawBars[idx].close/exchangeReference-1)*100),
  rawExDateReturnPct:rounded((rawBars[idx].close/priorNativeClose-1)*100),
  referenceScaleSeries:series,
 };
}
export async function build2330NativePriceSpaceCandidateV0_1({old,current,readback,exdiv}={}){
 if(!await signed(old)||!await signed(current)||!await signed(readback)||!await signed(exdiv)||
    old.receiptHash!==OLD||current.receiptHash!==CURRENT||
    readback.receiptHash!==READBACK||exdiv.receiptHash!==EXDIV||
    old.marketDate!=='2026-10-15'||old.receivedMarketDateCount!==122||
    current.marketDate!=='2026-10-16'||current.symbol!=='2330'||
    current.market!=='TWSE'||current.sourceNativeBodySha256!==
     'c00391008b8a292dcec991afe102a07ea3e3a49ec42950a90491f3f13fe1a6cf'||
    current.originalBodySavedAndByteRehashed!==true||
    readback.schemaVersion!=='S2_DATA_PITA_2330_61_NATIVE_SOURCE_READBACK_V0_1'||
    readback.stock!=='2330'||readback.market!=='TWSE'||
    readback.originalNativeDaysRehashed!==61||readback.nativeDailyBarHashesMatched!==61||
    readback.onlyA1SourceEvidenceVerified!==true||
    readback.independentFullPitAuditLaneAccepted!==false||
    exdiv.schemaVersion!=='S2_DATA_PITA_2330_EXDIV_NATIVE_PRICE_REFERENCE_V0_1'||
    exdiv.symbol!=='2330'||exdiv.market!=='TWSE'||
    exdiv.exDividendDate!=='2026-09-16'||
    exdiv.previousTradingDate!=='2026-09-15'||
    exdiv.previousCloseRaw!==2385||exdiv.exDateCloseRaw!==2380||
    exdiv.officialExDividendReference!==2377.99||
    exdiv['61DayAdjustedFeatureContinuityAudited']!==false||
    exdiv.authoritativeNegativeNoEventProven!==false||
    readback.targetResearchCutUtc!==CUT||
    exdiv.existingDecisionCutUtc!==CUT||
    current.targetResearchCutUtc!==CUT)
   deny('ACTUAL_SIGNED_ORIGINAL_SOURCE_PROVENANCE_NOT_MATCHED');
 const oldBars=old.bySymbol?.['TWSE|2330']?.bars;
 const l=readback.originalResponseVersionLineage;
 const raw=[...oldBars?.slice(1)||[],{
   date:'2026-10-16',symbol:'2330',market:'TWSE',
   open:current.currentTradingDaySourceBar?.open,
   high:current.currentTradingDaySourceBar?.high,
   low:current.currentTradingDaySourceBar?.low,
   close:current.currentTradingDaySourceBar?.close,
   sourceRowHash:current.currentTradingDaySourceBar?.nativeSourceFieldsSha256
 }];
 if(raw.length!==61||!Array.isArray(l)||l.length!==61||
    raw.some((r,i)=>r.date!==l[i].marketDate||
     r.sourceRowHash!==l[i].nativeRowSourceFieldsSha256||
     !H.test(l[i].originalNativeBodySha256||'')||
     !iso(l[i].actualFirstPhysicalObservedAtUtc)||
     Date.parse(l[i].actualFirstPhysicalObservedAtUtc)>=Date.parse(CUT))||
    l[40].nativeRowSourceFieldsSha256!==exdiv.sourceA1PreviousRowSha256||
    l[41].nativeRowSourceFieldsSha256!==exdiv.sourceA1ExDateRowSha256||
    l[40].originalNativeBodySha256!==exdiv.sourceA1PreviousBodySha256||
    l[41].originalNativeBodySha256!==exdiv.sourceA1ExDateBodySha256||
    !iso(exdiv.caNativeOriginalFirstObservedAtUtc)||
    Date.parse(exdiv.caNativeOriginalFirstObservedAtUtc)>=Date.parse(CUT)||
    !iso(current.actualFirstPhysicalObservedAtUtc)||
    Date.parse(current.actualFirstPhysicalObservedAtUtc)>=Date.parse(CUT))
    deny('ACTUAL_61_NATIVE_BAR_HASH_OR_KNOWN_CA_CLOCK_MISMATCH');
 const prices=makeSingleKnownExdivReferenceCandidateV0_1({
  dates:l.map(x=>x.marketDate),
  rawBars:raw.map((x,i)=>({
    marketDate:x.date,market:x.market,symbol:x.symbol,
    open:x.open,high:x.high,low:x.low,close:x.close,
    rawRowSha256:l[i].nativeRowSourceFieldsSha256
  }))
 });
 const base={
  schemaVersion:'S2_DATA_PITA_2330_REFERENCE_RATIO_RESEARCH_CANDIDATE_V0_1',
  status:'ONE_KNOWN_EXDIV_REFERENCE_BOUNDARY_PROPOSED__OTHER_ACTIONS_AND_PIT_UNKNOWN',
  sourceScope:'TWSE:2330/2026-07-21..2026-10-16',
  exactResearchDecisionCutUtc:CUT,
  historicalA1OriginalReceiptHash:old.receiptHash,
  newDayA1OriginalReceiptHash:current.receiptHash,
  independentlyRehashed61OriginalSourceReceiptHash:readback.receiptHash,
  sourceOnlyKnownNativeDividendCrosswalkReceiptHash:exdiv.receiptHash,
  knownEventDate:'2026-09-16',
  transformHypothesis:'PRIOR_EVENT_OHLC_MULTIPLY_TWSE_EX_REFERENCE_OVER_PREVIOUS_NATIVE_CLOSE',
  priceSpaceProposal:prices,
  nativeVolumeAndTradeValueRemainUnchanged:true,
  authoritativeOtherActionsExcluded:false,
  originalHistoricalIssuerPublicationOnEventDateProven:false,
  totalReturnOrOfficialAdjustedSeriesClaimed:false,
  independentlyAuditedAdjustmentFormula:false,
  full61DayAdjustedFeatureContinuityAudited:false,
  completePriceSpaceAdjustmentForStrategy:false,
  independentAuditLaneFullPitAccepted:false,
  pitEligible:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,shadowAuthorized:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false
 };
 return {...base,receiptHash:await sha256Hex(base)};
}
if(process.argv[1]?.endsWith('/issue1068_pita_2330_reference_ratio_price_space_candidate_v0_1.mjs')){
 const locations={
  old:'/tmp/s2-pita-2330-ratio-old/official-61-2026-10-15.json',
  current:'/tmp/s2-pita-2330-ratio-new/pita-2330-a1-source-receipt.json',
  readback:'/tmp/s2-pita-2330-ratio-readback/sourceonly-2330-61-native-verdict.json',
  exdiv:'/tmp/s2-pita-2330-ratio-exdiv/original-2330-exdiv-price-reference.json'
 };
 const [old,current,readback,exdiv]=await Promise.all(
  Object.values(locations).map(p=>readFile(p,'utf8').then(JSON.parse)));
 const r=await build2330NativePriceSpaceCandidateV0_1({old,current,readback,exdiv});
 const dir='/tmp/s2-pita-2330-reference-ratio-candidate';
 await mkdir(dir,{recursive:true,mode:0o700});
 await writeFile(resolve(dir,'2330-known-event-price-space-hypothesis.json'),
  JSON.stringify(r,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  real61SourceRows:61,knownEvent:'2026-09-16',
  preEventPriceRowsProposed:r.priceSpaceProposal.preEventReferenceScaledSessions,
  postEventNativeRowsUnchanged:r.priceSpaceProposal.unchangedPostEventSessions,
  referenceRatio:r.priceSpaceProposal.referenceRatio,
  referenceDateReturnPct:r.priceSpaceProposal.referenceBasedExDateReturnPct,
  rawDateReturnPct:r.priceSpaceProposal.rawExDateReturnPct,
  caUnknown:true,officialAdjustedSeries:false,
  fullStrategyPit:false,selectedCount:null,frozen:false,
  receiptHash:r.receiptHash
 }));
}
