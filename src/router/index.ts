import { createRouter, createWebHashHistory } from 'vue-router'
import { useOpenIdStore } from '@/stores/openId'
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
    path: '/model/:a?/:b?',
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
  },


  {
    path: '/tp_home',
    component: () => import('../views/Tp_home/Home.vue'),
  },
  {
    path: '/tp_card',
    component: () => import('../views/Tp_card/card.vue'),
  },
  {
    path: '/vote',
    component: () => import('../views/vote/vote.vue'),
  },
  {
    path: '/vote_result',
    component: () => import('../views/vote_result/vote_result.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

// 全局前置守卫，设置页面标题 + 保持 openId 透传
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  const store = useOpenIdStore()
  // 优先从参数或 query 读 openId
  const queryOpenId = (to.query.openId as string) || ''
  const ensuredOpenId = store.initializeFromUrlOrStorage(queryOpenId)

  // 若路由上没有 openId，但本地存在，则追加到 query，以便分享/刷新时不丢失
  if (ensuredOpenId && !to.query.openId) {
    next({
      path: to.path,
      query: { ...to.query, openId: ensuredOpenId },
      hash: to.hash,
      replace: true,
    })
    return
  }

  next()
})

export default router
