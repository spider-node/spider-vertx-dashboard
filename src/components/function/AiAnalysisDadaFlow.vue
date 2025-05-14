<template>
  <div class="analysis">
    <div class = "operate">
      <el-button type="primary" @click="generateDataFlowAnalysis">ai解析</el-button>
    </div>
    <div class="tab">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="领域解析" name="first">
          <div class="markdown">
            <!-- 检查 dataFlowAnalysisModels 是否为 null -->
            <markdown-component v-if="dataFlowAnalysisModels" :markdown="dataFlowAnalysisModels.domainInfoResult"></markdown-component>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据流解析" name="second">
          <div>
            <div class="markdown">
              <!-- 检查 dataFlowAnalysisModels 是否为 null -->
              <markdown-component v-if="dataFlowAnalysisModels" :markdown="dataFlowAnalysisModels.flowDataResult"></markdown-component>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import MarkdownComponent from "@/components/function/MarkdownComponent.vue";
import {ElMessage} from "element-plus";
import aiTaskService from "@/api/ai/aiTaskService";
import {toRef} from "vue";
const emit = defineEmits(['ok']);
const activeName = ref('first')
const props = defineProps({
  dataFlowAnalysisModel: {
    type: Object as DataFlowAnalysisModel,
    default: null
  },
  flow_id: {
    type: Number,
    default: null
  }
})
const dataFlowAnalysisModels = toRef(props, 'dataFlowAnalysisModel')

const flow_id = props.flow_id

const generateDataFlowAnalysis = () => {
  if (!flow_id){
    ElMessage.warning("数据流没有保存，请保存后进行生成")
  }
  let data = {
    flowId: flow_id
  }
  aiTaskService.generateDataFlowInfo(data).then(res => {
    ElMessage.success("发起ai生成成功,请稍后查看。")
    emit('ok')
    // 更新 dataFlowAnalysisModels 的值
    dataFlowAnalysisModels.value = res.data
  })
}
</script>

<style scoped lang="scss">
// 设置markdown高度，超出的部分，可以通过滚动条进行查看
.markdown{
  height: 500px;
  overflow: auto;
}


</style>