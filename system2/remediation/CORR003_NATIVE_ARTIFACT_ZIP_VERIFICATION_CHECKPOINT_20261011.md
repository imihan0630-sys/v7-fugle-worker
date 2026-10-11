# CORR-003 original System 1 Artifact ZIP byte verification — 2026-10-11
Owner: REMEDIATION_LANE. Class A read-only evidence.

## New material evidence
Eight native GitHub Actions ZIP archives already indexed by System1 PR #1121 and one additional PVE-262 artifact (11495881660) were retrieved through the authenticated GitHub Actions artifact download connector. Independently recomputed ZIP SHA256 on the actual received bytes and compared to GitHub's native artifact digest: **9/9 matched**. ZIP integrity tested **9/9**, and **11 extracted JSON files** parsed and SHA256 hashed. Each artifact Run/Job/Artifact identity checked by live GitHub API. Native job-list view supplies `run_id`, not its own head_sha, so Run and Artifact head Sha were checked separately and Job was linked by ID/run_id.

Exact immutable evidence: `system2/evidence/S2_CORR003_NATIVE_ARTIFACT_ZIP_BYTE_VERIFICATION_20261011_V0_1.json`. ZIP bytes and private original logs were NOT committed or published; audit can retrieve the originals from GitHub by IDs.

## Meaning
- PVE-262 genuine D1 Cron audit window empty does not prove Cron not invoked: PVE-263 original KV shows 10/07 FAILED daily row-write quota attempt and 23:55 lease with null snapshot.
- PVE-264 genuine 2026-10-07 account observed 126,498 written / 4,374,959 read (V7_DB and SYSTEM2_DB same-account collision). PVE-271/272 old Cron SUCCESS only Sept 21/22; day-level read/write sums 2,825/133,037 and 1,635/19,533 are NOT per-operation costs or authorized reserves.
- Actual 2026-10-08 and holiday 2026-10-09 C1 archives confirm missing parent generation, neither healthy business persistence nor zero-pick. Public live GET old 2026-09-29 storage does not prove absence of an unseen invocation.
- Producer PR #1121 now includes a 12-row append-only Taiwan UTC time correction at head `51457b2d2af9a5015f608c99e3f2b4bd49c581d7` and main-equivalent source-level CI; still OPEN. The sibling Remediation PR #1122 remains OPEN and owns `system2/SYSTEM2_REMEDIATION_CHECKPOINT.md` conflict unit, so this checkpoint intentionally does not mutate it.

## Physical acceptance unchanged
P01 3/7; P02 3/7; P03 3/8; P04 2/7; P05 4/9 = **15/38 supporting checks**; AUDIT physically accepted 0/5, CORR-003 **HIGH/VERIFYING**, System1 D1 read and write reserves both false/null. New ZIP byte-replay closes a **provenance access gap** only, not the natural 10/12 primary/recovery per-operation accounting, six-role KV/D1 business same-generation readback, P03 grant/result, Source D1 PIT/Frozen, or P05 Hot D1 read.

## Next
AUDIT_LANE independently re-downloads 9 ZIPs (IDs in evidence) and checks each ZIP and inner JSON SHA256; System1 #1024 supplies natural 10/12 real per-run business and reserve attribution; DATA_LANE #1026/#1068 preserves read/write fail-closed until genuine separate physical authorization. Do not merge #1121/#1122 without owner migration coordination; do not run a Cloudflare D1/R2/Worker/Cron/Shadow/paid action.