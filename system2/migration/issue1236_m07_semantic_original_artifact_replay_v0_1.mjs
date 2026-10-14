// Reproducible SOURCE original semantic R2 protected Artifact structural/clock audit.
// Source original GitHub Actions Run 38654562224. No Cloudflare, no secrets.
// Independent offline replay is NOT formal AUDIT_LANE approval or official PIT.
import {createHash} from "node:crypto";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
const sha=b=>createHash("sha256").update(b).digest("hex");
const fail=s=>{throw Error("M07_SEMANTIC_REPLAY_"+s)};
const ORIGINAL_INNER_SHA="36cf86d95791e2b1fa2db4eb5cd3df8da7c263ef4bee3a473d9d42589116fdd0";
const ORIGINAL_BODY_SHA="b1758c1deb3097a6b16356ee61708f2b002a8ed23a9797cb43a54e5828bf537e";
const FIELDS=["firstKnownAt","availableAt","publishedAt","observedAt","generatedAt","capturedAt"];
const SOURCE="/tmp/s2-m07-original-semantic-replay/sanitized-original-semantic-body-structure.json";
const OUT="/tmp/s2-m07-original-semantic-replay-proof";
export function verifySourceReceiptBytes(bytes,{requireOriginalSha=true}={}){
 if(requireOriginalSha&&(bytes.length!==2678||sha(bytes)!==ORIGINAL_INNER_SHA))
  fail("ORIGINAL_GITHUB_ARTIFACT_BYTES_DRIFT");
 let doc;
 try{doc=JSON.parse(bytes)}catch{fail("ORIGINAL_JSON_MALFORMED")}
 if(doc.schemaVersion!=="S2_M07_SOURCE_SEMANTIC_ORIGINAL_GZIP_PAYLOAD_PIT_DIAGNOSTIC_V0_1"||
  doc.status!=="SOURCE_R2_SEMANTIC_BODY_REHASH_AND_STRUCTURAL_PARSE__PIT_NOT_CERTIFIED"||
  doc.originalProtectedG3ExtraKeysRevalidated!==498||
  doc.originalD08WriterReceiptKeysRevalidated!==154||
  doc.originalSourceFullListDigestRevalidated!==true||
  doc.sourceR2OriginalListPages!==27||
  doc.originalR2BodyByteSHA256!==ORIGINAL_BODY_SHA||
  doc.originalR2BodySizeBytes!==10556||doc.bodyGzipInflatedBytes!==446946||
  doc.originalBodyShaHEADGETAndBytesMatched!==true||
  doc.membershipEntriesObserved!==1101||doc.independentArchivedRegistryMemberCount!==1101||
  doc.membershipCountEqualsOriginalSourceReceipt!==true||
  doc.payloadSemanticRegistryHashFieldPresent!==true||
  doc.payloadSemanticRegistryHashEqualsOriginalSourceReceipt!==true||
  doc.originalR2BodyContentStoredInReceipt===true||
  doc.independentPublicationClockEstablished!==false||
  doc.actualOfficialFirstKnownAtIndependentlyCertified!==false||
  doc.historicalResearchPITAdmitted!==false||doc.independentAuditorApproved!==false)
   fail("SOURCE_STRUCTURE_OR_SCOPE_DIFFERENCE");
 for(const clock of FIELDS){
  const value=doc.sourceClockFieldShapeEvidence?.[clock];
  if(!value||value.present!==false||value.isoTimestampShapeValid!==false)
   fail("PIT_CLOCK_SOURCE_NOT_UNKNOWN");
 }
 if(doc.sourceProvenanceFieldPresent!==false||
  doc.sourceR2HEADCalls!==1||doc.sourceR2GETBodyCalls!==1||
  doc.sourceR2BodyBytesDownloaded!==10556||doc.sourceR2Writes!==0||
  doc.sourceD1Queries!==0||doc.destinationD1Writes!==0||
  doc.destinationR2Calls!==0||doc.sourceOriginalWriterIdentityStillUnknown!==true||
  doc.archivedSourceD1ManifestByteShaJoinForSemantic!==false)
   fail("SOURCE_WRITER_OR_MUTATION_SCOPE_CHANGED");
 return Object.freeze({
  schemaVersion:"S2_M07_SEMANTIC_ORIGINAL_PROVIDER_ARTIFACT_REPLAY_V0_1",
  status:"REPRODUCED_ORIGINAL_GITHUB_SEMANTIC_PAYLOAD_SHA_AND_REGISTRY_EVIDENCE__PIT_REMAINS_BLOCKED",
  originalProducerRun:38654562224,originalProducerJob:116161137597,
  originalProducerArtifact:11935644591,independentlyRehashedOriginalInnerSHA256:sha(bytes),
  originalR2ByteSHA256:ORIGINAL_BODY_SHA,
  originalCompressedBytes:10556,
  originalGzipInflatedBytes:446946,
  originalMemberships:1101,archivedResearchMemberships:1101,
  membershipCountMatches:true,semanticRegistryHashMatchesSourceStudyReceipt:true,
  originalFirstKnownAtAvailableAtPublishedAtEvidence:"ABSENT_FROM_ORIGINAL_BLOB_STRUCTURAL_FIELDS",
  officialPublicationPITCertified:false,originalWriterIdentified:false,
  sourceR2BodyToOriginalG3D1ManifestCertified:false,
  sourceProviderAPICallsFromReplay:0,sourceD1CallsFromReplay:0,
  destinationD1WritesFromReplay:0,independentAuditLaneAccepted:false,
  paidResourcesOrSystem1FormalChanged:false
 });
}
async function main(){
 let result={schemaVersion:"S2_M07_SEMANTIC_ORIGINAL_PROVIDER_ARTIFACT_REPLAY_V0_1",
  status:"FAIL_CLOSED",sourceProviderAPICallsFromReplay:0,destinationD1WritesFromReplay:0};
 try{result=verifySourceReceiptBytes(await readFile(SOURCE))}
 catch(e){const msg=String(e?.message||"");
  result.error=/^M07_SEMANTIC_REPLAY_[A-Z0-9_]+$/.test(msg)?msg:"M07_SEMANTIC_REPLAY_UNEXPECTED_FAIL_CLOSED";
  process.exitCode=2;
 }finally{
  await mkdir(OUT,{recursive:true,mode:0o700});
  await writeFile(OUT+"/sanitized-independent-semantic-replay.json",JSON.stringify(result,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:result.status,members:result.originalMemberships??null,
   PIT:result.officialPublicationPITCertified??false,
   CloudflareCalls:0,error:result.error??null}));
 }
}
if(process.argv[1]===fileURLToPath(import.meta.url))await main();
