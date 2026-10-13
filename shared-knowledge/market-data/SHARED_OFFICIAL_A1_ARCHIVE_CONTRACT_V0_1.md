# Shared Official A1 Market Archive Contract V0.1

Status: **SOURCE_INTEGRATION_IMPLEMENTED; INDEPENDENT_DURABLE_ARCHIVE_NOT_YET_GRANTED**  
Scope: SHARED cross-System1/System2 research market data. 2026-10-13.
Canonical repository: `imihan0630-sys/v7-fugle-worker` main.

## Owners
- **BUILD00 System2** maintains source contract, provenance manifest, GitHub Actions public-source incremental downloader and tests.
- **System2 DATA_LANE** handles destination-account D1 ingestion **only with** its separate metered quota and RAW/PIT classification, and must not claim a source backfill was known at the old market close.
- **AUDIT_LANE** independently recomputes raw gzip-original SHA256, date/market coverage, publication-time semantics and manifest chain before promotion.
- **System1 BUILD00** may *read* this SHARED evidence, but must **opt in separately** to any System1 D1 change. Existing V8 Formal Core, A/B, Top6, 15m, real signals, Worker/Cron and push are untouched.

## Canonical source + verification
- TWSE: `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=YYYYMMDD&type=ALLBUT0999`.
- TPEx: `https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?response=json&date=YYYY%2FMM%2FDD`.
- Official TWSE calendar selects exactly **61 trading dates**, not 61 calendar days. One canonical official full-market response per date + market, 122 pairs for a full bootstrap; after bootstrap the goal is two new date/market responses per eligible session.
- Keep original **response bytes** `original-json/{TWSE|TPEX}-YYYY-MM-DD.json.gz` and the original SHA256 over **decompressed original bytes**. `official-61-YYYY-MM-DD.json` pins the exact URL, source-reported market date, row count, original capture time and SHA. `shared-official-a1-manifest.json` pins every retained pair and its own canonical JSON SHA. `shared-official-a1-run.json` summarizes completeness/missing pairs. Missing = `INCOMPLETE`, **not** zero eligible stocks.
- Prior validated originals are SHA/date/semantics checked before byte reuse. Cache replay retains the **original capturedAt** even if a new workflow starts much later; later re-fetch and existing archive bytes must not fabricate `firstKnownAt` for historical backtest.
- Do not substitute TPEx legacy `otc_quotes_no1430` as canonical dailyQuotes when volume/turnover semantics differ. No price-forward-fill across missing sessions.
- Source date resolution uses Taipei local time and official closed trading dates; no automatic `today` close inference before 20:00 Taipei. An after-hours source date is still pending actual official final-source acceptance. Delayed schedule crossing midnight retains actual observed date and properly labels previous-day capture **retrospective-only**.

## Existing original provider evidence / partial repair
- `Run 38317682441` source: 61 dates **2026-07-16 through 2026-10-13**, 118 validated of 122 date/market pairs and 120 original HTTP-success payloads. Independent issue #1132 evidence identifies TPEx 2026-08-20, TPEx 2026-08-21, and pre-open TWSE+TPEx 2026-10-13 as four not validated. No 61-session strategy-eligible symbol was certified by this partial receipt.
- Source seed is `system2-original-official-61-2026-10-13-38317682441` from GitHub Run 38317682441. New read-only Action may consume it using the existing repository GitHub-token **actions:read** permission. For new target 61-window, only successfully independently verified pairs within that window may be reused; everything missing is fetched from canonical source.
- Source provenance from Actions **does not** certify historical provider first-publication timestamps, actual corporate action adjustment, continuity, independent PIT, OOS, qualified stock selection or zero-pick day.

## Low-cost pipeline implementation
- `.github/workflows/system2-shared-official-a1-incremental-readonly.yml`: approved **GitHub read-only** source workflow, one run nightly after trading sessions, with no Cloudflare API/Secret/paid resources. GitHub Actions `actions:read` accesses same-repository prior original artifacts; it does NOT add a new external app, secret, paid plan, cross-account API, D1 writer or Cloudflare Cron. Existing research workflows remain governed independently.
- Source-only artifacts are retained **7 days** for bounded rolling cache size rather than duplicating ~24MB for 90 days every trading day. Prior historical 90-day original seed remains a short-term fallback; current run tests real provider exact date and hashes. **Artifact is not permanent archival storage**.
- Estimated new source GET workload after an intact prior seed is generally **2** canonical date/market responses per session (calendar requests separate), rather than all **122**, with explicit missing-pair retries/recovery.
- The manifest and consumer reader under `shared-knowledge/market-data/` are common-source contracts. Consumer guard accepts `READ_ONLY_SOURCE_RESEARCH` only. System1/2 do not automatically connect D1 to this evidence.

## Durable source archival: separately permission-gated, NOT yet deployed
A GitHub versioned compressed raw-object archive + SHA-index manifest is the **lowest-new-service** option; it requires controlled **repository contents write** in a publishing workflow (or authorized GitHub connector writes). Today's new read-only source workflow deliberately has `contents:read` and may **not** silently promote its short-term Artifact into a durable Git commit or Release asset. Do not grant a GitHub Action `contents:write` (or new external app/secret) without explicit owner authorization for that specific scope and an independent data-repository-growth/cost review. GitHub repo blob growth and retention must be bounded; no claim that GitHub provides free unlimited source storage. Existing Cloudflare R2 is not assumed entitled.

Alternatives:
1. Owner-authorized GitHub versioned compressed archive (preferred for small bounded rolling window; independent review required for unlimited history).
2. Existing already-entitled approved shared object store *only after* provider entitlement and budget established; no default purchase.
3. Temporary GitHub Actions Artifact until authorization, with early expiry and loss-of-data risk clearly visible.

## Hard isolation
**System1 and System2 keep different Cloudflare accounts/D1 databases, separate credentials, quotas, writer registries, Frozen decisions, ranking and trade signals.** Shared market raw JSON/manifest can be identical; physical import, quotas and mutable decisions cannot. No automatic V8 alteration; no cross-account D1 direct reads without independent permission, and no Strategy/PIT/Frozen upgrade from a source observation alone.

## Acceptance status
1. Source provenance code, PIT-negative tests, dual read-only consumer contract: engineering and CI must independently PASS.
2. At least 61 complete market-date pairs, actual first incremental physical source run and independent artifact hash audit: **PENDING physical run**.
3. True durable source archive, cross-account consumer live readback, account-safe D1 import: **PENDING scoped owner writer grant**.
4. Qualified System2 daily strategy selection, immutable Frozen write/readback: **BLOCKED**, tracked in #1132, separate from shared-source work.
