import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const workerPath = process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js", import.meta.url).pathname;
const api = await import(pathToFileURL(workerPath).href + "?authcheck=" + Date.now());

const env = {
  ADMIN_TOKEN: "admin-test",
  THREEMIN_VERIFY_URL: "https://example.invalid/three-min",
  THREEMIN_API_TOKEN: "tm_live_test_only"
};

function request(token = "admin-test", method = "GET") {
  return new Request("https://worker.invalid/api/three-min/auth-check", {
    method,
    headers: {"x-admin-token": token}
  });
}

let calls = 0;
globalThis.fetch = async (url, options) => {
  calls += 1;
  assert.equal(url, env.THREEMIN_VERIFY_URL);
  assert.equal(options.method, "GET");
  assert.equal(options.headers["content-type"], "application/json");
  assert.equal(options.headers.authorization, "Bearer " + env.THREEMIN_API_TOKEN);
  assert.equal(options.redirect, "manual");
  return new Response(JSON.stringify({ok:true}), {
    status: 200,
    headers: {"content-type":"application/json"}
  });
};

let response = await api.default.fetch(request(), env);
assert.equal(response.status, 200);
let body = await response.json();
assert.deepEqual(body, {
  ok: true,
  authorized: true,
  httpStatus: 200,
  endpointConfigured: true,
  tokenConfigured: true,
  noWrite: true,
  noPlanChanges: true,
  noPush: true
});
assert.equal(calls, 1);

response = await api.default.fetch(request("wrong"), env);
assert.equal(response.status, 401);
assert.equal(calls, 1, "Unauthorized admin request must not call 3Min");

globalThis.fetch = async () => new Response("", {status: 401});
response = await api.default.fetch(request(), env);
assert.equal(response.status, 403);
body = await response.json();
assert.equal(body.authorized, false);
assert.equal(body.httpStatus, 401);
assert.equal(body.noWrite, true);
assert.equal(body.noPlanChanges, true);
assert.equal(body.noPush, true);

response = await api.default.fetch(request("admin-test", "POST"), env);
assert.equal(response.status, 405);

response = await api.default.fetch(request(), {...env, THREEMIN_API_TOKEN: ""});
assert.equal(response.status, 503);
body = await response.json();
assert.equal(body.endpointConfigured, true);
assert.equal(body.tokenConfigured, false);

console.log(JSON.stringify({
  ok:true,
  route:"/api/three-min/auth-check",
  externalCallsOnSuccess:1,
  noWrite:true,
  noPlanChanges:true,
  noPush:true
}));
