<template>
  <el-dialog
      v-model="dialogVisible"
      title="参数配置"
      width="1600"
      :before-close="handleClose"
  >
    <div class="code_config">
      <div class="button">
        <el-button type="primary" @click="saveParamConfig">保存</el-button>
      </div>
      <div class="coder_info">
        <div class="config">
          <div class="config_content"></div>
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="入参配置" name="first">
              <el-table :data="paramConfigs" style="width: 100%">
                <el-table-column prop="fieldName" label="字段名称" width="180"/>
                <el-table-column prop="targetName" label="领域名称" width="180"/>
                <el-table-column prop="fieldType" label="字段类型" width="180"/>
                <el-table-column label="修正信息" width="180">
                  <template #default="scope">
                    <el-input v-model="scope.row.correct" style="width: 160px" placeholder="请输出修正信息"/>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="出参配置" name="second">
              <el-table :data="resultConfigs" style="width: 100%">
                <el-table-column prop="fieldName" label="字段名称" width="180"/>
                <el-table-column prop="targetName" label="领域名称" width="180"/>
                <el-table-column prop="fieldType" label="字段类型" width="180"/>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="coder">
          <CoderV2 :domain-version-id="domainFunctionVersion.id"></CoderV2>
        </div>
      </div>
    </div>

  </el-dialog>

</template>

<script setup lang="ts">

import CoderV2 from "@/components/function/CoderV2.vue";
import domainFunctionVersionService from "@/api/function/DomainFunctionVersionService";
import {onMounted} from "vue";

const emit = defineEmits(['cancel', 'ok']);
const activeName = ref('first')
const props = defineProps({
  domainFunctionVersion: {
    type: Object as DomainFunctionVersion,
    default: {}
  },
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const saveParamConfig = () => {
  domainFunctionVersion.resultMapping.inputParamDefs = resultConfigs.value
  domainFunctionVersion.runMapping.inputParamDefs = paramConfigs.value
  domainFunctionVersionService.upsertDomainFunction(domainFunctionVersion).then(() => {
    ElMessage.success("保存配置成功")
    emit('ok')
  })
}

const domainFunctionVersion: DomainFunctionVersion = props.domainFunctionVersion

const paramConfigs = ref([])

const resultConfigs = ref([])

const dialogVisible = props.dialogVisible

const handleClose = () => {
  emit('cancel')
}

onMounted(() => {
  paramConfigs.value = domainFunctionVersion.runMapping.inputParamDefs
  resultConfigs.value = domainFunctionVersion.resultMapping.inputParamDefs
})

</script>

<style scoped lang="scss">
// 配置 code_config中的 button与coder_info 横向分布，button占高度百分之20，coder_info占高度百分之80
.code_config {
  display: flex;
  flex-direction: column;
  height: 100%;
  .button {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .coder_info {
    // 设置 config与coder 竖向分布，config占宽度百分之20，coder占宽度百分之80
    display: flex;
    flex-direction: row;
    height: 80%;
    .config {
      width: 50%;
      height: 600px;
      // 设置右边距
      margin-right: 10px;
      // 设置浮动布局，超出部分滚动展示
      overflow: auto;
      .config_content {
        .el-tabs__nav-wrap {
          margin-left: 0;
          // 超出部分滚动展示
          overflow-x: auto;
        }
      }
    }
    .coder {
      width: 50%;
      height: 80%;
    }
  }
}

</style>