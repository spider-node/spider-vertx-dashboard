<template>
  <div class="sonDomain">
    <div class="condition">
      <el-form :model="selectFrom" label-width="auto" style="max-width: 1000px">
        <el-form-item label="领域名称">
          <el-input v-model="selectFrom.areaName"/>
        </el-form-item>
        <el-form-item label="子域名称">
          <el-input v-model="selectFrom.sonAreaName"/>
        </el-form-item>
        <el-form-item label="数据源名称">
          <el-input v-model="selectFrom.datasource"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="querySonDomain()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="!supportSelection" @click="addSonDomain()">新增领域</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table :data="sonDomains" style="width: 100%">
        <el-table-column
            prop="id"
            label="id"
            width="200px"
            v-if="0"
        />

        <el-table-column
            prop="areaId"
            label="领域id"
            width="200px"
            v-if="0"
        />

        <el-table-column
            prop="areaName"
            label="领域名称"
            width="200px"
        />
        <el-table-column
            prop="sonAreaName"
            label="子域名称"
            width="200px"
        />
        <el-table-column
            prop="datasource"
            label="数据源名称"
            width="200px"
        />
        <el-table-column
            prop="tableName"
            label="表名称"
            width="200px"
        />
        <el-table-column
            prop="sonAreaDesc"
            label="描述"
            width="200px"
        />
        <el-table-column
            fixed="right"
            label="操作"
            width="300px"
        >
          <template #default="scope">
            <el-button type="text" size="small" v-if="!supportSelection" @click="editSonDomain(scope.row)">编辑
            </el-button>
<!--            <el-button type="text" size="small" v-if="!supportSelection" @click="init(scope.row)">初始化</el-button>-->
            <el-button type="text" size="small" @click="showInitInfo(scope.row)">初始化信息
            </el-button>
            <el-button type="text" size="small" v-if="supportSelection" @click="selectedSonDomains(scope.row)">选择
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
        />
      </div>
    </div>
  </div>

  <el-dialog v-model="showSonDomainEdit"
             title="子域操作"
             width="500"
             hight="500"
             :before-close="editHandleClose">
    <div>
      <el-form :model="sonDomain" label-width="auto" style="max-width: 1000px">
        <!-- 复选框支持输入过程中动态查询 -->
        <el-form-item label="领域名称" prop="areaName">
          <el-select v-model="sonDomain.areaName"
                     placeholder="请选择领域"
                     filterable
                     clearable
                     remote
                     :remote-method="fetchAndFilterDomain"
                     :loading="loading"
          >
            <el-option
                v-for="item in domains"
                :key="item.id"
                :label="item.areaName"
                :value="item.areaName"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="子域名称">
          <el-input v-model="sonDomain.sonAreaName"/>
        </el-form-item>
        <!-- 复选框支持输入过程中动态查询 -->
        <el-form-item label="数据源" prop="datasource">
          <el-select v-model="sonDomain.datasource"
                     placeholder="请选择数据源"
                     filterable
                     clearable
                     remote
                     :remote-method="fetchAndFilterDatasources"
                     :loading="loading"
          >
            <el-option
                v-for="item in datasources"
                :key="item.datasource"
                :label="item.name"
                :value="item.datasource"
            />
          </el-select>
        </el-form-item>

        <!-- 复选框支持输入过程中动态查询 -->
        <el-form-item label="选择表" prop="table">
          <el-select v-model="sonDomain.tableName"
                     placeholder="请选择表"
                     filterable
                     clearable
                     remote
                     :loading="loading"
          >
            <el-option
                v-for="item in tables"
                :key="item.tableName"
                :label="item.name"
                :value="item.tableName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="sonDomain.sonAreaDesc"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="upsertSonDomain()">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <SonDomainVersion
      v-if="showSonDomainVersion"
      :sonDomain="selectedSonDomain"
      :dialogVisible="showSonDomainVersion"
      :supportSelect="false"
      @cancel="showFinish()"
  >
  </SonDomainVersion>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import sonDomainService from "@/api/domain/sonDomainService";
import datasourceService from "@/api/datasource/datasourceService";
import tableService from "@/api/table/tableService";
import domainService from "@/api/domain/domainService"
import SonDomainVersion from "@/components/function/SonDomainVersion.vue";
import sonDomainVersionService from "@/api/domain/sonDomainVersionService";
import {ElMessage} from "element-plus";

const emit = defineEmits(['selectedSonDomain']);

const props = defineProps({
  supportSelection: {
    type: Boolean,
    default: false
  },
  domain_id: {
    type: String,
    default: ''
  }
})

const supportSelection = props.supportSelection

const domain_id = props.domain_id

const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

const selectedSonDomains = (sonDomain: SonDomain) => {
  emit('selectedSonDomain', sonDomain)
}

const datasources = ref<Datasource[]>([]);

const showSonDomainVersion = ref(false)

const tables = ref<Table[]>([])

const selectedTable = ref<Table>({})

const datasource = ref<Datasource>({});

const domains = ref<Domain[]>([])

const selectedSonDomain = ref<SonDomain>({})

const showInitInfo = (sonDomain: SonDomain) => {
  console.log('sonDomain', sonDomain)
  selectedSonDomain.value = sonDomain
  showSonDomainVersion.value = true
}

const showFinish = () => {
  showSonDomainVersion.value = false
  querySonDomain();
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

const fetchAndFilterDatasources = async (query) => {
  // 确保 query 是一个字符串
  loading.value = true;
  const sanitizedQuery = query.trim();
  let queryParam = {
    datasource: sanitizedQuery
  }
  const res = await datasourceService.queryDatasource(queryParam)
  datasources.value = res.datasourceInfos
  loading.value = false;
};

const sonDomain = ref<SonDomain>({
  areaName: '',
  sonAreaName: '',
  datasource: '',
  tableName: '',
  sonAreaDesc: ''
})


// 监听sonDomain.value.areaName的变化，并更新sonDomain.value.areaId
watch(() => sonDomain.value.areaName, async (newVal, oldVal) => {
  // 从datasources中过滤出datasource相同的一条数据复制给datasource
  const selectedDomains = domains.value.find(item => item.areaName === newVal);
  console.log("进行查询table了", newVal)
  if (selectedDomains) {
    sonDomain.value.areaId = selectedDomains.id
  }
  console.log("选中的数据源为", sonDomain.value)
});

// 监听sonDomain.value.datasource的变化 并更新sonDomain.动态刷新table
watch(() => sonDomain.value.datasource, async (newVal, oldVal) => {
  // 从datasources中过滤出datasource相同的一条数据复制给datasource
  const selectedDatasource = datasources.value.find(item => item.datasource === newVal);
  console.log("进行查询table了", newVal)
  if (selectedDatasource) {
    datasource.value = selectedDatasource;
    // 查询table方便选择
    let queryTableParam = {
      datasource: datasource.value.datasource
    }
    const res = await tableService.queryTable(queryTableParam)
    tables.value = res.tableInfos
  } else {
    datasource.value = {};
  }
  console.log("选中的数据源为", selectedDatasource)
});

const loading = ref(false);

const showSonDomainEdit = ref(false)

const upsertSonDomain = () => {
  sonDomainService.upsertSonDomain(sonDomain.value).then(res => {
    querySonDomain()
    editHandleClose()
  })
}

const editHandleClose = () => {
  showSonDomainEdit.value = false
  sonDomain.value = {
    areaName: '',
    sonAreaName: '',
    datasource: '',
    tableName: '',
    sonAreaDesc: ''
  }
}

const editSonDomain = (row: any) => {
  sonDomain.value = row
  showSonDomainEdit.value = true
}


const sonDomains = ref<SonDomain[]>([])

const init = async (row: SonDomain) => {
  let initParam = {
    sonDomainId: row.id
  }
  // 调用接口进行初始化
  sonDomainVersionService.initDomainBaseInfo(initParam).then(res => {
    ElMessage.success("初始化成功")
  })
}

const selectFrom = reactive({
  areaName: '',
  sonAreaName: '',
  datasource: ''
})

const querySonDomain = () => {
  let queryParam = {
    areaName: selectFrom.areaName,
    areaId: domain_id,
    sonAreaName: selectFrom.sonAreaName,
    datasource: selectFrom.datasource,
    size: pageParams.value.size,
    page: pageParams.value.page
  }
  sonDomainService.querySonDomain(queryParam).then(res => {
    sonDomains.value = res.spiderSonAreas
    pageParams.value.total = res.total
  })
}

const addSonDomain = () => {
  showSonDomainEdit.value = true
}

onMounted(() => {
  querySonDomain()
})

</script>

<style scoped lang="scss">
.sonDomain {
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