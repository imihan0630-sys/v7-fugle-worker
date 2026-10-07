import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const spec=JSON.parse(await readFile(new URL("./d03_corr007_suspension_provenance_acceptance_cases_20261008_v0_1.json",import.meta.url),"utf8"));
const D="a".repeat(64);
const base={
  decisionTimestamp:"2026-10-01T08:00:00.000Z",
  replayStartDate:"2026-07-31",replayEndDate:"2026-09-30",
  suspensionEvidence:{
    exchange:"TWSE",startDate:"2026-07-31",endDate:"2026-09-30",
    coverageState:"COMPLETE",digest:D,sourceFamilyVersion:"TWTAWU_BOUNDED_V0_1",
    receiptVersion:"TWSE_SUSPENSION_COMPLETENESS_V0_1",
    availabilitySemantics:"PROSPECTIVE_OBSERVED",
    observedAt:"2026-09-29T06:00:00.000Z",availableAt:null,
    absenceCertifiesNoEvent:false,unresolvedConflictCount:0,partialSourceCount:0
  },
  suspensionEvidenceRef:{sourceId:"TWSE_TWTAWU_BOUNDED_COMPLETENESS",digest:D},
  corporateActionRefCount:3,exactSessionReady:true,archiveHashBoundToSuspension:true,
  sourceFamilyVersion:"OFFICIAL_TW_CONTINUITY_V1",receiptVersion:"CONT_V1"
};
const hash64=x=>/^[a-f0-9]{64}$/.test(String(x||""));
const merge=(a,p)=>({
  ...a,...p,
  suspensionEvidence:p&&Object.hasOwn(p,"suspensionEvidence")
    ? (p.suspensionEvidence===null?null:{...a.suspensionEvidence,...p.suspensionEvidence})
    : a.suspensionEvidence,
  suspensionEvidenceRef:p&&Object.hasOwn(p,"suspensionEvidenceRef")
    ? (p.suspensionEvidenceRef===null?null:{...a.suspensionEvidenceRef,...p.suspensionEvidenceRef})
    : a.suspensionEvidenceRef
});
function decide(r){
  const e=r.suspensionEvidence,ref=r.suspensionEvidenceRef;
  if(!e||e.exchange!=="TWSE"||e.coverageState!=="COMPLETE")return "CONTINUITY_UNKNOWN";
  if(e.startDate!==r.replayStartDate||e.endDate!==r.replayEndDate)return "CONTINUITY_UNKNOWN";
  if(!hash64(e.digest)||!ref||ref.digest!==e.digest)return "CONTINUITY_UNKNOWN";
  if(!e.sourceFamilyVersion||!e.receiptVersion||!r.sourceFamilyVersion||!r.receiptVersion)return "CONTINUITY_UNKNOWN";
  if(ref.sourceId!=="TWSE_TWTAWU_BOUNDED_COMPLETENESS")return "CONTINUITY_UNKNOWN";
  if(e.absenceCertifiesNoEvent!==false||e.unresolvedConflictCount!==0||e.partialSourceCount!==0)return "CONTINUITY_UNKNOWN";
  if(r.corporateActionRefCount!==3||r.exactSessionReady!==true||r.archiveHashBoundToSuspension!==true)return "CONTINUITY_UNKNOWN";
  const cut=Date.parse(r.decisionTimestamp);
  if(e.availabilitySemantics==="PROSPECTIVE_OBSERVED"){
    if(!Number.isFinite(Date.parse(e.observedAt))||Date.parse(e.observedAt)>cut)return "CONTINUITY_UNKNOWN";
  }else if(e.availabilitySemantics==="VERIFIED_SOURCE_TIMESTAMP"){
    if(!Number.isFinite(Date.parse(e.availableAt))||Date.parse(e.availableAt)>cut)return "CONTINUITY_UNKNOWN";
  }else return "CONTINUITY_UNKNOWN";
  return "CLEAR_NO_ACTION_ELIGIBLE";
}
for(const c of spec.cases)assert.equal(decide(merge(base,c.patch)),c.expected,c.id);
const changed=merge(base,{suspensionEvidence:{digest:"c".repeat(64)},suspensionEvidenceRef:{digest:"c".repeat(64)}});
assert.notEqual(JSON.stringify(changed),JSON.stringify(base),"digest mutation must alter bound archive input");
console.log(JSON.stringify({status:"PASS",cases:spec.cases.length,plainCompleteRejected:true,digestMutationChangesBoundInput:true,d03MaturityPct:56.7,formalCoreImpact:"NONE_LOCKED"}));
