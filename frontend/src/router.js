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
]

let router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
