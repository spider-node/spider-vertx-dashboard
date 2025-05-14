<template>
  <div class="datasource">
    <div class="condition">
      <el-form :model="selectFrom" label-width="auto" style="max-width: 600px">
        <el-form-item label="数据源名称">
          <el-input v-model="selectFrom.datasource"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryDatasource()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showEditDatasource()">新增数据源</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table :data="datasourceList" style="width: 100%">
        <el-table-column
            prop="id"
            label="id"
            width="120px"
            v-if="0"
        />
        <el-table-column
            prop="datasource"
            label="数据源名称"
            width="120px"
        />
        <el-table-column
            prop="url"
            label="连接地址"
            width="120px"
        />
        <el-table-column
            prop="name"
            label="用户名"
            width="120px"
        />
        <el-table-column
            prop="password"
            label="密码"
            width="120px"
        />
        <el-table-column
            prop="initialSize"
            label="初始化大小"
            width="120px"
        />
        <el-table-column
            prop="maxIdle"
            label="最大连接数"
            width="120px"
        />
        <el-table-column
            prop="minIdle"
            label="最小连接数"
            width="120px"
        />
        <el-table-column
            prop="driverClassName"
            label="驱动名称"
            width="120px"
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
                @click="editDatasource(scope.row)"
            >编辑数据源
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
  <div class="edit_datasource">
    <el-dialog v-model="showEditDatasourceDialog" title="编辑数据源" width="500">
      <el-form :model="datasource" label-width="auto" style="max-width: 600px">
        <el-form-item label="数据源名称">
          <el-input v-model="datasource.datasource"/>
        </el-form-item>
        <el-form-item label="连接地址">
          <el-input v-model="datasource.url"/>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="datasource.name"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="datasource.password"/>
        </el-form-item>
        <el-form-item label="初始化大小">
          <el-input v-model="datasource.initialSize"/>
        </el-form-item>
        <el-form-item label="最大连接数">
          <el-input v-model="datasource.maxIdle"/>
        </el-form-item>
        <el-form-item label="最小连接数">
          <el-input v-model="datasource.minIdle"/>
        </el-form-item>
        <el-form-item label="驱动名称">
          <el-input v-model="datasource.driverClassName"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="upsertDatasource(datasource)">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import datasourceService from "@/api/datasource/datasourceService";

const selectFrom = reactive({
  datasource: ''
})

const showEditDatasourceDialog = ref(false)

const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

const datasource = ref<Datasource>({})

const showEditDatasource = () => {
  showEditDatasourceDialog.value = true
}


const editDatasource = (row: Datasource) => {
  console.log("编辑数据源", row)
  datasource.value = row
  showEditDatasourceDialog.value = true
}

const datasourceList = ref<Datasource[]>([])

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage
  queryDatasource()
}

const queryDatasource = () => {
  let queryParam = {
    datasource: selectFrom.datasource,
    size: pageParams.value.size,
    page: pageParams.value.page
  }
  console.log(queryParam)
  datasourceService.queryDatasourcePage(queryParam).then(res => {
    datasourceList.value = res.datasourceInfos
    pageParams.value.total = res.total
  })
}

const upsertDatasource = () => {
  datasourceService.upsertDatasource(datasource.value).then(res => {
    console.log("保存数据源", res)
    queryDatasource()
    showEditDatasourceDialog.value = false
  })
}

onMounted(() => {
  queryDatasource()
})

</script>

<style scoped lang="scss">
.datasource {
  // 设置边框为浅灰色
  border: 1px solid #ddd;
  // 设置内边距
  .condition {
    padding: 10px;
    margin: 2px;

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
}
</style>