import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
    meta: { title: '付生传' },
  },
  {
    path: '/police',
    component: () => import('../views/Letter.vue'),
    meta: { title: '给最爱的妹妹 - 兄妹情深' },
  },
  {
    path: '/police-letter',
    component: () => import('../views/PoliceLetter.vue'),
    meta: { title: 'To 曼臻 - 父亲给卧底女儿的信' },
  },
  {
    path: '/ticket',
    component: () => import('../views/Ticket.vue'),
    meta: { title: '登机牌 - MZH315航班' },
  },
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
