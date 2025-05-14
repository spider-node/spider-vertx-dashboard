<template>
  <el-drawer
      v-model="drawer"
      title="领域功能版本管理"
      :direction="direction"
      :before-close="handleClose"
      :size="1300"
  >
    <div class="version">
      <div class="condition">
        <el-form :model="selectFrom" label-width="auto" style="max-width: 600px">
          <el-form-item label="子域版本">
            <el-input v-model="selectFrom.sonVersion" placeholder="请输入版本号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryDomainFunctionVersion()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showVersion()">新增版本</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tables">
        <el-table :data="domainFunctionVersions" border stripe style="width: 100%">
          <el-table-column prop="version" label="版本" width="100"/>
          <el-table-column prop="versionDesc" label="版本描述" width="180"/>
          <el-table-column prop="dataFlowName" label="数据流名称" width="180"/>
          <el-table-column prop="status" label="状态" width="100"/>
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
                  @click="createCoderInfo(scope.row)"
              >代码生成
              </el-button>
              <el-button
                  link
                  type="primary"
                  size="small"
                  v-if="scope.row.status == '编译完成' || scope.row.status == '运行中'"
                  @click="queryCode(scope.row)"
              >查看代码
              </el-button>

              <el-button
                  link
                  type="primary"
                  size="small"
                  v-if="scope.row.status == '编译完成' || scope.row.status == '运行中'"
                  @click="showDeployInfo(scope.row)"
              >查看部署
              </el-button>

              <el-button
                  link
                  type="primary"
                  size="small"
                  v-if="scope.row.status == '编译完成' || scope.row.status == '运行中'"
                  @click="showTestInfo(scope.row)"
              >查看测试
              </el-button>

              <el-button
                  link
                  type="primary"
                  size="small"
                  v-if="scope.row.status == '初始化'"
                  @click="showEdits(scope.row)"
              >编辑
              </el-button>

              <el-button
                  link
                  type="primary"
                  size="small"
                  @click="showSelectedDataFlow(scope.row)"
              >选择数据流
              </el-button>

              <el-button
                  link
                  type="primary"
                  size="small"
                  @click="showDataFlow(scope.row)"
              >查看数据流
              </el-button>

              <el-button
                  link
                  type="primary"
                  size="small"
                  v-if="scope.row.status == '代码生成失败' || scope.row.status == '编译完成' || scope.row.status == '运行中'"
                  @click="showAiStep(scope.row)"
              >查看ai任务状况
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-drawer>

  <EditDomainFunctionVersions
      v-if="showEdit"
      :domainFunctionVersion="selectedFunctionVersion"
      :domain-function="domainFunction"
      :showEdit="showEdit"
      @cancel="editHandleClose"
      @ok="editHandleClose"
  ></EditDomainFunctionVersions>

  <el-dialog
      v-model="dialogVisibleDemand"
      title="需求处理"
      width="1000"
      :before-close="handleDemandClose"
  >
    <demandManager
        :demand="initDemand"
        :function_version_id="selectedFunctionVersion.id"
        :flow_id="selectedFunctionVersion.dataFlowId"
        @ok="updateDemand"
    ></demandManager>
  </el-dialog>


  <CoderV2
      v-if="showCoderVisible"
      :coderDialogVisible="showCoderVisible"
      :domainVersionId="selectedFunctionVersion.id"
      :function-version-id="selectedFunctionVersion.id"
      @cancel="showCoderVisible = false"
      @ok="showCoderVisible = false"
  >
  </CoderV2>

  <DeployInfo
      v-if="showDeploy"
      :domainFunctionVersionId="selectedFunctionVersion.id"
      :domain-function="domainFunction"
      :version="selectedFunctionVersion.version"
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
  <el-dialog
      v-model="showTaskStepVisible"
      title="ai生成步骤"
      width="500"
      :before-close="showTaskHandleClose"
  >
    <ai-create-coder-task v-if="showTaskStepVisible"
                          :domainVersionId="selectedFunctionVersion.id"></ai-create-coder-task>
  </el-dialog>
  <el-dialog
      v-model="showSelectFlowData"
      title="数据流选择"
      width="1200"
      :before-close="showSelectFlowDataHandleClose"
  >
    <SelectFlowDatas v-if="showSelectFlowData" @selected-data-flow="selectedDataFlow"></SelectFlowDatas>
  </el-dialog>

  <el-drawer
      v-model="showFlowData"
      title="数据流操作"
      :before-close="showFlowDataHandlerClose"
      @open="openDrawer"
      :size="1500"
  >
    <ShowDataFlowS :flowId="selectedFunctionVersion.dataFlowId"
                   :domain-name="selectedFunctionVersion.flowGroupParentId"
                   v-if="showFlowDatas"
                   @select-flow-group="selectFlowGroup"></ShowDataFlowS>
  </el-drawer>

  <el-dialog
      v-model="codeDialogVisible"
      title="代码生成规则"
      width="800"
      :before-close="codeHandleClose"
  >
    <div class="code_rule">
      <div class="operate">
        <el-button @click="createCoder">代码生成</el-button>
      </div>
      <div class="radio">
        <el-radio-group v-model="codeCreateType">
          <el-radio :value="1">重新生成</el-radio>
          <el-radio :value="2">复用参数</el-radio>
          <el-radio :value="3">复用版本参数</el-radio>
        </el-radio-group>
      </div>
      <div class="selected_version">
        <el-select
            v-model="selectedVersion"
            placeholder="Select"
            size="large"
            style="width: 240px"
        >
          <el-option
              v-for="item in functionOptions"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import domainFunctionVersionService from "@/api/function/DomainFunctionVersionService";
import EditDomainFunctionVersions from "@/components/function/EditDomainFunctionVersions.vue";
import demandManager from "@/components/function/DemandManager.vue"
import aiTaskService from "@/api/ai/aiTaskService";
import {ElMessage} from "element-plus";
import DeployInfo from "@/components/function/DeployInfo.vue";
import TestCase from "@/components/function/TestCase.vue";
import AiCreateCoderTask from "@/components/task/AiCreateCoderTask.vue";
import SelectFlowDatas from "@/components/function/SelectFlowData.vue";
import CoderV2 from "@/components/function/CoderV2.vue";
import ShowDataFlowS from "@/components/function/ShowDataFlow.vue";

const props = defineProps({
  domainFunction: {
    type: Object,
    default: {}
  },
  drawer: {
    type: Boolean,
    default: false
  }
})

const codeDialogVisible = ref(false)

const codeHandleClose = () => {
  codeDialogVisible.value = false
}

const selectFlowGroup = (group_id: string) => {
  selectedFunctionVersion.flowGroupParentId = group_id
  updateDomainFunctionVersion()
}

const selectedVersion = ref('')

const functionOptions = ref([])

const codeCreateType = ref('1')

const createCoder = () => {
  if (codeCreateType.value == 'reuse_version') {
    if (selectedVersion.value == '') {
      ElMessage.warning("选择复用版本的参数,请选择对应的版本")
      return
    }
  }
  // 把codeCreateType.value转一下，赋值给变量codeCreateTypeNew 1转换成create,2转换成reuse_param,3转换成reuse_version
  let codeCreateTypeNew = ''
  switch (codeCreateType.value) {
    case 1:
      codeCreateTypeNew = 'create'
      break
    case 2:
      codeCreateTypeNew = 'reuse_param'
      break
    case 3:
      codeCreateTypeNew = 'reuse_version'
      break
  }
  //codeCreateType.value
  let createCoderParam = {
    domainFunctionVersionId: selectedDomainFunctionVersion.id,
    // 创建代码的类型
    codeCreateType: codeCreateTypeNew,
    // 复用的版本号
    selectedVersion: selectedVersion.value
  }
  aiTaskService.createCoder(createCoderParam).then(res => {
    ElMessage.success("发起编码成功")
    codeDialogVisible.value = false
    // 查询下版本信息
    queryDomainFunctionVersion()
  })
}


const showTaskStepVisible = ref(false)

const showCase = ref(false)

const showSelectFlowData = ref(false)

const showFlowData = ref(false)

const showFlowDataHandlerClose = () => {
  showFlowData.value = false
}

const selectedDataFlow = (dataFlow: any) => {
  selectedFunctionVersion.dataFlowId = dataFlow.id
  selectedFunctionVersion.dataFlowName = dataFlow.flowDataName
  updateDomainFunctionVersion();
  showSelectFlowData.value = false
}

const showFlowDatas = ref(false)

const openDrawer = () => {
  showFlowDatas.value = true
}

/*const updateDomainFunctionVersion = async () => {
  let status = selectedFunctionVersion.status
  let updateParam = {
    // 如何selectedFunctionVersion的属性放到updateParam中
    ...selectedFunctionVersion,
    status: domainFunctionStatus_reversal[status]
  }
  await domainFunctionVersionService.upsertDomainFunction(updateParam)
}*/

const showDataFlow = (row: DomainFunctionVersion) => {
  selectedFunctionVersion = row
  if (!selectedFunctionVersion.dataFlowId) {
    ElMessage.error("没有数据流-不可查看")
  }
  showFlowData.value = true
}

const showSelectedDataFlow = (row: DomainFunctionVersion) => {
  selectedFunctionVersion = row
  showSelectFlowData.value = true
}

const showSelectFlowDataHandleClose = () => {
  showSelectFlowData.value = false
}

const showTestInfo = (row: DomainFunctionVersion) => {
  selectedFunctionVersion = row
  showCase.value = true
}

// 新增一个status变量 INIT为初始化/COMPILE为编译完成/RUNNING为运行中
const domainFunctionStatus = {
  INIT: '初始化',
  CODING: '代码生成中',
  COMPILE: '编译完成',
  CODING_FAIL: '代码生成失败',
  DEPLOY: '运行中'
}

// 实现一个变量为把domainFunctionStatus做反转
const domainFunctionStatus_reversal = {
  '初始化': 'INIT',
  '代码生成中': 'CODING',
  '编译完成': 'COMPILE',
  '代码生成失败': 'CODING_FAIL',
  '运行中': 'DEPLOY'
}

const emit = defineEmits(['ok', 'cancel']);

const domainFunctionVersions = ref<DomainFunctionVersion>([])

const showEdits = (row: DomainFunctionVersion) => {
  showEdit.value = true
  selectedFunctionVersion = row
}

const showTaskHandleClose = () => {
  showTaskStepVisible.value = false
}

const dialogVisibleDemand = ref(false)

const showCoderVisible = ref(false)

const showDeploy = ref(false)

let selectedFunctionVersion: DomainFunctionVersion

const queryCode = (row: DomainFunctionVersion) => {
  selectedFunctionVersion = row
  showCoderVisible.value = true
}

const selectFrom = ref({
  sonVersion: ''
})

const showEdit = ref(false)

const showVersion = () => {
  showEdit.value = true
  selectedFunctionVersion = {} as DomainFunctionVersion
}

const editHandleClose = () => {
  showEdit.value = false
  queryDomainFunctionVersion()
}

let initDemand = []

const editVersion = (row: DomainFunctionVersion) => {
  initDemand = row.functionFunctional ? row.functionFunctional.functionalList : []
  console.log("需求信息", row)
  selectedFunctionVersion = row
  dialogVisibleDemand.value = true
}

const updateDemand = (domain: []) => {
  dialogVisibleDemand.value = false
  // 进行更新功能版本
  let updateParam = {
    id: selectedFunctionVersion.id,
    functionFunctional: {
      functionalList: domain
    }
  }
  domainFunctionVersionService.upsertDomainFunction(updateParam)
}

const handleDemandClose = () => {
  dialogVisibleDemand.value = false
}

let selectedDomainFunctionVersion: DomainFunctionVersion

const createCoderInfo = (row: DomainFunctionVersion) => {
  selectedDomainFunctionVersion = row
  codeDialogVisible.value = true
}

const showAiStep = (row: DomainFunctionVersion) => {
  showTaskStepVisible.value = true
  selectedFunctionVersion = row
}

const direction = 'rtl'

const drawer = ref(props.drawer)

// 声明一个变量domainFunction 类型为DomainFunction
const domainFunction: DomainFunction = props.domainFunction

// 初始化方法
onMounted(() => {
  console.log("domainFunction", domainFunction)
  queryDomainFunctionVersion()
})

// 抽屉关闭的响应
const handleClose = () => {
  drawer.value = false
  emit('cancel')
}

const showDeployInfo = (row: DomainFunctionVersion) => {
  selectedFunctionVersion = row
  showDeploy.value = true
}

const updateDomainFunctionVersion = async () => {
  let updateParam = {
    // 如何selectedFunctionVersion的属性放到updateParam中
    ...selectedFunctionVersion,
    status: domainFunctionStatus_reversal[selectedFunctionVersion.status]

  }
  await domainFunctionVersionService.upsertDomainFunction(updateParam)
}

// 查询领域版本接口
const queryDomainFunctionVersion = () => {
  let queryParam = {
    sonDomainVersion: selectFrom.value.sonVersion,
    domainFunctionId: domainFunction.id
  }
  domainFunctionVersionService.queryDomainFunction(queryParam).then(res => {
    // 遍历res.versionList 把status从domainFunctionStatus进行转换成value值
    res.versionList.forEach(item => {
      item.status = domainFunctionStatus[item.status]
    })
    domainFunctionVersions.value = res.versionList
    // 获取domainFunctionVersions.value中version赋值给functionOptions.value
    functionOptions.value = res.versionList.map((item: any) => {
      return item.version
    })
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

.code_rule {
  // 设置内部元素合理的排列
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
