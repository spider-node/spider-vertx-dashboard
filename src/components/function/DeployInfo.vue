<template>
  <el-dialog
      v-model="dialogVisible"
      title="部署情况"
      width="500"
      :before-close="handleClose"
  >
    <div class="operate">
      <el-button type="primary" @click="queryDeployInfo">查询</el-button>
      <el-button type="primary" @click="showScale">扩缩容</el-button>
      <el-button type="primary" @click="uninstallBiz">卸载</el-button>
    </div>
    <div class="deploy_tables"></div>
    <el-table :data="deployInfos" style="width: 100%">
      <el-table-column prop="ip" label="宿主机ip" width="180"/>
      <el-table-column prop="date" label="部署时间" width="180"/>
    </el-table>
  </el-dialog>

  <el-dialog
      v-model="scaleNumDialogVisible"
      title="扩缩容"
      width="400"
      :before-close="scaleNumHandleClose"
  >
    <div class="scale">
      <el-input v-model="scaleNum" placeholder="请输入梳理数量"/>
      <el-button type="primary" @click="scaleFunctionNum">确定</el-button>
    </div>

  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, toRef} from "vue";
import aiTaskService from "@/api/ai/aiTaskService";
import hostService from "@/api/host/hostService";
import {ElMessage} from "element-plus";

const emit = defineEmits(['cancel']);

const props = defineProps({
  domainFunctionVersionId: {
    type: String,
    default: ''
  },
  domainFunction: {
    type: Object as () => DomainFunction,
    default: {}
  },
  version: {
    type: String,
    default: ''
  },

  showDeploy: {
    type: Boolean,
    default: false
  }
})

const scaleNum = ref(0)

const scaleNumDialogVisible = ref(false)

const scaleNumHandleClose = () => {
  scaleNumDialogVisible.value = false
}

const showScale = () => {
  scaleNumDialogVisible.value = true
}

const dialogVisible = toRef(props, 'showDeploy')

const domainFunction: DomainFunction = props.domainFunction

let version: string = props.version

// 新增一个对象status 里面有属性
const deployInfos = ref<DeployModel[]>([])

let domainFunctionVersionId: string

const queryDeployInfo = () => {
  let param = {
    taskComponent: domainFunction.taskComponent,
    taskService: domainFunction.taskService,
    version: version,
  }
  hostService.queryTaskDeploy(param).then(res => {
    deployInfos.value = res.ips.map(item => {
      return {
        ip: item,
        //设置当前时间
        date: '2025-03-25'
      }
    })
    // scaleNum.value = deployInfos.value的数组长度
    scaleNum.value = deployInfos.value.length
  })
}

const uninstallBiz = () => {
  let param = {
    domainFunctionVersionId: domainFunctionVersionId
  }
  aiTaskService.uninstallPlugin(param).then(res => {
    ElMessage.success("卸载成功")
  })
}

function scaleFunctionNum() {
  let param = {
    domainFunctionVersionId: domainFunctionVersionId,
    instanceNum: scaleNum.value
  }
  aiTaskService.updateCoder(param).then(res => {
    ElMessage.success("扩缩容成功")
    scaleNumDialogVisible.value = false
  })
}

onMounted(() => {
  domainFunctionVersionId = props.domainFunctionVersionId
  queryDeployInfo()
})

const handleClose = () => {
  emit("cancel")
}


</script>

<style scoped lang="scss">
.scale {
  // 设置按钮在左下角，与输入框抱持间距
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;

  .el-button {
    margin-left: 20px;
  }
}
</style>