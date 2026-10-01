import {mkdir,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {adaptC1PopulationPages,diagnosePopulation} from "../research/system1_selection_isolated_v0_1.mjs";

const origin=String(process.env.V7_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
const token=String(process.env.V7_ADMIN_TOKEN||"");
const scanDate=String(process.env.C1_SCAN_DATE||"").trim();
const output=resolve(process.env.C1_EVIDENCE_OUTPUT||"artifacts/system1-c1-evidence.json");
if(!token) throw new Error("V7_ADMIN_TOKEN is required");
if(scanDate&&!/^\d{4}-\d{2}-\d{2}$/.test(scanDate)) throw new Error("C1_SCAN_DATE must be YYYY-MM-DD");

const headers={"x-admin-token":token,"accept":"application/json","cache-control":"no-cache"};
const pages=[];
let cursor=0,generationId=null;
for(let requestCount=0;requestCount<100;requestCount+=1){
  const url=new URL(origin+"/api/research/c1-population");
  url.searchParams.set("cursor",String(cursor));
  url.searchParams.set("limit","2");
  if(generationId) url.searchParams.set("generationId",generationId);
  else if(scanDate) url.searchParams.set("scanDate",scanDate);
  const response=await fetch(url,{headers,signal:AbortSignal.timeout(30000)});
  const body=await response.json().catch(()=>({}));
  if(!response.ok||body?.ok!==true) throw new Error(`C1 evidence read failed: HTTP ${response.status} ${JSON.stringify(body).slice(0,500)}`);
  generationId??=body.header?.generationId;
  if(!generationId||body.header?.generationId!==generationId) throw new Error("C1 generation changed during pagination");
  pages.push(body);
  if(body.page?.hasMore!==true) break;
  const next=Number(body.page?.nextCursor);
  if(!Number.isInteger(next)||next<=cursor) throw new Error("C1 pagination did not advance");
  cursor=next;
  if(requestCount===99) throw new Error("C1 pagination exceeded 100 requests");
}

const adapted=adaptC1PopulationPages(pages);
const diagnosis=diagnosePopulation({
  sessionDate:adapted.sessionDate,decisionAt:adapted.decisionAt,
  universe:adapted.universe,rows:adapted.rows,samplePerStratum:3,
  seed:`C1-${adapted.sessionDate}`
});
if(adapted.captureCompleteness!=="IN_MEMORY_COMPLETE_NORMALIZED_UNIVERSE"||diagnosis.coverageComplete!==true)
  throw new Error("C1 complete-population coverage was not verified");
if(!/^[0-9a-f]{40}$/i.test(String(adapted.sourceMainSha||""))) throw new Error("C1 source main SHA is not immutable");
if(adapted.researchOnly!==true||adapted.decisionImpact!==false||adapted.formalCoreImpact!==false||
   diagnosis.researchOnly!==true||diagnosis.decisionImpact!==false||diagnosis.formalCoreImpact!==false)
  throw new Error("C1 research firewall failed");

const gateTotals={};
for(const observation of diagnosis.observations){
  for(const [gate,row] of Object.entries(observation.gates||{})){
    gateTotals[gate]??={PASS:0,FAIL:0,UNKNOWN:0};
    gateTotals[gate][row.status]=(gateTotals[gate][row.status]||0)+1;
  }
}
const firstFailures={};
for(const observation of diagnosis.observations){
  const key=observation.firstFailureReason|| (observation.formalResult?.ok===true?"QUALIFIED":"UNKNOWN");
  firstFailures[key]=(firstFailures[key]||0)+1;
}
const artifact={
  schemaVersion:"SYSTEM1_C1_EVIDENCE_ARTIFACT_V0_1",collectedAt:new Date().toISOString(),origin,
  receipt:{generationId:adapted.generationId,sessionDate:adapted.sessionDate,decisionAt:adapted.decisionAt,
    sourceMainSha:adapted.sourceMainSha,effectiveRuntimeVersion:adapted.effectiveRuntimeVersion,
    contentDigest:adapted.contentDigest,universeDigest:adapted.universeDigest,
    captureCompleteness:adapted.captureCompleteness,pages:pages.length},
  summary:{populationN:diagnosis.populationN,capturedN:diagnosis.capturedN,coverageComplete:diagnosis.coverageComplete,
    selectedN:diagnosis.observations.filter(row=>row.formalResult?.selected===true).length,
    qualifiedN:diagnosis.observations.filter(row=>row.formalResult?.ok===true).length,
    firstFailures,gateTotals,overlaps:diagnosis.overlaps,samples:diagnosis.samples,
    economicSuperiority:"UNKNOWN",fullFormalCounterfactual:false},
  diagnosis,
  safety:{researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true}
};
await mkdir(dirname(output),{recursive:true});
await writeFile(output,JSON.stringify(artifact,null,2)+"\n","utf8");
console.log(JSON.stringify({ok:true,output,generationId:adapted.generationId,sessionDate:adapted.sessionDate,
  populationN:diagnosis.populationN,selectedN:artifact.summary.selectedN,qualifiedN:artifact.summary.qualifiedN,
  pages:pages.length,coverageComplete:true,researchOnly:true,formalCoreImpact:false}));
