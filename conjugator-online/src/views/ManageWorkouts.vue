<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-card class="pa-6 mb-6 workout-header" elevation="4" rounded="xl">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="text-h4 font-weight-bold text-white">Manage Student Workouts</div>
          <div class="text-subtitle-1 text-white text-opacity-90 mt-1">
            Create and manage practice drills for students
          </div>
        </div>
        <v-icon size="56" class="text-white">mdi-clipboard-text</v-icon>
      </div>
    </v-card>

    <!-- Student Selector -->
    <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
      <div class="text-h6 mb-4">Select Student</div>
      <v-autocomplete
        v-model="selectedStudentId"
        :items="students"
        item-title="display_name"
        item-value="id"
        label="Choose a student"
        prepend-icon="mdi-account"
        clearable
        :loading="loadingStudents"
        @update:model-value="onStudentSelected"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-avatar color="primary" size="40">
                <span class="text-white">{{ item.raw.initials }}</span>
              </v-avatar>
            </template>
            <template v-slot:subtitle>
              <span class="text-caption">{{ item.raw.web_id }}</span>
            </template>
          </v-list-item>
        </template>
      </v-autocomplete>
    </v-card>

    <!-- Current Workout Display -->
    <template v-if="selectedStudentId && currentWorkout">
      <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
        <div class="d-flex align-center justify-space-between mb-4">
          <div>
            <div class="text-h5 font-weight-bold">Current Workout</div>
            <div class="text-caption text-medium-emphasis">
              Created {{ formatDate(currentWorkout.created_at) }}
            </div>
          </div>
          <div class="d-flex gap-2">
            <v-btn
              color="secondary"
              variant="outlined"
              prepend-icon="mdi-library"
              @click="openWorkoutTemplateDialog"
            >
              Use Template
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              prepend-icon="mdi-plus"
              @click="openCreateWorkoutDialog"
            >
              Create Custom
            </v-btn>
          </div>
        </div>

        <!-- Workout Info -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="currentWorkout.focus_area"
              label="Focus Area"
              prepend-icon="mdi-target"
              variant="outlined"
              density="comfortable"
              @blur="updateWorkoutMetadata"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="currentWorkout.notes"
              label="Teacher Notes"
              prepend-icon="mdi-note-text"
              variant="outlined"
              rows="3"
              @blur="updateWorkoutMetadata"
            />
          </v-col>
        </v-row>

        <!-- Drills List -->
        <div class="text-h6 mb-3">
          Drills ({{ currentWorkout.drills.length }})
        </div>

        <v-expansion-panels variant="accordion">
          <v-expansion-panel
            v-for="(drill, index) in currentWorkout.drills"
            :key="drill.id || index"
          >
            <v-expansion-panel-title>
              <div class="d-flex align-items-center flex-grow-1">
                <v-chip
                  :color="getDrillTypeColor(drill.type)"
                  size="small"
                  class="mr-3"
                  variant="tonal"
                >
                  {{ drill.type }}
                </v-chip>
                <span class="font-weight-medium">{{ drill.name }}</span>
                <v-spacer />
                <v-chip
                  size="small"
                  :color="getProgressColor(drill)"
                  variant="tonal"
                  class="mr-2"
                >
                  {{ drill.completed_sessions }}/{{ drill.target_sessions || 0 }}
                </v-chip>
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="drill.name"
                    label="Drill Name"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="drill.description"
                    label="Description"
                    variant="outlined"
                    rows="2"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-select
                    v-model="drill.type"
                    :items="drillTypes"
                    label="Type"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="drill.target_reps"
                    label="Target Reps"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="drill.target_sessions"
                    label="Target Sessions"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="drill.completed_sessions"
                    label="Completed"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    @update:model-value="updateDrillProgress"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="drill.notes"
                    label="Progress Notes"
                    variant="outlined"
                    rows="2"
                    placeholder="Add observations about student's progress..."
                  />
                </v-col>
              </v-row>

              <!-- Drill Actions -->
              <div class="d-flex gap-2 mt-3">
                <v-btn
                  v-if="drill.question_url"
                  color="primary"
                  variant="elevated"
                  prepend-icon="mdi-open-in-new"
                  @click="openDrillQuestions(drill)"
                >
                  Open Drill Questions
                </v-btn>
                <v-btn
                  color="success"
                  variant="outlined"
                  prepend-icon="mdi-content-save"
                  @click="saveDrillChanges"
                >
                  Save Changes
                </v-btn>
                <v-spacer />
                <v-btn
                  color="error"
                  variant="text"
                  icon="mdi-delete"
                  @click="deleteDrill(index)"
                />
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Add Drill Button -->
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-plus"
          class="mt-4"
          block
          @click="openAddDrillDialog"
        >
          Add Drill from Library
        </v-btn>
      </v-card>

      <!-- Manual Achievements Section -->
      <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
        <div class="text-h5 font-weight-bold mb-4">
          <v-icon class="mr-2">mdi-trophy</v-icon>
          Award Manual Achievement
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="selectedAchievementCategory"
              :items="achievementCategories"
              label="Category"
              variant="outlined"
              density="comfortable"
              @update:model-value="onCategorySelected"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="selectedAchievementKey"
              :items="filteredAchievements"
              item-title="pretty_title"
              item-value="key"
              label="Achievement"
              variant="outlined"
              density="comfortable"
              :disabled="!selectedAchievementCategory"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:subtitle>
                    <span class="text-caption">{{ item.raw.description }}</span>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-col>
        </v-row>

        <v-btn
          color="amber"
          variant="elevated"
          prepend-icon="mdi-trophy"
          :disabled="!selectedAchievementKey"
          @click="awardAchievement"
        >
          Award Achievement
        </v-btn>

        <!-- Recent Achievements -->
        <div v-if="recentAchievements.length > 0" class="mt-6">
          <div class="text-h6 mb-3">Recent Achievements</div>
          <v-chip
            v-for="achievement in recentAchievements"
            :key="achievement.id"
            color="amber"
            variant="tonal"
            class="mr-2 mb-2"
          >
            <v-icon start>mdi-trophy</v-icon>
            {{ achievement.description }}
            <span class="text-caption ml-2">
              ({{ formatDate(achievement.achieved_on) }})
            </span>
          </v-chip>
        </div>
      </v-card>

      <!-- Workout History -->
      <v-card class="pa-6" elevation="2" rounded="lg">
        <div class="text-h5 font-weight-bold mb-4">Workout History</div>

        <v-list v-if="workoutHistory.length > 0">
          <v-list-item
            v-for="workout in workoutHistory"
            :key="workout.id"
            class="mb-2"
            rounded="lg"
            @click="viewHistoricalWorkout(workout)"
          >
            <template v-slot:prepend>
              <v-icon>mdi-history</v-icon>
            </template>
            <v-list-item-title>
              {{ workout.focus_area || 'No focus area' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ formatDate(workout.created_at) }} • {{ workout.drills.length }} drills
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <div v-else class="text-center text-medium-emphasis py-4">
          No workout history available
        </div>
      </v-card>
    </template>

    <!-- Empty State -->
    <v-card v-else-if="selectedStudentId && !loadingWorkout" class="pa-12" elevation="2" rounded="lg">
      <div class="text-center">
        <v-icon size="80" color="grey-lighten-1">mdi-clipboard-text-outline</v-icon>
        <div class="text-h6 mt-4 text-medium-emphasis">No Current Workout</div>
        <div class="text-body-2 text-medium-emphasis mb-4">
          This student doesn't have an active workout yet
        </div>
        <div class="d-flex gap-2 justify-center">
          <v-btn
            color="secondary"
            variant="outlined"
            prepend-icon="mdi-library"
            @click="openWorkoutTemplateDialog"
          >
            Use Template
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-plus"
            @click="openCreateWorkoutDialog"
          >
            Create Custom
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- Workout Template Selection Dialog -->
    <v-dialog v-model="workoutTemplateDialog" max-width="900" scrollable>
      <v-card rounded="lg">
        <v-card-title class="pa-6 bg-secondary">
          <span class="text-h5 text-white">Choose Workout Template</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- Filter by difficulty -->
          <v-chip-group
            v-model="selectedTemplateDifficulty"
            filter
            mandatory
            class="mb-4"
          >
            <v-chip value="all">All Levels</v-chip>
            <v-chip value="beginner">Beginner</v-chip>
            <v-chip value="intermediate">Intermediate</v-chip>
            <v-chip value="advanced">Advanced</v-chip>
          </v-chip-group>

          <!-- Workout Template Cards -->
          <v-row>
            <v-col
              v-for="template in filteredWorkoutTemplates"
              :key="template.id"
              cols="12"
              md="6"
            >
              <v-card
                variant="outlined"
                :class="{ 'selected-template': selectedWorkoutTemplate?.id === template.id }"
                class="workout-template-card"
                @click="selectWorkoutTemplate(template)"
              >
                <v-card-title class="d-flex align-center">
                  {{ template.name }}
                  <v-spacer />
                  <v-chip
                    :color="getDifficultyColor(template.difficulty)"
                    size="small"
                    variant="tonal"
                  >
                    {{ template.difficulty }}
                  </v-chip>
                </v-card-title>
                <v-card-subtitle class="mt-1">
                  {{ template.description }}
                </v-card-subtitle>
                <v-card-text>
                  <div class="text-caption mb-2">
                    <v-icon size="small" class="mr-1">mdi-target</v-icon>
                    {{ template.focus_area }}
                  </div>
                  <div class="text-caption mb-2">
                    <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                    {{ template.estimated_duration }}
                  </div>
                  <div class="text-caption">
                    <v-icon size="small" class="mr-1">mdi-format-list-bulleted</v-icon>
                    {{ template.drill_ids.length }} drills
                  </div>

                  <!-- Preview drills -->
                  <div class="mt-3">
                    <div class="text-caption font-weight-bold mb-1">Includes:</div>
                    <v-chip
                      v-for="drillId in template.drill_ids.slice(0, 3)"
                      :key="drillId"
                      size="x-small"
                      class="mr-1 mb-1"
                      variant="tonal"
                    >
                      {{ getDrillById(drillId)?.name || drillId }}
                    </v-chip>
                    <span v-if="template.drill_ids.length > 3" class="text-caption">
                      +{{ template.drill_ids.length - 3 }} more
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer />
          <v-btn variant="text" @click="closeWorkoutTemplateDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :disabled="!selectedWorkoutTemplate"
            @click="createWorkoutFromTemplate"
          >
            Use This Template
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Drill from Library Dialog -->
    <v-dialog v-model="addDrillDialog" max-width="900" scrollable>
      <v-card rounded="lg">
        <v-card-title class="pa-6 bg-primary">
          <span class="text-h5 text-white">Add Drill from Library</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- Filter controls -->
          <v-row class="mb-4">
            <v-col cols="12" md="4">
              <v-select
                v-model="drillFilterCategory"
                :items="['All Categories', ...allCategories]"
                label="Category"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="drillFilterType"
                :items="['All Types', ...drillTypes]"
                label="Type"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="drillFilterDifficulty"
                :items="['All Levels', 'beginner', 'intermediate', 'advanced']"
                label="Difficulty"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <!-- Drill Template Cards -->
          <v-row>
            <v-col
              v-for="drill in filteredDrillTemplates"
              :key="drill.id"
              cols="12"
            >
              <v-card
                variant="outlined"
                class="drill-template-card"
                :class="{ 'selected-drill': selectedDrillTemplate?.id === drill.id }"
                @click="selectDrillTemplate(drill)"
              >
                <v-card-text>
                  <div class="d-flex align-center mb-2">
                    <v-chip
                      :color="getDrillTypeColor(drill.type)"
                      size="small"
                      variant="tonal"
                      class="mr-2"
                    >
                      {{ drill.type }}
                    </v-chip>
                    <v-chip
                      :color="getDifficultyColor(drill.difficulty)"
                      size="small"
                      variant="tonal"
                      class="mr-2"
                    >
                      {{ drill.difficulty }}
                    </v-chip>
                    <v-chip size="small" variant="text" class="mr-2">
                      {{ drill.category }}
                    </v-chip>
                  </div>
                  
                  <div class="text-h6 mb-2">{{ drill.name }}</div>
                  <div class="text-body-2 text-medium-emphasis mb-2">
                    {{ drill.description }}
                  </div>
                  
                  <div class="d-flex gap-3 text-caption">
                    <span>
                      <v-icon size="small" class="mr-1">mdi-repeat</v-icon>
                      {{ drill.target_reps }} reps
                    </span>
                    <span>
                      <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                      {{ drill.target_sessions }} sessions
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer />
          <v-btn variant="text" @click="closeAddDrillDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :disabled="!selectedDrillTemplate"
            @click="addDrillFromTemplate"
          >
            Add Drill
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Custom Workout Dialog -->
    <v-dialog v-model="createWorkoutDialog" max-width="800" persistent scrollable>
      <v-card rounded="lg">
        <v-card-title class="pa-6 bg-primary">
          <span class="text-h5 text-white">Create Custom Workout</span>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="newWorkout.focus_area"
                label="Focus Area"
                prepend-icon="mdi-target"
                variant="outlined"
                placeholder="e.g., Pronunciation & Fluency"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="newWorkout.notes"
                label="Teacher Notes"
                prepend-icon="mdi-note-text"
                variant="outlined"
                rows="3"
                placeholder="What should the student focus on?"
              />
            </v-col>
          </v-row>

          <!-- New Workout Drills -->
          <div class="text-h6 mb-3">Drills</div>

          <v-card
            v-for="(drill, index) in newWorkout.drills"
            :key="index"
            class="mb-4 pa-4"
            variant="outlined"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="drill.name"
                  label="Drill Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="drill.description"
                  label="Description"
                  variant="outlined"
                  rows="2"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-select
                  v-model="drill.type"
                  :items="drillTypes"
                  label="Type"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  v-model.number="drill.target_reps"
                  label="Target Reps"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  v-model.number="drill.target_sessions"
                  label="Target Sessions"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  color="error"
                  variant="text"
                  icon="mdi-delete"
                  @click="removeNewDrill(index)"
                />
              </v-col>
            </v-row>
          </v-card>

          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-library"
            block
            class="mb-2"
            @click="openAddDrillDialogFromCreate"
          >
            Add from Library
          </v-btn>
          
          <v-btn
            color="secondary"
            variant="outlined"
            prepend-icon="mdi-plus"
            block
            @click="addNewWorkoutDrill"
          >
            Add Custom Drill
          </v-btn>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer />
          <v-btn variant="text" @click="closeCreateWorkoutDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :disabled="!canCreateWorkout"
            @click="createWorkout"
          >
            Create Workout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading Overlay -->
    <v-overlay v-model="saving" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64" />
      <div class="text-h6 mt-4">Saving...</div>
    </v-overlay>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import api from '@/axios';
import {
  drillTemplates,
  workoutTemplates,
  getDrillById,
  getAllCategories,
  getDrillsByCategory,
  getDrillsByType,
  getDrillsByDifficulty,
  getWorkoutsByDifficulty,
  drillTemplateToWorkoutDrill,
  workoutTemplateToApiFormat,
  type DrillTemplate,
  type WorkoutTemplate,
} from '@/assets/data/drillsDataSource';

// Types
interface Student {
  id: number;
  initials: string;
  web_id: string;
  display_name?: string;
}

interface WorkoutDrill {
  id?: number;
  type: string;
  name: string;
  description: string;
  target_reps: number | null;
  target_sessions: number | null;
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

interface Achievement {
  id: number;
  criteria_key: string;
  description: string;
  achieved_on: string;
  manually_created: boolean;
}

// Store
const userStore = useUserStore();

// State
const students = ref<Student[]>([]);
const loadingStudents = ref(false);
const selectedStudentId = ref<number | null>(null);
const currentWorkout = ref<Workout | null>(null);
const workoutHistory = ref<Workout[]>([]);
const loadingWorkout = ref(false);
const saving = ref(false);

// Snackbar
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

// Create Workout Dialog
const createWorkoutDialog = ref(false);
const newWorkout = ref({
  focus_area: '',
  notes: '',
  drills: [] as WorkoutDrill[],
});

// Workout Template Dialog
const workoutTemplateDialog = ref(false);
const selectedWorkoutTemplate = ref<WorkoutTemplate | null>(null);
const selectedTemplateDifficulty = ref<string>('all');

// Add Drill Dialog
const addDrillDialog = ref(false);
const selectedDrillTemplate = ref<DrillTemplate | null>(null);
const drillFilterCategory = ref('All Categories');
const drillFilterType = ref('All Types');
const drillFilterDifficulty = ref('All Levels');
const isAddingToNewWorkout = ref(false);

// Drill Types
const drillTypes = [
  'pronunciation',
  'conjugation',
  'vocabulary',
  'grammar',
  'fluency',
  'listening',
  'other',
];

// All Categories from data source
const allCategories = getAllCategories();

// Achievements
const recentAchievements = ref<Achievement[]>([]);
const selectedAchievementCategory = ref<string | null>(null);
const selectedAchievementKey = ref<string | null>(null);

// Achievement Definitions
const achievementDefinitions: Record<string, { pretty_title: string; description: string; category: string }> = {
  "compound_nouns": {
    "pretty_title": "Compound nouns",
    "description": "Use compound nouns correctly (instead of unnecessary prepositions or possessives)",
    "category": "Nouns"
  },
  "countable_nouns": {
    "pretty_title": "Countable nouns",
    "description": "Use countable nouns correctly (avoiding describing them as units or plurals)",
    "category": "Nouns"
  },
  "uncountable_nouns": {
    "pretty_title": "Uncountable nouns",
    "description": "Use uncountable nouns correctly",
    "category": "Nouns"
  },
  "quantify_countable": {
    "pretty_title": "Quantifying countable nouns",
    "description": "Quantify countable nouns correctly with several, many and few",
    "category": "Nouns"
  },
  "quantify_uncountable": {
    "pretty_title": "Quantifying uncountable nouns",
    "description": "Quantify uncountable nouns correctly with much and little",
    "category": "Nouns"
  },
  "numbers": {
    "pretty_title": "Numbers",
    "description": "Use numbers correctly, including large numbers",
    "category": "Adjectives and adverbs"
  },
  "well_vs_good": {
    "pretty_title": "Well vs Good",
    "description": "Use well vs good correctly",
    "category": "Adjectives and adverbs"
  },
  "good_vs_right": {
    "pretty_title": "Good vs Right",
    "description": "Use good vs right correctly",
    "category": "Adjectives and adverbs"
  },
  "since_vs_for": {
    "pretty_title": "Since vs For",
    "description": "Use since and for appropriately for unfinished periods with the present perfect tense",
    "category": "Adjectives and adverbs"
  },
  "still_anymore": {
    "pretty_title": "Still and anymore",
    "description": "Use still and anymore correctly",
    "category": "Adjectives and adverbs"
  },
  "comparative_superlative": {
    "pretty_title": "Comparative and Superlative",
    "description": "Use the comparative and superlative form correctly",
    "category": "Adjectives and adverbs"
  },
  "the_more_the_more": {
    "pretty_title": "The more, the more",
    "description": "Use 'the more..., the more...' correctly",
    "category": "Adjectives and adverbs"
  },
  "so_vs_such": {
    "pretty_title": "So vs Such",
    "description": "Use so and such for intensification",
    "category": "Adjectives and adverbs"
  },
  "third_person_s": {
    "pretty_title": "-s endings in 3rd person",
    "description": "Be consistently accurate with -s endings in 3rd person (he, she it) conjugations in the present simple",
    "category": "Verb conjugation"
  },
  "past_simple_negative": {
    "pretty_title": "Past simple negatives",
    "description": "Be consistently accurate with past simple negative sentences",
    "category": "Verb conjugation"
  },
  "past_simple_questions": {
    "pretty_title": "Past simple questions",
    "description": "Be consistently accurate with past simple questions",
    "category": "Verb conjugation"
  },
  "question_forms": {
    "pretty_title": "Question forms",
    "description": "Be consistently accurate with question forms",
    "category": "Verb conjugation"
  },
  "irregular_verbs_20": {
    "pretty_title": "20+ irregular verbs",
    "description": "Use 20+ irregular verbs",
    "category": "Verb conjugation"
  },
  "irregular_verbs_30": {
    "pretty_title": "30+ irregular verbs",
    "description": "Use 30+ irregular verbs",
    "category": "Verb conjugation"
  },
  "irregular_verbs_50": {
    "pretty_title": "50+ irregular verbs",
    "description": "Use 50+ irregular verbs",
    "category": "Verb conjugation"
  },
  "present_perfect": {
    "pretty_title": "Present perfect for unfinished time",
    "description": "Use the present perfect tense to talk about unfinished time (rather than simplifying with present simple or other tenses)",
    "category": "Verb tenses"
  },
  "narrative_tenses": {
    "pretty_title": "Narrative tenses",
    "description": "Tell a complete anecdote using the narrative tenses + present perfect",
    "category": "Verb tenses"
  },
  "past_modals_criticism": {
    "pretty_title": "Past modals for criticism",
    "description": "Use past modals for criticism (should and could)",
    "category": "Advanced modal verbs"
  },
  "ability_obligation": {
    "pretty_title": "Ability and obligation",
    "description": "Talk about ability and obligation in the past and future",
    "category": "Advanced modal verbs"
  },
    "deduction": {
    "pretty_title": "Deduction and guessing with might and must",
    "description": "Make deductions and guesses using the past form of might and must",
    "category": "Advanced modal verbs"
  },
  "past_future_would": {
    "pretty_title": "Past's future with would",
    "description": "Describe the past's future using would",
    "category": "Advanced modal verbs"
  },
  "third_conditional": {
    "pretty_title": "3rd conditional",
    "description": "Describe imagined alternative scenarios in the past (3rd conditional)",
    "category": "Advanced modal verbs"
  },
  "linking_structures": {
    "pretty_title": "Structured linking",
    "description": "Create structured sequences of arguments using a variety of linking words",
    "category": "Linking words"
  },
  "linking_expansion": {
    "pretty_title": "Linking for expansion",
    "description": "Expand, exemplify and develop arguments using variety of linking words",
    "category": "Linking words"
  },
  "linking_contrast": {
    "pretty_title": "Contrast linking",
    "description": "Make elegant thematic transitions using contrast or counter-expectation linking words",
    "category": "Linking words"
  },
  "linking_conclusions": {
    "pretty_title": "Linking for conclusions",
    "description": "Draw conclusions using linking words",
    "category": "Linking words"
  },
  "linking_balance": {
    "pretty_title": "Balanced linking",
    "description": "Balance positive and negative points using contrast or counter-expectation linking words",
    "category": "Linking words"
  },
  "recommendation_reporting": {
    "pretty_title": "Recommendation and reporting verbs",
    "description": "Use verbs for recommendation and reporting in a natural way",
    "category": "Sentence structure"
  },
  "prepositions_end": {
    "pretty_title": "Prepositions at end",
    "description": "Place prepositions at the end of questions and relative clauses",
    "category": "Sentence structure"
  },
  "indirect_questions": {
    "pretty_title": "Indirect questions",
    "description": "Use indirect questions correctly",
    "category": "Sentence structure"
  },
  "cleft_sentences": {
    "pretty_title": "Cleft sentences",
    "description": "Use cleft sentences as a strategy for clear communication",
    "category": "Sentence structure"
  },
  "correlatives": {
    "pretty_title": "Correlatives",
    "description": "Use correlatives to make impactful sentences",
    "category": "Sentence structure"
  },
  "inversion": {
    "pretty_title": "Inversion",
    "description": "Use inversion to make impactful sentences",
    "category": "Sentence structure"
  },
  "possessive_pronouns": {
    "pretty_title": "Possessive pronouns",
    "description": "Be consistently accurate with possessive adjectives and pronouns",
    "category": "Pronouns and possessive -s"
  },
  "reflexive_pronouns": {
    "pretty_title": "Reflexive pronouns",
    "description": "Use reflexive pronouns",
    "category": "Pronouns and possessive -s"
  },
  "relative_pronouns": {
    "pretty_title": "Relative pronouns",
    "description": "Be consistently accurate in the use of relative pronouns",
    "category": "Pronouns and possessive -s"
  },
  "whose_usage": {
    "pretty_title": "Whose",
    "description": "Ability to use 'whose'",
    "category": "Pronouns and possessive -s"
  },
  "simple_passive": {
    "pretty_title": "Simple passive",
    "description": "Consistent accuracy using the present simple and past simple passive",
    "category": "Passive"
  },
  "complex_passive": {
    "pretty_title": "Complex passive",
    "description": "Consistent accuracy using the passive forms of present continuous, present perfect and other tenses or modalities",
    "category": "Passive"
  },
  "verb_complements": {
    "pretty_title": "Verb complements",
    "description": "Consistent accuracy in the use of verb complements (with 10+ verbs)",
    "category": "Verb complements"
  },
  "negative_complements": {
    "pretty_title": "Negative complements",
    "description": "Correct use of negative complements",
    "category": "Verb complements"
  },
  "want_structure": {
    "pretty_title": "Want structure",
    "description": "Use a natural sentence structure with the verb 'want'",
    "category": "Verb complements"
  },
  "look_forward_used_to": {
    "pretty_title": "Look forward to / be used to",
    "description": "Uses the expressions look forward to and be/get used to correctly",
    "category": "Verb complements"
  },
  "possessive_s": {
    "pretty_title": "Possessive -s",
    "description": "Use possessive -s when appropriate to avoid overuse of 'of'",
    "category": "Pronouns and possessive -s"
  },
  "echo_questions": {
    "pretty_title": "Echo questions",
    "description": "Use echo questions to show interest or skepticism",
    "category": "Discourse markers"
  },
  "so_neither_agreement": {
    "pretty_title": "Agreement with so/neither",
    "description": "Agree with so and neither",
    "category": "Discourse markers"
  },
  "tag_questions": {
    "pretty_title": "Tag questions",
    "description": "Use tag questions to signal a willingness to interact",
    "category": "Discourse markers"
  },
  "pronounce_s": {
    "pretty_title": "Pronounce -s endings",
    "description": "Pronounce -s endings with consistency",
    "category": "Pronunciation"
  },
  "pronounce_es": {
    "pretty_title": "Pronounce -es endings",
    "description": "Pronounce -es endings with consistency",
    "category": "Pronunciation"
  },
  "pronounce_ed": {
    "pretty_title": "Pronounce -ed endings",
    "description": "Pronounce -ed endings with consistent accuracy",
    "category": "Pronunciation"
  },
  "pronounce_ght": {
    "pretty_title": "Pronounce -ght endings",
    "description": "Pronounce -ght endings with consistent accuracy",
    "category": "Pronunciation"
  }
};

// Achievement Categories
const achievementCategories = computed(() => {
  const categories = new Set<string>();
  Object.values(achievementDefinitions).forEach(a => categories.add(a.category));
  return Array.from(categories).sort();
});

// Filtered Achievements
const filteredAchievements = computed(() => {
  if (!selectedAchievementCategory.value) return [];
  
  return Object.entries(achievementDefinitions)
    .filter(([_, def]) => def.category === selectedAchievementCategory.value)
    .map(([key, def]) => ({
      key,
      ...def,
    }));
});

// Filtered Workout Templates
const filteredWorkoutTemplates = computed(() => {
  if (selectedTemplateDifficulty.value === 'all') {
    return workoutTemplates;
  }
  return getWorkoutsByDifficulty(selectedTemplateDifficulty.value as 'beginner' | 'intermediate' | 'advanced');
});

// Filtered Drill Templates
const filteredDrillTemplates = computed(() => {
  let filtered = [...drillTemplates];

  if (drillFilterCategory.value !== 'All Categories') {
    filtered = getDrillsByCategory(drillFilterCategory.value);
  }

  if (drillFilterType.value !== 'All Types') {
    filtered = filtered.filter(d => d.type === drillFilterType.value);
  }

  if (drillFilterDifficulty.value !== 'All Levels') {
    filtered = filtered.filter(d => d.difficulty === drillFilterDifficulty.value);
  }

  return filtered;
});

// Computed
const canCreateWorkout = computed(() => {
  return newWorkout.value.focus_area.trim().length > 0 &&
         newWorkout.value.drills.length > 0 &&
         newWorkout.value.drills.every(d => d.name.trim().length > 0);
});

// Lifecycle
onMounted(async () => {
  await fetchStudents();
});

// Methods
async function fetchStudents() {
  loadingStudents.value = true;
  try {
    const response = await api.get<Student[]>('/students/');
    students.value = response.data.map(s => ({
      ...s,
      display_name: `${s.initials} (${s.web_id})`,
    }));
  } catch (error) {
    console.error('Failed to fetch students:', error);
    showSnackbar('Failed to fetch students', 'error');
  } finally {
    loadingStudents.value = false;
  }
}

async function onStudentSelected(studentId: number | null) {
  if (!studentId) {
    currentWorkout.value = null;
    workoutHistory.value = [];
    recentAchievements.value = [];
    return;
  }

  loadingWorkout.value = true;
  
  try {
    // Fetch current workout
    try {
      const workoutResponse = await api.get<Workout>(`/workouts/current/${studentId}/`);
      currentWorkout.value = workoutResponse.data;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        currentWorkout.value = null;
      } else {
        throw err;
      }
    }

    // Fetch workout history
    const historyResponse = await api.get<Workout[]>(`/workouts/by_student/${studentId}/`);
    workoutHistory.value = historyResponse.data.filter(w => !w.is_current);

    // Fetch recent achievements
    const achievementsResponse = await api.get<Achievement[]>(`/achievements/?student=${studentId}`);
    recentAchievements.value = achievementsResponse.data
      .filter(a => a.manually_created)
      .sort((a, b) => new Date(b.achieved_on).getTime() - new Date(a.achieved_on).getTime())
      .slice(0, 10);

  } catch (error) {
    console.error('Failed to fetch student data:', error);
    showSnackbar('Failed to load student data', 'error');
  } finally {
    loadingWorkout.value = false;
  }
}

function openWorkoutTemplateDialog() {
  selectedWorkoutTemplate.value = null;
  selectedTemplateDifficulty.value = 'all';
  workoutTemplateDialog.value = true;
}

function closeWorkoutTemplateDialog() {
  workoutTemplateDialog.value = false;
  selectedWorkoutTemplate.value = null;
}

function selectWorkoutTemplate(template: WorkoutTemplate) {
  selectedWorkoutTemplate.value = template;
}

async function createWorkoutFromTemplate() {
  if (!selectedStudentId.value || !selectedWorkoutTemplate.value) return;

  saving.value = true;
  try {
    const workoutData = workoutTemplateToApiFormat(
      selectedWorkoutTemplate.value,
      selectedStudentId.value
    );

    const response = await api.post<Workout>('/workouts/', workoutData);
    currentWorkout.value = response.data;
    
    showSnackbar(`Workout "${selectedWorkoutTemplate.value.name}" created successfully`, 'success');
    closeWorkoutTemplateDialog();
    
    // Refresh history
    await onStudentSelected(selectedStudentId.value);
  } catch (error) {
    console.error('Failed to create workout from template:', error);
    showSnackbar('Failed to create workout', 'error');
  } finally {
    saving.value = false;
  }
}

function openCreateWorkoutDialog() {
  newWorkout.value = {
    focus_area: '',
    notes: '',
    drills: [],
  };
  createWorkoutDialog.value = true;
}

function closeCreateWorkoutDialog() {
  createWorkoutDialog.value = false;
}

function openAddDrillDialog() {
  isAddingToNewWorkout.value = false;
  drillFilterCategory.value = 'All Categories';
  drillFilterType.value = 'All Types';
  drillFilterDifficulty.value = 'All Levels';
  selectedDrillTemplate.value = null;
  addDrillDialog.value = true;
}

function openAddDrillDialogFromCreate() {
  isAddingToNewWorkout.value = true;
  drillFilterCategory.value = 'All Categories';
  drillFilterType.value = 'All Types';
  drillFilterDifficulty.value = 'All Levels';
  selectedDrillTemplate.value = null;
  addDrillDialog.value = true;
}

function closeAddDrillDialog() {
  addDrillDialog.value = false;
  selectedDrillTemplate.value = null;
}

function selectDrillTemplate(template: DrillTemplate) {
  selectedDrillTemplate.value = template;
}

function addDrillFromTemplate() {
  if (!selectedDrillTemplate.value) return;

  const drill = drillTemplateToWorkoutDrill(selectedDrillTemplate.value);

  if (isAddingToNewWorkout.value) {
    // Adding to new workout being created
    newWorkout.value.drills.push(drill);
  } else {
    // Adding to existing current workout
    if (currentWorkout.value) {
      currentWorkout.value.drills.push(drill);
      saveDrillChanges();
    }
  }

  closeAddDrillDialog();
  showSnackbar(`Added drill: ${selectedDrillTemplate.value.name}`, 'success');
}

function addNewWorkoutDrill() {
  newWorkout.value.drills.push({
    type: 'pronunciation',
    name: '',
    description: '',
    target_reps: 10,
    target_sessions: 3,
    completed_sessions: 0,
    notes: '',
  });
}

function removeNewDrill(index: number) {
  newWorkout.value.drills.splice(index, 1);
}

async function createWorkout() {
  if (!selectedStudentId.value) return;

  saving.value = true;
  try {
    const workoutData = {
      student: selectedStudentId.value,
      focus_area: newWorkout.value.focus_area,
      notes: newWorkout.value.notes,
      drills: newWorkout.value.drills.map((drill, index) => ({
        id: index + 1,
        ...drill,
      })),
    };

    const response = await api.post<Workout>('/workouts/', workoutData);
    currentWorkout.value = response.data;
    
    showSnackbar('Workout created successfully', 'success');
    closeCreateWorkoutDialog();
    
    // Refresh history
    await onStudentSelected(selectedStudentId.value);
  } catch (error) {
    console.error('Failed to create workout:', error);
    showSnackbar('Failed to create workout', 'error');
  } finally {
    saving.value = false;
  }
}

async function updateWorkoutMetadata() {
  if (!currentWorkout.value) return;

  saving.value = true;
  try {
    await api.patch(`/workouts/${currentWorkout.value.id}/`, {
      focus_area: currentWorkout.value.focus_area,
      notes: currentWorkout.value.notes,
    });
    
    showSnackbar('Workout updated', 'success');
  } catch (error) {
    console.error('Failed to update workout:', error);
    showSnackbar('Failed to update workout', 'error');
  } finally {
    saving.value = false;
  }
}

function deleteDrill(index: number) {
  if (!currentWorkout.value) return;
  
  if (confirm('Are you sure you want to delete this drill?')) {
    currentWorkout.value.drills.splice(index, 1);
    saveDrillChanges();
  }
}

async function saveDrillChanges() {
  if (!currentWorkout.value) return;

  saving.value = true;
  try {
    await api.post(`/workouts/${currentWorkout.value.id}/update_progress/`, {
      drills: currentWorkout.value.drills,
    });
    
    showSnackbar('Drills updated successfully', 'success');
  } catch (error) {
    console.error('Failed to save drills:', error);
    showSnackbar('Failed to save drills', 'error');
  } finally {
    saving.value = false;
  }
}

function updateDrillProgress() {
  // Auto-save after a delay
  setTimeout(() => {
    saveDrillChanges();
  }, 1000);
}

function openDrillQuestions(drill: WorkoutDrill) {
  // Open drill questions in new tab
  if (drill.question_url) {
    window.open(drill.question_url, '_blank');
  } else {
    const url = `/drill-questions?type=${drill.type}&name=${encodeURIComponent(drill.name)}`;
    window.open(url, '_blank');
  }
}

async function awardAchievement() {
  if (!selectedStudentId.value || !selectedAchievementKey.value) return;

  saving.value = true;
  try {
    const achievementDef = achievementDefinitions[selectedAchievementKey.value];
    
    const response = await api.post('/achievements/', {
      student: selectedStudentId.value,
      criteria_key: selectedAchievementKey.value,
      description: achievementDef.pretty_title,
      manually_created: true,
    });

    recentAchievements.value.unshift(response.data);
    
    showSnackbar(`Achievement awarded: ${achievementDef.pretty_title}`, 'success');
    
    // Reset selection
    selectedAchievementKey.value = null;
    selectedAchievementCategory.value = null;
  } catch (error: any) {
    console.error('Failed to award achievement:', error);
    const message = error?.response?.data?.detail || 'Failed to award achievement';
    showSnackbar(message, 'error');
  } finally {
    saving.value = false;
  }
}

function onCategorySelected() {
  selectedAchievementKey.value = null;
}

function viewHistoricalWorkout(workout: Workout) {
  // Could open in a modal or expand inline
  console.log('View historical workout:', workout);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDrillTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'pronunciation': 'blue',
    'conjugation': 'purple',
    'vocabulary': 'green',
    'grammar': 'orange',
    'fluency': 'teal',
    'listening': 'pink',
    'other': 'grey',
  };
  return colors[type] || 'grey';
}

function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    'beginner': 'success',
    'intermediate': 'warning',
    'advanced': 'error',
  };
  return colors[difficulty] || 'grey';
}

function getProgressColor(drill: WorkoutDrill): string {
  if (!drill.target_sessions) return 'grey';
  const percentage = (drill.completed_sessions / drill.target_sessions) * 100;
  if (percentage >= 100) return 'success';
  if (percentage >= 50) return 'warning';
  return 'error';
}

function showSnackbar(message: string, color: string = 'success') {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}
</script>

<style scoped>
.workout-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.workout-header::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%);
  transform: rotate(-10deg);
  pointer-events: none;
}

.workout-header > * {
  position: relative;
}

.workout-template-card {
  cursor: pointer;
  transition: all 0.2s;
}

.workout-template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.selected-template {
  border: 2px solid rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.drill-template-card {
  cursor: pointer;
  transition: all 0.2s;
}

.drill-template-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selected-drill {
  border: 2px solid rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>