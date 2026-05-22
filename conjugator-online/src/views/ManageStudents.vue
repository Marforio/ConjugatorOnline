<template>
  <v-container fluid class="mt-5 pa-4 max-width-container">
    <!-- Header Management Section -->
    <v-row class="mb-6 align-center">
      <v-col cols="12" sm="4">
        <h1 class="text-h4 font-weight-bold primary--text">Manage Students</h1>
      </v-col>
      <v-col cols="12" sm="8" class="d-flex justify-sm-end gap-2 flex-wrap">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="courseDialog = true">
          Create Course
        </v-btn>
        <v-btn color="secondary" prepend-icon="mdi-account-plus" @click="openRegisterStudentDialog">
          Register Student
        </v-btn>
        <v-btn color="success" prepend-icon="mdi-link-variant" @click="enrollmentDialog = true">
          Assign to Course
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loader State -->
    <v-row v-if="loading" justify="center" class="my-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    <!-- Main Course/Student Accordion View -->
    <v-row v-else>
      <v-col cols="12">
        <v-expansion-panels variant="accordion" multiple>
          <v-expansion-panel v-for="course in groupedData" :key="course.slug">
            <v-expansion-panel-title class="font-weight-bold text-subtitle-1">
              <v-icon icon="mdi-google-classroom" class="mr-3" color="primary"></v-icon>
              Course: <span class="ml-1 text-primary">{{ course.slug }}</span>
              <v-chip class="ml-4" size="small" color="secondary" variant="flat">
                {{ course.students.length }} Students
              </v-chip>
            </v-expansion-panel-title>
            
            <v-expansion-panel-text>
              <v-table v-if="course.students.length > 0" hover dense>
                <thead>
                  <tr>
                    <th>Web ID</th>
                    <th>Initials</th>
                    <th class="text-center">Actions</th>
                    <th>Module</th>
                    <th>Conj Health</th>
                    <th>Conj Correct</th>
                    
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="student in course.students" :key="student.id">
                    <td class="font-weight-medium">{{ student.web_id }}</td>
                    <td><v-chip label size="small" color="teal">{{ student.initials }}</v-chip></td>
                    <td class="text-center">
                      <v-btn
                        size="medium"
                        variant="text"
                        color="grey-darken-1"
                        icon
                        @click="openResetPasswordDialog(student)"
                      >
                        <v-icon>mdi-lock-reset</v-icon>
                        <v-tooltip activator="parent" location="top">Reset Student Password</v-tooltip>
                      </v-btn>
                    </td>
                    <td>{{ formatDomain(student.domain) }}</td>
                    <td>
                      <v-progress-linear
                        :model-value="student.health_score"
                        color="success"
                        height="8"
                        rounded
                      ></v-progress-linear>
                    </td>
                    <td>{{ student.total_correct_prompts }}</td>
                  </tr>
                </tbody>
              </v-table>
              
              <div class="text-center py-6 text-grey" v-else>
                <v-icon icon="mdi-account-off" size="large" class="mb-2"></v-icon>
                <p>No students enrolled in this course yet.</p>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- ============================================== -->
    <!-- DIALOG A: CREATE COURSE                        -->
    <!-- ============================================== -->
    <v-dialog v-model="courseDialog" max-width="500px">
      <v-card rounded="lg">
        <v-card-title class="pa-4 bg-primary text-white font-weight-bold">
          Create New Course
        </v-card-title>
        <v-card-text class="pt-4">
          <v-form ref="courseFormRef">
            <v-text-field
              v-model="newCourse.slug"
              label="Course Slug (e.g., chemistry_1)"
              placeholder="Use lower_case_with_underscores"
              variant="outlined"
              :rules="[v => !!v || 'Course slug is required']"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="text" @click="courseDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" @click="submitCreateCourse">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ============================================== -->
    <!-- DIALOG B: REGISTER STUDENT                     -->
    <!-- ============================================== -->
    <v-dialog v-model="studentDialog" max-width="500px">
      <v-card rounded="lg">
        <v-card-title class="pa-4 bg-secondary text-white font-weight-bold">
          Register New Student Profile
        </v-card-title>
        <v-card-text class="pt-4">
          <v-form ref="studentFormRef">
            <v-alert type="info" variant="tonal" class="mb-4 text-caption" density="compact">
              Privacy Mode Active: Real names and genders are not recorded.
            </v-alert>

            <v-text-field
              v-model="newStudent.initials"
              label="Student Initials"
              placeholder="e.g., JD"
              variant="outlined"
              maxlength="10"
              :rules="[v => !!v || 'Initials are required']"
            ></v-text-field>

            <v-select
              v-model="newStudent.domain"
              :items="domainOptions"
              item-title="label"
              item-value="value"
              label="Module"
              variant="outlined"
              :rules="[v => !!v || 'Domain selection is required']"
            ></v-select>

            <v-select
              v-model="newStudent.initialCourse"
              :items="courses"
              item-title="slug"
              item-value="slug"
              label="Course"
              variant="outlined"
              :rules="[v => !!v || 'A course is required']"
            ></v-select>
            
            <div class="bg-grey-lighten-4 pa-3 rounded text-caption border mb-2">
              <strong>Calculated Web ID:</strong> {{ previewGeneratedWebID || '(Select a domain & initials)' }}
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="text" @click="studentDialog = false">Cancel</v-btn>
          <v-btn color="secondary" variant="elevated" @click="submitRegisterStudent">Register & Enroll</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ============================================== -->
    <!-- DIALOG C: ASSIGN STUDENT TO COURSE             -->
    <!-- ============================================== -->
    <v-dialog v-model="enrollmentDialog" max-width="500px">
      <v-card rounded="lg">
        <v-card-title class="pa-4 bg-success text-white font-weight-bold">
          Assign Student to Course
        </v-card-title>
        <v-card-text class="pt-4">
          <v-form ref="enrollmentFormRef">
            <v-autocomplete
              v-model="newEnrollment.studentWebId"
              :items="students"
              item-title="web_id"
              item-value="web_id"
              label="Select Student (Web ID)"
              variant="outlined"
              :rules="[v => !!v || 'Please select a student']"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :subtitle="'Initials: ' + item.raw.initials"></v-list-item>
              </template>
            </v-autocomplete>

            <v-select
              v-model="newEnrollment.courseSlug"
              :items="courses"
              item-title="slug"
              item-value="slug"
              label="Target Course Room"
              variant="outlined"
              :rules="[v => !!v || 'Please select a target course']"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="text" @click="enrollmentDialog = false">Cancel</v-btn>
          <v-btn color="success" variant="elevated" @click="submitAssignCourse">Assign Enrollment</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ============================================== -->
    <!-- DIALOG D: PASSWORD RESET                       -->
    <!-- ============================================== -->
    <v-dialog v-model="passwordResetDialog" max-width="450px">
      <v-card rounded="lg">
        <v-card-title class="pa-4 bg-warning text-dark font-weight-bold">
          Reset Password for {{ selectedStudent?.web_id }}
        </v-card-title>
        <v-card-text class="pt-4">
          <v-text-field
            v-model="newPasswordForStudent"
            label="Generated Password"
            variant="outlined"
            persistent-hint
            hint="Share this credential immediately. It will be safely encrypted once saved."
          >
            <template v-slot:append-inner>
              <v-btn
                icon
                variant="text"
                size="small"
                color="primary"
                @click="copyToClipboard(newPasswordForStudent)"
                :disabled="!newPasswordForStudent"
              >
                <v-icon>mdi-content-copy</v-icon>
                <v-tooltip activator="parent" location="top">Copy Password</v-tooltip>
              </v-btn>
            </template>
          </v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4 justify-end">
          <v-btn variant="text" @click="passwordResetDialog = false">Cancel</v-btn>
          <v-btn color="warning" variant="elevated" @click="submitPasswordReset">Save Password</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ============================================== -->
    <!-- DIALOG E: REGISTRATION SUCCESS CREDENTIALS     -->
    <!-- ============================================== -->
    <v-dialog v-model="successDialog" max-width="500px" persistent>
      <v-card rounded="lg">
        <v-card-title class="pa-4 bg-success text-white font-weight-bold d-flex align-center">
          <v-icon icon="mdi-account-check" class="mr-2"></v-icon>
          Student Registered Successfully
        </v-card-title>
        <v-card-text class="pt-6">
          <p class="text-body-1 mb-4 text-center font-weight-medium">
            Please copy these login credentials for the student now. They will not be displayed again.
          </p>
          
          <!-- Web ID Field Block -->
          <v-text-field
            v-model="registeredSummary.webId"
            label="Student Username (Web ID)"
            variant="plain"
            bg-color="grey-lighten-4"
            readonly
            class="mb-2"
          >
            <template v-slot:append-inner>
              <v-btn icon variant="text" size="small" color="primary" @click="copyToClipboard(registeredSummary.webId)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </template>
          </v-text-field>

          <!-- Password Field Block -->
          <v-text-field
            v-model="registeredSummary.password"
            label="Generated Password"
            variant="plain"
            bg-color="grey-lighten-4"
            readonly
          >
            <template v-slot:append-inner>
              <v-btn icon variant="text" size="small" color="primary" @click="copyToClipboard(registeredSummary.password)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn color="success" variant="elevated" block size="large" @click="successDialog = false">
            Done & Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification Toast Snackbars -->
    <v-snackbar v-model="toast.show" :color="toast.color" timeout="4000">
      {{ toast.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="toast.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/axios'

// Types structured directly out of your Django backend endpoints definitions
interface Course {
  slug: string
}

interface Student {
  id: number
  web_id: string
  initials: string
  domain: string
  total_correct_prompts: number
  health_score: number
}

interface StudentCourseEnrollment {
  id: number
  student: string 
  course: string  
}

// State Control
const loading = ref(false)
const courseDialog = ref(false)
const studentDialog = ref(false)
const enrollmentDialog = ref(false)
const passwordResetDialog = ref(false)
const successDialog = ref(false)

// Data arrays from API mappings
const courses = ref<Course[]>([])
const students = ref<Student[]>([])
const enrollments = ref<StudentCourseEnrollment[]>([])

// Password Reset Target State
const selectedStudent = ref<Student | null>(null)
const newPasswordForStudent = ref('')

// Temporary storage for display inside the post-registration summary panel
const registeredSummary = ref({ webId: '', password: '' })

// Form References
const courseFormRef = ref()
const studentFormRef = ref()
const enrollmentFormRef = ref()

// Reactive Form Submissions payloads
const newCourse = ref({ slug: '' })
const newStudent = ref({ initials: '', domain: '', initialCourse: '' })
const newEnrollment = ref({ studentWebId: '', courseSlug: '' })

// Toast Alert Settings
const toast = ref({ show: false, message: '', color: 'success' })

const domainOptions = [
  { value: 'architecture', label: 'Architecture' },
  { value: 'business_1', label: 'Business 1' },
  { value: 'business_2', label: 'Business 2' },
  { value: 'business_3', label: 'Business 3' },
  { value: 'business_4', label: 'Business 4' },
  { value: 'chemistry_1', label: 'Chemistry 1' },
  { value: 'chemistry_2', label: 'Chemistry 2' },
  { value: 'civil_1', label: 'Civil 1' },
  { value: 'civil_2', label: 'Civil 2' },
  { value: 'computer_science_1', label: 'Computer Science 1' },
  { value: 'computer_science_2', label: 'Computer Science 2' },
  { value: 'computer_science_single', label: 'Computer Science Single' },
  { value: 'electrical_1', label: 'Electrical 1' },
  { value: 'electrical_2', label: 'Electrical 2' },
  { value: 'mechanical_1', label: 'Mechanical 1' },
  { value: 'mechanical_2', label: 'Mechanical 2' },
  { value: 'general', label: 'General' },
  { value: 'ielts_prep', label: 'IELTS Prep' }
]

// Fetch data engine hook
const fetchData = async () => {
  loading.value = true
  try {
    const [coursesRes, studentsRes, enrollmentsRes] = await Promise.all([
      api.get('/courses/'),
      api.get('/students/'),
      api.get('/enrollment/') 
    ])
    courses.value = coursesRes.data
    students.value = studentsRes.data
    enrollments.value = enrollmentsRes.data
  } catch (error) {
    showToast('Failed loading database records from core systems.', 'error')
  } finally {
    loading.value = false
  }
}

// Auto-calculates web_id slug safely from chosen initial course root value
const previewGeneratedWebID = computed(() => {
  if (!newStudent.value.initialCourse) return ''
  const baseSlug = newStudent.value.initialCourse
  
  const matches = students.value.filter(s => s.web_id.startsWith(`${baseSlug}-`))
  
  let maxNum = 0
  matches.forEach(s => {
    const parts = s.web_id.split('-')
    const numPart = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(numPart) && numPart > maxNum) {
      maxNum = numPart
    }
  })
  
  return `${baseSlug}-${maxNum + 1}`
})

// Groups system data cleanly into dashboard rows layout array map
const groupedData = computed(() => {
  return courses.value.map(course => {
    const studentIdsInCourse = enrollments.value
      .filter(e => e.course === course.slug)
      .map(e => e.student)

    const contextualStudents = students.value.filter(s => studentIdsInCourse.includes(s.web_id))
    
    return {
      ...course,
      students: contextualStudents
    }
  })
})

// Custom Password Generator Code Hook 
// (Kept untouched to protect your custom tweaks to the wordlists and formatting structures)
const passwordWords = [
  'sun', 'rake', 'cloud', 'tree', 'book', 'lamp', 'fish', 'frog', 'bird', 'leaf',
  'wind', 'boat', 'door', 'star', 'moon', 'hill', 'rock', 'farm', 'song', 'bell',
  'wave', 'fire', 'sand', 'park', 'nest', 'deer', 'wolf', 'lion', 'bear', 'kite'
]
const passwordSymbols = ['!', '@', '#', '$', '%', '^', '&', '*', '?', '-', '"', ':']

const randomizeWordCasing = (word: string): string => {
  return word
    .split('')
    .map(char => (Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()))
    .join('')
}

const generateProportionalPassword = (): string => {
  const w1 = passwordWords[Math.floor(Math.random() * passwordWords.length)]
  let w2 = passwordWords[Math.floor(Math.random() * passwordWords.length)]
  while (w1 === w2) {
    w2 = passwordWords[Math.floor(Math.random() * passwordWords.length)]
  }
  const casedW1 = randomizeWordCasing(w1)
  const casedW2 = randomizeWordCasing(w2)
  const d1 = Math.floor(Math.random() * 10).toString()
  const d2 = Math.floor(Math.random() * 10).toString()
  const s1 = passwordSymbols[Math.floor(Math.random() * passwordSymbols.length)]
  const s2 = passwordSymbols[Math.floor(Math.random() * passwordSymbols.length)]
  return `${casedW1}-${casedW2}-${d1}${s1}${d2}${s2}`
}

// Clipboard copy mechanism
const copyToClipboard = async (text: string) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    showToast('Copied to clipboard!', 'success')
  } catch (err) {
    showToast('Failed to copy text automatically.', 'error')
  }
}

// Submission Actions
const submitCreateCourse = async () => {
  const { valid } = await courseFormRef.value.validate()
  if (!valid) return

  try {
    const payload = { slug: newCourse.value.slug.toLowerCase().trim().replace(/\s+/g, '_') }
    await api.post('/courses/', payload)
    showToast(`Successfully created remote course room: ${payload.slug}`)
    courseDialog.value = false
    newCourse.value.slug = ''
    await fetchData()
  } catch (err: any) {
    showToast(err.response?.data?.detail || 'Error building new Course setup records', 'error')
  }
}

const openRegisterStudentDialog = () => {
  newStudent.value = { initials: '', domain: '', initialCourse: '' }
  studentDialog.value = true
}

const submitRegisterStudent = async () => {
  const { valid } = await studentFormRef.value.validate()
  if (!valid) return

  try {
    const calculatedWebId = previewGeneratedWebID.value
    const generatedPassword = generateProportionalPassword()
    
    const userPayload = {
      username: calculatedWebId,
      email: `${calculatedWebId}@schoolsystem.local`,
      password: generatedPassword
    }

    // Step 1: Create the baseline Django User account
    const userRes = await api.post('/users/', userPayload)
    
    // Step 2: Build the Student profile row instance
    const studentPayload = {
      web_id: calculatedWebId,
      initials: newStudent.value.initials.toUpperCase().trim(),
      domain: newStudent.value.domain,
      user: userRes.data.id //  FIX: Extract just the nested .id primitive integer
    }
    await api.post('/students/', studentPayload)

    // Step 3: Allocate course enrollment record matrix mapping
    await api.post('/enrollment/', { 
      student: calculatedWebId,
      course: newStudent.value.initialCourse
    })

    // Capture variables to show on secure success info display modal
    registeredSummary.value = {
      webId: calculatedWebId,
      password: generatedPassword
    }

    studentDialog.value = false
    successDialog.value = true 
    await fetchData()
  } catch (err: any) {
    showToast('Failed to write and register student profiles.', 'error')
  }
}

const submitAssignCourse = async () => {
  const { valid } = await enrollmentFormRef.value.validate()
  if (!valid) return

  try {
    await api.post('/enrollment/', { 
      student: newEnrollment.value.studentWebId,
      course: newEnrollment.value.courseSlug
    })
    showToast(`Enrolled student ${newEnrollment.value.studentWebId} to ${newEnrollment.value.courseSlug}`)
    enrollmentDialog.value = false
    newEnrollment.value = { studentWebId: '', courseSlug: '' }
    await fetchData()
  } catch (err: any) {
    showToast('Could not link enrollment pairing mapping configurations values.', 'error')
  }
}

// Password Reset Handlers
const openResetPasswordDialog = (student: Student) => {
  selectedStudent.value = student
  newPasswordForStudent.value = generateProportionalPassword()
  passwordResetDialog.value = true
}

const submitPasswordReset = async () => {
  if (!selectedStudent.value || !newPasswordForStudent.value) return

  try {
    await api.post(`/students/${selectedStudent.value.id}/reset_password/`, {
      password: newPasswordForStudent.value
    })
    showToast(`Password successfully updated for ${selectedStudent.value.web_id}`)
    passwordResetDialog.value = false
    newPasswordForStudent.value = ''
  } catch (err) {
    showToast('Failed to update password through backend services.', 'error')
  }
}

// Utility Methods
const formatDomain = (val: string) => {
  const matched = domainOptions.find(d => d.value === val)
  return matched ? matched.label : val
}

const showToast = (msg: string, color = 'success') => {
  toast.value = { show: true, message: msg, color }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.max-width-container {
  max-width: 1400px;
  margin: 0 auto;
}
.gap-2 {
  gap: 8px;
}
</style>