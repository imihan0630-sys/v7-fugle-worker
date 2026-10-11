// AUDIT_LANE separate from authoring MIGRATION_LANE. Offline only.
// Reconstruct table names/index->owner pairs directly from first TEN canonical
// SQL migrations; do NOT trust engineering-lane "canonicalObjects" assertion.
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {inflateSync} from "node:zlib";
import {createHash} from "node:crypto";
const load=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const evidence=load("../migration/evidence/S2_DEST_D1_FULL_OBJECT_READONLY_RUN_38099562997_20261011_V0_1.json");
const old=load("../migration/evidence/S2_DEST_D1_SCHEMA_ONLY_INDEPENDENT_PHYSICAL_AUDIT_20261011_V0_1.json");
const digest=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const expectedSha="f9bb690e481b78183ec225f450673a90aec5d3ee637f55da0fa4154584c58c3c";
const sqlFiles=readdirSync(new URL("../sql/",import.meta.url)).filter(x=>/^\d{4}_[a-z0-9_]+\.sql$/.test(x)).sort();
assert.equal(sqlFiles.length,11);
assert.equal(sqlFiles[10],"0011_outcome_revision_archive_staged.sql");
const expected=[];
for(const f of sqlFiles.slice(0,10)){
 const sql=readFileSync(new URL("../sql/"+f,import.meta.url),"utf8");
 const tables=[...sql.matchAll(/\bCREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(s2_[a-z0-9_]+)\s*\(/gi)];
 const indexes=[...sql.matchAll(/\bCREATE\s+(?:UNIQUE\s+)?INDEX\s+IF\s+NOT\s+EXISTS\s+([a-z0-9_]+)\s+ON\s+(s2_[a-z0-9_]+)\s*\(/gi)];
 for(const x of tables)expected.push({type:"table",name:x[1],tbl_name:x[1]});
 for(const x of indexes)expected.push({type:"index",name:x[1],tbl_name:x[2]});
}
const cmp=(a,b)=>a.type.localeCompare(b.type,"en")||a.name.localeCompare(b.name,"en")||a.tbl_name.localeCompare(b.tbl_name,"en");
expected.sort(cmp);
assert.equal(expected.length,118);
assert.equal(expected.filter(x=>x.type==="table").length,55);
assert.equal(expected.filter(x=>x.type==="index").length,63);
assert.equal(new Set(expected.map(x=>x.name)).size,118);
assert.equal(digest(expected),expectedSha,"Independent canonical SQL-derived digest");
const compressed=evidence.durableFullObjectInventory;
assert.match(compressed.encoding,/zlib/);
const physical=JSON.parse(inflateSync(Buffer.from(compressed.encoded,"base64")).toString("utf8"));
assert.equal(physical.length,118);
assert.deepEqual(physical,expected,"Physical original-Artifact derived full name + owner set MUST equal independent SQL 0001..0010 names");
assert.equal(digest(physical),expectedSha,"Durable physically read object digest");
assert.equal(evidence.postInstallPhysicalReadback.physicalObjectDigestSha256,expectedSha);
assert.equal(evidence.postInstallPhysicalReadback.canonicalObjectDigestSha256,expectedSha);
assert.equal(evidence.postInstallPhysicalReadback.completeInventoryObjectsExcludingSQLiteInternal,119);
assert.deepEqual(evidence.postInstallPhysicalReadback.platformReservedOnly,[{type:"table",name:"_cf_KV",tbl_name:"_cf_KV"}]);
assert.equal(evidence.postInstallPhysicalReadback.unauthorizedViewsTriggersExtraTablesOrIndexesFound,0);
assert.equal(evidence.postInstallPhysicalReadback.staged0011Detected,false);
assert.equal(evidence.postInstallPhysicalReadback.schemaVersion,"1.1");
assert.equal(evidence.postInstallPhysicalReadback.planSequenceSha256,old.realWorkflows.planSequenceSha256);
assert.equal(evidence.ownerTriggeredRealGitHubRun.runId,38099562997);
assert.equal(evidence.ownerTriggeredRealGitHubRun.jobId,114352494288);
assert.equal(evidence.artifact.id,11687550030);
assert.equal(evidence.artifact.zipSha256,"3f98f7256775c450e2ab19e68b513514052dd639112fbaa49178d76672686afe");
assert.equal(evidence.strictBoundaries.cloudWritesPerformed,0);
assert.equal(evidence.strictBoundaries.sourceAccountRequests,0);
assert.equal(evidence.strictBoundaries.sourceRowsCopied,0);
const badCases=[
 {name:"wrong-table-name",change:a=>{let k=a.find(x=>x.type==="table");k.name="s2_fake_unapproved";k.tbl_name=k.name;}},
 {name:"wrong-index-owner",change:a=>{a.find(x=>x.type==="index").tbl_name="s2_wrong_owner";}},
 {name:"duplicate-object",change:a=>a.push({...a[0]})},
 {name:"extra-view",change:a=>a.push({type:"view",name:"s2_extra_view",tbl_name:"s2_extra_view"})},
 {name:"removed-index",change:a=>a.splice(a.findIndex(x=>x.type==="index"),1)},
];
for(const x of badCases){
 const mutated=structuredClone(physical);x.change(mutated);mutated.sort(cmp);
 assert.notDeepEqual(mutated,expected,x.name);
 assert.notEqual(digest(mutated),expectedSha,x.name);
}
console.log("AUDIT_S2_ISSUE1103_INDEPENDENT_SQL_PHYSICAL_REVERIFY "+JSON.stringify({
 status:"PASS_OFFLINE_REPLAY_OF_REAL_GITHUB_ARTIFACT_MANIFEST",
 sourceOfCanonical:"DIRECT_0001_0010_SQL_REGEX_NOT_ENGINEERING_CANONICAL_ARRAY",
 canonicalTables:55,canonicalIndexes:63,matchingPhysicalObjects:118,
 onlyVendorTable:"_cf_KV",totalNonInternalPhysical:119,
 currentRealSchemaVersion:"1.1",matchDigest:expectedSha,
 wrongNameOwnerExtraMissingNegativeControls:badCases.length,
 originalApplyOnceReexecuted:false,newCloudflareIo:false,
 sourceSystem1Changed:false,fullMigrationAccepted:false,
}));
