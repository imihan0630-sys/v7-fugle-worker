import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {resolve} from "node:path";
import {auditOriginalA1DailyBarPitCutV0_1,REAL}
 from "../migration/issue1068_original_a1_perpair_perbar_pit_asof_v0_1.mjs";
const path=process.env.S2_PIT_ORIGINAL_SOURCE_RECEIPT,
      ap=process.env.S2_PIT_ORIGINAL_AUDIT_RECEIPT,
      dir=process.env.S2_PIT_ORIGINAL_PROVIDER_DIR;
if(!path||!ap||!dir){
 test("original 122 full native A1 files required",{
  skip:"Only dedicated GH original 40MB Artifact test is a real physical replay"
 },()=>{});
}else{
 const [original,audit]=await Promise.all([path,ap].map(f=>readFile(f,"utf8").then(JSON.parse)));
 const at="2026-10-16T00:20:00.000Z";
 const call=(s=original,a=audit,raw)=>auditOriginalA1DailyBarPitCutV0_1({
  original:s,independentAudit:a,originalDirectory:dir,
  evaluationAtUtc:at,...raw
 });
 test("PHYSICAL original 122/122 bodies, per-bar source OHLCV 1935x61, 23:45 cutoff blocked and preopen qualified source only",async()=>{
  const p=await call();
  assert.equal(p.sourcePairsIndependentlyByteRehashed,122);
  assert.equal(p.originalNativePayloadsDecompressedAndReparsed,122);
  assert.equal(p.completeSymbolWindowsReconciled,1935);
  assert.equal(p.individualOriginalOHLCVBarsIndependentlyReconciled,1935*61);
  assert.equal(p.perPair.length,122);
  assert.equal(new Set(p.perPair.map(x=>x.market+"|"+x.marketDate)).size,122);
  assert.equal(p.checks[0].cutUtc,REAL.originalMarketDayDecisionCutUtc);
  assert.equal(p.checks[0].qualifiedComplete122ForDecision,false);
  assert.ok(p.checks[0].pairsActuallyObservedByCut<122);
  assert.equal(p.checks[1].cutUtc,REAL.alreadyExecutedPreopenResearchCutUtc);
  assert.equal(p.checks[1].pairsActuallyObservedByCut,122);
  assert.equal(p.checks[1].qualifiedComplete122ForDecision,true);
  assert.equal(p.checks[1].strategyPitQualified,false);
  assert.equal(p.historicalFirstKnownAtAndAvailableAtCertified,0);
  assert.equal(p.frozenDecisionsPersisted,false);
  assert.equal(p.cloudflareD1Writes,0);
  assert.equal(p.system1FormalCoreModified,false);
 });
 test("future/invalid replay-clock fails closed",async()=>{
  await assert.rejects(call(original,audit,{evaluationAtUtc:"2026-10-15T18:00:00Z"}),
   /S2_A1_ORIGINAL_PERBAR_PIT_/);
  await assert.rejects(call(original,audit,{evaluationAtUtc:"2026-10-16T08:20:00+08:00"}),
   /S2_A1_ORIGINAL_PERBAR_PIT_/);
 });
 test("fake earlier original provider capture clock breaks signed receipt",async()=>{
  const o={...original,receipts:original.receipts.map((x,i)=>i===0?
   {...x,capturedAt:"2026-07-01T13:30:00.000Z"}:x)};
  await assert.rejects(call(o),/S2_A1_ORIGINAL_PERBAR_PIT_/);
 });
 test("fake historic 61-session bar knownAt breaks 61-window physical reconciliation",async()=>{
  const key=Object.keys(original.bySymbol)[0];
  const badBars=original.bySymbol[key].bars.map((b,i)=>i===0?
    {...b,firstKnownAt:"2026-07-01T13:30:00.000Z"}:b);
  const o={...original,bySymbol:{...original.bySymbol,
   [key]:{...original.bySymbol[key],bars:badBars}}};
  await assert.rejects(call(o),/S2_A1_ORIGINAL_PERBAR_PIT_/);
 });
 test("unsigned independent source claim of fully certified PIT fails",async()=>{
  const a={...audit,strategyPitCertified:true};
  await assert.rejects(call(original,a),/S2_A1_ORIGINAL_PERBAR_PIT_/);
 });
 test("tampered physical gzip blob fails before any false asof success",async()=>{
  await assert.rejects(call(original,audit,{
    readRaw:async()=>Buffer.from("not a compressed original")
  }),/S2_A1_ORIGINAL_PERBAR_PIT_/);
 });
}
