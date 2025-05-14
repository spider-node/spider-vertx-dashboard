import { useServerStore } from '@/store/pinia/server'
import createHttp from './createHttp'
import { ElMessage } from 'element-plus'
const serverStore = useServerStore()
const prefix = localStorage.getItem('url')

// eslint-disable-next-line max-len
const spiderHttp = createHttp(
 serverStore.server.address || prefix || import.meta.env.VITE_SPIDER_SERVER
)
spiderHttp.interceptors.response.use(config => {
 console.log(config)
 if (config.data.code === 0) {
  let data = config.data.data

  return Promise.resolve(data)
 } else {
  ElMessage.error(config.data.msg)
  return Promise.reject(config.data.msg)
 }
})
export {spiderHttp}
