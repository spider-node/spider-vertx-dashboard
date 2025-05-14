<template>
  <div class="box">
    <div>
      <el-button type="primary" @click="showFlowDesc">查看描述</el-button>
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
  <SonDomainVersions
      v-if="showSonDomainVersion"
      :dialogVisible="showSonDomainVersion"
      :supportSelect="true"
      :son-domain="selectedSonDomain"
      @cancel="showSonDomainVersion = false"
      @ok="selectSonDomainVersion"
  ></SonDomainVersions>
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
            prop="flowDataName"
            label="领域名称"
        >
          <el-input
              v-model="formInline.domainName"
              placeholder="请输入数据流名称"
              clearable
          />
        </el-form-item>

        <el-form-item
            required
            label="描述"
        >
          <div v-for="(input, index) in inputs" :key="index" class="input-container">
            <div class="needs">
              <el-input class="flow_desc" v-model="input.value" type="textarea" style="width: 550px"
                        :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>

  </el-dialog>

</template>
<!-- 首页 -->
<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {Graph, Node, Shape} from '@antv/x6'
import {ElMessage} from 'element-plus';
import flowService from "@/api/flow/flowService.ts";
import domainService from "@/api/domain/domainService";
import sonDomainService from "@/api/domain/sonDomainService";
import SonDomainVersions from "@/components/function/SonDomainVersion.vue";
import {useRouter} from "vue-router";

const emit = defineEmits(['selectFlowGroup']);
const inputs = ref([]);
const router = useRouter()
const props = defineProps({
  flowId: {
    type: Number,
    default: ''
  },
  domainName: {
    type: String,
    default: ''
  },
})
const loading = ref(false)
const id = ref<Number>(0)
const sonList = ref([])
const container = ref<HTMLElement>();
const formInline = reactive({
  flowDataName: '',
  domainName: '',
})
const showSonDomainVersion = ref(false)
const rules = reactive({
  flowDataName: [
    {required: true, message: '请输入数据流名称', trigger: 'blur'},
  ],
  flowDataDesc: [
    {required: true, message: '请输入数据流描述', trigger: 'blur'},
  ]
})

const showDesc = ref(false)

const showFlowDesc = () => {
  showDesc.value = true
}

const descClose = () => {
  showDesc.value = false
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


const selectSonDomainVersion = (item: SonDomainVersion) => {
  console.log(item)
  console.log(sonAreaIds, graphs.value.toJSON().cells)
  let tempArr = []
  graphs.value.toJSON().cells.forEach(item => {
    if (sonAreaIds.value.indexOf(item.id) >= 0) {
      tempArr.push(item.id)
    }
  })
  sonAreaIds.value = tempArr
  if (sonAreaIds.value.indexOf(item.id) < 0) {
    initNode(0, 0, item.sonAreaName, item.domainFieldInfos, item.id)
    sonAreaIds.value.push(item.id)
  } else {
    ElMessage({
      message: '不能重复添加子域',
      type: 'warning',
    })
  }
  showSonDomainVersion.value = false

}
const clickSon = (item) => {
  console.log(item)
  console.log(sonAreaIds, graphs.value.toJSON().cells)
  let tempArr = []
  graphs.value.toJSON().cells.forEach(item => {
    if (sonAreaIds.value.indexOf(item.id) >= 0) {
      tempArr.push(item.id)
    }
  })
  sonAreaIds.value = tempArr
  if (sonAreaIds.value.indexOf(item.id) < 0) {
    initNode(0, 0, item.sonAreaName, item.domainFieldInfo, item.id)
    sonAreaIds.value.push(item.id)
  } else {
    ElMessage({
      message: '不能重复添加子域',
      type: 'warning',
    })
  }
}
const formRef = ref(null);
const addFlow = async () => {
  await formRef.value.validate(async (valid, fields) => {
    console.log(valid)
    if (valid) {
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
        sonAreaIds: sonAreaIds.value
      }
      let res = await flowService.upsertFlow(data)
      console.log(res)
      ElMessage({
        message: '添加成功',
        type: 'success',
      })
      router.go(-1);
    }
  })
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
const initGraph = () => {
  const LINE_HEIGHT = 24
  const NODE_WIDTH = 150
  //初始化graph
  console.log('container', container.value)
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
          },
        ],
        //节点样式
        attrs: {
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
              textContent: '选中',
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
            ElMessage.info("选择数据流组成功")
            emit('selectFlowGroup', node.id)
            formInline.domainName = node.id
            // 修改node的演示为浅黄色
            node.attr({
              body: {
                fill: '#fff',
                stroke: '#8f8f8f',
              },
              label: {
                fill: '#333',
              },
            })
          }
        }
      });
      return
    }
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
            console.log(cell)
            cells.value = cells.value.filter(item => item.id !== cell.id)
            graphs.value.resetCells(cells.value)
            sonAreaIds.value = sonAreaIds.value.filter(item => item !== cell.id)
            // return
          }
        },

      },

    ])
  })*/

  graph.on('edge:mouseleave', ({cell}) => {
    if (cell.hasTool('button-remove')) {
      cell.removeTool('button-remove')
    }
  })
  graph.on('edge:added', ({edge, index, options}) => {
    const edges = graph.getEdges()
    cells.value.push(edge)
    edges.forEach(e => {
      if (e.target === edge.source && e.source === edge.target) {
        return
      }
    })
  })

  graphs.value = graph
}

const cells = ref([])
const initNode = (x, y, name, data, id) => {
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
  cells.value.push(graphs.value.createNode({
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
  },))
  graphs.value.resetCells(cells.value)
}

let parentNodeMapValue: Map<string, Node> = new Map()

// 使用 const 创建一个set数组
let parentNodeSet: Set<string> = new Set()

const flowDetail = ref({})
const getFlowDetail = async () => {
  let data = {
    id: id.value
  }
  let res = await flowService.queryFlowData(data)
  formInline.flowDataName = res.flowDataName
  console.log('res', res)
  flowDetail.value = res
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
}

onMounted(() => {
  id.value = props.flowId
  formInline.domainName = props.domainName
  console.log("获取数据id为", id.value)
  if (id.value) {
    getFlowDetail()
  }
  getSonArea()
  initGraph()
})

/*watch(
    () => props.flowId,
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
.box {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

  .rightContent {
    width: 100%;

    .main_container {
      height: 100%;
    }
  }

  .titleForm {
    width: 10%;
    padding: 10px;
    border-right: 1px solid #ccc;

  }
}

.input-container {
  // 实现两个input框横向排列
  display: flex;
  flex-direction: row;
}

</style>
