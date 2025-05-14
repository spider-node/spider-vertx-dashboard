import api from '../method/method'
export default {
    queryDomainFunction(params: any) {
        return api.post('/query/domain_function', params)
    },
    upsertDomainFunction(params: any) {
        return api.post('/upsert/domain_function', params)
    }
}