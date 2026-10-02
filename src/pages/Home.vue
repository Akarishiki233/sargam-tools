<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import FaqSection from '../components/FaqSection.vue'
import { TOOLS } from '../lib/tool-pages.js'
import { SONGS } from '../lib/songs.js'
import { SITE, localeFromPath } from '../lib/seo.js'

const { t, tm } = useI18n()
const route = useRoute()
const locale = computed(() => localeFromPath(route.path))
const toolPath = (id) => (locale.value === 'hi' ? `/hi/${id}/` : `/${id}/`)
const songPath = (id) => (locale.value === 'hi' ? `/hi/songs/${id}/` : `/songs/${id}/`)
const songsIndexPath = computed(() => (locale.value === 'hi' ? '/hi/songs/' : '/songs/'))
const L = (obj) => obj[locale.value]
const why = computed(() => tm('home.why'))

const ICONS = {
  harmonium: '🎹',
  'taal-metronome': '🥁',
  'tanpura-drone': '🎶',
  'sargam-converter': '🔄',
}

useHead({
  htmlAttrs: { lang: computed(() => locale.value) },
  title: computed(() => t('home.title')),
  meta: [
    { name: 'description', content: computed(() => t('home.description')) },
    { property: 'og:title', content: computed(() => t('home.title')) },
    { property: 'og:description', content: computed(() => t('home.description')) },
    { property: 'og:type', content: 'website' },
  ],
  link: [
    { rel: 'canonical', href: computed(() => SITE + (locale.value === 'hi' ? '/hi/' : '/')) },
    { rel: 'alternate', hreflang: 'en', href: SITE + '/' },
    { rel: 'alternate', hreflang: 'hi', href: SITE + '/hi/' },
    { rel: 'alternate', hreflang: 'x-default', href: SITE + '/' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Sargam Tools',
          url: SITE,
        }),
      ),
    },
  ],
})
</script>

<template>
  <main>
    <div class="card hero">
      <p class="kicker">{{ t('site.tagline') }}</p>
      <h1>{{ t('home.hero_title') }}</h1>
      <p class="lede">{{ t('home.hero_sub') }}</p>
    </div>

    <h2 class="section-title">{{ t('home.tools_title') }}</h2>
    <div class="tool-grid">
      <RouterLink
        v-for="tool in TOOLS"
        :key="tool.id"
        :to="toolPath(tool.id)"
        class="card tool-card"
      >
        <span class="tool-icon">{{ ICONS[tool.id] }}</span>
        <h3>{{ t(`tools.${tool.id}.name`) }}</h3>
        <p>{{ t(`tools.${tool.id}.tagline`) }}</p>
      </RouterLink>
    </div>

    <h2 class="section-title">
      {{ t('songs_ui.index_heading') }}
      <RouterLink :to="songsIndexPath" class="see-all">→</RouterLink>
    </h2>
    <div class="tool-grid">
      <RouterLink
        v-for="s in SONGS"
        :key="s.id"
        :to="songPath(s.id)"
        class="card tool-card"
      >
        <span class="tool-icon">🎵</span>
        <h3>{{ L(s.title) }}</h3>
        <p>{{ L(s.subtitle) }}</p>
      </RouterLink>
    </div>

    <div v-reveal class="card">
      <h2>{{ t('home.why_title') }}</h2>
      <div v-for="(w, i) in why" :key="i" class="why-item">
        <h3>{{ w.t }}</h3>
        <p>{{ w.d }}</p>
      </div>
    </div>

    <FaqSection scope="home" />
  </main>
</template>

<style>
.hero { text-align: center; }
.kicker {
  display: inline-block; font-size: 0.85rem; font-weight: 700; color: #b3541e;
  background: #fbeedf; border-radius: 999px; padding: 0.3rem 0.9rem; margin: 0 0 0.8rem;
}
.hero h1 { font-size: clamp(1.7rem, 4.5vw, 2.6rem); margin: 0 0 0.7rem; letter-spacing: -0.02em; }
.lede { font-size: 1.08rem; color: var(--muted, #8a7a5f); max-width: 36rem; margin: 0 auto; line-height: 1.7; }
.section-title { margin: 2.2rem 0 1rem; font-size: 1.4rem; }
.see-all { color: #b3541e; text-decoration: none; font-size: 1.1rem; margin-left: 0.4rem; }
.tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: 1rem; }
.tool-card { text-decoration: none; color: inherit; transition: transform 0.15s; display: block; }
.tool-card:hover { transform: translateY(-3px); }
.tool-icon { font-size: 2rem; }
.tool-card h3 { margin: 0.5rem 0 0.3rem; font-size: 1.15rem; }
.tool-card p { margin: 0; color: var(--muted, #8a7a5f); font-size: 0.95rem; }
.why-item + .why-item { margin-top: 1.1rem; }
.why-item h3 { margin: 0 0 0.25rem; font-size: 1.05rem; }
.why-item p { margin: 0; color: var(--muted, #8a7a5f); line-height: 1.7; }
</style>
