# SHARED Official A1: 7-day cache + private content-addressed long-term archive — Owner-approved, publisher NOT authorized

Date: 2026-10-13 Asia/Taipei  
Scope: `SHARED` market source only, System1 Formal Core unchanged, System2 qualified selection/Frozen authority unchanged.  
Formal repo: `imihan0630-sys/v7-fugle-worker`, GitHub main.  
Owner approval: **dual-layer architecture and preflight/code engineering**; **NO new publishing permissions / paid service / public redistribution approval**.

## Physical cost and size baseline (not fictitious prices)

Source real original GitHub Run [38351651871](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38351651871) / Artifact [11791440725](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38351651871/artifacts/11791440725): source official original `original-json/` contains **121 verified source-date market gzip blobs = 25,039,760 compressed bytes**. Breakdown from original ZIP: 61 TWSE originals **4,295,373** compressed bytes, 60 TPEx originals **20,744,387** compressed bytes; max observed 401,528 compressed bytes. Normalized 61-session per-symbol JSON is **36,076,213 bytes** and is **not** required as a second permanent original archive. Full GitHub Action ZIP **33,359,541** bytes incl normalized JSON. 1 market/date pair (TPEx 2026-07-15) remained unverified for the 2026-10-12 retrospective window; **do not fabricate original bytes or assume 122/122**.

- Baseline compressed originals per 61 sessions: 25,039,760/61 = **410,488 bytes per trading day** across the two markets, subject to market/source variations.
- Est. 250 trading days/year: about **102.62 million bytes (~102.62 MB) net new per year** if two original source responses are archived once/day, excluding official revisions and all new source families.
- Est. 5 years: about **513 MB**. Est. 10 years: **1.03 GB**. Projections are not guaranteed capacity or billing.
- GitHub Actions **7-day** rolling full-61 source cache ZIP ~33.36 MB/run, **7 consecutive runs ~233.5 MB** before the storage used by other workflows and packages. GitHub Free artifact storage generally includes **500 MB**, but **repo owner plan/current actual usage unverified**; GitHub billing guards and quota exhaustion must be separately checked. Avoid retaining every 33 MB source archive for 90 days.
- The content-addressed immutable long-term archive should retain **one copy of each distinct original source body SHA**, and additional versions only if official content changes; no duplicated 61-window per day. Hash index alone is not original data, and an action Artifact is not permanent.

## Security / data rights (newly discovered physical issue)

**Existing repository is physically PUBLIC** via GitHub Repository API 2026-10-13. Do **NOT** upload archived official original TWSE/TPEx .json.gz into the current public repository, or publicly accessible Releases/Assets. GitHub Releases of this repository are visible to its readers. Original sources have official TWSE/TPEx site Terms with limits on automated downloading and public redistribution. A public page or GET URL being available **does not itself grant copyright/data redistributor permission**. Data.gov.tw Open Data Platform separately authorized resources may have different license — check the **exact** source endpoint/dataset contract, not rely on generic “official public source.” Existing previously accepted source collectors are not modified or invalidated by this recommendation, but do not expand distribution or permissions automatically.

References:
- https://wwwc.twse.com.tw/en/terms/use.html
- https://www.tpex.org.tw/en-us/gtsm_disclaimer.html
- https://www.twse.com.tw/zh/products/information/qa.html
- https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
- https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases

## Alternative evaluation — no expense without owner approval

1. **Preferred contingent solution: private versioned GitHub archive repository + Immutable Releases.** New separate **private** repository or verified pre-existing private repository, isolated from V8 program/production tags. Draft weekly immutable releases (ISO week) first; attach compressed original source response assets with full SHA256 in file names, normalized provenance manifest and unique release hash tag; publish only after independent readback, then verify immutable Release lock and subsequent checksum. Late official revision creates NEW hash-tag/version, never edits/replaces old Release. Code repository keeps public hashes/links only, no raw licensed payloads. GH default `GITHUB_TOKEN` in a workflow is scoped to its **own repository**; reading/writing a new private repo from the existing public repo may require an explicitly approved installation/token/access grant. **No new repo, write permission or token created in this change.** Immutable setting on current program repository would apply to existing V8 releases (if any) so it is not automatically changed. Official GitHub release asset <2 GiB; no stated per-release total-size or bandwidth limit, but fair-use and sustainability not independently guaranteed.
2. **Alternate: existing privately entitled R2 Standard bucket** if the owner already holds R2 entitlement and can authorize an access policy safely. R2 official free included tier: **10 GB-month per month, 1 million Class A + 10 million Class B operations/month**, Standard storage, subject to account-wide usage and billing. Must verify current account's R2 subscription, total storage, valid payment/billing exposure, quota and read/write capability first; new R2 subscription requires checkout and could incur charges outside included usage. No new R2 bucket/Secret or subscription is authorized by this document.
3. **Reject: GitHub public repository git blobs/Public Releases.** Public redistribution/copyright and repo size risk. Public GitHub main may hold **SHA manifest, source identifiers, timestamps, non-secret receipt summaries only**.
4. **Reject: only GitHub Actions Artifact.** 7-day ephemeral cache has expiry and plan storage quotas, not a durable archive.

## Execution stages and owners

- Phase A (authorized, research-only): existing official read-only Action 7-day rolling cache, immutable source observation SHA, `SHARED_OFFICIAL_A1_MARKET_DATA_V0_1` dual-system research-only consumers; physical dry-run independently verifies original gzip bytes, canonical market/date source, original observation times and per-week compressed byte boundaries. **No external publish calls or D1 writes.**
- Phase B (**owner approval REQUIRED**): choose a private archive destination, confirm source data rights for internal archival / automation and acceptable no-cost storage model, approve scoped publication writer permission (private GitHub repo or already-entitled private R2), and confirm independent credentials/limits. Never publish original licensed blobs in public GitHub main.
- Phase C (after B): append-only publish to private archive; verify asset bytes readback and Release immutability or versioned R2 object retention; record manifest SHA and original source timestamps; encrypted/offline secondary backup if required, restore proof. Enforce duplicate SHA no-upload, quotas and automatic fail-closed against paid overages.
- Phase D (after independent audit): System1 and System2 obtain **separately authorized read-only** access to common private source, read/verify original SHA and import required data into their own isolated D1 accounts/writer registries. No Formal V8 consumption change without Class B/C explicit authorization. No direct account cross-write and no shared D1 billed quota.
- System2 qualified prospective selection and Frozen create-only D1 readback are separate from source archival. Historical source retrieved now never retroactively becomes earlier first-known PIT.

## Current acceptance checklist

- Current 7-day cache in main: **PASS**, nightly scheduled source retrieval separate from this archive.
- Owner double-layer architecture: **APPROVED**.
- Actual original-file private-archive dry-run and annual cost projection: **engineering ready / needs live CI+Artifact hash**.
- Publisher with `contents:write` or private R2 PUT: **BLOCKED — owner has not authorized**.
- Actual private archive write and physical readback: **BLOCKED**.
- Data rights for requested archival and distribution: **NOT VERIFIED**.
- Live System1 / System2 cross-account source readback and separate D1 import: **BLOCKED**; current shared research-only contract does not grant credential access.
- New live System2 strategy selection / Frozen Snapshot: **BLOCKED / separately tracked Issue #1132**.

GitHub public main remains only the governed software+SHA reference. Do not construe archived public official price data as licensed for redistribution.
