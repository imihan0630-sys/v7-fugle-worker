// BUILD_LANE / OWNER 2026-10-17: System2 approved dual-track three-layer
// selection display router. Class A non-PIT preview consumption ONLY;
// certified PIT-A, PIT-B, official Shadow and Frozen remain separate.
import {sha256Hex} from './decision_archive.mjs';

export const SYSTEM2_THREE_LAYER_SELECTION_V0_1=Object.freeze({
 version:'S2_THREE_LAYER_SELECTION_V0_1',
 layers:Object.freeze([
  {id:'NON_PIT_PREVIEW',kind:'SOURCE_BOUNDED_RESEARCH_OBSERVATION'},
  {id:'PIT_A_PROSPECTIVE',kind:'INDEPENDENT_ACTUAL_ASOF_VERIFICATION'},
  {id:'PIT_B_HISTORICAL',kind:'HISTORICAL_VINTAGE_COST_OOS_VALIDATION'},
 ]),
});
const SHA=/^[0-9a-f]{64}$/i,DAY=/^\d{4}-\d{2}-\d{2}$/;
const UTC=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const sha=x=>typeof x==='string'&&SHA.test(x);
const validDay=x=>typeof x==='string'&&DAY.test(x)&&
  Number.isFinite(Date.parse(x+'T00:00:00Z'))&&
  new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const validUtc=x=>typeof x==='string'&&UTC.test(x)&&
 Number.isFinite(Date.parse(x))&&
 new Date(x).toISOString().slice(0,19)===x.slice(0,19);
const reject=x=>{throw Error('S2_LAYERED_PREVIEW_'+x);};
const unsigned=(x,k)=>Object.fromEntries(Object.entries(x).filter(([n])=>n!==k));
const originalNameIsDr=x=>typeof x==='string'&&
 /[-\u2010-\u2014]\s*DR$/i.test(x.normalize('NFKC').trim());
const ALLOWED=new Set(SYSTEM2_THREE_LAYER_SELECTION_V0_1.layers.map(x=>x.id));

function defaultAuthority(layer){
 return {
  requestedLayer:layer,
  previewAuthority:layer==='NON_PIT_PREVIEW',
  pitACertificationGranted:false,pitBCertificationGranted:false,
  shadowAuthorized:false,frozenD1Written:false,
  strategySelectedCount:null,certifiedZeroPickDay:null,
  formalStrategyRank:null,formalPerformanceCertified:false,
  pushAuthorized:false,ordersAuthorized:false,
  system1FormalCoreChanged:false,cloudflareD1Reads:0,cloudflareD1Writes:0,
 };
}
// A source-positive event overlay can RESTRICT a displayed row, NEVER grant
// no-event negative coverage or promote PIT. Late-discovered evidence cannot
// be rewritten into the earlier observed preview's causal history.
function positiveOverlay(row,events,cut,official61SourceDates){
 const applicable=events.filter(e=>e.symbol===row.symbol&&e.market===row.market&&e.eventDate<=row.marketDate);
 // DATA source-positive historical fact: TWSE 2330 ex-dividend 2026-09-16,
 // first physically observed 2026-10-16 21:48 Taipei. All future signed
 // DAILY PREVIEW receipts carry the actual upstream 61 official source dates.
 // Flag only when 09/16 is actually within that exact window (and known by
 // the current as-of receipt), rather than forgetting it after Oct16.
 // The old exact Oct16 fixture predates the new calendar field; preserve
 // that narrow safe fallback solely for physical historical replay.
 const relevant2330=(official61SourceDates
   ?official61SourceDates.includes('2026-09-16')
   :row.marketDate==='2026-10-16');
 if(row.symbol==='2330'&&row.market==='TWSE'&&relevant2330){
  applicable.push({symbol:'2330',market:'TWSE',eventDate:'2026-09-16',
   firstObservedAtUtc:'2026-10-16T13:48:50.420Z'});
 }
 const knownAtCut=applicable.filter(e=>Date.parse(e.firstObservedAtUtc)<=cut);
 const late=applicable.filter(e=>Date.parse(e.firstObservedAtUtc)>cut);
 return {positiveAtCut:knownAtCut.length>0,
         latePositive:late.length>0,events:applicable.length};
}

export async function routeSystem2ThreeLayerSelectionV0_1({
 layer='NON_PIT_PREVIEW',preliminaryReceipt=null,
 requestedDecisionAtUtc=null,positiveCorporateActionOverlays=[]
}={}){
 if(!ALLOWED.has(layer))reject('LAYER_UNRECOGNIZED');
 if(!Array.isArray(positiveCorporateActionOverlays))reject('EVENT_OVERLAYS_INVALID');
 if(positiveCorporateActionOverlays.length>500)reject('EVENT_OVERLAY_LIMIT');
 for(const e of positiveCorporateActionOverlays){
  if(!e||!/^[1-9][0-9]{3}$/.test(e.symbol||'')||
     !['TWSE','TPEX'].includes(e.market)||!validDay(e.eventDate)||
     !validUtc(e.firstObservedAtUtc)||!sha(e.nativeRowSha256))
   reject('SOURCE_POSITIVE_EVENT_OVERLAY_INVALID');
 }
 // PIT-A and PIT-B cannot borrow a PREVIEW receipt as certification. We
 // deliberately do NOT accept caller-supplied isPIT:true or a fake audit hash.
 if(layer!=='NON_PIT_PREVIEW'){
  const base={
   schemaVersion:SYSTEM2_THREE_LAYER_SELECTION_V0_1.version,
   state:layer==='PIT_A_PROSPECTIVE'
    ?'EXISTING_PIT_A_GATE_NOT_EVALUATED'
    :'EXISTING_PIT_B_HISTORICAL_GATE_NOT_EVALUATED',
   ...defaultAuthority(layer),certifyingPipelineInvoked:false,
   prerequisites:layer==='PIT_A_PROSPECTIVE'
    ?['ACTUAL_USED_INPUT_PIT_A','EXTERNAL_INDEPENDENT_AUDIT','AUTHORIZED_VERSIONED_ADMISSION']
    :['HISTORICAL_SOURCE_VINTAGES','PIT_BACKTEST','OOS_AND_TRANSACTION_COSTS'],
   previewRows:[],sourceUniverseCount:null,ordinaryEquityUniverseCertified:false
  };
  return Object.freeze({...base,receiptHash:await sha256Hex(base)});
 }
 const r=preliminaryReceipt;
 if(!r||typeof r!=='object'||Array.isArray(r)||
    r.schemaVersion!=='S2_PRELIMINARY_PV_WATCH_V0_2'||
    r.watchVersion!=='PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2'||
    r.state!=='PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION'||
    !validDay(r.marketDate)||!validUtc(r.observedAtUtc)||
    !sha(r.receiptHash)||await sha256Hex(unsigned(r,'receiptHash'))!==r.receiptHash)
  reject('ACTUAL_PRELIMINARY_SOURCE_RECEIPT_NOT_VERIFIED');
 if(!sha(r.originalSourceReceiptHash)||!sha(r.independentSourceAuditHash)||
    r.selectedCount!==null||r.zeroPickDay!==null||
    r.finalSelectionAuthorized!==false||r.finalStrategyRankApproved!==false||
    r.frozenWritten!==false||r.orderAuthorized!==false||
    r.pushAuthorized!==false||r.historicalBacktestCertified!==false||
    r.ordinaryEquityOnlyUniverseCertified!==false||
    r.originalFourDigitSecurityUniverse!==true||
    !Number.isInteger(r.officialUniverseCount)||r.officialUniverseCount<=0||
    !Number.isInteger(r.preliminaryMatchedCount)||
    r.preliminaryMatchedCount<0||r.preliminaryMatchedCount>r.officialUniverseCount||
    !Number.isInteger(r.displayedCount)||r.displayedCount<0||
    r.displayedCount>r.preliminaryMatchedCount||
    !Array.isArray(r.watchlist)||r.watchlist.length!==r.displayedCount||
    r.cloudflareD1Writes!==0||r.cloudflareR2Writes!==0)
  reject('PREVIEW_GATES_AND_DENOMINATORS_INVALID');
 const cut=requestedDecisionAtUtc??r.observedAtUtc;
 if(!validUtc(cut))reject('REQUESTED_ASOF_CLOCK_INVALID');
 if(Date.parse(cut)<Date.parse(r.marketDate+'T00:00:00Z'))
   reject('DECISION_DATE_BEFORE_SOURCE_MARKET_DATE');
 // Source-only official session list is signed by the already-audited
 // physical preliminary source. Historic pre-v0.2-calendar receipts stay
 // readable but cannot claim new-date risk coverage from a missing list.
 const calendar=r.source61TradingDates??null;
 if(calendar!==null&&(!Array.isArray(calendar)||calendar.length!==61||
    calendar.at(-1)!==r.marketDate||
    calendar.some((d,i)=>!validDay(d)||(i>0&&d<=calendar[i-1]))))
  reject('SOURCE_61_OFFICIAL_SESSION_CALENDAR_INVALID');
 const observedAfterUserCut=Date.parse(r.observedAtUtc)>Date.parse(cut);
 // Real owner preferred conditional daily T cut is 23:45 Taipei / 15:45Z.
 // A later observation may still be descriptive, never backdated to T.
 const observedAfterPreferredTCut=Date.parse(r.observedAtUtc)>
   Date.parse(r.marketDate+'T15:45:00Z');
 const observedLate=observedAfterUserCut||observedAfterPreferredTCut||
   r.lateMorningObservationNotBackdated===true;
 const previewRows=[];
 const seen=new Set();
 for(const [i,x] of r.watchlist.entries()){
  if(!x||!/^[1-9][0-9]{3}$/.test(x.symbol||'')||
     !['TWSE','TPEX'].includes(x.market)||x.marketDate!==r.marketDate||
     !sha(x.sourceRowHash)||!Number.isFinite(x.fiveSessionReturnPct)||
     x.aboveSma20!==true||x.positiveFiveSessionReturn!==true||
     x.instrumentClassPITStatus!=='ORDINARY_EQUITY_CLASS_NOT_INDEPENDENTLY_ATTESTED'||
     x.companyActionPitStatus!=='UNKNOWN_NOT_CLEARED'||
     x.riskLevel!=='PRELIMINARY_OBSERVATION_ONLY'||
     x.formalStrategyValidity!==null||x.strategyRank!==null||
     x.triggerPrice!==null||x.stop!==null||x.targets!==null||
     originalNameIsDr(x.companyName))
   reject('PREVIEW_CANDIDATE_NOT_ALLOWED');
  const id=x.market+'|'+x.symbol;
  if(seen.has(id))reject('DUPLICATE_PREVIEW_CANDIDATE');
  seen.add(id);
  const positive=positiveOverlay(x,positiveCorporateActionOverlays,Date.parse(cut),calendar);
  const warnings=[
   'ORDINARY_SHARE_CLASS_NOT_INDEPENDENTLY_CERTIFIED',
   'COMPANY_ACTION_PIT_NOT_CLEARED',
   'MARKET_REGIME_NOT_CERTIFIED',
  ];
  if(positive.positiveAtCut)warnings.push('KNOWN_POSITIVE_CA_SOURCE_EVENT_REVIEW_REQUIRED');
  if(positive.latePositive)warnings.push('LATE_DISCOVERED_CA_EVENT_NOT_BACKDATED');
  if(observedLate)warnings.push('ORIGINAL_PREVIEW_OBSERVED_AFTER_REQUESTED_CUT');
  const row={
   previewDisplayOrder:i+1,symbol:x.symbol,companyName:x.companyName||null,
   market:x.market,marketDate:x.marketDate,
   descriptiveRawFiveSessionReturnPct:x.fiveSessionReturnPct,
   priceAboveRawSma20:true,sourceRowHash:x.sourceRowHash,
   status:positive.positiveAtCut||positive.latePositive||observedLate
     ?'CA_OR_CLOCK_REVIEW_HOLD':'RESEARCH_OBSERVATION_ONLY',
   companyActionPositiveAtCut:positive.positiveAtCut,
   retrospectiveCompanyActionPositiveLater:positive.latePositive,
   warnings,
   formalStrategyScore:null,formalStrategyRank:null,
   previewIsTradeRecommendation:false,entryPrice:null,stop:null,targets:null,
  };
  previewRows.push(row);
 }
 const base={
  schemaVersion:SYSTEM2_THREE_LAYER_SELECTION_V0_1.version,
  state:observedLate?'LATE_SOURCE_DESCRIPTIVE_PREVIEW_ONLY'
    :'SOURCE_BOUNDED_NON_PIT_PREVIEW',
  ...defaultAuthority(layer),
  sourcePreliminaryReceiptHash:r.receiptHash,
  sourceOriginalReceiptHash:r.originalSourceReceiptHash,
  sourceAuditHashNotStrategyPIT:r.independentSourceAuditHash,
  marketDate:r.marketDate,originalObservedAtUtc:r.observedAtUtc,
  requestedDecisionAtUtc:cut,
  observedAfterRequestedCut:observedAfterUserCut,
  observedAfterTradingDatePreferredCut:observedAfterPreferredTCut,
  lateMorningObservationNotBackdated:r.lateMorningObservationNotBackdated===true,
  source61SessionCalendarProvided:calendar!==null,
  known2330ExdivDateInSource61Window:calendar?.includes('2026-09-16')??null,
  sourceUniverseKind:'FOUR_DIGIT_INSTRUMENT_NOT_CERTIFIED_ORDINARY_EQUITY',
  sourceUniverseCount:r.officialUniverseCount,
  ordinaryEquityUniverseCertified:false,
  preliminarySourceMatchedCount:r.preliminaryMatchedCount,
  displayedPreviewCount:previewRows.length,
  fullMarketTopRankAuthorized:false,
  previewRows,
  futureProspectiveForwardReturnsUsableForThisDecision:false,
  prospectivePaperTrackingRequiresActualImmutablePreOutcomeSnapshot:true,
  independentStrategyPITVerified:false,
  zeroPreviewRowsWouldMeanZeroPicks:false,
  inputPreviewMayNeverBeReclassifiedAsOfficialFrozen:true,
  positiveEventsProvideOnlyVetoNotNoEventCert:true,
  historicalPreliminaryReceiptRetainedUnchanged:true,
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
