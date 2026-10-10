import assert from "node:assert/strict";
import {readdirSync,readFileSync} from "node:fs";
import {join} from "node:path";
import {inventoryOfflineSystem2SqlMigrationsV0_1 as inventory, attestOfflineSourceD1ExportV0_1 as attest} from "../migration/source_d1_export_attestation_v0_1.mjs";
const dir="system2/sql";
const files=readdirSync(dir).filter(name=>/^\d{4}_.*\.sql$/.test(name))
  .map(name=>({name,content:readFileSync(join(dir,name),"utf8")}));
const schema=inventory(files);
assert.equal(schema.sqlMigrationFileCount,11);
assert(schema.expectedTableCount>30,"Schema index unexpectedly truncated");
assert(schema.tableNames.includes("s2_decisions"));
assert(schema.tableNames.includes("s2_schema_meta"));
assert(schema.tableNames.includes("s2_historical_a1_bars"));
assert.equal(new Set(schema.tableNames).size,schema.expectedTableCount);
const noManifest=attest({schema});
assert.equal(noManifest.result,"EVIDENCE_BLOCKED");
assert(noManifest.blockers.includes("PHYSICAL_SOURCE_D1_EXPORT_MANIFEST_MISSING"));
assert.equal(noManifest.theoreticalMinimumFreeQuotaDays,null);
assert.equal(noManifest.realRowsMigrated,0);
assert.equal(noManifest.cloudMutationAuthorized,false);
const sha="a".repeat(64);
const full=()=>({
  schemaVersion:"S2_CROSS_ACCOUNT_SOURCE_D1_EXPORT_V0_1",
  verifiedFrom:"SOURCE_D1_PHYSICAL_READ_ONLY_EXPORT",
  physicalReadback:true,databaseName:"system2-research",
  runId:38011111111,artifactId:11611111111,
  artifactSha256:sha,exportSha256:sha,schemaSha256:sha,
  frozenSnapshotSha256:sha,observedAt:"2026-10-10T04:00:00Z",
  migrationSqlSha256:schema.migrationSqlSha256,
  tables:schema.tableNames.map(name=>({name,rows:name==="s2_decisions"?3:0,sha256:sha,schemaSha256:sha})),
  frozenDecisionRowCount:3,frozenSnapshotPhysicalReadback:true,
  sourceReadBudget:{readOnlyGuardPassed:true,system1ReadReserveVerified:true,
    accountHeadroomCertified:true,rowsRead:1,rowsWritten:0,quotaDayUtc:"2026-10-10"},
  backupRetentionLocked:true,immutableSnapshotRetentionLocked:true,
});
const doc=attest({schema,manifest:full()});
assert.equal(doc.result,"OFFLINE_DOCUMENT_REVIEW_ONLY");
assert.deepEqual(doc.blockers,[]);
assert.equal(doc.theoreticalMinimumFreeQuotaDays,1);
assert.equal(doc.minimumDestinationRowsWrittenLowerBound,3);
assert.equal(doc.physicalTableReceiptCount,schema.expectedTableCount);
assert.equal(doc.cloudMutationAuthorized,false);
assert.equal(doc.cutoverAuthorized,false);
assert.equal(doc.newD1ImportCapacityCertified,false);
assert.equal(doc.independentAuditPassed,false);
assert(!JSON.stringify(doc).includes(sha));
for(const [patch,code] of [
  [m=>m.tables.pop(),"SOURCE_TABLE_SET_DIFFERS_FROM_VERSIONED_SQL"],
  [m=>m.tables[0].name=m.tables[1].name,"SOURCE_TABLE_ROWS_AND_HASHES_INVALID"],
  [m=>m.tables[0].name="v7_live","SOURCE_TABLE_ROWS_AND_HASHES_INVALID"],
  [m=>m.tables[0].sha256="invalid","SOURCE_TABLE_ROWS_AND_HASHES_INVALID"],
  [m=>m.tables[0].rows=-1,"SOURCE_TABLE_ROWS_AND_HASHES_INVALID"],
  [m=>m.frozenDecisionRowCount=99,"FROZEN_DECISION_SNAPSHOT_INVARIANT_UNVERIFIED"],
  [m=>m.frozenSnapshotPhysicalReadback=false,"FROZEN_DECISION_SNAPSHOT_INVARIANT_UNVERIFIED"],
  [m=>m.migrationSqlSha256="b".repeat(64),"SOURCE_EXPORT_SQL_MIGRATION_FINGERPRINT_MISMATCH"],
  [m=>m.physicalReadback=false,"PHYSICAL_SOURCE_IDENTITY_AND_HASH_CHAIN_UNVERIFIED"],
  [m=>m.runId=0,"PHYSICAL_SOURCE_IDENTITY_AND_HASH_CHAIN_UNVERIFIED"],
  [m=>m.artifactSha256="x","PHYSICAL_SOURCE_IDENTITY_AND_HASH_CHAIN_UNVERIFIED"],
  [m=>m.databaseName="v7-live","PHYSICAL_SOURCE_IDENTITY_AND_HASH_CHAIN_UNVERIFIED"],
  [m=>m.sourceReadBudget.rowsWritten=1,"SOURCE_READ_QUOTA_AND_FORMAL_RESERVE_UNVERIFIED"],
  [m=>m.sourceReadBudget.system1ReadReserveVerified=false,"SOURCE_READ_QUOTA_AND_FORMAL_RESERVE_UNVERIFIED"],
  [m=>m.sourceReadBudget.accountHeadroomCertified=false,"SOURCE_READ_QUOTA_AND_FORMAL_RESERVE_UNVERIFIED"],
  [m=>m.backupRetentionLocked=false,"SOURCE_BACKUP_RETENTION_UNVERIFIED"],
  [m=>m.immutableSnapshotRetentionLocked=false,"SOURCE_BACKUP_RETENTION_UNVERIFIED"],
]){
 const m=full();patch(m);
 const x=attest({schema,manifest:m});
 assert.equal(x.result,"EVIDENCE_BLOCKED",code);
 assert(x.blockers.includes(code),JSON.stringify({code,blockers:x.blockers}));
 assert.equal(x.cloudMutationAuthorized,false);
}
const large=full();large.tables[0].rows=100001;
const wide=attest({schema,manifest:large});
assert.equal(wide.theoreticalMinimumFreeQuotaDays,2);
const trillion=full();trillion.tables=trillion.tables.map(t=>({...t,rows:Number.MAX_SAFE_INTEGER}));
const unsafe=attest({schema,manifest:trillion});
assert(unsafe.blockers.includes("SOURCE_ROW_COUNTS_UNSAFE_INTEGER"));
assert.equal(unsafe.minimumDestinationRowsWrittenLowerBound,null);
assert.throws(()=>inventory([]),/UNVERIFIED/);
assert.throws(()=>inventory(files.slice(1)),/UNVERIFIED/);
assert.throws(()=>inventory([...files,files[0]]),/UNVERIFIED/);
assert.throws(()=>inventory(files.map((f,i)=>i===0?{...f,content:f.content+"\nCREATE TABLE IF NOT EXISTS v7_account(id INT);"}:f)),/UNVERIFIED/);
console.log("System2 D1 SQL migration schema fingerprint + export receipt: 25 offline checks PASS");
