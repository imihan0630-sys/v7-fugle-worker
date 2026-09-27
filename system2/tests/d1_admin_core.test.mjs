import assert from "node:assert/strict";
import {
  splitSqlStatements,
  classifyTargetResources,
  assertProvisionConfirmation,
  assertIsolatedDatabaseName,
} from "../deploy/d1_admin_core.mjs";

const statements = splitSqlStatements(`
-- comment with ;
CREATE TABLE x (id TEXT, note TEXT DEFAULT ';');
/* block ; comment */
INSERT INTO x (id, note) VALUES ('a', 'semi;colon');
CREATE INDEX idx_x ON x(id);
`);
assert.equal(statements.length, 3);
assert.match(statements[0], /^CREATE TABLE/);
assert.match(statements[1], /^INSERT INTO/);
assert.match(statements[2], /^CREATE INDEX/);

const missing = classifyTargetResources({
  databases: [{ name: "v7-live", uuid: "1" }],
  workers: [{ id: "fugle-test" }],
});
assert.equal(missing.state, "DATABASE_NOT_FOUND");

const exists = classifyTargetResources({
  databases: [{ name: "system2-research", uuid: "2" }],
  workers: [{ id: "fugle-test" }],
});
assert.equal(exists.state, "DATABASE_EXISTS");
assert.equal(exists.database.uuid, "2");

const duplicate = classifyTargetResources({
  databases: [
    { name: "system2-research", uuid: "2" },
    { name: "system2-research", uuid: "3" },
  ],
  workers: [],
});
assert.equal(duplicate.state, "AMBIGUOUS_DUPLICATE_RESOURCE");

assert.equal(assertProvisionConfirmation("CREATE_SYSTEM2_ISOLATED_D1"), true);
assert.throws(() => assertProvisionConfirmation("yes"), /explicit confirmation/);
assert.equal(assertIsolatedDatabaseName("system2-research"), true);
assert.throws(() => assertIsolatedDatabaseName("v7-live"), /unexpected/);

console.log("System2 D1 admin core tests passed");
