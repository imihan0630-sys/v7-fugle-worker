import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  buildNcT01HiddenFallbackAuditV0_1,
  NCT01_HIDDEN_FALLBACK_DIMENSIONS_V0_1,
} from "../runtime/nct01_hidden_fallback_audit_v0_1.mjs";
import { sha256Hex } from "../runtime/decision_archive.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DEFAULT_ENTRY = "system2/runtime/nct01_artifact_runner_v0_1.mjs";
const FORBIDDEN_SOURCE_FAMILY_VERSION = "S2-NCT01-FORBIDDEN-SOURCES-V0_1";

function args(argv) {
  const out={};
  for(let i=0;i<argv.length;i+=1){
    if(!argv[i].startsWith("--")) throw new Error("unexpected argument: "+argv[i]);
    const key=argv[i].slice(2);
    const value=argv[i+1];
    if(!value||value.startsWith("--")) throw new Error("missing value for --"+key);
    out[key]=value;
    i+=1;
  }
  return out;
}

function repoRel(abs) {
  const rel=path.relative(ROOT,abs).replaceAll("\\","/");
  if(rel.startsWith("../")||rel==="..") throw new Error("path escaped repository: "+abs);
  return rel;
}

function git(...argv) {
  return execFileSync("git",argv,{cwd:ROOT,encoding:"utf8"}).trim();
}

function importSpecifiers(source) {
  const specs=[];
  const staticRe=/\bimport\s+(?:[^"'()]*?\s+from\s+)?["']([^"']+)["']/g;
  const dynamicRe=/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
  for(const re of [staticRe,dynamicRe]){
    let match;
    while((match=re.exec(source))) specs.push(match[1]);
  }
  return [...new Set(specs)];
}

function resolveLocalImport(fromAbs,spec) {
  if(!spec.startsWith(".")) return null;
  let target=path.resolve(path.dirname(fromAbs),spec);
  if(!path.extname(target)) target+=".mjs";
  return target;
}

function codeWithoutCommentsAndStrings(source) {
  let out="";
  let i=0;
  let mode="code";
  let quote=null;
  while(i<source.length){
    const ch=source[i], next=source[i+1];
    if(mode==="code"){
      if(ch==="/"&&next==="/"){mode="line";out+="  ";i+=2;continue;}
      if(ch==="/"&&next==="*"){mode="block";out+="  ";i+=2;continue;}
      if(ch==="'"||ch==='"'||ch==="\`"){mode="string";quote=ch;out+=" ";i+=1;continue;}
      out+=ch;i+=1;continue;
    }
    if(mode==="line"){
      if(ch==="\n"){mode="code";out+="\n";} else out+=" ";
      i+=1;continue;
    }
    if(mode==="block"){
      if(ch==="*"&&next==="/"){mode="code";out+="  ";i+=2;} else {out+=ch==="\n"?"\n":" ";i+=1;}
      continue;
    }
    if(mode==="string"){
      if(ch==="\\"){out+="  ";i+=2;continue;}
      if(ch===quote){mode="code";quote=null;out+=" ";i+=1;continue;}
      out+=ch==="\n"?"\n":" ";i+=1;
    }
  }
  return out;
}

function dispositionFromFindings(findings) {
  const out={};
  for(const dimension of NCT01_HIDDEN_FALLBACK_DIMENSIONS_V0_1){
    out[dimension]=(findings[dimension]||[]).length?"PRESENT":"PROVEN_ABSENT";
  }
  return out;
}

async function buildGraph(entryRel) {
  const entryAbs=path.resolve(ROOT,entryRel);
  const pending=[entryAbs];
  const seen=new Set();
  const blobs=[];
  const findings=Object.fromEntries(
    NCT01_HIDDEN_FALLBACK_DIMENSIONS_V0_1.map((x)=>[x,[]]),
  );

  const addFinding=(dimension,value)=>{
    if(!findings[dimension].includes(value)) findings[dimension].push(value);
  };

  while(pending.length){
    const abs=pending.pop();
    const rel=repoRel(abs);
    if(seen.has(rel)) continue;
    seen.add(rel);
    if(!rel.startsWith("system2/")){
      addFinding("crossProjectFallbackUsed","OUTSIDE_SYSTEM2_IMPORT:"+rel);
      continue;
    }
    const source=await fs.readFile(abs,"utf8");
    const blobSha=git("rev-parse","HEAD:"+rel).toLowerCase();
    if(!/^[a-f0-9]{40}$/.test(blobSha)) throw new Error("invalid blob SHA for "+rel);
    blobs.push({path:rel,blobSha});

    const code=codeWithoutCommentsAndStrings(source);
    const productionTokens=[
      ["persistedSystem1SelectionUsed",/\bV7_DB\b/g],
      ["persistedSystem1SelectionUsed",/\bSTOCKS_KV\b/g],
      ["crossProjectFallbackUsed",/\bWorker\b/g],
      ["cachedSystem1SelectionUsed",/\bSYSTEM1_(?:TOP6|CANDIDATE)_CACHE\b/g],
      ["persistedSystem1SelectionUsed",/\bSYSTEM1_(?:TOP6|SELECTION|RANK)_TABLE\b/g],
      ["aliasReconstructionUsed",/\bSYSTEM1_(?:ALIAS|COMPATIBILITY)_RECONSTRUCTION\b/g],
      ["staleSharedStateUsed",/\b(?:STALE|PRIOR)_SYSTEM1_(?:SELECTION|STATE)\b/g],
    ];
    for(const [dimension,re] of productionTokens){
      if(re.test(code)) addFinding(dimension,"FORBIDDEN_EXECUTABLE_TOKEN:"+String(re));
    }

    for(const spec of importSpecifiers(source)){
      const target=resolveLocalImport(abs,spec);
      if(!target) continue;
      const targetRel=repoRel(target);
      if(!targetRel.startsWith("system2/")){
        addFinding("crossProjectFallbackUsed","OUTSIDE_SYSTEM2_IMPORT:"+targetRel);
        continue;
      }
      pending.push(target);
    }
  }

  blobs.sort((a,b)=>a.path.localeCompare(b.path));
  for(const values of Object.values(findings)) values.sort();
  return {blobs,findings};
}

export async function generateNcT01HiddenFallbackAuditV0_1({
  entryPoint=DEFAULT_ENTRY,
  runtimeEvidence=null,
  auditGeneratedAt=new Date().toISOString(),
}={}){
  const head=git("rev-parse","HEAD").toLowerCase();
  if(!/^[a-f0-9]{40}$/.test(head)) throw new Error("git HEAD must be 40 hex");
  const {blobs,findings}=await buildGraph(entryPoint);
  const runtimeBase=runtimeEvidence&&typeof runtimeEvidence==="object"
    ? {...runtimeEvidence}
    : {instrumented:false,sameExecutionCut:false,runtimeForbiddenAccessCount:null,typedEvidence:[]};
  if(runtimeBase.runtimeEvidenceDigest===undefined||runtimeBase.runtimeEvidenceDigest===null){
    runtimeBase.runtimeEvidenceDigest=await sha256Hex({
      runnerHeadSha:head,
      entryPoint,
      runtimeEvidence:{
        instrumented:runtimeBase.instrumented===true,
        sameExecutionCut:runtimeBase.sameExecutionCut===true,
        runtimeForbiddenAccessCount:Number.isInteger(runtimeBase.runtimeForbiddenAccessCount)
          ? runtimeBase.runtimeForbiddenAccessCount
          : null,
        typedEvidence:Array.isArray(runtimeBase.typedEvidence)?runtimeBase.typedEvidence.map(String).sort():[],
      },
    });
  }
  const audit=await buildNcT01HiddenFallbackAuditV0_1({
    runnerEntryPoint:entryPoint,
    runnerHeadSha:head,
    auditedBlobIdentities:blobs,
    perDimensionDisposition:dispositionFromFindings(findings),
    runtimeEvidence:runtimeBase,
    forbiddenSourceFamilyVersion:FORBIDDEN_SOURCE_FAMILY_VERSION,
    auditGeneratedAt,
  });
  return {
    schemaVersion:"S2_NCT01_HIDDEN_FALLBACK_AUDIT_GENERATION_V0_1",
    audit,
    staticFindings:findings,
    physicalAcceptanceEligible:false,
    evidencePurpose:"EXACT_HEAD_STATIC_AND_RUNTIME_GUARD_INPUT; NOT PHYSICAL NC-T01 ACCEPTANCE BY ITSELF",
  };
}

async function main(){
  const a=args(process.argv.slice(2));
  const runtimePath=a["runtime-evidence"]?path.resolve(ROOT,a["runtime-evidence"]):null;
  const runtimeEvidence=runtimePath?JSON.parse(await fs.readFile(runtimePath,"utf8")):null;
  const result=await generateNcT01HiddenFallbackAuditV0_1({
    entryPoint:a["entry-point"]||DEFAULT_ENTRY,
    runtimeEvidence,
    auditGeneratedAt:a["generated-at"]||new Date().toISOString(),
  });
  const text=JSON.stringify(result,null,2)+"\n";
  if(a.output){
    const out=path.resolve(ROOT,a.output);
    if(!repoRel(out)) throw new Error("invalid output path");
    await fs.mkdir(path.dirname(out),{recursive:true});
    await fs.writeFile(out,text);
  } else {
    process.stdout.write(text);
  }
}

const isMain=process.argv[1]&&path.resolve(process.argv[1])===path.resolve(fileURLToPath(import.meta.url));
if(isMain){
  main().catch((error)=>{
    console.error(error?.stack||String(error));
    process.exitCode=1;
  });
}
