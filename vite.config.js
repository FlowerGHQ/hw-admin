import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';
// https://vitejs.dev/config/

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8088
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@images': path.resolve(__dirname, 'src/assets/images')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "@/assets/styles/_var.less";' + '@import "@/assets/styles/mixin.less";',
        javascriptEnabled: true,
      },
    }
  }
})
