import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const load=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const e=load("evidence/S2_CORR003_NATIVE_ARTIFACT_ZIP_BYTE_VERIFICATION_20261011_V0_1.json");
const audit=load("evidence/S2_CORR003_INDEPENDENT_PHYSICAL_AND_ORIGINAL19_REVERIFY_20261011_V0_1.json");
const policy=load("evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json");
const queue=load("SYSTEM2_CORRECTION_QUEUE.json").directives.find(x=>x.directiveId===e.directiveId);
const expected={
 11494952595:["37649041814","8bde99fd35e86ac1fedb03b6dcccf5ca5ddccab199d8e472d3ffdca173b85b8d"],
 11495881660:["37649249573","d4251f93ba2945ade04c46442589b2e7dad067ea83ebc88a517bd5fba609a5d4"],
 11495752402:["37649543821","ec2f182ea840d5d1abf811f2e487050f8f42dcab24b14a0bbe99d316f96a5074"],
 11495133236:["37650006684","188a33e0b199d18455da56740cc28f26d6c73d745c413bbf7f604f400e089ddd"],
 11514945619:["37694052477","7dd50ffd181f48f07b63941a81ad749f967ebdd5de1206340ce63b4835ced822"],
 11514766351:["37694255555","cdcc197a4ac514f9e70d9082bc1303a6fb3805d8395b4b0a2091fc00e4f218af"],
 11565090033:["37808995747","a651899840d42fd017a9d01980716c0b74b5c7cc91273462a00f6867d4033d30"],
 11631116248:["37958877283","4c07e85b5bfbdc12b8395088eec7b24f29e95f98e8fa2dda75fce9170de191ad"],
 11662631499:["38032440861","33a23712e19cfbf0ba6b1ad737bb6d3fb500e4f484782db05b762c91ae2e7b01"]
};
function validate(x){
 assert.equal(x.directiveId,"S2-CORR-20261007-003");
 assert.equal(x.owner,"REMEDIATION_LANE");
 assert.equal(x.classification,"GITHUB_NATIVE_ORIGINAL_ARTIFACT_ZIP_BYTES_REPLAYED_NO_CLOUDFLARE_OR_QUOTA_AUTHORITY");
 assert.equal(x.producerUnmerged,true);
 assert.equal(x.counts.originalProducerArtifacts,8);
 assert.equal(x.counts.supplementalPVE262,1);
 assert.equal(x.counts.downloadedZip,9);
 assert.equal(x.counts.matchedNativeSha256,9);
 assert.equal(x.counts.archiveIntegrityPass,9);
 assert.equal(x.counts.extractedJSON,11);
 assert.equal(x.counts.runJobArtifactAssociationsDirectlyChecked,9);
 assert.equal(x.artifacts.length,9);
 const seen=new Set();let m=0;
 for(const item of x.artifacts){
  assert.ok(Object.prototype.hasOwnProperty.call(expected,item.artifactId));
  assert.equal(String(item.runId),expected[item.artifactId][0]);
  assert.equal(item.zipSha256,"sha256:"+expected[item.artifactId][1]);
  assert.match(item.headSha,/^[0-9a-f]{40}$/);
  assert.ok(Number.isSafeInteger(item.jobId));
  assert.ok(item.zipBytes>0);
  assert.equal(item.originalZipDownloaded,true);
  assert.equal(item.nativeMetadataMatched,true);
  assert.equal(item.zipIntegrity,"PASS");
  assert.ok(!seen.has(item.artifactId));
  seen.add(item.artifactId);
  m+=item.extractedJson.length;
  for(const inner of item.extractedJson){
   assert.match(inner.sha256,/^sha256:[0-9a-f]{64}$/);
   assert.ok(inner.file.endsWith(".json"));
   assert.ok(!inner.file.includes(".."));
  }
 }
 assert.equal(seen.size,9);
 assert.equal(m,11);
 assert.equal(x.constraints.PVE262RawCronAuditRows,0);
 assert.equal(x.constraints.PVE263ObservedScanStatus,"FAILED_D1_WRITE_QUOTA");
 assert.equal(x.constraints.PVE263RecoveryLeaseNotBusinessSuccess,true);
 assert.equal(x.constraints.PVE264UtcAccountRowsWritten,126498);
 assert.equal(x.constraints.PVE264UtcAccountRowsRead,4374959);
 assert.deepEqual(x.constraints.wholeDayOnlyRowsWritten,[2825,1635]);
 assert.deepEqual(x.constraints.wholeDayOnlyRowsRead,[133037,19533]);
 assert.equal(x.constraints.perRunPrimary2335RowsWritten,null);
 assert.equal(x.constraints.perRunPrimary2335RowsRead,null);
 assert.equal(x.constraints.conditional2355Costs,null);
 assert.equal(x.constraints.actualNaturalSubsequentBusinessPersisted,false);
 assert.equal(x.constraints.sourceDataPITFrozenRestoreCertified,false);
 assert.equal(x.constraints.hotD1ScoutKeysAccepted,0);
 assert.equal(x.constraints.hotD1CensusKeysAccepted,0);
 assert.equal(x.limitations.physicalClosureProofGainedFromReplayedZips,false);
 assert.equal(x.limitations.allNewNormalSessionEvidenceAvailable,false);
 assert.equal(x.status.supportCompleted,15);
 assert.equal(x.status.supportTotal,38);
 assert.equal(x.status.independentPhysicalAccepted,0);
 assert.equal(x.status.totalPhysical,5);
 assert.equal(x.status.corr003,"HIGH_VERIFYING");
 assert.equal(x.reserve.writeAuthorized,false);
 assert.equal(x.reserve.authorizedRowsWritten,null);
 assert.equal(x.reserve.readAuthorized,false);
 assert.equal(x.reserve.authorizedRowsRead,null);
 assert.equal(x.auditOnlyClosure,true);
 assert.equal(x.safety.CloudflareAPI,0);
 assert.equal(x.safety.D1SQL,0);
 assert.equal(x.safety.workflowDispatch,0);
 assert.equal(x.safety.quotaCoreChanges,0);
}
validate(e);
assert.equal(audit.supportEvidence.documented,15);
assert.equal(audit.supportEvidence.qualifiedPhysical,0);
assert.equal(policy.reserveNumberAuthorized,false);
assert.equal(policy.readReserveNumberAuthorized,false);
assert.equal(policy.authorizedReserveRows,null);
assert.equal(policy.authorizedReadReserveRows,null);
assert.equal(queue.status,"VERIFYING");
assert.equal(queue.severity,"HIGH");
for(const change of [
 x=>x.artifacts[0].zipSha256="sha256:"+"0".repeat(64),
 x=>x.artifacts[8].zipSha256="sha256:"+"0".repeat(64),
 x=>x.artifacts[1].runId=0,
 x=>x.artifacts[2].nativeMetadataMatched=false,
 x=>x.artifacts[2].zipIntegrity="UNKNOWN",
 x=>x.artifacts[6].extractedJson[0].sha256="bad",
 x=>x.counts.downloadedZip=10,
 x=>x.counts.extractedJSON=12,
 x=>x.constraints.perRunPrimary2335RowsWritten=2825,
 x=>x.constraints.actualNaturalSubsequentBusinessPersisted=true,
 x=>x.constraints.PVE263RecoveryLeaseNotBusinessSuccess=false,
 x=>x.constraints.sourceDataPITFrozenRestoreCertified=true,
 x=>x.status.independentPhysicalAccepted=1,
 x=>x.reserve.authorizedRowsWritten=2825,
 x=>x.reserve.readAuthorized=true,
 x=>x.auditOnlyClosure=false,
 x=>x.safety.D1SQL=1
]){
 const forged=structuredClone(e);
 change(forged);
 assert.throws(()=>validate(forged));
}
console.log("CORR003_NINE_NATIVE_ZIP_BYTE_RECEIPTS_11_MEMBERS_17_NEGATIVE_NO_PHYSICAL_GATE_PROMOTION_PASS");
