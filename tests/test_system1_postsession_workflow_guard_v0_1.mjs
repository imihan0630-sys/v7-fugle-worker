import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(new URL("../.github/workflows/system1-postsession-evidence.yml",import.meta.url),"utf8");
let n=0;
assert.match(source,/workflow_dispatch:/);n++;
assert.doesNotMatch(source,/\n\s*schedule:/);n++;
assert.doesNotMatch(source,/\n\s*push:/);n++;
assert.match(source,/permissions:\s*\n\s*contents:\s*read/);n++;
assert.match(source,/node tests\/collect_system1_postsession_evidence\.mjs/);n++;
assert.match(source,/if:\s*always\(\)/);n++;
assert.match(source,/system1-postsession-blocker\.json/);n++;
assert.doesNotMatch(source,/wrangler|curl\s+-X\s+(?:POST|PUT|PATCH|DELETE)|gh\s+api.*--method\s+(?:POST|PUT|PATCH|DELETE)/i);n++;
assert.doesNotMatch(source,/contents:\s*write|actions:\s*write|deployments:\s*write/i);n++;
console.log(JSON.stringify({ok:true,assertions:n,manualOnly:true,scheduled:false,pushTriggered:false,contentsWrite:false,productionWrites:false}));
