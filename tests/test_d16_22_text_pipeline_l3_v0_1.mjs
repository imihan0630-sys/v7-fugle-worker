import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  MODEL_VERSION,TOKENIZER_VERSION,PROMPT_TEMPLATE_VERSION,LEXICON,sha256,validateCorpus,buildTextFeatureReceipt
} from "../research/d16_22_text_pipeline_l3_v0_1.mjs";

let passed=0;
function test(name,fn){try{fn();passed++;console.log("PASS",name);}catch(e){console.error("FAIL",name,e?.stack||e);process.exitCode=1;}}
function throws(name,fn,re){test(name,()=>assert.throws(fn,re));}
const corpus=JSON.parse(await readFile("research/d16_22_taiwan_material_disclosure_corpus_20261009_v0_1.json","utf8"));
const cut="2026-10-09T04:39:10Z";

test("TX-T01 corpus identity and conservative first-known cut valid",()=>{
 assert.equal(validateCorpus(corpus),true);
 assert.equal(corpus.documentCount,8);
 assert.deepEqual(corpus.symbols,["2330","2454","2537","3037"]);
 assert.equal(corpus.historicalBackfillAllowed,false);
 assert.equal(corpus.room11FirstKnownAtUpperBound,cut);
});
test("TX-T02 deterministic replay bitwise receipt",()=>{
 const a=buildTextFeatureReceipt({corpus,decisionTimestamp:cut});
 const b=buildTextFeatureReceipt({corpus,decisionTimestamp:cut});
 assert.deepEqual(a,b);
 assert.equal(a.receiptHash,b.receiptHash);
 assert.equal(a.deterministicReplay,true);
});
throws("TX-T03 decision before Room11 first-known fails closed",()=>buildTextFeatureReceipt({corpus,decisionTimestamp:"2026-10-09T04:39:09Z"}),/DECISION_BEFORE_ROOM11_FIRST_KNOWN/);
test("TX-T04 source timestamps do not replace Room11 first-known clock",()=>{
 const x=buildTextFeatureReceipt({corpus,decisionTimestamp:cut});
 assert.ok(x.documents.every(d=>d.room11FirstKnownAt===cut));
 assert.ok(x.documents.some(d=>d.sourcePublishedAt.startsWith("2026-08")));
});
test("TX-T05 fixed model tokenizer prompt lineage",()=>{
 const x=buildTextFeatureReceipt({corpus,decisionTimestamp:cut});
 assert.equal(x.modelVersion,MODEL_VERSION);
 assert.equal(x.tokenizerVersion,TOKENIZER_VERSION);
 assert.equal(x.promptTemplateVersion,PROMPT_TEMPLATE_VERSION);
 assert.equal(x.lexiconHash,sha256(LEXICON));
});
test("TX-T06 no external LLM retrieval or outcome access",()=>{
 const x=buildTextFeatureReceipt({corpus,decisionTimestamp:cut});
 assert.equal(x.openWorldModelUsed,false);
 assert.equal(x.retrievalUsed,false);
 assert.equal(x.outcomeAccessed,false);
 assert.ok(x.documents.every(d=>!d.llmInvoked&&!d.retrievalUsed&&!d.currentOrFutureOutcomeAccessed));
});
test("TX-T07 entity date redaction preserves source-local lexical features",()=>{
 const x=buildTextFeatureReceipt({corpus,decisionTimestamp:cut});
 for(const d of x.documents)assert.deepEqual(d.fullTextFeatures,d.redactionControlFeatures);
});
test("TX-T08 known correction disclosure is detected",()=>{
 const x=buildTextFeatureReceipt({corpus,decisionTimestamp:cut});
 const d=x.documents.find(d=>d.documentId==="6a71ce879e92b0f406c62f19");
 assert.ok(d);
 assert.ok(d.fullTextFeatures.correction>0);
});
test("TX-T09 fire disclosure exposes adverse and uncertainty context without scalar sentiment",()=>{
 const x=buildTextFeatureReceipt({corpus,decisionTimestamp:cut});
 const d=x.documents.find(d=>d.documentId==="6ac0814f9e92b0f406eceda0");
 assert.ok(d.fullTextFeatures.adverse>0);
 assert.ok(d.fullTextFeatures.uncertainty>0);
 assert.equal(Object.prototype.hasOwnProperty.call(d,"sentimentScore"),false);
});
test("TX-T10 revenue disclosure detects expansion language but makes no alpha claim",()=>{
 const x=buildTextFeatureReceipt({corpus,decisionTimestamp:cut});
 const d=x.documents.find(d=>d.documentId==="6ac730549e92b0f40634ba83");
 assert.ok(d.fullTextFeatures.expansion>0);
 assert.equal(x.sentimentAlphaClaimMade,false);
});
test("TX-T11 title-only baseline and full-text transform remain separately visible",()=>{
 const x=buildTextFeatureReceipt({corpus,decisionTimestamp:cut});
 assert.ok(x.documents.every(d=>d.titleOnlyBaseline&&d.fullTextFeatures));
 assert.ok(x.documents.some(d=>JSON.stringify(d.titleOnlyBaseline)!==JSON.stringify(d.fullTextFeatures)));
});
throws("TX-T12 duplicate document id rejected",()=>{
 const bad={...corpus,documents:[...corpus.documents,corpus.documents[0]]};
 buildTextFeatureReceipt({corpus:bad,decisionTimestamp:cut});
},/DUPLICATE_DOCUMENT_ID/);
throws("TX-T13 non-MOPS source URL rejected",()=>{
 const docs=corpus.documents.map((d,i)=>i?d:{...d,sourceUrl:"https://example.com/fake"});
 buildTextFeatureReceipt({corpus:{...corpus,documents:docs},decisionTimestamp:cut});
},/NON_MOPS_SOURCE_URL/);
throws("TX-T14 historical backfill flag cannot be enabled",()=>{
 buildTextFeatureReceipt({corpus:{...corpus,historicalBackfillAllowed:true},decisionTimestamp:cut});
},/HISTORICAL_BACKFILL_FORBIDDEN/);
test("TX-T15 document mutation changes deterministic receipt identity",()=>{
 const a=buildTextFeatureReceipt({corpus,decisionTimestamp:cut});
 const docs=corpus.documents.map((d,i)=>i?d:{...d,title:d.title+" 測試變更"});
 const b=buildTextFeatureReceipt({corpus:{...corpus,documents:docs},decisionTimestamp:cut});
 assert.notEqual(a.receiptHash,b.receiptHash);
});
if(process.exitCode)process.exit(process.exitCode);
console.log(`D16-22 Taiwan text-pipeline L3 falsification suite PASS: ${passed} tests`);
