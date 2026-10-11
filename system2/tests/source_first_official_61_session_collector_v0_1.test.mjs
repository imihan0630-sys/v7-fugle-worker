import test from 'node:test';
import assert from 'node:assert/strict';
import {captureOfficial61SessionWindowV0_1} from '../runtime/source_first_official_61_session_collector_v0_1.mjs';

test('missing dated provider access fails before source reads',async()=>{
 await assert.rejects(
   ()=>captureOfficial61SessionWindowV0_1({marketDate:'2026-10-12',fetchImpl:null,persistOriginal:null}),
   /ORIGINAL_CAPTURE_IO_REQUIRED/,
 );
});
test('zero or excessive provider request budget rejected',async()=>{
 for(const limit of [0,123]){
  await assert.rejects(
   ()=>captureOfficial61SessionWindowV0_1({marketDate:'2026-10-12',maxRequestCount:limit,persistOriginal:async()=>{},fetchImpl:async()=>{}}),
   /BOUNDED_REQUEST_LIMIT_REQUIRED/,
  );
 }
});
