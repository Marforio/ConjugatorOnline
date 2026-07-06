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
  { path: '/vocab-training', name: 'vocabworkout', component: VocabWorkout, meta: { requiresAuth: true} },
  { path: '/vocab-training/podium', name: 'vocab-arcade-podium', component: () => import('@/views/ArcadePodium.vue'), meta: { requiresAuth: true }  },
  { path: '/home', name: 'student-home', component: () => import('@/views/ToDoDash.vue'), meta: { requiresAuth: true } },
  { path: '/my-data', name: 'student-data', component: () => import('@/views/Dashboard.vue'), meta: { requiresAuth: true, studentsOnly: true } },
  { path: '/exercises', name: 'exercises', component: () => import('@/views/Exercises.vue'), meta: { requiresAuth: true } },
  { path: '/exercises/:errorCode', name: 'exercise-detail', component: () => import('@/views/ExerciseDetail.vue'), props: true , meta: { requiresAuth: true } },
  { path: '/games', name: 'games', component: () => import('@/views/games/Games.vue'), meta: { requiresAuth: false }},
  { path: '/games/pronoun-practice', name: 'pronoun-practice', component: () => import('@/views/games/PronounPracticeView.vue'), meta: { requiresAuth: false } },
  { path: '/games/comparison', name: 'comparison', component: () => import('@/views/games/ComparisonView.vue'), meta: { requiresAuth: false } },
  { path: '/games/idea-linker', name: 'idea-linker', component: () => import('@/views/games/IdeaLinkerView.vue'), meta: { requiresAuth: true }},
  { path: '/games/quantifier-quest', name: 'quantifier-quest', component: () => import('@/views/games/QuantifierQuestView.vue'), meta: { requiresAuth: true }},
  { path: '/games/verb-mixer', name: 'verb-mixer', component: () => import('@/views/games/VerbMixerView.vue'), meta: { requiresAuth: false } },
  { path: '/games/passive-party', name: 'passive-party', component: () => import('@/views/games/PassivePartyView.vue'), meta: { requiresAuth: false } },
  { path: '/games/tricky-translator', name: 'tricky-translator', component: () => import('@/views/games/TrickyTranslatorView.vue'), meta: { requiresAuth: true }},
  { path: '/games/regret-machine', name: 'regret-machine', component: () => import('@/views/games/RegretMachineView.vue'), meta: { requiresAuth: false } },
  { path: '/games/word-families', name: 'word-families', component: () => import('@/views/games/WordFamiliesView.vue'), meta: { requiresAuth: true }},
  { path: '/games/reported-speech', name: 'reported-speech', component: () => import('@/views/games/ReportedSpeechView.vue'), meta: { requiresAuth: false } },
  { path: '/games/year2040', name: 'year-2040', component: () => import('@/views/games/Year2040View.vue'), meta: { requiresAuth: false } },
  { path: '/games/parallel-universe', name: 'parallel-universe', component: () => import('@/views/games/ParallelUniverseView.vue'), meta: { requiresAuth: true }},
  { path: '/games/uses-of-auxiliaries', name: 'uses-of-auxiliaries', component: () => import('@/views/games/UsesOfAuxiliariesView.vue'), meta: { requiresAuth: false } },
  { path: '/tools', name: 'tools', component: () => import('@/views/Tools.vue'), meta: { requiresAuth: false } },
  { path: '/tools/meeting-machine', name: 'meeting-machine', component: () => import('@/views/tools/MeetingMachine.vue'), meta: { requiresAuth: false }},
  { path: '/tools/essay-creator', name: 'essay-creator', component: () => import('@/views/tools/EssayCreator.vue'), meta: { requiresAuth: false }},
  { path: '/tools/word-stats', name: 'word-stats', component: () => import('@/views/tools/WordStats.vue'), meta: { requiresAuth: false }},
  { path: '/tools/graph-generator', name: 'graph-generator', component: () => import('@/views/tools/GraphGenerator.vue'), meta: { requiresAuth: false }},
  { path: '/tools/numbers-workout', name: 'numbers-workout', component: () => import('@/views/tools/NumbersWorkout.vue'), meta: { requiresAuth: false }},
  { path: '/tools/market-masters', name: 'market-masters', component: () => import('@/views/tools/MarketMasters.vue'), meta: { requiresAuth: false }},
  { path: '/teacher-tools', name: 'teacher-tools', component: () => import('@/views/teacher_tools/TeacherTools.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher-tools/classroom-challenges', name: 'classroom-challenges', component: () => import('@/views/teacher_tools/ClassroomChallenges.vue'), meta: { requiresAuth: true, requiresAdmin: true }, props: (route: RouteLocationNormalized) => ({ game: route.query.game as string, student: route.query.student as string }) },
  { path: '/teacher-tools/graph-generator', name: 'graph-generator-teacher', component: () => import('@/views/teacher_tools/GraphGeneratorTeacher.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher-tools/market-masters-teacher', name: 'market-masters-teacher', component: () => import('@/views/teacher_tools/MarketMastersTeacher.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher', name: 'teacher', component: () => import('@/views/Teacher.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/manage-students', name: 'manage-students', component: () => import('@/views/ManageStudents.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/manage-work', name: 'manage-work', component: () => import('@/views/ManageWork.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/manage-feedback', name: 'manage-feedback', component: () => import('@/views/ManageFeedback.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/manage-error-data', name: 'manage-error-data', component: () => import('@/views/ManageErrorData.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/manage-achievement-data', name: 'manage-achievement-data', component: () => import('@/views/ManageAchievementData.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/conjugator-data', name: 'manage-conjugator-data', component: () => import('@/views/ManageConjugatorData.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/other-games-data', name: 'manage-other-games-data', component: () => import('@/views/ManageOtherGamesData.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/vocab-data', name: 'manage-vocab-data', component: () => import('@/views/ManageVocabData.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher/manage-vocab-lists', name: 'manage-vocab-lists', component: () => import('@/views/ManageVocabLists.vue'), meta: { requiresAuth: true, requiresAdmin: true } },

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