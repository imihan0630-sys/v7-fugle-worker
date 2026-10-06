import {canonicalJcsJson,sha256HexUtf8} from './canonical_receipt_hash_v0_1.mjs';

export const SDA009_R3A1_ACCEPTANCE_SCHEMA='SDA009_R3A1_ACCEPTANCE_ORACLE_V0_6';
export const SDA009_MEMBERSHIP_SCHEME='SYSTEM1_RUNTIME_INDUSTRY_LABEL_V1';
const EPS=1e-7;
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const num=x=>finite(x)?x:null;
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const avg=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const same=(a,b)=>a===null||b===null?a===b:(finite(a)&&finite(b)&&Math.abs(a-b)<=EPS);

async function digest(domain,value){
  return sha256HexUtf8(domain+'|'+canonicalJcsJson(value));
}

export function canonicalMembershipProjectionV06(rows=[]){
  return rows.map(r=>({
    market:String(r?.market||'UNKNOWN'),
    symbol:String(r?.symbol||''),
    industry:String(r?.industry||'未分類')
  })).sort((a,b)=>a.market.localeCompare(b.market)||a.symbol.localeCompare(b.symbol)||a.industry.localeCompare(b.industry));
}

export function canonicalProductionSectorProjectionV06(projection=[]){
  return projection.map(s=>({
    industry:String(s?.industry||'未分類'),
    stockCount:Number(s?.stockCount||0),
    historicalCoverage:Number(s?.historicalCoverage||0),
    amount:Number(s?.amount||0),
    breadth:num(s?.breadth),
    avgChange:num(s?.avgChange),
    amountVs20DayAverage:num(s?.amountVs20DayAverage),
    score:num(s?.score)
  })).sort((a,b)=>a.industry.localeCompare(b.industry));
}

export function reconstructSectorProjectionFromC1V06(rows=[]){
  const groups=new Map();
  for(const r of rows){
    const industry=String(r?.industry||'未分類');
    if(!groups.has(industry)) groups.set(industry,[]);
    groups.get(industry).push(r);
  }
  const prelim=[];
  for(const [industry,items] of groups){
    const amount=items.reduce((s,r)=>s+(finite(r?.currentTradeValue)?r.currentTradeValue:0),0);
    const changes=items.map(r=>r?.currentChangePercent).filter(finite);
    const positiveCount=items.filter(r=>(finite(r?.currentChangePercent)?r.currentChangePercent:0)>0).length;
    const breadth=items.length?positiveCount/items.length*100:0;
    const avgChange=avg(changes);
    const ready=items.filter(r=>finite(r?.feature?.historyDays)&&r.feature.historyDays>=20);
    const avgAmount20=ready.reduce((s,r)=>s+(finite(r?.feature?.avgAmount20)?r.feature.avgAmount20:0),0);
    const coveredAmount=ready.reduce((s,r)=>s+(finite(r?.currentTradeValue)?r.currentTradeValue:0),0);
    prelim.push({
      industry,stockCount:items.length,historicalCoverage:ready.length,amount,breadth,avgChange,
      amountVs20DayAverage:avgAmount20>0?coveredAmount/avgAmount20:null
    });
  }
  const maxAmount=Math.max(1,...prelim.map(x=>x.amount));
  return prelim.map(x=>({
    ...x,
    score:clamp(x.amount/maxAmount*45+x.breadth*.3+clamp((x.avgChange||0)*5+15,0,25),0,100)
  })).sort((a,b)=>a.industry.localeCompare(b.industry));
}

export async function evaluateSda009R3A1ReceiptV06(receipt){
  const blockers=[];
  const rows=Array.isArray(receipt?.rows)?receipt.rows:[];
  const header=receipt?.header||receipt||{};
  if(!rows.length) blockers.push('EMPTY_C1_PARENT');
  if(Number(header?.populationN)!==rows.length) blockers.push('POPULATION_COUNT_MISMATCH');
  if(new Set(rows.map(r=>String(r?.symbol||''))).size!==rows.length) blockers.push('DUPLICATE_SYMBOL');
  for(const r of rows){
    const symbol=String(r?.symbol||'?');
    if(!Object.hasOwn(r||{},'currentChangePercent')) blockers.push('MISSING_CURRENT_CHANGE_PERCENT:'+symbol);
    if(!Object.hasOwn(r||{},'currentTradeValue')) blockers.push('MISSING_CURRENT_TRADE_VALUE:'+symbol);
  }
  if(header?.classificationSchemeId!==SDA009_MEMBERSHIP_SCHEME) blockers.push('CLASSIFICATION_SCHEME_MISMATCH');
  if(typeof header?.membershipVersion!=='string'||!header.membershipVersion) blockers.push('MISSING_MEMBERSHIP_VERSION');
  if(typeof header?.membershipDigest!=='string'||!header.membershipDigest) blockers.push('MISSING_MEMBERSHIP_DIGEST');
  if(!Array.isArray(header?.sectorDecisionStateProjection)) blockers.push('MISSING_SECTOR_DECISION_PROJECTION');
  if(typeof header?.sectorDecisionStateDigest!=='string'||!header.sectorDecisionStateDigest) blockers.push('MISSING_SECTOR_DECISION_DIGEST');

  const membershipProjection=canonicalMembershipProjectionV06(rows);
  const membershipDigest=await digest('SDA009_INDUSTRY_MEMBERSHIP_V0_1',membershipProjection);
  if(header?.membershipDigest&&header.membershipDigest!==membershipDigest) blockers.push('MEMBERSHIP_DIGEST_MISMATCH');

  const capturedProjection=Array.isArray(header?.sectorDecisionStateProjection)
    ?canonicalProductionSectorProjectionV06(header.sectorDecisionStateProjection):[];
  const capturedDigest=await digest('SDA009_SECTOR_DECISION_STATE_V0_1',capturedProjection);
  if(header?.sectorDecisionStateDigest&&header.sectorDecisionStateDigest!==capturedDigest) blockers.push('SECTOR_DECISION_DIGEST_MISMATCH');

  const reconstructed=reconstructSectorProjectionFromC1V06(rows);
  const byIndustry=new Map(capturedProjection.map(x=>[x.industry,x]));
  const parity=[];
  for(const x of reconstructed){
    const y=byIndustry.get(x.industry);
    if(!y){
      parity.push({industry:x.industry,state:'BLOCKED',mismatches:['MISSING_CAPTURED_INDUSTRY']});
      blockers.push('MISSING_CAPTURED_INDUSTRY:'+x.industry);
      continue;
    }
    const fields=['stockCount','historicalCoverage','amount','breadth','avgChange','amountVs20DayAverage','score'];
    const mismatches=fields.filter(k=>!same(num(x[k]),num(y[k])));
    parity.push({industry:x.industry,state:mismatches.length?'BLOCKED':'PASS',mismatches});
    if(mismatches.length) blockers.push('SECTOR_PARITY_MISMATCH:'+x.industry+':'+mismatches.join(','));
  }
  for(const y of capturedProjection){
    if(!reconstructed.some(x=>x.industry===y.industry)){
      blockers.push('EXTRA_CAPTURED_INDUSTRY:'+y.industry);
      parity.push({industry:y.industry,state:'BLOCKED',mismatches:['EXTRA_CAPTURED_INDUSTRY']});
    }
  }

  const gateParityPass=parity.length>0&&parity.every(x=>x.state==='PASS');
  const scoreParityPass=gateParityPass;
  const unclassifiedSymbols=rows.filter(r=>{
    const s=String(r?.industry||'').trim();
    return !s||s==='未分類'||s.toUpperCase()==='UNKNOWN';
  }).map(r=>String(r.symbol));

  return {
    schemaVersion:SDA009_R3A1_ACCEPTANCE_SCHEMA,
    generationId:header?.generationId??header?.captureGeneration??null,
    sessionDate:header?.sessionDate??header?.scanDate??null,
    populationN:rows.length,
    state:blockers.length?'BLOCKED':'PASS',
    blockers:[...new Set(blockers)],
    membership:{classificationSchemeId:header?.classificationSchemeId??null,membershipVersion:header?.membershipVersion??null,capturedDigest:header?.membershipDigest??null,reconstructedDigest:membershipDigest,pass:header?.membershipDigest===membershipDigest},
    sectorParity:{capturedDigest:header?.sectorDecisionStateDigest??null,reconstructedCapturedDigest:capturedDigest,gateParityPass,scoreParityPass,rows:parity},
    unclassified:{state:unclassifiedSymbols.length?'UNCLASSIFIED_PSEUDO_BUCKET_PRESENT':'NONE',symbols:unclassifiedSymbols,economicInterpretation:'FORBIDDEN'},
    authorization:{
      r3a1ParityPass:blockers.length===0&&gateParityPass&&scoreParityPass,
      candidateLooGateAuthorized:blockers.length===0&&gateParityPass,
      candidateLooScoreAuthorized:blockers.length===0&&scoreParityPass,
      r3a2RankAuthorized:false,
      formalMutationAuthorized:false
    },
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    exactNext:blockers.length?'FIX_R3A1_CAPTURE_OR_PARITY':'SDA-009-R3A2'
  };
}
