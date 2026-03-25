<template>
  <div class="box">
    <div class="title">
      <div>数据流编辑</div>
      <div class="operate">
        <el-button type="primary" @click="showFlowDesc">查看描述</el-button>
        <el-button type="primary" @click="addFlow">保存</el-button>
        <el-button type="primary" @click="back">返回主页</el-button>
        <el-button type="primary" @click="showDataGroupFunction">添加数据组</el-button>
      </div>

    </div>
    <div class="content flex">

      <div class="leftMenu">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="子域" name="first">
            <div class="condition">
              <el-form label-width="auto" style="max-width: 600px">
                <el-form-item
                    required
                    prop=""
                    label="选择子域"
                >
                  <el-select v-model="domainNames"
                             placeholder="请选择领域"
                             filterable
                             clearable
                             remote
                             :remote-method="fetchAndFilterDomain"
                             :loading="loading"
                             style="width: 600px"
                  >
                    <el-option
                        v-for="item in domains"
                        :key="item.id"
                        :label="item.areaName"
                        :value="item.areaName"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button
                      type="primary"
                      @click="getSonArea"
                  >查询
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="domainTables">
              <el-table :data="sonList" style="width: 100%">
                <el-table-column prop="sonAreaName" label="领域名称" width="180"/>
                <el-table-column
                    prop="date"
                    label="操作"
                >
                  <template #default="scope">
                    <el-button
                        link
                        type="primary"
                        size="small"
                        @click="showSonVersions(scope.row)"
                    >选择子域版本
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
          </el-tab-pane>
          <el-tab-pane label="对象数据" name="second">
            <DomainObjects></DomainObjects>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="rightContent">
        <div
            ref="container"
            id="container"
            class="main_container"
            @dragover="dragoverDiv"
        ></div>
      </div>

    </div>

  </div>

  <el-dialog
      v-model="showDesc"
      title="描述信息"
      width="800px"
      :before-close="descClose"
  >
    <div class="titleForm">
      <el-form
          :inline="true"
          ref="formRef"
          :model="formInline"
      >
        <el-form-item
            required
            prop="flowDataName"
            label="数据流名称"
        >
          <el-input
              v-model="formInline.flowDataName"
              placeholder="请输入数据流名称"
              clearable
          />
        </el-form-item>
        <el-form-item
            required
            label="添加"
        >
          <div class="button">
            <el-button type="primary" @click="addInput">添加注释</el-button>
          </div>
        </el-form-item>

        <el-form-item
            required
            label="描述"
        >
          <div v-for="(input, index) in inputs" :key="index" class="input-container">
            <div class="needs">
              <el-input class="flow_desc" v-model="input.value" type="textarea" style="width: 550px"
                        :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
              <el-button type="danger" @click="removeInput(index)">删除</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>

  </el-dialog>

  <el-dialog
      v-model="showNodeInfo"
      title="节点字段信息"
      width="800"
      :before-close="showNodeInfoClose"
  >
    <div class="node_filed">
      <div class="operate">
        <el-button type="primary" @click="addNodeInfoFiled">新增字段</el-button>
        <el-button type="primary" @click="saveFiledUpdate">保存</el-button>
      </div>
      <div class="node_tables">
        <!-- 把selectedNodeData作为table给展示出来,存在portNameLabel，portTypeLabel 我像支持这两个属性搞成input可以手动修改 -->
        <el-table
            :data="selectedNodeData"
            style="width: 100%"
        >
          <el-table-column prop="portNameLabel" label="字段描述" width="300">
            <template #default="scope">
              <el-input v-model="scope.row.portNameLabel" placeholder="字段描述"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="portTypeLabel" label="领域字段" width="300">
            <template #default="scope">
              <el-input v-model="scope.row.portTypeLabel" placeholder="领域字段"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button @click="deleteNodeFiled(scope.row)" type="danger">删除</el-button>
            </template>
          </el-table-column>

        </el-table>

      </div>
    </div>

  </el-dialog>

  <SonDomainVersions
      v-if="showSonDomainVersion"
      :dialogVisible="showSonDomainVersion"
      :supportSelect="true"
      :son-domain="selectedSonDomain"
      @cancel="showSonDomainVersion = false"
      @ok="selectSonDomainVersion"
  ></SonDomainVersions>

  <el-dialog v-model="showDataGroup" title="数据组" width="700">
    <el-input v-model="groupName" placeholder="请输入数据组名称" clearable></el-input>
    <el-button type="primary" @click="addGroup">保存</el-button>
  </el-dialog>

  <el-dialog v-model="showSelectParent" title="数据组详情" width="700">
    <!--基于parentNodeSet来做一个el-select-->
    <el-select v-model="selectedParentId" placeholder="请选择父节点">
      <el-option
          v-for="item in parentNodeSet"
          :key="item"
          :label="item"
          :value="item"
      >
      </el-option>
    </el-select>
    <el-button type="primary" @click="createNodes">确定</el-button>
  </el-dialog>


  <el-dialog
      v-model="showDomainDesc"
      title="描述信息"
      width="800px"
      :before-close="showDomainDescClose"
  >
    <div class="titleForm">
      <el-form
          :inline="true"
          ref="formRef"
          :model="formInline"
      >
        <el-form-item
            required
            label="添加"
        >
          <div class="button">
            <el-button type="primary" @click="addInput">添加注释</el-button>
          </div>
        </el-form-item>

        <el-form-item
            required
            label="描述"
        >
          <div v-for="(input, index) in inputs" :key="index" class="input-container">
            <div class="needs">
              <el-input class="flow_desc" v-model="input.value" type="textarea" style="width: 550px"
                        :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
              <el-button type="danger" @click="removeInput(index)">删除</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item
            required
            label=""
        >
          <div class="button">
            <el-button type="primary" @click="saveDomainDesc">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

  </el-dialog>


</template>
<!-- 首页 -->
<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {Graph, Shape} from '@antv/x6'
import {ElMessage} from 'element-plus';
import flowService from "@/api/flow/flowService.ts";
import domainService from "@/api/domain/domainService";
import sonDomainService from "@/api/domain/sonDomainService";
import SonDomainVersions from "@/components/function/SonDomainVersion.vue";
import DomainObjects from "@/components/domian/DomainObjects.vue";

const router = useRouter()
const route = useRoute();
import {Selection} from '@antv/x6-plugin-selection'
import {Group} from './Group.ts'
import {Node} from '@antv/x6'
import {Cell} from "@antv/x6/src/model/cell.ts";

const showNodeInfoClose = () => {
  showNodeInfo.value = false
  selectedNodeData.value = []
  cellsId.value = ''
}

const showDataGroupFunction = () => {
  showDataGroup.value = true
}

const showDomainDesc = ref(false)

const showDomainDescClose = () => {
  showDomainDesc.value = false
}

let selectedDomainId = ''

const showDataGroup = ref(false)

const saveDomainDesc = () => {
  // flowDescGroup
  flowDescGroup[selectedDomainId] = inputs.value
  // 清空
  inputs.value = []
  selectedDomainId = ''
  showDomainDesc.value = false
  let flowGroupData = {
    "flowDataDescMap": flowDescGroup
  }
  let updateParam = {
    id: flowDetail.value.id,
    flowDataDesc: flowGroupData
  }
  flowService.updateFlowDesc(updateParam).then(res => {
    ElMessage.success('保存成功')
  })
}

const activeName = ref('first')

const showDesc = ref(false)

const descClose = () => {
  showDesc.value = false
}

const showFlowDesc = () => {
  showDesc.value = true
}

const deleteNodeFiled = (row) => {
  // 在selectedNodeData.value删除
  selectedNodeData.value = selectedNodeData.value.filter(item => item !== row)
}

const addNodeInfoFiled = () => {
  selectedNodeData.value.push({
    portNameLabel: '',
    portTypeLabel: ''
  })
}


const inputs = ref([]);
/*const props = defineProps({
  flowId: {
    type: Object,
    default: null
  }
})*/
const loading = ref(false)
const id = ref<number>(0)
const sonList = ref([])
const container = ref<HTMLElement>();
const formInline = ref({})
const showSonDomainVersion = ref(false)
const rules = reactive({
  flowDataName: [
    {required: true, message: '请输入数据流名称', trigger: 'blur'},
  ]
})


const showAiAnalysis = ref(false)

const showAiAnalysisFunction = () => {
  if (!flowDetail.value.id) {
    ElMessage.warning("数据流没有保存，请保存后进行生成")
    return
  }
  showAiAnalysis.value = true
}

const AnalysisHandleClose = () => {
  showAiAnalysis.value = false
}

function addInput() {
  inputs.value.push({value: ''});
}

function removeInput(index) {
  inputs.value.splice(index, 1);
}

const pageParams = ref({
  page: 1,
  size: 10,
  total: 0
})

const options = [
  {
    value: 'FUNCTION',
    label: '功能配置',
  },
  {
    value: 'SYSTEM',
    label: '系统设置',
  }]


const spider_type = ref('FUNCTION')

watch(spider_type, (newValue, oldValue) => {
  console.log('spider_type changed from', oldValue, 'to', newValue);
  if (newValue === 'SYSTEM') {
    router.push({
      path: 'system',
    })
  }
});


const domainNames = ref([])

const domains = ref<Array<Domain>>([])
let selectedSonDomain: SonDomain
const showSonVersions = (row) => {
  selectedSonDomain = row
  showSonDomainVersion.value = true
}

const fetchAndFilterDomain = async (query) => {
  // 确保 query 是一个字符串
  if (typeof query !== 'string' || query.trim() === '') {
    query = ""
  }
  loading.value = true;
  const sanitizedQuery = query.trim();
  let queryParam = {
    areaName: sanitizedQuery,
    page: 1,
    size: 10
  }
  const res = await domainService.queryDomain(queryParam)
  domains.value = res.spiderAreaList
  loading.value = false;
};


const sonAreaIds = ref([])

let selectedDomainVersion: SonDomainVersion = {} as SonDomainVersion

const showSelectParent = ref(false)

const selectSonDomainVersion = (item: SonDomainVersion) => {
  showSonDomainVersion.value = false
  selectedDomainVersion = item
  showSelectParent.value = true
}

const selectedParentId = ref('')

const createNodes = () => {
  let tempArr = []
  graphs.value.toJSON().cells.forEach(item => {
    if (sonAreaIds.value.indexOf(item.id) >= 0) {
      tempArr.push(item.id)
    }
  })
  sonAreaIds.value = tempArr
  if (sonAreaIds.value.indexOf(selectedDomainVersion.id) < 0) {
    initNode(0, 0, selectedDomainVersion.sonAreaName, selectedDomainVersion.domainFieldInfos, selectedDomainVersion.id)
    sonAreaIds.value.push(selectedDomainVersion.id)
  } else {
    ElMessage({
      message: '不能重复添加子域',
      type: 'warning',
    })
  }
}

const back = () => {
  router.push({
    path: 'functions',
  })
}

const formRef = ref(null);
const addFlow = async () => {

  console.log(graphs.value.toJSON())
  if (graphs.value.toJSON().cells.length <= 0) {
    ElMessage({
      message: '请添加数据流',
      type: 'warning',
    })
    return
  }

  let data = {
    ...formInline.value,
    id: id.value || undefined,
    data: graphs.value.toJSON(),
    status: id.value ? flowDetail.status : 'INIT',
    sonAreaIds: sonAreaIds.value,

  }
  let res = await flowService.upsertFlow(data)
  console.log(res)
  ElMessage({
    message: '添加成功',
    type: 'success',
  })
  // 跳转
  router.push({
    path: 'functions',
  })
}

const handlePageChange = (newPage) => {
  pageParams.value.page = newPage
  getSonArea()
}

const getSonArea = async () => {
  let data = {
    page: pageParams.value.page,
    size: pageParams.value.size,
    areaIds: []
  }
  if (domainNames.value.length > 0) {
    // 遍历 domains 获取出跟domainNames数组中包含 数据
    let selectedDomain = domains.value.filter(item => domainNames.value.indexOf(item.areaName) >= 0)

    // 获取selectedDomain 中的 id
    selectedDomain.forEach(item => {
      data.areaIds.push(item.id)
    })
  }
  const res = await sonDomainService.querySonDomain(data)
  console.log(res)
  sonList.value = res.spiderSonAreas
  pageParams.value.total = res.total
}
const graphs = ref<Graph>({} as Graph)
const groupName = ref('')
//使用let 声明一个变量存 一个mapValue就是parent 可以是 groupName
let parentNodeMapValue: Map<string, Node> = new Map()

// 使用 const 创建一个set数组
let parentNodeSet: Set<string> = new Set()

const addGroup = () => {
  createParent()
  showDataGroup.value = false
}

const createParent = () => {
  let parents: Node = graphs.value.createNode({
    shape: 'custom-group-node',
    id: groupName.value,
    x: 40,
    y: 40,
    width: 360,
    height: 160,
    zIndex: 1,
    label: groupName.value,
  })
  graphs.value.addNode(parents)
  parentNodeMapValue.set(groupName.value, parents)
  parentNodeSet.add(groupName.value)
}

const initGraph = () => {
  const LINE_HEIGHT = 24
  const NODE_WIDTH = 150
  //初始化graph
  const graph = new Graph({
    container: container.value,//画布容器
    width: container.value.offsetWidth,//画布宽，
    height: container.value.offsetHeight,//画布高
    background: false,//背景透明
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
    },
    //配置连线规则
    panning: {//画布通过开启 panning 选项来支持拖拽平移。
      enabled: true
    },
    //网格
    grid: {
      type: 'mesh',
      size: 20,      // 网格大小 10px
      visible: true, // 渲染网格背景
      args: {
        color: '#eeeeee', // 网格线/点颜色
        thickness: 2,     // 网格线宽度/网格点大小
      },
    },
    //连接配置
    connecting: {
      snap: true, // 自动吸附
      allowBlank: false, // 是否允许连接到画布空白位置的点
      allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
      allowNode: false, // 是否允许边链接到节点（非节点上的链接桩）
      router: {
        name: 'er',
        args: {
          offset: 25,
          direction: 'H'
        }
      },
      //边配置
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2
            }
          }
        })
      },
      //高亮
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: '#6a6c8a'
            }
          }
        }
      },
      validateConnection({targetMagnet}) {
        return !!targetMagnet
      },
    },
  })
  //创建链接桩的布局，这里主要是定位链接桩的位置
  Graph.registerPortLayout(
      'erPortPosition',
      (portsPositionArgs) => {
        return portsPositionArgs.map((_, index) => {
          return {
            position: {
              x: 0,
              y: (index + 1) * LINE_HEIGHT,
            },
            angle: 0,
          }
        })
      },
      true,
  )

  Graph.registerNode(
      'custom-group-node',
      {
        inherit: 'rect',
        width: 80,
        height: 40,
        attrs: {
          body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
            rx: 6,
            ry: 6,
          },
          label: {
            fill: '#333',
            fontSize: 25,
            fontWeight: 'bold',
            refX: 0.5,         // 水平居中（相对于 body）
            refY: -0.5,        // 垂直方向放在 body 上方
            textAnchor: 'middle',  // 文本水平居中
            textVerticalAnchor: 'bottom', // 文本垂直底部对齐（即贴着 body 的上方）
          }
        },
      },
      true,
  )


  //注册节点，这个节点就是动图中第一行深蓝色
  Graph.registerNode('er-rect',
      {
        inherit: 'rect',
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'text',
            selector: 'label',
          }
        ],
        //节点样式
        attrs: {
          btn: {
            refX: '100%',
            refX2: -28,
            y: 4,
            width: 24,
            height: 18,
            rx: 10,
            ry: 10,
            fill: 'rgba(255,255,0,0.01)',
            stroke: 'red',
            cursor: 'pointer',
            event: 'node:delete',
          },
          btnText: {
            fontSize: 14,
            fill: 'red',
            text: 'x',
            refX: '100%',
            refX2: -19,
            y: 17,
            cursor: 'pointer',
            pointerEvent: 'none',
          },
          rect: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#5F95FF',
          },
          label: {
            fontWeight: 'bold',
            fill: '#ffffff',
            fontSize: 12,
          },
        },
        //连接桩配置，动图中的2、3、4行浅蓝色部分
        ports: {
          groups: {
            list: {
              markup: [
                {
                  tagName: 'rect',
                  selector: 'portBody',
                },
                {
                  tagName: 'text',
                  selector: 'portNameLabel',
                  zIndex: 1
                },
                {
                  tagName: 'text',
                  selector: 'portTypeLabel',
                },
              ],
              attrs: {
                portBody: {
                  width: NODE_WIDTH,
                  height: LINE_HEIGHT,
                  strokeWidth: 1,
                  stroke: '#5F95FF',
                  fill: '#EFF4FF',
                  magnet: true,
                },
                portNameLabel: {
                  ref: 'portBody',
                  refX: 6,
                  refY: 6,
                  fontSize: 10,
                },
                portTypeLabel: {
                  ref: 'portBody',
                  refX: 95,
                  refY: 6,
                  fontSize: 10,
                },
              },
              //使用定义的的定位位置
              position: 'erPortPosition',
            },
          },
        },
      },
      true,)
  graph.use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: false,
        movable: true,
        showNodeSelectionBox: true,
      }),
  )

  /*graph.on('node:delete', ({ view, e }: any) => {
    e.stopPropagation()
    view.cell.remove()
  })*/

  graph.on('node:mouseenter', ({e, node, view}) => {
    node.addTools({
      name: 'button-remove',
      args: {
        x: 10,
        y: 10,
        offset: {x: 0, y: 0},
        onClick: ({cell}) => {
          /*cells.value = cells.value.filter(item => item.id !== cell.id)
          graphs.value.resetCells(cells.value)
          sonAreaIds.value = sonAreaIds.value.filter(item => item !== cell.id)*/
          // return

          let parentNode: Node = parentNodeMapValue.get(node.getParentId())
          if(parentNode){
            parentNode.removeChild(cell)
          }
          graphs.value.removeNode(cell.id)
        }
      },
    })
  });
  graph.on('node:mouseleave', ({e, node, view}) => {
    node.removeTools() // 删除所有的工具
  });

  /*graph.on('edge:mouseenter', ({cell}) => {
    cell.addTools([
      {
        name: 'button-remove',
        args: {
          distance: 20,
          onClick: ({cell}) => {
            let parentNode: Node = parentNodeMapValue.get(node.getParentId())
            parentNode.removeChild(cell)
            graphs.value.removeNode(cell.id)
            // return
          }
        },
      },
    ])
  })*/

  graph.on('node:moved', ({node}) => {
    const parent = node.getParent()
    if (parent && parent.isNode()) {
      const bbox = parent.getBBox()
      parent.prop('originPosition', {x: bbox.x, y: bbox.y})
      parent.prop('originSize', {width: bbox.width, height: bbox.height})
    }
  })

  graph.on('node:mouseenter', ({e, node, view}) => {
    if (node.shape == 'custom-group-node') {
      // 添加button工具 工具名称为 选中
      node.addTools({
        name: 'button',
        args: {
          markup: [
            {
              tagName: 'circle',
              selector: 'button',
              attrs: {
                r: 14,
                stroke: '#fe854f',
                'stroke-width': 3,
                fill: 'white',
                cursor: 'pointer',
              },
            },
            {
              tagName: 'text',
              textContent: '设置描述',
              selector: 'icon',
              attrs: {
                fill: '#fe854f',
                'font-size': 8,
                'text-anchor': 'middle',
                'pointer-events': 'none',
                y: '0.3em',
              },
            },
          ],
          // 设置为右上角定位
          x: 0,       // 1 = 右侧
          y: 1,       // 0 = 上侧
          offset: {x: -10, y: 10},  // 微调位置（向外偏移）
          onClick: ({cell}) => {
            //TODO-- 设置选中的
            selectedDomainId = node.id
            // 通过selectedDomainId 在flowDescGroup中获取数据赋值给inputs
            if(flowDescGroup[selectedDomainId]){
              inputs.value = flowDescGroup[selectedDomainId]
            }
            showDomainDesc.value = true
          }
        }
      });
      return
    }
    node.addTools({
      name: 'button',
      args: {
        markup: [
          {
            tagName: 'circle',
            selector: 'button',
            attrs: {
              r: 14,
              stroke: '#fe854f',
              'stroke-width': 3,
              fill: 'white',
              cursor: 'pointer',
            },
          },
          {
            tagName: 'text',
            textContent: '编辑',
            selector: 'icon',
            attrs: {
              fill: '#fe854f',
              'font-size': 8,
              'text-anchor': 'middle',
              'pointer-events': 'none',
              y: '0.3em',
            },
          },
        ],
        x: 0,
        y: 1,
        offset: {x: -10, y: 10},  // 微调位置（向外偏移）
        onClick: ({cell}) => {
          console.log("item-信息", cell)
          //cell.ports 是一个素组，请对cell.ports进行遍历
          selectedNodeData.value = []
          cellsId.value = cell.id
          cell.ports.items.forEach(item => {
            selectedNodeData.value.push({
              portNameLabel: item.attrs.portNameLabel.text,
              portTypeLabel: item.attrs.portTypeLabel.text,
              id: item.id
            })
          })
          showNodeInfo.value = true
          // return
        }
      },
    })
  });

  graph.on('node:embedding', ({e}: { e: Dom.MouseMoveEvent }) => {
    ctrlPressed = e.metaKey || e.ctrlKey
  })

  graph.on('node:collapse', ({node}: { node: Group }) => {
    node.toggleCollapse()
    const collapsed = node.isCollapsed()
    const collapse = (parent: Group) => {
      const cells = parent.getChildren()
      if (cells) {
        cells.forEach((cell) => {
          if (collapsed) {
            cell.hide()
          } else {
            cell.show()
          }

          if (cell instanceof Group) {
            if (!cell.isCollapsed()) {
              collapse(cell)
            }
          }
        })
      }
    }

    collapse(node)
  })

  graph.on('edge:mouseleave', ({cell}) => {
    if (cell.hasTool('button-remove')) {
      cell.removeTool('button-remove')
    }
  })

  let ctrlPressed = false

  graph.on('node:embedded', () => {
    ctrlPressed = false
  })


  graph.on('node:change:position', ({node, options}) => {
    if (options.skipParentHandler || ctrlPressed) {
      return
    }

    const children = node.getChildren()
    if (children && children.length) {
      node.prop('originPosition', node.getPosition())
    }

    const parent = node.getParent()
    if (parent && parent.isNode()) {
      let originSize = parent.prop('originSize')
      if (originSize == null) {
        originSize = parent.getSize()
        parent.prop('originSize', originSize)
      }

      let originPosition = parent.prop('originPosition')
      if (originPosition == null) {
        originPosition = parent.getPosition()
        parent.prop('originPosition', originPosition)
      }

      let x = originPosition.x
      let y = originPosition.y
      let cornerX = originPosition.x + originSize.width
      let cornerY = originPosition.y + originSize.height
      let hasChange = false
      let embedPadding = 60
      const children = parent.getChildren()
      if (children) {
        children.forEach((child) => {
          const bbox = child.getBBox().inflate(embedPadding)
          const corner = bbox.getCorner()

          if (bbox.x < x) {
            x = bbox.x
            hasChange = true
          }

          if (bbox.y < y) {
            y = bbox.y
            hasChange = true
          }

          if (corner.x > cornerX) {
            cornerX = corner.x
            hasChange = true
          }

          if (corner.y > cornerY) {
            cornerY = corner.y
            hasChange = true
          }
        })
      }

      if (hasChange) {

        parent.prop(
            {
              position: {x, y},
              size: {width: cornerX - x, height: cornerY - y},
            },
            // Note that we also pass a flag so that we know we shouldn't
            // adjust the `originPosition` and `originSize` in our handlers.
            {skipParentHandler: true},
        )
      }
    }
  })

  graph.on('node:change:size', ({node, options}) => {
    if (options.skipParentHandler) {
      return
    }
    const children = node.getChildren()
    if (children && children.length) {
      node.prop('originSize', node.getSize())
    }
  })

  graph.on('edge:added', ({edge, index, options}) => {
    const edges = graph.getEdges()
    //cells.value.push(edge)
    edges.forEach(e => {
      if (e.target === edge.source && e.source === edge.target) {
        return
      }
    })
  })

  graphs.value = graph
}

const selectedNodeData = ref([])

const cellsId = ref('')

const showNodeInfo = ref(false)

const saveFiledUpdate = () => {
  // 1. 获取当前节点并移除旧节点
  const oldNode = graphs.value.getCellById(cellsId.value)
  if (!oldNode) return

  // 2. 创建新端口配置
  const newPorts = selectedNodeData.value.map((item, index) => ({
    id: item.id, // 使用唯一ID防止重复
    group: "list",
    attrs: {
      portBody: {width: 250},
      portNameLabel: {text: item.portNameLabel},
      portTypeLabel: {text: item.portTypeLabel}
    }
  }))
  console.log("oldNode", oldNode.toJSON())
  // 3. 创建新节点（保留原有位置和基础属性）
  const newNode = graphs.value.createNode({
    ...oldNode.toJSON(),
    ports: newPorts
  })

  graphs.value.removeNode(cellsId.value)
  graphs.value.addNode(newNode)
  /*// 在cells.value中移除id为oldNode.id的节点数据
  cells.value = cells.value.filter(item => item.id !== cellsId.value)
  cells.value.push(newNode)
  graphs.value.resetCells(cells.value)*/
  // 5. 关闭弹窗
  showNodeInfo.value = false
}

const cells = ref([])
const initNode = (x, y, name, data, id) => {
  // 判断 selectedParentId 为空
  if (selectedParentId.value == '') {
    ElMessage.error('请先选择父节点')
    return
  }

  let ports = []
  data.forEach(item => {
    ports.push({
      "id": item.areaFiled,
      "group": "list",
      "attrs": {
        portBody: {
          width: 250,
        },
        "portNameLabel": {
          "text": item.fieldDesc.length > 7 ? item.fieldDesc.substring(0, 7) + '...' : item.fieldDesc
        },
        "portTypeLabel": {
          "text": item.areaFiled
        }
      }
    })
  })

  let child: Node = graphs.value.addNode({
    id,
    "shape": "er-rect",
    "label": name,
    "width": 250,
    "height": 24,
    "position": {
      x,
      y
    },
    "ports": ports
  })
  ElMessage.info('创建成功')
  let parentNode: Node = parentNodeMapValue.get(selectedParentId.value)
  console.log('1111111111', parentNode.toJSON())
  parentNode.addChild(child)
  console.log('----------', parentNode.toJSON())
}
const flowDetail = ref({})

let flowDescGroup = {}

// 声明一个interface 里面包含 groupId,['描述']两个字段
/*interface FlowDescGroup {
  groupId: string;
  desc: [];
}*/

const getFlowDetail = async () => {
  let data = {
    id: id.value
  }
  let res = await flowService.queryFlowData(data)
  console.log('res', res)
  flowDetail.value = res
  // inputs.value = res.flowDataDesc转成数组
  if (res.flowDataDesc) {
    //inputs.value = JSON.parse(res.flowDataDesc)
    flowDescGroup = res.flowDataDesc.flowDataDescMap
  }

  if (!res.dataFlowAnalysisModel) {
    flowDetail.value.dataFlowAnalysisModel = {domainInfoResult: "暂无数据", flowDataResult: "暂无数据"}
  }
  sonAreaIds.value = JSON.parse(res.sonAreaIds)
  let parentTempCell = []
  let childTempCell = []
  // 获取到 res.data.cells 中 item.shape === 'er-parent'的数据
  res.data.cells.forEach(item => {
    if (item.shape === 'custom-group-node') {
      parentTempCell.push(item)
    } else {
      childTempCell.push(item)
    }
  })
  // 获取到 res.data.cells 中 item.shape === 'er-parent'的数据
  parentTempCell.forEach(item => {
    item.children = []
    let parentNode: Node = graphs.value.createNode(item)
    graphs.value.addNode(parentNode)
    // 将 item.id 转为string
    let itemId = item.id.toString()
    parentNodeMapValue.set(itemId, parentNode)
    parentNodeSet.add(itemId)
  })
  console.log("===size==", childTempCell.length)
  childTempCell.forEach(item => {
    if (item.shape === 'er-rect') {
      // 移除 item中的parent
      let parentId = item.parent.toString()
      let parentNodes: Node = parentNodeMapValue.get(parentId)
      item.parent = ''
      let child: Node = graphs.value.createNode(item)
      graphs.value.addNode(child)
      parentNodes.addChild(child)
      console.log("--INIT----", parentNodes.toJSON())
      //parentNodeMapValue.set(parentNodes.id, parentNodes)
      // cells.value.push(child)
    } else {
      graphs.value.addEdge(item)
      //cells.value.push(graphs.value.createEdge(item))
    }
  })

  formInline.value = {
    flowDataName: res.flowDataName
  }
  /*console.log(cells.value, 'cells')
  graphs.value.resetCells(cells.value)*/
}

onMounted(() => {
  id.value = Number(route.query.flowId)
  console.log("获取数据id为", id.value)
  if (id.value) {
    getFlowDetail()
  }
  getSonArea()
  initGraph()
})

/*watch(
    () => id.value,
    (newVal) => {
      id.value = newVal
      console.log("新的id为", id.value)
      if (id.value) {
        getFlowDetail()
      }
      getSonArea()
    },
    {deep: true}
);*/
</script>
<style lang="scss" scoped>
.flex {
  display: flex;

  .leftMenu {
    width: 20%;
    padding: 10px;
    border-right: 1px solid #ccc;

    .sonTab {
      padding: 10px;
      background: #f2f2f2;
      margin: 10px 0;
      cursor: pointer;
    }
  }

  .rightContent {
    width: 80%;

    .main_container {
      height: 100%;
    }
  }

  /*.titleForm {
    width: 20%;
    padding: 10px;
    border-right: 1px solid #ccc;

  }*/
}

.operate {
  // button的左边距
  margin-left: 10px;
}

.input-container {
  .needs {
    // 设置 input button 横向排列
    display: flex;
    flex-direction: row;
    align-items: center;

    .flow_desc {
      // 设置右边距
      margin-right: 10px;
      //设置下边距
      margin-bottom: 10px;
    }
  }
}

//固定el-dialog的高度

</style>
