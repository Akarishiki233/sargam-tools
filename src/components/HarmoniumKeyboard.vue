<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { WESTERN_SHARP, SARGAM_CHROMATIC, midiToFreq } from '../lib/music.js'

const { t } = useI18n()

const ROOTS = WESTERN_SHARP
const saRoot = ref('C')
const octaveShift = ref(0)
const volume = ref(0.8)
const reverbOn = ref(true)
const sustainOn = ref(false)
const activeIds = ref(new Set())

const rootIdx = computed(() => WESTERN_SHARP.indexOf(saRoot.value))
const WHITE = new Set([0, 2, 4, 5, 7, 9, 11])
// computer-keyboard map: semitone offset from C4 -> key
const KEYMAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12 }
const KEYHINT = { 0: 'A', 1: 'W', 2: 'S', 3: 'E', 4: 'D', 5: 'F', 6: 'T', 7: 'G', 8: 'Y', 9: 'H', 10: 'U', 11: 'J', 12: 'K' }

function sargamFor(semitone) {
  return SARGAM_CHROMATIC[(semitone - rootIdx.value + 12) % 12].sargam
}

const whiteKeys = computed(() => {
  const arr = []
  for (let oct = 0; oct < 2; oct++)
    for (let i = 0; i < 12; i++) {
      if (!WHITE.has(i)) continue
      arr.push({
        id: `w${oct}-${i}`,
        midi: 60 + oct * 12 + i + octaveShift.value * 12,
        sargam: sargamFor(i),
        hint: oct === 0 ? KEYHINT[i] || '' : i === 0 ? 'K' : '',
        pos: arr.length,
      })
    }
  arr.push({
    id: 'w2-0', midi: 60 + 24 + octaveShift.value * 12,
    sargam: sargamFor(0), hint: '', pos: arr.length,
  })
  return arr
})

const blackKeys = computed(() => {
  const arr = []
  for (let oct = 0; oct < 2; oct++)
    for (let i = 0; i < 12; i++) {
      if (WHITE.has(i)) continue
      // white keys strictly before this black key
      let before = 0
      for (let o2 = 0; o2 <= oct; o2++)
        for (let j = 0; j < (o2 === oct ? i : 12); j++)
          if (WHITE.has(j)) before++
      arr.push({
        id: `b${oct}-${i}`,
        midi: 60 + oct * 12 + i + octaveShift.value * 12,
        sargam: sargamFor(i),
        hint: oct === 0 ? KEYHINT[i] || '' : '',
        leftPct: (before / 15) * 100,
      })
    }
  return arr
})

let ctx = null, master = null, verbGain = null
const voices = new Map()

function ensureCtx() {
  if (typeof window === 'undefined') return false
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume()
    return true
  }
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return false
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = volume.value
  // simple generated-impulse reverb
  const verb = ctx.createConvolver()
  verb.buffer = makeImpulse(2.2, 2.6)
  verbGain = ctx.createGain()
  verbGain.gain.value = reverbOn.value ? 0.32 : 0
  const dry = ctx.createGain()
  master.connect(dry)
  dry.connect(ctx.destination)
  master.connect(verb)
  verb.connect(verbGain)
  verbGain.connect(ctx.destination)
  return true
}

function makeImpulse(dur, decay) {
  const rate = ctx.sampleRate
  const len = Math.floor(rate * dur)
  const buf = ctx.createBuffer(2, len, rate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
  }
  return buf
}

function noteOn(id, midi) {
  if (!ensureCtx()) return
  noteOff(id, true)
  const f = midiToFreq(midi)
  const g = ctx.createGain()
  const t = ctx.currentTime
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.45, t + 0.035)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2100
  lp.Q.value = 0.4
  const mk = (type, det, peak) => {
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.value = f
    o.detune.value = det
    const og = ctx.createGain()
    og.gain.value = peak
    o.connect(og)
    og.connect(lp)
    o.start()
    return o
  }
  // layered detuned saws = reed body, soft octave triangle = breath
  const oscs = [mk('sawtooth', -6, 0.5), mk('sawtooth', 6, 0.5), mk('triangle', 3, 0.18)]
  oscs[2].frequency.value = f * 2
  lp.connect(g)
  g.connect(master)
  activeIds.value = new Set(activeIds.value).add(id)
  voices.set(id, {
    stop: () => {
      const t2 = ctx.currentTime
      g.gain.cancelScheduledValues(t2)
      g.gain.setValueAtTime(Math.max(g.gain.value, 0.0001), t2)
      g.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.4)
      setTimeout(() => {
        oscs.forEach((o) => { try { o.stop() } catch (e) {} })
        g.disconnect()
      }, 500)
      activeIds.value = new Set([...activeIds.value].filter((x) => x !== id))
    },
  })
}

function noteOff(id, silent) {
  const v = voices.get(id)
  if (!v) return
  voices.delete(id)
  if (silent) {
    // immediate cut for retrigger: reuse stop but it's fine to fade fast
  }
  v.stop()
}

function keyDown(k) { noteOn(k.id, k.midi) }
function keyUp(k) { if (!sustainOn.value) noteOff(k.id) }

function onKeyDown(e) {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
  const code = e.key.toLowerCase()
  if (!(code in KEYMAP)) return
  const tag = document.activeElement && document.activeElement.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  const off = KEYMAP[code]
  noteOn(`kb-${code}`, 60 + off + octaveShift.value * 12)
}
function onKeyUp(e) {
  const code = e.key.toLowerCase()
  if (!(code in KEYMAP)) return
  if (!sustainOn.value) noteOff(`kb-${code}`)
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onMounted(() => window.addEventListener('keyup', onKeyUp))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  ;[...voices.keys()].forEach((id) => noteOff(id))
  if (ctx) ctx.close()
})

watch(volume, (v) => { if (master) master.gain.value = v })
watch(reverbOn, (v) => { if (verbGain) verbGain.gain.value = v ? 0.32 : 0 })
watch(sustainOn, (v) => {
  if (!v) [...voices.keys()].forEach((id) => noteOff(id))
})
watch([saRoot, octaveShift], () => {
  // changing pitch layout: release everything so stale notes don't hang
  ;[...voices.keys()].forEach((id) => noteOff(id))
})
</script>

<template>
  <div class="harm">
    <div class="harm-controls">
      <label class="ctl">
        <span>{{ t('widget.harmonium.scale') }}</span>
        <div class="scale-btns">
          <button
            v-for="r in ROOTS"
            :key="r"
            :class="{ on: saRoot === r }"
            @click="saRoot = r"
          >{{ r }}</button>
        </div>
      </label>
      <div class="ctl-row">
        <label class="ctl">
          <span>{{ t('widget.harmonium.octave') }}</span>
          <div class="octstep">
            <button @click="octaveShift = Math.max(-2, octaveShift - 1)">−</button>
            <b>{{ octaveShift >= 0 ? '+' : '' }}{{ octaveShift }}</b>
            <button @click="octaveShift = Math.min(2, octaveShift + 1)">+</button>
          </div>
        </label>
        <label class="ctl">
          <span>{{ t('widget.harmonium.volume') }}</span>
          <input v-model.number="volume" type="range" min="0" max="1" step="0.01" />
        </label>
        <label class="ctl check">
          <input v-model="reverbOn" type="checkbox" />
          <span>{{ t('widget.harmonium.reverb') }}</span>
        </label>
        <label class="ctl check">
          <input v-model="sustainOn" type="checkbox" />
          <span>{{ t('widget.harmonium.sustain') }}</span>
        </label>
      </div>
    </div>

    <div class="kb" @contextmenu.prevent>
      <div
        v-for="k in whiteKeys"
        :key="k.id"
        class="wkey"
        :class="{ active: activeIds.has(k.id) }"
        @pointerdown.prevent="keyDown(k)"
        @pointerup="keyUp(k)"
        @pointerleave="keyUp(k)"
        @pointercancel="keyUp(k)"
      >
        <span class="sargam">{{ k.sargam }}</span>
        <span v-if="k.hint" class="khint">{{ k.hint }}</span>
      </div>
      <div
        v-for="k in blackKeys"
        :key="k.id"
        class="bkey"
        :class="{ active: activeIds.has(k.id) }"
        :style="{ left: k.leftPct + '%' }"
        @pointerdown.prevent="keyDown(k)"
        @pointerup="keyUp(k)"
        @pointerleave="keyUp(k)"
        @pointercancel="keyUp(k)"
      >
        <span class="sargam">{{ k.sargam }}</span>
        <span v-if="k.hint" class="khint">{{ k.hint }}</span>
      </div>
    </div>

    <p class="hint">{{ t('widget.harmonium.hint') }}</p>
  </div>
</template>

<style>
.harm-controls { display: grid; gap: 0.9rem; margin-bottom: 1rem; }
.ctl > span { display: block; font-size: 0.85rem; color: var(--muted, #8a7a5f); margin-bottom: 0.35rem; }
.scale-btns { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.scale-btns button {
  min-width: 2.4rem; padding: 0.45rem 0.3rem; border-radius: 0.5rem;
  border: 1px solid var(--line, #e8ddc9); background: var(--surface, #fff);
  color: var(--ink, #3d3225); font-weight: 700; cursor: pointer; font-size: 0.9rem;
}
.scale-btns button.on { background: #b3541e; border-color: #b3541e; color: #fff; }
.ctl-row { display: flex; flex-wrap: wrap; gap: 1.2rem; align-items: end; }
.octstep { display: flex; align-items: center; gap: 0.5rem; }
.octstep button {
  width: 2.2rem; height: 2.2rem; border-radius: 0.5rem; font-size: 1.1rem;
  border: 1px solid var(--line, #e8ddc9); background: var(--surface, #fff); cursor: pointer;
}
.ctl.check { display: flex; align-items: center; gap: 0.45rem; cursor: pointer; }
.ctl.check > span { margin: 0; font-size: 0.95rem; color: var(--ink, #3d3225); }
.ctl.check input { width: 1.15rem; height: 1.15rem; accent-color: #b3541e; }
.ctl input[type="range"] { width: 9rem; accent-color: #b3541e; }

.kb {
  position: relative; display: flex; user-select: none; -webkit-user-select: none;
  touch-action: none; border-radius: 0.75rem; overflow: hidden;
  border: 1px solid var(--line, #e8ddc9); background: #2b2118; padding: 0.5rem;
}
.wkey {
  flex: 1; min-height: 11rem; background: linear-gradient(#fffdf8, #f7f0e1);
  border: 1px solid #d9cba8; border-radius: 0 0 0.4rem 0.4rem; margin: 0 1px;
  display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  padding-bottom: 0.6rem; cursor: pointer; position: relative; z-index: 1;
}
.wkey.active { background: linear-gradient(#ffe9c9, #ffd9a0); }
.bkey {
  position: absolute; top: 0.5rem; width: 5.2%; max-width: 3.2rem; height: 6.4rem;
  transform: translateX(-50%); background: linear-gradient(#4a3a28, #241a10);
  border-radius: 0 0 0.35rem 0.35rem; z-index: 2; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  padding-bottom: 0.45rem;
}
.bkey.active { background: linear-gradient(#8a5a24, #5a3a16); }
.wkey .sargam { font-weight: 800; color: #6b4a1f; font-size: 0.95rem; }
.bkey .sargam { font-weight: 700; color: #f3e2c2; font-size: 0.8rem; }
.khint {
  font-size: 0.68rem; color: #a08c66; border: 1px solid #d9cba8; border-radius: 0.3rem;
  padding: 0.05rem 0.3rem; margin-top: 0.25rem; line-height: 1.4;
}
.bkey .khint { color: #c8ab7c; border-color: #6b5232; }
.hint { font-size: 0.88rem; color: var(--muted, #8a7a5f); margin-top: 0.7rem; }
</style>
