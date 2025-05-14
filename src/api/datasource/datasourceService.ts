import api from '../method/method'

export default {
    queryDatasource(params: any) {
        return api.post('query/datasource', params)
    },
    queryDatasourcePage(params: any) {
        return api.post('/query_datasource_page', params)
    },
    upsertDatasource(params: any){
        return api.post('/upsert/datasource', params)
    }
}