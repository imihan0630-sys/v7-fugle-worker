// D15-15 multi-pool structural risk audit v0.1 — research-only.
// Pool identity is reconstructed from the immutable plan formalClose because the Formal selector
// splits GENERAL (<1000) vs THOUSAND (>=1000) on the same scan-date close.
// This module does NOT infer cross-pool independence/correlation from price tier.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=8){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function hhi(xs){const t=xs.reduce((a,b)=>a+b,0);return t>0?xs.reduce((s,x)=>s+(x/t)**2,0):null}

export function reconstructPoolFromFormalClose(formalClose,threshold=1000){
  const p=n(formalClose),t=n(threshold);
  if(p===null||!(p>0)||t===null||!(t>0)) return {status:"UNKNOWN",pool:null};
  return {status:"READY",pool:p>=t?"THOUSAND":"GENERAL",formalClose:p,threshold:t};
}

export function multiPoolStructuralRisk(plans=[],{
  threshold=1000,
  selectedCount=null
}={}){
  const rows=(plans||[]).map(p=>{
    const symbol=sym(p?.symbol??p?.code);
    const formalClose=n(p?.formalClose??p?.formal_close);
    const allocation=n(p?.totalAllocation??p?.total_allocation);
    const buyHigh=n(p?.buyHigh??p?.buy_high);
    const stop=n(p?.stop);
    const poolRec=reconstructPoolFromFormalClose(formalClose,threshold);
    const stopRiskPct=(buyHigh!==null&&stop!==null&&buyHigh>0&&stop>0&&stop<buyHigh)?(buyHigh-stop)/buyHigh:null;
    const projectedRisk=(allocation!==null&&stopRiskPct!==null)?allocation*stopRiskPct:null;
    return {symbol,formalClose,allocation,buyHigh,stop,pool:poolRec.pool,poolStatus:poolRec.status,stopRiskPct,projectedRisk};
  });

  const declared=n(selectedCount);
  if(declared!==null&&(!Number.isInteger(declared)||declared<0)) return {status:"UNKNOWN",reason:"INVALID_SELECTED_COUNT"};
  if(declared!==null&&declared!==rows.length) return {status:"UNKNOWN",reason:"SELECTED_COUNT_MISMATCH",declared,rows:rows.length};
  if(!rows.length) return {
    status:"ZERO_SELECTED",
    selectedCount:0,
    poolCounts:{GENERAL:0,THOUSAND:0},
    bothPoolsRepresented:false,
    crossPoolRiskIdentifiable:false,
    reason:"NO_SELECTED_PLANS"
  };
  if(rows.some(x=>!x.symbol||x.poolStatus!=="READY"||x.allocation===null||x.allocation<0||x.stopRiskPct===null)){
    return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_OR_POOL_GEOMETRY"};
  }

  const groups={GENERAL:[],THOUSAND:[]};
  for(const row of rows) groups[row.pool].push(row);

  const poolStats={};
  for(const pool of ["GENERAL","THOUSAND"]){
    const xs=groups[pool];
    const cap=xs.reduce((s,x)=>s+x.allocation,0);
    const risk=xs.reduce((s,x)=>s+x.projectedRisk,0);
    poolStats[pool]={
      selectedNames:xs.length,
      symbols:xs.map(x=>x.symbol),
      capitalNTD:round(cap,4),
      projectedStopRiskNTD:round(risk,4),
      withinPoolRiskHHI:xs.length>=2?round(hhi(xs.map(x=>x.projectedRisk)),10):xs.length===1?1:null
    };
  }

  const represented=["GENERAL","THOUSAND"].filter(p=>groups[p].length>0);
  const totalCapital=rows.reduce((s,x)=>s+x.allocation,0);
  const totalRisk=rows.reduce((s,x)=>s+x.projectedRisk,0);
  const poolRisks=represented.map(p=>poolStats[p].projectedStopRiskNTD);
  const poolCaps=represented.map(p=>poolStats[p].capitalNTD);

  return {
    status:"READY",
    researchOnly:true,
    decisionImpact:false,
    selectedCount:rows.length,
    thresholdNTD:threshold,
    poolDefinition:"GENERAL=formalClose<1000; THOUSAND=formalClose>=1000",
    poolIdentityProvenance:"Formal plan formalClose equals the scan-date close used by the selector pool split.",
    poolCounts:{GENERAL:groups.GENERAL.length,THOUSAND:groups.THOUSAND.length},
    representedPools:represented,
    bothPoolsRepresented:represented.length===2,
    crossPoolRiskIdentifiable:represented.length===2,
    totalPlannedCapitalNTD:round(totalCapital,4),
    totalProjectedStopRiskNTD:round(totalRisk,4),
    aggregateNameRiskHHI:round(hhi(rows.map(x=>x.projectedRisk)),10),
    poolCapitalHHI:represented.length>=2?round(hhi(poolCaps),10):1,
    poolRiskHHI:represented.length>=2?round(hhi(poolRisks),10):1,
    poolStats,
    rows:rows.map(x=>({
      symbol:x.symbol,formalClose:x.formalClose,pool:x.pool,
      totalAllocationNTD:x.allocation,
      stopRiskPct:round(x.stopRiskPct*100,6),
      projectedStopRiskNTD:round(x.projectedRisk,4)
    })),
    semantics:{
      supported:"Price-tier pool identity and plan-time capital/projected-stop-risk aggregation are PIT-reconstructable.",
      notSupported:[
        "GENERAL and THOUSAND are statistically independent bets",
        "two represented pools imply low correlation",
        "pool separation is sector/factor diversification",
        "poolRiskHHI is a correlation or covariance metric"
      ],
      correlationRequirement:"True cross-pool diversification requires PIT-synchronized return/covariance evidence under D15-03/04/05/06."
    }
  };
}
