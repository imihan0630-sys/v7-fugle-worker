const VALID_POOL=new Set(['GENERAL','THOUSAND']);
const VALID_BOOL=new Set([true,false]);
const EPS=1e-9;
export const SDA009_EFFECTIVE_COMPARATOR='PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30';
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const missing=v=>v===null||v===undefined||v==='';
const changed=(a,b)=>finite(a)&&finite(b)&&Math.abs(a-b)>EPS;
const boolDirection=(raw,loo)=>typeof raw==='boolean'&&typeof loo==='boolean'&&raw!==loo?(raw&&!loo?'SELF_PROMOTION':'SELF_SUPPRESSION'):'NONE';
const numericDirection=(raw,loo)=>!changed(raw,loo)?'NONE':raw>loo?'SELF_PROMOTION':'SELF_SUPPRESSION';
const mergeDirections=ds=>{const s=new Set(ds.filter(x=>x&&x!=='NONE'&&x!=='BLOCKED'));return s.size===0?'NONE':s.size===1?[...s][0]:'MIXED';};

export function classifySda009ReceiptRowV04(row){
  const blockers=[];
  for(const key of ['scanDate','generationId','candidateSymbol','classificationSchemeId','membershipVersion','poolId']){
    if(missing(row?.[key])) blockers.push(`MISSING_${key}`);
  }
  if(!VALID_POOL.has(row?.poolId)) blockers.push('INVALID_POOL_ID');
  if(!row?.inclusiveSectorState||typeof row.inclusiveSectorState!=='object') blockers.push('MISSING_INCLUSIVE_STATE');
  if(!row?.leaveOneOutSectorState||typeof row.leaveOneOutSectorState!=='object') blockers.push('MISSING_LOO_STATE');
  if(row?.replayTrust==='BLOCKED') blockers.push('REPLAY_TRUST_BLOCKED');
  if(row?.leaveOneOutSectorState?.state==='UNKNOWN') blockers.push('LOO_UNKNOWN');

  const gateParityPass=row?.gateParityState==='PASS';
  const scoreParityPass=row?.scoreParityState==='PASS';
  const supportState=row?.supportState??row?.leaveOneOutSectorState?.supportState??null;
  const smallN=supportState==='SMALL_N_SENSITIVE';

  const incGate=row?.inclusiveSectorState?.hardGatePass;
  const looGate=row?.leaveOneOutSectorState?.hardGatePass;
  const gateComparable=VALID_BOOL.has(incGate)&&VALID_BOOL.has(looGate);
  const mechanicalGateFlip=gateComparable&&incGate!==looGate;
  const gateDirection=gateComparable?boolDirection(incGate,looGate):'NONE';
  const gateEffectAuthorized=gateParityPass&&gateComparable;

  const incScore=row?.inclusiveSectorState?.sectorScore;
  const looScore=row?.leaveOneOutSectorState?.sectorScore;
  const scoreComparable=finite(incScore)&&finite(looScore);
  const sectorScoreDelta=scoreComparable?incScore-looScore:null;
  const scoreChanged=scoreComparable&&Math.abs(sectorScoreDelta)>EPS;
  const structuralUnroundedSectorContributionDelta=scoreComparable?0.14*sectorScoreDelta:null;
  const scoreEffectAuthorized=scoreParityPass&&scoreComparable;

  const rawPriority=row?.rawPriorityScore, looPriority=row?.leaveOneOutPriorityScore;
  const priorityScoreDeltaFromSector=finite(rawPriority)&&finite(looPriority)?rawPriority-looPriority:null;

  const rawRank=row?.rawPoolRank, looRank=row?.leaveOneOutPoolRank;
  const rankComparable=finite(rawRank)&&finite(looRank);
  const poolRankFlip=rankComparable&&rawRank!==looRank;
  const comparatorVersionOk=row?.rankComparatorVersion===SDA009_EFFECTIVE_COMPARATOR;
  const rankIdentifiable=row?.rankIdentifiability==='PASS';
  const rankComparatorAttribution=typeof row?.rankComparatorAttribution==='string'&&row.rankComparatorAttribution?row.rankComparatorAttribution:null;
  const rankEffectAuthorized=rankIdentifiable&&comparatorVersionOk&&(!poolRankFlip||rankComparatorAttribution!==null);

  const rawTop3=row?.rawPoolTop3, looTop3=row?.leaveOneOutPoolTop3;
  const seatComparable=VALID_BOOL.has(rawTop3)&&VALID_BOOL.has(looTop3);
  const poolSeatFlip=seatComparable&&rawTop3!==looTop3;
  const poolSeatDirection=seatComparable?boolDirection(rawTop3,looTop3):'NONE';
  const seatEffectAuthorized=row?.rankIdentifiability==='PASS'&&comparatorVersionOk&&seatComparable;

  const rawAlloc=row?.rawAllocationNTD, looAlloc=row?.leaveOneOutAllocationNTD;
  const peerDeltas=Array.isArray(row?.peerAllocationDeltasNTD)?row.peerAllocationDeltasNTD.filter(finite):[];
  const residualCashDelta=finite(row?.rawRemainingCashNTD)&&finite(row?.leaveOneOutRemainingCashNTD)?row.rawRemainingCashNTD-row.leaveOneOutRemainingCashNTD:null;
  const allocationMechanical=changed(rawAlloc,looAlloc)||peerDeltas.some(v=>Math.abs(v)>EPS)||(finite(residualCashDelta)&&Math.abs(residualCashDelta)>EPS);
  const allocationEffectAuthorized=row?.allocationIdentifiability==='PASS';
  const allocationDirection=numericDirection(rawAlloc,looAlloc);

  if(mechanicalGateFlip&&!gateEffectAuthorized) blockers.push('GATE_FLIP_WITHOUT_GATE_PARITY');
  if(poolRankFlip&&!rankEffectAuthorized) blockers.push('RANK_FLIP_NOT_IDENTIFIABLE');
  if(poolSeatFlip&&!seatEffectAuthorized) blockers.push('POOL_SEAT_FLIP_NOT_IDENTIFIABLE');
  if(allocationMechanical&&!allocationEffectAuthorized) blockers.push('ALLOCATION_EFFECT_NOT_IDENTIFIABLE');

  const directionState=blockers.length?'BLOCKED':mergeDirections([gateDirection,scoreEffectAuthorized?numericDirection(incScore,looScore):'NONE',poolSeatDirection,allocationDirection]);

  let primaryClassification;
  if(blockers.length) primaryClassification='BLOCKED';
  else if(smallN) primaryClassification='SMALL_N_SENSITIVE';
  else if(poolSeatFlip&&seatEffectAuthorized) primaryClassification='POOL_SEAT_FLIP';
  else if(mechanicalGateFlip&&gateEffectAuthorized) primaryClassification='GATE_FLIP';
  else if(poolRankFlip&&rankEffectAuthorized) primaryClassification='RANK_FLIP';
  else if(allocationMechanical&&allocationEffectAuthorized) primaryClassification='ALLOCATION_SPILLOVER';
  else if(scoreChanged&&scoreEffectAuthorized) primaryClassification='SCORE_ONLY_SELF_EFFECT';
  else if(scoreChanged&&!scoreEffectAuthorized) primaryClassification='SCORE_EFFECT_UNVERIFIED';
  else primaryClassification='NO_MATERIAL_SELF_EFFECT';

  return {
    scanDate:row?.scanDate??null,generationId:row?.generationId??null,candidateSymbol:row?.candidateSymbol??null,poolId:row?.poolId??null,
    primaryClassification,directionState,blockers,supportState,
    authority:{gateEffectAuthorized,scoreEffectAuthorized,rankEffectAuthorized,seatEffectAuthorized,allocationEffectAuthorized,comparatorVersionOk},
    effects:{mechanicalGateFlip,poolRankFlip,poolSeatFlip,allocationMechanical,scoreChanged},
    attribution:{sectorScoreDelta,structuralUnroundedSectorContributionDelta,priorityScoreDeltaFromSector,rankComparatorAttribution},
    allocation:{rawAllocationNTD:finite(rawAlloc)?rawAlloc:null,leaveOneOutAllocationNTD:finite(looAlloc)?looAlloc:null,peerAllocationDeltasNTD:peerDeltas,residualCashDelta},
    formalDecisionImpact:false,economicMateriality:'UNASSESSED_D16_REQUIRED'
  };
}

export function analyzeSda009ReceiptV04(receipt){
  if(!receipt||typeof receipt!=='object') throw new Error('receipt object required');
  if(!Array.isArray(receipt.rows)) throw new Error('receipt.rows array required');
  const rows=receipt.rows.map(classifySda009ReceiptRowV04);
  const counts={},directions={};
  for(const r of rows){counts[r.primaryClassification]=(counts[r.primaryClassification]||0)+1;directions[r.directionState]=(directions[r.directionState]||0)+1;}
  const comparable=rows.filter(r=>r.primaryClassification!=='BLOCKED');
  return {schemaVersion:'SDA009_R3_RECEIPT_ORACLE_V0_4',auditTicket:'SDA-009',scanDate:receipt.scanDate??null,generationId:receipt.generationId??null,rowCount:rows.length,comparableRowCount:comparable.length,blockedRowCount:rows.length-comparable.length,counts,directions,rows,formalDecisionImpact:false,d16Required:true,interpretation:'LAYERED_PARITY_AND_IDENTIFIABILITY_ONLY'};
}
