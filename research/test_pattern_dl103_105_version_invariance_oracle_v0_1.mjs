import assert from "node:assert/strict";
import {
  validateVersionMetadata,validateHistoricalReplayEligibility,classifyVersionRepresentation,
  classifyEpisodeMigration,validateMigrationLedger,validateExactEquivalence,
  validatePrefixInvariance,validateOldReceiptImmutability,validateNegativeCaseRetention
} from "./pattern_dl103_105_version_invariance_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64);
const meta={detectorFamilyId:"D01-CANDLE",detectorVersion:"v1",specificationHash:h,codeHash:h,detectorSpecFrozenAt:"2026-10-01T00:00:00+08:00",experimentFamilyId:"E1",parameterFamilyId:"P1"};

t("D10301 complete detector metadata passes",()=>assert.equal(validateVersionMetadata(meta).status,"DETECTOR_VERSION_METADATA_VALID"));
t("D10302 missing spec hash fails",()=>assert.equal(validateVersionMetadata({...meta,specificationHash:null}).status,"DETECTOR_VERSION_METADATA_INCOMPLETE"));
t("D10303 detector frozen after historical date is still replay-eligible if before outcome unlock",()=>assert.equal(validateHistoricalReplayEligibility({marketFirstObservableAt:"2021-06-15T14:30:00+08:00",predictorFreezeAt:"2021-06-15T14:30:00+08:00",detectorSpecFrozenAt:"2026-10-01T00:00:00+08:00",experimentOutcomeUnlockAt:"2026-10-20T00:00:00+08:00",prefixSafe:true}).status,"HISTORICAL_REPLAY_ELIGIBLE"));
t("D10304 market input after predictor freeze fails",()=>assert.equal(validateHistoricalReplayEligibility({marketFirstObservableAt:"2021-06-16T00:00:00+08:00",predictorFreezeAt:"2021-06-15T14:30:00+08:00",detectorSpecFrozenAt:"2026-10-01T00:00:00+08:00",experimentOutcomeUnlockAt:"2026-10-20T00:00:00+08:00",prefixSafe:true}).status,"MARKET_LOOKAHEAD"));
t("D10305 detector spec frozen after outcome unlock fails",()=>assert.equal(validateHistoricalReplayEligibility({marketFirstObservableAt:"2021-06-15T14:30:00+08:00",predictorFreezeAt:"2021-06-15T14:30:00+08:00",detectorSpecFrozenAt:"2026-10-21T00:00:00+08:00",experimentOutcomeUnlockAt:"2026-10-20T00:00:00+08:00",prefixSafe:true}).status,"DETECTOR_FROZEN_AFTER_OUTCOME_UNLOCK"));
t("D10306 prefix safety required",()=>assert.equal(validateHistoricalReplayEligibility({marketFirstObservableAt:"2021-06-15T14:30:00+08:00",predictorFreezeAt:"2021-06-15T14:30:00+08:00",detectorSpecFrozenAt:"2026-10-01T00:00:00+08:00",experimentOutcomeUnlockAt:"2026-10-20T00:00:00+08:00",prefixSafe:false}).status,"PREFIX_SAFETY_NOT_PROVEN"));

const oldR={market:"TWSE",symbol:"1101",targetDate:"2021-06-15",exactSessionHash:h,sourceHistoryHash:h,informationRoot:"PRICE_OHLC",episodeId:"E1",anchorIds:["A1","A2"],firstObservableAt:"2021-06-15T14:30:00+08:00",confirmedAt:"2021-06-15T14:30:00+08:00",canonicalPayloadHash:h,featureState:"STRUCTURE_EMITTED"};
t("D10307 identical replay is equivalent",()=>assert.equal(classifyVersionRepresentation(oldR,{...oldR}).status,"EXACT_REPLAY_EQUIVALENT"));
t("D10308 same episode descriptor drift is representation drift",()=>assert.equal(classifyVersionRepresentation(oldR,{...oldR,canonicalPayloadHash:"b".repeat(64)}).status,"SAME_CAUSAL_EPISODE_REPRESENTATION_DRIFT"));
t("D10309 source history drift is provenance drift",()=>assert.equal(classifyVersionRepresentation(oldR,{...oldR,sourceHistoryHash:"b".repeat(64)}).status,"PROVENANCE_DRIFT"));
t("D10310 changed episode id is identity drift",()=>assert.equal(classifyVersionRepresentation(oldR,{...oldR,episodeId:"E2"}).status,"EPISODE_IDENTITY_DRIFT"));
t("D10311 later confirmation is clock drift",()=>assert.equal(classifyVersionRepresentation(oldR,{...oldR,confirmedAt:"2021-06-16T14:30:00+08:00"}).status,"CLOCK_DRIFT"));

t("D10401 one-to-two mapping is split",()=>assert.equal(classifyEpisodeMigration({oldEpisodes:[{id:"O1"}],newEpisodes:[{id:"N1"},{id:"N2"}],sameRootMap:{O1:["N1","N2"]}}).status,"EPISODE_SPLIT"));
t("D10402 two-to-one mapping is merge",()=>assert.equal(classifyEpisodeMigration({oldEpisodes:[{id:"O1"},{id:"O2"}],newEpisodes:[{id:"N1"}],sameRootMap:{O1:["N1"],O2:["N1"]}}).status,"EPISODE_MERGE"));
t("D10403 one-to-one mapping unchanged",()=>assert.equal(classifyEpisodeMigration({oldEpisodes:[{id:"O1"}],newEpisodes:[{id:"N1"}],sameRootMap:{O1:["N1"]}}).status,"UNCHANGED_EPISODE"));
t("D10404 outcome-chosen mapping prohibited",()=>assert.equal(classifyEpisodeMigration({oldEpisodes:[{id:"O1"}],newEpisodes:[{id:"N1"}],sameRootMap:{O1:["N1"]},outcomeUsedToChooseMapping:true}).status,"OUTCOME_SELECTED_MIGRATION_PROHIBITED"));
t("D10405 unmapped new episode is new",()=>assert.equal(classifyEpisodeMigration({oldEpisodes:[{id:"O1"}],newEpisodes:[{id:"N1"},{id:"N2"}],sameRootMap:{O1:["N1"]}}).status,"NEW_EPISODE_IN_NEW_VERSION"));

t("D10501 closed-outcome migration ledger passes",()=>assert.equal(validateMigrationLedger({migrationClass:"UNCHANGED_EPISODE",fromDetectorVersion:"v1",toDetectorVersion:"v2",searchRegistryEntryId:"S1",outcomeAccessStateAtMigration:"CLOSED"}).status,"MIGRATION_LEDGER_VALID"));
t("D10502 opened-outcome new version must be counted",()=>assert.equal(validateMigrationLedger({migrationClass:"SAME_EPISODE_REPRESENTATION_CHANGED",fromDetectorVersion:"v1",toDetectorVersion:"v2",searchRegistryEntryId:"S1",outcomeAccessStateAtMigration:"OPENED",newVersionCountedInSearchFamily:false,finalHoldoutPrivilegeReused:false}).status,"POST_OUTCOME_VERSION_NOT_COUNTED"));
t("D10503 opened-outcome version cannot reuse untouched holdout privilege",()=>assert.equal(validateMigrationLedger({migrationClass:"SAME_EPISODE_REPRESENTATION_CHANGED",fromDetectorVersion:"v1",toDetectorVersion:"v2",searchRegistryEntryId:"S1",outcomeAccessStateAtMigration:"OPENED",newVersionCountedInSearchFamily:true,finalHoldoutPrivilegeReused:true}).status,"FINAL_HOLDOUT_REUSE_PROHIBITED"));
t("D10504 opened-outcome migration correctly accounted",()=>assert.equal(validateMigrationLedger({migrationClass:"SAME_EPISODE_REPRESENTATION_CHANGED",fromDetectorVersion:"v1",toDetectorVersion:"v2",searchRegistryEntryId:"S1",outcomeAccessStateAtMigration:"OPENED",newVersionCountedInSearchFamily:true,finalHoldoutPrivilegeReused:false}).status,"POST_OUTCOME_MIGRATION_SEARCH_ACCOUNTED"));

const eq={canonicalPayloadHash:h,firstObservableAt:"t",confirmedAt:"t",featureState:"NO_STRUCTURE",sourceHistoryHash:h,exactSessionHash:h,denominatorState:"NO_STRUCTURE"};
t("D10505 exact-equivalent wrapper change can share implementation identity",()=>assert.equal(validateExactEquivalence(eq,{...eq}).status,"IMPLEMENTATION_EQUIVALENT"));
t("D10506 clock change requires new research version",()=>assert.equal(validateExactEquivalence(eq,{...eq,confirmedAt:"t2"}).status,"NEW_RESEARCH_VERSION_REQUIRED"));

const prefix={featureState:"STRUCTURE_EMITTED",firstObservableAt:"t",confirmedAt:"t",informationRoot:"PRICE_OHLC",redundancyGroup:"R",episodeId:"E1",lifecycleState:"CONFIRMED",canonicalPayloadHash:h,requiredSourceBarIds:["b1","b2"]};
t("D10507 true prefix equals full-history asOf replay",()=>assert.equal(validatePrefixInvariance(prefix,{...prefix}).status,"PREFIX_INVARIANCE_PASS"));
t("D10508 future failure rewriting lifecycle fails prefix invariance",()=>assert.equal(validatePrefixInvariance(prefix,{...prefix,lifecycleState:"FAILED"}).status,"PREFIX_INVARIANCE_VIOLATION"));
t("D10509 future anchor added to old snapshot fails prefix invariance",()=>assert.equal(validatePrefixInvariance(prefix,{...prefix,requiredSourceBarIds:["b1","b2","b3"]}).status,"PREFIX_INVARIANCE_VIOLATION"));

t("D10510 old receipt mutation fails",()=>assert.equal(validateOldReceiptImmutability({oldReceiptHashBefore:h,oldReceiptHashAfter:"b".repeat(64),newReceiptAppended:true}).status,"OLD_RECEIPT_MUTATED"));
t("D10511 append-only migration passes",()=>assert.equal(validateOldReceiptImmutability({oldReceiptHashBefore:h,oldReceiptHashAfter:h,newReceiptAppended:true}).status,"APPEND_ONLY_MIGRATION_VALID"));

const before={NO_STRUCTURE:100,DATA_BLOCKED:10,FAILED:5,EXPIRED:3,INVALIDATED:2,UNRESOLVED:4};
t("D10512 dropping failed cases is rejected",()=>assert.equal(validateNegativeCaseRetention({before,after:{...before,FAILED:4}}).status,"NEGATIVE_CASE_DROPPED"));
t("D10513 retaining/increasing tracked negatives passes",()=>assert.equal(validateNegativeCaseRetention({before,after:{...before,FAILED:6}}).status,"NEGATIVE_CASES_RETAINED"));

console.log(`SUMMARY ${p}/29 PASS`);
