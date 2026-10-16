// DATA_LANE. Read-only owner's PIT-A prospective-selection vs PIT-B historical-replay
// priority ledger. This never certifies a PIT PASS or admits a strategy symbol.
// Source-only native CFI positives are distinct from independently accepted PIT.
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';

const H=/^[a-f0-9]{64}$/;
const fail=s=>{throw Error('S2_PIT_DUAL_TRACK_'+s);};
export async function measureOwnerPITDualTrackV0_1(handoff,currentNative){
 const h=handoff,c=currentNative;
 if(h?.schemaVersion!=='S2_PIT_SOURCE_HANDOFF_V0_1'||
    h.status!=='SOURCE_INDEPENDENTLY_REHASHED__PIT_SCOPE_NOT_INDEPENDENTLY_ACCEPTED'||
    h?.dataOwner!=='SYSTEM2_DATA_LANE'||
    !H.test(h.receiptHash||'')||
    await sha256Hex(Object.fromEntries(Object.entries(h).filter(([k])=>k!=='receiptHash')))!==h.receiptHash)
   fail('SOURCE_HANDOFF_HASH_OR_STATUS_INVALID');
 if(h?.a1OriginalEvidence?.originalProviderPairs!==122||
    h.a1OriginalEvidence.independentlyRehashedProviderPairs!==122||
    h.a1OriginalEvidence.reconciledOhlcvRows!==118035||
    !Array.isArray(h.officialTradingDates)||
    h.officialTradingDates.length!==61||
    h.officialTradingDates.at(-1)!==h.marketDate||
    !Number.isSafeInteger(h.a1OriginalEvidence.sourceSecurityWindows)||
    h.a1OriginalEvidence.sourceSecurityWindows<1)
   fail('A1_ORIGINAL_CALENDAR_OR_DENOMINATOR_INVALID');
 const u=h.a1OriginalEvidence.sourceSecurityWindows,p=h.handoffScope;
 if(!p||p.pitEligibleSymbolCount!==0||p.unresolvedSymbolCount!==u||
    p.originalMarketDecisionPitState!=='BLOCKED'||p.strategyPitState!=='BLOCKED'||
    p.selectionAuthorized!==false||p.frozenD1Written!==false||
    p.shadowAuthorized!==false||p.historicalBacktestAuthorized!==false||
    p.independentAuditLaneFullPitAccepted!==false||
    p.formalSelectedCount!==null||p.zeroPickDay!==null)
   fail('FALSE_SCOPE_PIT_OR_SELECTION_PROMOTION');
 const cut=Date.parse(h.originalDecisionCutAtUtc);
 const late=Date.parse(h.actualSourceOnlyEvaluationAtUtc);
 if(!Number.isFinite(cut)||!Number.isFinite(late)||late<=cut||
    h.a1OriginalEvidence.originalDecisionCutIndependentArchiveWitness!==false||
    h.a1OriginalEvidence.originalDecisionCutIndependentAuditComplete!==false)
   fail('HISTORICAL_DECISION_CUT_CLOCK_OR_ARCHIVE_FALSIFIED');
 if(c?.schemaVersion!=='S2_DATA_NATIVE_CFI_ORIGINAL_PHYSICAL_20261016_V0_1'||
    !H.test(c.originalArtifactZipSha256||'')||
    !H.test(c.originalReceiptHash||'')||
    !Array.isArray(c.sourceOriginals)||c.sourceOriginals.length!==4||
    c.realNativeBodyRehashed!==4||c.dataIndependentlyRehashed!==true||
    c.independentAuditLaneSigned!==false||
    c.historicEffectivePeriodPITCertified!==0||
    c.fullStage1MarketDayHistoricalPitEligibleSymbols!==0||
    c.fullStage1MarketDayHistoricalPitUnknownSymbols!==u||
    c.caSixFamilyHistoricVersionNoEventComplete!==false||
    c.selectedCount!==null||c.zeroPickDay!==null||c.frozenD1Written!==false)
   fail('CURRENT_CFI_SOURCE_MASQUERADING_AS_PIT');
 const uniq=new Set();
 for(const row of c.sourceOriginals){
   const key=row?.market+':'+row?.code;
   if(uniq.has(key)||!['TWSE','TPEX'].includes(row.market)||
     !/^[0-9]{4}$/.test(row.code||'')||
     !H.test(row.originalSha256||'')||
     !Number.isFinite(Date.parse(row.observedAtUtc))||
     Date.parse(row.observedAtUtc)<=cut||
     (row.sourceObservationPositive===true&&
      !(row.nativeType==='Stocks'&&row.cfi==='ESVUFR'))||
     typeof row.sourceObservationPositive!=='boolean')fail('CURRENT_ORIGINAL_ROW_OR_CLOCK_INVALID');
   uniq.add(key);
 }
 const currentStocks=c.sourceOriginals.filter(x=>x.sourceObservationPositive).length;
 if(currentStocks!==c.asOfCurrentStockSourcePositive)fail('NATIVE_SOURCE_POSITIVE_COUNT_MISMATCH');
 const d=h.migrationAndAccountState;
 if(!Number.isSafeInteger(d?.sourceA1Rows)||
    !Number.isSafeInteger(d?.destinationA1Rows)||
    d.destinationA1Rows+d.destinationA1RowsRemaining!==d.sourceA1Rows||
    d.destinationA1RowsIdentityMatched!==d.destinationA1Rows||
    d.targetR2Entitlement!=='NOT_ENTITLED_403_10042'||
    d.g3FullyAccepted!==false||d.g4FullyAccepted!==false)
   fail('HISTORICAL_PIT_B_MIGRATION_PROGRESS_FALSIFIED');
 return Object.freeze({
   schemaVersion:'S2_DATA_PIT_A_PIT_B_PRIORITY_STATUS_V0_1',
   ownerApprovedPriority:'PIT_A_DAILY_SELECTION_FIRST__PIT_B_HISTORIC_PARALLEL',
   observationDate:c.sourceOriginals[0].observedAtUtc.slice(0,10),
   baselineHistoricalMarketDate:h.marketDate,
   historicalMarketDecisionCutQualified:false,
   pitA:{
      state:'ORIGINAL_CURRENT_CFI_POSITIVES__HISTORICAL_CLASS_CA_AND_AUDIT_UNKNOWN',
      sourceOnlyA1Pairs:122,sourceOnlyA1OhlcvRows:118035,
      sourceSecurityWindows:u,sourceNativeInstrumentControls:c.sourceOriginals.length,
      currentlyObservedStockPositive:currentStocks,
      historicalPITIndependentlyAccepted:0,
      historyPITUnknown:u,formalSelectedCount:null,zeroPickDay:null,
      frozenReadbackAccepted:false,nextTargetStock:'TWSE:2330',
      recipient:'AUDIT_LANE_THEN_BUILD_LANE',
   },
   pitB:{
      state:'HISTORICAL_REPLAY_AND_MIGRATION_IN_PROGRESS_NOT_BACKTEST_PIT_PASS',
      sourceD1A1Rows:d.sourceA1Rows,
      destD1A1Rows:d.destinationA1Rows,
      remainingD1A1Rows:d.destinationA1RowsRemaining,
      sourceLinkedRowsMatched:d.destinationA1RowsIdentityMatched,
      destinationR2Status:d.targetR2Entitlement,
      historicalBacktestPITCertified:false,
   },
   truePitFirstSymbolCertified:false,
   sourceOnlyProgressDoesNotGrantStrategyPermission:true,
   selectionAuthorized:false,shadowAuthorized:false,frozenD1Written:false,
   system1FormalModified:false,cloudflareWrites:0,
 });
}
if(process.argv[1]?.endsWith('/pit_dual_track_priority_v0_1.mjs')){
 const [h,c]=await Promise.all([
    readFile('system2/migration/evidence/S2_DATA_ISSUE1068_PIT_SOURCE_HANDOFF_20261016_V0_1.json','utf8'),
    readFile('system2/migration/evidence/S2_DATA_ISSUE1068_NATIVE_CFI_ORIGINAL_FOUR_CONTROL_POSITIVES_20261016_V0_1.json','utf8')
 ]).then(a=>a.map(JSON.parse));
 console.log(JSON.stringify(await measureOwnerPITDualTrackV0_1(h,c),null,2));
}
