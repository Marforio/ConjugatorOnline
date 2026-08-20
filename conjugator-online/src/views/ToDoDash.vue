<template>
  <v-container fluid class="pa-6 dashboard-bg" :class="userStore.isStaff ? 'mt-0' : 'mt-4'">
    
    <!-- HERO SECTION: Welcome + Buttons (left) + Stats (right) -->
    <v-row class="mb-6" align="center">
      <v-col cols="12">
        <v-card class="pa-6 welcome-banner" elevation="0" rounded="xl">
          <v-row align="center">
            <!-- Left: Welcome Text + Buttons -->
            <v-col cols="12" md="7" class="pa-0 pr-md-4">
              <div>
                <h1 class="text-h4 font-weight-black text-slate-900 mb-2">
                  Welcome back, {{ userStore.student?.initials || 'Student' }}!
                </h1>
                <p class="text-caption text-slate-600 mb-4">
                  <span v-if="currentCourseData">
                    Enrolled in <span class="font-weight-bold text-indigo">{{ currentCourseData?.slug?.toUpperCase() || 'N/A' }}</span>
                  </span>
                  <span v-else>
                    Ready to practice?
                  </span>
                </p>
                <div class="d-flex flex-wrap ga-2">
                  <v-btn 
                    color="indigo-darken-1" 
                    size="small"
                    rounded="lg" 
                    class="text-none font-weight-bold"
                    @click="goToConjugator"
                  >
                    <v-icon start size="18">mdi-controller-classic</v-icon>
                    Conjugator
                  </v-btn>
                  <v-btn 
                    color="teal-lighten-2" 
                    size="small"
                    rounded="lg"
                    class="text-none font-weight-bold"
                    @click="goToVocabWorkout"
                  >
                    <v-icon start size="18">mdi-cards-outline</v-icon>
                    Vocab
                  </v-btn>
                  <v-btn 
                    color="purple-lighten-2" 
                    size="small"
                    rounded="lg"
                    class="text-none font-weight-bold"
                    @click="goToGamesHub"
                  >
                    <v-icon start size="18">mdi-gamepad-circle</v-icon>
                    Games
                  </v-btn>
                </div>
              </div>
            </v-col>

            <!-- Right: Stats (Stacked Horizontally) -->
            <v-col cols="12" md="5" class="pa-0">
              <div class="d-flex ga-2 align-center h-100">
                <v-card class="pa-3 bg-indigo-lighten-5 border-0 flex-grow-1" rounded="lg">
                  <div class="text-xxs font-weight-bold text-indigo-darken-1 uppercase tracking-wider mb-0.5">Pending assignments</div>
                  <div class="text-h6 font-weight-black text-indigo-darken-2">{{ pendingCount }}</div>
                </v-card>
                <v-card v-if="currentCourseData" class="pa-3 bg-success-lighten-5 border-0 flex-grow-1" rounded="lg">
                  <div class="text-xxs font-weight-bold text-success-darken-2 uppercase tracking-wider mb-0.5">Progress (objectives)</div>
                  <div class="text-h6 font-weight-black text-success-darken-3">{{ courseProgressPercentage }}%</div>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- ACTIVITY FEED: Horizontal timeline with dots -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h6 font-weight-bold text-slate-900">Recent Activity</h2>
          <v-chip-group v-model="activityFilter" @update:model-value="fetchActivityFeed" density="compact">
            <v-chip size="x-small" variant="outlined" value="all">All</v-chip>
            <v-chip size="x-small" variant="outlined" value="conjugation">Conjugator</v-chip>
            <v-chip size="x-small" variant="outlined" value="vocab_workout">Vocab</v-chip>
            <v-chip size="x-small" variant="outlined" value="other_game">Games</v-chip>
            <v-chip size="x-small" variant="outlined" value="exercise">Exercises</v-chip>
          </v-chip-group>
        </div>

        <v-card class="overflow-hidden" elevation="0" rounded="xl">
          <div v-if="loadingActivity" class="pa-8 text-center">
            <v-progress-circular indeterminate color="indigo" size="40" />
            <div class="text-caption text-slate-500 mt-2">Loading activity...</div>
          </div>

          <div v-else-if="activityFeed.length > 0" class="pa-6 position-relative">
            <!-- Horizontal scrollable track -->
            <div 
              ref="activityTrackRef"
              class="d-flex ga-3 overflow-x-auto pb-4 activity-horizontal-scroll"
            >
              <div 
                v-for="(activity, index) in activityFeed"
                :key="index"
                class="flex-shrink-0"
                style="min-width: 260px;"
              >
                <div class="d-flex ga-3 align-start">
                  <!-- Dot -->
                  <div class="flex-shrink-0 pt-1">
                    <v-avatar 
                      :color="getActivityColor(activity.type)" 
                      size="12"
                      class="flex-shrink-0"
                    />
                  </div>
                  <!-- Content -->
                  <div class="flex-grow-1 min-width-0">
                    <div class="text-body-2 font-weight-bold text-slate-800">
                      {{ activity.title }}
                    </div>
                    <div class="text-caption text-slate-500 mt-0.5">
                      {{ activity.description }}
                    </div>
                    <div class="text-xxs text-slate-400 font-monospace mt-1">
                      {{ formatActivityTime(activity.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="pa-8 text-center text-slate-400">
            <v-icon size="40" class="mb-2">mdi-calendar-blank</v-icon>
            <div class="text-body-2">No activity yet.</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- MAIN CONTENT: Assignments (7) + Course Objectives + Completed + Profile (5) -->
    <v-row class="mb-6">
      <!-- Left: Assignments Panel (7 cols) -->
      <v-col cols="12" lg="7">
        <v-card class="h-100" elevation="0" rounded="xl" border>
          <v-card-title class="bg-slate-50 border-b pa-5">
            <div class="d-flex align-center ga-2">
              <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
              <span>Your Work</span>
            </div>
          </v-card-title>

          <v-card-text class="pa-6">
            <div v-if="loading" class="text-center py-10">
              <v-progress-circular indeterminate color="indigo" />
              <div class="text-body-2 text-slate-500 mt-2">Loading assignments...</div>
            </div>

            <div v-else-if="pendingCount === 0" class="text-center py-12">
              <v-avatar color="success-lighten-5" size="80" class="mb-4">
                <v-icon color="success-darken-2" size="48">mdi-check-all</v-icon>
              </v-avatar>
              <div class="text-h6 font-weight-bold text-slate-800 mb-2">All caught up!</div>
              <div class="text-body-2 text-slate-600 mb-6">
                Great work! No pending assignments. Keep practicing to stay sharp.
              </div>
              <v-btn 
                color="indigo-darken-1" 
                variant="tonal" 
                rounded="lg"
                @click="goToGamesHub"
              >
                <v-icon start>mdi-play-circle-outline</v-icon>
                Play a Game
              </v-btn>
            </div>

            <div v-else class="ga-6 d-flex flex-column">
              <!-- Workout Section -->
              <div v-if="currentWorkout" class="border rounded-xl pa-6 bg-blue-lighten-5">
                <div class="d-flex align-center justify-space-between mb-4">
                  <div>
                    <div class="text-subtitle-1 font-weight-bold text-slate-900"><v-icon>mdi-run-fast</v-icon><span class="ms-2">Personal Workout</span></div>
                    <div class="text-caption text-slate-600 ms-3">Book a 5-minute session with your teacher to do your workout!</div>
                  </div>
                  <v-chip size="small" :color="workoutProgressColor" variant="flat" class="text-white font-weight-bold">
                    {{ workoutCompletionPercentage }}%
                  </v-chip>
                </div>
                <div class="ga-2 d-flex flex-column">
                  <div 
                    v-for="drill in [...inProgressDrills, ...notStartedDrills]" 
                    :key="drill.id" 
                    class="d-flex align-center justify-space-between pa-3 rounded-lg border bg-white"
                  >
                    <div class="d-flex align-center ga-3 flex-grow-1">
                      <v-icon size="18" :color="drill.completed_sessions > 0 ? 'warning' : 'slate-300'">
                        {{ drill.completed_sessions > 0 ? 'mdi-progress-clock' : 'mdi-circle-outline' }}
                      </v-icon>
                      <div>
                        <div class="text-body-2 font-weight-bold text-slate-800">{{ drill.name }}</div>
                        <div class="text-caption text-slate-500">{{ drill.completed_sessions }} / {{ drill.target_sessions || 1 }} sessions</div>
                      </div>
                    </div>
                    <v-chip size="x-small" variant="outlined" color="slate-400">{{ drill.type }}</v-chip>
                  </div>
                </div>
              </div>

              <!-- Assignments by Type -->
              <div v-if="vocabPendingAssignments.length > 0" class="border rounded-xl pa-4 bg-teal-lighten-5">
                <div class="d-flex align-center ga-2 mb-3">
                  <v-icon color="teal-darken-2">mdi-cards-outline</v-icon>
                  <span class="text-subtitle-2 font-weight-bold text-teal-darken-2">Vocabulary</span>
                </div>
                <div class="ga-2 d-flex flex-column">
                  <div 
                    v-for="item in vocabPendingAssignments" 
                    :key="item.assignment_id"
                    class="d-flex align-center justify-space-between pa-3 rounded-lg bg-white border border-teal-lighten-3 cursor-pointer hover-elevation-2"
                    @click="goToVocabWorkout"
                  >
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium text-slate-800">{{ item.description }}</div>
                      <div class="text-caption text-slate-500">Assigned {{ formatDate(item.created_at) }}</div>
                    </div>
                    <v-icon size="20" color="teal-darken-2">mdi-arrow-right</v-icon>
                  </div>
                </div>
              </div>

              <div v-if="conjugationPendingAssignments.length > 0" class="border rounded-xl pa-4 bg-indigo-lighten-5">
                <div class="d-flex align-center ga-2 mb-3">
                  <v-icon color="indigo-darken-2">mdi-controller-classic</v-icon>
                  <span class="text-subtitle-2 font-weight-bold text-indigo-darken-2">Conjugation</span>
                </div>
                <div class="ga-2 d-flex flex-column">
                  <div 
                    v-for="item in conjugationPendingAssignments" 
                    :key="item.assignment_id"
                    class="d-flex align-center justify-space-between pa-3 rounded-lg bg-white border border-indigo-lighten-3 cursor-pointer hover-elevation-2"
                    @click="goToConjugator"
                  >
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium text-slate-800">{{ item.description }}</div>
                      <div class="text-caption text-slate-500">Assigned {{ formatDate(item.created_at) }}</div>
                    </div>
                    <v-icon size="20" color="indigo-darken-2">mdi-arrow-right</v-icon>
                  </div>
                </div>
              </div>

              <div v-if="gamesPendingAssignments.length > 0" class="border rounded-xl pa-4 bg-purple-lighten-5">
                <div class="d-flex align-center ga-2 mb-3">
                  <v-icon color="purple-darken-2">mdi-gamepad-circle</v-icon>
                  <span class="text-subtitle-2 font-weight-bold text-purple-darken-2">Games</span>
                </div>
                <div class="ga-2 d-flex flex-column">
                  <div 
                    v-for="item in gamesPendingAssignments" 
                    :key="item.assignment_id"
                    class="d-flex align-center justify-space-between pa-3 rounded-lg bg-white border border-purple-lighten-3 cursor-pointer hover-elevation-2"
                    @click="goToGameFromAssignment(item)"
                  >
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium text-slate-800">{{ item.description }}</div>
                      <div class="text-caption text-slate-500">Assigned {{ formatDate(item.created_at) }}</div>
                    </div>
                    <v-icon size="20" color="purple-darken-2">mdi-arrow-right</v-icon>
                  </div>
                </div>
              </div>

              <div v-if="exercisePendingAssignments.length > 0" class="border rounded-xl pa-4 bg-orange-lighten-5">
                <div class="d-flex align-center ga-2 mb-3">
                  <v-icon color="orange-darken-2">mdi-book-open-variant</v-icon>
                  <span class="text-subtitle-2 font-weight-bold text-orange-darken-2">Grammar Review</span>
                </div>
                <div class="ga-2 d-flex flex-column">
                  <div 
                    v-for="item in exercisePendingAssignments" 
                    :key="item.assignment_id"
                    class="d-flex align-center justify-space-between pa-3 rounded-lg bg-white border border-orange-lighten-3 cursor-pointer hover-elevation-2"
                    @click="goToExerciseDetail(item.trigger_key)"
                  >
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium text-slate-800">{{ item.description }}</div>
                      <div class="text-caption text-slate-500">{{ item.trigger_key }}</div>
                    </div>
                    <v-icon size="20" color="orange-darken-2">mdi-arrow-right</v-icon>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right: Sidebar - Course Objectives + Completed + Profile (5 cols) -->
      <v-col cols="12" lg="5">
        <v-row class="ga-6">
          <!-- Course Objectives Card -->
          <v-col cols="12" v-if="currentCourseData">
            <v-card class="h-100" elevation="0" rounded="xl" border>
              <v-card-title class="bg-success-lighten-5 border-b pa-4">
                <div class="d-flex align-center ga-2">
                  <v-icon color="success-darken-2">mdi-bullseye-arrow</v-icon>
                  <span class="text-success-darken-2">Course Objectives</span>
                </div>
              </v-card-title>

              <v-card-text class="pa-5">
                <div v-if="loadingEnrollments" class="text-center py-6">
                  <v-progress-circular indeterminate color="success" size="32" />
                </div>
                <div v-else class="ga-3 d-flex flex-column">
                  <div 
                    v-for="(obj, idx) in currentCourseData.objectives"
                    :key="obj.id"
                    class="d-flex align-center ga-2"
                  >
                    <v-avatar 
                      size="24" 
                      :color="isStudentObjectiveFulfilled(obj.id) ? 'success' : 'slate-100'"
                      class="flex-shrink-0"
                    >
                      <v-icon v-if="isStudentObjectiveFulfilled(obj.id)" size="14" color="white">mdi-check</v-icon>
                      <span v-else class="text-slate-600 text-xxs font-weight-bold">{{ idx + 1 }}</span>
                    </v-avatar>
                    <div class="flex-grow-1 min-width-0">
                      <div 
                        class="text-caption font-weight-medium line-clamp-2"
                        :class="isStudentObjectiveFulfilled(obj.id) ? 'text-success-darken-2 line-through' : 'text-slate-700'"
                      >
                        {{ obj.title }}
                      </div>
                    </div>
                  </div>
                  <v-divider class="my-3" />
                  <div class="text-center">
                    <div class="text-h6 font-weight-black text-success-darken-2">{{ courseProgressPercentage }}%</div>
                    <div class="text-caption text-slate-500">Objectives Completed</div>
                    <v-progress-linear :model-value="courseProgressPercentage" color="success" height="6" rounded class="mt-2" />
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Completed Tasks Card (Collapsible, closed by default) -->
          <v-col cols="12" v-if="completedCount > 0">
            <v-expansion-panels v-model="completedTasksPanel">
              <v-expansion-panel value="completed" class="rounded-xl border overflow-hidden">
                <v-expansion-panel-title class="bg-slate-50 font-weight-bold pa-4">
                  <div class="d-flex align-center ga-2">
                    <v-icon>mdi-check-circle</v-icon>
                    <span>Completed ({{ completedCount }})</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="pa-4">
                  <v-list density="compact" class="pa-0">
                    <v-list-item 
                      v-for="item in [...vocabCompletedAssignments, ...conjugationCompletedAssignments, ...gamesCompletedAssignments, ...exerciseCompletedAssignments]" 
                      :key="item.assignment_id"
                      class="border-b py-2"
                    >
                      <template v-slot:prepend>
                        <v-icon color="success" size="18" class="mr-2">mdi-check-circle</v-icon>
                      </template>
                      <v-list-item-title class="text-caption font-weight-medium text-slate-700 text-decoration-line-through">
                        {{ item.description }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-xxs text-slate-400">
                        Completed {{ formatDate(item.completed_at) }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>

          <!-- Linguistic Profile Card (Clickable preview, opens dialog) -->
          <v-col cols="12">
            <v-card 
              class="h-100 cursor-pointer transition-all hover-elevation-4"
              elevation="0" 
              rounded="xl" 
              border
              @click="showProfileDialog = true"
            >
              <v-card-title class="bg-indigo-lighten-5 border-b pa-4">
                <div class="d-flex align-center ga-2 justify-space-between">
                  <div class="d-flex align-center ga-2">
                    <v-icon color="indigo-darken-2">mdi-badge-account-outline</v-icon>
                    <span class="text-indigo-darken-2">Language Profile</span>
                  </div>
                  <v-icon size="20" color="indigo-darken-2">mdi-arrow-top-right</v-icon>
                </div>
              </v-card-title>

              <v-card-text class="pa-5">
                <div class="text-center py-6 text-slate-500">
                  <v-icon size="32" class="mb-2 d-block">mdi-information-outline</v-icon>
                  <div class="text-caption">Click to view your full language profile</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- PROFILE DIALOG: Full Linguistic Profile -->
    <v-dialog v-model="showProfileDialog" max-width="600" fullscreen-mobile>
      <v-card rounded="xl">
        <v-card-title class="bg-indigo-lighten-5 border-b pa-6 d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-2">
            <v-icon color="indigo-darken-2" size="28">mdi-badge-account-outline</v-icon>
            <span class="text-indigo-darken-2">Language Profile</span>
          </div>
          <v-btn 
            icon="mdi-close" 
            variant="text" 
            size="small"
            @click="showProfileDialog = false"
          />
        </v-card-title>

        <v-card-text class="pa-6">
          <LinguisticProfileEmbedded />
        </v-card-text>

        <v-card-actions class="border-t pa-4">
          <v-spacer />
          <v-btn 
            color="indigo-darken-1" 
            variant="tonal" 
            rounded="lg"
            @click="showProfileDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

const loadingEnrollments = ref(false)

// Lifecycle computed selectors mapping data out of the Pinia userStore caches layer
const studentEnrollmentRecord = computed(() => {
  // Grab the first matching enrollment array line for the student account safely
  return userStore.enrollments && userStore.enrollments.length > 0 ? userStore.enrollments[0] : null;
});

const currentCourseData = computed(() => {
  return studentEnrollmentRecord.value?.course || null;
});

const currentCourseFulfillmentMap = computed(() => {
  return studentEnrollmentRecord.value?.objective_fulfillment || {};
});

// Structural Helper metric counts evaluations
function isStudentObjectiveFulfilled(objectiveId: string): boolean {
  return !!currentCourseFulfillmentMap.value[objectiveId];
}

const currentCourseFulfillmentCount = computed(() => {
  if (!currentCourseData.value?.objectives) return 0;
  return currentCourseData.value.objectives.filter(obj => isStudentObjectiveFulfilled(obj.id)).length;
});

const courseProgressPercentage = computed(() => {
  const total = currentCourseData.value?.objectives?.length || 0;
  if (total === 0) return 0;
  return Math.round((currentCourseFulfillmentCount.value / total) * 100);
});


const showProfileDialog = ref(false);
const completedTasksPanel = ref<string | string[]>([]);

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

// Ticker reference node pointer hook mapping down to the track element
const tickerTrackRef = ref<HTMLElement | null>(null);

/**
 * BUTTON SCROLL TRIGGER
 * Smoothly shifts view indices horizontally when navigation arrows are clicked
 */
function scrollTicker(direction: 'left' | 'right') {
  if (!tickerTrackRef.value) return;
  
  // Shift track layout view by roughly 3 active ticker card blocks per click step
  const scrollOffsetDistance = 600; 
  const targetMultiplier = direction === 'left' ? -1 : 1;
  
  tickerTrackRef.value.scrollBy({
    left: scrollOffsetDistance * targetMultiplier,
    behavior: 'smooth'
  });
}

/**
 * DESKTOP MOUSE DRAG-TO-SCROLL PIPELINE
 * Translates click-and-drag movements into horizontal scroll updates
 */
function initiateMouseDragScroll(mouseDownEvent: MouseEvent) {
  const track = tickerTrackRef.value;
  if (!track) return;

  // Cache baseline structural geometry data coordinates parameters
  const baselineStartX = mouseDownEvent.pageX - track.offsetLeft;
  const baselineInitialScrollLeft = track.scrollLeft;
  
  track.classList.add('active-dragging');

  function handleMouseMovements(mouseMoveEvent: MouseEvent) {
    mouseMoveEvent.preventDefault();
    const currentX = mouseMoveEvent.pageX - track!.offsetLeft;
    
    // Multiplier (1.5) dials up drag responsiveness speed parameters
    const structuralDeltaX = (currentX - baselineStartX) * 1.5; 
    track!.scrollLeft = baselineInitialScrollLeft - structuralDeltaX;
  }

  function terminateMouseDragTracking() {
    track!.classList.remove('active-dragging');
    window.removeEventListener('mousemove', handleMouseMovements);
    window.removeEventListener('mouseup', terminateMouseDragTracking);
  }

  // Bind operational pipeline listener chains straight to global window tracks
  window.addEventListener('mousemove', handleMouseMovements);
  window.addEventListener('mouseup', terminateMouseDragTracking);
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

// Smart "Next-In-Line" Pending Conjugation Assignments
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
  loadingEnrollments.value = true;
  await userStore.fetchEnrollments();
  loadingEnrollments.value = false;
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

.bg-success-lighten-5 {
  background-color: #f0fdf4 !important; /* Soft Tailwind Emerald-50 profile */
}
.border-success-subtle {
  border-color: #bbf7d0 !important;
}
.text-success-darken-2 {
  color: #166534 !important;
}
.flex-none {
  flex-shrink: 0 !important;
}
.line-height-normal {
  line-height: 1.45 !important;
}
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Horizontal scroll settings for the stream cards track */
.horizontal-ticker-track {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  background-color: #fafbfc;
  scrollbar-width: none; /* Hide scrollbar for clean aesthetic */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.horizontal-ticker-track::-webkit-scrollbar {
  display: none;
}

/* Micro cards configuration dimensions */
.ticker-item-card {
  min-width: 260px;
  max-width: 300px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02) !important;
  transition: transform 0.2s, border-color 0.2s;
}

.ticker-item-card:hover {
  transform: translateY(-1px);
  border-color: #cbd5e1 !important; /* Tailwind slate-300 */
}

/* Micro-typography utility specifications */
.text-xxs {
  font-size: 0.7rem !important;
  line-height: 1rem !important;
}

.font-monospace {
  font-family: monospace !important;
}

.flex-none {
  flex-shrink: 0 !important;
}

.border-s {
  border-left: 1px solid #e2e8f0 !important;
}

/* Remove default heavy padding inside Vuetify chips loop */
.ticker-filters :deep(.v-chip) {
  height: 22px !important;
}

/* Gives visual hint that the item track layout surface is interactively slideable */
.grab-to-scroll {
  cursor: grab;
  user-select: none;
}

/* Switches to a closed fist layout cursor profile style mid-movement transition */
.active-dragging {
  cursor: grabbing !important;
  scroll-behavior: auto !important; /* Temporarily suspends inertia rules to match cursor delta */
}
</style>