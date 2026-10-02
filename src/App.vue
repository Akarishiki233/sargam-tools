<script setup>
import { computed } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@vueuse/head'
import { localeFromPath, toLocalePath } from './lib/seo.js'
import { GOOGLE_SITE_VERIFICATION } from './lib/site.js'

const route = useRoute()
const { t } = useI18n()
const locale = computed(() => localeFromPath(route.path))
const homePath = computed(() => (locale.value === 'hi' ? '/hi/' : '/'))
const otherPath = (code) => toLocalePath(route.path, code)

// Google Search Console verification (HTML tag method).
// Rendered on every page only when the token is configured in lib/site.js.
useHead({
  meta: GOOGLE_SITE_VERIFICATION
    ? [{ name: 'google-site-verification', content: GOOGLE_SITE_VERIFICATION }]
    : [],
})
</script>

<template>
  <div class="wrap">
    <header class="site-head">
      <RouterLink :to="homePath" class="brand">{{ t('site.name') }}</RouterLink>
      <nav class="lang-switch" aria-label="Language">
        <RouterLink :to="otherPath('en')" :class="{ active: locale === 'en' }">EN</RouterLink>
        <RouterLink :to="otherPath('hi')" :class="{ active: locale === 'hi' }">हिन्दी</RouterLink>
      </nav>
    </header>
    <RouterView />
    <footer class="site-foot">
      <p>{{ t('site.footer') }}</p>
    </footer>
  </div>
</template>

<style>
.site-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}
.brand {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--ink, #3d3225);
  text-decoration: none;
  letter-spacing: -0.01em;
}
.site-foot {
  margin-top: 3rem;
  padding: 1.5rem 0 2rem;
  border-top: 1px solid var(--line, #e8ddc9);
  color: var(--muted, #8a7a5f);
  font-size: 0.9rem;
  text-align: center;
}
</style>
