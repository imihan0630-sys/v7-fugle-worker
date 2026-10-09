// Public-only: zero Cloudflare credentials, SQL, storage or trading.
import {readFile,writeFile} from "node:fs/promises";
import {probeTpex2026SepFullProxyDatesV0_1} from "../runtime/tpex2026_september_full_proxy_source_probe_v0_1.mjs";
const file=new URL("../evidence/S2_TPEX2026_NINE_MONTH_18_SAMPLE_CANONICAL_SOURCE_REAL_ACCEPTANCE_20261009_V0_1.json",import.meta.url);
const output=process.env.S2_TPEX2026_SEP_SOURCE_PROBE_OUTPUT
 ||"/tmp/s2-tpex2026-september-full-proxy-source.json";
let stage={stage:"INIT"},passed=0;
let report={schemaVersion:"S2_TPEX2026_SEPTEMBER_FULL_PROXY_SOURCE_RUNNER_V0_1",
 result:"BLOCKED_FAIL_CLOSED_NO_STORAGE_AUTHORITY",
 originalHistoricPIT:false,officialTpexCalendar:false,
 cloudflareD1ReadRequests:0,cloudflareD1Writes:0,cloudflareR2Calls:0,
 system1RuntimeUsed:false};
try{
 const frozenEvidence=JSON.parse(await readFile(file,"utf8"));
 const v=await probeTpex2026SepFullProxyDatesV0_1({
  frozenEvidence,onStage:x=>{
   stage=x;
   if(x.stage==="TPEX_SOURCE_DAY_PASS"){
    passed++;
    console.log("S2_TPEX2026_SEP_SOURCE_DATE_PASS "+JSON.stringify(x));
   }
  },
 });
 report={...v,observedAt:new Date().toISOString(),
  sourceObservationIsNotOriginalDecisionAvailability:true};
}catch(e){
 report={...report,lastStage:stage,passedSourceDates:passed,
  reason:String(e?.message||e).slice(0,700),name:String(e?.name||"Error")};
 process.exitCode=1;
}
await writeFile(output,JSON.stringify(report,null,2)+"\n");
console.log("S2_TPEX2026_SEP_SOURCE_RESULT "+JSON.stringify(report));
