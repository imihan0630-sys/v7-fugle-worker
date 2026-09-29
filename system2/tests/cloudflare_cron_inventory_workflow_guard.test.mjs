import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const workflowUrl = new URL(
  '../../.github/workflows/system2-cloudflare-cron-inventory-readonly.yml',
  import.meta.url,
);

test('Cloudflare cron inventory workflow is bounded and read-only', async () => {
  const workflow = await readFile(workflowUrl, 'utf8');

  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /environment: system2-research/);
  assert.match(workflow, /permissions:\s*\n\s*contents: read/);
  assert.match(workflow, /workers\/scripts/);
  assert.match(workflow, /\/schedules/);
  assert.match(workflow, /mode: 'READ_ONLY'/);
  assert.doesNotMatch(workflow, /method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
  assert.doesNotMatch(workflow, /wrangler\s+(?:deploy|delete|secret)/i);
});
