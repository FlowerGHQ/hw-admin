import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
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
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 配置路劲在src/icons/svg下面
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        // 指定symbolId格式 :
        symbolId: 'icon-[name]', //实例：#icon-user
      }),
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