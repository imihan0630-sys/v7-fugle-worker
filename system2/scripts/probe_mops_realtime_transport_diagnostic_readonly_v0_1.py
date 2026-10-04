#!/usr/bin/env python3
import json, re, urllib.request, urllib.error, http.cookiejar
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

INDEX_URL="https://mops.twse.com.tw/mops/web/index"

def read_response(opener,url,headers=None):
    req=urllib.request.Request(url,headers=headers or {})
    try:
        with opener.open(req,timeout=30) as r:
            body=r.read()
            return {
                "status":getattr(r,"status",200),
                "contentType":r.headers.get("Content-Type"),
                "finalUrl":r.geturl(),
                "bytes":len(body),
                "body":body,
            }
    except urllib.error.HTTPError as e:
        body=e.read()
        return {
            "status":e.code,
            "contentType":e.headers.get("Content-Type"),
            "finalUrl":e.geturl(),
            "bytes":len(body),
            "body":body,
        }

direct_opener=urllib.request.build_opener()
direct=read_response(direct_opener,URL,{
    "User-Agent":UA,
    "Accept":"text/html,application/xhtml+xml",
})

jar=http.cookiejar.CookieJar()
session_opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
bootstrap=read_response(session_opener,INDEX_URL,{
    "User-Agent":UA,
    "Accept":"text/html,application/xhtml+xml",
})
session=read_response(session_opener,URL,{
    "User-Agent":UA,
    "Accept":"text/html,application/xhtml+xml",
    "Referer":INDEX_URL,
})

# Prefer the session-bootstrap result for schema discovery.
body=session["body"]
status=session["status"]
ctype=session["contentType"]
final=session["finalUrl"]

