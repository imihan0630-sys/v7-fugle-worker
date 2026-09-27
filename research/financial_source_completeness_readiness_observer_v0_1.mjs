function num(v){
  if(v===null||v===undefined||v==="") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
function truthyEvidence(v){
  if(v===null||v===undefined||v==="") return null;
  return Boolean(v);
}
function poolOf(row){
  const p=String(row?.pool||"").toUpperCase();
  if(p==="GENERAL"||p==="THOUSAND") return p;
  const close=num(row?.close);
  return close!==null&&close>=1000?"THOUSAND":"GENERAL";
}
function bump(o,k){o[k]=(o[k]||0)+1;}
export const REACH_STATE=Object.freeze({REACHED:"REACHED",NOT_REACHED:"NOT_REACHED",UNKNOWN:"UNKNOWN"});

export function classifyFinancialSourceBundle({financialSnapshot,valuationSnapshot,announcementsSnapshot}={}){
  const financialReady=!!financialSnapshot;
  const valuationReady=!!valuationSnapshot;
  const announcementsReady=!!announcementsSnapshot;
  const announcementsVerified=announcementsReady
    ? announcementsSnapshot?.sourcesVerified===true
    : null;
  return {
    scanLevelReady:financialReady&&valuationReady&&announcementsReady,
    financial:{
      ready:financialReady,
      count:num(financialSnapshot?.count),
      asOfDate:financialSnapshot?.asOfDate??null,
      year:financialSnapshot?.year??null,
      quarter:financialSnapshot?.quarter??null
    },
    valuation:{
      ready:valuationReady,
      count:num(valuationSnapshot?.count),
      asOfDate:valuationSnapshot?.asOfDate??null
    },
    announcements:{
      ready:announcementsReady,
      count:num(announcementsSnapshot?.count),
      asOfDate:announcementsSnapshot?.asOfDate??null,
      sourcesVerified:announcementsVerified
    },
    canonicalScanBehavior:!financialReady||!valuationReady||!announcementsReady
      ?"SCAN_ABORT_DATA_INCOMPLETE"
      :"PER_SYMBOL_COMPLETENESS_EVALUABLE"
  };
}

export function inspectCanonicalFinancialEntry(entry){
  if(!entry) return {
    present:false,
    quarterRevenuePositive:false,
    financialBasisTruthy:false,
    revenueQoQObserved:false,
    revenueQuarterYoYObserved:false,
    complete:false,
    canonicalProducerInvariantViolation:false
  };
  const q=num(entry.quarterRevenue);
  const basis=truthyEvidence(entry.financialBasis);
  const qoq=num(entry.revenueQoQ);
  const yoy=num(entry.revenueQuarterYoY);
  const complete=q!==null&&q>0&&basis===true&&qoq!==null&&yoy!==null;
  return {
    present:true,
    quarterRevenuePositive:q!==null&&q>0,
    financialBasisTruthy:basis===true,
    revenueQoQObserved:qoq!==null,
    revenueQuarterYoYObserved:yoy!==null,
    complete,
    canonicalProducerInvariantViolation:!complete
  };
}

export function inspectCanonicalValuationEntry(entry){
  if(!entry) return {
    present:false,
    valuationObserved:false,
    priceBookRatioObserved:false,
    complete:false,
    canonicalProducerInvariantViolation:false
  };
  const observed=entry.valuationObserved===true;
  const pb=num(entry.priceBookRatio);
  const complete=observed&&pb!==null;
  return {
    present:true,
    valuationObserved:observed,
    priceBookRatioObserved:pb!==null,
    complete,
    canonicalProducerInvariantViolation:!complete
  };
}

export function observeFinancialSourceCompleteness(rows=[],{
  financialSnapshot,
  valuationSnapshot,
  announcementsSnapshot,
  preGateReachBySymbol={}
}={}){
  const bundle=classifyFinancialSourceBundle({financialSnapshot,valuationSnapshot,announcementsSnapshot});
  const fStocks=financialSnapshot?.stocks&&typeof financialSnapshot.stocks==="object"?financialSnapshot.stocks:{};
  const vStocks=valuationSnapshot?.stocks&&typeof valuationSnapshot.stocks==="object"?valuationSnapshot.stocks:{};
  const announcementVerified=bundle.announcements.sourcesVerified===true;

  const counts={
    inputRows:Array.isArray(rows)?rows.length:0,
    reached:0,notReached:0,parentUnknown:0,
    completeAtReach:0,
    financialSymbolAbsentAtReach:0,
    valuationSymbolAbsentAtReach:0,
    announcementSourceUnverifiedAtReach:0,
    financialProducerInvariantViolationAtReach:0,
    valuationProducerInvariantViolationAtReach:0,
    scanLevelUnavailableAtReach:0
  };
  const poolCounts={
    GENERAL:{reached:0,complete:0,financialMissing:0,valuationMissing:0,announcementUnverified:0},
    THOUSAND:{reached:0,complete:0,financialMissing:0,valuationMissing:0,announcementUnverified:0}
  };
  const patternCounts={};
  const records=[];

  for(const row of Array.isArray(rows)?rows:[]){
    const symbol=String(row?.symbol||"").trim();
    const pool=poolOf(row);
    const reach=String(preGateReachBySymbol?.[symbol]||REACH_STATE.UNKNOWN);

    if(reach===REACH_STATE.NOT_REACHED){
      counts.notReached+=1;
      records.push({symbol,pool,reachState:reach,state:"NOT_EVALUABLE_PRE_GATE"});
      continue;
    }
    if(reach!==REACH_STATE.REACHED){
      counts.parentUnknown+=1;
      records.push({symbol,pool,reachState:REACH_STATE.UNKNOWN,state:"UNKNOWN_PARENT_REACH"});
      continue;
    }

    counts.reached+=1; poolCounts[pool].reached+=1;
    if(!bundle.scanLevelReady){
      counts.scanLevelUnavailableAtReach+=1;
      records.push({symbol,pool,reachState:reach,state:"SCAN_LEVEL_DATASET_UNAVAILABLE"});
      continue;
    }

    const financial=inspectCanonicalFinancialEntry(fStocks[symbol]);
    const valuation=inspectCanonicalValuationEntry(vStocks[symbol]);
    const announcement={
      sourcesVerified:announcementVerified,
      perSymbolArrayPresent:Array.isArray(announcementsSnapshot?.stocks?.[symbol]?.officialAnnouncements),
      eventCount:Array.isArray(announcementsSnapshot?.stocks?.[symbol]?.officialAnnouncements)
        ? announcementsSnapshot.stocks[symbol].officialAnnouncements.length
        : 0
    };

    if(!financial.present){counts.financialSymbolAbsentAtReach+=1;poolCounts[pool].financialMissing+=1;}
    if(!valuation.present){counts.valuationSymbolAbsentAtReach+=1;poolCounts[pool].valuationMissing+=1;}
    if(!announcementVerified){counts.announcementSourceUnverifiedAtReach+=1;poolCounts[pool].announcementUnverified+=1;}
    if(financial.canonicalProducerInvariantViolation) counts.financialProducerInvariantViolationAtReach+=1;
    if(valuation.canonicalProducerInvariantViolation) counts.valuationProducerInvariantViolationAtReach+=1;

    const complete=financial.complete&&valuation.complete&&announcementVerified;
    if(complete){counts.completeAtReach+=1;poolCounts[pool].complete+=1;}

    const pattern=[
      financial.present?(financial.complete?"F_OK":"F_INVALID"):"F_MISSING",
      valuation.present?(valuation.complete?"V_OK":"V_INVALID"):"V_MISSING",
      announcementVerified?"A_GLOBAL_OK":"A_GLOBAL_UNVERIFIED"
    ].join("|");
    bump(patternCounts,pattern);

    records.push({
      symbol,pool,reachState:reach,
      state:complete?"COMPLETE":"INCOMPLETE",
      pattern,
      financial,
      valuation,
      announcement,
      formalBundledChecks:{
        quarterRevenuePositive:financial.quarterRevenuePositive,
        financialBasisTruthy:financial.financialBasisTruthy,
        revenueQoQObserved:financial.revenueQoQObserved,
        revenueQuarterYoYObserved:financial.revenueQuarterYoYObserved,
        valuationObserved:valuation.valuationObserved,
        priceBookRatioObserved:valuation.priceBookRatioObserved,
        announcementsVerified:announcementVerified
      }
    });
  }

  return {
    schemaVersion:"financial-source-completeness-readiness-observer-v0.1",
    bundle,
    counts,
    poolCounts,
    patternCounts,
    formalReachIncompleteRate:counts.reached>0
      ?(counts.reached-counts.completeAtReach)/counts.reached:null,
    guards:{
      scanMissingSnapshotIsNotPerSymbolReject:true,
      currentFinancialProducerCollapsesFourChecksToEntryIntegrity:true,
      currentValuationProducerCollapsesTwoChecksToEntryIntegrity:true,
      announcementVerificationIsGlobalUnderCanonicalMerge:true,
      noOutcomeUse:true,
      noFormalChange:true
    },
    records
  };
}
