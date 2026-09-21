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
    'const VERSION = "8.7.12-after-market-2335";',
    'const VERSION = "8.7.13-daily-mobile-alert";',
    "runtime version"
)

# The 2026-09-21 real DAILY_SELECTION reached #v7-alerts at 23:36,
# but the handset did not surface a notification. Incoming-webhook HTTP 2xx
# proves Slack accepted the message, not that iOS displayed it.
# Make the once-per-day formal result an explicit Slack channel mention so
# mention-only mobile notification policies do not silently hide it.
replace_once(
    '      `📋 *${payload.title}*`, payload.instruction,',
    '      `<!channel>\\n📋 *${payload.title}*`, payload.instruction,',
    "daily selection channel alert"
)

# Ask Slack to resolve special mentions for the formal daily result.
replace_once(
'''  const body = isSlackIncomingWebhook
    ? { text: formatSlackSignalMessage(payload) }
    : payload;''',
'''  const body = isSlackIncomingWebhook
    ? { text: formatSlackSignalMessage(payload), ...(payload?.signalType === "DAILY_SELECTION" ? { link_names: 1 } : {}) }
    : payload;''',
    "slack daily mention parsing"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.13 daily Slack mobile alert hardening")
