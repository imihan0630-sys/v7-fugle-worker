// DATA_LANE Class A. May/June official public source-only, not storage or original PIT.
import {readFile,writeFile} from "node:fs/promises";
import {probeTpex2026SummerMonthSourceV0_1 as checkMonth}
 from "../runtime/tpex2026_summer_full_month_proxy_source_v0_1.mjs";
const month=Number(process.env.S2_TPEX2026_MAY_JUNE_MONTH);
const output=String(process.env.S2_TPEX2026_MAY_JUNE_OUTPUT||
 "/tmp/s2-tpex2026-may-june-"+String(month)+"-source.json");
let stage={stage:"INIT",month},passed=0;
let result={schemaVersion:"S2_TPEX2026_MAY_JUNE_SOURCE_ONLY_RUNNER_V0_1",
 month,result:"BLOCKED_FAIL_CLOSED_NO_STORAGE_AUTHORITY",
 cloudflareD1ReadRequests:0,cloudflareD1Writes:0,cloudflareR2Calls:0,
 physicalD1R2StorageCertified:false,originalHistoricalFirstKnownAtCertified:false,
 system1RuntimeUsed:false};
try{
 if(![5,6].includes(month))throw Error("MAY_JUNE_WORKFLOW_MONTH_UNAUTHORIZED");
 const file=new URL("../evidence/S2_TPEX2026_NINE_MONTH_18_SAMPLE_CANONICAL_SOURCE_REAL_ACCEPTANCE_20261009_V0_1.json",import.meta.url);
 const frozenNineMonthEvidence=JSON.parse(await readFile(file,"utf8"));
 result={...await checkMonth({month,frozenNineMonthEvidence,onStage:x=>{
  stage=x;
  if(x.stage==="SOURCE_DATE_PASS"){
   passed++;
   console.log("S2_TPEX2026_MAY_JUNE_CANONICAL_DATE_PASS "+JSON.stringify(x));
  }
 }}),observedAt:new Date().toISOString(),
 sourceObservationIsRetrospectiveNotOriginalDecisionAvailability:true};
}catch(e){
 result={...result,lastStage:stage,acceptedBeforeFailure:passed,
  errorType:String(e?.name||"Error"),reason:String(e?.message||e).slice(0,750)};
 process.exitCode=1;
}
await writeFile(output,JSON.stringify(result,null,2)+"\n","utf8");
console.log("S2_TPEX2026_MAY_JUNE_SOURCE_RESULT "+JSON.stringify(result));
