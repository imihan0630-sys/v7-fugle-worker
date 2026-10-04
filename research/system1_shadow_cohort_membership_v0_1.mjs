import {canonicalJcsJson,sha256HexUtf8} from './canonical_receipt_hash_v0_1.mjs';
import {classifyShadowSemanticPopulation,sampleMembershipV2} from './shadow_semantic_classifier_v0_1.mjs';

export const SHADOW_MEMBERSHIP_VERSION='SYSTEM1_SHADOW_COHORT_MEMBERSHIP_V0_1';
export const SHADOW_CAPTURE_VERSION='SYSTEM1_SHADOW_COHORT_CAPTURE_V0_1';
export const SHADOW_COMPARATOR='PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30';
export const SHADOW_RANK_FIELDS=Object.freeze(['priorityScore','rewardPerRisk','marketConsensusScore','setupQuality','sectorFlow','relativeStrength']);
export const SHADOW_QUALITY_STATES=Object.freeze(['VALID','COHORT_SEMANTIC_CONTAMINATION','SOURCE_QUALITY_BLOCKED','PROVENANCE_CONFLICT','UNKNOWN']);
export const LIQUIDITY_REASONS=Object.freeze({
 '20日流動性不足':'LIQ_LOW_AVG_VOLUME_REJECTED',
 '10至30億市值缺少強力特殊理由':'LIQ_SMALLCAP_SPECIAL_REASON_REJECTED',
 '30至100億市值流動性要求未達':'LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED'
});
export const shadowHash=value=>sha256HexUtf8('SYSTEM1_SHADOW_V0_1|'+canonicalJcsJson(value));
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const num=x=>finite(x)?x:null;
const pools=['GENERAL','THOUSAND'];
const safety={researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
export function shadowAssert(ok,code){if(!ok)throw new Error('SHADOW_COHORT_'+code);}

// Capture only the actual applyMarketConsensus result; never call a partial scorer.
export function captureShadowFormalRanking(result,preSortOrdinal){
 if(result?.ok!==true)return null;
 const ranking=Object.fromEntries(SHADOW_RANK_FIELDS.map(k=>[k,num(result[k])]));
 return {...ranking,marketConsensusSources:num(result.marketConsensusSources),marketConsensusBonus:num(result.marketConsensusBonus),
   preSortOrdinal:Number.isInteger(preSortOrdinal)?preSortOrdinal:null};
}
function setupStratum(raw){
 const setup=raw.membershipSetup;
 const keys=channel=>Object.keys(setup?.[channel]||{}).sort();
 if(!setup||['A','B'].some(c=>keys(c).length!==6||keys(c).some(k=>typeof setup[c][k]!=='boolean')))
   return {nearestChannel:'UNKNOWN',checkPattern:'UNKNOWN'};
 const failed=c=>keys(c).filter(k=>setup[c][k]===false);
 const a=failed('A'),b=failed('B');
 return {nearestChannel:a.length===b.length?'A_B_TIE':a.length<b.length?'A':'B',checkPattern:'A:'+a.join(',')+';B:'+b.join(',')};
}
function liquidityContext(raw){
 const f=raw.feature||{},minLots=f.close>=1000?300:1000;
 const amount=num(f.avgAmount20),spread=num(f.spreadPercent),depth=num(f.depthScore);
 const depthBool=typeof f.orderBookDepthGood==='boolean'?f.orderBookDepthGood:null;
 const covered=[amount!==null,spread!==null,depthBool!==null||depth!==null];
 const complete=covered.every(Boolean),known=covered.some(Boolean);
 return {minLots,avgVolume20Lots:num(f.avgVolume20Lots),volumeThresholdRatio:finite(f.avgVolume20Lots)?f.avgVolume20Lots/minLots:null,
  avgAmount20:amount,spreadPercent:spread,orderBookDepthGood:depthBool,depthScore:depth,
  exceptionInputCoverageState:complete?'COMPLETE':known?'PARTIAL':'ABSENT',exceptionSourceProvenance:'UNKNOWN',
  liquidityExceptionPass:complete?amount>=50000000&&spread<=.5&&(depthBool===true||(depth!==null&&depth>=80)):null,
  fullFormalCounterfactual:false};
}
export async function buildShadowCohort(receipt,{capPerStratum=6,broadCap=6}={}){
 const rows=receipt?.rows;
 shadowAssert(receipt?.shadowMembershipCapture?.schemaVersion===SHADOW_CAPTURE_VERSION,'CAPTURE_REQUIRED_NO_BACKFILL');
 shadowAssert(receipt.shadowMembershipCapture.rankComparatorVersion===SHADOW_COMPARATOR&&receipt.shadowMembershipCapture.providerCallDelta===0,'COMPARATOR');
 shadowAssert(receipt.readbackVerified===true&&/^[0-9a-f]{40}$/i.test(receipt.sourceMainSha||''),'VERIFIED_PARENT_REQUIRED');
 shadowAssert(receipt.researchOnly===true&&receipt.decisionImpact===false&&receipt.formalCoreImpact===false,'FIREWALL');
 shadowAssert(/^\d{4}-\d{2}-\d{2}$/.test(receipt.sessionDate)&&receipt.generationId&&Number.isFinite(Date.parse(receipt.decisionAt)),'IDENTITY');
 shadowAssert(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(receipt.decisionAt))===receipt.sessionDate,'PIT_SESSION');
 shadowAssert(Array.isArray(rows)&&rows.length>0&&rows.length<=6000&&rows.length===receipt.populationN,'POPULATION');
 shadowAssert(Number.isInteger(capPerStratum)&&capPerStratum>=1&&capPerStratum<=6&&Number.isInteger(broadCap)&&broadCap>=1&&broadCap<=6,'SAMPLE_CAP');
 shadowAssert(new Set(rows.map(r=>r.symbol)).size===rows.length,'DUPLICATE_SYMBOL');
 const contentDigest=await sha256HexUtf8(JSON.stringify(rows));
 shadowAssert(contentDigest===receipt.contentDigest,'PARENT_DIGEST');
 const states=rows.map(raw=>{
   const f=raw.feature||{},r=raw.formalResult||{},reason=r.ok===false?r.firstFailure:null;
   shadowAssert(typeof raw.symbol==='string'&&raw.symbol&&pools.includes(raw.pricePool)&&finite(f.close)&&f.close>=10&&
     raw.pricePool===(f.close>=1000?'THOUSAND':'GENERAL'),'POOL_IDENTITY');
   if(r.ok===true)shadowAssert(r.actualRankingTuple&&SHADOW_RANK_FIELDS.every(k=>finite(r.actualRankingTuple[k]))&&
      Number.isInteger(r.actualRankingTuple.preSortOrdinal)&&r.actualRankingTuple.preSortOrdinal>=0,'QUALIFIED_ACTUAL_TUPLE_REQUIRED');
   const liq=liquidityContext(raw);
   return {symbol:raw.symbol,pool:raw.pricePool,formalOk:r.ok===true,selected:r.selected===true,basePassed:r.basePassed===true,
     firstFailure:reason||null,channelNearMiss:typeof reason==='string'&&reason.includes('A拉回承接/B突破後承接'),
     broadFrameEligible:raw.derived!=null&&finite(f.historyDays)&&f.historyDays>=60&&finite(f.avgVolume20Lots)&&f.avgVolume20Lots>=liq.minLots,
     ranking:r.actualRankingTuple||null,...setupStratum(raw),liquidity:liq,raw};
 });
 // Reuse the proven semantic classifier. Its prototype rank is intentionally NOT persisted:
 // qualified-list/cutline ownership stays PVE-156; the actual runtime tuple stays in C1.
 const population=classifyShadowSemanticPopulation({scanDate:receipt.sessionDate,decisionStates:states});
 const firstFailureCounts={},frameCounts=[],sampled=[],focalSymbols=new Set();
 const reasons=[...new Set(states.map(r=>r.firstFailure).filter(Boolean))].sort();
 for(const pool of pools)for(const reason of reasons)firstFailureCounts[pool+'|'+reason]=states.filter(r=>r.pool===pool&&r.firstFailure===reason).length;
 const addFrame=(type,eligible,{reason=null,cap=capPerStratum,near=false}={})=>{
   const local={scanDate:receipt.sessionDate,rows:eligible.map(r=>({...r,memberships:[type]}))};
   const sample=sampleMembershipV2(local,near?'CHANNEL_NEAR_MISS':type,{capPerStratum:cap,
     stratumKeys:near?['pool','nearestChannel','checkPattern']:['pool'],
     samplingRuleVersion:SHADOW_MEMBERSHIP_VERSION+'|'+type+'|'+(reason||'')});
   for(const stratum of sample.strata)frameCounts.push({membershipType:type,reason,...stratum});
   for(const [i,row] of sample.rows.entries())sampled.push({row,type,reason,meta:row.sampleMembershipMeta,rank:i+1});
 };
 const focal=state=>state.formalOk||state.channelNearMiss||state.basePassed||Object.hasOwn(LIQUIDITY_REASONS,state.firstFailure);
 for(const row of states)if(focal(row))focalSymbols.add(row.symbol);
 addFrame('SELECTED',population.rows.filter(r=>r.memberships.includes('FORMAL_SELECTED')),{cap:3});
 addFrame('QUALIFIED_NOT_SELECTED',population.rows.filter(r=>r.memberships.includes('FORMAL_QUALIFIED_NOT_SELECTED')));
 for(const reason of reasons){
   const rejected=states.filter(r=>r.firstFailure===reason);
   addFrame('FIRST_FAILURE',rejected,{reason});
   if(Object.hasOwn(LIQUIDITY_REASONS,reason))addFrame(LIQUIDITY_REASONS[reason],rejected,{reason});
 }
 const near=states.filter(r=>r.channelNearMiss).map(r=>({...r,memberships:['CHANNEL_NEAR_MISS']}));
 // Use the frozen sampler's required pool x channel x check-pattern stratification.
 const nearSample=sampleMembershipV2({scanDate:receipt.sessionDate,rows:near},'CHANNEL_NEAR_MISS',
   {capPerStratum,stratumKeys:['pool','nearestChannel','checkPattern'],samplingRuleVersion:SHADOW_MEMBERSHIP_VERSION});
 for(const stratum of nearSample.strata)frameCounts.push({membershipType:'CHANNEL_NEAR_MISS',reason:null,...stratum});
 for(const [i,row] of nearSample.rows.entries())sampled.push({row,type:'CHANNEL_NEAR_MISS',reason:null,meta:row.sampleMembershipMeta,rank:i+1});
 addFrame('LIQ_LOW_VOLUME_EXCEPTION_PASS',states.filter(r=>finite(r.raw.feature?.avgVolume20Lots)&&
   r.raw.feature.avgVolume20Lots<r.liquidity.minLots&&r.liquidity.liquidityExceptionPass===true));
 const broad=states.filter(r=>r.broadFrameEligible);
 addFrame('INDEPENDENT_BROAD_MARKET_CONTROL',broad,{cap:broadCap});
 addFrame('RESIDUAL_CONTROL',broad.filter(r=>!focalSymbols.has(r.symbol)),{cap:broadCap});
 shadowAssert(sampled.length<=600,'MEMBERSHIP_BUDGET');
 const parentHashes=new Map();
 for(const {row} of sampled)if(!parentHashes.has(row.symbol))parentHashes.set(row.symbol,await shadowHash(row.raw));
 const memberships=[];
 for(const {row,type,reason,meta,rank} of sampled){
   const r=row.raw.formalResult;
   const formalState=row.raw.derived==null?'UNKNOWN':r.selected===true?'SELECTED':r.ok===true?'QUALIFIED_NOT_SELECTED':
     r.ok===false?(r.basePassed===true?'FIRST_FAILURE_BASE_TRUE':'FIRST_FAILURE_BASE_FALSE'):'UNKNOWN';
   const m={schemaVersion:SHADOW_MEMBERSHIP_VERSION,scanDate:receipt.sessionDate,captureGeneration:receipt.generationId,
     symbol:row.symbol,pool:row.pool,canonicalMarket:['TWSE','TPEX'].includes(row.raw.market)?row.raw.market:'UNKNOWN',
     formalState,firstFailureReason:row.firstFailure,membershipType:type,membershipRank:rank,
     samplingFrameId:[type,reason||'',meta.stratum].join('|'),samplingRuleVersion:meta.samplingRuleVersion,
     samplingFraction:meta.samplingFraction,frameCount:meta.semanticPopulationCount,sampleCount:meta.sampledCount,
     parentSnapshotHash:parentHashes.get(row.symbol),parentContentDigest:contentDigest,
     knownAt:receipt.decisionAt,knownAtSemantics:'REQUEST_LOCAL_KNOWN_BY_DECISION_AT_UPPER_BOUND',
     outcomeSelected:false,actualFormalRank:false,sourceQualityState:'UNKNOWN',
     liquidity:row.liquidity,liquidityContextParentField:row.raw.membershipLiquidity?'membershipLiquidity':null,fullFormalCounterfactual:false,...safety};
   memberships.push({...m,semanticFingerprint:await shadowHash(m)});
 }
 memberships.sort((a,b)=>a.symbol.localeCompare(b.symbol)||a.membershipType.localeCompare(b.membershipType));
 shadowAssert(new Set(memberships.map(m=>m.symbol+'|'+m.membershipType)).size===memberships.length,'DUPLICATE_MEMBERSHIP');
 const expectedCounts={},overlap={};
 for(const m of memberships){const key=m.pool+'|'+m.membershipType;expectedCounts[key]=(expectedCounts[key]||0)+1;}
 for(const symbol of new Set(memberships.map(m=>m.symbol))){
   const types=memberships.filter(m=>m.symbol===symbol).map(m=>m.membershipType);
   for(const a of types)for(const b of types)overlap[a+'|'+b]=(overlap[a+'|'+b]||0)+1;
 }
 const parent={schemaVersion:SHADOW_MEMBERSHIP_VERSION,scanDate:receipt.sessionDate,captureGeneration:receipt.generationId,
   decisionAt:receipt.decisionAt,parentContentDigest:contentDigest,parentUniverseDigest:receipt.universeDigest,
   runtimeVersion:receipt.effectiveRuntimeVersion,sourceMainSha:receipt.sourceMainSha,rankComparatorVersion:SHADOW_COMPARATOR,
   populationN:rows.length,poolCounts:Object.fromEntries(pools.map(p=>[p,states.filter(r=>r.pool===p).length])),
   firstFailureCounts,firstFailureSemantics:'DESCRIPTIVE_ORDERED_FIRST_FAILURE_NOT_MARGINAL_GATE_EFFECT',
   sampling:{capPerStratum,broadCap,ruleVersion:SHADOW_MEMBERSHIP_VERSION,outcomeBlind:true},frameCounts,expectedCounts,
   membershipN:memberships.length,membershipDigest:await shadowHash(memberships),membershipOverlap:overlap,
   broadFrameDefinition:'FEATURE_ADMITTED_HISTORY_GTE60_CLOSE_GTE10_VOLUME_GTE_POOL_MINLOTS_BEFORE_FOCAL_CAPS',
   residualFocalDefinition:'FULL_QUALIFIED_OR_SETUP_FIRST_FAILURE_OR_BASE_PASSED_OR_THREE_LIQUIDITY_REJECTION_POPULATIONS',
   residualExcludedN:broad.filter(r=>focalSymbols.has(r.symbol)).length,
   gateEvidenceSource:'EXISTING_C1_INDEPENDENT_OBSERVER_ON_EXACT_IMMUTABLE_PARENT_INPUTS',
   qualityState:'UNKNOWN',legacyArchive:'LEGACY_MUTABLE_ARCHIVE_UNCHANGED',
   economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',...safety};
 return {parent:{...parent,semanticFingerprint:await shadowHash(parent)},memberships};
}
