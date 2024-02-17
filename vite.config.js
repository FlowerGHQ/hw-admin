import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import viteCompression from 'vite-plugin-compression';
import inject from '@rollup/plugin-inject'; // 这个库可以实现 webpack.ProvidePlugin({…}) 的方式
import { AntDesignVueResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import * as path from 'path';
// 正式环境清除console
// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
    return {
        server: {
            host: '0.0.0.0',
            port: 8088,
        },
        build: {
            minify: 'terser', // 混淆器，terser构建后文件体积更小 // esbuild
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
            external: ['vue'], // 配置不打包的文件
            // 开启chunk大小警告
            chunkSizeWarningLimit: 2000,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    },
                    chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
                    entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
                    assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
                },
            },
            //   关闭文件计算
            reportCompressedSize: false,
            //   关闭生成map文件 可以达到缩小打包体积
            // sourcemap: 开发环境下默认开启，生产环境下默认关闭，因为生产环境下 sourcemap 会暴露源码，所以建议关闭。开发环境下建议开启，方便调试。
            sourcemap: mode === 'development' ? 'inline' : false,
        },
        plugins: [
            vue(),
            createSvgIconsPlugin({
                // 配置路劲在src/icons/svg下面
                iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
                // 指定symbolId格式 :
                symbolId: 'icon-[name]', //实例：#icon-user
            }),
            AutoImport({
                resolvers: [ElementPlusResolver(), AntDesignVueResolver()],
            }),
            Components({
                resolvers: [AntDesignVueResolver(), ElementPlusResolver()],
            }),
            viteCompression({
                verbose: true, // 是否在控制台中输出压缩结果
                disable: mode === 'development', // 是否禁用此插件（仅在生产构建中启用）
                threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
                algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
                ext: '.gz',
                deleteOriginFile: false, // 不需要删除源文件，nginx会自动根据请求头的accept-encoding进行判断
            }),
            inject({
                'window.Quill': ['@vueup/vue-quill', 'Quill'],
                Quill: ['@vueup/vue-quill', 'Quill'],
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@images': path.resolve(__dirname, 'src/assets/images'),
                'vue-i18n': '/node_modules/vue-i18n/dist/vue-i18n.cjs.js', // 指向正确的路径
            },
        },
        css: {
            preprocessorOptions: {
                less: {
                    additionalData: '@import "@/assets/styles/_var.less";' + '@import "@/assets/styles/mixin.less";',
                    javascriptEnabled: true,
                },
            },
        },
    };
});
