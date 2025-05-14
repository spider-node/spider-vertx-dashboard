import api from '../method/method';
export default {
    getCode(params) {
        return api.post('/query_function_code', params);
    }
};
