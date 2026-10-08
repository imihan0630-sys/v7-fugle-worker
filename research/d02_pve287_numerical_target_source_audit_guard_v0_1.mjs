export const PVE287_SCHEMA="D02_PVE287_NUMERICAL_TARGET_SOURCE_AUDIT_GUARD_V0_1";
const EXPECTED=14;
export function evaluatePve287Audit(x={}){
 const r=[],entries=x.entries&&typeof x.entries==="object"?x.entries:{},ks=Object.keys(entries);
 if(x.status!=="OUTCOME_BLIND_NO_LEGAL_NUMERICAL_TARGET_SOURCE_CURRENTLY_AVAILABLE")r.push("STATUS_MISMATCH");
 if(ks.length!==EXPECTED)r.push("EVIDENCE_KEY_COUNT_MISMATCH");
 if(x.currentD02OutcomeInspected!==false)r.push("CURRENT_D02_OUTCOME_INSPECTION_FORBIDDEN");
 const authorized=ks.filter(k=>entries[k]?.targetFreezeAuthorized===true);
 if(authorized.length!==0)r.push("UNSUPPORTED_NUMERICAL_TARGET_AUTHORIZATION");
 for(const k of ks){
   const e=entries[k]||{};
   if(e.currentD02OutcomeUsed!==false)r.push("CURRENT_OUTCOME_USED_"+k);
   if(!Array.isArray(e.permittedRationalePaths)||e.permittedRationalePaths.length===0)r.push("RATIONALE_PATH_MISSING_"+k);
   if(!Array.isArray(e.currentAvailableLegalSources)||e.currentAvailableLegalSources.length!==0)r.push("LEGAL_SOURCE_SHOULD_BE_EMPTY_"+k);
   if(!Array.isArray(e.blockers)||e.blockers.length===0)r.push("BLOCKER_MISSING_"+k);
   if(!Array.isArray(e.forbiddenSubstitutes)||e.forbiddenSubstitutes.length===0)r.push("FORBIDDEN_SUBSTITUTE_MISSING_"+k);
 }
 if(entries["D02-01:SEMANTIC_GOVERNANCE"]?.permittedRationalePaths?.length!==1||entries["D02-01:SEMANTIC_GOVERNANCE"]?.permittedRationalePaths?.[0]!=="SEMANTIC_POLICY")r.push("D02_01_SEMANTIC_POLICY_ONLY_REQUIRED");
 if(!entries["D02-11:LIQUIDITY_COUNTERFACTUAL"]?.blockers?.includes("D14_COST_QUALITY_RECEIPT_PENDING"))r.push("D02_11_D14_BLOCKER_REQUIRED");
 return Object.freeze({schemaVersion:PVE287_SCHEMA,pass:r.length===0,reasons:Object.freeze([...new Set(r)]),evidenceKeyCount:ks.length,targetFreezeAuthorizedCount:authorized.length,numericalTargetFrozen:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}
