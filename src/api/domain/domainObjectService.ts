import api from "@/api/method/method.ts";

export default {
    // 新增方法queryDomain 传入params 返回的结果转成Domain[]数组
    queryDomainObject(params: any) {
        console.log(params)
        return api.post('/query/domain_object', params)
    },
    upsertDomainObject(params: any) {
        return api.post('/upsert/domain_object', params)
    }
}
