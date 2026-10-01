<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import FaqSection from '../components/FaqSection.vue'
import HarmoniumKeyboard from '../components/HarmoniumKeyboard.vue'
import TaalMetronome from '../components/TaalMetronome.vue'
import DronePlayer from '../components/DronePlayer.vue'
import SargamConverter from '../components/SargamConverter.vue'
import { toolById, TOOLS } from '../lib/tool-pages.js'
import { SITE, localeFromPath, toLocalePath } from '../lib/seo.js'

const props = defineProps({ toolId: { type: String, required: true } })
const { t, tm } = useI18n()
const route = useRoute()
const locale = computed(() => localeFromPath(route.path))
const tool = computed(() => toolById(props.toolId))

const widgets = { HarmoniumKeyboard, TaalMetronome, DronePlayer, SargamConverter }
const widget = computed(() => widgets[tool.value.component])

const tk = (k) => t(`tools.${props.toolId}.${k}`)
const intro = computed(() => tm(`tools.${props.toolId}.intro`))
const steps = computed(() => tm(`tools.${props.toolId}.how`))
const pathFor = (l) => toLocalePath(route.path, l)
const others = computed(() => TOOLS.filter((x) => x.id !== props.toolId))
const otherPath = (id) => (locale.value === 'hi' ? `/hi/${id}/` : `/${id}/`)

const faqJson = computed(() =>
  tm(`tools.${props.toolId}.faq`).map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
)

useHead({
  htmlAttrs: { lang: computed(() => locale.value) },
  title: computed(() => tk('title')),
  meta: [
    { name: 'description', content: computed(() => tk('description')) },
    { property: 'og:title', content: computed(() => tk('title')) },
    { property: 'og:description', content: computed(() => tk('description')) },
    { property: 'og:type', content: 'website' },
  ],
  link: [
    { rel: 'canonical', href: computed(() => SITE + pathFor(locale.value)) },
    { rel: 'alternate', hreflang: 'en', href: computed(() => SITE + pathFor('en')) },
    { rel: 'alternate', hreflang: 'hi', href: computed(() => SITE + pathFor('hi')) },
    { rel: 'alternate', hreflang: 'x-default', href: computed(() => SITE + pathFor('en')) },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: tk('name'),
          applicationCategory: 'MusicApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0' },
          url: SITE + pathFor(locale.value),
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
  ],
})
</script>

<template>
  <main>
    <div class="card tool-hero">
      <h1>{{ tk('name') }}</h1>
      <p class="tagline">{{ tk('tagline') }}</p>
      <component :is="widget" />
    </div>

    <div v-reveal class="card">
      <h2>{{ tk('how_title') }}</h2>
      <p v-for="(p, i) in intro" :key="i" class="intro-p">{{ p }}</p>
      <ol class="steps">
        <li v-for="(s, i) in steps" :key="i">{{ s }}</li>
      </ol>
    </div>

    <FaqSection :scope="`tools.${toolId}`" />

    <div v-reveal class="card">
      <h2>{{ t('nav.tools') }}</h2>
      <div class="tool-grid">
        <RouterLink
          v-for="o in others"
          :key="o.id"
          :to="otherPath(o.id)"
          class="tool-link"
        >
          <b>{{ t(`tools.${o.id}.name`) }}</b>
          <span>{{ t(`tools.${o.id}.tagline`) }}</span>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style>
.tool-hero h1 { margin: 0 0 0.3rem; font-size: clamp(1.6rem, 4vw, 2.2rem); letter-spacing: -0.02em; }
.tagline { color: var(--muted, #8a7a5f); font-size: 1.05rem; margin: 0 0 1.2rem; }
.intro-p { line-height: 1.75; color: var(--ink, #3d3225); }
.steps { line-height: 1.8; padding-left: 1.3rem; }
.steps li + li { margin-top: 0.45rem; }
.tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 0.8rem; }
.tool-link {
  display: block; text-decoration: none; color: inherit; padding: 0.9rem 1rem;
  border: 1px solid var(--line, #e8ddc9); border-radius: 0.7rem; background: var(--surface, #fff);
}
.tool-link b { display: block; margin-bottom: 0.2rem; }
.tool-link span { font-size: 0.9rem; color: var(--muted, #8a7a5f); }
.tool-link:hover { border-color: #b3541e; }
</style>
