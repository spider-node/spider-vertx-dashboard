<template>
  <div>
    <el-button @click="handleAiParse">AI解析</el-button>
  </div>
  <el-tabs>
    <div v-for="(info, index) in tableInfo" :key="index">
      <el-tab-pane :label="'表结构 ' + (index + 1)">
        <pre><code class="sql">{{ formatTable(info.table) }}</code></pre>
      </el-tab-pane>
      <el-tab-pane :label="'字段解析 ' + (index + 1)">
        <el-table :data="info.data_analysis">
          <el-table-column prop="field" label="字段名"></el-table-column>
          <el-table-column prop="type" label="字段类型"></el-table-column>
          <el-table-column prop="fieldDesc" label="描述"></el-table-column>
        </el-table>
      </el-tab-pane>
    </div>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue';
import domainFunctionVersionService from "@/api/function/DomainFunctionVersionService";
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';
import 'highlight.js/styles/default.css';

hljs.registerLanguage('sql', sql);

interface TableAnalysisInfo {
  table: string;
  data_analysis: Array<{
    field: string;
    type: string;
    fieldDesc: string;
  }>;
}

const tableInfo = ref<TableAnalysisInfo[]>([]);

const props = defineProps<{
  functionVersionId: string;
}>();

const queryFunctionVersion = () => {
  let params = {
    domainFunctionVersionId: props.functionVersionId,
    page: 1,
    size: 1,
  };
  domainFunctionVersionService.queryDomainFunction(params).then((res) => {
    let domainFunction: DomainFunctionVersion = res.versionList[0];
    let tableAnalysisInfo = domainFunction.tableAnalysisInfo;
    // 判断tableAnalysisInfo.tableInfo是否为NULL，如果为空，则不显示
    if (tableAnalysisInfo.tableInfo == null) {
      return;
    }
    tableInfo.value = tableAnalysisInfo.tableInfo;
  });
};

onMounted(() => {
  queryFunctionVersion();
});

onUpdated(() => {
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
});

// 新增: AI解析按钮点击事件处理函数
const handleAiParse = () => {
  
};

// 新增: 格式化表结构
const formatTable = (table: string): string => {
  const lines = table.split(',').map(line => line.trim());
  const formattedLines = lines.map((line, index) => {
    if (index === 0) {
      return line + ' (\n';
    } else if (index === lines.length - 1) {
      return '  ' + line + '\n)';
    } else {
      return '  ' + line + ',\n';
    }
  });
  return formattedLines.join('');
};

</script>

<style scoped lang="scss">

</style>