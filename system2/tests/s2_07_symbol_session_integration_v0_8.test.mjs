import assert from "node:assert/strict";
import {
  evaluateSymbolSessionIntegrationV0_8,
  summarizeSymbolSessionIntegrationV0_8,
} from "../runtime/s2_07_symbol_session_integration_v0_8.mjs";

const sessions=[
  "2026-08-19","2026-08-20","2026-08-21","2026-08-24","2026-08-25",
];
const event={market:"TWSE",symbol:"1563",family:"CAPITAL_REDUCTION",effectiveDate:"2026-08-25"};
const promotion={state:"PROMOTION_EVIDENCE_READY_BOUNDED"};
const interval={
  market:"TWSE",symbol:"1563",suspendedFrom:"2026-08-20",resumedOn:"2026-08-25",
  coverageTo:"2026-08-25",sourceId:"TWSE_TWTAWU",sourceContractId:"D03_TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT_V0_1",
  sourceRowHash:"a".repeat(64),sourceCoverageState:"BOUNDED_OBSERVED",
};

{
  const r=evaluateSymbolSessionIntegrationV0_8({event,promotion,marketSessions:sessions,suspensionIntervals:[interval]});
  assert.equal(r.state,"BOUNDED_SYMBOL_SESSION_EVIDENCE_READY");
  assert.equal(r.boundedSymbolSessionEvidenceReady,true);
  assert.equal(r.resumeDateObserved,true);
  assert.equal(r.effectiveDateIsMarketSession,true);
  assert.deepEqual(r.suspendedMarketSessions,["2026-08-20","2026-08-21","2026-08-24"]);
  assert.deepEqual(r.expectedSymbolSessions,["2026-08-19","2026-08-25"]);
  assert.equal(r.symbolSessionCompletenessCertified,false);
  assert.equal(r.technicalContinuityCertified,false);
  assert.equal(r.noSuspensionMayBeClaimed,false);
}
{
  const r=evaluateSymbolSessionIntegrationV0_8({event,promotion,marketSessions:sessions,suspensionIntervals:[]});
  assert.equal(r.boundedSymbolSessionEvidenceReady,false);
  assert.ok(r.blockers.includes("SUSPENSION_RESUMPTION_MATCH_NOT_OBSERVED"));
  assert.equal(r.noSuspensionMayBeClaimed,false);
}
{
  const r=evaluateSymbolSessionIntegrationV0_8({
    event,promotion,marketSessions:sessions,
    suspensionIntervals:[{...interval,resumedOn:"2026-08-24"}],
  });
  assert.equal(r.boundedSymbolSessionEvidenceReady,false);
  assert.ok(r.blockers.includes("SUSPENSION_RESUMPTION_MATCH_NOT_OBSERVED"));
}
{
  const r=evaluateSymbolSessionIntegrationV0_8({
    event,promotion:{state:"PROMOTION_EVIDENCE_BLOCKED"},marketSessions:sessions,suspensionIntervals:[interval],
  });
  assert.equal(r.boundedSymbolSessionEvidenceReady,false);
  assert.ok(r.blockers.includes("EVENT_LINKAGE_PROMOTION_NOT_READY"));
}
{
  const r=evaluateSymbolSessionIntegrationV0_8({
    event,promotion,marketSessions:sessions.filter(x=>x!=="2026-08-25"),suspensionIntervals:[interval],
  });
  assert.equal(r.boundedSymbolSessionEvidenceReady,false);
  assert.ok(r.blockers.includes("RESUME_MARKET_SESSION_NOT_VERIFIED"));
}
{
  const r=evaluateSymbolSessionIntegrationV0_8({
    event,promotion,marketSessions:sessions,
    suspensionIntervals:[interval,{...interval,sourceRowHash:"b".repeat(64)}],
  });
  assert.equal(r.state,"AMBIGUOUS_SYMBOL_SESSION_EVIDENCE");
  assert.ok(r.blockers.includes("AMBIGUOUS_SUSPENSION_RESUME_MATCH"));
}
{
  const noProv={...interval,sourceRowHash:null,sourceArtifactHash:null};
  const r=evaluateSymbolSessionIntegrationV0_8({event,promotion,marketSessions:sessions,suspensionIntervals:[noProv]});
  assert.ok(r.blockers.includes("SUSPENSION_SOURCE_PROVENANCE_MISSING"));
}
{
  const rows=[
    evaluateSymbolSessionIntegrationV0_8({event,promotion,marketSessions:sessions,suspensionIntervals:[interval]}),
    evaluateSymbolSessionIntegrationV0_8({event,promotion,marketSessions:sessions,suspensionIntervals:[]}),
  ];
  const s=summarizeSymbolSessionIntegrationV0_8(rows);
  assert.equal(s.eventCount,2);
  assert.equal(s.boundedSymbolSessionEvidenceReadyCount,1);
  assert.equal(s.blockedCount,1);
  assert.equal(s.noSuspensionCertifiedCount,0);
  assert.equal(s.symbolSessionCompletenessCertified,false);
  assert.equal(s.technicalContinuityCertified,false);
}
console.log("S2-07 symbol-session integration V0.8 tests PASS");
