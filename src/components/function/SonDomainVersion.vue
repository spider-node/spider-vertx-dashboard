<template>
  <el-dialog
      v-model="dialogVisible"
      title="版本列表"
      width="1400"
      :before-close="handleClose"
  >
    <div class="select" v-if="supportSelect">
      <el-form :model="selectVersionFrom" label-width="auto" style="max-width: 600px">
        <el-form-item label="子域名称">
          <el-input v-model="selectVersionFrom.sonAreaName" placeholder="请输入子域名称" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="querySonDomainVersion">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="init_son_domain"  v-if="!supportSelect">
      <el-button type="primary" @click="init()">更新</el-button>
      <el-select
          v-model="selectedVersionNew"
          placeholder="Select"
          size="large"
          style="width: 240px"
      >
        <el-option
            v-for="item in versionOptions"
            :key="item"
            :label="item"
            :value="item"
        />
      </el-select>
      <el-button type="primary" @click="upgrade()">升级</el-button>
    </div>
    <div class = "tables">
      <el-table :data="sonDomainVersions" style="width: 100%">
        <el-table-column prop="sonAreaName" label="领域名称" width="180"/>
        <el-table-column prop="sonAreaName" label="子域名称" width="180"/>
        <el-table-column prop="domainObjectEntityName" label="领域对象名称" width="180"/>
        <el-table-column prop="domainObjectServiceName" label="service名称" width="180"/>
        <el-table-column prop="version" label="版本" width="180"/>
        <el-table-column prop="groupId" label="groupId" width="180"/>
        <el-table-column prop="artifactId" label="artifactId" width="180"/>
        <el-table-column
            fixed="right"
            label="操作"
            width="200px"
        >
          <template #default="scope">
            <el-button type="text" size="small" @click="showEntityClass(scope.row)">查看实体类</el-button>
            <el-button type="text" size="small" v-if="supportSelect" @click="selectedVersions(scope.row)">选取</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </el-dialog>

  <el-dialog  v-model="showEntityJson"
              title="子域信息"
              width="1200"
              :before-close="showClose">
    <el-button type="primary" @click="updateFlied">保存修改</el-button>
    <el-table v-if="showEntityJson" :data="selectedVersionObject" style="width: 100%">
      <el-table-column prop="field" label="字段名称" width="180" />
      <!--增加一个操作的列-->
      <el-table-column
          fixed="right"
          label="字段描述"
          width="500px"
      >
        <template #default="scope">
          <el-input v-model="scope.row.fieldDesc" placeholder="请输入字段描述" clearable/>
        </template>
      </el-table-column>
<!--      <el-table-column prop="fieldDesc" label="字段描述" width="180" />-->
      <el-table-column prop="tableField" label="表字段" width="180"  />
      <el-table-column prop="type" label="字段类型" width="180"  />
      <!--增加一个操作的列-->
      <el-table-column
          fixed="right"
          label="操作"
          width="100px"
      >
        <template #default="scope">
          <!--实现 切换 必填非必填 -->
          <div><p>必填</p></div>
          <el-switch
              v-model="scope.row.must"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              @change="updateUniqueIndex()"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import sonDomainVersionService from "@/api/domain/sonDomainVersionService";
import {onMounted} from "vue";
import {ElMessage} from "element-plus";

const emit = defineEmits(['ok', 'cancel']);
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  supportSelect: {
    type: Boolean,
    default: false
  },
  domainFunction: {
    type: Object,
    default: {}
  },
  sonDomain: {
    type: Object,
    default: {}
  }
})

const selectVersionFrom = ref({
  sonAreaName: '',
  areaName: ''
})

const supportSelect = props.supportSelect

const dialogVisible = ref(props.dialogVisible)

const showEntityJson = ref(false)

let domainFunction: DomainFunction = props.domainFunction

const showClose = () => {
  showEntityJson.value = false
}

const selectedVersion = ref<SonDomainVersion>({})

const selectedVersionObject= ref<DomainFieldInfo[]>([])

const sonDomainVersions = ref<SonDomainVersion[]>([])

const showEntityClass = (row: SonDomainVersion) => {
  showEntityJson.value = true
  selectedVersion.value = row
  // 遍历 row.domainFieldInfos
  row.domainFieldInfos.forEach(item => {
    // 判断 item.must是否为空
    if (item.must === undefined) {
      item.must = false
    }
  })
  selectedVersionObject.value = row.domainFieldInfos
}

const updateUniqueIndex = () => {
  let updateFieldInfo = {
    id: selectedVersion.value.id,
    tableFieldInfos: selectedVersionObject.value
  }
  sonDomainVersionService.updateSonDomainVersion(updateFieldInfo).then(res => {
    ElMessage.success("更新成功")
    querySonDomainVersion()
  })
}

const updateFlied = () => {
  let updateFieldInfo = {
    id: selectedVersion.value.id,
    tableFieldInfos: selectedVersionObject.value
  }
  sonDomainVersionService.updateSonDomainVersion(updateFieldInfo).then(res => {
    ElMessage.success("更新成功")
    querySonDomainVersion()
  })
}

onMounted(() => {
  querySonDomainVersion()
})

let sonDomain: SonDomain = props.sonDomain

let versionOptions = []

const selectedVersionNew = ref('')

const init = () => {
  // 判断selectedVersion 如果为空，则提示选择版本
  if (selectedVersion.value === '') {
    ElMessage.warning("请选择版本")
    return
  }
  let initParam = {
    sonDomainId: sonDomain.id,
    upgrade: false,
    version: selectedVersionNew.value
  }
  // 调用接口进行初始化
  sonDomainVersionService.initDomainBaseInfo(initParam).then(res => {
    ElMessage.success("初始化成功")
    querySonDomainVersion()
  })
}

const upgrade = () => {
  let initParam = {
    sonDomainId: sonDomain.id,
    upgrade: true
  }
  // 调用接口进行初始化
  sonDomainVersionService.initDomainBaseInfo(initParam).then(res => {
    ElMessage.success("初始化成功")
    querySonDomainVersion()
  })
}

const querySonDomainVersion = () => {
  // 获取domainFunction.sonDomainInfo数组中sonDomainId
  let sonDomainIds = []
  if(domainFunction.sonDomainInfo){
    sonDomainIds = domainFunction.sonDomainInfo.sonDomainModes.map(item => item.sonDomainId)
  }

  let queryParam = {
    sonAreaIds: sonDomainIds,
    sonAreaId: sonDomain.id
  }
  sonDomainVersionService.querySonDomainVersion(queryParam).then(res => {
    sonDomainVersions.value = res.sonAreaBaseInfos
    versionOptions = sonDomainVersions.value.map(item => item.version)
  })
}

const selectedVersions = (row: SonDomainVersion) => {
  emit('ok', row)
  ElMessage.success("选择子域版本成功")
}

const handleClose = () => {
  emit('cancel')
}

</script>

<style scoped lang="scss">
.select {
  .el-form{
    display: flex;
    // 设置靠左
    justify-content: flex-start;
    // 设置输入框右边距
    .el-form-item{
      margin-right: 20px;
    }
  }
}
.init_son_domain {
  // 设置div内的，button,select横向排列并且抱持间距
  display: flex;
  justify-content: flex-start;
  align-items: center;
  // 设置button,select间距
  margin-right: 20px;
  .el-select {
    // 设置边距
    margin: 20px;
  }

}
</style>