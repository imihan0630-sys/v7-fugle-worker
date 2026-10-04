# COV-02 Canonical Update Receipt 2026-10-04 V0.1

Status: CANONICAL_UPDATE_COMPLETE
Owner decision: APPROVED
Owner approval source: 00｜研究總控室 current chat, explicit reply `批准`

## Approved action

`EXTEND_EXISTING_SCOPE → D05-06`

Canonical name:
`Opening / Closing Auction & Auction Imbalance（開收盤集合競價與競價不平衡）`

## Canonical effects

- Domain count: 22, unchanged.
- Active module count: 356, unchanged.
- Weighted curriculum maturity: 44.0%, unchanged by this action.
- D05-06 maturity: L2 / 40%, unchanged.
- Formal Core: LOCKED.
- System1 Formal: unchanged.
- System2 Formal: unchanged.
- Runtime/deployment: none.

## Scope firewall

D05-06 owns:
- OPEN_CALL / OPEN_TRIAL;
- CLOSE_CALL_ACCUMULATION / CLOSE_TRIAL / CLOSE_DELAYED / CLOSE_FINAL;
- opening/closing call-auction price formation;
- trial/indicative state only when actually observed;
- final auction state;
- auction-imbalance semantics subject to source observability.

Fail-closed:
- no timestamped historical pre-close observation = UNKNOWN;
- final close/volume cannot reconstruct earlier imbalance;
- generic EOD volume cannot substitute for closing-auction imbalance;
- D05-14, D14, D11/D17 and D02 remain consumers/context owners and may not create duplicate auction votes;
- no independent bullish/bearish auction Alpha vote is authorized.

## Governance provenance

Specialist return:
`research/COV_02_CLOSING_AUCTION_SPECIALIST_RETURN_20261004_V0_1.md`

00 audit:
`shared-knowledge/CURRICULUM_COVERAGE_COV02_INTAKE_DEPENDENCY_AUDIT_20261004_V0_1.md`

Canonical update commits:
- `058bfd3ba9ee8adb833129fcf4f269ddcb825f21`
- `1a372541fde927839b5dac44abdc015eeeef0f24`
- `2ab00f9b79730e974f8a40d08b1ea0ad005de2d5`
- `cb46c09cbdaf0df5b3911f77cc72245530132856`
- `203a759af13938a9fef492afff26c8c7b89872db`
- `c96986a88bb8c26f6345e33748b4a9abbce147ec`
- `a8652e7b12ee46c85d796d83eaf54facc82b0ef5`
- `d156b038e6a427928ce5dad30d664370d7d86539`

The update was applied with blob-SHA compare-and-swap writes after the connector's single-call atomic-tree path hit a tool-call ceiling; each canonical surface was re-read before write and is verified again after receipt creation.
