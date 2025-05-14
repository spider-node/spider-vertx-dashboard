<template>
  <div class="param_config">
    <div class="operate">
      <el-button @click="showAddLabel" type="primary">新增对象</el-button>
    </div>
    <div class="param">
      <!---->
      <div class="objectEntity">

      </div>

      <div class="footer">
        <el-button @click="updateDomainObject" type="primary">保存</el-button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ref} from "vue";

const inputObjectMap = ref({})

const addParamRow = (row: any[]) => {
  row.push({
    fieldName: '',
    id: Math.floor(Math.random() * 10000), // 修改: 生成一个10000以内的随机数
    fieldDesc: '',
    fieldType: '',
    domainField: '',
    required: false,
    fields: [] // 确保 fields 初始化为一个空数组
  });
};

let expandedRows = ref([]); // 修改: 将 expandedRows 改为响应式变量

const handleExpandChange = (row, expanded) => {
  // expanded 这个是指的，展开，收起么
  if (!expandedRows.value.includes(row.id)) {
    expandedRows.value.push(row.id);
  } else {
    expandedRows.value = expandedRows.value.filter(id => id !== row.id);
  }
}

// 新增方法：处理字段类型变化
const handleFieldTypeChange = (row: any) => {
  if (row.fieldType === 'object') {
    if (!row.fields || row.fields.length === 0) {
      row.fields = []; // 确保 fields 初始化为一个空数组
    }
  } else if (row.fieldType !== 'array') {
    row.fields = [];
  }
  // 递归处理嵌套的 fields
  if (row.fields) {
    row.fields.forEach((field: any) => handleFieldTypeChange(field));
  }
};

const deleteParamRow = (row: any, rows: any[]) => {
  rows.splice(rows.indexOf(row), 1);
};

const updateDomainObject = () => {
  console.log(inputObjectMap.value)
}

const addTabDialogVisible = ref(false);

const showAddLabel = () => {
  addTabDialogVisible.value = true;
};


</script>

<style scoped lang="scss">

</style>
