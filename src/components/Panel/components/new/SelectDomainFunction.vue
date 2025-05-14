<template>
  <el-form
      :inline="true"
      :model="formInline"
      class="searchForm"
  >
    <el-form-item label="功能名称">
      <el-input
          v-model="formInline.name"
          placeholder="请输入功能名称"
          clearable
      />
    </el-form-item>
    <el-form-item label="功能状态">
      <el-select
          v-model="formInline.status"
          placeholder="功能状态"
          class="formSelect"
          clearable
      >
        <el-option
            label="开始"
            value="START"
        />
        <el-option
            label="结束"
            value="STOP"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
          type="primary"
          @click="onSubmit"
      >查询</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>

  <el-table
      :data="tableData"
      style="width: 100%"
  >
    <el-table-column
        prop="name"
        label="名称"
    />
    <el-table-column
        prop="taskComponent"
        label="task-component"
    />
    <el-table-column
        prop="taskService"
        label="task-service"
    />
    <el-table-column
        prop="serviceTaskType"
        label="节点类型"
    >
      <template #default="scope">
        <span>{{ scope.row.serviceTaskType ==='POLL' ? '轮询' : scope.row.serviceTaskType ==='DELAY' ? '延迟': scope.row.serviceTaskType ==='NORMAL' ? '正常' :''}}</span>
      </template>
    </el-table-column>

    <el-table-column
        prop="desc"
        label="描述"
    />

    <el-table-column
        prop="date"
        label="操作"
    >
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click="selectFunction(scope.row)"
        >选择</el-button>
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
</template>

<script setup>
import { queryAreaNode } from '@/api/function'

import { onMounted, ref} from 'vue'
import {EventBus} from "@/utils/event-bus.js";

const commonForm = ref({})
const formInline = ref({})
const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})
const tableData = ref([])

const onSubmit = () => {
  getAreaNode()

}
const reset = () => {
  pageParams.value = {
    page: 1,
    size: 10
  }
  formInline.value = {}
  getAreaNode()

}

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage
  getAreaNode()
}

const getAreaNode = async () => {

  console.log(formInline.value)
  let data = {
    page: pageParams.value.page,
    size: pageParams.value.size,
    name: formInline.value.name,
    status: formInline.value.status,
    areaId: commonForm.value.areaId,
  }
  const res = await queryAreaNode(data)
  console.log(res)
  res.nodes.forEach(item => {
    item.status = item.status === 'START' ? true : false
  })
  tableData.value = res.nodes

}

onMounted(() => {
  getAreaNode()
})

const selectFunction = (row) =>{
  console.log(row)
  const selectData = {
    functionId: row.id,
    functionName: row.functionName,
    type: 'domainBusinessFunction'
  }
  // 发送事件,通知已经选择完成了
  EventBus.$emit('selectDomainData', selectData);
}
</script>

<style lang="scss" scoped>
.addBussiness {
  margin-bottom: 20px;
}
</style>