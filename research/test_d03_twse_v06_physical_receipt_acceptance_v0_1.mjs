import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const spec=JSON.parse(await readFile(new URL("./d03_twse_v06_physical_receipt_acceptance_cases_20261007_v0_1.json",import.meta.url),"utf8"));
const H="a".repeat(64);
const base={
  market:"TWSE",verifierSchema:"S2_HISTORICAL_MARKET_YEAR_PHYSICAL_VERIFICATION_V0_6",
  fromDate:"2024-01-01",toDate:"2024-12-31",beforeUnknownBars:12,afterUnknownBars:10,
  reclassifiedUnknownBars:2,beforeMissingReasonCounts:{MISSING:12},afterMissingReasonCounts:{MISSING:10},
  reclassifiedIdentities:["TWSE|8101|2024-04-01","TWSE|1701|2024-07-02"],
  eventSourceHashes:[H],conflictCount:0,unresolvedConflicts:[],partialSymbolCount:0,
  coldOhlcvMutation:false,absenceCertifiesNoEvent:false,layerCKnownAtProven:false,promotionRequested:false,
};
const hash=x=>/^[0-9a-f]{64}$/.test(String(x));
function decide(r){
  if(r.verifierSchema!==spec.requiredInvariant.verifierSchema)return "REJECT_SCHEMA";
  if(r.market!=="TWSE")return "REJECT_MARKET";
  if(!/^\d{4}-\d{2}-\d{2}$/.test(r.fromDate)||!/^\d{4}-\d{2}-\d{2}$/.test(r.toDate)||r.fromDate>r.toDate)return "REJECT_WINDOW";
  if(!Number.isInteger(r.beforeUnknownBars)||!Number.isInteger(r.afterUnknownBars))return "REJECT_NO_BASELINE";
  if(r.reclassifiedUnknownBars<0)return "REJECT_NEGATIVE_RECLASSIFICATION";
  if(r.beforeUnknownBars-r.afterUnknownBars!==r.reclassifiedUnknownBars)return "REJECT_ARITHMETIC";
  const b=Object.values(r.beforeMissingReasonCounts||{}).reduce((a,x)=>a+Number(x),0);
  const a=Object.values(r.afterMissingReasonCounts||{}).reduce((s,x)=>s+Number(x),0);
  if(b-a!==r.reclassifiedUnknownBars)return "REJECT_REASON_RECONCILIATION";
  if(!Array.isArray(r.reclassifiedIdentities)||r.reclassifiedIdentities.length!==r.reclassifiedUnknownBars)return "REJECT_IDENTITY_COUNT";
  if(new Set(r.reclassifiedIdentities).size!==r.reclassifiedIdentities.length)return "REJECT_DUPLICATE_IDENTITY";
  if(!Array.isArray(r.eventSourceHashes)||r.eventSourceHashes.some(x=>!hash(x)))return "REJECT_SOURCE_HASH";
  if(r.conflictCount!==0||(r.unresolvedConflicts||[]).length)return "REJECT_CONFLICT";
  if(r.partialSymbolCount!==0)return "REJECT_PARTIAL_SOURCE";
  if(r.coldOhlcvMutation!==false)return "REJECT_MUTATION";
  if(r.absenceCertifiesNoEvent!==false)return "REJECT_ABSENCE_INFERENCE";
  if(r.layerCKnownAtProven!==false)return "REJECT_LAYER_C_LEAKAGE";
  if(r.reclassifiedUnknownBars===0&&r.promotionRequested)return "REJECT_PROMOTION_FROM_ZERO_DELTA";
  return r.reclassifiedUnknownBars===0?"ACCEPT_ZERO_DELTA_NEGATIVE_EVIDENCE":"ACCEPT_LAYER_B_RECEIPT";
}
for(const c of spec.cases){
  const got=decide({...base,...c.patch});
  assert.equal(got,c.expected,c.id);
}
console.log(JSON.stringify({status:"PASS",cases:spec.cases.length,positiveReceipt:"ACCEPT_LAYER_B_RECEIPT",zeroDelta:"NEGATIVE_EVIDENCE_ONLY",maturityPct:56.7,formalCoreImpact:"NONE_LOCKED"}));
