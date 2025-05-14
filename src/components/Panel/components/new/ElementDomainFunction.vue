<template>
  <edit-item :label="$t('panel.domainFunctionName')">
    <n-input v-model:value="functionInfo.domainFunctionName" :disabled="!inputDisable" maxlength="32"
             placeholder="选择功能后呈现" style="width: 450px"/>
  </edit-item>

  <edit-item :label="$t('panel.domainFunctionVersion')">
    <n-input v-model:value="functionInfo.version" :disabled="!inputDisable" placeholder="选择功能后呈现"
             maxlength="32" style="width: 450px"/>
  </edit-item>

  <edit-item :label="$t('panel.domainFunctionDesc')">
    <n-input v-model:value="functionInfo.domainFunctionDesc" :disabled="!inputDisable" placeholder="选择功能后呈现"
             maxlength="32" type="textarea" style="width: 450px"/>
  </edit-item>

  <edit-item :label="$t('panel.taskComponent')">
    <n-input v-model:value="functionInfo.taskComponent" :disabled="!inputDisable" placeholder="选择功能后呈现"
             maxlength="32" style="width: 450px"/>
  </edit-item>

  <edit-item :label="$t('panel.taskService')">
    <n-input v-model:value="functionInfo.taskService" :disabled="!inputDisable" placeholder="选择功能后呈现"
             maxlength="32" style="width: 450px"/>
  </edit-item>

  <edit-item :label="$t('panel.dataSourceId')">
    <n-input v-model:value="functionInfo.datasource_id" :disabled="!inputDisable" placeholder="选择功能后呈现"
             maxlength="32" style="width: 450px"/>
  </edit-item>

  <!--httpUrl-->

  <edit-item :label="$t('panel.httpUrl')" v-if="functionInfo.function_type == 'HTTP_FUNCTION'">
    <n-input v-model:value="functionInfo.http_url" :disabled="!inputDisable" placeholder="选择功能后呈现"
             maxlength="32" style="width: 450px"/>
  </edit-item>

  <n-space vertical>

    <edit-item :label="$t('panel.transactionGroup')" v-if="functionInfo.function_type != 'HTTP_FUNCTION'">
      <n-input v-model:value="functionInfo.transaction_group_id" placeholder="请手动输入"
               maxlength="32" style="width: 450px" @change="updateTransactionGroup"/>
    </edit-item>

    <edit-item :label="$t('panel.functionType')">
      <n-input v-model:value="functionInfo.functionTypeChain" :disabled="!inputDisable" placeholder="选择功能后呈现"
               maxlength="32" style="width: 450px"/>
    </edit-item>

    <edit-item :label="$t('panel.domainFunctionType')">
      <n-select v-model:value="functionInfo.service_task_type" :options="options" @change="updateDomainFunctionType"
                style="width: 450px"/>
    </edit-item>

    <edit-item v-if="functionInfo.service_task_type == 'DELAY'" :label="$t('panel.delay')">
      <n-input v-model:value="functionInfo.delay_time" maxlength="32" placeholder="请输入延迟配置 15"
               @change="updateDelay" style="width: 450px"/>
    </edit-item>

    <edit-item v-if="functionInfo.service_task_type == 'POLL'" :label="$t('panel.poll')">
      <n-input v-model:value="functionInfo.poll_count" placeholder="10/10S 10次间隔10s一次" maxlength="32"
               @change="updatePollConfig" style="width: 450px"/>
    </edit-item>

    <edit-item v-if="functionInfo.service_task_type == 'POLL'" :label="$t('panel.poll_el_expression')">
      <n-input v-model:value="functionInfo.poll_el_expression" placeholder="请输入spring的el表达式" maxlength="32"
               @change="updatePollElExpression" style="width: 450px"/>
    </edit-item>

    <edit-item v-if="functionInfo.service_task_type == 'APPROVE'" :label="$t('panel.approve')">
      <n-input v-model:value="functionInfo.approve_config" maxlength="32" @change="updateApproveConfig"
               style="width: 450px"/>
    </edit-item>

    <edit-item :label="$t('panel.async')">
      <n-switch v-model:value="functionInfo.async" @change="updateAsyncConfig"/>
    </edit-item>
    <div class="operation">
      <n-button type="tertiary" @click="selectDomainFunction">
        选择领域功能
      </n-button>

      <n-button type="tertiary" @click="resetFunctionInfo">
        重置领域功能
      </n-button>

      <n-button type="tertiary" @click="showInputParam">
        入参配置
      </n-button>
    </div>

    <el-drawer v-model="isNodeVShowFalse" title="选择模块功能" :before-close="handleClose" size="1100px">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="模块功能" name="first" v-if="showDomainFunctionVersion">
          <domain-function-versions-v2 @selected-version="selectedFunctionInfo"></domain-function-versions-v2>
        </el-tab-pane>
        <el-tab-pane label="业务功能" name="second" v-if="showBusinessVersion">
          <businessFunctionVersion :is-update="isUpdate"
                                   :is-search="isSearch"
                                   @selected-version="selectedFunctionInfo"></businessFunctionVersion>
        </el-tab-pane>

        <el-tab-pane label="http功能" name="third" v-if="showHttpFunction">
          <HttpFunction :http-id="functionInfo.function_version_id"
                        :is-update="isUpdate"
                        @selected-http-function-to-node="selectedFunctionInfo"
          ></HttpFunction>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>

    <el-dialog
        v-model="showParam"
        title="执行参数配置"
        width="1800"
        style="height: 700px"
        :before-close="paramHandleClose"
    >
      <ParamConfig v-if="showParam" :bpmn-xml="bpmnXml"
                   :param-coder="functionInfo.js_function"
                   :js-function-params="functionInfo.js_function_params"
                   :js-functional-name="functionInfo.js_functional_name"
                   :real-required-node-parameters="functionInfo.real_required_node_parameters"
                   :function-id="functionInfo.function_version_id"
                   :function-type="functionInfo.function_type" @saveJsInfo="saveJsInfo"/>
    </el-dialog>

  </n-space>
</template>

<script setup lang="ts">
import {computed, markRaw, onMounted, ref, toRaw, watch} from "vue";


import {Element} from 'diagram-js/lib/model/Types'
import {addExtensionProperty, getExtensionProperties} from "@/bo-utils/extensionPropertiesUtil";
import EventEmitter from '@/utils/EventEmitter'
import businessFunctionVersion from "@/components/version/BusinessFunctionVersion.vue";
import DomainFunctionVersionsV2 from "@/components/function/DomainFunctionVersionsV2.vue";
import ParamConfig from "@/components/Panel/components/new/ParamConfig.vue";
import HttpFunction from "@/components/http/HttpFunction.vue";
import modelerStore from '@/store/modeler'

const store = modelerStore()
const isSearch = ref<Boolean>(true)
const isUpdate = ref<Boolean>(false)

const showHttpFunction = ref(true)


const handleClose = () => {
  isNodeVShowFalse.value = false
}

const showParam = ref(false)

let bpmnXml: string

const showInputParam = async () => {
  console.log("===")
  const {error, xml} = await store.getModdle!.toXML(store.getModeler!.getDefinitions())
  // 读取异常时抛出异常
  if (error) {
    console.error(`[Process Designer Warn ]: ${error.message || error}`)
  }
  console.log("======222==")
  bpmnXml = xml
  showParam.value = true
  console.log("=======================11111==")
}

const paramHandleClose = () => {
  showParam.value = false
}

const saveJsInfo = (jsInfo: NodeParamConfig) => {
  console.log("保存jsInfo", jsInfo)
  functionInfo.value.js_function = jsInfo.jsFunction
  functionInfo.value.js_functional_name = jsInfo.jsFunctionalName
  functionInfo.value.js_function_params = jsInfo.jsFunctionParams
  functionInfo.value.real_required_node_parameters = jsInfo.realRequiredNodeParameters
  let propertyJsFunction = {
    name: 'js_function',
    value: functionInfo.value.js_function
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyJsFunction))
  let propertyJsFunctionalName = {
    name: 'js_functional_name',
    value: functionInfo.value.js_functional_name
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyJsFunctionalName))
  let propertyJsFunctionParams = {
    name: 'js_function_params',
    value: functionInfo.value.js_function_params
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyJsFunctionParams))
  let propertyRealRequiredNodeParameters = {
    name: 'real_required_node_parameters',
    value: functionInfo.value.real_required_node_parameters
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyRealRequiredNodeParameters))
}

const inputDisable = ref<Boolean>(false)

const showDomainFunctionVersion = ref(true)

const showBusinessVersion = ref(true)

const async = ref<Boolean>(false)

const activeName = ref('')

const options = [
  {
    label: '正常',
    value: 'NORMAL'
  },
  {
    label: '轮询',
    value: 'POLL'
  },
  {
    label: '延迟节点',
    value: 'DELAY'
  },
  {
    label: '审批',
    value: 'APPROVE'
  }
]

const functionTypeOption = [
  {
    label: '业务功能',
    value: 'BUSINESS_FUNCTION'
  },
  {
    label: '领域功能',
    value: 'DOMAIN_FUNCTION'
  },
  {
    label: 'HTTP功能',
    value: 'HTTP_FUNCTION'
  }
]

const extensions = ref<Array<any>>([])

const extensionsRaw = ref<Array<any>>([])

const getActive = computed(() => store.getActive!)

const functionInfo = ref({
  domainFunctionDesc: '',
  domainFunctionName: '',
  version: '',
  taskComponent: '',
  taskService: '',
  service_task_type: '',
  function_type: '',
  functionTypeChain: '',
  async: false,
  delay_time: '',
  poll_count: '',
  approve_config: '',
  function_version_id: '',
  transaction_group_id: '',
  js_functional_name: '',
  js_function_params: '',
  real_required_node_parameters: '',
  js_function: '',
  datasource_id: '',
  poll_el_expression: '',
  http_url: '',
  http_header: '',
  http_type: ''
})

const reloadExtensionProperties = async () => {
  const activeElement = getActive.value
  if (!activeElement) {
    throw new Error('getActive.value is undefined or null')
  }

  const extensionProps = getExtensionProperties(activeElement as Element)

  if (!extensionProps) {
    console.log("没有获取到属性数据")
    return;
  }
  extensionsRaw.value = markRaw(extensionProps)
  extensions.value = JSON.parse(JSON.stringify(extensionsRaw.value))
  console.log("extensionsRaw", extensions.value)

  const propertyMap = {
    domainFunctionDesc: 'domainFunctionDesc',
    domainFunctionName: 'domainFunctionName',
    version: 'version',
    taskComponent: 'taskComponent',
    taskService: 'taskService',
    service_task_type: 'service_task_type',
    function_type: 'function_type',
    functionTypeChain: 'functionTypeChain',
    async: 'async',
    delay_time: 'delay_time',
    poll_count: 'poll_count',
    approve_config: 'approve_config',
    function_version_id: 'function_version_id',
    js_functional_name: 'js_functional_name',
    js_function_params: 'js_function_params',
    real_required_node_parameters: 'real_required_node_parameters',
    js_function: 'js_function',
    transaction_group_id: 'transaction_group_id',
    datasource_id: 'datasource_id',
    poll_el_expression: 'poll_el_expression',
    http_url: 'http_url',
    http_header: 'http_header',
    http_type: 'http_type'
  }

  extensions.value.forEach(item => {
    let realName: string
    if (item.name == 'task-component') {
      realName = 'taskComponent'
    } else if (item.name == 'task-service') {
      realName = 'taskService'
    } else {
      realName = item.name
    }
    const propName = propertyMap[realName]
    console.log("转换后的数据为", propName)
    if (propName) {
      //functionInfo 中属性跟propName一样的，把属性值赋值给functionInfo
      functionInfo.value[propName] = item.value
      if (propName == 'function_type') {
        functionInfo.value.functionTypeChain = functionTypeOption.filter(items => items.value === item.value)[0].label

      }
    }
  })
}

const isNodeVShowFalse = ref<Boolean>(false)

// 更新function功能信息
const selectedFunctionInfo = (value: any) => {
  console.log("selectedFunctionInfo", value)
  functionInfo.value.domainFunctionDesc = value.domainFunctionDesc
  functionInfo.value.domainFunctionName = value.domainFunctionName
  functionInfo.value.version = value.domainFunctionVersion ? value.domainFunctionVersion : '1.0.0'
  functionInfo.value.taskComponent = value.taskComponent ? value.taskComponent : 'default'
  functionInfo.value.taskService = value.taskService ? value.taskService : 'default'
  functionInfo.value.function_version_id = value.functionVersionId
  functionInfo.value.function_type = value.functionType
  functionInfo.value.datasource_id = value.datasourceId
  functionInfo.value.functionTypeChain = functionTypeOption.filter(item => item.value === value.functionType)[0].label

  if (functionInfo.value.function_type == 'HTTP_FUNCTION') {
    functionInfo.value.http_url = value.httpUrl
    let propertyHttpUrl = {
      name: 'http_url',
      value: functionInfo.value.http_url
    }
    addExtensionProperty(getActive.value as Element, toRaw(propertyHttpUrl))
    functionInfo.value.http_type = value.httpType
    let propertyHttpType = {
      name: 'http_type',
      value: functionInfo.value.http_type
    }
    addExtensionProperty(getActive.value as Element, toRaw(propertyHttpType))
    if (value.httpHeader) {
      let httpHeaders = {}
      // 遍历value.httpHeader
      value.httpHeader.forEach(item => {
        // 把key与value装入httpHeaders
        httpHeaders[item.key] = item.value
      })
      functionInfo.value.http_header = JSON.stringify(httpHeaders)
      let propertyHttpHeader = {
        name: 'http_header',
        value: functionInfo.value.http_header
      }
      addExtensionProperty(getActive.value as Element, toRaw(propertyHttpHeader))
    }
  }

  let propertyDomainFunctionDesc = {
    name: 'domainFunctionDesc',
    value: functionInfo.value.domainFunctionDesc
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyDomainFunctionDesc))
  let propertyDomainFunctionName = {
    name: 'domainFunctionName',
    value: functionInfo.value.domainFunctionName
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyDomainFunctionName))
  let propertyDomainFunctionVersion = {
    name: 'version',
    value: functionInfo.value.version
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyDomainFunctionVersion))

  let propertyTaskComponent = {
    name: 'task-component',
    value: functionInfo.value.taskComponent
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyTaskComponent))


  let propertyTaskService = {
    name: 'task-service',
    value: functionInfo.value.taskService
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyTaskService))

  let propertyFunctionVersionId = {
    name: 'function_version_id',
    value: functionInfo.value.function_version_id
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyFunctionVersionId))

  let propertyFunctionType = {
    name: 'function_type',
    value: functionInfo.value.function_type
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyFunctionType))

  let propertyDatasourceId = {
    name: 'datasource_id',
    value: functionInfo.value.datasource_id
  }
  addExtensionProperty(getActive.value as Element, toRaw(propertyDatasourceId))

  isNodeVShowFalse.value = false
  reloadExtensionProperties()
  selectedBefore()
}

const updateDomainFunctionType = (value: string) => {
  // 等到双向绑定完成在执行
  functionInfo.value.service_task_type = value
  console.log("updateDomainFunctionType", functionInfo.value.service_task_type)
  let property = {
    name: 'service_task_type',
    value: functionInfo.value.service_task_type
  }
  addExtensionProperty(getActive.value as Element, toRaw(property))
  reloadExtensionProperties()
}

const updateTransactionGroup = (value: string) => {
  functionInfo.value.transaction_group_id = value
  let property = {
    name: 'transaction_group_id',
    value: functionInfo.value.transaction_group_id
  }
  addExtensionProperty(getActive.value as Element, toRaw(property))
  reloadExtensionProperties()
}

const updateDelay = () => {
  let property = {
    name: 'delay_time',
    value: functionInfo.value.delay_time
  }
  addExtensionProperty(getActive.value as Element, toRaw(property))
  reloadExtensionProperties()
}

const updatePollConfig = () => {
  let property = {
    name: 'poll_count',
    value: functionInfo.value.poll_count
  }
  addExtensionProperty(getActive.value as Element, toRaw(property))
  reloadExtensionProperties()
}

const updatePollElExpression = () => {
  let property = {
    name: 'poll_el_expression',
    value: functionInfo.value.poll_el_expression
  }
  addExtensionProperty(getActive.value as Element, toRaw(property))
  reloadExtensionProperties()
}

const updateApproveConfig = () => {
  let property = {
    name: 'approve_config',
    value: functionInfo.value.approve_config
  }
  addExtensionProperty(getActive.value as Element, toRaw(property))
  reloadExtensionProperties()
}

// 监听是否异步
watch(
    () => functionInfo.value.async,
    (newValue, oldValue) => {
      let property = {
        name: 'async',
        value: functionInfo.value.async
      }
      console.log("updateAsync", functionInfo.value.async, getActive.value)
      addExtensionProperty(getActive.value as Element, toRaw(property))
      reloadExtensionProperties()
    }
)

const updateAsyncConfig = () => {
  let property = {
    name: 'async',
    value: functionInfo.value.async
  }
  console.log("updateAsync", functionInfo.value.async)
  addExtensionProperty(getActive.value as Element, toRaw(property))
  reloadExtensionProperties()
}

const selectDomainFunction = () => {
  isNodeVShowFalse.value = true
  if (functionInfo.value.function_type) {
    if (functionInfo.value.function_type === 'BUSINESS_FUNCTION') {
      activeName.value = 'second'
    } else {
      activeName.value = 'first'
    }
  }
}

const resetFunctionInfo = () => {
  showBusinessVersion.value = true
  showDomainFunctionVersion.value = true
  showHttpFunction.value = true
  activeName.value = 'first'
  functionInfo.value.function_version_id = ''
  isNodeVShowFalse.value = true
}

const selectedBefore = () => {
  if (functionInfo.value.function_type) {
    if (functionInfo.value.function_type == 'BUSINESS_FUNCTION') {
      showDomainFunctionVersion.value = false
      showHttpFunction.value = false
      showBusinessVersion.value = true
      activeName.value = 'second'
    } else if (functionInfo.value.function_type == 'DOMAIN_FUNCTION') {
      showDomainFunctionVersion.value = true
      showHttpFunction.value = false
      showBusinessVersion.value = false
      activeName.value = 'first'
    } else if (functionInfo.value.function_type == 'HTTP_FUNCTION') {
      showDomainFunctionVersion.value = false
      showBusinessVersion.value = false
      showHttpFunction.value = true
      activeName.value = 'third'
    }
  } else {
    activeName.value = 'first'
  }
}

onMounted(() => {
  reloadExtensionProperties()
  //selectedBefore()
  activeName.value = 'first'
  EventEmitter.on('element-update', reloadExtensionProperties)
})

</script>

<style scoped lang="scss">
.operation {
  display: flex;
  // 按钮，横向紧凑排列新增一些间距
  .n-button {
    margin-right: 8px;
  }
}
</style>