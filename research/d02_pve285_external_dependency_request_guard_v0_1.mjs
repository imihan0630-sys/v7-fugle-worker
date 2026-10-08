export const PVE285_SCHEMA="D02_PVE285_EXTERNAL_DEPENDENCY_REQUEST_GUARD_V0_1";
const EXPECTED=new Set(["D02-02:H001","D02-03:H20","D02-04:DRYUP","D02-05:EXTREME_PARTICIPATION","D02-06:H003","D02-07:SVB20","D02-08:PROVIDER_PRESSURE","D02-09:PIVOT_SIGNED_VOLUME","D02-09:PARTICIPATION_TRAJECTORY","D02-10:TREND_VOLUME_INTERACTION","D02-12:TIME_OF_DAY_VOLUME_CURVE","D02-12:PRICE_BY_VOLUME_PROFILE"]);
export function evaluatePve285Request(x={}){
 const r=[],keys=new Set(x?.d16?.requiredEvidenceKeys||[]);
 if(x.status!=="OUTCOME_BLIND_CROSS_ROOM_DEPENDENCY_REQUESTS_FROZEN")r.push("STATUS_MISMATCH");
 if(x.outcomeAccessAuthorized!==false)r.push("OUTCOME_ACCESS_MUST_REMAIN_FALSE");
 if(x.formalCoreChanged!==false)r.push("FORMAL_CORE_CHANGE_FORBIDDEN");
 if(keys.size!==EXPECTED.size||[...EXPECTED].some(k=>!keys.has(k)))r.push("D16_EVIDENCE_KEY_SET_MISMATCH");
 if(x?.d16?.actualFrozenReceiptCountAtRequest!==0)r.push("D16_ACTUAL_RECEIPT_COUNT_MUST_MATCH_REQUEST_SNAPSHOT_ZERO");
 if(x?.d16?.constraints?.d02DoesNotPrescribeEstimator!==true)r.push("D02_ESTIMATOR_PRESCRIPTION_FORBIDDEN");
 if(x?.d16?.constraints?.unrelatedSda022ReceiptReusable!==false)r.push("SDA022_RECEIPT_REUSE_MUST_BE_FALSE");
 if(x?.d16?.constraints?.outcomeMustRemainClosedAtFreeze!==true)r.push("D16_OUTCOME_CLOSED_FREEZE_REQUIRED");
 if(x?.d14?.consumerEvidenceKey!=="D02-11:LIQUIDITY_COUNTERFACTUAL")r.push("D14_CONSUMER_KEY_MISMATCH");
 if(x?.d14?.constraints?.unknownCommissionAsZeroForbidden!==true)r.push("UNKNOWN_COMMISSION_ZERO_FORBIDDEN");
 if(x?.d14?.constraints?.unknownSlippageAsZeroForbidden!==true)r.push("UNKNOWN_SLIPPAGE_ZERO_FORBIDDEN");
 if(x?.d14?.constraints?.d02MaySelfInventCostAnchor!==false)r.push("D02_COST_ANCHOR_SELF_AUTH_FORBIDDEN");
 if(x?.d14?.constraints?.returnUnknownBlockedWhenEvidenceAbsent!==true)r.push("D14_UNKNOWN_BLOCKED_RETURN_REQUIRED");
 return Object.freeze({schemaVersion:PVE285_SCHEMA,pass:r.length===0,reasons:Object.freeze([...new Set(r)]),d16RequestedKeyCount:keys.size,d14ConsumerKey:x?.d14?.consumerEvidenceKey??null,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}
