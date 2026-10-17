// Owner-approved Scheme C System2 (NON_PIT_PREVIEW only) read-only CLI.
// Accepts an already original-source-attested PRELIMINARY V0.2 derived receipt;
// never fetches provider data, ranks as official, pushes, or writes D1/R2.
import {readFile} from 'node:fs/promises';
import {routeSystem2ThreeLayerSelectionV0_1}
 from '../runtime/three_layer_selection_preview_router_v0_1.mjs';
const input=process.argv[2];
if(!input||process.argv.length>4)
 throw Error('USAGE: node system2/scripts/run_three_layer_selection_preview_readonly_v0_1.mjs <preliminary-pv-watch.json> [requested-decision-at-UTC]');
let receipt;
try{receipt=JSON.parse(await readFile(input,'utf8'))}
catch{throw Error('PRELIMINARY_SOURCE_RECEIPT_UNREADABLE');}
const result=await routeSystem2ThreeLayerSelectionV0_1({
 layer:'NON_PIT_PREVIEW',preliminaryReceipt:receipt,
 requestedDecisionAtUtc:process.argv[3]||null
});
console.log(JSON.stringify(result,null,2));
