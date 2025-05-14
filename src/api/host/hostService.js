import api from '../method/method';
export default {
    queryTaskDeploy(params) {
        return api.post('/query/task_deploy', params);
    },
};
