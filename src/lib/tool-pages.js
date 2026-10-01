// Tool catalogue. Pure data — imported by routes.js, gen-sitemap.mjs and
// selftest.py (via node), so it must not import .vue files.

export const TOOLS = [
  { id: 'harmonium', component: 'HarmoniumKeyboard' },
  { id: 'taal-metronome', component: 'TaalMetronome' },
  { id: 'tanpura-drone', component: 'DronePlayer' },
  { id: 'sargam-converter', component: 'SargamConverter' },
]

export function toolById(id) {
  return TOOLS.find((t) => t.id === id)
}

// One page per tool per locale.
export function allToolPages() {
  const pages = []
  for (const t of TOOLS) {
    pages.push({ id: t.id, path: `/${t.id}/` })
    pages.push({ id: t.id, path: `/hi/${t.id}/` })
  }
  return pages
}
