import api from '../method/method'
export default {
    queryFlowPage(params: any) {
        return api.post('/query/flow_data', params)
    },
    updateFlowStatus(params: any) {
        return api.post('/data_flow/update_status', params)
    },
    upsertFlow(params: any) {
        return api.post('/upsert/flow_data', params)
    },
    querySonDomainBaseInfo(params: any) {
        return api.post('/query/son_area_base', params)
    },
    querySonDomainInfo(params: any) {
        return api.post('/query/son_area_v2', params)
    },
    queryFlowData(params: any){
        return api.post('/query/flow_data_info', params)
    },
    // 更新数据流描述
    updateFlowDesc(params: any) {
        return api.post('/update/data_flow_desc', params)
    },



}
