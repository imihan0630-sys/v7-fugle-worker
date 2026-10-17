// BUILD Class A read-only local/exported source-only radar; never fetches data.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildSystem2IndustryActivityRadarV0_1 as build,renderSystem2IndustryActivityRadarV0_1 as render} from '../runtime/industry_activity_rotation_radar_v0_1.mjs';
const [input,output]=process.argv.slice(2);
if(!input||!output||process.argv.length!==4)throw Error('USAGE: <DATA-A1-B5-scope-bundle.json> <existing-or-new-output-dir>');
const x=JSON.parse(await readFile(input,'utf8'));
const r=await build({...x,generatedAtUtc:new Date().toISOString()});
await mkdir(resolve(output),{recursive:true});
await writeFile(resolve(output,'industry-activity-radar-source-only.json'),JSON.stringify(r,null,2)+'\n',{flag:'wx',mode:0o600});
await writeFile(resolve(output,'industry-activity-radar-source-only.md'),render(r)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({marketDate:r.marketDate,state:r.state,rows:r.actualDailyBarRows,sourceUniverse:r.fourDigitInstrumentUniverseCount,sourceOnlyMainGroups:r.sourceOnlyIndustryCount,marketShareCertified:false,institutionNetVerified:false,receiptHash:r.receiptHash}));
