import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { watch } from 'vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Conjugator from '@/views/Conjugator.vue'
import VocabWorkout from '@/views/VocabWorkout.vue'
import Admin from '@/views/Admin.vue'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notifications' 

const routes = [
  { path: '/', name: 'home', component: Home, meta: { requiresAuth: false } }, 
  { path: '/login', name: 'login', component: Login, meta: { requiresAuth: false } },
  { path: '/admin', name: 'admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/conjugator', name: 'conjugator', component: Conjugator, meta: { requiresAuth: true }},
  { path: '/vocab-workout', name: 'vocabworkout', component: VocabWorkout, meta: { requiresAuth: true} },
  { path: '/home', name: 'student-home', component: () => import('@/views/ToDoDash.vue'), meta: { requiresAuth: true } },
  { path: '/my-data', name: 'student-data', component: () => import('@/views/Dashboard.vue'), meta: { requiresAuth: true, studentsOnly: true } },
  { path: '/exercises', name: 'exercises', component: () => import('@/views/Exercises.vue'), meta: { requiresAuth: true } },
  { path: '/exercises/:errorCode', name: 'exercise-detail', component: () => import('@/views/ExerciseDetail.vue'), props: true , meta: { requiresAuth: true } },
  { path: '/games', name: 'games', component: () => import('@/views/Games.vue'), meta: { requiresAuth: false }},
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
  { path: '/tools', name: 'tools', component: () => import('@/views/Tools.vue'), meta: { requiresAuth: false } },
  { path: '/tools/meeting-machine', name: 'meeting-machine', component: () => import('@/views/MeetingMachine.vue'), meta: { requiresAuth: false }},
  { path: '/tools/essay-creator', name: 'essay-creator', component: () => import('@/views/EssayCreator.vue'), meta: { requiresAuth: false }},
  { path: '/tools/word-stats', name: 'word-stats', component: () => import('@/views/WordStats.vue'), meta: { requiresAuth: false }},
  { path: '/teacher-tools', name: 'teacher-tools', component: () => import('@/views/TeacherTools.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher-tools/classroom-challenges', name: 'classroom-challenges', component: () => import('@/views/ClassroomChallenges.vue'), meta: { requiresAuth: true, requiresAdmin: true }, props: (route: RouteLocationNormalized) => ({ game: route.query.game as string, student: route.query.student as string }) },
  { path: '/teacher', name: 'teacher', component: () => import('@/views/Teacher.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/manage-students', name: 'manage-students', component: () => import('@/views/ManageStudents.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/manage-workouts', name: 'manage-workouts', component: () => import('@/views/ManageWorkouts.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/manage-feedback', name: 'manage-feedback', component: () => import('@/views/ManageFeedback.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/manage-error-data', name: 'manage-error-data', component: () => import('@/views/ManageErrorData.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/manage-achievement-data', name: 'manage-achievement-data', component: () => import('@/views/ManageAchievementData.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/conjugator-data', name: 'manage-conjugator-data', component: () => import('@/views/ManageConjugatorData.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/other-games-data', name: 'manage-other-games-data', component: () => import('@/views/ManageOtherGamesData.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const userStore = useUserStore();
  const notificationStore = useNotificationStore(); 

  if (!auth.isRestored) {
    const stop = watch(
      () => auth.isRestored,
      (ready) => {
        if (ready) {
          stop();
          next(to);
        }
      }
    );
    return;
  }

  const requiresAuth = to.meta?.requiresAuth ?? false;
  const studentsOnly = to.meta?.studentsOnly ?? false;
  const requiresAdmin = to.meta?.requiresAdmin ?? false;

  // 🛡️ BACKGROUND HYDRATION: If logged in but on public page, hydrate user parameters silently
  if (auth.access && !userStore.isStaff) {
    userStore.ensureUserLoaded().catch(() => {});
  }

  if (!requiresAuth) {
    return next();
  }

  if (!auth.access) {
    const valid = await auth.validateSession();
    if (!valid) {
      if (to.name === 'login') return next();
      return next({ name: "login", query: { redirect: to.fullPath } });
    }
  }

  if (studentsOnly || requiresAdmin) {
    await userStore.ensureUserLoaded();
  }

  // 🎯 UPDATE THIS PIECE IN YOUR router.beforeEach:

  if (studentsOnly && userStore.isStaff) {
    // Allow staff members to view both the playground hub and the conjugation dashboard tabs!
    if (to.name === 'student-home' || to.name === 'student-data') {
      return next();
    }
    return next({ name: "student-home" });
  }

  if (requiresAdmin && !userStore.isStaff) {
    if (to.name === 'student-home') return next();
    return next({ name: "student-home" });
  }

  if (to.meta?.checkNotifications && !userStore.isStaff) {
    checkNotificationsIfNeeded(notificationStore);
  }

  return next();
});

function checkNotificationsIfNeeded(notificationStore: any) {
  const lastCheck = notificationStore.lastChecked;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  if (!lastCheck || lastCheck < fiveMinutesAgo) {
    notificationStore.checkNow();
  }
}

export default router;