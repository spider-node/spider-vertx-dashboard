import api from '../method/method'

export default {
    queryFramework(params: any) {
        return api.post('/query/framework', params)
    },
    insertFramework(params: any) {
        return api.post('/insert/framework', params)
    }
}