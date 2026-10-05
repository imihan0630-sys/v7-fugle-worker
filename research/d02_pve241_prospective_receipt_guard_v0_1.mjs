const uniq=a=>[...new Set(a)];
const iso=v=>Number.isFinite(Date.parse(v))?Date.parse(v):null;
const finite=v=>Number.isFinite(Number(v));
const ok=(x={})=>({pass:true,reasons:[],...x});
const no=(r,x={})=>({pass:false,reasons:uniq(r),...x});
const TIMEFRAMES=new Set(['MINUTE','DAILY']);
const RAW_UNITS=new Set(['LOTS','SHARES']);
const SOURCE_ROLES=new Set(['LIVE_DECISION_SOURCE','PROSPECTIVE_CAPTURE','HISTORICAL_REPLAY_ONLY']);
const ACTIONS=new Set(['NONE','UNIT_SCALE','SUPPLY_CHANGE','EX_RIGHT_DIVIDEND','UNKNOWN']);
const PROXIES=new Set(['DIRECT_VOLUME','TURNOVER','RVOL','BID_ASK_SIDE_VOLUME','PROVIDER_TRADE_PRESSURE','PRICE_VOLUME_RESPONSE']);
const FORBIDDEN_MOTIVE=new Set(['ACCUMULATION','DISTRIBUTION','SMART_MONEY_BUYING','SMART_MONEY_SELLING','INFORMED_BUYING','INFORMED_SELLING','ABSORPTION','ICEBERG','SPOOFING','TRUE_OFI']);

export const D02_PVE241_RECEIPT_GUARD_VERSION='D02_PVE241_PROSPECTIVE_RECEIPT_GUARD_V0_1';

export function evaluatePVE241Receipt(x={}){
 const r=[];
 const available=iso(x.sourceAvailableAt), fetched=iso(x.sourceRetrievedAt), first=iso(x.featureFirstKnownAt), cutoff=iso(x.decisionCutoffAt);
 if(!x.scanDate)r.push('MISSING_SCAN_DATE');
 if(!x.eventId)r.push('MISSING_EVENT_ID');
 if(!x.evidenceKey)r.push('MISSING_EVIDENCE_KEY');
 if(!x.moduleId)r.push('MISSING_MODULE_ID');
 if(!x.symbol)r.push('MISSING_SYMBOL');
 if(!x.exchange)r.push('MISSING_EXCHANGE');
 if(!x.session)r.push('MISSING_SESSION');
 if(!x.sourceProvider)r.push('MISSING_SOURCE_PROVIDER');
 if(!x.sourceEndpoint)r.push('MISSING_SOURCE_ENDPOINT');
 if(!SOURCE_ROLES.has(x.sourceRole))r.push('SOURCE_ROLE_INVALID');
 if(!TIMEFRAMES.has(x.timeframe))r.push('TIMEFRAME_INVALID');
 if(x.timezone!=='Asia/Taipei')r.push('TIMEZONE_MUST_BE_ASIA_TAIPEI');
 if(x.barCompleted!==true)r.push('BAR_NOT_COMPLETED');
 if([available,fetched,first,cutoff].some(v=>v===null))r.push('SOURCE_OR_DECISION_CLOCK_INVALID');
 else {
   if(available>first)r.push('SOURCE_AVAILABLE_AFTER_FEATURE_FIRST_KNOWN');
   if(fetched>first && x.sourceRole!=='HISTORICAL_REPLAY_ONLY')r.push('SOURCE_RETRIEVED_AFTER_FEATURE_FIRST_KNOWN');
   if(first>cutoff)r.push('FEATURE_KNOWN_AFTER_DECISION_CUTOFF');
 }
 if(x.sourceRole==='HISTORICAL_REPLAY_ONLY'&&x.decisionTimeObservableClaim===true)r.push('HISTORICAL_REPLAY_CANNOT_PROVE_DECISION_TIME_OBSERVABILITY');
 if(x.sourceRole!=='HISTORICAL_REPLAY_ONLY'&&x.sourceCapturedProspectively!==true)r.push('PROSPECTIVE_SOURCE_CAPTURE_REQUIRED');

 if(!RAW_UNITS.has(x.rawVolumeUnit))r.push('RAW_VOLUME_UNIT_INVALID');
 if(!finite(x.rawVolumeValue)||Number(x.rawVolumeValue)<0)r.push('RAW_VOLUME_VALUE_INVALID');
 if(x.normalizedVolumeUnit!=='SHARES')r.push('NORMALIZED_VOLUME_UNIT_MUST_BE_SHARES');
 if(!finite(x.normalizedVolumeValue)||Number(x.normalizedVolumeValue)<0)r.push('NORMALIZED_VOLUME_VALUE_INVALID');
 if(!finite(x.volumeNormalizationFactor)||Number(x.volumeNormalizationFactor)<=0)r.push('VOLUME_NORMALIZATION_FACTOR_INVALID');
 if(x.rawVolumeUnit==='SHARES'&&Number(x.volumeNormalizationFactor)!==1)r.push('SHARES_NORMALIZATION_FACTOR_MUST_BE_1');
 if(x.rawVolumeUnit==='LOTS'&&Number(x.volumeNormalizationFactor)!==1000)r.push('LOTS_NORMALIZATION_FACTOR_MUST_BE_1000');
 if(finite(x.rawVolumeValue)&&finite(x.normalizedVolumeValue)&&finite(x.volumeNormalizationFactor)){
   const expected=Number(x.rawVolumeValue)*Number(x.volumeNormalizationFactor);
   if(Math.abs(expected-Number(x.normalizedVolumeValue))>1e-9)r.push('NORMALIZED_VOLUME_VALUE_MISMATCH');
 }
 if(x.timeframe==='MINUTE'&&x.rawVolumeUnit!=='LOTS')r.push('MINUTE_REGULAR_LOT_UNIT_MUST_BE_LOTS');
 if(x.timeframe==='DAILY'&&x.rawVolumeUnit!=='SHARES')r.push('DAILY_UNIT_MUST_BE_SHARES');
 if(x.crossTimeframeJoin===true&&x.unitNormalizationPass!==true)r.push('CROSS_TIMEFRAME_JOIN_REQUIRES_UNIT_NORMALIZATION');

 if(!ACTIONS.has(x.corporateActionClass))r.push('CORPORATE_ACTION_CLASS_INVALID');
 if(x.corporateActionFlagKnown!==true)r.push('CORPORATE_ACTION_FLAG_UNKNOWN');
 if(x.corporateActionClass==='UNKNOWN'&&x.admissionClassification==='ELIGIBLE')r.push('UNKNOWN_CORPORATE_ACTION_CANNOT_BE_ELIGIBLE');
 if(x.timeframe==='MINUTE'&&x.adjustedPriceClaim===true)r.push('MINUTE_ADJUSTED_PRICE_CLAIM_FORBIDDEN');
 if(!['RAW_UNADJUSTED','ADJUSTED_DAILY_ONLY','NOT_USED'].includes(x.priceAdjustmentMode))r.push('PRICE_ADJUSTMENT_MODE_INVALID');
 if(x.corporateActionClass==='EX_RIGHT_DIVIDEND'){
   if(x.mechanicalReferencePriceControlPass!==true)r.push('EX_RIGHT_DIVIDEND_REFERENCE_PRICE_CONTROL_REQUIRED');
   if(x.priceGapTreatedAsOrdinaryDiscovery===true)r.push('CORPORATE_ACTION_GAP_CANNOT_BE_ORDINARY_PRICE_DISCOVERY');
 }
 if(x.corporateActionClass==='UNIT_SCALE'&&x.unitScaleBridgeVerified!==true&&x.resetCleanBaselinePass!==true)r.push('UNIT_SCALE_CONTINUITY_NOT_PROVEN');
 if(x.corporateActionClass==='SUPPLY_CHANGE'&&x.comparableParticipationUsed===true&&x.supplyDenominatorNormalized!==true&&x.resetCleanBaselinePass!==true)r.push('SUPPLY_CHANGE_COMPARABILITY_NOT_PROVEN');

 if(x.priceInformationRoot!=='PRICE_OHLC')r.push('PRICE_INFORMATION_ROOT_MISMATCH');
 if(x.volumeInformationRoot!=='VOLUME_TURNOVER')r.push('VOLUME_INFORMATION_ROOT_MISMATCH');
 if(x.priceDerivedIndependentVote===true)r.push('PRICE_DERIVED_SECOND_VOTE_FORBIDDEN');
 if(x.residualIncrementalityRequired!==true)r.push('RESIDUAL_INCREMENTALITY_REQUIRED');
 if(x.commonSupportRequired!==true)r.push('COMMON_SUPPORT_REQUIRED');

 if(!PROXIES.has(x.proxyClass))r.push('PROXY_CLASS_INVALID');
 if(x.intentIdentified===true){
   if(x.independentIntentSourcePresent!==true)r.push('INTENT_REQUIRES_INDEPENDENT_SOURCE');
   const ik=iso(x.independentIntentSourceKnownAt);
   if(ik===null)r.push('INDEPENDENT_INTENT_SOURCE_CLOCK_INVALID');
   else if(cutoff!==null&&ik>cutoff)r.push('INDEPENDENT_INTENT_SOURCE_AFTER_DECISION_CUTOFF');
 }
 if(FORBIDDEN_MOTIVE.has(String(x.motiveLabel||''))&&x.independentIntentSourcePresent!==true)r.push('FORBIDDEN_MOTIVE_OVERCLAIM');
 if(['BID_ASK_SIDE_VOLUME','PROVIDER_TRADE_PRESSURE'].includes(x.proxyClass)){
   if(x.trueOfiEligible!==false)r.push('TRUE_OFI_MUST_REMAIN_FALSE_FOR_PROXY');
   if(x.completeVolumeIdentityClaim===true)r.push('PROXY_CANNOT_CLAIM_COMPLETE_VOLUME_IDENTITY');
 }
 if(x.proxyClass==='BID_ASK_SIDE_VOLUME'&&x.openingAuctionCompletenessClaim===true)r.push('OPENING_AUCTION_COMPLETENESS_CLAIM_FORBIDDEN');

 if(!['ELIGIBLE','BLOCKED','UNKNOWN'].includes(x.admissionClassification))r.push('ADMISSION_CLASSIFICATION_INVALID');
 const promotionEligible=r.length===0&&x.sourceRole!=='HISTORICAL_REPLAY_ONLY'&&x.admissionClassification==='ELIGIBLE';
 return r.length?no(r,{promotionEligible:false,outcomeAccessAuthorized:false,numericalTargetAuthorized:false,d16MethodSelectionAuthorized:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false})
   :ok({promotionEligible,outcomeAccessAuthorized:false,numericalTargetAuthorized:false,d16MethodSelectionAuthorized:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}

export function evaluatePVE241Dataset(rows=[]){
 const arr=Array.isArray(rows)?rows:[];
 const seen=new Map(),dups=[];
 const receipts=arr.map(x=>{
   if(x?.eventId){if(seen.has(x.eventId))dups.push(seen.get(x.eventId)===x.scanDate?'DUPLICATE_EVENT_ID_SAME_DATE':'DUPLICATE_EVENT_ID_CROSS_DATE');else seen.set(x.eventId,x.scanDate);}
   return {eventId:x?.eventId??null,scanDate:x?.scanDate??null,moduleId:x?.moduleId??null,evidenceKey:x?.evidenceKey??null,admission:evaluatePVE241Receipt(x)};
 });
 const fatalIntegrity=dups.length>0;
 const valid=receipts.filter(x=>x.admission.pass);
 const prospective=valid.filter(x=>x.admission.promotionEligible);
 return {schemaVersion:'0.1',guardVersion:D02_PVE241_RECEIPT_GUARD_VERSION,outcomeBlind:true,rowCount:arr.length,validReceiptCount:valid.length,promotionEligibleReceiptCount:prospective.length,distinctProspectiveDates:uniq(prospective.map(x=>x.scanDate).filter(Boolean)).length,fatalIntegrity,datasetReasons:uniq(dups),receiptSchemaReady:!fatalIntegrity&&valid.length>0,outcomeAccessAuthorized:false,numericalTargetAuthorized:false,d16MethodSelectionAuthorized:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false,receipts};
}
