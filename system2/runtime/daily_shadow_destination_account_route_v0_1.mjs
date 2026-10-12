// Explicitly route only the authorized destination System2 daily Shadow writer.
// Does not release the old source-account System2 writer quarantine.
// Identity verification happens BEFORE any Cloudflare metadata, SQL or Analytics call.
import {createHash} from 'node:crypto';
const DEST_ACCOUNT_SHA='27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55';
const DEST_D1_SHA='95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9';
export const DESTINATION_DAILY_SHADOW_ENVIRONMENT='system2-schema-only';
const digest=x=>createHash('sha256').update(String(x).toLowerCase()).digest('hex');

export function resolveDailyShadowAccountRouteV0_1({
 writerId,role,githubEnvironment,accountId,dbToken,analyticsToken,
 legacyAccountId,legacyDbToken,legacyAnalyticsToken,
}={}){
 if(writerId!=='DAILY_SHADOW_DIAGNOSTIC')throw Error('S2_DEST_ROUTE_WRITER_NOT_REGISTERED');
 if(role!=='DESTINATION')throw Error('S2_DEST_ROUTE_EXPLICIT_DESTINATION_REQUIRED');
 if(githubEnvironment!==DESTINATION_DAILY_SHADOW_ENVIRONMENT)
  throw Error('S2_DEST_ROUTE_ENVIRONMENT_MISMATCH');
 if(!/^[0-9a-f]{32}$/i.test(accountId||'')||digest(accountId)!==DEST_ACCOUNT_SHA)
  throw Error('S2_DEST_ROUTE_ACCOUNT_FINGERPRINT_MISMATCH');
 if(!dbToken||!analyticsToken)throw Error('S2_DEST_ROUTE_NEW_D1_AND_ANALYTICS_TOKENS_REQUIRED');
 if(legacyAccountId||legacyDbToken||legacyAnalyticsToken)
  throw Error('S2_DEST_ROUTE_LEGACY_SOURCE_CREDENTIALS_FORBIDDEN');
 return Object.freeze({
  role:'DESTINATION',writerId,
  accountFingerprint:DEST_ACCOUNT_SHA,
  destinationEnvironmentVerified:true,
  legacySourceQuarantineStillRequired:true,
  v8ReserveApplicable:false,
  cloudflareMutationAllowedByRouteOnly:false,
  accountId,dbToken,analyticsToken,
 });
}

export function assertDailyShadowDestinationDatabaseIdentityV0_1(db){
 if(db?.database?.name!=='system2-research' ||
    typeof db?.database?.uuidDigestInput!=='string' ||
    digest(db.database.uuidDigestInput)!==DEST_D1_SHA)
  throw Error('S2_DEST_ROUTE_DATABASE_FINGERPRINT_MISMATCH');
 return Object.freeze({databaseName:'system2-research',
    destinationDatabaseFingerprint:DEST_D1_SHA,verified:true});
}
