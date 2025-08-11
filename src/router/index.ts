import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/home/Home.vue'),
 
  },
  {
    path: '/card',
    component: () => import('../views/card/card.vue'),
 
  },
  {
    path: '/model',
    component: () => import('../views/three/three.vue'),
  },
  {
    path: '/dan_model/:a?/:b?',
    component: () => import('@/views/three/dan_three.vue'),
  },
  {
    path: '/wait/:a?/:b?',
    component: () => import('@/views/wait/wait.vue'),
  },
  {
    path: '/winning',
    component: () => import('@/views/winning/winning.vue'),
  },
  {
    path: '/result/:a?/:b?',
    component: () => import('@/views/result/result.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 全局前置守卫，设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
