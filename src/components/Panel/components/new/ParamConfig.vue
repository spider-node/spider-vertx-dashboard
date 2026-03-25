<template>
  <div class="param_config">
    <div class="param">
      <div class="operation_param">
        <el-button type="primary" @click="saveParamInfo">保存</el-button>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane
            v-for="(param, index) in inputParamClass"
            :key="'param-' + index"
            :label="'入参代码' + (index + 1)"
            :name="'param-' + index"
        >
          <div class="code_design">
            <MonacoEditor
                v-model:value="paramValues[index]"
            ></MonacoEditor>
          </div>
        </el-tab-pane>
        <el-tab-pane label="js构建入参" name="second">
          <div class="operation">
            <el-button type="primary" @click="addParamTransfer">ai生成</el-button>
            <el-button type="primary" @click="showJsFunction">查看函数列表</el-button>
            <el-button type="primary" @click="automatchJsFunction">自动匹配函数</el-button>
          </div>
          <div class="code_design">
            <MonacoEditor v-if="showNodeJsCoder"
                          v-model:value="jsCoderInfo.jsFunction"
                          @code_update="(code) => updateJsCoder(code)"
            ></MonacoEditor>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
    <div class="reference">
      <!--流程组件-->
      <div
          ref="container"
          id="container"
          class="main_container">
      </div>
    </div>
  </div>

  <el-dialog
      v-model="showNodeCode"
      title="节点代码展示"
      width="700"
      :before-close="showNodeCodeHandleClose"
  >
    <el-tabs v-model="selectedActiveName" class="demo-tabs" v-if="showNodeCode">
      <el-tab-pane
          v-for="(param, index) in selectedOutPutParam"
          :key="'param-' + index"
          :label="'出参代码' + (index + 1)"
          :name="'param-' + index"
      >
        <div class="code_design">
          <MonacoEditor
              v-model:value="selectedParamValues[index]"
          ></MonacoEditor>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>

  <el-dialog
      v-model="jsFunctionDialogVisible"
      title="js函数列表"
      width="900"
      :before-close="jsFunctionHandleClose"
  >
    <div class="js_list">
      <div class="title">
        <!---el-text中设置selectedNodeId这个变量-->
        <el-text class="mx-1" type="primary"> nodeId-{{ selectedNodeId }}</el-text>
      </div>
      <div class="tables">
        <el-table :data="nodeParamConfigList" style="width: 100%">
          <el-table-column prop="nodeId" label="节点id" width="180"/>
          <el-table-column prop="nodeName" label="参数名称" width="180"/>
          <el-table-column prop="jsFunctionalName" label="js函数名称" width="180"/>
          <el-table-column prop="realRequiredNodeParameters" label="参数列表" width="180"/>
          <el-table-column
              prop="date"
              label="操作"
          >
            <template #default="scope">
              <el-button
                  link
                  type="primary"
                  size="small"
                  @click="showJsCoder(scope.row)"
              >查看js代码
              </el-button>

              <el-button
                  link
                  type="primary"
                  size="small"
                  @click="selectedJsFunction(scope.row)"
              >选择
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
  </el-dialog>
  <el-dialog
      v-model="showFunctionCoderVisible"
      title="js代码展示"
      width="700"
      :before-close="showFunctionCoderHandleClose"
  >
    <MonacoEditor v-if="showFunctionCoderVisible"
                  v-model:value="selectedJsCode"
                  @code_update="(code) => updateJsCoder(code)"
    ></MonacoEditor>
  </el-dialog>

  <el-dialog
      v-model="aiGeneratedParamsDialogVisible"
      title="ai生成入参js"
      width="700"
      :before-close="aiGeneratedParamsHandleClose"
  >
    <div class="input-list">
      <el-input
          v-for="(param, index) in aiGeneratedParams"
          :key="index"
          v-model="aiGeneratedParams[index]"
          placeholder="请输入参数"
      >
        <template #append>
          <el-button @click="removeAiGeneratedParam(index)">删除</el-button>
        </template>
      </el-input>
      <el-button @click="addAiGeneratedParam">新增参数</el-button>
      <el-button @click="startNodeJsParamCreate">发起生成</el-button>
    </div>
  </el-dialog>

</template>

<script setup lang="ts">
// 弹窗出来展示
import {onMounted, type PropType, ref, toRef} from "vue";
import initModeler from "@/components/Panel/components/new/modeler/initReferenceModeler";
import Modeler from "bpmn-js/lib/Modeler";
import Logger from "@/utils/Logger";
import businessFunctionVersionService from "@/api/function/businessFunctionVersionService";
import debounce from "lodash.debounce";
import {Connection, Element, Label, Shape} from "diagram-js/lib/model/Types";
import {isExtendTask} from "@/bo-utils/conditionUtil";
import {getExtensionProperties} from "@/bo-utils/extensionPropertiesUtil";
import editor from "@/store/editor";
import {storeToRefs} from "pinia";
import modulesAndModdle from "@/components/Designer/modulesAndModdle";

import MonacoEditor from "@/components/function/MonacoEditor.vue";
import coderService from "@/api/ai/coderService";
import {ElMessage} from "element-plus";
import modelerStore from '@/store/modeler'

const store = modelerStore()
const emit = defineEmits(['saveJsInfo']);

const props = defineProps({
  paramCoder: {
    type: String,
    default: ''
  },
  jsFunctionalName: {
    type: String,
    default: ''
  },
  jsFunctionParams: {
    type: String,
    default: ''
  },
  realRequiredNodeParameters: {
    type: String,
    default: ''
  },
  paramDesc: {
    type: Object,
    default: []
  },
  bpmnXml: {
    type: String as PropType<string>,
    default: undefined
  },
  functionId: {
    type: String,
    default: ''
  },
  functionType: {
    type: String,
    default: ''
  }
})

const startNodeJsParamCreate = () => {
  let aiCreateJsParam = {
    nodeId: selectedNodeId,
    paramJsDemand: aiGeneratedParams.value,
    functionVersionId: parasitiferFunctionVersionId,
  }
  businessFunctionVersionService.aiGenerateBusinessJsParam(aiCreateJsParam).then((res: any) => {
    ElMessage.success("发起ai生成本节点参数,请稍重置js信息")
    aiGeneratedParamsDialogVisible.value = false
  })

}

const aiGeneratedParamsDialogVisible = ref(false)

const aiGeneratedParamsHandleClose = () => {
  aiGeneratedParamsDialogVisible.value = false
}

const aiGeneratedParams = ref<string[]>([])

const addAiGeneratedParam = () => {
  aiGeneratedParams.value.push('')
}

const removeAiGeneratedParam = (index: number) => {
  aiGeneratedParams.value.splice(index, 1)
}

const addParamTransfer = () => {
  aiGeneratedParamsDialogVisible.value = true
}

const showNodeCode = ref(false)

const showNodeCodeHandleClose = () => {
  showNodeCode.value = false
}

const container = ref<HTMLElement>();

const nodeParamConfigList = ref([])

const jsFunctionDialogVisible = ref(false)

const jsFunctionHandleClose = () => {
  jsFunctionDialogVisible.value = false
}

const showFunctionCoderVisible = ref(false)

const showFunctionCoderHandleClose = () => {
  showFunctionCoderVisible.value = false
}

const selectedJsCode = ref('')

const jsCoderInfo = ref<NodeParamConfig>({
  nodeId: '',
  nodeName: '',
  jsFunction: '',
  jsFunctionalName: '',
  jsFunctionParams: '',
  realRequiredNodeParameters: ''
})

const showJsCoder = (row: any) => {
  selectedJsCode.value = row.jsFunction
  showFunctionCoderVisible.value = true
}

const showNodeJsCoder = ref(false)

const selectedJsFunction = (row: NodeParamConfig) => {
  jsCoderInfo.value = row
  showNodeJsCoder.value = true;
  saveParamInfo()
  jsFunctionDialogVisible.value = false
}

const updateJsCoder = (coder: string) => {
  console.log('updateJsCoder', coder)
  jsCoderInfo.value.jsFunction = coder
}


// 保存参数信息
const saveParamInfo = () => {
  console.log('saveParamInfo', jsCoderInfo.value)
  emit('saveJsInfo', jsCoderInfo.value)
  ElMessage.success("保存成功")
}

let parasitiferFunctionVersionId = store.getBFVersion.id
const showJsFunction = () => {
  let param = {
    versionId: parasitiferFunctionVersionId,
    page: 1,
    size: 10
  }
  businessFunctionVersionService.queryBusinessFunctionPage(param).then(res => {
    let version: FunctionVersion = res.versions[0]
    if(version.nodeParamInfo){
      nodeParamConfigList.value = version.nodeParamInfo.nodeParamConfigList
      jsFunctionDialogVisible.value = true
      return
    }
    ElMessage.info("没有参数配置")

  })
}

const automatchJsFunction = () => {
  let param = {
    versionId: parasitiferFunctionVersionId,
    page: 1,
    size: 10
  }
  businessFunctionVersionService.queryBusinessFunctionPage(param).then(res => {
    let version: FunctionVersion = res.versions[0]
    nodeParamConfigList.value = version.nodeParamInfo.nodeParamConfigList
    // 遍历 nodeParamConfigList.value 获取nodeId 跟 selectedNodeId 一样的数据
    for (let i = 0; i < nodeParamConfigList.value.length; i++) {
      if (nodeParamConfigList.value[i].nodeId === selectedNodeId) {
        let nodeParamConfig: NodeParamConfig = nodeParamConfigList.value[i]
        selectedJsFunction(nodeParamConfig)
        ElMessage.success('自动匹配成功')
        return
      }
    }
  })
}


const paramDescs = toRef(props, 'paramDesc')

const addParamDesc = () => {
  paramDescs.value.push({
    value: ''
  })
}

function removeInput(index) {
  if (paramDescs.value.length > 1) {
    // 确保至少保留一个输入框
    paramDescs.value.splice(index, 1);
  }
}


const showCoderVisible = ref(false)


const activeName = ref('second')

const selectedActiveName = ref('param-0')


const bpmnXml = toRef(props, 'bpmnXml')
let modeler: Modeler

const settingEvent = () => {
  // 监听选择事件，修改当前激活的元素以及表单
  // 监听选择事件，修改当前激活的元素以及表单
  modeler.on('selection.changed', ({newSelection}) => {
    handlerElement(newSelection[0] || null)
  })
}

const selectedOutPutParam = ref([])

const selectedParamValues = ref<string[]>([])


const handlerElement = debounce((element: Shape | Element | Connection | Label | null) => {
  let activatedElement: BpmnElement | undefined = element

  if (!activatedElement) {
    activatedElement =
        modeler.getElRegistry?.find((el) => el.type === 'bpmn:Process') ||
        modeler.getElRegistry?.find((el) => el.type === 'bpmn:Collaboration')
    if (!activatedElement) {
      return Logger.prettyError('No Element found!')
    }
  }
  if (isExtendTask(activatedElement)) {
    // 说明是节点信息
    const extensionProps = getExtensionProperties(activatedElement as Element)
    let functionVersionId = ''
    let functionType = ''
    extensionProps.forEach(item => {
      if (item.name == 'function_version_id') {
        functionVersionId = item.value
      }
      if (item.name == 'function_type') {
        functionType = item.value
      }
    })
    if (functionType == 'BUSINESS_FUNCTION') {
      let param = {
        versionId: functionVersionId,
        page: 1,
        size: 10
      }
      businessFunctionVersionService.queryBusinessFunctionPage(param).then(res => {
        let version: FunctionVersion = res.versions[0]
        selectedOutPutParam.value = JSON.parse(decodeURIComponent(version.resultClass));
        selectedParamValues.value = [...selectedOutPutParam.value];
      })
    } else {
      // 查询领域功能版本
      let queryCoderParam = {
        domainFunctionVersionId: functionVersionId
      }
      coderService.getCode(queryCoderParam).then(res => {
        let coderInfo: CoderInfo = res;
        selectedOutPutParam.value = JSON.parse(decodeURIComponent(coderInfo.areaFunctionResultClass));
        selectedParamValues.value = [...selectedOutPutParam.value];
        console.log("参数信息为", selectedParamValues.value)
      });
    }
    showNodeCode.value = true
  }
}, 100)

const paramValues = ref<string[]>([]);

const inputParamClass = ref([])
const queryDomainFunctionVersionParamCoder = () => {
  let queryCoderParam = {
    domainFunctionVersionId: props.functionId
  }
  coderService.getCode(queryCoderParam).then(res => {
    let coderInfo: CoderInfo = res;
    inputParamClass.value = JSON.parse(decodeURIComponent(coderInfo.areaFunctionParamClass));
    paramValues.value = [...inputParamClass.value];
  });
}

const queryFunctionVersionCoder = () => {
  let param = {
    versionId: props.functionId,
    page: 1,
    size: 10
  }
  businessFunctionVersionService.queryBusinessFunctionPage(param).then(res => {
    let version: FunctionVersion = res.versions[0]
    inputParamClass.value = JSON.parse(decodeURIComponent(version.runClass));
    paramValues.value = [...inputParamClass.value];
  })
}

const initMiniModeler = async () => {
  const editorStore = editor()
  const {editorSettings} = storeToRefs(editorStore)
  const modelerModules = modulesAndModdle(editorSettings)
  modeler = await initModeler(container, modelerModules)
  await modeler.importXML(bpmnXml.value)
}
let selectedNodeId: string

onMounted(async () => {
  await initMiniModeler()
  if (props.functionId) {
    if (props.functionType == 'DOMAIN_FUNCTION') {
      // functionId 如果存在，调用接口查询回参数。
      queryDomainFunctionVersionParamCoder();
    } else {
      queryFunctionVersionCoder();
    }
  }

  selectedNodeId = store.getActiveId
  let jsCoders = props.paramCoder;
  if (jsCoders) {
    jsCoderInfo.value.jsFunction = jsCoders;
    jsCoderInfo.value.jsFunctionalName = props.jsFunctionalName;
    jsCoderInfo.value.jsFunctionParams = props.jsFunctionParams;
    jsCoderInfo.value.realRequiredNodeParameters = props.realRequiredNodeParameters;
    console.log("jsCoderInfo.value", jsCoderInfo.value)
    showNodeJsCoder.value = true;
  }
  // 监听点击的事件
  settingEvent()
})


</script>

<style scoped lang="scss">
.param_config {
  user-select: text;
  // 设置param 与 reference水平排列，param宽度百分之35,reference 宽度百分之65
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

  .param {
    width: 36%;
    height: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-right: 10px;
    padding: 10px;
    box-sizing: border-box;

    .monaco-editor {
      height: 500px;
      width: 100%;
    }

    .operation {
      margin-bottom: 10px;
    }

    .tables {
      // 设置表格中的内容超出高度时，显示滚动条
      overflow-y: auto;
      height: 500px;

      .el-table {
        height: 100%;
      }
    }
  }

  .reference {
    width: 64%;
    height: 100%;
    // 设置 main_container与node_param 竖向分割 main_container宽度占百分之70%,node_param宽度占百分之30%

    display: flex;
    flex-direction: row;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    box-sizing: border-box;

    .main_container {
      width: 100%;
      height: 600px;
      border: 1px solid #dcdfe6;
      margin-right: 10px;
      box-sizing: border-box;
    }
  }
}

.monaco-editor {
  height: 500px;
  width: 100%;
}

.js_list {
  height: 500px;
  // 设置 title与tables
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tables {
    height: 450px;

    .el-table {
      height: 100%;
    }
  }
}

</style>
