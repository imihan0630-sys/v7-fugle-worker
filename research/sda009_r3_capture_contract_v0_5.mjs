import {canonicalJcsJson,sha256HexUtf8} from './canonical_receipt_hash_v0_1.mjs';

export const SDA009_CAPTURE_CONTRACT_V0_5='SDA009_R3_CAPTURE_AND_COUNTERFACTUAL_CONTRACT_V0_5';
export const SDA009_CLASSIFICATION_SCHEME='SYSTEM1_RUNTIME_INDUSTRY_LABEL_V1';
export const SDA009_SECTOR_GATE_REASON='產業廣度、漲幅或資金活躍度偏弱';

const PRE_SECTOR_REASONS=new Set([
  '股價低於10元','歷史資料未滿60日','缺真實大盤或同日期族群RS資料','缺市值資料','市值低於10億','單日走勢過度異常',
  '20日流動性不足','10至30億市值缺少強力特殊理由','30至100億市值流動性要求未達','缺集保持股集中度，不補假值',
  '季度財報、估值或公告資料不足，不能通過精篩','官方公告有重大風險事件，暫不列可進場候選',
  '本益比明顯高於族群但成長未配合，估值風險過高','HISTORY_OR_FEATURE_ADMISSION_BLOCKED'
]);
const POST_SECTOR_REASONS=new Set([
  'A拉回承接/B突破後承接皆未形成候選','基本面資料不足，不能以中立分數假裝通過','基本面品質明顯不足',
  '波動品質不合格','上方無可驗證實質壓力，無法計算真實RR','預期RR低於2比1','策略品質低於B級，不列入推薦'
]);

export const SDA009_COUNTERFACTUAL_POLICIES=Object.freeze({
  FOCAL_ATTRIBUTION:Object.freeze({
    id:'SDA009_FOCAL_SELF_ATTRIBUTION_V0_1',
    semantics:'Only the focal candidate uses its own leave-one-out sector state; all peers retain production values.'
  }),
  FULL_LOO_POLICY:Object.freeze({
    id:'SDA009_FULL_SELF_EXCLUDED_POLICY_V0_1',
    semantics:'Every candidate uses its own self-excluded sector state and candidate-specific normalizer under one explicit policy.'
  })
});

const hash=async (domain,value)=>sha256HexUtf8(domain+'|'+canonicalJcsJson(value));

export function classifySectorGateReachV05(formalResult){
  if(!formalResult||typeof formalResult!=='object') return 'NOT_REACHED';
  if(formalResult.ok===true) return 'REACHED_AND_PASSED';
  const reason=String(formalResult.firstFailure||formalResult.reason||'');
  if(PRE_SECTOR_REASONS.has(reason)) return 'NOT_REACHED';
  if(reason===SDA009_SECTOR_GATE_REASON) return 'REACHED_AND_FAILED_SECTOR';
  if(POST_SECTOR_REASONS.has(reason)) return 'REACHED_AND_FAILED_LATER';
  return 'UNKNOWN';
}

export function classifyIndustryLabelV05(industry){
  const s=String(industry??'').trim();
  return !s||s==='未分類'||s.toUpperCase()==='UNKNOWN'?'UNCLASSIFIED_PSEUDO_BUCKET':'CLASSIFIED';
}

export function buildMembershipProjectionV05(rows=[]){
  return [...rows].map(r=>({
    market:String(r?.market||'UNKNOWN'),
    symbol:String(r?.symbol||''),
    industry:String(r?.industry||'未分類')
  })).sort((a,b)=>a.market.localeCompare(b.market)||a.symbol.localeCompare(b.symbol)||a.industry.localeCompare(b.industry));
}

export function buildSectorDecisionProjectionV05(sectorStats={}){
  return Object.values(sectorStats||{}).map(s=>({
    industry:String(s?.industry||'未分類'),
    stockCount:Number(s?.stockCount||0),
    historicalCoverage:Number(s?.historicalCoverage||0),
    amount:Number(s?.amount||0),
    breadth:Number(s?.breadth||0),
    avgChange:Number.isFinite(s?.avgChange)?Number(s.avgChange):null,
    amountVs20DayAverage:Number.isFinite(s?.amountVs20DayAverage)?Number(s.amountVs20DayAverage):null,
    score:Number.isFinite(s?.score)?Number(s.score):null
  })).sort((a,b)=>a.industry.localeCompare(b.industry));
}

export async function buildSda009CaptureIdentityV05({rows=[],sectorStats={}}={}){
  const membershipProjection=buildMembershipProjectionV05(rows);
  const sectorDecisionStateProjection=buildSectorDecisionProjectionV05(sectorStats);
  const membershipDigest=await hash('SDA009_INDUSTRY_MEMBERSHIP_V0_1',membershipProjection);
  const sectorDecisionStateDigest=await hash('SDA009_SECTOR_DECISION_STATE_V0_1',sectorDecisionStateProjection);
  return {
    classificationSchemeId:SDA009_CLASSIFICATION_SCHEME,
    membershipVersion:'SDA009_RUNTIME_INDUSTRY_MEMBERSHIP_V0_1:'+membershipDigest,
    membershipDigest,
    sectorDecisionStateVersion:'SDA009_SECTOR_DECISION_STATE_V0_1',
    sectorDecisionStateProjection,
    sectorDecisionStateDigest,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}
