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

test('failed or self-diagnostic upstream has visible SOURCE_NOT_READY without false zero',()=>{
 assert.match(workflow,/show_unavailable_upstream_audit:/);
 assert.match(workflow,/github.event.workflow_run.conclusion != 'success'/);
 assert.match(workflow,/github.event.workflow_run.event != 'workflow_run'/);
 assert.match(workflow,/來源交易日：.*UNKNOWN（未取得合格來源/);
 assert.match(workflow,/正式 selectedCount：.*UNKNOWN（不是 0 檔）/);
 assert.match(workflow,/SOURCE_NOT_READY/);
 assert.match(workflow,/if: failure\(\)/);
 assert.match(workflow,/來源 Artifact 缺漏、SHA\/交易日\/截止驗證失敗/);
});

test('actual daily workflow_run uses ONE exact independently-audited ZIP for audit AND V02 preview',()=>{
 const step=workflow.match(/- name: Historical-PR-only different-run V02 original[\s\S]*?path: \/tmp\/s2-scheme-c-daily-derived-preview\//);
 assert.ok(step,'optional historical second-run artifact is correctly scoped');
 assert.match(step[0],/if: github.event_name == 'pull_request'/);
 assert.match(workflow,/if \[ "\$PHYSICAL_EXAMPLE_PR" = 'true' \]; then\s+PREVIEW_DIR=\/tmp\/s2-scheme-c-daily-derived-preview\s+else\s+PREVIEW_DIR=\/tmp\/s2-scheme-c-daily-original-audit/);
 assert.match(workflow,/test ! -d \/tmp\/s2-scheme-c-daily-derived-preview/);
 assert.match(workflow,/test "\$\(find "\$PREVIEW_DIR" -type f -name 'preliminary-pv-watch.json' \| wc -l\)" -eq 1/);
 assert.match(workflow,/PREVIEW="\$\(find "\$PREVIEW_DIR" -type f -name 'preliminary-pv-watch.json' -print -quit\)"/);
 assert.match(workflow,/run-id: \$\{\{ github.event_name == 'pull_request' && '38469057567' \|\| github.event.workflow_run.id \}\}/);
 assert.match(workflow,/name: \$\{\{ github.event_name == 'pull_request' && 'system2-shared-official-a1-independent-audit-38469057567'/);
});
test('real daily source route requires actual completed workflow_run, genuine upstream success and main',()=>{
 assert.match(workflow,/github.event.workflow_run.conclusion == 'success'/);
 assert.match(workflow,/github.event.workflow_run.head_branch == 'main'/);
 assert.match(workflow,/github.event.workflow_run.head_repository.full_name == github.repository/);
 assert.match(workflow,/github.event.workflow_run.event == 'workflow_run'/);
 assert.match(workflow,/node system2\/scripts\/run_scheme_c_daily_audit_handoff_readonly_v0_1.mjs "\$AUDIT" "\$PREVIEW" "\$UPSTREAM_AUDIT_RUN"/);
});

test('independent real Oct16 Audit Run physical replay is truly SAME artifact for audit and preview',()=>{
 const start=workflow.indexOf('  verify_real_20261016_single_audit_zip:');
 assert.ok(start>0);
 const j=workflow.slice(start);
 assert.match(j,/if: github.event_name == 'pull_request'/);
 assert.match(j,/run-id: 38934321405/);
 assert.match(j,/name: system2-shared-official-a1-independent-audit-38934321405/);
 assert.equal((j.match(/uses: actions\/download-artifact@v4/g)||[]).length,1);
 assert.match(j,/test "\$\(find "\$ROOT" -type f -name 'audit-receipt.json' \| wc -l\)" -eq 1/);
 assert.match(j,/test "\$\(find "\$ROOT" -type f -name 'preliminary-pv-watch.json' \| wc -l\)" -eq 1/);
 assert.match(j,/run_scheme_c_daily_audit_handoff_readonly_v0_1.mjs "\$AUDIT" "\$PREVIEW" 38934321405/);
 assert.match(j,/LATE_SOURCE_DESCRIPTIVE_PREVIEW_ONLY/);
 assert.match(j,/2026-10-16/);
 assert.match(j,/selectedCount "\$R"\)" = 'null'/);
 assert.match(j,/frozenD1Written "\$R"\)" = 'false'/);
 assert.match(j,/readable|run_scheme_c_visible_report_readonly_v0_1.mjs/);
 assert.doesNotMatch(j,/\nschedule:|\bwrangler\s+deploy\b|\bCREATE\s+TABLE\b/);
});

test('Actions Summary surfaces source-audit and preview cutoff deltas, not invented Github scheduler latency',()=>{
 assert.match(workflow,/T23:45 相對截止—獨立稽核完成/);
 assert.match(workflow,/T23:45 相對截止—預覽觀察形成/);
 assert.match(workflow,/GitHub 排程延遲／官方公布時點/);
 assert.match(workflow,/本收據無法單獨歸因/);
 assert.match(workflow,/test "\$\(jq -r \.schedulerDispatchDelayMinutes "\$M"\)" = 'null'/);
 assert.match(workflow,/test "\$\(jq -r \.officialProviderPublicationAtUtc "\$M"\)" = 'null'/);
 assert.match(workflow,/previewObservationOffsetMinutes "\$META" \| awk/);
 assert.match(workflow,/SOURCE_OBSERVED_AFTER_T2345_DESCRIPTIVE_ONLY/);
});
