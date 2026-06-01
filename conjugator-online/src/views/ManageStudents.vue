<template>
  <v-container fluid class="mt-5 pa-4 max-width-container">
    <v-row class="mb-2 align-center">
      <v-col cols="12" sm="6">
        <h1 class="text-h4 font-weight-bold primary--text">Manage Students</h1>
      </v-col>
      <v-col cols="12" sm="6" class="d-flex justify-sm-end gap-2 flex-wrap align-center">
        <v-btn color="grey-darken-3" variant="outlined" prepend-icon="mdi-refresh" :loading="loading" @click="fetchData">
          Refresh
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="courseDialog = true">Create Course</v-btn>
        <v-btn color="secondary" prepend-icon="mdi-account-plus" @click="openRegisterStudentDialog">Register Student</v-btn>
        <v-btn color="success" prepend-icon="mdi-link-variant" @click="enrollmentDialog = true">Assign to Course</v-btn>
      </v-col>
    </v-row>

    <v-tabs v-model="activeTab" color="primary" class="mb-6 border-b">
      <v-tab value="courses"><v-icon start>mdi-google-classroom</v-icon>Courses</v-tab>
      <v-tab value="directory"><v-icon start>mdi-account-multiple</v-icon>Students</v-tab>
      <v-tab value="linguistic"><v-icon start>mdi-account-voice</v-icon>Linguistic Profiles</v-tab>
    </v-tabs>

    <v-row v-if="loading && courses.length === 0" justify="center" class="my-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    <v-window v-else v-model="activeTab">
      <v-window-item value="courses" class="animate-fade-in">
        <v-expansion-panels variant="accordion" multiple>
          <v-expansion-panel v-for="course in groupedData" :key="course.slug">
            <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
              <v-icon icon="mdi-folder-text-outline" class="mr-3" color="primary"></v-icon>
              Course Space: <span class="ml-1 text-primary">{{ course.slug }}</span>
              <v-chip class="ml-4" size="small" color="secondary" variant="flat">{{ course.students.length }} Enrolled</v-chip>
              <v-spacer></v-spacer>
              
              <v-btn size="x-small" color="error" variant="text" icon="mdi-delete-outline" class="mr-2 stop-propagation" @click.stop="confirmDeleteCourse(course)">
                <v-tooltip activator="parent" location="top">Delete Course</v-tooltip>
              </v-btn>
            </v-expansion-panel-title>
            
            <v-expansion-panel-text>
              <v-table v-if="course.students.length > 0" hover dense>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Initials</th>
                    <th>Domain</th>
                    <th>Conj. Health</th>
                    <th class="text-center" style="width: 180px;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="student in course.students" :key="student.id">
                    <td class="font-weight-medium">{{ student.web_id }}</td>
                    <td><v-chip label size="small" color="teal">{{ student.initials }}</v-chip></td>
                    <td>{{ formatDomain(student.domain ?? '') }}</td>
                    <td><v-progress-linear :model-value="student.health_score" color="success" height="6" rounded></v-progress-linear></td>
                    <td class="text-center">
                      <v-btn size="small" variant="text" color="orange-darken-2" prepend-icon="mdi-link-off" @click="confirmUnenrollStudent(student, course.slug)">
                        Remove From Course
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <div class="text-center py-6 text-grey-darken-1" v-else>
                <p class="text-caption">No students linked to this course yet.</p>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-window-item>

      <v-window-item value="directory" class="animate-fade-in">
        <v-card variant="outlined" class="border-grey-lighten-2 rounded-lg">
          <v-table hover>
            <thead class="bg-grey-lighten-4">
              <tr>
                <th class="font-weight-bold">Username</th>
                <th class="font-weight-bold">Initials</th>
                <th class="font-weight-bold">Domain</th>
                <th class="text-center font-weight-bold">Conj. Total Correct</th>
                <th class="text-center font-weight-bold" style="width: 250px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in userStore.teacherRoster" :key="student.id">
                <td class="font-weight-bold font-monospace text-primary">{{ student.web_id }}</td>
                <td><v-avatar color="primary" size="30" class="text-caption font-weight-bold text-white">{{ student.initials }}</v-avatar></td>
                <td>{{ formatDomain(student.domain ?? '') }}</td>
                <td class="text-center font-weight-bold font-monospace">{{ student.total_correct_prompts }} correct</td>
                <td class="text-center">
                  <v-btn
                      size="small"
                      class="mx-1"
                      variant="tonal"
                      color="info"
                      density="comfortable"
                      @click="openEditStudentDialog(student)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                      <v-tooltip activator="parent" location="top">
                        Edit Student Parameters
                      </v-tooltip>
                    </v-btn>

                    <v-btn
                      size="small"
                      class="mx-1"
                      variant="tonal"
                      color="warning-darken-2"
                      density="comfortable"
                      @click="openResetPasswordDialog(student)"
                    >
                      <v-icon>mdi-lock-reset</v-icon>
                      <v-tooltip activator="parent" location="top">
                        Reset Auth Passwords
                      </v-tooltip>
                    </v-btn>

                    <v-btn
                      size="small"
                      class="mx-1"
                      variant="tonal"
                      color="error"
                      density="comfortable"
                      @click="confirmDeleteStudent(student)"
                    >
                      <v-icon>mdi-trash-can</v-icon>
                      <v-tooltip activator="parent" location="top">
                        Permanently Delete Account
                      </v-tooltip>
                    </v-btn>

                </td>
              </tr>
              <tr v-if="userStore.teacherRoster.length === 0">
                <td colspan="5" class="text-center py-6 text-muted">No student profiles registered under your teacher profile reference context yet.</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>

      <v-window-item value="linguistic" class="animate-fade-in">
        <v-row class="mb-4 align-center px-2">
          <v-col cols="12" sm="4">
            <v-text-field v-model="matrixSearch" label="Search Assessments..." variant="outlined" density="compact" hide-details prepend-inner-icon="mdi-magnify"></v-text-field>
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

    <v-dialog v-model="courseDialog" max-width="500px">
      <v-card rounded="lg">
        <v-card-title class="pa-4 bg-primary text-white font-weight-bold">Create New Course</v-card-title>
        <v-card-text class="pt-4">
          <v-form ref="courseFormRef">
            <v-text-field v-model="newCourse.slug" label="Course Slug (e.g., business_english)" placeholder="Use lower_case_with_underscores" variant="outlined" :rules="[v => !!v || 'Course slug is required']"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="text" @click="courseDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" :loading="loading" @click="submitCreateCourse">Create</v-btn>
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
const isEditingStudent = ref(false)
const currentEditStudentId = ref<number | null>(null)
const deleteTargetType = ref<'course' | 'student' | 'unenroll' | null>(null)
const deleteTargetId = ref<any>(null)
const deleteTargetLabel = ref('')
const unenrollMetadata = ref({ studentWebId: '', courseSlug: '' })

const courses = ref<any[]>([])
const enrollments = ref<any[]>([])
const selectedStudent = ref<any>(null)
const newPasswordForStudent = ref('')
const registeredSummary = ref({ webId: '', password: '' })

const courseFormRef = ref()
const studentFormRef = ref()
const enrollmentFormRef = ref()

const newCourse = ref({ slug: '' })
const newStudent = ref({ initials: '', domain: '', initialCourse: '', usernameSlug: '' })
const newEnrollment = ref({ studentWebId: '', courseSlug: '' })
const toast = ref({ show: false, message: '', color: 'success' })

// Linguistic profiles states
const assessmentDialog = ref(false)
const assessmentSaving = ref(false) // 👈 Dedicated to submit process
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

// --- Refs for password generation ---
const wordData = ref<[string, string[]][]>([]);
const activeList = ref<[string, string[]][]>([]);
const passwordSymbols = ['!', '@', '#', '$', '%', '^', '&', '*', '?', '-', '_', '=', '+'];

// Helper to randomly alternate the text casing of characters inside a string
const randomizeWordCasing = (word: string): string => {
  return word
    .split('')
    .map(char => (Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()))
    .join('');
};

const fetchData = async () => {
  loading.value = true
  try {
    const [coursesRes, enrollmentsRes] = await Promise.all([
      api.get('/courses/'),
      api.get('/enrollment/'),
      userStore.fetchTeacherRoster()
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
  // Fallback anchor safety check if the external lemmas text file asset hasn't resolved yet
  if (!activeList.value || activeList.value.length === 0) {
    const safetyWords = ['quantum', 'matrix', 'cipher', 'vector', 'vertex', 'nexus'];
    const fallbackW1 = safetyWords[Math.floor(Math.random() * safetyWords.length)];
    const fallbackW2 = safetyWords[Math.floor(Math.random() * safetyWords.length)];
    return `${randomizeWordCasing(fallbackW1)}-${randomizeWordCasing(fallbackW2)}-${Math.floor(Math.random() * 90 + 10)}!!99`;
  }

  // 1. Extract two random tuple entries from your active parsed text list
  const entry1 = activeList.value[Math.floor(Math.random() * activeList.value.length)];
  const entry2 = activeList.value[Math.floor(Math.random() * activeList.value.length)];

  // 2. Drill down into their variant variants string arrays safely
  const variants1 = entry1[1];
  const variants2 = entry2[1];

  const rawWord1 = variants1[Math.floor(Math.random() * variants1.length)] || entry1[0];
  const rawWord2 = variants2[Math.floor(Math.random() * variants2.length)] || entry2[0];

  // 3. Clean string properties and randomize character text case configurations
  const cleanWord1 = randomizeWordCasing(rawWord1.trim().replace(/[^a-zA-Z]/g, ''));
  const cleanWord2 = randomizeWordCasing(rawWord2.trim().replace(/[^a-zA-Z]/g, ''));

  // 4. Gather 2 random digits and 2 random symbols criteria bounds
  const d1 = Math.floor(Math.random() * 10).toString();
  const d2 = Math.floor(Math.random() * 10).toString();
  const s1 = passwordSymbols[Math.floor(Math.random() * passwordSymbols.length)];
  const s2 = passwordSymbols[Math.floor(Math.random() * passwordSymbols.length)];

  // Constructs standard password layout output (e.g., "RunNiNg-PlAnEtS-7@4#")
  return `${cleanWord1}-${cleanWord2}-${d1}${s1}${d2}${s2}`;
};

function copyCombinedCredentials() {
  const username = registeredSummary.value?.webId || '';
  const password = registeredSummary.value?.password || '';
  
  // Assembles the string precisely as requested
  const combinedString = `user name = ${username}  password = ${password}`;
  
  // Utilizes your existing custom copyToClipboard function runner mapping
  copyToClipboard(combinedString);
}

const previewGeneratedWebID = computed(() => {
  if (!newStudent.value.initialCourse) return ''
  const base = newStudent.value.initialCourse
  const matches = userStore.teacherRoster.filter(s => s.web_id?.startsWith(`${base}-`))
  let maxNum = 0
  matches.forEach(s => {
    const num = parseInt(s.web_id.split('-').pop() || '', 10)
    if (!isNaN(num) && num > maxNum) maxNum = num
  })
  return `${base}-${maxNum + 1}`
})

const groupedData = computed(() => {
  return courses.value.map(c => {
    const ids = enrollments.value.filter(e => normalizeCourseSlug(e.course) === c.slug).map(e => normalizeWebId(e.student))
    return { ...c, students: userStore.teacherRoster.filter(s => ids.includes(s.web_id)) }
  })
})

// Submissions Engines
const submitCreateCourse = async () => {
  const { valid } = await courseFormRef.value.validate()
  if (!valid) return
  loading.value = true
  try {
    // 🌟 Teacher profile injection automatically managed securely backend layer now!
    await api.post('/courses/', { slug: newCourse.value.slug.toLowerCase().trim().replace(/\s+/g, '_') })
    showToast('Course creation confirmed.')
    courseDialog.value = false
    newCourse.value.slug = ''
    await fetchData()
  } catch {
    showToast('Failed to instantiate course space object.', 'error')
  } finally { loading.value = false }
}

const openRegisterStudentDialog = () => { isEditingStudent.value = false; newStudent.value = { initials: '', domain: '', initialCourse: '', usernameSlug: '' }; studentDialog.value = true }
const openEditStudentDialog = (student: any) => { isEditingStudent.value = true; currentEditStudentId.value = student.id; newStudent.value = { initials: student.initials, domain: student.domain || '', initialCourse: '', usernameSlug: student.usernameSlug || '' }; studentDialog.value = true }
const submitStudentForm = () => { if (isEditingStudent.value) executeEditStudent(); else submitRegisterStudent() }

const submitRegisterStudent = async () => {
  const { valid } = await studentFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    // Use the user-reviewed input field value instead of the calculated read-only value!
    const finalWebId = newStudent.value.usernameSlug.toLowerCase().trim().replace(/\s+/g, '_');
    
    if (!finalWebId) {
      showToast('A valid unique username identifier slug is required.', 'error');
      return;
    }

    const pwd = generateProportionalPassword();
    
    // 1. Commit the auth User profile
    const userRes = await api.post('/users/', { 
      username: finalWebId, 
      email: `${finalWebId}@schoolsystem.com`, 
      password: pwd 
    });
    
    // 2. Commit the Student row link mapping
    await api.post('/students/', { 
      web_id: finalWebId, 
      initials: newStudent.value.initials.toUpperCase().trim(), 
      domain: newStudent.value.domain, 
      user: userRes.data.id 
    });
    
    // 3. Process the initial course room pairing allocation row
    await api.post('/enrollment/', { 
      student: finalWebId, 
      course: newStudent.value.initialCourse 
    });

    registeredSummary.value = { webId: finalWebId, password: pwd };
    studentDialog.value = false;
    successDialog.value = true;
    await fetchData();
  } catch (err: any) { 
    console.error("Payload rejection details:", err.response?.data);
    
    // Render specific field errors clearly on screen if it hits another collision
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
    studentDialog.value = false; await fetchData()
  } catch { showToast('Profile editing failed.', 'error') } finally { loading.value = false }
}

const submitAssignCourse = async () => {
  const { valid } = await enrollmentFormRef.value.validate()
  if (!valid) return
  loading.value = true
  try {
    await api.post('/enrollment/', { student: newEnrollment.value.studentWebId, course: newEnrollment.value.courseSlug })
    showToast('Student assigned successfully.')
    enrollmentDialog.value = false; await fetchData()
  } catch { showToast('Enrollment assignment dropped.', 'error') } finally { loading.value = false }
}

/* =========================================================
   🗑️ REORGANIZED CRUD: Safe Deletion & Un-enrollment Hooks
   ========================================================= */
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

// 🌟 NEW: Safe un-enrollment hook mapping to individual record bindings
const confirmUnenrollStudent = (student: any, courseSlug: string) => {
  // Find exact linking entry ID matching parameters constraints matrix
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
      // 🌟 Un-enroll hits StudentCourseViewSet endpoint cleanly without dropping the student object model!
      await api.delete(`/enrollment/${deleteTargetId.value}/`)
      showToast('Student successfully removed from course roster layout track.')
    }
    deleteConfirmDialog.value = false
    await fetchData()
  } catch {
    showToast('Operational rejection reported by system views endpoints configuration rules.', 'error')
  } finally {
    loading.value = false
  }
}

// Passwords & Normalizers helpers blocks 
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

/* =========================================================
   LINGUISTIC PROFILE COMPUTED FILTERS & BADGE FORMATTERS
   ========================================================= */
const filteredMatrixData = computed(() => {
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

/* =========================================================
    LINGUISTIC PROFILEs ASSESSMENT 
   ========================================================= */
const openAssessmentPanel = (student: any) => {
  console.log("📥 [Debug] Opening Assessment Panel for student object:", student);
  activeAssessmentStudent.value = student;
  
  // 🌟 FIX: Pull fields directly from the student object, not an imaginary sub-profile!
  assessmentForm.value = {
    latest_assessment: student.latest_assessment || '',
    create_snapshot: !!student.latest_assessment,
    linguistic_precision: student.linguistic_precision ?? 5,
    linguistic_precision_comment: student.linguistic_precision_comment || '',
    phonetic_clarity: student.phonetic_clarity ?? 5,
    phonetic_clarity_comment: student.phonetic_clarity_comment || '',
    communicative_flow: student.communicative_flow ?? 5,
    communicative_flow_comment: student.communicative_flow_comment || '',
    expressive_range: student.expressive_range ?? 5,
    expressive_range_comment: student.expressive_range_comment || ''
  };
  
  console.log("📋 [Debug] Form state fully populated:", assessmentForm.value);
  assessmentDialog.value = true;
};

const submitLinguisticAssessment = async () => {
  console.log("⚡ [Button Click] submitLinguisticAssessment triggered!");
  console.log("🆔 Target Student state context:", activeAssessmentStudent.value);

  if (!activeAssessmentStudent.value) {
    console.error("❌ Guard Failed: activeAssessmentStudent is null or undefined!");
    return;
  }

  loading.value = true;
  try {
    const studentId = activeAssessmentStudent.value.id;
    console.log("📝 Preparing to submit linguistic assessment for student ID:", studentId);
    
    // 🌟 FIX 1: Flatten the payload completely. No 'linguistic_profile' object wrapper!
    // This maps directly to your StudentLinguisticProfileUpdateSerializer fields.
    const payload = {
      latest_assessment: assessmentForm.value.latest_assessment || '',
      
      // Inject your write_only snapshot boolean flag directly into the payload 
      // instead of hitting a separate endpoint first! Your update method handles this.
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

    console.log("🚀 Dispatching Flat Data Payload:", payload);

    const endpointRouteKey = 'linguistic-profiles';
    
    const response = await api.patch(`/${endpointRouteKey}/${studentId}/`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log("🎯 Database sync successful:", response.data);

    showToast(`Linguistic metrics successfully locked down for ${activeAssessmentStudent.value.web_id}`);
    assessmentDialog.value = false;
    await fetchData(); 
    
  } catch (err: any) {
    console.error("❌ Assessment sync completely rejected:", {
      status: err.response?.status,
      data: err.response?.data
    });
    
    const errorDetails = err.response?.data;
    if (errorDetails && typeof errorDetails === 'object') {
      // Pick out explicit validation failures from individual metrics rules if caught
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
  ([newCourseVal, newInitialsVal]) => {
    // If editing a student, do not overwrite their existing login identity
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
    
    // Suggest the calculated value, but leave it fully editable in the field!
    newStudent.value.usernameSlug = `${base}-${maxNum + 1}`;
  }
)

// 🌟 ADD THIS: Reactive mirror engine of the Student model categorization flow
const liveCalculatedProfileType = computed(() => {
  // Defensive check: if the form hasn't been initialized yet, return a safe default
  if (!assessmentForm.value) {
    return { type: 'Initializing...', emoji: '⏳', advice: '', description: '' };
  }

  console.log("🧮 [Debug] Re-calculating personality type from form parameters...");

  const precision = Number(assessmentForm.value.linguistic_precision ?? 5);
  const clarity = Number(assessmentForm.value.phonetic_clarity ?? 5);
  const flow = Number(assessmentForm.value.communicative_flow ?? 5);
  const range_score = Number(assessmentForm.value.expressive_range ?? 5);

  const scores = [precision, clarity, flow, range_score];
  
  // Logical helpers mirroring Python model boundaries
  const is_very_high = (s: number) => s >= 8;
  const is_high = (s: number) => s >= 6;
  const is_medium = (s: number) => s >= 4 && s < 6;
  const is_low = (s: number) => s < 4;

  const is_balanced = (Math.max(...scores) - Math.min(...scores)) <= 2;
  const grammar_avg = (precision + range_score) / 2;
  const communication_avg = (flow + clarity) / 2;
  const overall_avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  // PRIORITY 1: The Developing Talent
  if (scores.every(is_low)) {
    return {
      type: 'The Developing Talent', emoji: '🌱', color: 'secondary',
      description: "Early stages of English learning progression.",
      advice: "Focus on basic mechanics, fundamental syntactic blocks, and core high-frequency words.",
      strengths: ['Fresh start tracking state', 'Optimal raw potential'],
      focus_areas: ['Basic syntax syntax parsing', 'Core basic lexical strings']
    };
  }

  // PRIORITY 2: The Advanced Learner
  if (scores.every(is_very_high)) {
    return {
      type: 'The Advanced Learner', emoji: '🏆', color: 'success',
      description: "Demonstrating command across structural and spontaneous competencies.",
      advice: "Maintain refinement tracks using nuance training models or field-specialized lexical domains.",
      strengths: ['Syntactic accuracy', 'Phonetic baseline clarity', 'Fluency processing flow'],
      focus_areas: ['Continuous long-term mastery maintenance']
    };
  }

  // PRIORITY 3: The Efficient Speaker (Balanced)
  if (is_balanced && overall_avg >= 6.5) {
    return {
      type: 'The Efficient Speaker', emoji: '🎓', color: 'success',
      description: "Approaching target advanced proficiencies with harmonious skill parameters balance.",
      advice: "Isolate a singular focal area to deliberately push beyond the advanced milestone envelope.",
      strengths: ['Balanced multi-track development', 'Solid infrastructure baseline'],
      focus_areas: ['Targeted skill isolation optimization']
    };
  }

  // PRIORITY 4: Grammar-dominant profiles (Scholar variants)
  if (grammar_avg >= 7 && communication_avg < 6 && (grammar_avg - communication_avg) >= 2) {
    return {
      type: 'The Scholar', emoji: '📚', color: 'info',
      description: "High explicit grammar accuracy paired with lower spontaneous speech confidence rates.",
      advice: "Prompt student into unfiltered real-time speech exercises—mistakes accepted to unlock output flow.",
      strengths: ['Grammatical correctness', 'Broad static lexical index'],
      focus_areas: ['Spontaneous conversational velocity']
    };
  }

  if (grammar_avg >= 5 && communication_avg >= 4 && (grammar_avg - communication_avg) >= 1.5 && !is_balanced) {
    return {
      type: 'The Careful Speaker', emoji: '🤔', color: 'info',
      description: "Possesses strong passive mechanics but experiences conversational latency due to real-time self-monitoring.",
      advice: "Introduce rapid string exercises under time constraints to restrict active validation loops.",
      strengths: ['Structural awareness', 'High calculation precision when pre-planned'],
      focus_areas: ['Real-time execution speed and fluid output']
    };
  }

  // PRIORITY 5: Communication-dominant profiles (Natural variants)
  if (communication_avg >= 7 && grammar_avg < 6 && (communication_avg - grammar_avg) >= 2) {
    return {
      type: 'The Natural', emoji: '🌟', color: 'warning',
      description: "Fluid conversational output tracking with variable syntax stability and narrower lexical varieties.",
      advice: "Begin clean-up tasks targeting repeating errors alongside training structural sentence trees.",
      strengths: ['Unimpeded native flow rate', 'Strong communicative intuition'],
      focus_areas: ['Grammatical structure cleanup', 'Lexical index expansion']
    };
  }

  if (communication_avg >= 5 && grammar_avg >= 4 && (communication_avg - grammar_avg) >= 1.5 && !is_balanced) {
    return {
      type: 'The Confident Communicator', emoji: '💬', color: 'warning',
      description: "Communicates comfortably with high comprehension markers but low granular output precision.",
      advice: "Shift focus toward structural accuracy. Introduce single custom systemic checks per cycle block.",
      strengths: ['Speaking situational comfort', 'Proactive communication approach'],
      focus_areas: ['Fine-tuning mechanical syntax errors']
    };
  }

  // PRIORITY 6: The Perfectionist
  if (precision >= 7 && range_score < 5 && (precision - range_score) >= 2) {
    return {
      type: 'The Perfectionist', emoji: '🎯', color: 'info',
      description: "Produces flawless structural strings but relies heavily on highly restricted safe zones.",
      advice: "Push interaction targets into unfamiliar, complex contextual situations.",
      strengths: ['Error-free construction profiles', 'Highly methodical accuracy execution'],
      focus_areas: ['Lexical variation expansion', 'Complex clauses implementation']
    };
  }

  // PRIORITY 7: The Intermediate Student (Balanced)
  if (is_balanced && overall_avg >= 4.5 && overall_avg < 6.5) {
    return {
      type: 'The Intermediate Student', emoji: '⚖️', color: 'primary',
      description: "Solid, even performance thresholds anchored squarely inside core functional domains.",
      advice: "Pick a single category to over-index temporarily to disrupt plateaus.",
      strengths: ['Uniform cross-skill development', 'Stably structured foundation matrix'],
      focus_areas: ['Temporary asymmetric focus to clear performance plateaus']
    };
  }

  // PRIORITY 8: Emerging Patterns
  if (overall_avg < 5 && grammar_avg > communication_avg && (grammar_avg - communication_avg) >= 1) {
    return {
      type: 'The Emerging Scholar', emoji: '📖', color: 'secondary',
      description: "Developing good base structural rules parsing, requiring immediate production volume exercises.",
      advice: "Allocate 50% of processing blocks to real-time interaction drills.",
      strengths: ['Structural rule assimilation models'],
      focus_areas: ['Verbal production volume', 'Auditory decoding tracks']
    };
  }

  if (overall_avg < 5 && communication_avg > grammar_avg && (communication_avg - grammar_avg) >= 1) {
    return {
      type: 'The Emerging Natural', emoji: '🌱', color: 'primary',
      description: "Strong baseline attempts to convey intent alongside notable morpho-syntactic constraints.",
      advice: "Introduce high-frequency grammar drills to lock in foundational patterns.",
      strengths: ['Active target interaction intent drives'],
      focus_areas: ['Base grammar paradigms', 'Production accuracy rules']
    };
  }

  // DEFAULT
  return {
    type: 'Unique Profile', emoji: '✨', color: 'primary',
    description: "Highly unique individualized language profile balancing custom combinations.",
    advice: "Synthesize target exercises focused directly on custom matrix tracking metrics.",
    strengths: ['Custom individual learning parameters matrix'],
    focus_areas: ['Custom personalized structural calibration paths']
  };
});

// Helper color-map engine for slider feedback context indicators
function getLiveBandMetadata(score: number) {
  if (score >= 8) return { label: 'Advanced', color: 'success', description: 'Consistently precise execution parameters.' };
  if (score >= 5) return { label: 'Intermediate', color: 'blue-darken-1', description: 'Functional operational capabilities.' };
  return { label: 'Developing', color: 'amber-darken-2', description: 'Emerging skill states requiring support structures.' };
}

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
    
    // Call your primary data fetch engine 
    await fetchData();
  } catch (error) {
    console.error("Critical: Failed to read external text vocabulary lemmas mapping file:", error);
    await fetchData(); // Fetch data anyway so table states resolve even if text parsing drops
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
</style>