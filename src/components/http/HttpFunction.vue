<template>
  <div class="http_function">
    <div class="condition">
      <el-form :model="selectFrom" label-width="auto" style="max-width: 1100px" inline>
        <el-form-item label="功能名称">
          <el-input v-model="selectFrom.httpFunctionName"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryHttpFunction()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="isUpdate" @click="addHttpFunction()">新增功能</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="httpFunctionName" label="功能名称" width="180"/>
        <el-table-column prop="httpType" label="请求类型" width="100"/>
        <el-table-column prop="functionUrl" label="请求路径"/>
        <el-table-column prop="httpFunctionDesc" label="功能描述"/>
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
                @click="showEditHttpFunction(scope.row)"
                v-if="isUpdate"
            >编辑
            </el-button>
            <el-button
                link
                type="primary"
                size="small"
                @click="showParamInfo(scope.row)"
                v-if="isUpdate"
            >查看参数信息
            </el-button>

            <el-button
                link
                type="primary"
                size="small"
                @click="selectedHttpFunctionToBpmn(scope.row)"
                v-if="!isUpdate"
            >选择
            </el-button>

            <el-button
                link
                type="primary"
                size="small"
                @click="showTestHttp(scope.row)"
                v-if="isUpdate"
            >测试
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

  <el-dialog v-model="showParamConfig" title="参数配置" width="1400" :before-close="showParamConfigClose">
    <div class="param_info">
      <div class="code_info">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane
              v-for="(param, index) in selectedHttpFunction.httpFunctionParamClass"
              :key="'param-' + index"
              :label="'入参代码 ' + (index + 1)"
              :name="'param-' + index"
          >
            <div class="code_design">
              <MonacoEditor
                  v-model:value="selectedHttpFunction.httpFunctionParamClass[index]"
              ></MonacoEditor>
            </div>
          </el-tab-pane>

          <el-tab-pane
              v-for="(result, index) in selectedHttpFunction.httpFunctionResultClass"
              :key="'result-' + index"
              :label="'出参代码 ' + (index + 1)"
              :name="'result-' + index"
          >
            <div class="code_design">
              <MonacoEditor
                  v-model:value="selectedHttpFunction.httpFunctionResultClass[index]"
              ></MonacoEditor>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="param_config">
        <div class="operate">
          <el-button @click="showAddLabel" type="primary">新增对象</el-button>
          <el-button @click="showInputParam" type="primary">入参配置</el-button>
          <el-button @click="showResultParam" type="primary">出参配置</el-button>
          <el-button @click="aiParamCreate" type="primary">ai生成class</el-button>
        </div>
        <div class="param">
          <!---->
          <div class="objectEntity">
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
            <el-button @click="updateHttpVersion" type="primary">保存</el-button>
          </div>
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

  <el-dialog v-model="isShowHeader" title="操作功能的header" width="41%">
    <div>
      <el-button @click="addHeaderRow" type="primary">新增</el-button>
      <el-table :data="selectedHttpFunction.httpHeader" style="width: 100%" border>
        <el-table-column prop="key" label="Key" width="300">
          <template #default="scope">
            <el-input v-model="scope.row.key" placeholder="请输入Key"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="Value" width="300">
          <template #default="scope">
            <el-input v-model="scope.row.value" placeholder="请输入Value"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button @click="deleteHeaderRow(scope.row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>

  <el-dialog v-model="showHttpOperate" title="http功能操作" width="30%" :before-close="showHttpOperateClose">
    <el-form :model="selectedHttpFunction" label-width="auto" style="max-width: 1100px">
      <el-form-item label="功能名称">
        <el-input v-model="selectedHttpFunction.httpFunctionName"/>
      </el-form-item>
      <el-form-item label="请求类型">
        <el-select v-model="selectedHttpFunction.httpType" placeholder="请选择请求类型">
          <el-option label="GET" value="GET"></el-option>
          <el-option label="POST" value="POST"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="功能url">
        <el-input v-model="selectedHttpFunction.functionUrl"/>
      </el-form-item>
      <el-form-item label="功能描述">
        <el-input v-model="selectedHttpFunction.httpFunctionDesc" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveHttpFunction">保存</el-button>
        <el-button type="primary" @click="showHeader">查看header</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="showHttpTestFunction" title="http功能测试" width="30%" :before-close="showHttpTestClose">
    <JsonContainer :json-data="testData"></JsonContainer>
    <el-button type="primary" @click="runTest" class="runButton">执行测试</el-button>
  </el-dialog>

  <el-dialog v-model="showTestResult" title="http功能测试" width="30%" :before-close="showTestResultClose">
    <JsonContainer :json-data="testResultData"></JsonContainer>
  </el-dialog>

</template>

<script setup lang="ts">
import {ref, reactive} from "vue";
import MonacoEditor from "@/components/function/MonacoEditor.vue";
import HttpService from "@/api/http/HttpService.ts";
import businessFunctionVersionService from "@/api/function/businessFunctionVersionService.ts";
import {ElMessage} from "element-plus";
import JsonContainer from "@/components/function/JsonContainer.vue";

const emit = defineEmits(['selectedHttpFunctionToNode']);
const props = defineProps({
// 是否支持编辑
  isUpdate: {
    type: Object as () => Boolean,
    default: true
  },
  httpId: {
    // type设置为int
    type: String,
    default: ''
  }
})

const showHttpTestFunction = ref(false);

const testData = ref({})

const testResultData = ref({})

const showTestResult = ref(false);

const showHttpTestClose = () => {
  showHttpTestFunction.value = false;
  selectedHttpFunction.value = {} as HttpFunctionModel;
};

const showTestResultClose = () => {
  showTestResult.value = false;
  testResultData.value = {}
};

const showTestHttp = (row: HttpFunctionModel) => {
  showHttpTestFunction.value = true;
  selectedHttpFunction.value = row;
}

const runTest = () => {
  let headers = {}
  if (selectedHttpFunction.value.httpHeader) {
    // 遍历selectedHttpFunction.value.httpHeader
    selectedHttpFunction.value.httpHeader.forEach((item: any) => {
      headers[item.key] = item.value
    })
  }
  let runParam = {
    httpUrl: selectedHttpFunction.value.functionUrl,
    httpHeader: headers,
    httpType: selectedHttpFunction.value.httpType,
    param: testData.value
  }
  HttpService.httpTest(runParam).then((res) => {
    // 实现弹窗，返回执行结果
    showTestResult.value = true
    testResultData.value = res
  })
}


const selectedHttpFunctionToBpmn = (row: HttpFunctionModel) => {
  let notifySelectFunctionInfo = {
    domainFunctionDesc: row.httpFunctionDesc,
    domainFunctionName: row.httpFunctionName,
    functionVersionId: row.id,
    functionType: 'HTTP_FUNCTION',
    httpUrl: row.functionUrl,
    httpHeader: row.httpHeader,
    httpType: row.httpType
  }
  console.log("selectedHttpFunctionToBpmn", notifySelectFunctionInfo)
  emit('selectedHttpFunctionToNode', notifySelectFunctionInfo)
}

let isUpdate = props.isUpdate

const showHttpOperate = ref(false);

const addTabDialogVisible = ref(false);

const newTabLabel = ref('');

const isShowHeader = ref(false);

const showHeader = () => {
  isShowHeader.value = true;
};

const selectedHttpFunction = ref<HttpFunctionModel>({} as HttpFunctionModel)

const showHttpOperateClose = () => {
  showHttpOperate.value = false;
  selectedHttpFunction.value = {} as HttpFunctionModel;
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


const deleteParamRow = (row: any, rows: any[]) => {
  rows.splice(rows.indexOf(row), 1);
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


const showInputParam = () => {
  if (isShowInputParam) {
    return
  }
  isShowInputParam = true
  isShowResultParam = false

  if (selectedHttpFunction.value.httpFunctionParamObject) {
    inputObjectMap.value = selectedHttpFunction.value.httpFunctionParamObject
    return;
  }
  inputObjectMap.value = {}
};

const showResultParam = () => {
  if (isShowResultParam) {
    return
  }
  console.log("showResultParam-----------------")
  isShowResultParam = true
  isShowInputParam = false
  if (selectedHttpFunction.value.httpFunctionResultObject) {
    inputObjectMap.value = selectedHttpFunction.value.httpFunctionResultObject
    return;
  }
  inputObjectMap.value = {}
};

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

let isShowInputParam = false

let isShowResultParam = false

const showAddLabel = () => {
  addTabDialogVisible.value = true;
};

const inputObjectMap = ref({})

const showParamConfig = ref(false)

const activeName = ref('param-0')
// 监听inputObjectMap的变化
watch(() => inputObjectMap.value, // 使用getter函数
    (newValue) => {
      console.log("inputObjectMap变化", newValue)
      if (isShowInputParam) {
        selectedHttpFunction.value.httpFunctionParamObject = newValue
      } else if (isShowResultParam) {
        selectedHttpFunction.value.httpFunctionResultObject = newValue
      }
    },
    {deep: true} // 必须的深度监听配置
)

const updateHttpVersion = () => {
  HttpService.upsertHttpFunction(selectedHttpFunction.value).then((res) => {
    showParamConfigClose()
    showParamConfig.value = false
    initParamConfig()
  })
};

const aiParamCreate = () => {
  HttpService.upsertHttpFunction(selectedHttpFunction.value).then((res) => {
    let params = {
      httpFunctionId: selectedHttpFunction.value.id,
      source: 'HTTP_FUNCTION'
    }
    businessFunctionVersionService.configToJavaEntity(params).then(res => {
      ElMessage.success("在生成中,稍后点击查看代码，查看")
    })
    showParamConfigClose()
    showParamConfig.value = false

  })

}

const showParamConfigClose = () => {
  showParamConfig.value = false
  initParamConfig()
}

const initParamConfig = () => {
  selectedHttpFunction.value = {} as HttpFunctionModel;
  inputObjectMap.value = {}
  isShowInputParam = false
  isShowResultParam = false
}

const selectFrom = reactive({
  httpFunctionName: ''
})

const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage;
}

const addHttpFunction = () => {
  showHttpOperate.value = true
}

const showEditHttpFunction = (row: HttpFunctionModel) => {
  selectedHttpFunction.value = row
  showHttpOperate.value = true
}

const showParamInfo = (row: HttpFunctionModel) => {

  selectedHttpFunction.value = row
  if (selectedHttpFunction.value.httpFunctionParamObject) {
    inputObjectMap.value = selectedHttpFunction.value.httpFunctionParamObject;
  }
  isShowInputParam = true
  showParamConfig.value = true

}
const tableData = ref<HttpFunctionModel[]>([{
  httpFunctionName: '',
  httpType: '',
  httpFunctionDesc: '',
  httpHeader: [],
} as HttpFunctionModel])

const queryHttpFunction = () => {
  HttpService.queryHttpFunction({
    page: pageParams.value.page,
    size: pageParams.value.size,
    ...selectFrom
  }).then((res) => {
    tableData.value = res.datas
    pageParams.value.total = res.total
  })
}


onMounted(() => {
  queryHttpFunction()
})

const addHeaderRow = () => {
  if (!selectedHttpFunction.value.httpHeader) {
    selectedHttpFunction.value.httpHeader = []
  }
  selectedHttpFunction.value.httpHeader.push({
    key: '',
    value: ''
  });
};

const deleteHeaderRow = (row: any) => {
  const index = selectedHttpFunction.value.httpHeader.indexOf(row);
  if (index > -1) {
    selectedHttpFunction.value.httpHeader.splice(index, 1);
  }
};

const saveHttpFunction = () => {
  HttpService.upsertHttpFunction(selectedHttpFunction.value).then((res) => {
    queryHttpFunction()
    showHttpOperate.value = false
  })
}

</script>

<style scoped lang="scss">
// 配置param_info中 code_info与param_config横向排列,code_info宽度占百分之50%param_config宽度百分之50%
.param_info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  // 设置高度700px,超出高度下滑
  height: 500px;

  .code_info {
    width: 40%;
    height: 500px;

    .monaco-editor {
      height: 450px;
      width: 100%;
    }

    // 设置右边距
    margin-right: 20px;
  }

  .param_config {
    height: 500px;
    width: 60%;
    // 超出高度下滑
    overflow-y: auto;
  }
}

.footer {
  margin-top: 20px;
}
</style>