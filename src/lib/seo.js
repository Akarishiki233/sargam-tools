export const SITE = 'https://akarishiki233.github.io/sargam-tools'
export const LOCALES = ['en', 'hi']

export function localeFromPath(path) {
  return path === '/hi' || path.startsWith('/hi/') ? 'hi' : 'en'
}

// Map any page path to its equivalent in another locale.
export function toLocalePath(path, locale) {
  const bare = path === '/hi/' || path === '/hi' ? '/' : path.replace(/^\/hi(\/|$)/, '/')
  if (locale === 'hi') return bare === '/' ? '/hi/' : `/hi${bare}`
  return bare
}
