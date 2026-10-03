"""Class-B prospective research child. Never edit baseline Worker.js directly."""
from pathlib import Path
import hashlib

path = Path('Worker.js')
text = path.read_text(encoding='utf-8')

def replace_once(old, new, label):
    global text
    if text.count(old) != 1:
        raise SystemExit(f'{label}: expected 1 match, found {text.count(old)}')
    text = text.replace(old, new, 1)

def frozen_module(filename, digest, exports, prelude=''):
    source = Path('research', filename).read_text(encoding='utf-8')
    if hashlib.sha256(source.encode()).hexdigest() != digest:
        raise SystemExit('Frozen Class-A dependency changed: ' + filename)
    source = '\n'.join(line for line in source.splitlines() if not line.startswith('import '))
    source = source.replace('export ', '')
    # Keep module-local names scoped, including function declarations used by review tooling.
    return '(()=>{\n' + prelude + '\n' + '\n'.join('  ' + line for line in source.splitlines()) + '\n  return {' + exports + '};\n})();\n'

replace_once('const VERSION = "8.15.4-c4-priority-provenance";',
             'const VERSION = "8.16.0-zero-pick-prospective-capture";', 'version')

helpers = '\nconst C1_ZERO_PICK_CANONICAL=' + frozen_module(
    'canonical_receipt_hash_v0_1.mjs',
    'd8ed1d112f999c098a3d108f55170d6fea4db0347ddbae1a7f62e0250d60145a', 'canonicalJcsJson')
helpers += 'const C1_ZERO_PICK_SOURCE=' + frozen_module(
    'system1_zero_pick_runtime_source_adapter_v0_1.mjs',
    '03e98ab83176516ac4cf3872915e68948aac3f7b0ed8af3c43bdd3dacc4931dc',
    'buildSystem1ZeroPickObserverSourceFromRuntime')
helpers += 'const C1_ZERO_PICK_OBSERVER=' + frozen_module(
    'system1_zero_pick_rank_input_observer_v0_1.mjs',
    'cd8672fb87f3a1ed4d9843147ecfad3c871fab41a6a679fb961bfd5a78028a02',
    'buildSystem1ZeroPickRankObservation',
    '  const {canonicalJcsJson}=C1_ZERO_PICK_CANONICAL;')
helpers += r'''
function c1ZeroPickOrdinals(featureRows,todayRows) {
  const closes=new Map(todayRows.map(r=>[String(r.symbol),c1Number(r.close)]));
  const next={GENERAL:0,THOUSAND:0},ordinals=new Map();
  for(const f of featureRows) {
    const symbol=String(f.symbol),close=closes.get(symbol);
    if(close===null||close===undefined) continue;
    const pool=close>=THOUSAND_STOCK_PRICE?"THOUSAND":"GENERAL";
    if(ordinals.has(symbol)) throw new Error("C1_ZERO_PICK_DUPLICATE_SYMBOL");
    ordinals.set(symbol,{pool,preSortOrdinal:next[pool]++});
  }
  return ordinals;
}

function buildC1ZeroPickChild(f,sector,derived,identity,consensusReference) {
  try {
    const source=C1_ZERO_PICK_SOURCE.buildSystem1ZeroPickObserverSourceFromRuntime({
      ...identity,feature:f,sector,derived,consensusReference
    });
    // Canonical structure only; SHA-256 is finalized asynchronously before D1 persistence.
    const observation=C1_ZERO_PICK_OBSERVER.buildSystem1ZeroPickRankObservation(source,()=>null);
    return {...observation,sourceKnownAt:source.sourceKnownAt,
      sourceKnownAtProvenance:source.sourceKnownAtProvenance,sourceEventAt:source.sourceEventAt,
      marketConsensusState:source.marketConsensusState,
      consensusObservedReferenceDate:source.consensusObservedReferenceDate};
  } catch(error) {
    return {schemaVersion:"SYSTEM1_ZERO_PICK_RANK_OBSERVATION_V0_1",...identity,
      rankInputStatus:"INCOMPLETE",rankInput:null,missingFields:["OBSERVER_SOURCE_REJECTED"],
      error:String(error).slice(0,180),researchOnly:true,decisionImpact:false,formalCoreImpact:false,
      actualFormalRank:false,noTrade:true,noPush:true,economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE"};
  }
}

async function finalizeC1ZeroPickReceipt(receipt) {
  if(!receipt?.zeroPickCapture) return receipt; // Legacy receipts are never retrofitted.
  const rows=[];
  for(const row of receipt.rows) {
    const child=row.zeroPickRankObservation;
    if(!child) { rows.push(row); continue; }
    if(child.captureGeneration!==receipt.generationId||child.scanDate!==receipt.sessionDate||
       child.decisionAt!==receipt.decisionAt||child.symbol!==row.symbol||child.pool!==row.pricePool)
      throw new Error("C1_ZERO_PICK_IDENTITY_MISMATCH");
    if(child.rankInputStatus!=="COMPLETE") {
      if(child.rankInput!==null) throw new Error("C1_ZERO_PICK_INCOMPLETE_TUPLE");
      rows.push(row); continue;
    }
    const {rankingTupleFingerprint,...payload}=child.rankInput;
    if(payload.captureGeneration!==receipt.generationId||payload.scanDate!==receipt.sessionDate||
       payload.decisionAt!==receipt.decisionAt||payload.symbol!==row.symbol||payload.pool!==row.pricePool||
       payload.rankingTupleKnownAt!==receipt.decisionAt||child.actualFormalRank!==false)
      throw new Error("C1_ZERO_PICK_TUPLE_IDENTITY_OR_PIT_MISMATCH");
    const fingerprint=await sha256Hex(C1_ZERO_PICK_CANONICAL.canonicalJcsJson(payload));
    if(rankingTupleFingerprint!==null&&rankingTupleFingerprint!==fingerprint)
      throw new Error("C1_ZERO_PICK_FINGERPRINT_CONFLICT");
    rows.push({...row,zeroPickRankObservation:{...child,
      rankInput:{...payload,rankingTupleFingerprint:fingerprint}}});
  }
  return {...receipt,rows,zeroPickCapture:{...receipt.zeroPickCapture,fingerprintState:"SHA256_FINALIZED"}};
}
'''
anchor = 'function buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,formalResults,selected,scanDate) {'
replace_once(anchor, helpers + '\n' + anchor.replace('scanDate)', 'scanDate,zeroPickContext=null)'), 'research child helpers')
replace_once('''    const result=formalResults?.get(symbol)||null;
    const historyAdmission=''', '''    const result=formalResults?.get(symbol)||null;
    const derived=f?c1DerivedState(f):null;
    const ordinal=zeroPickContext?.ordinals?.get(symbol);
    const zeroPickRankObservation=f&&zeroPickContext?buildC1ZeroPickChild(f,sector,derived,{
      scanDate,symbol,pool:c1Number(raw?.close)===null?"UNKNOWN":raw.close>=THOUSAND_STOCK_PRICE?"THOUSAND":"GENERAL",
      captureGeneration:generationId,decisionAt,preSortOrdinal:ordinal?.preSortOrdinal??null
    },zeroPickContext.consensusReference):null;
    const historyAdmission=''', 'same-request source capture')
replace_once('      derived:f?c1DerivedState(f):null,',
             '      derived,\n      ...(zeroPickContext?{zeroPickRankObservation}:{}),', 'additive child')
replace_once('''    populationN:rows.length,featureN:featureRows?.length||0,rows,''', '''    populationN:rows.length,featureN:featureRows?.length||0,rows,
    ...(zeroPickContext?{zeroPickCapture:{schemaVersion:"SYSTEM1_ZERO_PICK_C1_CAPTURE_V0_1",
      semantics:"COUNTERFACTUAL_RANK_INPUT / RESEARCH_ONLY / NO_FORMAL_DECISION_IMPACT",
      fingerprintState:"PENDING_ASYNC_FINALIZE",sameScanOnly:true,laterRepairAllowed:false,
      historicalBackfillAllowed:false,actualFormalRank:false,providerCallDelta:0}}:{}),''', 'capture header')
replace_once('''  const scored = [];
  const basePoolDiagnostics = [];''', '''  let c1ZeroPickContext=null;
  try { c1ZeroPickContext={ordinals:c1ZeroPickOrdinals(featureRows,todayRows),consensusReference:env.V7_MARKET_CONSENSUS}; }
  catch(error) { c1ZeroPickContext={ordinals:null,consensusReference:null}; }
  const scored = [];
  const basePoolDiagnostics = [];''', 'pre-sort ordinal firewall')
replace_once('''try { c1PopulationReceipt=buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,c1FormalResults,selected,scanDate); }''',
             '''try { c1PopulationReceipt=buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,c1FormalResults,selected,scanDate,c1ZeroPickContext); }''', 'capture context')
replace_once('''async function persistC1PopulationReceipt(env,receipt) {
  const rows=''', '''async function persistC1PopulationReceipt(env,receipt) {
  receipt=await finalizeC1ZeroPickReceipt(receipt);
  const rows=''', 'async finalization before immutable digest')

Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/Worker-before-v8_16_0.mjs').write_text(path.read_text(encoding='utf-8'),encoding='utf-8')
path.write_text(text.replace('\r\n','\n'),encoding='utf-8',newline='\n')
print('Applied V8.16.0 Class-B zero-pick prospective research capture; Formal Core unchanged')
