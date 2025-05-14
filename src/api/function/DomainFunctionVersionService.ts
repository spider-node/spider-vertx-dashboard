import api from '../method/method'

export default {
    queryDomainFunction(params: any) {
        return api.post('/query/domain_function_version', params)
    },
    upsertDomainFunction(params: any) {
        return api.post('/upsert/domain_function_version', params)
    }
}