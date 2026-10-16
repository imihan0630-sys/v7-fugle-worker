// BUILD_LANE, P0 PIT-A: consume an ACTUAL, immutable DATA_LANE A1 source-only
// 2330 61-session original readback.  This consumer refuses any promotion of
// original source coverage to issuer CFI/CA/PIT-A/selection/Frozen authority.
// Historical PIT-B receipts may not substitute for prospective PIT-A source.
import {sha256Hex} from './decision_archive.mjs';

const SHA=/^[a-f0-9]{64}$/,UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const requireIt=(ok,code)=>{if(!ok)throw Error('S2_BUILD_PITA_2330_A1_'+code);};
const asUtc=v=>typeof v==='string'&&UTC.test(v)&&Number.isFinite(Date.parse(v))
 &&new Date(Date.parse(v)).toISOString().slice(0,19)===v.slice(0,19);
const byCut=(v,cut)=>asUtc(v)&&Date.parse(v)<Date.parse(cut);

// Each digest, ID and run is grounded in independently obtained DATA original
// evidence and exact-head GitHub source-native readback, NOT in synthetic
// consumer assertions. A new date MUST use a new audited anchor/version.
export const ACTUAL_A1_2330_ANCHOR_V0_1=Object.freeze({
 marketDate:'2026-10-16',symbol:'2330',market:'TWSE',
 targetResearchCutUtc:'2026-10-16T15:45:00.000Z',
 dataReadbackRunId:38909454291,dataReadbackArtifactId:12049697019,
 dataReadbackReceiptHash:'27142487061ed2caad4a533298909daccbbe18d856e2863faa8e82c6a866af52',
 oldSourceRunId:38797319008,oldSourceArtifactId:12002806667,
 oldOriginalArtifactZipSha256:'d4d4d4bf0e67e488bb474d08c5da53b777e65bca1edd9d361e59214e402e80bc',
 oldIndependentSourceAuditRunId:38797548446,
 oldIndependentSourceAuditArtifactId:12002641996,
 oldIndependentSourceAuditSha256:'cebec987e32f863e42f9d95ffb881979164ed63be6716dc1e40bf2f8cf3f5808',
 newSourceRunId:38908458028,newSourceArtifactId:12049690326,
 newOriginalArtifactZipSha256:'2d40ddf4379318900f1776eaf93b23c5db4e942eebad62a76e7c7023ba2d5e17',
 newCurrentSourceReceiptHash:'074c5e83afde3e4dd7dfb7295eb7483215848a84edb5b78493fd673592d9f18a',
});
export async function consumeRealPita2330Source61V0_1({dataReadback=null}={}){
 const d=dataReadback,a=ACTUAL_A1_2330_ANCHOR_V0_1;
 requireIt(d&&typeof d==='object'&&!Array.isArray(d),'PHYSICAL_DATA_RECEIPT_REQUIRED');
 const {receiptHash,...signed}=d;
 requireIt(SHA.test(receiptHash||'')&&receiptHash===a.dataReadbackReceiptHash
  &&await sha256Hex(signed)===receiptHash,'ORIGINAL_SIGNED_READBACK_OR_PIN_INVALID');
 requireIt(d.schemaVersion==='S2_DATA_PITA_2330_61_NATIVE_SOURCE_READBACK_V0_1'
  &&d.status==='61_OF_61_2330_NATIVE_A1_BAR_SOURCES_REHASHED__CFI_CA_PIT_UNKNOWN'
  &&d.marketDate===a.marketDate&&d.stock===a.symbol&&d.market===a.market
  &&d.windowStartDate==='2026-07-21'&&d.windowLastDate===a.marketDate
  &&d.targetResearchCutUtc===a.targetResearchCutUtc
  &&byCut(d.actualVerificationAtUtc,a.targetResearchCutUtc)
  &&byCut(d.actualNewSourceCapturedAtUtc,a.targetResearchCutUtc)
  &&d.originalSourceOldRunId===a.oldSourceRunId
  &&d.originalSourceOldArtifactId===a.oldSourceArtifactId
  &&d.oldOriginalArtifactZipSha256===a.oldOriginalArtifactZipSha256
  &&d.oldIndependentSourceAuditRunId===a.oldIndependentSourceAuditRunId
  &&d.oldIndependentSourceAuditArtifactId===a.oldIndependentSourceAuditArtifactId
  &&d.oldIndependentSourceAuditSha256===a.oldIndependentSourceAuditSha256
  &&d.newCurrentSourceRunId===a.newSourceRunId
  &&d.newCurrentSourceArtifactId===a.newSourceArtifactId
  &&d.newOriginalArtifactZipSha256===a.newOriginalArtifactZipSha256
  &&d.newCurrentSourceReceiptHash===a.newCurrentSourceReceiptHash
  &&d.originalNativeDaysRehashed===61
  &&d.previousNativeDaysRehashed===60&&d.newCurrentNativeDaysRehashed===1
  &&d.nativeDailyBarHashesMatched===61&&d.onlyA1SourceEvidenceVerified===true,
  'SCOPE_CLOCK_NATIVE_PROVENANCE_OR_DENOMINATOR_INVALID');
 const v=d.originalResponseVersionLineage;
 requireIt(Array.isArray(v)&&v.length===61
  &&v[0]?.marketDate===d.windowStartDate
  &&v.at(-1)?.marketDate===d.windowLastDate,'ORIGINAL_61_LINEAGE_MISSING');
 let prior='';
 for(const b of v){
  requireIt(typeof b?.marketDate==='string'&&/^\d{4}-\d\d-\d\d$/.test(b.marketDate)
   &&(!prior||b.marketDate>prior)&&b.marketDate<=a.marketDate
   &&SHA.test(b.originalNativeBodySha256||'')
   &&SHA.test(b.nativeRowSourceFieldsSha256||'')
   &&byCut(b.actualFirstPhysicalObservedAtUtc,a.targetResearchCutUtc)
   &&b.originalHistoricalPublicationTimestampCertified===false,
   'ORIGINAL_DATE_SHA_CLOCK_OR_HISTORICAL_AVAILABILITY_PROMOTED');
  prior=b.marketDate;
 }
 requireIt(d.originalHistoricalIssuerPublicationAtCertified===false
  &&d.independentFullPitAuditLaneAccepted===false
  &&d.historicalCfiEffectivePeriodPITCertified===false
  &&d.completeCARevisionsAndAuthoritativeNoEventCertified===false
  &&d.sourceSecurityUniverseFullDayCertified===false
  &&d.pitSymbolEligibleCount===0&&d.selectedCount===null
  &&d.zeroPickDay===null&&d.frozenD1Written===false
  &&d.shadowAuthorized===false&&d.cloudflareD1Reads===0
  &&d.cloudflareD1Writes===0&&d.cloudflareR2Writes===0
  &&d.system1FormalCoreChanged===false,
  'SOURCE_ONLY_NOT_FULL_PIT_OR_FALSE_AUTHORITY');
 const result={
  schemaVersion:'S2_BUILD_PITA_2330_REAL_A1_SOURCE_CONSUMER_V0_1',
  state:'PITA_2330_61_A1_ORIGINALS_VERIFIED__CFI_CA_AUDIT_UNKNOWN',
  pitTrack:'PIT_A',evidenceUse:'PROSPECTIVE_DAILY_SELECTION',
  observedMarketDate:a.marketDate,decisionCutUtc:a.targetResearchCutUtc,
  sourceSymbol:'2330',sourceMarket:'TWSE',
  underlyingDataReadbackRunId:a.dataReadbackRunId,
  underlyingDataReadbackArtifactId:a.dataReadbackArtifactId,
  underlyingDataReadbackReceiptHash:receiptHash,
  a1OriginalTradingDaysAccepted:61,a1OriginalTradingDaysRequired:61,
  symbolSourceA1VerifiedCount:1,fullUniverseOrdinaryShareCount:null,
  fullUniversePITUnknownCount:null,
  // 0 = source-only original has no PIT qualification proof, not a zero-pick.
  currentSymbolFullPITAcceptedCount:0,currentSymbolUnresolvedCount:1,
  historicalCfiEffectivePeriodCertified:false,caRevisionAndNoEventCertified:false,
  independentFullPitAuditAccepted:false,
  stage1EvaluationAuthorized:false,stage1ActuallyAssessedCount:null,
  selectionAuthorized:false,fullMarketRankingAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,shadowAuthorized:false,
  pitBHistoricalReplayCertified:false,
  cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false,productionTradingEnabled:false,
 };
 return Object.freeze({...result,receiptHash:await sha256Hex(result)});
}
if(process.argv[1]?.endsWith('/pit_a_2330_real_a1_source_consumer_v0_1.mjs')){
 const {readFileSync}=await import('node:fs');
 const file=process.argv[2];
 requireIt(typeof file==='string'&&file.length>0,'PHYSICAL_DATA_PATH_REQUIRED');
 console.log(JSON.stringify(await consumeRealPita2330Source61V0_1({
  dataReadback:JSON.parse(readFileSync(file,'utf8'))
 }),null,2));
}
