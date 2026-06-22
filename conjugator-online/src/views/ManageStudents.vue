<template>
  <v-container fluid class="mt-5 pa-4 px-6 max-width-container">
    <v-row class="align-center">
      <v-col cols="12" class="d-flex flex-column gap-1">
        <h1 class="text-h4 font-weight-black text-slate-900 d-flex align-center">
          <v-icon icon="mdi-account-cog" color="indigo" class="mr-5" />
          Manage Students and Courses
        </h1>
        <p class="text-caption text-slate-500 mt-1">
          Register students and courses, manage enrollments, and assess linguistic profiles.
        </p>
      </v-col>
    </v-row>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-sm-end gap-2 align-center">
        <v-btn color="grey-darken-3" variant="outlined" prepend-icon="mdi-refresh" width="180px" :loading="loading" @click="fetchData">
          Refresh
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-plus" width="180px" @click="courseDialog = true">New Course</v-btn>
        <v-btn color="secondary" prepend-icon="mdi-account-plus" width="180px" @click="openRegisterStudentDialog">New Student</v-btn>
        <v-btn color="success" prepend-icon="mdi-link-variant" width="180px" @click="enrollmentDialog = true">Enroll Student</v-btn>
      </v-col>
    </v-row>

    <v-tabs v-model="activeTab" color="primary" class="mb-6 border-b">
      <v-tab value="courses"><v-icon start>mdi-google-classroom</v-icon>My Courses</v-tab>
      <v-tab value="directory"><v-icon start>mdi-account-multiple</v-icon>My Students</v-tab>
      <v-tab value="linguistic"><v-icon start>mdi-account-voice</v-icon>Linguistic Profiles</v-tab>
    </v-tabs>

    <v-row v-if="loading && courses.length === 0" justify="center" class="my-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    

    <v-window v-else v-model="activeTab">
      <v-window-item value="courses" class="animate-fade-in">

        <v-row class="mb-2 px-2">
          <v-col cols="12">
            <div class="d-flex justify-end">
              <v-checkbox
              v-model="userStore.showArchivedInCourses"
              label="See my inactive courses"
              hide-details
              density="compact"
              color="slate-700"
            />
            </div>
          </v-col>
        </v-row>

        <v-expansion-panels variant="accordion" multiple>
          <v-expansion-panel v-for="course in groupedData" :key="course.slug">
            
            <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
              <v-icon icon="mdi-folder-text-outline" class="mr-3" :color="course.is_active ? 'primary' : 'grey'"></v-icon>
              Course <span class="ms-2" :class="course.is_active ? 'text-primary' : 'text-grey text-decoration-line-through'">{{ course.slug }}</span>
              
              <v-chip class="ml-4" size="small" :color="course.is_active ? 'secondary' : 'grey-lighten-1'" variant="flat">
                {{ course.students.length }} Enrolled
              </v-chip>
              <v-chip class="ml-2" size="small" :color="course.is_active ? 'success' : 'error'" variant="tonal">
                {{ course.is_active ? 'Active' : 'Archived' }}
              </v-chip>
              <v-spacer></v-spacer>
              
              <v-btn
                size="small"
                :color="course.is_active ? 'orange-darken-1' : 'success'"
                variant="tonal"
                class="mr-2 stop-propagation"
                icon
                @click.stop="toggleCourseActiveStatus(course)"
              >
                <v-icon :icon="course.is_active ? 'mdi-archive-arrow-down-outline' : 'mdi-archive-arrow-up-outline'" />
                <v-tooltip activator="parent" location="top">
                  {{ course.is_active ? 'Archive Course' : 'Restore Course' }}
                </v-tooltip>
              </v-btn>

              <v-btn
                size="small"
                color="info"
                variant="tonal"
                class="mr-2 stop-propagation"
                icon
                @click.stop="openEditCourseDialog(course)"
              >
                <v-icon icon="mdi-cog-outline" />
                <v-tooltip activator="parent" location="top">Edit Course</v-tooltip>
              </v-btn>

              <v-btn
                size="small"
                color="error"
                variant="tonal"
                class="mr-2 stop-propagation"
                icon
                @click.stop="confirmDeleteCourse(course)"
              >
                <v-icon icon="mdi-delete-outline" />
                <v-tooltip activator="parent" location="top">Delete Course</v-tooltip>
              </v-btn>
            </v-expansion-panel-title>

            <v-expansion-panel-text class="pt-2 bg-slate-50/50">
              <v-row>
                <!-- Left Column: Unified Course Roster Management -->
                <v-col cols="12" :md="course.objectives && course.objectives.length > 0 ? '4' : '12'">
                  <v-card variant="outlined" class="bg-white border-slate-200 rounded-xl">
                    <v-card-title class="text-subtitle-2 font-weight-bold text-slate-800 d-flex align-center pt-3 px-4">
                      <v-icon icon="mdi-account-graduation-outline" color="primary" class="mr-2" size="small" />
                      Enrolled Roster ({{ course.students.length }})
                    </v-card-title>
                    
                    <v-divider />
                    
                    <v-table density="comfortable" class="text-caption">
                      <thead>
                        <tr>
                          <th class="font-weight-bold">Student</th>
                          <th class="font-weight-bold">Domain</th>
                          <th class="text-center font-weight-bold" style="width: 60px;">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="student in course.students" :key="student.id">
                          <td class="font-weight-black text-slate-700">{{ student.web_id }}</td>
                          <td>
                            <v-chip size="x-small" variant="tonal" color="slate-600" class="text-uppercase font-weight-bold">
                              {{ student.domain || 'General' }}
                            </v-chip>
                          </td>
                          <td class="text-center">
                            <!-- 🔄 Explicit Unenroll Action per Student -->
                            <v-btn 
                              prepend-icon="mdi-link-off" 
                              variant="tonal" 
                              size="small" 
                              color="error"
                              @click="confirmUnenrollStudent(student, course.slug)"
                            >
                              <v-tooltip activator="parent" location="top">Unenroll</v-tooltip>
                            </v-btn>
                          </td>
                        </tr>
                        <tr v-if="course.students.length === 0">
                          <td colspan="3" class="text-center py-6 text-slate-400 bg-slate-50">
                            No students currently enrolled.
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card>
                </v-col>

                <v-col cols="12" md="8" v-if="course.objectives && course.objectives.length > 0">
                  <div class="d-flex flex-column gap-3">
                    
                    <div class="text-subtitle-2 font-weight-black text-indigo-darken-3 px-2 d-flex align-center">
                      <v-icon icon="mdi-bullseye-arrow" color="indigo" class="mr-2" size="small" />
                      Course Objectives
                      <v-chip size="x-small" color="indigo" variant="tonal" class="ml-3 font-weight-bold">
                        {{ course.objectives.length }} Objectives
                      </v-chip>
                    </div>

                    <v-expansion-panels variant="popout" class="objectives-accordion mt-1">
                      <v-expansion-panel 
                        v-for="(obj, idx) in course.objectives" 
                        :key="obj.id"
                        class="border border-slate-200 rounded-xl mb-2 elevation-sm"
                      >
                        <v-expansion-panel-title class="py-3 px-4">
                          <div class="d-flex align-center w-100 pr-4">
                            <v-avatar size="24" color="indigo-lighten-5" class="text-caption font-weight-black text-indigo mr-3">
                              {{ Number(idx) + 1 }}
                            </v-avatar>
                            
                            <div class="text-body-2 font-weight-medium text-slate-800 line-height-normal pr-4 flex-grow-1">
                              {{ obj.title }}
                            </div>
                            
                            <v-chip size="x-small" color="success" variant="flat" class="font-weight-black ml-auto">
                              {{ getObjectiveCompletionCount(course, obj.id) }} / {{ course.students.length }} 
                            </v-chip>
                          </div>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text class="bg-slate-50/50 pt-3 border-t">
                          <div class="text-overline font-weight-black text-slate-400 mb-2 tracking-wider">
                            Objective fulfilled:
                          </div>

                          <v-row no-gutters class="gap-2">
                            <v-col 
                              v-for="student in course.students" 
                              :key="student.id"
                              cols="12" 
                              sm="6" 
                              md="4"
                              class="pa-1"
                            >
                              <v-card 
                                variant="flat" 
                                border 
                                :class="isObjectiveFulfilled(student.id, course.slug, obj.id) ? 'border-success bg-success-lighten-5' : 'border-slate-200 bg-white'"
                                class="rounded-xl transition-all clickable-student-node"
                                @click="toggleStudentObjective(student.id, course.slug, obj.id)"
                              >
                                <div class="d-flex align-center justify-space-between pa-3">
                                  <div class="d-flex align-center">
                                    <v-icon 
                                      :icon="isObjectiveFulfilled(student.id, course.slug, obj.id) ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline'"
                                      :color="isObjectiveFulfilled(student.id, course.slug, obj.id) ? 'success' : 'slate-400'"
                                      class="mr-3"
                                    />
                                    <span class="font-weight-bold font-monospace text-body-2" :class="isObjectiveFulfilled(student.id, course.slug, obj.id) ? 'text-success-darken-2' : 'text-slate-700'">
                                      {{ student.web_id }}
                                    </span>
                                  </div>
                                  
                                  <v-chip size="x-small" variant="flat" color="slate-100" class="text-caption font-weight-bold">
                                    {{ student.initials }}
                                  </v-chip>
                                </div>
                              </v-card>
                            </v-col>
                            
                            <v-col cols="12" v-if="course.students.length === 0" class="text-center py-4 text-slate-400 text-caption">
                              No active student accounts found to verify for this criteria row tracker.
                            </v-col>
                          </v-row>
                        </v-expansion-panel-text>

                      </v-expansion-panel>
                    </v-expansion-panels>

                  </div>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-window-item>

      <v-window-item value="directory" class="animate-fade-in">
        <v-row class="mb-2 px-2">
          <v-col cols="12" class="d-flex align-center">
            <div class="d-flex justify-end">
              <v-checkbox
              v-model="userStore.showArchivedInRoster"
              label="Show Archived/Inactive Students"
              hide-details
              density="compact"
              color="slate-700"
            />
            </div>
            
          </v-col>
        </v-row>
        <v-card variant="outlined" class="border-grey-lighten-2 rounded-lg">
          <v-table hover>
            <thead class="bg-grey-lighten-4">
              <tr>
                <th class="font-weight-bold">Username</th>
                <th class="font-weight-bold">Initials</th>
                <th class="font-weight-bold">Domain</th>
                <th class="text-center font-weight-bold">Tot. Corr. Conj.</th>
                <th class="text-center font-weight-bold" style="width: 350px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in userStore.availableTeacherStudents" :key="student.id" :class="{'bg-grey-lighten-5 text-muted': !student.is_active}">
                <td class="font-weight-bold font-monospace" :class="student.is_active ? 'text-primary' : 'text-grey text-decoration-line-through'">
                  {{ student.web_id }}
                  <v-chip v-if="!student.is_active" size="x-small" color="error" class="ml-2">Archived</v-chip>
                </td>
                <td>{{ student.initials }}</td>
                <td>
                  <v-chip size="x-small" variant="tonal" color="slate-600" class="text-uppercase font-weight-bold">
                    {{ student.domain || 'None' }}
                  </v-chip>
                </td>
                <td class="text-center">{{ student.grand_total_correct_prompts || 0 }}</td>

                <td class="text-center">
                  <v-btn size="small" class="mx-1" variant="tonal" color="info" density="comfortable" @click="openEditStudentDialog(student)">
                    <v-icon>mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="top">
                      Modify
                    </v-tooltip>
                  </v-btn>

                  <v-btn 
                    size="small" class="mx-1" variant="tonal" 
                    :color="student.is_active ? 'orange-darken-1' : 'success'" 
                    density="comfortable" 
                    @click="userStore.toggleStudentArchiveStatus(student.id)"
                  >
                    <v-icon>{{ student.is_active ? 'mdi-account-minus-outline' : 'mdi-account-check-outline' }}</v-icon>
                    <v-tooltip activator="parent" location="top">
                      {{ student.is_active ? 'Archive Student Account' : 'Restore Student to Active' }}
                    </v-tooltip>
                  </v-btn>

                  <v-btn size="small" class="mx-1" variant="tonal" color="warning-darken-2" density="comfortable" @click="openResetPasswordDialog(student)">
                    <v-icon>mdi-lock-reset</v-icon>
                    <v-tooltip activator="parent" location="top">
                      Reset Student Password
                    </v-tooltip>
                  </v-btn>
                  <v-btn size="small" class="mx-1" variant="tonal" color="error" density="comfortable" @click="confirmDeleteStudent(student)">
                    <v-icon>mdi-trash-can</v-icon>
                    <v-tooltip activator="parent" location="top">
                      Delete Student
                    </v-tooltip>
                  </v-btn>
                </td>
              </tr>
              <tr v-if="userStore.teacherRoster.length === 0">
                <td colspan="5" class="text-center py-6 text-muted">No student profiles registered yet.</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>

      <v-window-item value="linguistic" class="animate-fade-in">
        <v-row class="mt-1 mb-4 align-center px-2">
          <v-col cols="12" sm="4">
            <v-text-field v-model="matrixSearch" label="Search for Student" variant="outlined" density="compact" hide-details prepend-inner-icon="mdi-magnify"></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select v-model="matrixAssessmentFilter" :items="assessmentStageItems" label="Filter Assessment Stage" variant="outlined" density="compact" hide-details clearable></v-select>
          </v-col>
        </v-row>

        <v-card variant="outlined" class="border-grey-lighten-2 rounded-lg">
          <v-table hover>
            <thead class="bg-grey-lighten-4">
              <tr>
                <th class="font-weight-bold">Student</th>
                <th class="font-weight-bold">Assessment Stage</th>
                <th class="text-center font-weight-bold">Precision</th>
                <th class="text-center font-weight-bold">Clarity</th>
                <th class="text-center font-weight-bold">Flow</th>
                <th class="text-center font-weight-bold">Range</th>
                <th class="font-weight-bold">Last Assessed</th>
                <th class="text-center font-weight-bold" style="width: 150px;">Assessment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredMatrixData" :key="student.id">
                <td class="font-weight-bold">{{ student.web_id }} <span class="text-caption text-grey ml-1">({{ student.initials }})</span></td>
                <td>
                  <v-chip size="small" color="blue-darken-1" variant="tonal" class="font-weight-medium">
                    {{ formatAssessmentStage(student.linguistic_profile?.latest_assessment ?? undefined) }}
                  </v-chip>
                </td>
                
                <td class="text-center">
                  <v-chip :color="getScoreBadgeColor(student.linguistic_profile?.linguistic_precision ?? undefined)" size="small" label font-weight-bold class="px-3">
                    {{ student.linguistic_profile?.linguistic_precision || '—' }}
                  </v-chip>
                </td>
                <td class="text-center">
                  <v-chip :color="getScoreBadgeColor(student.linguistic_profile?.phonetic_clarity ?? undefined)" size="small" label font-weight-bold class="px-3">
                    {{ student.linguistic_profile?.phonetic_clarity || '—' }}
                  </v-chip>
                </td>
                <td class="text-center">
                  <v-chip :color="getScoreBadgeColor(student.linguistic_profile?.communicative_flow ?? undefined)" size="small" label font-weight-bold class="px-3">
                    {{ student.linguistic_profile?.communicative_flow || '—' }}
                  </v-chip>
                </td>
                <td class="text-center">
                  <v-chip :color="getScoreBadgeColor(student.linguistic_profile?.expressive_range ?? undefined)" size="small" label font-weight-bold class="px-3">
                    {{ student.linguistic_profile?.expressive_range || '—' }}
                  </v-chip>
                </td>
                
                <td class="text-caption text-grey-darken-1">
                  <v-icon size="x-small" icon="mdi-clock-outline" class="mr-1"></v-icon>
                  {{ student.linguistic_profile?.last_assessed_at ? new Date(student.linguistic_profile.last_assessed_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'Never' }}
                </td>
                <td class="text-center">
                  <v-btn size="small" color="primary" prepend-icon="mdi-clipboard-edit" variant="elevated" @click="openAssessmentPanel(student)">
                    Assess
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>

    </v-window>

<v-dialog v-model="courseDialog" max-width="550px">
  <v-card rounded="lg">
    <v-card-title class="pa-4 bg-primary text-white font-weight-bold">
      {{ isEditingCourse ? 'Course Parameters' : 'Create New Course Module' }}
    </v-card-title>
    <v-card-text class="pt-4">
      <v-form ref="courseFormRef">
        <v-text-field 
          v-model="newCourse.slug" 
          variant="outlined" 
          density="compact"
          :disabled="isEditingCourse"
          :rules="[v => !!v || 'Course slug identifier is required']"
        />

        <div class="row g-2 mb-3">
          <div class="col-6">
            <v-select v-model="newCourse.semester" :items="['FALL', 'SPRING']" label="Active Semester" variant="outlined" density="compact" />
          </div>
          <div class="col-6">
            <v-checkbox v-model="newCourse.is_active" label="Active Course" color="success" class="mt-n1" />
          </div>
        </div>

        <v-divider class="my-4" />

        <div class="d-flex justify-space-between align-center mb-8">
          <span class="text-subtitle-2 font-weight-bold text-slate-800">Course Objectives</span>
          <v-btn size="small" variant="tonal" color="indigo" prepend-icon="mdi-plus" @click="addGoalToCourseForm">Add Objective</v-btn>
        </div>

        <div v-if="!newCourse.objectives.length" class="text-caption text-center py-4 border dashed rounded-xl text-slate-400 bg-slate-50">
          No objectives yet.
        </div>
        
        <div v-else max-height="250px" class="overflow-y-auto pr-1 pa-3">
          <div v-for="(goal, index) in newCourse.objectives" :key="index" class="d-flex align-center gap-2 mb-2">
            <v-text-field v-model="goal.title" :label="`Objective #${index + 1} Title`" placeholder="e.g., Mastery of Subjunctive Form" variant="outlined" density="compact" hide-details />
            <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" @click="newCourse.objectives.splice(index, 1)" />
          </div>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions class="pa-4 justify-end">
      <v-btn variant="text" @click="courseDialog = false">Cancel</v-btn>
      <v-btn color="primary" variant="elevated" :loading="loading" @click="submitCourseForm">Save Changes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

    <v-dialog v-model="studentDialog" max-width="500px">
      <v-card rounded="lg">
        <v-card-title class="pa-4 bg-secondary text-white font-weight-bold">
          {{ isEditingStudent ? 'Modify Student Details' : 'Register New Student Profile' }}
        </v-card-title>
        <v-card-text class="pt-4">
          <v-form ref="studentFormRef">
            <v-text-field v-model="newStudent.initials" label="Student Initials" variant="outlined" maxlength="10" :rules="[v => !!v || 'Initials are required']"></v-text-field>
            <v-select v-model="newStudent.domain" :items="domainOptions" item-title="label" item-value="value" label="Module Domain" variant="outlined" :rules="[v => !!v || 'Domain is required']"></v-select>
            <v-select v-if="!isEditingStudent" v-model="newStudent.initialCourse" :items="courses" item-title="slug" item-value="slug" label="Initial Enrolled Course" variant="outlined" :rules="[v => !!v || 'Initial course assignment is required']"></v-select>
          </v-form>
        </v-card-text>
        <v-card-text>
          <v-text-field
            v-model="newStudent.usernameSlug"
            label="Generated Student Username Slug"
            placeholder="e.g., computer_science_1-5"
            variant="outlined"
            persistent-hint
            hint="Review or modify this system suggestion. It must be globally unique."
            class="mt-4"
            :disabled="isEditingStudent"
            :rules="[v => !!v || 'A unique login identifier slug is required to generate system accounts']"
            prepend-inner-icon="mdi-badge-account-horizontal-outline"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="text" @click="studentDialog = false">Cancel</v-btn>
          <v-btn color="secondary" variant="elevated" :loading="loading" @click="submitStudentForm">Save Profile</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="enrollmentDialog" max-width="500px">
      <v-card rounded="lg">
        <v-card-title class="pa-4 bg-success text-white font-weight-bold">Assign Student to Course Room</v-card-title>
        <v-card-text class="pt-4">
          <v-form ref="enrollmentFormRef">
            <v-autocomplete v-model="newEnrollment.studentWebId" :items="userStore.teacherRoster" item-title="web_id" item-value="web_id" label="Select Student Web ID" variant="outlined" :rules="[v => !!v || 'Student ID selection is required']"></v-autocomplete>
            <v-select v-model="newEnrollment.courseSlug" :items="courses" item-title="slug" item-value="slug" label="Target Course Room" variant="outlined" :rules="[v => !!v || 'Target course selection is required']"></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="text" @click="enrollmentDialog = false">Cancel</v-btn>
          <v-btn color="success" variant="elevated" :loading="loading" @click="submitAssignCourse">Process Enrollment</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteConfirmDialog" max-width="450px">
      <v-card rounded="lg" class="pa-2">
        <v-card-title class="text-h6 font-weight-bold text-error d-flex align-center gap-2">
          <v-icon color="error">mdi-alert-circle</v-icon> Confirm Operations Change
        </v-card-title>
        <v-card-text class="text-body-1 py-2">
          Are you sure you want to execute this operation on <strong>{{ deleteTargetLabel }}</strong>?<br>
          <span class="text-caption text-error font-weight-bold" v-if="deleteTargetType !== 'unenroll'">⚠️ Warning: This path modification is permanent.</span>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="deleteConfirmDialog = false">Cancel</v-btn>
          <v-btn :color="deleteTargetType === 'unenroll' ? 'orange' : 'error'" variant="elevated" :loading="loading" @click="executeConfirmedDestruction">Confirm Execution</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="passwordResetDialog" max-width="450px">
      <v-card rounded="lg">
        <v-card-title class="pa-4 bg-warning text-dark font-weight-bold">Reset Password for {{ selectedStudent?.web_id }}</v-card-title>
        <v-card-text class="pt-4">
          <v-text-field v-model="newPasswordForStudent" label="Generated Password" variant="outlined">
            <template v-slot:append-inner><v-btn icon variant="text" size="small" color="primary" @click="copyToClipboard(newPasswordForStudent)"><v-icon>mdi-content-copy</v-icon></v-btn></template>
          </v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4 justify-end"><v-btn variant="text" @click="passwordResetDialog = false">Cancel</v-btn><v-btn color="warning" variant="elevated" @click="submitPasswordReset">Save</v-btn></v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="successDialog" max-width="500px" persistent>
  <v-card rounded="lg">
    <v-card-title class="pa-4 bg-success text-white font-weight-bold">
      Student Registered Successfully
    </v-card-title>
    
    <v-card-text class="pt-4">
      <v-alert
        type="warning"
        variant="tonal"
        density="comfortable"
        icon="mdi-alert-circle-outline"
        class="mb-4 rounded-xl text-caption font-weight-bold"
      >
        Copy now! This is the only time you will see the password.
      </v-alert>

      <v-text-field 
        v-model="registeredSummary.webId" 
        label="Username (Web ID)" 
        variant="plain" 
        bg-color="grey-lighten-4" 
        readonly 
        class="mb-3 px-2 rounded-lg"
      />
      <v-text-field 
        v-model="registeredSummary.password" 
        label="Password" 
        variant="plain" 
        bg-color="grey-lighten-4" 
        readonly 
        class="mb-4 px-2 rounded-lg"
      />

      <v-btn
        color="primary"
        variant="tonal"
        block
        size="large"
        class="text-none font-weight-bold mb-2 rounded-xl"
        prepend-icon="mdi-content-copy"
        @click="copyCombinedCredentials"
      >
        Copy Credentials Combo String
      </v-btn>
    </v-card-text>
    
    <v-card-actions class="pa-4 pt-0">
      <v-btn color="success" variant="elevated" block size="large" class="rounded-xl font-weight-bold" @click="successDialog = false">
        Close Window
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="assessmentDialog" max-width="1200px" scrollable>
      <v-card rounded="lg" elevation="4" class="d-flex flex-column" style="max-height: 90vh;">
        
        <v-card-title class="pa-4 bg-teal-lighten-1 text-white d-flex align-center justify-space-between flex-none">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-voice" class="mr-2"></v-icon>
            Linguistic Assessment: 
            <span class="mx-2 font-weight-black text-amber-lighten-3">{{ activeAssessmentStudent?.initials }}</span> 
            <v-chip size="small" variant="outlined" color="white" class="ml-2 font-monospace">{{ activeAssessmentStudent?.web_id }}</v-chip>
          </div>
          <v-btn icon="mdi-close" variant="text" color="white" @click="assessmentDialog = false"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-0 bg-grey-lighten-4 flex-grow-1 overflow-y-auto" style="height: 600px;">
          <v-row no-gutters class="fill-height">
            
            <v-col cols="12" md="8" class="pa-4 bg-white overflow-y-auto fill-height">
              <v-form ref="assessmentFormRef">
                
                <div class="row g-2 mb-2">
                  <div class="col-sm-7">
                    <v-select 
                      v-model="assessmentForm.latest_assessment" 
                      :items="assessmentStageItems" 
                      label="Assessment Stage" 
                      variant="outlined" 
                      density="compact" 
                      hide-details 
                      color="purple"
                    />
                  </div>
                  <div class="col-sm-5">
                    <v-checkbox 
                      v-model="assessmentForm.create_snapshot" 
                      label="Take snapshot of last assessment" 
                      color="warning" 
                      hide-details 
                      density="compact" 
                      class="px-2 border rounded border-orange-lighten-3 bg-orange-lighten-5 text-caption font-weight-medium"
                    />
                  </div>
                </div>
                
                <v-divider class="my-3" />

                <div v-for="metric in metricSchema" :key="metric.field" class="mb-4 pa-3 rounded border bg-grey-lighten-5">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <div>
                      <span class="font-weight-bold text-subtitle-1 text-grey-darken-4 d-block">{{ metric.title }}</span>
                      <span class="text-caption text-grey-darken-1 d-block mt-n1">{{ metric.description }}</span>
                    </div>
                    <div>
                      <v-chip size="small" color="blue" class="font-weight-black text-white px-2 shadow-sm">
                        Score: {{ assessmentForm[metric.field] || '1' }} / 10
                      </v-chip>
                    </div>
                  </div>

                  <div class="d-flex px-1 mb-2 align-center justify-space-between text-center font-weight-black text-uppercase" style="font-size: 0.65rem; gap: 4px;">
                    <div 
                      class="flex-grow-1 pa-1 border rounded bg-amber-lighten-5 text-amber-darken-4" 
                      :class="{'border-amber-darken-2 elevation-2 font-weight-black': assessmentForm[metric.field] >= 1 && assessmentForm[metric.field] <= 3}"
                    >
                      Beginner (1-3)
                    </div>
                    <div 
                      class="flex-grow-1 pa-1 border rounded bg-blue-lighten-5 text-blue-darken-4" 
                      :class="{'border-blue-darken-2 elevation-2 font-weight-black': assessmentForm[metric.field] >= 4 && assessmentForm[metric.field] <= 6}"
                    >
                      Intermediate (4-6)
                    </div>
                    <div 
                      class="flex-grow-1 pa-1 border rounded bg-purple-lighten-5 text-purple-darken-4" 
                      :class="{'border-purple-darken-2 elevation-2 font-weight-black': assessmentForm[metric.field] >= 7 && assessmentForm[metric.field] <= 8}"
                    >
                      Upper-Int (7-8)
                    </div>
                    <div 
                      class="flex-grow-1 pa-1 border rounded bg-green-lighten-5 text-green-darken-4" 
                      :class="{'border-green-darken-2 elevation-2 font-weight-black': assessmentForm[metric.field] >= 9 && assessmentForm[metric.field] <= 10}"
                    >
                      Advanced (9-10)
                    </div>
                  </div>
                  
                  <v-slider 
                    v-model="assessmentForm[metric.field]" 
                    min="1" 
                    max="10" 
                    step="1" 
                    thumb-label="always" 
                    show-ticks="always" 
                    tick-size="3" 
                    color="teal-lighten-1" 
                    hide-details 
                    class="px-1 mt-1"
                  />
                  
                  <v-textarea 
                    v-model="assessmentForm[metric.commentField]" 
                    label="Justification and description..." 
                    variant="outlined" 
                    rows="2" 
                    density="compact" 
                    hide-details 
                    class="mt-3 text-caption bg-white"
                  />
                </div>
              </v-form>
            </v-col>

            <v-col cols="12" md="4" class="pa-4 border-s bg-grey-lighten-5 overflow-y-auto fill-height">
              <div class="sticky-top" style="top: 0;">
                <div class="text-overline font-weight-bold text-grey-darken-2 mb-2 tracking-wide">
                  <v-icon icon="mdi-chart-box-outline" class="mr-1" size="small" />Projected profile
                </div>
                
                <v-card variant="flat" color="white" border rounded="lg" class="pa-3 shadow-sm border-grey-lighten-2 mb-3">
                  <div class="d-flex align-center border-b pb-2 mb-2">
                    <span class="text-h4 mr-2">{{ liveCalculatedProfileType.emoji }}</span>
                    <div>
                      <h4 class="text-subtitle-1 font-weight-black text-grey-darken-4 mb-0 leading-tight">
                        {{ liveCalculatedProfileType.type }}
                      </h4>
                    </div>
                  </div>

                  <p class="text-caption text-grey-darken-3 line-height-sm mb-3">
                    {{ liveCalculatedProfileType.description }}
                  </p>

                  <div class="pa-2.5 rounded bg-purple-lighten-5 border border-purple-lighten-4 text-caption text-purple-darken-4 mb-1">
                    <strong>Learning advice:</strong> {{ liveCalculatedProfileType.advice }}
                  </div>
                </v-card>

                <v-card variant="flat" border class="pa-2.5 bg-white rounded-lg border-grey-lighten-2">
                  <div class="row g-2 text-center text-caption">
                    <div class="col-6">
                      <div class="border rounded py-1.5 bg-grey-lighten-5">
                        <span class="text-grey text-xs d-block">Content Avg</span>
                        <strong class="text-body-2 font-monospace text-dark">
                          {{ ((Number(assessmentForm.linguistic_precision || 1) + Number(assessmentForm.expressive_range || 1)) / 2).toFixed(1) }}
                        </strong>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="border rounded py-1.5 bg-grey-lighten-5">
                        <span class="text-grey text-xs d-block">Form Avg</span>
                        <strong class="text-body-2 font-monospace text-dark">
                          {{ ((Number(assessmentForm.communicative_flow || 1) + Number(assessmentForm.phonetic_clarity || 1)) / 2).toFixed(1) }}
                        </strong>
                      </div>
                    </div>
                  </div>
                </v-card>
              </div>
            </v-col>
            
          </v-row>
        </v-card-text>
        
        <v-card-actions class="pa-4 bg-grey-lighten-3 justify-end border-t flex-none" style="position: relative; z-index: 10;">
          <v-btn variant="text" color="grey-darken-2" class="px-4 font-weight-bold" @click="assessmentDialog = false">
            Cancel
          </v-btn>
          <v-btn 
            color="teal-lighten-1" 
            variant="elevated" 
            class="px-6 font-weight-bold shadow-sm" 
            :disabled="loading"
            @click="submitLinguisticAssessment"
          >
            <v-icon icon="mdi-content-save-check" start />
            Save Assessment
          </v-btn>
        </v-card-actions>
        
      </v-card>
    </v-dialog>

    <v-snackbar v-model="toast.show" :color="toast.color" timeout="4000">{{ toast.message }}</v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// State Navigation Parameters
const activeTab = ref('courses')
const loading = ref(false)
const courseDialog = ref(false)
const studentDialog = ref(false)
const enrollmentDialog = ref(false)
const passwordResetDialog = ref(false)
const successDialog = ref(false)
const deleteConfirmDialog = ref(false)

// Destruction Targets states
const isEditingCourse = ref(false)
const isEditingStudent = ref(false)
const currentEditStudentId = ref<number | null>(null)
const deleteTargetType = ref<'course' | 'student' | 'unenroll' | null>(null)
const deleteTargetId = ref<any>(null)
const deleteTargetLabel = ref('')

const courses = ref<any[]>([])
const enrollments = ref<any[]>([])
const selectedStudent = ref<any>(null)
const newPasswordForStudent = ref('')
const registeredSummary = ref({ webId: '', password: '' })

const courseFormRef = ref()
const studentFormRef = ref()
const enrollmentFormRef = ref()

const newCourse = ref({
  slug: '',
  is_active: true,
  semester: 'FALL' as 'FALL' | 'SPRING',
  objectives: [] as Array<{ id: string; title: string }>
})
const newStudent = ref({ initials: '', domain: '', initialCourse: '', usernameSlug: '' })
const newEnrollment = ref({ studentWebId: '', courseSlug: '' })
const toast = ref({ show: false, message: '', color: 'success' })

// Linguistic profiles states
const assessmentDialog = ref(false)
const assessmentFormRef = ref()
const matrixSearch = ref('')
const matrixAssessmentFilter = ref<string | null>(null)
const activeAssessmentStudent = ref<any>(null)

const domainOptions = [
  { value: 'architecture', label: 'Architecture' }, { value: 'business_1', label: 'Business 1' },
  { value: 'business_2', label: 'Business 2' }, { value: 'business_3', label: 'Business 3' },
  { value: 'general', label: 'General' }
]

const metricSchema = [
  { field: 'linguistic_precision', commentField: 'linguistic_precision_comment', title: 'Linguistic Accuracy', description: 'How accurately the student applies grammar rules' },
  { field: 'phonetic_clarity', commentField: 'phonetic_clarity_comment', title: 'Phonetic Clarity', description: 'How accurately and clearly the student applies pronunciation rules' },
  { field: 'communicative_flow', commentField: 'communicative_flow_comment', title: 'Communicative Flow', description: 'Level of fluency, confidence, resourcefulness and effectiveness in communication' },
  { field: 'expressive_range', commentField: 'expressive_range_comment', title: 'Expressive Range', description: 'Range of vocabulary, complexity or nuance of expression, and performance in different contexts' }
]

const assessmentStageItems = [
  { title: 'Initial Assessment', value: 'initial' },
  { title: 'Mid-Semester 1', value: 'mid_sem_1' },
  { title: 'End Semester 1', value: 'end_sem_1' },
  { title: 'Mid-Semester 2', value: 'mid_sem_2' },
  { title: 'End Semester 2', value: 'end_sem_2' },
  { title: 'Exit Assessment', value: 'exit' }
]

const assessmentForm = ref<Record<string, any>>({
  latest_assessment: '',
  create_snapshot: true,
  linguistic_precision: 5,
  linguistic_precision_comment: '',
  phonetic_clarity: 5,
  phonetic_clarity_comment: '',
  communicative_flow: 5,
  communicative_flow_comment: '',
  expressive_range: 5,
  expressive_range_comment: ''
})

const formatDomain = (v: string) => domainOptions.find(d => d.value === v)?.label || v
const showToast = (m: string, c = 'success') => { toast.value = { show: true, message: m, color: c } }

const wordData = ref<[string, string[]][]>([]);
const activeList = ref<[string, string[]][]>([]);
const passwordSymbols = ['!', '@', '#', '$', '%', '^', '&', '*', '?', '-', '_', '=', '+'];

const randomizeWordCasing = (word: string): string => {
  return word
    .split('')
    .map(char => (Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()))
    .join('');
};

/**
 * 🌟 CACHED SYNC PIPELINE
 * Pulls relational structures only if state memory fields are empty.
 * Passing force=true bypasses the cache filter for explicit refresh triggers.
 */
const fetchData = async (force = false) => {
  // If data is already cached and we aren't forcing a refresh, skip the network hit
  if (!force && courses.value.length > 0 && enrollments.value.length > 0 && userStore.teacherRoster.length > 0) {
    return
  }

  loading.value = true
  try {
    const [coursesRes, enrollmentsRes] = await Promise.all([
      api.get('/courses/'),
      api.get('/enrollment/'),
      userStore.fetchTeacherRoster() // Synchronizes your global store collection
    ])
    courses.value = coursesRes.data
    enrollments.value = enrollmentsRes.data
  } catch {
    showToast('Synchronization transaction error encountered.', 'error')
  } finally {
    loading.value = false
  }
}

const generateProportionalPassword = (): string => {
  if (!activeList.value || activeList.value.length === 0) {
    const safetyWords = ['quantum', 'matrix', 'cipher', 'vector', 'vertex', 'nexus'];
    const fallbackW1 = safetyWords[Math.floor(Math.random() * safetyWords.length)];
    const fallbackW2 = safetyWords[Math.floor(Math.random() * safetyWords.length)];
    return `${randomizeWordCasing(fallbackW1)}-${randomizeWordCasing(fallbackW2)}-${Math.floor(Math.random() * 90 + 10)}!!99`;
  }

  const entry1 = activeList.value[Math.floor(Math.random() * activeList.value.length)];
  const entry2 = activeList.value[Math.floor(Math.random() * activeList.value.length)];

  const variants1 = entry1[1];
  const variants2 = entry2[1];

  const rawWord1 = variants1[Math.floor(Math.random() * variants1.length)] || entry1[0];
  const rawWord2 = variants2[Math.floor(Math.random() * variants2.length)] || entry2[0];

  const cleanWord1 = randomizeWordCasing(rawWord1.trim().replace(/[^a-zA-Z]/g, ''));
  const cleanWord2 = randomizeWordCasing(rawWord2.trim().replace(/[^a-zA-Z]/g, ''));

  const d1 = Math.floor(Math.random() * 10).toString();
  const d2 = Math.floor(Math.random() * 10).toString();
  const s1 = passwordSymbols[Math.floor(Math.random() * passwordSymbols.length)];
  const s2 = passwordSymbols[Math.floor(Math.random() * passwordSymbols.length)];

  return `${cleanWord1}-${cleanWord2}-${d1}${s1}${d2}${s2}`;
};

function copyCombinedCredentials() {
  const username = registeredSummary.value?.webId || '';
  const password = registeredSummary.value?.password || '';
  const combinedString = `user name = ${username}  password = ${password}`;
  copyToClipboard(combinedString);
}
// 🌟 MULTI-TIERED SORTED PIPELINE: Active first (A-Z) -> Archived last (A-Z)
const groupedData = computed(() => {
  let filteredCourses = [...courses.value];

  // 1. Filter out archived courses entirely if the checkbox is unticked
  if (!userStore.showArchivedInCourses) {
    filteredCourses = filteredCourses.filter(c => c.is_active === true);
  }

  // 2. Sort by active status first, then alphabetically by slug
  filteredCourses.sort((a, b) => {
    // Treat active as 1 and inactive as 0
    const activeA = a.is_active ? 1 : 0;
    const activeB = b.is_active ? 1 : 0;

    if (activeA !== activeB) {
      // Sort descending by activity flag (1 comes before 0, so Active comes first)
      return activeB - activeA;
    }

    // Tie-breaker: If both are active or both are archived, sort alphabetically
    return a.slug.localeCompare(b.slug);
  });

  // 3. Map students to their respective courses
  return filteredCourses.map(c => {
    const ids = enrollments.value
      .filter(e => normalizeCourseSlug(e.course) === c.slug)
      .map(e => normalizeWebId(e.student));
    
    return { 
      ...c, 
      students: userStore.teacherRoster.filter(s => ids.includes(s.web_id)) 
    };
  });
});

watch(() => userStore.showArchivedInCourses, () => {
  // If your backend endpoint supports filtering parameters, you can also force re-fetch directly:
  // fetchData(true);
});

function addGoalToCourseForm() {
  const generatedUid = `obj_${Math.random().toString(36).substring(2, 7)}`
  newCourse.value.objectives.push({ id: generatedUid, title: '' })
}
function openEditCourseDialog(course: any) {
  isEditingCourse.value = true
  newCourse.value = {
    slug: course.slug,
    is_active: course.is_active ?? true,
    semester: course.semester || 'FALL',
    // Perform copy loop configurations to safely disconnect reactive proxy structures reference bounds
    objectives: course.objectives ? JSON.parse(JSON.stringify(course.objectives)) : []
  }
  courseDialog.value = true
}
// Returns the aggregate total of students who have completed a given goal parameter
function getObjectiveCompletionCount(course: any, objectiveId: string): number {
  if (!course || !course.students) return 0;
  return course.students.filter((student: any) => 
    isObjectiveFulfilled(student.id, course.slug, objectiveId)
  ).length;
}

// Redirect create or patch requests straight down the correct channel pathways loops
function submitCourseForm() {
  if (isEditingCourse.value) executeEditCourse()
  else submitCreateCourse()
}


const submitCreateCourse = async () => {
  const { valid } = await courseFormRef.value.validate()
  if (!valid) return
  loading.value = true
  try {
    const serializedPayload = {
      slug: newCourse.value.slug.toLowerCase().trim().replace(/\s+/g, '_'),
      is_active: newCourse.value.is_active,
      semester: newCourse.value.semester,
      objectives: newCourse.value.objectives.filter(g => g.title.trim().length > 0)
    }
    await api.post('/courses/', serializedPayload)
    showToast('New course space successfully initialized.')
    courseDialog.value = false
    await fetchData(true) 
  } catch {
    showToast('Failed to serialize and deploy course model parameters to server.', 'error')
  } finally { loading.value = false }
}

const executeEditCourse = async () => {
  loading.value = true
  try {
    const serializedPayload = {
      is_active: newCourse.value.is_active,
      semester: newCourse.value.semester,
      objectives: newCourse.value.objectives.filter(g => g.title.trim().length > 0)
    }
    await api.patch(`/courses/${newCourse.value.slug}/`, serializedPayload)
    showToast(`Course data fields updated for ${newCourse.value.slug}`)
    courseDialog.value = false
    await fetchData(true)
  } catch {
    showToast('Failed to commit modified course properties fields data down to persistent layout arrays.', 'error')
  } finally { loading.value = false }
}

async function toggleCourseActiveStatus(course: any) {
  try {
    await api.patch(`/courses/${course.slug}/`, { is_active: !course.is_active })
    showToast(`Course ${course.slug} visibility status flipped successfully.`)
    await fetchData(true)
  } catch {
    showToast('Server rejected configuration visibility state modification request.', 'error')
  }
}

function getEnrollmentRecord(studentId: number, courseSlug: string) {
  return enrollments.value.find(e => {
    // Dig down cleanly to extract the ID number parameter regardless of nested layout styles
    const sId = e.student && typeof e.student === 'object' ? e.student.id : null;
    const sWebId = e.student && typeof e.student !== 'object' ? String(e.student) : null;
    
    const cSlug = e.course && typeof e.course === 'object' ? e.course.slug : String(e.course);
    
    // Cross-verify matching criteria on ID value OR matching web_id string tags safely
    const studentMatches = (sId === studentId) || 
                          (userStore.teacherRoster.find(s => s.id === studentId)?.web_id === sWebId);
                          
    return studentMatches && cSlug === courseSlug;
  });
}

function isObjectiveFulfilled(studentId: number, courseSlug: string, objectiveId: string): boolean {
  const match = getEnrollmentRecord(studentId, courseSlug)
  if (!match || !match.objective_fulfillment) return false
  return !!match.objective_fulfillment[objectiveId]
}

async function toggleStudentObjective(studentId: number, courseSlug: string, objectiveId: string) {
  const match = getEnrollmentRecord(studentId, courseSlug)
  if (!match) {
    showToast('Error, sorry.', 'error')
    return
  }

  try {
    // Fire the dispatch request targeting the newly written ViewSet atomic action path endpoint mapping rule!
    const response = await api.post(`/enrollment/${match.id}/toggle-objective/`, {
      objective_id: objectiveId
    })
    
    // Instantly reflect the change locally to update the UI checkboxes
    match.objective_fulfillment = response.data.objective_fulfillment
    showToast(response.data.is_fulfilled ? 'Objective marked complete.' : 'Objective reverted to incomplete.')
  } catch (err: any) {
    showToast(err.response?.data?.error || 'Failed to update objective.', 'error')
  }
}

const openRegisterStudentDialog = () => { isEditingStudent.value = false; newStudent.value = { initials: '', domain: '', initialCourse: '', usernameSlug: '' }; studentDialog.value = true }
const openEditStudentDialog = (student: any) => { isEditingStudent.value = true; currentEditStudentId.value = student.id; newStudent.value = { initials: student.initials, domain: student.domain || '', initialCourse: '', usernameSlug: student.usernameSlug || '' }; studentDialog.value = true }
const submitStudentForm = () => { if (isEditingStudent.value) executeEditStudent(); else submitRegisterStudent() }

const submitRegisterStudent = async () => {
  const { valid } = await studentFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const finalWebId = newStudent.value.usernameSlug.toLowerCase().trim().replace(/\s+/g, '_');
    if (!finalWebId) {
      showToast('A valid unique username identifier slug is required.', 'error');
      return;
    }

    const pwd = generateProportionalPassword();
    const userRes = await api.post('/users/', { 
      username: finalWebId, 
      email: `${finalWebId}@schoolsystem.com`, 
      password: pwd 
    });
    
    await api.post('/students/', { 
      web_id: finalWebId, 
      initials: newStudent.value.initials.toUpperCase().trim(), 
      domain: newStudent.value.domain, 
      user: userRes.data.id 
    });
    
    await api.post('/enrollment/', { 
      student: finalWebId, 
      course: newStudent.value.initialCourse 
    });

    registeredSummary.value = { webId: finalWebId, password: pwd };
    studentDialog.value = false;
    successDialog.value = true;
    await fetchData(true); // Force sync to update state
  } catch (err: any) { 
    console.error("Payload rejection details:", err.response?.data);
    if (err.response?.data?.username) {
      showToast(`Username Error: ${err.response.data.username[0]} Try modifying the suggested suffix field.`, 'error');
    } else {
      showToast('Registration transaction dropped by data validations rules.', 'error');
    }
  } finally { 
    loading.value = false;
  }
}

const executeEditStudent = async () => {
  loading.value = true
  try {
    await api.patch(`/students/${currentEditStudentId.value}/`, { initials: newStudent.value.initials.toUpperCase().trim(), domain: newStudent.value.domain })
    showToast('Student details updated.')
    studentDialog.value = false; 
    await fetchData(true) // Force sync to populate everywhere smoothly
  } catch { showToast('Profile editing failed.', 'error') } finally { loading.value = false }
}

const submitAssignCourse = async () => {
  const { valid } = await enrollmentFormRef.value.validate()
  if (!valid) return
  loading.value = true
  try {
    await api.post('/enrollment/', { student: newEnrollment.value.studentWebId, course: newEnrollment.value.courseSlug })
    showToast('Student assigned successfully.')
    enrollmentDialog.value = false; 
    await fetchData(true)
  } catch { showToast('Enrollment assignment dropped.', 'error') } finally { loading.value = false }
}

const confirmDeleteCourse = (course: any) => {
  deleteTargetType.value = 'course'
  deleteTargetId.value = course.slug
  deleteTargetLabel.value = `Course Module space "${course.slug}"`
  deleteConfirmDialog.value = true
}

const confirmDeleteStudent = (student: any) => {
  deleteTargetType.value = 'student'
  deleteTargetId.value = student.id
  deleteTargetLabel.value = `Student global account "${student.web_id}" and their authentication records`
  deleteConfirmDialog.value = true
}

const confirmUnenrollStudent = (student: any, courseSlug: string) => {
  const match = enrollments.value.find(e => normalizeWebId(e.student) === student.web_id && normalizeCourseSlug(e.course) === courseSlug)
  if (!match) {
    showToast('Failed to resolve database link reference pairing for un-enrollment.', 'error')
    return
  }
  deleteTargetType.value = 'unenroll'
  deleteTargetId.value = match.id
  deleteTargetLabel.value = `Student link for "${student.web_id}" from course room "${courseSlug}"`
  deleteConfirmDialog.value = true
}

const executeConfirmedDestruction = async () => {
  loading.value = true
  try {
    if (deleteTargetType.value === 'course') {
      await api.delete(`/courses/${deleteTargetId.value}/`)
      showToast('Course module wiped out.')
    } else if (deleteTargetType.value === 'student') {
      await api.delete(`/students/${deleteTargetId.value}/`)
      showToast('Student global master profile deleted.')
    } else if (deleteTargetType.value === 'unenroll') {
      await api.delete(`/enrollment/${deleteTargetId.value}/`)
      showToast('Student successfully removed from course roster layout track.')
    }
    deleteConfirmDialog.value = false
    await fetchData(true)
  } catch {
    showToast('Operational rejection reported by system views endpoints configuration rules.', 'error')
  } finally {
    loading.value = false
  }
}

const openResetPasswordDialog = (s: any) => { selectedStudent.value = s; newPasswordForStudent.value = generateProportionalPassword(); passwordResetDialog.value = true }
const submitPasswordReset = async () => {
  try {
    await api.post(`/students/${selectedStudent.value.id}/reset_password/`, { password: newPasswordForStudent.value })
    showToast('Password saved.')
    passwordResetDialog.value = false
  } catch { showToast('Error patching passwords values.', 'error') }
}

const normalizeWebId = (f: any) => f && typeof f === 'object' ? f.web_id : String(f)
const normalizeCourseSlug = (f: any) => f && typeof f === 'object' ? f.slug : String(f)
const copyToClipboard = async (t: string) => { if (t) await navigator.clipboard.writeText(t); showToast('Copied!') }

const filteredMatrixData = computed(() => {
  // 🌟 Read straight from the global store cache layer
  return userStore.teacherRoster.filter(s => {
    const matchesSearch = !matrixSearch.value || 
      s.web_id?.toLowerCase().includes(matrixSearch.value.toLowerCase()) ||
      s.initials?.toLowerCase().includes(matrixSearch.value.toLowerCase());
      
    const matchesStage = !matrixAssessmentFilter.value || 
      s.linguistic_profile?.latest_assessment === matrixAssessmentFilter.value;
      
    return matchesSearch && matchesStage;
  });
});

const formatAssessmentStage = (val?: string) => {
  if (!val) return 'Not Evaluated';
  const match = assessmentStageItems.find(item => item.value === val);
  return match ? match.title : val;
};

const getScoreBadgeColor = (score?: number) => {
  if (!score) return 'grey-lighten-1';
  if (score >= 9) return 'success';
  if (score >= 7) return 'teal-lighten-1';
  if (score >= 4) return 'amber-darken-1';
  return 'error';
};

const openAssessmentPanel = (student: any) => {
  activeAssessmentStudent.value = student;
  
  // Extract data from the store-nested linguistic profile parameters
  const profile = student.linguistic_profile || {};
  
  assessmentForm.value = {
    latest_assessment: profile.latest_assessment || '',
    create_snapshot: !!profile.latest_assessment,
    linguistic_precision: profile.linguistic_precision ?? 5,
    linguistic_precision_comment: profile.linguistic_precision_comment || '',
    phonetic_clarity: profile.phonetic_clarity ?? 5,
    phonetic_clarity_comment: profile.phonetic_clarity_comment || '',
    communicative_flow: profile.communicative_flow ?? 5,
    communicative_flow_comment: profile.communicative_flow_comment || '',
    expressive_range: profile.expressive_range ?? 5,
    expressive_range_comment: profile.expressive_range_comment || ''
  };
  
  assessmentDialog.value = true;
};

const submitLinguisticAssessment = async () => {
  if (!activeAssessmentStudent.value) return;

  loading.value = true;
  try {
    const studentId = activeAssessmentStudent.value.id;
    const payload = {
      latest_assessment: assessmentForm.value.latest_assessment || '',
      snapshot: !!assessmentForm.value.create_snapshot,
      linguistic_precision: Number(assessmentForm.value['linguistic_precision'] ?? 5),
      linguistic_precision_comment: assessmentForm.value['linguistic_precision_comment'] || '',
      phonetic_clarity: Number(assessmentForm.value['phonetic_clarity'] ?? 5),
      phonetic_clarity_comment: assessmentForm.value['phonetic_clarity_comment'] || '',
      communicative_flow: Number(assessmentForm.value['communicative_flow'] ?? 5),
      communicative_flow_comment: assessmentForm.value['communicative_flow_comment'] || '',
      expressive_range: Number(assessmentForm.value['expressive_range'] ?? 5),
      expressive_range_comment: assessmentForm.value['expressive_range_comment'] || ''
    };

    const endpointRouteKey = 'linguistic-profiles';
    await api.patch(`/${endpointRouteKey}/${studentId}/`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    showToast(`Linguistic metrics successfully locked down for ${activeAssessmentStudent.value.web_id}`);
    assessmentDialog.value = false;
    await fetchData(true); // Force clear the store caches to force a sync display update
    
  } catch (err: any) {
    console.error("❌ Assessment sync completely rejected:", err);
    const errorDetails = err.response?.data;
    if (errorDetails && typeof errorDetails === 'object') {
      const firstErrorMessage = Object.values(errorDetails)[0];
      showToast(`Validation Failure: ${firstErrorMessage}`, 'error');
    } else {
      showToast('Failed to serialize and write evaluation criteria matrix.', 'error');
    }
  } finally {
    loading.value = false;
  }
};

watch(
  () => [newStudent.value.initialCourse, newStudent.value.initials],
  ([newCourseVal]) => {
    if (isEditingStudent.value) return;
    if (!newCourseVal) {
      newStudent.value.usernameSlug = '';
      return;
    }
    
    const base = newCourseVal;
    const matches = userStore.teacherRoster.filter(s => s.web_id?.startsWith(`${base}-`));
    
    let maxNum = 0;
    matches.forEach(s => {
      const parts = s.web_id.split('-');
      const num = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
    
    newStudent.value.usernameSlug = `${base}-${maxNum + 1}`;
  }
)

const liveCalculatedProfileType = computed(() => {
  if (!assessmentForm.value) {
    return { type: 'Initializing...', emoji: '⏳', advice: '', description: '' };
  }

  const precision = Number(assessmentForm.value.linguistic_precision ?? 5);
  const clarity = Number(assessmentForm.value.phonetic_clarity ?? 5);
  const flow = Number(assessmentForm.value.communicative_flow ?? 5);
  const range_score = Number(assessmentForm.value.expressive_range ?? 5);

  const scores = [precision, clarity, flow, range_score];
  const is_very_high = (s: number) => s >= 8;
  const is_high = (s: number) => s >= 6;
  const is_medium = (s: number) => s >= 4 && s < 6;
  const is_low = (s: number) => s < 4;

  const is_balanced = (Math.max(...scores) - Math.min(...scores)) <= 2;
  const grammar_avg = (precision + range_score) / 2;
  const communication_avg = (flow + clarity) / 2;
  const overall_avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (scores.every(is_low)) {
    return {
      type: 'The Developing Talent', emoji: '🌱', color: 'secondary',
      description: "Early stages of English learning progression.",
      advice: "Focus on basic mechanics, fundamental syntactic blocks, and core high-frequency words."
    };
  }

  if (scores.every(is_very_high)) {
    return {
      type: 'The Advanced Learner', emoji: '🏆', color: 'success',
      description: "Demonstrating command across structural and spontaneous competencies.",
      advice: "Maintain refinement tracks using nuance training models or field-specialized lexical domains."
    };
  }

  if (is_balanced && overall_avg >= 6.5) {
    return {
      type: 'The Efficient Speaker', emoji: '🎓', color: 'success',
      description: "Approaching target advanced proficiencies with harmonious skill parameters balance.",
      advice: "Isolate a singular focal area to deliberately push beyond the advanced milestone envelope."
    };
  }

  if (grammar_avg >= 7 && communication_avg < 6 && (grammar_avg - communication_avg) >= 2) {
    return {
      type: 'The Scholar', emoji: '📚', color: 'info',
      description: "High explicit grammar accuracy paired with lower spontaneous speech confidence rates.",
      advice: "Prompt student into unfiltered real-time speech exercises—mistakes accepted to unlock output flow."
    };
  }

  if (grammar_avg >= 5 && communication_avg >= 4 && (grammar_avg - communication_avg) >= 1.5 && !is_balanced) {
    return {
      type: 'The Careful Speaker', emoji: '🤔', color: 'info',
      description: "Possesses strong passive mechanics but experiences conversational latency due to real-time self-monitoring.",
      advice: "Introduce rapid string exercises under time constraints to restrict active validation loops."
    };
  }

  if (communication_avg >= 7 && grammar_avg < 6 && (communication_avg - grammar_avg) >= 2) {
    return {
      type: 'The Natural', emoji: '🌟', color: 'warning',
      description: "Fluid conversational output tracking with variable syntax stability and narrower lexical varieties.",
      advice: "Begin clean-up tasks targeting repeating errors alongside training structural sentence trees."
    };
  }

  if (communication_avg >= 5 && grammar_avg >= 4 && (communication_avg - grammar_avg) >= 1.5 && !is_balanced) {
    return {
      type: 'The Confident Communicator', emoji: '💬', color: 'warning',
      description: "Communicates comfortably with high comprehension markers but low granular output precision.",
      advice: "Shift focus toward structural accuracy. Introduce single custom systemic checks per cycle block."
    };
  }

  if (precision >= 7 && range_score < 5 && (precision - range_score) >= 2) {
    return {
      type: 'The Perfectionist', emoji: '🎯', color: 'info',
      description: "Produces flawless structural strings but relies heavily on highly restricted safe zones.",
      advice: "Push interaction targets into unfamiliar, complex contextual situations."
    };
  }

  if (is_balanced && overall_avg >= 4.5 && overall_avg < 6.5) {
    return {
      type: 'The Intermediate Student', emoji: '⚖️', color: 'primary',
      description: "Solid, even performance thresholds anchored squarely inside core functional domains.",
      advice: "Pick a single category to over-index temporarily to disrupt plateaus."
    };
  }

  return {
    type: 'Unique Profile', emoji: '✨', color: 'primary',
    description: "Highly unique individualized language profile balancing custom combinations.",
    advice: "Synthesize target exercises focused directly on custom matrix tracking metrics."
  };
});

onMounted(async () => {
  try {
    const response = await fetch('/data/lemmas_clean.txt');
    const text = await response.text();
    
    wordData.value = text.split('\n')
      .filter(line => line.includes(' -> '))
      .map(line => {
        const [lemma, variants] = line.split(' -> ');
        return [lemma.trim(), variants.split(',').map(v => v.trim())];
      });
    
    activeList.value = [...wordData.value];
    
    // Pass false to prioritize internal store memory on mount cycles
    await fetchData(false);
  } catch (error) {
    console.error("Critical error resolving lemmas asset file:", error);
    await fetchData(false);
  }
});
</script>

<style scoped>
.max-width-container { max-width: 1400px; margin: 0 auto; }
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.stop-propagation { pointer-events: auto; }
.animate-fade-in { animation: fadeInEffect 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInEffect { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
.line-height-normal {
  line-height: 1.4 !important;
  white-space: normal !important;
}

.bg-success-lighten-5 {
  background-color: #f0fdf4 !important; /* Soft Tailwind Emerald-50 background look */
}

.text-success-darken-2 {
  color: #15803d !important;
}

.clickable-student-node {
  cursor: pointer;
  user-select: none;
}

.clickable-student-node:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.transition-all {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.gap-3 {
  gap: 12px;
}
</style>