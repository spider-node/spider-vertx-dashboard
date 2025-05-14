<template>
  <div class="business_version">
    <div class="condition">
      <el-form v-if="isSearch" :model="searchFrom" label-width="auto" style="max-width: 600px">
        <el-form-item label="功能名称">
          <el-input v-model="searchFrom.functionName" placeholder="请输入功能名称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryVersionInfo()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="version_button">
      <el-button v-if="isUpdate" type="primary" @click="showAddVersion">新增版本</el-button>
    </div>
    <div class="tables">
      <el-table :data="functionVersions" style="width: 100%">
        <el-table-column prop="id" v-if="0" label="id" width="180"/>
        <el-table-column prop="functionId" v-if="0" label="功能id" width="180"/>
        <el-table-column prop="version" label="功能版本" width="180"/>
        <el-table-column prop="functionName" label="功能名称" width="180"/>
        <el-table-column prop="dataFlowName" label="数据流名称" width="180"/>
<!--        <el-table-column prop="bpmnUrl" label="模型地址" width="100"/>-->
        <el-table-column prop="startEventId" label="模型启动id" width="180"/>
        <el-table-column
            prop="date"
            label="操作"
        >
          <template #default="scope">
            <el-button
                link
                type="primary"
                size="small"
                @click="showUpsertVersion(scope.row)"
            >查看版本详情
            </el-button>
            <el-button
                link
                type="primary"
                size="small"
                @click="showVersionInfo(scope.row)"
            >查看流程详情
            </el-button>
            <el-button
                link
                type="primary"
                size="small"
                @click="brushBpmn(scope.row)"
            >刷新数据模型
            </el-button>

            <el-button
                link
                type="primary"
                size="small"
                @click="selectedVersion(scope.row)"
                v-if="!isUpdate"
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

  <EditFunctionVersion
      v-if="showVersion"
      :functionVersion="selectedFunctionVersion"
      :functionId="functionId"
      :business-function = "businessFunction"
      :showVersion="showVersion"
      :is-update="isUpdate"
      @cancel="closeVersion"
      @ok="editVersionSuss"
  ></EditFunctionVersion>

</template>

<script setup lang="ts">
import {onMounted, toRef} from "vue";
import router from "@/router";
import businessFunctionVersionService from "@/api/function/businessFunctionVersionService";
import EditFunctionVersion from "@/components/version/EditFunctionVersion.vue";
import {ElMessage} from "element-plus";

const emit = defineEmits(['selectedVersion']);

const props = defineProps({
  functionId: {
    type: String,
    required: false,
    default: ''
  },
  businessFunction: {
    type: Object,
    default: {}
  },
  functionVersionId: {
    type: String,
    default: ''
  },
  // 是否支持搜索
  isSearch: {
    type: Object as () => Boolean,
    default: false
  },
  // 是否支持编辑
  isUpdate: {
    type: Object as () => Boolean,
    default: false
  }
})

const isUpdate = toRef(props, 'isUpdate')

const isSearch = toRef(props, 'isSearch')

let businessFunction = props.businessFunction

const searchFrom = ref({
  functionName: ''
})

const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

const selectedVersion = (row: FunctionVersion) => {
  let selectedVersionInfo = {
    functionType: 'BUSINESS_FUNCTION',
    domainFunctionVersion: row.version,
    domainFunctionDesc: row.desc,
    domainFunctionName: row.functionName,
    functionVersionId: row.id,
  }
  emit('selectedVersion', selectedVersionInfo)
}

const brushBpmn = (row: FunctionVersion) => {
  refreshBpmnStatus(row)
}

const functionVersions = ref<Array<FunctionVersion>>([])
const functionId = toRef(props, 'functionId')

const showVersion = ref(false)

const selectedFunctionVersion = ref<FunctionVersion>()

const closeVersion = () => {
  console.log("已经收到取消通知了")
  showVersion.value = false
}

const refreshBpmnStatus = (row: FunctionVersion) => {
  if (!row.bpmnUrl) {
    ElMessage.error("没有模型,没办法刷新")
    return
  }
  businessFunctionVersionService.brushBpmn({functionVersionId: row.id}).then(res => {
    ElMessage.success("刷新成功")
  })
}

const showUpsertVersion = (row: FunctionVersion) => {
  selectedFunctionVersion.value = row
  showVersion.value = true
}

const editVersionSuss = () => {
  showVersion.value = false
  queryVersionInfo()
}

const showAddVersion = () => {
  showVersion.value = true
}

const showVersionInfo = (row: FunctionVersion) => {
  router.push({
    path: '/flow_design',
    query: {
      versionId: row.id
    }
  })
}

onMounted(() => {
  queryVersionInfo();
})

const versionBpmnStatus = {
  'INIT': '初始化',
  'DEPLOY': '部署',
}

const versionStatus = {
  'START': '开始',
  'STOP': '结束',
}

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage
  queryVersionInfo()
}

const queryVersionInfo = async () => {
  let queryVersionParam = {
    functionId: functionId.value,
    versionId: props.functionVersionId,
    functionName: searchFrom.value.functionName,
    page: pageParams.value.page,
    size: pageParams.value.size
  }
  console.log("queryVersionParam", queryVersionParam)
  let res = await businessFunctionVersionService.queryBusinessFunctionPage(queryVersionParam)
  // 通过res.versions获取到数据，然后循环遍历,赋值versionBpmnStatus与versionStatus
  pageParams.value.total = res.total
  functionVersions.value = res.versions
}
</script>

<style scoped lang="scss">
.business_version {
  // 设置内部的div竖向排列
  display: flex;
  flex-direction: column;
  height: 100%;

  .version_button {
    margin-bottom: 10px;
    height: 5%;
  }

  .tables {
    height: 95%;
  }

  .condition {
    display: flex;
    align-items: center;
    .el-form {
      display: flex;
      flex-direction: row;
      align-items: center;

      .el-form-item {
        margin-right: 10px;
      }
    }
  }
}

</style>