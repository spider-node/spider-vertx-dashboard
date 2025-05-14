import request from "../util/request";

export default {
    get(url:string,params:any){
        return request({
            url:url,
            method:'get',
            params
        })
    },
    post(url:string,params:any){
        return request({
            url:url,
            method:'post',
            data:params
        })
    },
    // 配置一个上传文件流的方法
    uploadFile(url:string, param: FormData){
        return request({
            url:url,
            method:'post',
            data:param,
        })
    }
}