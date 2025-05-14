<template>
  <el-form
      :inline="true"
      :model="queryFunctionParam"
      class="searchForm"
  >
    <el-form-item label="功能名称">
      <el-input
          v-model="queryFunctionParam.functionName"
          placeholder="请输入功能名称"
          clearable
      />
    </el-form-item>

    <el-form-item>
      <el-button
          type="primary"
          @click="queryBusinessFunctions"
      >查询
      </el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="businessFunctionList" style="width: 100%">
    <el-table-column
        prop="functionName"
        label="功能名称"
    />
    <el-table-column
        prop="id"
        label="功能id"
    />
    <el-table-column
        prop="desc"
        label="功能描述"
    />

    <el-table-column
        prop="director"
        label="负责人"
    />
    <el-table-column
        prop="status"
        label="功能状态"
    >
      <template #default="scope">
        <el-switch
            @change="changeStatus(scope.row)"
            v-model="scope.row.status"
        />
      </template>
    </el-table-column>

    <el-table-column
        prop="serviceName"
        label="服务名称"
    />
    <el-table-column type="expand">
      <template #default="props">
        <el-table :data="functionVersions" :border="childBorder" :load="queryVersionInfo(props.row)">
          <el-table-column label="版本" prop="version"/>
          <el-table-column label="描述" prop="desc"/>
          <el-table-column label="id" prop="id" :v-if="0"/>
          <el-table-column label="功能id" prop="functionId" :v-if="0"/>
          <el-table-column label="功能名称" prop="functionName" :v-if="0"/>
          <el-table-column
              prop="date"
              label="操作">
            <template #default="scope">
              <el-button
                  link
                  type="primary"
                  size="small"
                  @click="choose(scope.row)"
              >选择功能
              </el-button>
              <el-button
                  link
                  type="primary"
                  size="small"
                  @click="showFunctionDetail(scope.row)"
              >查看功能详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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

<script setup lang="ts">
import {changeFunctionState, queryFunction, queryVersion} from "@/api/function";

const queryFunctionParam = reactive({
  functionName: ''
})

const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

interface BusinessFunction {
  functionName: string,
  id: string,
  desc: string,
  director: string,
  status: boolean,
}

interface FunctionVersion {
  version: string,
  desc: string,
  functionName: string,
  functionId: string,
  id: string,
}

const functionVersions = ref<Array<FunctionVersion>>([])

const reset = () => {
  queryFunctionParam.functionName = ''
}

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage;
  queryVersionInfo();
}

const queryVersionInfo = async (row: BusinessFunction) => {
  let queryParam = {
    functionId: row.id,
    page: 1,
    size: 100
  }
  let res = await queryVersion(queryParam)
  res.versions.forEach(item => {
    item.status = item.status === 'START'
  })
  functionVersions.value = res.versions as Array<FunctionVersion>;
}
// 通过新建一个页面,进行跳转到的功能的研发页面
const showFunctionDetail = (row: FunctionVersion) => {
  console.log(row)
}


const businessFunctionList = ref<Array<BusinessFunction>>([])

const queryBusinessFunctions = async () => {
  let queryParam = {
    page: pageParams.value.page,
    size: pageParams.value.size,
    functionName: queryFunctionParam.functionName
  }
  const res = await queryFunction(queryParam)
  res.functions.forEach(item => {
    item.status = item.status === 'START' ? true : false
  })
  businessFunctionList.value = res.functions
}

const changeStatus = async (row: BusinessFunction) => {
  console.log(1)
  let data = {
    functionId: row.id,
    status: row.status ? 'START' : 'STOP'
  }
  let res = await changeFunctionState(data)
  console.log(res)
  ElMessage({
    message: '操作成功',
    type: 'success',
  })
  getFunctionList()
}

const choose = (row: FunctionVersion) =>{
  console.log(row)
  const selectData = new SelectFunctionResult(row.id,row.functionName,'businessFunction',row.version)
  // 发送事件,通知已经选择完成了
  console.log(selectData)
}

</script>

<style scoped lang="scss">

</style>