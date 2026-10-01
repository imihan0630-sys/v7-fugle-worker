import {createHash} from 'node:crypto';
import {observeFormalGateOverlap} from './formal_gate_overlap_observer_v0_1.mjs';

// Offline only. No Worker import, bindings, fetch, scheduling or trading adapter.
export const SAFETY = Object.freeze(['SOURCE_AUTHENTICITY','SESSION_CONTINUITY','CORPORATE_ACTION_CONTINUITY','EXECUTION_FEASIBILITY','ACCOUNT_RISK']);
const C1_GATE_IDS=Object.freeze([
  'PRICE_FLOOR','HISTORY_60D','RS_CONTEXT','MARKET_CAP_FLOOR','DAILY_ABNORMALITY','LIQUIDITY',
  'SMALL_CAP_SPECIAL','MID_CAP_LIQUIDITY','CHIP_CONCENTRATION_PRESENT','FINANCIAL_SOURCE_COMPLETENESS',
  'ANNOUNCEMENT_RISK','VALUATION_RELATIVE_RISK','SECTOR_GATE','AB_SETUP','FUNDAMENTAL_COMPONENT_COUNT',
  'FUNDAMENTAL_QUALITY','ATR_QUALITY','TARGET_AVAILABLE','REWARD_RISK','FINAL_SIGNAL_GRADE',
  'SECTOR_BREADTH','SECTOR_RETURN','SECTOR_AMOUNT','SETUP_A','SETUP_B'
]);
const number = x => typeof x === 'number' && Number.isFinite(x) ? x : null;
const state = (status, reason = null) => ({status, reason});
const hash = x => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const numericFields = {
  feature: ['close','historyDays','marketReturn20','sectorReturn20','marketCapYi','changePercent','avgVolume20Lots','avgAmount20','spreadPercent','depthScore','chipConcentration','quarterRevenue','revenueQoQ','revenueQuarterYoY','priceBookRatio','priceEarningsRatio','sectorMedianPe','epsYoY','atrPercent'],
  sector: ['breadth','avgChange','amountVs20DayAverage'],
  derived: ['institutionalScore','fundamentalCount','fundamentalScore','target','rewardPerRisk','setupQuality']
};
function timestamp(x) { return typeof x === 'string' && /(?:Z|[+-]\d\d:\d\d)$/.test(x) ? Date.parse(x) : NaN; }
function known(e, row, decisionAt) {
  return e?.authenticated === true && e?.parentId === row.parentId &&
    e?.sessionDate === row.sessionDate && Number.isFinite(timestamp(e?.knownAt)) &&
    timestamp(e.knownAt) <= timestamp(decisionAt);
}

export function adaptC1PopulationPages(pages) {
  if(!Array.isArray(pages)||!pages.length) throw new Error('C1_PAGES_REQUIRED');
  const headers=pages.map(page=>page?.header);
  const header=headers[0];
  if(!header?.generationId||header?.readbackVerified!==true||!header?.contentDigest||!header?.universeDigest)
    throw new Error('C1_HEADER_NOT_VERIFIED');
  if(headers.some(x=>x?.generationId!==header.generationId||x?.contentDigest!==header.contentDigest||x?.populationN!==header.populationN))
    throw new Error('C1_HEADER_MISMATCH');
  const chunks=pages.flatMap(page=>Array.isArray(page?.chunks)?page.chunks:[]).sort((a,b)=>a.chunkIndex-b.chunkIndex);
  if(chunks.length!==Number(header.chunkCount)||chunks.some((chunk,index)=>chunk.chunkIndex!==index)||
      chunks.some(chunk=>chunk.rowCount!==chunk.rows?.length)) throw new Error('C1_CHUNK_COVERAGE_INCOMPLETE');
  const rawRows=chunks.flatMap(chunk=>chunk.rows);
  if(rawRows.length!==Number(header.populationN)) throw new Error('C1_POPULATION_COUNT_MISMATCH');
  const contentDigest=hash(rawRows);
  const universe=rawRows.map(row=>String(row.symbol));
  const universeDigest=createHash('sha256').update([...universe].sort().join('\n')).digest('hex');
  if(contentDigest!==header.contentDigest||universeDigest!==header.universeDigest) throw new Error('C1_DIGEST_MISMATCH');
  if(new Set(universe).size!==universe.length) throw new Error('C1_DUPLICATE_SYMBOL');
  const point={authenticated:true,parentId:header.generationId,sessionDate:header.sessionDate,knownAt:header.decisionAt};
  const rows=rawRows.map(raw=>({
    symbol:String(raw.symbol),sessionDate:header.sessionDate,parentId:header.generationId,
    feature:raw.feature||{},sector:raw.sector||{},derived:raw.derived||{},
    formalResult:raw.formalResult?{
      ok:raw.formalResult.ok===true,reason:raw.formalResult.firstFailure||null,
      basePassed:raw.formalResult.basePassed===true,rrPassed:raw.formalResult.rrPassed===true,
      selected:raw.formalResult.selected===true,selectedRank:raw.formalResult.selectedRank??null
    }:null,
    historyAdmission:raw.historyAdmission||null,
    gateEvidence:Object.fromEntries(C1_GATE_IDS.map(id=>[id,{...point}])),
    safety:Object.fromEntries(SAFETY.map(id=>[id,{...point,...(raw.safety?.[id]||{status:'UNKNOWN',reason:'SAFETY_NOT_CAPTURED'})}])),
    thesis:null,structuralStop:null,entryGeometry:raw.derived?.entryGeometry||null
  }));
  return {
    sessionDate:header.sessionDate,decisionAt:header.decisionAt,universe,rows,
    generationId:header.generationId,contentDigest,universeDigest,
    sourceMainSha:header.sourceMainSha,effectiveRuntimeVersion:header.effectiveRuntimeVersion,
    captureCompleteness:header.completeness,researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}

export function observeRow(row, decisionAt) {
  const input = {};
  for (const [part, keys] of Object.entries(numericFields)) {
    input[part] = {...row[part]};
    // NaN survives the old Number() helper as missing; null, blanks and booleans do not.
    for (const key of keys) input[part][key] = number(row[part]?.[key]) ?? NaN;
  }
  input.formalResult = row.formalResult;
  const old = observeFormalGateOverlap(input);
  const gates = Object.fromEntries(Object.entries(old.gates).map(([id,g]) => [id,
    g.status === 'NOT_EVALUABLE' ? state('UNKNOWN',g.reason) : state(g.status,g.reason)]));
  // Independent downstream states never inherit an earlier FAIL as their result.
  const score = number(row.derived?.fundamentalScore), count = number(row.derived?.fundamentalCount);
  gates.FUNDAMENTAL_QUALITY = score === null || count === null || count < 3 ? state('UNKNOWN','INSUFFICIENT_COMPONENT_EVIDENCE') : state(score >= 25 ? 'PASS':'FAIL');
  const quality = number(row.derived?.setupQuality);
  gates.FINAL_SIGNAL_GRADE = quality === null ? state('UNKNOWN','MISSING_SETUP_QUALITY') : state(quality >= 65 ? 'PASS':'FAIL');
  const target = number(row.derived?.target);
  gates.TARGET_AVAILABLE = row.derived?.targetState === 'NONE' ? state('FAIL','NO_VERIFIABLE_RESISTANCE') :
    row.derived?.targetState === 'FOUND' && target !== null ? state('PASS') : state('UNKNOWN','MISSING_TARGET_EVIDENCE');
  const rr = number(row.derived?.rewardPerRisk);
  gates.REWARD_RISK = gates.TARGET_AVAILABLE.status !== 'PASS' || rr === null ? state('UNKNOWN','NO_VALID_TARGET_RR') : state(rr >= 2 ? 'PASS':'FAIL');
  for (const [id,key,limit] of [['SECTOR_BREADTH','breadth',40],['SECTOR_RETURN','avgChange',-1],['SECTOR_AMOUNT','amountVs20DayAverage',0.5]]) {
    const value = number(row.sector?.[key]); gates[id] = value === null ? state('UNKNOWN','MISSING_SECTOR_INPUT') : state(value >= limit ? 'PASS':'FAIL');
  }
  for (const channel of ['A','B']) {
    const pass = row.derived?.setupState?.[channel]?.pass;
    gates['SETUP_'+channel] = typeof pass === 'boolean' ? state(pass ? 'PASS':'FAIL') : state('UNKNOWN','MISSING_SETUP');
  }
  // A known true operand proves OR; a missing operand cannot prove false.
  const a = gates.SETUP_A.status, b = gates.SETUP_B.status;
  gates.AB_SETUP = state(a === 'PASS' || b === 'PASS' ? 'PASS' : a === 'FAIL' && b === 'FAIL' ? 'FAIL':'UNKNOWN');
  for (const id of Object.keys(gates)) {
    if (!known(row.gateEvidence?.[id],row,decisionAt)) gates[id] = state('UNKNOWN','MISSING_OR_NON_PIT_GATE_RECEIPT');
  }
  for (const id of SAFETY) {
    const e = row.safety?.[id];
    gates[id] = known(e,row,decisionAt) && ['PASS','FAIL'].includes(e.status) ? state(e.status) : state('UNKNOWN','MISSING_OR_NON_PIT_SAFETY');
  }
  const close = number(row.feature?.close);
  return {symbol:row.symbol,sessionDate:row.sessionDate,parentId:row.parentId,
    pool:close === null ? 'UNKNOWN' : close >= 1000 ? 'THOUSAND' : close >= 10 ? 'GENERAL':'BELOW_PRICE_FLOOR',
    gates, formalResult:row.formalResult ? structuredClone(row.formalResult):null,
    firstFailureReason:row.formalResult?.ok === false ? row.formalResult.reason ?? null:null,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false};
}

export function diagnosePopulation({sessionDate,decisionAt,universe,rows,samplePerStratum=3,seed='C1-20261001'}) {
  if (!Number.isFinite(timestamp(decisionAt)) || !Array.isArray(universe) || !Array.isArray(rows) ||
      !Number.isInteger(samplePerStratum) || samplePerStratum < 1) throw new Error('INVALID_POPULATION_CONTRACT');
  if (new Set(universe).size !== universe.length || universe.some(x => typeof x !== 'string' || !x)) throw new Error('INVALID_UNIVERSE');
  const bySymbol = new Map();
  for (const row of rows) {
    if (!universe.includes(row.symbol) || bySymbol.has(row.symbol) || row.sessionDate !== sessionDate) throw new Error('DUPLICATE_OR_FOREIGN_ROW');
    bySymbol.set(row.symbol,row);
  }
  // Missing upstream/history rows are retained in the denominator with UNKNOWN gates.
  const observations = universe.map(symbol => observeRow(bySymbol.get(symbol) ?? {symbol,sessionDate},decisionAt));
  const counts = {}, overlaps = {}, strata = new Map();
  for (const row of observations) {
    const entries = Object.entries(row.gates);
    for (const [id,g] of entries) {
      const key = row.pool+':'+id; counts[key] ??= {PASS:0,FAIL:0,UNKNOWN:0}; counts[key][g.status]++;
    }
    const failures = entries.filter(([,g]) => g.status === 'FAIL').map(([id]) => id).sort();
    for (let i=0;i<failures.length;i++) for(let j=i+1;j<failures.length;j++) {
      const key=JSON.stringify([row.pool,failures[i],failures[j]]); overlaps[key]=(overlaps[key]??0)+1;
    }
    const memberships = ['POPULATION',...failures.map(x=>'FAIL:'+x),...entries.filter(([,g])=>g.status==='UNKNOWN').map(([id])=>'UNKNOWN:'+id),
      'FIRST:'+ (row.firstFailureReason ?? (row.formalResult?.ok === true ? 'QUALIFIED':'UNKNOWN'))];
    for (const reason of memberships) {
      const key=JSON.stringify([row.pool,reason]); if(!strata.has(key)) strata.set(key,[]); strata.get(key).push(row.symbol);
    }
  }
  const samples = [...strata].sort(([a],[b])=>a.localeCompare(b)).map(([stratum,symbols])=>{
    const ordered=symbols.map(symbol=>({symbol,h:hash([seed,sessionDate,stratum,symbol])})).sort((a,b)=>a.h.localeCompare(b.h)||a.symbol.localeCompare(b.symbol));
    const sample=ordered.slice(0,samplePerStratum).map(x=>x.symbol);
    return {stratum,populationN:symbols.length,sampleN:sample.length,samplingFraction:sample.length/symbols.length,symbols:sample};
  });
  return {schemaVersion:'SYSTEM1_C1_ISOLATED_V0_1',sessionDate,decisionAt,seed,universeDigest:hash([...universe].sort()),
    populationN:universe.length,capturedN:rows.length,missingSymbols:universe.filter(x=>!bySymbol.has(x)),
    coverageComplete:rows.length===universe.length,counts,overlaps,samples,observations,
    economicSuperiority:'UNKNOWN',fullFormalCounterfactual:false,researchOnly:true,decisionImpact:false,formalCoreImpact:false};
}

export function challenge(row,decisionAt,{strategy='SHORT',watchUntil,revalidatedAt}={}) {
  if (!['SHORT','SWING'].includes(strategy)) throw new Error('UNREGISTERED_STRATEGY');
  const observed=observeRow(row,decisionAt);
  const mandatory=[...SAFETY,'PRICE_FLOOR','HISTORY_60D','RS_CONTEXT','DAILY_ABNORMALITY','LIQUIDITY','ANNOUNCEMENT_RISK','ATR_QUALITY','SECTOR_GATE'];
  if(strategy==='SWING') mandatory.push('MARKET_CAP_FLOOR','SMALL_CAP_SPECIAL','MID_CAP_LIQUIDITY','CHIP_CONCENTRATION_PRESENT','FINANCIAL_SOURCE_COMPLETENESS','VALUATION_RELATIVE_RISK','FUNDAMENTAL_COMPONENT_COUNT','FUNDAMENTAL_QUALITY');
  const blockers=mandatory.filter(id=>observed.gates[id].status!=='PASS');
  const thesis=row.thesis;
  if(!known(thesis,row,decisionAt)||thesis.status!=='PASS') blockers.push('THESIS');
  const stop=row.structuralStop;
  if(!known(stop,row,decisionAt)||!(number(stop.price)>0 && number(stop.price)<number(row.feature?.close))) blockers.push('STRUCTURAL_STOP');
  let status=blockers.length ? (blockers.some(id=>observed.gates[id]?.status==='FAIL'||row.thesis?.status==='FAIL')?'REJECTED':'DATA_BLOCKED'):'WATCH_EARLY';
  if(!blockers.length) {
    if(!Number.isFinite(timestamp(watchUntil))||timestamp(watchUntil)<=timestamp(decisionAt)||timestamp(watchUntil)-timestamp(decisionAt)>7*86400000||
        !Number.isFinite(timestamp(revalidatedAt))||timestamp(revalidatedAt)>timestamp(decisionAt)||timestamp(decisionAt)-timestamp(revalidatedAt)>86400000) status='EXPIRED';
    else if(['AB_SETUP','TARGET_AVAILABLE','REWARD_RISK','FINAL_SIGNAL_GRADE'].every(id=>observed.gates[id].status==='PASS')) {
      const geometry=row.entryGeometry;
      const entry=number(geometry?.entry), target=number(geometry?.target), riskStop=number(geometry?.stop);
      const calculated=entry !== null && riskStop !== null && target !== null && entry>riskStop && riskStop>0 && target>entry ? (target-entry)/(entry-riskStop):null;
      if(known(geometry,row,decisionAt) && calculated !== null && calculated>=2 &&
          target===number(row.derived?.target) && riskStop===number(stop.price) &&
          Math.abs(calculated-number(row.derived?.rewardPerRisk))<1e-9) status='ENTRY_READY';
      else {status='WATCH_EARLY';blockers.push('ENTRY_GEOMETRY_UNVERIFIED');}
    }
  }
  return {strategy,status,blockers,watchUntil,revalidatedAt,gates:observed.gates,
    supportiveUnknowns:['FINANCIAL_SOURCE_COMPLETENESS','CHIP_CONCENTRATION_PRESENT','VALUATION_RELATIVE_RISK','FUNDAMENTAL_QUALITY'].filter(id=>observed.gates[id].status==='UNKNOWN'),
    formalSelected:false,buyAuthorized:false,allocation:0,signal:null,researchOnly:true,decisionImpact:false,formalCoreImpact:false};
}
