import assert from "node:assert/strict";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";

const calls = [];
const fakeFetch = async (url, init = {}) => {
  calls.push({ url, init });
  if (url.includes("/d1/database?per_page=100")) {
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        success: true,
        result: [{ name: "system2-research", uuid: "db-123" }],
      }),
    };
  }
  const body = JSON.parse(init.body || "{}");
  if (Array.isArray(body.batch)) {
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        success: true,
        result: body.batch.map((x) => ({
          success: true,
          results: [],
          meta: { rows_read: 0, rows_written: 1, size_after: 123456 },
        })),
      }),
    };
  }
  return {
    ok: true,
    status: 200,
    text: async () => JSON.stringify({
      success: true,
      result: [{
        success: true,
        results: body.sql.startsWith("SELECT") ? [{ value: 7 }] : [],
        meta: { rows_read: body.sql.startsWith("SELECT") ? 1 : 0, rows_written: 0, size_after: 123456 },
      }],
    }),
  };
};

const db = await createRemoteD1RestAdapter({
  accountId: "acct",
  apiToken: "token",
  fetchImpl: fakeFetch,
});

const first = await db.prepare("SELECT value FROM x WHERE id = ?").bind("A").first();
assert.equal(first.value, 7);

const s1 = db.prepare("INSERT INTO x (id) VALUES (?)").bind("A");
const s2 = db.prepare("INSERT INTO x (id) VALUES (?)").bind("B");
const results = await db.batch([s1, s2]);
assert.equal(results.length, 2);
assert.equal(results.every((x) => x.success), true);
assert.equal(db.metrics.rowsRead, 1);
assert.equal(db.metrics.rowsWritten, 2);
assert.equal(db.metrics.latestSizeAfter, 123456);

const batchCall = calls.find((x) => {
  try { return Array.isArray(JSON.parse(x.init.body || "{}").batch); } catch { return false; }
});
assert.ok(batchCall);
assert.equal(JSON.parse(batchCall.init.body).batch.length, 2);

await assert.rejects(
  () => createRemoteD1RestAdapter({
    accountId: "acct",
    apiToken: "token",
    databaseName: "v7-production",
    fetchImpl: fakeFetch,
  }),
  /refuses non-isolated database name/,
);

console.log("System2 remote D1 REST adapter tests passed");
