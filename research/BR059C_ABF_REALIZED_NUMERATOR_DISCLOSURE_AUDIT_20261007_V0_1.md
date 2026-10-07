# BR-059C — ABF Realized Numerator Disclosure Audit V0.1

Status: RESEARCH_ONLY / CURRENT_OFFICIAL_DISCLOSURE_AUDITED / REALIZED_ABF_NUMERATOR_REMAINS_UNKNOWN / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-13
Date: 2026-10-07 Asia/Taipei
Observed main before write: `8f3ca503630b79bcbc18490deaabf10e3759a1b4`

## Objective

Continue the exact BR-059B task:

Seek current issuer-native 2025-2026 disclosure for a realized, mutually exclusive ABF/PP-or-BT/product mix for:
- 3189 Kinsus;
- 8046 Nan Ya PCB.

Do not convert:
- application mix;
- capacity;
- roadmap;
- project expected sales;
- product development narrative;
into realized ABF revenue.

## 8046 Nan Ya PCB — current official disclosure

The latest official 2026Q2 investor presentation available on the issuer site reports:
- consolidated revenue growth and profitability;
- application-based revenue structure;
- product development directions for ABF substrate, BT substrate and general PCB.

The application-based revenue structure shows categories such as:
- PC;
- networking & communication;
- consumer electronics;
- automotive electronics;
- AI & high-performance computing.

The presentation separately describes ABF product development, including AI server ASIC/CPU and high-speed switch/router applications.

Official source:
https://www.nanyapcb.com.tw/nypcb/images/InvestorRelations/FinancialReport/NYPCBCH20260506.pdf

Critical finding:
the official presentation does NOT provide a realized mutually exclusive revenue split:
`ABF / BT / GENERAL_PCB`.

Therefore:
- networking revenue share is not an ABF revenue share;
- AI/HPC revenue share is not an ABF revenue share;
- an application can consume more than one substrate/board class;
- the same product class can serve several applications.

Permanent firewall:
`APPLICATION_REVENUE_MIX != PRODUCT_REVENUE_MIX`.

## 3189 Kinsus — current official disclosure

Current issuer-native Kinsus messaging states that:
- the Company is strategically focused on high-end FCBGA and SiP substrates;
- it has made progress in large-area, high-layer-count ABF substrates;
- it anticipates recovery of the ABF substrate market in 2026;
- capacity deployment and customer certification are being advanced.

Official issuer source:
https://www.kinsus.com.tw/en/html/message_from_the_chairman/index

The same current official source does NOT disclose a realized mutually exclusive ABF revenue numerator or ABF revenue percentage.

Therefore:
- FCBGA focus does not numerically identify ABF revenue;
- ABF capacity deployment does not equal realized ABF sales;
- customer certification does not equal realized ABF revenue;
- ABF market recovery expectation does not equal realized ABF revenue.

Permanent firewall:
`ABF_TECHNOLOGY_OR_CAPACITY_DISCLOSURE != REALIZED_ABF_REVENUE`.

## Cross-issuer disclosure taxonomy

Freeze four evidence classes separately:

1. APPLICATION_MIX
   - e.g. networking, AI/HPC, automotive.
2. PRODUCT_FAMILY_MIX
   - e.g. ABF, BT/PP, general PCB.
3. CAPACITY_OR_TECHNOLOGY_STATE
   - e.g. line expansion, high-layer-count qualification, roadmap.
4. REALIZED_REVENUE_NUMERATOR
   - actual revenue amount/share attributable to the mutually exclusive product family.

Only class 4 can directly populate the realized ABF revenue numerator.

Classes 1-3 may constrain or contextualize exposure but cannot numerically replace class 4.

## Bounded current conclusion

For the current official source set audited in this round:

### Kinsus 3189
- ABF business/technology relevance: SUPPORTED.
- realized ABF revenue numerator: UNKNOWN.
- realized ABF revenue share: UNKNOWN.

### Nan Ya PCB 8046
- ABF business/technology relevance: SUPPORTED.
- application revenue mix: SUPPORTED.
- realized ABF revenue numerator: UNKNOWN.
- realized ABF revenue share: UNKNOWN.

This is a negative disclosure result, not a missing research effort.

## Why preserving UNKNOWN is useful

If the model substitutes:
- AI/HPC share,
- networking share,
- substrate-department share,
- capacity share,
for ABF revenue share,
it creates a false precision signal.

That false precision is especially dangerous for:
- issuer exposure ranking;
- ABF theme concentration;
- industry-structure scoring;
- event attribution;
- cross-company comparisons.

Therefore:
`UNKNOWN_REALIZED_ABF_NUMERATOR` is safer and more informative than a fabricated proxy.

## D09-13 maturity

D09-13 remains L3 / 60%.

Current official evidence improves the disclosure firewall but does not create L4 prospective/OOS selection evidence.

No composite industry-structure score.
No Formal optimization candidate.
Formal Core unchanged.

## Exact next

BR-059D:
wait for or prospectively capture an issuer-native disclosure that provides an actual mutually exclusive product-family revenue split or a directly reconcilable ABF revenue amount.

Admission examples:
- ABF revenue amount;
- ABF share of total revenue;
- mutually exclusive ABF/BT/general-PCB revenue table.

Reject as numerator:
- application mix;
- capacity percentage;
- utilization;
- order pipeline;
- customer qualification;
- expected project sales;
- market-share estimate;
- analyst-estimated ABF mix.

Until such a disclosure exists:
`3189_REALIZED_ABF_NUMERATOR = UNKNOWN`
and
`8046_REALIZED_ABF_NUMERATOR = UNKNOWN`.
