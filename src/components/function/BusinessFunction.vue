<template>
  <div class ="business">
    <div class="condition">
      <el-form :model="selectFrom" label-width="auto" style="max-width: 600px">
        <el-form-item label="功能名称">
          <el-input v-model="selectFrom.functionName"/>
        </el-form-item>
        <el-form-item label="领域名称" prop="areaName">
          <el-select v-model="selectFrom.areaName"
                     placeholder="请选择领域"
                     filterable
                     clearable
                     remote
                     :remote-method="fetchAndFilterDomain"
                     :loading="loading"
                     style="width: 200px"
          >
            <el-option
                v-for="item in domains"
                :key="item.id"
                :label="item.areaName"
                :value="item.areaName"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryFunction()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addBusiness()">新增功能</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table :data="businessFunctionList" height="550" style="width: 100%">
        <el-table-column
            prop="functionName"
            label="功能名称"
            width = "150px"
        />
        />
        <el-table-column
            prop="id"
            label="功能id"
            width = "150px"
            v-if="0"
        />

        <el-table-column
            prop="director"
            label="负责人"
            width = "150px"
        />

        <el-table-column
            prop="serviceName"
            label="服务名称"
            width = "150px"
        />

        <el-table-column
            prop="desc"
            label="功能描述"
            width = "300px"
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
                @click="showFunctionVersion(scope.row)"
            >查看版本</el-button>

            <el-button
                link
                type="primary"
                size="small"
                @click="showLog(scope.row)"
            >查看功能日志</el-button>

            <el-button
                link
                type="primary"
                size="small"
                @click="editBusiness(scope.row)"
            >编辑</el-button>
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

  <el-drawer
      v-model="drawer"
      title="版本列表"
      :before-close="handleClose"
      :size = "1100"
  >
    <BusinessFunctionVersion
        v-if="drawer"
        :functionId = "selectFunctionId" :is-update = "isUpdate" :is-search = "isSearch" :business-function = "selectBusinessFunction"></BusinessFunctionVersion>
  </el-drawer>

  <EditBusinessFunction
  v-if="showEditBusiness"
  :dialogVisible = "showEditBusiness"
  :businessFunction = "selectBusinessFunction"
  @cancel="showEditBusiness = false"
  @ok="businessSuccess">
  </EditBusinessFunction>
</template>

<script setup lang="ts">
import BusinessFunctionVersion from "@/components/version/BusinessFunctionVersion.vue";
import EditBusinessFunction from "@/components/function/EditBusinessFunction.vue";
import businessFunctionService from "@/api/function/businessFunctionService";
import {onMounted, ref} from "vue";
import domainService from "@/api/domain/domainService";

const selectFunctionId = ref<string>('')
const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

const isSearch = ref<Boolean>(false)
const isUpdate  = ref<Boolean>(true)

const drawer = ref(false)

const showEditBusiness = ref(false)

const selectBusinessFunction = ref<BusinessFunction>()

const editBusiness = (row: BusinessFunction) => {
  showEditBusiness.value = true
  selectBusinessFunction.value = row
}

const cancelEdit = () => {
  showEditBusiness.value = false
  selectBusinessFunction.value = {} as BusinessFunction
  queryFunction()
}

const addBusiness = () => {
  selectBusinessFunction.value = {}
  showEditBusiness.value = true
}

const showFunctionVersion = (row: BusinessFunction) => {
  drawer.value = true
  // 传值到子页面去
  selectFunctionId.value = row.id
  selectBusinessFunction.value = row
}

const showLog = (row: BusinessFunction) => {
  console.log("showLog", row)
  // 跳转到日志业务
}

const handleClose = () => {
  drawer.value = false
  queryFunction()
}

const selectFrom = reactive({
  functionName: '',
  areaName: ''
})

const businessSuccess = () => {
  queryFunction()
  showEditBusiness.value = false
}

const loading = ref(false);

const businessFunctionList = ref<Array<BusinessFunction>>([])

const selectDomain = ref<Domain>({})

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage
  queryFunction()
}

const queryFunction = () => {
  let queryFunctionParam = {
    functionName: selectFrom.functionName,
    areaId: selectDomain.value ? selectDomain.value.id : undefined,
    size: pageParams.value.size,
    page: pageParams.value.page
  }
  console.log("queryFunctionParam", queryFunctionParam)
  businessFunctionService.queryBusinessFunctionPage(queryFunctionParam).then(res => {
    businessFunctionList.value = res.businessFunctions
    pageParams.value.total = res.total
  })
}



// 监听 selectFrom.areaName 的变化
watch(() => selectFrom.areaName, async (newVal, oldVal) => {
  // 从datasources中过滤出datasource相同的一条数据复制给datasource
  selectDomain.value = domains.value.find(item => item.areaName === newVal);
});

const domains = ref<Domain[]>([])

const fetchAndFilterDomain = async (query) => {
  // 确保 query 是一个字符串
  if (typeof query !== 'string' || query.trim() === '') {
    console.log('无效的查询参数');
    domains.value = [];
    return;
  }
  loading.value = true;
  const sanitizedQuery = query.trim();
  let queryParam = {
    areaName: sanitizedQuery,
    page: 1,
    size: 10
  }
  const res = await domainService.queryDomain(queryParam)
  domains.value = res.spiderAreaList
  loading.value = false;
};



const changeStatus = (row: BusinessFunction) => {
  console.log("changeStatus", row)
}

onMounted(() => {
  queryFunction()
})
</script>

<style scoped lang="scss">
.business {
  // 设置边框为浅灰色
  border: 1px solid #ddd;
  // 设置内边距
  .condition {
    padding: 10px;
    margin: 2px;
    max-height: 400px;
    .el-form {
      max-width: 400px;
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
    max-height: 800px;
  }
}
</style>
