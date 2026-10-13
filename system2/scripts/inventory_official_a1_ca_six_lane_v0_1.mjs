// P0 System2 official six-lane company-action SOURCE inventory only.
// An empty FINAL RESULT cannot prove no historical actions or PIT availability.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildOfficialContinuitySourceUrlsV0_1} from '../runtime/official_continuity_source_capability_v0_1.mjs';
import {parseOfficialHistoricalContinuityPayloadV0_1} from '../runtime/official_continuity_event_parser_v0_1.mjs';
import {assessOfficialContinuityRevisionSourceV0_1,buildOfficialContinuityRevisionCoverageReceiptV0_1}
 from '../runtime/official_continuity_revision_coverage_v0_1.mjs';
const SHA=/^[a-f0-9]{64}$/;
export async function inventoryOfficialA1CaSixLaneV0_1({
 manifest,audit,fetchImpl=globalThis.fetch,clock=()=>new Date()
}={}){
 const dates=manifest?.tradingDates;
 if(manifest?.effectiveTradingDay!=='2026-10-13'||
   manifest?.sourceMarketDatePairsValidated!==122||
   manifest?.sourceMarketDatePairsExpected!==122||
   manifest?.sourceCoverage!=='COMPLETE_SOURCE_CAPTURE_PIT_UNAUDITED'||
   !Array.isArray(dates)||dates.length!==61||
   dates[60]!=='2026-10-13'||dates.some((d,i)=>!/^\d{4}-\d\d-\d\d$/.test(d)||(i&&d<=dates[i-1])))
   throw Error('S2_CA_WINDOW_A1_SOURCE_INCOMPLETE');
 const {auditHash,...auditBase}=audit||{};
 if(audit?.schemaVersion!=='SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1'||
   audit.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'||
   audit.marketDate!==manifest.effectiveTradingDay||
   audit.manifestSha256!==manifest.manifestSha256||
   audit.sourceReceiptHash!==manifest.originalOfficialProvenanceHash||
   audit.sourceMarketDatePairsVerified!==122||
   audit.originalFilesRehashedAfterDownload!==122||
   audit.independentOfficialCalendarReadbackVerified!==true||
   audit.auditorSeparation!=='INDEPENDENT_READBACK_PROCESS'||
   audit.strategyPitCertified!==false||audit.selectionAuthorized!==false||
   !SHA.test(auditHash||'')||await sha256Hex(auditBase)!==auditHash)
   throw Error('S2_CA_A1_INDEPENDENT_AUDIT_MISMATCH');
 const startDate=dates[0],endDate=dates[60],at=clock().toISOString();
 const contracts=Object.entries(buildOfficialContinuitySourceUrlsV0_1({startDate,endDate}))
   .filter(([,s])=>s.sourceClass==='HISTORICAL_ACTUAL_RESULT_RANGE')
   .sort(([a],[b])=>a.localeCompare(b));
 if(contracts.length!==6)throw Error('S2_CA_SIX_LANES_REQUIRED');
 const rows=[],assessments=[];
 for(const [sourceId,config] of contracts){
  const observedAt=clock().toISOString();
  let result;
  try{
   const response=await fetchImpl(config.url,{
    method:'GET',redirect:'follow',signal:AbortSignal.timeout(30000),
    headers:{accept:'application/json,text/plain,*/*',
      'user-agent':'System2-CA-six-lane-source-only/0.1'}
   });
   if(!response?.ok||response.status!==200)throw Error('HTTP');
   if(Number(response.headers?.get?.('content-length')||0)>5000000)throw Error('BODY');
   const body=Buffer.from(await response.arrayBuffer());
   if(!body.length||body.length>5000000)throw Error('BODY');
   const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,sourceUrl:config.url,rawText:body.toString('utf8'),
    fetchedAt:observedAt,requestedStartDate:startDate,requestedEndDate:endDate
   });
   const assessment=assessOfficialContinuityRevisionSourceV0_1({
    sourceId,sourceClass:config.sourceClass,
    parserComplete:parsed.parserComplete,
    responseRangeVerified:parsed.responseRangeVerified,
    fieldNames:parsed.fieldNames||[],eventCount:parsed.eventCount||0,
    historicalFirstKnownUnknownCount:parsed.historicalFirstKnownUnknownCount||0
   });
   assessments.push(assessment);
   result={sourceId,exchange:config.exchange,observedAt,
    state:assessment.finalResultRangeReady?'FINAL_RESULT_ONLY_PIT_UNVERIFIED':'RANGE_OR_PARSER_UNVERIFIED',
    originalSha256:parsed.payloadHash||null,
    responseRangeVerified:parsed.responseRangeVerified===true,
    parserComplete:parsed.parserComplete===true,
    ordinaryEventRows:parsed.eventCount||0,
    distinctAffectedSymbols:new Set((parsed.events||[]).map(e=>e.symbol)).size,
    historicalFirstKnownUnknownCount:parsed.historicalFirstKnownUnknownCount||0};
  }catch(e){
   result={sourceId,exchange:config.exchange,observedAt,
    state:'UNAVAILABLE_FAIL_CLOSED',
    blocker:/HTTP/.test(String(e?.message))?'HTTP_SOURCE_UNAVAILABLE':
      /BODY/.test(String(e?.message))?'SOURCE_BODY_INVALID':'SOURCE_TRANSPORT_OR_PARSE_UNAVAILABLE',
    responseRangeVerified:false,parserComplete:false,
    originalSha256:null,ordinaryEventRows:null,distinctAffectedSymbols:null,
    historicalFirstKnownUnknownCount:null};
  }
  rows.push({...result,noEventMayBeClaimed:false,
   correctionHistoryComplete:false,firstKnownAtCertified:false});
 }
 const coverage=buildOfficialContinuityRevisionCoverageReceiptV0_1({
  startDate,endDate,sourceAssessments:assessments,supplementalChannels:[],
  generatedAt:clock().toISOString()
 });
 if(coverage.revisionCoverageComplete||coverage.noEventMayBeClaimed||
    coverage.selectionAuthority||coverage.supplementalRevisionReadyCount!==0)
   throw Error('S2_CA_IMPROPER_PIT_PROMOTION');
 const base={schemaVersion:'S2_A1_CA_SIX_LANE_INVENTORY_V0_1',
  marketDate:endDate,firstSession:startDate,sourceRunId:38390694817,
  sourceAuditRunId:38390900569,manifestSha256:manifest.manifestSha256,
  independentAuditHash:auditHash,observedAt:at,
  laneCount:6,finalResultReadyCount:coverage.finalResultReadyCount,
  revisionHistoryReadyCount:0,lanes:rows,
  state:coverage.finalResultReadyCount===6?
    'FINAL_RESULT_SOURCE_OBSERVED_ONLY':'INCOMPLETE_FINAL_RESULT_SOURCE',
  noEventMayBeClaimed:false,perSymbolContinuityReadyCount:0,
  continuityBySymbolGenerated:false,selectionAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenDecisionWritten:false,
  system1FormalRuntimeTouched:false,cloudflareD1Writes:0,
  cloudflareR2Writes:0,publicRawCorporateActionDataPublished:false};
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('inventory_official_a1_ca_six_lane_v0_1.mjs')){
 try{
  const m=process.env.S2_A1_MANIFEST,a=process.env.S2_A1_INDEPENDENT_AUDIT;
  if(!m||!a)throw Error('REQUIRED_TWO_ARTIFACT_PATHS');
  const [manifest,audit]=await Promise.all([m,a].map(async p=>JSON.parse(await readFile(p,'utf8'))));
  const receipt=await inventoryOfficialA1CaSixLaneV0_1({manifest,audit});
  await mkdir('/tmp/s2-ca-sixlane-inventory',{recursive:true,mode:0o700});
  await writeFile('/tmp/s2-ca-sixlane-inventory/receipt.json',
    JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log(JSON.stringify({date:receipt.marketDate,
    ready:receipt.finalResultReadyCount,total:receipt.laneCount,
    revisions:receipt.revisionHistoryReadyCount,hash:receipt.receiptHash,
    lanes:receipt.lanes.map(x=>({source:x.sourceId,state:x.state,
      rows:x.ordinaryEventRows,affected:x.distinctAffectedSymbols})),
    selectionAuthorized:false}));
 }catch(e){
  console.error('S2_CA_SOURCE_FAIL_CLOSED_'+String(e.message||'UNKNOWN').replace(/[^A-Z0-9_]/gi,'_').slice(0,96));
  process.exitCode=2;
 }
}
