import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { nextTick, watch } from 'vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Conjugator from '@/views/Conjugator.vue'
import VocabWorkout from '@/views/VocabWorkout.vue'
import Admin from '@/views/Admin.vue'
import { path } from 'd3'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/admin', name: 'admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/conjugator', name: 'conjugator', component: Conjugator, meta: { requiresAuth: true }},
  { path: '/vocab-workout', name: 'vocabworkout', component: VocabWorkout, meta: { requiresAuth: true} },
  { path: '/dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue'), meta: { requiresAuth: true } },
  { path: '/exercises', name: 'exercises', component: () => import('@/views/Exercises.vue'), meta: { requiresAuth: true } },
  { path: '/exercises/:errorCode', name: 'exercise-detail', component: () => import('@/views/ExerciseDetail.vue'), props: true , meta: { requiresAuth: true } },
  { path: '/games', name: 'games', component: () => import('@/views/Games.vue')},
  { path: '/games/pronoun-practice', name: 'pronounpractice', component: () => import('@/views/PronounPractice.vue'), meta: { requiresAuth: true }},
  { path: '/games/comparison', name: 'comparison', component: () => import('@/views/Comparison.vue'), meta: { requiresAuth: true }},
  { path: '/games/idea-linker', name: 'idealinker', component: () => import('@/views/IdeaLinker.vue'), meta: { requiresAuth: true }},
  { path: '/games/quantifier-quest', name: 'quantifierquest', component: () => import('@/views/Quantifer.vue'), meta: { requiresAuth: true }},
  { path: '/games/verb-mixer', name: 'verbmixer', component: () => import('@/views/VerbMixer.vue'), meta: { requiresAuth: true }},
  { path: '/games/passive-party', name: 'passiveparty', component: () => import('@/views/PassiveMaker.vue'), meta: { requiresAuth: true }},
  { path: '/games/tricky-translator', name: 'trickytranslator', component: () => import('@/views/Translator.vue'), meta: { requiresAuth: true }},
  { path: '/games/regret-machine', name: 'regretmachine', component: () => import('@/views/RegretMachine.vue'), meta: { requiresAuth: true }},
  { path: '/games/word-families', name: 'wordfamilies', component: () => import('@/views/WordFamilies.vue'), meta: { requiresAuth: true }},
  { path: '/games/reported-speech', name: 'reportedspeech', component: () => import('@/views/ReportedSpeech.vue'), meta: { requiresAuth: true }},
  { path: '/games/year2040', name: 'year2040', component: () => import('@/views/Year2040.vue'), meta: { requiresAuth: true }},
  { path: '/games/parallel-universe', name: 'paralleluniverse', component: () => import('@/views/ParallelUniverse.vue'), meta: { requiresAuth: true }},
  { path: '/games/uses-of-auxiliaries', name: 'auxiliaryuses', component: () => import('@/views/UsesOfAuxiliaries.vue'), meta: { requiresAuth: true }},
  { path: '/tools', name: 'tools', component: () => import('@/views/Tools.vue') },
  { path: '/tools/meeting-machine', name: 'meeting-machine', component: () => import('@/views/MeetingMachine.vue')},
  { path: '/tools/essay-creator', name: 'essay-creator', component: () => import('@/views/EssayCreator.vue')},
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
