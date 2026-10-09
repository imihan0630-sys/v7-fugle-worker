import crypto from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

export const MODEL_VERSION="D16_22_SOURCE_LOCAL_LEXICON_V0_1";
export const TOKENIZER_VERSION="UNICODE_NFKC_SUBSTRING_V0_1";
export const PROMPT_TEMPLATE_VERSION="NO_LLM_SOURCE_LOCAL_RULES_V0_1";
export const LEXICON=Object.freeze({
  correction:["更正","補充說明","調整"],
  uncertainty:["尚未確定","尚待","預計","可能","待相關單位"],
  adverse:["火災","損失","終止","減少","註銷","稀釋"],
  expansion:["增加","成長","擴充","產能","營收","投資"],
  noMajorImpact:["無重大影響","尚無重大影響","不致對股東權益造成重大稀釋"],
});
function stable(v){
  if(Array.isArray(v))return v.map(stable);
  if(v&&typeof v==="object")return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]));
  return v;
}
export const stableJson=v=>JSON.stringify(stable(v));
export const sha256=v=>crypto.createHash("sha256").update(typeof v==="string"?v:stableJson(v)).digest("hex");
function must(c,m){if(!c)throw new Error(m);}
function parseTs(v,name){const n=Date.parse(v);must(Number.isFinite(n),name+"_INVALID");return n;}
function normalizeText(v){return String(v??"").normalize("NFKC").replace(/\s+/g," ").trim();}
function flattenDocument(doc){
  const parts=[doc.title];
  for(const section of doc.sections||[]){
    parts.push(section.heading||"");
    for(const v of section.content||[])parts.push(v);
  }
  return normalizeText(parts.join(" "));
}
function redact(doc,text){
  let x=text;
  for(const token of [doc.companyName,doc.symbol].filter(Boolean)){
    x=x.split(normalizeText(token)).join("[ENTITY]");
  }
  x=x.replace(/\b\d{4}[\/\-.年]\d{1,2}(?:[\/\-.月]\d{1,2}日?)?\b/g,"[DATE]");
  x=x.replace(/\b\d+(?:\.\d+)?%?/g,"[NUM]");
  return x;
}
function countOccurrences(text,token){
  if(!token)return 0;
  let n=0,i=0;
  while((i=text.indexOf(token,i))!==-1){n++;i+=token.length;}
  return n;
}
function lexiconFeatures(text){
  const out={};
  for(const [family,tokens] of Object.entries(LEXICON)){
    const counts=Object.fromEntries(tokens.map(t=>[t,countOccurrences(text,t)]));
    out[family]={count:Object.values(counts).reduce((a,b)=>a+b,0),tokenCounts:counts};
  }
  return out;
}
function coreCounts(features){
  return Object.fromEntries(Object.entries(features).map(([k,v])=>[k,v.count]));
}
export function validateCorpus(corpus){
  must(corpus?.schemaVersion==="D16_22_TAIWAN_TEXT_CORPUS_V0_1","CORPUS_SCHEMA_INVALID");
  must(corpus.historicalBackfillAllowed===false,"HISTORICAL_BACKFILL_FORBIDDEN");
  must(corpus.targetIdReplayRequired===true,"TARGET_ID_REPLAY_REQUIRED");
  must(corpus.captureCommitSha&&/^[a-f0-9]{40}$/.test(corpus.captureCommitSha),"CAPTURE_COMMIT_INVALID");
  must(corpus.room11FirstKnownAtUpperBound,"FIRST_KNOWN_BOUND_REQUIRED");
  parseTs(corpus.room11FirstKnownAtUpperBound,"FIRST_KNOWN_BOUND");
  must(Array.isArray(corpus.documents)&&corpus.documents.length>=4,"TEXT_CORPUS_TOO_SMALL");
  const ids=new Set();
  for(const d of corpus.documents){
    must(d.documentId&&d.symbol&&d.sourcePublishedAt&&d.title&&d.sourceUrl,"DOCUMENT_IDENTITY_INCOMPLETE");
    must(!ids.has(d.documentId),"DUPLICATE_DOCUMENT_ID");
    ids.add(d.documentId);
    must(/^https:\/\/mopsov\.twse\.com\.tw\//.test(d.sourceUrl),"NON_MOPS_SOURCE_URL");
    must(Array.isArray(d.sections)&&d.sections.length>=1,"DOCUMENT_SECTIONS_MISSING");
  }
  return true;
}
export function buildTextFeatureReceipt({corpus,decisionTimestamp}){
  validateCorpus(corpus);
  const decisionMs=parseTs(decisionTimestamp,"DECISION_TIMESTAMP");
  const knownMs=parseTs(corpus.room11FirstKnownAtUpperBound,"FIRST_KNOWN_BOUND");
  must(decisionMs>=knownMs,"DECISION_BEFORE_ROOM11_FIRST_KNOWN");
  const lexiconHash=sha256(LEXICON);
  const docs=[...corpus.documents].sort((a,b)=>a.documentId.localeCompare(b.documentId)).map(doc=>{
    const fullText=flattenDocument(doc);
    const titleText=normalizeText(doc.title);
    const redactedText=redact(doc,fullText);
    const full=lexiconFeatures(fullText);
    const title=lexiconFeatures(titleText);
    const redacted=lexiconFeatures(redactedText);
    const fullCore=coreCounts(full),redactedCore=coreCounts(redacted);
    must(stableJson(fullCore)===stableJson(redactedCore),"ENTITY_DATE_REDACTION_CHANGED_SOURCE_LOCAL_FEATURES");
    const sourcePayload={documentId:doc.documentId,symbol:doc.symbol,companyName:doc.companyName,sourcePublishedAt:doc.sourcePublishedAt,title:doc.title,sourceUrl:doc.sourceUrl,sections:doc.sections};
    return {
      documentId:doc.documentId,
      symbol:doc.symbol,
      sourcePublishedAt:doc.sourcePublishedAt,
      room11FirstKnownAt:corpus.room11FirstKnownAtUpperBound,
      sourceUrl:doc.sourceUrl,
      sourceDocumentHash:sha256(sourcePayload),
      normalizedTextHash:sha256(fullText),
      redactedTextHash:sha256(redactedText),
      sectionCount:doc.sections.length,
      titleOnlyBaseline:coreCounts(title),
      fullTextFeatures:fullCore,
      redactionControlFeatures:redactedCore,
      sourceLocalOnly:true,
      externalKnowledgeUsed:false,
      retrievalUsed:false,
      llmInvoked:false,
      currentOrFutureOutcomeAccessed:false,
    };
  });
  const base={
    schemaVersion:"D16_22_TEXT_FEATURE_RECEIPT_V0_1",
    decisionTimestamp,
    corpusSchemaVersion:corpus.schemaVersion,
    corpusCaptureCommitSha:corpus.captureCommitSha,
    corpusFirstKnownAt:corpus.room11FirstKnownAtUpperBound,
    sourceProvider:corpus.sourceProvider,
    sourceContentSpec:corpus.sourceContentSpec,
    documentCount:docs.length,
    symbolCount:new Set(docs.map(d=>d.symbol)).size,
    modelVersion:MODEL_VERSION,
    tokenizerVersion:TOKENIZER_VERSION,
    promptTemplateVersion:PROMPT_TEMPLATE_VERSION,
    lexiconHash,
    deterministicReplay:true,
    boundedRepeatReplay:"BITWISE_DETERMINISTIC",
    sourceLocalOnly:true,
    openWorldModelUsed:false,
    retrievalUsed:false,
    outcomeAccessed:false,
    sentimentAlphaClaimMade:false,
    formalCoreChanged:false,
    documents:docs,
  };
  return {...base,receiptHash:sha256(base)};
}
export async function runPhysical({
  corpusPath="research/d16_22_taiwan_material_disclosure_corpus_20261009_v0_1.json",
  outputPath=process.env.D16_22_TEXT_OUTPUT||null,
  decisionTimestamp="2026-10-09T04:39:10Z",
}={}){
  const corpus=JSON.parse(await readFile(corpusPath,"utf8"));
  const out=buildTextFeatureReceipt({corpus,decisionTimestamp});
  if(outputPath)await writeFile(outputPath,JSON.stringify(out,null,2)+"\n","utf8");
  return out;
}
if(import.meta.url===`file://${process.argv[1]}`){
  console.log(JSON.stringify(await runPhysical(),null,2));
}
