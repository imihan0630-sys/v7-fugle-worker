import assert from "node:assert/strict";
import {buildABSetupSamplingFrame} from "../research/ab_setup_sampling_frame_v0_1.mjs";

function row(symbol,{pool="GENERAL",near="A",pattern="A:111110|B:111100",state="SETUP_FIRST_FAILURE",date="2026-09-27"}={}){
  return {scanDate:date,symbol,pool,state,nearestChannel:near,checkPattern:pattern};
}

// Population counts are frozen before bounded sampling; minority strata cannot be starved by majority strata.
{
  const rows=[];
  for(let i=0;i<10;i+=1) rows.push(row("A"+i));
  rows.push(row("B0",{near:"B",pattern:"A:111100|B:111110"}));
  rows.push(row("B1",{near:"B",pattern:"A:111100|B:111110"}));
  const f=buildABSetupSamplingFrame(rows,{samplePerStratum:2,parentComplete:true});
  assert.equal(f.quality,"CLEAN");
  assert.equal(f.populationCells.length,2);
  const a=f.populationCells.find(x=>x.nearestChannel==="A");
  const b=f.populationCells.find(x=>x.nearestChannel==="B");
  assert.equal(a.populationCount,10);
  assert.equal(a.sampleCount,2);
  assert.equal(b.populationCount,2);
  assert.equal(b.sampleCount,2);
  assert.equal(f.sampleMembership.length,4);
}

// Deterministic sample is invariant to input ordering.
{
  const rows=Array.from({length:20},(_,i)=>row("S"+String(i).padStart(2,"0")));
  const a=buildABSetupSamplingFrame(rows,{samplePerStratum:6,parentComplete:true});
  const b=buildABSetupSamplingFrame([...rows].reverse(),{samplePerStratum:6,parentComplete:true});
  assert.deepEqual(a.sampleMembership.map(x=>x.symbol),b.sampleMembership.map(x=>x.symbol));
}

// Pre-setup rows remain semantic records but never enter the setup-first-failure sample.
{
  const rows=[
    row("F"),
    row("E",{state:"PRE_SETUP_NOT_REACHED"}),
    row("P",{state:"SETUP_PASS"}),
    row("U",{state:"UNKNOWN"})
  ];
  const f=buildABSetupSamplingFrame(rows,{samplePerStratum:6,parentComplete:true});
  assert.equal(f.stateCounts.SETUP_FIRST_FAILURE,1);
  assert.equal(f.stateCounts.PRE_SETUP_NOT_REACHED,1);
  assert.equal(f.stateCounts.SETUP_PASS,1);
  assert.equal(f.stateCounts.UNKNOWN,1);
  assert.deepEqual(f.sampleMembership.map(x=>x.symbol),["F"]);
}

// Sample membership is an overlay, not the semantic population.
{
  const rows=Array.from({length:9},(_,i)=>row("Q"+i));
  const f=buildABSetupSamplingFrame(rows,{samplePerStratum:3,parentComplete:true});
  assert.equal(f.semanticMembership.filter(x=>x.setupFirstFailureEligible).length,9);
  assert.equal(f.sampleMembership.length,3);
  assert.equal(f.policy.sampleMembershipSeparateFromSemanticMembership,true);
}

// Duplicate parent identity or incomplete parent coverage fails closed for promotion quality.
{
  const dup=[row("D"),row("D")];
  const a=buildABSetupSamplingFrame(dup,{parentComplete:true});
  assert.equal(a.quality,"UNKNOWN");
  assert.ok(a.duplicateParentKeys.length>0);
  const b=buildABSetupSamplingFrame([row("X")],{parentComplete:false});
  assert.equal(b.quality,"UNKNOWN");
}

// Incomplete bitmask/nearest strata do not silently become sampled evidence.
{
  const bad=row("BAD",{near:"UNKNOWN",pattern:"A:??????|B:??????"});
  const f=buildABSetupSamplingFrame([bad],{parentComplete:true});
  assert.equal(f.quality,"UNKNOWN");
  assert.equal(f.sampleMembership.length,0);
  assert.equal(f.invalidRows[0].reason,"INCOMPLETE_SETUP_STRATUM");
}

console.log(JSON.stringify({ok:true,populationBeforeSample:true,deterministic:true,semanticVsSampleSeparated:true,formalCoreImpact:false},null,2));
