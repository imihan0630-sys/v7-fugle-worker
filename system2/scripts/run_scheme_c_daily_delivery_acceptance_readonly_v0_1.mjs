import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {assessSchemeCDailyDeliveryV0_1} from '../runtime/scheme_c_daily_delivery_acceptance_v0_1.mjs';

if(process.argv.length!==7)
 throw Error('USAGE: node run_scheme_c_daily_delivery_acceptance_readonly_v0_1.mjs <signed-handoff.json> <signed-origin.json> <report-meta.json> <report.md> <output.json>');
const [handoff,origin,reportMeta,reportMarkdown]=await Promise.all([
 readFile(process.argv[2],'utf8').then(JSON.parse),
 readFile(process.argv[3],'utf8').then(JSON.parse),
 readFile(process.argv[4],'utf8').then(JSON.parse),
 readFile(process.argv[5],'utf8')
]);
const receipt=await assessSchemeCDailyDeliveryV0_1({handoff,origin,reportMeta,reportMarkdown});
const path=resolve(process.argv[6]);
await mkdir(dirname(path),{recursive:true});
await writeFile(path,JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({status:receipt.status,marketDate:receipt.marketDate,sourceCronCertified:false,selectedCount:null,frozen:false,receiptHash:receipt.acceptanceHash}));
