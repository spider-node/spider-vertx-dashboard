import api from '../method/method'
export default {
    queryLog(params: any) {
        return api.post('/query/flowExampleInfo', params)
    },
    // query/elementInfo
    queryElementInfo(params: any) {
        return api.post('/query/elementInfo', params)
    },
    // retry/retry_business_node
    retryBusinessNode(params: any) {
        return api.post('/retry/retry_business_node', params)
    },
}