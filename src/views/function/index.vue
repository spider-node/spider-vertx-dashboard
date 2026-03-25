<template>
  <div class="header">
    <img class="logo" src="../../assets/images/logo.jpg"/>
    <span class="title">spider-node-ai</span>
    <el-button type="primary" @click="showTask">查看ai任务</el-button>
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
  <div class="function_context">
    <div class="function_info">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="业务功能" name="first">
          <BusinessFunction></BusinessFunction>
        </el-tab-pane>
        <el-tab-pane label="领域功能" name="second">
          <DomainFunction></DomainFunction>
        </el-tab-pane>
        <el-tab-pane label="数据流" name="third">
          <Flow></Flow>
        </el-tab-pane>
        <el-tab-pane label="日志" name="four">
          <RunTimeLog></RunTimeLog>
        </el-tab-pane>
<!--        <el-tab-pane label="框架" name="five">
          <Framework></Framework>
        </el-tab-pane>-->
        <el-tab-pane label="http应用" name="six">
          <HttpFunction></HttpFunction>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import BusinessFunction from "@/components/function/BusinessFunction.vue";
import DomainFunction from "@/components/function/DomainFunction.vue";
import Framework from "@/components/framework/Framework.vue";
import HttpFunction from "@/components/http/HttpFunction.vue";
import Flow from "@/views/Flow/Flow.vue";
import RunTimeLog from "@/views/log/RunTimeLog.vue";
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


const showTask = () => {
  //根据一个http的url地址打开一个新页面
  window.open('http://47.109.67.130:5000');
}


const spider_type = ref('FUNCTION')

watch(spider_type, (newValue, oldValue) => {
  console.log('spider_type changed from', oldValue, 'to', newValue);
  if (newValue === 'SYSTEM') {
    router.push({
      path: 'system',
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

  // 设置span的右边距
  span {
    margin-right: 20px;
  }

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

.function_context {
  display: flex; /* 使用Flexbox布局 */

  height: 100%;
  background: #f5f5f5;

  .overview, .function_info {
    height: 100%;
  }

  .function_info {
    width: 90%;
    margin: 5px;
  }
}

//el-select 靠最右边展示
.el-select {
  margin-left: auto;
}


</style>
