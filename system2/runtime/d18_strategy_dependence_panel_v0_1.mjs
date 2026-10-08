import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const D18_STRATEGY_DEPENDENCE_PANEL_VERSION = "D18_STRATEGY_DEPENDENCE_PANEL_V0_1_RESEARCH";
const METRICS = new Set(["GROSS_RETURN","RELATIVE_BENCHMARK_RETURN"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}
function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d=new Date(value+"T00:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10)===value;
}
function sortedUnique(values) {
  return [...new Set(values)].sort();
}
function mean(xs) {
  return xs.reduce((a,b)=>a+b,0)/xs.length;
}

export async function buildD18StrategyDependencePanelV0_1({
  panelId,
  horizon,
  metric,
  expectedStrategies,
  includedCandidateStates,
  attributionObservations,
  createdAt,
} = {}) {
  const id=requiredText(panelId,"panelId");
  const h=Number(horizon);
  if (![1,3,5,10,20].includes(h)) throw new Error("horizon must be one of 1,3,5,10,20");
  const metricId=requiredText(metric,"metric");
  if(!METRICS.has(metricId)) throw new Error("unsupported metric");

  if(!Array.isArray(expectedStrategies) || expectedStrategies.length<2) {
    throw new Error("expectedStrategies must contain at least two strategies");
  }
  const strategies=expectedStrategies.map((x,i)=>({
    strategyId:requiredText(x?.strategyId,`expectedStrategies[${i}].strategyId`),
    strategyVersion:requiredText(x?.strategyVersion,`expectedStrategies[${i}].strategyVersion`),
  }));
  const strategyKeys=strategies.map(x=>`${x.strategyId}@${x.strategyVersion}`);
  if(new Set(strategyKeys).size!==strategyKeys.length) throw new Error("duplicate expected strategy");

  if(!Array.isArray(includedCandidateStates) || !includedCandidateStates.length) {
    throw new Error("includedCandidateStates must be non-empty");
  }
  const candidateStates=sortedUnique(includedCandidateStates.map(String));

  if(!Array.isArray(attributionObservations)) throw new Error("attributionObservations must be an array");
  const expected=new Set(strategyKeys);
  const seenDecisionIds=new Set();
  const accepted=[];
  const observedDateKeys=new Set();
  const excludedByDateStrategy=new Map();

  for(const [i,row] of attributionObservations.entries()){
    if(!row || typeof row!=="object") throw new Error(`attributionObservations[${i}] must be object`);
    if(row.semantics!=="DESCRIPTIVE_REGIME_ATTRIBUTION_NOT_POLICY_VALUE") {
      throw new Error("attribution semantics mismatch");
    }
    if(row.policyValueEstimated!==false || row.causalClaimMade!==false) {
      throw new Error("policy/causal attribution may not enter dependence panel");
    }
    if(Number(row.horizon)!==h) throw new Error("mixed attribution horizons");
    if(!validDate(row.marketDate)) throw new Error("invalid attribution marketDate");
    const key=`${requiredText(row.strategyId,"attribution.strategyId")}@${requiredText(row.strategyVersion,"attribution.strategyVersion")}`;
    if(!expected.has(key)) throw new Error(`unexpected strategy: ${key}`);
    const decisionId=requiredText(row.decisionId,"attribution.decisionId");
    if(seenDecisionIds.has(decisionId)) throw new Error(`duplicate decisionId: ${decisionId}`);
    seenDecisionIds.add(decisionId);
    if(!candidateStates.includes(requiredText(row.candidateState,"attribution.candidateState"))) continue;

    observedDateKeys.add(row.marketDate);
    if(row.state!=="KNOWN" || row.regimeEvidenceValid!==true) {
      const mapKey=`${row.marketDate}|${key}`;
      if(!excludedByDateStrategy.has(mapKey)) excludedByDateStrategy.set(mapKey,[]);
      excludedByDateStrategy.get(mapKey).push({
        decisionId,
        state:row.state || "UNKNOWN",
        regimeEvidenceValid:row.regimeEvidenceValid===true,
        blockers:[...(row.regimeEvidenceBlockers || [])].map(String),
      });
      continue;
    }

    const value=metricId==="GROSS_RETURN" ? row.grossReturn : row.relativeBenchmarkReturn;
    if(value===null || value===undefined || !Number.isFinite(Number(value))) {
      throw new Error("selected attribution metric must be finite");
    }
    accepted.push({
      strategyKey:key,
      strategyId:row.strategyId,
      strategyVersion:row.strategyVersion,
      decisionId,
      symbol:requiredText(row.symbol,"attribution.symbol"),
      marketDate:row.marketDate,
      value:Number(value),
      attributionReceiptHash:requiredText(row.receiptHash,"attribution.receiptHash"),
    });
  }

  const dates=sortedUnique([...observedDateKeys]);
  const grouped=new Map();
  for(const row of accepted){
    const k=`${row.marketDate}|${row.strategyKey}`;
    if(!grouped.has(k)) grouped.set(k,[]);
    grouped.get(k).push(row);
  }

  const dateRows=dates.map(date=>{
    const cells={};
    for(const strategy of strategies){
      const key=`${strategy.strategyId}@${strategy.strategyVersion}`;
      const rows=grouped.get(`${date}|${key}`) || [];
      if(!rows.length){
        const excluded=excludedByDateStrategy.get(`${date}|${key}`) || [];
        cells[key]={
          state:"MISSING",
          value:null,
          decisionCount:0,
          symbolCount:0,
          reason:excluded.length
            ? "REGIME_EVIDENCE_UNKNOWN_OR_INVALID"
            : "NO_KNOWN_ATTRIBUTION_ROW",
          excludedDecisionIds:Object.freeze(excluded.map(x=>x.decisionId)),
          regimeEvidenceBlockers:Object.freeze(
            sortedUnique(excluded.flatMap(x=>x.blockers)),
          ),
        };
        continue;
      }
      cells[key]={
        state:"KNOWN",
        value:mean(rows.map(x=>x.value)),
        decisionCount:rows.length,
        symbolCount:new Set(rows.map(x=>x.symbol)).size,
        aggregation:"EQUAL_WEIGHT_DECISION_RETURN",
        attributionReceiptHashes:sortedUnique(rows.map(x=>x.attributionReceiptHash)),
      };
    }
    return deepFreeze({marketDate:date,cells:deepFreeze(cells)});
  });

  const pairwise=[];
  for(let i=0;i<strategyKeys.length;i++){
    for(let j=i+1;j<strategyKeys.length;j++){
      const a=strategyKeys[i], b=strategyKeys[j];
      const common=dateRows.filter(r=>r.cells[a].state==="KNOWN" && r.cells[b].state==="KNOWN");
      pairwise.push(deepFreeze({
        strategyA:a,
        strategyB:b,
        commonDateCount:common.length,
        commonDates:Object.freeze(common.map(r=>r.marketDate)),
        pairedReturns:Object.freeze(common.map(r=>({
          marketDate:r.marketDate,
          a:r.cells[a].value,
          b:r.cells[b].value,
        }))),
        correlationEstimated:false,
        diversificationClaimMade:false,
        reason:"COMMON_SUPPORT_FRAME_ONLY",
      }));
    }
  }

  const base={
    panelId:id,
    version:D18_STRATEGY_DEPENDENCE_PANEL_VERSION,
    horizon:h,
    metric:metricId,
    expectedStrategies:Object.freeze(strategies),
    includedCandidateStates:Object.freeze(candidateStates),
    acceptedAttributionCount:accepted.length,
    excludedRegimeEvidenceCount:[...excludedByDateStrategy.values()].reduce((sum,rows)=>sum+rows.length,0),
    regimeEvidenceRequired:true,
    independentDateCount:dates.length,
    dateRows:Object.freeze(dateRows),
    pairwise:Object.freeze(pairwise),
    missingReturnImputedAsZero:false,
    stockRowsTreatedAsIndependentStrategyDates:false,
    correlationEstimated:false,
    ensembleWeightsEstimated:false,
    diversificationClaimMade:false,
    policyApplied:false,
    selectionImpact:false,
    capitalImpact:false,
    createdAt:requiredText(createdAt,"createdAt"),
    schemaVersion:D18_STRATEGY_DEPENDENCE_PANEL_VERSION,
  };
  const panelHash=await sha256Hex(base);
  return deepFreeze({...base,panelHash});
}
