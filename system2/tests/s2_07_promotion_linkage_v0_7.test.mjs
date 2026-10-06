import assert from "node:assert/strict";
import {
  evaluatePromotionLinkageV0_7,
  summarizePromotionLinkageV0_7,
} from "../runtime/s2_07_promotion_linkage_v0_7.mjs";

const base={
  eventKey:"TPEX_CAPITAL_REDUCTION_REFERENCE|4806|2026-10-02|S2-CA-EVENT:"+"a".repeat(64),
  sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE",
  symbol:"4806",
  family:"CAPITAL_REDUCTION",
  effectiveDate:"2026-10-02",
  officialSubtypeSemantic:"LOSS_OFFSET",
  officialDetailDateTokens:["2026-09-23","2026-10-02"],
  actionFamilyQueryIntegrityExact:true,
  eventSpecificAnchorCandidate:true,
  semanticSeedVersionKey:"2026-02-24|10:00:00|1",
  semanticSeedDate:"2026-02-24",
  semanticAlignedRowCount:3,
  semanticAlignedVersionKeys:[
    "2026-02-24|10:00:00|1",
    "2026-05-29|10:00:00|1",
    "2026-09-07|10:00:00|1",
  ],
  correctionObserved:true,
  correctionObservedVersionKeys:["2026-09-07|10:00:00|1"],
  cancellationObserved:false,
  transportReady:true,
  noPaginationHint:true,
};

{
  const r=evaluatePromotionLinkageV0_7(base);
  assert.equal(r.state,"PROMOTION_EVIDENCE_READY_BOUNDED");
  assert.equal(r.promotionEvidenceReady,true);
  assert.equal(r.promotionLinkageEstablished,true);
  assert.equal(r.noCancellationMayBeClaimed,false);
  assert.equal(r.cancellationHistoryComplete,false);
  assert.equal(r.tradingAuthority,false);
}
{
  const r=evaluatePromotionLinkageV0_7({...base,actionFamilyQueryIntegrityExact:false,eventSpecificAnchorCandidate:false});
  assert.equal(r.promotionEvidenceReady,false);
  assert.ok(r.blockers.includes("SOURCE_QUERY_INTEGRITY_NOT_EXACT"));
  assert.ok(r.blockers.includes("EVENT_SPECIFIC_ANCHOR_NOT_ESTABLISHED"));
}
{
  const r=evaluatePromotionLinkageV0_7({...base,cancellationObserved:true});
  assert.equal(r.promotionEvidenceReady,false);
  assert.equal(r.cancellationState,"CANCELLATION_DISCLOSURE_OBSERVED");
  assert.ok(r.blockers.includes("CANCELLATION_DISCLOSURE_OBSERVED"));
}
{
  const r=evaluatePromotionLinkageV0_7({...base,correctionObservedVersionKeys:["2026-09-30|10:00:00|9"]});
  assert.equal(r.promotionEvidenceReady,false);
  assert.ok(r.blockers.includes("CORRECTION_OUTSIDE_SEMANTIC_EPISODE"));
}
{
  const r=evaluatePromotionLinkageV0_7({
    ...base,
    eventKey:"TPEX_PAR_VALUE_CHANGE_REFERENCE|3086|2026-04-20|S2-CA-EVENT:"+"b".repeat(64),
    sourceId:"TPEX_PAR_VALUE_CHANGE_REFERENCE",
    symbol:"3086",
    family:"PAR_VALUE_CHANGE",
    effectiveDate:"2026-04-20",
    officialDetailDateTokens:["2026-04-01","2026-04-20"],
    officialSubtypeSemantic:null,
    semanticSeedVersionKey:null,
    semanticSeedDate:null,
    semanticAlignedRowCount:2,
    semanticAlignedVersionKeys:[
      "2026-03-15|10:00:00|1",
      "2026-04-01|10:00:00|1",
    ],
    correctionObserved:false,
    correctionObservedVersionKeys:[],
  });
  assert.equal(r.promotionEvidenceReady,true,JSON.stringify(r));
}
{
  const r=evaluatePromotionLinkageV0_7({
    ...base,
    semanticAlignedVersionKeys:[
      "2026-02-24|10:00:00|1",
      "2026-05-29|10:00:00|1",
      "2026-10-03|10:00:00|1",
    ],
  });
  assert.equal(r.promotionEvidenceReady,false);
  assert.equal(r.alignedChronologyReady,false);
  assert.ok(r.blockers.includes("SEMANTIC_EPISODE_NOT_CERTIFIED"));
}
{
  const r=evaluatePromotionLinkageV0_7({...base,officialDetailDateTokens:["2026-10-03"]});
  assert.equal(r.promotionEvidenceReady,false);
  assert.ok(r.blockers.includes("OFFICIAL_DETAIL_CHRONOLOGY_NOT_CERTIFIED"));
}
{
  const rows=[
    evaluatePromotionLinkageV0_7(base),
    evaluatePromotionLinkageV0_7({...base,actionFamilyQueryIntegrityExact:false,eventSpecificAnchorCandidate:false}),
  ];
  const s=summarizePromotionLinkageV0_7(rows);
  assert.equal(s.eventCount,2);
  assert.equal(s.promotionEvidenceReadyCount,1);
  assert.equal(s.promotionEvidenceBlockedCount,1);
  assert.equal(s.noCancellationCertifiedCount,0);
  assert.equal(s.tradingAuthority,false);
}
console.log("S2-07 promotion linkage V0.7 tests PASS");
