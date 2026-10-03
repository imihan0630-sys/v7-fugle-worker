import {mkdir,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {collectSystem1PostSessionEvidence} from "../research/system1_postsession_evidence_v0_1.mjs";

const origin=String(process.env.V7_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
const token=String(process.env.V7_ADMIN_TOKEN||"");
const targetTradeDate=String(process.env.C3_TARGET_TRADE_DATE||"").trim();
const output=resolve(process.env.C3_POSTSESSION_OUTPUT||"artifacts/system1-postsession-evidence.json");
const c3Output=resolve(process.env.C3_ENTRY_OUTPUT||"artifacts/system1-c3-entry.json");
const c4Output=resolve(process.env.C4_ALLOCATION_OUTPUT||"artifacts/system1-c4-allocation.json");
const c5Output=resolve(process.env.C5_OVERFILTER_OUTPUT||"artifacts/system1-c5-overfilter.json");
const blockerOutput=resolve(process.env.C3_POSTSESSION_BLOCKER_OUTPUT||"artifacts/system1-postsession-blocker.json");
const save=async(path,value)=>{await mkdir(dirname(path),{recursive:true});await writeFile(path,JSON.stringify(value,null,2)+"\n","utf8");};

try{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(targetTradeDate)) throw new Error("C3_TARGET_TRADE_DATE_REQUIRED");
  const packet=await collectSystem1PostSessionEvidence({origin,token,targetTradeDate});
  await save(output,packet);
  await save(c3Output,packet.c3);
  await save(c4Output,packet.c4);
  await save(c5Output,packet.c5);
  console.log(JSON.stringify({
    ok:true,targetTradeDate,generationId:packet.generationId,cohortN:packet.cohort.n,
    c3ReadyN:packet.capture.audit.readyN,c3BlockedN:packet.capture.audit.blockedN,
    c3ReceiptN:packet.c3.tally.receiptN,c4Status:packet.c4.status,c5DenominatorN:packet.c5.denominatorN,
    formalBaselineUnknownN:packet.c3.tally.formalBaselineUnknownN,
    economicSuperiority:"UNKNOWN",noPlanChanges:true,noTrade:true,noPush:true
  }));
}catch(error){
  const code=String(error?.code||error?.message||"C3_POSTSESSION_FAILED").slice(0,180);
  const blocker={
    schemaVersion:"SYSTEM1_POSTSESSION_BLOCKER_V0_1",observedAt:new Date().toISOString(),
    targetTradeDate,status:"BLOCKED",error:code,detail:error?.detail??null,
    mayCountAsZeroPick:false,eligibleForResearch:false,economicSuperiority:"UNKNOWN",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
  };
  await save(blockerOutput,blocker);
  console.error(JSON.stringify({c3PostSessionBlocked:true,targetTradeDate,error:code,blockerOutput,
    mayCountAsZeroPick:false,noPlanChanges:true,noTrade:true,noPush:true}));
  process.exitCode=1;
}
