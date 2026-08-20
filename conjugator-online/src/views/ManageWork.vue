<template>
  <v-container fluid class="mt-5 pa-4 px-6 text-slate-800 bg-slate-50 min-vh-100">
    <v-row class="mb-2 align-center">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-black text-slate-900 d-flex align-center">
          <v-icon icon="mdi-tray-full" color="indigo" class="mr-5" />
          Manage Assigned Tasks
        </h1>
        <p class="text-caption text-slate-500 mt-1">
          Create assignments (app challenges) or workouts (in-class routines) for individual students or entire courses. Track progress and completion.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="5">
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
            item-title="title"
            item-value="value"
            label="Select course"
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
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center ga-2">
              <v-icon start size="20" color="teal">mdi-clipboard-text</v-icon>
              <div>
                <div class="text-subtitle-1 font-weight-bold text-slate-900">In-Class Workout</div>
                <div class="text-caption text-slate-500">Structured practice plan for this session</div>
              </div>
            </div>
            <v-chip size="x-small" color="teal" variant="flat" class="text-white font-weight-bold">In-Class</v-chip>
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
            Load Blueprint
          </v-btn>

          <!-- Workout Metadata -->
          <v-text-field 
            v-model="newWorkout.focus_area" 
            label="Focus Area" 
            placeholder="e.g., Pronunciation Drills, Verb Conjugation" 
            variant="outlined" 
            density="comfortable"
            class="mb-3"
          />

          <v-textarea 
            v-model="newWorkout.notes" 
            label="Teacher Notes" 
            placeholder="Why this workout? What should the student focus on?"
            variant="outlined" 
            rows="2" 
            density="comfortable"
            class="mb-4"
          />

          <!-- Repetitions for entire workout -->
          <v-text-field 
            v-model.number="newWorkout.target_repetitions" 
            label="Expected Repetitions (for entire workout)" 
            type="number"
            min="1"
            variant="outlined" 
            density="comfortable"
            hint="How many times should the student go through this complete workout?"
            class="mb-4"
          />

          <!-- Drills List -->
          <div class="mb-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-subtitle-2 font-weight-bold text-slate-900">Drills</div>
              <v-btn 
                icon="mdi-plus" 
                size="x-small" 
                variant="text" 
                color="teal"
                @click="addNewDrill"
              />
            </div>

            <div v-if="newWorkout.drills.length === 0" class="text-center py-6 border-dashed border rounded-lg bg-white text-slate-400">
              <v-icon size="32" class="mb-1">mdi-format-list-bulleted</v-icon>
              <div class="text-caption">No drills added yet. Click the + button or load a blueprint.</div>
            </div>

            <div v-else class="ga-2 d-flex flex-column">
              <div 
                v-for="(drill, idx) in newWorkout.drills" 
                :key="idx" 
                class="border pa-4 rounded-lg bg-white hover-elevation-1 transition-all"
              >
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="flex-grow-1">
                    <v-text-field 
                      v-model="drill.name" 
                      label="Drill Name" 
                      variant="underlined" 
                      density="compact" 
                      hide-details 
                      class="mb-1 font-weight-bold text-body-2"
                    />
                    <v-textarea 
                      v-model="drill.description" 
                      label="Brief Description" 
                      variant="underlined" 
                      density="compact" 
                      rows="1" 
                      auto-grow 
                      hide-details 
                      class="text-caption text-slate-600"
                    />
                  </div>
                  <v-btn 
                    icon="mdi-delete-outline" 
                    size="x-small" 
                    variant="text" 
                    color="red-lighten-1" 
                    @click="removeDrill(idx)"
                  />
                </div>

                <!-- Comments (for tracking student performance on this drill) -->
                <v-textarea 
                  v-model="drill.notes" 
                  label="Comments (e.g., student's progress, focus points)" 
                  variant="outlined" 
                  density="compact" 
                  rows="2" 
                  hide-details
                  class="text-caption"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex ga-2">
            <v-btn 
              color="teal" 
              variant="outlined" 
              class="text-none font-weight-bold flex-grow-1 rounded-lg" 
              prepend-icon="mdi-plus" 
              @click="addNewDrill"
            >
              Add Drill
            </v-btn>
            <v-btn 
              color="teal" 
              variant="flat" 
              class="text-none font-weight-bold flex-grow-1 text-white rounded-lg" 
              :disabled="!canCreateWorkout" 
              :loading="dispatching" 
              @click="createWorkout"
            >
              Assign Workout
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="7">
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
                      <div class="text-subtitle-2 font-weight-bold text-teal-darken-3 uppercase tracking-wide" style="font-size: 11px;">Active Workout</div>
                      <div class="text-body-1 font-weight-black text-slate-900">{{ activeWorkout.focus_area || 'General Focus Track' }}</div>
                    </div>
                    
                    <div class="d-flex ga-2">
                      <v-btn size="x-small" color="teal-darken-1" variant="flat" class="text-white font-weight-bold" prepend-icon="mdi-content-save-check" :loading="dispatching" @click="saveActiveWorkoutProgressState">
                        Save Progress
                      </v-btn>
                      <v-btn size="x-small" color="red-lighten-1" variant="outlined" class="text-none font-weight-bold bg-white" prepend-icon="mdi-archive-check-outline" @click="archiveWorkoutPlan(activeWorkout.id)">
                        Complete & Archive
                      </v-btn>
                    </div>
                  </div>

                  <v-textarea 
                    v-model="activeWorkout.notes" 
                    label="Observations / Notes" 
                    variant="outlined" 
                    rows="2" 
                    density="comfortable" 
                    bg-color="white"
                    class="mb-4 text-body-2"
                    hide-details
                  />

                  <!-- Workout Repetitions Progress -->
                  <div class="mb-4 pa-3 bg-white border rounded-lg">
                    <div class="text-caption font-weight-bold text-slate-600 mb-2 uppercase tracking-wider">Workout Repetitions</div>
                    <div class="d-flex align-center justify-space-between">
                      <div class="text-body-2 text-slate-700">
                        Times student should complete this full workout
                      </div>
                      <div class="d-flex align-center ga-2">
                        <v-btn icon="mdi-minus" size="x-small" variant="text" color="slate-600" density="compact" :disabled="activeWorkout.completed_repetitions <= 0" @click="activeWorkout.completed_repetitions--" />
                        <div class="d-flex flex-column align-center px-2">
                          <span class="text-h6 font-weight-black text-slate-900">{{ activeWorkout.completed_repetitions }}</span>
                          <span class="text-caption text-slate-400 font-weight-bold">of {{ activeWorkout.target_repetitions }}</span>
                        </div>
                        <v-btn icon="mdi-plus" size="x-small" variant="text" color="teal" density="compact" :disabled="activeWorkout.completed_repetitions >= activeWorkout.target_repetitions" @click="activeWorkout.completed_repetitions++" />
                      </div>
                    </div>
                    <v-progress-linear :model-value="(activeWorkout.completed_repetitions / activeWorkout.target_repetitions) * 100" color="teal" height="4" rounded class="mt-2" />
                  </div>

                  <!-- Drills List -->
                  <div class="text-caption font-weight-bold text-slate-600 mb-2 uppercase tracking-wider">Drills in this workout:</div>
                  <div class="d-flex flex-column ga-2">
                    <div v-for="(drill, index) in activeWorkout.drills" :key="index" class="bg-white border rounded-lg pa-3">
                      <div class="d-flex align-center justify-space-between mb-2">
                        <div class="text-body-2 font-weight-bold text-slate-800">
                          {{ drill.name }}
                        </div>
                      </div>
                      <div class="text-caption text-slate-600 mb-2">
                        {{ drill.description }}
                      </div>
                      <div v-if="drill.notes" class="text-caption text-slate-500 italic border-l-2 border-teal-lighten-2 pl-2">
                        💬 {{ drill.notes }}
                      </div>
                    </div>

                    <div v-if="activeWorkout.drills.length === 0" class="text-center py-4 text-slate-400 border-dashed border rounded-lg">
                      <v-icon size="24" class="mb-1">mdi-format-list-bulleted</v-icon>
                      <div class="text-caption">No drills assigned to this workout</div>
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
                      <span v-if="item.task_type === 'exercise'" class="font-weight-bold text-teal-darken-2">• Repetitions: ({{ item.spaced_progress }}/{{ item.spaced_required }})</span>
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

  <!-- Blueprint Selection Dialog -->
  <v-dialog v-model="templateDialog" max-width="500px">
    <v-card rounded="xl" class="pa-4 bg-white">
      <v-card-title class="font-weight-black text-h6 d-flex align-center">
        <v-icon color="teal" class="mr-2">mdi-layers-triple-outline</v-icon>
        Select Workout Preset Blueprint
      </v-card-title>
      <v-card-text class="text-caption text-slate-500 pa-2">
        Choosing a workout blueprint imports a predefined set of structured drills.
      </v-card-text>
      
      <v-list v-if="availableWorkoutTemplates.length > 0" class="bg-transparent mt-2 py-0 ga-2 d-flex flex-column">
        <v-list-item 
          v-for="tpl in availableWorkoutTemplates" 
          :key="tpl.template_id"
          class="border rounded-xl pa-3 cursor-pointer list-item-hover"
          @click="applyWorkoutTemplate(tpl)"
        >
          <div class="d-flex align-center justify-space-between w-100">
            <div>
              <div class="font-weight-bold text-slate-800 text-body-2">{{ tpl.name }}</div>
              <div class="text-caption text-slate-500 mt-0.5">{{ tpl.focus_area }}</div>
              <div class="text-xxs text-slate-400 mt-1">{{ tpl.description }}</div>
            </div>
            <v-chip size="x-small" color="teal" variant="tonal" class="font-weight-bold">
              {{ tpl.drill_count }} Drills
            </v-chip>
          </div>
        </v-list-item>
      </v-list>

      <div v-else class="text-center py-8 text-slate-400">
        <v-icon size="32" class="mb-2">mdi-folder-open-outline</v-icon>
        <div class="text-caption">No workout templates available. Create one first!</div>
      </div>
      
      <v-card-actions class="mt-4 pa-0">
        <v-spacer />
        <v-btn variant="text" color="slate-500" class="text-none font-weight-bold" @click="templateDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

    <!-- Save as Template Dialog -->
  <v-dialog v-model="saveTemplateDialog" max-width="500px">
    <v-card rounded="xl" class="pa-4 bg-white">
      <v-card-title class="font-weight-black text-h6 d-flex align-center">
        <v-icon color="teal" class="mr-2">mdi-plus-circle-outline</v-icon>
        Save Workout as Template
      </v-card-title>
      <v-card-text class="text-caption text-slate-500 pa-2">
        Would you like to save this workout as a reusable template for future use?
      </v-card-text>

      <v-card-text class="pa-4">
        <v-text-field 
          v-model="templateForm.name" 
          label="Template Name" 
          placeholder="e.g., Pronunciation Drills - Session 1" 
          variant="outlined" 
          density="comfortable"
          class="mb-3"
          hint="Give this template a descriptive name"
        />

        <v-textarea 
          v-model="templateForm.description" 
          label="Template Description" 
          placeholder="Optional notes about when/how to use this template..."
          variant="outlined" 
          rows="2" 
          density="comfortable"
          class="mb-3"
        />

        <v-select
          v-model="templateForm.difficulty"
          :items="[
            { title: 'Beginner', value: 'beginner' },
            { title: 'Intermediate', value: 'intermediate' },
            { title: 'Advanced', value: 'advanced' }
          ]"
          item-title="title"
          item-value="value"
          label="Difficulty Level"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />

        <v-chip color="teal" variant="flat" size="small" class="text-white">
          {{ newWorkout.drills.length }} drills • {{ newWorkout.target_repetitions }} repetitions
        </v-chip>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-btn variant="text" color="slate-500" class="text-none font-weight-bold" @click="saveTemplateDialog = false">Skip</v-btn>
        <v-spacer />
        <v-btn 
          color="teal-darken-1" 
          variant="flat" 
          class="text-none font-weight-bold text-white"
          :disabled="!templateForm.name.trim()"
          :loading="savingTemplate"
          @click="saveAsTemplate"
        >
          Save as Template
        </v-btn>
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
  name: string;
  description: string;
  notes?: string;
}

interface Workout {
  id: number;
  student: number;
  focus_area: string;
  notes: string;
  is_current: boolean;
  target_repetitions: number;
  completed_repetitions: number;
  drills: WorkoutDrill[];
  created_at: string;
}

interface DrillTemplate {
  id: string;
  type: 'pronunciation' | 'conjugation' | 'vocabulary' | 'grammar' | 'fluency' | 'listening' | 'other';
  name: string;
  description: string;
  target_reps?: number;
  target_sessions?: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes_template?: string;
  question_url?: string;
}

interface WorkoutTemplate {
  template_id: string;
  teacher: number;
  teacher_name: string;
  name: string;
  description: string;
  focus_area: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: string;
  target_repetitions: number;
  drills: WorkoutDrill[];
  drill_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
const saveTemplateDialog = ref(false);

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
const selectedTemplatesList = ref<TemplatePreset[]>([]);
const rawAchievementsJson = ref<Record<string, any>>({});
const workoutTemplatesFromApi = ref<WorkoutTemplate[]>([]);
const workoutFromTemplate = ref(false);

const availableWorkoutTemplates = computed(() => {
  return workoutTemplatesFromApi.value.filter(t => t.is_active);
});
const pendingWorkoutData = ref<{
  focus_area: string;
  notes: string;
  target_repetitions: number;
  drills: WorkoutDrill[];
} | null>(null);

// Target Dropdown Model Trackers
const selectedStudentId = ref<number | null>(null);
const selectedCourseId = ref<string | null>(null);

// Loading and UI States
const loadingData = ref(false);
const loadingMatrix = ref(false);
const dispatching = ref(false);
const savingTemplate = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// Workout Form State
function getCleanWorkoutState() {
  return {
    focus_area: '',
    notes: '',
    target_repetitions: 3,
    drills: [] as WorkoutDrill[]
  };
}

const newWorkout = ref(getCleanWorkoutState());

// Template Form State
const templateForm = ref({
  name: '',
  description: '',
  difficulty: 'intermediate'
});

// Computed Properties
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

const canCreateWorkout = computed(() => 
  newWorkout.value.focus_area.trim().length > 0 && 
  newWorkout.value.drills.length > 0 &&
  newWorkout.value.target_repetitions > 0
);

// Watchers
watch(targetScope, (currentScope) => {
  selectedStudentId.value = null;
  selectedCourseId.value = null;
  activeAssignments.value = [];
  activeWorkout.value = null;
  selectedTemplatesList.value = [];
  workoutFromTemplate.value = false;  
  rightPanelTab.value = currentScope === 'student' ? 0 : 1;
});

// Lifecycle
onMounted(async () => {
  loadingData.value = true;
  try {
    await userStore.ensureUserLoaded();
    
    // Fetch assignments data
    const res = await fetch('/data/assignments.json');
    rawAchievementsJson.value = await res.json();
    
    // Fetch workout templates
    await fetchWorkoutTemplates();
  } catch (err) {
    console.error('Initialization error:', err);
    triggerAlert('Failed to load data templates.', 'error');
  } finally {
    loadingData.value = false;
  }
});

// Drill Management Functions
function addNewDrill() {
  newWorkout.value.drills.push({
    name: 'New Drill',
    description: '',
    notes: ''
  });
}

function removeDrill(idx: number) {
  newWorkout.value.drills.splice(idx, 1);
}

// Template Functions
function openTemplateDialog() {
  templateDialog.value = true;
}

function drillTemplateToWorkoutDrill(template: DrillTemplate): WorkoutDrill {
  return {
    id: Date.now() + Math.random(),
    name: template.name,
    description: template.description,
    notes: template.notes_template || ''
  };
}

function applyWorkoutTemplate(tpl: WorkoutTemplate) {
  newWorkout.value.focus_area = (tpl.focus_area || '').trim();
  newWorkout.value.notes = (tpl.description || '').trim();  
  newWorkout.value.target_repetitions = tpl.target_repetitions || 1;
  newWorkout.value.drills = (tpl.drills || []).map((drill: WorkoutDrill) => ({
    name: drill.name?.trim() || '',
    description: drill.description?.trim() || '',
    notes: drill.notes?.trim() || ''
  }));
  
  workoutFromTemplate.value = true;  // Mark as from template
  templateDialog.value = false;
  triggerAlert(`Workout blueprint loaded: "${tpl.focus_area}".`, 'success');
}

// Student and Course Selection
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

function getStudentIdsInSelectedCourse(): string[] {
  if (!selectedCourseId.value) return [];
  return enrollments.value
    .filter(e => e.course === selectedCourseId.value)
    .map(e => String(e.student || e.student_id));
}

// Data Fetching Functions
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
  } catch (err) {
    console.error('Failed to refresh assignment logs:', err);
    triggerAlert('Failed to refresh student logs.', 'error');
  } finally {
    loadingData.value = false;
  }
}

async function loadGlobalClassMatrix() {
  if (!selectedCourseId.value) return;
  loadingMatrix.value = true;
  
  try {
    const [assignmentsResponse, workoutsResponse] = await Promise.all([
      api.get('/assignment/'),
      api.get('/workouts/', { params: { is_current: true } }).catch(() => ({ data: [] }))
    ]);

    const assignmentsPool = assignmentsResponse.data?.results || assignmentsResponse.data || [];
    const workoutsPool = workoutsResponse.data?.results || workoutsResponse.data || [];

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
    console.error('Matrix compilation crashed:', err);
    triggerAlert('Could not build overview metrics charts.', 'error');
  } finally {
    loadingMatrix.value = false;
  }
}

async function fetchWorkoutTemplates() {
  try {
    const response = await api.get('/workout-templates/');
    const templates = response.data?.results || response.data || [];
    workoutTemplatesFromApi.value = templates;
  } catch (err) {
    console.error('Failed to fetch workout templates:', err);
    triggerAlert('Could not load workout templates.', 'error');
  }
}

// Workout Management Functions
async function createWorkout() {
  if (!selectedStudentId.value) return;
  
  // Validate before sending
  if (!newWorkout.value.focus_area.trim()) {
    triggerAlert('Focus Area cannot be empty.', 'error');
    return;
  }
  
  if (newWorkout.value.drills.length === 0) {
    triggerAlert('At least one drill is required.', 'error');
    return;
  }

  dispatching.value = true;
  try {
    // Save data for template dialog
    pendingWorkoutData.value = {
      focus_area: newWorkout.value.focus_area,
      notes: newWorkout.value.notes,
      target_repetitions: newWorkout.value.target_repetitions,
      drills: JSON.parse(JSON.stringify(newWorkout.value.drills))
    };

    await api.post('/workouts/', {
      student: selectedStudentId.value,
      focus_area: pendingWorkoutData.value.focus_area,
      notes: pendingWorkoutData.value.notes,
      target_repetitions: pendingWorkoutData.value.target_repetitions,
      is_current: true,
      drills: pendingWorkoutData.value.drills
    });
    
    triggerAlert('Workout assigned successfully.', 'success');
    
    // Only show template save dialog if workout was NOT loaded from a template
    if (!workoutFromTemplate.value) {
      templateForm.value.name = '';
      templateForm.value.description = '';
      saveTemplateDialog.value = true;
    } else {
      pendingWorkoutData.value = null;
    }
    
    // Clear form
    newWorkout.value = getCleanWorkoutState();
    workoutFromTemplate.value = false;
    await refreshAssignmentLogs();
  } catch (err: any) {
    console.error('Failed to create workout:', err);
    triggerAlert('Failed to create workout.', 'error');
  } finally { 
    dispatching.value = false; 
  }
}

async function saveAsTemplate() {
  if (!templateForm.value.name.trim()) return;
  if (!pendingWorkoutData.value) return;
  
  savingTemplate.value = true;
  try {
    const cleanDrills = (pendingWorkoutData.value.drills || [])
      .map(drill => ({
        name: String(drill.name || '').trim(),
        description: String(drill.description || '').trim(),
        notes: String(drill.notes || '').trim()
      }))
      .filter(drill => drill.name.length > 0);
    
    if (cleanDrills.length === 0) {
      triggerAlert('All drills must have at least a name.', 'error');
      return;
    }

    const payload = {
      name: templateForm.value.name.trim(),
      description: templateForm.value.description.trim(),
      focus_area: pendingWorkoutData.value.focus_area.trim(),
      difficulty: templateForm.value.difficulty,
      estimated_duration: '',
      target_repetitions: Number(pendingWorkoutData.value.target_repetitions) || 1,
      drills: cleanDrills
    };

    console.log('Template payload:', payload);

    await api.post('/workout-templates/', payload);
    
    triggerAlert(`Template "${templateForm.value.name}" saved successfully.`, 'success');
    saveTemplateDialog.value = false;
    pendingWorkoutData.value = null;
    await fetchWorkoutTemplates();
  } catch (err: any) {
    console.error('Failed to save template:', err.response?.data || err);
    const errorDetails = err.response?.data;
    let errorMsg = 'Unknown error';
    
    if (typeof errorDetails === 'object') {
      errorMsg = Object.entries(errorDetails)
        .map(([key, value]: [string, any]) => {
          if (Array.isArray(value)) return `${key}: ${value.join(', ')}`;
          return `${key}: ${value}`;
        })
        .join(' | ');
    }
    
    triggerAlert(`Failed to save template: ${errorMsg}`, 'error');
  } finally {
    savingTemplate.value = false;
  }
}

async function saveActiveWorkoutProgressState() {
  if (!activeWorkout.value) return;
  dispatching.value = true;
  try {
    const payload = {
      drills: activeWorkout.value.drills,
      notes: activeWorkout.value.notes,
      completed_repetitions: activeWorkout.value.completed_repetitions
    };

    console.log('Saving progress payload:', payload);

    const res = await api.post(`/workouts/${activeWorkout.value.id}/update_progress/`, payload);
    
    activeWorkout.value = res.data;
    triggerAlert('Workout progress saved successfully.', 'success');
  } catch (err: any) {
    console.error('Failed to save progress:', err.response?.data || err);
    triggerAlert('Could not save workout progress.', 'error');
  } finally {
    dispatching.value = false;
  }
}

async function archiveWorkoutPlan(id: number) {
  if (!confirm('Archive this active session workout?')) return;
  try {
    await api.post(`/workouts/${id}/archive/`);
    triggerAlert('Workout archived.', 'success');
    await refreshAssignmentLogs();
    if (rightPanelTab.value === 1) await loadGlobalClassMatrix();
  } catch (err) {
    console.error('Failed to archive workout:', err);
    triggerAlert('Could not archive the workout plan.', 'error');
  }
}

// Assignment Management Functions
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
    triggerAlert(`Successfully deployed ${selectedTemplatesList.value.length} assignment(s).`, 'success');
    selectedTemplatesList.value = [];
    await refreshAssignmentLogs();
  } catch (err) {
    console.error('Failed to issue assignments:', err);
    triggerAlert('Batch deployment failed.', 'error');
  } finally {
    dispatching.value = false;
  }
}

async function removeAssignmentRow(id: string) {
  if (!confirm('Delete this assignment?')) return;
  try {
    await api.delete(`/assignment/${id}/`);
    triggerAlert('Assignment deleted.', 'success');
    await refreshAssignmentLogs();
    if (rightPanelTab.value === 1) await loadGlobalClassMatrix();
  } catch (err) {
    console.error('Failed to delete assignment:', err);
    triggerAlert('Failed to delete assignment.', 'error');
  }
}

// Utility Functions
function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function triggerAlert(msg: string, color: string = 'success') {
  snackbarText.value = msg;
  snackbarColor.value = color;
  snackbar.value = true;
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