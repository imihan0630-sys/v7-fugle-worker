import assert from "node:assert/strict";
import test from "node:test";
import {readFile} from "node:fs/promises";
const path=new URL("../../.github/workflows/system2-commander-safe-executor.yml",import.meta.url);
const w=await readFile(path,"utf8");
test("only main changes to safe-executor allowlist activate PR-merged physical GitHub Run",()=>{
 assert.match(w,/push:\n    branches: \[main\]\n    paths:\n/);
 assert.match(w,/'system2\/commander\/safe_executor_v0_1\.mjs'/);
 assert.match(w,/'\.github\/workflows\/system2-commander-safe-executor\.yml'/);
 assert.doesNotMatch(w,/branches: \[\*\]/);
 assert.doesNotMatch(w,/branches: \[system1/);
 assert.match(w,/github\.event\.issue\.number == 1229/);
 assert.match(w,/github\.event\.comment\.user\.login == 'imihan0630-sys'/);
});
test("original GitHub artifact evidence reporter remains conditional and no Cloudflare API",()=>{
 assert.match(w,/actions: read/);assert.match(w,/issues: write/);assert.match(w,/contents: read/);
 assert.match(w,/if: success\(\)/);assert.match(w,/actions\/upload-artifact@v4/);
 assert.match(w,/node system2\/commander\/safe_executor_report_v0_1\.mjs/);
 assert.match(w,/s2-commander-safe-executor-\$\{\{ github.run_id \}\}/);
 assert.doesNotMatch(w,/secrets\.|environment: system2-schema-only|environment: system2-research|wrangler deploy|actions: write|id-token: write|pull-requests: write/);
});
test("safe job does not unilaterally authorize audited PASS, Cron or D1 write",()=>{
 assert.match(w,/S2_DEST_WRITER_CLASS|M08\/M12 offline allowlist only/);
 assert.doesNotMatch(w,/s2cmd:audited-pass|cloudflare\.com|npm install|curl.*cloudflare/);
});
