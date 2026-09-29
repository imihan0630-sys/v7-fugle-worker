# Pattern Candle Context Provenance Falsification V0.1

Updated: 2026-09-30 Asia/Taipei
Status: CONTEXT PROVENANCE FIREWALL EXECUTABLE / OUTCOMES CLOSED
Classification: Class A isolated research QA
Formal Core impact: NONE

## Question

Can single-candle and multi-candle morphology be studied without letting a traditional name silently import trend, location, confirmation and a directional forecast? The answer is yes only when the candle shape and its surrounding context are stored as separate point-in-time objects.

This cycle does not implement another candlestick detector. Draft PR #103 already contains an outcome-free two-day relational encoder with body/range, wick, close location, overlap, containment, engulfment, overnight/intraday decomposition and descriptive labels. Reimplementing that geometry would duplicate stale draft work. Instead, the new executable receipt binds any existing morphology observation to independently versioned prior-trend, structural-location, TECHNICAL_CONTINUITY, corporate-action and symbol-session parents.

## Positive mechanism and decisive counterexample

Traditional candlestick interpretation is contextual. A lower-shadow-dominant candle may receive different traditional names after a decline versus after an advance even when its OHLC geometry is identical. The shape is therefore not the whole hypothesis. Prior trend and location are separate explanatory variables, and they may carry most or all of the apparent effect.

The executable counterexample freezes one morphology observation and binds it once to `AFTER_DECLINE` and once to `AFTER_ADVANCE`. The observation commitment remains byte-identical; only the context parent changes. Both outputs keep `directionalEffect=UNKNOWN`, assign no traditional name and expose no label vote count. A second test keeps trend fixed but changes structural location from support to resistance; this also remains one shape under two contexts, not two independent signals.

This matters for redundancy. If a named label's apparent return effect disappears after controlling its continuous geometry, prior trend, support/resistance location, overnight/intraday path and confirmation rule, the name contributes explanation only. It cannot receive an extra score merely because practitioners use a separate word.

## Literature and Taiwan market-structure evidence

Lu, Chen and Hsu (Journal of Banking & Finance, 2015; DOI 10.1016/j.jbankfin.2015.09.009) report that profitability conclusions changed materially with the holding strategy even after alternative trend definitions and data-snooping controls. This is direct evidence that a candle shape is not a self-contained trading rule.

Lu's Taiwan studies provide evidence that candle morphology is empirically testable, but their core samples predate Taiwan's modern continuous intraday market. TWSE confirms intraday continuous trading began on 2020-03-23 while the opening and closing mechanisms remain distinct. Pre-2020 effect sizes therefore cannot be copied into 2026 as fixed priors.

A 2019 formal-classification study specifies 103 candlestick patterns because natural-language definitions are prone to ambiguity and misinterpretation. Formalization improves reproducibility, but classification accuracy still does not establish economic value. A 2026 multi-scale VLM preprint adds recent counterevidence: visual models were strongest in persistent trends, weaker in common regimes and insensitive to explicitly requested horizons. As a preprint and non-Taiwan study it is not promotion evidence, but it reinforces the need to separate shape, scale, trend and forecast horizon.

## Audit of Draft PR #103

PR #103 remains an open Draft with head `69aace54c8d7d7b5ea2f7609495e5dea5eb616c2`; GitHub reports it dirty against current main. Its relational encoder is useful research, but the audit found two provenance gaps relevant to D01-02/D01-03/D01-12:

- `priorTrendState` is accepted as a caller-supplied value without an independent receipt, method version, source hash, known-at clock or proof that the trend window ends before the pattern bar;
- `corporateActionBoundary` is retained as a Boolean rather than being bound to a complete continuity/corporate-action parent.

The new receipt does not modify or merge PR #103. It freezes the missing boundary around it. Prior trend and structural location must end strictly before the pattern bar, future-known context is blocked, and a mutated morphology observation under an existing commitment is a provenance conflict.

## Confirmation is a child, not a rewrite

Next-session confirmation is unavailable at the original candle timestamp. Adding it to the original observation would create look-ahead. `attachPostCandleConfirmation` therefore creates a new child receipt referencing the immutable base observation and context receipt. The confirmation must use a later continuity generation whose parent is the original continuity receipt; reusing the old receipt ID would falsely imply that the original immutable parent already contained the future bar. The child can describe whether the later close is above, below or inside the observation range, but it still assigns no return direction. A future or wrong-lineage confirmation fails closed; the original receipt remains byte-identical.

## Falsification, bias and redundancy controls

Fourteen assertion groups cover same-shape/opposite-trend context, unknown context, trend leakage, location leakage, future-known context, incomplete symbol sessions, unresolved corporate actions, future bars hidden in a base continuity parent, observation mutation, append-only later confirmation, future confirmation, continuity-lineage conflict, illegal reuse of the original continuity generation and location disagreement.

No return, MFE, MAE, hit rate, holding horizon, threshold sweep or transaction-cost result was inspected. The work does not validate Hammer, Hanging Man, Engulfing, Harami, Piercing or any Sakata label as bullish or bearish. It also does not increase sample size by counting multiple names for one geometry.

Future economic testing, if parent coverage becomes complete, must compare continuous morphology against prior trend, location, overnight/intraday decomposition, volatility, price-limit state, corporate actions, liquidity, Formal/PV controls and the exact holding/confirmation rule. Scan date remains the independent clustering unit. Multiple label, trend, confirmation and horizon variants must enter the experiment ledger rather than being hidden under one name.

## Decision and continuation

The context receipt is accepted as Class A research infrastructure. D01-02, D01-03 and D01-12 remain L2 because modern Taiwan point-in-time coverage and economic outcomes are still absent. D01 remains 51.7%; no R09 and no `FORMAL_OPTIMIZATION_CANDIDATE` is created.

Freeze this v0.1 contract. Do not port the entire stale PR #103 or add more named labels in this cycle. The next nonblocked task is to audit whether current official/source receipts can independently attest the exact morphology observation bytes and context parents without self-attestation; runtime capture or shared persistence remains Class B proposal-first. Prospective outcome joins remain closed until complete immutable parents exist.
