// Explicit offline CLI; no schedules, network, source repair or runtime integration.
import { readFile, writeFile, open, unlink } from 'node:fs/promises';
import { buildShadowDiagnostic } from '../research/system1_sda_shadow_v0_1.mjs';
import { appendExperimentEvent, replayExperimentLedger } from '../research/experiment_holdout_guard_v0_1.mjs';
const [mode,inputPath,outputPath,expectedHead]=process.argv.slice(2);
if (mode==='diagnose') {
  const receipt=buildShadowDiagnostic(JSON.parse(await readFile(inputPath,'utf8')));
  await writeFile(outputPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({status:receipt.status,receiptDigest:receipt.receiptDigest}));
} else if (mode==='ledger-append') {
  if (!/^[a-f0-9]{64}$/.test(expectedHead??'')) throw Error('EXPLICIT_EXPECTED_HEAD_REQUIRED');
  const lockPath=outputPath+'.lock';
  const lock=await open(lockPath,'wx');
  try {
    let raw='';
    try {raw=await readFile(outputPath,'utf8');} catch(e) {if (e.code!=='ENOENT') throw e;}
    if (raw && !raw.endsWith('\n')) throw Error('TRUNCATED_LEDGER');
    const events=raw ? raw.trimEnd().split('\n').map(x=>JSON.parse(x)) : [];
    const result=appendExperimentEvent(events,expectedHead,JSON.parse(await readFile(inputPath,'utf8')));
    const file=await open(outputPath,'a');
    try {await file.writeFile(JSON.stringify(result.event)+'\n');await file.sync();} finally {await file.close();}
    const readback=(await readFile(outputPath,'utf8')).trimEnd().split('\n').map(x=>JSON.parse(x));
    const state=replayExperimentLedger(readback,result.state.head);
    console.log(JSON.stringify(state));
  } finally {await lock.close();await unlink(lockPath);}
} else throw Error('Usage: diagnose input.json NEW-receipt.json | ledger-append event.json ledger.ndjson EXPECTED_HEAD');
