import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {assessM06ArchiveCatalog,assessM06DestinationCounts,M06_READ_SQL} from "../migration/issue1232_m06_operational_provenance_readonly_v0_1.mjs";

const catalog=JSON.parse(readFileSync("system2/migration/evidence/S2_SOURCE_D1_REAL_ROWSET_CATALOG_AND_DAY80_BUDGET_PLAN_20261012_V0_1.json","utf8"));
const proof=assessM06ArchiveCatalog(catalog);
assert.equal(proof.sourceLegacyOperationalRows,2521);
assert.equal(proof.sourceArchivedRows,113222);
assert.equal(proof.sourceQueriedInThisRun,false);

const zeros={infrastructure_checks:0,source_session_receipts:0,resonance_runs:0,frozen_decisions:0};
const empty=assessM06DestinationCounts(zeros);
assert.equal(empty.destinationLegacyOperationalRows,0);
assert.equal(empty.uncopiedLegacyOperationalRows,2521);
assert.equal(empty.permissionToWrite,false);
assert.equal(empty.sourceToDestinationRowContentHashAccepted,false);
const partial=assessM06DestinationCounts({infrastructure_checks:17,source_session_receipts:2,resonance_runs:1,frozen_decisions:0});
assert.equal(partial.destinationLegacyOperationalRows,20);
assert.equal(partial.provenanceStatus,"DEST_LEGACY_OPERATIONAL_ROWS_PRESENT__PROVENANCE_NOT_CERTIFIED");
assert.equal(partial.sourceOldChecksReusableAsTargetLiveHealth,false);

for(const bad of [
 {infrastructure_checks:2506,source_session_receipts:0,resonance_runs:0,frozen_decisions:0},
 {infrastructure_checks:0,source_session_receipts:12,resonance_runs:0,frozen_decisions:0},
 {infrastructure_checks:0,source_session_receipts:0,resonance_runs:6,frozen_decisions:0},
 {infrastructure_checks:0,source_session_receipts:0,resonance_runs:0,frozen_decisions:1},
 {infrastructure_checks:0.5,source_session_receipts:0,resonance_runs:0,frozen_decisions:0},
 {infrastructure_checks:-1,source_session_receipts:0,resonance_runs:0,frozen_decisions:0},
 {infrastructure_checks:null,source_session_receipts:0,resonance_runs:0,frozen_decisions:0},
 {},null
])assert.throws(()=>assessM06DestinationCounts(bad),/^Error: M06_/);

function copy(){return structuredClone(catalog)}
for(const mutate of [
 x=>x.tables.pop(),x=>x.tables[0].sourceRows++,
 x=>x.tables.push({...x.tables[0]}),
 x=>x.sourceArchive.originalSqlSha256="a".repeat(64),
 x=>x.tables.find(t=>t.table==="s2_resonance_runs").sourceRows=6,
 x=>x.tables[0].table="../invalid"
]){const x=copy();mutate(x);assert.throws(()=>assessM06ArchiveCatalog(x),/^Error: M06_/)}
assert.match(M06_READ_SQL,/SELECT \(SELECT COUNT\(\*\) FROM s2_infrastructure_checks\)/);
assert.match(M06_READ_SQL,/s2_source_session_receipts/);
assert.match(M06_READ_SQL,/s2_resonance_runs/);
assert.match(M06_READ_SQL,/s2_decisions/);
assert.doesNotMatch(M06_READ_SQL,/;|\b(INSERT|UPDATE|DELETE|REPLACE|DROP|ALTER|CREATE|PRAGMA)\b/i);
const script=readFileSync("system2/migration/issue1232_m06_operational_provenance_readonly_v0_1.mjs","utf8");
const workflow=readFileSync(".github/workflows/system2-m06-operational-census-readonly.yml","utf8");
assert.match(script,/meta\.rows_written!==0/);
assert.match(script,/budgetHeadroomFromThisQueryGranted:false/);
assert.doesNotMatch(script,/\b(INSERT INTO|UPDATE s2_|DELETE FROM|DROP TABLE|ALTER TABLE)\b/i);
assert.match(workflow,/environment: system2-schema-only/);
assert.match(workflow,/S2_SCHEMA_DEST_D1_WRITE_TOKEN/);
assert.match(workflow,/issue1232_m06_operational_provenance_readonly_v0_1\.mjs/);
assert.doesNotMatch(workflow,/environment: system2-research|SYSTEM2_CLOUDFLARE_API_TOKEN|S2_OWNER_OVERRIDE_RAW_COPY_20261012/);
console.log("S2 M06 source archival count and bounded destination-only census negative gates PASS");
