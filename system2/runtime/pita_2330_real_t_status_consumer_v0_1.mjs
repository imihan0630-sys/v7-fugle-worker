// BUILD_LANE READ ONLY: exact physical DATA PIT-A 2330 trading status source.
// The positive T-session A1 traded row and TWTAWU positive 1218 control are
// original *source* evidence, NOT a complete same-cut tradeability audit.
// Never infer no suspension from a zero-row query response.
import {sha256Hex} from './decision_archive.mjs';

const S=/^[a-f0-9]{64}$/,FAIL=x=>{throw Error('S2_BUILD_PITA_2330_STATUS_'+x);};
export const PHYSICAL_DATA_STATUS_PIN_V0_1=Object.freeze({
 marketDate:'2026-10-16',market:'TWSE',stock:'2330',
 cutUtc:'2026-10-16T15:45:00.000Z',
 dataRunId:38918007652,dataArtifactId:12052574204,
 dataReceiptSha256:'a101da6e0fb3f32cff43dc2a52bbf25189d8a0c1b6f9ca66683898a4f3186025',
 originalTwseA1BodySha256:'c00391008b8a292dcec991afe102a07ea3e3a49ec42950a90491f3f13fe1a6cf',
 originalA1RunId:38908458028,originalA1ArtifactId:12049690326,
 originalA1ObservedAtUtc:'2026-10-16T13:31:18.152Z',
});
const utc=s=>typeof s==='string'&&Number.isFinite(Date.parse(s))
  &&new Date(Date.parse(s)).toISOString()===s;
const byCut=(s,cut)=>utc(s)&&Date.parse(s)<Date.parse(cut);
export async function intakePita2330RealTSessionTradeOnlyV0_1({dataReceipt=null}={}){
 const d=dataReceipt,p=PHYSICAL_DATA_STATUS_PIN_V0_1;
 if(!d||typeof d!=='object'||Array.isArray(d))
  FAIL('ORIGINAL_DATA_RECEIPT_REQUIRED');
 const {receiptHash,...original}=d;
 if(!S.test(receiptHash||'')||receiptHash!==p.dataReceiptSha256
    ||receiptHash!==await sha256Hex(original))
  FAIL('PINNED_ORIGINAL_SOURCE_RECEIPT_HASH_INVALID');
 if(d.schemaVersion!=='S2_DATA_PITA_2330_T_SESSION_TWTAWU_POSITIVE_STATUS_V0_1'||
    d.marketDate!==p.marketDate||d.market!==p.market||d.stock!==p.stock||
    d.sourceDateReadbackCutUtc!==p.cutUtc||
    d.existingA1OriginalRunId!==p.originalA1RunId||
    d.existingA1OriginalArtifactId!==p.originalA1ArtifactId||
    d.existingA1BodySha256!==p.originalTwseA1BodySha256||
    d.existingA1OriginalFirstObservedAtUtc!==p.originalA1ObservedAtUtc||
    d.existingA1OriginalByteRehashed!==true||
    !byCut(d.actualOriginalStatusCompletedAtUtc,p.cutUtc)||
    d.currentSessionStockActuallyTraded!==true||
    d.currentSessionStockVolumeShares!==43046982||
    d.currentSessionStockTradeCount!==400499||
    !(d.currentSessionStockTradeValue>0)||
    !S.test(d.nativeA1StockRowSha256||'')||
    d.controlKnown1218SuspensionConfirmed!==true||
    d.currentDateTwTaWuNative2330Rows!==0||
    d.observed20261016SourceTradeableState!==
      'T_SESSION_A1_TRADED_TWTAWU_ABSENCE_NOT_AUTHORITATIVE'||
    d.tradeableAtDecisionCutIndependentlyCertified!==false||
    d.issuerSuspensionAndReinstatementComplete!==false||
    d.authoritativeNegativeNoSuspensionCertified!==false||
    d.sourceOnlyEvidencePositive!==true||
    d.dataOnlySourceWitness!==true||
    d.selectionAuthorized!==false||d.pitEligible!==false||
    d.selectedCount!==null||d.zeroPickDay!==null||
    d.frozenD1Written!==false||d.cloudflareD1Writes!==0||
    d.cloudflareR2Writes!==0||d.system1FormalCoreChanged!==false)
  FAIL('PHYSICAL_T_TRADE_STATUS_OR_NOAUTH_INCONSISTENT');
 const families=d.tradingStatusSources;
 if(!Array.isArray(families)||families.length!==2)FAIL('TWO_SOURCE_WITNESSES_REQUIRED');
 const positive=families[0],target=families[1];
 if(positive?.sourceId!=='TWTAWU_KNOWN_POSITIVE_1218'||
    positive?.rangeStartDate!=='2026-08-13'||
    positive?.rangeEndDate!=='2026-08-14'||
    positive?.upstreamStat!=='OK'||
    !(positive.parsedSourceRowCount>=1)||
    target?.sourceId!=='TWTAWU_T_SESSION'||
    target?.rangeStartDate!==p.marketDate||
    target?.rangeEndDate!==p.marketDate||
    target?.parsedSourceRowCount!==0||
    !Array.isArray(target.native2330MatchedRows)||
    target.native2330MatchedRows.length!==0)
  FAIL('POSITIVE_CONTROL_OR_EMPTY_TARGET_SCHEMA_INVALID');
 for(const row of families){
  if(row.httpStatus!==200||!S.test(row.originalNativeBodySha256||'')||
     !Number.isSafeInteger(row.originalNativeBodyBytes)||
     row.originalNativeBodyBytes<=0||
     !byCut(row.firstPhysicalObservedAtUtc,p.cutUtc)||
     row.rawBytesGzipRehashed!==true||
     row.absenceCertifiesNoSuspension!==false||
     row.authoritativeCompletenessCertified!==false)
   FAIL('SOURCE_BODY_SHA_CLOCK_OR_NEGATIVE_COMPLETENESS_INVALID');
 }
 const result={
  schemaVersion:'S2_BUILD_PITA_2330_PHYSICAL_T_TRADING_STATUS_INTAKE_V0_1',
  state:'T_SESSION_ACTUALLY_TRADED__DECISION_CUT_TRADEABILITY_STILL_UNKNOWN',
  pitTrack:'PIT_A',marketDate:p.marketDate,market:p.market,symbol:p.stock,
  decisionCutAtUtc:p.cutUtc,
  sourceRunId:p.dataRunId,sourceArtifactId:p.dataArtifactId,
  originalSourceOnlyReceiptSha256:d.receiptHash,
  sourcePositiveControlCount:1,sourceObservedNativeStatusBodies:2,
  originalCurrentA1Rehashed:true,
  tSessionActuallyTraded:true,actualTVolumeShares:d.currentSessionStockVolumeShares,
  actualTTrades:d.currentSessionStockTradeCount,
  trueAsOfTradingStatusIndependentlyAudited:false,
  noSuspensionOrHaltInferredFromEmptyNativeResponse:false,
  nextOpenTradeableAuthorized:false,
  auditNeeded:[
    'CUT_SPECIFIC_TRADEABILITY_AND_SUSPENSION_ORIGINAL_COMPLETENESS',
    'INDEPENDENT_AUDIT_LANE_SIGNED_T_CUT_STATUS_AND_CFI',
    'EXDIV_61_BAR_RELEVANT_PRICE_SPACE_AND_ALL_USED_FACTORS'
  ],
  local2330FullPitaEligible:0,local2330Unresolved:1,
  fullMarketOrdinaryShareCount:null,
  stage1EvaluationAuthorized:false,strategyActuallyAssessedCount:null,
  selectedCount:null,zeroPickDay:null,shadowAuthorized:false,
  frozenD1Written:false,cloudflareD1Reads:0,cloudflareD1Writes:0,
  cloudflareR2Writes:0,system1FormalCoreChanged:false,
 };
 return Object.freeze({...result,receiptHash:await sha256Hex(result)});
}
if(process.argv[1]?.endsWith('/pita_2330_real_t_status_consumer_v0_1.mjs')){
 const {readFileSync}=await import('node:fs');
 const path=process.argv[2];
 if(typeof path!=='string'||!path)FAIL('ACTUAL_GH_ARTIFACT_PATH_REQUIRED');
 const result=await intakePita2330RealTSessionTradeOnlyV0_1({
  dataReceipt:JSON.parse(readFileSync(path,'utf8'))});
 console.log(JSON.stringify(result,null,2));
}
