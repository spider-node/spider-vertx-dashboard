<template>
  <div class="content" >
    <el-tabs
        v-model="activeName"
        :destroyInactiveTabPane="true"
        class="demo-tabs"
    >

      <el-tab-pane label="业务功能" name="first">
        <ChooseBusinessFunction></ChooseBusinessFunction>
      </el-tab-pane>
      <el-tab-pane label="Config" name="second">Config</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import ChooseBusinessFunction from "./ChooseBusinessFunction.vue";
import FunctionWorkbenche from "@/components/workbenches/FunctionWorkbenche.vue";

const activeName = ref<number>(0)

</script>

<style scoped lang="scss">

</style>