import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {readFile} from "node:fs/promises";
import {parseMopsHistoricalMaterialInformationHtmlV0_1} from "../runtime/mops_revision_source_capability_v0_1.mjs";
import {evaluateReferencePriceVersionClockV1_2} from "../runtime/s2_07_reference_price_clock_v1_2.mjs";

const evidence=JSON.parse(await readFile(
  new URL("../evidence/S2_07_TECHNICAL_CONTINUITY_BRIDGE_V1_1_PHYSICAL_20261007.json",import.meta.url),
  "utf8",
));
assert.equal(evidence.scope.symbol,"4806");
assert.equal(evidence.bridgeResult.state,"BOUNDED_CONTINUITY_BRIDGE_READY_PIT_BLOCKED");

const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
function curlHistory(month){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30","--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-S2-07-Reference-Price-Clock/1.2",
    "--data-urlencode","firstin=1","--data-urlencode","step=1","--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id=4806","--data-urlencode","year=115","--data-urlencode","month="+month,
    "--data-urlencode","b_date=","--data-urlencode","e_date=",MOPS_URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error||p.status!==0)throw new Error(String(p.stderr||p.error||"MOPS curl failure").slice(0,500));
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html:p.stdout,stockCode:"4806",expectedDate:null,baseSubject:null,
  });
  return parsed.rows.filter((row)=>row.date&&row.time&&row.seqNo&&row.date<="2026-10-02");
}
function key(row){return [row.date,row.time,row.seqNo].join("|");}

const annual=curlHistory("all");
const monthly=[];
for(let month=1;month<=10;month++)monthly.push(...curlHistory(String(month)));
const a=new Map(annual.map((row)=>[key(row),row]));
const m=new Map(monthly.map((row)=>[key(row),row]));
const onlyAnnual=[...a.keys()].filter((k)=>!m.has(k));
const onlyMonthly=[...m.keys()].filter((k)=>!a.has(k));
const queryIntegrityExact=onlyAnnual.length===0&&onlyMonthly.length===0;

const result=evaluateReferencePriceVersionClockV1_2({
  symbol:"4806",
  family:"CAPITAL_REDUCTION",
  effectiveDate:"2026-10-02",
  officialEventVersionId:evidence.officialReferenceEvidence.eventVersionId,
  officialSourceRowHash:evidence.officialReferenceEvidence.sourceRowHash,
  preActionClose:evidence.officialReferenceEvidence.preActionClose,
  officialReferencePrice:evidence.officialReferenceEvidence.officialReferencePrice,
  mopsRows:annual,
  queryIntegrityExact,
});

assert.equal(result.knownAtVersionClockCertified,false);
assert.equal(result.verifiedSourceTimestampPromoted,false);
assert.equal(result.firstKnownAt,null);
assert.equal(result.availableAt,null);
assert.equal(result.pitEventReplayEligible,false);
assert.equal(result.technicalContinuityCertified,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:"S2_07_REFERENCE_PRICE_VERSION_CLOCK_V1_2_COMPLETE",
  queryIntegrity:{
    annualRowCount:a.size,monthlyRowCount:m.size,onlyAnnual,onlyMonthly,exact:queryIntegrityExact,
  },
  officialReferencePair:{
    preActionClose:result.officialPreActionClose,
    officialReferencePrice:result.officialReferencePrice,
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
