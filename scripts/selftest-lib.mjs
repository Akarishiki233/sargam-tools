// Pure-logic tests for src/lib/music.js. Run with: node scripts/selftest-lib.mjs
// Exit 0 = all pass, non-zero = failure (consumed by scripts/selftest.py).
import {
  WESTERN_SHARP,
  SARGAM_CHROMATIC,
  TAALS,
  noteIndex,
  westernToSargam,
  sargamToWestern,
  parseNoteToken,
  transposeWestern,
  midiToFreq,
} from '../src/lib/music.js'

let passed = 0
const ok = (cond, name) => {
  if (!cond) {
    console.error(`FAIL: ${name}`)
    process.exitCode = 1
  } else {
    passed++
  }
}

ok(WESTERN_SHARP.length === 12, '12 western pitch classes')
ok(SARGAM_CHROMATIC.length === 12, '12 sargam chromatic steps')
ok(
  SARGAM_CHROMATIC.map((s) => s.semitones).join(',') ===
    '0,1,2,3,4,5,6,7,8,9,10,11',
  'sargam semitone ladder 0-11',
)

// western -> sargam with Sa = C
ok(westernToSargam('C', 'C') === 'Sa', "C->Sa (Sa=C)")
ok(westernToSargam('D', 'C') === 'Re', "D->Re (Sa=C)")
ok(westernToSargam('E', 'C') === 'Ga', "E->Ga (Sa=C)")
ok(westernToSargam('F', 'C') === 'Ma', "F->Ma (Sa=C)")
ok(westernToSargam('G', 'C') === 'Pa', "G->Pa (Sa=C)")
ok(westernToSargam('C#', 'C') === 're', "C#->re komal (Sa=C)")
ok(westernToSargam('F#', 'C') === 'Ma#', "F#->tivra Ma (Sa=C)")

// root shift: Sa = D
ok(westernToSargam('D', 'D') === 'Sa', "D->Sa (Sa=D)")
ok(westernToSargam('E', 'D') === 'Re', "E->Re (Sa=D)")
ok(westernToSargam('C', 'D') === 'ni', "C->komal ni (Sa=D)")

// sargam -> western
ok(sargamToWestern('Sa', 'C') === 'C', "Sa->C (Sa=C)")
ok(sargamToWestern('Pa', 'C') === 'G', "Pa->G (Sa=C)")
ok(sargamToWestern('re', 'C') === 'C#', "komal re->C# (Sa=C)")
ok(sargamToWestern('Ni', 'C') === 'B', "Ni->B (Sa=C)")
ok(sargamToWestern('Sa', 'G') === 'G', "Sa->G (Sa=G)")

// token parsing: flats, shorthand, case
ok(parseNoteToken('Db') === 'C#', 'Db normalizes to C#')
ok(parseNoteToken('eb') === 'D#', 'eb normalizes to D#')
ok(parseNoteToken('r') === 're', "shorthand r -> komal re")
ok(parseNoteToken('R') === 'Re', "shorthand R -> Re")
ok(parseNoteToken('M') === 'Ma#', "shorthand M -> tivra Ma")
ok(parseNoteToken('m') === 'Ma', "shorthand m -> shuddha Ma")
ok(parseNoteToken('S') === 'Sa', "shorthand S -> Sa")
ok(parseNoteToken('sa') === 'Sa', "lowercase sa -> Sa")
ok(parseNoteToken('XYZ') === null, 'invalid token -> null')

// transpose
ok(transposeWestern('C', 7) === 'G', 'C + 7 semitones = G')
ok(transposeWestern('B', 1) === 'C', 'B + 1 semitone wraps to C')
ok(transposeWestern('E', -2) === 'D', 'E - 2 semitones = D')

// freq sanity
ok(Math.abs(midiToFreq(69) - 440) < 0.01, 'A4 = 440Hz')
ok(Math.abs(midiToFreq(60) - 261.63) < 0.05, 'C4 ~= 261.63Hz')

// taal data integrity
for (const t of TAALS) {
  ok(t.bols.length === t.beats, `${t.id}: bols length matches beats`)
  ok(
    t.vibhag.reduce((a, b) => a + b, 0) === t.beats,
    `${t.id}: vibhag sums to beats`,
  )
  ok(t.khali >= 1 && t.khali <= t.beats, `${t.id}: khali in range`)
}
const teentaal = TAALS.find((t) => t.id === 'teentaal')
ok(teentaal.beats === 16 && teentaal.bols[0] === 'Dha', 'teentaal theka head')
const keherwa = TAALS.find((t) => t.id === 'keherwa')
ok(keherwa.beats === 8, 'keherwa 8 beats')

console.log(`selftest-lib: ${passed} checks passed`)
