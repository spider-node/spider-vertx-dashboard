import api from '../method/method'
export default {
    queryTaskDeploy(params: any) {
        return api.post('/query/task_deploy', params)
    },



}