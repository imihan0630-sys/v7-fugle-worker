// Ensure the human report is genuinely surfaced inside the existing
// GitHub Actions summary, not merely emitted into a downloadable zip.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const workflow=readFileSync('.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml','utf8');
test('readable report and original source lineage validated BEFORE visible summary',()=>{
 const validate=workflow.indexOf('test "$(jq -r .pitACertified "$M")"');
 const report=workflow.indexOf('node system2/scripts/run_scheme_c_visible_report_readonly_v0_1.mjs');
 const header=workflow.indexOf("echo '## System 2｜方案 C 非 PIT 選股研究預覽'");
 const publish=workflow.indexOf('cat "$HUMAN"');
 assert.ok(report>=0&&validate>report&&header>validate&&publish>header);
 assert.match(workflow,/test -s "\$GITHUB_STEP_SUMMARY"/);
 assert.match(workflow,/grep -q 'System 2｜方案 C 非 PIT 選股研究預覽'/);
 assert.match(workflow,/grep -q "\$\(jq -r \.marketDate "\$M"\)"/);
});
test('never mislabel known historical PR proof as live new trading date',()=>{
 assert.match(workflow,/if \[ "\$PHYSICAL_EXAMPLE_PR" = 'true' \]; then[\s\S]+?歷史真實資料回放（2026-10-13）/);
 assert.match(workflow,/非最新交易日、非已上線的當日選股/);
 assert.match(workflow,/以報告列示的交易日、來源時點及資料延遲標記為準/);
});
test('status summary keeps source-not-ready and the formal selection as UNKNOWN',()=>{
 assert.match(workflow,/selectedCount：.*UNKNOWN（不是零檔）/);
 assert.match(workflow,/grep -q '研究觀察候選股\\\|來源限定的觀察名單\\\|SOURCE_NOT_READY'/);
 assert.match(workflow,/PIT-A／PIT-B：.*未認證/);
 assert.match(workflow,/Frozen／正式推播：.*禁止/);
});
test('the event-driven flow remains read-only with no new schedule or secrets',()=>{
 assert.match(workflow,/workflow_run:/);
 assert.match(workflow,/permissions:\s*\n\s*actions: read\s*\n\s*contents: read/);
 assert.doesNotMatch(workflow,/\n\s+schedule:|wrangler\s+deploy|worker_secret|cloudflare\/workers-action|CREATE\s+TABLE|INSERT\s+INTO/);
 assert.match(workflow,/uses: actions\/upload-artifact@v4/);
});
