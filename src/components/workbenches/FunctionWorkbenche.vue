<template>
  <div class="common-layout">
    <el-container>
      <el-header height="400px">
        <el-form :model="form" label-width="auto" style="max-width: 600px">
          <el-form-item label="功能名称">
            <el-input v-model="form.name" placeholder="请输入流程名称"></el-input>
          </el-form-item>
          <el-form-item label="功能版本">
            <el-input v-model="form.version" placeholder="请输入流程名称"></el-input>
          </el-form-item>
          <el-form-item label="功能描述">
            <el-input v-model="form.desc" placeholder="请输入流程名称"></el-input>
          </el-form-item>
          <el-form-item label="领域名称">
            <el-input v-model="form.domainName" placeholder="请输入流程名称"></el-input>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="业务流设计" name="first">
            <!--流程组件-->
            <Process></Process>
          </el-tab-pane>

          <el-tab-pane label="数据流设计" name="second">

          </el-tab-pane>

          <el-tab-pane label="参数配置" name="third">

          </el-tab-pane>

          <el-tab-pane label="调试" name="fourth">

          </el-tab-pane>
          <el-tab-pane label="ai任务" name="fourth">

          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  name: '',
  version: '',
  desc: '',
  domainName: ''
})

</script>

<style scoped lang="scss">

</style>