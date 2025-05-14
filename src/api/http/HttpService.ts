import api from '../method/method'

export default {
    queryHttpFunction(params: any) {
        return api.post('/query/http_function', params)
    },
    upsertHttpFunction(params: any) {
        return api.post('/upsert/http_function', params)
    },
    // /http_test
    httpTest(params: any) {
        return api.post('/http_test', params)
    },
}