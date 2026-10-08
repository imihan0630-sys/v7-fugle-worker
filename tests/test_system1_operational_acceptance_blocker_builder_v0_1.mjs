import assert from "node:assert/strict";
import {mkdtemp,readFile,writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

const dir=await mkdtemp(join(tmpdir(),"s1-acceptance-blocker-"));
const readiness=join(dir,"readiness.json");
const output=join(dir,"acceptance.json");
await writeFile(readiness,JSON.stringify({
  status:"FORMAL_SCAN_NOT_CONFIRMED",
  formalScanDate:"2026-10-08",
  runtimeVersion:"8.20.2-idempotent-d1-snapshots",
  verificationFailure:"C1_GENERATION_NOT_FOUND",
  mayCountAsZeroPick:false,eligibleForResearch:false
})+"\n");

const missing=name=>join(dir,name+".json");
const result=spawnSync(process.execPath,["tests/build_system1_operational_acceptance.mjs"],{
  encoding:"utf8",
  env:{...process.env,
    C1_EVIDENCE_OUTPUT:missing("c1"),
    C2_EVIDENCE_OUTPUT:missing("c2"),
    C1_INVENTORY_OUTPUT:missing("inventory"),
    FORMAL_C1_BINDING_OUTPUT:missing("binding"),
    H1_H5_READINESS_OUTPUT:missing("h1h5"),
    C1_READINESS_OUTPUT:readiness,
    OPERATIONAL_ACCEPTANCE_OUTPUT:output,
    ACCEPTANCE_EVENT_NAME:"schedule",
    ACCEPTANCE_SCHEDULE:"10 16 * * 1-5",
    ACCEPTANCE_OBSERVED_AT:"2026-10-08T16:20:00.000Z"
  }
});
assert.equal(result.status,1,"BLOCKED receipt must keep scheduled job failed");
const receipt=JSON.parse(await readFile(output,"utf8"));
assert.equal(receipt.status,"BLOCKED");
assert.equal(receipt.genuineProspective,false);
assert.equal(receipt.firstBlocker,"UPSTREAM_ARTIFACT_MISSING");
assert.equal(receipt.scanDate,"2026-10-08");
assert.equal(receipt.expectedScanDate,"2026-10-08");
assert.equal(receipt.runtimeVersion,"8.20.2-idempotent-d1-snapshots");
assert.equal(receipt.blockers[0].detail.missing.length,5);
assert.equal(receipt.blockers[0].detail.upstreamStatus,"FORMAL_SCAN_NOT_CONFIRMED");
assert.equal(receipt.blockers[0].detail.verificationFailure,"C1_GENERATION_NOT_FOUND");
assert.equal(receipt.historicalBackfillPerformed,false);
assert.equal(receipt.manualReplayCanNeverBecomeGenuineProspective,true);
assert.match(receipt.receiptDigest,/^[0-9a-f]{64}$/);

const workflow=await readFile(".github/workflows/system1-c1-evidence.yml","utf8");
assert.match(workflow,/if: always\(\) && github\.event_name == 'schedule'/);
assert.match(workflow,/C1_READINESS_OUTPUT: artifacts\/system1-c1-readiness\.json/);
assert.match(workflow,/artifacts\/system1-operational-acceptance\.json/);

console.log(JSON.stringify({
  ok:true,assertions:16,upstreamFailureStillEmitsReceipt:true,
  scheduledJobRemainsFailed:true,firstBlockerPreserved:true,
  workflowAlwaysGuard:true,historicalBackfillPerformed:false,
  formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
}));
