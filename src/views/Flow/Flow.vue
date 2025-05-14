<template>
  <div class="box">
    <div class="content">
      <el-form
          :inline="true"
          :model="formInline"
          class="searchForm"
      >
        <el-form-item label="数据流名称">
          <el-input
              v-model="formInline.flowDataName"
              placeholder="请输入数据流名称"
              clearable
          />
        </el-form-item>
        <el-form-item label="子域名称">
          <el-input
              v-model="formInline.sonAreaName"
              placeholder="请输入子域名称"
              clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              @click="onSubmit"
          >查询
          </el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button
          class="addBussiness"
          @click="showFlowInfo"
          type="primary"
      >新增
      </el-button>
      <el-table
          :data="tableData"
          style="width: 100%"
      >
        <el-table-column
            prop="flowDataName"
            label="数据流名称"
        />
        <el-table-column
            prop="flowDataDesc"
            label="数据流描述"
        />
<!--        <el-table-column
            prop="status"
            label="状态"
        >
          <template #default="scope">
            {{ scope.row.status == 'INIT' ? '关闭' : '开启' }}
          </template>
        </el-table-column>-->
        <el-table-column
            prop="date"
            label="操作"
        >
          <template #default="scope">
            <el-button
                link
                type="primary"
                size="small"
                @click="showFlowInfo(scope.row)"
            >编辑
            </el-button>
            <el-button
                link
                type="primary"
                size="small"
                @click="viewSon(scope.row)"
            >查看子域
            </el-button>
<!--            <el-button
                link
                type="primary"
                size="small"
                @click="changeStatus(scope.row)"
            >{{ scope.row.status === 'INIT' ? '开启' : '关闭' }}
            </el-button>-->
<!--            <el-button
                link
                type="primary"
                size="small"
                @click="showAiAnalysisFunction(scope.row)"
            >查看ai解析
            </el-button>-->

          </template>

        </el-table-column>

      </el-table>
      <div class="paginationBox">
        <el-pagination
            class="pagination"
            size="small"
            background
            :page-size="pageParams.size"
            layout="prev, pager, next"
            :total="pageParams.total"
            @current-change="handlePageChange"
        />
      </div>
    </div>
    <el-dialog
        v-model="dialogVisible"
        @close="dialogVisible=false"
        title="查看子域"
        width="700"
    >
      <el-table
          :data="sonAreaList"
          style="width: 100%"
      >
        <el-table-column
            prop="areaName"
            label="领域名称"
        />
        <el-table-column
            prop="sonAreaName"
            label="子域名称"
        />
        <el-table-column
            prop="tableName"
            label="表名"
        />
        <el-table-column
            prop="datasource"
            label="数据源"
        />
      </el-table>
    </el-dialog>
  </div>
  <el-drawer
      v-model="drawer"
      title="数据流操作"
      :before-close="handleClose"
      @open="openDrawer"
      :size="1400"
  >
    <AddFlows
        v-if="openFlow"
        :flow-id="flowId"
    ></AddFlows>
  </el-drawer>

  <el-drawer
      v-model="addDrawer"
      title="数据流操作"
      :before-close="addHandleClose"
      @open="addOpenDrawer"
      :size="1800"
  >
    <AddFlows v-if="openFlow"></AddFlows>
  </el-drawer>

  <el-dialog
      v-model="showAiAnalysis"
      title="数据流信息"
      width="1200"
      style="height: 80%"
      :before-close="analysisHandleClose"
  >
    <AiAnalysisDadaFlow v-if="showAiAnalysis" :data-flow-analysis-model="flowDetail.dataFlowAnalysisModel"
                        :flow_id="flowDetail.id"
                        @ok=analysisHandleClose>
    </AiAnalysisDadaFlow>
  </el-dialog>
</template>
<!-- 首页 -->
<script setup lang="ts">
import {ref, onMounted} from 'vue'
import flowService from "@/api/flow/flowService";
import {ElMessage} from 'element-plus';

import AddFlows from "@/views/Flow/AddFlow.vue";
import AiAnalysisDadaFlow from "@/components/function/AiAnalysisDadaFlow.vue";
const drawer = ref(false)
const flowId = ref('')
const tableData = ref([])
import {useRouter} from 'vue-router'
const router = useRouter()
const openFlow = ref(false)
const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})
const showFlowInfo = (row) => {
  router.push({
    path: '/addFlow',
    query: {
      flowId: row.id
    }
  })
}
const openDrawer = () => {
  drawer.value = true
  openFlow.value = true
}

const addDrawer = ref(false)
const addOpenFlow = ref(false)
const addHandleClose = () => {
  addDrawer.value = false
  addOpenFlow.value = false

}
const addOpenDrawer = () => {
  addDrawer.value = true
  addOpenFlow.value = true

}
const dialogVisible = ref(false)
const sonAreaList = ref([])
const formInline = ref({})
const onSubmit = () => {
  getAreaFlowList()
}

const handleClose = () => {
  console.log('close')
  drawer.value = false
  openFlow.value = false
}

const showAiAnalysis = ref(false)
const flowDetail = ref({})
const showAiAnalysisFunction = (row) => {
  flowDetail.value = row
  showAiAnalysis.value = true
}

const analysisHandleClose = () => {
  showAiAnalysis.value = false
}

const viewSon = async (row) => {
  dialogVisible.value = true
  let data = {
    sonBaseIds: JSON.parse(row.sonAreaIds)
  }
  let result = await flowService.querySonDomainBaseInfo(data)
  console.log(result)
  sonAreaList.value = result.spiderSonAreas
}
const changeStatus = async (row) => {
  let data = {
    status: row.status === 'INIT' ? 'ENABLE' : 'INIT',
    id: row.id
  }
  let res = await flowService.updateFlowStatus(data)
  console.log(res)
  ElMessage.success('操作成功')
  getAreaList()
}
const reset = () => {
  pageParams.value = {
    page: 1,
    size: 10,
    total: 0
  }
  formInline.value = {}
  getAreaList()
}

const addFlow = () => {
  drawer.value = true
}
const editFlow = (row) => {
  flowId.value = row.id
  drawer.value = true
}
onMounted(() => {
  getAreaFlowList()
})

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage
  getAreaFlowList()
}

const getAreaFlowList = async () => {
  let data = {
    ...formInline.value,
    page: pageParams.value.page,
    size: pageParams.value.size
  }
  let res = await flowService.queryFlowPage(data)
  console.log(res)

  tableData.value = res.dataFlowList
  pageParams.value.total = res.total
}
</script>
<style lang="scss" scoped>
.addBussiness {
  margin-bottom: 20px;
}
</style>
