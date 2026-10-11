import test from "node:test";
import assert from "node:assert/strict";
import {reviewSystem2D1OnlyPostCopyV0_1 as review} from "../migration/build00_d1_only_postcopy_readback_v0_1.mjs";
const hash={s:"a".repeat(64),f:"b".repeat(64),e:"c".repeat(64),p:"d".repeat(64)};
const table=(name,rows,n)=>({name,rows,sha256:String(n).repeat(64),schemaSha256:"e".repeat(64)});
const names=["s2_decisions","s2_historical_a1_bars","s2_schema_meta"];
function fixture(){
 const tables=names.map((name,i)=>table(name,[12,30,1][i],i+1));
 const common={
  databaseName:"system2-research",physicalReadback:true,runId:100,
  artifactId:200,originalArtifactSha256:hash.e,
  originalArtifactDownloadedAndShaVerified:true,
  schemaSha256:hash.s,exportSha256:hash.e,
  frozenSnapshotSha256:hash.f,
  frozenDecisionRowCount:12,frozenSnapshotPhysicalReadback:true,
  tables,pit:{physicalLineageReadback:true,lineageSha256:hash.p,
   firstKnownAtAvailableAtVerified:true},
 };
 return {
  source:{...common,verifiedFrom:"SOURCE_D1_PHYSICAL_READ_ONLY_EXPORT",
   accountFingerprint:"1".repeat(64),databaseFingerprint:"2".repeat(64),
   observedAtUtc:"2026-10-11T08:00:00Z"},
  destination:{...common,verifiedFrom:"DESTINATION_D1_PHYSICAL_READBACK",
   accountFingerprint:"3".repeat(64),databaseFingerprint:"4".repeat(64),
   observedAtUtc:"2026-10-11T09:00:00Z",
   tables:tables.map(x=>({...x})),pit:{...common.pit}},
 };
}
test("synthetic full D1-only receipt is reviewable but NEVER live migration/cutover authority",()=>{
 const result=review(fixture());
 assert.equal(result.state,"D1_PARITY_MATCHED_PENDING_INDEPENDENT_AUDIT");
 assert.deepEqual(result.blockers,[]);
 assert.equal(result.counts.sourcePhysicalTableCount,3);
 assert.equal(result.counts.destinationRowSum,"43");
 for(const name of ["entireMigrationPassed","r2HistoricalMigrationAccepted",
 "workerDestinationPhysicallyProven","cronSwitchoverProven",
 "permissionToCutover","permissionToRunCloudflareSql",
 "originalArtifactAuthenticityIndependentlyVerifiedByThisCode"]){
   assert.equal(result[name],false,name);
 }
});
test("no physical receipts always BLOCKED",()=>{
 const x=review();assert.equal(x.state,"BLOCKED");
 assert(x.blockers.some(v=>v.includes("PHYSICAL_EVIDENCE_MISSING")));
});
test("source and target cloud account collision cannot be papered over",()=>{
 const p=fixture();p.destination.accountFingerprint=p.source.accountFingerprint;
 const x=review(p);assert(x.blockers.includes("SOURCE_DESTINATION_ACCOUNT_COLLISION"));
});
test("source and target D1 physical identity collision blocks D1 acceptance",()=>{
 const p=fixture();p.destination.databaseFingerprint=p.source.databaseFingerprint;
 assert(review(p).blockers.includes("SOURCE_DESTINATION_D1_PHYSICAL_IDENTITY_COLLISION"));
});
test("one altered copied row hash blocks complete match",()=>{
 const p=fixture();p.destination.tables[0].sha256="f".repeat(64);
 const x=review(p);assert(x.blockers.includes("D1_TABLE_PHYSICAL_COUNT_OR_HASH_MISMATCH:s2_decisions"));
});
test("missing table cannot pass by matching only other tables",()=>{
 const p=fixture();p.destination.tables.pop();
 const x=review(p);assert(x.blockers.includes("D1_TABLE_NOT_COPIED:s2_schema_meta"));
});
test("unplanned target s2_ table prevents false denominator success",()=>{
 const p=fixture();p.destination.tables.push(table("s2_unexpected",0,9));
 const x=review(p);assert(x.blockers.includes("D1_UNEXPECTED_DESTINATION_TABLE:s2_unexpected"));
});
test("frozen decision count must match physical s2_decisions",()=>{
 const p=fixture();p.destination.frozenDecisionRowCount=13;
 const x=review(p);
 assert(x.blockers.includes("FROZEN_DECISION_ROW_COUNT_MISMATCH"));
 assert(x.blockers.includes("FROZEN_DECISION_COUNT_VS_PHYSICAL_TABLE_MISMATCH"));
});
test("PIT lineage is not qualified by matching table content alone",()=>{
 const p=fixture();delete p.destination.pit.firstKnownAtAvailableAtVerified;
 assert(review(p).blockers.includes("DESTINATION_PIT_LINEAGE_EVIDENCE_MISSING"));
});
test("frozen hash difference always rejects, even if table rows count equal",()=>{
 const p=fixture();p.destination.frozenSnapshotSha256="0".repeat(64);
 assert(review(p).blockers.includes("D1_FROZEN_SNAPSHOT_ROOT_HASH_MISMATCH"));
});
test("destination readback may not predate source immutable export",()=>{
 const p=fixture();p.destination.observedAtUtc="2026-10-11T07:59:00Z";
 assert(review(p).blockers.includes("DESTINATION_READBACK_EARLIER_THAN_SOURCE_EXPORT"));
});
test("missing physical original artifact readback disallows green",()=>{
 const p=fixture();p.destination.originalArtifactDownloadedAndShaVerified=false;
 assert(review(p).blockers.includes("DESTINATION_ORIGINAL_PROVIDER_ARTIFACT_AND_D1_PHYSICAL_EVIDENCE_MISSING"));
});
test("accidental target R2-succeeded assertion is not inferred from D1",()=>{
 const p=fixture();p.destination.r2Copied=true;
 assert(review(p).blockers.includes("DESTINATION_R2_CLAIM_MUST_BE_ADJUDICATED_SEPARATELY"));
});
test("duplicate table, fake base64 SHA or non-S2 table cannot pass",()=>{
 const p=fixture();p.destination.tables.push({...p.destination.tables[0]});
 p.destination.tables[0].sha256="not-a-real-sha";
 p.destination.tables[1].name="V7_DB";
 assert(review(p).blockers.includes("DESTINATION_PHYSICAL_TABLE_IDENTITY_OR_HASH_INVALID"));
});
test("receipt emitted cannot mutate supplied manifests or show account identifiers",()=>{
 const p=fixture(),snapshot=JSON.stringify(p);
 const r=review(p);assert.equal(JSON.stringify(p),snapshot);
 assert(!JSON.stringify(r).includes(p.source.accountFingerprint));
 assert(!JSON.stringify(r).includes(p.destination.databaseFingerprint));
 assert.equal(r.sourceDBModified,false);assert.equal(r.destinationDBModified,false);
});
