// CREATE-ONLY offline sidecar: reads an already-generated V1.1 activity receipt,
// its exact original A1/B5 source bundle and existing bounded research seeds.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildSystem2IndustryThemeOverlapV0_1 as build,renderSystem2IndustryThemeOverlapV0_1 as render} from '../runtime/industry_theme_activity_overlap_v0_1.mjs';
const [receiptPath,inputPath,seedPath,directory]=process.argv.slice(2);
if(!receiptPath||!inputPath||!seedPath||!directory||process.argv.length!==6)
 throw Error('USAGE: <activity-source-only.json> <exact-source-bundle.json> <prior-research-seeds.json> <output-directory>');
const [activityReceipt,radarSourceInputs,priorResearchSeeds]=await Promise.all(
 [receiptPath,inputPath,seedPath].map(p=>readFile(p,'utf8').then(JSON.parse)));
const receipt=await build({activityReceipt,radarSourceInputs,priorResearchSeeds,
 generatedAtUtc:new Date().toISOString()});
await mkdir(resolve(directory),{recursive:true});
await writeFile(resolve(directory,'industry-theme-overlap-source-only.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
await writeFile(resolve(directory,'industry-theme-overlap-source-only.md'),render(receipt)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({
 marketDate:receipt.marketDate,subindustries:receipt.subindustryGroups.length,
 themes:receipt.themeGroups.length,uniqueObservedMembers:receipt.uniqueThemeResearchMemberCount,
 multipleThemeMembers:receipt.overlappingThemeStockCount,
 currentFullMarketCoverage:null,verifiedNetCapitalFlow:false,
 receiptHash:receipt.receiptHash,noNetworkOrDBWrites:true
}));
