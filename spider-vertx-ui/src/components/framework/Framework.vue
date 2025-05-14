<script setup lang="ts">
import { ref } from 'vue';

const frameworkName = ref('');
const frameworkDoc = ref('');
const packagePath = ref('');
const configClass = ref('');

const handleEdit = () => {
  // 编辑逻辑
};

const handleSubmit = () => {
  // 提交逻辑
};
</script>

<template>
  <div class="framework-form">
    <el-form label-width="auto" style="max-width: 600px">
      <el-form-item label="框架名称">
        <el-input v-model="frameworkName" placeholder="请输入框架名称"></el-input>
      </el-form-item>
      <el-form-item label="框架使用文档">
        <el-input v-model="frameworkDoc" type="textarea" placeholder="请输入框架使用文档"></el-input>
      </el-form-item>
      <el-form-item label="包路径">
        <el-input v-model="packagePath" placeholder="请输入包路径"></el-input>
      </el-form-item>
      <el-form-item label="config配置类">
        <el-input v-model="configClass" placeholder="请输入config配置类"></el-input>
      </el-form-item>
    </el-form>
    <div class="button-group">
      <el-button @click="handleEdit">编辑</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.framework-form {
  padding: 20px;
  .button-group {
    margin-top: 20px;
    text-align: center;
  }
}
</style>