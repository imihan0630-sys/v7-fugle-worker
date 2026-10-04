// D01 DL-030 structural-object persistence and rediscovery identity v0.1
// Research-only / outcome-blind.

function normIds(ids=[]){
  return [...new Set((ids||[]).map(String).filter(Boolean))].sort();
}
function stable(x){return JSON.stringify(x);}
function isSubset(a,b){
  const B=new Set(b);
  return a.every(x=>B.has(x));
}
function sameSet(a,b){
  const A=normIds(a),B=normIds(b);
  return A.length===B.length&&A.every((x,i)=>x===B[i]);
}

export function structuralRootIdentity(x={}){
  const fields={
    symbol:String(x.symbol||""),
    semanticSpace:String(x.semanticSpace||""),
    timeframe:String(x.timeframe||""),
    detectorFamily:String(x.detectorFamily||""),
    structureFamily:String(x.structureFamily||""),
    orientation:String(x.orientation||""),
    firstConfirmedAt:String(x.firstConfirmedAt||""),
    rootAnchorIds:normIds(x.rootAnchorIds)
  };
  if(Object.values(fields).slice(0,7).some(v=>!v)||!fields.rootAnchorIds.length)
    return {status:"UNKNOWN",reason:"ROOT_IDENTITY_INCOMPLETE",key:null,fields};
  return {status:"VALID",key:stable(fields),fields};
}

export function structuralVersionIdentity(x={}){
  const root=structuralRootIdentity(x);
  if(root.status!=="VALID")
    return {status:"UNKNOWN",reason:root.reason,key:null};
  const currentAnchorIds=normIds(x.currentAnchorIds);
  const boundaryHash=String(x.boundaryHash||"");
  const effectiveAt=String(x.effectiveAt||x.asOf||"");
  if(!currentAnchorIds.length||!boundaryHash||!effectiveAt)
    return {status:"UNKNOWN",reason:"VERSION_IDENTITY_INCOMPLETE",key:null};
  return {
    status:"VALID",
    key:stable({
      rootKey:root.key,
      currentAnchorIds,
      boundaryHash,
      effectiveAt
    })
  };
}

export function classifyObjectTransition(prev={},curr={}){
  const pRoot=structuralRootIdentity(prev);
  const cRoot=structuralRootIdentity(curr);

  if(curr.coverageComplete!==true)
    return {state:"UNKNOWN_COVERAGE_GAP",independentSample:false};

  if(prev.marketInvalidated===true&&curr.objectPresent===true)
    return {state:"NEW_EPISODE_AFTER_INVALIDATION",independentSample:false};

  if(curr.objectPresent!==true){
    if(curr.rootLookbackObservable===false)
      return {state:"WINDOW_CENSORED",independentSample:false};
    if(curr.detectorExecuted===true&&curr.rootLookbackObservable===true)
      return {state:"DETECTOR_ABSENT_COMPLETE_SCAN",independentSample:false};
    return {state:"UNKNOWN_COVERAGE_GAP",independentSample:false};
  }

  if(cRoot.status!=="VALID")
    return {state:"IDENTITY_UNRESOLVED",independentSample:false};

  if(prev.objectPresent!==true){
    if(prev.coverageComplete!==true)
      return {state:"REACQUIRED_AFTER_UNKNOWN_GAP",independentSample:false};
    if(prev.rootLookbackObservable===false)
      return pRoot.status==="VALID"&&pRoot.key===cRoot.key
        ?{state:"REACQUIRED_AFTER_WINDOW_CENSORING",independentSample:false}
        :{state:"IDENTITY_UNRESOLVED",independentSample:false};
    if(prev.detectorExecuted===true&&pRoot.status==="VALID"&&pRoot.key===cRoot.key)
      return {state:"REACQUIRED_SAME_ROOT_AFTER_DETECTOR_ABSENCE",independentSample:false};
  }

  if(pRoot.status!=="VALID"||pRoot.key!==cRoot.key)
    return {state:"DIFFERENT_OBJECT_ROOT",independentSample:false};

  if(prev.decisionAt===curr.decisionAt&&
     prev.snapshotHash&&curr.snapshotHash&&
     prev.snapshotHash===curr.snapshotHash)
    return {state:"REPLAY_DUPLICATE",independentSample:false};

  const pAnchors=normIds(prev.currentAnchorIds);
  const cAnchors=normIds(curr.currentAnchorIds);

  if(sameSet(pAnchors,cAnchors)){
    return prev.boundaryHash===curr.boundaryHash
      ?{state:"SAME_OBJECT_SNAPSHOT",independentSample:false}
      :{state:"SAME_ROOT_GEOMETRY_VERSION",independentSample:false};
  }

  if(isSubset(pAnchors,cAnchors)){
    const added=cAnchors.filter(x=>!pAnchors.includes(x));
    const dates=curr.addedAnchorOccurredAt||{};
    const priorAsOf=String(prev.asOf||prev.decisionAt||"");
    const currentAsOf=String(curr.asOf||curr.decisionAt||"");
    const causal=added.every(id=>{
      const d=String(dates[id]||"");
      return d&&priorAsOf&&currentAsOf&&d>priorAsOf&&d<=currentAsOf;
    });
    return causal
      ?{state:"SAME_ROOT_CAUSAL_EXTENSION",addedAnchorIds:added,independentSample:false}
      :{state:"PROVENANCE_CONFLICT_FUTURE_OR_UNTIMED_ANCHOR",addedAnchorIds:added,independentSample:false};
  }

  return {state:"IDENTITY_BREAK_OR_RESEGMENTATION",independentSample:false};
}

export function deduplicateSameDecisionDetections(detections=[]){
  const groups=new Map();
  for(const d of detections||[]){
    const r=structuralRootIdentity(d);
    const v=structuralVersionIdentity(d);
    const decisionAt=String(d?.decisionAt||"");
    if(r.status!=="VALID"||v.status!=="VALID"||!decisionAt) continue;
    const key=stable({decisionAt,rootKey:r.key,versionKey:v.key});
    const arr=groups.get(key)||[];
    arr.push(d);
    groups.set(key,arr);
  }

  const snapshots=[];
  for(const [key,arr] of groups){
    const hashes=[...new Set(arr.map(x=>String(x.snapshotHash||"")).filter(Boolean))];
    snapshots.push({
      key,
      rawDetectionCount:arr.length,
      status:hashes.length<=1?"DEDUP_VALID":"PROVENANCE_CONFLICT",
      snapshotHash:hashes.length===1?hashes[0]:null,
      independentSample:false
    });
  }
  snapshots.sort((a,b)=>a.key.localeCompare(b.key));
  return {snapshots,rawDetectionCount:(detections||[]).length};
}
