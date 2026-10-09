import {writeFile} from "node:fs/promises";
import {auditOct08OfficialSourceWindowReadonlyV0_1} from "../runtime/oct08_latest_completed_source_gate_v0_1.mjs";
const output=process.env.S2_OCT08_SOURCE_GATE_OUTPUT||"/tmp/system2-oct08-source-gate.json";
const observedAt=new Date().toISOString();
let stage={market:null,date:null},receipts=[];
let result=null;
try{
  const audit=await auditOct08OfficialSourceWindowReadonlyV0_1({
    onReceipt:receipt=>{
      stage={market:receipt.market,date:receipt.marketDate};
      receipts.push(receipt);
      console.log("S2_OCT08_OFFICIAL_SOURCE_RECEIPT "+JSON.stringify(receipt));
    },
  });
  result={...audit,observedAt,proofClass:"POST_FACTO_OFFICIAL_SOURCE_DATE_AND_ROWSET_ONLY",
    originalLivePITReplayPermitted:false};
}catch(e){
  result={
    schemaVersion:"S2_OCT08_LATEST_COMPLETED_SOURCE_GATE_BLOCKED_V0_1",
    result:"BLOCKED_FAIL_CLOSED_OFFICIAL_SOURCE_WINDOW",
    referenceCutoff:"2026-10-08",failedAfter:stage,
    completedSampleCount:receipts.length,completedSamples:receipts,
    errorName:String(e?.name||"Error"),
    errorMessage:String(e?.message||e).slice(0,500),
    mustNotInferSourceNoData:true,
    mustNotInferD1OrR2PhysicalPresence:true,
    mustNotClaimHistoricalFirstKnownAt:true,
    system1FormalRuntimeUsed:false,
    d1Requests:0,d1RowsWritten:0,r2Requests:0,r2ObjectsWritten:0,
  };
  process.exitCode=1;
}
await writeFile(output,JSON.stringify(result,null,2)+"\n","utf8");
console.log("S2_OCT08_SOURCE_GATE_RESULT "+JSON.stringify(result));
