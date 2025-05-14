<template>
  <el-dialog
      v-model="showEdit"
      title="功能版本操作"
      width="500"
      :before-close="showEditHandleClose"
  >
    <el-form :model="editVersionFrom" label-width="auto" style="max-width: 600px">
      <!--版本号-->
      <el-form-item label="版本号">
        <el-input v-model="editVersionFrom.version" placeholder="请输入版本号"></el-input>
      </el-form-item>
      <!--版本描述-->
      <el-form-item label="版本描述">
        <el-input v-model="editVersionFrom.versionDesc" placeholder="请输入版本描述"></el-input>
      </el-form-item>

      <!--版本描述-->
<!--      <el-form-item label="子域名称">
        <el-select
            v-model="selectedSonAreaNames"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="Select"
            style="width: 600px"
        ></el-select>
      </el-form-item>-->

      <!--版本描述-->
      <!--      <el-form-item label="子域版本">
              <el-input v-model="editVersionFrom.sonAreaDesc" placeholder="请输入版本描述" disabled></el-input>
            </el-form-item>-->
      <!--选择子域版本--->
      <el-form-item>
<!--        <el-button type="primary" @click="selectedSonDomain">选择子域</el-button>-->
        <el-button type="primary" @click="showDemand">新增需求</el-button>
        <el-button type="primary" @click="upsertBusiness">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog
      v-model="dialogVisibleDemand"
      title="需求处理"
      width="800"
      :before-close="handleDemandClose"
  >
    <DemandManager
        :demand="initDemand"
        @ok="updateDemand"
    ></DemandManager>
  </el-dialog>

  <SonDomainVersions
      v-if="showSonDomainVersion"
      :dialogVisible="showSonDomainVersion"
      :domain-function="domainFunction"
      :supportSelect="true"
      @cancel="showSonDomainVersion = false"
      @ok="selectSonDomainVersion"
  ></SonDomainVersions>
</template>

<script setup lang="ts">
import DemandManager from "@/components/function/DemandManager.vue";
import SonDomainVersions from "@/components/function/SonDomainVersion.vue";
import sonDomainVersionService from "@/api/domain/sonDomainVersionService";
import domainFunctionVersionService from "@/api/function/DomainFunctionVersionService";
import {onMounted} from "vue";

const emit = defineEmits(['ok', 'cancel']);

const props = defineProps({
  domainFunctionVersion: {
    type: Object,
    default: {}
  },
  domainFunction: {
    type: Object,
    default: {}
  },
  showEdit: {
    type: Boolean,
    default: false
  },
})

let operateVersion: DomainFunctionVersion

let initDemand: string[] = []

// 控制是否展示
const showEdit = ref(props.showEdit)

// 控制是否展示需求页面
const dialogVisibleDemand = ref(false)

// 控制选中子域版本的页面
const showSonDomainVersion = ref(false)

// 回调需求页面
const handleDemandClose = () => {
  dialogVisibleDemand.value = false
}

// 回调笨页面关闭后
const showEditHandleClose = () => {
  showEdit.value = false
  emit("cancel")
}

// 编辑的页面表单
const editVersionFrom = ref({
  version: "",
  versionDesc: "",
  tableName: "",
  sonAreaName: "",
  sonAreaDesc: "",
  sonDomainVersion: ""
})

// 展示子域列表
const selectedSonDomain = () => {
  showSonDomainVersion.value = true
}

// 展示需求页面
const showDemand = () => {
  console.log("编辑的数据为", initDemand)
  dialogVisibleDemand.value = true
}

let domainFunction: DomainFunction = props.domainFunction

let selectedSonDomainVersions: SonDomainVersion[] = []

const selectedSonAreaNames = ref([])

const domainFunctionStatus = {
  INIT: '初始化',
  CODING: '代码生成中',
  COMPILE: '编译完成',
  DEPLOY: '运行中'
}

// 进行编辑或者更新
const upsertBusiness = () => {
  // 遍历selectedSonDomainVersions 获取
  operateVersion.version = editVersionFrom.value.version
  operateVersion.versionDesc = editVersionFrom.value.versionDesc
  operateVersion.domainFunctionId = domainFunction.id
  operateVersion.domainFunctionName = domainFunction.name
  // operateVersion.status的值为domainFunctionStatus中的value如何通过value获取对应的key
  operateVersion.status = 'INIT'


  // 移除selectedSonDomainVersions中 不在selectedSonAreaNames里面的数据
  selectedSonDomainVersions = selectedSonDomainVersions.filter(item => selectedSonAreaNames.value.includes(item.sonAreaName))
  // 操作版本信息
  let sonDomainFunctionList: [] = []
  selectedSonDomainVersions.forEach(item => {
    let sonDomainFunctions = {
      sonDomainId: item.sonAreaId,
      sonDomainName: item.sonAreaName,
      sonDomainVersion: item.version,
      versionId: item.id
    }
    sonDomainFunctionList.push(sonDomainFunctions)
  })
  if (!operateVersion.sonDomainFunctions) {
    operateVersion.sonDomainFunctions = {};
  }
  operateVersion.sonDomainFunctions.sonDomainFunctionList = sonDomainFunctionList
  console.log("可以新增的数据为", operateVersion)
  domainFunctionVersionService.upsertDomainFunction(operateVersion).then(res => {
    console.log("新增或者编辑版本信息", res)
    emit("ok", operateVersion)
  })
}

// 回调更新需求内容
const updateDemand = (demand: [string]) => {
  if (!operateVersion.functionFunctional) {
    operateVersion.functionFunctional = {};
  }
  operateVersion.functionFunctional.functionalList = demand
  console.log("更新需求信息", operateVersion)
  dialogVisibleDemand.value = false
}


// 查询子域版本后回调的方法
const selectSonDomainVersion = (sonDomainVersion: SonDomainVersion) => {
  // 判断selectedSonDomainVersions的id中是否有sonDomainVersion中id，如果匹配就不添加
  console.log("selectedSonDomainVersions--添加之前------", selectedSonDomainVersions)
  if (selectedSonDomainVersions.find(item => item.id === sonDomainVersion.id)) {
    // 如果相等,就用sonDomainVersion替换到selectedSonDomainVersions中
    selectedSonDomainVersions = selectedSonDomainVersions.map(item => {
      if (item.id === sonDomainVersion.id) {
        return sonDomainVersion
      }
      return item
    })
  }else {
    selectedSonDomainVersions.push(sonDomainVersion)
  }
  console.log("selectedSonDomainVersions--------", selectedSonDomainVersions)
  // selectedSonAreaNames 清空 然后 遍历selectedSonDomainVersions 把 sonAreaName 赋值给selectedSonAreaNames
  selectedSonAreaNames.value = []
  selectedSonDomainVersions.forEach(item => {
    selectedSonAreaNames.value.push(item.sonAreaName)
  })
}
// 查询领域功能
const querySelectedSonDomainVersions = () => {
  if (operateVersion.sonDomainFunctions && operateVersion.sonDomainFunctions.sonDomainFunctionList.length > 0) {
    // 获取operateVersion.sonDomainFunctions.sonDomainFunctionList中的versionId
    const versionIds = operateVersion.sonDomainFunctions.sonDomainFunctionList.map(item => item.versionId)
    let queryVersionParam = {
      ids: versionIds
    }
    sonDomainVersionService.querySonDomainVersion(queryVersionParam).then(res => {
      selectedSonDomainVersions = res.sonAreaBaseInfos
    })
  }
}

onMounted(() => {
  operateVersion = props.domainFunctionVersion
  if (operateVersion) {
    editVersionFrom.value.version = operateVersion.version
    editVersionFrom.value.versionDesc = operateVersion.versionDesc
    // 加载需求
    if (operateVersion.functionFunctional) {
      // 按照之前经验，转两次会ok
      initDemand = operateVersion.functionFunctional.functionalList
    }
    if(operateVersion.sonDomainFunctions){
      // 加载子域信息
      let sonDomainFunctions = operateVersion.sonDomainFunctions.sonDomainFunctionList
      // sonDomainFunctions 是一个数组，数组中的对象体为 sonDomainId sonDomainName sonDomainVersion tableName 4个字段 遍历出 tableName 赋值给 selectedTableNames
      if (sonDomainFunctions) {
        sonDomainFunctions.forEach(item => {
          selectedSonAreaNames.value.push(item.sonDomainName)
        })
      }
    }
    // 加载子域对象
    querySelectedSonDomainVersions()
  } else {
    operateVersion = {}
  }

})

</script>

<style scoped lang="scss">

</style>