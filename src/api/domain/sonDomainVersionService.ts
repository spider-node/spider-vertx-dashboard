import api from '../method/method'

export default {
    querySonDomainVersion(params: any) {
        return api.post('/query/son_domain_version', params)
    },
    updateSonDomainVersion (params: any) {
        return api.post('/update_son_domain_field', params)
    },
    initDomainBaseInfo(params: any) {
        return api.post('/init/area_base_info', params)
    },
    queryDeployInfo(params: any) {
        return api.post('/query_deploy_info', params)
    },
}