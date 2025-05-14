import Http from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '../auth'

export default (prefix, options = {}) =>
 Http.create({
  withCredentials: options.withCredentials || false,
  prefix,
  $message: error => {
   ElMessage({
    message: error.message,
    type: 'error',
    duration: 1 * 1000,
   })
  },
  tokenHandler(config) {
   let { headers, token } = config
   if (!token) {
    token = getToken()
   }
   headers = headers || {}
   // headers.Authorization = token;
   return { ...config, headers }
  },
  ...options,
 })
