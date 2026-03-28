<template>
  <v-container fluid class="pa-6">
    <!-- Welcome Banner -->
    <v-card class="pa-6 mb-6 welcome-hero" elevation="4" rounded="xl">
      <div class="d-flex align-items-center justify-center">
        <div>
          <div class="text-h4 font-weight-bold text-white">
            Welcome back, {{ userStore.student?.initials || 'Student' }}!
          </div>
        </div>
        <v-icon size="40" class="ms-8 text-white welcome-hero__icon">
          mdi-human-greeting-variant
        </v-icon>
      </div>
    </v-card>

    <!-- 2-Column Grid Layout -->
    <v-row dense>
      <!-- LEFT COLUMN: Latest Activity (full height) -->
      <v-col cols="12" md="5">
        <v-card class="activity-card" elevation="2" rounded="lg">
          <div class="card-header pa-5">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h5 font-weight-bold">
                  <v-icon class="mr-2">mdi-history</v-icon>
                  Latest Activity
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Your recent actions and updates
                </div>
              </div>
            </div>
          </div>

          <v-divider />

          <!-- Activity Feed -->
          <div class="activity-list pa-4">
            <!-- Loading State -->
            <div v-if="loadingActivity" class="text-center pa-8">
              <v-progress-circular indeterminate color="primary" />
              <div class="text-body-2 mt-2">Loading activity...</div>
            </div>

            <!-- Activity Items -->
            <v-timeline v-else-if="activityFeed.length > 0" density="compact" align="start">
              <v-timeline-item
                v-for="(activity, index) in activityFeed"
                :key="index"
                :dot-color="getActivityColor(activity.type)"
                size="small"
              >
                <template v-slot:icon>
                  <v-icon size="16">{{ getActivityIcon(activity.type) }}</v-icon>
                </template>

                <div class="activity-item pa-3">
                  <div class="d-flex align-items-start justify-space-between">
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium">
                        {{ activity.title }}
                      </div>
                      <div class="text-caption text-medium-emphasis mt-1">
                        {{ activity.description }}
                      </div>
                    </div>
                    <v-chip 
                      size="x-small" 
                      :color="getActivityColor(activity.type)"
                      variant="tonal"
                      class="ml-2"
                    >
                      {{ getActivityLabel(activity.type) }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-2">
                    <v-icon size="12" class="mr-1">mdi-clock-outline</v-icon>
                    {{ formatActivityTime(activity.timestamp) }}
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>

            <!-- Empty State -->
            <div v-else class="text-center pa-8">
              <v-icon size="64" color="grey-lighten-1">mdi-inbox</v-icon>
              <div class="text-h6 mt-4 text-medium-emphasis">No activity yet</div>
              <div class="text-body-2 text-medium-emphasis">
                Start practicing to see your activity here!
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN: Two action cards stacked -->
      <v-col cols="12" md="7">
        <!-- Top: What Should I Work On? -->
        <v-card 
          class="action-card clickable-card mb-4" 
          elevation="3" 
          rounded="lg"
          color="amber-lighten-5"
          hover
          @click="scrollToAssignments"
        >
          <div class="pa-4 text-center">
            <div class="d-flex justify-space-between">
                          <div class="d-flex justify-start align-center ms-4 p-2">
              <v-icon size="60" color="amber-darken-4" class="mb-2 me-6">
                mdi-account-hard-hat
              </v-icon>
              <div class="text-h5 font-weight-bold">
                What are you working on?
              </div>
            </div>
              <v-btn
              color="amber-darken-4"
              size="default"
              variant="elevated"
              class="mt-5"
              append-icon="mdi-arrow-down"
            >
              My Assignments
            </v-btn>

            </div>

            
            <div class="text-body-2 text-medium-emphasis mb-4">
              See your assignments and recommended activities
            </div>
            
            <!-- Quick Stats -->
            <div class="d-flex justify-center gap-4 mt-4">
              <v-chip color="warning" variant="tonal">
                <v-icon start>mdi-alert-circle</v-icon>
                {{ pendingCount }} pending
              </v-chip>
              <v-chip color="success" variant="tonal">
                <v-icon start>mdi-check-circle</v-icon>
                {{ completedCount }} completed
              </v-chip>
            </div>


          </div>
        </v-card>

        <!-- Bottom: My Linguistic Profile -->
        <v-card 
          class="action-card clickable-card profile-card-preview" 
          elevation="3" 
          rounded="lg"
          hover
          @click="scrollToProfile"
        >
          <div class="pa-4 text-center">
            <div class="d-flex justify-space-between">
              <div class="d-flex justify-start align-center ms-4 p-2">
              <v-icon size="60" color="purple" class="mb-2 me-6">
                mdi-account-voice
              </v-icon>
              <div class="text-h5 font-weight-bold mb-2">
                My Linguistic Profile
              </div>
            </div>
              <v-btn
              color="purple"
              size="default"
              variant="elevated"
              class="mt-4"
              append-icon="mdi-arrow-down"
            >
              Full Profile
            </v-btn>
            </div>
            
            <!-- Profile Preview (if exists) -->
            <div v-if="userStore.hasLinguisticProfile" class="profile-preview">
              <div class="d-flex justify-center gap-3 mb-2">
                <div class="profile-mini-stat">
                  <div class="stat-value" :style="{ color: getScoreColor(userStore.linguisticProfile?.linguistic_precision) }">
                    {{ userStore.linguisticProfile?.linguistic_precision || '—' }}
                  </div>
                  <div class="stat-label">Precision</div>
                </div>
                <div class="profile-mini-stat">
                  <div class="stat-value" :style="{ color: getScoreColor(userStore.linguisticProfile?.phonetic_clarity) }">
                    {{ userStore.linguisticProfile?.phonetic_clarity || '—' }}
                  </div>
                  <div class="stat-label">Clarity</div>
                </div>
                <div class="profile-mini-stat">
                  <div class="stat-value" :style="{ color: getScoreColor(userStore.linguisticProfile?.communicative_flow) }">
                    {{ userStore.linguisticProfile?.communicative_flow || '—' }}
                  </div>
                  <div class="stat-label">Flow</div>
                </div>
                <div class="profile-mini-stat">
                  <div class="stat-value" :style="{ color: getScoreColor(userStore.linguisticProfile?.expressive_range) }">
                    {{ userStore.linguisticProfile?.expressive_range || '—' }}
                  </div>
                  <div class="stat-label">Range</div>
                </div>
              </div>

              <v-chip 
                v-if="userStore.linguisticProfile?.profile_type"
                color="purple"
                variant="tonal"
                size="small"
              >
                {{ userStore.linguisticProfile.profile_type.emoji }}
                {{ userStore.linguisticProfile.profile_type.type }}
              </v-chip>
            </div>
            <div v-else class="text-caption text-medium-emphasis">
              Profile not yet assessed
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Assignments Section -->
    <div ref="assignmentsSection" style="margin-top: 10%;">
      <v-card class="pa-6 mb-4 assignments-header" elevation="4" rounded="xl">
        <div class="d-flex justify-space-between">
              
          <div>
            <div class="text-h4 font-weight-bold">What should I work on today?</div>
            <div class="text-subtitle-1 text-medium-emphasis mt-1">
              Choose an activity to keep making progress
            </div>
          </div>
            <v-icon size="56" class="text-white welcome-hero__icon">
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

      <!-- Assignment Cards (existing content) -->
      <v-row v-else dense>
        <!-- Vocab Lists Section -->
        <v-col cols="6">
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
                        <v-icon color="success" size="20">mdi-check-circle</v-icon>
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
                        <v-icon color="grey" size="20">mdi-circle-outline</v-icon>
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

        <!-- Conjugation Section -->
        <v-col cols="6">
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
                Reach higher levels in the Conjugator game.
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
                        <v-icon color="success" size="20">mdi-check-circle</v-icon>
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
                        <v-icon color="grey" size="20">mdi-circle-outline</v-icon>
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

        <!-- Games Section -->
        <v-col cols="6">
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
                        <v-icon color="success" size="20">mdi-check-circle</v-icon>
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
                        <v-icon color="grey" size="20">mdi-circle-outline</v-icon>
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

        <!-- Exercises Section -->
        <v-col cols="6">
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
                Do specific exercises for errors in your feedback.
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
                        <v-icon color="success" size="20">mdi-check-circle</v-icon>
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
                        <v-icon color="grey" size="20">mdi-circle-outline</v-icon>
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
      </v-row>
    </div>

    <!-- Linguistic Profile Section -->
    <div ref="profileSection" style="margin-top: 10%;">
      <LinguisticProfileEmbedded />
    </div>
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

// Refs for scroll targets
const assignmentsSection = ref<HTMLElement | null>(null);
const profileSection = ref<HTMLElement | null>(null);

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

interface ActivityItem {
  type: 'conjugation' | 'game' | 'exercise' | 'vocab' | 'vocab_workout' | 'feedback' | 'profile_update' | 'assignment' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
}

// State
const loading = ref(true);
const error = ref<string | null>(null);
const allAssignments = ref<Assignment[]>([]);
const loadingActivity = ref(true);
const activityFeed = ref<ActivityItem[]>([]);

// Scroll functions with better offset
function scrollToAssignments() {
  if (assignmentsSection.value) {
    const element = assignmentsSection.value;
    const yOffset = -100; // Increased offset to show more above the section
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function scrollToProfile() {
  if (profileSection.value) {
    const element = profileSection.value;
    const yOffset = -100; // Increased offset to show more above the section
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

// Activity Feed Functions
function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    'conjugation': 'mdi-controller',
    'game': 'mdi-gamepad-circle',
    'exercise': 'mdi-weight-lifter',
    'vocab': 'mdi-card-text',
    'vocab_workout': 'mdi-cards-outline',
    'feedback': 'mdi-comment-alert',
    'profile_update': 'mdi-account-voice',
    'assignment': 'mdi-clipboard-check',
    'achievement': 'mdi-trophy-award',
  };
  return icons[type] || 'mdi-circle';
}

function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    'conjugation': 'blue',
    'game': 'purple',
    'exercise': 'orange',
    'vocab': 'green',
    'vocab_workout': 'teal',
    'feedback': 'red',
    'profile_update': 'indigo',
    'assignment': 'cyan',
    'achievement': 'amber',
  };
  return colors[type] || 'grey';
}

function getActivityLabel(type: string): string {
  const labels: Record<string, string> = {
    'conjugation': 'Conjugation',
    'game': 'Game',
    'exercise': 'Exercise',
    'vocab': 'Vocabulary',
    'vocab_workout': 'Vocab Workout',
    'feedback': 'Feedback',
    'profile_update': 'Profile',
    'assignment': 'Assignment',
    'achievement': 'Achievement',
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
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

async function fetchActivityFeed() {
  loadingActivity.value = true;
  const activities: ActivityItem[] = [];

  try {
    // Fetch from different APIs and combine
    
    // 1. Conjugation game sessions
    try {
      const conjResponse = await api.get('/conj-game-sessions/?limit=5');
      conjResponse.data.forEach((session: any) => {
        activities.push({
          type: 'conjugation',
          title: 'Practiced Conjugation on The Conjugator',
          description: `${session.correct_count || 0} correct answers`,
          timestamp: session.created_at || session.started_at,
        });
      });
    } catch (e) {
      console.log('Conjugation sessions not available');
    }

    // 2. Other game sessions
    try {
      const gamesResponse = await api.get('/other-games-sessions/?limit=5');
      gamesResponse.data.forEach((session: any) => {
        activities.push({
          type: 'game',
          title: `Played ${session.game_name || 'Grammar Game'}`,
          description: `Score: ${session.correct_count || 0} / ${session.total_rounds || 0}`,
          timestamp: session.created_at || session.started_at,
        });
      });
    } catch (e) {
      console.log('Other games not available');
    }

    // 3. Exercise sessions
    try {
      const exerciseResponse = await api.get('/exercise-sessions/?limit=5');
      exerciseResponse.data.forEach((session: any) => {
        activities.push({
          type: 'exercise',
          title: 'Grammar Exercises Completed',
          description: `Did grammar exercises for error ${session.error_code || 'Grammar practice'}`,
          timestamp: session.started_at,
        });
      });
    } catch (e) {
      console.log('Exercise sessions not available');
    }

    // 4. Vocab workout sessions
    try {
      const vocabWorkoutResponse = await api.get('/vocab-workout-sessions/?limit=5');
      vocabWorkoutResponse.data.forEach((session: any) => {
        activities.push({
          type: 'vocab_workout',
          title: 'Completed Vocab Workout',
          description: `Practiced vocabulary list ${session.list_key || ''}`,
          timestamp: session.started_at,
        });
      });
    } catch (e) {
      console.log('Vocab workout not available');
    }

    // 5. Assignments (completed)
    if (allAssignments.value.length > 0) {
      allAssignments.value
        .filter(a => a.status === 'completed' && a.completed_at)
        .slice(0, 5)
        .forEach(assignment => {
          activities.push({
            type: 'assignment',
            title: 'Completed Assignment',
            description: assignment.description,
            timestamp: assignment.completed_at!,
          });
        });
    }

    // 6. Feedback updates
    try {
      const feedbackResponse = await api.get('/feedback/?limit=3');
      feedbackResponse.data.forEach((feedback: any) => {
        activities.push({
          type: 'feedback',
          title: 'New Feedback Received',
          description: 'Your teacher added feedback on your work',
          timestamp: feedback.created_at || feedback.date,
        });
      });
    } catch (e) {
      console.log('Feedback not available');
    }

    // 7. Profile updates
    if (userStore.linguisticProfile?.last_assessed_at) {
      activities.push({
        type: 'profile_update',
        title: 'Linguistic Profile Updated',
        description: 'Your teacher updated your language profile',
        timestamp: userStore.linguisticProfile.last_assessed_at,
      });
    }

    // 8. Achievements
    try {
      const achievementsResponse = await api.get('/achievements/?limit=5');
      
      // Check if response has a 'results' array (paginated) or is a direct array
      const achievementsData = achievementsResponse.data.results || achievementsResponse.data;
      
      if (Array.isArray(achievementsData)) {
        achievementsData.forEach((achievement: any) => {
          activities.push({
            type: 'achievement',
            title: 'Achievement Unlocked',
            description: achievement.description || 'New achievement earned!',
            timestamp: achievement.achieved_on || achievement.unlocked_at || achievement.created_at,
          });
        });
      }
    } catch (e) {
      console.log('Achievements not available', e);
    }

    // Sort by timestamp (newest first) and limit to 30
    activityFeed.value = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 30);

  } catch (err: any) {
    console.error('Error fetching activity feed:', err);
  } finally {
    loadingActivity.value = false;
  }
}

function getScoreColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return '#grey';
  if (score >= 9) return '#4caf50';
  if (score >= 7) return '#2196f3';
  if (score >= 4) return '#ff9800';
  return '#f44336';
}

// Navigation functions
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

// Computed properties for assignments
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

const exerciseAssignments = computed(() => {
  return allAssignments.value.filter(a => a.task_type === 'exercise');
});
const exercisePendingAssignments = computed(() => exerciseAssignments.value.filter(a => a.status === 'pending'));
const exerciseCompletedAssignments = computed(() => exerciseAssignments.value.filter(a => a.status === 'completed'));
const exerciseCompletedCount = computed(() => exerciseCompletedAssignments.value.length);
const exercisePendingCount = computed(() => exercisePendingAssignments.value.length);

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

const completedCount = computed(() => {
  return allAssignments.value.filter(a => a.status === 'completed').length;
});

const pendingCount = computed(() => {
  return allAssignments.value.filter(a => a.status === 'pending').length;
});

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

onMounted(async () => {
  await fetchAssignments();
  await userStore.fetchLinguisticProfile();
  await fetchActivityFeed();
});
</script>

<style scoped>
/* Welcome Hero */
.welcome-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.welcome-hero::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%);
  transform: rotate(-10deg);
  pointer-events: none;
}

.welcome-hero > * {
  position: relative;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
}

.welcome-hero__icon {
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.2));
  opacity: 0.95;
}

/* Activity Card - Full height on left */
.activity-card {
  min-height: 480px;
  max-height: 480px;
  display: flex;
  flex-direction: column;
}

.activity-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.activity-list::-webkit-scrollbar {
  width: 8px;
}

.activity-list::-webkit-scrollbar-track {
  background: transparent;
}

.activity-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.activity-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.activity-item {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  transition: background 0.2s;
}

.activity-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

/* Action Cards - Stacked on right */
.action-card {
  min-height: 225px;
  transition: all 0.3s;
}

.clickable-card {
  cursor: pointer;
}

.clickable-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.profile-card-preview {
  background: linear-gradient(to bottom right, rgba(156, 39, 176, 0.05), rgba(103, 58, 183, 0.05));
}

/* Profile Mini Stats */
.profile-preview {
  background: rgba(0, 0, 0, 0.03);
  padding: 16px;
  border-radius: 12px;
}

.profile-mini-stat {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Assignments Header */
.assignments-header {
  background: linear-gradient(135deg, #ffb300 0%, #ffd54f 40%, #ff7043 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.assignments-header::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%);
  transform: rotate(-10deg);
  pointer-events: none;
}

.assignments-header > * {
  position: relative;
}

/* Assignment cards */
.assignment-card {
  height: 500px;
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

.linkish {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-thickness: 0.7px;
  text-underline-offset: 4px;
}

.linkish:focus {
  outline: 2px solid rgba(102, 126, 234, 0.5);
  outline-offset: 4px;
  border-radius: 6px;
}

@media (max-width: 960px) {
  .activity-card {
    min-height: 400px;
    max-height: 400px;
  }

  .action-card {
    min-height: 250px;
  }

  .assignment-card {
    height: 450px;
  }
}
</style>