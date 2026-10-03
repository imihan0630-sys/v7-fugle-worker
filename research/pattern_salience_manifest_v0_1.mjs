// D01 DL-029 salience manifest helper v0.1
// Research-only / outcome-blind.

function txt(x){return typeof x==="string"?x.trim():"";}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

function geometryKey(row){
  if(!finite(row.lower)||!finite(row.upper)) return null;
  return [row.lower,row.upper].map(x=>Number(x).toPrecision(15)).join("::");
}

export function buildSalienceManifest({
 trueParent,
 pseudoCandidates=[],
 negativeControlContractVersion="PATTERN_NEGATIVE_CONTROL_BOUNDARY_V0_1",
 detectorSalienceContractVersion="PATTERN_DETECTOR_SALIENCE_V0_1"
}={}){
  if(!trueParent) return {status:"UNKNOWN",reason:"TRUE_PARENT_MISSING"};

  const required=["zoneId","zoneVersion","symbol","parentConfirmedAt"];
  const missing=required.filter(k=>!txt(String(trueParent[k]??"")));
  if(missing.length) return {status:"UNKNOWN",reason:"TRUE_PARENT_IDENTITY_INCOMPLETE",missing};

  const rows=[{
    candidateId:`TRUE|${trueParent.zoneId}|v${trueParent.zoneVersion}`,
    candidateType:"TRUE_ZONE",
    ...trueParent
  },...(pseudoCandidates||[]).map((x,i)=>({
    candidateId:txt(x.candidateId)||`PSEUDO|${i}`,
    candidateType:"PSEUDO_ZONE",
    ...x
  }))];

  const seen=new Set();
  for(const r of rows){
    if(seen.has(r.candidateId))
      return {status:"QA_FAIL",reason:"DUPLICATE_CANDIDATE_ID",candidateId:r.candidateId};
    seen.add(r.candidateId);
  }

  const groups=new Map();
  for(const r of rows){
    const k=geometryKey(r);
    if(!k) continue;
    if(!groups.has(k)) groups.set(k,[]);
    groups.get(k).push(r.candidateId);
  }
  const geometryDuplicateGroups=[...groups.entries()]
    .filter(([,ids])=>ids.length>1)
    .map(([geometryDuplicateGroupKey,candidateIds])=>({geometryDuplicateGroupKey,candidateIds:[...candidateIds].sort()}));

  const pseudoCount=rows.filter(x=>x.candidateType==="PSEUDO_ZONE").length;

  return {
    status:"VALID",
    manifestIdentity:{
      trueParentZoneId:trueParent.zoneId,
      trueParentZoneVersion:trueParent.zoneVersion,
      symbol:trueParent.symbol,
      parentConfirmedAt:trueParent.parentConfirmedAt,
      negativeControlContractVersion,
      detectorSalienceContractVersion
    },
    rows:rows.sort((a,b)=>a.candidateId.localeCompare(b.candidateId)),
    pseudoCandidateCount:pseudoCount,
    controlPoolStatus:pseudoCount?"NON_EMPTY":"CONTROL_POOL_EMPTY",
    geometryDuplicateGroups,
    outcomeOpened:false
  };
}

export function classifyCandidateMatchability(row={}){
  if(row.outsideCommonSupport===true)
    return {status:"NOT_MATCHABLE_OUTSIDE_COMMON_SUPPORT",e1:false,e2:false,e3:false};

  if(row.opportunityComplete!==true)
    return {status:"NOT_MATCHABLE_MISSING_PROVENANCE",e1:false,e2:false,e3:false};

  if(row.mechanicalComplete!==true)
    return {status:"E1_ONLY",e1:true,e2:false,e3:false};

  if(row.salienceComplete!==true)
    return {status:"E2_ONLY",e1:true,e2:true,e3:false};

  return {status:"E3_READY",e1:true,e2:true,e3:true};
}

export function summarizeMatchability(rows=[]){
  const out={
    totalCandidates:rows.length,e1:0,e2:0,e3:0,
    outsideCommonSupport:0,missingProvenance:0
  };
  for(const r of rows){
    const c=classifyCandidateMatchability(r);
    if(c.e1) out.e1++;
    if(c.e2) out.e2++;
    if(c.e3) out.e3++;
    if(c.status==="NOT_MATCHABLE_OUTSIDE_COMMON_SUPPORT") out.outsideCommonSupport++;
    if(c.status==="NOT_MATCHABLE_MISSING_PROVENANCE") out.missingProvenance++;
  }
  return out;
}
