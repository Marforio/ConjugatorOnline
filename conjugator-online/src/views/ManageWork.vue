<template>
  <v-container fluid class="mt-5 pa-4 px-6 text-slate-800 bg-slate-50 min-vh-100">
    <v-row class="mb-2 align-center">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-black text-slate-900 d-flex align-center">
          <v-icon icon="mdi-tray-full" color="indigo" class="mr-5" />
          Manage Student Tasks
        </h1>
        <p class="text-caption text-slate-500 mt-1">
          Create assignments (app challenges) or workouts (in-class routines) for individual students or entire courses. Track progress and completion.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-5 mb-6 border bg-white" rounded="lg" elevation="0">
          <div class="text-subtitle-2 font-weight-bold mb-3 text-slate-500 uppercase tracking-wider">Give work to:</div>
          
          <v-btn-toggle
            v-model="targetScope"
            mandatory
            color="indigo-darken-1"
            variant="outlined"
            class="w-100 mb-4"
          >
            <v-btn value="student" class="flex-grow-1 text-none font-weight-medium">
              <v-icon start>mdi-account</v-icon> Single Student
            </v-btn>
            <v-btn value="course" class="flex-grow-1 text-none font-weight-medium">
              <v-icon start>mdi-school</v-icon> Entire Course
            </v-btn>
          </v-btn-toggle>

          <v-autocomplete
            v-if="targetScope === 'student'"
            v-model="selectedStudentId"
            :items="studentsList"
            item-title="display_name"
            item-value="id"
            label="Select a student"
            prepend-inner-icon="mdi-account-search"
            variant="outlined"
            density="comfortable"
            clearable
            @update:model-value="onStudentChanged"
          />

          <v-select
            v-else
            v-model="selectedCourseId"
            :items="uniqueCourses"
            item-title="title"  item-value="value"  label="Select course"
            prepend-inner-icon="mdi-book-open-variant"
            variant="outlined"
            density="comfortable"
            clearable
            @update:model-value="onCourseChanged"
          />
        </v-card>

        <v-card
          class="pa-5 border bg-white"
          rounded="lg"
          elevation="0"
          :disabled="targetScope === 'student' ? !selectedStudentId : !selectedCourseId"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-subtitle-1 font-weight-bold text-slate-900">
              <v-icon start size="20" color="indigo">mdi-controller-classic</v-icon>
              Assignments (on the app)
            </div>
            <v-chip size="x-small" color="indigo" variant="flat" class="text-white font-weight-bold">Self Study</v-chip>
          </div>

          <v-autocomplete
            v-model="selectedTemplatesList"
            :items="assignmentTemplates"
            item-title="description"
            return-object
            multiple
            chips
            closable-chips
            label="Select Objectives (Multi-select)"
            variant="outlined"
            density="comfortable"
          />

          <v-btn
            color="indigo-darken-1"
            block
            rounded="lg"
            class="text-none font-weight-bold mt-2"
            :disabled="selectedTemplatesList.length === 0"
            :loading="dispatching"
            @click="issueAssignmentTask"
          >
            Give {{ selectedTemplatesList.length }} Assignment{{ selectedTemplatesList.length > 1 ? 's' : '' }}
          </v-btn>
        </v-card>

        <v-card
          class="pa-5 mb-6 border bg-slate-50"
          rounded="lg"
          elevation="0"
          :disabled="targetScope !== 'student' || !selectedStudentId"
        >
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-subtitle-1 font-weight-bold text-slate-900">
              <v-icon start size="20" color="teal">mdi-clipboard-text</v-icon>
              Workouts (in-class routines)
            </div>
            <v-chip size="x-small" color="teal" variant="flat" class="text-white font-weight-bold">Live Drills</v-chip>
          </div>
          <div class="text-caption text-slate-500 mb-4">
            Configure live lesson tracks. Deploying will automatically archive any old active workout for this student.
          </div>

          <v-btn
            color="teal-darken-1"
            variant="tonal"
            block
            size="small"
            prepend-icon="mdi-folder-text-outline"
            class="text-none font-weight-bold mb-4 rounded-lg"
            @click="openTemplateDialog"
          >
            Load Preset Template Blueprint
          </v-btn>

          <v-text-field 
            v-model="newWorkout.focus_area" 
            label="Focus Area Title" 
            placeholder="e.g., Fluency Flow" 
            variant="outlined" 
            density="comfortable" 
          />
          
          <v-textarea 
            v-model="newWorkout.notes" 
            label="Teacher Setup/Pedagogical Intent Notes" 
            placeholder="Why this workout? What strategy boundaries apply?"
            variant="outlined" 
            rows="2" 
            density="comfortable" 
          />

          <div v-if="newWorkout.drills.length > 0" class="ga-3 d-flex flex-column mb-4">
            <div v-for="(drill, idx) in newWorkout.drills" :key="idx" class="border pa-3 rounded-lg bg-white position-relative shadow-sm">
              <v-text-field v-model="drill.name" label="Drill Name" variant="underlined" density="compact" hide-details class="mb-1 font-weight-bold" />
              <v-textarea v-model="drill.description" label="Drill Description" variant="underlined" density="compact" rows="1" auto-grow hide-details class="text-caption text-slate-600 mb-2" />
              
              <v-row dense class="mt-1">
                <v-col cols="12" sm="4">
                  <v-select v-model="drill.type" :items="['pronunciation', 'conjugation', 'vocabulary', 'grammar', 'fluency', 'listening', 'other']" label="Type" variant="outlined" density="compact" hide-details />
                </v-col>
                <v-col cols="6" sm="4">
                  <v-text-field v-model.number="drill.target_reps" label="Target Reps" type="number" variant="outlined" density="compact" hide-details />
                </v-col>
                <v-col cols="6" sm="4">
                  <v-text-field v-model.number="drill.target_sessions" label="Target Sessions" type="number" variant="outlined" density="compact" hide-details />
                </v-col>
              </v-row>
              
              <v-btn icon="mdi-delete-outline" size="x-small" variant="text" color="red-lighten-1" class="position-absolute" style="top: 2px; right: 2px;" @click="removeNewDrill(idx)" />
            </div>
          </div>

          <div class="d-flex ga-2">
            <v-btn color="teal" variant="outlined" size="small" class="text-none font-weight-bold flex-grow-1 rounded-lg" prepend-icon="mdi-plus" @click="addNewWorkoutDrill">Add Custom Drill</v-btn>
            <v-btn color="teal" variant="flat" size="small" class="text-none font-weight-bold flex-grow-1 text-white rounded-lg" :disabled="!canCreateWorkout" :loading="dispatching" @click="createWorkout">Deploy Plan</v-btn>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card 
          v-if="(targetScope === 'student' && selectedStudentId) || (targetScope === 'course' && selectedCourseId)"
          class="border fill-height d-flex flex-column bg-white shadow-xs" 
          rounded="lg" 
          elevation="0"
        >
          <div class="pa-4 bg-slate-50 border-b d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-2">
              <v-icon :color="targetScope === 'student' ? 'indigo-darken-1' : 'teal-darken-1'">
                {{ targetScope === 'student' ? 'mdi-format-list-bulleted' : 'mdi-grid' }}
              </v-icon>
              <span class="text-subtitle-1 font-weight-bold text-slate-900">
                {{ targetScope === 'student' ? 'Individual Overview' : 'Course Overview' }}
              </span>
            </div>
            <v-chip size="x-small" :color="targetScope === 'student' ? 'indigo' : 'teal'" variant="tonal" class="font-weight-bold">
              {{ targetScope === 'student' ? 'Individual' : 'Course' }}
            </v-chip>
          </div>

          <v-window v-model="rightPanelTab" class="flex-grow-1">
            
            <v-window-item v-if="targetScope === 'student'" :value="0" class="pa-4">
              <div v-if="loadingData" class="text-center py-12">
                <v-progress-circular indeterminate color="indigo" size="40" />
                <div class="text-caption text-slate-500 mt-2">Pulling data profiles...</div>
              </div>

              <div v-else>
                <v-card v-if="activeWorkout" class="mb-4 pa-4 border bg-teal-tight rounded-xl" elevation="0">
                  <div class="d-flex align-center justify-space-between mb-3 border-b-teal pb-2 flex-wrap ga-2">
                    <div>
                      <div class="text-subtitle-2 font-weight-bold text-teal-darken-3 uppercase tracking-wide" style="font-size: 11px;">Active In-Class Session Tracking</div>
                      <div class="text-body-1 font-weight-black text-slate-900">{{ activeWorkout.focus_area || 'General Focus Track' }}</div>
                    </div>
                    
                    <div class="d-flex ga-2">
                      <v-btn size="x-small" color="teal-darken-1" variant="flat" class="text-white font-weight-bold" prepend-icon="mdi-content-save-check" :loading="dispatching" @click="saveActiveWorkoutProgressState">
                        Save Progress Log
                      </v-btn>
                      <v-btn size="x-small" color="red-lighten-1" variant="outlined" class="text-none font-weight-bold bg-white" prepend-icon="mdi-archive-check-outline" @click="archiveWorkoutPlan(activeWorkout.id)">
                        Complete & Archive
                      </v-btn>
                    </div>
                  </div>

                  <v-textarea 
                    v-model="activeWorkout.notes" 
                    label="Live Performance Observations / Corrective Progress Feedback Logs" 
                    variant="outlined" 
                    rows="2" 
                    density="comfortable" 
                    bg-color="white"
                    class="mb-3 text-body-2"
                    hide-details
                  />

                  <div class="text-caption font-weight-bold text-slate-600 mb-2 uppercase tracking-wider">Session Drill Objectives Matrix:</div>
                  <div class="d-flex flex-column ga-2">
                    <div v-for="(drill, index) in activeWorkout.drills" :key="index" class="bg-white border rounded-lg pa-3 d-flex align-center justify-space-between shadow-xs">
                      <div style="max-width: 75%;">
                        <div class="text-body-2 font-weight-bold text-slate-800 d-flex align-center flex-wrap ga-2">
                          {{ drill.name }}
                          <v-chip size="x-small" color="teal" variant="tonal" class="text-uppercase font-weight-bold">{{ drill.type }}</v-chip>
                        </div>
                        <div class="text-caption text-slate-500 mt-0.5">{{ drill.description }}</div>
                      </div>
                      
                      <div class="text-center bg-slate-50 border pa-2 rounded-lg d-flex align-center ga-2">
                        <v-btn icon="mdi-minus" size="x-small" variant="text" color="slate-600" density="compact" :disabled="drill.completed_sessions <= 0" @click="drill.completed_sessions--" />
                        <div class="d-flex flex-column px-1">
                          <span class="text-body-2 font-weight-black text-slate-900">{{ drill.completed_sessions }}</span>
                          <span class="text-slate-400 font-weight-bold uppercase" style="font-size: 8px;">of {{ drill.target_sessions || '∞' }}</span>
                        </div>
                        <v-btn icon="mdi-plus" size="x-small" variant="text" color="teal" density="compact" :disabled="drill.completed_sessions >= (drill.target_sessions || 99)" @click="drill.completed_sessions++" />
                      </div>
                    </div>
                  </div>
                </v-card>

                <div class="d-flex align-center justify-space-between mb-3 mt-2 flex-wrap ga-2">
                  <div class="text-subtitle-2 text-slate-500 font-weight-bold uppercase tracking-wider">Assignments Filter</div>
                  <v-btn-toggle v-model="statusFilterMode" mandatory variant="text" color="indigo-darken-1" density="compact" class="border rounded-lg bg-slate-50">
                    <v-btn value="all" size="small" class="text-none font-weight-medium">All ({{ activeAssignments.length }})</v-btn>
                    <v-btn value="pending" size="small" color="orange-darken-2" class="text-none font-weight-medium">Pending ({{ activeAssignments.filter(a => a.status === 'pending').length }})</v-btn>
                    <v-btn value="completed" size="small" color="green-darken-2" class="text-none font-weight-medium">Done ({{ activeAssignments.filter(a => a.status === 'completed').length }})</v-btn>
                  </v-btn-toggle>
                </div>

                <div v-if="filteredActiveAssignments.length === 0" class="text-center py-12 text-slate-400 border rounded-xl bg-white border-dashed">
                  <v-icon size="48" class="mb-2 text-slate-300">mdi-filter-variant-remove</v-icon>
                  <div class="text-body-2">No items matching the selected status visibility rules.</div>
                </div>

                <v-list v-else density="compact" class="pa-0 ga-2 d-flex flex-column bg-transparent">
                  <v-list-item
                    v-for="item in filteredActiveAssignments"
                    :key="item.assignment_id"
                    class="border rounded-xl pa-3 transition-all"
                    :class="item.status === 'completed' ? 'bg-emerald-light border-emerald-soft shadow-xs-complete' : 'bg-white border-slate-soft'"
                  >
                    <template v-slot:prepend>
                      <div class="d-flex align-center mr-3">
                        <v-avatar :color="item.status === 'completed' ? 'green-lighten-5' : 'orange-lighten-5'" size="36">
                          <v-icon :color="item.status === 'completed' ? 'success' : 'warning'">
                            {{ item.status === 'completed' ? 'mdi-check-all' : 'mdi-progress-clock' }}
                          </v-icon>
                        </v-avatar>
                        <span class="text-caption font-weight-black ml-2 px-2 py-0.5 rounded-lg border uppercase tracking-wide d-none d-sm-inline-block" :class="item.status === 'completed' ? 'bg-green-lighten-5 text-green-darken-3 border-green-lighten-4' : 'bg-orange-lighten-5 text-orange-darken-3 border-orange-lighten-4'" style="font-size: 10px !important;">
                          {{ item.status === 'completed' ? 'Done' : 'Pending' }}
                        </span>
                      </div>
                    </template>

                    <v-list-item-title class="text-body-2 font-weight-bold line-height-tight" :class="item.status === 'completed' ? 'text-slate-500 text-decoration-line-through font-weight-medium' : 'text-slate-800'">
                      {{ item.description }}
                    </v-list-item-title>
                    
                    <v-list-item-subtitle class="text-caption text-slate-500 mt-1 d-flex flex-wrap align-center ga-2">
                      <span>Assigned: {{ formatDisplayDate(item.created_at) }}</span>
                      <span v-if="item.task_type === 'exercise'" class="font-weight-bold text-teal-darken-2">• Spaced Runs: ({{ item.spaced_progress }}/{{ item.spaced_required }})</span>
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="d-flex align-center ga-2">
                        <v-chip size="x-small" :color="item.task_type === 'exercise' ? 'teal' : 'purple'" variant="flat" class="text-white">{{ item.task_type }}</v-chip>
                        <v-btn icon="mdi-delete-outline" size="x-small" variant="text" color="red-lighten-2" @click="removeAssignmentRow(item.assignment_id)" />
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
            </v-window-item>

            <v-window-item v-if="targetScope === 'course'" :value="1" class="pa-4">
              <div v-if="loadingMatrix" class="text-center py-12">
                <v-progress-circular indeterminate color="indigo" size="40" />
                <div class="text-caption text-slate-500 mt-2">Loading...</div>
              </div>

              <div v-else class="border rounded-xl overflow-hidden shadow-xs">
                <v-table density="comfortable" class="bg-white">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="font-weight-bold text-slate-700">Student Name</th>
                      <th class="font-weight-bold text-slate-700 class-text-center">Domain</th>
                      <th class="font-weight-bold text-slate-700 class-text-center">Pending Assig.</th>
                      <th class="font-weight-bold text-slate-700 class-text-center">Completed Assig.</th>
                      <th class="font-weight-bold text-slate-700 class-text-center">Active Workouts?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in matrixRosterData" :key="row.student_id" class="matrix-row">
                      <td class="font-weight-bold text-slate-900">
                        <v-avatar size="28" color="indigo-lighten-5" class="mr-2 text-indigo-darken-3 text-caption font-weight-black">
                          {{ row.initials }}
                        </v-avatar>
                        {{ row.initials }} <span class="text-caption text-slate-400">({{ row.web_id }})</span>
                      </td>
                      <td class="class-text-center">
                        <v-chip size="x-small" variant="outlined" color="slate-600">{{ row.domain || 'Unset' }}</v-chip>
                      </td>
                      <td class="class-text-center font-weight-bold text-orange-darken-2">{{ row.pending_count }}</td>
                      <td class="class-text-center font-weight-bold text-green-darken-2">{{ row.completed_count }}</td>
                      <td class="class-text-center">
                        <v-chip size="x-small" :color="row.has_active_workout ? 'teal' : 'slate-300'" variant="flat" class="text-white font-weight-bold">
                          {{ row.has_active_workout ? 'Active' : 'None' }}
                        </v-chip>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-window-item>
            
          </v-window>
        </v-card>

        <v-card v-else class="border fill-height d-flex align-center justify-center pa-12 bg-white text-slate-400 text-center" rounded="lg" elevation="0">
          <div>
            <v-icon size="48" class="mb-2 text-slate-300">mdi-arrow-left-bold-box-outline</v-icon>
            <div class="text-body-2">Please select an individual student or course to populate data views.</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" rounded="lg">{{ snackbarText }}</v-snackbar>
  </v-container>

  <v-dialog v-model="templateDialog" max-width="500px">
  <v-card rounded="xl" class="pa-4 bg-white">
    <v-card-title class="font-weight-black text-h6 d-flex align-center">
      <v-icon color="teal" class="mr-2">mdi-layers-triple-outline</v-icon>
      Select Workout Preset Blueprint
    </v-card-title>
    <v-card-text class="text-caption text-slate-500 pa-2">
      Choosing a workout blueprint imports a predefined set of structured drills.
    </v-card-text>
    
    <v-list class="bg-transparent mt-2 py-0 ga-2 d-flex flex-column">
      <v-list-item 
        v-for="tpl in availableWorkoutTemplates" 
        :key="tpl.template_code"
        class="border rounded-xl pa-3 cursor-pointer list-item-hover"
        @click="applyWorkoutTemplate(tpl)"
      >
        <div class="d-flex align-center justify-space-between w-100">
          <div>
            <div class="font-weight-bold text-slate-800 text-body-2">{{ tpl.focus_area }}</div>
            <div class="text-caption text-slate-500 mt-0.5 line-clamp-1">{{ tpl.notes }}</div>
          </div>
          <v-chip size="x-small" color="teal" variant="tonal" class="font-weight-bold">
            {{ tpl.drills?.length }} Drills
          </v-chip>
        </div>
      </v-list-item>
    </v-list>
    
    <v-card-actions class="mt-4 pa-0">
      <v-spacer />
      <v-btn variant="text" color="slate-500" class="text-none font-weight-bold" @click="templateDialog = false">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import api from '@/axios';

interface Student {
  id: number;
  initials: string;
  web_id: string;
  display_name: string;
  domain: string | null;
}

interface Assignment {
  assignment_id: string;
  student: number;
  task_type: string;
  trigger_key: string;
  description: string;
  created_at: string;
  status: string;
  spaced_progress: number;
  spaced_required: number;
}

interface TemplatePreset {
  trigger_key: string;
  description: string;
  task_type: 'exercise' | 'achievement';
  required_sessions: number;
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
}

interface Workout {
  id: number;
  student: number;
  focus_area: string;
  notes: string;
  is_current: boolean;
  drills: WorkoutDrill[];
  created_at: string;
}

interface RosterMatrixRow {
  student_id: number;
  initials: string;
  web_id: string;
  domain: string | null;
  pending_count: number;
  completed_count: number;
  has_active_workout: boolean;
}

const userStore = useUserStore();

// UI Layout States
const targetScope = ref<'student' | 'course'>('student');
const rightPanelTab = ref(0);
const statusFilterMode = ref<'all' | 'pending' | 'completed'>('all');
const templateDialog = ref(false);

// Core Reactive Arrays Data Pools
const studentsList = computed(() => userStore.teacherRoster.map(s => ({
  id: s.id, 
  initials: s.initials, 
  web_id: s.web_id, 
  domain: s.domain,
  display_name: `${s.initials} (${s.web_id}) [${s.domain || 'No Class'}]`
})));
const activeAssignments = ref<Assignment[]>([]);
const activeWorkout = ref<Workout | null>(null);
const matrixRosterData = ref<RosterMatrixRow[]>([]);
const courses = ref<any[]>([]);
const enrollments = ref<any[]>([]);
const availableWorkoutTemplates = ref<any[]>([]);
const selectedTemplatesList = ref<TemplatePreset[]>([]);
const rawAchievementsJson = ref<Record<string, any>>({});

// Target Dropdown Model Trackers
const selectedStudentId = ref<number | null>(null);
const selectedCourseId = ref<string | null>(null); // Binds to course slug code strings

// 🌟 ALL TRACKING CONTROLS DECLARED AND VERIFIED
const loadingData = ref(false);
const loadingMatrix = ref(false);
const dispatching = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

function getCleanWorkoutState() {
  return {
    focus_area: '',
    notes: '',
    drills: [] as WorkoutDrill[]
  };
}

// Form dynamic property re-assignment tracker initial state
const newWorkout = ref(getCleanWorkoutState());

const uniqueCourses = computed(() => userStore.availableTeacherCourses);

const assignmentTemplates = computed(() => {
  const data = rawAchievementsJson.value;
  if (!data || Object.keys(data).length === 0) return [];
  const universalList = data._all?.achievements || [];
  
  let activeDomain = '';
  if (targetScope.value === 'student' && selectedStudentId.value) {
    activeDomain = userStore.teacherRoster.find(s => s.id === selectedStudentId.value)?.domain || '';
  }

  const domainSpecificList = (activeDomain && data[activeDomain]) ? data[activeDomain].achievements : [];
  return [...universalList, ...domainSpecificList].map((ach: any) => {
    const key = ach.criteria_key;
    const isConjugatorGame = key.includes('_correct_prompts') || key.startsWith('health_tier_');
    const inferredType = key.startsWith('vw_write_complete') || isConjugatorGame ? 'achievement' : 'exercise';
    return { 
      trigger_key: key, 
      description: ach.description, 
      task_type: inferredType, 
      required_sessions: (!isConjugatorGame && ach.description.match(/(three times|x 3)/i)) ? 3 : 1 
    };
  });
});

const filteredActiveAssignments = computed(() => {
  return statusFilterMode.value === 'all' 
    ? activeAssignments.value 
    : activeAssignments.value.filter(item => item.status === statusFilterMode.value);
});

const canCreateWorkout = computed(() => newWorkout.value.focus_area.trim().length > 0 && newWorkout.value.drills.length > 0);

watch(targetScope, (currentScope) => {
  selectedStudentId.value = null;
  selectedCourseId.value = null;
  activeAssignments.value = [];
  activeWorkout.value = null;
  selectedTemplatesList.value = [];
  rightPanelTab.value = currentScope === 'student' ? 0 : 1;
});

onMounted(async () => {
  loadingData.value = true;
  try {
    // Ensure store is hydrated via the new centralized boot sequence
    await userStore.ensureUserLoaded();
    
    // Fetch external non-API assets
    const res = await fetch('/data/assignments.json');
    rawAchievementsJson.value = await res.json();
    
    const tplResponse = await fetch('/data/workout_templates.json');
    const parsedTemplates = await tplResponse.json();
    availableWorkoutTemplates.value = parsedTemplates.templates || [];
  } catch (err) {
    console.error('Initialization error:', err);
  } finally {
    loadingData.value = false;
  }
});

function openTemplateDialog() {
  templateDialog.value = true;
}

function applyWorkoutTemplate(tpl: any) {
  newWorkout.value.focus_area = tpl.focus_area || '';
  newWorkout.value.notes = tpl.notes || '';
  newWorkout.value.drills = JSON.parse(JSON.stringify(tpl.drills || []));
  
  templateDialog.value = false;
  triggerAlert(`Workout plan format loaded from blueprint: "${tpl.focus_area}".`, 'success');
}

function addNewWorkoutDrill() {
  newWorkout.value.drills.push({
    type: 'pronunciation',
    name: 'New Custom Practice Drill Element',
    description: '',
    target_reps: 10,
    target_sessions: 2,
    completed_sessions: 0,
    notes: ''
  });
}

function getStudentIdsInSelectedCourse(): string[] {
  if (!selectedCourseId.value) return [];
  return enrollments.value
    .filter(e => e.course === selectedCourseId.value)
    .map(e => String(e.student || e.student_id));
}

async function refreshAssignmentLogs() {
  if (targetScope.value !== 'student' || !selectedStudentId.value) {
    activeAssignments.value = [];
    activeWorkout.value = null;
    return;
  }

  loadingData.value = true;
  try {
    const [workoutRes, assignRes] = await Promise.all([
      api.get(`/workouts/current/${selectedStudentId.value}/`).catch(() => ({ data: null })),
      api.get('/assignment/', { params: { student: selectedStudentId.value } })
    ]);
    
    activeWorkout.value = workoutRes.data;
    activeAssignments.value = assignRes.data?.results || assignRes.data || [];
  } catch {
    triggerAlert('Failed to refresh student logs.', 'error');
  } finally {
    loadingData.value = false;
  }
}


async function saveActiveWorkoutProgressState() {
  if (!activeWorkout.value) return;
  dispatching.value = true;
  try {
    const res = await api.post(`/workouts/${activeWorkout.value.id}/update_progress/`, {
      drills: activeWorkout.value.drills,
      notes: activeWorkout.value.notes 
    });
    
    activeWorkout.value = res.data;
    triggerAlert('Session notes and parameters matrix logged successfully.', 'success');
  } catch (err) {
    console.error(err);
    triggerAlert('Could not map progress changes down onto core server layers.', 'error');
  } finally {
    dispatching.value = false;
  }
}

function onStudentChanged() {
  if (selectedStudentId.value) {
    rightPanelTab.value = 0; 
    refreshAssignmentLogs();
  }
}

function onCourseChanged() {
  if (selectedCourseId.value) {
    rightPanelTab.value = 1; 
    loadGlobalClassMatrix(); 
  }
}

function removeNewDrill(idx: number) { newWorkout.value.drills.splice(idx, 1); }

async function createWorkout() {
  if (!selectedStudentId.value) return;
  dispatching.value = true;
  try {
    await api.post('/workouts/', {
      student: selectedStudentId.value,
      focus_area: newWorkout.value.focus_area,
      notes: newWorkout.value.notes,
      is_current: true,
      drills: newWorkout.value.drills.map((d, index) => ({ id: index + 1, ...d }))
    });
    triggerAlert('Live session workout deployed.', 'success');
    newWorkout.value = getCleanWorkoutState(); 
    await refreshAssignmentLogs();
  } catch (err) {
    triggerAlert('Validation failure or backend initialization error rejection.', 'error');
  } finally { dispatching.value = false; }
}

async function archiveWorkoutPlan(id: number) {
  if (!confirm('Archive this active session workout?')) return;
  try {
    await api.post(`/workouts/${id}/archive/`);
    triggerAlert('Workout archived.', 'success');
    await refreshAssignmentLogs();
    if (rightPanelTab.value === 1) await loadGlobalClassMatrix();
  } catch (err) {
    triggerAlert('Could not archive the workout plan.', 'error');
  }
}

async function issueAssignmentTask() {
    dispatching.value = true;
    try {
      let targetsListIds: number[] = [];
      if (targetScope.value === 'student' && selectedStudentId.value) {
        targetsListIds.push(selectedStudentId.value);
      } else if (targetScope.value === 'course' && selectedCourseId.value) {
        const courseStudentWebIds = getStudentIdsInSelectedCourse();
        targetsListIds = studentsList.value
          .filter(s => courseStudentWebIds.includes(String(s.web_id)))
          .map(s => s.id);
      }

      const batchRequests: Array<Promise<any>> = [];
      targetsListIds.forEach(studentId => {
        selectedTemplatesList.value.forEach(template => {
          batchRequests.push(
            api.post('/assignment/', {
              student: studentId,
              task_type: template.task_type,
              trigger_key: template.trigger_key,
              description: template.description,
              required_sessions: template.required_sessions,
              min_days_between_sessions: template.task_type === 'achievement' ? 0 : 1,
              manually_created: true
            })
          );
        });
      });

      await Promise.all(batchRequests);
      triggerAlert(`Successfully deployed tasks across course class metrics matching sets.`, 'success');
      selectedTemplatesList.value = [];
      await refreshAssignmentLogs();
    } catch (err) {
      triggerAlert('Batch deployment failed.', 'error');
    } finally {
      dispatching.value = false;
    }
}

async function removeAssignmentRow(id: string) {
  if (!confirm('Delete this autonomous assignment?')) return;
  try {
    await api.delete(`/assignment/${id}/`);
    triggerAlert('Assignment deleted.', 'success');
    await refreshAssignmentLogs();
    if (rightPanelTab.value === 1) await loadGlobalClassMatrix();
  } catch (err) {
    triggerAlert('Failed to terminate record entry.', 'error');
  }
}

async function loadGlobalClassMatrix() {
  if (!selectedCourseId.value) return;
  loadingMatrix.value = true;
  
  try {
    // 🌟 FIX: Query assignments and workouts globally, or filter specifically by this course slug slug 
    const [assignmentsResponse, workoutsResponse] = await Promise.all([
      api.get('/assignment/'),
      // Passing no user parameters enables teachers to fetch the active workout state
      // matrix layout across their entire student population track footprints!
      api.get('/workouts/', { params: { is_current: true } }).catch(() => ({ data: [] }))
    ]);

    const assignmentsPool = assignmentsResponse.data?.results || assignmentsResponse.data || [];
    const workoutsPool = workoutsResponse.data?.results || workoutsResponse.data || [];

    // Filter students using store data
    const courseStudentWebIds = userStore.enrollments
      .filter(e => {
        const cSlug = e.course?.slug || String(e.course);
        return cSlug.trim().toLowerCase() === selectedCourseId.value!.trim().toLowerCase();
      })
      .map(e => String(typeof e.student === 'object' ? e.student?.web_id : e.student));

    matrixRosterData.value = userStore.teacherRoster
      .filter(s => s.web_id && courseStudentWebIds.includes(String(s.web_id)))
      .map(student => {
        const personalSet = assignmentsPool.filter((a: any) => {
          const assignStudentId = a.student && typeof a.student === 'object' ? a.student.id : Number(a.student);
          return assignStudentId === student.id;
        });

        // 🌟 FIX: Look up using a robust validation mapping sequence that handles nested relations cleanly
        const activeWk = workoutsPool.find((w: any) => {
          const workoutStudentId = w.student && typeof w.student === 'object' ? w.student.id : Number(w.student);
          return workoutStudentId === student.id && w.is_current;
        });

        return {
          student_id: student.id,
          initials: student.initials,
          web_id: student.web_id,
          domain: student.domain,
          pending_count: personalSet.filter((a: any) => a.status === 'pending').length,
          completed_count: personalSet.filter((a: any) => a.status === 'completed').length,
          has_active_workout: !!activeWk
        };
      });
  } catch (err) {
    console.error("Matrix compilation crashed:", err);
    triggerAlert('Could not build overview metrics charts.', 'error');
  } finally {
    loadingMatrix.value = false;
  }
}


function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function triggerAlert(msg: string, color: string = 'success') {
  snackbarText.value = msg; snackbarColor.value = color; snackbar.value = true;
}
</script>

<style scoped>
.manage-work-header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
.line-height-tight { line-height: 1.25; }
.border-b { border-bottom: 1px solid #e2e8f0 !important; }
.matrix-row:hover { background-color: #f8fafc; }
.bg-teal-tight { background-color: #f0fdfa; border-color: #ccfbf1 !important; }
.class-text-center { text-align: center !important; }
.bg-emerald-light { background-color: #f6fcf9 !important; }
.border-emerald-soft { border-color: #d1f2e5 !important; }
.border-slate-soft { border-color: #e2e8f0 !important; }
.shadow-xs-complete { box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.01) !important; }
.transition-all { transition: all 0.2s ease-in-out; }
.border-b-teal { border-bottom: 1px solid #ccfbf1 !important; }
.list-item-hover { transition: background-color 0.15s; }
.list-item-hover:hover { background-color: #f0fdfa !important; border-color: #99f6e4 !important; }
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
</style>