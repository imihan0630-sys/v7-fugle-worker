import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { validateD18ObservableRegimeVectorV0_1 } from "./d18_observable_regime_vector_v0_1.mjs";

export const D18_REGIME_TRANSITION_VERSION = "D18_REGIME_TRANSITION_V0_1_RESEARCH";
const VECTOR_VERSION = "D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function validDate(value) {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;
}

function iso(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be ISO timestamp`);
  return new Date(text).toISOString();
}

function sourceHash(receipt) {
  return receipt?.receiptHash || null;
}

function transitionForDimension(prior, current, {
  vectorEvidenceValid = true,
  priorEvidenceValid = true,
  currentEvidenceValid = true,
} = {}) {
  if (!vectorEvidenceValid || !priorEvidenceValid || !currentEvidenceValid) {
    return deepFreeze({
      state: "UNKNOWN",
      priorState: prior?.state || "MISSING",
      currentState: current?.state || "MISSING",
      priorValue: prior?.value ?? null,
      currentValue: current?.value ?? null,
      reason: "DIMENSION_EVIDENCE_INVALID",
    });
  }
  if (!prior || !current) {
    return deepFreeze({
      state: "UNKNOWN",
      priorState: prior?.state || "MISSING",
      currentState: current?.state || "MISSING",
      priorValue: prior?.value ?? null,
      currentValue: current?.value ?? null,
      reason: "DIMENSION_MISSING",
    });
  }

  if (prior.state !== "KNOWN" || current.state !== "KNOWN") {
    return deepFreeze({
      state: "UNKNOWN",
      priorState: prior.state,
      currentState: current.state,
      priorValue: prior.value ?? null,
      currentValue: current.value ?? null,
      reason: "DIMENSION_NOT_DISCRETE_KNOWN_ON_BOTH_SIDES",
    });
  }

  return deepFreeze({
    state: prior.value === current.value ? "UNCHANGED" : "CHANGED",
    priorState: prior.state,
    currentState: current.state,
    priorValue: prior.value,
    currentValue: current.value,
    reason: null,
  });
}

export async function buildD18RegimeTransitionReceiptV0_1({
  receiptId,
  priorVector,
  currentVector,
  officialSessionDates,
  observedAt,
} = {}) {
  const id = requiredText(receiptId, "receiptId");
  if (!priorVector || !currentVector) throw new Error("priorVector and currentVector are required");
  if (priorVector.vectorVersion !== VECTOR_VERSION || currentVector.vectorVersion !== VECTOR_VERSION) {
    throw new Error("unsupported D18 observable vector version");
  }

  const priorDate = requiredText(priorVector.marketDate, "priorVector.marketDate");
  const currentDate = requiredText(currentVector.marketDate, "currentVector.marketDate");
  if (!validDate(priorDate) || !validDate(currentDate)) throw new Error("vector marketDate invalid");
  if (priorDate >= currentDate) throw new Error("priorVector must be earlier than currentVector");

  const priorClock = iso(priorVector.decisionTimestamp, "priorVector.decisionTimestamp");
  const currentClock = iso(currentVector.decisionTimestamp, "currentVector.decisionTimestamp");
  const at = iso(observedAt, "observedAt");

  if (Date.parse(priorClock) >= Date.parse(currentClock)) {
    throw new Error("decision clocks must be strictly increasing");
  }
  if (Date.parse(at) < Date.parse(currentClock)) {
    throw new Error("observedAt cannot be earlier than current decision clock");
  }
  const priorValidation = await validateD18ObservableRegimeVectorV0_1(priorVector);
  const currentValidation = await validateD18ObservableRegimeVectorV0_1(currentVector);
  const vectorEvidenceValid = priorValidation.valid === true && currentValidation.valid === true;

  if (!Array.isArray(officialSessionDates) || officialSessionDates.length < 2) {
    throw new Error("officialSessionDates requires at least two sessions");
  }
  const sessions=[...officialSessionDates].map(String);
  if (sessions.some((x)=>!validDate(x))) throw new Error("invalid official session date");
  if (new Set(sessions).size !== sessions.length) throw new Error("duplicate official session date");
  for(let i=1;i<sessions.length;i+=1){
    if(sessions[i] <= sessions[i-1]) throw new Error("officialSessionDates must be ascending");
  }
  const currentIndex=sessions.indexOf(currentDate);
  if(currentIndex<=0 || sessions[currentIndex-1]!==priorDate){
    throw new Error("prior/current vectors are not adjacent official sessions");
  }

  const dimensionKeys=[...new Set([
    ...Object.keys(priorVector.dimensions || {}),
    ...Object.keys(currentVector.dimensions || {}),
  ])].sort();

  const transitions=Object.fromEntries(
    dimensionKeys.map((key)=>[
      key,
      transitionForDimension(
        priorVector.dimensions?.[key],
        currentVector.dimensions?.[key],
        {
          vectorEvidenceValid,
          priorEvidenceValid: priorValidation.dimensions?.[key]?.valid === true,
          currentEvidenceValid: currentValidation.dimensions?.[key]?.valid === true,
        },
      ),
    ]),
  );

  const changedDimensionIds=dimensionKeys.filter((key)=>transitions[key].state==="CHANGED");
  const unchangedDimensionIds=dimensionKeys.filter((key)=>transitions[key].state==="UNCHANGED");
  const unknownDimensionIds=dimensionKeys.filter((key)=>transitions[key].state==="UNKNOWN");

  const base={
    receiptId:id,
    transitionVersion:D18_REGIME_TRANSITION_VERSION,
    priorMarketDate:priorDate,
    marketDate:currentDate,
    priorDecisionTimestamp:priorClock,
    decisionTimestamp:currentClock,
    observedAt:at,
    priorVectorHash:sourceHash(priorVector),
    currentVectorHash:sourceHash(currentVector),
    priorVectorEvidenceValid:priorValidation.valid === true,
    currentVectorEvidenceValid:currentValidation.valid === true,
    regimeEvidenceBlockers:Object.freeze([
      ...priorValidation.blockers.map((code)=>"PRIOR:"+code),
      ...currentValidation.blockers.map((code)=>"CURRENT:"+code),
    ]),
    state:vectorEvidenceValid?"KNOWN_TRANSITION_FRAME":"UNKNOWN_TRANSITION_FRAME",
    transitions:deepFreeze(transitions),
    summary:deepFreeze({
      dimensionCount:dimensionKeys.length,
      changedCount:changedDimensionIds.length,
      unchangedCount:unchangedDimensionIds.length,
      unknownCount:unknownDimensionIds.length,
      changedDimensionIds:Object.freeze(changedDimensionIds),
      unchangedDimensionIds:Object.freeze(unchangedDimensionIds),
      unknownDimensionIds:Object.freeze(unknownDimensionIds),
    }),
    transitionPolicyApplied:false,
    transitionThresholdApplied:false,
    smoothingApplied:false,
    retrospectiveRelabelApplied:false,
    strategyImpact:false,
    selectionImpact:false,
    capitalImpact:false,
    schemaVersion:D18_REGIME_TRANSITION_VERSION,
  };
  return deepFreeze({...base,receiptHash:await sha256Hex(base)});
}
