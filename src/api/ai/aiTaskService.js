import api from '../method/method';
export default {
    createCoder(params) {
        return api.post('/create_coder', params);
    },
    // 更新coder
    updateCoder(params) {
        return api.post('/update_coder', params);
    },
    queryAiTaskStep(params) {
        return api.post('/query/task_step', params);
    },
    generateDataFlowInfo(params) {
        return api.post('/generate_data_flow_info', params);
    },
    // 发起ai解析
    aiAnalysisResult(params) {
        return api.post('/analysis_param', params);
    },
    // 查询ai解析
    queryAiAnalysisResult(params) {
        return api.post('/query/analysis_param', params);
    },
    // 更新ai解析
    updateAiAnalysisResult(params) {
        return api.post('/notify/ai_analysis_result', params);
    },
    // 解析demand
    parseDemand(params) {
        return api.post('/demand_analysis', params);
    },
    // 扩缩容
    scale(params) {
        return api.post('/scale_plugin', params);
    },
    uninstallPlugin(params) {
        return api.post('/uninstall_biz', params)
    },
};
