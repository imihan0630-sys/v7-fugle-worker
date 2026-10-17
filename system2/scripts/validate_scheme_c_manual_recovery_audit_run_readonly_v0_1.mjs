import {readFile} from 'node:fs/promises';
import {validateSchemeCManualRecoveryAuditRunV0_1}
 from '../runtime/scheme_c_manual_recovery_audit_run_v0_1.mjs';
const [path,id,repo]=process.argv.slice(2);
if(!path||!id||!repo||process.argv.length!==5||!/^[1-9]\d*$/.test(id))
 throw Error('USAGE: node validate_scheme_c_manual_recovery_audit_run_readonly_v0_1.mjs <run-meta.json> <exact-run-id> <repo>');
const n=Number(id);
if(!Number.isSafeInteger(n))throw Error('AUDIT_RUN_ID_NOT_SAFE_INTEGER');
const meta=JSON.parse(await readFile(path,'utf8'));
const v=validateSchemeCManualRecoveryAuditRunV0_1(meta,{repo,requestedRunId:n});
console.log(JSON.stringify(v));
