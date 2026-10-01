import Home from './pages/Home.vue'
import ToolPage from './pages/ToolPage.vue'
import { allToolPages } from './lib/tool-pages.js'

// Homepages (en + hi) + one page per tool per locale.
// All prerendered to static HTML by vite-ssg.
const routes = [
  { path: '/', component: Home },
  { path: '/hi/', component: Home },
]

for (const p of allToolPages()) {
  routes.push({ path: p.path, component: ToolPage, props: { toolId: p.id } })
}

export default routes
