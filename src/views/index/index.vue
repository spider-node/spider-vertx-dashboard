<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="header">
          <img class="logo" src="../../assets/images/logo.jpg" />
          <span class="title">spider-node-ai</span>
        </div>
      </el-header>
      <el-main>
        <div class="home_context">
          <div class="code" @click="showCode">
            <span>研发模式</span>
          </div>
          <div class="log" @click="showLog">
            <span>日志模式</span>
          </div>
          <div class="domain" @click="systemSet">
            <span>系统设置</span>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
  <!-- <RouterView /> -->
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const showCode = () => {
  router.push({
    path: 'functions',
  })
}
const showLog = () => {}
const systemSet = () => {
  router.push({
    path: 'system',
  })
}
</script>

<style lang="scss" scoped>
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

.home_context {
  padding: 10px 20px;
  display: flex;
  /* 子元素在交叉轴（垂直方向）靠左上方 */
  align-items: flex-start;
  /* 水平主轴上紧凑分布 */
  flex-wrap: wrap;
  // 设置border 颜色为 深白色
  border: 1px solid #e6e7e9;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 750px;
  // 鼠标移动上去呈现一个手掌
  // 自定义的code高度不生效
  .code {
    width: 200px;
    height: 200px;
    //设置边框为浅白灰色
    border: 1px solid #ccc;
    background: #f5f5f5;
    // 设置左右边距为2px
    margin-right: 2px;
    cursor: pointer;
    span {
      display: inline-block;
      width: 100%;
      height: 100%;
      // 设置字体的显示样式
      line-height: 200px;
      text-align: center;
    }
  }
  .log {
    width: 200px;
    height: 200px;
    //设置背景为深白色
    background: #f5f5f5;
    border: 1px solid #ccc;

    margin-right: 2px;
    cursor: pointer;

    // 设置log中的span样式
    span {
      display: inline-block;
      width: 100%;
      height: 100%;
      // 设置字体的显示样式
      line-height: 200px;
      text-align: center;
    }
  }
  .domain {
    width: 200px;
    height: 200px;
    // 设置背景颜色为浅白色
    background: #f5f5f5;
    //设置边框为浅白灰色
    border: 1px solid #ccc;
    margin-right: 2px;
    cursor: pointer;
    span {
      display: inline-block;
      width: 100%;
      height: 100%;
      // 设置字体的显示样式
      line-height: 200px;
      text-align: center;
    }
  }
}
</style>
