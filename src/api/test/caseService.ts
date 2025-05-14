import api from '../method/method'
export default {
  queryCase(params: any) {
    return api.post('/query_case_info', params)
  },
  // 新增场景
  addCase(params: any) {
    return api.post('/run_case', params)
  },
  startCase(params: any) {
    return api.post('/restart_case', params)
  },
}