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
