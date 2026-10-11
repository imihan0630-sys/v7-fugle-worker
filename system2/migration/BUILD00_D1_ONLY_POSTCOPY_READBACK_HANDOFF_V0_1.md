# System 2 G4 — BUILD 00 D1-only post-copy parity handoff

Status: **OFFLINE CHECKER IMPLEMENTED / PHYSICAL SOURCE-TO-DESTINATION COPY NOT ATTESTED BY THIS PR**  
Owner: BUILD 00 (integration helper). DATA_LANE (#1068) owns source export/physical import; CROSS_ACCOUNT_LANE (#1130) owns account/Worker/Cron metadata; AUDIT_LANE (#1127) independently accepts originals. This checklist does not modify any system.

## When to use

Only **AFTER** DATA_LANE has independently captured a SOURCE immutable original SQL export, imported/cross-checked the destination's *same D1-only scope*, and both physical manifests have original GitHub Run+Artifact IDs and **independently downloaded/raw-file SHA-256 readbacks**.

```bash
node system2/migration/run_build00_d1_only_postcopy_readback_v0_1.mjs source-physical-d1.json destination-physical-d1.json
```

Command performs only local JSON reads, with bounded size. **No Cloudflare API, SQL, secrets, live Worker or Cron.** JSON filenames should stay in private review storage; do not commit raw export content, accounts or secrets to GitHub.

## Receipt contract for the two inputs

Both objects must explicitly represent the physical `system2-research` D1 (databaseName), include `physicalReadback=true`, `runId`, `artifactId`, `originalArtifactSha256` (independently verified original ZIP hash), `originalArtifactDownloadedAndShaVerified=true`, `observedAtUtc`, `schemaSha256`, `frozenSnapshotSha256`, `accountFingerprint`, `databaseFingerprint`, `frozenDecisionRowCount`, `frozenSnapshotPhysicalReadback=true`, and per-table `tables[]` with `name`, `rows`, `sha256`, `schemaSha256`. Physical `s2_schema_meta`, `s2_decisions`, `s2_historical_a1_bars` are mandatory. Each must include `pit:{physicalLineageReadback:true,lineageSha256:<hex64>,firstKnownAtAvailableAtVerified:true}` with original evidence.

Source:
- `verifiedFrom="SOURCE_D1_PHYSICAL_READ_ONLY_EXPORT"`
- `exportSha256` must be SHA of original canonical **source SQL dump**.

Destination:
- `verifiedFrom="DESTINATION_D1_PHYSICAL_READBACK"`
- `importSourceExportSha256` must identify the source SQL dump from which destination import was performed (should match source's `exportSha256`). **Do not** put the SHA of a separately generated destination SQL export here: serializations may differ even when rows are identical.
- Physical destination tables must be enumerated/read back independently; never populate target table SHA by copying the source manifest.
- Distinct hashed account and D1 identities must be captured using authorized provider metadata; no raw account IDs in output. Hashing identifiers does not itself prove ownership.

The original DATA_LANE `S2_CROSS_ACCOUNT_SOURCE_D1_EXPORT_V0_1` manifest uses some different key names (e.g., `observedAt`, `artifactSha256`). **The conversion must be backed by the independently checked originals; never fill missing fields with defaults or fixture values.** If any field is not evidenced, omit it and preserve `BLOCKED`.

## Output interpretation

- `BLOCKED`: at least one mismatch, invalid source/target identity, missing PIT/frozen evidence, unknown original artifact or incomplete physical table coverage.
- `D1_PARITY_MATCHED_PENDING_INDEPENDENT_AUDIT`: physical-receipt *claims* are internally consistent. This code does not independently authenticate them; original SHA/provider artifacts need AUDIT_LANE.
- All results remain **D1-only**. Destination R2 `NOT_ENTITLED`, source R2 history, Worker/Cron and System1 quota are **independent, still-open** gates. Even `D1_PARITY_MATCHED...` never authorizes next billing, live Cron, deployment, source retirement, trade or cutover.
- Do not interpret a synthetic test fixture's match as a physical export/import. The tests are specifically to prevent accidental promotion of evidence.

## Source data safety

No modification to System1 Formal Core, production bindings, 15-minute formal signal, `Worker.js`, root `wrangler.toml`, live Worker/Cron, D1 rows or Cloudflare accounts. This PR must not be merged as proof that migration completed; it is a reusable independent review tool only.
