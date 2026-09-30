# D06 IC-038 — leverage/shorting semantic-clock matrix and outcome-blind receipt contract

Updated: 2026-09-30 Asia/Taipei
Status: SOURCE_SEMANTICS_ADVANCED / RECEIPT_CONTRACT_FROZEN / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

## Why this continuation exists
IC-037 proved that securities-borrowing products do not share one publication clock. IC-038 extends that result to the full leverage/shorting chain before any outcome test.

## Official product-clock matrix
- TWSE daily margin financing / margin short balance product: about 21:00 each trading day. It carries prior/current financing balance, financing buy/sell/cash repayment, prior/current margin-short balance, short sale/buy/stock repayment, quotas and restriction states.
- TWSE aggregate securities-borrowing balance TWT72U: 20:30. Borrowing balance means borrowed and not yet returned; it is not proof of a market short sale.
- TWSE segregated-account borrowing TWTBJU/TWTBKU/TWTBLU: 20:00 and is a different semantic/product family from TWT72U.
- TWSE short-side total-control file TWT93U: 23:30. It explicitly contains margin-short fields and actual SBL-short previous balance, current-day market SBL short sale, return, adjustment, current SBL-short balance, quota and transaction states.
- TWSE next-session SBL sale capacity TWT96U: 22:30. Capacity/eligibility is not realized short flow.
- TPEx Margin_SBL.csv: 22:00. This is a separate short-side/SBL product and does not replace full long-margin financing history.
- TPEx DayTradeMark.CSV and MargMark.csv: 21:45. These are eligibility/basic-data files, not proof of the publication clock of realized stock-level day-trading activity.

## Semantic falsification
The following objects must never be silently substituted or netted:
1. margin financing stock/flow;
2. margin short stock/flow;
3. securities borrowing stock/flow;
4. actual borrowed-stock short-sale flow;
5. borrowed-stock short-sale balance;
6. SBL short-sale quota/capacity;
7. day-trading activity;
8. day-trading/short-sale eligibility.

Rejected shortcuts:
- borrowing balance increase => bearish short build;
- margin financing minus borrowing balance => net speculative positioning;
- next-day SBL capacity => realized current-day short pressure;
- same sourceDate => same decision-time availability.

The strongest directional short-side object is not generic borrowing. Actual SBL short-sale flow/balance is closer to realized short positioning, but it remains hedge/arbitrage-confounded and therefore is a hypothesis input, not an automatic bearish signal.

## PIT receipt contract
Each research input must preserve:
- sourceDate
- market
- exact product/file code
- economicSemantic
- ruleVintage
- contractClockStatus = VERIFIED | CONFLICT | UNKNOWN
- producedAtContract
- requestAt
- capturedAt
- firstKnownAt
- parseStatus
- coverage
- deterministicContentHash
- sourceFinality/vintage where applicable

Composite firstKnownAt is the maximum firstKnownAt among all required components. If any required component is UNKNOWN at the decision timestamp, the composite is UNKNOWN. Missing evidence is never zero/BAD.

Historical downloads can establish eventual finalized event-date truth. They cannot manufacture historical capturedAt, firstKnownAt or Shadow membership.

## Outcome-blind research design for IC-039
Before reading returns, freeze competing exposures rather than choosing one after seeing performance.

Baselines/challengers:
A. generic borrowing balance/flow normalized by ADV20 and own-history percentile;
B. actual SBL short-sale flow normalized by daily volume/ADV20;
C. actual SBL short-sale balance normalized by ADV20 and own-history percentile;
D. margin-short balance/flow separately;
E. two-sided disagreement: margin-long crowding + actual SBL-short crowding.

Primary questions:
- Does B or C add information beyond A after liquidity, prior trend, sector/regime and volatility controls?
- Is A mostly a hedge/arbitrage/liquidity proxy after B/C are present?
- Does two-sided crowding predict realized range/MAE rather than return direction?
- Are apparent effects stable across TWSE/TPEx and rule vintages?

Primary outcomes, only after the data gate opens:
- D3/D5 return direction as secondary;
- D3/D5 downside MAE and MFE;
- realized range/volatility;
- false-breakout / stop-first risk;
- squeeze-candidate upside MFE for high prior actual-short balance plus positive price acceptance and covering/return evidence.

Negative controls:
- generic borrowing alone treated as bearish;
- raw absolute balances without scale normalization;
- same-date composite built before the latest component firstKnownAt;
- eligibility/quota files treated as realized flow.

Inference guards:
- cluster by market date;
- common-support matched/controlled comparisons;
- regime/rule-vintage stratification;
- factor-redundancy check versus liquidity, turnover, institutional flow, price-volume and volatility;
- no threshold sweep before preregistration;
- transaction cost/slippage only if translated into an executable counterfactual;
- PIT/OOS/Walk-forward/Prospective Shadow required before any optimization candidate.

## Decision
IC-038 closes the semantic/source-clock specification stage but does not open outcome testing.
D06-07/08/09/14 remain L2.
LS-048 remains cost/access gated and no subscription is authorized.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation — IC-039
1. Build the machine-readable outcome-blind receipt/product matrix from the frozen fields above.
2. Reuse only authorized/free receipts; do not purchase S23/S47/TWSE E-Shop products autonomously.
3. If a free official realized-short endpoint/artifact is available, run a bounded no-outcome capture and hash/coverage audit; otherwise preserve SOURCE_NEEDED.
4. Freeze A-E exposure formulas and common-support controls before any return join.
5. Accumulate independent prospective receipt dates; do not fabricate historical firstKnownAt.
6. Keep TPEx realized day-trading publication time UNKNOWN unless its own product contract or prospective receipt proves it.
7. Formal Core remains LOCKED.
