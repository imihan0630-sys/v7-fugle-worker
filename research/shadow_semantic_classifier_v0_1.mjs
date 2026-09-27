function numberOr(value,fallback=0) {
  const n=Number(value);
  return Number.isFinite(n)?n:fallback;
}

const SHADOW_SEMANTIC_POOLS=["GENERAL","THOUSAND"];
const SHADOW_FORMAL_COMPARATOR_KEYS=[
  "priorityScore","rewardPerRisk","marketConsensusScore",
  "setupQuality","sectorFlow","relativeStrength"
];

function comparatorOnlyDelta(a,b) {
  for(const key of SHADOW_FORMAL_COMPARATOR_KEYS) {
    const delta=numberOr(b?.ranking?.[key])-numberOr(a?.ranking?.[key]);
    if(Math.abs(delta)>1e-12) return delta;
  }
  return 0;
}

function validPreSortOrdinal(row){
  const raw=row?.preSortOrdinal;
  if(raw===null||raw===undefined||raw==="") return null;
  const n=Number(raw);
  return Number.isInteger(n)&&n>=0?n:null;
}

function rankingInputsComplete(row){
  return SHADOW_FORMAL_COMPARATOR_KEYS.every(key=>{
    const raw=row?.ranking?.[key];
    return raw!==null&&raw!==undefined&&raw!==""&&Number.isFinite(Number(raw));
  });
}

function compareDecisionState(a,b) {
  const delta=comparatorOnlyDelta(a,b);
  if(Math.abs(delta)>1e-12) return delta;
  const ao=validPreSortOrdinal(a),bo=validPreSortOrdinal(b);
  if(ao!==null&&bo!==null&&ao!==bo) return ao-bo;
  // Current Formal comparator has no symbol fallback. Returning zero preserves
  // input order under stable sort, but that order is not replay-certifiable
  // after persistence unless preSortOrdinal/tie lineage is captured.
  return 0;
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
      observedPoolRank:null,
      formalPoolRank:null,
      rankCertification:null,
      tieGroupSize:null
    });
  }

  for(const pool of SHADOW_SEMANTIC_POOLS) {
    const poolRows=rows.filter(row=>row.pool===pool && row.formalOk===true);
    const poolInputsComplete=poolRows.every(rankingInputsComplete);
    const ranked=poolRows.slice().sort(compareDecisionState);
    ranked.forEach((row,index)=>{row.observedPoolRank=index+1;});

    // Exact absolute pool ranks are a joint property. If even one Formal-qualified
    // competitor has an incomplete comparator tuple, its unknown value can move
    // ahead of otherwise complete rows. Therefore no row in that pool may claim
    // an exact formalPoolRank until the whole qualified pool is comparator-complete.
    if(!poolInputsComplete){
      for(const row of ranked){
        row.rankCertification="POOL_RANK_INPUT_INCOMPLETE";
        row.formalPoolRank=null;
        row.tieGroupSize=null;
      }
      continue;
    }

    let start=0;
    while(start<ranked.length){
      let end=start+1;
      while(end<ranked.length && comparatorOnlyDelta(ranked[start],ranked[end])===0) end+=1;
      const group=ranked.slice(start,end);
      const tieGroupSize=group.length;
      const ordinals=group.map(validPreSortOrdinal);
      const ordinalSet=new Set(ordinals.filter(v=>v!==null));
      const tieLineageCertified=tieGroupSize===1 || (
        ordinals.every(v=>v!==null) && ordinalSet.size===tieGroupSize
      );

      for(const row of group){
        row.tieGroupSize=tieGroupSize;
        if(!tieLineageCertified){
          row.rankCertification="TIE_LINEAGE_UNKNOWN";
          row.formalPoolRank=null;
        }else{
          row.rankCertification="CERTIFIED";
          row.formalPoolRank=row.observedPoolRank;
        }
      }
      start=end;
    }
  }

  const byMembership={},byPool={};
  for(const row of rows) {
    byPool[row.pool]=(byPool[row.pool]||0)+1;
    for(const membership of row.memberships) {
      byMembership[membership]=(byMembership[membership]||0)+1;
    }
  }

  const rankQuality={CERTIFIED:0,TIE_LINEAGE_UNKNOWN:0,POOL_RANK_INPUT_INCOMPLETE:0,NOT_FORMAL_OK:0};
  for(const row of rows){
    if(row.formalOk!==true) rankQuality.NOT_FORMAL_OK+=1;
    else if(row.rankCertification in rankQuality) rankQuality[row.rankCertification]+=1;
  }

  return {
    schemaVersion:"shadow-semantic-classifier-v0.1",
    scanDate:String(scanDate||""),
    rows,
    counts:{total:rows.length,byMembership,byPool,rankQuality},
    comparatorVersion:"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30",
    tieLineagePolicy:"Exact pool rank requires comparator-complete qualified pool. Formal comparator has no symbol fallback; exact comparator ties additionally require unique preSortOrdinal. Otherwise formalPoolRank is UNKNOWN/null.",
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
