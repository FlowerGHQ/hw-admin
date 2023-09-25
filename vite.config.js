import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';
// 正式环境清除console
// https://vitejs.dev/config/

export default defineConfig(({ mode }) => { 
  return {
    server: {
      host: '0.0.0.0',
      port: 8088
    },
    build: {
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@images': path.resolve(__dirname, 'src/assets/images'),
        // vue-i18n在开发环境下使用runtime-only模式, 生产环境使用runtime-compiler模式,避免打包体积过大，在本地出现warrning
        'vue-i18n': mode === 'development' ? 'vue-i18n/dist/vue-i18n.cjs.js' : 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
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
  }
})