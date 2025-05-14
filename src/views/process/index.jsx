import { defineComponent, computed, ref, onMounted } from 'vue';
import Toolbar from '@/components/Toolbar';
import Palette from '@/components/Palette';
import Designer from '@/components/Designer';
import Panel from '@/components/Panel';
import Setting from '@/components/Setting';
import ContextMenu from '@/components/ContextMenu/index.vue';
import { defaultSettings } from '@/config';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui';
import businessFunctionVersionService from "@/api/function/businessFunctionVersionService";
import axios from 'axios';
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('json', json);
const Process = defineComponent({
    setup() {
        const route = useRoute(); // 初始化 route 对象
        const { versionId } = route.query; // 获取 query 参数
        const editorSettings = ref({ ...defaultSettings });
        const processXml = ref(undefined);
        const customPalette = computed(() => editorSettings.value.paletteMode === 'custom');
        const customPenal = computed(() => editorSettings.value.penalMode === 'custom');
        const showToolbar = computed(() => editorSettings.value.toolbar);
        const computedClasses = computed(() => {
            const baseClass = ['designer-container'];
            customPalette.value && baseClass.push('designer-with-palette');
            customPenal.value && baseClass.push('designer-with-penal');
            editorSettings.value.bg === 'grid-image' && baseClass.push('designer-with-bg');
            editorSettings.value.bg === 'image' && baseClass.push('designer-with-image');
            return baseClass.join(' ');
        });
        const getXmlText = async (url) => {
            const res = await axios({
                method: 'get',
                timeout: 120000,
                url,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res;
        };
        const versionBusinessFunction = ref({});
        const showDesigner = ref(false);
        onMounted(async () => {
            if (versionId) {
                // 查询业务版本信息，然后查询功能版本的内容
                let param = {
                    versionId: versionId,
                    page: 1,
                    size: 10
                };
                let res = await businessFunctionVersionService.queryBusinessFunctionPage(param);
                versionBusinessFunction.value = res.versions[0];
                console.log("----------", versionBusinessFunction.value);
                if (versionBusinessFunction.value.bpmnUrl) {
                    // 如果通过一个http地址获取流程图，则直接获取
                    processXml.value = versionBusinessFunction.value.bpmnXml;
                    console.log("获取到的xml", processXml.value);
                }
                showDesigner.value = true;
            }
        });
        /* 组件渲染 */
        return () => (<NConfigProvider abstract componentOptions={{ DynamicInput: { buttonSize: 'small' } }} hljs={hljs}>
                <NDialogProvider>
                    <div class={computedClasses.value} id="designer-container">
                        <NMessageProvider>
                            {showToolbar.value && <Toolbar></Toolbar>}
                            <div class="main-content">
                                {customPalette.value && <Palette></Palette>}
                                {showDesigner.value && <Designer v-model={[processXml.value, 'xml']}></Designer>}
                                {showDesigner.value && <Panel v-model={[versionBusinessFunction.value, 'businessFunctionVersion']}></Panel>}
                            </div>
                            <Setting v-model={[editorSettings.value, 'settings']}></Setting>
                            <ContextMenu></ContextMenu>
                        </NMessageProvider>
                    </div>
                </NDialogProvider>
            </NConfigProvider>);
    }
});
export default Process;
