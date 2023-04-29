import { session } from './data/session'
import { users } from './data/users'
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
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
  }
]

const router = createRouter({
  history: createWebHistory('/recapp'),
  routes,
})

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = session.isLoggedIn
  try {
    await users.promise
  } catch (error) {
    isLoggedIn = false
  }

  if (to.name === 'Login' && isLoggedIn) {
    next({ name: 'Daily' })
  } else if (to.name !== 'Login' && !isLoggedIn) {
    window.location.href = window.location.origin + '/login?redirect-to=/recapp'
  } else {
    next()
  }
})

export default router
