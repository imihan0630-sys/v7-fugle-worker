import assert from 'node:assert/strict';
import {
  classifySectorGateReachV05,classifyIndustryLabelV05,buildSda009CaptureIdentityV05,
  SDA009_COUNTERFACTUAL_POLICIES
} from './sda009_r3_capture_contract_v0_5.mjs';

let n=0;const eq=(a,b)=>{assert.equal(a,b);n++;};const ne=(a,b)=>{assert.notEqual(a,b);n++;};
eq(classifySectorGateReachV05({ok:true}),'REACHED_AND_PASSED');
eq(classifySectorGateReachV05({ok:false,firstFailure:'產業廣度、漲幅或資金活躍度偏弱'}),'REACHED_AND_FAILED_SECTOR');
eq(classifySectorGateReachV05({ok:false,firstFailure:'預期RR低於2比1'}),'REACHED_AND_FAILED_LATER');
eq(classifySectorGateReachV05({ok:false,firstFailure:'缺市值資料'}),'NOT_REACHED');
eq(classifySectorGateReachV05({ok:false,firstFailure:'NEW_REASON'}),'UNKNOWN');
eq(classifyIndustryLabelV05('未分類'),'UNCLASSIFIED_PSEUDO_BUCKET');
eq(classifyIndustryLabelV05('半導體業'),'CLASSIFIED');

const rows=[{market:'TWSE',symbol:'2330',industry:'半導體業'},{market:'TPEX',symbol:'6488',industry:'半導體業'}];
const stats={x:{industry:'半導體業',stockCount:2,historicalCoverage:2,amount:100,breadth:50,avgChange:1,amountVs20DayAverage:.8,score:60}};
const a=await buildSda009CaptureIdentityV05({rows,sectorStats:stats});
const b=await buildSda009CaptureIdentityV05({rows:[...rows].reverse(),sectorStats:stats});
eq(a.membershipDigest,b.membershipDigest);
eq(a.sectorDecisionStateDigest,b.sectorDecisionStateDigest);
const c=await buildSda009CaptureIdentityV05({rows:[{...rows[0],industry:'電子零組件業'},rows[1]],sectorStats:stats});
ne(a.membershipDigest,c.membershipDigest);
const d=await buildSda009CaptureIdentityV05({rows,sectorStats:{x:{...stats.x,score:61}}});
ne(a.sectorDecisionStateDigest,d.sectorDecisionStateDigest);
ne(SDA009_COUNTERFACTUAL_POLICIES.FOCAL_ATTRIBUTION.id,SDA009_COUNTERFACTUAL_POLICIES.FULL_LOO_POLICY.id);
console.log(JSON.stringify({result:'PASS',assertions:n},null,2));
