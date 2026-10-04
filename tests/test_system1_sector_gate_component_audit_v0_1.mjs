import assert from 'node:assert/strict';
import {buildSystem1SectorGateComponentAudit as audit} from '../research/system1_sector_gate_component_audit_v0_1.mjs';

const base={sessionDate:'2026-10-05',generationId:'C1:g',decisionAt:'2026-10-05T08:00:00Z',researchOnly:true,decisionImpact:false,formalCoreImpact:false};
const mk=(symbol,{breadth=50,ret=0,amount=1,fail=[],unknown=[]}={})=>({
  raw:{symbol,sector:{breadth,avgChange:ret,amountVs20DayAverage:amount}},
  obs:{symbol,pool:'GENERAL',firstFailureReason:null,formalResult:{ok:false},gates:{
    SECTOR_GATE:{status:fail.length?'FAIL':unknown.length?'UNKNOWN':'PASS'},
    SECTOR_BREADTH:{status:fail.includes('SECTOR_BREADTH')?'FAIL':unknown.includes('SECTOR_BREADTH')?'UNKNOWN':'PASS'},
    SECTOR_RETURN:{status:fail.includes('SECTOR_RETURN')?'FAIL':unknown.includes('SECTOR_RETURN')?'UNKNOWN':'PASS'},
    SECTOR_AMOUNT:{status:fail.includes('SECTOR_AMOUNT')?'FAIL':unknown.includes('SECTOR_AMOUNT')?'UNKNOWN':'PASS'}
  }}
});
const cases=[
  mk('PASS',{breadth:55,ret:.5,amount:1}),
  mk('B',{breadth:35,ret:.2,amount:1,fail:['SECTOR_BREADTH']}),
  mk('R',{breadth:60,ret:-1.2,amount:1,fail:['SECTOR_RETURN']}),
  mk('A',{breadth:60,ret:.2,amount:.4,fail:['SECTOR_AMOUNT']}),
  mk('BR',{breadth:35,ret:-1.2,amount:1,fail:['SECTOR_BREADTH','SECTOR_RETURN']}),
  mk('U',{breadth:60,ret:.2,amount:.8,unknown:['SECTOR_AMOUNT']}),
  mk('UF',{breadth:35,ret:.2,amount:.8,fail:['SECTOR_BREADTH'],unknown:['SECTOR_AMOUNT']})
];
const adapted={...base,rows:cases.map(x=>x.raw)};
const diagnosis={...base,schemaVersion:'SYSTEM1_C1_ISOLATED_V0_1',observations:cases.map(x=>x.obs)};
const ff={perGate:{SECTOR_GATE:{firstFailureN:2,observedFailN:4,hiddenBehindOtherFirstFailureN:2}}};
const x=audit({adapted,diagnosis,firstFailureMasking:ff});
assert.equal(x.observedN,7);
assert.equal(x.combinedFailN,4);
assert.equal(x.combinedUnknownN,2);
assert.equal(x.singleComponentFailN,3);
assert.equal(x.multiComponentFailN,1);
assert.equal(x.uniqueFailCounts.SECTOR_BREADTH,1);
assert.equal(x.uniqueFailCounts.SECTOR_RETURN,1);
assert.equal(x.uniqueFailCounts.SECTOR_AMOUNT,1);
assert.equal(x.patternCounts['FAIL:BREADTH+RETURN'],1);
assert.equal(x.patternCounts['MIXED_FAIL_UNKNOWN:BREADTH|AMOUNT'],1);
assert.equal(x.componentCounts.breadth.FAIL,3);
assert.equal(x.componentCounts.avgChange.FAIL,2);
assert.equal(x.componentCounts.amountVs20DayAverage.FAIL,1);
assert.equal(x.firstFailureMasking.hiddenBehindEarlierFirstFailureN,2);
assert.equal(x.combinedComponentMismatchN,0);
assert.equal(x.evidenceTrust,'COMPONENT_PARITY_VERIFIED');
assert.equal(x.economicSuperiority,'UNKNOWN');

const bad=structuredClone(diagnosis);
bad.observations[0].gates.SECTOR_GATE.status='FAIL';
const y=audit({adapted,diagnosis:bad});
assert.equal(y.combinedComponentMismatchN,1);
assert.equal(y.evidenceTrust,'DATA_QUALITY_BLOCKED');
assert.throws(()=>audit({adapted:{...adapted,researchOnly:false},diagnosis}),/SECTOR_GATE_C1_DIAGNOSIS_REQUIRED/);

console.log(JSON.stringify({ok:true,combinedFailN:x.combinedFailN,singleComponentFailN:x.singleComponentFailN,
  multiComponentFailN:x.multiComponentFailN,hiddenSector:x.firstFailureMasking.hiddenBehindEarlierFirstFailureN,formalCoreImpact:false}));
