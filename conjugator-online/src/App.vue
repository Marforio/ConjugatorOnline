<template>
  <v-app class="app-pure-white-backdrop">
    
    <v-navigation-drawer
      v-if="!isImmersiveMode && auth.isLoggedIn"
      v-model="drawer"
      elevation="0"
      location="left"
      :permanent="lgAndUp"
      :temporary="!lgAndUp"
      :scrim="!lgAndUp"
      class="border-r border-slate-200 bg-white"
    >
      <div
        class="pa-4 d-flex align-center justify-space-between border-b bg-white"
        style="height: 64px;"
      >
        <div class="d-flex align-center select-none py-1">
          <div class="d-flex align-center mr-2 flex-shrink-0">
            <v-img
              :src="siteLogo"
              alt="Language Labs Logo"
              width="24"
              height="19"
              cover
            />
          </div>
          <span class="text-subtitle-1 font-weight-black tracking-wide text-slate-800">
            Language Labs
          </span>
        </div>

        <v-btn
          v-if="!lgAndUp"
          icon="mdi-close"
          variant="text"
          color="slate-600"
          @click.stop="drawer = false"
        />
      </div>

      <v-list nav density="comfortable" class="px-3 mt-3 bg-white">
        
        <template v-if="userStore.isStaff">
          
          <div class="text-overline font-weight-black text-slate-400 px-2 mb-1 tracking-wider">
            Teacher Panel
          </div>

          <v-list-item 
            :to="{ name: 'teacher' }" 
            prepend-icon="mdi-wifi" 
            title="Student Monitor" 
            rounded="lg" 
            color="deep-purple-accent-4" 
            @click="closeDrawerBelowLg" 
          />

          <v-list-item :to="{ name: 'manage-students' }" prepend-icon="mdi-account-cog" title="Manage Students" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'manage-work' }" prepend-icon="mdi-tray-full" title="Give Work" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'manage-feedback' }" prepend-icon="mdi-comment-quote" title="Give Feedback" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'manage-achievement-data' }" prepend-icon="mdi-trophy" title="Achievements" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'teacher-tools' }" prepend-icon="mdi-human-male-board" title="Classroom Tools" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'manage-error-data' }" prepend-icon="mdi-chart-line" title="Error Data" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'manage-conjugator-data' }" prepend-icon="mdi-chart-arc" title="Conjugator Data" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'manage-other-games-data' }" prepend-icon="mdi-chart-timeline" title="Other Games Data" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'manage-vocab-data' }" prepend-icon="mdi-chart-timeline-variant-shimmer" title="Vocabulary Data" rounded="lg" color="primary" @click="closeDrawerBelowLg" />

          <v-divider class="my-4 border-opacity-60" />

          <v-list-group value="studentPreview">
            <template #activator="{ props: groupProps }">
              <v-list-item
                v-bind="groupProps"
                prepend-icon="mdi-eye-outline"
                title="Student Pages"
                rounded="lg"
                class="text-slate-500 font-weight-medium"
              />
            </template>

            <div class="bg-slate-50 rounded-xl pa-1 mt-1 border border-dashed">
              <v-list-item :to="{ name: 'student-home' }" prepend-icon="mdi-home-account" title="Home View" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
              <v-list-item href="https://book.language-labs.ch" target="_blank" prepend-icon="mdi-book-open-page-variant" title="Grammar Book" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
              <v-list-item :to="{ name: 'vocabworkout' }" prepend-icon="mdi-cards-outline" title="Vocab Workout" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
              <v-list-item :to="{ name: 'exercises' }" prepend-icon="mdi-weight-lifter" title="Exercises" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
              <v-list-item :to="{ name: 'conjugator' }" prepend-icon="mdi-controller" title="Conjugator Game" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
              <v-list-item :to="{ name: 'games' }" prepend-icon="mdi-gamepad-circle" title="Other Games" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
              <v-list-item :to="{ name: 'tools' }" prepend-icon="mdi-tools" title="Tools" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
              <v-list-item :to="{ name: 'student-data' }" prepend-icon="mdi-chart-bar" title="My Data" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
              
            </div>
          </v-list-group>
        </template>

        <template v-else>
          <v-list-item :to="{ name: 'student-home' }" prepend-icon="mdi-home-account" title="Home" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item href="https://book.language-labs.ch" target="_blank" prepend-icon="mdi-book-open-page-variant" title="Grammar Book" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'exercises' }" prepend-icon="mdi-weight-lifter" title="Exercises" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'vocabworkout' }" prepend-icon="mdi-cards-outline" title="Vocab Workout" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'conjugator' }" prepend-icon="mdi-controller" title="Conjugator Game" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'games' }" prepend-icon="mdi-gamepad-circle" title="Other Games" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'tools' }" prepend-icon="mdi-tools" title="Tools" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          <v-list-item :to="{ name: 'student-data' }" prepend-icon="mdi-chart-bar" title="My Data" rounded="lg" color="primary" @click="closeDrawerBelowLg" />
          
        </template>

      </v-list>

      <template #append>
        <div class="pa-4 border-t d-flex align-center justify-space-between bg-white">
          <div class="d-flex align-center overflow-hidden">
            <v-avatar
              color="primary"
              size="32"
              class="ms-2 text-caption font-weight-bold text-white flex-shrink-0"
            >
              <InitialsText />
            </v-avatar>
            
          </div>
          <LogOutButton variant="text" density="comfortable" color="error" />
        </div>
      </template>
    </v-navigation-drawer>

    <button
      v-if="!isImmersiveMode && auth.isLoggedIn && !lgAndUp && !drawer"
      class="drawer-sliver-button"
      :class="{ 'drawer-sliver-button-xs': xs }"
      @click="drawer = true"
      aria-label="Open navigation menu"
      type="button"
    >
      <v-icon size="22" color="white">mdi-chevron-right</v-icon>
    </button>

    <v-app-bar
      v-if="isImmersiveMode"
      flat
      color="transparent"
      absolute
      class="immersive-game-header-overlay"
      style="z-index: 1005;"
    >
      <v-btn
        prepend-icon="mdi-arrow-left"
        color="slate-800"
        variant="elevated"
        elevation="2"
        class="rounded-pill ml-4 font-weight-black text-none bg-white border"
        @click="escapeToHub"
      >
        Exit Session
      </v-btn>
    </v-app-bar>

    <TopNavBar v-if="showNav" :drawer="drawer" @toggle-drawer="drawer = !drawer" />

    <v-main :class="{ 'immersive-mode-canvas-active': isImmersiveMode }">
      <v-container fluid class="pa-0 h-100 bg-white">
        <RouterView />
      </v-container>
    </v-main>

    <NotificationSnackbar />
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import TopNavBar from '@/components/TopNavBar.vue'
import NotificationSnackbar from '@/components/NotificationsSnackBar.vue'
import InitialsText from '@/components/InitialsText.vue'
import LogOutButton from '@/components/LogOutButton.vue'
import { useInactivityTimeout } from "@/composables/useInactivityTimeout"
import { useAuthStore } from './stores/auth'
import { useUserStore } from './stores/user'

const siteLogo = '/icons/logo3.png'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const userStore = useUserStore()

const { xs, smAndDown, mdAndUp, lgAndUp } = useDisplay()
const drawer = ref(false)

const isImmersiveMode = computed(() => {
  const deepFocusViews = [
    'conjugator', 'meeting-machine', 'pronounpractice', 'exercise-detail', 'vocabworkout', 
    'passiveparty', 'comparison', 'quantifierquest', 'idealinker', 'regretmachine', 
    'year2040', 'wordfamilies', 'auxiliaryuses', 'verbmixer', 'reportedspeech', 
    'paralleluniverse', 'trickytranslator'
  ]
  return deepFocusViews.includes(route.name || '')
})

const showNav = computed(() => {
  const name = route.name || ''
  return !isImmersiveMode.value && userStore.isStaff && name !== 'home' && name !== 'login' && mdAndUp.value
})

watch(
  lgAndUp,
  (isLgUp, oldIsLgUp) => {
    if (oldIsLgUp === undefined) {
      drawer.value = true
      return
    }
    if (isLgUp && !oldIsLgUp) {
      drawer.value = true
    }
  },
  { immediate: true }
)

function closeDrawerBelowLg() {
  if (!lgAndUp.value) {
    drawer.value = false
  }
}

function escapeToHub() {
  router.push({ name: userStore.isStaff ? 'teacher' : 'student-home' })
}

if (auth.isLoggedIn && !auth.isAccessTokenExpired()) {
  useInactivityTimeout()
}
</script>

<style scoped>
.app-pure-white-backdrop { background-color: #ffffff !important; }
:deep(.v-application__wrap) { background-color: #ffffff !important; }
.immersive-mode-canvas-active {
  padding-top: 0 !important;
  padding-left: 0 !important;
  background-color: #ffffff !important;
  background-image: radial-gradient(circle at 50% 30%, rgba(241,245,249,0.5) 0%, rgba(255,255,255,0) 70%);
}
.immersive-game-header-overlay { pointer-events: none; }
.immersive-game-header-overlay :deep(.v-btn) { pointer-events: auto; }
.drawer-sliver-button {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 24px;
  height: 120px;
  background: #2563eb;
  border: 0;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
  padding: 0;
}
.drawer-sliver-button-xs { left: 8px; width: 28px; height: 132px; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-600 { color: #475569; }
.border-slate-200 { border-color: #e2e8f0 !important; }

/* Micro-alignment overrides for the nested accordion layout values */
:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 12px !important;
  margin-bottom: 2px !important;
}
.bg-slate-50 {
  background-color: #f8fafc !important;
}
</style>