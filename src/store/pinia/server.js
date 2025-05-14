import { defineStore } from 'pinia'

// 内嵌页面store、通过token登录来的页面暂存值（不限于内嵌、子应用、window.open打开）
export const useServerStore = defineStore('server', {
 // 静态数据
 state: () => ({
  server: {},
 }),
 // 相当于计算属性(有数据缓存)
 getters: {},
 // actions即可以是同步函数也可以是异步函数
 actions: {
  async fetchSeverInfo() {
   const response = await fetch('/static/config.json')
   const server = await response.json()
   console.log('server', server)
   this.server = server
  },
 },
 // 开启数据缓存
 persist: {
  enabled: true,
  strategies: [
   {
    storage: sessionStorage,
   },
  ],
 },
})
