<template>
  <v-container fluid class="pa-6">
    <!-- Title -->
    <v-card class="pa-6 mb-6 todo-hero" elevation="4" rounded="xl">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="text-h4 font-weight-bold text-white">What are you working on today?</div>
          <div class="text-subtitle-1 text-white text-opacity-90 mt-1">
            Choose an activity to keep making progress.
          </div>
        </div>

        <v-icon size="56" class="text-white todo-hero__icon">
          mdi-weather-sunny
        </v-icon>
      </div>
    </v-card>

    <!-- Loading state -->
    <v-row v-if="loading" dense>
      <v-col cols="12">
        <v-card class="pa-8 text-center" elevation="2" rounded="lg">
          <v-progress-circular indeterminate color="primary" size="48" />
          <div class="text-body-1 mt-4">Loading your assignments...</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error state -->
    <v-row v-else-if="error" dense>
      <v-col cols="12">
        <v-card class="pa-6" elevation="2" rounded="lg" color="error" variant="tonal">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-4">mdi-alert-circle</v-icon>
            <div>
              <div class="text-h6">Error loading assignments</div>
              <div class="text-body-2">{{ error }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 5 sections: 5 columns on large screens, stacked on small screens -->
    <v-row v-else dense>
      <!-- Vocab Lists Section -->
      <v-col cols="6" lg="2-4">
        <v-card class="assignment-card" elevation="2" rounded="lg">
          <div class="card-header pa-5">
            <div class="d-flex align-center justify-space-between mb-2">
              <div
                class="text-h6 font-weight-medium linkish"
                role="button"
                tabindex="0"
                @click="goToVocabWorkout"
                @keyup.enter="goToVocabWorkout"
              >
                Vocab Lists
              </div>
              <v-icon size="28">mdi-format-list-checks</v-icon>
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Complete your assigned vocab lists.
            </div>
            <div class="mt-2">
              <v-chip size="small" color="success" variant="tonal" class="mr-2">
                {{ vocabCompletedCount }} completed
              </v-chip>
              <v-chip size="small" color="warning" variant="tonal">
                {{ vocabPendingCount }} pending
              </v-chip>
            </div>
          </div>

          <v-divider />

          <div class="assignment-list pa-4">
            <template v-if="vocabAssignments.length > 0">
              <!-- Completed assignments -->
              <div v-if="vocabCompletedAssignments.length > 0">
                <div class="text-caption font-weight-bold text-success mb-2">
                  COMPLETED ({{ vocabCompletedAssignments.length }})
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="assignment in vocabCompletedAssignments"
                    :key="assignment.assignment_id"
                    class="assignment-item mb-2 completed"
                    rounded="lg"
                  >
                    <template v-slot:prepend>
                      <v-icon color="success" size="20">
                        mdi-check-circle
                      </v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      {{ assignment.description }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Completed {{ formatDate(assignment.completed_at) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
              
              <!-- Pending assignments -->
              <div v-if="vocabPendingAssignments.length > 0" class="mb-4">
                <div class="text-caption font-weight-bold text-warning mb-2">
                  PENDING ({{ vocabPendingAssignments.length }})
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="assignment in vocabPendingAssignments"
                    :key="assignment.assignment_id"
                    class="assignment-item mb-2"
                    rounded="lg"
                  >
                    <template v-slot:prepend>
                      <v-icon color="grey" size="20">
                        mdi-circle-outline
                      </v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      {{ assignment.description }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Created {{ formatDate(assignment.created_at) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>

              
            </template>
            <div v-else class="text-caption text-medium-emphasis text-center pa-4">
              No vocab assignments yet.
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Conjugation Milestones Section -->
      <v-col cols="6" lg="2-4">
        <v-card class="assignment-card" elevation="2" rounded="lg">
          <div class="card-header pa-5">
            <div class="d-flex align-center justify-space-between mb-2">
              <div
                class="text-h6 font-weight-medium linkish"
                role="button"
                tabindex="0"
                @click="goToConjugator"
                @keyup.enter="goToConjugator"
              >
                Verb Conjugation
              </div>
              <v-icon size="28">mdi-format-text</v-icon>
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Reach higher levels in the Conjugator game to keep your conjugation skills sharp.
            </div>
            <div class="mt-2">
              <v-chip size="small" color="success" variant="tonal" class="mr-2">
                {{ conjugationCompletedCount }} completed
              </v-chip>
              <v-chip size="small" color="warning" variant="tonal">
                {{ conjugationPendingCount }} pending
              </v-chip>
            </div>
          </div>

          <v-divider />

          <div class="assignment-list pa-4">
            <template v-if="conjugationAssignments.length > 0">
              <!-- Completed assignments -->
              <div v-if="conjugationCompletedAssignments.length > 0">
                <div class="text-caption font-weight-bold text-success mb-2">
                  COMPLETED ({{ conjugationCompletedAssignments.length }})
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="assignment in conjugationCompletedAssignments"
                    :key="assignment.assignment_id"
                    class="assignment-item mb-2 completed"
                    rounded="lg"
                  >
                    <template v-slot:prepend>
                      <v-icon color="success" size="20">
                        mdi-check-circle
                      </v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      {{ assignment.description }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Completed {{ formatDate(assignment.completed_at) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
              
              <!-- Pending assignments -->
              <div v-if="conjugationPendingAssignments.length > 0" class="mb-4">
                <div class="text-caption font-weight-bold text-warning mb-2">
                  PENDING ({{ conjugationPendingAssignments.length }})
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="assignment in conjugationPendingAssignments"
                    :key="assignment.assignment_id"
                    class="assignment-item mb-2"
                    rounded="lg"
                  >
                    <template v-slot:prepend>
                      <v-icon color="grey" size="20">
                        mdi-circle-outline
                      </v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      {{ assignment.description }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Created {{ formatDate(assignment.created_at) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>

            </template>
            <div v-else class="text-caption text-medium-emphasis text-center pa-4">
              No conjugation assignments yet.
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Other Games Section -->
      <v-col cols="6" lg="2-4">
        <v-card class="assignment-card" elevation="2" rounded="lg">
          <div class="card-header pa-5">
            <div class="d-flex align-center justify-space-between mb-2">
              <div
                class="text-h6 font-weight-medium linkish"
                role="button"
                tabindex="0"
                @click="goToGamesHub"
                @keyup.enter="goToGamesHub"
              >
                Other Grammar Games
              </div>
              <v-icon size="28">mdi-controller-classic</v-icon>
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Complete mini-games with perfect scores.
            </div>
            <div class="mt-2">
              <v-chip size="small" color="success" variant="tonal" class="mr-2">
                {{ gamesCompletedCount }} completed
              </v-chip>
              <v-chip size="small" color="warning" variant="tonal">
                {{ gamesPendingCount }} pending
              </v-chip>
            </div>
          </div>

          <v-divider />

          <div class="assignment-list pa-4">
            <template v-if="gamesAssignments.length > 0">
              <!-- Completed assignments -->
              <div v-if="gamesCompletedAssignments.length > 0">
                <div class="text-caption font-weight-bold text-success mb-2">
                  COMPLETED ({{ gamesCompletedAssignments.length }})
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="assignment in gamesCompletedAssignments"
                    :key="assignment.assignment_id"
                    class="assignment-item mb-2 completed"
                    rounded="lg"
                  >
                    <template v-slot:prepend>
                      <v-icon color="success" size="20">
                        mdi-check-circle
                      </v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      {{ assignment.description }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Completed {{ formatDate(assignment.completed_at) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
              
              <!-- Pending assignments -->
              <div v-if="gamesPendingAssignments.length > 0" class="mb-4">
                <div class="text-caption font-weight-bold text-warning mb-2">
                  PENDING ({{ gamesPendingAssignments.length }})
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="assignment in gamesPendingAssignments"
                    :key="assignment.assignment_id"
                    class="assignment-item mb-2"
                    rounded="lg"
                    role="button"
                    tabindex="0"
                    @click="goToGameFromAssignment(assignment)"
                    @keyup.enter="goToGameFromAssignment(assignment)"
                  >
                    <template v-slot:prepend>
                      <v-icon color="grey" size="20">
                        mdi-circle-outline
                      </v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      {{ assignment.description }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Created {{ formatDate(assignment.created_at) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>

              
            </template>
            <div v-else class="text-caption text-medium-emphasis text-center pa-4">
              No game assignments yet.
            </div>
          </div>
        </v-card>
      </v-col>


      <!-- Understand your errors Section -->
      <v-col cols="6" lg="2-4">
        <v-card class="assignment-card" elevation="2" rounded="lg">
          <div class="card-header pa-5">
            <div class="d-flex align-center justify-space-between mb-2">
              <div
                class="text-h6 font-weight-medium linkish"
                role="button"
                tabindex="0"
                @click="goToExercisesIndex"
                @keyup.enter="goToExercisesIndex"
              >
                Understand Your Errors
              </div>
              <v-icon size="28">mdi-book-open-variant</v-icon>
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Do specific exercises for each of the errors in your feedback.
            </div>
            <div class="mt-2">
              <v-chip size="small" color="success" variant="tonal" class="mr-2">
                {{ exerciseCompletedCount }} completed
              </v-chip>
              <v-chip size="small" color="warning" variant="tonal">
                {{ exercisePendingCount }} pending
              </v-chip>
            </div>
          </div>

          <v-divider />

          <div class="assignment-list pa-4">
            <template v-if="exerciseAssignments.length > 0">
              <!-- Completed assignments -->
              <div v-if="exerciseCompletedAssignments.length > 0">
                <div class="text-caption font-weight-bold text-success mb-2">
                  COMPLETED ({{ exerciseCompletedAssignments.length }})
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="assignment in exerciseCompletedAssignments"
                    :key="assignment.assignment_id"
                    class="assignment-item mb-2 completed"
                    rounded="lg"
                  >
                    <template v-slot:prepend>
                      <v-icon color="success" size="20">
                        mdi-check-circle
                      </v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      {{ assignment.description }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Completed {{ formatDate(assignment.completed_at) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
              
              <!-- Pending assignments -->
              <div v-if="exercisePendingAssignments.length > 0" class="mb-4">
                <div class="text-caption font-weight-bold text-warning mb-2">
                  PENDING ({{ exercisePendingAssignments.length }})
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="assignment in exercisePendingAssignments"
                    :key="assignment.assignment_id"
                    class="assignment-item mb-2"
                    rounded="lg"
                    role="button"
                    tabindex="0"
                    @click="goToExerciseDetail(assignment.trigger_key)"
                    @keyup.enter="goToExerciseDetail(assignment.trigger_key)"
                  >
                    <template v-slot:prepend>
                      <v-icon color="grey" size="20">
                        mdi-circle-outline
                      </v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      {{ assignment.description }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      Error code: {{ assignment.trigger_key }}
                    </v-list-item-subtitle>
                    <template v-slot:append v-if="assignment.spaced_required > 1">
                      <v-chip size="x-small" color="primary" variant="tonal">
                        {{ assignment.spaced_progress }}/{{ assignment.spaced_required }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </div>

              
            </template>
            <div v-else class="text-caption text-medium-emphasis text-center pa-4">
              No exercise assignments yet. Keep practicing!
            </div>
          </div>
        </v-card>
      </v-col>

      
      <!-- Progress Summary Section -->
      <v-col cols="12" lg="2-4">
        <v-card class="assignment-card" elevation="2" rounded="lg">
          <div class="card-header pa-5">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-h6 font-weight-medium">Overall Progress</div>
              <v-icon size="28">mdi-chart-arc</v-icon>
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Track your completion across all assignments.
            </div>
            <div class="mt-2">
              <v-chip size="small" :color="completionPercentage >= 50 ? 'success' : 'warning'" variant="tonal">
                {{ completionPercentage.toFixed(0) }}% complete
              </v-chip>
            </div>
          </div>

          <v-divider />

          <div class="assignment-list pa-4">
            <template v-if="allAssignments.length > 0">
              <!-- Overall progress bar -->
              <div class="mb-4">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2 font-weight-medium">Total Progress</span>
                  <span class="text-body-2 font-weight-bold">
                    {{ completedCount }}/{{ allAssignments.length }}
                  </span>
                </div>
                <v-progress-linear
                  :model-value="completionPercentage"
                  color="success"
                  height="12"
                  rounded
                  striped
                />
              </div>
              
              <!-- Stats by category -->
              <div class="mb-3">
                <div class="text-caption font-weight-bold mb-2">BY CATEGORY</div>
                
                <div class="stat-row mb-2">
                  <v-icon size="16" class="mr-2">mdi-format-list-checks</v-icon>
                  <span class="text-caption flex-grow-1">Vocab</span>
                  <v-chip size="x-small" color="success" variant="text">
                    {{ vocabCompletedCount }}/{{ vocabAssignments.length }}
                  </v-chip>
                </div>

                <div class="stat-row mb-2">
                  <v-icon size="16" class="mr-2">mdi-book-open-variant</v-icon>
                  <span class="text-caption flex-grow-1">Exercises</span>
                  <v-chip size="x-small" color="success" variant="text">
                    {{ exerciseCompletedCount }}/{{ exerciseAssignments.length }}
                  </v-chip>
                </div>

                <div class="stat-row mb-2">
                  <v-icon size="16" class="mr-2">mdi-format-text</v-icon>
                  <span class="text-caption flex-grow-1">Conjugation</span>
                  <v-chip size="x-small" color="success" variant="text">
                    {{ conjugationCompletedCount }}/{{ conjugationAssignments.length }}
                  </v-chip>
                </div>

                <div class="stat-row">
                  <v-icon size="16" class="mr-2">mdi-controller-classic</v-icon>
                  <span class="text-caption flex-grow-1">Games</span>
                  <v-chip size="x-small" color="success" variant="text">
                    {{ gamesCompletedCount }}/{{ gamesAssignments.length }}
                  </v-chip>
                </div>
              </div>

              <v-divider class="my-3" />

              <!-- Summary stats -->
              <div class="text-caption">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-medium-emphasis">Completed:</span>
                  <span class="font-weight-medium text-success">{{ completedCount }}</span>
                </div>
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-medium-emphasis">Pending:</span>
                  <span class="font-weight-medium text-warning">{{ pendingCount }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-medium-emphasis">Total:</span>
                  <span class="font-weight-medium">{{ allAssignments.length }}</span>
                </div>
              </div>
            </template>
            <div v-else class="text-caption text-medium-emphasis text-center pa-4">
              No assignments yet. Check back after your teacher sets up your domain.
            </div>
          </div>
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

const userStore = useUserStore();

// Types
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

const router = useRouter();

function goToRouteName(name: string, params?: Record<string, any>) {
  router.push({ name, params }).catch(() => {});
}

function goToExercisesIndex() {
  goToRouteName("exercises");
}

function goToExerciseDetail(errorCode: string) {
  if (!errorCode) return;
  goToRouteName("exercise-detail", { errorCode });
}

function goToVocabWorkout() {
  goToRouteName("vocabworkout");
}

function goToConjugator() {
  goToRouteName("conjugator");
}

function goToGamesHub() {
  goToRouteName("games");
}

/**
 * Best-effort mapping from an assignment description to a game route.
 * Adjust keywords here to match how your teacher writes assignment descriptions.
 */
const GAME_ROUTE_HINTS: { routeName: string; keywords: string[] }[] = [
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
  if (routeName) {
    goToRouteName(routeName);
  } else {
    goToGamesHub();
  }
}


// State
const loading = ref(true);
const error = ref<string | null>(null);
const allAssignments = ref<Assignment[]>([]);

// Helper function to format dates
const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Vocab assignments
const vocabAssignments = computed(() => {
  return allAssignments.value.filter(a => 
    a.task_type === 'achievement' && 
    a.trigger_key.includes('vw_write_complete')
  );
});
const vocabPendingAssignments = computed(() => vocabAssignments.value.filter(a => a.status === 'pending'));
const vocabCompletedAssignments = computed(() => vocabAssignments.value.filter(a => a.status === 'completed'));
const vocabCompletedCount = computed(() => vocabCompletedAssignments.value.length);
const vocabPendingCount = computed(() => vocabPendingAssignments.value.length);

// Exercise assignments
const exerciseAssignments = computed(() => {
  return allAssignments.value.filter(a => a.task_type === 'exercise');
});
const exercisePendingAssignments = computed(() => exerciseAssignments.value.filter(a => a.status === 'pending'));
const exerciseCompletedAssignments = computed(() => exerciseAssignments.value.filter(a => a.status === 'completed'));
const exerciseCompletedCount = computed(() => exerciseCompletedAssignments.value.length);
const exercisePendingCount = computed(() => exercisePendingAssignments.value.length);

// Conjugation assignments (milestones, health tiers, irregular verbs)
const conjugationAssignments = computed(() => {
  return allAssignments.value.filter(a => 
    a.task_type === 'achievement' && 
    (a.trigger_key.includes('correct_prompts') || 
     a.trigger_key.includes('health_tier') ||
     a.trigger_key.includes('discovery') ||
     a.trigger_key.includes('mastery'))
  );
});
const conjugationPendingAssignments = computed(() => conjugationAssignments.value.filter(a => a.status === 'pending'));
const conjugationCompletedAssignments = computed(() => conjugationAssignments.value.filter(a => a.status === 'completed'));
const conjugationCompletedCount = computed(() => conjugationCompletedAssignments.value.length);
const conjugationPendingCount = computed(() => conjugationPendingAssignments.value.length);

// Games assignments (everything else that's achievement-based)
const gamesAssignments = computed(() => {
  return allAssignments.value.filter(a => 
    a.task_type === 'achievement' && 
    !a.trigger_key.includes('vw_write_complete') &&
    !a.trigger_key.includes('correct_prompts') &&
    !a.trigger_key.includes('health_tier') &&
    !a.trigger_key.includes('discovery') &&
    !a.trigger_key.includes('mastery')
  );
});
const gamesPendingAssignments = computed(() => gamesAssignments.value.filter(a => a.status === 'pending'));
const gamesCompletedAssignments = computed(() => gamesAssignments.value.filter(a => a.status === 'completed'));
const gamesCompletedCount = computed(() => gamesCompletedAssignments.value.length);
const gamesPendingCount = computed(() => gamesPendingAssignments.value.length);

// Overall stats
const completedCount = computed(() => {
  return allAssignments.value.filter(a => a.status === 'completed').length;
});

const pendingCount = computed(() => {
  return allAssignments.value.filter(a => a.status === 'pending').length;
});

const completionPercentage = computed(() => {
  if (allAssignments.value.length === 0) return 0;
  return (completedCount.value / allAssignments.value.length) * 100;
});

// Methods
async function fetchAssignments() {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get('/assignment/');
    allAssignments.value = response.data;
  } catch (err: any) {
    console.error('Error fetching assignments:', err);
    error.value = err.response?.data?.detail || 'Failed to load assignments';
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(() => {
  fetchAssignments();
});
</script>

<style scoped>
.todo-hero {
  background: linear-gradient(135deg, #ffb300 0%, #ffd54f 40%, #ff7043 100%);
  position: relative;
  overflow: hidden;
}

.todo-hero::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%);
  transform: rotate(-10deg);
  pointer-events: none;
}

.todo-hero > * {
  position: relative;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
}

.todo-hero__icon {
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.2));
  opacity: 0.95;
}

/* Assignment cards */
.assignment-card {
  height: 600px;
  display: flex;
  flex-direction: column;
}

.card-header {
  flex-shrink: 0;
}

.assignment-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

/* Custom scrollbar */
.assignment-list::-webkit-scrollbar {
  width: 8px;
}

.assignment-list::-webkit-scrollbar-track {
  background: transparent;
}

.assignment-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.assignment-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Assignment items */
.assignment-item {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.assignment-item:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateX(2px);
}

.assignment-item.completed {
  opacity: 0.7;
}

.assignment-item.completed:hover {
  opacity: 0.85;
}

/* Stats row */
.stat-row {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.linkish {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-thickness: 0.7px;
  text-underline-offset: 4px;
}

.linkish:focus {
  outline: 2px solid rgba(255, 255, 255, 0.7);
  outline-offset: 4px;
  border-radius: 6px;
}

/* Responsive */
@media (max-width: 1280px) {
  .assignment-card {
    height: 500px;
  }
}
</style>