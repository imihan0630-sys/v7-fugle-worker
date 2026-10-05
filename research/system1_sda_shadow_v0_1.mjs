// Offline Class A diagnostics. No runtime imports, providers, outcomes or Formal writes.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { canonicalJcsJson } from './canonical_receipt_hash_v0_1.mjs';
export const digest = value => createHash('sha256').update('SDA_CLASS_A_V0_1|' + canonicalJcsJson(value)).digest('hex');
export const d03Registry = JSON.parse(readFileSync(new URL('./d03_indicator_lineage_registry_20261005_v0_1.json', import.meta.url)));
const clone = value => JSON.parse(canonicalJcsJson(value));
const nonempty = v => typeof v === 'string' && v.trim().length > 0;
const required = ['factorId','factorVersion','domainId','representationFamily','featureLineageId','redundancyGroupId','independenceStatus','decisionClock','firstObservableAt','provenance','parameterFamilyId'];
const roots = new Set(['PRICE_OHLC','VOLUME_TURNOVER','INSTITUTIONAL_FLOW_OWNERSHIP','INDUSTRY_BREADTH_ROTATION','FUNDAMENTAL_ACCOUNTING','EVENT_DISCLOSURE','VOLATILITY_STATE','DERIVATIVES','MACRO_CROSS_MARKET','MICROSTRUCTURE_LIQUIDITY','CREDIT_CAPITAL_STRUCTURE']);
const statuses = new Set(['UNKNOWN','SAME_ROOT_REDUNDANT','PARTIAL_OVERLAP','RESIDUAL_CANDIDATE','RESIDUAL_INCREMENTAL_PROVEN','INDEPENDENT_SOURCE_PROVEN']);
const key = x => canonicalJcsJson([x.factorId,x.factorVersion]);
const validLineage = x => required.every(k => nonempty(x[k])) && ['sourceFamily','informationRoot','parentFeatureIds'].every(k => Array.isArray(x[k]) && x[k].length && x[k].every(nonempty)) && x.informationRoot.every(r => roots.has(r)) && statuses.has(x.independenceStatus) && x.independenceStatus !== 'UNKNOWN';
export function buildFactorRegistry(registrations) {
  const entries = [], seen = new Map();
  for (const input of registrations) {
    if (!nonempty(input.factorId) || !nonempty(input.factorVersion) || !nonempty(input.experimentVersion) || !input.parameters || typeof input.parameters !== 'object' || Array.isArray(input.parameters)) throw Error('REGISTRATION_ID_VERSION_PARAMETERS_REQUIRED');
    const moduleId = d03Registry.retiredAliases[input.moduleId]?.canonicalOwner ?? input.moduleId;
    const module = d03Registry.modules.find(x => x.factorId === moduleId);
    if (input.moduleId && !module) throw Error('UNKNOWN_D03_MODULE');
    const parent = input.aliasOf ? seen.get(canonicalJcsJson(input.aliasOf)) : null;
    if (input.aliasOf && !parent) throw Error('ALIAS_PARENT_MUST_BE_REGISTERED_FIRST');
    // Alias representation/parameters cannot move ancestry or reset a family budget.
    if (parent && (digest(input.parameters) !== digest(parent.parameters) || input.experimentVersion !== parent.experimentVersion)) throw Error('ALIAS_PARAMETER_OR_EXPERIMENT_DRIFT');
    const lineage = parent?.lineage ?? module ?? input.lineage ?? {};
    const entry = {factorId:input.factorId,factorVersion:input.factorVersion,experimentVersion:input.experimentVersion,parameters:clone(input.parameters),moduleId:parent?.moduleId ?? moduleId ?? null,
      lineage:clone({...lineage,factorId:input.factorId,factorVersion:input.factorVersion}),aliasOf:input.aliasOf ?? null};
    const id = key(entry);
    if (seen.has(id)) {
      if (digest(seen.get(id)) !== digest(entry)) throw Error('IMMUTABLE_FACTOR_VERSION_CONFLICT');
      continue;
    }
    seen.set(id,entry); entries.push(entry);
  }
  const body = {schemaVersion:'SDA_FACTOR_REGISTRY_V0_1',canonicalD03Digest:digest(d03Registry),entries};
  return {...body,registryDigest:digest(body)};
}
function verifyRegistry(registry) {
  const {registryDigest,...body} = registry;
  if (registryDigest !== digest(body) || body.schemaVersion !== 'SDA_FACTOR_REGISTRY_V0_1' || body.canonicalD03Digest !== digest(d03Registry)) throw Error('REGISTRY_INTEGRITY');
  // Rebuild pinned D03 lineage; caller-supplied proof labels never enable promotion.
  const rebuilt = buildFactorRegistry(body.entries.map(e => ({...e,lineage:e.lineage})));
  if (rebuilt.registryDigest !== registryDigest) throw Error('REGISTRY_MAPPING_DRIFT');
}
export function extendFactorRegistry(previous, expectedDigest, registrations) {
  verifyRegistry(previous);
  if (previous.registryDigest !== expectedDigest) throw Error('REGISTRY_EXPECTED_HEAD_MISMATCH');
  return buildFactorRegistry([...previous.entries,...registrations]);
}
export function freezeFactorExperiment(registry, references, spec) {
  verifyRegistry(registry);
  if (!Array.isArray(references) || !references.length) throw Error('FROZEN_FACTORS_REQUIRED');
  const entries=references.map(ref=>registry.entries.find(e=>key(e)===canonicalJcsJson(ref)));
  if (entries.some(e=>!e || !validLineage(e.lineage))) throw Error('UNREGISTERED_EXPERIMENT_FACTOR');
  const families=[...new Set(entries.map(e=>e.lineage.parameterFamilyId))];
  if (families.length!==1) throw Error('CROSS_FAMILY_EXPERIMENT_REQUIRES_D16_CONTRACT');
  if (spec.parameterFamilyId && spec.parameterFamilyId!==families[0]) throw Error('PARAMETER_FAMILY_RESET_FORBIDDEN');
  return {...clone(spec),parameterFamilyId:families[0],factorRegistryDigest:registry.registryDigest,
    frozenCandidateSet:entries.map(e=>({factorId:e.factorId,factorVersion:e.factorVersion,experimentVersion:e.experimentVersion,parameters:e.parameters}))};
}
export function diagnoseSignals(signals, registry, decisionAt) {
  verifyRegistry(registry);
  const decision = Date.parse(decisionAt);
  if (typeof decisionAt !== 'string' || !/(Z|[+-]\d\d:\d\d)$/.test(decisionAt) || !Number.isFinite(decision)) throw Error('DECISION_CLOCK_REQUIRED');
  const byId = new Map(registry.entries.map(e => [key(e),e]));
  const active = [], invalid = [], lineageTable = [];
  signals.forEach((signal,index) => {
    const entry = byId.get(key(signal));
    const clock = Date.parse(signal.firstObservableAt);
    const reason = !entry || !validLineage(entry.lineage) ? 'UNKNOWN_LINEAGE' :
      typeof signal.firstObservableAt !== 'string' || !/(Z|[+-]\d\d:\d\d)$/.test(signal.firstObservableAt) || !Number.isFinite(clock) || clock > decision ? 'PIT_CLOCK_INVALID' :
      typeof signal.active !== 'boolean' ? 'SIGNAL_STATE_UNKNOWN' :
      entry.lineage.votingEligibility === 'NOT_A_CONTEMPORANEOUS_VOTE' ? 'OUTCOME_NOT_A_VOTE' : null;
    lineageTable.push({signalIndex:index,factorId:signal.factorId,factorVersion:signal.factorVersion,lineage:entry?.lineage ?? null,status:reason ?? 'KNOWN_WITHIN_FAMILY_ONLY'});
    if (reason) { invalid.push({signalIndex:index,reason}); return; }
    if (signal.active) active.push({signalIndex:index,entry});
  });
  // Connected components make same-root siblings, parent/child and mixed-root overlap transitive.
  const parent = active.map((_,i) => i);
  const find = i => parent[i] === i ? i : (parent[i] = find(parent[i]));
  const overlapMatrix = [];
  for (let i=0;i<active.length;i++) for (let j=i+1;j<active.length;j++) {
    const a=active[i].entry.lineage,b=active[j].entry.lineage;
    const sharedRoots=a.informationRoot.filter(r => b.informationRoot.includes(r));
    const overlap=sharedRoots.length > 0 || a.redundancyGroupId === b.redundancyGroupId || a.parentFeatureIds.includes(b.factorId) || b.parentFeatureIds.includes(a.factorId);
    if (overlap) parent[find(j)]=find(i);
    overlapMatrix.push({left:active[i].signalIndex,right:active[j].signalIndex,sharedRoots,overlap});
  }
  const groups = new Map();
  active.forEach((x,i) => { const id=find(i); if (!groups.has(id)) groups.set(id,[]); groups.get(id).push(x); });
  const contributions = [...groups.values()].map(g => ({factorIds:[...new Set(g.map(x=>x.entry.factorId))].sort(),informationRoots:[...new Set(g.flatMap(x=>x.entry.lineage.informationRoot))].sort(),redundancyGroupIds:[...new Set(g.map(x=>x.entry.lineage.redundancyGroupId))].sort(),contribution:1}));
  return {status:invalid.length ? 'INCOMPLETE' : 'COMPLETE',rawSignalCount:signals.filter(s=>s.active === true).length,
    rawScore:signals.filter(s=>s.active === true).length,dedupedEvidenceFamilyCount:groups.size,dedupedShadowScore:groups.size,
    effectiveIndependentEvidenceCount:0,independentEvidenceStatus:'NOT_PROVEN_NO_PROMOTION_PATH',invalid,lineageTable,overlapMatrix,contributions,
    overlappingSignalIds:[...new Set(overlapMatrix.filter(x=>x.overlap).flatMap(x=>[x.left,x.right]))],
    scoringPolicy:'BINARY_ACTIVE_CONNECTED_ROOT_FAMILY_V0_1',researchOnly:true,decisionImpact:false};
}
export function buildShadowDiagnostic(input) {
  const {generationId,decisionAt,sourceReceiptDigest,registry,candidates,formalSelectedSymbols} = input;
  if (!nonempty(generationId) || !/^[a-f0-9]{64}$/.test(sourceReceiptDigest) || !Array.isArray(candidates) || !Array.isArray(formalSelectedSymbols)) throw Error('IMMUTABLE_PARENT_REFERENCE_REQUIRED');
  if (new Set(candidates.map(x=>x.symbol)).size !== candidates.length) throw Error('DUPLICATE_SYMBOL');
  const rows = candidates.map((c,ordinal) => {
    if (!nonempty(c.symbol) || !Number.isFinite(c.officialClose) || c.officialClose <= 0 || typeof c.formalEligible !== 'boolean' || !Array.isArray(c.signals)) throw Error('CANDIDATE_IDENTITY_OR_ELIGIBILITY_REQUIRED');
    return {symbol:c.symbol,pool:c.officialClose >= 1000 ? 'THOUSAND':'GENERAL',ordinal,formalEligible:c.formalEligible,...diagnoseSignals(c.signals,registry,decisionAt)};
  });
  if (new Set(formalSelectedSymbols).size !== formalSelectedSymbols.length || formalSelectedSymbols.some(s=>!rows.find(r=>r.symbol===s && r.formalEligible))) throw Error('FORMAL_REFERENCE_INVALID');
  for (const pool of ['GENERAL','THOUSAND']) if (formalSelectedSymbols.filter(s=>rows.find(r=>r.symbol===s).pool===pool).length>3) throw Error('FORMAL_POOL_QUOTA_INVALID');
  const complete=rows.filter(r=>r.formalEligible).every(r=>r.status==='COMPLETE');
  const rank = metric => ['GENERAL','THOUSAND'].flatMap(pool=>rows.filter(r=>r.formalEligible && r.pool===pool).sort((a,b)=>b[metric]-a[metric] || a.ordinal-b.ordinal));
  const top = ranked => ['GENERAL','THOUSAND'].flatMap(pool=>ranked.filter(r=>r.pool===pool).slice(0,3).map(r=>r.symbol));
  const raw=complete?rank('rawScore'):[],dedup=complete?rank('dedupedShadowScore'):[];
  const body={schemaVersion:'SYSTEM1_SDA_SHADOW_DIAGNOSTIC_V0_1',generationId,decisionAt,sourceReceiptDigest,registryDigest:registry.registryDigest,inputDigest:digest(input),researchOnly:true,decisionImpact:false,
    status:complete?'COMPLETE':'INCOMPLETE',rows,formalSelectedSymbols:[...formalSelectedSymbols],
    rawVoteShadowTop6:complete?top(raw):null,dedupShadowTop6:complete?top(dedup):null,
    formalVsDedupTop6Overlap:complete?formalSelectedSymbols.filter(s=>top(dedup).includes(s)).length:null,
    rankSensitivity:complete?rows.filter(r=>r.formalEligible).map(r=>({symbol:r.symbol,pool:r.pool,rawPoolRank:raw.filter(x=>x.pool===r.pool).findIndex(x=>x.symbol===r.symbol)+1,dedupPoolRank:dedup.filter(x=>x.pool===r.pool).findIndex(x=>x.symbol===r.symbol)+1})):null,
    parentIntegrity:'REFERENCE_ONLY_REQUIRES_VERIFIED_C1_INPUT',economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE'};
  return {...body,receiptDigest:digest(body)};
}
