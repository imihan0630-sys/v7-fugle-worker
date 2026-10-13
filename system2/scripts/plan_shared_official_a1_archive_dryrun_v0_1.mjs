// Class A: physical source-integrity and storage capacity DRY-RUN only.
// No GitHub release creation, no repository contents writes, no Cloudflare calls.
import {createHash} from 'node:crypto';
import {readFile,realpath,lstat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {assertSharedOfficialA1ConsumerBoundaryV0_1} from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {parseOfficialHistoricalA1PayloadV0_1,buildOfficialHistoricalA1UrlV0_1} from '../runtime/official_historical_a1_source_v0_1.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
const digest=x=>hash(Buffer.from(JSON.stringify(x)));
const MAX_GZIP=4*1024*1024,MAX_RAW=32*1024*1024,MAX_WINDOW=64*1024*1024;
const MAX_WEEK=16*1024*1024,MAX_WEEK_ASSETS=20,ANNUAL_SESSIONS=250;
function validDay(s){
 return /^\d{4}-\d{2}-\d{2}$/.test(s||'')&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&
 new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
}
function isoWeek(s){
 const d=new Date(s+'T00:00:00Z');
 d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7));
 const a=new Date(Date.UTC(d.getUTCFullYear(),0,1));
 return d.getUTCFullYear()+'-W'+String(Math.ceil((((d-a)/86400000)+1)/7)).padStart(2,'0');
}
export async function planSharedOfficialA1ArchiveDryRunV0_1({
 sourceManifest,originalDirectory,nowUtc=new Date().toISOString(),
 read=readFile,getRealpath=realpath,getLstat=lstat,
 verifySourceSemantics=true,
}={}){
 for(const system of ['SYSTEM1','SYSTEM2'])
  assertSharedOfficialA1ConsumerBoundaryV0_1(sourceManifest,{
   system,purpose:'READ_ONLY_SOURCE_RESEARCH'});
 if(!originalDirectory||!Array.isArray(sourceManifest?.sourceBlobs)||
    sourceManifest.sourceBlobs.length>122||
    !Number.isFinite(Date.parse(nowUtc))||new Date(nowUtc).toISOString()!==nowUtc)
  throw Error('SHARED_ARCHIVE_DRYRUN_INPUT_UNVERIFIED');
 const root=await getRealpath(originalDirectory);
 let totalGzip=0,totalRaw=0;
 const days=new Set(),seen=new Set(),groupMap=new Map(),assets=[];
 for(const s of sourceManifest.sourceBlobs){
  if(!['TWSE','TPEX'].includes(s?.market)||!validDay(s.marketDate)||
     !/^[a-f0-9]{64}$/i.test(s.originalSha256||'')||
     !Number.isSafeInteger(s.originalBytes)||s.originalBytes<1||s.originalBytes>MAX_RAW||
     !Number.isFinite(Date.parse(s.firstCapturedAtUtc))||
     Date.parse(s.firstCapturedAtUtc)>Date.parse(nowUtc))
    throw Error('SHARED_ARCHIVE_SOURCE_IDENTITY_OR_CLOCK_UNVERIFIED');
  const key=s.market+'|'+s.marketDate;
  if(seen.has(key))throw Error('SHARED_ARCHIVE_DUPLICATE_MARKET_DATE');
  seen.add(key);
  if(s.originalRelativePath!=='original-json/'+s.market+'-'+s.marketDate+'.json.gz')
   throw Error('SHARED_ARCHIVE_UNTRUSTED_SOURCE_PATH');
  const path=resolve(root,s.market+'-'+s.marketDate+'.json.gz');
  const checked=await getRealpath(path),rel=relative(root,checked);
  if(rel===''||rel==='..'||rel.startsWith('..'+sep)||rel.startsWith(sep))
   throw Error('SHARED_ARCHIVE_SYMLINK_PATH_ESCAPE');
  const st=await getLstat(path);
  if(!st.isFile()||st.isSymbolicLink()||st.size>MAX_GZIP||st.size<1)
   throw Error('SHARED_ARCHIVE_ORIGINAL_FILE_COST_OR_TYPE_INVALID');
  const gz=await read(path);
  if(gz.length!==st.size)throw Error('SHARED_ARCHIVE_FILE_CHANGED_DURING_READ');
  let raw;
  try{raw=gunzipSync(gz,{maxOutputLength:MAX_RAW});}
  catch{throw Error('SHARED_ARCHIVE_GZIP_BAD_OR_OVERSIZED');}
  if(raw.length!==s.originalBytes||hash(raw)!==s.originalSha256)
   throw Error('SHARED_ARCHIVE_RAW_BODY_SHA256_OR_LENGTH_MISMATCH');
  const canonical=buildOfficialHistoricalA1UrlV0_1(s.market,s.marketDate);
  if(s.sourceUrl!==canonical)throw Error('SHARED_ARCHIVE_NONCANONICAL_SOURCE');
  if(verifySourceSemantics){
   let parsed;
   try{parsed=parseOfficialHistoricalA1PayloadV0_1({
     market:s.market,marketDate:s.marketDate,observedAt:s.firstCapturedAtUtc,
     sourceUrl:canonical,payload:JSON.parse(raw.toString('utf8'))
   });}catch{throw Error('SHARED_ARCHIVE_OFFICIAL_SOURCE_BAR_SEMANTICS_INVALID');}
   if(parsed.state!=='READY'||parsed.sourceDateEvidence!==s.marketDate)
    throw Error('SHARED_ARCHIVE_OFFICIAL_DATE_NOT_READY');
  }
  totalGzip+=gz.length;totalRaw+=raw.length;
  if(totalGzip>MAX_WINDOW)throw Error('SHARED_ARCHIVE_BOOTSTRAP_BYTES_EXCEEDED');
  days.add(s.marketDate);
  const week=isoWeek(s.marketDate);
  const asset={
   market:s.market,marketDate:s.marketDate,originalRawSha256:s.originalSha256,
   compressedSha256:hash(gz),compressedBytes:gz.length,originalBytes:raw.length,
   originalObservedAtUtc:s.firstCapturedAtUtc,
   candidateReleaseAsset:s.market+'-'+s.marketDate+'--'+s.originalSha256+'.json.gz',
   proposedIsoWeek:week,historicalPublicationTimeCertified:false,
  };
  assets.push(asset);
  if(!groupMap.has(week))groupMap.set(week,[]);
  groupMap.get(week).push(asset);
 }
 if(assets.length!==sourceManifest.sourceMarketDatePairsValidated)
  throw Error('SHARED_ARCHIVE_SOURCE_MANIFEST_DENOMINATOR_MISMATCH');
 const groups=[...groupMap.entries()].sort().map(([week,arr])=>{
  const bytes=arr.reduce((a,b)=>a+b.compressedBytes,0);
  if(arr.length>MAX_WEEK_ASSETS||bytes>MAX_WEEK)
   throw Error('SHARED_ARCHIVE_WEEKLY_RELEASE_LIMIT');
  const bodyHash=digest(arr);
  return {week,sourceAssets:arr.length,compressedBytes:bytes,
   proposedTag:'shared-a1-'+week+'-'+bodyHash.slice(0,16),
   groupSha256:bodyHash,immutableSettingVerified:false,published:false};
 });
 const annualEstimate=days.size?Math.ceil(totalGzip/days.size*ANNUAL_SESSIONS):null;
 const p={
  schemaVersion:'SHARED_OFFICIAL_A1_ARCHIVE_PHYSICAL_DRYRUN_V0_1',
  sourceManifestSha256:sourceManifest.manifestSha256,
  observedAtUtc:nowUtc,marketDate:sourceManifest.effectiveTradingDay,
  sourceCompleteness:sourceManifest.sourceCoverage,
  verifiedOriginalFiles:assets.length,verifiedUniqueTradingDates:days.size,
  originalCompressedBytes:totalGzip,originalUncompressedBytes:totalRaw,
  estimatedNewOriginalCompressedBytesPerYear:annualEstimate,
  projectedFiveYearOriginalCompressedBytes:annualEstimate===null?null:5*annualEstimate,
  capSingleCompressedBytes:MAX_GZIP,capWindowCompressedBytes:MAX_WINDOW,
  capWeekCompressedBytes:MAX_WEEK,capWeekAssets:MAX_WEEK_ASSETS,
  releaseGrouping:'ISO_WEEK__NEW_REVISION_NEW_RELEASE_TAG',
  proposedStorage:'GITHUB_IMMUTABLE_RELEASES_NOT_AUTHORIZED',
  targetReleaseGroups:groups,
  plannedSourceAssets:assets,
  remainingDedupAgainstExistingDurableAssets:'UNVERIFIED__REQUIRES_RELEASE_INDEPENDENT_READBACK',
  immutableReleaseSettingsVerified:false,
  githubContentsWriteApproved:false,archivalAssetsPublished:0,
  accountD1Writes:0,system1FormalOrCronTouched:false,
  independentPITCertified:false,selectedCount:null,frozenWritten:false,
 };
 return Object.freeze({...p,planSha256:digest(p)});
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 try{
  const path=process.env.SHARED_A1_MANIFEST_PATH;
  const dir=process.env.SHARED_A1_ORIGINAL_DIR;
  if(!path||!dir)throw Error('SHARED_ARCHIVE_PHYSICAL_INPUT_MISSING');
  const manifest=JSON.parse(await readFile(path,'utf8'));
  const plan=await planSharedOfficialA1ArchiveDryRunV0_1({
   sourceManifest:manifest,originalDirectory:dir
  });
  const out='/tmp/shared-official-a1-archive-preflight';
  await mkdir(out,{recursive:true,mode:0o700});
  await writeFile(out+'/physical-dryrun-plan.json',JSON.stringify(plan,null,2)+'\n',
   {flag:'wx',mode:0o600});
  console.log(JSON.stringify({status:'ACTUAL_OFFICIAL_ORIGINAL_BYTES_VALIDATED__PUBLISH_BLOCKED',
   sourceFiles:plan.verifiedOriginalFiles,compressedBytes:plan.originalCompressedBytes,
   annualEstimateBytes:plan.estimatedNewOriginalCompressedBytesPerYear,
   releaseBatches:plan.targetReleaseGroups.length,
   githubContentsWrites:0,cloudflareD1Writes:0,planSha256:plan.planSha256}));
 }catch{
  console.error('SHARED_OFFICIAL_A1_ARCHIVE_DRYRUN_FAIL_CLOSED');
  process.exitCode=2;
 }
}
