import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {   //npm run serve로 실행
    host: '0.0.0.0',  //모든 IP허용
    port: 5173,
    server: {
        proxy: {
        '/': {
          target: 'http://place.map.kakao.com',
          changeOrigin: true,
          }
        }
    }
  }
})
