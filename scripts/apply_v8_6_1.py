from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.6.0-performance-center";',
    'const VERSION = "8.6.1-shared-navigation";',
    "runtime version"
)

anchor='''function renderSystemOverviewPage(overview) {'''
helper=r'''function portalNav(active) {
  const items=[
    {key:"system",href:"/system",label:"監控總控"},
    {key:"journal",href:"/journal",label:"交易日誌"},
    {key:"performance",href:"/performance",label:"績效分析中心"}
  ];
  return `<nav aria-label="V8主要入口" style="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px 0">
    ${items.map(item=>{
      const current=item.key===active;
      return `<a href="${item.href}"${current?' aria-current="page"':""}
        style="display:inline-block;padding:10px 14px;border-radius:9px;text-decoration:none;font-weight:800;
        background:${current?"#0f3d7a":"#1f6feb"};color:#fff;box-shadow:${current?"inset 0 0 0 2px #fff,0 0 0 2px #0f3d7a":"none"};
        opacity:${current?"1":"0.94"}">${item.label}${current?" ✓":""}</a>`;
    }).join("")}
  </nav>`;
}

''' + anchor
replace_once(anchor,helper,"shared portal navigation helper")

replace_once(
    '''  <h1>V7/V8 台股半自動交易決策｜系統總控</h1>''',
    '''  <h1>V7/V8 台股半自動交易決策｜系統總控</h1>${portalNav("system")}''',
    "system nav"
)

replace_once(
    '''  </style></head><body><div class="wrap"><h1>V8 選股／訊號交易日誌</h1>''',
    '''  </style></head><body><div class="wrap"><h1>V8 選股／訊號交易日誌</h1>${portalNav("journal")}''',
    "journal nav"
)

replace_once(
    '''  </style></head><body><div class="wrap"><h1>V8 績效分析中心</h1>''',
    '''  </style></head><body><div class="wrap"><h1>V8 績效分析中心</h1>${portalNav("performance")}''',
    "performance nav"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.6.1 shared navigation")
