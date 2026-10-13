# System2 Shared Official A1 Private Archive V0.1

Status: `IMPLEMENTED_NOT_PHYSICALLY_PUBLISHED`

## Owner authorization and destination

On 2026-10-13 Asia/Taipei the Owner explicitly approved creating a free,
dedicated private GitHub repository and granting the minimum writer capability
needed for the long-term Shared Official A1 archive.

- Source repository: `imihan0630-sys/v7-fugle-worker`.
- Approved target: private repository
  `imihan0630-sys/v7-system2-official-a1-archive`.
- Writer: a write-enabled deploy key installed only on the target repository;
  deploy-key id `166273500`.
- Source-side secret: `S2_A1_ARCHIVE_DEPLOY_KEY`.
- Source workflow token remains `contents: read` and `actions: read`; it has no
  source-repository contents-write permission.
- Paid storage, public raw publication, R2, D1 and Cloudflare permissions remain
  unapproved and unused by this archive lane.

The deploy key is a repository-scoped GitHub credential, not a branch/path-level
ACL. Path restriction is therefore enforced by the publisher, workflow staging
allow-list and tests. Any later credential expansion needs a new Owner decision.

## Data-rights and attribution boundary

The archived content is matched to the official open-data datasets:

- TWSE `盤後資訊 > 個股日成交資訊`:
  <https://data.gov.tw/dataset/11549>
- TPEx `上櫃股票行情`:
  <https://data.gov.tw/dataset/11370>
- Government Open Data License, version 1:
  <https://data.gov.tw/license>

The open-data license permits use, reproduction and redistribution with source
attribution. The private archive writes `SOURCE_NOTICE.md` beside every archive
history. Endpoint availability and rate limits are still bounded operational
inputs; the license does not authorize bypassing provider controls or publishing
raw evidence into the public V8 repository.

## Create-only storage contract

For every independently verified source artifact the publisher re-decompresses,
re-parses and re-hashes every original gzip body before preparing:

- `raw/{market}/{year}/{date}--{rawSha256}.json.gz`;
- `manifests/{date}/{manifestSha256}.json`;
- `source-receipts/{date}/{sourceReceiptHash}.json`;
- `archive-receipts/{date}/{archiveReceiptHash}.json`;
- one immutable-content attribution file `SOURCE_NOTICE.md`.

Existing identical bytes are independently compared and reused. A same-path
different-byte observation fails closed; the publisher never overwrites it. The
receipt hash excludes operation-time counters, so replay of identical source
evidence produces the same archive identity.

This is application-level append-only, content-addressed Git history. GitHub does
not provide provider-level immutability for ordinary repository commits, so
`providerLevelImmutability=false` remains explicit. Branch protection or an
external independent mirror may be proposed later but is not implied here.

## Workflow and acceptance state

`.github/workflows/system2-shared-official-a1-private-archive.yml` can consume a
successful exact source run automatically, or a manually supplied successful
source run id. It downloads only the named source artifact, runs the archive
tests, uses the target-only deploy key, stages only the five approved archive
paths and removes the private key at the end.

Repository-local verification is **26/26 PASS** across the private publisher,
original-source archive dry-run, incremental source-cache and Stage1 admission
suites.

No real raw file has yet been committed by this workflow. Therefore:

- private destination created: **1/1**;
- target-only writer installed and source secret read back: **1/1**;
- publisher/workflow implemented and locally tested: **1/1**;
- physical archive publication/readback: **0/1**;
- provider-level immutable storage: **0/1**, not claimed;
- System2 Shadow S0-S5: **0/6**, unchanged.

The first physical publication requires this workflow to exist on `main`, then a
successful run against exact source Run `38351651871` or a newer valid source
artifact. That publication must preserve the current `121/122` incomplete state;
durable storage does not turn incomplete data into a 122/122 admission pass.

## Explicit non-authorities

This archive does not rank or select stocks, certify a zero-pick day, write a
Frozen decision, grant PIT/corporate-action continuity, access System1 Formal
Core/runtime, modify `Worker.js` or `wrangler.toml`, use D1/R2, send a push, place
an order or authorize a paid plan.
