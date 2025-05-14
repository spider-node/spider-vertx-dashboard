<template>
  <el-dialog
      v-model="dialogVisible"
      title="功能代码信息"
      width="1000"
      style="height: 70%;"
      :before-close="handleClose"
  >
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="业务代码" name="first">
        <div class="code_design">
          <MonacoEditor
              v-model:value="areaFunctionClass"
          ></MonacoEditor>
        </div>
      </el-tab-pane>
      <el-tab-pane 
        v-for="(param, index) in parsedParamClass" 
        :key="'param-' + index" 
        :label="'入参代码 ' + (index + 1)" 
        :name="'param-' + index"
      >
        <div class="code_design">
          <MonacoEditor
              v-model:value="paramValues[index]"
          ></MonacoEditor>
        </div>
      </el-tab-pane>
      <el-tab-pane 
        v-for="(result, index) in parsedResultClass" 
        :key="'result-' + index" 
        :label="'出参代码 ' + (index + 1)" 
        :name="'result-' + index"
      >
        <div class="code_design">
          <MonacoEditor
              v-model:value="resultValues[index]"
          ></MonacoEditor>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import MonacoEditor from "@/components/function/MonacoEditor.vue";
import { ref, onMounted } from "vue";
import coderService from "@/api/ai/coderService";

const emit = defineEmits(['cancel']);
const activeName = ref('first')

const props = defineProps({
  domainVersionId: {
    type: String,
    default: ''
  },
  coderDialogVisible: {
    type: Boolean,
    default: false
  }
})

let coderInfo: CoderInfo

const areaFunctionClass = ref('')
const areaFunctionResultClass = ref('')

const dialogVisible = ref(props.coderDialogVisible)

const handleClose = () => {
  emit('cancel')
}

const parsedParamClass = ref<any[]>([]);
const parsedResultClass = ref<any[]>([]);

// 添加计算属性来存储参数和结果的中间变量
const paramValues = ref<string[]>([]);
const resultValues = ref<string[]>([]);

onMounted(async () => {
  let queryCoderParam = {
    domainFunctionVersionId: props.domainVersionId
  }
  coderInfo = await coderService.getCode(queryCoderParam);
  areaFunctionClass.value = coderInfo.areaFunctionClass;

  parsedParamClass.value = JSON.parse(decodeURIComponent(coderInfo.areaFunctionParamClass));
  parsedResultClass.value = JSON.parse(decodeURIComponent(coderInfo.areaFunctionResultClass));

  // 初始化中间变量
  paramValues.value = [...parsedParamClass.value];
  resultValues.value = [...parsedResultClass.value];

  areaFunctionResultClass.value = coderInfo.areaFunctionResultClass;
})

</script>

<style scoped lang="scss">
.monaco-editor {
  height: 500px;
  width: 100%;
}
</style>