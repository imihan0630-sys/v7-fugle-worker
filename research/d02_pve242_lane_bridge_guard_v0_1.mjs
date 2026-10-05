import {evaluateCanonicalPVE241Receipt} from './d02_pve241_canonical_guard_v0_2.mjs';
const uniq=a=>[...new Set(a)];
const iso=v=>Number.isFinite(Date.parse(v))?Date.parse(v):null;
const no=(r,x={})=>({pass:false,reasons:uniq(r),...x});
const ok=(x={})=>({pass:true,reasons:[],...x});
const intraday=new Set(['1m','5m','15m']);
const d0208Proxy=new Set(['BID_ASK_SIDE_VOLUME','SIGNED_VOLUME_PROXY','OTHER_PARTICIPATION_PROXY']);
export const D02_PVE242_LANE_BRIDGE_GUARD_VERSION='D02_PVE242_LANE_BRIDGE_GUARD_V0_1';
function taipeiMinuteOfDay(v){const m=String(v??'').match(/T(\d{2}):(\d{2}):\d{2}\+08:00$/);return m?Number(m[1])*60+Number(m[2]):null;}
export function evaluatePVE242LaneBridge(receipt={},lane='GENERIC',ctx={}){
 const g=evaluateCanonicalPVE241Receipt(receipt),r=[...g.reasons];
 if(!g.pass||!g.promotionEligible)r.push('CANONICAL_RECEIPT_NOT_PROSPECTIVE_ELIGIBLE');
 const tf=receipt.timeframe;
 if(lane==='D02-02:H001'){
   if(tf!=='15m')r.push('H001_REQUIRES_15M_RECEIPT');
   const slot=taipeiMinuteOfDay(receipt.bar?.barStart);
   if(slot===null||slot<615)r.push('H001_SLOT_BEFORE_10_15_OR_INVALID');
   if(ctx.sameSlotBaselineClean!==true)r.push('H001_BASELINE_NOT_CLEAN');
   if(Number(ctx.slotHistoryCount)<20)r.push('H001_SLOT_HISTORY_LT_20');
   if(ctx.currentSlotCoverageValid!==true)r.push('H001_CURRENT_SLOT_COVERAGE_INVALID');
   if(ctx.commonSupportPass!==true)r.push('H001_COMMON_SUPPORT_NOT_PASS');
 } else if(lane==='D02-03:H20'){
   if(tf!=='15m')r.push('H20_REQUIRES_15M_RECEIPT');
   if(ctx.primitiveEventOwner!=='D01-05')r.push('H20_PRIMITIVE_OWNER_INVALID');
   if(!ctx.primitiveEventId||ctx.primitiveEventId!==ctx.comparatorPrimitiveEventId)r.push('H20_PRIMITIVE_EVENT_ID_MISMATCH');
   if(ctx.anchorBarStart!==receipt.bar?.barStart||ctx.comparatorAnchorBarStart!==receipt.bar?.barStart)r.push('H20_ANCHOR_MISMATCH');
   if(!ctx.outcomeHorizon||ctx.outcomeHorizon!==ctx.comparatorOutcomeHorizon)r.push('H20_OUTCOME_HORIZON_MISMATCH');
 } else if(lane==='D02-06:H003'){
   if(tf!=='15m')r.push('H003_REQUIRES_15M_RECEIPT');
   if(ctx.sameFeatureBarForPAndPV!==true)r.push('H003_P_PV_FEATURE_BAR_MISMATCH');
   if(ctx.h003HypothesisCleanEvent!==true)r.push('H003_NOT_HYPOTHESIS_CLEAN_EVENT');
   if(ctx.preEventOnlyExpiry===true)r.push('H003_PRE_EVENT_ONLY_EXPIRY_QA_ONLY');
   const first=iso(receipt.availability?.firstKnownAt),barEnd=iso(receipt.bar?.barEnd);
   if(first===null||barEnd===null||first<barEnd)r.push('H003_FEATURE_CLOCK_BEFORE_BAR_END');
 } else if(lane==='D02-08'){
   if(!intraday.has(tf))r.push('D02_08_REQUIRES_INTRADAY_RECEIPT');
   if(!d0208Proxy.has(receipt.participation?.proxyClass))r.push('D02_08_PROXY_CLASS_NOT_PRESSURE_CAPABLE');
   if(receipt.participation?.intentIdentified!==false)r.push('D02_08_INTENT_MUST_REMAIN_FALSE');
   if(ctx.pressureSourceContinuityPass!==true)r.push('D02_08_PRESSURE_SOURCE_CONTINUITY_NOT_PASS');
   if(!Number.isFinite(Number(ctx.classificationCoverage))||Number(ctx.classificationCoverage)<0||Number(ctx.classificationCoverage)>1)r.push('D02_08_CLASSIFICATION_COVERAGE_INVALID');
   if(ctx.trueOfiEligible!==false)r.push('D02_08_TRUE_OFI_MUST_REMAIN_FALSE');
   if(ctx.participantIntentEligible!==false)r.push('D02_08_PARTICIPANT_INTENT_MUST_REMAIN_FALSE');
   if(ctx.dynamicAbsorptionEligible!==false)r.push('D02_08_DYNAMIC_ABSORPTION_MUST_REMAIN_FALSE');
 } else if(lane==='GENERIC_PROVENANCE') {
 } else r.push('UNSUPPORTED_TARGET_LANE');
 const pass=r.length===0;
 return pass?ok({lane,receiptEligible:true,laneEligible:true,cleanSelectionDateAuthorized:false,outcomeAccessAuthorized:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false})
 :no(r,{lane,receiptEligible:g.pass&&g.promotionEligible,laneEligible:false,cleanSelectionDateAuthorized:false,outcomeAccessAuthorized:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}
