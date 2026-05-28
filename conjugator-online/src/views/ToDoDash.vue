<template>
  <v-container fluid class="pa-6 dashboard-bg" :class="userStore.isStaff ? 'mt-0' : 'mt-4'">
    
    <!-- Welcome Banner with a calm, soft gradient -->
    <v-card class="pa-6 mb-6 welcome-banner" elevation="1" rounded="xl">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4">
        <div>
          <div class="text-h4 font-weight-bold text-slate-900">
            Welcome back, {{ userStore.student?.initials || 'Student' }}!
          </div>
          <div class="text-subtitle-1 text-slate-600 mt-1">
            Here is a look at your recent progress and what you can practice today.
          </div>
        </div>
        <v-avatar color="indigo-lighten-5" size="56">
          <v-icon size="32" color="indigo-darken-1">mdi-hand-wave-outline</v-icon>
        </v-avatar>
      </div>
    </v-card>

    <!-- Main 2-Column Desktop Grid -->
    <v-row>
      
      <!-- LEFT COLUMN: Recent Progress Timeline (Unchanged feature, styled softly) -->
      <v-col cols="12" md="4">
        <v-card class="display-card pb-4" elevation="1" rounded="lg">
          <div class="pa-5 border-b bg-slate-50">
            <div class="text-h6 font-weight-bold text-slate-800 d-flex align-center">
              <v-icon class="mr-2" color="slate-500">mdi-text-time</v-icon>
              Latest Activity
            </div>
          </div>
          
          <div class="pa-4 activity-scroll-area">
            <div v-if="loadingActivity" class="text-center pa-8">
              <v-progress-circular indeterminate color="indigo-lighten-1" />
              <div class="text-caption text-slate-500 mt-2">Updating your history...</div>
            </div>

            <template v-else-if="activityFeed.length > 0">
              <!-- Filter chips styled with softer default borders -->
              <v-chip-group v-model="activityFilter" column class="mb-4" @update:model-value="fetchActivityFeed">
                <v-chip size="small" variant="text" class="border" value="all">All</v-chip>
                <v-chip size="small" variant="text" class="border" value="conjugation" :prepend-icon="getActivityIcon('conjugation')">Verbs</v-chip>
                <v-chip size="small" variant="text" class="border" value="other_game" :prepend-icon="getActivityIcon('other_game')">Games</v-chip>
                <v-chip size="small" variant="text" class="border" value="exercise" :prepend-icon="getActivityIcon('exercise')">Exercises</v-chip>
              </v-chip-group>

              <v-timeline density="compact" align="start" class="pl-2">
                <v-timeline-item
                  v-for="(activity, index) in activityFeed"
                  :key="index"
                  :dot-color="getActivityColor(activity.type)"
                  size="x-small"
                >
                  <div class="activity-box pa-3 rounded-lg border bg-white">
                    <div class="text-body-2 font-weight-bold text-slate-800">{{ activity.title }}</div>
                    <div class="text-caption text-slate-600 mt-1">{{ activity.description }}</div>
                    <div class="text-caption text-slate-400 mt-2 d-flex align-center">
                      <v-icon size="12" class="mr-1">mdi-clock-outline</v-icon>
                      {{ formatActivityTime(activity.timestamp) }}
                    </div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </template>

            <div v-else class="text-center pa-8 text-slate-400">
              <v-icon size="48" class="mb-2">mdi-calendar-blank</v-icon>
              <div class="text-body-2">No practice logs found this week.</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN: Active Hub (Tabs replace the aggressive scroll jumps) -->
      <v-col cols="12" md="8">
        
        <!-- Summary Quick-Launch Banner Status Controls -->
        <v-row class="mb-4" dense>
          <v-col cols="12" sm="6">
            <v-card variant="flat" class="pa-4 bg-sage border rounded-xl d-flex align-center ga-3" @click="activeTab = 0" style="cursor: pointer;">
              <v-avatar color="teal-lighten-5" size="40">
                <v-icon color="teal-darken-1">mdi-clipboard-text-clock</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-slate-500 font-weight-medium">Your work</div>
                <div class="text-body-1 font-weight-black text-slate-800">
                  You have {{ pendingCount }} assignments • {{ completedCount }} finished
                </div>
              </div>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6">
            <v-card variant="flat" class="pa-4 bg-sand border rounded-xl d-flex align-center ga-3" @click="activeTab = 2" style="cursor: pointer;">
              <v-avatar color="amber-lighten-5" size="40">
                <v-icon color="amber-darken-2">mdi-account-circle-outline</v-icon>
              </v-avatar>
              <div>
                <div class="text-caption text-slate-500 font-weight-medium">Linguistic Profile</div>
                <div class="text-body-1 font-weight-black text-slate-800">
                  {{ userStore.hasLinguisticProfile ? 'View Your Profile' : 'Awaiting Assessment' }}
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

                <!-- Dynamic Control Area -->
        <v-card class="display-card" elevation="1" rounded="lg">
          <v-tabs v-model="activeTab" color="indigo-darken-1" align-tabs="start" class="border-b bg-slate-50">
            <v-tab :value="0" class="text-none font-weight-bold">
              <v-icon start>mdi-account-clock</v-icon>
              Pending
            </v-tab>
            <v-tab :value="1" class="text-none font-weight-bold">
              <v-icon start>mdi-check-all</v-icon>
              Completed
            </v-tab>
            <v-tab :value="2" class="text-none font-weight-bold">
              <v-icon start>mdi-badge-account-outline</v-icon>
              My Language Profile
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="pa-5">
            
            <!-- TAB 0: Pending Homework & Practice Workouts -->
            <v-window-item :value="0">
              <div v-if="loading" class="text-center py-10">
                <v-progress-circular indeterminate color="indigo" />
                <div class="text-body-2 text-slate-500 mt-2">Syncing...</div>
              </div>

              <!-- Suggestion layout state if no assignments are pending -->
              <div v-else-if="pendingCount === 0" class="text-center py-8 px-4 border rounded-xl bg-slate-50">
                <v-avatar color="indigo-lighten-5" size="64" class="mb-3">
                  <v-icon color="indigo-darken-2" size="36">mdi-creation-outline</v-icon>
                </v-avatar>
                <div class="text-h6 font-weight-bold text-slate-800">You have no assignments</div>
                <div class="text-body-2 text-slate-600 max-w-sm mx-auto mt-1 mb-5">
                  There are no assignments for you at the moment.
                </div>
                <div class="d-flex justify-center flex-wrap ga-3">
                  <v-btn color="indigo-darken-1" variant="flat" rounded="lg" class="text-none font-weight-bold" @click="goToGamesHub">
                    Play Grammar Games
                  </v-btn>
                  <v-btn color="slate-700" variant="outlined" rounded="lg" class="text-none font-weight-bold" @click="goToVocabWorkout">
                    Review Vocabulary
                  </v-btn>
                </div>
              </div>

              <!-- Standard View if tasks are pending -->
              <div v-else class="ga-5 d-flex flex-column">
                
                <!-- Section 1: Teacher's Workout Drills -->
                <div v-if="currentWorkout" class="border rounded-xl pa-4 bg-white">
                  <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-3">
                    <div>
                      <div class="text-subtitle-1 font-weight-bold text-slate-900">Current Assigned Practice Drill</div>
                      <div class="text-caption text-slate-500">Focus: {{ currentWorkout.focus_area || 'General Practice' }}</div>
                    </div>
                    <v-chip size="small" :color="workoutProgressColor" variant="flat" class="text-white font-weight-bold">
                      {{ workoutCompletionPercentage }}% Done
                    </v-chip>
                  </div>

                  <v-alert v-if="currentWorkout.notes" type="info" variant="tonal" density="compact" class="mb-4 rounded-lg bg-blue-lighten-5 border-0">
                    <span class="text-caption text-slate-700"><strong>Teacher Message:</strong> {{ currentWorkout.notes }}</span>
                  </v-alert>

                  <!-- Grouping Pending Drills compactly -->
                  <div class="ga-2 d-flex flex-column">
                    <div v-for="drill in [...inProgressDrills, ...notStartedDrills]" :key="drill.id" class="d-flex align-center justify-space-between pa-3 rounded-lg border bg-slate-50">
                      <div class="d-flex align-center ga-3 min-width-0">
                        <v-icon size="18" :color="drill.completed_sessions > 0 ? 'warning' : 'slate-400'">
                          {{ drill.completed_sessions > 0 ? 'mdi-clock-outline' : 'mdi-circle-outline' }}
                        </v-icon>
                        <div class="text-truncate">
                          <div class="text-body-2 font-weight-bold text-slate-800 text-truncate">{{ drill.name }}</div>
                          <div class="text-caption text-slate-500">{{ drill.completed_sessions }} of {{ drill.target_sessions || 1 }} sessions checked off</div>
                        </div>
                      </div>
                      <v-chip size="x-small" variant="outlined" class="ml-2 font-weight-medium text-slate-600">{{ drill.type }}</v-chip>
                    </div>
                  </div>
                </div>

                <!-- Section 2: Unified Homework List -->
                <div>
                  <div class="text-subtitle-2 font-weight-bold text-slate-500 uppercase tracking-wider mb-2">What you can work on right now <v-icon size="18" color="slate-400">mdi-arrow-down-right-bold</v-icon></div>
                  <v-list density="compact" class="pa-0 border rounded-xl overflow-hidden bg-white">
                    
                    <!-- Vocabulary entries loop -->
                    <v-list-item v-for="item in vocabPendingAssignments" :key="item.assignment_id" class="border-b py-2 pr-4" @click="goToVocabWorkout">
                      <template v-slot:prepend><v-icon color="teal-lighten-2" class="mr-1">mdi-cards-outline</v-icon></template>
                      <v-list-item-title class="text-body-2 font-weight-medium text-slate-800">{{ item.description }}</v-list-item-title>
                      <v-list-item-subtitle class="text-caption text-slate-400">Assigned {{ formatDate(item.created_at) }}</v-list-item-subtitle>
                      <template v-slot:append><v-chip size="x-small" color="teal-lighten-4" variant="flat" class="text-teal-darken-3 font-weight-bold">Vocab</v-chip></template>
                    </v-list-item>

                    <!-- Conjugation entries loop -->
                    <v-list-item v-for="item in conjugationPendingAssignments" :key="item.assignment_id" class="border-b py-2 pr-4" @click="goToConjugator">
                      <template v-slot:prepend><v-icon color="indigo-lighten-2" class="mr-1">mdi-controller-classic</v-icon></template>
                      <v-list-item-title class="text-body-2 font-weight-medium text-slate-800">{{ item.description }}</v-list-item-title>
                      <v-list-item-subtitle class="text-caption text-slate-400">Assigned {{ formatDate(item.created_at) }}</v-list-item-subtitle>
                      <template v-slot:append><v-chip size="x-small" color="indigo-lighten-4" variant="flat" class="text-indigo-darken-3 font-weight-bold">Verbs</v-chip></template>
                    </v-list-item>

                    <!-- Mini Games entries loop -->
                    <v-list-item v-for="item in gamesPendingAssignments" :key="item.assignment_id" class="border-b py-2 pr-4" @click="goToGameFromAssignment(item)">
                      <template v-slot:prepend><v-icon color="purple-lighten-2" class="mr-1">mdi-gamepad-circle</v-icon></template>
                      <v-list-item-title class="text-body-2 font-weight-medium text-slate-800">{{ item.description }}</v-list-item-title>
                      <v-list-item-subtitle class="text-caption text-slate-400">Assigned {{ formatDate(item.created_at) }}</v-list-item-subtitle>
                      <template v-slot:append><v-chip size="x-small" color="purple-lighten-4" variant="flat" class="text-purple-darken-3 font-weight-bold">Game</v-chip></template>
                    </v-list-item>

                    <!-- Understand Errors entries loop -->
                    <v-list-item v-for="item in exercisePendingAssignments" :key="item.assignment_id" class="border-b py-2 pr-4" @click="goToExerciseDetail(item.trigger_key)">
                      <template v-slot:prepend><v-icon color="orange-lighten-2" class="mr-1">mdi-book-weight-lifter</v-icon></template>
                      <v-list-item-title class="text-body-2 font-weight-medium text-slate-800">{{ item.description }}</v-list-item-title>
                      <v-list-item-subtitle class="text-caption text-slate-400">Error profile review link: {{ item.trigger_key }}</v-list-item-subtitle>
                      <template v-slot:append><v-chip size="x-small" color="orange-lighten-4" variant="flat" class="text-orange-darken-3 font-weight-bold">Review</v-chip></template>
                    </v-list-item>
                  </v-list>
                </div>
              </div>
            </v-window-item>

            <!-- TAB 1: Completed Tasks & Workouts History (Suggesion Applied: Always visible here) -->
            <v-window-item :value="1">
              <div v-if="completedCount === 0" class="text-center py-10 text-slate-400">
                <v-icon size="48" class="mb-2">mdi-check-circle-outline</v-icon>
                <div class="text-body-2">You haven't completed any tasks yet this term.</div>
                <div class="text-caption">Finish an item from your pending list to see it here!</div>
              </div>
              
              <div v-else class="ga-4 d-flex flex-column">
                <div>
                  <div class="text-subtitle-2 font-weight-bold text-slate-500 uppercase tracking-wider mb-2">Your completed assignements: Nice work!</div>
                  <v-list density="compact" class="pa-0 border rounded-xl overflow-hidden bg-white">
                    <v-list-item 
                      v-for="item in [...vocabCompletedAssignments, ...conjugationCompletedAssignments, ...gamesCompletedAssignments, ...exerciseCompletedAssignments]" 
                      :key="item.assignment_id"
                      class="border-b py-3 px-4 bg-slate-50"
                    >
                      <template v-slot:prepend>
                        <v-icon color="success" class="mr-2">mdi-checkbox-marked-circle</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2 font-weight-medium text-slate-700 text-decoration-line-through">
                        {{ item.description }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-caption text-slate-400 mt-0.5">
                        Completed successfully {{ formatDate(item.completed_at) }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </div>
              </div>
            </v-window-item>

            <!-- TAB 2: Main Linguistic Profile Window -->
            <v-window-item :value="2">
              <div class="py-2">
                <LinguisticProfileEmbedded />
              </div>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from "@/stores/user";
import api from '@/axios';
import { useRouter } from "vue-router";
import LinguisticProfileEmbedded from '@/components/LinguisticProfileEmbedded.vue';

const userStore = useUserStore();
const router = useRouter();

// Tab selector logic pointer (0 = Tasks list view, 1 = Embedded profile breakdown view)
const activeTab = ref(0);

// Existing state declarations preserved
const loading = ref(true);
const error = ref<string | null>(null);
const allAssignments = ref<Assignment[]>([]);
const loadingActivity = ref(true);
const activityFeed = ref<ActivityItem[]>([]);
const currentWorkout = ref<Workout | null>(null);
const activityFilter = ref<string>('all');

interface Assignment {
  assignment_id: string;
  task_type: 'achievement' | 'exercise';
  trigger_key: string;
  description: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  completed_at: string | null;
  deadline: string | null;
  manually_created: boolean;
  required_sessions: number;
  min_days_between_sessions: number;
  spaced_progress: number;
  spaced_required: number;
}

interface ActivityItem {
  type: 'conjugation' | 'game' | 'exercise' | 'vocab' | 'vocab_workout' | 'feedback' | 'profile_update' | 'assignment' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
}

interface WorkoutDrill {
  id?: number;
  type: 'pronunciation' | 'conjugation' | 'vocabulary' | 'grammar' | 'fluency' | 'listening' | 'other';
  name: string;
  description: string;
  target_reps?: number | null;
  target_sessions?: number | null;
  completed_sessions: number;
  notes: string;
  question_url?: string;
}

interface Workout {
  id: number;
  student: number;
  student_initials: string;
  created_at: string;
  updated_at: string;
  is_current: boolean;
  focus_area: string;
  notes: string;
  drills: WorkoutDrill[];
}

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    'conjugation': 'mdi-controller',
    'other_game': 'mdi-gamepad-variant',
    'exercise': 'mdi-weight-lifter',
    'vocab_workout': 'mdi-cards-outline',
    'achievement': 'mdi-trophy',
    'workout_drill': 'mdi-clipboard-check',
    'feedback': 'mdi-comment-alert',
    'profile_update': 'mdi-account-voice',
  };
  return icons[type] || 'mdi-circle';
}

function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    'conjugation': 'blue-lighten-2',
    'other_game': 'purple-lighten-2',
    'exercise': 'orange-lighten-2',
    'vocab_workout': 'teal-lighten-2',
    'achievement': 'amber-lighten-1',
  };
  return colors[type] || 'slate-300';
}

function getActivityLabel(type: string): string {
  const labels: Record<string, string> = {
    'conjugation': 'Conjugation',
    'other_game': 'Game',
    'exercise': 'Exercise',
    'vocab_workout': 'Vocabulary',
    'achievement': 'Achievement',
    'workout_drill': 'Drill',
    'feedback': 'Feedback',
    'profile_update': 'Profile',
  };
  return labels[type] || type;
}

function formatActivityTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

async function fetchActivityFeed() {
  loadingActivity.value = true;
  try {
    const params: any = { days: 90 };
    if (userStore.isStaff) {
      params.student = userStore.studentId; 
    }
    if (activityFilter.value && activityFilter.value !== 'all') {
      params.type = activityFilter.value;
    }

    const response = await api.get('/student-activities/', { params });
    const rawData = response.data && typeof response.data === 'object' && 'results' in response.data 
      ? response.data.results 
      : response.data;

    if (Array.isArray(rawData)) {
      const targetFeed = userStore.isStaff && userStore.student
        ? rawData.filter((act: any) => act.student === userStore.studentId || act.student_initials === userStore.student?.initials)
        : rawData;

      activityFeed.value = targetFeed.map((activity: any) => ({
        type: activity.activity_type, 
        title: activity.activity_name || getActivityLabel(activity.activity_type),
        description: activity.description || 'Activity session updated successfully.',
        timestamp: activity.timestamp,
      }));
    } else {
      activityFeed.value = [];
    }
  } catch (err) {
    console.error('Error fetching activity feed:', err);
    activityFeed.value = [];
  } finally {
    loadingActivity.value = false;
  }
}

async function fetchAssignments() {
  loading.value = true;
  try {
    const params: any = {};
    if (userStore.isStaff) {
      params.student = userStore.studentId; 
    }
    const response = await api.get('/assignment/', { params });
    const dataPayload = response.data && typeof response.data === 'object' && 'results' in response.data
      ? response.data.results
      : response.data;

    allAssignments.value = Array.isArray(dataPayload) ? dataPayload : [];
  } catch (err) {
    console.error('Assignments fetch failure:', err);
    allAssignments.value = [];
  } finally {
    loading.value = false;
  }
}

function goToRouteName(name: string, params?: Record<string, any>) {
  router.push({ name, params }).catch(() => {});
}

function goToExerciseDetail(errorCode: string) {
  if (!errorCode) return;
  goToRouteName("exercise-detail", { errorCode });
}

function goToVocabWorkout() { goToRouteName("vocabworkout"); }
function goToConjugator() { goToRouteName("conjugator"); }
function goToGamesHub() { goToRouteName("games"); }

const GAME_ROUTE_HINTS = [
  { routeName: "pronounpractice", keywords: ["pronoun practice", "pronouns"] },
  { routeName: "comparison", keywords: ["comparison", "comparatives", "superlatives"] },
  { routeName: "idealinker", keywords: ["idea linker", "idea-linker"] },
  { routeName: "quantifierquest", keywords: ["quantifier quest", "quantifier-quest", "quantifiers"] },
  { routeName: "verbmixer", keywords: ["verb mixer", "verb-mixer"] },
  { routeName: "passiveparty", keywords: ["passive party", "passive-party", "passive"] },
  { routeName: "trickytranslator", keywords: ["tricky translator", "tricky-translator", "translator"] },
  { routeName: "regretmachine", keywords: ["regret machine", "regret-machine", "regrets"] },
  { routeName: "wordfamilies", keywords: ["word families", "word-families"] },
  { routeName: "reportedspeech", keywords: ["reported speech", "reported-speech"] },
  { routeName: "year2040", keywords: ["year 2040", "2040"] },
  { routeName: "paralleluniverse", keywords: ["parallel universe", "parallel-universe"] },
  { routeName: "auxiliaryuses", keywords: ["uses of auxiliaries", "auxiliaries"] },
];

function inferGameRouteNameFromText(text: string | null | undefined): string | null {
  const t = String(text ?? "").toLowerCase();
  if (!t) return null;
  for (const entry of GAME_ROUTE_HINTS) {
    if (entry.keywords.some((k) => t.includes(k))) return entry.routeName;
  }
  return null;
}

function goToGameFromAssignment(assignment: any) {
  const routeName = inferGameRouteNameFromText(assignment?.description);
  if (routeName) goToRouteName(routeName);
  else goToGamesHub();
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Computeds for matching types and categories mapping filters cleanly
const vocabAssignments = computed(() => allAssignments.value.filter(a => a.task_type === 'achievement' && a.trigger_key.includes('vw_write_complete')));
const vocabPendingAssignments = computed(() => vocabAssignments.value.filter(a => a.status === 'pending'));
const vocabCompletedAssignments = computed(() => vocabAssignments.value.filter(a => a.status === 'completed'));

const exerciseAssignments = computed(() => allAssignments.value.filter(a => a.task_type === 'exercise'));
const exercisePendingAssignments = computed(() => exerciseAssignments.value.filter(a => a.status === 'pending'));
const exerciseCompletedAssignments = computed(() => exerciseAssignments.value.filter(a => a.status === 'completed'));

const conjugationAssignments = computed(() => allAssignments.value.filter(a => a.task_type === 'achievement' && (a.trigger_key.includes('correct_prompts') || a.trigger_key.includes('health_tier') || a.trigger_key.includes('discovery') || a.trigger_key.includes('mastery'))));
// Helper function to extract numeric targets from text labels (e.g., "500", "750")
function extractNumberFromText(text: string): number {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

// 🌟 REWORKED: Smart "Next-In-Line" Pending Conjugation Assignments
const conjugationPendingAssignments = computed(() => {
  const rawPending = conjugationAssignments.value.filter(a => a.status === 'pending');
  
  // Group related milestones by checking common phrases in their text descriptions
  const groups: Record<string, Assignment[]> = {
    prompts: [],   // For "Answer X conjugation prompts..."
    basic75: [],   // For "all Basic 75 irregular verbs..."
    master110: [], // For "all Master 110 irregular verbs..."
    allIrreg: [],  // For "all irregular verbs..."
    health: []     // For "Reach X tier... in conjugation health"
  };

  rawPending.forEach(a => {
    const desc = a.description.toLowerCase();
    if (desc.includes('prompts')) groups.prompts.push(a);
    else if (desc.includes('basic 75')) groups.basic75.push(a);
    else if (desc.includes('master 110')) groups.master110.push(a);
    else if (desc.includes('all irregular verbs')) groups.allIrreg.push(a);
    else if (desc.includes('health')) groups.health.push(a);
    else groups.prompts.push(a); // Fallback bucket
  });

  const nextInLine: Assignment[] = [];

  // 1. Sort prompts by the lowest target number (500 -> 750 -> 1000) and pick the first one
  if (groups.prompts.length) {
    groups.prompts.sort((a, b) => extractNumberFromText(a.description) - extractNumberFromText(b.description));
    nextInLine.push(groups.prompts[0]);
  }

  // 2. Conjugation Health Tiers: Sort by target values (30 -> 40 -> 50) and pick the first one
  if (groups.health.length) {
    groups.health.sort((a, b) => extractNumberFromText(a.description) - extractNumberFromText(b.description));
    nextInLine.push(groups.health[0]);
  }

  // 3. Verb Lists Progression (Discover must happen before Master)
  const processVerbListGroup = (list: Assignment[]) => {
    if (!list.length) return;
    const discoverTasks = list.filter(a => a.description.toLowerCase().includes('discover'));
    const masterTasks = list.filter(a => a.description.toLowerCase().includes('master'));

    // If there is an unfinished "Discover" task for a tense, show that first. Otherwise show "Master".
    if (discoverTasks.length) {
      nextInLine.push(discoverTasks[0]); 
    } else if (masterTasks.length) {
      nextInLine.push(masterTasks[0]);
    }
  };

  processVerbListGroup(groups.basic75);
  processVerbListGroup(groups.master110);
  processVerbListGroup(groups.allIrreg);

  return nextInLine;
});
const conjugationCompletedAssignments = computed(() => conjugationAssignments.value.filter(a => a.status === 'completed'));

const gamesAssignments = computed(() => allAssignments.value.filter(a => a.task_type === 'achievement' && !a.trigger_key.includes('vw_write_complete') && !a.trigger_key.includes('correct_prompts') && !a.trigger_key.includes('health_tier') && !a.trigger_key.includes('discovery') && !a.trigger_key.includes('mastery')));
const gamesPendingAssignments = computed(() => {
  const rawPending = gamesAssignments.value.filter(a => a.status === 'pending');
  
  // Group matching milestones together by looking at common words
  const grouped: Record<string, Assignment[]> = {};
  rawPending.forEach(a => {
    // Uses the first three words of the task description as a unique key structure
    const baseGroupKey = a.description.split(' ').slice(0, 3).join('_').toLowerCase();
    if (!grouped[baseGroupKey]) grouped[baseGroupKey] = [];
    grouped[baseGroupKey].push(a);
  });

  const nextInLine: Assignment[] = [];
  Object.values(grouped).forEach(group => {
    // Sort milestones with numbers ascendingly and pick only the closest target step
    group.sort((a, b) => extractNumberFromText(a.description) - extractNumberFromText(b.description));
    nextInLine.push(group[0]);
  });

  return nextInLine;
});
const gamesCompletedAssignments = computed(() => gamesAssignments.value.filter(a => a.status === 'completed'));

const completedCount = computed(() => allAssignments.value.filter(a => a.status === 'completed').length);
const pendingCount = computed(() => allAssignments.value.filter(a => a.status === 'pending').length);

const completedDrills = computed(() => {
  if (!currentWorkout.value?.drills) return [];
  return currentWorkout.value.drills.filter(d => d.completed_sessions >= (d.target_sessions ?? 0) && (d.target_sessions ?? 0) > 0);
});
const inProgressDrills = computed(() => {
  if (!currentWorkout.value?.drills) return [];
  return currentWorkout.value.drills.filter(d => d.completed_sessions > 0 && d.completed_sessions < (d.target_sessions ?? 0));
});
const notStartedDrills = computed(() => {
  if (!currentWorkout.value?.drills) return [];
  return currentWorkout.value.drills.filter(d => d.completed_sessions === 0);
});

const workoutCompletionPercentage = computed(() => {
  if (!currentWorkout.value?.drills?.length) return 0;
  const totalSessions = currentWorkout.value.drills.reduce((sum, d) => sum + (d.target_sessions || 0), 0);
  if (totalSessions === 0) return 0;
  const completedSessions = currentWorkout.value.drills.reduce((sum, d) => sum + d.completed_sessions, 0);
  return Math.round((completedSessions / totalSessions) * 100);
});

const workoutProgressColor = computed(() => {
  const p = workoutCompletionPercentage.value;
  if (p >= 75) return 'teal-lighten-1';
  if (p >= 40) return 'amber-lighten-1';
  return 'blue-grey-lighten-2';
});

async function fetchCurrentWorkout() {
  try {
    if (userStore.isStaff) {
      await userStore.fetchCurrentWorkout({ user_id: userStore.user?.id });
    } else {
      await userStore.fetchCurrentWorkout();
    }
    currentWorkout.value = userStore.currentWorkout;
  } catch (error) {
    console.error('Failed to fetch workout:', error);
  }
}

onMounted(async () => {
  await fetchAssignments();
  await userStore.fetchLinguisticProfile();
  await fetchActivityFeed();
  await fetchCurrentWorkout();
});
</script>

<style scoped>
.dashboard-bg {
  background-color: #fdfdfd;
}

/* Softer welcome message layout card background */
.welcome-banner {
  background: linear-gradient(135deg, #f1f4f9 0%, #e5ecf6 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.display-card {
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
}

/* natural scroll limits for history without jumping elements */
.activity-scroll-area {
  max-height: 600px;
  overflow-y: auto;
}

.activity-box {
  background-color: #ffffff;
  border-color: #f1f5f9 !important;
  transition: background-color 0.2s;
}

.activity-box:hover {
  background-color: #f8fafc;
}

/* Softer card blocks replacing old purple/yellow layouts */
.bg-sage {
  background-color: #f2f8f6 !important;
  border-color: #e2f0ec !important;
}
.bg-sand {
  background-color: #fbf8f3 !important;
  border-color: #f4ece1 !important;
}

.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-600 { color: #475569; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-50 { background-color: #f8fafc !important; }
.border-b { border-bottom: 1px solid #e2e8f0 !important; }
</style>