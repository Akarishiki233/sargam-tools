<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  WESTERN_SHARP,
  parseNoteToken,
  westernToSargam,
  sargamToWestern,
  isWesternNoteName,
} from '../lib/music.js'

const { t } = useI18n()

const ROOTS = WESTERN_SHARP
const direction = ref('toSargam') // 'toSargam' | 'toWestern'
const root = ref('C')
const input = ref('')
const copied = ref(false)
let copyTimer = null

const result = computed(() => {
  const prefer = direction.value === 'toSargam' ? 'western' : 'sargam'
  const tokens = input.value.split(/[\s,;|]+/).filter(Boolean)
  const out = []
  const skipped = []
  for (const tok of tokens) {
    const p = parseNoteToken(tok, prefer)
    let c = null
    if (p !== null) {
      c =
        direction.value === 'toSargam'
          ? isWesternNoteName(p)
            ? westernToSargam(p, root.value)
            : null
          : sargamToWestern(p, root.value)
    }
    if (c === null) skipped.push(tok)
    else out.push(c)
  }
  return { text: out.join(' '), skipped }
})

function useExample() {
  if (direction.value === 'toSargam') {
    root.value = 'C'
    input.value = 'C D E F G A B C'
  } else {
    root.value = 'C'
    input.value = 'S R G m P D N S'
  }
}

async function copy() {
  if (!result.value.text) return
  try {
    await navigator.clipboard.writeText(result.value.text)
  } catch (e) {
    const ta = document.createElement('textarea')
    ta.value = result.value.text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copied.value = true
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="conv">
    <div class="conv-controls">
      <label class="ctl">
        <span>{{ t('widget.converter.direction') }}</span>
        <div class="segrow">
          <button :class="{ on: direction === 'toSargam' }" @click="direction = 'toSargam'">
            {{ t('widget.converter.to_sargam') }}
          </button>
          <button :class="{ on: direction === 'toWestern' }" @click="direction = 'toWestern'">
            {{ t('widget.converter.to_western') }}
          </button>
        </div>
      </label>
      <label class="ctl">
        <span>{{ t('widget.converter.root') }}</span>
        <div class="scale-btns">
          <button
            v-for="r in ROOTS"
            :key="r"
            :class="{ on: root === r }"
            @click="root = r"
          >{{ r }}</button>
        </div>
      </label>
    </div>

    <label class="ctl">
      <span>{{ t('widget.converter.input_label') }}</span>
      <textarea
        v-model="input"
        class="notes-input"
        rows="3"
        :placeholder="t('widget.converter.placeholder')"
        spellcheck="false"
      ></textarea>
    </label>

    <div class="conv-actions">
      <button class="ghost-btn" @click="useExample">{{ t('widget.converter.example') }}</button>
      <button class="play-btn" :disabled="!result.text" @click="copy">
        {{ copied ? t('widget.converter.copied') : t('widget.converter.copy') }}
      </button>
    </div>

    <div v-if="result.text || result.skipped.length" class="result-card">
      <span class="ctl-label">{{ t('widget.converter.output_label') }}</span>
      <p class="result-text">{{ result.text || '–' }}</p>
      <p v-if="result.skipped.length" class="skipped">
        {{ t('widget.converter.skipped') }} {{ result.skipped.join(' ') }}
      </p>
    </div>

    <p class="hint">{{ t('widget.converter.hint') }}</p>
  </div>
</template>

<style>
.conv-controls { display: grid; gap: 0.9rem; margin-bottom: 1rem; }
.ctl > span, .ctl-label { display: block; font-size: 0.85rem; color: var(--muted, #8a7a5f); margin-bottom: 0.35rem; }
.scale-btns { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.scale-btns button {
  min-width: 2.4rem; padding: 0.45rem 0.3rem; border-radius: 0.5rem;
  border: 1px solid var(--line, #e8ddc9); background: var(--surface, #fff);
  color: var(--ink, #3d3225); font-weight: 700; cursor: pointer; font-size: 0.9rem;
}
.scale-btns button.on { background: #b3541e; border-color: #b3541e; color: #fff; }
.segrow { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.segrow button {
  padding: 0.55rem 0.9rem; border-radius: 0.6rem; font-size: 0.95rem; font-weight: 700;
  border: 1px solid var(--line, #e8ddc9); background: var(--surface, #fff);
  color: var(--ink, #3d3225); cursor: pointer;
}
.segrow button.on { background: #b3541e; border-color: #b3541e; color: #fff; }
.notes-input {
  width: 100%; box-sizing: border-box; font-size: 1.1rem; line-height: 1.7;
  padding: 0.8rem 0.9rem; border-radius: 0.7rem; border: 1px solid var(--line, #e8ddc9);
  background: var(--surface, #fff); color: var(--ink, #3d3225); font-family: inherit; resize: vertical;
}
.notes-input:focus { outline: 2px solid #b3541e; outline-offset: 1px; }
.conv-actions { display: flex; gap: 0.7rem; margin: 0.9rem 0; }
.ghost-btn {
  padding: 0.6rem 1.1rem; border-radius: 0.7rem; font-size: 0.95rem; font-weight: 700;
  border: 1px solid var(--line, #e8ddc9); background: transparent;
  color: var(--ink, #3d3225); cursor: pointer;
}
.play-btn {
  font-size: 1rem; font-weight: 800; padding: 0.6rem 1.4rem; border-radius: 0.7rem;
  border: none; background: #b3541e; color: #fff; cursor: pointer;
}
.play-btn:disabled { opacity: 0.45; cursor: default; }
.result-card {
  border-radius: 0.7rem; border: 1px solid var(--line, #e8ddc9);
  background: var(--surface-muted, #f5eedd); padding: 0.9rem 1rem; margin-top: 0.4rem;
}
.result-text { font-size: 1.25rem; font-weight: 700; color: #6b4a1f; margin: 0.2rem 0; line-height: 1.8; word-spacing: 0.3rem; }
.skipped { font-size: 0.85rem; color: #a0522d; margin: 0.3rem 0 0; }
.hint { font-size: 0.88rem; color: var(--muted, #8a7a5f); margin-top: 0.8rem; }
</style>
