import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 앱인토스 빌드(--mode ait)에서는 웹 전용 스크립트(AdSense)를 제외해요
const stripWebOnly = mode => ({
  name: 'strip-web-only',
  transformIndexHtml: html =>
    mode === 'ait' ? html.replace(/\s*<!-- web-only:start -->[\s\S]*?<!-- web-only:end -->/g, '') : html,
})

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), stripWebOnly(mode)],
}))
