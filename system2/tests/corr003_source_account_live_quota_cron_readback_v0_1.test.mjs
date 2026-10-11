import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const e=JSON.parse(readFileSync(new URL('../evidence/S2_CORR003_SOURCE_ACCOUNT_LIVE_QUOTA_CRON_READBACK_20261011_V0_1.json',import.meta.url),'utf8'));
const p=JSON.parse(readFileSync(new URL('../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json',import.meta.url),'utf8'));
const q=JSON.parse(readFileSync(new URL('../SYSTEM2_CORRECTION_QUEUE.json',import.meta.url),'utf8')).directives.find(z=>z.directiveId==='S2-CORR-20261007-003');
function validate(v){
 assert.equal(v.directive,'S2-CORR-20261007-003');
 assert.equal(v.originalNativeProvider.runId,38139695092);
 assert.equal(v.originalNativeProvider.artifactId,11702835097);
 assert.equal(v.originalNativeProvider.artifactZipSha256,'1af850950342a94e311464e6a279486e1d83e10fd07c4dbad9fe87707f6f5e90');
 assert.equal(v.originalNativeProvider.innerSha256,'8c447c3b3f026e9b4bcc5d43bf9af81ab23b76aa0428578134d46c5bb48a3c7d');
 assert.equal(v.originalNativeProvider.verifiedD1SQLByProbe,0);
 assert.equal(v.sourceAccountProviderResponse.sourceD1List.count,2);
 assert.deepEqual(v.sourceAccountProviderResponse.sourceS2WorkerCronGet.cron,['*/5 0-5,11 * * MON-FRI']);
 assert.equal(v.sourceAccountProviderResponse.sourceS2WorkerCronGet.invocationObserved,false);
 assert.equal(v.sourceAccountProviderResponse.sourceV8WorkerCronGet.crons.length,4);
 const g=v.sourceAccountProviderResponse.cloudflareGraphql;
 assert.equal(g.successful,true); assert.equal(g.groupsComplete,true); assert.equal(g.groupCount,2);
 assert.equal(g.lowerBoundRowsRead,180455); assert.equal(g.lowerBoundRowsWritten,0);
 assert.equal(g.perDatabase.reduce((a,z)=>a+z.lowerBoundRowsRead,0),g.lowerBoundRowsRead);
 assert.equal(g.perDatabase.find(z=>z.role==='SYSTEM1_V8').lowerBoundRowsRead,180454);
 assert.equal(g.perDatabase.find(z=>z.role==='SOURCE_SYSTEM2').lowerBoundRowsRead,1);
 assert.equal(g.providerAnalyticsRealtimeFreshnessGuaranteed,false);
 assert.equal(g.providerLagUpperBoundMinutes,null);
 assert.equal(v.earlierG5SameDayRealLowerBound.newlyObservedReadLowerBoundIncrease,102258);
 assert.equal(v.resourcePlan.trueRemainingRowsWritten,null);
 assert.equal(v.resourcePlan.trueRemainingRowsRead,null);
 assert.equal(v.resourcePlan.sourceS2CronQuiesced,false);
 assert.equal(v.resourcePlan.sourceResonanceAutoRedeployReactivationRisk,true);
 assert.equal(v.resourcePlan.accountWideWriterQuiescence,'UNPROVEN');
 assert.equal(v.resourcePlan.system1WriteReserveAuthorized,false);
 assert.equal(v.resourcePlan.system1ReadReserveAuthorized,false);
 assert.equal(v.resourcePlan.system1AuthorizedWriteReserveRows,null);
 assert.equal(v.resourcePlan.system1AuthorizedReadReserveRows,null);
 assert.equal(v.resourcePlan.dataExportSourceD1Grant,false);
 assert.equal(v.resourcePlan.readOnlyD1BudgetEvidenceDeferActive,true);
 assert.equal(v.g6RiskAndAuthorization.specificOwnerApprovalForSourceCronOnlyPause,'NOT_EVIDENCED');
 assert.equal(v.g6RiskAndAuthorization.sourceCronPausePerformed,false);
 assert.equal(v.corr003.independentlyQualifiedPhysical,0);
 assert.equal(v.corr003.supportDocumented,15);
 assert.equal(v.corr003.totalSupportChecks,38);
 assert.equal(v.corr003.status,'HIGH_VERIFYING');
 assert.equal(v.noAutoRelease,true);
}
validate(e);
for(const f of [
 v=>v.resourcePlan.trueRemainingRowsRead=4819545,
 v=>v.resourcePlan.system1WriteReserveAuthorized=true,
 v=>v.resourcePlan.system1ReadReserveAuthorized=true,
 v=>v.resourcePlan.sourceS2CronQuiesced=true,
 v=>v.resourcePlan.dataExportSourceD1Grant=true,
 v=>v.sourceAccountProviderResponse.cloudflareGraphql.providerAnalyticsRealtimeFreshnessGuaranteed=true,
 v=>v.g6RiskAndAuthorization.sourceCronPausePerformed=true,
 v=>v.corr003.independentlyQualifiedPhysical=1,
 v=>v.sourceAccountProviderResponse.sourceS2WorkerCronGet.cron=[],
 v=>v.sourceAccountProviderResponse.cloudflareGraphql.lowerBoundRowsRead=0
]){const fake=structuredClone(e);f(fake);assert.throws(()=>validate(fake));}
assert.equal(p.reserveNumberAuthorized,false);assert.equal(p.readReserveNumberAuthorized,false);
assert.equal(p.authorizedReserveRows,null);assert.equal(p.authorizedReadReserveRows,null);
assert.equal(q.status,'VERIFYING');assert.equal(q.severity,'HIGH');
console.log('CORR003_LIVE_SOURCE_ACCOUNT_PROVIDER_READBACK_PROVEN_NO_RELEASE_TEN_NEGATIVE_PASS');
