<template>
  <div>
    <el-dialog
        v-model="dialogVisible"
        title="功能版本"
        width="1700px"
        :before-close="handleClose"
    >
      <div class="designPlatform">
        <div class="flowDatas">
          <SelectFlowData v-if="showSelect" @selected-data-flow="selectedDataFlow"></SelectFlowData>
          <DataFlowParamShow v-if="showDataFlowInfo" :flow-id="functionVersions.dataFlowId"
                             @selectedFlowDataField="selectedFlowDataFields"/>
          <DomianObjects v-if="showDomianObject" :flow-id="functionVersions.dataFlowId"></DomianObjects>
        </div>
        <div class="functionVersion">
          <div class="from">
            <el-form :model="functionVersions" label-width="auto" style="max-width: 600px" v-if="flexible">
              <el-form-item label="名称">
                <el-input v-model="functionVersions.functionName"></el-input>
              </el-form-item>
              <el-form-item label="版本">
                <el-input v-model="functionVersions.version"></el-input>
              </el-form-item>
              <el-form-item label="数据流名称">
                <el-input v-model="functionVersions.dataFlowName"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="functionVersions.desc" type="textarea"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="operate">
            <el-button @click="showSelectFlow" type="primary">选数据流</el-button>
            <el-button @click="showFlowDateInfos" type="primary">查看数据流</el-button>
            <el-button @click="showDomianObjects" type="primary">数据信息</el-button>
            <el-button @click="showAddLabel" type="primary">新增对象</el-button>
            <!--            <el-button @click="showFlexible" type="primary">伸缩</el-button>-->
            <el-button @click="showFlexible" type="primary">查看版本</el-button>
            <el-button @click="showInputParam" type="primary">入参配置</el-button>
            <el-button @click="showResultParam" type="primary">出参配置</el-button>
            <el-button @click="aiParamCreate" type="primary">参数类生成</el-button>

          </div>
          <div class="param_config">

          </div>
          <div class="param">
            <!---->
            <el-tabs v-if="inputObjectMap">
              <el-tab-pane v-for="(item, key) in inputObjectMap" :key="key" :label="key">
                <!-- 新增按钮 -->
                <el-button @click="addParamRow(item)" type="primary">新增参数</el-button>
                <el-table :data="item" style="width: 100%" border :expand-row-keys="expandedRows" row-key="id"
                          @expand-change="handleExpandChange" class="tables">
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
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="footer">
            <el-button v-if="isUpdate" @click="upsertFunctionVersion" type="primary">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 新增弹窗 -->
    <el-dialog v-model="addTabDialogVisible" title="新增对象" width="30%">
      <el-input v-model="newTabLabel" placeholder="输入对象名称"></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addTabDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addNewTab">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, toRef} from "vue"; // 引入 computed
import businessFunctionVersionService from "@/api/function/businessFunctionVersionService";
import DataFlowParamShow from '@/components/version/DataFlowParamShow.vue'
import SelectFlowData from "@/components/function/SelectFlowData.vue";
import {ElMessage} from "element-plus";
import DomianObjects from "@/components/function/DomianObjects.vue";
import {v4 as uuidv4} from 'uuid';

const showDataFlowInfo = ref(false);

const flexible = ref(true);

const showFlexible = () => {
  flexible.value = !flexible.value
}

const showSelect = ref(true);

const params = ref<FunctionInputParam[]>([])

let expandedRows = ref([]); // 修改: 将 expandedRows 改为响应式变量

const handleExpandChange = (row, expanded) => {
  // expanded 这个是指的，展开，收起么
  if (!expandedRows.value.includes(row.id)) {
    expandedRows.value.push(row.id);
  } else {
    expandedRows.value = expandedRows.value.filter(id => id !== row.id);
  }
}

const selectedFlowDataFields = (data: any) => {
  console.log("接受到事件信息为", data)
  let param = {
    targetName: data.portTypeLabel,
    fieldName: data.actualValue
  }
  // 判读选项是
  if (activeName.value == 'first') {
    if (!functionVersions.value.runMapping) {
      functionVersions.value.runMapping = {}
      functionVersions.value.runMapping.inputParam = []
    }
    // 判断 inputParam中是否存在param中targetName一样的值，如果存在,就移除该值
    if (!functionVersions.value.runMapping.inputParam) {
      functionVersions.value.runMapping.inputParam = []
    }
    for (let i = 0; i < functionVersions.value.runMapping.inputParam.length; i++) {
      if (functionVersions.value.runMapping.inputParam[i].targetName == param.targetName) {
        functionVersions.value.runMapping.inputParam.splice(i, 1)
        break
      }
    }
    functionVersions.value.runMapping.inputParam.push(param)
  } else if (activeName.value == 'second') {
    if (!functionVersions.value.resultMapping) {
      functionVersions.value.resultMapping = {}
      functionVersions.value.resultMapping.inputParam = []
    }

    // 判断 inputParam中是否存在param中targetName一样的值，如果存在,就移除该值
    for (let i = 0; i < functionVersions.value.resultMapping.inputParam.length; i++) {
      if (functionVersions.value.resultMapping.inputParam[i].targetName == param.targetName) {
        functionVersions.value.resultMapping.inputParam.splice(i, 1)
        break
      }
    }
    functionVersions.value.resultMapping.inputParam.push(param)
    console.log("接受到事件信息修改后的数据为", functionVersions.value.resultMapping.inputParam)
  }
};

const showDomianObject = ref(false);

const showDomianObjects = () => {
  showDomianObject.value = true;
  showSelect.value = false;
  showDataFlowInfo.value = false;
};

const showFlowDateInfos = () => {
  showSelect.value = false;
  showDataFlowInfo.value = true;
  showDomianObject.value = false;
};

const showSelectFlow = () => {
  showSelect.value = true;
  showDataFlowInfo.value = false;
  showDomianObject.value = false;
};


const emit = defineEmits(['ok', 'cancel']);

const activeName = ref('first');

const versionStatus = ref(false);

const handleClose = () => {
  emit('cancel');
};

const selectedDataFlow = (data: any) => {
  functionVersions.value.dataFlowId = data.id
  functionVersions.value.dataFlowName = data.flowDataName
};

const props = defineProps({
  functionVersion: {
    type: Object,
    default: {}
  },
  functionId: {
    type: String,
    default: ''
  },
  businessFunction: {
    type: Object,
    default: {}
  },
  showVersion: {
    type: Boolean,
    default: false
  },
  isUpdate: {
    type: Boolean,
    default: false
  }
});

const isUpdate = toRef(props, 'isUpdate');
let businessFunction: BusinessFunction = props.businessFunction
const dialogVisible = toRef(props, 'showVersion');
const functionVersions = ref({})
//const functionVersions = ref({})

const aiParamCreate = () => {
  upsertFunctionVersion()
  // 2s后执行后续代码
  setTimeout(() => {
    // 2s后执行的代码
    ElMessage.info("正在生成代码，请稍后")
    let params = {
      functionVersionId: functionVersions.value.id,
      source: 'BUSINESS_FUNCTION'
    }
    businessFunctionVersionService.configToJavaEntity(params).then(res => {
      ElMessage.success("在生成中,稍后点击查看代码，查看")
    })
  }, 2000);
}

const upsertFunctionVersion = () => {
  let params = {
    ...functionVersions.value,
    status: versionStatus.value ? 'START' : 'STOP',
    functionId: businessFunction.id,
    functionName: businessFunction.functionName,
  };
  if (functionVersions.value.id) {
    businessFunctionVersionService.addFunctionVersion(params).then(res => {
      ElMessage.success("修改功能信息成功")
      emit('ok');
    });
  } else {
    businessFunctionVersionService.updateFunctionVersion(params).then(res => {
      emit('ok');
    });
  }
};

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

const shouldShowOperationColumn = (row: any): boolean => {
  return row.fieldType === 'object' || row.fieldType === 'array';
};

// 新增递归组件 FieldInfo
import FieldInfo from '@/components/function/FieldInfo.vue';

// 新增方法：更新字段信息
const updateFields = (index: number, fields: any[]) => {
  params.value[index].fields = fields;
};

// 新增方法：新增嵌套入参配置行
const addNestedParamRow = (row: any) => {
  row.fields.push({
    // 新增id的字段=默认给id
    id: uuidv4(),
    fieldName: '',
    fieldType: '',
    domainField: '',
    required: false,
    fields: [] // 确保 fields 初始化为一个空数组
  });

};

const showAddLabel = () => {
  addTabDialogVisible.value = true;
};


// 新增方法：新增入参配置行
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

const deleteParamRow = (row: any, rows: []) => {
  rows.splice(rows.indexOf(row), 1);
};


const addTabDialogVisible = ref(false);

const newTabLabel = ref('');

onMounted(() => {
  // 初始化逻辑
  functionVersions.value = props.functionVersion
  if (functionVersions.value.runObjectConfig) {
    inputObjectMap.value = functionVersions.value.runObjectConfig
  }
  isShowInputParam = true
});

let isShowInputParam = false

let isShowResultParam = false

const inputObjectMap = ref({})

watch(() => inputObjectMap.value,
    (newValue) => {
      if (isShowInputParam) {
        functionVersions.value.runObjectConfig = newValue
        return
      }
      if (isShowResultParam) {
        functionVersions.value.resultObjectConfig = newValue
      }
    },
    {deep: true}
)

const showInputParam = () => {
  if (isShowInputParam) {
    return
  }
  isShowInputParam = true
  isShowResultParam = false
  inputObjectMap.value = functionVersions.value.runObjectConfig
};

const showResultParam = () => {
  if (isShowResultParam) {
    return
  }
  isShowResultParam = true
  isShowInputParam = false
  inputObjectMap.value = functionVersions.value.resultObjectConfig
};

const addNewTab = () => {
  if (newTabLabel.value) {
    if (!inputObjectMap.value) {
      inputObjectMap.value = {}
    }
    inputObjectMap.value[newTabLabel.value] = []
    console.log("新增的标签为", newTabLabel.value)
    activeName.value = newTabLabel.value;
    newTabLabel.value = '';
  }
  addTabDialogVisible.value = false;
};

</script>

<style lang="scss" scoped>

// 设置designPlatform当中 flowData与functionVersion竖向拆分，flowData宽度占70%,functionVersion宽度占30%
.designPlatform {
  display: flex;
  height: 100%;

  .flowDatas {
    width: 1000px;
    border-right: 1px solid #e6e6e6;
  }

  .functionVersion {
    width: 700px;
    padding: 20px;

    .operate {
      // 设置 button横向排列，超出就换行, 从左边开始呈现，抱持好间距
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 10px;
    }
  }
}

.tables {
  // 设置高度为合理的一个范围，可以动态变化，超过高度就滚动
  height: 300px;
  overflow-y: auto;
}

.footer {
  margin-top: 20px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

// 给AddFlow设置高度和宽度
</style>
