# D10 SC-056 Playwright Capture Engineering Handoff

Status: READY_FOR_CODEX
Updated: 2026-10-04 19:13 Asia/Taipei
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

Create a task branch from latest main, inspect the MOEA page/DOM with Playwright, implement the smallest read-only collector + fixture test + manual GitHub Actions smoke workflow, run it, save the first verified capture artifact, then update this handoff with branch/PR/commit/tests/readback and the next continuation point.

## Approval boundary

Owner has approved use of Playwright for this source-capture engineering task. This does NOT authorize any Formal Core change, production deployment, live trading mutation, recurring schedule, or broader data-source migration without the existing governance path.
