import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const e=JSON.parse(readFileSync(new URL("../migration/evidence/S2_MIGRATION_REAL_SOURCE_DEST_SCHEMA_PARITY_20261011_V0_1.json",import.meta.url),"utf8"));
test("real source and destination schema are exactly identical but data copy remains blocked",()=>{
 assert.equal(e.source.tableCount,55); assert.equal(e.destination.tableCount,55);
 assert.equal(e.source.indexCount,63); assert.equal(e.destination.indexCount,63);
 assert.equal(e.source.sourceD1SchemaHash,e.destination.destD1SchemaHash);
 assert.equal(e.destination.exactEachObjectSqlShaMatchSource,true);
 assert.notEqual(e.source.sourceAccountFingerprint,e.destination.destinationAccountFingerprint);
 assert.notEqual(e.source.sourceD1Fingerprint,e.destination.destD1Fingerprint);
 assert.equal(e.source.sourceSystem2CronCount,0);assert.equal(e.source.sourceSystem1CronCount,4);
 assert.equal(e.source.sourceBackupDone,false);
 assert.equal(e.destination.sourceRowsImported,0);
 assert.equal(e.scopedVerdicts.crossAccountMigrationComplete,"BLOCKED");
 assert.equal(e.security.privateSQLBytesPublished,false);
 assert.equal(e.security.noSourceD1Mutations,true);
 assert.equal(e.security.noDestinationD1Mutations,true);
});
