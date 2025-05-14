import { createStore } from 'vuex'
import { COLORLIST } from '@/constant/const'

export default createStore({
 state: {
  pageSettings: {
   hasPageTag: false,
   pageColor: COLORLIST?.[0]?.code,
  },
  nodeInfo: undefined,
 },
 mutations: {
  setPageSettings(state, data) {
   const STATE = state
   STATE.pageSettings = data
  },
  SetNodeInfo(state, nodeInfo) {
   const STATE = state
   STATE.nodeInfo = nodeInfo
  },
 },
 actions: {},
 modules: {},
})
