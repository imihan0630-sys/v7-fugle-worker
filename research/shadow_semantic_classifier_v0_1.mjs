function numberOr(value,fallback=0) {
  const n=Number(value);
  return Number.isFinite(n)?n:fallback;
}

const SHADOW_SEMANTIC_POOLS=["GENERAL","THOUSAND"];
const SHADOW_FORMAL_COMPARATOR_KEYS=[
  "priorityScore","rewardPerRisk","marketConsensusScore",
  "setupQuality","sectorFlow","relativeStrength"
];

function compareDecisionState(a,b) {
  for(const key of SHADOW_FORMAL_COMPARATOR_KEYS) {
    const delta=numberOr(b?.ranking?.[key])-numberOr(a?.ranking?.[key]);
    if(Math.abs(delta)>1e-12) return delta;
  }
  return String(a?.symbol||"").localeCompare(String(b?.symbol||""));
}

function semanticMemberships(state) {
  const memberships=[];
  if(state?.selected===true) memberships.push("FORMAL_SELECTED");
  if(state?.formalOk===true && state?.selected!==true) memberships.push("FORMAL_QUALIFIED_NOT_SELECTED");
  if(state?.firstFailure) memberships.push(state?.basePassed===true?"DOWNSTREAM_FIRST_FAILURE":"BASE_FIRST_FAILURE");
  if(state?.channelNearMiss===true) memberships.push("CHANNEL_NEAR_MISS");
  if(state?.dataReadinessFailure===true) memberships.push("DATA_READINESS_FAILURE");
  if(state?.universePolicyExcluded===true) memberships.push("UNIVERSE_POLICY_EXCLUDED");
  if(state?.broadFrameEligible===true) memberships.push("BROAD_MARKET_FRAME_ELIGIBLE");
  if(!memberships.length) memberships.push("UNKNOWN_SEMANTIC_STATE");
  return memberships;
}

export function classifyShadowSemanticPopulation({scanDate,decisionStates=[]}={}) {
  const seen=new Set();
  const rows=[];
  for(const state of Array.isArray(decisionStates)?decisionStates:[]) {
    const symbol=String(state?.symbol||"");
    if(!symbol || seen.has(symbol)) throw new Error("duplicate-or-empty-symbol:"+symbol);
    seen.add(symbol);
    const pool=SHADOW_SEMANTIC_POOLS.includes(state?.pool)?state.pool:"UNKNOWN";
    rows.push({
      ...state,
      symbol,
      pool,
      memberships:semanticMemberships(state),
      formalPoolRank:null
    });
  }

  for(const pool of SHADOW_SEMANTIC_POOLS) {
    const ranked=rows.filter(row=>row.pool===pool && row.formalOk===true).sort(compareDecisionState);
    ranked.forEach((row,index)=>{row.formalPoolRank=index+1;});
  }

  const byMembership={},byPool={};
  for(const row of rows) {
    byPool[row.pool]=(byPool[row.pool]||0)+1;
    for(const membership of row.memberships) {
      byMembership[membership]=(byMembership[membership]||0)+1;
    }
  }

  return {
    schemaVersion:"shadow-semantic-classifier-v0.1",
    scanDate:String(scanDate||""),
    rows,
    counts:{total:rows.length,byMembership,byPool},
    comparatorVersion:"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30",
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };
}

export function sampleMembership(population,membership,cap=6) {
  const safeCap=Math.max(0,Math.floor(Number(cap)||0));
  return (population?.rows||[])
    .filter(row=>Array.isArray(row.memberships)&&row.memberships.includes(membership))
    .slice()
    .sort((a,b)=>String(a.symbol).localeCompare(String(b.symbol)))
    .slice(0,safeCap);
}


function stableHash32(text){
  let h=2166136261>>>0;
  for(const ch of String(text)){
    h^=ch.codePointAt(0);
    h=Math.imul(h,16777619)>>>0;
  }
  return h>>>0;
}

const SAFE_STRATUM_KEYS=new Set(["pool","nearestChannel","checkPattern"]);

function safeStratum(row,keys){
  return keys.map(key=>{
    if(!SAFE_STRATUM_KEYS.has(key)) throw new Error("unsafe-or-unregistered-stratum-key:"+key);
    const value=String(row?.[key]??"UNKNOWN");
    return key+"="+value;
  }).join("|");
}

/**
 * Promotion-grade research sampler prototype.
 * Semantic population must already be frozen. This function samples membership rows only;
 * it never changes memberships or denominators.
 *
 * Allowed preregistered strata are deliberately narrow and outcome-free:
 * pool, nearestChannel, checkPattern.
 */
export function sampleMembershipV2(population,membership,{
  capPerStratum=6,
  stratumKeys=["pool"],
  samplingRuleVersion="SEMANTIC_STRATIFIED_HASH_V0_2"
}={}){
  const safeCap=Math.max(0,Math.floor(Number(capPerStratum)||0));
  const keys=Array.isArray(stratumKeys)?stratumKeys.map(String):["pool"];
  if(!keys.length) throw new Error("empty-stratum-keys");
  for(const key of keys) if(!SAFE_STRATUM_KEYS.has(key)) throw new Error("unsafe-or-unregistered-stratum-key:"+key);

  if(membership==="CHANNEL_NEAR_MISS"){
    const required=["pool","nearestChannel","checkPattern"];
    if(required.some(key=>!keys.includes(key))) {
      throw new Error("channel-near-miss-requires-pool-nearestChannel-checkPattern-strata");
    }
  }

  const eligible=(population?.rows||[])
    .filter(row=>Array.isArray(row.memberships)&&row.memberships.includes(membership));

  const buckets=new Map();
  for(const row of eligible){
    const stratum=safeStratum(row,keys);
    const arr=buckets.get(stratum)||[];
    arr.push(row);
    buckets.set(stratum,arr);
  }

  const scanDate=String(population?.scanDate||"");
  const strata=[];
  const sampledRows=[];
  for(const stratum of [...buckets.keys()].sort()){
    const rows=buckets.get(stratum).slice();
    rows.sort((a,b)=>{
      const ah=stableHash32([samplingRuleVersion,scanDate,membership,stratum,a.symbol].join("|"));
      const bh=stableHash32([samplingRuleVersion,scanDate,membership,stratum,b.symbol].join("|"));
      return ah-bh || String(a.symbol).localeCompare(String(b.symbol));
    });
    const sampled=rows.slice(0,safeCap);
    sampledRows.push(...sampled.map(row=>({...row,sampleMembershipMeta:{
      membership,stratum,samplingRuleVersion,semanticPopulationCount:rows.length,
      sampledCount:sampled.length,capPerStratum:safeCap,
      samplingFraction:rows.length?sampled.length/rows.length:0
    }})));
    strata.push({
      stratum,semanticPopulationCount:rows.length,sampledCount:sampled.length,
      capPerStratum:safeCap,samplingFraction:rows.length?sampled.length/rows.length:0
    });
  }

  return {
    schemaVersion:"shadow-membership-sample-v0.2",
    scanDate,
    membership,
    stratumKeys:keys,
    samplingRuleVersion,
    semanticPopulationCount:eligible.length,
    sampledCount:sampledRows.length,
    rows:sampledRows,
    strata,
    policy:"Semantic membership and denominators are frozen before sampling. Hash order is outcome-free and input-order invariant. CHANNEL_NEAR_MISS must stratify by pool x nearestChannel x checkPattern.",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}
