// No Cloudflare/D1/R2 access; public official TWSE calendar + TPEx primary only.
import {writeFile} from "node:fs/promises";
import {probeTpex2026CanonicalMonthlySourceV0_1} from "../runtime/tpex2026_monthly_canonical_source_probe_v0_1.mjs";

const output=String(process.env.S2_TPEX2026_CANONICAL_PROBE_OUTPUT
  ||"/tmp/s2-tpex2026-canonical-source-probe.json");
const start=new Date().toISOString();
let lastStage={stage:"INIT",month:null,date:null};
let acceptedSamples=0;
let report={
  result:"BLOCKED_FAIL_CLOSED",
  schemaVersion:"S2_TPEX2026_CANONICAL_SOURCE_PROBE_RUNNER_V0_1",
  observedAt:start,
  cloudflareD1ReadRequests:0,cloudflareD1Writes:0,cloudflareR2Calls:0,
  system1RuntimeUsed:false,
  firstKnownAtCertified:false,officialTpexSessionCalendarCertified:false,
  fullHistoricalRangeCertified:false,marketYearCoveragePromoted:false,
  liveSelectionAuthorized:false,
};
try{
  const proof=await probeTpex2026CanonicalMonthlySourceV0_1({
    onStage:step=>{
      lastStage=step;
      if(step.stage==="SAMPLE_PASS"){
        acceptedSamples+=1;
        console.log("TPEX_2026_OFFICIAL_SAMPLE_PASS "+JSON.stringify(step));
      }else if(step.stage==="TWSE_PROXY_CALENDAR"){
        console.log("TPEX_2026_MONTH_START "+JSON.stringify(step));
      }
    },
  });
  report={...proof,observedAt:new Date().toISOString(),
    originalObservationDateForHistoricSamples:false,
    recordType:"RETROSPECTIVE_POST_FACTO_OFFICIAL_SOURCE_PROBE"};
}catch(error){
  report={...report,lastStage,acceptedSamples,
    errorName:String(error?.name||"Error"),
    errorMessage:String(error?.message||error).slice(0,500),
    failedMonth:lastStage.month,failedDate:lastStage.date,
    sourceNotSafeForBackfillIfFail:true};
  process.exitCode=1;
}
await writeFile(output,JSON.stringify(report,null,2)+"\n","utf8");
console.log("S2_TPEX2026_SOURCE_PREFLIGHT_RESULT "+JSON.stringify(report));
