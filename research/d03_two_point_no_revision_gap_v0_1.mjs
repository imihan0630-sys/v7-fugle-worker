import crypto from "node:crypto";

export const D03_TWO_POINT_NO_REVISION_GAP_VERSION="D03_TWO_POINT_NO_REVISION_GAP_V0_1";

const isoTime=x=>typeof x==="string"&&Number.isFinite(Date.parse(x));
const hash64=x=>typeof x==="string"&&/^[0-9a-f]{64}$/i.test(x);
const nonempty=x=>typeof x==="string"&&x.length>0;
const uniq=xs=>[...new Set(xs)];
const h=v=>crypto.createHash("sha256").update(JSON.stringify(v)).digest("hex");

function normalizeVersions(xs=[]){
  return xs.map(x=>({
    versionKey:String(x?.versionKey||""),
    sourceReportedAt:x?.sourceReportedAt||null,
    firstObservedAt:x?.firstObservedAt||null,
    payloadHash:x?.payloadHash||null,
  }));
}

export function certifyNoRevisionGapThroughCutV0_1({preCut,postReconciliation}={}){
  const reasons=[];
  if(!preCut||typeof preCut!=="object") return {schemaVersion:D03_TWO_POINT_NO_REVISION_GAP_VERSION,status:"UNKNOWN",certified:false,reasons:["PRE_CUT_MISSING"]};
  if(!postReconciliation||typeof postReconciliation!=="object") return {schemaVersion:D03_TWO_POINT_NO_REVISION_GAP_VERSION,status:"UNKNOWN",certified:false,reasons:["POST_RECONCILIATION_MISSING"]};

  if(!nonempty(preCut.evidenceCutId)) reasons.push("EVIDENCE_CUT_ID_MISSING");
  if(!isoTime(preCut.evidenceCutoffAt)) reasons.push("EVIDENCE_CUTOFF_AT_INVALID");
  if(preCut.scope!=="MARKET_WIDE_OR_FULL_ELIGIBLE_UNIVERSE") reasons.push("PRE_CUT_SCOPE_INVALID");
  if(preCut.queryTruncated===true) reasons.push("PRE_CUT_QUERY_TRUNCATED");
  if(Number(preCut.unknownRequiredLaneCount||0)!==0) reasons.push("PRE_CUT_UNKNOWN_LANE");
  if(!hash64(preCut.sourceCutManifestHash)) reasons.push("PRE_CUT_MANIFEST_HASH_INVALID");

  if(!isoTime(postReconciliation.reconciledAt)) reasons.push("RECONCILED_AT_INVALID");
  if(
    isoTime(postReconciliation.reconciledAt)&&
    isoTime(preCut.evidenceCutoffAt)&&
    Date.parse(postReconciliation.reconciledAt)<=Date.parse(preCut.evidenceCutoffAt)
  ) reasons.push("POST_RECONCILIATION_NOT_AFTER_CUT");
  if(postReconciliation.boundedPopulationComplete!==true) reasons.push("POST_BOUNDED_POPULATION_INCOMPLETE");
  if(postReconciliation.queryTruncated===true) reasons.push("POST_QUERY_TRUNCATED");
  if(postReconciliation.populationIdentityStable!==true) reasons.push("POST_POPULATION_IDENTITY_UNSTABLE");

  const pre=normalizeVersions(preCut.versions);
  const post=normalizeVersions(postReconciliation.versions);
  const preKeys=pre.map(x=>x.versionKey);
  const postKeys=post.map(x=>x.versionKey);
  if(preKeys.some(x=>!x)) reasons.push("PRE_VERSION_KEY_MISSING");
  if(postKeys.some(x=>!x)) reasons.push("POST_VERSION_KEY_MISSING");
  if(new Set(preKeys).size!==preKeys.length) reasons.push("PRE_VERSION_KEY_DUPLICATE");
  if(new Set(postKeys).size!==postKeys.length) reasons.push("POST_VERSION_KEY_DUPLICATE");

  const preMap=new Map(pre.map(x=>[x.versionKey,x]));
  const postMap=new Map(post.map(x=>[x.versionKey,x]));
  const missingPreKeys=preKeys.filter(k=>!postMap.has(k));
  if(missingPreKeys.length) reasons.push("PRE_VERSION_MISSING_FROM_POST");

  const mutatedKeys=[];
  for(const [k,a] of preMap){
    const b=postMap.get(k);
    if(!b) continue;
    if(!hash64(a.payloadHash)||!hash64(b.payloadHash)) reasons.push("VERSION_PAYLOAD_HASH_INVALID");
    else if(a.payloadHash!==b.payloadHash) mutatedKeys.push(k);

    if(!isoTime(a.firstObservedAt)) reasons.push("PRE_FIRST_OBSERVED_AT_INVALID");
    else if(isoTime(preCut.evidenceCutoffAt)&&Date.parse(a.firstObservedAt)>Date.parse(preCut.evidenceCutoffAt)){
      reasons.push("PRE_VERSION_FIRST_OBSERVED_AFTER_CUT");
    }
  }
  if(mutatedKeys.length) reasons.push("VERSION_PAYLOAD_MUTATION");

  const lateDiscoveredPreCut=[];
  const laterVersions=[];
  for(const row of post){
    if(preMap.has(row.versionKey)) continue;
    if(!isoTime(row.sourceReportedAt)){
      reasons.push("POST_NEW_VERSION_SOURCE_REPORTED_AT_INVALID");
      continue;
    }
    if(isoTime(preCut.evidenceCutoffAt)&&Date.parse(row.sourceReportedAt)<=Date.parse(preCut.evidenceCutoffAt)){
      lateDiscoveredPreCut.push(row.versionKey);
    }else{
      laterVersions.push(row.versionKey);
    }
  }
  if(lateDiscoveredPreCut.length) reasons.push("LATE_DISCOVERED_PRE_CUT_VERSION");

  const uniqueReasons=uniq(reasons);
  const certified=uniqueReasons.length===0;
  const identity={
    evidenceCutId:preCut.evidenceCutId||null,
    evidenceCutoffAt:preCut.evidenceCutoffAt||null,
    reconciledAt:postReconciliation.reconciledAt||null,
    sourceCutManifestHash:preCut.sourceCutManifestHash||null,
    preVersionKeys:[...preKeys].sort(),
    postVersionKeys:[...postKeys].sort(),
    lateDiscoveredPreCut:[...lateDiscoveredPreCut].sort(),
    laterVersions:[...laterVersions].sort(),
    mutatedKeys:[...mutatedKeys].sort(),
  };

  return {
    schemaVersion:D03_TWO_POINT_NO_REVISION_GAP_VERSION,
    status:certified?"NO_REVISION_GAP_THROUGH_CUT_CERTIFIED_CANDIDATE":"DATA_BLOCKED",
    certified,
    noRevisionGapThroughCut:certified,
    reasons:uniqueReasons,
    certificationCandidateId:h(identity),
    ...identity,
    ownerCertificationRequired:true,
    d03SelfCertificationAuthority:false,
  };
}
