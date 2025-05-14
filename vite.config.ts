import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import {defineConfig} from 'vite';
// 引入自动导入组件的插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// 引入自动注册SVG图标插件
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: 'dist',  // 指定输出目录
        assetsDir: 'static', // 静态资源目录名称是否匹配？
        cssCodeSplit: true, // 确保 CSS 文件的加载顺序
        rollupOptions: {
            input: {
                main: './index.html', // 入口 HTML 文件路径
            },
        }
    },

    base: process.env.NODE_ENV === 'production' ? './' : '/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
            types: path.resolve(__dirname, 'types/'),
            'codemirror': 'node_modules/codemirror'
        }
    },
    server: {
        host: '0.0.0.0', // 允许通过IP访问网站
        port: 8981, // 开发服务器端口号
        open: false, // 是否自动打开浏览器
        proxy: {
            '/api': {
                target: 'http://localhost:8088',
                changeOrigin: true, // 是否改变源地址
                rewrite: path => path.replace(/^\/api/, ''),
            },
        },
    },
    plugins: [
        vue(),
        vueJsx({}),
        //   // 指定需要缓存的图标文件夹
        //   iconDirs: [path.resolve(process.cwd(), 'src/bpmn-icons')],
        //   // 指定symbolId格式
        //   symbolId: '[name]',
        //   customDomId: '__svg__icons__dom__'
        // }),
        AutoImport({
            imports: ['vue', 'vue-router'], // 自动导入Vue相关函数
        }),
        // 配置自动导入并注册自定义组件
        Components({
            dirs: ['src/components', 'src/layout'], // 设置要扫描的组件目录
            deep: true, // 启用递归扫描子目录
        }),
        // 自动处理 SVG 图标的引入和注册
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), '/src/assets/svg-icons')], // 存放SVG图标的文件夹
            symbolId: 'icon-[dir]-[name]', // 图标symbolId格式
        }),
    ]
})

