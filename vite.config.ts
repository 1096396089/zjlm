import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // 使用相对路径
  plugins: [
    vue(),
    // vueDevTools(),
  ],
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
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.gltf', '**/*.glb'],
  publicDir: 'public'
})
