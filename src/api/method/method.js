import request from "../util/request";
export default {
    get(url, params) {
        return request({
            url: url,
            method: 'get',
            params
        });
    },
    post(url, params) {
        return request({
            url: url,
            method: 'post',
            data: params
        });
    },
    // 配置一个上传文件流的方法
    uploadFile(url, param) {
        return request({
            url: url,
            method: 'post',
            data: param,
        });
    }
};
