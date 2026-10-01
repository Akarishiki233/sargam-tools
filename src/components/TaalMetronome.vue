<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { TAALS, taalById } from '../lib/music.js'

const { t, locale } = useI18n()

const TAAL_NAMES = {
  teentaal: { en: 'Teentaal', hi: 'तीनताल' },
  keherwa: { en: 'Keherwa', hi: 'कहरवा' },
  dadra: { en: 'Dadra', hi: 'दादरा' },
  jhaptaal: { en: 'Jhaptaal', hi: 'झपताल' },
  rupak: { en: 'Rupak', hi: 'रूपक' },
}

const taalId = ref('keherwa')
const taal = computed(() => taalById(taalId.value))
const taalName = (id) => (TAAL_NAMES[id] || {})[locale.value] || id
const bpm = ref(80)
const playing = ref(false)
const curBeat = ref(-1) // 0-based, -1 = idle

let ctx = null
let timer = null
let nextTime = 0
let beatIdx = 0

// Split bols into vibhag groups for display.
const groups = computed(() => {
  const out = []
  let k = 0
  for (const size of taal.value.vibhag) {
    out.push(
      taal.value.bols.slice(k, k + size).map((bol, j) => ({ bol, idx: k + j })),
    )
    k += size
  }
  return out
})

const isKhali = (idx) => taal.value.khali === idx + 1

function clickFreq(idx) {
  if (idx === 0) return 740 // sam
  if (isKhali(idx)) return 500 // khali
  return 620
}

function schedule() {
  while (nextTime < ctx.currentTime + 0.15) {
    const idx = beatIdx
    const at = nextTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = clickFreq(idx)
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(idx === 0 ? 0.65 : 0.4, at + 0.006)
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.14)
    o.connect(g)
    g.connect(ctx.destination)
    o.start(at)
    o.stop(at + 0.18)
    const ms = Math.max(0, (at - ctx.currentTime) * 1000)
    setTimeout(() => {
      if (playing.value) curBeat.value = idx
    }, ms)
    nextTime += 60 / bpm.value
    beatIdx = (beatIdx + 1) % taal.value.beats
  }
}

function start() {
  if (typeof window === 'undefined') return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') ctx.resume()
  stopTimer()
  playing.value = true
  beatIdx = 0
  nextTime = ctx.currentTime + 0.08
  timer = setInterval(schedule, 25)
  schedule()
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function stop() {
  playing.value = false
  stopTimer()
  curBeat.value = -1
}

watch([taalId, bpm], () => {
  if (playing.value) start() // restart cleanly on change
})

onBeforeUnmount(() => {
  stopTimer()
  if (ctx) ctx.close()
})
</script>

<template>
  <div class="taal">
    <div class="taal-controls">
      <label class="ctl">
        <span>{{ t('widget.taal.taal') }}</span>
        <select v-model="taalId" class="big-select">
          <option v-for="ta in TAALS" :key="ta.id" :value="ta.id">
            {{ taalName(ta.id) }} · {{ ta.beats }}
          </option>
        </select>
      </label>
      <label class="ctl">
        <span>{{ t('widget.taal.bpm') }} · <b>{{ bpm }}</b></span>
        <input v-model.number="bpm" type="range" min="40" max="208" step="1" class="bpm-range" />
      </label>
      <button class="play-btn" :class="{ on: playing }" @click="playing ? stop() : start()">
        {{ playing ? t('widget.taal.stop') : t('widget.taal.start') }}
      </button>
    </div>

    <div class="beat-line">
      <span class="beat-count">
        {{ t('widget.taal.beat') }} {{ curBeat >= 0 ? curBeat + 1 : '–' }} / {{ taal.beats }}
      </span>
    </div>

    <div class="bols">
      <div v-for="(grp, gi) in groups" :key="gi" class="vibhag">
        <span
          v-for="b in grp"
          :key="b.idx"
          class="bol"
          :class="{ cur: curBeat === b.idx, sam: b.idx === 0, khali: isKhali(b.idx) }"
        >{{ b.bol }}</span>
      </div>
    </div>

    <p class="hint">{{ t('widget.taal.hint') }}</p>
  </div>
</template>

<style>
.taal-controls { display: flex; flex-wrap: wrap; gap: 1.1rem; align-items: end; margin-bottom: 1rem; }
.ctl > span { display: block; font-size: 0.85rem; color: var(--muted, #8a7a5f); margin-bottom: 0.35rem; }
.big-select {
  font-size: 1.05rem; padding: 0.6rem 0.8rem; border-radius: 0.6rem;
  border: 1px solid var(--line, #e8ddc9); background: var(--surface, #fff);
  color: var(--ink, #3d3225); min-width: 11rem;
}
.bpm-range { width: 12rem; accent-color: #b3541e; }
.play-btn {
  font-size: 1.05rem; font-weight: 800; padding: 0.65rem 1.6rem; border-radius: 0.7rem;
  border: none; background: #b3541e; color: #fff; cursor: pointer; min-width: 8rem;
}
.play-btn.on { background: #6b4a1f; }
.beat-line { margin: 0.4rem 0 0.8rem; }
.beat-count { font-size: 1.05rem; font-weight: 700; color: #6b4a1f; }
.bols { display: flex; flex-wrap: wrap; gap: 0.7rem; }
.vibhag {
  display: flex; gap: 0.35rem; padding: 0.55rem 0.65rem; border-radius: 0.7rem;
  background: var(--surface-muted, #f5eedd); border: 1px solid var(--line, #e8ddc9);
}
.bol {
  min-width: 2.9rem; text-align: center; padding: 0.5rem 0.4rem; border-radius: 0.5rem;
  background: var(--surface, #fff); border: 1px solid var(--line, #e8ddc9);
  font-weight: 700; font-size: 0.95rem; transition: background 0.08s;
}
.bol.sam { border-color: #b3541e; }
.bol.khali { border-style: dashed; }
.bol.cur { background: #b3541e; border-color: #b3541e; color: #fff; transform: scale(1.06); }
.hint { font-size: 0.88rem; color: var(--muted, #8a7a5f); margin-top: 0.8rem; }
</style>
