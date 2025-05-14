import { createApp } from 'vue'
import App from './App.vue'
import 'vue3-json-viewer/dist/index.css'
import 'vue-json-pretty/lib/styles.css';
import "vue3-json-viewer/dist/index.css";
import 'animate.css';
// 引入样式文件
import '@/styles/Theme.css' // 主题样式文件
import '@/styles/Style.scss' // 全局元素样式文件
import '@/styles/Flex.css' // 弹性布局样式文件
import 'nprogress/nprogress.css' // 进度条样式文件
import '@/styles/Reset.css' // 重置默认样式文件
import '@/styles/index.scss'

// 引入依赖库
import 'virtual:svg-icons-register' // 引入 SVG 图标注册器
import { createPinia } from 'pinia' // 引入 Pinia 状态管理库
import router from './router' // 引入 router 路由
import axios from 'axios' // 引入 axios 网络请求库
import VueAxios from 'vue-axios' // 引入 VueAxios 网络请求库
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import i18n from '@/i18n'

import LucideIcon from '@/components/common/LucideIcon.vue'
import EditItem from '@/components/common/EditItem.vue'
import CollapseTitle from '@/components/common/CollapseTitle.vue'

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

import Prism from 'prismjs';

VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});

import {
    createDiscreteApi,
    create,
    NColorPicker,
    NConfigProvider,
    NMessageProvider,
    NDialogProvider,
    NButton,
    NButtonGroup,
    NTag,
    NCollapse,
    NCollapseItem,
    NDataTable,
    NPopover,
    NDrawer,
    NDrawerContent,
    NModal,
    NCode,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NRadio,
    NRadioGroup,
    NCheckbox,
    NCheckboxGroup,
    NSelect,
    NSwitch
} from 'naive-ui'

const naive = create({
    components: [
        NColorPicker,
        NConfigProvider,
        NMessageProvider,
        NDialogProvider,
        NButton,
        NButtonGroup,
        NTag,
        NCollapse,
        NCollapseItem,
        NDataTable,
        NPopover,
        NDrawer,
        NDrawerContent,
        NModal,
        NCode,
        NForm,
        NFormItem,
        NInput,
        NInputNumber,
        NRadio,
        NRadioGroup,
        NCheckbox,
        NCheckboxGroup,
        NSelect,
        NSwitch
    ]
})

const { message, notification, dialog, loadingBar } = createDiscreteApi([
    'message',
    'dialog',
    'notification',
    'loadingBar'
])
window.__messageBox = message



// 创建Vue实例，并挂载到 #app 元素上
const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(VueAxios, axios)
app.use(naive)
app.use(VueMarkdownEditor);
app.use(ElementPlus, {
    locale: zhCn,
})
app.component('LucideIcon', LucideIcon)
app.component('EditItem', EditItem)
app.component('CollapseTitle', CollapseTitle)
app.mount('#app')
