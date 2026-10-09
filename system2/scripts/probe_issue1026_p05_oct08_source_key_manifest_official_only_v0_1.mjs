// P05 public official source-only full key baseline; no Cloudflare credentials.
import {readFile,writeFile} from "node:fs/promises";
import {buildIssue1026Oct08SourceKeyManifestV0_1}
 from "../runtime/issue1026_p05_oct08_source_key_manifest_v0_1.mjs";

const output=process.env.S2_ISSUE1026_P05_SOURCE_KEY_MANIFEST_OUTPUT ||
 "/tmp/s2-issue1026-p05-oct08-frozen-official-11843-key-manifest.json";
let lastStage={stage:"START"},verifiedMarketDates=0;
let result={
 schemaVersion:"S2_ISSUE1026_P05_OFFICIAL_SOURCE_KEY_MANIFEST_BLOCKED_V0_1",
 result:"BLOCKED_OFFICIAL_SOURCE_KEY_MANIFEST_NOT_PHYSICAL_D1",
 physicalD1MissingKeys:"UNKNOWN",hotD1ScoutPhysicalExecuted:0,
 hotD1FullPhysicalExecuted:0,physicalD1SQLQueries:0,
 cloudflareD1Writes:0,cloudflareR2Calls:0,
};
try{
 const path=new URL("../evidence/S2_OCT08_TWSE_TPEX_OFFICIAL_12_DATE_PHYSICAL_SOURCE_ACCEPTANCE_20261009_V0_1.json",import.meta.url);
 const officialEvidence=JSON.parse(await readFile(path,"utf8"));
 result={...await buildIssue1026Oct08SourceKeyManifestV0_1({
  officialEvidence,onStage:x=>{
   lastStage=x;
   if(x.stage==="FROZEN_OFFICIAL_SOURCE_DATE_PASS"){
    verifiedMarketDates++;
    console.log("S2_ISSUE1026_P05_SOURCE_DATE_PASS "+JSON.stringify(x));
   }
  }}),retrospectiveObservationAt:new Date().toISOString()};
}catch(error){
 result={...result,lastStage,verifiedMarketDates,
  reason:String(error?.message||error).slice(0,650)};
 process.exitCode=1;
}
await writeFile(output,JSON.stringify(result,null,2)+"\n","utf8");
console.log("S2_ISSUE1026_P05_SOURCE_MANIFEST_FINAL "+JSON.stringify({
 result:result.result,verifiedMarketDates,
 officialSourceStockDateKeys:result.officialSourceStockDateKeys??null,
 digest:result.manifestSourceKeyValuesSha256??null,
 hotD1ScoutPhysicalExecuted:0,hotD1FullPhysicalExecuted:0,
 physicalD1MissingKeys:"UNKNOWN",physicalD1SQLQueries:0,
}));
