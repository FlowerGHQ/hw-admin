import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import viteCompression from 'vite-plugin-compression'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import {
  AntDesignVueResolver,
} from 'unplugin-vue-components/resolvers'
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
      },
      rollupOptions: {
        // manualChunks 自定义分割
        manualChunks:{
          // 将vue相关的包单独打包
          vue: ['vue', 'vue-router', 'vuex', 'vue-i18n'],
          // 将loadsh相关的包单独打包
          lodash: ['lodash'],
        }
      },
      chunkSizeWarningLimit: 1024 * 4, //代码分割警告的限制
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 配置路劲在src/icons/svg下面
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        // 指定symbolId格式 :
        symbolId: 'icon-[name]', //实例：#icon-user
      }),
      viteCompression(
        {
          algorithm: 'gzip', // 压缩算法
          threshold: 5120, // 文件大小大于这个值时启用压缩
          verbose: false, // 是否在控制台输出压缩结果
          deleteOriginFile: true // 是否删除原文件
        }
      ),//开启gzip
      Components({
        dirs: ['src/components'], // 目标文件夹
        extensions: ['vue'], // 文件类型
        resolvers: [AntDesignVueResolver()], // ui库解析器，也可以自定义，需要安装相关UI库
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@images': path.resolve(__dirname, 'src/assets/images'),
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