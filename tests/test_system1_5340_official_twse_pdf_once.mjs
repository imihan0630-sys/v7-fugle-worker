import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {SOURCE,INDEX_PATH,ORIGINAL_FILENAME,EXPECTED_UPLOAD,
 verifyOfficialIndex,pickDirectTwsePdfPath,describeExtractedPdf}
 from "../ops/system1_5340_2026q2_twse_official_pdf_once.mjs";
const official='<table><tr><td>5340</td><td>115 年 第二季</td><td>IFRSs個別財報</td><td>'+
 ORIGINAL_FILENAME+'</td><td>700181</td><td>'+EXPECTED_UPLOAD+'</td></tr></table>';
assert.equal(verifyOfficialIndex(official).basis,"INDIVIDUAL");
assert.equal(verifyOfficialIndex(official).firstKnownAtCertified,false);
assert.equal(verifyOfficialIndex(official.replace("個別","合併")).basis,"RAW_HTML_BASIS_UNVERIFIED");
assert.equal(verifyOfficialIndex(official.replace("個別","合併")).firstKnownAtCertified,false);
assert.throws(()=>verifyOfficialIndex(official.replace(EXPECTED_UPLOAD,"115/08/07 12:00:00")),/TIMESTAMP/);
assert.throws(()=>verifyOfficialIndex(official.replaceAll("5340","5341")),/FILE_MISSING|ISSUER/);
assert.equal(pickDirectTwsePdfPath('<a href="/pdf/202602_5340_AI2_20260806_163632.pdf">original</a>'),
 "/pdf/202602_5340_AI2_20260806_163632.pdf");
assert.throws(()=>pickDirectTwsePdfPath('<a href="https://attacker.example/file.pdf">bad</a>'),/NOT_UNIQUE/);
assert.throws(()=>pickDirectTwsePdfPath('<a href="/pdf/202602_5340_AI2.pdf"></a><a href="/pdf/202602_5340_AI2_v2.pdf"></a>'),/NOT_UNIQUE/);
assert.throws(()=>pickDirectTwsePdfPath('<a href="/pdf/202602_5340_AI2%2F..pdf"></a>'),/REJECTED/);
const text="建榮工業材料股份有限公司\n個別財務報告\n基本每股盈餘 0.54\n"+
 "編製基礎 無子公司說明 \n".repeat(180);
const parsed=describeExtractedPdf(text);
assert.equal(parsed.state,"ORIGINAL_PDF_TEXT_BASIS_OBSERVED_NOT_LEGALLY_ADMITTED");
assert.equal(parsed.formalEligible,false);assert.equal(parsed.system2PitCertified,false);
assert.equal(parsed.asOfFirstPublicationCertified,false);
assert.equal(describeExtractedPdf("hello").state,"ORIGINAL_PDF_TEXT_UNAVAILABLE");
const s=await readFile(new URL("../ops/system1_5340_2026q2_twse_official_pdf_once.mjs",import.meta.url),"utf8");
assert.match(s,/sourceClass|TWSE_EBOOK_ORIGINAL_SOURCE_RECEIPT/);
assert.doesNotMatch(s,/CLOUDFLARE_API_TOKEN|V7_ADMIN_TOKEN|GITHUB_TOKEN|\/api\/scan|\.put\(/);
assert.match(s,/if\(u\.origin!==SOURCE\)throw Error\("OFFICIAL_HOST_SCOPE_REJECTED"\)/);
assert.match(s,/noAutomatedPITPromotion:true/);
const wf=await readFile(new URL("../.github/workflows/system1-5340-twse-official-pdf-original-once.yml",import.meta.url),"utf8");
assert.match(wf,/pull_request:/);
assert.match(wf,/types: \[opened, synchronize\]/);
assert.doesNotMatch(wf,/schedule:|workflow_dispatch:|push:|secrets\./);
assert.match(wf,/contents: read/);
console.log(JSON.stringify({suite:"TWSE official e-book 5340 Q2 original PDF source-only",
 assertions:15,pass:true,networkInTest:false,productionMutation:false}));
