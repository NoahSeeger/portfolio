import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { blogPlugin } from './scripts/blog-plugin.js'
import { mediaPlugin } from './scripts/media-plugin.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mediaPlugin(),
    react(),
    blogPlugin(),
  ],
})
