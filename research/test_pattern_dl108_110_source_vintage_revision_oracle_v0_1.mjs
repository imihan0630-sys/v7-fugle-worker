import assert from "node:assert/strict";
import {
  classifySourceVintageEquivalence,classifyCorporateActionRevision,validateSourceVintageLedger,
  classifyCorrectedReplayAuthority,validateHoldoutNonReset,validateRevisionDenominator,
  validateRevisedParentChildSupport,validateOldR7Immutability
} from "./pattern_dl108_110_source_vintage_revision_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64),h2="b".repeat(64);
const baseS={requestedQueryId:"Q1",normalizedSemanticSetHash:h,knowledgeClockHash:h,exactSessionHash:h,sourceHistoryHash:h,denominatorHash:h,canonicalR7PayloadHash:h};

t("D10801 exact source vintage replay equivalent",()=>assert.equal(classifySourceVintageEquivalence(baseS,{...baseS}).status,"EXACT_CAPTURE_REPLAY_EQUIVALENT"));
t("D10802 semantic-equivalent new capture with different sourceHistoryHash is not exact",()=>assert.equal(classifySourceVintageEquivalence(baseS,{...baseS,sourceHistoryHash:h2}).status,"SEMANTICALLY_EQUIVALENT_NEW_CAPTURE"));
t("D10803 semantic revision requires new replay",()=>assert.equal(classifySourceVintageEquivalence(baseS,{...baseS,normalizedSemanticSetHash:h2}).status,"SEMANTIC_REVISION_REQUIRES_NEW_REPLAY"));
t("D10804 knowledge-clock change requires new replay",()=>assert.equal(classifySourceVintageEquivalence(baseS,{...baseS,knowledgeClockHash:h2}).status,"KNOWLEDGE_CLOCK_REVISION_REQUIRES_NEW_REPLAY"));
t("D10805 session identity drift is provenance drift",()=>assert.equal(classifySourceVintageEquivalence(baseS,{...baseS,exactSessionHash:h2}).status,"PROVENANCE_DRIFT"));

const cutoff="2021-06-15T14:30:00+08:00";
t("D10901 duplicate semantic observation needs no replay",()=>assert.equal(classifyCorporateActionRevision({predictorCutoff:cutoff,oldSemanticHash:h,newSemanticHash:h,oldOutcomeState:"ACTIVE",newOutcomeState:"ACTIVE",oldEffectiveDate:"2021-06-20",newEffectiveDate:"2021-06-20",oldContinuityEffectHash:h,newContinuityEffectHash:h,firstKnownAt:"2021-06-10T10:00:00+08:00"}).replayDisposition,"NO_REPLAY_NEEDED"));
t("D10902 preexisting public information missing from archive is pipeline error",()=>assert.equal(classifyCorporateActionRevision({predictorCutoff:cutoff,oldSemanticHash:h,newSemanticHash:h2,firstKnownAt:"2021-06-10T10:00:00+08:00",eventWasMissingInOldArchive:true}).replayDisposition,"CORRECTED_REPLAY_REQUIRED_PIPELINE_ERROR"));
t("D10903 late public correction cannot be backdated",()=>assert.equal(classifyCorporateActionRevision({predictorCutoff:cutoff,oldSemanticHash:h,newSemanticHash:h2,firstKnownAt:"2021-06-16T10:00:00+08:00",eventWasMissingInOldArchive:true}).replayDisposition,"PIT_VIEW_UNCHANGED_LATE_CORRECTION"));
t("D10904 late cancellation keeps old PIT state",()=>assert.equal(classifyCorporateActionRevision({predictorCutoff:cutoff,oldSemanticHash:h,newSemanticHash:h2,oldOutcomeState:"ACTIVE",newOutcomeState:"CANCELLED",firstKnownAt:"2021-06-16T10:00:00+08:00"}).replayDisposition,"PIT_VIEW_UNCHANGED_LATE_CANCELLATION"));
t("D10905 preexisting effective-date correction is pipeline error",()=>assert.equal(classifyCorporateActionRevision({predictorCutoff:cutoff,oldSemanticHash:h,newSemanticHash:h2,oldEffectiveDate:"2021-06-20",newEffectiveDate:"2021-06-21",firstKnownAt:"2021-06-10T10:00:00+08:00"}).revisionClass,"R4_EFFECTIVE_DATE_CORRECTION_WITH_PREEXISTING_KNOWLEDGE"));
t("D10906 late effective-date correction does not rewrite old PIT",()=>assert.equal(classifyCorporateActionRevision({predictorCutoff:cutoff,oldSemanticHash:h,newSemanticHash:h2,oldEffectiveDate:"2021-06-20",newEffectiveDate:"2021-06-21",firstKnownAt:"2021-06-17T10:00:00+08:00"}).replayDisposition,"PIT_VIEW_UNCHANGED_LATE_CORRECTION"));
t("D10907 unknown knowledge time blocks",()=>assert.equal(classifyCorporateActionRevision({predictorCutoff:cutoff,oldSemanticHash:h,newSemanticHash:h2}).replayDisposition,"BLOCKED_UNKNOWN_KNOWLEDGE_TIME"));
t("D10908 coverage-only upgrade does not auto-rewrite old incomplete archive",()=>assert.equal(classifyCorporateActionRevision({predictorCutoff:cutoff,oldSemanticHash:h,newSemanticHash:h,newCoverageOnly:true,oldArchiveHadCompleteCoverageAtFreeze:false}).replayDisposition,"CURRENT_TRUTH_ONLY_UPDATE"));

const ledger={witnessRequestId:"W1",experimentFamilyId:"E1",moduleId:"D01-07",market:"TWSE",symbol:"1101",oldSourceVintageId:"V1",newSourceVintageId:"V2",oldSourceHistoryHash:h,newSourceHistoryHash:h2,originalPredictorCutoff:cutoff,newEvidenceObservedAt:"2026-10-08T10:00:00+08:00",outcomeAccessStateAtDiscovery:"CLOSED",finalHoldoutStateAtDiscovery:"UNTOUCHED",searchRegistryEntryId:"S1",migrationClass:"PIPELINE_ERROR_CORRECTED_REPLAY"};
t("D11001 complete source-vintage ledger passes",()=>assert.equal(validateSourceVintageLedger(ledger).status,"SOURCE_VINTAGE_LEDGER_VALID"));
t("D11002 bad hash fails ledger",()=>assert.equal(validateSourceVintageLedger({...ledger,newSourceHistoryHash:"bad"}).status,"SOURCE_HISTORY_HASH_INVALID"));
t("D11003 preoutcome pipeline correction can replay cleanly",()=>assert.equal(classifyCorrectedReplayAuthority({migrationClass:"PIPELINE_ERROR_CORRECTED_REPLAY",outcomeAccessStateAtDiscovery:"CLOSED",finalHoldoutStateAtDiscovery:"UNTOUCHED"}).status,"CORRECTED_REPLAY_PREOUTCOME_ELIGIBLE"));
t("D11004 development-open correction becomes new analysis version",()=>assert.equal(classifyCorrectedReplayAuthority({migrationClass:"PIPELINE_ERROR_CORRECTED_REPLAY",outcomeAccessStateAtDiscovery:"DEVELOPMENT_OUTCOMES_OPEN",finalHoldoutStateAtDiscovery:"UNTOUCHED"}).status,"CORRECTED_REPLAY_NEW_ANALYSIS_VERSION"));
t("D11005 final-holdout-open correction requires fresh confirmation",()=>{const x=classifyCorrectedReplayAuthority({migrationClass:"PIPELINE_ERROR_CORRECTED_REPLAY",outcomeAccessStateAtDiscovery:"FINAL_HOLDOUT_OPEN",finalHoldoutStateAtDiscovery:"CONSUMED"});assert.equal(x.status,"CORRECTED_REPLAY_DIAGNOSTIC_FRESH_CONFIRMATION_REQUIRED");assert.equal(x.finalHoldoutState,"CONSUMED");});
t("D11006 source correction cannot reset consumed holdout",()=>assert.equal(validateHoldoutNonReset({before:"CONSUMED",after:"UNTOUCHED"}).status,"HOLDOUT_RESET_PROHIBITED"));
t("D11007 consumed holdout remaining consumed passes",()=>assert.equal(validateHoldoutNonReset({before:"CONSUMED",after:"CONSUMED"}).status,"HOLDOUT_STATE_VALID"));

const d0={opportunityCount:100,noStructureCount:70,dataBlockedCount:10,structureEmittedCount:20};
const d1={opportunityCount:100,noStructureCount:68,dataBlockedCount:9,structureEmittedCount:23};
t("D11008 revised denominators can change but must stay accounted",()=>{const x=validateRevisionDenominator(d0,d1);assert.equal(x.status,"REVISION_DENOMINATORS_ACCOUNTED");assert.equal(x.changed,true);});
t("D11009 hidden denominator loss is rejected",()=>assert.equal(validateRevisionDenominator(d0,{opportunityCount:100,noStructureCount:68,dataBlockedCount:9,structureEmittedCount:20}).status,"NEW_DENOMINATOR_NOT_ACCOUNTED"));

const pair={sourceVintageId:"V2",sourceHistoryHash:h2,exactSessionHash:h,universeVersion:"U1",foldId:"F1",blockedRowPolicyId:"B1",censoringPolicyId:"C1",horizon:5,costTreatmentId:"COST1"};
t("D11010 revised parent and child need same source vintage",()=>assert.equal(validateRevisedParentChildSupport(pair,{...pair}).status,"REVISED_PARENT_CHILD_SUPPORT_VALID"));
t("D11011 revised child cannot pair with old parent",()=>assert.equal(validateRevisedParentChildSupport(pair,{...pair,sourceVintageId:"V1"}).status,"REVISED_PARENT_CHILD_SUPPORT_MISMATCH"));

t("D11012 old R7 mutation rejected",()=>assert.equal(validateOldR7Immutability({oldReceiptHashBefore:h,oldReceiptHashAfter:h2,newReceiptId:"R7NEW"}).status,"OLD_R7_MUTATED"));
t("D11013 append-only corrected R7 passes",()=>assert.equal(validateOldR7Immutability({oldReceiptHashBefore:h,oldReceiptHashAfter:h,newReceiptId:"R7NEW"}).status,"OLD_R7_IMMUTABLE_NEW_REPLAY_APPENDED"));
t("D11014 no replay still preserves old R7",()=>assert.equal(validateOldR7Immutability({oldReceiptHashBefore:h,oldReceiptHashAfter:h}).status,"OLD_R7_IMMUTABLE_NO_NEW_REPLAY"));

console.log(`SUMMARY ${p}/27 PASS`);
