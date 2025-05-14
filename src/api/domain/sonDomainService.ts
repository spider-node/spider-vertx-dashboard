import api from '../method/method'

export default {
    querySonDomain(params: any) {
        return api.post('/query/son_area_infos', params)
    },
    upsertSonDomain(params: any) {
        return api.post('/upsert/son_area_info', params)
    }
}