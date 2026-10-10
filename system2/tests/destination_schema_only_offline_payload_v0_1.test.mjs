import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {planDestinationSchemaOnlyOfflineV0_1 as plan} from "../migration/destination_schema_only_offline_payload_v0_1.mjs";
import {collectCurrentSqlFilesOfflineV0_1 as collect} from "../migration/destination_schema_prefix_offline_v0_1.mjs";
const files=collect();
const sourceProvisioner=readFileSync("system2/deploy/provision_system2_d1.mjs","utf8");
const receipt=JSON.parse(readFileSync("system2/migration/evidence/S2_DEST_D1_POSTCREATE_REAL_GETONLY_RECONCILIATION_20261010_V0_1.json","utf8"));
const req=()=>({files:files.map(f=>({...f})),sourceProvisioner,destinationReceipt:structuredClone(receipt)});
const v=plan(req());
assert.equal(v.state,"SOURCE_SQL_PAYLOAD_OFFLINE_SEALED_NOT_AUTHORIZED");
assert.equal(v.plannedStatements,125);
assert.equal(v.sqlStatements.length,125);
assert.equal(v.createTables,55);
assert.equal(v.createIndexes,63);
assert.equal(v.schemaMetaUpserts,7);
assert.equal(v.activeMigrations,10);
assert.equal(v.stagedMigrationsExcluded,1);
assert.equal(v.cloudMutationAllowed,false);
assert.equal(v.workerOrCronDeployAllowed,false);
assert.equal(v.ownerApproved,false);
assert.equal(v.sourceCloudReadsOrWrites,0);
assert.equal(v.destinationCloudReadsOrWrites,0);
assert.equal(v.rowsMigrated,0);
assert.equal(v.requiresFreshDestinationAccountQuotaReservation,true);
assert.equal(v.requiresPreWriteEmptySchemaReadback,true);
assert.equal(v.requiresAuditedPartialFailureResumePlan,true);
assert.equal(v.requiresNewDestinationOnlyWriteToken,true);
assert(v.sqlStatements.every(s=>/^000[1-9]_.*\.sql$|^0010_.*\.sql$/.test(s.file)));
assert(v.sqlStatements.every(s=>!s.sql.includes("V7_DB")&&!s.sql.includes("fugle-test")));
assert(v.sqlStatements.every(s=>!/\bDROP\s+TABLE\b/i.test(s.sql)));
const seqHash=v.planSequenceSha256;
assert.equal(plan(req()).planSequenceSha256,seqHash);
assert.match(seqHash,/^[a-f0-9]{64}$/);
// There is NO Cloudflare HTTP transport/executor in this module.
// The following are all mocked/in-memory unsafe input mutations.
function bad(fn,code){
 const a=req();fn(a);const z=plan(a);assert.equal(z.state,"EVIDENCE_BLOCKED");
 assert(z.blockers.includes(code),JSON.stringify({wanted:code,got:z.blockers}));
 assert.equal(z.cloudMutationAllowed,false);assert.equal(z.sqlStatements.length,0);
}
bad(a=>a.files=a.files.slice(0,10),"SQL_REPOSITORY_FILE_SET_NOT_VERIFIED");
bad(a=>a.files[0].sql+="\nDROP TABLE s2_decisions;","PRODUCTION_OR_DESTRUCTIVE_SQL_FOUND");
bad(a=>a.files[0].sql+="\nCREATE TABLE IF NOT EXISTS s2_unsafe (id TEXT);","ACTIVE_10_SQL_SCHEMA_COUNTS_OR_REQUIRED_TABLES_MISMATCH");
bad(a=>a.files[0].sql+="\nSELECT * FROM s2_decisions;","UNEXPECTED_ACTIVE_SQL_STATEMENT");
bad(a=>a.sourceProvisioner=a.sourceProvisioner.replace('"../sql/0010_current_year_segmented_cold_store.sql",','"../sql/0010_current_year_segmented_cold_store.sql",\n"../sql/0011_outcome_revision_archive_staged.sql",'),"SOURCE_PROVISIONER_PREFIX_UNVERIFIED");
bad(a=>a.destinationReceipt.afterDestination.databases[0].name="v7-live","EXISTING_EMPTY_DESTINATION_API_RECEIPT_UNVERIFIED");
bad(a=>a.destinationReceipt.afterDestination.cronCount=1,"EXISTING_EMPTY_DESTINATION_API_RECEIPT_UNVERIFIED");
console.log("System2 destination schema-only sealed offline payload: 125 statements = 55 tables + 63 indexes + 7 schema meta upserts; all no-write flags + 7 forged-input tests PASS");
