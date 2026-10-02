import Home from './pages/Home.vue'
import ToolPage from './pages/ToolPage.vue'
import SongsIndex from './pages/SongsIndex.vue'
import SongPage from './pages/SongPage.vue'
import { allToolPages } from './lib/tool-pages.js'
import { allSongPages } from './lib/songs.js'

// Homepages (en + hi) + one page per tool per locale + songs index + one
// page per song per locale. All prerendered to static HTML by vite-ssg.
const routes = [
  { path: '/', component: Home },
  { path: '/hi/', component: Home },
  { path: '/songs/', component: SongsIndex },
  { path: '/hi/songs/', component: SongsIndex },
]

for (const p of allToolPages()) {
  routes.push({ path: p.path, component: ToolPage, props: { toolId: p.id } })
}

for (const p of allSongPages()) {
  routes.push({ path: p.path, component: SongPage, props: { songId: p.id } })
}

export default routes
