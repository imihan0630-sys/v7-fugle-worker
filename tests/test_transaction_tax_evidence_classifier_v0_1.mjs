import assert from "node:assert/strict";
import {classifyTransactionTaxEvidence} from "../research/transaction_tax_evidence_classifier_v0_1.mjs";

let x=classifyTransactionTaxEvidence({actualTransactionTaxNTD:300,taxSource:"BROKER_STATEMENT",actualTaxClass:"ORDINARY"});
assert.equal(x.status,"ACTUAL");
assert.equal(x.transactionTaxNTD,300);

const sell={accountKey:"A1",symbol:"3006",effectiveAt:"2026-09-29T05:00:00Z",fillPrice:300,filledShares:100};
const buy={accountKey:"A1",symbol:"3006",effectiveAt:"2026-09-29T02:00:00Z",fillPrice:290,filledShares:100};
x=classifyTransactionTaxEvidence({instrumentClass:"TW_STOCK",verifiedDayTradeEligibility:true,sellFill:sell,buyFills:[buy]});
assert.equal(x.status,"MODELED");
assert.equal(x.taxClass,"VERIFIED_DAY_TRADE_ELIGIBLE");
assert.equal(x.rate,null);

x=classifyTransactionTaxEvidence({instrumentClass:"TW_STOCK",verifiedDayTradeEligibility:false,sellFill:sell,buyFills:[buy]});
assert.equal(x.taxClass,"ORDINARY_STOCK_SALE");

x=classifyTransactionTaxEvidence({instrumentClass:"TW_STOCK",sellFill:sell,buyFills:[buy]});
assert.equal(x.status,"UNKNOWN");

x=classifyTransactionTaxEvidence({instrumentClass:"TW_STOCK",verifiedDayTradeEligibility:true,sellFill:sell,buyFills:[]});
assert.equal(x.status,"UNKNOWN");

x=classifyTransactionTaxEvidence({instrumentClass:"TW_STOCK",verifiedDayTradeEligibility:true,sellFill:sell,buyFills:[{...buy,accountKey:"A2"}]});
assert.equal(x.status,"UNKNOWN");

console.log(JSON.stringify({ok:true,cases:6,rule:"tax class is broker-actual or evidence-classified; same-day signal/fill coincidence never silently chooses a reduced rate"},null,2));
