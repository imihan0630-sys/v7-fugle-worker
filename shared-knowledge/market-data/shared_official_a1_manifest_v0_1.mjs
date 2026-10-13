// Cross-system market-data artifact contract. This is an immutable source
// observation manifest, never a System1 Formal Core or System2 trade signal.
import {createHash} from 'node:crypto';
const SHA=/^[a-f0-9]{64}$/i;
const DATE=/^\d{4}-\d\d-\d\d$/;
const ISO=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
export function buildSharedOfficialA1MarketManifestV0_1({
 sourceReceipt,storageClass='GITHUB_ACTIONS_EPHEMERAL_90D',
 issuedAtUtc,runId=null,commitSha=null,
}={}){
 if(!ISO.test(issuedAtUtc||'')||!Number.isFinite(Date.parse(issuedAtUtc)))
  throw Error('SHARED_OFFICIAL_MANIFEST_ISSUED_AT_INVALID');
 if(sourceReceipt?.schemaVersion!=='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'||
    !DATE.test(sourceReceipt.marketDate||'')||
    !SHA.test(sourceReceipt.receiptHash||'')||
    !Array.isArray(sourceReceipt.receipts)||
    !Array.isArray(sourceReceipt.calendar?.tradingDates)||
    sourceReceipt.calendar.tradingDates.length!==61)
  throw Error('SHARED_OFFICIAL_MANIFEST_SOURCE_SCHEMA_NOT_VERIFIED');
 if(storageClass!=='GITHUB_ACTIONS_EPHEMERAL_90D'&&
    storageClass!=='GITHUB_VERSIONED_IMMUTABLE_BY_CONTENT_HASH_VERIFIED')
  throw Error('SHARED_OFFICIAL_MANIFEST_STORAGE_CLASS_INVALID');
 if(storageClass==='GITHUB_VERSIONED_IMMUTABLE_BY_CONTENT_HASH_VERIFIED')
  throw Error('SHARED_OFFICIAL_MANIFEST_DURABLE_STORAGE_NOT_YET_AUDITED');
 const keys=new Set(),sources=[];
 for(const s of sourceReceipt.receipts){
  if(!['TWSE','TPEX'].includes(s.market)||!DATE.test(s.marketDate||'')||
     !SHA.test(s.originalRawResponseSha256||'')||
     !ISO.test(s.capturedAt||'')||
     !Number.isFinite(Date.parse(s.capturedAt))||
     Date.parse(s.capturedAt)>Date.parse(issuedAtUtc)||
     !Number.isSafeInteger(s.originalRawResponseBytes)||s.originalRawResponseBytes<=0)
    throw Error('SHARED_OFFICIAL_MANIFEST_SOURCE_EVIDENCE_INVALID');
  const key=s.market+'|'+s.marketDate;
  if(keys.has(key))throw Error('SHARED_OFFICIAL_MANIFEST_DUPLICATE_SOURCE');
  keys.add(key);
  sources.push({
   market:s.market,marketDate:s.marketDate,
   sourceId:s.sourceId,sourceUrl:s.sourceUrl,
   originalSha256:s.originalRawResponseSha256,
   originalBytes:s.originalRawResponseBytes,
   firstCapturedAtUtc:s.capturedAt,
   reusedOriginalEvidence:s.reusedOriginalEvidence===true,
   originalRelativePath:'original-json/'+s.market+'-'+s.marketDate+'.json.gz',
   firstKnownAtPublicationCertified:false,
   pointInTimeReplayPromoted:false
  });
 }
 sources.sort((a,b)=>a.marketDate.localeCompare(b.marketDate)||a.market.localeCompare(b.market));
 const received=sources.length,expected=122;
 if(received>expected||sourceReceipt.receivedMarketDateCount!==received||
    sourceReceipt.plannedMarketDateRequests!==expected)
  throw Error('SHARED_OFFICIAL_MANIFEST_DENOMINATOR_CONFLICT');
 const complete=received===expected&&sourceReceipt.state==='SOURCE_OBSERVED_UNAUDITED';
 const base={
  schemaVersion:'SHARED_OFFICIAL_A1_MARKET_DATA_V0_1',
  purpose:'INDEPENDENT_MARKET_EVIDENCE_ONLY',
  publishedForSystems:['SYSTEM1_READ_ONLY_OPT_IN','SYSTEM2_READ_ONLY_OPT_IN'],
  owner:'SHARED_KNOWLEDGE',
  effectiveTradingDay:sourceReceipt.marketDate,
  tradingDates:sourceReceipt.calendar.tradingDates,
  issuedAtUtc,sourceRunId:runId,sourceCommitSha:commitSha,
  storageClass,immutableStorageIndependentAudited:false,
  originalOfficialProvenanceHash:sourceReceipt.receiptHash,
  sourceUrlAndOriginalBodyHashPinned:true,
  sourceMarketDatePairsExpected:expected,
  sourceMarketDatePairsValidated:received,
  sourceCoverage:complete?'COMPLETE_SOURCE_CAPTURE_PIT_UNAUDITED':'INCOMPLETE_SOURCE_CAPTURE',
  unverifiedHistoricalPublicationTiming:true,
  independentlyApprovedStrategyPIT:false,
  sourceRowsEligibleAsSystem1FormalInputs:false,
  sourceRowsEligibleAsSystem2FrozenSelection:false,
  availabilityNotBackdated:true,
  zeroPickDay:null,selectedCount:null,
  sourceBlobs:sources
 };
 return Object.freeze({...base,manifestSha256:digest(base)});
}
export function assertSharedOfficialA1ConsumerBoundaryV0_1(manifest,{system,purpose}={}){
 if(!['SYSTEM1','SYSTEM2'].includes(system))
  throw Error('SHARED_OFFICIAL_A1_CONSUMER_UNREGISTERED');
 if(purpose!=='READ_ONLY_SOURCE_RESEARCH')
  throw Error('SHARED_OFFICIAL_A1_TRADING_DECISION_NOT_AUTHORIZED');
 if(manifest?.schemaVersion!=='SHARED_OFFICIAL_A1_MARKET_DATA_V0_1'||
    manifest?.purpose!=='INDEPENDENT_MARKET_EVIDENCE_ONLY'||
    !SHA.test(manifest.manifestSha256||''))
  throw Error('SHARED_OFFICIAL_A1_MANIFEST_INTEGRITY_UNVERIFIED');
 const {manifestSha256,...payload}=manifest;
 if(digest(payload)!==manifestSha256)
  throw Error('SHARED_OFFICIAL_A1_MANIFEST_HASH_MISMATCH');
 return Object.freeze({
  system,readOnly:true,mutableD1AccessGranted:false,
  tradingRulesOrFrozenChanged:false,
  sourceMarketDatePairsValidated:manifest.sourceMarketDatePairsValidated,
  sourceCompleteness:manifest.sourceCoverage,
  pointInTimeStrategyUseAuthorized:false
 });
}
