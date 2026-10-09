import {mkdir,writeFile} from "node:fs/promises";
import {planMissingInstitutionDates} from "./system1_institution_gap_resume_v0_1.mjs";
const date="2026-10-08";
const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
if(!token) throw new Error("NORMAL_ADMIN_TOKEN_REQUIRED");
const response=await fetch("https://fugle-test.imihan0630.workers.dev/api/institution-status?marketDate="+date,{
 method:"GET",headers:{"x-admin-token":token,accept:"application/json"},signal:AbortSignal.timeout(35000)
});
if([401,403].includes(response.status))throw new Error("NORMAL_ADMIN_AUTH_REJECTED");
if(!response.ok)throw new Error("INSTITUTION_STATUS_HTTP_"+response.status);
const body=await response.json();
const plan=planMissingInstitutionDates(body,date);
const output={
 schemaVersion:"SYSTEM1_EXACT_INSTITUTION_GAPS_READONLY_V0_1",
 observedAt:new Date().toISOString(),marketDate:date,
 httpStatus:response.status,ready:body.ready===true,historicalReadback:body.historicalReadback===true,
 validTradingDates:[...body.validDates],missingTradingDates:[...body.missingDates],
 plannedRepairDates:plan.repairDates,
 mustNotReimportValidDates:true,noWorkerPost:true,noD1Write:true,noPlanChanges:true,noSelection:true,noPush:true,
 proofScope:"DATE_INVENTORY_ONLY_NOT_PRODUCTION_RECOVERY_ACCEPTANCE"
};
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/system1-institution-exact-gap-inventory.json",JSON.stringify(output,null,2)+"\n");
console.log("SYSTEM1_INSTITUTION_GAP_INVENTORY="+JSON.stringify(output));
