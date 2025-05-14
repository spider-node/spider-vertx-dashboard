import api from '../method/method';
export default {
    queryTable(params) {
        return api.post('/query/tables', params);
    },
};
