// System2 DATA_LANE #1068: fail-closed time-of-knowledge evaluation.
// A historical_store_v0_1 bar's pitReplayEligible flag or SESSION_CLOSE_FINALITY
// is a CLASSIFICATION of a record, NOT evidence that the exact row existed at
// the historical decision cut. This module never promotes a strategy/Frozen.
// An independently original-byte-audited source receipt is required even for a
// positive SOURCE-OBSERVATION as-of admission.
import {sha256Hex} from "./decision_archive.mjs";
const SHA=/^[0-9a-f]{64}$/;
const UTC=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const stamp=x=>typeof x==="string"&&UTC.test(x)&&Number.isFinite(Date.parse(x))&&
  new Date(x).toISOString()===new Date(Date.parse(x)).toISOString();
const day=x=>typeof x==="string"&&DAY.test(x)&&
  Number.isFinite(Date.parse(x+"T00:00:00Z"))&&
  new Date(x+"T00:00:00Z").toISOString().slice(0,10)===x;
const deny=x=>{throw Error("S2_STRICT_PIT_ASOF_"+x)};
const sourceKey=x=>x.market+"|"+x.marketDate;
const recordKey=x=>x.market+"|"+x.symbol+"|"+x.marketDate+"|"+x.priceSpace;
const maxIso=(...a)=>new Date(Math.max(...a.map(t=>Date.parse(t)))).toISOString();
/**
 * This is only a machine-readable SOURCE_ARRIVAL_PIT class.
 * Passing this layer cannot override historical security-class, CA/revision,
 * suspension, full-market completeness, freeze, or strategy audit controls.
 *
 * sourceWitnesses must be delivered by another physical original-byte rehash
 * and independent readback process. No self-authored hash/digest proves that
 * an upstream source was actually available on the asserted old date.
 */
export async function inspectStrictPitSourceObservationV0_1({
  decisionCutAtUtc,evaluatedAtUtc,marketDate,
  bars=[],sourceWitnesses=[],
  requireAllRows=true,maxRows=100000
}={}){
  if(!stamp(decisionCutAtUtc)||!stamp(evaluatedAtUtc)||
    Date.parse(decisionCutAtUtc)>Date.parse(evaluatedAtUtc)||
    !day(marketDate)||!Array.isArray(bars)||!Array.isArray(sourceWitnesses)||
    !Number.isSafeInteger(maxRows)||maxRows<1||maxRows>100000||
    bars.length>maxRows||sourceWitnesses.length>122||
    typeof requireAllRows!=="boolean")deny("INVALID_INPUT");
  const witnessed=new Map();
  for(const r of sourceWitnesses){
    if(!["TWSE","TPEX"].includes(r?.market)||!day(r.marketDate)||
       !SHA.test(r.originalRawResponseSha256||"")||
       !SHA.test(r.sourceReceiptHash||"")||!SHA.test(r.independentAuditHash||"")||
       typeof r.sourceUrl!=="string"||!r.sourceUrl.startsWith("https://")||
       !stamp(r.originalCapturedAtUtc)||!stamp(r.independentlyAuditedAtUtc)||
       Date.parse(r.independentlyAuditedAtUtc)<Date.parse(r.originalCapturedAtUtc)||
       r.originalNativeBytesRehashed!==true||r.independentAuditVerdict!=="ACCEPTED_SOURCE_INTEGRITY_ONLY"||
       r.independentAuditSeparation!=="INDEPENDENT_READBACK_PROCESS"||
       r.strategyPitCertified!==false||r.selectionAuthorized!==false)
      deny("SOURCE_WITNESS_UNTRUSTED_OR_FUTURE");
    const key=sourceKey(r);
    if(witnessed.has(key))deny("SOURCE_WITNESS_DUPLICATE");
    witnessed.set(key,r);
  }
  const admitted=[],blocked=[],seen=new Set();
  for(const row of bars){
    if(!row||!["TWSE","TPEX"].includes(row.market)||!day(row.marketDate)||
       row.marketDate>marketDate||!/^[1-9]\d{3}$/.test(row.symbol||"")||
       row.priceSpace!=="RAW"||!SHA.test(row.sourceRowHash||"")||
       !SHA.test(row.barHash||"")||row.canonicalKey!==recordKey(row))
      deny("BAR_IDENTITY_UNTRUSTED");
    const identity=row.canonicalKey+"|"+row.barHash;
    if(seen.has(identity))deny("BAR_DUPLICATE_VERSION");
    seen.add(identity);
    const witness=witnessed.get(sourceKey(row));
    const reasons=[];
    if(!witness)reasons.push("INDEPENDENT_ORIGINAL_SOURCE_WITNESS_MISSING");
    if(row.pitReplayEligible!==true&&row.pitReplayEligible!==1)
      reasons.push("LEGACY_RECORD_PIT_FLAG_FALSE");
    if(row.availabilityBasis==="SESSION_CLOSE_FINALITY"||
       row.pitAvailabilityClass==="CONSERVATIVE_SESSION_FINALITY")
      reasons.push("MARKET_CLOSE_IS_NOT_PUBLICATION_TIME");
    if(row.continuityState==="CLEAR_NO_ACTION"||
       row.continuityState==="ADJUSTED_CONTINUITY")
      reasons.push("LEGACY_CONTINUITY_REQUIRES_SEPARATE_AUDIT");
    if(!stamp(row.capturedAt)||!stamp(row.observedAt)||!stamp(row.availableAt))
      reasons.push("ROW_ORIGINAL_CAPTURE_OBSERVATION_CLOCK_MISSING");
    if(witness){
      const minTime=maxIso(witness.originalCapturedAtUtc,witness.independentlyAuditedAtUtc);
      // A well-formed receipt from a *later* run can never grant eligibility
      // to a historical decision, even if row.availableAt claims early finality.
      if(Date.parse(minTime)>Date.parse(decisionCutAtUtc))
        reasons.push("PROVIDER_OR_AUDIT_ARRIVED_AFTER_DECISION_CUT");
      if(stamp(row.capturedAt)&&Date.parse(row.capturedAt)>Date.parse(decisionCutAtUtc))
        reasons.push("BAR_CAPTURE_AFTER_DECISION_CUT");
      if(stamp(row.observedAt)&&Date.parse(row.observedAt)>Date.parse(decisionCutAtUtc))
        reasons.push("BAR_OBSERVED_AFTER_DECISION_CUT");
      if(row.originalRawResponseSha256!==witness.originalRawResponseSha256)
        reasons.push("ROW_ORIGINAL_PROVIDER_BYTES_SHA_MISMATCH");
      if(stamp(row.capturedAt)&&row.capturedAt!==witness.originalCapturedAtUtc)
        reasons.push("ROW_SOURCE_RECEIPT_CLOCK_MISMATCH");
      if(row.sourceId!==witness.sourceId||row.sourceUrl!==witness.sourceUrl)
        reasons.push("ROW_PROVIDER_IDENTITY_MISMATCH");
    }
    const availableAt=stamp(row.availableAt)?row.availableAt:null;
    if(availableAt&&Date.parse(availableAt)>Date.parse(decisionCutAtUtc))
      reasons.push("ROW_REPORTED_AVAILABLE_AFTER_DECISION_CUT");
    // Do NOT trust row's availableAt as a proof clock; bound by observed and
    // independently verified original receipt even if claimed availability early.
    const earliestObservationalResearchUseAt=witness&&stamp(row.capturedAt)&&stamp(row.observedAt)?
      maxIso(row.capturedAt,row.observedAt,witness.originalCapturedAtUtc,witness.independentlyAuditedAtUtc,
        ...(availableAt?[availableAt]:[])):null;
    const item=Object.freeze({canonicalKey:row.canonicalKey,barHash:row.barHash,
      marketDate:row.marketDate,symbol:row.symbol,
      earliestObservationalResearchUseAt,reasonCodes:[...new Set(reasons)].sort(),
      sourceObservationByCutAdmissible:reasons.filter(x=>x!=="LEGACY_CONTINUITY_REQUIRES_SEPARATE_AUDIT").length===0,
      historicalMarketDateFirstKnownAt:null,originalHistoricalPublicAvailableAt:null,
      historicalBarPITCertified:false,independentCompanyActionPITCertified:false,
      independentOrdinaryShareCFI61Certified:false,strategyPitCertified:false});
    if(item.sourceObservationByCutAdmissible)admitted.push(item);
    else blocked.push(item);
  }
  const scope={
    schemaVersion:"S2_STRICT_PIT_ORIGINAL_SOURCE_OBSERVATION_FIREWALL_V0_1",
    classification:"SOURCE_OBSERVATION_ONLY_DO_NOT_USE_AS_STRATEGY_PIT_OR_HISTORICAL_BACKTEST",
    decisionCutAtUtc,evaluatedAtUtc,marketDate,receivedBarRows:bars.length,
    originalMarketDateSourceWitnesses:sourceWitnesses.length,
    observedByDecisionCutBarRows:admitted.length,blockedBarRows:blocked.length,
    state:blocked.length===0&&bars.length>0&&requireAllRows?
      "FULL_ROW_SOURCE_OBSERVATION_BY_CUT__STRATEGY_PIT_BLOCKED":
      "PARTIAL_OR_BLOCKED_SOURCE_OBSERVATION__STRATEGY_PIT_BLOCKED",
    provenanceIsOriginalProviderByteRehashAndSeparateAuditRequired:true,
    sourceRecordPITFlagIsInsufficient:true,
    marketCloseFinalityNotHistoricalPublication:true,
    historicalFirstKnownAtCertifiedCount:0,
    oldSourceHistoricalOHLCVBarPITCertified:false,
    all61SessionCorporateActionAndSuspensionEvidenceCertified:false,
    historicalOrdinaryShareNativeCFIVersionWindowCertified:false,
    historicalFullRevisionCoverageCertified:false,
    formalStrategyPitCertified:false,shadowBacktestAuthorized:false,
    frozenSelectionAuthorized:false,independentAuditLaneFinalSignoff:false,
    cloudflareD1Reads:0,cloudflareD1Writes:0,system1FormalCoreModified:false,
    admitted,blocked
  };
  return Object.freeze({...scope,receiptSha256:await sha256Hex(scope)});
}
