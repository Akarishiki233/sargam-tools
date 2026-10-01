<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { WESTERN_SHARP, midiToFreq } from '../lib/music.js'

const { t } = useI18n()

const ROOTS = WESTERN_SHARP
const root = ref('C')
const mode = ref('tanpura') // 'tanpura' | 'pad'
const playing = ref(false)

let ctx = null
let timer = null
let nextPluck = 0
let pluckIdx = 0
let padNodes = null

const rootMidi = () => 48 + WESTERN_SHARP.indexOf(root.value) // around C3
// classic tanpura order: Pa, high Sa, high Sa, low Sa
const PATTERN = [7, 12, 12, -12]
const PLUCK_GAP = 2.4

function ensureCtx() {
  if (typeof window === 'undefined') return false
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return false
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') ctx.resume()
  return true
}

function pluck(midi, at) {
  const f = midiToFreq(midi)
  const o1 = ctx.createOscillator()
  o1.type = 'triangle'
  o1.frequency.value = f
  const o2 = ctx.createOscillator()
  o2.type = 'sine'
  o2.frequency.value = f * 2
  const g2 = ctx.createGain()
  g2.gain.value = 0.22
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 1500
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(0.5, at + 0.025)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 3.4)
  o1.connect(lp)
  o2.connect(g2)
  g2.connect(lp)
  lp.connect(g)
  g.connect(ctx.destination)
  o1.start(at)
  o2.start(at)
  o1.stop(at + 3.6)
  o2.stop(at + 3.6)
}

function schedulePlucks() {
  while (nextPluck < ctx.currentTime + 0.8) {
    pluck(rootMidi() + PATTERN[pluckIdx % PATTERN.length], nextPluck)
    nextPluck += PLUCK_GAP
    pluckIdx++
  }
}

function startPad() {
  const g = ctx.createGain()
  g.gain.value = 0.0001
  g.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 2.5)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 850
  const mk = (midi, type, det, peak) => {
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.value = midiToFreq(midi)
    o.detune.value = det
    const og = ctx.createGain()
    og.gain.value = peak
    o.connect(og)
    og.connect(lp)
    o.start()
    return o
  }
  const rm = rootMidi()
  const oscs = [
    mk(rm, 'sawtooth', -5, 0.4),
    mk(rm, 'sawtooth', 5, 0.4),
    mk(rm + 7, 'sawtooth', -4, 0.32),
    mk(rm + 7, 'triangle', 4, 0.25),
  ]
  lp.connect(g)
  g.connect(ctx.destination)
  padNodes = { oscs, g }
}

function play() {
  if (!ensureCtx()) return
  stopAudio()
  playing.value = true
  if (mode.value === 'tanpura') {
    pluckIdx = 0
    nextPluck = ctx.currentTime + 0.1
    timer = setInterval(schedulePlucks, 200)
    schedulePlucks()
  } else {
    startPad()
  }
}

function stopAudio() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (padNodes) {
    const { oscs, g } = padNodes
    padNodes = null
    const t = ctx.currentTime
    try {
      g.gain.cancelScheduledValues(t)
      g.gain.setValueAtTime(Math.max(g.gain.value, 0.0001), t)
      g.gain.linearRampToValueAtTime(0.0001, t + 0.8)
    } catch (e) {}
    setTimeout(() => oscs.forEach((o) => { try { o.stop() } catch (e) {} }), 1000)
  }
}

function stop() {
  playing.value = false
  stopAudio()
}

watch([root, mode], () => {
  if (playing.value) play()
})

onBeforeUnmount(() => {
  stopAudio()
  if (ctx) ctx.close()
})
</script>

<template>
  <div class="drone">
    <div class="drone-controls">
      <label class="ctl">
        <span>{{ t('widget.drone.root') }}</span>
        <div class="scale-btns">
          <button
            v-for="r in ROOTS"
            :key="r"
            :class="{ on: root === r }"
            @click="root = r"
          >{{ r }}</button>
        </div>
      </label>
      <div class="ctl-row">
        <label class="ctl">
          <span>{{ t('widget.drone.sound') }}</span>
          <div class="segrow">
            <button :class="{ on: mode === 'tanpura' }" @click="mode = 'tanpura'">
              {{ t('widget.drone.tanpura') }}
            </button>
            <button :class="{ on: mode === 'pad' }" @click="mode = 'pad'">
              {{ t('widget.drone.pad') }}
            </button>
          </div>
        </label>
        <button class="play-btn" :class="{ on: playing }" @click="playing ? stop() : play()">
          {{ playing ? t('widget.drone.stop') : t('widget.drone.play') }}
        </button>
      </div>
    </div>

    <div class="strings" :class="{ live: playing }">
      <span v-for="(s, i) in ['Pa', 'Sa', 'Sa', 'Sa̱']" :key="i" class="string">{{ s }}</span>
    </div>

    <p class="hint">{{ t('widget.drone.hint') }}</p>
  </div>
</template>

<style>
.drone-controls { display: grid; gap: 0.9rem; margin-bottom: 1rem; }
.ctl > span { display: block; font-size: 0.85rem; color: var(--muted, #8a7a5f); margin-bottom: 0.35rem; }
.scale-btns { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.scale-btns button {
  min-width: 2.4rem; padding: 0.45rem 0.3rem; border-radius: 0.5rem;
  border: 1px solid var(--line, #e8ddc9); background: var(--surface, #fff);
  color: var(--ink, #3d3225); font-weight: 700; cursor: pointer; font-size: 0.9rem;
}
.scale-btns button.on { background: #b3541e; border-color: #b3541e; color: #fff; }
.ctl-row { display: flex; flex-wrap: wrap; gap: 1.2rem; align-items: end; }
.segrow { display: flex; gap: 0.35rem; }
.segrow button {
  padding: 0.55rem 0.9rem; border-radius: 0.6rem; font-size: 0.95rem; font-weight: 700;
  border: 1px solid var(--line, #e8ddc9); background: var(--surface, #fff);
  color: var(--ink, #3d3225); cursor: pointer;
}
.segrow button.on { background: #b3541e; border-color: #b3541e; color: #fff; }
.play-btn {
  font-size: 1.05rem; font-weight: 800; padding: 0.65rem 1.6rem; border-radius: 0.7rem;
  border: none; background: #b3541e; color: #fff; cursor: pointer; min-width: 8rem;
}
.play-btn.on { background: #6b4a1f; }
.strings { display: flex; gap: 0.5rem; margin: 0.6rem 0; }
.string {
  flex: 1; text-align: center; padding: 0.9rem 0; border-radius: 0.6rem;
  background: var(--surface-muted, #f5eedd); border: 1px solid var(--line, #e8ddc9);
  font-weight: 800; font-size: 1.1rem; color: #8a7a5f;
}
.strings.live .string {
  color: #b3541e; border-color: #b3541e;
  animation: pulse 2.4s ease-in-out infinite;
}
.strings.live .string:nth-child(2) { animation-delay: 0.6s; }
.strings.live .string:nth-child(3) { animation-delay: 1.2s; }
.strings.live .string:nth-child(4) { animation-delay: 1.8s; }
@keyframes pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
.hint { font-size: 0.88rem; color: var(--muted, #8a7a5f); margin-top: 0.7rem; }
</style>
