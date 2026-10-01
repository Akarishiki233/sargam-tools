// Pure music-theory logic. No DOM, no AudioContext — safe to import in node
// for self-tests (scripts/selftest-lib.mjs).

export const WESTERN_SHARP = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
]

// Chromatic sargam ladder relative to Sa. Lowercase = komal (flat),
// 'Ma#' = tivra (sharp) Ma.
export const SARGAM_CHROMATIC = [
  { sargam: 'Sa', semitones: 0 },
  { sargam: 're', semitones: 1 },
  { sargam: 'Re', semitones: 2 },
  { sargam: 'ga', semitones: 3 },
  { sargam: 'Ga', semitones: 4 },
  { sargam: 'Ma', semitones: 5 },
  { sargam: 'Ma#', semitones: 6 },
  { sargam: 'Pa', semitones: 7 },
  { sargam: 'dha', semitones: 8 },
  { sargam: 'Dha', semitones: 9 },
  { sargam: 'ni', semitones: 10 },
  { sargam: 'Ni', semitones: 11 },
]

const SARGAM_SET = new Set(SARGAM_CHROMATIC.map((s) => s.sargam))

// Bhatkhande-style shorthand: S r R g G m M P d D n N
const SHORTHAND = {
  S: 'Sa', r: 're', R: 'Re', g: 'ga', G: 'Ga', m: 'Ma',
  M: 'Ma#', P: 'Pa', d: 'dha', D: 'Dha', n: 'ni', N: 'Ni',
}

const FLAT_TO_SHARP = { DB: 'C#', EB: 'D#', GB: 'F#', AB: 'G#', BB: 'A#' }

export function noteIndex(western) {
  const n = parseNoteToken(western, 'western')
  return n === null ? -1 : WESTERN_SHARP.indexOf(n)
}

export function isWesternNoteName(n) {
  return WESTERN_SHARP.includes(n)
}

// Parse one token. Returns a canonical western name ('C#') or sargam name
// ('re'), or null. `prefer` disambiguates single letters like 'G'
// (western G vs shorthand Ga) — the converter passes its source side.
export function parseNoteToken(token, prefer = 'western') {
  if (!token) return null
  const t = token.trim()
  if (!t) return null
  if (SARGAM_SET.has(t)) return t
  if (t.length === 1 && SHORTHAND[t] !== undefined) {
    const up = t.toUpperCase()
    if (prefer === 'western' && 'ABCDEFG'.includes(up)) return up
    return SHORTHAND[t]
  }
  const up = t.toUpperCase()
  if (WESTERN_SHARP.includes(up)) return up
  if (FLAT_TO_SHARP[up]) return FLAT_TO_SHARP[up]
  const low = t.toLowerCase()
  if (low === 'sa') return 'Sa'
  if (low === 'ma#') return 'Ma#'
  return null
}

export function westernToSargam(westernNote, saRoot = 'C') {
  const w = WESTERN_SHARP.indexOf(westernNote)
  const r = WESTERN_SHARP.indexOf(saRoot)
  if (w < 0 || r < 0) return null
  return SARGAM_CHROMATIC[(w - r + 12) % 12].sargam
}

export function sargamToWestern(sargamNote, saRoot = 'C') {
  const entry = SARGAM_CHROMATIC.find((s) => s.sargam === sargamNote)
  const r = WESTERN_SHARP.indexOf(saRoot)
  if (!entry || r < 0) return null
  return WESTERN_SHARP[(r + entry.semitones) % 12]
}

export function transposeWestern(westernNote, semitones) {
  const i = WESTERN_SHARP.indexOf(westernNote)
  if (i < 0) return null
  return WESTERN_SHARP[((i + semitones) % 12 + 12) % 12]
}

export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

// Taal definitions. `khali` is the 1-based beat number of the khali vibhag
// (empty/clap-less division); beat 1 is always sam.
export const TAALS = [
  {
    id: 'teentaal',
    beats: 16,
    vibhag: [4, 4, 4, 4],
    khali: 9,
    bols: [
      'Dha', 'Dhin', 'Dhin', 'Dha',
      'Dha', 'Dhin', 'Dhin', 'Dha',
      'Dha', 'Tin', 'Tin', 'Ta',
      'Ta', 'Dhin', 'Dhin', 'Dha',
    ],
  },
  {
    id: 'keherwa',
    beats: 8,
    vibhag: [4, 4],
    khali: 5,
    bols: ['Dha', 'Ge', 'Na', 'Ti', 'Na', 'Ka', 'Dhi', 'Na'],
  },
  {
    id: 'dadra',
    beats: 6,
    vibhag: [3, 3],
    khali: 4,
    bols: ['Dha', 'Ge', 'Na', 'Dha', 'Ti', 'Na'],
  },
  {
    id: 'jhaptaal',
    beats: 10,
    vibhag: [2, 3, 2, 3],
    khali: 6,
    bols: ['Dhi', 'Na', 'Dhi', 'Dhi', 'Na', 'Ti', 'Na', 'Dhi', 'Dhi', 'Na'],
  },
  {
    id: 'rupak',
    beats: 7,
    vibhag: [3, 2, 2],
    khali: 1,
    bols: ['Tin', 'Tin', 'Na', 'Dhi', 'Na', 'Dhi', 'Na'],
  },
]

export function taalById(id) {
  return TAALS.find((t) => t.id === id)
}
