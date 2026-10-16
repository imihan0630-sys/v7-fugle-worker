// BUILD-only diagnostic adapter. Exact DATA receipt pin grants source lineage,
// never independent issuer PIT acceptance, selection or storage authority.
import {sha256Hex} from './decision_archive.mjs';
export const CA_READBACK_PIN = Object.freeze({
 runId:38911839798,artifactId:12050836482,
 receiptHash:'f2e49c641873a7284b58c0dca7cc3763e26f569eb6435822444c13396498c3d3',
 marketDate:'2026-10-16',symbol:'2330',market:'TWSE'
});
export async function consumePita2330CaSourceOnly({dataReadback}={}) {
 const d=dataReadback,p=CA_READBACK_PIN;
 if(!d||typeof d!=='object'||Array.isArray(d))throw Error('CA_SOURCE_RECEIPT_REQUIRED');
 const {receiptHash,...body}=d;
 if(receiptHash!==p.receiptHash||await sha256Hex(body)!==p.receiptHash)
  throw Error('CA_SOURCE_IMMUTABLE_PIN_MISMATCH');
 // This exact pin binds all six original body/row hashes, 1 positive event,
 // observed clocks, range, identity, null counters and negative authority flags.
 if(d.schemaVersion!=='S2_DATA_PITA_2330_NATIVE_CA_PER_SYMBOL_SOURCE_ONLY_V0_1'
  ||d.asOfMarketDate!==p.marketDate||d.symbol!==p.symbol||d.market!==p.market
  ||d.sourceFamilyCount!==6||d.observed2330PositiveEventRows!==1
  ||d.auditLaneIndependentFullPITAccepted!==false||d.pitEligible!==false)
  throw Error('CA_SOURCE_SCOPE_OR_AUTHORITY_INVALID');
 const result={
  schemaVersion:'S2_BUILD_PITA_2330_CA_SOURCE_ONLY_CONSUMER_V0_1',
  state:'CA_CURRENT_SOURCE_REHASHED__HISTORICAL_CFI_CA_AUDIT_UNKNOWN',
  pitTrack:'PIT_A',marketDate:p.marketDate,symbol:p.symbol,market:p.market,
  dataReadbackRunId:p.runId,dataReadbackArtifactId:p.artifactId,
  dataReadbackReceiptHash:receiptHash,sourceFamilyBodiesVerified:6,
  currentObservedPositiveEventRows:1,otherFamiliesWithNoObservedSymbolRows:5,
  authoritativeNoEventCertified:false,historicalCfiEffectivePeriodsCertified:false,
  caHistoricalRevisionsCertified:false,independentFullPitAuditAccepted:false,
  currentSymbolFullPITAcceptedCount:0,currentSymbolUnresolvedCount:1,
  fullUniverseOrdinaryShareCount:null,fullUniversePITUnknownCount:null,
  stage1EvaluationAuthorized:false,stage1ActuallyAssessedCount:null,
  selectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  shadowAuthorized:false,frozenD1Written:false,pitBHistoricalReplayCertified:false,
  officialProviderGets:0,cloudflareD1Reads:0,cloudflareD1Writes:0,
  cloudflareR2Writes:0,system1FormalCoreChanged:false,
  blockers:['HISTORICAL_CFI_EFFECTIVE_VINTAGE_UNKNOWN',
   'CA_REVISION_NEGATIVE_COMPLETENESS_UNKNOWN','INDEPENDENT_AUDIT_ACCEPTANCE_MISSING']
 };
 return Object.freeze({...result,receiptHash:await sha256Hex(result)});
}
