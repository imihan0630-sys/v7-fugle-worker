// Official public source only: zero Cloudflare secrets/SQL/R2/provider spending.
import {readFile,writeFile} from "node:fs/promises";
import {probeTpex2026SummerMonthSourceV0_1} from "../runtime/tpex2026_summer_full_month_proxy_source_v0_1.mjs";
const month=Number(process.env.S2_TPEX2026_SUMMER_MONTH);
const out=String(process.env.S2_TPEX2026_SUMMER_OUTPUT||
 "/tmp/s2-tpex2026-summer-"+String(month)+"-source.json");
let report={schemaVersion:"S2_TPEX2026_SUMMER_SOURCE_RUNNER_V0_1",
 result:"BLOCKED_FAIL_CLOSED",month,cloudflareD1ReadRequests:0,
 cloudflareD1Writes:0,cloudflareR2Calls:0,system1RuntimeUsed:false,
 physicalD1R2StorageCertified:false,originalHistoricalFirstKnownAtCertified:false};
let stage={stage:"INIT"},passed=0;
try{
 const p=new URL("../evidence/S2_TPEX2026_NINE_MONTH_18_SAMPLE_CANONICAL_SOURCE_REAL_ACCEPTANCE_20261009_V0_1.json",import.meta.url);
 const baseline=JSON.parse(await readFile(p,"utf8"));
 report={...await probeTpex2026SummerMonthSourceV0_1({
  month,frozenNineMonthEvidence:baseline,
  onStage:x=>{
   stage=x;
   if(x.stage==="SOURCE_DATE_PASS"){
    passed++;
    console.log("S2_TPEX2026_SUMMER_PRIMARY_SOURCE_PASS "+JSON.stringify(x));
   }
  },
 }),observedAt:new Date().toISOString(),
 sourceObservationIsPostFactoNotOriginalFirstKnownAt:true};
}catch(e){
 report={...report,errorType:String(e?.name||"Error"),
  errorMessage:String(e?.message||e).slice(0,700),
  failedStage:stage,previouslyAcceptedDatesInThisRun:passed};
 process.exitCode=1;
}
await writeFile(out,JSON.stringify(report,null,2)+"\n","utf8");
console.log("S2_TPEX2026_SUMMER_SOURCE_RESULT "+JSON.stringify(report));
