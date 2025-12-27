import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
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
  { path: '/games/quantifier-quest', name: 'quantifierquest', component: () => import('@/views/Quantifer.vue'), meta: { requiresAuth: true }},
  { path: '/games/verb-mixer', name: 'verbmixer', component: () => import('@/views/VerbCombinator.vue'), meta: { requiresAuth: true }},
  { path: '/games/passive-party', name: 'passiveparty', component: () => import('@/views/PassiveMaker.vue'), meta: { requiresAuth: true }},
  { path: '/games/tricky-translator', name: 'trickytranslator', component: () => import('@/views/Translator.vue'), meta: { requiresAuth: true }},
  { path: '/exercises/:errorCode', name: 'exercise-detail', component: () => import('@/views/ExerciseDetail.vue'), props: true , meta: { requiresAuth: true } },
  { path: '/tools', name: 'tools', component: () => import('@/views/Tools.vue') },
  { path: '/tools/meeting-machine', name: 'meeting-machine', component: () => import('@/views/MeetingMachine.vue')},
  { path : '/teacher-tools', name: 'teacher-tools', component: () => import('@/views/TeacherTools.vue'),  meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher-tools/classroom-challenges', name: 'classroom-challenges', component: () => import('@/views/ClassroomChallenges.vue'), meta: { requiresAuth: true, requiresAdmin: true }, props: (route: RouteLocationNormalized) => ({
      game: route.query.game as string,
      student: route.query.student as string,
    }), }
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
