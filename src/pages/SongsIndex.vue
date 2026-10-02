<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import { SONGS } from '../lib/songs.js'
import { SITE, localeFromPath } from '../lib/seo.js'

const { t } = useI18n()
const route = useRoute()
const locale = computed(() => localeFromPath(route.path))
const L = (obj) => obj[locale.value]
const songPath = (id) => (locale.value === 'hi' ? `/hi/songs/${id}/` : `/songs/${id}/`)
const canonPath = computed(() => (locale.value === 'hi' ? '/hi/songs/' : '/songs/'))

useHead({
  htmlAttrs: { lang: computed(() => locale.value) },
  title: computed(() => t('songs_ui.index_title')),
  meta: [
    { name: 'description', content: computed(() => t('songs_ui.index_description')) },
    { property: 'og:title', content: computed(() => t('songs_ui.index_title')) },
    { property: 'og:description', content: computed(() => t('songs_ui.index_description')) },
    { property: 'og:type', content: 'website' },
  ],
  link: [
    { rel: 'canonical', href: computed(() => SITE + canonPath.value) },
    { rel: 'alternate', hreflang: 'en', href: SITE + '/songs/' },
    { rel: 'alternate', hreflang: 'hi', href: SITE + '/hi/songs/' },
    { rel: 'alternate', hreflang: 'x-default', href: SITE + '/songs/' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: t('songs_ui.index_heading'),
          itemListElement: SONGS.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: L(s.title),
            url: SITE + songPath(s.id),
          })),
        }),
      ),
    },
  ],
})
</script>

<template>
  <main>
    <div class="card hero">
      <h1>{{ t('songs_ui.index_heading') }}</h1>
      <p class="lede">{{ t('songs_ui.index_sub') }}</p>
    </div>

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
        <p class="song-scale">{{ t('songs_ui.scale_label') }}: {{ L(s.scale) }}</p>
      </RouterLink>
    </div>
  </main>
</template>

<style>
.hero { text-align: center; }
.hero h1 { font-size: clamp(1.7rem, 4.5vw, 2.4rem); margin: 0 0 0.7rem; letter-spacing: -0.02em; }
.lede { font-size: 1.05rem; color: var(--muted, #8a7a5f); max-width: 38rem; margin: 0 auto; line-height: 1.7; }
.tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: 1rem; margin-top: 1.4rem; }
.tool-card { text-decoration: none; color: inherit; transition: transform 0.15s; display: block; }
.tool-card:hover { transform: translateY(-3px); }
.tool-icon { font-size: 2rem; }
.tool-card h3 { margin: 0.5rem 0 0.3rem; font-size: 1.15rem; }
.tool-card p { margin: 0; color: var(--muted, #8a7a5f); font-size: 0.95rem; }
.song-scale { margin-top: 0.5rem !important; font-size: 0.85rem !important; color: #6b4a1f !important; font-weight: 700; }
</style>
