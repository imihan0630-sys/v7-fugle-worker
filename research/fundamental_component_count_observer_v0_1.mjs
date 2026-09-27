function toNumber(value){
  if(value===null||value===undefined||value==="") return null;
  const n=Number(value);
  return Number.isFinite(n)?n:null;
}
function clamp(v,min,max){return Math.min(max,Math.max(min,v));}
function scorePositive(value,maxScore){
  const n=toNumber(value);
  return n===null?null:clamp(maxScore/2+n*0.5,0,maxScore);
}
export const FUNDAMENTAL_SLOT_KEYS=Object.freeze([
  "revenueYoY",
  "revenueMoMOrRevenueQoQ",
  "revenueYTDYoY",
  "eps",
  "grossMargin",
  "operatingMargin",
  "epsYoY",
  "grossMarginYoY",
  "operatingMarginYoY"
]);
export const CANONICAL_QUARTERLY_GUARANTEED_KEYS=Object.freeze([
  "revenueQoQ","eps","grossMargin","operatingMargin","grossMarginYoY","operatingMarginYoY"
]);

export function observeFundamentalComponents(f={}){
  const rawRevenueMomentum=f.revenueMoM ?? f.revenueQoQ;
  const slots={
    revenueYoY:toNumber(f.revenueYoY),
    revenueMoMOrRevenueQoQ:toNumber(rawRevenueMomentum),
    revenueYTDYoY:toNumber(f.revenueYTDYoY),
    eps:toNumber(f.eps),
    grossMargin:toNumber(f.grossMargin),
    operatingMargin:toNumber(f.operatingMargin),
    epsYoY:toNumber(f.epsYoY),
    grossMarginYoY:toNumber(f.grossMarginYoY),
    operatingMarginYoY:toNumber(f.operatingMarginYoY)
  };
  const availability=Object.fromEntries(Object.entries(slots).map(([k,v])=>[k,v!==null]));
  const count=Object.values(availability).filter(Boolean).length;
  const components=[];
  if(slots.revenueYoY!==null) components.push({key:"revenueYoY",score:scorePositive(slots.revenueYoY,30),max:30});
  if(slots.revenueMoMOrRevenueQoQ!==null) components.push({key:"revenueMoMOrRevenueQoQ",score:clamp(5+slots.revenueMoMOrRevenueQoQ*0.5,0,10),max:10});
  if(slots.revenueYTDYoY!==null) components.push({key:"revenueYTDYoY",score:scorePositive(slots.revenueYTDYoY,15),max:15});
  if(slots.eps!==null) components.push({key:"epsPositive",score:slots.eps>0?15:0,max:15});
  if(slots.grossMargin!==null) components.push({key:"grossMargin",score:clamp(slots.grossMargin/50*15,0,15),max:15});
  if(slots.operatingMargin!==null) components.push({key:"operatingMargin",score:clamp(slots.operatingMargin/25*15,0,15),max:15});
  if(slots.epsYoY!==null) components.push({key:"epsYoY",score:scorePositive(slots.epsYoY,10),max:10});
  if(slots.grossMarginYoY!==null) components.push({key:"grossMarginYoY",score:scorePositive(slots.grossMarginYoY,5),max:5});
  if(slots.operatingMarginYoY!==null) components.push({key:"operatingMarginYoY",score:scorePositive(slots.operatingMarginYoY,5),max:5});
  const preClamp=components.reduce((s,x)=>s+x.score,0);
  const score=count>=3?clamp(preClamp,0,100):0;
  const revenueMoMNum=toNumber(f.revenueMoM),revenueQoQNum=toNumber(f.revenueQoQ);
  let revenueMomentumAliasState;
  if(f.revenueMoM===null||f.revenueMoM===undefined) revenueMomentumAliasState=revenueQoQNum!==null?"QOQ_FALLBACK_USED":"BOTH_MISSING";
  else if(revenueMoMNum!==null) revenueMomentumAliasState="MOM_USED";
  else if(revenueQoQNum!==null) revenueMomentumAliasState="INVALID_NON_NULL_MOM_SHADOWS_VALID_QOQ";
  else revenueMomentumAliasState="MOM_INVALID_QOQ_MISSING";
  return {
    schemaVersion:"fundamental-component-count-observer-v0.1",
    slots,availability,
    availabilitySignature:FUNDAMENTAL_SLOT_KEYS.map(k=>availability[k]?"1":"0").join(""),
    count,
    countGatePass:count>=3,
    score,
    scoreGatePass:count>=3?score>=25:null,
    scorePreClamp:preClamp,
    componentScores:components,
    revenueMomentumAliasState,
    guards:{
      countAndScoreShareSameAvailabilitySlots:true,
      zeroIsObserved:true,
      missingIsNotZero:true,
      noOutcomeUse:true,
      formalCoreChanged:false
    }
  };
}

export function inspectCanonicalQuarterlyFinancialEntry(entry={}){
  const values=Object.fromEntries(CANONICAL_QUARTERLY_GUARANTEED_KEYS.map(k=>[k,toNumber(entry[k])]));
  const observedCount=Object.values(values).filter(v=>v!==null).length;
  return {
    schemaVersion:"canonical-quarterly-financial-component-readiness-v0.1",
    values,
    observedCount,
    allSixObserved:observedCount===6,
    canonicalCountFloor:6,
    interpretation:observedCount===6
      ?"Current canonical quarterly-financial entry alone supplies six countable fundamental slots after normal nullish QoQ fallback."
      :"Not a complete canonical quarterly-financial entry under the current parser/derive contract."
  };
}
