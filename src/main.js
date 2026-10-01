import { ViteSSG } from 'vite-ssg'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import routes from './routes'
import en from './i18n/en.js'
import hi from './i18n/hi.js'
import { localeFromPath } from './lib/seo.js'
import './style.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: '/sargam-tools/',
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      return { top: 0 }
    },
  },
  ({ app, router, isClient }) => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      fallbackLocale: 'en',
      messages: { en, hi },
    })
    app.use(i18n)

    const applyLocale = (path) => {
      i18n.global.locale.value = localeFromPath(path)
    }
    router.beforeEach((to) => applyLocale(to.path))

    app.directive('reveal', {
      mounted(el) {
        el.classList.add('reveal')
        if ('IntersectionObserver' in window) {
          const io = new IntersectionObserver(
            (entries) =>
              entries.forEach((e) => {
                if (e.isIntersecting) {
                  e.target.classList.add('in')
                  io.unobserve(e.target)
                }
              }),
            { threshold: 0.08 },
          )
          io.observe(el)
        } else {
          el.classList.add('in')
        }
      },
    })
    if (isClient) {
      setTimeout(
        () =>
          document
            .querySelectorAll('.reveal:not(.in)')
            .forEach((el) => el.classList.add('in')),
        1500,
      )
    }
  },
)
