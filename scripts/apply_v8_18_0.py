"""Owner-approved additive source vintage capture; Production merge/deploy NOT authorized."""
from pathlib import Path
import hashlib
path=Path('Worker.js');text=path.read_text(encoding='utf-8')
def once(old,new,label):
 global text
 if text.count(old)!=1:raise SystemExit(f'{label}: expected one anchor, got {text.count(old)}')
 text=text.replace(old,new,1)
source=Path('research/system1_valuation_source_vintage_v0_1.mjs').read_text()
expected='20945bc87d8ed856cac6c71839e2fea2427aee9adc3c82adcb326f2d08316ed5'
if hashlib.sha256(source.encode()).hexdigest()!=expected:raise SystemExit('Frozen source vintage module changed')
source='\n'.join(line for line in source.splitlines() if not line.startswith('import ')).replace('export ','')
module='\n// BEGIN V8.18 VALUATION SOURCE VINTAGE\nconst VALUATION_VINTAGE=(()=>{\n  const {canonicalJcsJson,sha256HexUtf8}=SHADOW_CANONICAL;\n'+source+'\nreturn {captureValuationSourceVintage,attachValuationSourceVintage,finalizeValuationSourceVintage,verifyValuationSourceVintage};\n})();\n// END V8.18 VALUATION SOURCE VINTAGE\n'
once('const VERSION = "8.17.0-shadow-cohort-membership";','const VERSION = "8.18.0-valuation-source-vintage";','version')
once('function buildC1PopulationReceipt(',module+'function buildC1PopulationReceipt(','module')
once('scanDate,zeroPickContext=null) {','scanDate,zeroPickContext=null,valuationContext=null) {','capture argument')
once('''  return {
    schemaVersion:C1_POPULATION_SCHEMA_VERSION,generationId,sourceMainSha:C1_SOURCE_MAIN_SHA,''','''  const receipt={
    schemaVersion:C1_POPULATION_SCHEMA_VERSION,generationId,sourceMainSha:C1_SOURCE_MAIN_SHA,''','local receipt')
once('''    policy:"Full normalized population receipt. Missing history/features remain explicit UNKNOWN; no row changes Formal selection, ranking, capital, signal or push."
  };
}''','''    policy:"Full normalized population receipt. Missing history/features remain explicit UNKNOWN; no row changes Formal selection, ranking, capital, signal or push."
  };
  return VALUATION_VINTAGE.attachValuationSourceVintage(receipt,valuationContext,featureRows||[]);
}''','attach source metadata')
once('''  const loadedConfig = await loadStockConfig(env);
  const currentSymbols''','''  // BEGIN V8.18 REQUEST SOURCE CAPTURE
  let valuationSourceVintageContext=null;
  try { valuationSourceVintageContext=await VALUATION_VINTAGE.captureValuationSourceVintage({
    valuation:valuationData,financial:financialData,quarterEps,scanDate:marketDate,epsReviewOnly
  }); } catch { /* Research fails closed; Formal scan remains unchanged. */ }
  // END V8.18 REQUEST SOURCE CAPTURE
  const loadedConfig = await loadStockConfig(env);
  const currentSymbols''','same-request already-read snapshots')
once('V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus }, marketDate);','V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus, V7_VALUATION_SOURCE_VINTAGE:valuationSourceVintageContext }, marketDate);','request-local argument')
once('selected,scanDate,c1ZeroPickContext);','selected,scanDate,c1ZeroPickContext,env.V7_VALUATION_SOURCE_VINTAGE);','sync selector additive capture')
once('''  receipt=await finalizeC1ZeroPickReceipt(receipt);''','''  receipt=await finalizeC1ZeroPickReceipt(receipt);
  receipt=await VALUATION_VINTAGE.finalizeValuationSourceVintage(receipt);
  await VALUATION_VINTAGE.verifyValuationSourceVintage(receipt);''','finalize before immutable persistence')
once('''    throw new Error("C1_D1_READBACK_DIGEST_MISMATCH");
  return true;''','''    throw new Error("C1_D1_READBACK_DIGEST_MISMATCH");
  await VALUATION_VINTAGE.verifyValuationSourceVintage({...JSON.parse(headerRow.header_json),rows});
  return true;''','shared header digest bound in content rows')
Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/Worker-before-v8_18_0.mjs').write_text(path.read_text(),encoding='utf-8')
path.write_text(text,encoding='utf-8')
print('Applied V8.18.0 research-only valuation source vintage; Formal unchanged')
