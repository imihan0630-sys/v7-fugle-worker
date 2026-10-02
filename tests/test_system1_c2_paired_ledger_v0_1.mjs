import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {buildC2ProspectivePairedLedger} from "../research/system1_c2_paired_ledger_v0_1.mjs";

const day="2026-10-01",decisionAt="2026-10-01T10:00:00Z";
const sha=value=>createHash("sha256").update(value).digest("hex");
const feature={close:100,historyDays:80,marketReturn20:3,sectorReturn20:5,
  marketCapYi:200,changePercent:1,avgVolume20Lots:1600,avgAmount20:80000000,
  spreadPercent:.2,depthScore:90,orderBookDepthGood:true,chipConcentration:60,
  quarterRevenue:100,financialBasis:true,revenueQoQ:3,revenueQuarterYoY:20,
  valuationObserved:true,priceBookRatio:2,announcementsVerified:true,
  officialAnnouncements:[],priceEarningsRatio:18,sectorMedianPe:15,epsYoY:10,atrPercent:3};
const sector={breadth:55,avgChange:.5,amountVs20DayAverage:1.1};
const derived={institutionalScore:75,fundamentalCount:6,fundamentalScore:60,
  setupState:{A:{pass:true},B:{pass:false}},targetState:"FOUND",target:120,
  rewardPerRisk:2.5,setupQuality:75,entryGeometry:{entry:100,stop:92,target:120}};
const safety={SOURCE_AUTHENTICITY:{status:"PASS"},SESSION_CONTINUITY:{status:"PASS"},
  CORPORATE_ACTION_CONTINUITY:{status:"UNKNOWN",reason:"INDEPENDENT_PROOF_MISSING"},
  EXECUTION_FEASIBILITY:{status:"UNKNOWN",reason:"BROKER_NOT_CONNECTED"},
  ACCOUNT_RISK:{status:"UNKNOWN",reason:"ACCOUNT_UNKNOWN"}};
const rows=[
  {symbol:"2006",feature,sector,derived,safety,historyAdmission:{usable:true,status:"VALID"},
    formalResult:{ok:true,firstFailure:null,selected:true,selectedRank:1,basePassed:true,rrPassed:true}},
  {symbol:"2330",feature:{...feature,close:100},sector,derived,safety,historyAdmission:{usable:true,status:"VALID"},
    formalResult:{ok:false,firstFailure:"基本面品質不足",selected:false,basePassed:true,rrPassed:false}},
  {symbol:"9999",feature:{close:30,historyDays:null},sector:null,derived:null,
    safety:{SOURCE_AUTHENTICITY:{status:"PASS"}},historyAdmission:{usable:false,status:"UNKNOWN"},
    formalResult:{ok:false,firstFailure:"HISTORY_OR_FEATURE_ADMISSION_BLOCKED",selected:false}}
];
function pagesOf(list=rows) {
  const generationId="C1:2026-10-01:fixture-only",symbols=list.map(row=>row.symbol);
  const header={generationId,readbackVerified:true,contentDigest:sha(JSON.stringify(list)),
    universeDigest:sha([...symbols].sort().join("\n")),populationN:list.length,chunkCount:2,
    sessionDate:day,decisionAt,sourceMainSha:"a".repeat(40),
    effectiveRuntimeVersion:"8.15.0-c1-population-receipts",
    completeness:"IN_MEMORY_COMPLETE_NORMALIZED_UNIVERSE"};
  return [{header,chunks:[{chunkIndex:0,rowCount:2,rows:list.slice(0,2)}]},
    {header,chunks:[{chunkIndex:1,rowCount:list.length-2,rows:list.slice(2)}]}];
}
let n=0;function eq(got,want){assert.deepEqual(got,want);n++;}
const p=buildC2ProspectivePairedLedger(pagesOf());
eq(p.tally.populationN,3);eq(p.tally.formalQualifiedN,1);eq(p.tally.formalSelectedN,1);
eq(p.tally.formalRejectedButConditionalShortGatesPassN,1);
eq(p.tally.shortSafetyUnverifiedN,3);
eq(p.pairs.find(x=>x.symbol==="2330").short.withoutSafetyGateStatus,"PASS");
eq(p.pairs.find(x=>x.symbol==="2330").short.gateStatus,"UNKNOWN");
eq(p.pairs.find(x=>x.symbol==="2330").short.lifecycle,"DATA_BLOCKED");
eq(p.pairs.find(x=>x.symbol==="9999").short.withoutSafetyGateStatus,"UNKNOWN");
eq(p.pairs.every(x=>x.buyAuthorized===false&&x.signal===null&&x.allocation===0),true);
eq(p.completeMatchedCohort,true);
eq(p.economicSuperiority,"UNKNOWN");
eq(p.executionComparison,"UNKNOWN");
eq(p.formalCoreImpact,false);
eq(p.fingerprint,buildC2ProspectivePairedLedger([...pagesOf()].reverse()).fingerprint);
assert.throws(()=>buildC2ProspectivePairedLedger([{...pagesOf()[0],header:{...pagesOf()[0].header,contentDigest:"0".repeat(64)}},pagesOf()[1]]),/HEADER_MISMATCH|DIGEST_MISMATCH/);n++;
const wrong=pagesOf();wrong[1].chunks[0].rows=[{...rows[2],symbol:"2330"}];
assert.throws(()=>buildC2ProspectivePairedLedger(wrong),/DIGEST_MISMATCH|DUPLICATE/);n++;
const badSource=pagesOf().map(page=>({...page,header:{...page.header,sourceMainSha:"LOCAL_UNSET"}}));
assert.throws(()=>buildC2ProspectivePairedLedger(badSource),/VERIFIED_FULL_C1_REQUIRED/);n++;
assert.deepEqual(rows[0].safety.ACCOUNT_RISK.status,"UNKNOWN");n++;
console.log(JSON.stringify({ok:true,assertions:n,fixtureOnly:true,positiveClaims:0,realOrders:0,formalCoreImpact:false}));
