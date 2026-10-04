import assert from "node:assert/strict";
import {
  structuralRootIdentity,
  classifyObjectTransition,
  deduplicateSameDecisionDetections
} from "./pattern_structural_object_persistence_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const base={
  symbol:"2330",
  semanticSpace:"TECHNICAL_CONTINUITY",
  timeframe:"1D",
  detectorFamily:"DC_TOPOLOGY",
  structureFamily:"MAJOR_ZONE",
  orientation:"RESISTANCE",
  firstConfirmedAt:"2026-09-10",
  rootAnchorIds:["A1","A2"],
  currentAnchorIds:["A1","A2"],
  boundaryHash:"B1",
  effectiveAt:"2026-09-10",
  asOf:"2026-09-10",
  decisionAt:"2026-09-10",
  snapshotHash:"S1",
  objectPresent:true,
  coverageComplete:true,
  detectorExecuted:true,
  rootLookbackObservable:true
};

t("OP01 scan date is excluded from structural root identity",()=>{
  const a=structuralRootIdentity({...base,scanDate:"2026-09-10"});
  const b=structuralRootIdentity({...base,scanDate:"2026-09-11"});
  assert.equal(a.key,b.key);
});

t("OP02 same anchors and boundary on later date are same object snapshot",()=>{
  const r=classifyObjectTransition(base,{
    ...base,
    asOf:"2026-09-11",
    decisionAt:"2026-09-11",
    effectiveAt:"2026-09-10",
    snapshotHash:"S2"
  });
  assert.equal(r.state,"SAME_OBJECT_SNAPSHOT");
});

t("OP03 identical same-decision replay is duplicate, not event",()=>{
  const r=classifyObjectTransition(base,{...base});
  assert.equal(r.state,"REPLAY_DUPLICATE");
  assert.equal(r.independentSample,false);
});

t("OP04 incomplete coverage cannot certify absence",()=>{
  const r=classifyObjectTransition(base,{
    ...base,
    objectPresent:false,
    coverageComplete:false
  });
  assert.equal(r.state,"UNKNOWN_COVERAGE_GAP");
});

t("OP05 lookback loss is window censoring, not market invalidation",()=>{
  const r=classifyObjectTransition(base,{
    ...base,
    objectPresent:false,
    coverageComplete:true,
    rootLookbackObservable:false
  });
  assert.equal(r.state,"WINDOW_CENSORED");
});

t("OP06 complete detector absence is distinct from market invalidation",()=>{
  const r=classifyObjectTransition(base,{
    ...base,
    objectPresent:false,
    coverageComplete:true,
    detectorExecuted:true,
    rootLookbackObservable:true
  });
  assert.equal(r.state,"DETECTOR_ABSENT_COMPLETE_SCAN");
});

t("OP07 causal anchor extension stays same root but new version",()=>{
  const r=classifyObjectTransition(base,{
    ...base,
    asOf:"2026-09-12",
    decisionAt:"2026-09-12",
    currentAnchorIds:["A1","A2","A3"],
    boundaryHash:"B2",
    addedAnchorOccurredAt:{A3:"2026-09-11"}
  });
  assert.equal(r.state,"SAME_ROOT_CAUSAL_EXTENSION");
  assert.deepEqual(r.addedAnchorIds,["A3"]);
});

t("OP08 future or untimed added anchor is provenance conflict",()=>{
  const r=classifyObjectTransition(base,{
    ...base,
    asOf:"2026-09-12",
    decisionAt:"2026-09-12",
    currentAnchorIds:["A1","A2","A3"],
    boundaryHash:"B2",
    addedAnchorOccurredAt:{A3:"2026-09-13"}
  });
  assert.equal(r.state,"PROVENANCE_CONFLICT_FUTURE_OR_UNTIMED_ANCHOR");
});

t("OP09 anchor replacement is identity break rather than fuzzy same-zone match",()=>{
  const r=classifyObjectTransition(base,{
    ...base,
    asOf:"2026-09-12",
    decisionAt:"2026-09-12",
    currentAnchorIds:["A2","A3"],
    boundaryHash:"B2",
    addedAnchorOccurredAt:{A3:"2026-09-11"}
  });
  assert.equal(r.state,"IDENTITY_BREAK_OR_RESEGMENTATION");
});

t("OP10 explicit market invalidation forces a new episode on reappearance",()=>{
  const r=classifyObjectTransition({...base,marketInvalidated:true},{
    ...base,
    asOf:"2026-09-20",
    decisionAt:"2026-09-20",
    snapshotHash:"S20"
  });
  assert.equal(r.state,"NEW_EPISODE_AFTER_INVALIDATION");
});

t("OP11 timeframe is part of object root identity",()=>{
  const a=structuralRootIdentity(base);
  const b=structuralRootIdentity({...base,timeframe:"1W"});
  assert.notEqual(a.key,b.key);
});

t("OP12 same root after complete detector absence is reacquisition, not new independent object",()=>{
  const prev={...base,objectPresent:false,decisionAt:"2026-09-11",asOf:"2026-09-11",snapshotHash:""};
  const curr={...base,decisionAt:"2026-09-12",asOf:"2026-09-12",snapshotHash:"S12"};
  const r=classifyObjectTransition(prev,curr);
  assert.equal(r.state,"REACQUIRED_SAME_ROOT_AFTER_DETECTOR_ABSENCE");
  assert.equal(r.independentSample,false);
});

t("OP13 overlapping raw windows deduplicate one identical snapshot",()=>{
  const d1={...base,windowId:"W1"};
  const d2={...base,windowId:"W2"};
  const r=deduplicateSameDecisionDetections([d1,d2]);
  assert.equal(r.snapshots.length,1);
  assert.equal(r.snapshots[0].rawDetectionCount,2);
  assert.equal(r.snapshots[0].status,"DEDUP_VALID");
  assert.equal(r.snapshots[0].independentSample,false);
});

t("OP14 conflicting emissions under same root/version fail closed",()=>{
  const d1={...base,windowId:"W1",snapshotHash:"S1"};
  const d2={...base,windowId:"W2",snapshotHash:"S2"};
  const r=deduplicateSameDecisionDetections([d1,d2]);
  assert.equal(r.snapshots.length,1);
  assert.equal(r.snapshots[0].status,"PROVENANCE_CONFLICT");
  assert.equal(r.snapshots[0].snapshotHash,null);
});

console.log(`SUMMARY ${pass}/14 PASS`);
