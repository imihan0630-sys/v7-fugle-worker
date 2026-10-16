// Issue #1068 DATA_LANE: reproducible cross-domain PIT firewall.
// Consumes already-merged ORIGINAL PHYSICAL EVIDENCE (not market/Cloudflare GETs).
// Explicitly prevents a 2026-10-14 preview's current security classification
// and non-exhaustive CA event rows being promoted into a 2026-10-15 A1 decision.
// Cannot certify original historical firstKnownAt, CFI effective periods,
// negative "NO_EVENT", strategy ranking or Frozen persistence.
const fail=(code)=>{throw Error("S2_DATA_CROSS_DOMAIN_PIT_"+code)};
const hex=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const truth=(b,code)=>{if(!b)fail(code)};
const immutable=o=>Object.freeze(o);
export const CROSS_DOMAIN_PHYSICAL_WITNESSES_V0_1=immutable({
 originalA1ProviderRun:38826851466,
 originalA1ProviderArtifact:12015950224,
 originalA1EvidenceSha256:"b53b2c756791ab8bb5a0f6eddb2d84241b9fb56ca80697b57c37be532ace708f",
 originalCFIProviderRun:38671504419,
 originalCFIIndependentAuditRun:38671545058,
 originalCAPhysicalRun:38654564377,
 originalCAIndependentReplayRun:38655538159,
 cfiSourceForPriorPreviewHash:"d55fadd02407d6f0939621abb9b0e415c99cdd077abc5a983d26c544c6319f23",
 cfiOriginalIndependentAuditHash:"d93e00a2a2f0d83e0eccd40679d257a445132c8f5892dc8d689924a9abb8ee48",
 previousCAObservedMarketDate:"2026-10-14",
 currentA1ObservedMarketDate:"2026-10-15"
});
export function reconcileRealPhysicalPITCrossDomainV0_1({a1,cfi,ca}={}){
 const w=CROSS_DOMAIN_PHYSICAL_WITNESSES_V0_1;
 truth(a1?.schemaVersion==="S2_DATA_ISSUE1068_REAL_NATIVE_A1_122_PERBAR_PIT_PHYSICAL_20261016_V0_1"&&
   a1?.sourceScope?.originalMarketDate===w.currentA1ObservedMarketDate &&
   a1?.originalActualMainProvider?.physicalRunId===w.originalA1ProviderRun&&
   a1?.originalActualMainProvider?.originalGitHubArtifactId===w.originalA1ProviderArtifact&&
   a1?.originalActualMainProvider?.originalInnerJsonBytes===75139&&
   a1?.originalActualMainProvider?.independentlyRecomputedInnerJsonSha256===w.originalA1EvidenceSha256&&
   a1?.originalActualMainProvider?.jobConclusion==="success"&&
   a1?.actualPhysicalSource?.allOriginalSourceMarketDatePairsIndependentlyByteRehashed===122&&
   a1?.actualPhysicalSource?.allIndividualOriginalBarOpenHighLowCloseVolumeValueTransactionAndRowFieldSHAReconciled===118035&&
   a1?.actualPhysicalSource?.allCompleteSymbolWindowsReconciled===1935&&
   a1?.actualPhysicalSource?.originalSixtyOneSessions===61&&
   a1?.twoClockCutVerdicts?.length===2&&
   a1.twoClockCutVerdicts[0].fullIndependentSourcePITAtThisCut===false&&
   a1.twoClockCutVerdicts[0].formalStage1StrategyPit===false&&
   a1.twoClockCutVerdicts[1].fullIndependentSourceOnlyResearchPITAtThisCut===true&&
   a1.twoClockCutVerdicts[1].formalStage1StrategyPit===false&&
   a1?.unresolvedFormal?.historicalOrdinaryShareCFIEffectiveDatesVerifiedFor61Sessions===false&&
   a1?.unresolvedFormal?.allSixCorporateActionFamilyRevisionsRetractionsSuspensionsAndNoEventComplete===false&&
   a1?.unresolvedFormal?.physicalFrozenDecisionWrittenAndReadBack===false,
   "A1_SOURCE_EVIDENCE_MISSING_OR_PROMOTED");

 truth(cfi?.schemaVersion==="S2_M09_REAL_30_NATIVE_CFI_INDEPENDENT_AUDIT_20261015_V0_1"&&
   cfi?.sourceMarketDate===w.previousCAObservedMarketDate&&
   cfi?.thirtyPreview?.sourceReadRunId===w.originalCFIProviderRun&&
   cfi?.independent?.independentAuditRunId===w.originalCFIIndependentAuditRun&&
   cfi?.thirtyPreview?.originalA1SourceReceiptHash===w.cfiSourceForPriorPreviewHash&&
   cfi?.thirtyPreview?.originalA1IndependentAuditHash===w.cfiOriginalIndependentAuditHash&&
   cfi?.thirtyPreview?.actualCurrentNativeRequests===30&&
   cfi?.thirtyPreview?.currentNativeCfiObserved===30&&
   cfi?.thirtyPreview?.nativeTypeStocksCFI_ESVUFR===30&&
   cfi?.thirtyPreview?.TWSEInnovationBoardRows===1&&
   cfi?.independent?.independentNativeOriginalsRehashed===30&&
   cfi?.independent?.independentVerdict==="ACCEPTED_CURRENT_NATIVE_ORIGINAL_CLASS_ONLY"&&
   cfi?.nonPromotion?.ordinaryCommonShareAsOf20261014PITCertified===false&&
   cfi?.nonPromotion?.firstKnownAtHistoricalPublicationProof===false&&
   cfi?.nonPromotion?.frozenD1Written===false,
   "CFI_PRIOR_DATE_CURRENT_ONLY_EVIDENCE_MISSING_OR_PROMOTED");

 truth(ca?.schemaVersion==="S2_M09_REAL_SIX_CA_NEGATIVE_EXPOSURE_20261015_V0_1"&&
   ca?.sourceMarketDate===w.previousCAObservedMarketDate&&
   ca?.originalA1Window?.sourceReceiptSha256===w.cfiSourceForPriorPreviewHash&&
   ca?.originalA1Window?.independentAuditSha256===w.cfiOriginalIndependentAuditHash&&
   ca?.sixCaNativeOriginals?.physicalRunId===w.originalCAPhysicalRun&&
   ca?.independentNegativeReplay?.physicalRunId===w.originalCAIndependentReplayRun&&
   ca?.sixCaNativeOriginals?.nativeRangeSchemaCandidateCount===6&&
   ca?.sixCaNativeOriginals?.rawResponseSha256ReadbackMatchedCount===6&&
   ca?.independentNegativeReplay?.originalCaSha256Rehashed===6&&
   ca?.independentNegativeReplay?.fullTradingSessionsVerified===61&&
   ca?.independentNegativeReplay?.eventRowsInWindow===641&&
   ca?.independentNegativeReplay?.uniqueMarketSymbolWithKnownEvent===630&&
   ca?.independentNegativeReplay?.preliminaryPreviewDenominator===30&&
   ca?.independentNegativeReplay?.preliminaryWithKnownEvent===11&&
   ca?.independentNegativeReplay?.otherPreliminaryNotProvenEventFree===19&&
   ca?.nonPromotion?.historicalCaRevisionCancellationAndNoEventCompletenessCertified===false&&
   ca?.nonPromotion?.frozenD1Written===false,
   "CA_ORIGINAL_SIX_LANES_OR_LIMITS_INVALID");
 const list=ca.independentNegativeReplay.flaggedPreview;
 truth(Array.isArray(list)&&list.length===11&&
   new Set(list.map(x=>x.market+"|"+x.symbol)).size===11&&
   list.every(x=>["TWSE","TPEX"].includes(x.market)&&/^[1-9][0-9]{3}$/.test(x.symbol)&&
     /^2026-\d\d-\d\d$/.test(x.eventDate)&&
     x.sourceFamily==="EX_RIGHT_DIVIDEND_ACTUAL"&&x.historicalReplayPITCertified===false),
   "CA_KNOWN_EVENT_ROW_LINEAGE_INVALID");
 truth(ca.sixCaNativeOriginals.lanes.length===6&&
   ca.sixCaNativeOriginals.lanes.every(x=>hex(x.originalSha256)&&x.originalShaRehashMatched===true&&
      x.nativeDateRangeVerified===true),
   "CA_SIX_NATIVE_ORIGINALS_INVALID");
 const priorSourceSame=cfi.thirtyPreview.originalA1SourceReceiptHash===ca.originalA1Window.sourceReceiptSha256;
 const nativeCFIAtCorrectDate=cfi.sourceMarketDate===a1.sourceScope.originalMarketDate;
 const nativeCAAtCorrectDate=ca.sourceMarketDate===a1.sourceScope.originalMarketDate;
 // Deliberately *no* inference from "30 current share" or "no known event" to
 // ordinary-equity historical effective periods or 61-session event-free proof.
 const historicalCFI61Full=false;
 const historicalCA61RevisionAndNegativeComplete=false;
 const formalQualified=historicalCFI61Full&&historicalCA61RevisionAndNegativeComplete&&
   nativeCFIAtCorrectDate&&nativeCAAtCorrectDate;
 return immutable({
  schemaVersion:"S2_DATA_ISSUE1068_CROSS_DOMAIN_PIT_GAP_VERDICT_V0_1",
  state:formalQualified?"UNEXPECTED_FORMAL_ELIGIBILITY_REVIEW_REQUIRED":
     "SOURCE_ONLY_A1_PIT_PASS__CFI_CA_HISTORICAL_VINTAGE_STRICTLY_BLOCKED",
  evaluatedA1MarketDate:a1.sourceScope.originalMarketDate,
  independentlyRehashedProviderSourcePairs:122,
  independentlyReconciledOHLCVRows:118035,
  independentSourceOnlyResearchCutUtc:a1.twoClockCutVerdicts[1].cutUtc,
  sourceOnlyResearchPITVerified:true,
  originalMarketDay2345PITAuthorized:false,
  originalHistoricalOHLCVFirstKnownCertified:false,
  priorPreviewMarketDate:cfi.sourceMarketDate,
  priorPreviewSameSourceAndIndependentAudit:priorSourceSame,
  priorPreviewNativeCFIOriginalsRehashed:30,
  nativeCFIObservedStockRows:30,
  priorPreviewNativeCFIIncludesInnovationBoard:1,
  nativeCFIValidOnNewA1MarketDateCertified:nativeCFIAtCorrectDate&&historicalCFI61Full,
  historical61SessionCFINativeEffectivePeriodsCertified:false,
  caSixOriginalSourceLanesRehashed:6,
  caOriginalObservedEventRowsIn61Window:641,
  caKnownEventMarketSymbolCount:630,
  priorPreviewCAExposedKnownEventCount:11,
  priorPreviewCANoKnownEventButUnprovenNoEventCount:19,
  historical61SessionCARevisionsAndNoEventCertified:false,
  priorPreviewKnownEvents:list.map(x=>immutable({
   market:x.market,symbol:x.symbol,eventDate:x.eventDate,
   evidenceOnly:"KNOWN_PREVIOUS_PREVIEW_EVENT__NOT_20261015_STRATEGY_DECISION_PIT"
  })),
  candidateUniverseCompleteOrdinaryShares:false,
  fullStrategyPITQualified:false,formalSelectedCount:null,zeroPickDay:null,
  strategyAssessmentExecuted:false,shadowRunExecuted:false,
  historicalBacktestAuthorized:false,
  frozenWritten:false,independentFrozenReadbackVerified:false,
  independentAuditLaneFullPITSignedOff:false,
  cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Calls:0,
  system1FormalRuntimeTouched:false,
  blockers:immutable([
   "CURRENT_ONLY_CFI_SOURCE_20261014_CANNOT_BACKFILL_20261015",
   "NATIVE_HISTORICAL_COMMON_SHARE_EFFECTIVE_PERIODS_NOT_ATTESTED",
   "CA_SIX_SOURCE_LANES_DO_NOT_PROVE_REVISIONS_CANCELLATIONS_SUSPENSIONS_AND_NO_EVENT",
   "11_PRIOR_PREVIEW_KNOWN_CA_EVENTS__19_PREVIEW_NO_EVENT_UNPROVEN",
   "NO_INDEPENDENT_FULL_STRATEGY_PIT_AUDIT_OR_REAL_FROZEN_D1_READBACK"
  ])
 });
}
