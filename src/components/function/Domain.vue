<template>
  <div class="domain">
    <div class="condition">
      <el-form :model="selectFrom" label-width="auto" style="max-width: 600px">
        <el-form-item label="数据源名称">
          <el-input v-model="selectFrom.domainName"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryDomain()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showDomain()">新增领域</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table :data="domains" style="width: 100%">
        <el-table-column
            prop="id"
            label="id"
            width="120px"
            v-if="0"
        />

        <el-table-column
            prop="areaName"
            label="领域名称"
            width="120px"
        />

        <el-table-column
            prop="desc"
            label="领域描述"
            width="300px"
        />

        <el-table-column
            prop="createTime"
            label="创建时间"
            width="300px"
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
                @click="editDomain(scope.row)"
            >编辑领域
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

  <el-dialog v-model="domainDialogVisible" title="领域操作" :before-close="handleClose">
    <div>
      <el-form :model="domain" label-width="auto" style="max-width: 600px">
        <el-form-item label="领域名称">
          <el-input v-model="domain.areaName"/>
        </el-form-item>
        <el-form-item label="领域描述">
          <el-input v-model="domain.desc"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="upsertDomain()">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";

import domainApi from '../../api/domain/domainService'
import {ElMessage} from "element-plus";

const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

const selectFrom = reactive({
  domainName: ''
})

const domains = ref<Domain[]>([])

const domain = ref<Domain>({
  areaName: '',
  desc: '',
  id: ''
})

const showDomain = () => {
  domainDialogVisible.value = true
  domain.value = {
    areaName: '',
    desc: '',
    id: ''
  }
}

const domainDialogVisible = ref(false)

const handleClose = () => {
  domainDialogVisible.value = false
  domain.value = {
    areaName: '',
    desc: '',
    id: ''
  }
}

const upsertDomain = () => {
  if(!domain.value.areaName){
    ElMessage.error('请输入领域名称')
    return
  }
  console.log("------------",domain.value)
  let createDomainParam = {
    areaName: domain.value.areaName,
    desc: domain.value.desc,
    id: domain.value.id
  }
  
  domainApi.insertDomain(createDomainParam).then(res => {
    domainDialogVisible.value = false
    queryDomain()
  })
}

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage
  queryDomain()
}

const queryDomain = () => {
  console.log('query')
  let queryParam = {
    areaName: selectFrom.domainName,
    size: pageParams.value.size,
    page: pageParams.value.page
  }

  domainApi.queryDomain(queryParam).then(res => {
    console.log("------------",res)
    //res.spiderAreaList中的createTime是时间戳转成字符串
    res.spiderAreaList.forEach((item: any) => {
      item.createTime = new Date(item.createTime).toLocaleString()
    })
    domains.value = res.spiderAreaList
    pageParams.value.total = res.total
  })
}

// 选中一个domain
const editDomain = (row: Domain) => {
  domain.value = row
  domainDialogVisible.value = true
}

onMounted(()=>{
  queryDomain()
})
</script>


<style scoped lang="scss">
.domain {
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