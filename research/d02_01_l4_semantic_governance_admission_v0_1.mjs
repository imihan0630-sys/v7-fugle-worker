const n=v=>Number.isFinite(Number(v)), t=v=>Number.isFinite(Date.parse(v))?Date.parse(v):null, u=a=>[...new Set(a)];
const ok=(x={})=>({pass:true,reasons:[],...x}), no=(r,x={})=>({pass:false,reasons:u(r),...x});
const S=new Set(['VALID_SESSION_POSITIVE_VOLUME','VALID_SESSION_ZERO_VOLUME','VERIFIED_SUSPENSION_OR_NON_SYMBOL_SESSION','EXPECTED_SESSION_MISSING_SOURCE','SOURCE_SEMANTICS_UNKNOWN']);
const C=new Set(['NONE','UNIT_SCALE','SUPPLY_CHANGE','UNKNOWN']), D=new Set(['ELIGIBLE','BLOCKED','UNKNOWN']);
export const D02_01_L4_SEMANTIC_ADMISSION_VERSION='D02_01_L4_SEMANTIC_ADMISSION_V0_1';
export function evaluateD0201SemanticRow(x={}){
 const r=[], f=t(x.featureFirstKnownAt), c=t(x.decisionCutoffAt);
 if(!x.scanDate)r.push('MISSING_SCAN_DATE'); if(!x.eventId)r.push('MISSING_EVENT_ID');
 if(x.sourceCapturedProspectively!==true)r.push('RETROSPECTIVE_CAPTURE_NOT_L4_EVIDENCE');
 for(const [k,v] of [['DATA_QA_NOT_PASS',x.dataQaPass],['GENERATION_NOT_ALIGNED',x.generationAligned],['FORMAL_ISOLATION_NOT_PASS',x.formalIsolationPass],['SEMANTIC_VERSION_NOT_FROZEN',x.semanticVersionFrozen],['UNIT_PROVENANCE_UNKNOWN',x.unitProvenanceKnown],['SESSION_RECEIPT_UNKNOWN',x.sessionReceiptKnown],['COUNTERFACTUAL_NOT_FROZEN_ADAPTER',x.counterfactualComputedByFrozenAdapter]]) if(v!==true)r.push(k);
 if(!['DAILY','INTRADAY_REGULAR_LOT'].includes(x.lane))r.push('LANE_INVALID');
 if(x.lane==='DAILY'&&x.volumeUnit!=='SHARES')r.push('DAILY_UNIT_MUST_BE_SHARES');
 if(x.lane==='INTRADAY_REGULAR_LOT'&&x.volumeUnit!=='LOTS')r.push('INTRADAY_REGULAR_UNIT_MUST_BE_LOTS');
 if(!S.has(x.expectedSessionState))r.push('SESSION_STATE_INVALID'); if(!C.has(x.corporateActionClass))r.push('CORPORATE_ACTION_CLASS_INVALID');
 if(!D.has(x.governedClassification))r.push('GOVERNED_CLASSIFICATION_INVALID'); if(!D.has(x.ungovernedCounterfactualClassification))r.push('COUNTERFACTUAL_CLASSIFICATION_INVALID');
 if(!n(x.observedRawVolume)||Number(x.observedRawVolume)<0)r.push('RAW_VOLUME_INVALID');
 if(f===null||c===null)r.push('FEATURE_OR_CUTOFF_CLOCK_INVALID'); else if(f>c)r.push('FEATURE_KNOWN_AFTER_DECISION_CUTOFF');
 if(x.expectedSessionState==='VALID_SESSION_ZERO_VOLUME'){if(Number(x.observedRawVolume)!==0)r.push('ZERO_SESSION_MUST_HAVE_ZERO_RAW_VOLUME');if(x.olderRowSubstituted===true)r.push('ZERO_SESSION_OLDER_ROW_SUBSTITUTION_FORBIDDEN');}
 if(x.expectedSessionState==='EXPECTED_SESSION_MISSING_SOURCE'&&x.olderRowSubstituted===true)r.push('MISSING_SESSION_OLDER_ROW_SUBSTITUTION_FORBIDDEN');
 if(x.expectedSessionState==='VERIFIED_SUSPENSION_OR_NON_SYMBOL_SESSION'&&x.governedClassification==='ELIGIBLE')r.push('SUSPENSION_CANNOT_BE_ELIGIBLE_VOLUME_SESSION');
 if(x.expectedSessionState==='SOURCE_SEMANTICS_UNKNOWN'&&x.governedClassification==='ELIGIBLE')r.push('UNKNOWN_SOURCE_SEMANTICS_CANNOT_BE_ELIGIBLE');
 if(x.corporateActionClass==='UNIT_SCALE'&&x.unitScaleBridgeVerified!==true&&x.unitScaleResetClean20Sessions!==true)r.push('UNIT_SCALE_CONTINUITY_NOT_PROVEN');
 if(x.corporateActionClass==='SUPPLY_CHANGE'&&x.interpretationMode==='COMPARABLE_PARTICIPATION'&&x.supplyDenominatorNormalized!==true&&x.fullPostBreak20Sessions!==true)r.push('SUPPLY_CHANGE_COMPARABLE_PARTICIPATION_NOT_PROVEN');
 if(['UNIT_SCALE','SUPPLY_CHANGE'].includes(x.corporateActionClass)){const a=t(x.corporateActionKnownAt);if(a===null)r.push('CORPORATE_ACTION_KNOWN_AT_INVALID');else if(f!==null&&a>f)r.push('CORPORATE_ACTION_LATE_KNOWN_AT_FEATURE_TIME');}
 if(x.interpretationMode&&!['RAW_ACTIVITY','COMPARABLE_PARTICIPATION'].includes(x.interpretationMode))r.push('INTERPRETATION_MODE_INVALID');
 const delta=D.has(x.governedClassification)&&D.has(x.ungovernedCounterfactualClassification)&&x.governedClassification!==x.ungovernedCounterfactualClassification;
 return r.length?no(r,{classificationDelta:delta}):ok({classificationDelta:delta,materialPreventionCandidate:delta&&x.governedClassification!=='ELIGIBLE'&&x.ungovernedCounterfactualClassification==='ELIGIBLE'});
}
export function evaluateD0201SemanticDataset(rows=[]){
 const a=Array.isArray(rows)?rows:[], seen=new Map(), dup=[];
 const receipts=a.map(x=>{if(x?.eventId){if(seen.has(x.eventId))dup.push(seen.get(x.eventId)===x.scanDate?'DUPLICATE_EVENT_ID_SAME_DATE':'DUPLICATE_EVENT_ID_CROSS_DATE');else seen.set(x.eventId,x.scanDate);}return{eventId:x?.eventId??null,scanDate:x?.scanDate??null,defectType:x?.defectType??null,admission:evaluateD0201SemanticRow(x)};});
 const fatal=dup.length>0,e=receipts.filter(x=>x.admission.pass),d=e.filter(x=>x.admission.classificationDelta),p=e.filter(x=>x.admission.materialPreventionCandidate);
 return{schemaVersion:'0.1',admissionVersion:D02_01_L4_SEMANTIC_ADMISSION_VERSION,outcomeBlind:true,rowCount:a.length,eligibleSemanticReceipts:e.length,distinctProspectiveDates:u(e.map(x=>x.scanDate).filter(Boolean)).length,classificationDeltaCount:d.length,materialPreventionCandidateCount:p.length,defectTypes:u(e.map(x=>x.defectType).filter(Boolean)),fatalIntegrity:fatal,datasetReasons:u(dup),l4SemanticEvidenceAdmissionReady:!fatal&&e.length>0,l4MaturityAuthorized:false,alphaClaimAuthorized:false,economicOutcomeAccessAuthorized:false,formalCoreChangeAuthorized:false,receipts};
}
