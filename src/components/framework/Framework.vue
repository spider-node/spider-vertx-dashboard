<template>
  <div class="framework">
    <div class="condition">
      <el-form :model="selectFrom" label-width="auto" style="max-width: 1100px" inline>
        <el-form-item label="框架名称">
          <el-input v-model="selectFrom.name"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryFrameworks()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addDomainFunction()">新增框架</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="frameworkName" label="框架名称" width="180"/>
        <el-table-column prop="frameworkDesc" label="框架描述"/>
        <el-table-column prop="frameworkPackage" label="使用框架引入的包名称"/>
        <el-table-column prop="frameworkConfigName" label="框架配置名称"/>
        <el-table-column prop="frameworkConfigPackage" label="框架配置包名称"/>
        <el-table-column prop="frameworkMvn" label="框架的mvn依赖"/>
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
                @click="showFramework(scope.row)"
            >编辑
            </el-button>
            <el-button
                link
                type="primary"
                size="small"
                @click="showUseDoc(scope.row)"
            >查看使用文档
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

  <el-dialog v-model="frameworkVisible" title="框架操作" width="700" :before-close="frameworkHandleClose">
    <el-form :model="selectedFramework" label-width="auto" style="max-width: 700px">
      <el-form-item label="框架名称">
        <el-input v-model="selectedFramework.frameworkName"/>
      </el-form-item>
      <el-form-item label="框架描述">
        <el-input v-model="selectedFramework.frameworkDesc" type="textarea"/>
      </el-form-item>

      <el-form-item label="框架配置名称">
        <el-input v-model="selectedFramework.frameworkConfigName"/>
      </el-form-item>

      <el-form-item label="引入的包名称">
        <el-input v-model="selectedFramework.frameworkPackage"/>
      </el-form-item>
      <el-form-item label="框架配置包名称">
        <el-input v-model="selectedFramework.frameworkConfigPackage"/>
      </el-form-item>
      <el-form-item label="框架的mvn依赖">
        <el-input v-model="selectedFramework.frameworkMvn" type="textarea"/>
      </el-form-item>
      <!----- 按钮为保存 --->
      <el-form-item>
        <el-button type="primary" @click="saveFramework">保存</el-button>
        <el-button type="primary" @click="showFrameworkDocs">查看框架使用文档</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!--- 框架使用文档 使用mkd 并且执行修改 --->
  <el-dialog v-model="showFrameworkDoc" title="框架使用文档" width="1200" :before-close="showFrameworkDocHandleClose">
    <v-md-editor v-model="selectedFramework.frameworkDoc" height="550px" @save="saveDoc"></v-md-editor>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import frameworkService from "@/api/function/frameworkService.ts";
import {ElMessage} from "element-plus";

const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage;
  queryFrameworks()
}

const selectFrom = reactive({
  name: ''
})
const selectedFramework = ref<Framework>({
  id: 0,
  frameworkName: '',
  frameworkDesc: '',
  frameworkDoc: '', // 添加 frameworkDoc 属性
  frameworkPackage: '',
  frameworkConfigName: '',
  frameworkConfigPackage: '',
  frameworkMvn: ''
} as Framework)
const frameworkVisible = ref(false)
const showFramework = (row: Framework) => {
  selectedFramework.value = row
  frameworkVisible.value = true
}

const saveDoc = (text, html) => {
  selectedFramework.value.frameworkDoc = text
  if (selectedFramework.value.id) {
    saveFramework()
  }
}

const showFrameworkDoc = ref(false)

const showFrameworkDocs = () => {
  showFrameworkDoc.value = true
}

const showFrameworkDocHandleClose = () => {
  showFrameworkDoc.value = false
}

const showUseDoc = (row: Framework) => {
  selectedFramework.value = row
  showFrameworkDoc.value = true
}

const frameworkHandleClose = () => {
  frameworkVisible.value = false
}

const saveFramework = () => {
  frameworkService.insertFramework(selectedFramework.value).then((res) => {
    console.log("保存框架成功", res)
    ElMessage.success("保存框架成功")
    frameworkVisible.value = false
    queryFrameworks()
  })

}

const addDomainFunction = () => {
  console.log("新增")
  frameworkVisible.value = true
}

// 确保 tableData 的初始值是一个空数组
const tableData = ref<Framework[]>([]);

const queryFrameworks = () => {
  // 模拟查询数据
  let queryParams = {
    page: pageParams.value.page,
    size: pageParams.value.size,
    frameworkName: selectFrom.name
  }
  frameworkService.queryFramework(queryParams).then((res) => {
    tableData.value = res.datas
    pageParams.value.total = res.total
  })
}

onMounted(() => {
  queryFrameworks()
})
</script>

<style scoped lang="scss">
.framework {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.condition {
  margin-bottom: 20px;
}

.tables {
  margin-top: 20px;
}

.el-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.el-table th {
  background-color: #f5f7fa;
}

.el-table td, .el-table th {
  padding: 12px 0;
}

.el-dialog {
  border-radius: 8px;
}
</style>