import assert from "node:assert/strict";
import {EXPECTED,parseOriginal2026Q2IndividualEps as parse}
 from "../research/system1_5340_2026q2_individual_pdf_eps_review_v0_1.mjs";
const template={
 sha256:EXPECTED.originalSha256,byteLength:EXPECTED.pdfBytes,
 originalFilename:EXPECTED.twseOriginalFilename,sourceHost:EXPECTED.twseSource,
 twseUploadDateTaipei:EXPECTED.twseUploadDateTaipei,
 text:["建榮工業材料股份有限公司","會計師核閱報告",
 "民國 115 年及 114 年 4 月 1 日至 6 月 30 日",
 "民國 115 年及 114 年 1 月 1 日至 6 月 30 日",
 "9750 基本每股盈餘 $ 0.54 $ 0.11 $ 1.00 $ 0.37",
 "9850 稀釋每股盈餘 $ 0.54 $ 0.11 $ 1.00 $ 0.37",
 "閱讀用假段落不是真實官方原始財報".repeat(1300)].join("\n")
};
let assertions=0;
function good(){let x=parse(template);assertions++;
 assert.equal(x.basicEPS.quarterCurrent,0.54);
 assert.equal(x.basicEPS.quarterPriorYear,0.11);
 assert.equal(x.basicEPS.yearToDateCurrent,1.00);
 assert.equal(x.basicEPS.yearToDatePriorYear,0.37);
 assert.equal(x.legalIndividualBasis2026Q2Verified,false);
 assert.equal(x.system1FormalEligible,false);
 assert.equal(x.system2PitAEligible,false);
 assert.equal(x.system2PitBEligible,false);
 assert.equal(x.pointInTimeAsOfCutoffVerified,false);
 assert.equal(x.canTrade,false);assertions+=10;
}
function negative(delta,code){
 assert.throws(()=>parse({...template,...delta}),new RegExp(code));
 assertions++;
}
good();
negative({sha256:"1".repeat(64)},"SOURCE_RECEIPT");
negative({originalFilename:"202601_5340_AI2.pdf"},"SOURCE_RECEIPT");
negative({byteLength:700182},"SOURCE_RECEIPT");
negative({twseUploadDateTaipei:"115/08/07 16:36:32"},"SOURCE_RECEIPT");
negative({sourceHost:"https://news.test"},"SOURCE_RECEIPT");
negative({text:template.text.replace("建榮工業材料股份有限公司","其他公司")},"ISSUER");
negative({text:template.text.replace("114 年 4 月 1 日至 6 月 30 日","114 年 7 月 1 日")},"PERIOD");
negative({text:template.text.replace("會計師核閱報告","未經核閱")},"AUDITOR");
negative({text:template.text.replace("9750 基本每股盈餘 $ 0.54 $ 0.11 $ 1.00 $ 0.37",
 "9750 基本每股盈餘 $ 0.54 $ 1.00")},"FOUR_PERIOD");
negative({text:template.text.replace("9850 稀釋每股盈餘 $ 0.54 $ 0.11 $ 1.00 $ 0.37",
 "9850 稀釋每股盈餘 $ 0.54 $ 1.00")},"FOUR_PERIOD");
negative({text:template.text+"\n9750 基本每股盈餘 $ 0.54 $ 0.11 $ 1.00 $ 0.37"},"NOT_UNIQUE");
console.log(JSON.stringify({suite:"5340 official Q2 standalone PDF EPS row strictly original-identity pinned",
 assertions,pass:true,noTrading:true,legalBasisAdmitted:false,pitCertified:false}));
