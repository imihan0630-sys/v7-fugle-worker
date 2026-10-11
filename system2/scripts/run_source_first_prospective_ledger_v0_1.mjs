// Public GET-only runner; deliberately bypasses old-account D1 quota.
// It creates an observed OHLCV evidence artifact, NOT an evaluated or selected stock list.
import {mkdir,writeFile} from 'node:fs/promises';
import {fetchDailyShadowA1SnapshotV0_1} from '../runtime/daily_shadow_a1_source_v0_1.mjs';
import {buildSourceFirstProspectiveLedgerV0_1} from '../migration/source_first_prospective_ledger_v0_1.mjs';
const taipeiDay=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export async function runPublicSourceFirstLedgerV0_1({marketDate,fetchSnapshot=fetchDailyShadowA1SnapshotV0_1,
 now=()=>new Date(),run={}}={}) {
 if(marketDate!==taipeiDay())throw Error('PROSPECTIVE_SAME_TAIPEI_DATE_ONLY');
 let source;
 try {source=await fetchSnapshot({marketDate});}
 catch {source={state:'SOURCE_ERROR',marketDate,observedAt:null,transports:null,snapshotBatch:null};}
 return buildSourceFirstProspectiveLedgerV0_1({marketDate,source,freezeAtUtc:now().toISOString(),run});
}
if(process.argv[1]&&process.argv[1].endsWith('/run_source_first_prospective_ledger_v0_1.mjs')){
 const date=process.argv[2];
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))throw Error('MARKET_DATE_ARGUMENT_REQUIRED');
 const receipt=await runPublicSourceFirstLedgerV0_1({
  marketDate:date,run:{
   repository:process.env.GITHUB_REPOSITORY,
   runId:process.env.GITHUB_RUN_ID,
   attempt:process.env.GITHUB_RUN_ATTEMPT,
   codeSha:process.env.GITHUB_SHA,
  },
 });
 const out='/tmp/system2-source-first-ledger';
 await mkdir(out,{recursive:true});
 await writeFile(out+'/'+date+'.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({marketDate:date,sourceState:receipt.sourceState,
  observedCount:receipt.sourceOrdinarySymbolCount,
  candidateState:receipt.selectionState,hash:receipt.ledgerSha256,
  sourceBlockers:receipt.sourceBlockers}));
}
