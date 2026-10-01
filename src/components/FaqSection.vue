<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// scope: i18n path prefix holding a `faq` array, e.g. 'home' or 'tools.harmonium'
const props = defineProps({
  scope: { type: String, default: 'home' },
  titleKey: { type: String, default: 'home.faq_title' },
})
const { t, tm } = useI18n()
// tm() returns a one-time snapshot — wrap in computed so the FAQ list
// re-resolves when the locale changes via client-side language switching.
const items = computed(() => tm(`${props.scope}.faq`))
</script>

<template>
  <div v-reveal class="card faq">
    <h2>{{ t(titleKey) }}</h2>
    <details v-for="(item, i) in items" :key="i" :open="i === 0 ? true : undefined">
      <summary>{{ item.q }} <span class="chev">▼</span></summary>
      <div class="acc-body"><div class="acc-inner"><p v-html="item.a"></p></div></div>
    </details>
  </div>
</template>
