import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {evaluateReferencePriceReconstructionV1_3} from "../runtime/s2_07_reference_reconstruction_v1_3.mjs";

function stripHtml(value){
  return String(value||"")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;/gi,"&")
    .replace(/\s+/g," ")
    .trim();
}
function sha256(text){return createHash("sha256").update(String(text)).digest("hex");}
function fetchApprovedPlan(){
  const url="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30","--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-S2-07-Reference-Reconstruction/1.3",
    "--data-urlencode","firstin=true",
    "--data-urlencode","step=2",
    "--data-urlencode","off=1",
    "--data-urlencode","seq_no=1",
    "--data-urlencode","spoke_time=170324",
    "--data-urlencode","spoke_date=20260908",
    "--data-urlencode","co_id=4806",
    "--data-urlencode","TYPEK=otc",
    url,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error||p.status!==0)throw new Error(String(p.stderr||p.error||"MOPS detail curl failure").slice(0,500));
  return {raw:p.stdout,text:stripHtml(p.stdout),payloadHash:sha256(p.stdout)};
}
function extractNewSharesPer1000(text){
  const m=String(text).match(/每仟股換發\s*([0-9]+(?:\.[0-9]+)?)\s*股/);
  return m?Number(m[1]):null;
}

const v11=JSON.parse(await readFile(
  new URL("../evidence/S2_07_TECHNICAL_CONTINUITY_BRIDGE_V1_1_PHYSICAL_20261007.json",import.meta.url),"utf8"
));
const v10=JSON.parse(await readFile(
  new URL("../evidence/S2_07_RAW_A1_LINEAGE_V1_0_PHYSICAL_20261007.json",import.meta.url),"utf8"
));
const a1=v10.cases.find((row)=>row.symbol==="4806");
assert.ok(a1?.preSuspensionBar,"4806 V1.0 pre-suspension A1 row is required");

const detail=fetchApprovedPlan();
assert.match(detail.text,/發言日期\s*115\/09\/08/);
assert.match(detail.text,/發言時間\s*17:03:24/);
assert.match(detail.text,/減資換發股票作業計畫書.*115年9月8日.*證櫃監字第1150005686號函核准/);
const approvedNewSharesPer1000=extractNewSharesPer1000(detail.text);
assert.equal(approvedNewSharesPer1000,699.6112203);

const result=evaluateReferencePriceReconstructionV1_3({
  symbol:"4806",
  family:"CAPITAL_REDUCTION",
  resumeOpenCutoffAt:"2026-10-02T09:00:00+08:00",
  preActionClose:v11.officialReferenceEvidence.preActionClose,
  preCloseAvailableAt:a1.preSuspensionBar.availableAt,
  preClosePitAvailabilityClass:a1.preSuspensionBar.pitAvailabilityClass,
  preClosePitReplayEligible:a1.preSuspensionBar.pitReplayEligible,
  approvedNewSharesPer1000,
  approvedRatioSourceReportedAt:"2026-09-08T17:03:24+08:00",
  ratioSourceVersionKey:"2026-09-08|17:03:24|1",
  ratioSourcePayloadHash:detail.payloadHash,
  ratioPublicAvailabilityCertified:false,
  officialReferencePrice:v11.officialReferenceEvidence.officialReferencePrice,
});

assert.equal(result.reconstruction.reconstructedReferencePrice,14.87);
assert.equal(result.reconstruction.mechanicallyProven,true);
assert.equal(result.state,"REFERENCE_RECONSTRUCTION_MECHANICALLY_PROVEN_PIT_BLOCKED");
assert.equal(result.clocks.preCloseObservedBeforeCutoff,false);
assert.ok(result.blockers.includes("APPROVED_RATIO_PUBLIC_AVAILABILITY_NOT_CERTIFIED"));
assert.ok(result.blockers.includes("PRE_ACTION_CLOSE_AVAILABLE_AFTER_RESUME_CUTOFF"));
assert.equal(result.knownAtVersionClockCertified,false);
assert.equal(result.firstKnownAt,null);
assert.equal(result.availableAt,null);
assert.equal(result.pitTechnicalContinuityReplayEligible,false);
assert.equal(result.technicalContinuityCertified,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:"S2_07_REFERENCE_RECONSTRUCTION_V1_3_COMPLETE",
  officialMopsApprovedPlan:{
    versionKey:"2026-09-08|17:03:24|1",
    sourceReportedAt:"2026-09-08T09:03:24.000Z",
    payloadHash:detail.payloadHash,
    approvedNewSharesPer1000,
    approvalTextObserved:true,
    publicAvailabilityCertified:false,
  },
  rawA1PreClose:{
    marketDate:a1.previousOfficialSession,
    close:v11.officialReferenceEvidence.preActionClose,
    availableAt:a1.preSuspensionBar.availableAt,
    pitAvailabilityClass:a1.preSuspensionBar.pitAvailabilityClass,
    pitReplayEligible:a1.preSuspensionBar.pitReplayEligible,
    sourceId:a1.preSuspensionBar.sourceId,
    sourceRowHash:a1.preSuspensionBar.sourceRowHash,
  },
  evaluation:result,
  boundaries:{
    historyMutationPerformed:false,
    timestampPromotionPerformed:false,
    technicalContinuityCertified:false,
    pitReplayAuthority:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  },
},null,2));
