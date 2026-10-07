import { deepFreeze } from "./factor_snapshot.mjs";

export const HISTORICAL_REPLAY_INPUT_GATE_VERSION="0.1-RESEARCH";

function integer(value,field){
  const n=Number(value);
  if(!Number.isInteger(n)) throw new Error(field+" must be integer");
  return n;
}
function acceptedAnnualRow(row){
  if(!row) return false;
  if(row.dataCoverageState!=="PASS") return false;
  if(!String(row.overall||"").startsWith("PASS_DATA_")) return false;
  if(row.manifestState!=="COMPLETE"||row.completionReceipt!=="COMPLETE") return false;
  if(!row.receiptId||!row.evidencePath||!row.githubRunId) return false;
  if(Number(row.r2Objects||0)<=0||Number(row.r2ByteHashVerified||0)!==Number(row.r2Objects||0)) return false;
  if(Number(row.rawSourceMissingRows||0)!==0||Number(row.rawSourceExtraRows||0)!==0) return false;
  if(Number(row.sourceRowHashMismatchCount||0)!==0) return false;
  if(row.canonicalA1ValueMismatchCount!==undefined&&row.canonicalA1ValueMismatchCount!==null
    &&Number(row.canonicalA1ValueMismatchCount)!==0) return false;
  if(row.unexpectedBars!==undefined&&row.unexpectedBars!==null&&Number(row.unexpectedBars)!==0) return false;
  return true;
}
function rowDebt(row){
  return {
    replayReadinessState:row.replayReadinessState||"UNKNOWN",
    pitReadiness:row.pitReadiness||"UNKNOWN",
    continuityReadiness:row.continuityReadiness||"UNKNOWN",
    technicalPriceReadiness:row.technicalPriceReadiness||"UNKNOWN",
    symbolSessionReadiness:row.symbolSessionReadiness||"UNKNOWN",
    missingBars:Number(row.missingBars||0),
    unknownBars:Number(row.unknownBars||0),
    mainMissingReasons:row.mainMissingReasons||{},
  };
}

export function buildHistoricalReplayInputGateV0_1({
  coverageMatrix,
  annualStartYear=2017,
  annualThroughYear,
  currentYear,
  currentYearSegmentStateByMarket={},
  markets=["TWSE","TPEX"],
}={}){
  if(!coverageMatrix||!Array.isArray(coverageMatrix.rows)) throw new Error("coverageMatrix.rows is required");
  const start=integer(annualStartYear,"annualStartYear");
  const through=integer(annualThroughYear,"annualThroughYear");
  const current=integer(currentYear,"currentYear");
  if(through<start) throw new Error("annualThroughYear cannot precede annualStartYear");
  if(current<=through) throw new Error("currentYear must be later than annualThroughYear");
  if(!Array.isArray(markets)||!markets.length) throw new Error("markets must be non-empty");

  const annualBlockers=[];
  const annualAccepted=[];
  const replayDebts=[];
  for(const market of markets){
    for(let year=start;year<=through;year+=1){
      const row=coverageMatrix.rows.find((x)=>x.market===market&&Number(x.year)===year)||null;
      if(!acceptedAnnualRow(row)){
        annualBlockers.push(deepFreeze({
          market,year,
          reason:!row?"MISSING_MATRIX_ROW":"ANNUAL_MARKET_YEAR_NOT_PHYSICALLY_ACCEPTED",
          observed:row?{
            dataCoverageState:row.dataCoverageState||null,
            replayReadinessState:row.replayReadinessState||null,
            overall:row.overall||null,
            manifestState:row.manifestState||null,
            completionReceipt:row.completionReceipt||null,
            githubRunId:row.githubRunId||null,
          }:null,
        }));
        continue;
      }
      annualAccepted.push(deepFreeze({
        market,year,receiptId:row.receiptId,evidencePath:row.evidencePath,
        githubRunId:row.githubRunId,r2Objects:Number(row.r2Objects),
        replayReadinessState:row.replayReadinessState,
      }));
      const debt=rowDebt(row);
      if(debt.replayReadinessState!=="READY"||debt.unknownBars>0
        ||debt.continuityReadiness!=="READY"||debt.technicalPriceReadiness!=="READY"){
        replayDebts.push(deepFreeze({market,year,...debt}));
      }
    }
  }

  const currentYearBlockers=[];
  const currentYearAccepted=[];
  for(const market of markets){
    const state=currentYearSegmentStateByMarket?.[market]||null;
    if(!state||state.state!=="PHYSICAL_ACCEPTED"){
      currentYearBlockers.push(deepFreeze({
        market,year:current,reason:"CURRENT_YEAR_SEGMENTS_NOT_PHYSICALLY_ACCEPTED",
        observedState:state?.state||null,
      }));
      continue;
    }
    if(Number(state.completedThroughMonth||0)<1||!state.evidencePath){
      currentYearBlockers.push(deepFreeze({
        market,year:current,reason:"CURRENT_YEAR_SEGMENT_EVIDENCE_INCOMPLETE",
        observedState:state.state,
      }));
      continue;
    }
    currentYearAccepted.push(deepFreeze({...state,market,year:current}));
  }

  const annualReplayInputReady=annualBlockers.length===0;
  const presentScopeReady=annualReplayInputReady&&currentYearBlockers.length===0;
  const state=presentScopeReady
    ?"READY_PRESENT_SCOPE_WITH_EXPLICIT_REPLAY_DEBT"
    :annualReplayInputReady
      ?"ANNUAL_READY_CURRENT_YEAR_BLOCKED"
      :"BLOCKED_ANNUAL_COVERAGE";

  return deepFreeze({
    state,
    annualStartYear:start,
    annualThroughYear:through,
    currentYear:current,
    markets:Object.freeze([...markets]),
    annualReplayInputReady,
    presentScopeReady,
    annualAcceptedCount:annualAccepted.length,
    expectedAnnualMarketYearCount:(through-start+1)*markets.length,
    annualBlockers:Object.freeze(annualBlockers),
    currentYearBlockers:Object.freeze(currentYearBlockers),
    annualAccepted:Object.freeze(annualAccepted),
    currentYearAccepted:Object.freeze(currentYearAccepted),
    replayDebtCount:replayDebts.length,
    replayDebts:Object.freeze(replayDebts),
    fullReplayPolicy:"VERIFIED_INPUTS_ONLY_FAIL_CLOSED",
    partialReplayDebtMayNotBeRelabeledFull:true,
    system1AuthorityChanged:false,
    schemaVersion:"S2_HISTORICAL_REPLAY_INPUT_GATE_V0_1",
  });
}
