<template>
  <div>
    <div class="operate">
      <el-form :model="ruleForm" :inline="true" label-width="auto" style="max-width: 600px">
        <el-form-item label="规则名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectRule">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectRule">新增规则</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="name" label="规则名称" width="180"></el-table-column>
        <el-table-column prop="type" label="规则类型" width="180"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">

</style>