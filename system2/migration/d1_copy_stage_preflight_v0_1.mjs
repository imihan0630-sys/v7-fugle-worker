// Class A offline-only, fail-closed review of cross-account System2 D1 copy.
// NO Cloudflare API, wrangler, database IO, secret, billing or cutover authority.
const SHA = /^[a-f0-9]{64}$/i;
const ID = /^[a-f0-9]{32}$/i;
const DATABASE = 'system2-research';
const FREE_DB_BYTES = 500_000_000;
const FRESH_MS = 600000;
const validTime = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(x) && Number.isFinite(Date.parse(x));
const nni = x => Number.isSafeInteger(x) && x >= 0;
const pos = x => Number.isSafeInteger(x) && x > 0;
const isoDay = x => validTime(x) ? x.slice(0, 10) : null;
const finish = (stage, reasons) => Object.freeze({
  schemaVersion: 'S2_D1_COPY_STAGE_PREFLIGHT_V0_1', stage,
  state: reasons.length ? 'BLOCKED' : 'OFFLINE_REVIEW_ONLY',
  blockers: Object.freeze([...new Set(reasons)].sort()),
  cloudApiExecuted: false, sourceExportExecuted: false, destinationImportExecuted: false,
  physicalAuditPassedByThisCode: false, permissionToExport: false,
  permissionToImport: false, permissionToCutover: false,
  sourceSystem1ProductionModified: false,
});
function ownerOk(a) {
  return a?.issue === 1128 && a?.scope === 'SOURCE_TO_DESTINATION_SYSTEM2_D1_COPY_ONLY' &&
    a.ownerExplicitApproval === true && a.preserveSource === true &&
    a.noSystem1Modification === true && a.noBillingOrR2 === true && a.noCutover === true;
}
function accountsOk(source, destination) {
  return ID.test(source?.accountId || '') && ID.test(destination?.accountId || '') &&
    source.accountId.toLowerCase() !== destination.accountId.toLowerCase() &&
    source.databaseName === DATABASE && destination.databaseName === DATABASE &&
    source?.authenticatedProviderReadback === true && destination?.authenticatedProviderReadback === true;
}
function quotaOk(q, evaluatedAtUtc, stage) {
  if (!validTime(evaluatedAtUtc) || !validTime(q?.observedAtUtc)) return false;
  const age = Date.parse(evaluatedAtUtc) - Date.parse(q.observedAtUtc);
  if (age < 0 || age > FRESH_MS || isoDay(q.observedAtUtc) !== isoDay(evaluatedAtUtc) ||
      q.quotaDayUtc !== isoDay(evaluatedAtUtc)) return false;
  if (q?.providerAccountWideUsageVerified !== true || q?.analyticsLagBounded !== true ||
      q?.noCompetingWriterVerified !== true || q?.quotaLedgerIntact !== true ||
      !nni(q.accountRowsRead) || !nni(q.accountRowsWritten) ||
      !nni(q.operationMaxRowsRead) || !nni(q.operationMaxRowsWritten) ||
      !pos(q.accountReadLimit) || !pos(q.accountWriteLimit) ||
      q.reservationVerdict !== 'QUOTA_RESERVATION_GRANTED') return false;
  // Independent accounts MUST NOT share reserve scope: SOURCE protects System1;
  // DESTINATION protects its own P0 System2 operations (no System1 reserve there).
  const source = stage === 'PRE_EXPORT';
  if (source ? !(q.system1ReadReserveAuthorized === true && q.system1WriteReserveAuthorized === true &&
      pos(q.system1ReadReserveRows) && pos(q.system1WriteReserveRows)) :
      !(q.destinationAccountIsolated === true && q.system2P0ReserveVerified === true &&
      pos(q.system2P0ReadReserveRows) && pos(q.system2P0WriteReserveRows))) return false;
  const readReserve = source ? q.system1ReadReserveRows : q.system2P0ReadReserveRows;
  const writeReserve = source ? q.system1WriteReserveRows : q.system2P0WriteReserveRows;
  // BigInt avoids rounding when quotas/usage are near JS safe-int limit.
  const readNeeded = BigInt(q.accountRowsRead) + BigInt(readReserve) + BigInt(q.operationMaxRowsRead);
  const writeNeeded = BigInt(q.accountRowsWritten) + BigInt(writeReserve) + BigInt(q.operationMaxRowsWritten);
  if (readNeeded > BigInt(q.accountReadLimit) || writeNeeded > BigInt(q.accountWriteLimit)) return false;
  if (stage === 'PRE_EXPORT' && q.operationMaxRowsWritten !== 0) return false;
  if (stage === 'PRE_IMPORT' && q.operationMaxRowsWritten === 0) return false;
  return true;
}
function preExportReasons(args) {
  const r=[];
  if (!ownerOk(args?.owner)) r.push('OWNER_D1_ONLY_SCOPE_UNVERIFIED');
  if (!accountsOk(args?.source, args?.destination)) r.push('DISTINCT_AUTHENTICATED_ACCOUNT_AND_D1_IDENTITY_UNVERIFIED');
  if (!quotaOk(args?.sourceQuota, args?.evaluatedAtUtc, 'PRE_EXPORT')) r.push('SOURCE_SAME_UTC_DAY_PROTECTED_QUOTA_GRANT_MISSING');
  const s=args?.sourceOperations;
  if (!(s?.sourceSystem2WriterQuiesced === true && s?.noInflightSourceD1Query === true &&
      s?.sourceCronReviewed === true && s?.exportWindowSafe === true &&
      s?.continuousExportPollingPlanned === true && s?.sourceIsolatedFromSystem1FormalCore === true))
    r.push('SOURCE_EXPORT_AVAILABILITY_AND_WRITER_QUIESCENCE_UNVERIFIED');
  if (!validTime(args?.evaluatedAtUtc)) r.push('EVALUATION_UTC_TIMESTAMP_INVALID');
  return r;
}
export function assessSystem2D1CopyPreExportV0_1(args={}) {
  return finish('PRE_EXPORT',preExportReasons(args));
}
function tableMap(receipt, r) {
  const out=new Map();
  if (!Array.isArray(receipt?.tables) || receipt.tables.length===0) {r.push('SOURCE_REAL_TABLES_MISSING');return out;}
  for(const t of receipt.tables) {
    if (typeof t?.name !== 'string' || !/^s2_[a-z0-9_]+$/.test(t.name) ||
        out.has(t.name) || !nni(t.rows) || !SHA.test(t.sha256||'') ||
        !SHA.test(t.schemaSha256||'')) {r.push('SOURCE_TABLE_INTEGRITY_INVALID');continue;}
    out.set(t.name,t);
  }
  return out;
}
export function assessSystem2D1CopyPreImportV0_1(args={}) {
  // Import uses an independently accepted immutable OFFLINE source export. It
  // never queries the old source D1, so its live UTC-day SOURCE quota and old
  // source-Worker quiescence must NOT block a later destination-only import.
  // Instead require original backup/PIT/Frozen approval and TARGET account P0 budget.
  const r=[];
  if (!ownerOk(args?.owner)) r.push('OWNER_D1_ONLY_SCOPE_UNVERIFIED');
  if (!accountsOk(args?.source,args?.destination)) r.push('DISTINCT_AUTHENTICATED_ACCOUNT_AND_D1_IDENTITY_UNVERIFIED');
  if (!validTime(args?.evaluatedAtUtc)) r.push('EVALUATION_UTC_TIMESTAMP_INVALID');
  const b=args.backup, t=args.target, src=args.sourceReceipt;
  if (!(b?.physicalExportReadback===true && b?.exportJobCompleted===true &&
        b?.immutableOriginalBytesPreserved===true && b?.offlineRestoreVerified===true &&
        b?.sourcePITVerified===true && b?.sourceFrozenChainVerified===true &&
        b?.cloudflareFullExportReceiptReviewed===true &&
        b?.signedUrlPrivateDownloadedWithinOneHour===true &&
        b?.sourceVirtualTableExportCompatibilityVerified===true &&
        b?.exactInt64ValuePreservationVerified===true &&
        b?.independentSourceAuditAccepted===true &&
        pos(b.runId) && pos(b.jobId) && pos(b.artifactId) &&
        SHA.test(b.artifactSha256||'') && SHA.test(b.originalExportSha256||'') &&
        b.originalExportSha256===b.restoredExportSha256))
    r.push('ORIGINAL_RESTORABLE_SOURCE_BACKUP_PIT_FROZEN_AUDIT_MISSING');
  const tables=tableMap(src,r);
  if (!(src?.physicalSourceReadback===true && SHA.test(src.schemaSha256||'') &&
        SHA.test(src.frozenSnapshotSha256||'') &&
        pos(src.runId) && pos(src.artifactId) &&
        tables.has('s2_decisions') && src.frozenDecisionRowCount===tables.get('s2_decisions')?.rows))
    r.push('SOURCE_PHYSICAL_SCHEMA_AND_FROZEN_ROWSET_UNVERIFIED');
  if (!(t?.physicalSchemaReadback===true && t?.destinationD1Exists===true &&
        t?.postSchemaCopyMode===true && t?.schemaApplyOnceWillNotRun===true &&
        t?.targetHistoricalRows===0 && t?.activeDestinationCronCount===0 &&
        t?.activeDestinationWorkerCount===0 && t?.activeDestinationPushCount===0 &&
        t?.noProductionRoute===true && t?.noV7Binding===true &&
        t?.noOverwriteExistingRecords===true && SHA.test(t?.schemaSha256||'') &&
        t?.schemaSha256===src?.schemaSha256 &&
        Array.isArray(t?.tables) && t.tables.length===tables.size &&
        t.tables.every(name=>tables.has(name)) && new Set(t.tables).size===t.tables.length))
    r.push('EXISTING_DESTINATION_SCHEMA_SAFE_DATA_ONLY_IMPORT_NOT_VERIFIED');
  if (!(nni(t?.currentSizeBytes) && nni(t?.verifiedProjectedSizeBytes) &&
        t.verifiedProjectedSizeBytes>=t.currentSizeBytes &&
        t.verifiedProjectedSizeBytes<FREE_DB_BYTES && t?.freeSizeModelIndependentlyReviewed===true))
    r.push('DESTINATION_SINGLE_D1_FREE_500MB_CAPACITY_UNVERIFIED');
  if (!quotaOk(args?.destinationQuota,args?.evaluatedAtUtc,'PRE_IMPORT'))
    r.push('DESTINATION_ACCOUNT_WRITE_READ_BUDGET_UNVERIFIED');
  if (!(args?.destinationImportPlan?.tableOnlyDataWithoutDDL===true &&
        args.destinationImportPlan.rawSqlReviewedForTransactionsAndTriggers===true &&
        args.destinationImportPlan.writeAmplificationMeasured===true &&
        args.destinationImportPlan.batchesAreRestartSafe===true &&
        args.destinationImportPlan.noDoubleWriter===true &&
        args.destinationImportPlan.independentAuditApprovedStage===true &&
        args.destinationImportPlan.r2HistoryExcludedFromD1OnlyAcceptance===true))
    r.push('DESTINATION_DATA_ONLY_IMPORT_NO_DOUBLE_WRITER_PLAN_UNVERIFIED');
  return finish('PRE_IMPORT',r);
}
