import { createRouter, createWebHistory } from 'vue-router'
import process from '@/views/process/index.tsx'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/function/index.vue')
    },
    {
      path: '/flow_design',
      name: 'flow_design',
      component: process
    },
    {
      path: '/functions',
      name: 'functions',
      component: () => import('../views/function/index.vue')
    },
    {
      path: '/system',
      name: 'system',
      component: () => import('../views/system/index.vue')
    },
      {
      path: '/addFlow',
      name: 'addFlow',
      component: () => import('../views/flow/AddFlow.vue')
    },
  ]
})

export default router
