<template>
  <el-timeline style="max-width: 600px; height: 70vh; overflow-y: auto;">
    <!--实现 一个数组,遍历生成el-timeline-item-->
    <el-timeline-item v-for="(item,index) in steps" :key="index" :timestamp="item.timestamp" placement="top">
      <el-card>
        <h4>{{ item.step }}</h4>
        <p>{{ item.stepStatus }}</p>
        <!--判断item.error是否为空 如果不为空就展示-->
        <div v-if="item.error">
          <el-button type="danger" @click="showException(item.error)">查看异常</el-button>
        </div>
      </el-card>
    </el-timeline-item>
  </el-timeline>

  <el-dialog v-model="dialogVisible" title="异常信息" width="50%" :before-close="handleClose">
    <div
        class="info"
        v-text="selectedError"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, defineProps, onMounted} from 'vue'
import aiTaskService from "@/api/ai/aiTaskService";

const props = defineProps({
  domainVersionId: {
    type: String,
    default: ''
  }
})
const steps = ref<CoderTaskTimeline[]>([]);

const coderTaskStep = {
  LOAD_DOMAIN_INFO:"加载项目信息",
  CODER:"生成代码",
  CHECK:"代码检查",
  CODER_ARRANGEMENT:"代码整理",
  COMPILE:"编译",
  COMPILE_ERROR:"编译错误",
  TEST:"测试",
  END:"结束"
}

const coderStepStatus = {
  SUSS:"执行成功",
  FAIL:"执行失败",
}

const queryAiTaskStep = () => {
  aiTaskService.queryAiTaskStep({
    functionVersionId: props.domainVersionId
  }).then(res => {
    // 遍历res.steps 把step到coderTaskStep中获取对应的值
    res.steps.forEach(item => {
      item.step = coderTaskStep[item.step]
      item.stepStatus = coderStepStatus[item.stepStatus]
    })
    steps.value = res.steps
  })
}
const dialogVisible = ref(false)
const selectedError = ref('')

const showException = (error: string) => {
  selectedError.value = error
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
}

onMounted(() => {
  queryAiTaskStep()
})

</script>


<style scoped lang="scss">

</style>