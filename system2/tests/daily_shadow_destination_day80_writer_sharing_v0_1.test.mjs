import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {evaluateDestinationDay80SharedWritersV0_1 as evaluate}
 from "../runtime/daily_shadow_destination_day80_writer_sharing_v0_1.mjs";
const audit=JSON.parse(readFileSync("system2/migration/evidence/S2_AUDIT_DEST_A1_FIRST_IMPORT_FINAL_PHYSICAL_ACCEPTANCE_20261012_V0_1.json","utf8"));
const date="2026-10-12";
const r=evaluate({quotaDay:date,accountRowsWrittenLowerBound:null,nowFloorProof:audit});
assert.equal(r.auditImportedRowsWrittenFloor,71226);
assert.equal(r.shadowReservedBilledWrites,13130);
assert.equal(r.projectedBilledRowsWritten,84356);
assert.equal(r.ownerDailyOperationalMax,80000);
assert.equal(r.nextWriterPermittedByOperationalCap,false);
assert.equal(r.physicalAllowedByThisChecker,false);
assert.equal(r.cloudflareHardWriteMaxUnchanged,100000);
// Multiple concurrent writer restrictions remain even if a caller tricks
// GraphQL into "0 spent". GraphQL lower bounds never erase original meta cost.
const graphqlZero=evaluate({quotaDay:date,accountRowsWrittenLowerBound:0,nowFloorProof:audit});
assert.equal(graphqlZero.accountRowsWrittenFloor,71226);
assert.equal(graphqlZero.nextWriterPermittedByOperationalCap,false);
const more=evaluate({quotaDay:date,accountRowsWrittenLowerBound:79999,nowFloorProof:audit});
assert.equal(more.accountRowsWrittenFloor,79999);
assert.equal(more.nextWriterPermittedByOperationalCap,false);
const future=evaluate({quotaDay:"2026-10-13",accountRowsWrittenLowerBound:0,nowFloorProof:audit});
assert.equal(future.auditImportedRowsWrittenFloor,0);
assert.equal(future.physicalAllowedByThisChecker,false); // not even future grants
for(const bad of [
 {...audit,originalDestinationWriter:{...audit.originalDestinationWriter,originalD1MeteredBilledRowsWritten:0}},
 {...audit,originalDestinationWriter:{...audit.originalDestinationWriter,sameUtcDayAdditionalWriterAuthorized:true}},
 {...audit,status:"UNVERIFIED"},
]){
 assert.throws(()=>evaluate({quotaDay:date,nowFloorProof:bad}));
}
assert.throws(()=>evaluate({quotaDay:date,nowFloorProof:audit,shadowReservedBilledWrites:0}));
assert.throws(()=>evaluate({quotaDay:"INVALID",nowFloorProof:audit}));
console.log("S2_DEST_ACCOUNT_DAY80_SHARED_WRITER_OPERATIONAL_CAP_AUDITED_IMPORT_FLOOR_PASS");
