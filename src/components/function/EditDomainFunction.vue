<template>
  <el-dialog
      v-model="dialogVisible"
      @close="cancel"
      :title="领域功能操作"
      width="500"
      :before-close="handleClose"
  >
    <el-form :model="domainFunction" label-width="auto" style="max-width: 600px">
      <el-form-item label="功能名称">
        <el-input v-model="domainFunction.name" placeholder="请输入领域" clearable></el-input>
      </el-form-item>

      <el-form-item label="任务组件">
        <el-input v-model="domainFunction.taskComponent" placeholder="请输入任务组件" clearable></el-input>
      </el-form-item>

      <el-form-item label="任务服务">
        <el-input v-model="domainFunction.taskService" placeholder="请输入任务服务" clearable></el-input>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="domainFunction.desc" placeholder="请输入描述" clearable></el-input>
      </el-form-item>

      <el-form-item label="服务类型">
        <!--使用select的下拉框，需要自己定义数据源-->
        <el-select v-model="domainFunction.workerType" placeholder="请选择服务类型">
          <el-option
              v-for="item in workerTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选中领域" prop="areaName">
        <el-select v-model="domainName"
                   placeholder="请选择领域"
                   filterable
                   clearable
                   remote
                   :remote-method="fetchAndFilterDomain"
                   :loading="loading"
                   style="width: 600px"
        >
          <el-option
              v-for="item in domains"
              :key="item.id"
              :label="item.areaName"
              :value="item.areaName"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="选择子域" prop="areaName">
              <el-select
                  v-model="sonDomainNames"
                  multiple
                  placeholder="Select"
                  style="width: 600px"
                  @change="sonDomainNameChange"
              >
              </el-select>
            </el-form-item>-->

      <el-form-item>
        <el-button type="primary" @click="upsertBusiness">保存</el-button>
        <!--        <el-button type="primary" @click="showSonDomain">选择子域</el-button>-->
      </el-form-item>

    </el-form>
  </el-dialog>
  <el-dialog
      v-model="showSonDomains"
      title="Tips"
      width="1200"
      :before-close="closeSonDomain"
  >
    <son-domains v-if="showSonDomains" :support-selection=true @selected-son-domain="selectedSonDomains"/>
  </el-dialog>

</template>

<script setup lang="ts">
import domainService from "@/api/domain/domainService";
import sonDomainService from "@/api/domain/sonDomainService";
import domainFunctionService from "@/api/function/DomainFunctionService";
import {onMounted, ref, watch} from "vue";
import SonDomains from "@/components/function/SonDomain.vue";
import {ElMessage} from "element-plus";

const emit = defineEmits(['ok', 'cancel']);

const props = defineProps({
  domainFunction: {
    type: Object,
    default: {}
  },
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const domainFunction = ref<DomainFunction>({})

const dialogVisible = ref(props.dialogVisible)

const domainName = ref('')

let sonDomains: SonDomain[] = []

const selectedDomain = ref<Domain>({})

const domains = ref<Domain[]>([])

const loading = ref(false)

// 存子域的名称
const sonDomainNames = ref<string[]>([])
const showSonDomains = ref(false)
const closeSonDomain = () => {
  showSonDomains.value = false
}

const showSonDomain = () => {
  if (!selectedDomain.value.id) {
    ElMessage.error("请先选择领域,再选择子域")
    return
  }
  showSonDomains.value = true
}

const selectedSonDomains = (sonDomain: SonDomain) => {
  // pan
  sonDomains.push(sonDomain)
  // 遍历 sonDomains 获取 sonAreaName 给到sonDomainNames中
  sonDomains.forEach(sonDomain => {
    // 判断 sonDomain.sonAreaName 在sonDomainNames 中是否存在，不存在进行添加
    if (sonDomainNames.value.indexOf(sonDomain.sonAreaName) === -1) {
      // 如果不存在，则添加到数组中
      sonDomainNames.value.push(sonDomain.sonAreaName);
    }
  })
  ElMessage.success("选择子域成功")
}

const sonDomainNameChange = () => {
  // 过滤掉sonDomainNames.value中sonDomainNames不存在的数据
  // 移除sonDomains中与sonDomainNames匹配后剩下的数据
  sonDomains = sonDomains.filter(sonDomain => {
    return sonDomainNames.value.indexOf(sonDomain.sonAreaName) !== -1
  })
  console.log("---过滤掉的数据为", sonDomains)
}

const fetchAndFilterDomain = async (query) => {
  // 确保 query 是一个字符串
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

const querySonDomain = () => {
  // 在domainFunction.value的sonDomainInfo中获取sonDomainId转为数组
  if (domainFunction.value.sonDomainInfo) {
    const sonDomainIds = domainFunction.value.sonDomainInfo.sonDomainModes.map(item => item.sonDomainId)
    let queryParam = {
      ids: sonDomainIds,
      page: 1,
      size: 10
    }
    sonDomainService.querySonDomain(queryParam).then(res => {
      sonDomains = res.spiderSonAreas
      sonDomains.forEach(sonDomain => {
        // 判断 sonDomain.sonAreaName 在sonDomainNames 中是否存在，不存在进行添加
        if (sonDomainNames.value.indexOf(sonDomain.sonAreaName) === -1) {
          // 如果不存在，则添加到数组中
          sonDomainNames.value.push(sonDomain.sonAreaName);
        }
      })
    })
  }
}

// 查询领域
const queryDomain = () => {
  let queryParam = {
    page: 1,
    size: 10,
    id: domainFunction.value.areaId
  }
  domainService.queryDomain(queryParam).then(res => {
    selectedDomain.value = res.spiderAreaList[0]
  })
}

onMounted(() => {
  domainFunction.value = props.domainFunction
  domainName.value = props.domainFunction.areaName
  querySonDomain()
  queryDomain();
})

const domainFunctionStatus = {
  INIT: '研发中',
  STOP: '停止',
  START: '运行中'
}

const workerType = {
  MICROSERVICE: '微服务',
  HOST_APPLICATION: '宿主应用',
}

watch(() => domainName.value, (newDemand) => {
  selectedDomain.value = domains.value.find(item => item.areaName === newDemand)
})

const upsertBusiness = async () => {
  if (sonDomains.length > 0) {
    // 遍历sonDomains 构造对象 获取 sonDomain字段 id 赋值给sonDomainId 字段sonAreaName 赋值给 sonDomainName
    const selectedSonDomain = sonDomains.map(item => {
      return {
        sonDomainId: item.id,
        sonDomainName: item.sonAreaName
      }
    })
    domainFunction.value.sonDomainInfo = {
      sonDomainModes: selectedSonDomain
    }
  }
  if (selectedDomain.value) {
    domainFunction.value.areaId = selectedDomain.value.id
    domainFunction.value.areaName = selectedDomain.value.areaName
  }
  // 转换status,根据中文转英文
  domainFunction.value.status = Object.keys(domainFunctionStatus).find(key => domainFunctionStatus[key] === domainFunction.value.status)
  // 转换domainFunction.value.workerType,使用workerType对象,通过domainFunction.value.workerType是宿主应用或者微服务 匹配出 MICROSERVICE等
  domainFunction.value.workerType = Object.keys(workerType).find(key => workerType[key] === domainFunction.value.workerType)
  domainFunction.value.workerType = domainFunction.value.workerType === '宿主应用' ? 'HOST_APPLICATION' : 'MICROSERVICE'

  console.log('执行操作的domainFunction', domainFunction.value)
  domainFunctionService.upsertDomainFunction(domainFunction.value).then(res => {
    // 提交去保存
    console.log('操作领域功能完成', res)
    emit('ok', domainFunction.value);
  })
}


const cancel = () => {
  emit('cancel');
}

const handleClose = () => {
  emit('cancel')
}

const workerTypeOptions = [
  {
    value: 'MICROSERVICE',
    label: '微服务'
  },
  {
    value: 'HOST_APPLICATION',
    label: '宿主应用'
  }
]


</script>

<style scoped lang="scss">

</style>