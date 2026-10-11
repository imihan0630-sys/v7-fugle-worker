// Offline review of Cloudflare's complete, polled D1 SQL-export response.
// NEVER calls Cloudflare, downloads a signed URL, prints private URLs or grants authority.
const SHA=/^[a-f0-9]{64}$/i;
const utc=x=>typeof x==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(x)&&Number.isFinite(Date.parse(x));
const positive=x=>Number.isSafeInteger(x)&&x>0;
const finish=errors=>Object.freeze({
  schemaVersion:'S2_D1_EXPORT_DOWNLOAD_RECEIPT_V0_1',
  state:errors.length?'EVIDENCE_BLOCKED':'OFFLINE_DOWNLOAD_REVIEW_ONLY',
  blockers:Object.freeze([...new Set(errors)].sort()),
  exportedToCloudflareByThisCode:false,downloadedByThisCode:false,
  realSourceBackupAccepted:false,physicalHashIndependentlyAttested:false,
  permissionToExport:false,permissionToImport:false,permissionToCutover:false,
});
export function assessD1ExportDownloadReceiptV0_1({request,response,download}={}){
  const errors=[];
  // A provider export blocked the source D1. Only a completed, unfiltered
  // full-schema and full-data export can serve as its original logical backup.
  const allTables=request?.dumpOptions?.tables===undefined||
    (Array.isArray(request.dumpOptions.tables)&&request.dumpOptions.tables.length===0);
  if(request?.databaseName!=='system2-research'||
     request?.output_format!=='polling'||
     !allTables||
     request?.dumpOptions?.no_data===true||
     request?.dumpOptions?.no_schema===true||
     request?.scopeSourceSystem2D1Only!==true)
    errors.push('FULL_SOURCE_D1_SQL_EXPORT_REQUEST_UNVERIFIED');
  if(!(request?.originalAppliedSchemaPhysicalReadback===true&&
       request?.virtualTableInventoryPhysicalReadback===true&&
       request?.virtualTableCount===0))
    errors.push('PHYSICAL_SOURCE_VIRTUAL_TABLE_EXPORT_COMPATIBILITY_UNVERIFIED');
  if(response?.success!==true||response?.type!=='export'||
     response?.status!=='complete'||typeof response.at_bookmark!=='string'||
     response.at_bookmark.length<2||response.error)
    errors.push('D1_EXPORT_NOT_CONFIRMED_COMPLETE');
  const signed=response?.result?.signed_url;
  if(typeof response?.result?.filename!=='string'||
     !/^[a-zA-Z0-9_.-]+\.sql$/.test(response.result.filename)||
     typeof signed!=='string'||!/^https:\/\//i.test(signed)||
     !signed.includes('?'))
    errors.push('SIGNED_SOURCE_SQL_DOWNLOAD_METADATA_UNVERIFIED');
  if(!(utc(download?.exportCompletedAtUtc)&&utc(download?.downloadCompletedAtUtc)&&
       Date.parse(download.downloadCompletedAtUtc)>=Date.parse(download.exportCompletedAtUtc)&&
       Date.parse(download.downloadCompletedAtUtc)-Date.parse(download.exportCompletedAtUtc)<3600000))
    errors.push('SIGNED_URL_ONE_HOUR_DOWNLOAD_WINDOW_UNVERIFIED');
  if(!(download?.originalSqlBytesReceived===true&&
       download?.sourceSignedUrlKeptPrivate===true&&
       download?.privateUrlNotPersistedToArtifacts===true&&
       download?.rawSqlNotLogged===true&&
       download?.immutableOfflineCopyStored===true&&
       positive(download?.originalSqlByteLength)&&
       SHA.test(download?.originalSqlSha256||'')&&
       SHA.test(download?.storedSqlSha256||'')&&
       download.originalSqlSha256===download.storedSqlSha256))
    errors.push('ORIGINAL_DOWNLOADED_SQL_BYTES_AND_HASH_NOT_PRESERVED');
  if(download?.exact64BitNumbersLosslessOrAbsentVerified!==true)
    errors.push('SQL_INT64_JAVASCRIPT_PRECISION_RISK_UNREVIEWED');
  if(download?.independentOfflineRestoreSchemaAndRowsVerified!==true)
    errors.push('OFFLINE_RESTORE_SCHEMA_ROWS_NOT_VERIFIED');
  return finish(errors);
}
