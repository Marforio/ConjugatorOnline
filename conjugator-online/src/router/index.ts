import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { nextTick, watch } from 'vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Conjugator from '@/views/Conjugator.vue'
import Admin from '@/views/Admin.vue'
import { path } from 'd3'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/admin', name: 'admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/conjugator', name: 'conjugator', component: Conjugator, meta: { requiresAuth: true }},
  { path: '/dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue'), meta: { requiresAuth: true } },
  { path: '/exercises', name: 'exercises', component: () => import('@/views/Exercises.vue'), meta: { requiresAuth: true } },
  { path: '/games', name: 'games', component: () => import('@/views/Games.vue')},
  { path: '/games/pronoun-practice', name: 'pronounpractice', component: () => import('@/views/PronounPractice.vue'), meta: { requiresAuth: true }},
  { path: '/games/quantifier', name: 'quantifier', component: () => import('@/views/Quantifer.vue'), meta: { requiresAuth: true }},
  { path: '/games/verb-combinator', name: 'verbcombinator', component: () => import('@/views/VerbCombinator.vue'), meta: { requiresAuth: true }},
  { path: '/games/passive-maker', name: 'passivemaker', component: () => import('@/views/PassiveMaker.vue'), meta: { requiresAuth: true }},
  { path: '/games/translator', name: 'translator', component: () => import('@/views/Translator.vue'), meta: { requiresAuth: true }},
  { path: '/exercises/:errorCode', name: 'exercise-detail', component: () => import('@/views/ExerciseDetail.vue'), meta: { requiresAuth: true } }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global auth guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Wait for store hydration before running checks
  if (!auth.isRestored) {
    // Watch for hydration, then retry navigation
    const stop = watch(
      () => auth.isRestored,
      (ready: boolean) => {
        if (ready) {
          stop();
          next(to); // retry navigation once hydrated
        }
      }
    );
    return; // Prevent further guard execution
  }

  if (!to.meta.requiresAuth) return next(); // No auth needed

  // If we have an access token, proceed optimistically
  if (auth.access) return next();

  // Otherwise, validate session (runs refresh or logout as needed)
  const valid = await auth.validateSession();
  if (valid) return next();

  // Final fallback: redirect to login
  next({ name: "login", query: { redirect: to.fullPath } });
});



export default router
