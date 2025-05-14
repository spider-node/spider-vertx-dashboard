<template>
  <el-dialog
      v-model="dialogVisible"
      title="测试场景列表"
      width="1000"
      :before-close="handleClose"
  >
    <div class="test">
      <el-button type="primary" @click="addTest">新增测试</el-button>
    </div>
    <div class="tables">
      <el-table :data="testCases" style="width: 100%">
        <el-table-column prop="cases" label="测试场景" width="500"/>
        <el-table-column prop="expect" label="测试预期" width="180"/>
        <el-table-column prop="date" label="操作" width="250">
          <template #default="scope">
            <el-button type="primary" @click="showTestInfo(scope.row)">查看测试详情</el-button>
            <el-button type="primary" @click="launchTest(scope.row)">发起测试</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>

  <el-dialog
      v-model="testDialogVisible"
      title="测试详情"
      width="800"
      :before-close="caseHandleClose"
  >
    <div class="baseCaseInfo">
      <el-collapse v-model="activeNames">
        <el-collapse-item
            v-for="(item, index) in caseItems"
            :key="index"
            :title="item.title"
            :name="index"
        >
          <p>{{ item.content }}</p>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="caseDataInfo">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="执行参数" name="first">
          <JsonContainer :json-data="selectedCase.caseInputParam"
                         @update:model-value="updateCaseInputParam"></JsonContainer>
        </el-tab-pane>
        <el-tab-pane label="执行sql" name="second">
          <JsonContainer :json-data="selectedCase.caseSql"></JsonContainer>
        </el-tab-pane>
        <el-tab-pane label="运行结果" name="third">
          <JsonContainer :json-data="selectedCase.runResult"></JsonContainer>
        </el-tab-pane>
        <el-tab-pane label="异常信息" name="fourth">
          <div
              class="info"
              v-text="selectedCase.error"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

  </el-dialog>

  <el-dialog
      v-model="showTest"
      title="发起测试"
      width="800"
      :before-close="caseTestHandleClose"
  >
    <!--展示入参,可以修改后-->
    <JsonContainer :json-data="selectedCase.caseInputParam"></JsonContainer>
    <el-button type="primary" @click="runTest" class="runButton">执行测试</el-button>
  </el-dialog>

</template>

<script setup lang="ts">

import {onMounted, toRef} from "vue";
import caseService from '@/api/test/caseService'
import JsonContainer from "@/components/function/JsonContainer.vue";
import {ElMessage} from "element-plus";

const emit = defineEmits(['cancel']);

const activeName = ref('first')

const props = defineProps({
  domainFunctionVersionId: {
    type: String,
    default: ''
  },
  showCase: {
    type: Object as () => Boolean,
    default: false
  }
})

const activeNames = [0,1,2]

const updateCaseInputParam = (data: any) => {

}

const addTest = () => {
}

const selectedCase = ref<Case>({})

const testDialogVisible = ref(false)

const showTestInfo = (row: Case) => {
  selectedCase.value = row
  caseItems.value = [{
    title: '测试场景',
    content: row.cases
  }, {
    title: '测试状态',
    content: row.testStatus
  }, {
    title: '测试预期',
    content: row.expect
  },
  ]
  console.log("caseItems-data", caseItems.value)
  testDialogVisible.value = true
}

const caseHandleClose = () => {
  testDialogVisible.value = false
}

const runTest = () => {
  caseService.startCase({
    id: selectedCase.value.id
  }).then(res => {
    ElMessage.success("发起测试成功")
    showTest.value = false
    // 设置5秒后执行 queryTestCase方法
    setTimeout(() => {
      queryTestCase()
    }, 5000)
  })
}

const testCases = ref<Case[]>([])

let testStatus = {
  'INIT': '初始化',
  'RUN': '运行中',
  'SUSS': '成功',
  'FAIL': '失败',
}

let expect = {
  'INIT': '初始化',
  'SATISFY': '符合预期',
  'NOT_SATISFY': '不符合预期'
}

const showTest = ref(false)

const launchTest = (row: Case) => {
  selectedCase.value = row
  showTest.value = true
}

const caseTestHandleClose = () => {
  showTest.value = false
}

const caseItems = ref([])

const domainFunctionVersionId = toRef(props, 'domainFunctionVersionId')

const queryTestCase = () => {
  caseService.queryCase({domainFunctionVersionId: domainFunctionVersionId.value}).then(res => {
    res.spiderTaskTestInfos.forEach(item => {
      item.testStatus = testStatus[item.testStatus]
      item.expect = expect[item.expect]
    })
    testCases.value = res.spiderTaskTestInfos
  })
}

const dialogVisible = toRef(props, 'showCase')


const handleClose = () => {
  emit('cancel')
}

onMounted(() => {
  queryTestCase()
})

</script>

<style scoped lang="scss">

.info {
  padding: 12px 8px;
  background-color: black;
  margin: 8px 0;
  font-size: 12px;
  line-height: 20px;
  color: var(--el-text-color-secondary);
  white-space: pre-line;
}

.baseCaseInfo {
  margin-bottom: 8px;
}

.tables {
  margin-top: 8px;
}
.runButton {
  // 设置上边距
  margin-top: 8px;
}
</style>