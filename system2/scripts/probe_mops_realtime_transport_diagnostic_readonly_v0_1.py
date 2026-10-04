#!/usr/bin/env python3
import json, re, urllib.request
from html.parser import HTMLParser
from datetime import datetime, timezone

URL="https://mops.twse.com.tw/mops/web/t05sr01_1"
UA="System2-MOPS-Realtime-Transport-Diagnostic/0.1"

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.forms=[]
        self.inputs=[]
        self.links=[]
        self._form_stack=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        t=tag.lower()
        if t=="form":
            item={"action":a.get("action"),"method":a.get("method"),"name":a.get("name"),"id":a.get("id")}
            self.forms.append(item)
            self._form_stack.append(len(self.forms)-1)
        elif t=="input":
            self.inputs.append({
                "name":a.get("name"),"id":a.get("id"),"type":a.get("type"),
                "value":a.get("value"),"formIndex":self._form_stack[-1] if self._form_stack else None,
            })
        elif t=="a":
            href=a.get("href")
            if href: self.links.append(href)
    def handle_endtag(self,tag):
        if tag.lower()=="form" and self._form_stack:
            self._form_stack.pop()

req=urllib.request.Request(URL,headers={
    "User-Agent":UA,
    "Accept":"text/html,application/xhtml+xml",
})
with urllib.request.urlopen(req,timeout=30) as r:
    body=r.read()
    status=getattr(r,"status",200)
    ctype=r.headers.get("Content-Type")
    final=r.geturl()

text=body.decode("utf-8","replace")
p=Parser(); p.feed(text)

hidden=[x for x in p.inputs if str(x.get("type") or "").lower()=="hidden"]
names=sorted(set(str(x.get("name")) for x in p.inputs if x.get("name")))
ids=sorted(set(str(x.get("id")) for x in p.inputs if x.get("id")))

patterns={
    "SEQ_NO":bool(re.search(r"SEQ_NO",text,re.I)),
    "SPOKE_DATE":bool(re.search(r"SPOKE_DATE",text,re.I)),
    "SPOKE_TIME":bool(re.search(r"SPOKE_TIME",text,re.I)),
    "COMPANY_ID":bool(re.search(r"COMPANY_ID",text,re.I)),
    "skey":bool(re.search(r"\bskey\b",text,re.I)),
    "ajax_t05sr01_1":bool(re.search(r"ajax_t05sr01_1",text,re.I)),
    "table01":bool(re.search(r"table01",text,re.I)),
    "發言日期":("發言日期" in text),
    "發言時間":("發言時間" in text),
    "公司代號":("公司代號" in text),
    "即時重大訊息":("即時重大訊息" in text),
}

form_actions=sorted(set(x.get("action") for x in p.forms if x.get("action")))
ajax_refs=sorted(set(re.findall(r'["\']([^"\']*ajax_t05sr01_1[^"\']*)["\']',text,re.I)))
step_refs=sorted(set(re.findall(r'(?:step|firstin|TYPEK|SEQ_NO|SPOKE_DATE|SPOKE_TIME|COMPANY_ID|skey)\s*[=:]\s*["\']?([^"\'&;<>\s]+)',text,re.I)))

# Basic safety: preserve only short snippets around relevant tokens, not whole page.
snippets=[]
for token in ["ajax_t05sr01_1","SEQ_NO","SPOKE_DATE","SPOKE_TIME","COMPANY_ID","skey","table01"]:
    for m in re.finditer(token,text,re.I):
        lo=max(0,m.start()-180); hi=min(len(text),m.end()+260)
        snippets.append(" ".join(text[lo:hi].split()))
        if len(snippets)>=20: break
    if len(snippets)>=20: break

result={
  "schemaVersion":"S2_MOPS_REALTIME_TRANSPORT_DIAGNOSTIC_V0_1",
  "observedAt":datetime.now(timezone.utc).isoformat().replace("+00:00","Z"),
  "url":URL,
  "finalUrl":final,
  "httpStatus":status,
  "contentType":ctype,
  "bytes":len(body),
  "formCount":len(p.forms),
  "formActions":form_actions,
  "inputCount":len(p.inputs),
  "hiddenInputCount":len(hidden),
  "inputNames":names,
  "inputIds":ids,
  "patterns":patterns,
  "ajaxReferences":ajax_refs,
  "parameterValueHints":step_refs[:100],
  "snippets":snippets,
  "transportReadable": status==200 and len(body)>0,
  "realtimeSchemaDiscoverable": all(patterns[k] for k in ["SEQ_NO","SPOKE_DATE","SPOKE_TIME","COMPANY_ID","skey"]),
  "queryContractCertified":False,
  "publicAvailabilityLatencyCertified":False,
  "knownAtVersionClockCertified":False,
  "pitReplayUseAsAvailableAtAuthorized":False,
  "historyMutationPerformed":False,
  "strategyEvaluationPerformed":False,
  "selectionAuthority":False,
  "finalSelectionEnabled":False,
  "livePushEnabled":False,
  "capitalImpact":False,
  "orderImpact":False,
  "system1RuntimeUsed":False,
}
assert result["transportReadable"] is True
assert result["queryContractCertified"] is False
assert result["knownAtVersionClockCertified"] is False
assert result["selectionAuthority"] is False
assert result["system1RuntimeUsed"] is False
print(json.dumps(result,ensure_ascii=False,indent=2))
