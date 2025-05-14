<template>
  <div class="host">
    <div class="condition">
      <el-button type="primary" @click="queryDomainFunction()">查询</el-button>
      <el-button type="primary" @click="addDomainFunction()">新增宿主应用</el-button>
    </div>
    <div class="tables">
      <el-table :data="hostApplicationTables" height="550" style="width: 100%">
        <el-table-column prop="initCpu" label="初始化cpu配置" width="100"/>
        <el-table-column prop="initMemory" label="初始化内存配置" width="100"/>
        <el-table-column prop="maxCpu" label="最大cpu配置" width="100"/>
        <el-table-column prop="maxMemory" label="最大内存配置" width="100"/>
        <el-table-column prop="image" label="镜像地址" width="100"/>
        <el-table-column prop="baseName" label="基座名称" width="100"/>
        <el-table-column prop="status" label="基座运维状态" width="100"/>
        <el-table-column
            prop="date"
            label="操作"
            width="200"
        >
          <template #default="scope">
            <el-button
                link
                type="primary"
                size="small"
                @click="showFunctionVersion(scope.row)"
            >扩缩容</el-button>

            <el-button
                link
                type="primary"
                size="small"
                @click="editDomainFunction(scope.row)"
            >下线</el-button>

            <el-button
                link
                type="primary"
                size="small"
                @click="editDomainFunction(scope.row)"
            >上线</el-button>

            <el-button
                link
                type="primary"
                size="small"
                @click="editDomainFunction(scope.row)"
            >编辑</el-button>
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
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">

</style>