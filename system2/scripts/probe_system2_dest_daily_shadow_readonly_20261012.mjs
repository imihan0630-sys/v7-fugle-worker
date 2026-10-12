// OWNER P0 #1132: one-shot native Cloudflare READ-ONLY account-route+quota probe.
// No D1 INSERT, no staging import, no SOURCE/V8 account access, no Cron.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
import {resolveDailyShadowAccountRouteV0_1,assertDailyShadowDestinationDatabaseIdentityV0_1}
 from "../runtime/daily_shadow_destination_account_route_v0_1.mjs";
import {readDestinationD1AccountQuotaV0_1}
 from "../migration/build00_destination_account_quota_analytics_readonly_v0_1.mjs";
import {createRemoteD1RestAdapter} from "../deploy/remote_d1_rest_adapter.mjs";
import {evaluateDestinationDay80SharedWritersV0_1}
 from "../runtime/daily_shadow_destination_day80_writer_sharing_v0_1.mjs";
import {readFile} from "node:fs/promises";
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
function checkCount(x,label){
 if(!Number.isSafeInteger(x)||x<0)throw Error("S2_DEST_READONLY_INVALID_"+label);
 return x;
}
export async function probeSystem2DestDailyQuotaPhysicalReadonlyV0_1({
 accountId,dbToken,analyticsToken,fetchImpl=globalThis.fetch,
 now=()=>new Date().toISOString(),readAudit=async()=>JSON.parse(await readFile(
   new URL("../migration/evidence/S2_AUDIT_DEST_A1_FIRST_IMPORT_FINAL_PHYSICAL_ACCEPTANCE_20261012_V0_1.json",import.meta.url),"utf8")),
}={}){
 const route=resolveDailyShadowAccountRouteV0_1({
  writerId:"DAILY_SHADOW_DIAGNOSTIC",role:"DESTINATION",
  githubEnvironment:"system2-schema-only",accountId,dbToken,analyticsToken
 });
 const accountQuota=await readDestinationD1AccountQuotaV0_1({
  accountId:route.accountId,metadataToken:route.dbToken,
  analyticsToken:route.analyticsToken,fetchImpl,now
 });
 const db=await createRemoteD1RestAdapter({accountId:route.accountId,
  apiToken:route.dbToken,fetchImpl});
 const identity=assertDailyShadowDestinationDatabaseIdentityV0_1(db);
 const [a1,decisions]=await Promise.all([
  db.prepare("SELECT COUNT(*) AS n FROM s2_historical_a1_bars").first(),
  db.prepare("SELECT COUNT(*) AS n FROM s2_decisions").first()
 ]);
 const a1Rows=checkCount(a1?.n,"A1_COUNT"),frozenRows=checkCount(decisions?.n,"DECISION_COUNT");
 const quotaDay=accountQuota.quotaDayUtc;
 const budget=evaluateDestinationDay80SharedWritersV0_1({
   quotaDay,nowFloorProof:await readAudit(),
   accountRowsWrittenLowerBound:accountQuota.currentDayGroupEvidenceComplete?
    accountQuota.writeObservedLowerBound:null
 });
 const receipt={
  schemaVersion:"S2_P0_DEST_NATIVE_SHADOW_READONLY_PREFLIGHT_V0_1",
  observedAtUtc:now(),quotaDay,
  destinationAccountSha256:route.accountFingerprint,
  destinationD1Sha256:identity.destinationDatabaseFingerprint,
  quotaGraphqlAuthenticated:accountQuota.authenticatedAccountAnalytics,
  quotaGroupComplete:accountQuota.currentDayGroupEvidenceComplete,
  quotaGroupSamples:accountQuota.originalUsageSamples.map(x=>({
   groupState:x.groupState,groupCount:x.groupCount,
   observedAtUtc:x.observedAtUtc,
   rowsWrittenLowerBound:x.rowsWrittenLowerBound??null,
   rowsReadLowerBound:x.rowsReadLowerBound??null
  })),
  previousQuotaDayDiagnostic:accountQuota.previousUtcDayDiagnostic,
  destinationPhysicalA1Rows:a1Rows,destinationPhysicalFrozenRows:frozenRows,
  quotaPhysicalQueryReadRows:db.metrics.rowsRead,
  auditImportedBilledWritesFloor:budget.auditImportedRowsWrittenFloor,
  ownerOperationalWriteCeiling:budget.ownerDailyOperationalMax,
  shadowHistoricalMeasuredReserve:budget.shadowReservedBilledWrites,
  ownerDay80ProjectedWrites:budget.projectedBilledRowsWritten,
  nextWriterPermittedByOwnerCap:budget.nextWriterPermittedByOperationalCap,
  sourceV8Contacted:false,sourceSystem2Contacted:false,
  d1SqlWrites:0,destinationWorkerCronMutations:0,
  authorizedStrategyExecuted:false,selectedCount:null,zeroPickDay:null,
  frozenNewDecisionReadback:false,
  canGrantPhysicalDailyShadowWriter:false,
  state:budget.nextWriterPermittedByOperationalCap&&
    accountQuota.currentDayGroupEvidenceComplete?
    "DEST_PROVIDER_READBACK_PASS_BUT_QUOTA_LEDGER_AUDIT_REQUIRED":
    "DEST_PROVIDER_READBACK_PASS_DAILY_MUTATION_BLOCKED"
 };
 return Object.freeze({...receipt,hashSha256:hash(receipt)});
}
if(process.argv[1]?.endsWith("/probe_system2_dest_daily_shadow_readonly_20261012.mjs")){
 try{
  const receipt=await probeSystem2DestDailyQuotaPhysicalReadonlyV0_1({
   accountId:process.env.S2_SCHEMA_DEST_ACCOUNT_ID,
   dbToken:process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN,
   analyticsToken:process.env.S2_DEST_ACCOUNT_ANALYTICS_READ_TOKEN
  });
  const path="/tmp/s2-p0-daily-dest-readonly";
  await mkdir(path,{recursive:true,mode:0o700});
  await writeFile(path+"/native-cloudflare-preflight.json",JSON.stringify(receipt,null,2)+"\n",{flag:"wx",mode:0o600});
  console.log(JSON.stringify({state:receipt.state,quotaDay:receipt.quotaDay,
   a1Rows:receipt.destinationPhysicalA1Rows,
   accountGroupComplete:receipt.quotaGroupComplete,
   importedCostFloor:receipt.auditImportedBilledWritesFloor,
   ownerDay80ProjectedWrites:receipt.ownerDay80ProjectedWrites,
   canGrantPhysicalDailyShadowWriter:false,
   originalReceiptSha256:receipt.hashSha256}));
 }catch(e){
  console.error("S2_P0_READONLY_PREFLIGHT_FAIL_CLOSED_"+String(e?.message||"UNKNOWN").replace(/[^A-Z0-9_]/gi,"_").slice(0,90));
  process.exitCode=2;
 }
}
