import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/sargam-tools/',
  ssgOptions: {
    formatting: 'prettify',
    crittersOptions: false,
  },
})
