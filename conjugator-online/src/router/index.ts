import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { nextTick, watch } from 'vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Conjugator from '@/views/Conjugator.vue'
import VocabWorkout from '@/views/VocabWorkout.vue'
import Admin from '@/views/Admin.vue'
import { path } from 'd3'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notifications' 

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/admin', name: 'admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/conjugator', name: 'conjugator', component: Conjugator, meta: { requiresAuth: true }},
  { path: '/vocab-workout', name: 'vocabworkout', component: VocabWorkout, meta: { requiresAuth: true} },
  { path: '/dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue'), meta: { requiresAuth: true, studentsOnly: true } },
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
  { path: '/tools/word-stats', name: 'word-stats', component: () => import('@/views/WordStats.vue')},
  { path : '/teacher-tools', name: 'teacher-tools', component: () => import('@/views/TeacherTools.vue'),  meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/teacher-tools/classroom-challenges', name: 'classroom-challenges', component: () => import('@/views/ClassroomChallenges.vue'), meta: { requiresAuth: true, requiresAdmin: true }, props: (route: RouteLocationNormalized) => ({
      game: route.query.game as string,
      student: route.query.student as string,
    }), },
  { path : '/teacher-manage', name: 'teacher-manage', component: () => import('@/views/TeacherManage.vue'),  meta: { requiresAuth: true, requiresAdmin: true } },
  { path : '/teacher-manage/manage-workouts', name: 'manage-workouts', component: () => import('@/views/ManageWorkouts.vue'),  meta: { requiresAuth: true, requiresAdmin: true } },
  { path : '/teacher-manage/manage-feedback', name: 'manage-feedback', component: () => import('@/views/ManageFeedback.vue'),  meta: { requiresAuth: true, requiresAdmin: true } },
  { path : '/teacher-manage/manage-data', name: 'manage-data', component: () => import('@/views/ManageData.vue'),  meta: { requiresAuth: true, requiresAdmin: true } }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global auth guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const userStore = useUserStore();
  const notificationStore = useNotificationStore(); 

  // Wait for auth hydration before running checks
  if (!auth.isRestored) {
    const stop = watch(
      () => auth.isRestored,
      (ready: boolean) => {
        if (ready) {
          stop();
          next(to);
        }
      }
    );
    return;
  }

  if (!to.meta.requiresAuth) return next();

  // Ensure we have a valid session (token present + validated/refreshed)
  if (!auth.access) {
    const valid = await auth.validateSession();
    if (!valid) return next({ name: "login", query: { redirect: to.fullPath } });
  }

  // Only load user profile when route needs role checks
  if (to.meta.studentsOnly || to.meta.requiresAdmin) {
    await userStore.ensureUserLoaded(); // <-- implement in user store (below)
  }

  if (to.meta.studentsOnly && userStore.isStaff) {
    return next({ name: "home" }); // or teacher-tools/admin, your choice
  }

  // "requiresAdmin" probably means staff/admin in your app
  if (to.meta.requiresAdmin && !userStore.isStaff) {
    return next({ name: "home" });
  }

    // Check for notifications when navigating to key pages
  if (to.meta.checkNotifications && !userStore.isStaff) {
    checkNotificationsIfNeeded(notificationStore);
  }


  return next();
});


/**
 * Check for notifications if it's been more than 5 minutes since last check
 */
function checkNotificationsIfNeeded(notificationStore: any) {
  const lastCheck = notificationStore.lastChecked;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  if (!lastCheck || lastCheck < fiveMinutesAgo) {
    console.log('🔔 Router: Checking for notifications (5+ minutes since last check)');
    notificationStore.checkNow();
  } else {
    const timeSinceCheck = Math.floor((Date.now() - lastCheck.getTime()) / 1000);
    console.log(`🔔 Router: Skipping notification check (last checked ${timeSinceCheck}s ago)`);
  }
}


export default router
