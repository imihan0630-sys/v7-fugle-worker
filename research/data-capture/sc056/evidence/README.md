# SC-056 first execution evidence

Append-only source evidence, frozen 2026-10-04 Asia/Taipei. No source publication
timestamp or original historical PIT clock is inferred from these receipts.

- `local-20261004/`: PASS, two fresh Chromium contexts against the public MOEA
  product page using committed collector 8024f60d. All six January 2025 quantities
  match SC-055; semantic and raw-result hashes match; all manifests read back.
- `ci-37199450918-1/`: FAIL, first GitHub manual run, source navigation blocked.
- `ci-37199605968-1/`: FAIL, diagnostic manual run, MOEA Cloudflare HTTP 403,
  `Attention Required!` / `Sorry, you have been blocked`, no query/capture.

The two CI ZIPs were downloaded via the GitHub connector and independently
SHA-256 checked against the Actions artifact API before extracting their JSON.
`github-artifact.json` records the run/attempt/artifact/code/digest provenance.
These are failure evidence, never successful CI captures. No CI acceptance claim.

The public data's six baseline fields are (production / inventory):

| Product | Unit | 2025-01 production | 2025-01 inventory |
| --- | --- | ---: | ---: |
| 2433-020 銅箔 | 公噸 | 6,843 | 6,028 |
| 2630-010 銅箔基板 | 平方呎 | 26,780,035 | 26,171,314 |
| 2630-040 印刷電路板(不含IC載板) | 平方呎 | 26,489,128 | 21,208,038 |

This engineering evidence leaves D10-02 at L2 / 40%. Frozen 1M/2M/3M research
lags and production-direction semantics remain unchanged; no outcomes opened.
