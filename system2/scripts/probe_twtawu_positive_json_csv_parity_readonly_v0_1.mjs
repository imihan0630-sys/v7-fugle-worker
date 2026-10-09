import assert from "node:assert/strict";
import { mkdir,writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { probeTwtaWuPositiveJsonCsvParityV0_1 } from "../runtime/twtawu_positive_json_csv_parity_diagnostic_v0_1.mjs";

const outputPath=String(process.env.SYSTEM2_TWTAWU_POSITIVE_PARITY_OUTPUT||"").trim();
let receipt=null;
try{
  assert.ok(outputPath,"SYSTEM2_TWTAWU_POSITIVE_PARITY_OUTPUT required");
  receipt=await probeTwtaWuPositiveJsonCsvParityV0_1({});
  await mkdir(dirname(outputPath),{recursive:true});
  await writeFile(outputPath,JSON.stringify(receipt,null,2)+"\n","utf8");
  console.log("S2_TWTAWU_POSITIVE_PARITY_DIAGNOSTIC "+JSON.stringify({
    result:receipt.result,
    json:receipt.observations.json||null,
    csvCandidate:receipt.observations.csvCandidate||null,
    jsonCsvRowSetParity:receipt.jsonCsvRowSetParity,
    exactRangeCompletenessProven:receipt.exactRangeCompletenessProven,
    noEventMayBeClaimed:receipt.noEventMayBeClaimed,
    ncT01PromotionAuthorized:receipt.ncT01PromotionAuthorized,
    blockers:receipt.blockers,
    d1RowsRead:receipt.d1RowsRead,d1RowsWritten:receipt.d1RowsWritten,
  }));
  if(receipt.result!=="MATCHED_POSITIVE_PARITY_DIAGNOSTIC_ONLY")
    process.exitCode=1;
}catch(error){
  const failure={
    result:"BLOCKED_TWTAWU_POSITIVE_PARITY_PROBE",
    error:String(error?.message||error).slice(0,300),
    priorReceipt:receipt,
    noEventMayBeClaimed:false,exactRangeCompletenessProven:false,
    ncT01PromotionAuthorized:false,externalMutationPerformed:false,
  };
  console.error("S2_TWTAWU_POSITIVE_PARITY_BLOCKED "+JSON.stringify(failure));
  if(outputPath){
    try{
      await mkdir(dirname(outputPath),{recursive:true});
      await writeFile(outputPath,JSON.stringify(failure,null,2)+"\n","utf8");
    }catch(writeError){
      console.error("artifact write also failed: "+String(writeError?.message||writeError));
    }
  }
  process.exitCode=1;
}
