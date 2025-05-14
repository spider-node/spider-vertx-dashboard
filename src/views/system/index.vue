<template>
  <div class="header">
    <img class="logo" src="../../assets/images/logo.jpg"/>
    <span class="title">spider-node-ai</span>
    <el-select
        v-model="spider_type"
        placeholder="Select"
        size="large"
        style="width: 240px"
    >
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
  </div>
  <div class="system_context">
    <div class="function_info">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="领域" name="first">
          <Domain></Domain>
        </el-tab-pane>
        <el-tab-pane label="子域" name="second">
          <SonDomain></SonDomain>
        </el-tab-pane>
        <el-tab-pane label="数据源" name="third">
          <Datasources></Datasources>
        </el-tab-pane>
        <el-tab-pane label="宿主机" name="fourth">
          <DomainFunction></DomainFunction>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="preview">
      <FunctionPreview></FunctionPreview>
    </div>
  </div>
</template>

<script setup lang="ts">
import FunctionPreview from "@/components/function/FunctionPreview.vue";
import DomainFunction from "@/components/function/DomainFunction.vue";
import Datasources from "@/components/function/Datasources.vue";
import Domain from "@/components/function/Domain.vue";
import SonDomain from "@/components/function/SonDomain.vue";
import {useRouter} from "vue-router";
const activeName = ref('first')
const router = useRouter()
const handleClick = (tab: any, event: any) => {
  console.log(tab, event);
}
const options = [
  {
    value: 'FUNCTION',
    label: '功能配置',
  },
  {
    value: 'SYSTEM',
    label: '系统设置',
  }]
const spider_type = ref('SYSTEM')
watch(spider_type, (newValue, oldValue) => {
  console.log('spider_type changed from', oldValue, 'to', newValue);
  if (newValue === 'FUNCTION') {
    router.push({
      path: 'functions',
    })
  }
});
</script>

<style scoped lang="scss">
.header {
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

.system_context {
  display: flex; /* 使用Flexbox布局 */

  height: 100%;
  background: #f5f5f5;

  .overview, .function_info {
    height: 100%;
  }

  .function_info {
    width: 70%;
    margin: 5px;
  }

  .overview {
    width: 30%;
    // 设置上边距5px
    margin: 10px;
  }
}
//el-select 靠最右边展示
.el-select {
  margin-left: auto;
}

</style>