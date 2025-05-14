import { defineStore } from 'pinia'
import { toRaw } from 'vue'

export const useBpmnStore = defineStore('bpmn', {
 // 静态数据
 state: () => ({
  nodeId: null,
  selectDialogVisible: false,
 }),
 // 相当于计算属性(有数据缓存)
 getters: {
  // TODO
 },
 // actions即可以是同步函数也可以是异步函数
 actions: {
  SetSelectDialogVisible(visible) {
   this.selectDialogVisible = visible
  },
  SetNodeInfo(nodeId) {
   this.nodeId = toRaw(nodeId)
  },
 },
 // 开启数据缓存
 persist: {
  enabled: true,
  strategies: [
   {
    // 使用 sessionStorage 进行存储
    storage: sessionStorage,
   },
  ],
 },
})
