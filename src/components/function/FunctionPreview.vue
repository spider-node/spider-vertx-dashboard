<template>
  <div class="preview">
    <el-card style="width: 100px; height: 100px" shadow="always">
      <span>业务功能总数</span>
      <!--获取 functionPreview中的businessFunctionTotal-->
      <el-text class="mx-1">{{ functionPreview.businessFunctionTotal }}</el-text>
    </el-card>
    <el-card style="width: 100px; height: 100px" shadow="always">
      <span>未完成功能总数</span>
      <el-text class="mx-1">{{ functionPreview.businessFunctionVersionTotal }}</el-text>
    </el-card>

    <el-card style="width: 100px; height: 100px" shadow="always">
      <span>领域功能总数</span>
      <el-text class="mx-1">{{ functionPreview.domainFunctionTotal }}</el-text>
    </el-card>

    <el-card style="width: 100px; height: 100px" shadow="always">
      <span>未完成领域功能总数</span>
      <el-text class="mx-1">{{ functionPreview.domainFunctionUnfinished }}</el-text>
    </el-card>

    <el-card style="width: 100px; height: 100px" shadow="always">
      <span>领域数量</span>
      <el-text class="mx-1">{{ functionPreview.domainTotal }}</el-text>
    </el-card>

    <el-card style="width: 100px; height: 100px" shadow="always">
      <span>数据源总数</span>
      <el-text class="mx-1">{{ functionPreview.domainTotal }}</el-text>
    </el-card>

    <el-card style="width: 100px; height: 100px" shadow="always">
      <span>子域数量</span>
      <el-text class="mx-1">{{ functionPreview.subDomainTotal }}</el-text>
    </el-card>
  </div>
</template>

<script setup lang="ts">

const functionPreview = ref<FunctionPreview>({})

const querySystemDataInfo = () => {
  functionPreview.value = {
    businessFunctionTotal: 0,
    businessFunctionVersionTotal: 0,
    domainFunctionTotal: 0,
    domainFunctionUnfinished: 0,
    domainTotal: 0,
    subDomainTotal: 0,
    dataSourceTotal: 0,
  }
}

onMounted(() => {
  // 获取数据
  querySystemDataInfo()
})

</script>

<style scoped lang="scss">
.preview {
  display: flex;
  // 设置卡片横向排列 自动靠左换行
  flex-wrap: wrap;
  justify-content: flex-start;
  // 设置 el-card的边距未10px
  padding: 10px;
  margin: 2px;
  // 设置 el-card
  .el-card {
    margin: 2px;
  }
}

</style>