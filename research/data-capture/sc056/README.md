# SC-056 MOEA physical-chain capture

Isolated Class-A research collector, version 0.1.0. No Worker, System 2,
trading, score, capital, notification, deployment or recurring schedule changes.
This collector does not raise research maturity or validate a supply-chain lag.

## Verified source contract

The official [survey index](https://www.moea.gov.tw/MNS/dos/content/Content.aspx?menu_id=6819)
publishes separate **業別統計** (`InvestigateDB.aspx`) and **產品統計**
(`InvestigateDA.aspx`) links. Only the latter resolves the required products.
Playwright operates that visible product form, including its native ASP.NET
read-only query POST. No hidden API or direct-download contract is inferred.

| Research code | Official control code/name | Displayed unit |
| --- | --- | --- |
| 2433-020 | (2433020)銅箔 | 公噸 |
| 2630-010 | (2630010)銅箔基板 | 平方呎 |
| 2630-040 | (2630040)印刷電路板(不含IC載板) | 平方呎 |

One requested month, 月 / 民國 / 統計值 / 統計表, 生產量 + 存貨量.
The default historical smoke month is 2025-01 (11401). Its six values are
independently recorded in SC-055's annual-report replay. A changed historical
baseline is retained but fails the smoke gate for source-revision review.
`capture.mjs` can capture any single month actually offered by the source.

## Run

Requires Node >=22 and exactly Playwright **1.63.0**, locked with integrity hashes.
Chromium headless is installed from that exact Playwright package.

```sh
cd research/data-capture/sc056
npm ci
npx --no-install playwright install --with-deps chromium
npm test
node smoke.mjs --month 2025-01 --out captures
node capture.mjs --month 2026-07 --out captures
```

The last command is an example, not an assertion of source freshness or a
recurring job. No secrets are used. In a managed proxy environment, Chromium
must trust the supplied environment CA in its NSS trust store; retain TLS
verification and the inherited HTTPS proxy. CI uses ordinary public HTTPS.

The workflow `sc056-moea-playwright-smoke.yml` runs offline fixture tests on PRs.
Only **workflow_dispatch** runs the live source twice. Inputs are passed via an
environment variable and validated as YYYY-MM. Workflow permissions are
contents:read; it has no deployment, credential or automatic commit steps.

## Output / clocks

Each receipt is JSON with the source/index URLs, selected form and result
controls, product-code mapping, reference month, raw production/inventory
strings, displayed units, collector/parser/browser versions and request audit.
Values retain commas and precision. Recognized suppressed/blank cells become
explicit `UNKNOWN` with the original cell text and reason, never zero. An
unrecognized token, unit, code, name, period, metric or table shape fails closed.

`sourcePublishedAt` is **UNKNOWN**: the verified query does not expose a native
record publication clock. Neither the reference month, annual-report timestamp,
survey-index publication schedule nor HTTP response time supplies that clock.
`capturedAt`/`knownAt` are actual receipt times with the Asia/Taipei +08:00 offset;
they cannot prove historical first publication. These are current-source
vintages of historical values, not reconstructed historical PIT receipts.
A newly displayed publication label stops capture pending scoped parser review.

`semanticFingerprint` covers the source URL, month, selected semantic controls
and records, excluding capture times and browser/environment metadata.
`rawResultSha256` covers the original table HTML; visual frozen-header clones
are excluded. The smoke gate requires equal semantic fingerprints in two fresh
browser contexts and exact stored-file hash readback. Raw hashes are reported
separately because harmless page formatting can change independently of data.

## Append-only evidence

Outputs use `DATE/vVERSION/CAPTURE_TIME-UUID/` and exclusive writes, containing
`receipt.json`, `result.html`, `result-table.json`, `result-page.txt`, and a
SHA-256 `manifest.json`. No previous receipt is overwritten. The raw page text
and original result table are preserved; cookies and opaque ASP.NET form state
are not archived. Failed runs exit nonzero and write a separate smoke failure
receipt; a successful first run is retained even if repeatability fails.

GitHub artifacts are transport (90-day retention), **not permanent storage**.
After a verified manual run, download the exact run/attempt artifact, verify
its manifests and replay, then commit it under `evidence/` in a new dated,
versioned directory. Never replace an older receipt; later revisions are new
captures. The first verified CI artifact will be recorded in the handoff and
committed here before this engineering task is accepted.

Current evidence: `evidence/local-20261004/` contains two verified captures from
commit `8024f60d557c57b969a5f0a361b17da58bc3894a`. Both manual GitHub CI attempts
failed at source navigation; the diagnostic attempt 37199605968 proves an MOEA
Cloudflare HTTP 403 block, not a parser failure. Their exact artifact JSON and
GitHub artifact digests are preserved under `evidence/ci-37199450918-1/` and
`evidence/ci-37199605968-1/`. Local success does **not** satisfy the CI gate.
PR #547 remains draft/unmerged until source-approved CI access and live readback
are proven. See the canonical handoff for the exact next action.

## Tests / boundaries

The HTML fixture is the original MOEA result table obtained with Chromium on
2026-10-04, querying 2025-01. It is source evidence, not generated sample data.
Tests cover all six baseline values, units/codes, wrong months/headers/spans,
suppression/zero, duplicate tables, request method/body restrictions, exclusive
archives and corrupted readback. All fixture browser requests are blocked.

The existing `V7_TEST_WORKER_PATH=Worker.js node tests/test_requirements_repair.mjs`
fails on unchanged main's previous-quarter EPS assertion (`Missing expected
exception: Requirement 11 now requires a verified previous-quarter EPS before
QoQ is accepted`). This collector does not modify either that test or Worker.js.
Record the failure separately from the targeted collector acceptance.

Rollback: revert the research-only PR; there is no deployed service to roll back.
Preserve committed receipts as immutable historical evidence.
