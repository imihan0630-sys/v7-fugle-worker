// Research-only Pattern evidence de-duplication audit.
// No return outcomes, no scoring, no production dependency.

function reqText(value, field) {
  const s=String(value??"").trim();
  if (!s) throw new Error("MISSING_"+field);
  return s;
}

function uniqSorted(values) {
  return [...new Set((values||[]).map(x=>String(x).trim()).filter(Boolean))].sort();
}

function anchorKey(e) {
  const anchors=uniqSorted(e.anchorIds);
  if (!anchors.length) return null;
  return [
    reqText(e.scale,"scale"),
    reqText(e.semanticSpaceVersion,"semanticSpaceVersion"),
    anchors.join(","),
  ].join("|");
}

function triggerKey(e) {
  if (!e.boundaryId || !e.firstBreakAt) return null;
  return [String(e.boundaryId),String(e.firstBreakAt)].join("|");
}

function microWindowKey(e) {
  if (!e.windowStart || !e.windowEnd) return null;
  return [
    reqText(e.scale,"scale"),
    reqText(e.semanticSpaceVersion,"semanticSpaceVersion"),
    String(e.windowStart),
    String(e.windowEnd),
  ].join("|");
}

export function jaccardAnchors(a,b) {
  const A=new Set(uniqSorted(a)), B=new Set(uniqSorted(b));
  if (!A.size && !B.size) return null;
  let intersection=0;
  for (const x of A) if (B.has(x)) intersection+=1;
  const union=new Set([...A,...B]).size;
  return union?intersection/union:null;
}

function groupBy(items,keyFn) {
  const map=new Map();
  for (const item of items) {
    const key=keyFn(item);
    if (!key) continue;
    if (!map.has(key)) map.set(key,[]);
    map.get(key).push(item);
  }
  return [...map.entries()].map(([key,rows])=>Object.freeze({
    key,
    count:rows.length,
    episodeIds:Object.freeze(rows.map(x=>x.episodeId).sort()),
    families:Object.freeze(uniqSorted(rows.map(x=>x.family))),
  })).sort((a,b)=>a.key.localeCompare(b.key));
}

export function auditPatternEvidenceBundle(episodes) {
  if (!Array.isArray(episodes)) throw new Error("EPISODES_ARRAY_REQUIRED");
  const seen=new Set();
  const rows=episodes.map((raw,i)=>{
    const episodeId=reqText(raw?.episodeId,"episodeId@"+i);
    if (seen.has(episodeId)) throw new Error("DUPLICATE_EPISODE_ID:"+episodeId);
    seen.add(episodeId);
    return Object.freeze({
      episodeId,
      family:reqText(raw?.family,"family@"+i),
      layer:reqText(raw?.layer,"layer@"+i),
      scale:reqText(raw?.scale,"scale@"+i),
      semanticSpaceVersion:reqText(raw?.semanticSpaceVersion,"semanticSpaceVersion@"+i),
      anchorIds:Object.freeze(uniqSorted(raw?.anchorIds)),
      rootProvenance:Object.freeze(uniqSorted(raw?.rootProvenance)),
      boundaryId:raw?.boundaryId?String(raw.boundaryId):null,
      firstBreakAt:raw?.firstBreakAt?String(raw.firstBreakAt):null,
      windowStart:raw?.windowStart?String(raw.windowStart):null,
      windowEnd:raw?.windowEnd?String(raw.windowEnd):null,
    });
  });

  const anchorGroups=groupBy(rows,anchorKey);
  const triggerGroups=groupBy(rows,triggerKey);
  const microGroups=groupBy(rows,microWindowKey);

  const pairwise=[];
  for(let i=0;i<rows.length;i+=1){
    for(let j=i+1;j<rows.length;j+=1){
      if (!rows[i].anchorIds.length || !rows[j].anchorIds.length) continue;
      const jac=jaccardAnchors(rows[i].anchorIds,rows[j].anchorIds);
      pairwise.push(Object.freeze({
        leftEpisodeId:rows[i].episodeId,
        rightEpisodeId:rows[j].episodeId,
        leftFamily:rows[i].family,
        rightFamily:rows[j].family,
        jaccard:jac,
        exactAnchorSet:anchorKey(rows[i])===anchorKey(rows[j]),
      }));
    }
  }

  const roots=uniqSorted(rows.flatMap(x=>x.rootProvenance));
  const layers=uniqSorted(rows.map(x=>x.layer));
  const families=uniqSorted(rows.map(x=>x.family));

  return Object.freeze({
    rawNamedLabelCount:rows.length,
    uniqueNamedFamilyCount:families.length,
    exactAnchorGroupCount:anchorGroups.length,
    exactTriggerGroupCount:triggerGroups.length,
    exactMicroWindowGroupCount:microGroups.length,
    rootProvenanceCount:roots.length,
    layerCount:layers.length,
    families:Object.freeze(families),
    rootProvenance:Object.freeze(roots),
    layers:Object.freeze(layers),
    exactAnchorGroups:Object.freeze(anchorGroups),
    exactTriggerGroups:Object.freeze(triggerGroups),
    exactMicroWindowGroups:Object.freeze(microGroups),
    pairwiseAnchorOverlap:Object.freeze(pairwise),
    multiLabelSameAnchorGroups:Object.freeze(anchorGroups.filter(g=>g.families.length>1)),
    sharedTriggerGroups:Object.freeze(triggerGroups.filter(g=>g.families.length>1)),
    independenceStatus:"UNPROVEN_FROM_LABEL_COUNT",
    scoringVoteCount:null,
  });
}
