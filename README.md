# Sargam Tools

Free online Indian-music practice toolkit: playable **harmonium**, **taal metronome**
(Teentaal / Keherwa / Dadra / Jhaptaal / Rupak), **tanpura drone** and a
**sargam ↔ Western notes converter**. Static site, zero backend, monetized with
display ads.

- Live: https://akarishiki233.github.io/sargam-tools/
- Stack: Vue 3 + Vite + vite-ssg (same SSG pattern as the cat calculator site)
- Locales: English (`/`) + Hindi (`/hi/`) — prerendered, hreflang cross-linked
- Audio: Web Audio API synthesis, no audio assets, works offline after first load

## Why this exists

Guitar tools are a red ocean (Ultimate Guitar, Chordify, GuitarTuna).
The Indian sargam/harmonium niche has proven search demand —
e.g. notationsworld.com pulls ~200K monthly visits, ~87% from organic search —
but the competing sites are thin WordPress/blogspot pages and single-page players.
Nobody is running the full playbook here: tool matrix + programmatic pages +
multilingual + long-form guides. This repo is that playbook.

## Workflow (same rule as the cat repo)

1. `npm run selftest` — must be fully green before push
2. push to `master` — GitHub Actions builds + deploys to Pages
3. verify the Actions run succeeded before announcing

## Roadmap

- [x] v1.0 — 4 tools × 2 locales, SEO basics, selftest
- [ ] Curated sargam-notes song pages (programmatic, like the cat-food pages) —
      needs verified notations, do NOT fabricate
- [ ] Long-form guides (how to learn harmonium, taal explained) interlinked
      with tool pages
- [ ] AdSense + submit sitemap in Search Console
