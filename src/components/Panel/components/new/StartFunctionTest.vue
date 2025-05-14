<template>
  <!--json输入框内容-->
  <div class="operate">
    <el-button type="primary" @click="startTest">
      发起测试
    </el-button>
  </div>
  <div class="test_info">
    <div class="test_input">
      <JsonContainer :json-data="jsonInput" @update-model-value ="updateParam"></JsonContainer>
    </div>
    <div class="param_code">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane
            v-for="(param, index) in inputParamJavaClass"
            :key="'param-' + index"
            :label="'入参代码' + (index + 1)"
            :name="'param-' + index"
        >
          <MonacoEditor
              v-model:value="inputParamJavaClass[index]"
          ></MonacoEditor>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">

import MonacoEditor from "@/components/function/MonacoEditor.vue";
import modelerStore from '@/store/modeler'
import {onMounted} from "vue";
import JsonContainer from "@/components/function/JsonContainerV2.vue";
import businessFunctionVersionService from "@/api/function/businessFunctionVersionService";
import {ElMessage} from "element-plus";
const store = modelerStore()

const jsonInput = ref({})

const activeName = ref('param-1')
const inputParamJavaClass = ref([])
let functionId: string

const updateParam = (data: object) => {
  jsonInput.value = data
}

const startTest = () => {
  let startParam = {
    functionId: functionId,
    request: jsonInput.value
  }

  businessFunctionVersionService.startTest(startParam).then(res => {
    ElMessage.success("执行成功请查看日志")
  })
}
onMounted(()=>{
  inputParamJavaClass.value = store.getBFVersion.inputParamJavaClass
  functionId = store.getBFVersion.id
})

</script>

<style scoped lang="scss">
// test_info的高度为650,test_input与param_code纵向排列 ，test_input 宽度百分30%,param_code宽度百分70%
.operate{
  // 设置下边距
  margin-bottom: 25px;
}
.test_info {
  display: flex;
  height: 650px;
  .test_input {
    width: 40%;
    margin-right: 20px;
    height: 650px;
  }
  .param_code {
    width: 70%;
    height: 650px;
  }
}

.monaco-editor {
  height: 500px;
  width: 100%;
}
</style>