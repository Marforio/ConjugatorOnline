import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { nextTick } from 'vue'
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
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  await nextTick(); // ensure store is hydrated

  if (!to.meta.requiresAuth) return next(); // no auth needed

  // Try to validate session
  const valid = await auth.validateSession();

  if (valid) return next();

  // If refresh token exists, try silent recovery
  if (auth.refresh) {
    try {
      await auth.refreshAccessToken();
      const revalidated = await auth.validateSession();
      if (revalidated) return next();
    } catch {
      // Silent fail — fall through to redirect
    }
  }

  // Final fallback: redirect to login
  next({ name: "login", query: { redirect: to.fullPath } });
});



export default router
