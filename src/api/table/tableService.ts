import api from '../method/method'
export default {
    queryTable(params: any) {
        return api.post('/query/tables', params)
    },
}