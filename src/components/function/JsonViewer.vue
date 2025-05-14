<template>
  <div class="json-viewer">
    <el-scrollbar wrap-class="scrollbar-wrapper" view-class="scrollbar-view">
      <el-table v-if="tableData.length" :data="tableData" style="width: 100%">
        <el-table-column
          v-for="(column, index) in tableColumns"
          :key="index"
          :prop="column.key"
          :label="column.label"
        />
      </el-table>
      <p v-else>没有数据可以显示。</p>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElScrollbar } from 'element-plus';

const props = defineProps<{ data: string }>();

const jsonData = ref<any[]>([]);
const tableData = ref<any[]>([]);

onMounted(() => {
  try {
    let newData = props.data;
    // 去除可能的多余空格和换行符
    newData = newData.trim();
    console.log("转义后的数据", newData)
    const parsedDatav1 = JSON.parse(newData);

    const parsedData = JSON.parse(parsedDatav1);

    // 打印 parsedData 的类型
    console.log("parsedData 类型:", typeof parsedData, "值:", parsedData);

    if (Array.isArray(parsedData)) {
      jsonData.value = parsedData;
      tableData.value = parsedData;
    } else {
      console.error("解析结果不是数组:", parsedData);
      jsonData.value = [];
    }
  } catch (error) {
    console.error("解析 JSON 失败:", error);
    jsonData.value = [];
  }
});



const tableColumns = computed(() => {
  if (Array.isArray(jsonData.value) && jsonData.value.length > 0) {
    const uniqueKeys = new Set();
    jsonData.value.forEach(item => {
      Object.keys(item).forEach(key => uniqueKeys.add(key));
    });

    return Array.from(uniqueKeys).map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1)
    }));
  }
  return [];
});
</script>


<style scoped lang="scss">
.json-viewer {
  height: 600px;
  overflow: auto;
}

.scrollbar-wrapper {
  height: 100%;
  overflow-y: scroll;
}

.scrollbar-view {
  padding: 10px;
}

.el-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
</style>
