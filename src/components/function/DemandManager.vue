<template>
  <div>
    <div class="button">
      <el-button v-if="isEdit" type="primary" @click="addInput">添加输入框</el-button>
      <el-button v-if="isEdit" type="primary" @click="aiDemandAnalysis">ai需求分析</el-button>
      <el-button v-if="isEdit" type="primary" @click="queryDemand">查询</el-button>
    </div>
    <div v-for="(input, index) in inputs" :key="index" class="input-container">
      <el-input v-model="input.value"></el-input>
      <el-button type="danger" @click="removeInput(index)">删除</el-button>
    </div>
    <div class="save-button-container">
      <el-button v-if="isEdit" type="success" @click="saveValues">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">

import aiTaskService from "@/api/ai/aiTaskService";
import {ElMessage} from "element-plus";
import domainFunctionVersionService from "@/api/function/DomainFunctionVersionService";

const emit = defineEmits(['ok', 'cancel']);

const props = defineProps({
  demand: {
    type: Array,
    default: () => []
  },
  function_version_id: {
    type: String,
    default: ''
  },
  flow_id: {
    // 默认为数字类型
    type: Number,
    default: ''
  },
  isEdit: {
    type: Boolean,
    default: true
  }
});

const inputs = ref([]);
const values = ref([]);
const savedValues = ref([]);
const demand = ref([]);

const isEdit = ref(props.isEdit);

// 初始化时加载 demand 数据
onMounted(() => {
  console.log("获取到的数据为:", props.demand);
  if (props.demand) {
    inputs.value = props.demand.map(item => ({value: item}));
    demand.value = [...props.demand];
  }
});

// 监听 props.demand 的变化
watch(() => props.demand, (newDemand) => {
  console.log("demand 变化:", newDemand);
  inputs.value = newDemand.map(item => ({value: item}));
  demand.value = [...newDemand];
}, {deep: true});

function addInput() {
  inputs.value.push({value: ''});
  demand.value.push('');
}

function aiDemandAnalysis() {
  let aiAnalysisParam = {
    demands: inputs.value.map(item => item.value),
    functionVersionId: props.function_version_id,
    flowId: props.flow_id
  }
  console.log("aiAnalysisParam:", aiAnalysisParam)
  aiTaskService.parseDemand(aiAnalysisParam).then(res => {
    ElMessage.success("ai发起需求分析成功,稍后查看")
    // 8s之后调用queryDemand
    setTimeout(() => {
      queryDemand()
      ElMessage.success("重置了ai解析的结果")
    }, 8000)
  })

}

function removeInput(index) {
  if (inputs.value.length > 1) {
    // 确保至少保留一个输入框
    inputs.value.splice(index, 1);
    demand.value.splice(index, 1);
  }
}

function getValues() {
  values.value = inputs.value.map(item => item.value);
}

function saveValues() {
  getValues(); // 获取所有输入框的值
  savedValues.value = values.value; // 将值保存到 savedValues 数组中
  emit('ok', savedValues.value);
}

function queryDemand() {
  let queryParam = {
    domainFunctionVersionId: props.function_version_id,
    page: 1,
    size: 1
  }
  domainFunctionVersionService.queryDomainFunction(queryParam).then(res => {
    // 取出res.versionList中的第一个元素
    let row = res.versionList[0]
    let functionalList = row.functionFunctional ? row.functionFunctional.functionalList : []
    inputs.value = functionalList.map(item => ({value: item}))
    console.log("inputs-value:", inputs.value)
  })
}
</script>

<style scoped>
.input-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.button {
  margin-bottom: 10px;
}

.save-button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
