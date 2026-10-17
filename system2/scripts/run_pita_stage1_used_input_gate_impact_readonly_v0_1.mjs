// System2 BUILD: read-only owner-review impact receipt; NEVER admission.
import {mkdir,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {buildPitAStage1UsedInputGateImpactV0_1}
 from '../runtime/pita_stage1_used_input_gate_impact_diff_v0_1.mjs';

if(process.argv.length!==3)throw Error('USAGE: node run_pita_stage1_used_input_gate_impact_readonly_v0_1.mjs <output-json>');
const result=await buildPitAStage1UsedInputGateImpactV0_1();
const path=resolve(process.argv[2]);
await mkdir(dirname(path),{recursive:true});
await writeFile(path,JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({
 status:result.status,sourceOnlyControls:result.exactLocalControlCount,
 actualPitAccepted:result.realPitAcceptedLocalCount,
 actualPitUnknown:result.realPitUnknownLocalCount,
 factorCount:result.impactCases[0].factorExposure.length,
 selectedCount:null,frozenD1Written:false,
 hash:result.receiptHash
}));
