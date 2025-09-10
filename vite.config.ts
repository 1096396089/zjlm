import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // 部署到子目录时使用子路径作为基础路径
  // base: '/ad_h5/', // 部署到子目录时使用子路径作为基础路径
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  server: {
    proxy: {
      // 本地开发通过代理转发到 OSS，避免浏览器 CORS 限制
      '/oss/': {
        // Prefer new bucket; browser fetches absolute anyway, proxy helps local testing
        target: 'https://tc-weshop.oss-cn-beijing.aliyuncs.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oss\//, '/')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // 保持贴图文件的原始路径结构
          if (assetInfo.name && assetInfo.name.includes('tietu/')) {
            return assetInfo.name
          }
          return 'assets/[name].[hash][extname]'
        }
      }
    },
    // 确保静态资源被复制
    copyPublicDir: true
  },
  // 静态资源处理
})
