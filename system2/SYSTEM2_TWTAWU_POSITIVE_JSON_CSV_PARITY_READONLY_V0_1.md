# System 2 TWSE TWTAWU Positive JSON / Candidate CSV Parity Readonly V0.1

Status: DATA_LANE source-characterization probe; **not negative completeness**.
Scope: Class A, isolated read-only official TWSE public responses.

## Why this is needed

The frozen NC-T01 negative-suspension contract requires a real positive
control before any missing/empty TWTAWU rows may be interpreted as
NO_SUSPENSION_IN_COMPLETE_BOUNDED_WINDOW. Existing physical evidence already
identified 1218/TWSE suspension 2026-08-13 and resumption 2026-08-14.
The existing JSON source provides this real event but does not establish an
authoritative row-total or exact requested-range completeness guarantee.

## Strict experimental design

1. Freeze known-positive interval 2026-08-13 through 2026-08-14, all listed
   securities (`querytype=3`), and known 1218 event identity before querying.
2. Fetch the existing official TWTAWU `response=json` endpoint with GET.
3. Separately try `response=csv` on the same path and same parameters. The
   latter is **a discovery candidate**, NOT yet an independently certified
   official export URL. The site visibly exposes CSV download, but does not
   by itself prove this machine contract. A failed candidate remains blocked.
4. Hash both raw response bodies, check HTTP and source-specific format,
   strictly normalize symbol/suspension/resumption rows, reject duplicates
   and compare the full sets. Both must include the already-verified 1218 row.
5. Save an immutable GitHub Actions artifact with source hash, actual
   observation time, response status, count, and exact failure classification.
6. No Cloudflare D1/R2, no secrets, no Worker operations, and no System1 code.

## Critical non-promotion boundary

A matching JSON/CSV result is only
`MATCHED_POSITIVE_PARITY_DIAGNOSTIC_ONLY`. Two URLs may share an
incomplete backend, pagination or an undocumented export convention.
Therefore every result retains:

- exactRangeCompletenessProven=false;
- sameScopeOfficialExportContractProven=false;
- absenceCertifiesNoSuspension=false;
- noEventMayBeClaimed=false;
- technicalContinuityCertified=false;
- ncT01PromotionAuthorized=false;
- historicalPITPublicationProven=false.

Independent endpoint provenance, actual range/scope binding, exhaustive row
count or no-truncation evidence, repeat positive controls, revision coverage
and true PIT source-vintage evidence are still required before any bounded
negative suspension claim. The current probe cannot be used to backdate
2026-August knowledge from its October retrospective observation.

## Acceptance and next

The new physical GitHub workflow runs once after merge on `main`. Offline
tests deliberately include malformed JSON/CSV, swapped symbol identity,
missing known positive, HTTP failures and malformed dates. A blocked
physical probe is a legitimate source-contract result, not evidence that
there were zero halts in the selected window. Preserve its artifact.

Do not modify the owner-approved selection/pool clock, NC-T01 promotion
firewall, price adjustment, strategy weights, V8 Formal Core, push, capital
or orders.
