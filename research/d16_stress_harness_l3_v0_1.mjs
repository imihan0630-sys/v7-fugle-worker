import crypto from "node:crypto";

function stable(v){
  if(Array.isArray(v)) return v.map(stable);
  if(v && typeof v==="object") return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]));
  return v;
}
export const stableJson=(v)=>JSON.stringify(stable(v));
export const sha256=(v)=>crypto.createHash("sha256").update(typeof v==="string"?v:stableJson(v)).digest("hex");
function must(c,m){if(!c) throw new Error(m);}
function time(x,n){const t=Date.parse(x);must(Number.isFinite(t),`${n}_INVALID`);return t;}
function num(x,n){must(Number.isFinite(x),`${n}_INVALID`);}

function validateSnapshot(s){
  must(s?.market==="TW","MARKET_SCOPE_MUST_BE_TW");
  must(/^\d{4}-\d{2}-\d{2}$/.test(s.marketDate||""),"MARKET_DATE_INVALID");
  must(s.decisionTimestamp && s.snapshotHash && s.sourceCutHash && s.universeVersion,"SNAPSHOT_IDENTITY_INCOMPLETE");
  must(s.pointInTimeEligible===true,"SNAPSHOT_NOT_PIT_ELIGIBLE");
  must(Array.isArray(s.positions),"POSITIONS_REQUIRED");
  const seen=new Set();
  for(const p of s.positions){
    must(p?.symbol && p?.positionId && p?.sourceReceiptHash,"POSITION_IDENTITY_INCOMPLETE");
    must(!seen.has(p.positionId),"DUPLICATE_POSITION_ID");
    seen.add(p.positionId);
    num(p.weight,"POSITION_WEIGHT");
    num(p.betaToMarket,"BETA_TO_MARKET");
    num(p.sectorBeta,"SECTOR_BETA");
    num(p.liquidityShockSensitivity,"LIQUIDITY_SENSITIVITY");
    num(p.gapShockSensitivity,"GAP_SENSITIVITY");
    must(p.weight>=0 && p.weight<=1,"POSITION_WEIGHT_RANGE");
    must(p.exposureState==="KNOWN","UNKNOWN_EXPOSURE_FORBIDDEN");
  }
  const total=s.positions.reduce((a,p)=>a+p.weight,0);
  must(total<=1+1e-12,"TOTAL_WEIGHT_EXCEEDS_ONE");
  return total;
}

function validateScenario(sc,decisionTimestamp){
  must(sc?.scenarioId && sc?.scenarioVersion && sc?.scenarioHash,"SCENARIO_IDENTITY_INCOMPLETE");
  must(sc.registrationState==="PREREGISTERED_RESEARCH","SCENARIO_NOT_PREREGISTERED");
  must(sc.registeredAt && sc.availableAt,"SCENARIO_CLOCK_INCOMPLETE");
  must(time(sc.registeredAt,"SCENARIO_REGISTERED_AT")<=time(decisionTimestamp,"DECISION_TIMESTAMP"),"SCENARIO_REGISTERED_AFTER_DECISION");
  must(time(sc.availableAt,"SCENARIO_AVAILABLE_AT")<=time(decisionTimestamp,"DECISION_TIMESTAMP"),"SCENARIO_AVAILABLE_AFTER_DECISION");
  must(sc.outcomeSelected!==true,"OUTCOME_SELECTED_SCENARIO_FORBIDDEN");
  for(const k of ["marketShock","sectorShock","liquidityShock","gapShock"]) num(sc[k],k.toUpperCase());
  must(sc.marketShock<=0 && sc.sectorShock<=0 && sc.liquidityShock<=0 && sc.gapShock<=0,"ADVERSE_SHOCK_SIGN_INVALID");
  const expected=sha256({
    scenarioId:sc.scenarioId,
    scenarioVersion:sc.scenarioVersion,
    marketShock:sc.marketShock,
    sectorShock:sc.sectorShock,
    liquidityShock:sc.liquidityShock,
    gapShock:sc.gapShock,
  });
  must(sc.parameterHash===expected,"SCENARIO_PARAMETER_HASH_MISMATCH");
}

function shockedReturn(p,sc){
  return p.betaToMarket*sc.marketShock+
    p.sectorBeta*sc.sectorShock+
    p.liquidityShockSensitivity*sc.liquidityShock+
    p.gapShockSensitivity*sc.gapShock;
}

export function runStressScenario({snapshot,scenario}){
  const investedWeight=validateSnapshot(snapshot);
  validateScenario(scenario,snapshot.decisionTimestamp);
  const rows=snapshot.positions
    .map(p=>{
      const stressReturn=shockedReturn(p,scenario);
      return {
        positionId:p.positionId,
        symbol:p.symbol,
        weight:p.weight,
        sourceReceiptHash:p.sourceReceiptHash,
        stressReturn,
        weightedStressContribution:p.weight*stressReturn,
      };
    })
    .sort((a,b)=>a.symbol.localeCompare(b.symbol)||a.positionId.localeCompare(b.positionId));
  const portfolioStressReturn=rows.reduce((a,r)=>a+r.weightedStressContribution,0);
  const cashWeight=Math.max(0,1-investedWeight);
  const base={
    schemaVersion:"D16_STRESS_HARNESS_V0_1",
    market:"TW",
    marketDate:snapshot.marketDate,
    decisionTimestamp:snapshot.decisionTimestamp,
    snapshotHash:snapshot.snapshotHash,
    sourceCutHash:snapshot.sourceCutHash,
    universeVersion:snapshot.universeVersion,
    scenarioId:scenario.scenarioId,
    scenarioVersion:scenario.scenarioVersion,
    scenarioHash:scenario.scenarioHash,
    scenarioParameterHash:scenario.parameterHash,
    investedWeight,
    cashWeight,
    positionCount:rows.length,
    rows,
    portfolioStressReturn,
    currentOrFutureOutcomeAccessed:false,
    strategySelectionChanged:false,
    rankingChanged:false,
    capitalChanged:false,
    formalCoreChanged:false,
  };
  return {...base,receiptHash:sha256(base)};
}

export function reverseStressThreshold({snapshot,scenarioTemplate,lossLimit,shockScaleGrid,reverseRegistration}){
  validateSnapshot(snapshot);
  validateScenario(scenarioTemplate,snapshot.decisionTimestamp);
  must(Number.isFinite(lossLimit)&&lossLimit<0,"LOSS_LIMIT_INVALID");
  must(Array.isArray(shockScaleGrid)&&shockScaleGrid.length>=1,"SHOCK_SCALE_GRID_REQUIRED");
  const grid=[...new Set(shockScaleGrid)].sort((a,b)=>a-b);
  for(const x of grid) must(Number.isFinite(x)&&x>0,"SHOCK_SCALE_INVALID");
  must(reverseRegistration?.registrationState==="PREREGISTERED_RESEARCH","REVERSE_REGISTRATION_NOT_PREREGISTERED");
  must(reverseRegistration.registeredAt && reverseRegistration.availableAt,"REVERSE_REGISTRATION_CLOCK_INCOMPLETE");
  must(time(reverseRegistration.registeredAt,"REVERSE_REGISTERED_AT")<=time(snapshot.decisionTimestamp,"DECISION_TIMESTAMP"),"REVERSE_REGISTERED_AFTER_DECISION");
  must(time(reverseRegistration.availableAt,"REVERSE_AVAILABLE_AT")<=time(snapshot.decisionTimestamp,"DECISION_TIMESTAMP"),"REVERSE_AVAILABLE_AFTER_DECISION");
  must(reverseRegistration.outcomeSelected!==true,"OUTCOME_SELECTED_REVERSE_GRID_FORBIDDEN");
  const reverseExpectedHash=sha256({
    scenarioId:scenarioTemplate.scenarioId,
    scenarioVersion:scenarioTemplate.scenarioVersion,
    baseParameterHash:scenarioTemplate.parameterHash,
    lossLimit,
    shockScaleGrid:grid,
  });
  must(reverseRegistration.parameterHash===reverseExpectedHash,"REVERSE_PARAMETER_HASH_MISMATCH");
  const results=[];
  for(const scale of grid){
    const scaled={
      ...scenarioTemplate,
      marketShock:scenarioTemplate.marketShock*scale,
      sectorShock:scenarioTemplate.sectorShock*scale,
      liquidityShock:scenarioTemplate.liquidityShock*scale,
      gapShock:scenarioTemplate.gapShock*scale,
    };
    scaled.parameterHash=sha256({
      scenarioId:scaled.scenarioId,
      scenarioVersion:scaled.scenarioVersion,
      marketShock:scaled.marketShock,
      sectorShock:scaled.sectorShock,
      liquidityShock:scaled.liquidityShock,
      gapShock:scaled.gapShock,
    });
    scaled.scenarioHash=sha256({
      scenarioId:scaled.scenarioId,
      scenarioVersion:scaled.scenarioVersion,
      parameterHash:scaled.parameterHash,
      registeredAt:scaled.registeredAt,
      availableAt:scaled.availableAt,
    });
    const receipt=runStressScenario({snapshot,scenario:scaled});
    results.push({scale,portfolioStressReturn:receipt.portfolioStressReturn,receiptHash:receipt.receiptHash});
  }
  const breach=results.find(x=>x.portfolioStressReturn<=lossLimit)||null;
  const out={
    schemaVersion:"D16_REVERSE_STRESS_V0_1",
    snapshotHash:snapshot.snapshotHash,
    marketDate:snapshot.marketDate,
    lossLimit,
    shockScaleGrid:grid,
    results,
    firstBreachScale:breach?.scale??null,
    currentOrFutureOutcomeAccessed:false,
    reverseRegistrationHash:reverseRegistration.registrationHash || sha256(reverseRegistration),
    reverseParameterHash:reverseRegistration.parameterHash,
    thresholdTuningPerformed:false,
    formalCoreChanged:false,
  };
  return {...out,receiptHash:sha256(out)};
}
