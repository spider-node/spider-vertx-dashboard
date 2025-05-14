import api from '../method/method'
export default {
    queryBusinessFunctionPage(params: any) {
        return api.post('/query_business_function_v2', params)
    },
    upsertBusinessFunction(params: any) {
        return api.post('/upsert_business_function_v2', params)
    },



}