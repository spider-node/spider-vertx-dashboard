import api from '../method/method'

export default {
    queryBusinessFunctionPage(params: any) {
        return api.post('/query/business_function_version', params)
    },
    addFunctionVersion(params: any) {
        return api.post('/upsert/businessVersion_v2', params)
    },
    updateFunctionVersion(params: any) {
        return api.post('/upsert/businessVersion_v2', params)
    },
    brushBpmn(params: any) {
        return api.post('/refresh/bpmn', params)
    },
    stopStartVersion(params: any) {
        return api.post('/stop_start/version', params)
    },

    configToJavaEntity(params: any) {
        return api.post('/config_to_java_entity', params)
    },
    // ai生成业务参数
    aiGenerateBusinessJsParam(params: any) {
        return api.post('/create_node_param_coder', params)
    },
    // 发起测试
    startTest(params: any) {
        return api.post('/start/function', params)
    },
}