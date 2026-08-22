import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const siteUrl = 'https://xiaopei388.github.io/'

function seoFiles() {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`
      })

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}</loc>\n  </url>\n</urlset>\n`
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), seoFiles()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
