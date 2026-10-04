#!/usr/bin/env python3
import io, json, re, urllib.request, urllib.parse, zipfile
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from datetime import datetime, timezone

INDEX_URL = "https://www.sfb.gov.tw/ch/home.jsp?id=1016&parentpath=0,6,52"
FROZEN_XLSX_URL = "https://www.fsc.gov.tw/userfiles/file/1151002%E7%94%B3%E5%A0%B1%E6%A1%88%E4%BB%B6v1.xlsx"
TARGET_TERMS = ["1342", "八貫", "1150348743", "撤銷"]
USER_AGENT = "System2-SFB-Authority-Revision-Provenance/0.1"

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links=[]
        self._href=None
        self._text=[]
    def handle_starttag(self, tag, attrs):
        if tag.lower()=="a":
            self._href=dict(attrs).get("href")
            self._text=[]
    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)
    def handle_endtag(self, tag):
        if tag.lower()=="a" and self._href is not None:
            self.links.append({"href":self._href,"text":" ".join("".join(self._text).split())})
            self._href=None
            self._text=[]

def fetch(url):
    req=urllib.request.Request(url,headers={"User-Agent":USER_AGENT})
    with urllib.request.urlopen(req,timeout=30) as r:
        data=r.read()
        return {
            "status":getattr(r,"status",200),
            "contentType":r.headers.get("Content-Type"),
            "lastModified":r.headers.get("Last-Modified"),
            "etag":r.headers.get("ETag"),
            "bytes":len(data),
            "body":data,
            "finalUrl":r.geturl(),
        }

def col_index(ref):
    letters=re.match(r"([A-Z]+)",ref or "")
    if not letters: return 0
    n=0
    for ch in letters.group(1):
        n=n*26+(ord(ch)-64)
    return n-1

def parse_xlsx(data):
    z=zipfile.ZipFile(io.BytesIO(data))
    ns_main={"m":"http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    ns_rel={"r":"http://schemas.openxmlformats.org/package/2006/relationships"}

    shared=[]
    if "xl/sharedStrings.xml" in z.namelist():
        root=ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in root.findall("m:si",ns_main):
            shared.append("".join(t.text or "" for t in si.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")))

    wb=ET.fromstring(z.read("xl/workbook.xml"))
    relroot=ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    rels={r.attrib["Id"]:r.attrib["Target"] for r in relroot.findall("r:Relationship",ns_rel)}

    sheets=[]
    for s in wb.findall("m:sheets/m:sheet",ns_main):
        rid=s.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
        target=rels.get(rid)
        if not target: continue
        if target.startswith("/"):
            path=target.lstrip("/")
        elif target.startswith("xl/"):
            path=target
        else:
            path="xl/"+target.lstrip("/")
        path=re.sub(r"/\./","/",path)
        rows=[]
        root=ET.fromstring(z.read(path))
        for row in root.findall(".//m:sheetData/m:row",ns_main):
            vals={}
            for c in row.findall("m:c",ns_main):
                ref=c.attrib.get("r","")
                idx=col_index(ref)
                typ=c.attrib.get("t")
                v=c.find("m:v",ns_main)
                value=""
                if typ=="s" and v is not None and v.text is not None:
                    try: value=shared[int(v.text)]
                    except Exception: value=v.text
                elif typ=="inlineStr":
                    value="".join(t.text or "" for t in c.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t"))
                elif v is not None and v.text is not None:
                    value=v.text
                vals[idx]=str(value).strip()
            if vals:
                maxidx=max(vals)
                arr=[vals.get(i,"") for i in range(maxidx+1)]
                if any(x for x in arr):
                    rows.append(arr)
        sheets.append({"name":s.attrib.get("name"),"rows":rows})
    return sheets

index=fetch(INDEX_URL)
index_text=index["body"].decode("utf-8","replace")
parser=LinkParser(); parser.feed(index_text)
links=[]
for x in parser.links:
    href=urllib.parse.urljoin(INDEX_URL,x["href"])
    decoded=urllib.parse.unquote(href)
    if href.lower().endswith((".xlsx",".ods")) or "申報案件" in decoded:
        links.append({"href":href,"decodedHref":decoded,"text":x["text"]})

frozen_decoded=urllib.parse.unquote(FROZEN_XLSX_URL)
index_mentions_frozen=("1151002申報案件v1.xlsx" in urllib.parse.unquote(index_text)) or any(
    "1151002申報案件v1.xlsx" in x["decodedHref"] for x in links
)

xlsx=fetch(FROZEN_XLSX_URL)
is_zip=xlsx["body"][:2]==b"PK"
sheets=parse_xlsx(xlsx["body"]) if is_zip else []

matched=[]
all_rows=0
for sheet in sheets:
    for i,row in enumerate(sheet["rows"],start=1):
        all_rows+=1
        joined=" | ".join(row)
        terms=[t for t in TARGET_TERMS if t in joined]
        if terms:
            matched.append({"sheet":sheet["name"],"rowNumber":i,"matchedTerms":terms,"cells":row,"joined":joined})

target_1342=[m for m in matched if "1342" in m["joined"] or "八貫" in m["joined"]]
document_no=[m for m in matched if "1150348743" in m["joined"]]
withdrawal=[m for m in matched if "撤銷" in m["joined"]]

result={
  "schemaVersion":"S2_SFB_AUTHORITY_REVISION_PROVENANCE_PROBE_V0_1",
  "observedAt":datetime.now(timezone.utc).isoformat().replace("+00:00","Z"),
  "index":{
    "url":INDEX_URL,
    "status":index["status"],
    "contentType":index["contentType"],
    "bytes":index["bytes"],
    "indexMentionsFrozen115File":index_mentions_frozen,
    "candidateFileLinks":links,
  },
  "annualFile":{
    "url":FROZEN_XLSX_URL,
    "status":xlsx["status"],
    "contentType":xlsx["contentType"],
    "bytes":xlsx["bytes"],
    "isZipContainer":is_zip,
    "sheetCount":len(sheets),
    "rowCount":all_rows,
  },
  "search":{
    "terms":TARGET_TERMS,
    "matchedRowCount":len(matched),
    "target1342RowCount":len(target_1342),
    "documentNo1150348743RowCount":len(document_no),
    "withdrawalRowCount":len(withdrawal),
    "target1342Rows":target_1342[:20],
    "documentNoRows":document_no[:20],
  },
  "sourceCapabilityReady": (
      index["status"]==200 and
      index_mentions_frozen and
      xlsx["status"]==200 and
      is_zip and
      len(sheets)>0 and
      all_rows>0
  ),
  "targetAuthorityEvidenceDirectlyObserved": len(target_1342)>0 or len(document_no)>0,
  "authorityRevisionCoverageComplete":False,
  "revisionCoverageComplete":False,
  "knownAtVersionClockCertified":False,
  "noEventMayBeClaimed":False,
  "technicalContinuityCertified":False,
  "historyMutationPerformed":False,
  "strategyEvaluationPerformed":False,
  "capacityRunProduced":False,
  "selectionAuthority":False,
  "finalSelectionEnabled":False,
  "livePushEnabled":False,
  "capitalImpact":False,
  "orderImpact":False,
  "system1RuntimeUsed":False,
}
assert result["sourceCapabilityReady"] is True
assert result["revisionCoverageComplete"] is False
assert result["selectionAuthority"] is False
assert result["system1RuntimeUsed"] is False
print(json.dumps(result,ensure_ascii=False,indent=2))
