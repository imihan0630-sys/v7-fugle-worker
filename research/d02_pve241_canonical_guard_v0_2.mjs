const uniq=a=>[...new Set(a)];
const iso=v=>Number.isFinite(Date.parse(v))?Date.parse(v):null;
const finite=v=>Number.isFinite(Number(v));
const ok=(x={})=>({pass:true,reasons:[],...x});
const no=(r,x={})=>({pass:false,reasons:uniq(r),...x});
const TF=new Set(['1m','5m','15m','1d']);
const TIERS=new Set(['LIVE_PROVIDER','HISTORICAL_PROVIDER','EXCHANGE_OFFICIAL','DERIVED_FROM_BOUND_PARENTS']);
const RAW_UNITS=new Set(['SHARES','LOTS']);
const CONV=new Set(['IDENTITY_SHARES','REGULAR_LOT_X_1000']);
const ADJ=new Set(['UNADJUSTED','ADJUSTED_DAILY_ONLY','UNKNOWN']);
const CA=new Set(['NONE_VERIFIED','EX_RIGHT','EX_DIVIDEND','SUPPLY_CHANGE','UNIT_SCALE','MULTIPLE','UNKNOWN']);
const ROOT=new Set(['PRICE_OHLC','VOLUME_TURNOVER','PRICE_PLUS_VOLUME_DERIVED']);
const PROXY=new Set(['TOTAL_VOLUME','RVOL','CUMVOL_PACE','BID_ASK_SIDE_VOLUME','SIGNED_VOLUME_PROXY','PRICE_VOLUME_RESPONSE','OTHER_PARTICIPATION_PROXY']);
const OPENING=new Set(['COMPLETE','INCOMPLETE_BY_SOURCE_CONTRACT','NOT_APPLICABLE','UNKNOWN']);

export const D02_PVE241_CANONICAL_GUARD_VERSION='D02_PVE241_CANONICAL_GUARD_V0_2';
export const CANONICAL_SCHEMA_VERSION='D02_PROSPECTIVE_PV_PROVENANCE_RECEIPT_V0_1';

export function evaluateCanonicalPVE241Receipt(x={}){
 const r=[];
 if(x.schemaVersion!==CANONICAL_SCHEMA_VERSION)r.push('SCHEMA_VERSION_MISMATCH');
 if(x.researchOnly!==true)r.push('RESEARCH_ONLY_REQUIRED');
 if(x.outcomeBlind!==true)r.push('OUTCOME_BLIND_REQUIRED');
 if(typeof x.symbol!=='string'||!x.symbol.trim())r.push('SYMBOL_REQUIRED');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(String(x.marketDate||'')))r.push('MARKET_DATE_INVALID');
 if(!TF.has(x.timeframe))r.push('TIMEFRAME_INVALID');
 const s=x.source||{},a=x.availability||{},b=x.bar||{},v=x.volume||{},p=x.price||{},c=x.corporateAction||{},q=x.participation||{},m=x.admission||{};
 if(typeof s.provider!=='string'||!s.provider.trim())r.push('SOURCE_PROVIDER_REQUIRED');
 if(typeof s.endpoint!=='string'||!s.endpoint.trim())r.push('SOURCE_ENDPOINT_REQUIRED');
 if(!TIERS.has(s.sourceTier))r.push('SOURCE_TIER_INVALID');
 if(typeof s.rawPayloadHash!=='string'||s.rawPayloadHash.length<8)r.push('RAW_PAYLOAD_HASH_REQUIRED');
 const retrieved=iso(s.retrievedAt),available=iso(a.availableAt),first=iso(a.firstKnownAt),cutoff=iso(a.decisionCutoff),start=iso(b.barStart),end=iso(b.barEnd);
 if([retrieved,available,first,cutoff,start,end].some(z=>z===null))r.push('CLOCK_INVALID');
 else {
   if(start>=end)r.push('BAR_START_END_INVALID');
   if(end>first)r.push('BAR_NOT_COMPLETED_BEFORE_FIRST_KNOWN');
   if(available>first)r.push('AVAILABLE_AFTER_FIRST_KNOWN');
   if(first>cutoff)r.push('FIRST_KNOWN_AFTER_DECISION_CUTOFF');
   if(a.knownByDecisionCutoff!==(first<=cutoff))r.push('KNOWN_BY_DECISION_CUTOFF_INCONSISTENT');
   if(s.sourceTier!=='HISTORICAL_PROVIDER'&&retrieved>first)r.push('NONHISTORICAL_SOURCE_RETRIEVED_AFTER_FIRST_KNOWN');
 }
 if(b.timezone!=='Asia/Taipei')r.push('TIMEZONE_MUST_BE_ASIA_TAIPEI');
 if(b.completed!==true)r.push('BAR_NOT_COMPLETED');
 if(!RAW_UNITS.has(v.rawUnit))r.push('RAW_VOLUME_UNIT_INVALID');
 if(!finite(v.rawValue)||Number(v.rawValue)<0)r.push('RAW_VOLUME_VALUE_INVALID');
 if(v.normalizedUnit!=='SHARES')r.push('NORMALIZED_UNIT_MUST_BE_SHARES');
 if(!finite(v.normalizedValue)||Number(v.normalizedValue)<0)r.push('NORMALIZED_VOLUME_VALUE_INVALID');
 if(!CONV.has(v.conversionRule))r.push('CONVERSION_RULE_INVALID');
 if(!['PASS','BLOCKED','UNKNOWN'].includes(v.unitContinuityStatus))r.push('UNIT_CONTINUITY_STATUS_INVALID');
 if(v.rawUnit==='SHARES'){
   if(v.conversionRule!=='IDENTITY_SHARES')r.push('SHARES_REQUIRES_IDENTITY_CONVERSION');
   if(finite(v.rawValue)&&finite(v.normalizedValue)&&Number(v.rawValue)!==Number(v.normalizedValue))r.push('SHARES_IDENTITY_VALUE_MISMATCH');
 }
 if(v.rawUnit==='LOTS'){
   if(v.conversionRule!=='REGULAR_LOT_X_1000')r.push('LOTS_REQUIRES_X1000_CONVERSION');
   if(finite(v.rawValue)&&finite(v.normalizedValue)&&Number(v.rawValue)*1000!==Number(v.normalizedValue))r.push('LOTS_X1000_VALUE_MISMATCH');
 }
 if(x.timeframe!=='1d'&&v.rawUnit!=='LOTS')r.push('INTRADAY_REGULAR_LOT_REQUIRES_LOTS');
 if(x.timeframe==='1d'&&v.rawUnit!=='SHARES')r.push('DAILY_REQUIRES_SHARES');
 if(v.unitContinuityStatus!=='PASS'&&m.eligibleForProspectiveEvidence===true)r.push('UNIT_CONTINUITY_NOT_PASS_CANNOT_BE_ELIGIBLE');
 if(!ADJ.has(p.adjustmentSemantics))r.push('PRICE_ADJUSTMENT_SEMANTICS_INVALID');
 if(x.timeframe!=='1d'&&p.adjustmentSemantics==='ADJUSTED_DAILY_ONLY')r.push('INTRADAY_CANNOT_USE_ADJUSTED_DAILY_SEMANTICS');
 if(typeof p.corporateActionContaminated!=='boolean')r.push('CORPORATE_ACTION_CONTAMINATION_FLAG_REQUIRED');
 if(!CA.has(c.status))r.push('CORPORATE_ACTION_STATUS_INVALID');
 if(typeof c.knownByDecisionCutoff!=='boolean')r.push('CORPORATE_ACTION_KNOWN_FLAG_REQUIRED');
 if(c.status==='UNKNOWN'&&m.eligibleForProspectiveEvidence===true)r.push('UNKNOWN_CORPORATE_ACTION_CANNOT_BE_ELIGIBLE');
 if(['EX_RIGHT','EX_DIVIDEND','MULTIPLE'].includes(c.status)&&p.corporateActionContaminated!==true)r.push('MECHANICAL_CORPORATE_ACTION_MUST_BE_MARKED_CONTAMINATED');
 if(p.corporateActionContaminated===true&&m.corporateActionPass===true)r.push('CONTAMINATED_ROW_CANNOT_CLAIM_CORPORATE_ACTION_PASS');
 if(!ROOT.has(x.informationRoot))r.push('INFORMATION_ROOT_INVALID');
 if(!PROXY.has(q.proxyClass))r.push('PARTICIPATION_PROXY_CLASS_INVALID');
 if(q.intentIdentified!==false)r.push('INTENT_IDENTIFIED_MUST_REMAIN_FALSE');
 if(!OPENING.has(q.openingAuctionCompleteness))r.push('OPENING_AUCTION_COMPLETENESS_INVALID');
 if(q.proxyClass==='BID_ASK_SIDE_VOLUME'&&q.openingAuctionCompleteness==='COMPLETE')r.push('BID_ASK_SIDE_VOLUME_CANNOT_CLAIM_OPENING_COMPLETE');
 for(const k of ['pitPass','unitPass','corporateActionPass','sourcePass','intentFirewallPass','eligibleForProspectiveEvidence']) if(typeof m[k]!=='boolean')r.push('ADMISSION_BOOLEAN_REQUIRED_'+k);
 if(!Array.isArray(m.reasons))r.push('ADMISSION_REASONS_ARRAY_REQUIRED');
 if(m.pitPass===true&&!(a.knownByDecisionCutoff===true&&first!==null&&cutoff!==null&&first<=cutoff&&b.completed===true))r.push('PIT_PASS_INCONSISTENT');
 if(m.unitPass===true&&v.unitContinuityStatus!=='PASS')r.push('UNIT_PASS_INCONSISTENT');
 if(m.sourcePass===true&&(typeof s.rawPayloadHash!=='string'||s.rawPayloadHash.length<8))r.push('SOURCE_PASS_WITHOUT_HASH');
 if(m.intentFirewallPass===true&&q.intentIdentified!==false)r.push('INTENT_FIREWALL_PASS_INCONSISTENT');
 const requiredPass=m.pitPass===true&&m.unitPass===true&&m.corporateActionPass===true&&m.sourcePass===true&&m.intentFirewallPass===true;
 if(m.eligibleForProspectiveEvidence===true&&!requiredPass)r.push('ELIGIBLE_WITH_FAILED_ADMISSION_COMPONENT');
 if(s.sourceTier==='HISTORICAL_PROVIDER'&&m.eligibleForProspectiveEvidence===true)r.push('HISTORICAL_PROVIDER_ALONE_CANNOT_PROVE_PROSPECTIVE_DECISION_OBSERVABILITY');
 return r.length?no(r,{promotionEligible:false,outcomeAccessAuthorized:false,numericalTargetAuthorized:false,d16MethodSelectionAuthorized:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false})
 :ok({promotionEligible:m.eligibleForProspectiveEvidence===true,outcomeAccessAuthorized:false,numericalTargetAuthorized:false,d16MethodSelectionAuthorized:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}

export function bridgeCanonicalReceipt(x={},targetLane='GENERIC'){
 const g=evaluateCanonicalPVE241Receipt(x);
 const root=x.informationRoot;
 const q=x.participation||{};
 const base={guardPass:g.pass,guardReasons:g.reasons,marketDate:x.marketDate??null,symbol:x.symbol??null,timeframe:x.timeframe??null,sourceHash:x.source?.rawPayloadHash??null,firstKnownAt:x.availability?.firstKnownAt??null,decisionCutoffAt:x.availability?.decisionCutoff??null,priceInformationRoot:root==='PRICE_OHLC'||root==='PRICE_PLUS_VOLUME_DERIVED'?'PRICE_OHLC':null,volumeInformationRoot:root==='VOLUME_TURNOVER'||root==='PRICE_PLUS_VOLUME_DERIVED'?'VOLUME_TURNOVER':null,proxyClass:q.proxyClass??null,intentIdentified:q.intentIdentified??null,eligibleForProspectiveEvidence:g.pass&&g.promotionEligible};
 if(targetLane==='D02-02:H001'||targetLane==='D02-03:H20'||targetLane==='D02-06:H003') return {...base,evidenceKey:targetLane,commonSupportRequired:true,residualIncrementalityRequired:true,priceDerivedIndependentVote:false};
 if(targetLane==='D02-08') return {...base,moduleId:'D02-08',trueOfiEligible:false,participantIntentEligible:false,dynamicAbsorptionEligible:false,openingAuctionCompleteness:q.openingAuctionCompleteness??null};
 return base;
}
