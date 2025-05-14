<template>
  <el-table :data="fields" style="width: 100%" border>
    <el-table-column prop="fieldName" label="字段名称" width="180">
      <template #default="scope">
        <el-input v-model="scope.row.fieldName" placeholder="请输入字段名称"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="fieldType" label="字段类型" width="180">
      <template #default="scope">
        <el-select v-model="scope.row.fieldType" placeholder="请选择字段类型" @change="handleFieldTypeChange(scope.row)">
          <el-option label="string" value="string"></el-option>
          <el-option label="int" value="int"></el-option>
          <el-option label="object" value="object"></el-option>
          <el-option label="array" value="array"></el-option>
          <!-- 可以继续添加更多类型 -->
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="domainField" label="字段对应领域字段" width="180">
      <template #default="scope">
        <el-input v-model="scope.row.domainField" placeholder="请输入字段对应领域字段"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="required" label="是否必填" width="180">
      <template #default="scope">
        <el-switch v-model="scope.row.required"></el-switch>
      </template>
    </el-table-column>
    <el-table-column prop="" label="操作" width="180" v-if="shouldShowOperationColumn(scope)">
      <template #default="scope">
        <el-button type="primary" @click="showSonObjectInfo(scope.row)">查看子对象信息</el-button>
        <el-button type="primary" @click="addNestedParamRow(scope.$index)">增加行</el-button>
        <div v-if="scope.row.fields && scope.row.fields.length > 0">
          <FieldInfo :fields="scope.row.fields" @updateFields="updateNestedFields(scope.$index, $event)" />
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  fields: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['updateFields']);

const shouldShowOperationColumn = computed(() => {
  return (scope: any) => {
    // 递归判断是否显示操作列
    const checkFields = (fields: any[]): boolean => {
      return fields.some((field: any) => field.fieldType === 'object' || field.fieldType === 'array' || (field.fields && checkFields(field.fields)));
    };
    return scope && (scope.row.fieldType === 'object' || scope.row.fieldType === 'array' || (scope.row.fields && checkFields(scope.row.fields)));
  };
});

const handleFieldTypeChange = (row: any) => {
  if (row.fieldType === 'object') {
    if (!row.fields || row.fields.length === 0) {
      row.fields = [{}]; // 自动展开字段信息
    }
  } else if (row.fieldType !== 'array') {
    row.fields = []; // 确保 fields 为数组
  }
  // 递归处理嵌套的 fields
  if (row.fields) {
    row.fields.forEach((field: any) => handleFieldTypeChange(field));
  }
  emit('updateFields', props.fields);
};

const showSonObjectInfo = (row: any) => {
  console.log("子对象信息:", row);
};

const addNestedParamRow = (index: number) => {
  if (!props.fields[index].fields) {
    props.fields[index].fields = [];
  }
  props.fields[index].fields.push({
    fieldName: '',
    fieldType: '',
    domainField: '',
    required: false,
    fields: [{}] // 初始化 fields 为一个空对象数组
  });
  emit('updateFields', props.fields);
};

const updateNestedFields = (index: number, fields: any[]) => {
  props.fields[index].fields = fields;
  emit('updateFields', props.fields);
};
</script>