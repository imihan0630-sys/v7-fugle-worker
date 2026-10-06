const VALID_POOL = new Set(["GENERAL", "THOUSAND"]);
const VALID_BOOL = new Set([true, false]);
const EPS = 1e-9;

function finite(v) { return typeof v === "number" && Number.isFinite(v); }
function missing(v) { return v === null || v === undefined || v === ""; }
function changed(a,b){ return finite(a) && finite(b) && Math.abs(a-b) > EPS; }
function direction(raw, loo, higherIsPromotion=true){
  if(!finite(raw)||!finite(loo)||Math.abs(raw-loo)<=EPS) return "NONE";
  const rawHigher = raw > loo;
  const promote = higherIsPromotion ? rawHigher : !rawHigher;
  return promote ? "SELF_PROMOTION" : "SELF_SUPPRESSION";
}
function boolDirection(raw, loo){
  if(typeof raw!=="boolean"||typeof loo!=="boolean"||raw===loo) return "NONE";
  return raw && !loo ? "SELF_PROMOTION" : "SELF_SUPPRESSION";
}
function mergeDirections(ds){
  const s=new Set(ds.filter(x=>x&&x!=="NONE"&&x!=="BLOCKED"));
  if(!s.size) return "NONE";
  if(s.size===1) return [...s][0];
  return "MIXED";
}

export function classifySda009RowV02(row){
  const blockers=[];
  for(const key of ["scanDate","generationId","candidateSymbol","classificationSchemeId","membershipVersion","poolId"]){
    if(missing(row?.[key])) blockers.push(\`MISSING_\${key}\`);
  }
  if(!VALID_POOL.has(row?.poolId)) blockers.push("INVALID_POOL_ID");
  const inc=row?.inclusiveSectorState, looLocal=row?.leaveOneOutLocalState, loo=row?.leaveOneOutSectorState;
  if(!inc||typeof inc!=="object") blockers.push("MISSING_INCLUSIVE_STATE");
  if(!looLocal||typeof looLocal!=="object") blockers.push("MISSING_LOO_LOCAL_STATE");
  if(!loo||typeof loo!=="object") blockers.push("MISSING_LOO_FULL_STATE");
  if(row?.replayTrust==="BLOCKED") blockers.push("REPLAY_TRUST_BLOCKED");
  if(loo?.state==="UNKNOWN") blockers.push("LOO_UNKNOWN");

  const supportState=row?.supportState||loo?.supportState||null;
  const smallN=supportState==="SMALL_N_SENSITIVE";

  const gateDirection=boolDirection(inc?.hardGatePass,loo?.hardGatePass);
  const gateFlip=gateDirection!=="NONE";

  const rawPoolRank=row?.rawPoolRank, looPoolRank=row?.leaveOneOutPoolRank;
  const rankComparable=finite(rawPoolRank)&&finite(looPoolRank);
  const poolRankFlip=rankComparable&&rawPoolRank!==looPoolRank;
  const rawTop3=row?.rawPoolTop3, looTop3=row?.leaveOneOutPoolTop3;
  const seatComparable=VALID_BOOL.has(rawTop3)&&VALID_BOOL.has(looTop3);
  const poolSeatDirection=seatComparable ? boolDirection(rawTop3,looTop3) : "NONE";
  const poolSeatFlip=poolSeatDirection!=="NONE";

  const incScore=inc?.sectorScore, localScore=looLocal?.sectorScore, looScore=loo?.sectorScore;
  const localSelfContribution=finite(incScore)&&finite(localScore)?incScore-localScore:null;
  const maxNormalizerExternality=finite(localScore)&&finite(looScore)?localScore-looScore:null;
  const fullCounterfactualDelta=finite(incScore)&&finite(looScore)?incScore-looScore:null;
  const scoreDirection=finite(fullCounterfactualDelta)?(fullCounterfactualDelta>EPS?"SELF_PROMOTION":fullCounterfactualDelta<-EPS?"SELF_SUPPRESSION":"NONE"):"NONE";

  const priorityRaw=row?.rawPriorityScore, priorityLoo=row?.leaveOneOutPriorityScore;
  const priorityDelta=finite(priorityRaw)&&finite(priorityLoo)?priorityRaw-priorityLoo:
    (finite(fullCounterfactualDelta)?0.14*fullCounterfactualDelta:null);

  const rankComparator=row?.rankComparatorAttribution||null;
  const comparatorValid=!poolRankFlip || typeof rankComparator==="string"&&rankComparator.length>0;
  if(poolRankFlip&&!comparatorValid) blockers.push("RANK_FLIP_WITHOUT_COMPARATOR_ATTRIBUTION");

  const rawAlloc=row?.rawAllocationNTD, looAlloc=row?.leaveOneOutAllocationNTD;
  const allocationDirection=direction(rawAlloc,looAlloc,true);
  const allocationChanged=changed(rawAlloc,looAlloc);
  const peerDeltas=Array.isArray(row?.peerAllocationDeltasNTD)?row.peerAllocationDeltasNTD.filter(finite):[];
  const peerRedistribution=peerDeltas.some(v=>Math.abs(v)>EPS);
  const residualCashDelta=finite(row?.rawRemainingCashNTD)&&finite(row?.leaveOneOutRemainingCashNTD)?row.rawRemainingCashNTD-row.leaveOneOutRemainingCashNTD:null;
  const allocationSpillover=allocationChanged||peerRedistribution||(finite(residualCashDelta)&&Math.abs(residualCashDelta)>EPS);

  const directionState=blockers.length?"BLOCKED":mergeDirections([gateDirection,scoreDirection,poolSeatDirection,allocationDirection]);

  let primaryClassification;
  if(blockers.length) primaryClassification="BLOCKED";
  else if(smallN) primaryClassification="SMALL_N_SENSITIVE";
  else if(poolSeatFlip) primaryClassification="POOL_SEAT_FLIP";
  else if(gateFlip) primaryClassification="GATE_FLIP";
  else if(poolRankFlip) primaryClassification="RANK_FLIP";
  else if(allocationSpillover) primaryClassification="ALLOCATION_SPILLOVER";
  else if(finite(fullCounterfactualDelta)&&Math.abs(fullCounterfactualDelta)>EPS) primaryClassification="SCORE_ONLY_SELF_EFFECT";
  else primaryClassification="NO_MATERIAL_SELF_EFFECT";

  return {
    scanDate:row?.scanDate??null,generationId:row?.generationId??null,candidateSymbol:row?.candidateSymbol??null,
    poolId:row?.poolId??null,classificationSchemeId:row?.classificationSchemeId??null,membershipVersion:row?.membershipVersion??null,
    primaryClassification,directionState,blockers,supportState,
    effects:{gateFlip,poolRankFlip,poolSeatFlip,allocationSpillover,scoreChanged:finite(fullCounterfactualDelta)&&Math.abs(fullCounterfactualDelta)>EPS},
    attribution:{localSelfContribution,maxNormalizerExternality,fullCounterfactualDelta,priorityScoreDeltaFromSector:priorityDelta,rankComparatorAttribution:rankComparator},
    allocation:{rawAllocationNTD:finite(rawAlloc)?rawAlloc:null,leaveOneOutAllocationNTD:finite(looAlloc)?looAlloc:null,peerAllocationDeltasNTD:peerDeltas,residualCashDelta,capBinding:row?.capBinding??null,flooringState:row?.flooringState??null},
    pool:{rawPoolRank:rankComparable?rawPoolRank:null,leaveOneOutPoolRank:rankComparable?looPoolRank:null,rawPoolTop3:seatComparable?rawTop3:null,leaveOneOutPoolTop3:seatComparable?looTop3:null},
    formalDecisionImpact:false,economicMateriality:"UNASSESSED_D16_REQUIRED"
  };
}

export function analyzeSda009ReceiptV02(receipt){
  if(!receipt||typeof receipt!=="object") throw new Error("receipt object required");
  if(!Array.isArray(receipt.rows)) throw new Error("receipt.rows array required");
  const rows=receipt.rows.map(classifySda009RowV02);
  const counts={},directions={};
  for(const r of rows){counts[r.primaryClassification]=(counts[r.primaryClassification]||0)+1;directions[r.directionState]=(directions[r.directionState]||0)+1;}
  const comparable=rows.filter(r=>r.primaryClassification!=="BLOCKED");
  const byPool={GENERAL:{rows:0,seatFlips:0},THOUSAND:{rows:0,seatFlips:0}};
  for(const r of comparable){if(byPool[r.poolId]){byPool[r.poolId].rows++;if(r.effects.poolSeatFlip)byPool[r.poolId].seatFlips++;}}
  return {schemaVersion:"SDA009_R3_RECEIPT_ORACLE_V0_2",auditTicket:"SDA-009",scanDate:receipt.scanDate??null,generationId:receipt.generationId??null,rowCount:rows.length,comparableRowCount:comparable.length,blockedRowCount:rows.length-comparable.length,counts,directions,byPool,rows,formalDecisionImpact:false,d16Required:true,interpretation:"MECHANICAL_SELF_CONTRIBUTION_AND_ALLOCATION_DIAGNOSTIC_ONLY"};
}
