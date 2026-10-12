// P0 / 2026-10-12: PHYSICAL destination D1 quota owner cap shared by
// historical import + daily Shadow. Source: merged AUDIT #1167 original provider
// Run38220900855 / Artifact11734734141, NOT a fabricated logical-row cost.
// This creates no new quota grant, merely clamps cost on a proven UTC-day.
export const OWNER_DAILY_DESTINATION_BILLED_WRITE_CEILING=80_000;
export function evaluateDestinationDay80SharedWritersV0_1({
 quotaDay,accountRowsWrittenLowerBound,shadowReservedBilledWrites=13_130,
 nowFloorProof,
}={}){
 if(typeof quotaDay!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(quotaDay))
  throw Error('DEST_DAY80_UTC_DAY_INVALID');
 if(!Number.isSafeInteger(shadowReservedBilledWrites)||shadowReservedBilledWrites<1)
  throw Error('DEST_DAY80_SHADOW_MEASURED_RESERVE_INVALID');
 if(!nowFloorProof||nowFloorProof.status!=='FIRST_SOURCE_TO_DEST_A1_PARTIAL_COPY_PHYSICALLY_ACCEPTED__FULL_MIGRATION_INCOMPLETE')
  throw Error('DEST_DAY80_PHYSICAL_AUDIT_ATTESTATION_MISSING');
 const original=nowFloorProof.originalDestinationWriter;
 if(original?.runId!==38220900855||
    original?.artifactId!==11734734141||
    original?.utcQuotaDay!=='2026-10-12'||
    original?.originalD1MeteredBilledRowsWritten!==71_226||
    original?.sameUtcDayAdditionalWriterAuthorized!==false)
  throw Error('DEST_DAY80_WRITER_COST_ATTESTATION_CONFLICT');
 const floor=quotaDay===original.utcQuotaDay?71_226:0;
 const observed=Number.isSafeInteger(accountRowsWrittenLowerBound)&&accountRowsWrittenLowerBound>=0?
  accountRowsWrittenLowerBound:null;
 const lowerBound=Math.max(floor,observed??0);
 const projected=lowerBound+shadowReservedBilledWrites;
 const blocks=projected>OWNER_DAILY_DESTINATION_BILLED_WRITE_CEILING||
    (quotaDay===original.utcQuotaDay&&original.sameUtcDayAdditionalWriterAuthorized!==true);
 return Object.freeze({
  quotaDay,accountRowsWrittenFloor:lowerBound,
  auditImportedRowsWrittenFloor:floor,previousImportedWriterRunId:floor?38220900855:null,
  quotaAnalyticsKnown:observed!==null,
  shadowReservedBilledWrites,projectedBilledRowsWritten:projected,
  ownerDailyOperationalMax:OWNER_DAILY_DESTINATION_BILLED_WRITE_CEILING,
  nextWriterPermittedByOperationalCap:!blocks,
  reason:blocks?'DEST_DAY80_IMPORTED_BUDGET_OR_OWNER_NO_SECOND_WRITER':
   'DEST_DAY80_CONDITIONAL_UNDER_CAP_NOT_QUOTA_GRANT',
  // Passing owner cap only is NOT physical authorization. Other checks still.
  physicalAllowedByThisChecker:false,
  cloudflareHardWriteMaxUnchanged:100_000,
 });
}
