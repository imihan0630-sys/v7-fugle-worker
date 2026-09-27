import assert from "node:assert/strict";
import {GATE_STATE,observeFormalGateOverlap} from "../research/formal_gate_overlap_observer_v0_4.mjs";

const goodFeature={
  close:100,historyDays:80,marketReturn20:3,sectorReturn20:5,marketCapYi:200,changePercent:1,
  avgVolume20Lots:1500,avgAmount20:80000000,spreadPercent:0.2,orderBookDepthGood:true,depthScore:90,
  chipConcentration:60,quarterRevenue:100,
  financialBasis:"營收及利益為MOPS累計仟元差額轉單季；EPS為實際公告累計值，不推估單季",
  revenueQoQ:3,revenueQuarterYoY:20,
  valuationObserved:true,priceBookRatio:2,announcementsVerified:true,
  priceEarningsRatio:18,sectorMedianPe:15,epsYoY:10,atrPercent:3
};
const goodSector={breadth:55,avgChange:0.5,amountVs20DayAverage:1.1};
const goodDerived={
  institutionalScore:75,fundamentalCount:6,fundamentalScore:60,
  setupState:{A:{pass:true},B:{pass:false}},
  targetState:"FOUND",target:120,rewardPerRisk:2.5,setupQuality:75
};

{
  const out=observeFormalGateOverlap({feature:goodFeature,sector:goodSector,derived:goodDerived,formalResult:{ok:true,basePassed:true,rrPassed:true}});
  assert.equal(out.gates.FINANCIAL_SOURCE_COMPLETENESS.status,GATE_STATE.PASS,
    "realistic non-empty financialBasis string is truthy in Formal and must not become UNKNOWN");
  assert.equal(out.gates.ANNOUNCEMENT_RISK.status,GATE_STATE.PASS,
    "verified source plus absent per-symbol list means empty list under Formal semantics");
}

// Explicit null/empty numeric evidence must never be Number-coerced to zero.
for(const [field,gate] of [
  ["close","PRICE_FLOOR"],
  ["historyDays","HISTORY_60D"],
  ["marketCapYi","MARKET_CAP_FLOOR"],
  ["chipConcentration","CHIP_CONCENTRATION_PRESENT"],
  ["atrPercent","ATR_QUALITY"]
]){
  for(const missing of [null,""]){
    const feature={...goodFeature,[field]:missing};
    const out=observeFormalGateOverlap({feature,sector:goodSector,derived:goodDerived});
    assert.equal(out.gates[gate].status,GATE_STATE.UNKNOWN,field+" missing should be UNKNOWN");
  }
}

// Null market/sector RS must not become numeric zero and accidentally PASS.
{
  const out=observeFormalGateOverlap({
    feature:{...goodFeature,marketReturn20:null,sectorReturn20:null},
    sector:goodSector,derived:goodDerived
  });
  assert.equal(out.gates.RS_CONTEXT.status,GATE_STATE.UNKNOWN);
}

// Null derived fundamentals/RR/grade must preserve epistemic uncertainty.
{
  const a=observeFormalGateOverlap({feature:goodFeature,sector:goodSector,derived:{...goodDerived,fundamentalCount:null,fundamentalScore:null}});
  assert.equal(a.gates.FUNDAMENTAL_COMPONENT_COUNT.status,GATE_STATE.UNKNOWN);
  assert.equal(a.gates.FUNDAMENTAL_QUALITY.status,GATE_STATE.UNKNOWN);

  const b=observeFormalGateOverlap({feature:goodFeature,sector:goodSector,derived:{...goodDerived,rewardPerRisk:null}});
  assert.equal(b.gates.REWARD_RISK.status,GATE_STATE.UNKNOWN);

  const c=observeFormalGateOverlap({feature:goodFeature,sector:goodSector,derived:{...goodDerived,setupQuality:null}});
  assert.equal(c.gates.FINAL_SIGNAL_GRADE.status,GATE_STATE.UNKNOWN);
}

// Explicit false source flags remain not-proven, not silently converted to pass.
{
  const out=observeFormalGateOverlap({
    feature:{...goodFeature,financialBasis:false,valuationObserved:false,announcementsVerified:false},
    sector:goodSector,derived:goodDerived
  });
  assert.equal(out.gates.FINANCIAL_SOURCE_COMPLETENESS.status,GATE_STATE.UNKNOWN);
  assert.equal(out.gates.ANNOUNCEMENT_RISK.status,GATE_STATE.UNKNOWN);
}

// Missing officialAnnouncements array is only safe-empty when the source itself is verified.
{
  const verified=observeFormalGateOverlap({feature:{...goodFeature},sector:goodSector,derived:goodDerived});
  assert.equal(verified.gates.ANNOUNCEMENT_RISK.status,GATE_STATE.PASS);
  const unverified=observeFormalGateOverlap({feature:{...goodFeature,announcementsVerified:null},sector:goodSector,derived:goodDerived});
  assert.equal(unverified.gates.ANNOUNCEMENT_RISK.status,GATE_STATE.UNKNOWN);
}

console.log(JSON.stringify({
  ok:true,
  nullAndEmptyAreUnknown:true,
  financialBasisFormalTruthinessMirrored:true,
  verifiedNoAnnouncementMeansEmptySet:true,
  formalCoreImpact:false
},null,2));


// V0.4 valuation semantic repair: missing EPS YoY is not UNKNOWN under deployed Formal.
{
  const feature={...goodFeature,priceEarningsRatio:45,sectorMedianPe:15,revenueQuarterYoY:20,epsYoY:null};
  const out=observeFormalGateOverlap({feature,sector:goodSector,derived:goodDerived,formalResult:{ok:false,reason:"本益比明顯高於族群但成長未配合，估值風險過高"}});
  assert.equal(out.gates.VALUATION_RELATIVE_RISK.status,GATE_STATE.FAIL);
  assert.equal(out.gates.VALUATION_RELATIVE_RISK.epsGrowthEvidenceObserved,false);
  assert.equal(out.gates.VALUATION_RELATIVE_RISK.formalMissingEpsActsAsNoException,true);
}
{
  const feature={...goodFeature,priceEarningsRatio:45,sectorMedianPe:15,revenueQuarterYoY:30,epsYoY:null};
  const out=observeFormalGateOverlap({feature,sector:goodSector,derived:goodDerived});
  assert.equal(out.gates.VALUATION_RELATIVE_RISK.status,GATE_STATE.PASS);
  assert.equal(out.gates.VALUATION_RELATIVE_RISK.revenueGrowthException,true);
}
{
  const feature={...goodFeature,priceEarningsRatio:45,sectorMedianPe:15,revenueQuarterYoY:null,epsYoY:40};
  const out=observeFormalGateOverlap({feature,sector:goodSector,derived:goodDerived});
  assert.equal(out.gates.VALUATION_RELATIVE_RISK.status,GATE_STATE.UNKNOWN);
  assert.equal(out.gates.VALUATION_RELATIVE_RISK.reason,"UPSTREAM_REVENUE_GROWTH_MISSING");
}


// V0.4 ATR semantic repair: deployed Formal rejects missing ATR via (atrPercent || 0).
{
  const feature={...goodFeature,atrPercent:null};
  const out=observeFormalGateOverlap({feature,sector:goodSector,derived:goodDerived});
  assert.equal(out.gates.ATR_QUALITY.status,GATE_STATE.FAIL);
  assert.equal(out.gates.ATR_QUALITY.reason,"FORMAL_COERCED_MISSING_ATR_TO_ZERO");
  assert.equal(out.gates.ATR_QUALITY.atrEvidenceObserved,false);
  assert.equal(out.gates.ATR_QUALITY.formalCoercedValue,0);
}
{
  const feature={...goodFeature,atrPercent:0};
  const out=observeFormalGateOverlap({feature,sector:goodSector,derived:goodDerived});
  assert.equal(out.gates.ATR_QUALITY.status,GATE_STATE.FAIL);
  assert.equal(out.gates.ATR_QUALITY.atrEvidenceObserved,true);
}
