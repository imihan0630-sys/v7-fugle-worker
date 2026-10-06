import assert from "node:assert/strict";
import {buildBarVisitOccupancy,buildTimeVolumeDescriptors,classifyInventoryReceipt} from "./pattern_time_at_price_inventory_v0_1.mjs";
let p=0; const t=(n,f)=>{f();p++;console.log("PASS",n);};
const o=buildBarVisitOccupancy({bars:[
{low:99,high:101,completed:true,completedAt:"2026-10-06T09:15:00+08:00"},
{low:105,high:106,completed:true,completedAt:"2026-10-06T09:30:00+08:00"},
{low:100,high:102,completed:true,completedAt:"2026-10-06T09:45:00+08:00"}
],bin:{lower:100,upper:102},predictorFreezeAt:"2026-10-06T10:00:00+08:00"});
t("TP11",()=>assert.equal(buildTimeVolumeDescriptors({occupancy:o,executedVolumeInZone:1000}).volumePerVisitedBar,500));
t("TP12",()=>assert.equal(buildTimeVolumeDescriptors({occupancy:o,executedVolumeInZone:1000}).occupancyEqualsVolume,false));
t("TP13",()=>assert.equal(buildTimeVolumeDescriptors({occupancy:o,executedVolumeInZone:1000}).tradeIntensityIdentified,false));
t("TP14",()=>assert.equal(buildTimeVolumeDescriptors({occupancy:o,executedVolumeInZone:1000,tradeCount:25}).tradeIntensityIdentified,true));
t("TP15",()=>assert.equal(classifyInventoryReceipt({netFlowOnly:true,asOfKnown:true,replaySafe:true}).inventoryState,"UNKNOWN"));
console.log(`SUMMARY ${p}/5 PASS`);
