import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {inspectDestinationSchemaPrefixOfflineV0_1 as inspect,collectCurrentSqlFilesOfflineV0_1 as collect} from "../migration/destination_schema_prefix_offline_v0_1.mjs";
const files=collect();
const sourceProvisioner=readFileSync("system2/deploy/provision_system2_d1.mjs","utf8");
const receipt=JSON.parse(readFileSync("system2/migration/evidence/S2_DEST_D1_POSTCREATE_REAL_GETONLY_RECONCILIATION_20261010_V0_1.json","utf8"));
const input=()=>({files:files.map(f=>({...f})),sourceProvisioner,destinationReceipt:structuredClone(receipt)});
const base=inspect(input());
assert.equal(base.result,"OFFLINE_APPROVED_PREFIX_CANDIDATE_ONLY",JSON.stringify(base.blockers));
assert.equal(base.activePrefixFiles,10);
assert.equal(base.repositorySqlFiles,11);
assert.equal(base.sourceDefinedActiveTables,55);
assert.equal(base.sourceDefinedActiveIndexes,63);
assert.equal(base.sourceDefinedStagedExtraTables,1);
assert.deepEqual(base.stagedExcludedFiles,["0011_outcome_revision_archive_staged.sql"]);
assert.equal(base.intendedSchemaVersion,"1.1");
assert.equal(base.databaseCreationRequired,false);
assert.equal(base.cloudRequestsPerformed,0);
assert.equal(base.cloudSchemaWritesAuthorized,false);
assert.equal(base.ownerExplicitSchemaImportApprovalPresent,false);
assert.equal(base.sourceSourceD1DataRowsCopied,0);
assert.equal(base.physicalSourceAppliedSchemaVerified,false);
assert.equal(base.destinationSqlSchemaVerified,false);
assert.equal(base.independentAuditAccepted,false);
// Execute approved ten-file prefix in SQLite in MEMORY. No Cloudflare account access.
const python=[
'import sys, sqlite3, json',
'from pathlib import Path',
'con=sqlite3.connect(":memory:")',
'try:',
'    paths=[Path(x) for x in sys.argv[1:]]',
'    for p in paths:',
'        con.executescript(p.read_text(encoding="utf8"))',
'    tables={r[0] for r in con.execute("SELECT name FROM sqlite_schema WHERE type=\'table\' AND name LIKE \'s2_%\'")}',
'    indexes={r[0] for r in con.execute("SELECT name FROM sqlite_schema WHERE type=\'index\' AND name NOT LIKE \'sqlite_autoindex_%\'")}',
'    triggers={r[0] for r in con.execute("SELECT name FROM sqlite_schema WHERE type=\'trigger\'")}',
'    version=con.execute("SELECT schema_value FROM s2_schema_meta WHERE schema_key=\'schema_version\'").fetchone()',
'    meta=con.execute("SELECT COUNT(*) FROM s2_schema_meta").fetchone()[0]',
'    print(json.dumps({"tables":len(tables),"indexes":len(indexes),"triggers":len(triggers),',
'      "version":version[0] if version else None,"metaRows":meta,',
'      "hasStagedOutcomeArchive":"s2_outcome_revision_archive" in tables,',
'      "hasFrozenDecisionTable":"s2_decisions" in tables,',
'      "hasHistoricalBars":"s2_historical_a1_bars" in tables,',
'      "hasResonance":"s2_resonance_snapshots" in tables,',
'      "hasHoldings":"s2_actual_holdings_snapshots" in tables,',
'      "hasSegmentStore":"s2_historical_a1_segment_manifests" in tables}))',
'finally:',
'    con.close()',
].join("\n");
const smoke=spawnSync("python3",["-c",python,...files.slice(0,10).map(f=>"system2/sql/"+f.name)],{encoding:"utf8",timeout:20000,maxBuffer:1000000});
assert.equal(smoke.status,0,smoke.stderr||"Python sqlite3 schema dry-run failed");
const result=JSON.parse(smoke.stdout);
assert.deepEqual(result,{
 tables:55,indexes:63,triggers:0,version:"1.1",metaRows:1,
 hasStagedOutcomeArchive:false,hasFrozenDecisionTable:true,hasHistoricalBars:true,
 hasResonance:true,hasHoldings:true,hasSegmentStore:true
});
const firstSeven=spawnSync("python3",["-c",python,...files.slice(0,7).map(f=>"system2/sql/"+f.name)],{encoding:"utf8",timeout:20000,maxBuffer:1000000});
assert.equal(firstSeven.status,0,firstSeven.stderr||"Seven-file SQLite prefix failed");
const phaseOne=JSON.parse(firstSeven.stdout);
assert.equal(phaseOne.tables,46);
assert.equal(phaseOne.indexes,49);
assert.equal(phaseOne.triggers,0);
assert.equal(phaseOne.version,"1.1");
assert.equal(phaseOne.metaRows,1);
assert.equal(phaseOne.hasResonance,true);
assert.equal(phaseOne.hasStagedOutcomeArchive,false);
assert.equal(phaseOne.hasHoldings,false);
assert.equal(phaseOne.hasSegmentStore,false);

function neg(mutate,code){
 const a=input();mutate(a);const j=inspect(a);
 assert.equal(j.result,"OFFLINE_SCHEMA_REVIEW_BLOCKED",JSON.stringify(j));
 assert(j.blockers.includes(code),JSON.stringify({expected:code,got:j.blockers}));
 assert.equal(j.cloudSchemaWritesAuthorized,false);
 assert.equal(j.cloudRequestsPerformed,0);
}
neg(a=>a.files.pop(),"SQL_REPOSITORY_FILE_SET_NOT_VERIFIED");
neg(a=>a.files[0].name="0001_wrong.sql","SOURCE_PROVISIONER_PREFIX_UNVERIFIED");
neg(a=>a.files[9]=a.files[8],"SQL_REPOSITORY_FILE_SET_NOT_VERIFIED");
neg(a=>a.sourceProvisioner=a.sourceProvisioner.replace('"../sql/0010_current_year_segmented_cold_store.sql",','"../sql/0010_current_year_segmented_cold_store.sql",\n  "../sql/0011_outcome_revision_archive_staged.sql",'),"SOURCE_PROVISIONER_PREFIX_UNVERIFIED");
neg(a=>a.files[10].sql=a.files[10].sql.replace("CREATE TRIGGER IF NOT EXISTS s2_outcome_revision_block_update","CREATE TRIGGER IF NOT EXISTS corrupted"),"STAGED_0011_SEMANTICS_CHANGED");
neg(a=>a.files[0].sql+="\nDROP TABLE IF EXISTS s2_decisions;","PRODUCTION_OR_DESTRUCTIVE_SQL_FOUND");
neg(a=>a.files[1].sql=a.files[1].sql.replace("CREATE TABLE IF NOT EXISTS s2_historical_a1_bars","CREATE TABLE IF NOT EXISTS V7_DB"),"PRODUCTION_OR_DESTRUCTIVE_SQL_FOUND");
neg(a=>a.files[0].sql+="\nCREATE TABLE IF NOT EXISTS s2_decisions(id TEXT);","DUPLICATE_DDL_TABLE_NAME");
neg(a=>a.files[0].sql+="\nCREATE TABLE IF NOT EXISTS s2_unreviewed(id TEXT);","ACTIVE_10_SQL_SCHEMA_COUNTS_OR_REQUIRED_TABLES_MISMATCH");
neg(a=>a.files[0].sql+="\nUPDATE s2_schema_meta SET schema_value = 'unsafe';","UNEXPECTED_ACTIVE_SQL_STATEMENT");
neg(a=>a.destinationReceipt.afterDestination.databases=[],"EXISTING_EMPTY_DESTINATION_API_RECEIPT_UNVERIFIED");
neg(a=>a.destinationReceipt.afterDestination.databases[0].name="v7-live","EXISTING_EMPTY_DESTINATION_API_RECEIPT_UNVERIFIED");
neg(a=>a.destinationReceipt.afterDestination.workerCount=1,"EXISTING_EMPTY_DESTINATION_API_RECEIPT_UNVERIFIED");
neg(a=>a.destinationReceipt.afterDestination.cronCount=1,"EXISTING_EMPTY_DESTINATION_API_RECEIPT_UNVERIFIED");
neg(a=>a.destinationReceipt.offlineReconciliation.checksPassed=0,"EXISTING_EMPTY_DESTINATION_API_RECEIPT_UNVERIFIED");
console.log("System2 destination first10 SQL dry-run: 10 files, 55 tables, 63 explicit indexes, 0 triggers, version 1.1, staged 0011 excluded; 15 adversarial gates PASS; CLOUD MUTATION ZERO");
