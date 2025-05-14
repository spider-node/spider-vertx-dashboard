<template>
  <el-dialog
      v-model="dialogVisible"
      title="功能代码信息"
      width="900"
      :before-close="handleClose"
  >
    <div class="coder_data">
      <div class="coder_info">
        <el-button type="primary" @click="saveCoder">保存部署</el-button>
<!--        <el-button type="primary" @click="deployCoder">保存部署</el-button>-->
        <el-tabs v-model="activeName" class="demo-tabs" v-if="showTables">
          <el-tab-pane label="业务代码" name="first">
            <div class="code_design">
              <MonacoEditor
                  v-model:value="areaFunctionClass"
                  @code_update="(code) => updateFunctionClassCode(code)"
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
                  @code_update="(code) => updateCodeParam(code,index)"
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
                  @code_update="(code) => updateCodeResult(code,index)"
              ></MonacoEditor>
            </div>
          </el-tab-pane>

          <el-tab-pane
              v-for="(otherClas, index) in otherClass"
              :key="'other-' + index"
              :label="'其他代码 ' + (index + 1)"
              :name="'other-' + index"
          >
            <div class="code_design">
              <MonacoEditor
                  v-model:value="otherClassValues[index]"
                  @code_update="(code) => updateOtherClass(code,index)"
              ></MonacoEditor>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
<!--      <div class="param_analysis">
        &lt;!&ndash;新增一个title标题为参数解析&ndash;&gt;
        <div class="title">返回参数解析</div>
        <div class="operate">
          <el-button type="primary" @click="paramAnalysis">ai解析</el-button>
          <el-button type="primary" @click="updateParamAnalysis">保存修改</el-button>
          <el-button type="primary" @click="queryAnalysis">查询解析</el-button>
        </div>
        <el-tabs v-model="analysisActiveName" class="demo-tabs">
          <el-tab-pane label="返回参数解析" name="first"><div class="data">
            <JsonContainer :json-data="param_analysis"
                           @update:model-value="updateAnalysisParam"></JsonContainer>
          </div>
          </el-tab-pane>
&lt;!&ndash;          <el-tab-pane label="入参解析" name="second">
            &lt;!&ndash;文本&ndash;&gt;
            <JsonContainer :json-data="param_analysis"
                           @update:model-value="updateAnalysisParam"></JsonContainer>
          </el-tab-pane>&ndash;&gt;
        </el-tabs>

      </div>-->
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import MonacoEditor from "@/components/function/MonacoEditor.vue";
import {ref, onMounted} from "vue";
import coderService from "@/api/ai/coderService";
import aiTaskService from "@/api/ai/aiTaskService";
import {ElMessage} from "element-plus";
const emit = defineEmits(['cancel']);
const activeName = ref('first')
const analysisActiveName = ref('first')
const showTables = ref(false)
const props = defineProps({
  domainVersionId: {
    type: String,
    default: ''
  },
  functionVersionId: {
    type: String,
    default: ''
  },
  coderDialogVisible: {
    type: Boolean,
    default: false
  }
})

const updateCodeParam = (value: string, index: number) => {
  paramValues.value[index] = value;
}

const updateCodeResult = (value: string, index: number) => {
  resultValues.value[index] = value;
}

const updateFunctionClassCode = (value: string) => {
  areaFunctionClass.value = value;
}

const updateOtherClass = (value: string, index: number) => {
  otherClassValues.value[index] = value;
}

let coderInfo: CoderInfo = {} as CoderInfo;

const param_analysis = ref('{}')

const updateAnalysisParam = (value: string) => {
  console.log('Updated-param_analysis:', value)
  param_analysis.value = value;
}

const areaFunctionClass = ref('')

const areaFunctionResultClass = ref('')

const dialogVisible = ref(props.coderDialogVisible)

const handleClose = () => {
  emit('cancel')
}

const parsedParamClass = ref<string[]>([]);
const parsedResultClass = ref<string[]>([]);
const otherClass = ref<string[]>([]);

// 添加计算属性来存储参数和结果的中间变量
const paramValues = ref<string[]>([]);
const resultValues = ref<string[]>([]);
const otherClassValues = ref<string[]>([]);

onMounted(async () => {
  let queryCoderParam = {
    domainFunctionVersionId: props.domainVersionId
  }
  coderInfo = await coderService.getCode(queryCoderParam);
  areaFunctionClass.value = coderInfo.areaFunctionClass;
  showTables.value = true
  parsedParamClass.value = JSON.parse(decodeURIComponent(coderInfo.areaFunctionParamClass));
  if (coderInfo.areaFunctionResultClass) {
    parsedResultClass.value = JSON.parse(decodeURIComponent(coderInfo.areaFunctionResultClass));
    resultValues.value = [...parsedResultClass.value];
  }
  if (coderInfo.otherCode) {
    otherClass.value = JSON.parse(decodeURIComponent(coderInfo.otherCode));
    otherClassValues.value = [...otherClass.value];
  }
  // 初始化中间变量
  paramValues.value = [...parsedParamClass.value];

  areaFunctionResultClass.value = coderInfo.areaFunctionResultClass;
  queryAnalysis()
})
let domainFunctionVersionId = props.domainVersionId
const saveCoder = () => {
  let updateParam = {
    domainFunctionVersionId: domainFunctionVersionId,
    areaFunctionClass: areaFunctionClass.value,
    areaFunctionParamClass: paramValues.value,
    areaFunctionResultClass: resultValues.value,
    otherCode: otherClassValues.value
  }
  aiTaskService.updateCoder(updateParam).then(() => {
    ElMessage.success("代码更新成功,再更新部署中，稍后测试")
  })
}

const paramAnalysis = () => {
  aiTaskService.aiAnalysisResult({
    functionVersionId: props.domainVersionId,
  }).then((res) => {
    ElMessage.success("ai发起解析成功.稍后查看")
    setTimeout(() => {
      queryAnalysis()
      ElMessage.success("重置了ai解析的结果")
    }, 8000)
  })
}

const queryAnalysis = () => {
  aiTaskService.queryAiAnalysisResult({
    functionVersionId: props.domainVersionId,
  }).then((res) => {
    //res.data.analysisResult 是一个json数组，转成字符串给param_analysis.value
    param_analysis.value = res.analysisResult
    console.log('res.data.analysisResult', param_analysis.value)
  })
}

const updateParamAnalysis = () => {
  // 保存修改的内容
  console.log('Updated param_analysis:', param_analysis.value);
  aiTaskService.updateAiAnalysisResult({
    functionVersionId: props.domainVersionId,
    analysisResult: param_analysis.value.analysis
  }).then((res) => {
    ElMessage.success("ai解析结果更新成功")
    // 5s后调用queryAnalysis

  })
}

</script>

<style scoped lang="scss">
// 设置coder_data中的coder_info与param_analysis横向排列，coder_info占宽度70%，param_analysis占宽度30%
.coder_data {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 600px;

  .coder_info {
    width: 100%;

    .monaco-editor {
      height: 500px;
      width: 100%;
    }
  }

  /*.param_analysis {
    width: 30%;
    height: 460px;
    // 设置左边距
    margin-left: 10px;
    .title {
      // 设置字体大小
      font-size: 18px;
      // 设置字体粗细
      font-weight: bold;
    }

    .operate {
      // 设置下边距10px
      margin-bottom: 10px;
    }

    .data {
      // 设置边框
      border: 1px solid #ccc;
      // 设置左边外距10px
      margin-left: 10px;
      // 设置高度
      height: 460px;
    }
  }*/
}


//
</style>
