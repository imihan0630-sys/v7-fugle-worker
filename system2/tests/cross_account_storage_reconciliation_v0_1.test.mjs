import assert from "node:assert/strict";
import { compareCrossAccountStorageReadback as verify } from "../migration/cross_account_storage_reconciliation_v0_1.mjs";
const sha = "a".repeat(64), other = "b".repeat(64);
function sample(){
 const data = {complete:true,physicalReadback:true,verifiedFrom:"SOURCE_READ_ONLY_EXPORT",schemaSha256:sha,
   exportSha256:sha,frozenSnapshotSha256:sha,
   tables:[{name:"s2_decisions",rows:42,sha256:sha},{name:"s2_shadow_runs",rows:1,sha256:sha}],
   objects:[{key:"2017/TWSE/raw-1",bytes:512,sha256:sha}]};
 return {source:structuredClone(data),destination:{...structuredClone(data),verifiedFrom:"DESTINATION_READBACK"}};
}
function blocked(v, match){const r=verify(v);assert.equal(r.status,"BLOCKED");assert(r.reasons.some(x=>x.startsWith(match)),JSON.stringify(r));assert.equal(r.cutoverAuthorized,false);}
{const r=verify(sample());assert.equal(r.status,"MATCHED_REVIEW_REQUIRED");assert.equal(r.cutoverAuthorized,false);assert.deepEqual(r.reasons,[]);assert.equal(r.counts.sourceTables,2);}
{const v=sample();v.destination.schemaSha256=other;blocked(v,"SCHEMA_SHA_MISMATCH");}
{const v=sample();v.destination.frozenSnapshotSha256=other;blocked(v,"FROZEN_SNAPSHOT_SHA_MISMATCH");}
{const v=sample();v.destination.exportSha256=other;blocked(v,"EXPORT_CONTENT_SHA_MISMATCH");}
{const v=sample();v.destination.tables[0].rows=41;blocked(v,"TABLE_MISMATCH");}
{const v=sample();v.destination.tables.pop();blocked(v,"TABLE_COUNT_MISMATCH");}
{const v=sample();v.destination.tables.push({...v.destination.tables[0]});blocked(v,"DESTINATION_TABLE_KEY_INVALID_OR_DUPLICATE");}
{const v=sample();v.destination.tables.push({name:"s2_extra",rows:0,sha256:sha});blocked(v,"DESTINATION_UNEXPECTED_TABLE");}
{const v=sample();v.destination.objects[0].bytes=511;blocked(v,"R2_OBJECT_MISMATCH");}
{const v=sample();v.destination.objects=[];blocked(v,"R2_OBJECT_COUNT_MISMATCH");}
{const v=sample();v.destination.objects.push({key:"extra",bytes:0,sha256:sha});blocked(v,"DESTINATION_UNEXPECTED_R2_OBJECT");}
{const v=sample();v.destination.objects.push({...v.destination.objects[0]});blocked(v,"DESTINATION_R2_KEY_INVALID_OR_DUPLICATE");}
{const v=sample();v.destination.objects[0].key="../evil";blocked(v,"DESTINATION_ROW_OR_OBJECT_PROVENANCE_INVALID");}
{const v=sample();v.source.physicalReadback=false;blocked(v,"SOURCE_PHYSICAL_RECEIPT_MISSING_OR_INVALID");}
{const v=sample();v.destination.verifiedFrom="SYNTHETIC";blocked(v,"DESTINATION_PHYSICAL_RECEIPT_MISSING_OR_INVALID");}
{blocked({}, "SOURCE_PHYSICAL_RECEIPT_MISSING_OR_INVALID");}
console.log("System2 cross-account D1/R2 immutable readback comparator: 16 cases PASS");
