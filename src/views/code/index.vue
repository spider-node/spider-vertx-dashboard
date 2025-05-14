<template>
  <div class="code_header">
    <img class="logo" src="../../assets/images/logo.jpg"/>
    <span class="title">spider-node-ai</span>
  </div>
  <div class="code_context">
    <div class="function_info">
      <el-form :model="form" label-width="auto" style="max-width: 1000px">
        <el-form-item label="功能名称">
          <p>{{ form.name }}</p>
        </el-form-item>
        <el-form-item label="功能版本">
          <p>{{ form.version }}</p>
        </el-form-item>
        <el-form-item label="功能描述">
          <p>{{ form.desc }}</p>
        </el-form-item>
        <el-form-item label="领域名称">
          <p>{{ form.domainName }}</p>
        </el-form-item>
      </el-form>
    </div>
    <div class="code_design">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="业务流设计" name="first">
          <!--流程组件-->
        </el-tab-pane>

        <el-tab-pane label="调试" name="fourth">

        </el-tab-pane>
        <el-tab-pane label="ai任务" name="fourth">

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  name: '',
  version: '',
  desc: '',
  domainName: ''
})

const activeName = ref('first')

</script>

<style scoped lang="scss">
.code_header {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 20px;
    font-weight: bold;
    margin-left: 20px;
  }

  .logo {
    width: 40px;
    height: 40px;
  }
}
.code_context {
  // dev横向排列
  display: flex;
  flex-direction: column;
  .function_info{
    height: 40%;
    // 设置表单中的input横向排列
    .el-form{
      max-width: 600px;
      // itm横向分布
      display: flex;

      justify-content: space-between;
      //外边框浅层白色
      border: 1px solid #ebeef5;
      .el-form-item {
        // 设置边距10px
        margin: 10px;
        .span {
          // 设置边距
          margin: 0 10px;
        }
      }
    }
  }
  .code_design{
    height: 60%;
    // 设置左边距，右边距
    padding: 0 20px;

  }

}

</style>