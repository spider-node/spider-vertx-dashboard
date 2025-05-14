<template>
  <div class="operate">
    <el-button @click="showInputParam">设置条件函数</el-button>
  </div>


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
                 @saveJsInfo="saveJsInfo"/>
  </el-dialog>

</template>

<script setup lang="ts">

import ParamConfig from "@/components/Panel/components/new/ParamConfig.vue";
import {addExtensionProperty, getExtensionProperties} from "@/bo-utils/extensionPropertiesUtil";
import {Element} from "diagram-js/lib/model/Types";
import {computed, markRaw, onMounted, ref, toRaw} from "vue";
import modelerStore from '@/store/modeler'

const store = modelerStore()
const getActive = computed(() => store.getActive!)

const showParam = ref(false)

let bpmnXml: string

const paramHandleClose = () => {
  showParam.value = false
}


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
  js_functional_name: '',
  js_function_params: '',
  real_required_node_parameters: '',
  js_function: ''
})

const extensions = ref<Array>([])

const extensionsRaw = ref<Array>([])

const propertyMap = {
  js_functional_name: 'js_functional_name',
  js_function_params: 'js_function_params',
  real_required_node_parameters: 'real_required_node_parameters',
  js_function: 'js_function'
}

// 获取属性
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
  // 判断 extensions.value是否为数组
  if (!Array.isArray(extensions.value)) {
    console.log("extensions.value 不是数组")
    return;
  }
  extensions.value.forEach(item => {
    const propName: string = propertyMap[item.name]
    console.log("extensions.value 是数组", propName)
    if (propName) {
      //functionInfo 中属性跟propName一样的，把属性值赋值给functionInfo
      functionInfo.value[propName] = item.value
    }
  })
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
  // TODO 通知后端，该函数，重置
  resetFunctionInfo()
}

// 新增一个函数把functionInfo的值都设置成默认值
const resetFunctionInfo = () => {
  functionInfo.value = {
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
    js_functional_name: '',
    js_function_params: '',
    real_required_node_parameters: '',
    js_function: ''
  }
}

onMounted(() => {
  reloadExtensionProperties()
})
</script>

<style scoped lang="scss">

</style>