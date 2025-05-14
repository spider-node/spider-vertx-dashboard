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
        <el-table-column
            prop="status"
            label="状态"
        >
          <template #default="scope">
            {{ scope.row.status == 'INIT' ? '关闭' : '开启' }}
          </template>
        </el-table-column>
        <el-table-column
            prop="date"
            label="操作"
        >
          <template #default="scope">
            <el-button
                link
                type="primary"
                size="small"
                @click="selectedFlowData(scope.row)"
            >选择
            </el-button>
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
  </div>
</template>
<!-- 首页 -->
<script setup lang="ts">
import {ref, onMounted} from 'vue'
import flowService from "@/api/flow/flowService";

import {useRouter} from 'vue-router'
const tableData = ref([])
const router = useRouter()
const emit = defineEmits(['cancel', 'selectedDataFlow']);
const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

const selectedFlowData = (row: any) => {
  emit('selectedDataFlow', row)
}

const dialogVisible = ref(false)

const formInline = ref({})
const onSubmit = () => {
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