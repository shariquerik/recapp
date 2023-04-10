import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/daily',
  },
  {
    path: '/daily/:date?',
    name: 'Daily',
    component: () => import('@/pages/Daily.vue'),
  },
  {
    path: '/weekly/:date?',
    name: 'Weekly',
    component: () => import('@/pages/Weekly.vue'),
  },
]

let router = createRouter({
  history: createWebHistory('/recapp'),
  routes,
})

export default router
