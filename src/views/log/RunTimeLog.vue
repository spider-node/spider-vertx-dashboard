<template>
  <div class="box">
    <div class="title">系统日志</div>
    <div class="content">
      <el-form
          :inline="true"
          :model="formInline"
          class="searchForm"
      >
        <el-form-item label="功能名称">
          <el-input
              v-model="formInline.functionName"
              placeholder="请输入功能名称"
              clearable
          />
        </el-form-item>
        <el-form-item label="业务编号">
          <el-input
              v-model="formInline.businessParam"
              placeholder="请输入业务编号"
              clearable
          />
        </el-form-item>
        <el-form-item label="请求编号">
          <el-input
              v-model="formInline.id"
              placeholder="请输入请求编号"
              clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              @click="onSubmit"
          >查询
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
          :data="logs"
          style="width: 100%"
      >
        <el-table-column
            prop="functionName"
            label="功能名称"
        />
        <el-table-column
            prop="id"
            label="请求编号"
        />
        <el-table-column
            prop="status"
            label="执行状态"
        >
          <template #default="scope">
            {{ scope.row.status == 'FAIL' ? '失败' : '成功' }}
          </template>
        </el-table-column>

        <el-table-column
            prop="startTime"
            label="执行开始时间"
        >
          <template #default="scope">
            {{ dayjs(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>

        <el-table-column
            prop="endTime"
            label="执行结束时间"
        >
          <template #default="scope">
            {{ dayjs(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
            prop="takeTime"
            label="耗时"
        />

        <el-table-column
            prop="date"
            label="操作"
        >
          <template #default="scope">
            <el-button
                link
                type="primary"
                size="small"
                @click="toDetail(scope.row)"
            >查看详情
            </el-button>
            <el-button v-if="scope.row.exception"
                link
                type="primary"
                size="small"
                @click="showError(scope.row)"
            >查看异常
            </el-button>
          </template>

        </el-table-column>

      </el-table>
      <div class="paginationBox">
        <el-pagination
            class="pagination"
            size="small"
            background
            :page-size="pageParams.size"
            layout="prev, pager, next"
            :total="pageParams.total"
            @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>

  <Detail
      @cancel="detailVisible=false"
      :data="checkedLog"
      :dialogVisible="detailVisible"
  ></Detail>
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
</template>

<script setup lang="ts">
import logService from "@/api/log/logService";
import {dayjs} from 'element-plus'
import {onMounted} from "vue";
import Detail from "@/views/log/components/Detail.vue";

const props = defineProps({
  functionId: {
    type: String,
    default: ''
  }
})

const exception = ref('')

const errorVisible = ref(false)

const showError = (row) => {
  exception.value = row.exception
  errorVisible.value = true
}

const checkedLog = ref({})

const detailVisible = ref(false)

const toDetail = (row) => {
  checkedLog.value = row
  detailVisible.value = true
}

let functionId = props.functionId

const formInline = ref({})

const logs = ref([])

const onSubmit = () => {
  queryLog()
}

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage;
  queryLog();
}

const queryLog = () => {
  let data = {
    ...formInline.value,
    functionId: functionId,
    page: pageParams.value.page,
    size: pageParams.value.size
  }
  logService.queryLog(data).then((res) => {
    logs.value = res.flowExampleList
    pageParams.value.total = res.total
  })
}

const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

onMounted(() => {
  queryLog()
})

</script>

<style scoped lang="scss">
.box {
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20px;
  }
  .content {
    .searchForm {
      margin-bottom: 20px;
    }
    // 设置高度,超出高度滚动条
    .el-table {
      max-height: 400px;
      overflow-y: auto;
    }
  }
}

</style>