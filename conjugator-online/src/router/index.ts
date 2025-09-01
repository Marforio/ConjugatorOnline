import { createRouter, createWebHistory } from 'vue-router'
import { getAccessToken, getRefreshToken } from '@/services/auth'

import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Conjugator from '@/views/Conjugator.vue'
import Dashboard from '@/views/Dashboard.vue'
import Exercises from '@/views/Exercises.vue'
import Games from '@/views/Games.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/conjugator', name: 'conjugator', component: Conjugator, meta: { requiresAuth: true }},
  { path: '/dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue'), meta: { requiresAuth: true } },
  { path: '/exercises', name: 'exercises', component: () => import('@/views/Exercises.vue'), meta: { requiresAuth: true } },
  { path: '/games', name: 'games', component: () => import('@/views/Games.vue'), meta: { requiresAuth: true } },
  { path: '/exercises/:errorCode', name: 'exercise-detail', component: () => import('@/views/ExerciseDetail.vue'), meta: { requiresAuth: true } }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global auth guard
router.beforeEach((to, from, next) => {
  const access = getAccessToken()
  const refresh = getRefreshToken()

  if (to.meta.requiresAuth && (!access || !refresh)) {
    // Redirect unauthenticated users to login
    return next({ name: 'login' })
  }

  // Logged in or route doesn’t require auth
  next()
})

export default router
