import assert from "node:assert/strict";
import {summarizeAnchorAblations} from "./pattern_anchor_ablation_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("AA01 stable two-anchor ablations summarize zero loss",()=>{
 const r=summarizeAnchorAblations({
  officialCenter:100,officialWidth:4,atr:2,
  ablations:[
   {removedAnchorId:"a1",ablationZoneExists:true,ablationCenter:101,ablationWidth:4},
   {removedAnchorId:"a2",ablationZoneExists:true,ablationCenter:99,ablationWidth:4}
  ]
 });
 assert.equal(r.zoneLossCount,0);
 assert.equal(r.maxAbsCenterShiftATR,0.5);
});

t("AA02 zone disappearance is explicit",()=>{
 const r=summarizeAnchorAblations({
  officialCenter:100,officialWidth:4,atr:2,
  ablations:[{removedAnchorId:"a1",ablationZoneExists:false}]
 });
 assert.equal(r.zoneLossFraction,1);
});

t("AA03 minimum-anchor dependence excluded from eligible denominator",()=>{
 const r=summarizeAnchorAblations({
  officialCenter:100,officialWidth:4,atr:2,
  ablations:[
   {removedAnchorId:"a1",minimumAnchorDependence:true},
   {removedAnchorId:"a2",ablationZoneExists:true,ablationCenter:100,ablationWidth:4}
  ]
 });
 assert.equal(r.minimumAnchorDependenceCount,1);
 assert.equal(r.eligibleAblationCount,1);
});

t("AA04 width shift retained continuously",()=>{
 const r=summarizeAnchorAblations({
  officialCenter:100,officialWidth:4,atr:2,
  ablations:[{removedAnchorId:"a1",ablationZoneExists:true,ablationCenter:100,ablationWidth:5}]
 });
 assert.equal(r.maxAbsWidthShiftPct,0.25);
});

t("AA05 no eligible ablation does not invent zero loss rate",()=>{
 const r=summarizeAnchorAblations({
  officialCenter:100,officialWidth:4,atr:2,
  ablations:[{removedAnchorId:"a1",minimumAnchorDependence:true}]
 });
 assert.equal(r.zoneLossFraction,null);
});

t("AA06 invalid official geometry unknown",()=>{
 const r=summarizeAnchorAblations({officialCenter:null,officialWidth:4});
 assert.equal(r.status,"UNKNOWN");
});

t("AA07 missing anchor id unknown",()=>{
 const r=summarizeAnchorAblations({
  officialCenter:100,officialWidth:4,
  ablations:[{ablationZoneExists:false}]
 });
 assert.equal(r.status,"UNKNOWN");
});

t("AA08 missing surviving geometry unknown",()=>{
 const r=summarizeAnchorAblations({
  officialCenter:100,officialWidth:4,
  ablations:[{removedAnchorId:"a1",ablationZoneExists:true}]
 });
 assert.equal(r.status,"UNKNOWN");
});

t("AA09 center shift is scale-normalized when ATR valid",()=>{
 const r=summarizeAnchorAblations({
  officialCenter:100,officialWidth:4,atr:4,
  ablations:[{removedAnchorId:"a1",ablationZoneExists:true,ablationCenter:104,ablationWidth:4}]
 });
 assert.equal(r.maxAbsCenterShiftATR,1);
});

t("AA10 no ablation authorizes official mutation",()=>{
 const r=summarizeAnchorAblations({
  officialCenter:100,officialWidth:4,
  ablations:[{removedAnchorId:"a1",ablationZoneExists:false}]
 });
 assert.equal(r.officialZoneMutationAuthorized,false);
});

console.log(`SUMMARY ${pass}/10 PASS`);
