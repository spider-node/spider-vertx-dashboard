import api from '../method/method';
export default {
    upload(params) {
        return api.uploadFile('/upload/bpmn', params);
    },
};
