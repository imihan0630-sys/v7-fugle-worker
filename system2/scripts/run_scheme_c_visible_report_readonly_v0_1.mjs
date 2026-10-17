import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildSchemeCDailyVisibleReportV0_1}
 from '../runtime/scheme_c_daily_visible_report_v0_1.mjs';
const [receiptPath,dir]=process.argv.slice(2);
if(!receiptPath||!dir||process.argv.length!==4)
 throw Error('USAGE: node run_scheme_c_visible_report_readonly_v0_1.mjs <daily-handoff.json> <output-dir>');
const handoff=JSON.parse(await readFile(receiptPath,'utf8'));
const report=await buildSchemeCDailyVisibleReportV0_1({handoff});
await mkdir(resolve(dir),{recursive:true});
await writeFile(resolve(dir,'daily-nonpit-preview.md'),report.markdown+'\n',{flag:'wx',mode:0o600});
await writeFile(resolve(dir,'daily-nonpit-preview-meta.json'),
 JSON.stringify(report.metadata,null,2)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({
 marketDate:report.metadata.marketDate,ready:report.metadata.sourceReady,
 displayedCount:report.metadata.displayedCount,
 late:report.metadata.lateSource,sourceOnly:true,
 reportHash:report.metadata.reportHash,
 frozen:false,push:false,selectedCount:null
}));
