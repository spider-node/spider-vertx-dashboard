import axios from "axios";
import {ElMessage} from "element-plus";

const service = axios.create({
    //baseURL: 'http://47.109.67.130:8081',
    baseURL: 'http://192.168.1.175:8089',
    timeout: 20000
})

service.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)
service.interceptors.response.use(
    response => {
        if (response.data.code === 0) {
            let data = response.data.data
            return Promise.resolve(data)
        } else {
            ElMessage.error(response.data.msg)
            return Promise.reject(response.data.msg)
        }
    },
    error => {
        // 对响应错误做点什么
        console.error('Response error:', error);
        if (error.response) {
            // 这里可以处理HTTP状态码异常的情况
            switch (error.response.status) {
                case 401:
                    // 未授权，跳转到登录页
                    ElMessage.error('未授权，请先登录')
                    break;
                case 403:
                    // 禁止访问
                    ElMessage.error('禁止访问')
                    break;
                case 404:
                    // 资源未找到
                    ElMessage.error('没有找到请求路径')
                    break;
                default:
                    console.error('Unhandled error:', error.response.status);
            }
        }
        return Promise.reject(error);
    }
);

export default service;
