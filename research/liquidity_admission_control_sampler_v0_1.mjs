const DEFAULT_REASONS=[
  "LIQ_LOW_AVG_VOLUME_REJECTED",
  "LIQ_SMALLCAP_SPECIAL_REASON_REJECTED",
  "LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED"
];
const DEFAULT_POOLS=["GENERAL","THOUSAND"];

function stableHash32(text){
  let h=2166136261>>>0;
  for(const ch of String(text)){
    h^=ch.codePointAt(0);
    h=Math.imul(h,16777619)>>>0;
  }
  return h>>>0;
}

export function explicitLiquidityReasonMatrix(observed={},{
  reasonIds=DEFAULT_REASONS,
  pools=DEFAULT_POOLS
}={}){
  const out={};
  for(const reason of reasonIds){
    out[reason]={};
    for(const pool of pools){
      const n=Number(observed?.[reason]?.[pool]);
      out[reason][pool]=Number.isFinite(n)&&n>=0?Math.floor(n):0;
    }
  }
  return out;
}

export function sampleLiquidityExceptionPass(rows=[],{
  scanDate="",
  capPerPool=6,
  pools=DEFAULT_POOLS,
  samplingRuleVersion="LIQ_EXCEPTION_PASS_STRATIFIED_HASH_V0_1"
}={}){
  const cap=Math.max(0,Math.floor(Number(capPerPool)||0));
  const source=Array.isArray(rows)?rows:[];
  const strata=[];
  const samples=[];
  let populationTotal=0;
  for(const pool of pools){
    const eligible=source.filter(row=>
      String(row?.pool||"")===pool &&
      row?.belowPrimaryMin===true &&
      row?.liquidityExceptionPass===true &&
      String(row?.symbol||"")
    );
    populationTotal+=eligible.length;
    eligible.sort((a,b)=>{
      const ah=stableHash32([samplingRuleVersion,scanDate,pool,a.symbol].join("|"));
      const bh=stableHash32([samplingRuleVersion,scanDate,pool,b.symbol].join("|"));
      return ah-bh || String(a.symbol).localeCompare(String(b.symbol));
    });
    const picked=eligible.slice(0,cap);
    for(let i=0;i<picked.length;i++){
      samples.push({
        ...picked[i],
        membership:"LIQ_LOW_VOLUME_EXCEPTION_PASS",
        sampleMembershipMeta:{
          membership:"LIQ_LOW_VOLUME_EXCEPTION_PASS",
          pool,
          samplingRuleVersion,
          populationCount:eligible.length,
          sampledCount:picked.length,
          sampleRank:i+1,
          samplingFraction:eligible.length?picked.length/eligible.length:0
        }
      });
    }
    strata.push({
      pool,
      populationCount:eligible.length,
      sampledCount:picked.length,
      capPerPool:cap,
      samplingFraction:eligible.length?picked.length/eligible.length:0
    });
  }
  return {
    schemaVersion:"liquidity-exception-pass-sample-v0.1",
    scanDate:String(scanDate),
    membership:"LIQ_LOW_VOLUME_EXCEPTION_PASS",
    samplingRuleVersion,
    semanticPopulationCount:populationTotal,
    sampledCount:samples.length,
    rows:samples,
    strata,
    policy:"Independent positive-control membership. Sampling is computed from the frozen below-min + exception-pass frame and is not conditioned on legacy Shadow used/cohort membership.",
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };
}
