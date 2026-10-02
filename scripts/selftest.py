#!/usr/bin/env python3
"""Self-test for sargam-tools. Must be fully green before push.

§1 build (§0 sitemap regen is part of build)  §2 all routes prerendered
§3 per-page SEO tags  §4 i18n en/hi parity + no raw '@'  §5 JSON-LD parses
§6 sitemap covers routes  §7 music.js pure-logic tests (node)
"""
import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://akarishiki233.github.io/sargam-tools"
passed = 0
failed = []


def check(cond, name):
    global passed
    if cond:
        passed += 1
    else:
        failed.append(name)
        print(f"FAIL: {name}")


def run(cmd, **kw):
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, **kw)


class HeadParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.metas = {}
        self.links = []
        self.jsonlds = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self.in_title = True
        elif tag == "meta":
            if a.get("name"):
                self.metas[a["name"].lower()] = a.get("content", "")
            if a.get("property"):
                self.metas[a["property"].lower()] = a.get("content", "")
        elif tag == "link":
            self.links.append(a)
        elif tag == "script" and a.get("type") == "application/ld+json":
            self.jsonlds.append("")

    def handle_data(self, data):
        if self.in_title:
            self.title += data.strip()
        if self.jsonlds and not self.jsonlds[-1]:
            self.jsonlds[-1] = data

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False


# ---------- §1 build ----------
print("§1 build…")
r = run(["npm", "run", "build"])
check(r.returncode == 0, "npm run build exit 0")
if r.returncode != 0:
    print(r.stderr[-3000:])
    sys.exit(1)
check((ROOT / "dist" / "index.html").exists(), "dist/index.html exists")

# ---------- §2 routes prerendered ----------
print("§2 routes…")
r = run(
    [
        "node",
        "--input-type=module",
        "-e",
        "Promise.all([import('./src/lib/tool-pages.js'), import('./src/lib/songs.js')])"
        ".then(([tp, sg]) => console.log(JSON.stringify("
        "['/', '/hi/', '/songs/', '/hi/songs/']"
        ".concat(tp.allToolPages().map(p => p.path))"
        ".concat(sg.allSongPages().map(p => p.path)))))",
    ]
)
routes = json.loads(r.stdout)
check(isinstance(routes, list) and len(routes) == 18, f"18 routes total (got {len(routes)})")


def dist_for(route):
    p = (ROOT / "dist" / route.strip("/")) / "index.html"
    return ROOT / "dist" / "index.html" if route == "/" else p


for rt in routes:
    check(dist_for(rt).exists(), f"prerendered: {rt}")

# ---------- §3 SEO tags ----------
print("§3 SEO tags…")
for rt in routes:
    html = dist_for(rt).read_text(encoding="utf-8")
    hp = HeadParser()
    hp.feed(html)
    check(bool(hp.title) and len(hp.title) > 10, f"{rt}: non-trivial <title>")
    check(
        bool(hp.metas.get("description")),
        f"{rt}: meta description",
    )
    canon = [l.get("href") for l in hp.links if l.get("rel") == "canonical"]
    check(
        canon and canon[0] == f"{SITE}{rt}",
        f"{rt}: canonical == SITE + path",
    )
    hreflangs = {
        l.get("hreflang"): l.get("href")
        for l in hp.links
        if l.get("rel") == "alternate" and l.get("hreflang")
    }
    check("en" in hreflangs and "hi" in hreflangs, f"{rt}: hreflang en+hi")
    check(bool(hp.metas.get("og:title")), f"{rt}: og:title")
    check("<html" in html and 'lang="' in html, f"{rt}: <html lang>")

# ---------- §4 i18n parity + no raw '@' ----------
print("§4 i18n…")
r = run(
    [
        "node",
        "--input-type=module",
        "-e",
        "Promise.all([import('./src/i18n/en.js'), import('./src/i18n/hi.js')])"
        ".then(([en, hi]) => {"
        "  const flat = (o, p='') => Object.entries(o).flatMap(([k,v]) =>"
        "    (v && typeof v === 'object' && !Array.isArray(v))"
        "      ? flat(v, p+k+'.') : [[p+k, v]]);"
        "  const e = new Map(flat(en.default)), h = new Map(flat(hi.default));"
        "  const missing = [...e.keys()].filter(k => !h.has(k));"
        "  const extra = [...h.keys()].filter(k => !e.has(k));"
        "  const badAt = [...e.values()].flat(Infinity)"
        "    .concat([...h.values()].flat(Infinity))"
        "    .filter(v => typeof v === 'string' && v.includes('@'));"
        "  const lens = [...e.keys()].filter(k => Array.isArray(e.get(k)))"
        "    .filter(k => (e.get(k)||[]).length !== (h.get(k)||[]).length);"
        "  console.log(JSON.stringify({keys: e.size, missing, extra,"
        "    badLens: lens, badAt: badAt.length}));"
        "})",
    ]
)
d = json.loads(r.stdout)
check(d["keys"] > 30, f"en has >30 keys (got {d['keys']})")
check(not d["missing"], f"hi missing keys: {d['missing'][:5]}")
check(not d["extra"], f"hi extra keys: {d['extra'][:5]}")
check(not d["badLens"], f"array length mismatch en/hi: {d['badLens'][:5]}")
check(d["badAt"] == 0, "no raw '@' in i18n strings (vue-i18n breaks)")

# ---------- §5 JSON-LD ----------
print("§5 JSON-LD…")
for rt in routes:
    html = dist_for(rt).read_text(encoding="utf-8")
    hp = HeadParser()
    hp.feed(html)
    check(len(hp.jsonlds) >= 1, f"{rt}: has JSON-LD")
    for block in hp.jsonlds:
        try:
            json.loads(block)
            check(True, f"{rt}: JSON-LD parses")
        except json.JSONDecodeError:
            check(False, f"{rt}: JSON-LD parses")

# ---------- §6 sitemap ----------
print("§6 sitemap…")
sm = ET.parse(ROOT / "public" / "sitemap.xml")
locs = {
    e.text.replace(SITE, "")
    for e in sm.getroot().iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
}
check(set(routes) <= locs, "sitemap covers all routes")

# ---------- §7 music logic ----------
print("§7 music.js logic…")
r = run(["node", "scripts/selftest-lib.mjs"])
check(r.returncode == 0, "selftest-lib.mjs all pass")
if r.returncode != 0:
    print(r.stdout[-2000:], r.stderr[-2000:])

# ---------- §8 locale path mapping ----------
print("§8 seo.js…")
r = run(
    [
        "node",
        "--input-type=module",
        "-e",
        "import {toLocalePath, localeFromPath} from './src/lib/seo.js';"
        "const cases = ["
        "  ['/', 'hi', '/hi/'], ['/', 'en', '/'],"
        "  ['/hi/', 'hi', '/hi/'], ['/hi/', 'en', '/'],"
        "  ['/harmonium/', 'hi', '/hi/harmonium/'],"
        "  ['/hi/harmonium/', 'en', '/harmonium/'],"
        "  ['/hi/harmonium/', 'hi', '/hi/harmonium/'],"
        "];"
        "const bad = cases.filter(([p,l,w]) => toLocalePath(p,l) !== w)"
        "  .map(([p,l]) => p+'->'+l);"
        "if (bad.length) { console.error('BAD:'+bad.join(',')); process.exit(1); }"
        "if (localeFromPath('/hi/harmonium/')!=='hi'||localeFromPath('/harmonium/')!=='en') process.exit(1);"
        "console.log('ok');",
    ]
)
check(r.returncode == 0, "toLocalePath round-trips (no /hi/hi/ double prefix)")

# ---------- §9 no cross-component CSS leakage ----------
print("§9 CSS…")
css = "".join(p.read_text(encoding="utf-8") for p in (ROOT / "dist" / "assets").glob("*.css"))
# segrow buttons must size to content; a fixed width here (e.g. from the
# octave stepper) would shrink every segmented button site-wide.
check(".segrow button{width:" not in css.replace(" ", ""), "no fixed width on .segrow button")

# ---------- §10 Search Console verification ----------
print("§10 GSC verification…")
m = re.search(r"GOOGLE_SITE_VERIFICATION\s*=\s*['\"]([^'\"]*)['\"]",
              (ROOT / "src" / "lib" / "site.js").read_text(encoding="utf-8"))
token = m.group(1) if m else ""
if token:
    for rt in routes:
        html = dist_for(rt).read_text(encoding="utf-8")
        check(f'name="google-site-verification"' in html and token in html,
              f"{rt}: GSC verification meta present")
else:
    print("  (token not configured yet — skipping, not a failure)")

# ---------- §11 song catalogue completeness ----------
print("§11 songs…")
r = run(
    [
        "node",
        "--input-type=module",
        "-e",
        "import {SONGS} from './src/lib/songs.js';"
        "const bad = [];"
        "for (const s of SONGS) {"
        "  for (const f of ['title','subtitle','scale','taal'])"
        "    for (const l of ['en','hi'])"
        "      if (!s[f] || !s[f][l] || !s[f][l].trim()) bad.push(s.id+':'+f+'.'+l);"
        "  if (!s.lines || !s.lines.length) bad.push(s.id+':no lines');"
        "  for (const [i,ln] of (s.lines||[]).entries()) {"
        "    for (const l of ['en','hi'])"
        "      if (!ln.lyric || !ln.lyric[l] || !ln.lyric[l].trim()) bad.push(s.id+':line'+i+'.lyric.'+l);"
        "    if (!ln.notes || !ln.notes.trim()) bad.push(s.id+':line'+i+'.notes');"
        "    const toks = ln.notes.split(' ').filter(t=>t && t!=='|');"
        "    if (toks.length === 0) bad.push(s.id+':line'+i+'.empty');"
        "  }"
        "  if (!s.sources || s.sources.length < 2) bad.push(s.id+':<2 sources');"
        "  for (const src of (s.sources||[]))"
        "    if (!src.url || !src.url.startsWith('http')) bad.push(s.id+':bad source url');"
        "}"
        "console.log(JSON.stringify({count: SONGS.length, bad}));",
    ]
)
d = json.loads(r.stdout)
check(d["count"] >= 3, f">=3 songs in catalogue (got {d['count']})")
check(not d["bad"], f"song content complete en+hi: {d['bad'][:5]}")

print(f"\nselftest: {passed} passed, {len(failed)} failed")
sys.exit(1 if failed else 0)
