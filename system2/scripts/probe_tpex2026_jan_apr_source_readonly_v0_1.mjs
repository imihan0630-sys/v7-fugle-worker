import {readFile,writeFile} from "node:fs/promises";
import {probeTpex2026SummerMonthSourceV0_1 as probe} from "../runtime/tpex2026_summer_full_month_proxy_source_v0_1.mjs";
const month=Number(process.env.S2_TPEX2026_JAN_APR_MONTH);
const output=process.env.S2_TPEX2026_JAN_APR_OUTPUT||"/tmp/s2-tpex2026-jan-apr-"+month+"-source.json";
let stage={stage:"INIT",month},accepted=0;
let result={schemaVersion:"S2_TPEX2026_JAN_APR_PUBLIC_SOURCE_RUNNER_V0_1",
 result:"BLOCKED_FAIL_CLOSED",month,cloudflareD1ReadRequests:0,
 cloudflareD1Writes:0,cloudflareR2Calls:0,physicalD1R2StorageCertified:false,
 originalHistoricalFirstKnownAtCertified:false,system1RuntimeUsed:false};
try{
 if(![1,2,3,4].includes(month))throw Error("MONTH_NOT_PREREGISTERED");
 const path=new URL("../evidence/S2_TPEX2026_NINE_MONTH_18_SAMPLE_CANONICAL_SOURCE_REAL_ACCEPTANCE_20261009_V0_1.json",import.meta.url);
 const frozenNineMonthEvidence=JSON.parse(await readFile(path,"utf8"));
 result={...await probe({month,frozenNineMonthEvidence,onStage:x=>{
  stage=x;
  if(x.stage==="SOURCE_DATE_PASS"){accepted++;
   console.log("S2_TPEX2026_JAN_APR_SOURCE_DATE_PASS "+JSON.stringify(x));
  }
 }}),observedAt:new Date().toISOString(),
 retrospectiveSourceIsNotOriginalFirstKnownAt:true};
}catch(e){
 result={...result,lastStage:stage,sourceDatesBeforeFailure:accepted,
  error:String(e?.message||e).slice(0,700)};
 process.exitCode=1;
}
await writeFile(output,JSON.stringify(result,null,2)+"\n");
console.log("S2_TPEX2026_JAN_APR_SOURCE_RESULT "+JSON.stringify(result));
