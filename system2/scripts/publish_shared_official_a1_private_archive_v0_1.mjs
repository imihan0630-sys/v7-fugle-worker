// Owner-approved private, content-addressed archive writer for shared official
// A1 source evidence. It only prepares create-only files in an injected private
// archive checkout; Git authentication and push remain workflow responsibilities.
import {constants} from 'node:fs';
import {copyFile,lstat,mkdir,readFile,realpath,writeFile} from 'node:fs/promises';
import {dirname,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {planSharedOfficialA1ArchiveDryRunV0_1}
 from './plan_shared_official_a1_archive_dryrun_v0_1.mjs';
import {sha256Hex} from '../runtime/decision_archive.mjs';

const SHA=/^[a-f0-9]{64}$/i;
const TARGET='imihan0630-sys/v7-system2-official-a1-archive';
const strip=(x,k)=>Object.fromEntries(Object.entries(x||{}).filter(([key])=>key!==k));
function inside(root,path){
 const rel=relative(root,path);
 return rel!==''&&rel!=='..'&&!rel.startsWith('..'+sep)&&!rel.startsWith(sep);
}
async function safeDirectory(root,path){
 await mkdir(path,{recursive:true,mode:0o700});
 const checked=await realpath(path);
 if(path!==root&&!inside(root,checked))throw Error('PRIVATE_ARCHIVE_DIRECTORY_ESCAPE');
 const st=await lstat(checked);
 if(!st.isDirectory()||st.isSymbolicLink())throw Error('PRIVATE_ARCHIVE_DIRECTORY_UNSAFE');
 return checked;
}
async function createOrVerify(root,path,content){
 await safeDirectory(root,dirname(path));
 const bytes=Buffer.isBuffer(content)?content:Buffer.from(content);
 try{
  const st=await lstat(path);
  if(!st.isFile()||st.isSymbolicLink())throw Error('PRIVATE_ARCHIVE_EXISTING_PATH_UNSAFE');
  const existing=await readFile(path);
  if(!existing.equals(bytes))throw Error('PRIVATE_ARCHIVE_IMMUTABLE_PATH_CONFLICT');
  return 'VERIFIED_EXISTING';
 }catch(error){
  if(error?.code!=='ENOENT')throw error;
  await writeFile(path,bytes,{flag:'wx',mode:0o600});
  return 'CREATED';
 }
}
function assertAuthorization(a){
 if(a?.schemaVersion!=='SHARED_OFFICIAL_A1_PRIVATE_ARCHIVE_AUTHORIZATION_V0_1'||
    a.approvedBy!=='OWNER_EXPLICIT_2026_10_13'||a.sourceRepository!=='imihan0630-sys/v7-fugle-worker'||
    a.targetRepository!==TARGET||a.targetVisibilityVerified!=='PRIVATE'||
    a.storageMode!=='PRIVATE_GIT_CONTENT_ADDRESSED_APPEND_ONLY'||
    a.writerCredential!=='DEDICATED_TARGET_REPO_DEPLOY_KEY'||
    a.writerSecretName!=='S2_A1_ARCHIVE_DEPLOY_KEY'||
    a.writerScopeOnlyTargetRepository!==true||a.paidPlanAuthorized!==false||
    a.publicRawPublicationAllowed!==false||a.attributionRequired!==true||
    a.system1FormalUseAuthorized!==false||a.system2SelectionUseAuthorized!==false||
    a.cloudflareWriteAuthorized!==false||!Array.isArray(a.sourceDataLicenses)||
    !['TWSE','TPEX'].every(m=>a.sourceDataLicenses.some(x=>x.market===m&&
      x.license==='政府資料開放授權條款-第1版'&&x.licenseUrl==='https://data.gov.tw/license')))
   throw Error('PRIVATE_ARCHIVE_OWNER_LICENSE_OR_SCOPE_AUTHORIZATION_INVALID');
}
async function assertSourceReceipt(sourceReceipt,manifest){
 if(sourceReceipt?.schemaVersion!=='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'||
    !SHA.test(sourceReceipt.receiptHash||'')||
    await sha256Hex(strip(sourceReceipt,'receiptHash'))!==sourceReceipt.receiptHash||
    manifest.originalOfficialProvenanceHash!==sourceReceipt.receiptHash||
    !Array.isArray(sourceReceipt.receipts)||
    sourceReceipt.receipts.length!==manifest.sourceMarketDatePairsValidated)
   throw Error('PRIVATE_ARCHIVE_SOURCE_RECEIPT_INTEGRITY_INVALID');
 const byKey=new Map(sourceReceipt.receipts.map(x=>[x.market+'|'+x.marketDate,x]));
 if(byKey.size!==sourceReceipt.receipts.length)throw Error('PRIVATE_ARCHIVE_SOURCE_RECEIPT_DUPLICATE');
 for(const blob of manifest.sourceBlobs){
  const row=byKey.get(blob.market+'|'+blob.marketDate);
  if(!row||row.originalRawResponseSha256!==blob.originalSha256||
     row.originalRawResponseBytes!==blob.originalBytes||row.capturedAt!==blob.firstCapturedAtUtc)
   throw Error('PRIVATE_ARCHIVE_RECEIPT_MANIFEST_LINEAGE_MISMATCH');
 }
}
export async function publishSharedOfficialA1PrivateArchiveV0_1({
 sourceManifest,sourceReceipt,authorization,originalDirectory,archiveDirectory,
 nowUtc=new Date().toISOString(),
}={}){
 assertAuthorization(authorization);
 if(!archiveDirectory)throw Error('PRIVATE_ARCHIVE_CHECKOUT_REQUIRED');
 const root=await realpath(archiveDirectory);
 const rootStat=await lstat(root);
 if(!rootStat.isDirectory()||rootStat.isSymbolicLink())throw Error('PRIVATE_ARCHIVE_ROOT_UNSAFE');
 await assertSourceReceipt(sourceReceipt,sourceManifest);
 const plan=await planSharedOfficialA1ArchiveDryRunV0_1({
  sourceManifest,originalDirectory,nowUtc
 });
 const states=[];
 for(const asset of plan.plannedSourceAssets){
  const src=resolve(originalDirectory,asset.market+'-'+asset.marketDate+'.json.gz');
  const year=asset.marketDate.slice(0,4);
  const dst=resolve(root,'raw',asset.market,year,
   asset.marketDate+'--'+asset.originalRawSha256+'.json.gz');
  await safeDirectory(root,dirname(dst));
  try{
   await copyFile(src,dst,constants.COPYFILE_EXCL);
   states.push({path:relative(root,dst).replaceAll('\\','/'),state:'CREATED'});
  }catch(error){
   if(error?.code!=='EEXIST')throw error;
   const expected=await readFile(src),existing=await readFile(dst);
   if(!existing.equals(expected))throw Error('PRIVATE_ARCHIVE_IMMUTABLE_RAW_CONFLICT');
   states.push({path:relative(root,dst).replaceAll('\\','/'),state:'VERIFIED_EXISTING'});
  }
 }
 const day=sourceManifest.effectiveTradingDay;
 const manifestPath=resolve(root,'manifests',day,
  sourceManifest.manifestSha256+'.json');
 const receiptPath=resolve(root,'source-receipts',day,
  sourceReceipt.receiptHash+'.json');
 states.push({path:relative(root,manifestPath).replaceAll('\\','/'),state:await createOrVerify(root,
  manifestPath,JSON.stringify(sourceManifest,null,2)+'\n')});
 states.push({path:relative(root,receiptPath).replaceAll('\\','/'),state:await createOrVerify(root,
  receiptPath,JSON.stringify(sourceReceipt,null,2)+'\n')});
 const notice=`# Source attribution and archive boundary\n\n`+
  `This private repository stores content-addressed research source evidence only.\n\n`+
  `- TWSE dataset: 盤後資訊 > 個股日成交資訊 — https://data.gov.tw/dataset/11549\n`+
  `- TPEx dataset: 上櫃股票行情 — https://data.gov.tw/dataset/11370\n`+
  `- License: 政府資料開放授權條款－第1版 — https://data.gov.tw/license\n\n`+
  `No System1 Formal input, System2 selection, push, order, D1/R2 write, or public raw-data publication is authorized.\n`;
 states.push({path:'SOURCE_NOTICE.md',state:await createOrVerify(root,resolve(root,'SOURCE_NOTICE.md'),notice)});
 const archiveBase={
  schemaVersion:'SHARED_OFFICIAL_A1_PRIVATE_ARCHIVE_RECEIPT_V0_1',
  targetRepository:TARGET,targetVisibility:'PRIVATE',storageMode:authorization.storageMode,
  sourceManifestSha256:sourceManifest.manifestSha256,
  sourceReceiptHash:sourceReceipt.receiptHash,marketDate:day,
  sourceIssuedAtUtc:sourceManifest.issuedAtUtc,
  sourceCoverage:sourceManifest.sourceCoverage,sourceMarketDatePairs:plan.verifiedOriginalFiles,
  archivedPaths:states.map(x=>x.path),attributionFile:'SOURCE_NOTICE.md',
  contentAddressed:true,workflowAppendOnly:true,providerLevelImmutability:false,
  publicRawPublication:false,paidPlanUsed:false,cloudflareD1Writes:0,
  system1FormalCoreTouched:false,selectionPerformed:false,frozenWritten:false,
 };
 const archiveReceipt={...archiveBase,archiveReceiptHash:await sha256Hex(archiveBase)};
 const archiveReceiptPath=resolve(root,'archive-receipts',day,
  archiveReceipt.archiveReceiptHash+'.json');
 const receiptState=await createOrVerify(root,archiveReceiptPath,
  JSON.stringify(archiveReceipt,null,2)+'\n');
 return Object.freeze({...archiveReceipt,operationObservedAtUtc:nowUtc,
  newFiles:states.filter(x=>x.state==='CREATED').length,
  verifiedExistingFiles:states.filter(x=>x.state==='VERIFIED_EXISTING').length,
  fileStates:states,archiveReceiptPath:
  relative(root,archiveReceiptPath).replaceAll('\\','/'),archiveReceiptPathState:receiptState});
}

if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 try{
  const required=['SHARED_A1_MANIFEST_PATH','SHARED_A1_SOURCE_RECEIPT_PATH',
   'SHARED_A1_ORIGINAL_DIR','SHARED_A1_ARCHIVE_DIR','SHARED_A1_ARCHIVE_AUTHORIZATION_PATH'];
  if(required.some(k=>!process.env[k]))throw Error('PRIVATE_ARCHIVE_REQUIRED_INPUT_MISSING');
  const [sourceManifest,sourceReceipt,authorization]=await Promise.all([
   readFile(process.env.SHARED_A1_MANIFEST_PATH,'utf8').then(JSON.parse),
   readFile(process.env.SHARED_A1_SOURCE_RECEIPT_PATH,'utf8').then(JSON.parse),
   readFile(process.env.SHARED_A1_ARCHIVE_AUTHORIZATION_PATH,'utf8').then(JSON.parse),
  ]);
  const result=await publishSharedOfficialA1PrivateArchiveV0_1({
   sourceManifest,sourceReceipt,authorization,
   originalDirectory:process.env.SHARED_A1_ORIGINAL_DIR,
   archiveDirectory:process.env.SHARED_A1_ARCHIVE_DIR,
  });
  const out='/tmp/shared-a1-private-archive-publish';
  await mkdir(out,{recursive:true,mode:0o700});
  await writeFile(resolve(out,'archive-publish-receipt.json'),JSON.stringify(result,null,2)+'\n',
   {flag:'wx',mode:0o600});
  console.log(JSON.stringify({status:'PRIVATE_CONTENT_ADDRESSED_ARCHIVE_PREPARED',
   marketDate:result.marketDate,sourcePairs:result.sourceMarketDatePairs,
   newFiles:result.newFiles,existingFiles:result.verifiedExistingFiles,
   receiptHash:result.archiveReceiptHash,publicRawPublication:false,
   cloudflareD1Writes:0,selectionPerformed:false}));
 }catch(error){
  console.error('SHARED_OFFICIAL_A1_PRIVATE_ARCHIVE_FAIL_CLOSED_'+
   String(error?.message||'UNKNOWN').replace(/[^A-Z0-9_]/gi,'_').slice(0,100));
  process.exitCode=2;
 }
}
