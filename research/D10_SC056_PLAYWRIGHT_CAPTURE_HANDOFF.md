# D10 SC-056 Playwright Capture Engineering Handoff

Status: IMPLEMENTED_LOCAL_VERIFIED / CI_SOURCE_ACCESS_BLOCKED / ACCEPTANCE_INCOMPLETE
Updated: 2026-10-04 19:45 Asia/Taipei
Repository: `imihan0630-sys/v7-fugle-worker`
Authoritative branch: latest `main`
Observed main at handoff creation: `222398b54a10d4075ec4f0c06b823d438561f9aa`

## Task identity

07｜產業與供應鏈研究室
D10-02 供應鏈 Lead-Lag / SC-056
Engineering task: replace TinyFish dependency for official interactive-source capture with a repository-owned Playwright collector.

## Mode

Recommended: Codex
Model: GPT-6 Astra
Reasoning: High

## Objective

Implement a minimal, deterministic, read-only Playwright capture path for the MOEA Industrial Production, Shipment & Inventory Statistics Survey interactive query so SC-056 can prospectively freeze native source publication/capture clocks and retrieve the physical chain:

- 2433-020 銅箔
- 2630-010 銅箔基板
- 2630-040 印刷電路板（不含 IC 載板）

The collector must support at least monthly production and inventory fields when available and preserve the displayed unit.

## Required behavior

1. Re-read latest `main` before coding. Do not assume the observed SHA above remains current.
2. Read `AGENTS.md`, `shared-knowledge/ROOM_BOOTSTRAP.md`, this handoff, `SUPPLY_CHAIN_LEAD_LAG_RESEARCH.md`, and `research/sc055_physical_nonsteel_three_layer_chain_replay_v0_1.json`.
3. Do not change System 1 Formal Core, Worker production runtime, live trading, capital/risk, or System 2 behavior.
4. Keep this as a research-data collector. No stock-return or company-score join.
5. Prefer a standalone Playwright implementation under a research/data-capture path rather than modifying Worker.js.
6. Pin the Playwright dependency/version used by CI and record it.
7. Use Chromium headless in CI.
8. Treat the MOEA page as the source of truth. Do not invent hidden endpoints. If an official direct download/API is clearly exposed by the page, it may be used only after Playwright verifies the query semantics and the implementation preserves source lineage.
9. Capture and emit:
   - source URL
   - query parameters / selected controls
   - product code/name
   - reference month
   - production value
   - inventory value
   - displayed unit
   - sourcePublishedAt if visible/available
   - capturedAt in Asia/Taipei
   - raw page/result fingerprint or hash
   - parser/collector version
   - explicit UNKNOWN for unavailable fields
10. Fail closed when selectors, product codes, units, or table structure drift. Do not silently return zero or stale prior data.
11. Add fixture/parser tests and one live read-only smoke test that cannot mutate the source site.
12. Add a manually dispatchable GitHub Actions workflow first. Do not schedule recurring execution until the live smoke test and readback are proven.
13. Store durable captured research evidence in an append-only location with date/version lineage; do not overwrite historical receipts.
14. No secrets should be required for a public MOEA source.

## Acceptance gate

A first implementation is acceptable only when all of the following are proven:

- Playwright opens the official MOEA query page in CI.
- The three exact product codes are selected or otherwise resolved from official page controls.
- At least one known historical month can be replayed deterministically.
- Output schema is machine-readable JSON.
- Units and missing fields are preserved without coercion.
- A second run on the same source state yields the same semantic record/fingerprint apart from capture-time metadata.
- Site drift or missing controls produce a hard failure / explicit UNKNOWN, not fabricated data.
- No production/trading code is changed.

## Exact next action

Resume **draft PR #547**, branch `research/sc056-playwright-capture`; do not
reimplement the collector or repeat source discovery. GitHub-hosted live CI is
blocked by MOEA's Cloudflare security service (HTTP 403). Restore source-approved
access for the CI execution environment through the normal authorized path,
then manually dispatch `sc056-moea-playwright-smoke.yml` on that branch with
`month=2025-01`. Do not rotate/spoof clients or bypass the source security block.
After two successful CI captures, download the exact run/attempt artifact,
verify its SHA-256 manifests and semantic replay, append it under `evidence/`,
and only then mark the implementation acceptance complete / ready for merge.
No recurring schedule, production deployment, or research promotion is authorized.

## 2026-10-04 implementation milestone

- Started from latest main `3c28637ff2ac833b7d08f1b9bd623a5354334d30`.
- Branch: `research/sc056-playwright-capture`; Class A, research only.
- Source discovery: official survey index menu 6819 exposes `InvestigateDA.aspx`
  for products; `InvestigateDB.aspx` is industry statistics and is not this chain.
- Browser-resolved exact source codes: 2433020 / 2630010 / 2630040. Production
  and inventory controls both verified. Units: 公噸 / 平方呎 / 平方呎.
- Standalone implementation: `research/data-capture/sc056/`; Playwright 1.63.0,
  Chromium headless. Workflow: `.github/workflows/sc056-moea-playwright-smoke.yml`.
- Local targeted tests: 19/19 PASS. Local live smoke 2025-01: PASS, two fresh
  contexts; all six values match SC-055; archives read back with verified hashes.
- Local semantic fingerprint:
  `70eecad5784520d865ea42f15627fb9c4117797692f97f0d4074fc7505545232`.
- Local raw-result hash (both runs):
  `0fdb61785aa18a581aa1e7eebeb97210ecef91ef2c9a6da42a76871dbc8a3c74`.
- Capture clocks: 2026-10-04 19:34:46 / 19:34:56 Asia/Taipei. Native record
  `sourcePublishedAt` remains UNKNOWN; historical first-publication/PIT proof is
  not supplied by a current historical replay.
- Existing Worker regression command fails its previous-quarter EPS expected
  exception on unchanged Worker.js. No production/system2 files are changed;
  that unrelated baseline failure is not counted as collector acceptance.
- CI and permanent first-CI-artifact acceptance are pending. No recurring schedule.
- D10-02 remains L2; engineering completion cannot promote research maturity.

## 2026-10-04 durable execution checkpoint — source blocker identified

- PR: https://github.com/imihan0630-sys/v7-fugle-worker/pull/547 (draft, unmerged).
- Implementation commits: `878ea020c800c8474159aae7fccf7c687a2897d8`
  (collector/tests/workflow), `8024f60d557c57b969a5f0a361b17da58bc3894a`
  (source-navigation diagnostics). Read latest PR head for appended evidence/docs.
- Branch was synchronized with main `6c4bcdaa` before the implementation commit;
  later unrelated main progress must be synchronized, not replayed as new work.
- Permanent verified **local**, not CI, receipts are on the PR branch at
  `research/data-capture/sc056/evidence/local-20261004/`. Two fresh Chromium
  contexts at 19:42:22 / 19:42:33 Asia/Taipei match all six 2025-01 baseline values,
  the semantic fingerprint and raw-result hash above. Both capture receipts name
  exact collector commit `8024f60d557c57b969a5f0a361b17da58bc3894a`; manifests
  were independently read back after capture. No native publication clock is inferred.
- CI targeted tests: 19/19 PASS on Node 22 / pinned Playwright 1.63.0.
- PR checks on implementation commit 8024f60d:
  - collector fixture workflow 37199608797 PASS;
  - V8 Regression Tests 37199608723 PASS;
  - V8 Repair CI 37199608681 PASS.
  The separate legacy local command against raw Worker.js still fails as noted
  above; the repository's standard CI workflows pass. These are distinct checks.
- Live manual run 37199450918: FAIL at source navigation, zero captures.
- Diagnostic live manual run 37199605968: FAIL, source HTTP 403, title
  `Attention Required! | Cloudflare`, body `Sorry, you have been blocked / You
  are unable to access moea.gov.tw`, Ray ID `a453ed505cc8284e`. Browser request
  guard violations: none. No query POST or fabricated data resulted from that run.
- Both failed CI artifacts were downloaded through the GitHub connector and
  verified against GitHub's artifact SHA-256, then preserved on the PR branch:
  `evidence/ci-37199450918-1/` and `evidence/ci-37199605968-1/` beneath the collector.
- All unaffected implementation work is durable; no source-access workaround,
  self-hosted runner, secret, recurring task or deployment was introduced.
- Acceptance result: exact products / historical replay / JSON / units / missing
  semantics / repeatability / drift tests / isolation are proven locally; **CI
  opening the official page remains NOT PROVEN, so the full gate is NOT PASS**.
- Last actual execution stopped at the identified source-access boundary. There
  is no background continuation. The exact next action above is the only remaining
  implementation acceptance step; publication-clock enrichment is a separate
  UNKNOWN-capable future source-evidence task.

## Approval boundary

Owner has approved use of Playwright for this source-capture engineering task. This does NOT authorize any Formal Core change, production deployment, live trading mutation, recurring schedule, or broader data-source migration without the existing governance path.
