<template>
  <div>
    <div class="operate">
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="对象名称">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addDomainObject">新增对象</el-button>
          <el-button type="primary" @click="queryDomainObject">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table :data="domainObjects" style="width: 100%">
        <el-table-column prop="domainObjectName" label="对象名称" width="150"/>
        <el-table-column
            prop="date"
            label="操作"
            width="400"
        >
          <template #default="scope">
            <el-button
                link
                type="primary"
                size="small"
                @click="editDomainObject(scope.row)"
            >编辑
            </el-button>

            <el-button
                link
                type="primary"
                size="small"
                @click="editFiled(scope.row)"
            >编辑字段信息
            </el-button>

            <el-button
                link
                type="primary"
                size="small"
                @click="editFiled(scope.row)"
            >选择
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

    <el-dialog title="编辑对象" v-model="showEditObject" width="35%" :before-close="editDomainObjectClose">
      <div>
        <el-form :model="selectedDomainObject" label-width="auto" style="max-width: 600px">
          <el-form-item label="对象名称">
            <el-input v-model="selectedDomainObject.domainObjectName"/>
          </el-form-item>
          <el-form-item label="对象描述">
            <el-input v-model="selectedDomainObject.objectDesc" type="textarea"/>
          </el-form-item>
          <el-form-item label="保存">
            <el-button type="primary" @click="updateDomainObject">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog title="编辑字段" v-model="showEditFiled" width="50%" :before-close="editFiledClose">
      <!-- 新增按钮 -->
      <el-button @click="addParamRow" type="primary">新增参数</el-button>
      <el-table :data="domainObjectField" style="width: 100%" class="tables">
        <el-table-column prop="fieldName" label="字段名称" width="160">
          <template #default="scope">
            <el-input v-model="scope.row.fieldName" placeholder="请输入字段名称"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="fieldType" label="字段类型" width="130">
          <template #default="scope">
            <el-select v-model="scope.row.fieldType" placeholder="字段类型"
                       @change="handleFieldTypeChange(scope.row)">
              <el-option label="string" value="string"></el-option>
              <el-option label="number" value="number"></el-option>
              <el-option label="bigDecimal" value="bigDecimal"></el-option>
              <el-option label="object" value="object"></el-option>
              <el-option label="bool" value="bool"></el-option>
              <el-option label="array" value="array"></el-option>
              <!-- 可以继续添加更多类型 -->
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="domainField" label="字段对应领域字段" width="160">
          <template #default="scope">
            <el-input v-model="scope.row.domainField" placeholder="请输入字段对应领域字段"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="realFieldType" label="实际类型" width="160">
          <template #default="scope">
            <el-input v-model="scope.row.realFieldType" placeholder="输入实际类型"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="是否必填" width="80">
          <template #default="scope">
            <el-switch v-model="scope.row.required"></el-switch>
          </template>
        </el-table-column>
        <!-- 操作，删除本行 -->
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button @click="deleteParamRow(scope.row, item)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>

</template>

<script setup lang="ts">
import domainObjectService from "@/api/domain/domainObjectService.ts";
import {ElMessage} from 'element-plus';
import {ref} from "vue";

const showEditFiled = ref(false)

const domainObjectField = ref<DomainObjectField[]>([])

const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage
}

const domainObjects = ref<DomainObject[]>([])

const queryDomainObject = () => {
  domainObjectService.queryDomainObject({
    domainObjectName: form.value.name,
    page: pageParams.value.page,
    size: pageParams.value.size
  }).then((res) => {
    domainObjects.value = res.domainObject
    pageParams.value.total = res.total
  })

}

const deleteParamRow = (row: any, index: number) => {
  domainObjectField.value.splice(index, 1)
}

const addParamRow = () => {
  domainObjectField.value.push({
    fieldName: '',
    fieldType: '',
    domainField: '',
    required: false,
    realFieldType: '',
    fields: []
  })
}

const editFiledClose = () => {
  showEditFiled.value = false
  selectedDomainObject.value = {} as DomainObject
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

// 声明一个DomainObject的interface
interface DomainObject {
  domainObjectName: string;
  objectDesc: string;
  domainObjectField: any[];
}

interface DomainObjectField {
  fieldName: string;
  fieldType: string;
  domainField: string;
  required: boolean;
  realFieldType: string;
  fields: DomainObjectField[];
}

const updateDomainObject = () => {
  // 更新逻辑
  if (!selectedDomainObject.value.domainObjectName) {
    ElMessage.info('领域对象名称必填')
    return
  }
  showEditObject.value = false
  domainObjectService.upsertDomainObject(selectedDomainObject.value).then(() => {
    ElMessage.success('保存成功')
    selectedDomainObject.value = {} as DomainObject
    queryDomainObject()
  })

}

const selectedDomainObject = ref<DomainObject>({} as DomainObject)

const showEditObject = ref(false)

const editDomainObject = (row: any) => {
  selectedDomainObject.value = row
  showEditObject.value = true
}

const editFiled = (row: any) => {
  selectedDomainObject.value = row
  showEditFiled.value = true
}

const editDomainObjectClose = () => {
  showEditObject.value = false
  selectedDomainObject.value = {} as DomainObject
}

const form = ref({
  name: ''
})

const addDomainObject = () => {
  showEditObject.value = true
}

</script>

<style scoped lang="scss">
// 优化operate的样式布局
.operate {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
