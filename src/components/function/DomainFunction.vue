<template>
  <div class="domain">
    <div class="condition">
      <el-form :model="selectFrom" label-width="auto" style="max-width: 1100px">
        <el-form-item label="功能名称">
          <el-input v-model="selectFrom.name"/>
        </el-form-item>
        <el-form-item label="领域">
          <el-input v-model="selectFrom.domainName"/>
        </el-form-item>

        <el-form-item label="子域名称">
          <el-input v-model="selectFrom.sonDomain"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryDomainFunction()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addDomainFunction()">新增领域功能</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table :data="domainFunctions" height="550" style="width: 100%">
        <el-table-column prop="name" label="领域功名称" width="100"/>
        <el-table-column prop="taskComponent" label="任务组件" width="100"/>
        <el-table-column prop="taskService" label="任务服务" width="100"/>
        <el-table-column prop="taskMethod" label="任务方法" width="100"/>
        <el-table-column prop="workerId" label="服务id" width="100"/>
        <el-table-column prop="workerType" label="服务类型" width="100"/>
<!--        <el-table-column prop="status" label="功能状态" width="100"/>-->
        <el-table-column prop="areaId" v-if="0" label="领域id" width="100"/>
        <el-table-column prop="areaName" label="领域" width="100"/>
        <el-table-column prop="desc" show-overflow-tooltip label="功能描述" width="200"/>

        <el-table-column
            prop="date"
            label="操作"
            width="200"
        >
          <template #default="scope">
            <el-button
                link
                type="primary"
                size="small"
                @click="showFunctionVersion(scope.row)"
            >查看版本</el-button>

            <el-button
                link
                type="primary"
                size="small"
                @click="editDomainFunction(scope.row)"
            >编辑基础信息</el-button>
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

  <EditDomainFunction
      v-if="showEditDomainFunction"
      :dialogVisible = "showEditDomainFunction"
      :domainFunction = "selectDomainFunction"
      @cancel="cancelEdit()"
      @ok="businessSuccess">
  >
  </EditDomainFunction>

  <DomainFunctionVersion
      v-if="showDomainFunctionVersion"
      :domainFunction = "selectDomainFunction"
      :drawer = "showDomainFunctionVersion"
      @cancel="showDomainFunctionVersion = false"
  ></DomainFunctionVersion>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import domainFunctionService from "@/api/function/DomainFunctionService";
import EditDomainFunction from "@/components/function/EditDomainFunction.vue";
import DomainFunctionVersion from "@/components/function/DomainFunctionVersions.vue";


const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})


const selectFrom = reactive({
  name: '',
  domainName: '',
  datasource: '',
  sonDomain: ''
})

const showDomainFunctionVersion = ref(false)

const showEditDomainFunction = ref(false)

const domainFunctions = ref<DomainFunction[]>([])

const selectDomainFunction = ref<DomainFunction>({} as DomainFunction)

const domainFunctionStatus = {
  INIT: '研发中',
  STOP: '停止',
  START: '运行中'
}

const workerType = {
  MICROSERVICE: '微服务',
  HOST_APPLICATION: '宿主应用',
}

const editDomainFunction = (row: DomainFunction) => {
  showEditDomainFunction.value = true
  selectDomainFunction.value = row
}

const showFunctionVersion = (row: DomainFunction) => {
  showDomainFunctionVersion.value = true
  selectDomainFunction.value = row
}

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage;
  queryDomainFunction();
}

const queryDomainFunction = () => {
  let queryDomainParam = {
    name: selectFrom.name,
    areaName: selectFrom.domainName,
    sonAreaName: selectFrom.sonDomain,
    page: pageParams.value.page,
    size: pageParams.value.size
  }
  console.log(queryDomainParam)
  domainFunctionService.queryDomainFunction(queryDomainParam).then(res => {
    let functionInfoResult = res.spiderAreaFunctionList
    // 循环遍历functionInfoResult 判断status 如果是INIT,修改研发中,STOP,停止,START,运行中
    domainFunctions.value = functionInfoResult.map(item => {
      item.status = domainFunctionStatus[item.status]
      item.workerType = workerType[item.workerType]
      return item
    })
  })
}

const cancelEdit = () => {
  showEditDomainFunction.value = false
  queryDomainFunction()
  selectDomainFunction.value = {}
}

const businessSuccess = () => {
  queryDomainFunction()
  showEditDomainFunction.value = false
  selectDomainFunction.value = {}
}

const addDomainFunction = () => {
  selectDomainFunction.value = {}
  showEditDomainFunction.value = true
}

onMounted(() => {
  queryDomainFunction()
})

</script>

<style scoped lang="scss">
.domain {
  // 设置边框
  border: 1px solid #ebeef5;
  padding: 20px;
  display: block;
  // 设置内边距
  .condition {
    padding: 10px;
    margin: 2px;

    .el-form {
      // itm横向分布
      padding: 5px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      //外边框浅层白色
      border: 1px solid #ebeef5;

      .el-form-item {
        margin: 5px;

      }
    }
  }
  .tables {
    padding: 10px;
    height: 600px;
  }


}
</style>