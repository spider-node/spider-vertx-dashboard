<template>
  <el-tabs v-if="sonDomainVersionMap">
    <el-tab-pane v-for="(item, key) in sonDomainVersionMap" :key="key" :label="key">
      <el-table :data="item" style="width: 100%">
        <el-table-column prop="field" label="字段" width="180"></el-table-column>
        <el-table-column prop="fieldDesc" label="字段描述" width="180"></el-table-column>
        <el-table-column prop="domainFiled" label="领域字段" width="180"></el-table-column>
        <el-table-column prop="field" label="字段" width="180"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import sonDomainVersionService from "@/api/domain/sonDomainVersionService";
import {onMounted} from "vue";
import flowService from "@/api/flow/flowService";

const props = defineProps({
  flowId: {
    type: Number,
    default: ''
  }
})
const sonDomainVersionMap = ref({})
const queryBaseInfo = (ids: []) => {
  sonDomainVersionService.querySonDomainVersion({ids: ids}).then(res => {
    let sonDomainVersions: [] = res.sonAreaBaseInfos
    // 遍历sonDomainVersions
    sonDomainVersions.forEach(item => {
      // 遍历item.sonAreaBaseInfos
      // 把item中的domainObjectEntityName作为key,domainFieldInfos作为value放入sonDomainVersionMap中
      // 遍历item.domainFieldInfos
      let domainName = item.domainObjectEntityName.charAt(0).toLowerCase() + item.domainObjectEntityName.slice(1)

      item.domainFieldInfos.forEach(items => {
        // 把item.domainObjectEntityName变量的首字母变小写
        items['domainFiled'] = domainName + '.' + items.field
      })
      sonDomainVersionMap.value[domainName] = item.domainFieldInfos
      // item.domainFieldInfos的格式为
    })
  })
}

const getFlowDetail = () => {
  let data = {
    id: id.value
  }
  flowService.queryFlowData(data).then(res => {
    let sonAreaIds = JSON.parse(res.sonAreaIds)
    queryBaseInfo(sonAreaIds)
  })

}


const id = ref('')
onMounted(() => {
  id.value = props.flowId
  console.log("获取数据id为", id.value)
  getFlowDetail()
})

</script>

<style scoped lang="scss">

</style>
