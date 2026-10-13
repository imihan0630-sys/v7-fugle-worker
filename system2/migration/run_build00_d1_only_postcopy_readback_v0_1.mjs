// BUILD00 receipt bridge. This command reads local JSON files ONLY.
// No Cloudflare API, no D1 connection, no automatic import/deploy or secrets.
// Usage: node system2/migration/run_build00_d1_only_postcopy_readback_v0_1.mjs source.json destination.json
import {readFile} from "node:fs/promises";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {reviewSystem2D1OnlyPostCopyV0_1} from "./build00_d1_only_postcopy_readback_v0_1.mjs";
const LIMIT=8_000_000;
async function localJSON(path){
 const input=await readFile(path);
 if(input.byteLength<=0||input.byteLength>LIMIT)
  throw Error("LOCAL_RECEIPT_FILE_SIZE_INVALID");
 return JSON.parse(input.toString("utf8"));
}
export async function runBuild00D1PostCopyReadbackV0_1({source,destination}={}){
 return reviewSystem2D1OnlyPostCopyV0_1({source,destination});
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 if(process.argv.length!==4)throw Error("NEED_TWO_LOCAL_READONLY_PHYSICAL_RECEIPT_JSON_PATHS");
 try{
  const source=await localJSON(process.argv[2]);
  const destination=await localJSON(process.argv[3]);
  const result=await runBuild00D1PostCopyReadbackV0_1({source,destination});
  // Only safe, bounded counters and public blocker enums. No private account ID,
  // signed export URLs, source row content, hashes, or provider tokens.
  console.log(JSON.stringify(result,null,2));
  if(result.state!=="D1_PARITY_MATCHED_PENDING_INDEPENDENT_AUDIT")process.exitCode=2;
 }catch{
  console.error("D1_POSTCOPY_LOCAL_READBACK_RECEIPT_PARSE_OR_INPUT_ERROR");
  process.exitCode=2;
 }
}
