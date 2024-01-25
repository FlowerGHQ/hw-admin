import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import viteCompression from "vite-plugin-compression";
import * as path from "path";
// 正式环境清除console
// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
    return {
        server: {
            host: "0.0.0.0",
            port: 8088,
        },
        build: {
            minify: "terser", // 混淆器，terser构建后文件体积更小
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
            external: ["vue"], // 配置不打包的文件
            // 开启chunk大小警告
            chunkSizeWarningLimit: 2000,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes("node_modules")) {
                            return id.toString().split("node_modules/")[1].split("/")[0].toString();
                        }
                    },
                    chunkFileNames: "js/[name]-[hash].js", // 引入文件名的名称
                    entryFileNames: "js/[name]-[hash].js", // 包的入口文件名称
                    assetFileNames: "[ext]/[name]-[hash].[ext]", // 资源文件像 字体，图片等
                },
            },
            //   关闭文件计算
            reportCompressedSize: false,
            //   关闭生成map文件 可以达到缩小打包体积
            sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大,sourcemap是生成map文件，用于调试的
        },
        plugins: [
            vue(),
            createSvgIconsPlugin({
                // 配置路劲在src/icons/svg下面
                iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
                // 指定symbolId格式 :
                symbolId: "icon-[name]", //实例：#icon-user
            }),
            viteCompression({
                verbose: true,
                disable: false,
                threshold: 10240,
                algorithm: "gzip",
                ext: ".gz",
            }),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@images": path.resolve(__dirname, "src/assets/images"),
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
