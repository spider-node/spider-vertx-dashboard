<template>
  <n-collapse-item name="base-info">
    <template #header>
      <collapse-title :title="$t('panel.general')">
        <lucide-icon name="Info"/>
      </collapse-title>
    </template>

    <edit-item :label="$t('panel.id')">
      <n-input v-model:value="elementId" maxlength="32" @change="updateElementId"/>
    </edit-item>

    <edit-item :label="$t('panel.name')">
      <n-input v-model:value="elementName" maxlength="20" @change="updateElementName"/>
    </edit-item>

    <template v-if="isProcess">
      <!--      <edit-item key="version" :label="$t('panel.version')">
              <n-input v-model:value="elementVersion" maxlength="20" @change="updateElementVersion" />
            </edit-item>-->

      <edit-item key="executable" :label="$t('panel.executable')">
        <!--        <n-switch v-model:value="elementExecutable" @update:value="updateElementExecutable" />-->
        <n-button type="primary" @click="updateBpmn">
          保存流程
        </n-button>
      </edit-item>

      <edit-item key="executable" :label="$t('panel.executable')">
        <!--        <n-switch v-model:value="elementExecutable" @update:value="updateElementExecutable" />-->
        <n-button type="primary" @click="showFunction">
          返回功能界面
        </n-button>
      </edit-item>

      <edit-item key="executable" :label="$t('panel.executable')">
        <!--        <n-switch v-model:value="elementExecutable" @update:value="updateElementExecutable" />-->
        <n-button type="primary" @click="createNodeJsParam">
          ai生成全局参数解析
        </n-button>
      </edit-item>

      <edit-item key="executable" :label="$t('panel.executable')">
        <!--        <n-switch v-model:value="elementExecutable" @update:value="updateElementExecutable" />-->
        <n-button type="primary" @click="refreshBusinessModel">
          刷新业务模型
        </n-button>
      </edit-item>

      <edit-item key="executable" :label="$t('panel.executable')">
        <!--        <n-switch v-model:value="elementExecutable" @update:value="updateElementExecutable" />-->
        <n-button type="primary" @click="showLog">
          查看日志
        </n-button>
      </edit-item>

      <edit-item key="executable" :label="$t('panel.executable')">
        <!--        <n-switch v-model:value="elementExecutable" @update:value="updateElementExecutable" />-->
        <n-button type="primary" @click="showStartTest">
          发起测试
        </n-button>
      </edit-item>
    </template>
  </n-collapse-item>

  <el-drawer v-model="drawer" title="日志信息" :with-header="false">
    <span>Hi there!</span>
  </el-drawer>

  <el-dialog v-model="dialogTableVisible" width="1200" style="height: 750px">
    <RunTimeLog v-if="dialogTableVisible" :function-id="functionId"></RunTimeLog>
  </el-dialog>

  <el-dialog v-model="showTestVisible" width="1200" style="height: 650px">
    <StartFunctionTest v-if="showTestVisible"></StartFunctionTest>
  </el-dialog>

</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {mapState} from 'pinia'
import modelerStore from '@/store/modeler'
import {Element} from 'diagram-js/lib/model/Types'
import {getNameValue, setNameValue} from '@/bo-utils/nameUtil'
import {setIdValue} from '@/bo-utils/idUtil'
import fileOperate from "@/api/file/fileOperate";
import RunTimeLog from "@/views/log/RunTimeLog.vue";
import {
  getProcessExecutable,
  getProcessVersionTag,
  setProcessExecutable,
  setProcessVersionTag
} from '@/bo-utils/processUtil'
import EventEmitter from '@/utils/EventEmitter'
import {setEncoded} from "@/utils/files";
import {ElMessage} from "element-plus";
import businessFunctionVersionService from "@/api/function/businessFunctionVersionService";
import router from "@/router";
import MonacoEditor from "@/components/function/MonacoEditor.vue";
import StartFunctionTest from "@/components/Panel/components/new/StartFunctionTest.vue";

export default defineComponent({
  name: 'ElementGenerations',
  components: {StartFunctionTest, MonacoEditor, RunTimeLog},
  data() {
    return {
      elementId: '',
      elementName: '',
      elementVersion: '',
      elementExecutable: true,
      isProcess: false,
      dialogTableVisible: false,
      functionId: '',
      showTestVisible: false,
      jsonInput: '{}',
      activeName: '入参代码1',
      startEventId: '' // 新增 startEventId 属性
    }

  },
  computed: {
    ...mapState(modelerStore, ['getActive', 'getActiveId', 'getBFVersion', 'getModeler'])
  },
  mounted() {
    this.reloadGenerationData()
    EventEmitter.on('element-update', this.reloadGenerationData)
    this.functionId = this.getBFVersion.functionId
  },
  methods: {
    reloadGenerationData() {
      this.isProcess = !!this.getActive && this.getActive.type === 'bpmn:Process'
      this.elementId = this.getActiveId as string
      this.elementName = getNameValue(this.getActive as Element) || ''
      if (this.isProcess) {
        this.elementExecutable = getProcessExecutable(this.getActive as Element)
        this.elementVersion = getProcessVersionTag(this.getActive as Element) || ''
        //this.startEventId = this.getStartEventId() // 获取 startEvent 的 id
      }
    },

    showStartTest() {
      this.showTestVisible = true
    },

    showLog() {
      this.dialogTableVisible = true
    },

    updateElementName(value: string) {
      setNameValue(this.getActive as Element, value)
    },

    // 跳转到功能界面
    showFunction() {
      router.push({
        path: 'functions',
      })
    },

    async createNodeJsParam() {
      const functionVersion = this.getBFVersion
      let createNodeJsParam = {
        functionVersionId: functionVersion.id
      }
      businessFunctionVersionService.aiGenerateBusinessJsParam(createNodeJsParam).then(res => {
        ElMessage.success("ai生成全局参数解析成功,稍后查看各个节点的js参数信息")
        // 注册
      })

    },

    async refreshBusinessModel() {
      const functionVersion = this.getBFVersion
      businessFunctionVersionService.brushBpmn({functionVersionId: functionVersion.id}).then(res => {
        ElMessage.success("刷新成功")
      })
    },

    updateElementId(value: string) {
      setIdValue(this.getActive as Element, value)
    },

    async updateBpmn() {
      await this.downloadProcess('bpmn');
    },

    async downloadProcess(type: string, name = 'diagram') {
      try {
        const modeler = this.getModeler;
        // 增加对 modeler 的校验
        if (!modeler) {
          throw new Error('[Process Designer Warn]: Modeler is not initialized.');
        }

        // 获取modeler中所有的服务任务
        const serviceTaskElements = modeler.getDefinitions().rootElements[0].flowElements.filter(
            (element: any) => element.$type === 'bpmn:ServiceTask'
        );
        const nodeInfos = [];
        // 遍历serviceTaskElements 获取扩展属性根据property.name赋值到NodeInfo中
        serviceTaskElements.forEach((element: any) => {
          // 获取扩展属性
          const extensionElements = element.extensionElements;
          // 获取扩展属性中的属性
          const properties = extensionElements?.values[0].values;
          // 遍历properties根据property.name,property.value给到json中
          const json = {};
          properties.forEach((property: any) => {
            json[property.name] = property.value;
          });
          const nodeInfo = {
            id: element.id,
            name: element.name,
            ...json
          }
          nodeInfos.push(nodeInfo)
        })
        // 按需要类型创建文件并下载
        if (type === 'xml' || type === 'bpmn') {
          const {error, xml} = await modeler.saveXML({});
          // 读取异常时抛出异常
          if (error) {
            console.error(`[Process Designer Warn ]: ${error.message || error}`);
          }
          const {href, filename} = setEncoded(type.toUpperCase(), name, xml!);
          await this.fetchFileStream(href, filename, xml, nodeInfos);
        } else {
          ElMessage.error('请选择正确的文件类型')
        }
      } catch (e: any) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`);
      }
    },

    async fetchFileStream(href: string, filename: string, bpmnXml: string, nodeInfos: []) {
      try {
        const response = await fetch(href);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const blob = await response.blob();
        // 创建FormData对象并添加文件
        const formData = new FormData();
        formData.append('file', blob, filename);
        // 假设Java提供的文件保存API是一个POST请求，URL为/saveFile
        let res = await fileOperate.upload(formData)
        let patch = res.patch
        console.log("返回的路径为", patch)
        const functionVersion = this.getBFVersion
        const startId = this.getStartEventId()
        // 获取模型中start event
        const elementNameNew = getNameValue(this.getActive as Element) || ''

        let updateParam = {
          // 如何selectedFunctionVersion的属性放到updateParam中
          ...functionVersion,
          bpmnName: elementNameNew,
          bpmnUrl: patch,
          startEventId: startId,
          bpmnXml: bpmnXml,
          nodeInfos: {
            nodeInfos: nodeInfos
          }
        }
        businessFunctionVersionService.addFunctionVersion(updateParam).then(res => {
          ElMessage.success("保存成功")
        });

        // 进行修改-保存到功能当中
      } catch (error) {
        console.error('Error fetching or saving file:', error);
      }
    },

    getStartEventId(): string {
      const modeler = this.getModeler;
      if (!modeler) {
        return '';
      }
      const startEvent = modeler.getDefinitions().rootElements[0].flowElements.find(
        (element: any) => element.$type === 'bpmn:StartEvent'
      );
      return startEvent ? startEvent.id : '';
    },

    updateElementVersion(value: string) {
      const reg = /((\d|([1-9](\d*))).){2}(\d|([1-9](\d*)))/
      if (reg.test(value)) {
        setProcessVersionTag(this.getActive as Element, value)
      } else {
        window.__messageBox.error('版本号必须符合语义化版本2.0.0 要点')
      }
    },
    updateElementExecutable(value: boolean) {
      setProcessExecutable(this.getActive as Element, value)
    }
  }
})
</script>

<style scoped lang="scss">
// 设置 class test_info中 test_input与 param_code 纵向排列,test_input占宽度百分之30，param_code占宽度百分之70 纵向排列
.test_info {
  display: flex;
  flex-direction: column;
  .test_input {
    width: 30%;
  }
  .param_code {
    width: 70%;
  }

}
</style>
