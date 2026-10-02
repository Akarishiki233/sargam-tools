<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import FaqSection from '../components/FaqSection.vue'
import { songById } from '../lib/songs.js'
import { SITE, localeFromPath } from '../lib/seo.js'

const props = defineProps({ songId: { type: String, required: true } })
const { t, tm } = useI18n()
const route = useRoute()
const locale = computed(() => localeFromPath(route.path))
const song = computed(() => songById(props.songId))
const L = (obj) => obj[locale.value]

const legend = computed(() => tm('songs_ui.legend'))
const how = computed(() => tm(`songs.${props.songId}.how`))

// CSS class for a notation token: bar lines, komal (flat) swaras highlighted.
function noteClass(tok) {
  if (tok === '|') return 'bar'
  let core = tok
    .replace(/^\./, '') // low-octave dot
    .replace(/'$/, '') // high-octave mark
    .replace(/^\(([^)]*)\)$/, '$1') // (d) -> d
    .replace(/~.*$/, '') // M~G -> M
    .replace(/^[{}]/, '')
    .replace(/[{}]$/, '')
  return /^[rgdn]$/.test(core) ? 'komal' : ''
}
const canonPath = computed(() =>
  locale.value === 'hi' ? `/hi/songs/${props.songId}/` : `/songs/${props.songId}/`,
)
const indexPath = computed(() => (locale.value === 'hi' ? '/hi/songs/' : '/songs/'))
const harmoniumPath = computed(() =>
  locale.value === 'hi' ? '/hi/harmonium/' : '/harmonium/',
)

const faqJson = computed(() =>
  tm(`songs.${props.songId}.faq`).map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
)

useHead({
  htmlAttrs: { lang: computed(() => locale.value) },
  title: computed(() => t(`songs.${props.songId}.seo_title`)),
  meta: [
    { name: 'description', content: computed(() => t(`songs.${props.songId}.seo_description`)) },
    { property: 'og:title', content: computed(() => t(`songs.${props.songId}.seo_title`)) },
    { property: 'og:description', content: computed(() => t(`songs.${props.songId}.seo_description`)) },
    { property: 'og:type', content: 'website' },
  ],
  link: [
    { rel: 'canonical', href: computed(() => SITE + canonPath.value) },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: SITE + `/songs/${props.songId}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'hi',
      href: SITE + `/hi/songs/${props.songId}/`,
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: SITE + `/songs/${props.songId}/`,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'MusicComposition',
          name: L(song.value.title),
          inLanguage: locale.value,
          url: SITE + canonPath.value,
        }),
      ),
    },
    {
      type: 'application/ld+json',
      children: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqJson.value,
        }),
      ),
    },
    {
      type: 'application/ld+json',
      children: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Sargam Tools', item: SITE + '/' },
            {
              '@type': 'ListItem',
              position: 2,
              name: t('songs_ui.index_heading'),
              item: SITE + indexPath.value,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: L(song.value.title),
              item: SITE + canonPath.value,
            },
          ],
        }),
      ),
    },
  ],
})
</script>

<template>
  <main>
    <div class="card song-hero">
      <p class="crumbs">
        <RouterLink :to="indexPath">{{ t('songs_ui.index_heading') }}</RouterLink>
      </p>
      <h1>{{ L(song.title) }}</h1>
      <p class="tagline">{{ L(song.subtitle) }}</p>
      <div class="song-meta">
        <span><b>{{ t('songs_ui.scale_label') }}:</b> {{ L(song.scale) }}</span>
        <span><b>{{ t('songs_ui.taal_label') }}:</b> {{ L(song.taal) }}</span>
      </div>
      <RouterLink :to="harmoniumPath" class="cta-btn">{{ t('songs_ui.practice_cta') }} →</RouterLink>
    </div>

    <div class="card">
      <h2>{{ t('songs_ui.lines_title') }}</h2>
      <div v-for="(line, i) in song.lines" :key="i" class="nline">
        <p class="lyric">{{ L(line.lyric) }}</p>
        <p class="notes">
          <span
            v-for="(tok, j) in line.notes.split(' ')"
            :key="j"
            :class="noteClass(tok)"
          >{{ tok }}</span>
        </p>
      </div>
    </div>

    <div v-reveal class="card">
      <h2>{{ t('songs_ui.legend_title') }}</h2>
      <div v-for="(g, i) in legend" :key="i" class="why-item">
        <h3 class="mono">{{ g.s }}</h3>
        <p>{{ g.d }}</p>
      </div>
    </div>

    <div v-reveal class="card">
      <h2>{{ t('songs_ui.how_title') }}</h2>
      <ol class="steps">
        <li v-for="(s, i) in how" :key="i">{{ s }}</li>
      </ol>
    </div>

    <div v-reveal class="card">
      <h2>{{ t('songs_ui.variant_title') }}</h2>
      <p class="intro-p">{{ t(`songs.${songId}.variant_note`) }}</p>
    </div>

    <FaqSection :scope="`songs.${songId}`" />

    <div v-reveal class="card">
      <h2>{{ t('songs_ui.sources_title') }}</h2>
      <p class="intro-p">{{ t('songs_ui.sources_note') }}</p>
      <ul class="sources">
        <li v-for="src in song.sources" :key="src.url">
          <a :href="src.url" target="_blank" rel="noopener">{{ src.name }}</a>
        </li>
      </ul>
    </div>
  </main>
</template>

<style>
.song-hero h1 { margin: 0 0 0.3rem; font-size: clamp(1.6rem, 4vw, 2.2rem); letter-spacing: -0.02em; }
.crumbs { margin: 0 0 0.6rem; font-size: 0.9rem; }
.crumbs a { color: #b3541e; text-decoration: none; font-weight: 700; }
.tagline { color: var(--muted, #8a7a5f); font-size: 1.05rem; margin: 0 0 1rem; }
.song-meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1.4rem; margin-bottom: 1.1rem; font-size: 0.95rem; }
.song-meta b { color: #6b4a1f; }
.cta-btn {
  display: inline-block; font-weight: 800; padding: 0.65rem 1.3rem; border-radius: 0.7rem;
  background: #b3541e; color: #fff; text-decoration: none;
}
.nline { padding: 0.85rem 0; border-bottom: 1px dashed var(--line, #e8ddc9); }
.nline:last-child { border-bottom: none; }
.lyric { font-weight: 700; margin: 0 0 0.35rem; font-size: 1.02rem; }
.notes { margin: 0; line-height: 2; font-size: 1.12rem; }
.notes span {
  display: inline-block; font-weight: 700; color: #6b4a1f; background: #faf3e6;
  border: 1px solid var(--line, #e8ddc9); border-radius: 0.4rem;
  padding: 0.05rem 0.5rem; margin: 0 0.25rem 0.25rem 0; font-family: ui-monospace, monospace;
}
.notes span.bar { background: none; border: none; color: #c8ab7c; padding: 0.05rem 0.1rem; }
.notes span.komal { color: #a0522d; border-color: #e0b48f; background: #fdf0e4; }
.mono { font-family: ui-monospace, monospace; }
.sources { line-height: 2; padding-left: 1.2rem; }
.sources a { color: #b3541e; font-weight: 600; }
.intro-p { line-height: 1.75; }
.steps { line-height: 1.8; padding-left: 1.3rem; }
.steps li + li { margin-top: 0.45rem; }
.why-item + .why-item { margin-top: 1rem; }
.why-item h3 { margin: 0 0 0.2rem; font-size: 1.02rem; }
.why-item p { margin: 0; color: var(--muted, #8a7a5f); }
</style>
