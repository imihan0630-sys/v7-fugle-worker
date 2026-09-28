import { hashCanonicalReceipt } from "./canonical_receipt_hash_v0_1.mjs";

function reqText(value, field) {
  const s=String(value??"").trim();
  if (!s) throw new Error("MISSING_" + field);
  return s;
}

function numOrNull(value, field) {
  if (value===null || value===undefined) return null;
  const n=Number(value);
  if (!Number.isFinite(n)) throw new Error("INVALID_" + field);
  return n;
}

function intOrNull(value, field) {
  const n=numOrNull(value,field);
  if (n===null) return null;
  if (!Number.isInteger(n)) throw new Error("INVALID_INTEGER_" + field);
  return n;
}

export function normalizeSelectedPlan(plan) {
  const p=plan||{};
  const strategyPool=reqText(p.strategyPool,"strategyPool");
  if (!["FORMAL_GENERAL","FORMAL_THOUSAND"].includes(strategyPool)) throw new Error("INVALID_strategyPool");

  return Object.freeze({
    symbol:reqText(p.symbol,"symbol"),
    planDate:reqText(p.planDate,"planDate"),
    strategy:reqText(p.strategy,"strategy"),
    strategyPool,
    signalLevel:p.signalLevel===null||p.signalLevel===undefined?null:String(p.signalLevel),
    formalClose:numOrNull(p.formalClose,"formalClose"),
    buyLow:numOrNull(p.buyLow,"buyLow"),
    buyHigh:numOrNull(p.buyHigh,"buyHigh"),
    breakout:numOrNull(p.breakout,"breakout"),
    maxChase:numOrNull(p.maxChase,"maxChase"),
    stop:numOrNull(p.stop,"stop"),
    sellBelow:numOrNull(p.sellBelow,"sellBelow"),
    reduceAt:numOrNull(p.reduceAt,"reduceAt"),
    profitCheck:numOrNull(p.profitCheck,"profitCheck"),
    priorityScore:numOrNull(p.priorityScore,"priorityScore"),
    rewardRisk:numOrNull(p.rewardRisk,"rewardRisk"),
    allocationRatio:numOrNull(p.allocationRatio,"allocationRatio"),
    totalAllocation:numOrNull(p.totalAllocation,"totalAllocation"),
    firstShares:intOrNull(p.firstShares,"firstShares"),
    secondShares:intOrNull(p.secondShares,"secondShares"),
    totalShares:intOrNull(p.totalShares,"totalShares"),
    selectedReason:p.selectedReason===null||p.selectedReason===undefined?null:String(p.selectedReason),
  });
}

export async function buildSelectedPlanReceipts(plans, cryptoImpl=globalThis.crypto) {
  if (!Array.isArray(plans)) throw new Error("PLANS_ARRAY_REQUIRED");
  const normalized=plans.map(normalizeSelectedPlan);
  normalized.sort((a,b)=>a.symbol.localeCompare(b.symbol));
  for (let i=1;i<normalized.length;i+=1) {
    if (normalized[i-1].symbol===normalized[i].symbol) {
      throw new Error("DUPLICATE_SELECTED_PLAN_SYMBOL:" + normalized[i].symbol);
    }
  }

  const receipts=[];
  for (const plan of normalized) {
    const planFingerprint=await hashCanonicalReceipt(plan,"SELECTED_PLAN",cryptoImpl);
    receipts.push(Object.freeze({symbol:plan.symbol,planFingerprint,plan}));
  }

  const setPayload=receipts.map(x=>Object.freeze({
    symbol:x.symbol,
    planFingerprint:x.planFingerprint,
  }));
  const selectedPlanSetHash=await hashCanonicalReceipt(setPayload,"SELECTED_PLAN_SET",cryptoImpl);

  return Object.freeze({
    planCount:receipts.length,
    selectedPlanSetHash,
    receipts:Object.freeze(receipts),
  });
}

export function assessSelectedParentPlanLink({parents,planReceipts}) {
  if (!Array.isArray(parents)) throw new Error("PARENTS_ARRAY_REQUIRED");
  const selectedParentSymbols=parents
    .filter(row=>row?.selectedFlag===true || row?.formalState==="SELECTED")
    .map(row=>String(row.symbol??"").trim())
    .filter(Boolean)
    .sort();
  const planSymbols=(planReceipts?.receipts||[])
    .map(row=>String(row.symbol))
    .sort();

  const reasons=[];
  if (selectedParentSymbols.length!==planSymbols.length) reasons.push("SELECTED_PLAN_COUNT_MISMATCH");
  const n=Math.max(selectedParentSymbols.length,planSymbols.length);
  for(let i=0;i<n;i+=1){
    if(selectedParentSymbols[i]!==planSymbols[i]) {
      reasons.push("SELECTED_PLAN_SYMBOL_SET_MISMATCH");
      break;
    }
  }

  return Object.freeze({
    valid:reasons.length===0,
    status:reasons.length===0?"LINKED":"MISMATCH",
    selectedParentCount:selectedParentSymbols.length,
    selectedPlanCount:planSymbols.length,
    reasons:Object.freeze(reasons),
  });
}
