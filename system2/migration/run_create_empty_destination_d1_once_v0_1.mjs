// Executed only by an owner-approved manual GitHub Environment action, never by CI or a scheduler.
// Secrets never printed; no automatic retries, SQL, Worker, R2 or billing operations.
import {writeFile,mkdir} from "node:fs/promises";
import {createOneEmptyDestinationD1V0_1} from "./create_empty_destination_d1_once_v0_1.mjs";
const receiptFile="/tmp/system2-destination-empty-d1-create/receipt.json";
await mkdir("/tmp/system2-destination-empty-d1-create",{recursive:true});
let receipt;
try {
  if(process.env.GITHUB_REF!=="refs/heads/main" ||
     process.env.GITHUB_EVENT_NAME!=="workflow_dispatch")throw Error("MANUAL_MAIN_BRANCH_ONLY");
  receipt=await createOneEmptyDestinationD1V0_1({
    sourceAccountId:process.env.S2_SOURCE_ACCOUNT_ID_DENY,
    destinationAccountId:process.env.S2_DESTINATION_ACCOUNT_ID,
    apiToken:process.env.S2_DESTINATION_D1_CREATE_TOKEN,
    confirm:process.env.S2_D1_CREATE_CONFIRM,
    freeAck:process.env.S2_D1_FREE_TIER_ACK,
    fetchImpl:globalThis.fetch,
  });
  console.log("DESTINATION_D1_RESOURCE_CREATE_SUCCESS_REQUIRES_INDEPENDENT_AUDIT");
} catch(e) {
  const code=String(e?.message||"UNKNOWN_UNCLASSIFIED").replace(/[^A-Z0-9_]/g,"").slice(0,80);
  receipt={schemaVersion:"S2_DESTINATION_EMPTY_D1_CREATE_RECEIPT_V0_1",
    status:"FAIL_CLOSED_OR_UNKNOWN_CREATE_OUTCOME",errorCode:code,
    databaseCount:null,possibleCloudMutation:"UNKNOWN_NEVER_AUTO_RETRY",
    schemaSqlStatementsExecuted:0,sourceDatabaseMutated:false,
    physicalMigrationAccepted:false,independentAuditAccepted:false};
  console.error("DESTINATION_D1_CREATE_FAIL_CLOSED_CODE="+code);
  process.exitCode=1;
}
await writeFile(receiptFile,JSON.stringify(receipt,null,2)+"\n",{mode:0o600,flag:"wx"});
