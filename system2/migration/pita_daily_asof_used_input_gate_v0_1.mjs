// DATA_LANE #1068 -- owner-requested separation of daily prospective PIT-A
// input availability from retrospective PIT-B issuer-vintage certification.
// RESEARCH-ONLY Class A design/check: this never alters the BUILD assessor,
// qualification policy, stage1 selection, Frozen, Shadow or any production path.
import {sha256Hex} from '../runtime/decision_archive.mjs';

const SHA=/^[a-f0-9]{64}$/,DAY=/^\d{4}-\d\d-\d\d$/,
 UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const fail=code=>{throw Error('S2_PITA_USED_INPUT_'+code);};
const utc=x=>typeof x==='string'&&UTC.test(x)&&Number.isFinite(Date.parse(x))&&
 new Date(Date.parse(x)).toISOString().slice(0,19)===x.slice(0,19);
const date=x=>typeof x==='string'&&DAY.test(x)&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const signed=async(o,key='receiptHash')=>{
 if(!o||typeof o!=='object'||Array.isArray(o)||!SHA.test(o[key]||''))return false;
 const { [key]:signature,...payload}=o;
 return signature===await sha256Hex(payload);
};
// Not an editable strategy factor definition. A read-only source intake profile;
// selection-producing Stage1 MUST separately pin its actual strategy-version
// factor/use manifest through BUILD + owner/AUDIT before any PIT acceptance.
export const SOURCE_CORE_PROFILE_V0_1=Object.freeze({
 id:'PITA_SOURCE_CORE_DIAGNOSTIC_V0_1',
 required:Object.freeze([
  'A1_RAW_PRICE_VOLUME_61',
  'CURRENT_COMMON_SHARE_AT_CUT',
  'CA_PRICE_SPACE_CONTINUITY_FOR_USED_61_BARS',
  'TRADING_STATUS_AT_CUT',
 ]),
 strategyFactorsUnspecified:true,
 selectionUseApproved:false,
});
const required=new Set(SOURCE_CORE_PROFILE_V0_1.required);
const HISTORIC_ONLY=Object.freeze([
 'CFI_HISTORICAL_61_DAY_EFFECTIVE_VINTAGE',
 'GLOBAL_SIX_CA_NEGATIVE_NO_EVENT_HISTORY',
 'HISTORIC_BACKTEST_REVISED_ISSUER_VINTAGES'
]);
const compare=(a,b)=>Date.parse(a)<=Date.parse(b);
function rowReason(x,cut,marketDate,market,symbol){
 if(x===undefined)return 'MISSING_REQUIRED_INPUT';
 if(!x||typeof x!=='object'||Array.isArray(x)||
   x.status==='NA'||x.status==='NOT_USED')return 'REQUIRED_INPUT_INVALID_OR_SKIPPED';
 if(!['UNKNOWN','SOURCE_ONLY','ASOF_EVIDENCE_AUDITED'].includes(x.status))
   return 'INPUT_STATE_INVALID';
 if(x.status==='UNKNOWN')return 'MISSING_SOURCE_OR_AUTHORITY_UNKNOWN';
 if(!SHA.test(x.originalNativeSha256||'')||!SHA.test(x.sourceReceiptHash||''))
   return 'SOURCE_SHA_OR_RECEIPT_MISSING';
 if(!utc(x.firstPhysicalObservedAtUtc)||!utc(x.availableAtUtc)||
   !utc(x.firstKnownAtUtc)||!compare(x.firstKnownAtUtc,x.availableAtUtc)||
   !compare(x.firstPhysicalObservedAtUtc,cut)||
   !compare(x.availableAtUtc,cut)||
   !compare(x.firstKnownAtUtc,cut)||
   !date(x.marketDate)||x.marketDate!==marketDate||
   x.market!==market||x.symbol!==symbol)
   return 'SOURCE_PIT_CLOCK_OR_DATE_INVALID';
 if(x.status==='SOURCE_ONLY')return 'INDEPENDENT_INPUT_SCOPE_AUDIT_REQUIRED';
 if(x.originalIndependentlyRehashed!==true||
   !SHA.test(x.independentAuditSha256||'')||
   x.auditorIndependence!=='SEPARATE_FROM_DATA_LANE')
   return 'EXTERNAL_AUDIT_OF_USED_INPUT_REQUIRED';
 return null;
}
// The 2026-09-16 actual 2330 ex-dividend event demonstrates why raw
// 61-day cross-event momentum MUST NOT pass only because CA originals exist.
// A checked mapping of the actual price-space transform is required, or
// an independently proven rule excluding a crossing-factor use.
function extraReason(id,x){
 if(id==='A1_RAW_PRICE_VOLUME_61'&&
   !(x.officialTradingSessionCount===61&&x.nativeRowsVerifiedCount===61&&
     x.priceSpace==='RAW'&&x.historicalPublicationClaimed!==true))
    return 'SOURCE_61_RAW_BARS_OR_PRICE_SPACE_NOT_VERIFIED';
 if(id==='CURRENT_COMMON_SHARE_AT_CUT'&&
    !(x.issuerClass==='ORDINARY_COMMON_SHARE'&&
      /^ES[A-Z]{4}$/.test(x.cfi||'')&&
      x.nativeClassEffectiveAtDecisionVerified===true))
    return 'CURRENT_COMMON_SHARE_ASOF_NOT_ATTESTED';
 if(id==='CA_PRICE_SPACE_CONTINUITY_FOR_USED_61_BARS'&&
   !(x.usedFeaturePriceSpaceConsistent===true&&
     x.knownActionsReconciled===true&&
     x.actionAdjustmentOrExclusionAttested===true))
    return 'USED_PRICE_FEATURES_CA_DISCONTINUITY_UNRESOLVED';
 if(id==='TRADING_STATUS_AT_CUT'&&
   !(x.tradeabilitySourceCurrent===true&&
     x.haltReinstatementStateIndependentlyChecked===true&&
     x.tradingStatus==='TRADEABLE'))
    return 'TRADING_STATUS_ASOF_UNVERIFIED';
 return null;
}
// A caller cannot drop one of the four fixed input groups, waive a missing
// mandatory field via "unused", or self-sign a strategy factor profile.
export async function inspectPitADailyUsedInputsV0_1({
 evidence,expectedIndependentAuditHash=null
}={}){
 if(!evidence||evidence.schemaVersion!=='S2_DATA_PITA_DAILY_USED_INPUT_EVIDENCE_V0_1'||
    evidence.profileId!==SOURCE_CORE_PROFILE_V0_1.id||
    !date(evidence.marketDate)||!utc(evidence.decisionCutAtUtc)||
    evidence.decisionCutAtUtc.slice(0,10)!==evidence.marketDate||
    !['TWSE','TPEX'].includes(evidence.market)||!/^[1-9]\d{3}$/.test(evidence.symbol||'')||
    !signed(evidence)||!evidence.inputs||typeof evidence.inputs!=='object'||
    Array.isArray(evidence.inputs)||Object.keys(evidence.inputs).some(k=>!required.has(k))||
    evidence.selectionAuthorized!==false||evidence.frozenD1Written!==false||
    evidence.selectedCount!==null||evidence.zeroPickDay!==null||
    evidence.pitBReplayUsedAsSubstitute!==false)
   fail('HANDOFF_IDENTITY_SIGNATURE_OR_PROTECTED_OUTPUT_INVALID');
 const checked=[];
 for(const id of SOURCE_CORE_PROFILE_V0_1.required){
   const fact=evidence.inputs[id];
   const why=rowReason(fact,evidence.decisionCutAtUtc,evidence.marketDate,evidence.market,evidence.symbol)||
     extraReason(id,fact);
   checked.push({id,status:why?'UNKNOWN':'ASOF_REQUIRED_INPUT_ATTESTED',
     reason:why,sourceOriginalSha256:fact?.originalNativeSha256||null,
     independentAuditSha256:fact?.independentAuditSha256||null});
 }
 const allInputsAudited=checked.every(x=>x.reason===null);
 // This additionally checks independently published audit hash, never from
 // DATA self signature or its own hash field, and never grants Stage1 by itself.
 const externallyPinnedAudit=SHA.test(expectedIndependentAuditHash||'')&&
   expectedIndependentAuditHash===evidence.externalAuditReceiptSha256&&
   checked.every(x=>x.independentAuditSha256===expectedIndependentAuditHash);
 const profileMayAuthorizeSelection=SOURCE_CORE_PROFILE_V0_1.selectionUseApproved;
 const base={
   schemaVersion:'S2_DATA_PITA_USED_INPUT_DIAGNOSTIC_V0_1',
   marketDate:evidence.marketDate,market:evidence.market,symbol:evidence.symbol,
   decisionCutAtUtc:evidence.decisionCutAtUtc,
   intakeProfileId:SOURCE_CORE_PROFILE_V0_1.id,
   checkedRequiredCount:checked.length,
   requiredAsOfAuditedCount:checked.filter(x=>!x.reason).length,
   requiredUnknownCount:checked.filter(x=>x.reason).length,
   details:checked,
   excludedPITBOnlyRequirements:HISTORIC_ONLY,
   excludedDoesNotMeanHistoricallyCertified:true,
   allSourceCoreInputsAudited:allInputsAudited,
   externalAuditDigestPinned:externallyPinnedAudit,
   strategyFactorUseManifestPinned:false,
   status:allInputsAudited&&externallyPinnedAudit
    ?'SOURCE_CORE_ASOF_PROOF_COMPLETE__STRATEGY_USE_MANIFEST_UNAPPROVED'
    :'REQUIRED_ASOF_DATA_OR_INDEPENDENT_AUDIT_UNKNOWN',
   pitBHistoricalReplayCertified:false,
   fullPITScopeAccepted:false,selectedCount:null,zeroPickDay:null,
   stage1EvaluationAuthorized:false,selectionAuthorized:false,
   frozenD1Written:false,shadowAuthorized:false,
   cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
   system1FormalCoreChanged:false,
   // Deliberate assertion that caller cannot authorize a real Stage1 pick.
   profileMayAuthorizeSelection,
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
