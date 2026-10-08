export const PVE288_SCHEMA="D02_PVE288_OPERATIONAL_RECOVERY_VS_CLEAN_DATE_SPLIT_V0_1";
const ms=v=>Number.isFinite(Date.parse(v))?Date.parse(v):null;
export function evaluatePve288(x={}){
 const r=[];
 const opPass=x.system1OperationalStatus==="OPERATIONAL_RECOVERY_PASS"&&x.system1GenuineProspective===true;
 const baselinePhysical=x.baselineRemediationPhysicalPass===true;
 const quotaPhysical=x.quotaRemediationPhysicalPass===true;
 const dep=ms(x.baselineRemediationDeployedAt),cap=ms(x.featureCapturedAt);
 const baselinePreFeature=baselinePhysical&&dep!==null&&cap!==null&&dep<cap;
 const identityFresh=x.baselineFreshnessIdentityPass===true;
 const clean=opPass&&baselinePreFeature&&quotaPhysical&&identityFresh&&x.noRetroactiveCredit===true;
 if(opPass!==true)r.push("SYSTEM1_OPERATIONAL_RECOVERY_NOT_PASS");
 if(!baselinePhysical)r.push("BASELINE_REMEDIATION_PHYSICAL_PASS_MISSING");
 if(baselinePhysical&&(dep===null||cap===null))r.push("BASELINE_OR_FEATURE_CLOCK_INVALID");
 if(baselinePhysical&&dep!==null&&cap!==null&&dep>=cap)r.push("BASELINE_REMEDIATION_NOT_PRE_FEATURE");
 if(!quotaPhysical)r.push("QUOTA_REMEDIATION_PHYSICAL_PASS_MISSING");
 if(!identityFresh)r.push("BASELINE_FRESHNESS_IDENTITY_NOT_PASS");
 if(x.noRetroactiveCredit!==true)r.push("NO_RETROACTIVE_CREDIT_GUARD_MISSING");
 return Object.freeze({
   schemaVersion:PVE288_SCHEMA,
   system1OperationalRecoveryPass:opPass,
   baselineRemediationPreFeaturePass:baselinePreFeature,
   d02CleanDateEligible:clean,
   reasons:Object.freeze([...new Set(r)]),
   operationalPassCanSubstituteForCleanDate:false,
   lateRemediationCanRetroactivelyCleanDate:false,
   maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false
 });
}
