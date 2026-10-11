// DATA_LANE 2026-10-12 zero-Cloudflare negative tests. The independent
// authenticated main-once Action is the ONLY provider test, never these mocks.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {destinationDay80ReadOnly} from '../migration/destination_day80_readonly_cloudflare_preflight_20261012.mjs';
let fetches=0;const rejectFetch=()=>{fetches++;throw Error('FORBIDDEN_NETWORK_CALL')};
for(const a of [{},{accountId:'00',token:'xx'},{accountId:'0'.repeat(32),token:'xx'},{accountId:'0'.repeat(32),token:null}]){
 await assert.rejects(()=>destinationDay80ReadOnly({...a,request:rejectFetch}),/DAY80_DEST_READONLY_ACCOUNT_OR_AUTH_UNVERIFIED/);
}
assert.equal(fetches,0,'bad identity must never execute any cloud request');
const s=readFileSync('system2/migration/destination_day80_readonly_cloudflare_preflight_20261012.mjs','utf8');
assert(s.includes('destinationAlreadyImportedRowsIn14OriginalTables'));
assert(s.includes('accountRowsWrittenSpendableHeadroom:null'));
assert(s.includes('permissionToImport:false'));
assert(s.includes('providerGuaranteedFreshUsage:false'));
assert(s.includes('analyticsLagBounded:false'));
assert(s.includes('BLOCKED_UNBOUNDED_GRAPHQL_LAG_AND_INDEPENDENT_AUDIT'));
assert(s.includes('get("/d1/database?per_page=100")'));
assert(s.includes('graphql'));
assert(!s.includes('CREATE INDEX '));
assert(!s.includes('INSERT INTO '));
assert(!s.includes('DROP TABLE '));
console.log('DAY80_DESTINATION_GUARDED_READONLY_ZERO_NETWORK_NEGATIVES_PASS');
