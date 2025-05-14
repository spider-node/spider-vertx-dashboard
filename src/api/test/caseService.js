import api from '../method/method';
export default {
    queryCase(params) {
        return api.post('/query_case_info', params);
    },
    // 新增场景
    addCase(params) {
        return api.post('/run_case', params);
    },
    startCase(params) {
        return api.post('/restart_case', params);
    },
};
