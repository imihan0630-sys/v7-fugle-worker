import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const SYSTEM2_POLICY_FINGERPRINT_VERSION_V0_1 = "0.1";
export const SYSTEM2_POLICY_FINGERPRINT_EFFECTIVE_AT_V0_1 = "2026-10-07T09:00:23+08:00";

const SOURCE_ARTIFACTS = Object.freeze([
  { path:"system2/runtime/strategy_contracts_v0_1.mjs", contentSha:"2a5038ce2310aa18035e691db1a3bee7d5b22ae5" },
  { path:"system2/runtime/stage1_assessor_policies_v0_1.mjs", contentSha:"694a46e13b02b7b9df0a9242eb9e3a3932769c0a" },
  { path:"system2/runtime/daily_shadow_assessor_readiness_v0_1.mjs", contentSha:"bf0dc9e6dac11fc22beaf28506597c471211c35c" },
  { path:"system2/runtime/daily_shadow_orchestrator_v0_1.mjs", contentSha:"79bebce21cca3cdf3b40affd6043ffa6b1f84c0e" },
  { path:"system2/runtime/daily_shadow_a1_source_v0_1.mjs", contentSha:"995ac5f592bca08a28046482426eab0bbec6d493" },
  { path:"system2/runtime/daily_shadow_history_reader_v0_1.mjs", contentSha:"47bbdc3d5ca518dc7f79ba5505aeaea145ebecf1" },
  { path:"system2/runtime/strategy_local_ranking_baseline.mjs", contentSha:"f31194bd6fc95f79b479cb770526bb1ac44f20e5" },
  { path:"system2/runtime/daily_shadow_capacity_orchestrator_v0_1.mjs", contentSha:"d8fc51cae6b4b62efb7de32ee13a89556b3ad742" },
  { path:"system2/runtime/candidate_capacity.mjs", contentSha:"7d56833bbefe6ed82e8181425ff1fd4b930e427e" },
  { path:"system2/runtime/candidate_lifecycle.mjs", contentSha:"61d0f694dc5bd338f5f1d0c73a6b59a02bfd57fd" },
  { path:"system2/SYSTEM2_STAGE1_ASSESSOR_POLICY_FREEZE_V0_1.md", contentSha:"4275fd5539bf0dff4ff2106e774f0e5800e3a435" },
]);

const LIFECYCLE_STATES = Object.freeze([
  "DISCOVERED","WATCH","CANDIDATE","ACTIVE_INTRADAY_MONITOR","ENTRY_ZONE",
  "TRIGGER_READY","SIM_FILLED","POSITION_MONITOR","THESIS_WEAKENING",
  "INVALIDATED","EXPIRED","REMOVED",
]);

const BASE = Object.freeze({
  systemId:"SYSTEM2",
  effectiveAt:SYSTEM2_POLICY_FINGERPRINT_EFFECTIVE_AT_V0_1,
  decisionClockRole:"AFTER_MARKET_STAGE1_SHADOW_ASSESSMENT",
  authorityState:"RESEARCH_SHADOW",
  sourceArtifacts:SOURCE_ARTIFACTS,
  candidateUniverseMode:"NOT_PHYSICALLY_PROVEN",
  candidateUniverseSourceRefs:Object.freeze([
    "SYSTEM2_A1_FULL_MARKET_CURRENT_SNAPSHOT",
    "SYSTEM2_PIT_A1_HISTORY",
    "SYSTEM2_STRATEGY_LOCAL_ASSESSMENT",
  ]),
  requiresOtherSystemCandidateOutput:false,
  requiresOtherSystemRankOutput:false,
  capacityPolicy:deepFreeze({
    policyId:"S2_DAILY_SHADOW_CAPACITY_ORCHESTRATION_V0_1",
    policyVersion:"0.1-RESEARCH",
    globalMax:12,
    perStrategyActiveMonitorMax:3,
    forcedFill:false,
    implicitGlobalUniversalScore:false,
    newAdmissionState:"BUY_ELIGIBLE",
    entryProximateStates:["NEAR_ENTRY","ACTIVE_ENTRY_MONITOR","BUY_ELIGIBLE"],
    crossStrategyGlobalPriorityState:"UNRESOLVED_FAIL_CLOSED",
  }),
  lifecyclePolicy:deepFreeze({
    policyId:"S2_CANDIDATE_LIFECYCLE_V0_1",
    policyVersion:"0.1",
    states:LIFECYCLE_STATES,
    positionMonitorManagedOutsideCandidateCapacity:true,
  }),
  unknownSemantics:"UNKNOWN is distinct from FAIL and zero. Missing required evidence resolves to INCOMPLETE/BLOCKED; unresolved denominator state cannot become a clean zero-pick; missing physical candidate-source proof remains NOT_PHYSICALLY_PROVEN.",
  formalMutation:false,
});

const SPECS = deepFreeze({
  SHORT_MOMENTUM:{
    fingerprintId:"SYSTEM2:SHORT_MOMENTUM:STAGE1:2026-10-07:V0.1",
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:"V0.1-CONTRACT",
    policyId:"S2-ASSESSOR-SM-LAUNCH-001",
    policyVersion:"0.1-LAUNCH",
    gateFamilyIds:[
      "PRIMARY:TECHNICAL_STRUCTURE",
      "PRIMARY:PRICE_VOLUME",
      "PRIMARY:MARKET_REGIME",
      "SUPPORTIVE:CAPITAL_FLOW",
      "REQUIRED:RISK_FRICTION",
      "CONTEXT_ONLY:FUNDAMENTAL_QUALITY",
      "HARD_INVALIDATION:FAILED_BREAKOUT",
      "HARD_INVALIDATION:BROKEN_ACTIVE_STRUCTURE",
      "HARD_INVALIDATION:SEVERE_ILLIQUIDITY",
      "HARD_INVALIDATION:MATERIAL_ADVERSE_EVENT",
    ],
    requiredEvidenceFamilies:["TECHNICAL_STRUCTURE","PRICE_VOLUME","RISK_FRICTION"],
    supportiveEvidenceFamilies:["MARKET_REGIME","CAPITAL_FLOW"],
    contextEvidenceFamilies:["FUNDAMENTAL_QUALITY","EVENT_CATALYST"],
    informationRoots:[
      "PRICE_OHLC",
      "VOLUME_TURNOVER",
      "PIT_A1_HISTORY",
      "MARKET_REGIME",
      "INSTITUTIONAL_FLOW",
      "FUNDAMENTAL_MATERIAL_RISK",
    ],
    rankingPolicy:{
      rankingPolicyId:"SM-PARETO-BASELINE",
      rankingPolicyVersion:"0.1",
      rankingMechanism:"STRATEGY_LOCAL_PARETO",
      orderedComparatorFields:["PARETO:TECHNICAL_STRUCTURE","PARETO:PRICE_VOLUME","PARETO:RISK_FRICTION","NEUTRAL_HASH_TIEBREAK"],
    },
    entryConfirmationPolicy:{
      policyId:"S2-ASSESSOR-SM-LAUNCH-001",
      policyVersion:"0.1-LAUNCH",
      launchSetup:"BREAKOUT_CONTINUATION",
      readinessStates:["WATCH","ACTIVE_ENTRY_MONITOR","BUY_ELIGIBLE"],
      system1Formal15mGateRequired:false,
      finalSelectionAuthority:false,
    },
    primaryHorizonSessions:[1,3,5,10],
    notes:[
      "P0 launch fingerprint only; candidate source physical independence remains NOT_PHYSICALLY_PROVEN until NC-T01.",
      "No weighted total score and no System1 A/B, Top6, rank, or Formal comparator dependency.",
      "BREAKOUT_CONTINUATION is the first source-complete launch mapping; pullback/reacceleration remains non-promoted.",
    ],
  },
  SWING_GROWTH:{
    fingerprintId:"SYSTEM2:SWING_GROWTH:STAGE1:2026-10-07:V0.1",
    strategyId:"SWING_GROWTH",
    strategyVersion:"V0.1-CONTRACT",
    policyId:"S2-ASSESSOR-SG-LAUNCH-001",
    policyVersion:"0.1-LAUNCH",
    gateFamilyIds:[
      "PRIMARY:INDUSTRY_THESIS",
      "PRIMARY:FUNDAMENTAL_QUALITY",
      "PRIMARY:EVENT_CATALYST",
      "REQUIRED:VALUATION",
      "SUPPORTIVE:TECHNICAL_STRUCTURE",
      "SUPPORTIVE:PRICE_VOLUME",
      "SUPPORTIVE:CHIP_OWNERSHIP",
      "HARD_INVALIDATION:GROWTH_PATH_FAILURE",
      "HARD_INVALIDATION:CYCLE_REVERSAL",
      "HARD_INVALIDATION:MAJOR_CUSTOMER_PRODUCT_FAILURE",
      "HARD_INVALIDATION:PIT_SOURCE_FAILURE",
    ],
    requiredEvidenceFamilies:["INDUSTRY_THESIS","FUNDAMENTAL_QUALITY"],
    supportiveEvidenceFamilies:["EVENT_CATALYST","TECHNICAL_STRUCTURE","PRICE_VOLUME","CHIP_OWNERSHIP"],
    contextEvidenceFamilies:["VALUATION","MARKET_REGIME"],
    informationRoots:[
      "OFFICIAL_FUNDAMENTAL_FILINGS",
      "INDUSTRY_SUPPLY_DEMAND",
      "OFFICIAL_EVENT_DISCLOSURES",
      "OFFICIAL_VALUATION",
      "PRICE_OHLC",
      "VOLUME_TURNOVER",
      "CHIP_OWNERSHIP_INSTITUTIONAL_FLOW",
    ],
    rankingPolicy:{
      rankingPolicyId:"SG-PARETO-BASELINE",
      rankingPolicyVersion:"0.1",
      rankingMechanism:"STRATEGY_LOCAL_PARETO",
      orderedComparatorFields:["PARETO:FUNDAMENTAL_QUALITY","PARETO:INDUSTRY_THESIS","NEUTRAL_HASH_TIEBREAK"],
    },
    entryConfirmationPolicy:{
      policyId:"S2-ASSESSOR-SG-LAUNCH-001",
      policyVersion:"0.1-LAUNCH",
      launchSetup:"PIT_GROWTH_THESIS_PLUS_A1_TIMING",
      readinessStates:["WATCH","BUY_ELIGIBLE"],
      system1Formal15mGateRequired:false,
      finalSelectionAuthority:false,
    },
    primaryHorizonSessions:[10,20,40,60],
    notes:[
      "P0 launch fingerprint only; candidate source physical independence remains NOT_PHYSICALLY_PROVEN until NC-T01.",
      "Industry and fundamental thesis must be PIT-valid upstream assessments; A1 timing cannot manufacture the growth thesis.",
      "No universal cross-strategy score and no System1 Top6/rank prerequisite.",
    ],
  },
});

function requiredText(value,field){
  if(typeof value!=="string"||!value.trim()) throw new Error(field+" is required");
  return value.trim();
}
function generatedTimestamp(value){
  const text=requiredText(value,"generatedAt");
  if(!Number.isFinite(Date.parse(text))) throw new Error("generatedAt must be ISO");
  return new Date(text).toISOString();
}

export async function buildSystem2StrategyPolicyFingerprintV0_1({
  strategyId,
  generatedAt,
}={}){
  const id=requiredText(strategyId,"strategyId");
  const spec=SPECS[id];
  if(!spec) throw new Error("unsupported System2 fingerprint strategy: "+id);
  const hashBase={
    schemaVersion:"CROSS_SYSTEM_POLICY_FINGERPRINT_RECEIPT_V0_1",
    systemId:BASE.systemId,
    strategyId:spec.strategyId,
    strategyVersion:spec.strategyVersion,
    policyId:spec.policyId,
    policyVersion:spec.policyVersion,
    effectiveAt:BASE.effectiveAt,
    decisionClockRole:BASE.decisionClockRole,
    authorityState:BASE.authorityState,
    sourceArtifacts:BASE.sourceArtifacts,
    candidateUniverseMode:BASE.candidateUniverseMode,
    candidateUniverseSourceRefs:BASE.candidateUniverseSourceRefs,
    requiresOtherSystemCandidateOutput:BASE.requiresOtherSystemCandidateOutput,
    requiresOtherSystemRankOutput:BASE.requiresOtherSystemRankOutput,
    gateFamilyIds:Object.freeze([...spec.gateFamilyIds]),
    requiredEvidenceFamilies:Object.freeze([...spec.requiredEvidenceFamilies]),
    supportiveEvidenceFamilies:Object.freeze([...spec.supportiveEvidenceFamilies]),
    contextEvidenceFamilies:Object.freeze([...spec.contextEvidenceFamilies]),
    informationRoots:Object.freeze([...spec.informationRoots]),
    rankingPolicy:deepFreeze({...spec.rankingPolicy}),
    capacityPolicy:BASE.capacityPolicy,
    entryConfirmationPolicy:deepFreeze({...spec.entryConfirmationPolicy}),
    lifecyclePolicy:BASE.lifecyclePolicy,
    primaryHorizonSessions:Object.freeze([...spec.primaryHorizonSessions]),
    unknownSemantics:BASE.unknownSemantics,
    formalMutation:false,
    notes:Object.freeze([...spec.notes]),
    fingerprintId:spec.fingerprintId,
  };
  const fingerprintHash=await sha256Hex(hashBase);
  return deepFreeze({
    ...hashBase,
    fingerprintHash,
    generatedAt:generatedTimestamp(generatedAt),
  });
}

export async function buildStage1System2PolicyFingerprintSetV0_1({generatedAt}={}){
  const shortMomentum=await buildSystem2StrategyPolicyFingerprintV0_1({strategyId:"SHORT_MOMENTUM",generatedAt});
  const swingGrowth=await buildSystem2StrategyPolicyFingerprintV0_1({strategyId:"SWING_GROWTH",generatedAt});
  return deepFreeze({
    schemaVersion:"S2_STAGE1_POLICY_FINGERPRINT_SET_V0_1",
    version:SYSTEM2_POLICY_FINGERPRINT_VERSION_V0_1,
    generatedAt:generatedTimestamp(generatedAt),
    fingerprints:Object.freeze([shortMomentum,swingGrowth]),
    sda022:{
      S22_T06:true,
      S22_T07:true,
      S22_T08:true,
      S22_T09:true,
      S22_T10:true,
      physicalIndependentDiscovery:false,
      ncT01Required:true,
    },
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}

export function system2PolicyFingerprintSourceArtifactsV0_1(){
  return SOURCE_ARTIFACTS;
}
