import api from '../method/method'

export default {
    // 新增方法queryDomain 传入params 返回的结果转成Domain[]数组
    queryDomain(params: any) {
        console.log(params)
        return api.post('/query/area', params)
    },
    insertDomain(params: any) {
        return api.post('/upsert_domain', params)
    },
    updateDomain(params: any) {
        return api.post('/domain/update', params)
    },
}