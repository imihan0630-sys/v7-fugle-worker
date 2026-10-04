import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const D18_WALK_FORWARD_PLAN_VERSION = "D18_WALK_FORWARD_PLAN_V0_1_RESEARCH";
const ATTRIBUTION_VERSION = "D18_REGIME_ATTRIBUTION_V0_1_RESEARCH";
const HORIZONS = new Set([1,3,5,10,20]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function validDate(value) {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && new Date(value+"T00:00:00Z").toISOString().slice(0,10)===value;
}

function iso(value, field) {
  const text=requiredText(value,field);
  if(!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be ISO timestamp`);
  return new Date(text).toISOString();
}

function inRange(date,start,end){ return date>=start && date<=end; }

function normalizeSessions(values){
  if(!Array.isArray(values) || !values.length) throw new Error("officialSessionDates must be non-empty");
  const xs=values.map(String);
  if(xs.some(x=>!validDate(x))) throw new Error("invalid official session date");
  if(new Set(xs).size!==xs.length) throw new Error("duplicate official session date");
  for(let i=1;i<xs.length;i+=1) if(xs[i]<=xs[i-1]) throw new Error("officialSessionDates must be ascending");
  return xs;
}

function normalizeFold(raw,index,sessions){
  const foldId=requiredText(raw?.foldId,`folds[${index}].foldId`);
  const fields=["trainStartDate","trainEndDate","testStartDate","testEndDate"];
  const out={foldId};
  for(const field of fields){
    const value=requiredText(raw?.[field],`folds[${index}].${field}`);
    if(!validDate(value)) throw new Error(`folds[${index}].${field} invalid`);
    if(!sessions.includes(value)) throw new Error(`folds[${index}].${field} not official session`);
    out[field]=value;
  }
  if(out.trainStartDate>out.trainEndDate) throw new Error("train interval invalid");
  if(out.testStartDate>out.testEndDate) throw new Error("test interval invalid");
  if(out.trainEndDate>=out.testStartDate) throw new Error("train must end before test starts");
  out.trainingKnowledgeCutoff=iso(raw.trainingKnowledgeCutoff,`folds[${index}].trainingKnowledgeCutoff`);
  out.evaluationAsOf=iso(raw.evaluationAsOf,`folds[${index}].evaluationAsOf`);
  if(Date.parse(out.trainingKnowledgeCutoff)>=Date.parse(out.evaluationAsOf)){
    throw new Error("trainingKnowledgeCutoff must be before evaluationAsOf");
  }
  return out;
}

function horizonOutcomeDate(date,h,sessions){
  const i=sessions.indexOf(date);
  if(i<0) return null;
  return sessions[i+h] ?? null;
}

function uniqueSorted(values){ return [...new Set(values)].sort(); }

function normalizeReceipt(receipt,expected){
  if(!receipt || typeof receipt!=="object") throw new Error("invalid attribution receipt");
  if(receipt.attributionVersion!==ATTRIBUTION_VERSION) throw new Error("unsupported attribution version");
  if(receipt.strategyId!==expected.strategyId) throw new Error("mixed strategyId");
  if(receipt.strategyVersion!==expected.strategyVersion) throw new Error("mixed strategyVersion");
  if(receipt.regimeVectorVersion!==expected.regimeVectorVersion) throw new Error("mixed regimeVectorVersion");
  if(Number(receipt.requestedHorizon)!==expected.requestedHorizon) throw new Error("mixed requestedHorizon");
  if((receipt.requestedCostScenarioId??null)!==(expected.costScenarioId??null)) throw new Error("mixed cost scenario");
  requiredText(receipt.receiptHash,"attribution.receiptHash");
  requiredText(receipt.decisionId,"attribution.decisionId");
  if(!validDate(receipt.marketDate)) throw new Error("attribution marketDate invalid");
  iso(receipt.decisionTimestamp,"attribution.decisionTimestamp");
  iso(receipt.outcomeUpdatedAt,"attribution.outcomeUpdatedAt");
  if(!["MATURED","IMMATURE","UNKNOWN"].includes(receipt.state)) throw new Error("unsupported attribution state");
  return receipt;
}

export async function buildD18WalkForwardPlanV0_1({
  planId,
  strategyId,
  strategyVersion,
  regimeVectorVersion,
  requestedHorizon,
  costScenarioId=null,
  officialSessionDates,
  attributionReceipts=[],
  folds=[],
  createdAt,
}={}) {
  const id=requiredText(planId,"planId");
  const sid=requiredText(strategyId,"strategyId");
  const sv=requiredText(strategyVersion,"strategyVersion");
  const rv=requiredText(regimeVectorVersion,"regimeVectorVersion");
  const h=Number(requestedHorizon);
  if(!HORIZONS.has(h)) throw new Error("requestedHorizon unsupported");
  const sessions=normalizeSessions(officialSessionDates);
  const at=iso(createdAt,"createdAt");
  if(!Array.isArray(attributionReceipts)) throw new Error("attributionReceipts must be array");
  if(!Array.isArray(folds) || !folds.length) throw new Error("folds must be non-empty array");

  const expected={strategyId:sid,strategyVersion:sv,regimeVectorVersion:rv,requestedHorizon:h,costScenarioId};
  const receipts=attributionReceipts.map(x=>normalizeReceipt(x,expected));
  const receiptIds=new Set();
  const decisionIds=new Set();
  for(const row of receipts){
    if(receiptIds.has(row.receiptHash)) throw new Error("duplicate attribution receiptHash");
    receiptIds.add(row.receiptHash);
    if(decisionIds.has(row.decisionId)) throw new Error("duplicate attribution decisionId");
    decisionIds.add(row.decisionId);
  }

  const normalizedFolds=folds.map((x,i)=>normalizeFold(x,i,sessions));
  for(let i=1;i<normalizedFolds.length;i+=1){
    if(normalizedFolds[i].testStartDate<=normalizedFolds[i-1].testEndDate){
      throw new Error("test folds must be chronological and non-overlapping");
    }
  }

  const outputs=[];
  for(const fold of normalizedFolds){
    const trainRaw=receipts.filter(r=>inRange(r.marketDate,fold.trainStartDate,fold.trainEndDate));
    const testRaw=receipts.filter(r=>inRange(r.marketDate,fold.testStartDate,fold.testEndDate));

    const trainRows=[];
    const purgedRows=[];
    const trainUnresolved=[];
    for(const row of trainRaw){
      const outcomeDate=horizonOutcomeDate(row.marketDate,h,sessions);
      if(outcomeDate===null || outcomeDate>=fold.testStartDate){
        purgedRows.push(row);
        continue;
      }
      if(row.state!=="MATURED" || Date.parse(row.outcomeUpdatedAt)>Date.parse(fold.trainingKnowledgeCutoff)){
        trainUnresolved.push(row);
        continue;
      }
      trainRows.push(row);
    }

    const testMatured=[];
    const testUnresolved=[];
    for(const row of testRaw){
      if(row.state==="MATURED" && Date.parse(row.outcomeUpdatedAt)<=Date.parse(fold.evaluationAsOf)){
        testMatured.push(row);
      }else{
        testUnresolved.push(row);
      }
    }

    const trainDates=uniqueSorted(trainRows.map(x=>x.marketDate));
    const testDates=uniqueSorted(testRaw.map(x=>x.marketDate));
    const testMaturedDates=uniqueSorted(testMatured.map(x=>x.marketDate));

    outputs.push(deepFreeze({
      foldId:fold.foldId,
      boundaries:deepFreeze({...fold}),
      counts:deepFreeze({
        trainCandidateRows:trainRaw.length,
        trainEligibleRows:trainRows.length,
        purgedRows:purgedRows.length,
        trainUnresolvedRows:trainUnresolved.length,
        testRows:testRaw.length,
        testMaturedRows:testMatured.length,
        testUnresolvedRows:testUnresolved.length,
        independentTrainDateN:trainDates.length,
        independentTestDateN:testDates.length,
        independentMaturedTestDateN:testMaturedDates.length,
      }),
      trainReceiptHashes:Object.freeze(trainRows.map(x=>x.receiptHash).sort()),
      purgedReceiptHashes:Object.freeze(purgedRows.map(x=>x.receiptHash).sort()),
      trainUnresolvedReceiptHashes:Object.freeze(trainUnresolved.map(x=>x.receiptHash).sort()),
      testReceiptHashes:Object.freeze(testRaw.map(x=>x.receiptHash).sort()),
      testMaturedReceiptHashes:Object.freeze(testMatured.map(x=>x.receiptHash).sort()),
      testUnresolvedReceiptHashes:Object.freeze(testUnresolved.map(x=>x.receiptHash).sort()),
      independentTrainDates:Object.freeze(trainDates),
      independentTestDates:Object.freeze(testDates),
      independentMaturedTestDates:Object.freeze(testMaturedDates),
    }));
  }

  const base={
    planId:id,
    version:D18_WALK_FORWARD_PLAN_VERSION,
    strategyId:sid,
    strategyVersion:sv,
    regimeVectorVersion:rv,
    requestedHorizon:h,
    costScenarioId,
    officialSessionStart:sessions[0],
    officialSessionEnd:sessions.at(-1),
    officialSessionCount:sessions.length,
    attributionReceiptCount:receipts.length,
    folds:Object.freeze(outputs),
    purgeSemantics:"REMOVE_TRAIN_DECISIONS_WHOSE_D+N_OUTCOME_SESSION_REACHES_OR_CROSSES_TEST_START",
    trainingKnowledgeSemantics:"OUTCOME_UPDATED_AT_MUST_BE_KNOWN_BY_FOLD_TRAINING_KNOWLEDGE_CUTOFF",
    evaluationSemantics:"TEST_OUTCOME_MAY_JOIN_ONLY_BY_FOLD_EVALUATION_AS_OF",
    rowPoolingAsIndependentEvidence:false,
    foldBoundaryChosenFromOutcome:false,
    thresholdTuningPerformed:false,
    policyOptimizationPerformed:false,
    modelSelectionPerformed:false,
    strategyImpact:false,
    selectionImpact:false,
    capitalImpact:false,
    createdAt:at,
    schemaVersion:D18_WALK_FORWARD_PLAN_VERSION,
  };
  return deepFreeze({...base,planHash:await sha256Hex(base)});
}
