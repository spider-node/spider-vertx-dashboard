<template>
  <el-dialog
      v-model="dialogVisible"
      @close="cancel"
      :title="businessFunction.id == '' ? '新增功能' : '编辑功能'"
      width="500"
      :before-close="handleClose"
  >
    <el-form :model="businessFunction" label-width="auto" style="max-width: 600px">
      <el-form-item label="功能名称">
        <el-input v-model="businessFunction.functionName" placeholder="请输入功能名称"></el-input>
      </el-form-item>
      <el-form-item label="领域名称" prop="areaName">
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
      <el-form-item label="负责人">
        <el-input v-model="businessFunction.director" placeholder="请输入负责人"></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-select
            v-model="businessFunction.status"
            clearable
            placeholder="Select"
            style="width: 600px"
        >
          <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="businessFunction.desc" placeholder="描述"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="upsertBusiness">保存</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">

import {onMounted, ref, toRef} from "vue";
import domainService from "@/api/domain/domainService";
import businessFunctionService from "@/api/function/businessFunctionService";

const emit = defineEmits(['ok', 'cancel']);

const statusOptions = ref<ListItem[]>([{
  value: 'INIT',
  label: '初始化'
}])

const props = defineProps({
  businessFunction: {
    type: Object,
    default: {}
  },
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const domainName = ref('')

interface ListItem {
  value: string
  label: string
}

const loading = ref(false)

const businessFunction = ref<BusinessFunction>({})

const dialogVisible = toRef(props, 'dialogVisible')

const domains = ref<Array<Domain>>([])

const domain = ref<Domain>({})

watch(() => domainName.value, async (newVal, oldVal) => {
  domain.value = domains.value.find(item => item.areaName === newVal);
});

const handleClose = () => {
  emit('cancel')
}

const fetchAndFilterDomain = async (query) => {
  // 确保 query 是一个字符串
  if (typeof query !== 'string' || query.trim() === '') {
    query = ""
  }
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

onMounted(() => {
  // 请把props中的businessFunction赋值给businessFunction,可能存在类型不一样
  businessFunction.value = reactive(props.businessFunction);
  if(businessFunction.value.areaId){
    let queryParam = {
      id: businessFunction.value.areaId,
      page: 1,
      size: 10
    }
    domainService.queryDomain(queryParam).then(res => {
      domain.value = res.spiderAreaList[0]
      domains.value = res.spiderAreaList
      console.log("edit", businessFunction.value.functionName)
      domainName.value = domain.value.areaName
    })
  }
})

const cancel = () => {
  emit('cancel');
}

const upsertBusiness = () => {
  businessFunction.value.areaId = domain.value.id
  businessFunctionService.upsertBusinessFunction(businessFunction.value).then(res => {
    // 提交去保存
    emit('ok', businessFunction.value);
  })
}

</script>

<style scoped lang="scss">

</style>