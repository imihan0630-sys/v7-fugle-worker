import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {consumePita2330CaSourceOnly} from '../runtime/pit_a_2330_ca_source_only_consumer_v0_1.mjs';
const file=process.env.S2_BUILD_REAL_CA_RECEIPT;
const load=async()=>JSON.parse(await readFile(file,'utf8'));
test('absent or invented receipt cannot grant CA source lineage',async()=>{
 for(const dataReadback of [undefined,null,[],{}, {receiptHash:'a'.repeat(64)}])
  await assert.rejects(consumePita2330CaSourceOnly({dataReadback}));
});
test('actual immutable DATA receipt preserves UNKNOWN and date denominator',{skip:!file},async()=>{
 const r=await consumePita2330CaSourceOnly({dataReadback:await load()});
 assert.equal(r.sourceFamilyBodiesVerified,6);
 assert.equal(r.currentObservedPositiveEventRows,1);
 assert.equal(r.currentSymbolFullPITAcceptedCount,0);
 for(const key of ['fullUniverseOrdinaryShareCount','fullUniversePITUnknownCount','selectedCount','zeroPickDay','stage1ActuallyAssessedCount'])assert.equal(r[key],null);
 for(const key of ['authoritativeNoEventCertified','independentFullPitAuditAccepted','stage1EvaluationAuthorized','shadowAuthorized','frozenD1Written','pitBHistoricalReplayCertified'])assert.equal(r[key],false);
 const {receiptHash,...body}=r;assert.equal(receiptHash,await sha256Hex(body));
});
test('re-signed date, NO_EVENT, PIT and source-hash substitutions rejected',{skip:!file},async()=>{
 for(const mutate of [d=>d.asOfMarketDate='2026-10-19',d=>d.pitEligible=true,
 d=>d.auditLaneIndependentFullPITAccepted=true,d=>d.authoritativeNoEventNegativeScopeCertified=true,
 d=>d.selectedCount=0,d=>d.zeroPickDay=true,d=>d.nativeSourceFamilies.pop(),
 d=>d.nativeSourceFamilies[0].sourceNativeBodySha256='a'.repeat(64),
 d=>d.nativeSourceFamilies[0].positiveRows[0].sourceNativeValues[1]='3287']){
 const d=await load();mutate(d);delete d.receiptHash;d.receiptHash=await sha256Hex(d);
 await assert.rejects(consumePita2330CaSourceOnly({dataReadback:d}),/PIN_MISMATCH/);
 }
});
