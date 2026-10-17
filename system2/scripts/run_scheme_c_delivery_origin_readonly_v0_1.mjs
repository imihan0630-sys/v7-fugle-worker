import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildSchemeCDeliveryOriginV0_1} from '../runtime/scheme_c_delivery_origin_v0_1.mjs';
const raw=process.env;
const id=x=>/^[1-9]\d*$/.test(x||'')&&Number.isSafeInteger(Number(x))?Number(x):null;
if(process.argv.length!==4)throw Error('USAGE: node run_scheme_c_delivery_origin_readonly_v0_1.mjs <signed-handoff.json> <output-origin.json>');
const h=JSON.parse(await readFile(process.argv[2],'utf8'));
const v=await buildSchemeCDeliveryOriginV0_1({
 eventName:raw.S2_DELIVERY_EVENT_NAME,runId:id(raw.GITHUB_RUN_ID),
 auditRunId:id(raw.S2_DELIVERY_AUDIT_RUN_ID),marketDate:h.marketDate,
 handoffReceiptHash:h.receiptHash,repo:raw.GITHUB_REPOSITORY,
 upstreamAuditEvent:raw.S2_DELIVERY_UPSTREAM_EVENT||null,
 upstreamAuditConclusion:raw.S2_DELIVERY_UPSTREAM_CONCLUSION||null,
 upstreamAuditHeadBranch:raw.S2_DELIVERY_UPSTREAM_BRANCH||null,
 upstreamAuditHeadRepo:raw.S2_DELIVERY_UPSTREAM_REPO||null
});
const out=resolve(process.argv[3]);
await mkdir(resolve(out,'..'),{recursive:true});
await writeFile(out,JSON.stringify(v,null,2)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({status:v.status,marketDate:v.marketDate,auditRunId:v.auditRunId,certifiedScheduledChain:false,sourceOnly:true,hash:v.deliveryOriginHash}));
