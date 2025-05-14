<template>

  <div class="version">
    <div class="condition">
      <el-form :model="selectFrom" label-width="auto" style="max-width: 600px">
        <el-form-item label="功能名称">
          <el-input v-model="selectFrom.domainFunctionName" placeholder="请输入功能名称"></el-input>
        </el-form-item>
        <el-form-item label="功能名称">
          <el-input v-model="selectFrom.domainFunctionId" placeholder="功能id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryDomainFunctionVersion()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table :data="domainFunctionVersions" border stripe style="width: 100%">
        <el-table-column prop="version" label="版本" width="180"/>
        <el-table-column prop="domainFunctionName" label="功能名称" width="180"/>
        <el-table-column prop="versionDesc" label="版本描述" width="180"/>
        <el-table-column prop="sonDomainVersion" label="子域版本" width="80"/>
        <el-table-column prop="status" label="状态" width="80"/>
        <el-table-column
            prop="date"
            label="操作"
        >
          <template #default="scope">
            <el-button
                link
                type="primary"
                size="small"
                @click="editVersion(scope.row)"
            >查看需求
            </el-button>
            <el-button
                link
                type="primary"
                size="small"
                v-if="scope.row.status == '初始化'"
                @click="createCoder(scope.row)"
            >代码生成
            </el-button>
            <el-button
                link
                type="primary"
                size="small"
                v-if="scope.row.status != '初始化'"
                @click="queryCode(scope.row)"
            >查看代码
            </el-button>

            <el-button
                link
                type="primary"
                size="small"
                v-if="scope.row.status != '初始化'"
                @click="showDeployInfo(scope.row)"
            >查看部署
            </el-button>

            <el-button
                link
                type="primary"
                size="small"
                v-if="scope.row.status != '初始化'"
                @click="showTestInfo(scope.row)"
            >查看测试
            </el-button>
            <el-button
                link
                type="primary"
                size="small"
                v-if="scope.row.status != '初始化'"
                @click="selectedDomainFunction(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog
      v-model="dialogVisibleDemand"
      title="需求处理"
      width="800"
      :before-close="handleDemandClose"
  >
    <demandManager
        :demand="initDemand"
        @ok="updateDemand"
    ></demandManager>
  </el-dialog>

  <Coder
      v-model:coder-dialog-visible="showCoderVisible"
      v-if="showCoderVisible"
      :domain-version-id="selectedFunctionVersion.id"
      @cancel="showCoderVisible = false"
  >
  </Coder>

  <DeployInfo
      v-if="showDeploy"
      :domainFunctionVersionId="selectedSonVersion.id"
      :showDeploy="showDeploy"
      @cancel="showDeploy = false"
  >
  </DeployInfo>

  <TestCase
      v-if="showCase"
      :domainFunctionVersionId="selectedFunctionVersion.id"
      :showCase="showCase"
      @cancel="showCase = false"
  ></TestCase>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import domainFunctionVersionService from "@/api/function/DomainFunctionVersionService";
import demandManager from "@/components/function/DemandManager.vue"
import aiTaskService from "@/api/ai/aiTaskService";
import {ElMessage} from "element-plus";
import Coder from "@/components/function/Coder.vue";
import DeployInfo from "@/components/function/DeployInfo.vue";
import TestCase from "@/components/function/TestCase.vue";
import domainFunctionService from "@/api/function/DomainFunctionService";

const props = defineProps({
  domainFunctionVersionId: {
    type: String,
    default: ''
  }
})

const showCase = ref(false)

const showTestInfo = (row: DomainFunctionVersion) => {
  selectedFunctionVersion = row
  showCase.value = true
}

// 新增一个status变量 INIT为初始化/COMPILE为编译完成/RUNNING为运行中
const domainFunctionStatus = {
  INIT: '初始化',
  COMPILE: '编译完成',
  DEPLOY: '运行中'
}

const selectedDomainFunction = (row: DomainFunctionVersion) => {

  let param = {
    functionId: row.domainFunctionId,
    page: 1,
    size: 10
  }
  domainFunctionService.queryDomainFunction(param).then(res => {
    let businessFunction = res.spiderAreaFunctionList[0]
    let selectedVersionInfo = {
      domainFunctionDesc: row.versionDesc,
      domainFunctionName: row.domainFunctionName,
      domainFunctionVersion: row.version,
      taskComponent: businessFunction.taskComponent,
      taskService: businessFunction.taskService,
      functionVersionId: row.id,
      datasourceId: row.datasourceId,
      functionType: 'DOMAIN_FUNCTION',
    }
    emit('selectedVersion', selectedVersionInfo)
  })


}

const emit = defineEmits(['ok', 'cancel','selectedVersion']);
const domainFunctionVersions = ref<DomainFunctionVersion>([])

const dialogVisibleDemand = ref(false)

const showCoderVisible = ref(false)

const showDeploy = ref(false)

let selectedFunctionVersion: DomainFunctionVersion

const queryCode = (row: DomainFunctionVersion) => {
  selectedFunctionVersion = row
  showCoderVisible.value = true
}

const selectFrom = ref({
  domainFunctionName: '',
  domainFunctionId: ''
})

const showEdit = ref(false)

const showVersion = () => {
  showEdit.value = true
}

const editHandleClose = () => {
  showEdit.value = false
  queryDomainFunctionVersion()
}

let initDemand = []

const editVersion = (row: DomainFunctionVersion) => {
  initDemand = row.functionFunctional ? row.functionFunctional.functionalList : []
  console.log("需求信息", row)
  dialogVisibleDemand.value = true
}

const updateDemand = () => {
  dialogVisibleDemand.value = false
}


const handleDemandClose = () => {
  dialogVisibleDemand.value = false
}

const createCoder = (row: DomainFunctionVersion) => {
  let createCoderParam = {
    domainFunctionVersionId: row.id
  }
  aiTaskService.createCoder(createCoderParam).then(res => {
    ElMessage.info("发起编码成功")
  })
  console.log("row", row)
}

const direction = 'rtl'

// 声明一个变量domainFunction 类型为DomainFunction
const domainFunctionVersionId = ref<DomainFunction>(props.domainFunction)

// 初始化方法
onMounted(() => {
  selectFrom.value.domainFunctionId = domainFunctionVersionId.value
  queryDomainFunctionVersion()
})

const selectedSonVersion = ref<DomainFunctionVersion>({})

const showDeployInfo = (row: DomainFunctionVersion) => {
  selectedSonVersion.value = row
  showDeploy.value = true
}

// 查询领域版本接口
const queryDomainFunctionVersion = () => {
  let queryParam = {
    sonDomainVersion: selectFrom.value.domainFunctionName,
    domainFunctionVersionId: selectFrom.value.domainFunctionId
  }
  domainFunctionVersionService.queryDomainFunction(queryParam).then(res => {
    // 遍历res.versionList 把status从domainFunctionStatus进行转换成value值
    res.versionList.forEach(item => {
      item.status = domainFunctionStatus[item.status]
    })
    domainFunctionVersions.value = res.versionList
  })
}


</script>

<style scoped lang="scss">
.version {
  // 设置边框为浅灰色
  border: 1px solid #ddd;
  padding: 10px;

  .condition {
    padding: 10px;
    margin: 2px;
    // 按钮与选项框横向排列小间隔
    .el-form {
      display: flex;
      flex-direction: row;
      align-items: center;

      .el-form-item {
        margin-right: 10px;
      }
    }
  }

  .tables {
    padding: 10px;
    margin: 2px;
  }
}
</style>