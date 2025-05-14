import api from '../method/method';
export default {
    queryFlowPage(params) {
        return api.post('/query/flow_data', params);
    },
    updateFlowStatus(params) {
        return api.post('/data_flow/update_status', params);
    },
    upsertFlow(params) {
        return api.post('/upsert/flow_data', params);
    },
    querySonDomainBaseInfo(params) {
        return api.post('/query/son_area_base', params);
    },
    querySonDomainInfo(params) {
        return api.post('/query/son_area_v2', params);
    },
    queryFlowData(params) {
        return api.post('/query/flow_data_info', params);
    }
};
