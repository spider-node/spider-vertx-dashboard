import api from '../method/method';
export default {
    queryDatasource(params) {
        return api.post('query/datasource', params);
    },
    queryDatasourcePage(params) {
        return api.post('/query_datasource_page', params);
    },
    upsertDatasource(params) {
        return api.post('/upsert/datasource', params);
    }
};
