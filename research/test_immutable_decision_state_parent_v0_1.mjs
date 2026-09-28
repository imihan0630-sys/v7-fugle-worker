import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import {
  canonicalJson,
  classifyActualFormalState,
  buildImmutableDecisionStateParent,
  buildSha256ImmutableDecisionStateParent,
  compareImmutableParent,
} from "./immutable_decision_state_parent_v0_1.mjs";

const hashFn = text => {
  let h1=2166136261>>>0, h2=2246822519>>>0;
  for (const ch of String(text)) {
    const c=ch.charCodeAt(0);
    h1=Math.imul(h1^c,16777619)>>>0;
    h2=Math.imul(h2^c,3266489917)>>>0;
  }
  return h1.toString(16).padStart(8,"0")+h2.toString(16).padStart(8,"0");
};

const base = {
  parentSchemaVersion:"immutable-decision-state-parent-v0.2",
  scanDate:"2026-09-29",
  symbol:"3105",
  canonicalMarket:"TPEX",
  pool:"GENERAL",
  captureGeneration:"gen-20260929-001",
  decisionCutoffAt:"2026-09-29T16:00:00+08:00",
  capturedAt:"2026-09-29T16:00:01+08:00",
  createdAt:"2026-09-29T16:00:02+08:00",
  formalWorkerVersion:"8.13.0-priority-score-provenance-shadow",
  selectionRuleVersion:"FORMAL_RULE_V1",
  rankComparatorVersion:"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30",
  priorityScoreDefinitionVersion:"FORMAL_PRIORITY_SCORE_BASE_V1_PLUS_MARKET_CONSENSUS_7_5_30",
  historyAdmissionState:"VALID",
  historyAdmissionReceiptId:"hist-3105-20260929",
  sourceQualityState:"VALID",
  sourceSemanticFingerprint:"source-fp",
  formalInputHash:"input-hash",
  formalResultHash:"result-hash",
};

const selectedDecision = {
  basePassed:true,
  rrPassed:true,
  formalOk:true,
  selectedFlag:true,
  firstFailureReason:null,
  channel:"A",
  signalLevel:"A",
  ranking:{
    postConsensusPriorityScore:82.5,
    rewardPerRisk:2.4,
    rewardRisk:2.4,
    marketConsensusScore:3,
    marketConsensusSources:2,
    marketConsensusBonus:4.5,
    setupQuality:78,
    sectorFlow:66,
    relativeStrength:11,
    preSortOrdinal:7,
    observedPoolRank:2,
    poolQuota:3,
    cutlineRelation:"ABOVE_OR_AT_CUTLINE",
  }
};

const selected = buildImmutableDecisionStateParent({...base,actualDecision:selectedDecision},hashFn);
assert.equal(selected.formalState,"SELECTED");
assert.equal(selected.ranking.observedPoolRank,2);
assert.equal(Object.isFrozen(selected),true);
assert.equal(Object.isFrozen(selected.ranking),true);
assert.equal(Reflect.set(selected.ranking,"postConsensusPriorityScore",999),false);
assert.equal(selected.ranking.postConsensusPriorityScore,82.5);

const selectedAgain = buildImmutableDecisionStateParent({
  ...base,
  capturedAt:"2026-09-29T16:00:05+08:00",
  createdAt:"2026-09-29T16:00:06+08:00",
  actualDecision:{...selectedDecision,ranking:{...selectedDecision.ranking}},
},hashFn);
assert.equal(selected.parentDecisionReceiptId,selectedAgain.parentDecisionReceiptId);
assert.equal(selected.semanticFingerprint,selectedAgain.semanticFingerprint);
assert.equal(compareImmutableParent(selected,selectedAgain).status,"SAME_RECORD_EXACT");

const changedPayload = buildImmutableDecisionStateParent({
  ...base,
  actualDecision:{
    ...selectedDecision,
    ranking:{...selectedDecision.ranking,postConsensusPriorityScore:83.5},
  },
},hashFn);
assert.equal(changedPayload.parentDecisionReceiptId,selected.parentDecisionReceiptId);
assert.notEqual(changedPayload.semanticFingerprint,selected.semanticFingerprint);
assert.equal(compareImmutableParent(selected,changedPayload).status,"PROVENANCE_CONFLICT");

const nextGeneration = buildImmutableDecisionStateParent({
  ...base,
  captureGeneration:"gen-20260929-002",
  actualDecision:selectedDecision,
},hashFn);
assert.notEqual(nextGeneration.parentDecisionReceiptId,selected.parentDecisionReceiptId);
assert.equal(compareImmutableParent(selected,nextGeneration).status,"DIFFERENT_IDENTITY");

const nextComparator = buildImmutableDecisionStateParent({
  ...base,
  rankComparatorVersion:"FUTURE_COMPARATOR_V2",
  actualDecision:selectedDecision,
},hashFn);
assert.notEqual(nextComparator.parentDecisionReceiptId,selected.parentDecisionReceiptId);

const qns = buildImmutableDecisionStateParent({
  ...base,
  symbol:"9998",
  formalInputHash:"q-input",
  formalResultHash:"q-result",
  actualDecision:{
    ...selectedDecision,
    selectedFlag:false,
    ranking:{...selectedDecision.ranking,observedPoolRank:4,cutlineRelation:"BELOW_CUTLINE"},
  }
},hashFn);
assert.equal(qns.formalState,"QUALIFIED_NOT_SELECTED");
assert.equal(qns.selectedFlag,false);

const baseFail = buildImmutableDecisionStateParent({
  ...base,
  symbol:"9997",
  formalInputHash:"b-input",
  formalResultHash:"b-result",
  actualDecision:{
    basePassed:false,
    rrPassed:false,
    formalOk:false,
    selectedFlag:false,
    firstFailureReason:"LIQUIDITY",
  }
},hashFn);
assert.equal(baseFail.formalState,"FIRST_FAILURE_BASE_FALSE");
assert.equal(baseFail.ranking,null);

const downstreamFail = buildImmutableDecisionStateParent({
  ...base,
  symbol:"9996",
  formalInputHash:"d-input",
  formalResultHash:"d-result",
  actualDecision:{
    basePassed:true,
    rrPassed:false,
    formalOk:false,
    selectedFlag:false,
    firstFailureReason:"TARGET_NULL",
  }
},hashFn);
assert.equal(downstreamFail.formalState,"FIRST_FAILURE_BASE_TRUE");

assert.equal(classifyActualFormalState({decisionError:true}),"DECISION_ERROR");
assert.equal(canonicalJson({b:2,a:1}),canonicalJson({a:1,b:2}));

assert.throws(
  ()=>buildImmutableDecisionStateParent({
    ...base,
    actualDecision:{...selectedDecision,ranking:{...selectedDecision.ranking,postConsensusPriorityScore:null}}
  },hashFn),
  /QUALIFIED_RANKING_TUPLE_INCOMPLETE/
);

assert.throws(
  ()=>buildImmutableDecisionStateParent({
    ...base,
    actualDecision:{basePassed:false,rrPassed:false,formalOk:false,selectedFlag:true,firstFailureReason:"X"}
  },hashFn),
  /SELECTED_REQUIRES_FORMAL_OK/
);

console.log(JSON.stringify({
  ok:true,
  selectedId:selected.parentDecisionReceiptId,
  selectedFingerprint:selected.semanticFingerprint,
  states:[selected.formalState,qns.formalState,baseFail.formalState,downstreamFail.formalState],
  conflict:compareImmutableParent(selected,changedPayload).status,
  generation:compareImmutableParent(selected,nextGeneration).status,
}));


const shaParentA = await buildSha256ImmutableDecisionStateParent({
  ...base,
  decisionCutoffAt:"2026-09-29T16:00:00+08:00",
  actualDecision:selectedDecision,
},webcrypto);
const shaParentB = await buildSha256ImmutableDecisionStateParent({
  ...base,
  decisionCutoffAt:"2026-09-29T08:00:00Z",
  capturedAt:"2026-09-29T08:00:01Z",
  createdAt:"2026-09-29T08:00:02Z",
  actualDecision:selectedDecision,
},webcrypto);

assert.equal(shaParentA.parentDecisionReceiptId,shaParentB.parentDecisionReceiptId);
assert.equal(shaParentA.semanticFingerprint,shaParentB.semanticFingerprint);
assert.equal(shaParentA.decisionCutoffAt,"2026-09-29T08:00:00.000Z");
assert.equal(shaParentA.capturedAt,"2026-09-29T08:00:01.000Z");
assert.match(shaParentA.parentDecisionReceiptId,/^[0-9a-f]{64}$/);
assert.match(shaParentA.semanticFingerprint,/^[0-9a-f]{64}$/);
assert.equal(shaParentA.hashAlgorithmVersion,"SHA256_UTF8_V0_1");
