<template>
  <div class="detail">
    <el-drawer
        v-model="dialogVisible"
        title="日志信息"
        :before-close="cancel"
        :size="1300"
    >
      <el-table
          :data="tableData"
          style="width: 100%"
      >
        <el-table-column
            prop="functionName"
            label="功能名称"
        />
        <el-table-column
            prop="flowElementName"
            label="节点名称"
        />
        <el-table-column
            prop="status"
            label="执行状态"
        />
        <el-table-column
            prop="requestParam"
            width="300"
            label="入参"
        >
          <template #default="scope">
            <JsonViewer
                boxed
                copyable
                :value="scope.row.requestParam"
            />
          </template>
        </el-table-column>

        <el-table-column
            prop="returnParam"
            width="300"
            label="出参"
        >
          <template #default="scope">
            <JsonViewer
                boxed
                copyable
                :value="scope.row.returnParam"
            />
          </template>
        </el-table-column>
        <el-table-column
            prop="takeTime"
            label="耗时"
        />
        <el-table-column
            prop="date"
            width="150"
            label="操作"
        >
          <template #default="scope">
            <el-button
                link
                v-if="scope.row.exception"
                type="primary"
                size="small"
                @click="toDetail(scope.row)"
            >异常信息</el-button>
            <el-button
                link
                type="primary"
                size="small"
                @click="retry(scope.row)"
            >重试</el-button>
          </template>

        </el-table-column>

      </el-table>
      <div class="paginationBox">
        <el-pagination
            class="pagination"
            size="small"
            background
            @change="pageChange"
            layout="prev, pager, next"
            :page-size="pageParams.size"
            :total="pageParams.total"
        />
      </div>

    </el-drawer>
  </div>

  <el-dialog
      v-model="errorVisible"
      @close="errorVisible=false"
      title="异常信息"
      width="800"
  >
    <div
        class="info"
        v-text="exception"
    />
  </el-dialog>
  <el-dialog
      v-model="retryVisible"
      @close="retryVisible=false"
      title="重试"
      width="500"
  >
    <el-form
        :inline="true"
        :model="formInline"
        class="searchForm"
    >
      <el-form-item
          required
          label="重试方式"
      >
        <el-select
            v-model="formInline.retryType"
            class="formSelect"
            placeholder="请选择"
            clearable
        >
          <el-option
              label="单个节点"
              value="SINGLE"
          />
          <el-option
              label="此节点及以后"
              value="AFTER"
          />
          <el-option
              label="所有节点"
              value="ALL"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="retryVisible=false">取消</el-button>
        <el-button
            type="primary"
            @click="comfirm"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { toRef, ref, watch } from 'vue';
import logService from "@/api/log/logService";
import { JsonViewer } from 'vue3-json-viewer/dist/bundle.cjs';
const emit = defineEmits(['ok', 'cancel']);
const props = defineProps({
  dialogVisible: {
    type: Number,
    default: 0
  },
  data: {
    type: Object,
    default: () => { }
  }
})

const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

const exception = ref('')
const tableData = ref([])
const formInline = ref({})
const pageChange = (page, size) => {
  pageParams.value.page = page
  pageParams.value.size = size
  getDetailList()
}
const dialogVisible = toRef(props, 'dialogVisible');
const errorVisible = ref(false)
const retryVisible = ref(false)
const cancel = () => {
  emit('cancel');
}
const comfirm = async () => {
  if (!formInline.value.retryType) {
    ElMessage.error('请选择重试方式')
    return
  }
  let data = {
    retryNodeId: checkedFlow.value.flowElementId,
    parentRequestId: checkedFlow.value.requestId,
    retryType: formInline.value.retryType
  }
  let res = await logService.retryBusinessNode(data)
  console.log(res)
  ElMessage.success('重试成功')
}
const checkedFlow = ref({})
const retry = (row) => {
  checkedFlow.value = row
  retryVisible.value = true
}
const toDetail = (row) => {
  errorVisible.value = true
  exception.value = row.exception
}
const detailId = ref('')
const getDetailList = async () => {
  let data = {
    requestId: detailId.value,
    page: pageParams.value.page,
    size: pageParams.value.size
  }
  let res = await logService.queryElementInfo(data)
  console.log(res)
  tableData.value = res.elementExampleList
  pageParams.value.total = res.total
}
watch(dialogVisible, (newValue, oldValue) => {
  if (newValue !== 0) {
    console.log(props.data)
    detailId.value = props.data.id
    getDetailList()
  }
});
</script>

<style scoped lang="scss">
.detail{
  // 设置宽度为40%
  width: 60%;

}
</style>