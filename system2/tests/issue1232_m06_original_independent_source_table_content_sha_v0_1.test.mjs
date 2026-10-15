import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const p="system2/migration/evidence/S2_DATA_M06_ORIGINAL_SOURCE_THREE_TABLE_CONTENT_ROOTS_20261015_V0_1.json";
const original=JSON.parse(readFileSync(p,"utf8"));
const expected=[
 ["s2_infrastructure_checks",2505,"88812ec9cd7e8e49969d40bc561166ec9ec69c14956eb4339b5c3767adcf0763","4808983d315004edcdc550f0bf9f2ce57148770e25c4964fae708374ebecd715","check_id"],
 ["s2_source_session_receipts",11,"ec44246ef8fe023b252035c747285cf19cf7088745efc097e7f6e32bdf4626d7","fd2d7df1dc66e39b617ddb6f9ec55efa64416fbbc643df57151c8afe52836a55","receipt_id"],
 ["s2_resonance_runs",5,"9d5438a4987f6e27ca6aaae154d3a6858180572c9bbe70dc0b30bf86bc013958","4c337a86b28712910c86f4c43912d42eb5c919e271de7c689bad1883a2a74ac1","run_id"]
];
function validate(x){
 assert.equal(x.schemaVersion,"S2_DATA_M06_ORIGINAL_SOURCE_INDEPENDENT_FULL_TABLE_SHA_QUARANTINE_20261015_V0_1");
 assert.equal(x.basis.originalSourceSqlRun,38150147134);
 assert.equal(x.basis.distinctAuditorOriginalRestoreRun,38214521809);
 assert.equal(x.basis.originalIndependentAuditArtifactId,11732075339);
 assert.equal(x.basis.originalZipBytes,9425);
 assert.equal(x.basis.originalProviderZipSha256,"f7d878a2eed566b0a55246effccc5d69a9fe5a9a10ba6e6e7598906d624657a6");
 assert.equal(x.basis.independentLocallyDownloadedZipSha256,x.basis.originalProviderZipSha256);
 assert.equal(x.basis.independentInnerReceiptSha256,"e37619b75758a98753e45321e566efdd60e4339539f4ff9768f30dc55afe5e06");
 assert.equal(x.basis.independentInnerContentSha256,"f4ad674c4ad7758af6c2e38987038854899362c619c7c1af9899cc698f24fc00");
 assert.equal(x.basis.originalWholeDbTableContentRoot,"95546b04c5c93f583dc5fe5b8efbaf4fe3fd8c3b4ab7daa6e3fe7d515c659e14");
 assert.equal(x.basis.originalAuditSourceDbRows,113222);
 assert.equal(x.basis.sourceTables,55);
 assert.equal(x.basis.sourceIndexes,63);
 assert.equal(x.basis.independentOriginalInnerJsonParsed,true);
 assert.equal(x.basis.originalAuditorIndependentSqliteRestoreVerified,true);
 assert.equal(x.basis.actualSourceRehashInThisTurn,false);
 assert.equal(x.originalThreeFullTableRoots.length,3);
 let total=0;
 for(let i=0;i<expected.length;i++){
  const [table,rows,columnSha,contentSha,pk]=expected[i];
  const got=x.originalThreeFullTableRoots[i];
  assert.equal(got.table,table);
  assert.equal(got.sourceRows,rows);
  assert.equal(got.columnSha256,columnSha);
  assert.equal(got.contentSha256,contentSha);
  assert.equal(got.nativePrimaryKey,pk);
  assert.equal(got.fullSourceTableContentRootOriginalAudit,true);
  assert.equal(got.canCopyAsNewDestinationHealth,false);
  assert.equal(got.canTriggerNewRuntimeSignals,false);
  assert.equal(got.sourceOriginalPitKnownAtVerified,false);
  assert.ok(got.disposition.includes("PRESERVE"));
  assert.equal(got.sampledRows,0);
  total+=got.sourceRows;
 }
 assert.equal(total,2521);
 assert.equal(x.scopeTotalSourceLegacyRows,total);
 assert.equal(x.sourceOriginalLegacyTableRootsWithNativeOriginalAuditorFullContentWitness,3);
 assert.equal(x.sourceLegacyTableRootsNeeded,3);
 assert.equal(x.originalDestinationReadback.actualRun,38509243451);
 assert.equal(x.originalDestinationReadback.targetCountObservedUtcDate,"2026-10-14");
 assert.equal(x.originalDestinationReadback.originalProviderQueryRowsWritten,0);
 assert.deepEqual(x.originalDestinationReadback.destinationCounts,{
  s2_infrastructure_checks:0,s2_source_session_receipts:0,s2_resonance_runs:0
 });
 assert.equal(x.originalDestinationReadback.destinationThreeTableCountsRefreshedOn20261015,false);
 assert.equal(x.originalDestinationReadback.sourceContentVsDestinationRowHashParityClaimed,false);
 assert.equal(x.sourceSourcePITFirstKnownAtCertified,0);
 assert.equal(x.sourceOriginalSemanticsCanBeReusedAsNewAccountRuntimeHealth,false);
 assert.equal(x.destinationActualD1RowCopyByThisEvidence,0);
 assert.equal(x.newCloudflareD1OrR2Calls,0);
 assert.equal(x.newCloudflareD1OrR2Writes,0);
 assert.equal(x.historicalFrozenAuthenticated,false);
 assert.equal(x.shadowBacktestLiveActivationAllowed,false);
 assert.equal(x.independentM06TargetPayloadParity,false);
 assert.equal(x.formalM06IndependentAuditorSignoff,false);
 assert.equal(x.system1V8FormalCoreChanged,false);
 return true;
}
assert.equal(validate(original),true);
for(const [name,change] of [
 ["invented importer",x=>{x.destinationActualD1RowCopyByThisEvidence=2521}],
 ["fake source row",x=>{x.originalThreeFullTableRoots[0].sourceRows=2506}],
 ["tampered source SHA",x=>{x.originalThreeFullTableRoots[1].contentSha256="f".repeat(64)}],
 ["altered schema SHA",x=>{x.originalThreeFullTableRoots[2].columnSha256="f".repeat(64)}],
 ["fabricated original audit ZIP",x=>{x.basis.independentLocallyDownloadedZipSha256="f".repeat(64)}],
 ["unexpected source audit",x=>{x.basis.actualSourceRehashInThisTurn=true}],
 ["forged source PIT",x=>{x.originalThreeFullTableRoots[1].sourceOriginalPitKnownAtVerified=true}],
 ["unauthorized old health migration",x=>{x.originalThreeFullTableRoots[0].canCopyAsNewDestinationHealth=true}],
 ["unauthorized live resonance",x=>{x.originalThreeFullTableRoots[2].canTriggerNewRuntimeSignals=true}],
 ["forged destination census",x=>{x.originalDestinationReadback.destinationCounts.s2_resonance_runs=5}],
 ["new destination verification faked",x=>{x.originalDestinationReadback.destinationThreeTableCountsRefreshedOn20261015=true}],
 ["faked source versus target SHA",x=>{x.originalDestinationReadback.sourceContentVsDestinationRowHashParityClaimed=true}],
 ["unqualified Frozen",x=>{x.historicalFrozenAuthenticated=true}],
 ["unqualified audit accept",x=>{x.formalM06IndependentAuditorSignoff=true}],
 ["unqualified Shadow",x=>{x.shadowBacktestLiveActivationAllowed=true}],
 ["false nonzero D1 reads/writes",x=>{x.newCloudflareD1OrR2Writes=1}]
]){
 const v=structuredClone(original);change(v);assert.throws(()=>validate(v),name);
}
console.log("M06 original full-table SHA source 3/3 and 1 positive + 16 adversarial historical provenance protection cases PASS");