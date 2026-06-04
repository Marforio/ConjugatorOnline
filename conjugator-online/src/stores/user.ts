import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth";
import api from "@/axios";

// --- Interfaces ---
interface User {
  id: number;
  username: string;
  is_staff: boolean;
  email?: string;
  is_superuser?: boolean;
  teacher_profile?: { id: number }; 
}

interface ScoreSnapshot {
  total_correct_prompts: number;
  health_score: number;
  period_speaking_seconds?: number; // 🕒 Added to track history snapshots cleanly
}

interface Student {
  id: number;
  web_id: string;
  initials: string;
  total_correct_prompts: number;
  health_score: number;
  domain: string | null;
  user: User | number | null;
  score_history: Record<string, ScoreSnapshot>;
  linguistic_profile?: LinguisticProfile; 
  // ⏱️ NEW: Speaking Telemetry Fields from Backend API
  current_period_speaking_seconds: number;
  grand_total_speaking_seconds: number;
}

interface ProfileType {
  type: string;
  emoji: string;
  color: string;
  description: string;
  advice: string;
  strengths: string[];
  focus_areas: string[];
}

interface LinguisticProfile {
  linguistic_precision: number | null;
  linguistic_precision_comment: string | null;
  phonetic_clarity: number | null;
  phonetic_clarity_comment: string | null;
  communicative_flow: number | null;
  communicative_flow_comment: string | null;
  expressive_range: number | null;
  expressive_range_comment: string | null;
  latest_assessment: string | null;
  last_assessed_at: string | null;
  linguistic_profile_history: Record<string, any>;
  profile_type?: ProfileType;
}

interface Course {
  slug: string;
}

interface StudentCourse {
  id: number;
  student: Student | number;
  course: Course;
}

interface VerbUsage {
  verb: string;
  tier: string;
  discovered_ps: boolean;
  marked_ps: boolean;
  discovered_pp: boolean;
  mastered_pp: boolean;
  past_simple: { correct: number; incorrect: number; used_count: number };
  present_perfect: { correct: number; incorrect: number; used_count: number };
}

interface TierStats {
  tier_name: string;
  total: number;
  discovered_count_ps: number;
  mastered_count_ps: number;
  discovered_pct_ps: number;
  mastered_pct_ps: number;
  undiscovered_verbs_ps: string[];
  unmastered_verbs_ps: string[];
  discovered_count_pp: number;
  mastered_count_pp: number;
  discovered_pct_pp: number;
  mastered_pct_pp: number;
  undiscovered_verbs_pp: string[];
  unmastered_verbs_pp: string[];
}

interface TenseStats {
  discovered_verbs_ps: string[];
  discovered_verbs_pp: string[];
  mastered_verbs_ps: string[];
  mastered_verbs_pp: string[];
}

interface Feedback {
  feedback_id: string;
  student?: { id: number; name?: string };
  course?: { name?: string };
  date?: string;
  content?: string;
}

interface VocabItem {
  vocab_id: string;
  student: Student | number | null;
  student_web_id: string | null;
  correct: string;
  incorrect: string | null;
  times: number;
  comment: string;
  feedback: Feedback;
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

export type SmartVerbPoolByTense = {
  verb_set: string;
  batch_size: number | null;
  "Past simple"?: string[];
  "Present perfect"?: string[];
};

// --- Store Definition ---
export const useUserStore = defineStore("user", () => {
  const auth = useAuthStore();

  // --- Core State ---
  const user = ref<User | null>(null);
  const student = ref<Student | null>(null);
  const teacherId = ref<number | null>(null);
  
  // ✨TEACHER  STATE: Track assigned students roster cleanly
  const teacherRoster = ref<Student[]>([]);
  const selectedStudentId = ref<number | null>(null);
  const loadingRoster = ref(false);
  const managedCourses = ref<Course[]>([]);
  const loadingCourses = ref(false);

  // Linguistic Profile state
  const linguisticProfile = ref<LinguisticProfile | null>(null);
  const loadingLinguisticProfile = ref(false);
  const linguisticProfileError = ref<string | null>(null);

  // Workout state
  const currentWorkout = ref<Workout | null>(null);
  const workoutHistory = ref<Workout[]>([]);
  const loadingWorkout = ref(false);
  const workoutError = ref<string | null>(null);

  // --- Enrollments ---  
  const enrollments = ref<StudentCourse[]>([]);
  const loadingEnrollments = ref(false);
  const enrollmentError = ref<string | null>(null);


  // --- Computed Coordinates ---
  const isStaff = computed(() => user.value?.is_staff ?? false);
  const isSuperuser = computed(() => user.value?.is_superuser ?? false);
  const teacherProfileId = computed(() => teacherId.value);
  const isStudentAccount = computed(() => user.value !== null && !user.value.is_staff);
  
//  Teacher's courses
const availableTeacherCourses = computed(() => {
    return [...managedCourses.value]
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map(course => ({
        slug: course.slug,
        title: course.slug.toUpperCase()
      }));
  });

  /**
   * Accessible pointer exposing the standard alpha-sorted raw student array
   */
  const availableTeacherStudents = computed(() => {
    return [...teacherRoster.value].sort((a, b) => 
      a.initials.localeCompare(b.initials)
    );
  });

  
  // Make studentId context-aware. 
  // If staff is viewing a targeted student, return that selected student ID instead of their own.
  const studentId = computed(() => {
    if (isStaff.value && selectedStudentId.value) {
      return selectedStudentId.value;
    }
    return student.value?.id ?? null;
  });
  
  const totalCorrect = computed(() => student.value?.total_correct_prompts ?? 0);
  const healthScore = computed(() => student.value?.health_score ?? 0);

  // Human-readable speaking metrics calculations (Minutes representation)
  const currentPeriodSpeakingMinutes = computed(() => {
    const seconds = student.value?.current_period_speaking_seconds ?? 0;
    return parseFloat((seconds / 60).toFixed(1));
  });

  const grandTotalSpeakingMinutes = computed(() => {
    const seconds = student.value?.grand_total_speaking_seconds ?? 0;
    return parseFloat((seconds / 60).toFixed(1));
  });

  // Linguistic Profile Computed
  const hasLinguisticProfile = computed(() => {
    return linguisticProfile.value && (
      linguisticProfile.value.linguistic_precision !== null ||
      linguisticProfile.value.phonetic_clarity !== null ||
      linguisticProfile.value.communicative_flow !== null ||
      linguisticProfile.value.expressive_range !== null
    );
  });

  const assessmentStageLabel = computed(() => {
    if (!linguisticProfile.value?.latest_assessment) return null;
    
    const stages: Record<string, string> = {
      'initial': 'Initial Assessment',
      'mid_sem_1': 'Mid-Semester 1',
      'end_sem_1': 'End Semester 1',
      'mid_sem_2': 'Mid-Semester 2',
      'end_sem_2': 'End Semester 2',
      'mid_sem_3': 'Mid-Semester 3',
      'end_sem_3': 'End Semester 3',
      'mid_sem_4': 'Mid-Semester 4',
      'end_sem_4': 'End Semester 4',
      'exit': 'Exit Assessment',
    };
    
    return stages[linguisticProfile.value.latest_assessment] || linguisticProfile.value.latest_assessment;
  });

  // Workout computed
  const hasCurrentWorkout = computed(() => currentWorkout.value !== null);
  const workoutDrillCount = computed(() => currentWorkout.value?.drills?.length ?? 0);

  const workoutCompletionPercentage = computed(() => {
    if (!currentWorkout.value?.drills?.length) return 0;
    
    const totalSessions = currentWorkout.value.drills.reduce(
      (sum, drill) => sum + (drill.target_sessions ?? 0),
      0
    );
    
    if (totalSessions === 0) return 0;
    
    const completedSessions = currentWorkout.value.drills.reduce(
      (sum, drill) => sum + drill.completed_sessions,
      0
    );
    
    return Math.round((completedSessions / totalSessions) * 100);
  });

  function hasAccessToken(): boolean {
    return !!auth.access;
  }


// --- User Bootstrap Sequencers ---
  const userLoaded = ref(false);

async function ensureUserLoaded() {
  if (userLoaded.value) return;
  if (!hasAccessToken()) return;

  try {
    const res = await api.get<User>("/users/me/");
    user.value = res.data;
    
    if (user.value.is_staff) {
      // Extract and save the teacher profile ID right here:
      teacherId.value = user.value.teacher_profile?.id ?? null;

      // 1. Synchronize the teacher's classroom cohort array roster
      await Promise.all([
          fetchTeacherRoster(),
          fetchManagedCourses() 
        ]);
      
      // 2. Clear out any selection garbage leftover in memory snapshots
      selectedStudentId.value = null;
      
      // Pull the teacher's *personal* account details by user link target scoping parameters
      await fetchSelfStudentProfile();
    } else {
      // Regular isolated student execution track
      teacherId.value = null; // Ensure it resets for clean single-student access
      await fetchStudentData();
    }
  } catch (err) {
    console.error("Failed to fetch user context data:", err);
    user.value = null;
    teacherId.value = null;
  } finally {
    userLoaded.value = true;
  }
}

  // Dedicated action for superusers to profile their student id specifically
  async function fetchSelfStudentProfile() {
    try {
      // Query by user ID explicitly to bypass roster lists matching view lookups
      const res = await api.get<any>("/students/", {
        params: { user: user.value?.id }
      });
      
      const rawData = res.data && typeof res.data === 'object' && 'results' in res.data 
        ? (res.data as any).results 
        : res.data;

      if (Array.isArray(rawData) && rawData.length > 0) {
        // Lock the superuser's personal metrics safely to the core container
        student.value = rawData.find((s: any) => s.user?.id === user.value?.id || s.user === user.value?.id) || rawData[0];
        if (student.value?.linguistic_profile) {
          linguisticProfile.value = student.value.linguistic_profile;
        }
      }
    } catch (err) {
      console.error("Failed fetching self shadow profile:", err);
    }
  }

  // Optimized target inspection pipeline tracking method
  async function fetchStudentData() {
    if (!hasAccessToken()) return;
    
    try {
      // If inspecting a distinct card, query detail layout explicitly by PK location routing path
      if (isStaff.value && selectedStudentId.value) {
        const res = await api.get<any>(`/students/${selectedStudentId.value}/`);
        student.value = res.data;
        if (student.value?.linguistic_profile) {
          linguisticProfile.value = student.value.linguistic_profile;
        }
      } else if (!isStaff.value) {
        // Regular standard student loading process pipeline paths tracking endpoints
        const res = await api.get<any>("/students/");
        const rawArray = res.data && typeof res.data === 'object' && 'results' in res.data 
          ? (res.data as any).results 
          : res.data;

        if (Array.isArray(rawArray) && rawArray.length > 0) {
          student.value = rawArray[0];
          if (student.value?.linguistic_profile) {
            linguisticProfile.value = student.value.linguistic_profile;
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch student data profile trace context:", err);
      student.value = null;
    }
  }

  async function fetchUserData() {
    await ensureUserLoaded();
  }

  // --- Previous Semester History Evaluation Blocks ---
  const previousHealthScore = computed(() => {
    if (!student.value?.score_history) return null;
    const entries = Object.entries(student.value.score_history);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([a], [b]) => b.localeCompare(a));
    return sorted[0][1].health_score;
  });

  const previousTotalCorrectPrompts = computed(() => {
    if (!student.value?.score_history) return null;
    const entries = Object.entries(student.value.score_history);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([a], [b]) => b.localeCompare(a));
    return sorted[0][1].total_correct_prompts;
  });

  const previousSpeakingSeconds = computed(() => {
    if (!student.value?.score_history) return null;
    const entries = Object.entries(student.value.score_history);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([a], [b]) => b.localeCompare(a));
    return sorted[0][1].period_speaking_seconds ?? 0;
  });

  const previousDate = computed(() => {
    if (!student.value?.score_history) return null;
    const entries = Object.entries(student.value.score_history);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([a], [b]) => b.localeCompare(a));
    return sorted[0][0];
  });

  const scoreHistory = computed(() => {
    if (!student.value?.score_history) return [];
    return Object.entries(student.value.score_history)
      .map(([date, scores]) => ({ date, ...scores }))
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  // --- API Communications Actions Methods ---

  // ✨ NEW API VIEW METHOD: Pulls the scoped roster assigned strictly to this authenticated teacher
  async function fetchTeacherRoster() {
    if (!hasAccessToken() || !isStaff.value) return;
    loadingRoster.value = true;
    try {
      const res = await api.get<Student[]>("/students/");
      const rawArray = res.data && typeof res.data === 'object' && 'results' in res.data 
        ? (res.data as any).results 
        : res.data;
      
      teacherRoster.value = Array.isArray(rawArray) ? rawArray : [];
      console.log("🎒 Loaded assigned secure teacher student roster:", teacherRoster.value.length, "items");
    } catch (err) {
      console.error("Failed to load secure teacher student list:", err);
      teacherRoster.value = [];
    } finally {
      loadingRoster.value = false;
    }
  }


 async function fetchManagedCourses() {
    if (!hasAccessToken() || !isStaff.value) return;
    loadingCourses.value = true;
    try {
      const res = await api.get<Course[]>("/courses/", {
        params: { managed_only: "true" }
      });
      managedCourses.value = Array.isArray(res.data) ? res.data : [];
      console.log("🏫 Synchronized live teacher course entities:", managedCourses.value.length);
    } catch (err) {
      console.error("Failed to load managed courses list directly from API:", err);
      managedCourses.value = [];
    } finally {
      loadingCourses.value = false;
    }
  } 

  async function fetchLinguisticProfile() {
    if (!hasAccessToken()) return;
    loadingLinguisticProfile.value = true;
    linguisticProfileError.value = null;

    try {
      const params: any = {};
      // Secure fallback verification hook
      if (isStaff.value && studentId.value) {
        params.student = studentId.value;
      }
      
      const response = await api.get<LinguisticProfile>("/linguistic-profiles/me/", { params });
      linguisticProfile.value = response.data;
    } catch (err: any) {
      console.error("Failed to fetch linguistic profile metrics stack:", err);
      if (err?.response?.status === 404) {
        linguisticProfile.value = null;
      } else {
        linguisticProfileError.value = "Failed to synchronize linguistic metrics profile.";
      }
    } finally {
      loadingLinguisticProfile.value = false;
    }
  }

  async function fetchCurrentWorkout(payload?: { user_id?: number }) {
    if (!hasAccessToken()) return;
    let sid = studentId.value;

    if (!sid) {
      currentWorkout.value = null;
      return;
    }

    loadingWorkout.value = true;
    workoutError.value = null;

    try {
      const response = await api.get<Workout>(`/workouts/current/${sid}/`);
      currentWorkout.value = response.data;
    } catch (err: any) {
      console.error("Failed to fetch current workout state model:", err);
      if (err?.response?.status === 404) {
        currentWorkout.value = null;
      } else {
        workoutError.value = "Failed to map active workout template parameters.";
      }
    } finally {
      loadingWorkout.value = false;
    }
  }

  async function fetchWorkoutHistory(payload?: { user_id?: number }) {
    if (!hasAccessToken()) return;
    let sid = studentId.value;

    if (!sid) {
      workoutHistory.value = [];
      return;
    }

    loadingWorkout.value = true;
    workoutError.value = null;

    try {
      const response = await api.get<Workout[]>(`/workouts/by_student/${sid}/`);
      workoutHistory.value = response.data;
    } catch (err: any) {
      console.error("Failed to fetch historical workouts stack logs:", err);
      workoutError.value = "Failed to fetch historical workouts array stack.";
    } finally {
      loadingWorkout.value = false;
    }
  }

  async function createWorkout(workoutData: {
    student: number;
    focus_area: string;
    notes: string;
    drills: WorkoutDrill[];
  }) {
    if (!hasAccessToken()) return null;
    try {
      const response = await api.post<Workout>('/workouts/', workoutData);
      await fetchCurrentWorkout({ user_id: workoutData.student });
      return response.data;
    } catch (err: any) {
      console.error("Failed to create workout entry record:", err);
      workoutError.value = "Failed to persist active workout schema.";
      return null;
    }
  }

  async function updateWorkoutProgress(workoutId: number, drills: WorkoutDrill[]) {
    if (!hasAccessToken()) return null;
    try {
      const response = await api.post<Workout>(`/workouts/${workoutId}/update_progress/`, { drills });
      if (currentWorkout.value?.id === workoutId) {
        currentWorkout.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      console.error("Failed to update workout progress parameters:", err);
      workoutError.value = "Failed to update target workout progress data metrics.";
      return null;
    }
  }

  async function updateWorkout(
    workoutId: number,
    updates: { focus_area?: string; notes?: string; drills?: WorkoutDrill[] }
  ) {
    if (!hasAccessToken()) return null;
    try {
      const response = await api.patch<Workout>(`/workouts/${workoutId}/`, updates);
      if (currentWorkout.value?.id === workoutId) {
        currentWorkout.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      console.error("Failed to process workout patch sequence:", err);
      return null;
    }
  }

  async function archiveWorkout(workoutId: number) {
    if (!hasAccessToken()) return false;
    try {
      await api.post(`/workouts/${workoutId}/archive/`);
      if (currentWorkout.value?.id === workoutId) {
        currentWorkout.value = null;
      }
      return true;
    } catch (err: any) {
      console.error("Failed to execute layout archiving method:", err);
      return false;
    }
  }

// =========================================================
// 🎓 SECURE ENROLLMENT PIPELINE METHOD
// =========================================================
async function fetchEnrollments() {
  if (!hasAccessToken()) return;

  loadingEnrollments.value = true;
  enrollmentError.value = null;

  try {
    const params: any = {};
    
    // ✨ FIX: Only attach the student query parameter if a Staff/Teacher user
    // is intentionally inspecting a specific student's workspace card.
    if (isStaff.value && selectedStudentId.value) {
      params.student = selectedStudentId.value;
    }

    const response = await api.get<StudentCourse[]>("/enrollment/", { params });
    
    // Unpack DRF's default paginated dictionary wrapper safely
    const rawData = response.data && typeof response.data === 'object' && 'results' in response.data
      ? (response.data as any).results
      : response.data;

    enrollments.value = Array.isArray(rawData) ? rawData : [];
    console.log("📚 Synced enrollment records count:", enrollments.value.length);
  } catch (err: any) {
    console.error("Failed to map enrollment model array streams:", err);
    enrollmentError.value = "Failed to fetch active student course enrollment records.";
    enrollments.value = []; // Prevent broken iteration loops in UI templates by falling back to a clean array
  } finally {
    loadingEnrollments.value = false;
  }
}
  const enrolledCourses = computed(() => 
    enrollments.value
      .filter(e => e && e.course)
      .map((e) => e.course.slug)
  );
  const studentDomain = computed(() => student.value?.domain ?? null);

  const studentDomainLabel = computed(() => {
    const d = studentDomain.value;
    if (!d) return "—";
    const map: Record<string, string> = {
      architecture: "Architecture",
      business_1: "Business 1 - Corporations",
      business_2: "Business 2 - Marketing",
      business_3: "Business 3 - Finance",
      business_4: "Business 4 - Ethics",
      chemistry: "Chemistry",
      civil: "Civil",
      computer_science: "Computer Science",
      electrical: "Electrical",
      mechanical: "Mechanical",
      general: "General",
    };
    return map[d] ?? d;
  });

  // --- Verb Usage Datasets Controllers ---
  const verbUsage = ref<VerbUsage[]>([]);
  const tierStats = ref<TierStats[]>([]);
  const tenseStats = ref<TenseStats>({
    discovered_verbs_ps: [],
    discovered_verbs_pp: [],
    mastered_verbs_ps: [],
    mastered_verbs_pp: [],
  });

  const loadingVerbUsage = ref(false);
  const verbUsageError = ref<string | null>(null);

  async function fetchVerbUsageDashboardData() {
    if (!hasAccessToken() || !studentId.value) return;

    loadingVerbUsage.value = true;
    verbUsageError.value = null;

    // Secure multi-tenant URL selection routing logic
    const url = isStaff.value ? "/verb-usage/" : `/${studentId.value}/verb-usage/`;
    const params: any = {};
    
    if (isStaff.value) {
      params.student = studentId.value; 
    }

    try {
      const res = await api.get<{
        verbs: VerbUsage[];
        tier_stats: TierStats[];
        tense_stats: TenseStats;
      }>(url, { params });

      verbUsage.value = res.data.verbs;
      tierStats.value = res.data.tier_stats;
      tenseStats.value = res.data.tense_stats;
    } catch (err: any) {
      console.error("Verb usage telemetry mapping session crashed:", err);
      verbUsageError.value = "Failed to sync verb matrix traces.";
    } finally {
      loadingVerbUsage.value = false;
    }
  }

  async function fetchSmartConjVerbPool(params: { verbSet: string; batchSize: number }) {
    if (!hasAccessToken() || !studentId.value) return null;

    const queryParams: any = {
      verb_set: params.verbSet,
      batch_size: params.batchSize,
    };

    if (isStaff.value) {
      queryParams.student = studentId.value;
    }

    const candidates = [
      `/${studentId.value}/verb-usage/`,
      "/verb-usage/",
    ];

    for (const url of candidates) {
      try {
        const res = await api.get<{ smart_pool?: any }>(url, { params: queryParams });
        if (res.data?.smart_pool) return res.data.smart_pool;
        return null;
      } catch (err: any) {
        if (err?.response?.status === 404) continue;
        return null;
      }
    }
    return null;
  }

  // --- Vocabulary Modules Controls Stack ---
  const vocab = ref<VocabItem[]>([]);
  const loadingVocab = ref(true);
  const vocabError = ref<string | null>(null);

  async function fetchVocabDashboardData() {
    if (!hasAccessToken() || !studentId.value) return;

    loadingVocab.value = true;
    vocabError.value = null;

    try {
      // Clean query parameter assignment matching secure update parameters rules
      const response = await api.get<VocabItem[]>("/vocab/", {
        params: { student: studentId.value }
      });
      vocab.value = response.data;
    } catch (err: any) {
      console.error("Failed to map vocabulary notebook traces stack:", err);
      vocabError.value = "Failed to refresh workspace notebook entries.";
    } finally {
      loadingVocab.value = false;
    }
  }

  const processedVocab = computed(() => {
    const map = new Map<string, { correct: string; incorrects: string[]; times: number; comment: string; studentId?: number | null; }>();

    for (const entry of vocab.value) {
      const key = entry.correct;
      const sid = typeof entry.student === "number"
          ? entry.student
          : (entry.student as Student)?.id ?? entry.feedback?.student?.id ?? null;

      if (!map.has(key)) {
        map.set(key, {
          correct: entry.correct,
          incorrects: entry.incorrect ? [entry.incorrect] : [],
          times: entry.times,
          comment: entry.comment || "",
          studentId: sid,
        });
      } else {
        const existing = map.get(key)!;
        existing.times += entry.times;
        if (entry.incorrect && !existing.incorrects.includes(entry.incorrect)) {
          existing.incorrects.push(entry.incorrect);
        }
        if (entry.comment) {
          existing.comment += existing.comment ? ` // ${entry.comment}` : entry.comment;
        }
      }
    }

    return Array.from(map.values())
      .map((entry) => ({
        correct: entry.correct,
        incorrect: entry.incorrects.join(", "),
        times: entry.times,
        comment: entry.comment,
      }))
      .sort((a, b) => b.times - a.times);
  });

  const vocabTableHeaders = [
    { text: "Correct", value: "correct" },
    { text: "Incorrect form or Translation", value: "incorrect" },
    { text: "Times", value: "times" },
    { text: "Comment", value: "comment" },
  ];

  function setStudent(data: Student) {
    student.value = data;
  }

 function clearStudent() {
  student.value = null;
  user.value = null;
  teacherId.value = null; 
  userLoaded.value = false;
  enrollments.value = [];
  teacherRoster.value = [];
  selectedStudentId.value = null;
  currentWorkout.value = null;
  workoutHistory.value = [];
  linguisticProfile.value = null;
}

  return {
    // Identity/Role properties
    user,
    teacherId,
    teacherProfileId,
    userLoaded,
    ensureUserLoaded,
    fetchUserData,
    isStaff,
    isSuperuser,
    isStudentAccount,
    
    // Teacher workspace elements controls
    teacherRoster,
    managedCourses,
    availableTeacherCourses,     
    availableTeacherStudents,
    selectedStudentId,
    loadingRoster,
    fetchTeacherRoster,
    fetchManagedCourses,

    // Student coordinates
    student,
    studentId,
    totalCorrect,
    healthScore,
    currentPeriodSpeakingMinutes,
    grandTotalSpeakingMinutes,
    setStudent,
    clearStudent,
    fetchStudentData,

    // Historical analytics metrics
    previousHealthScore,
    previousTotalCorrectPrompts,
    previousSpeakingSeconds,
    previousDate,
    scoreHistory,

    // Course enrollments mapping
    enrollments,
    loadingEnrollments,
    enrollmentError,
    enrolledCourses,
    fetchEnrollments,

    // Class domain tags
    studentDomain,
    studentDomainLabel,

    // Evaluation profiles vectors
    linguisticProfile,
    loadingLinguisticProfile,
    linguisticProfileError,
    hasLinguisticProfile,
    assessmentStageLabel,
    fetchLinguisticProfile,

    // Training Workout objects routines
    currentWorkout,
    workoutHistory,
    loadingWorkout,
    workoutError,
    hasCurrentWorkout,
    workoutDrillCount,
    workoutCompletionPercentage,
    fetchCurrentWorkout,
    fetchWorkoutHistory,
    createWorkout,
    updateWorkoutProgress,
    updateWorkout,
    archiveWorkout,

    // Verb logging structures tracking
    verbUsage,
    tierStats,
    tenseStats,
    loadingVerbUsage,
    verbUsageError,
    fetchVerbUsageDashboardData,

    // Active Recall conjugator tools
    fetchSmartConjVerbPool,

    // Notebook items repository
    vocab,
    loadingVocab,
    vocabError,
    fetchVocabDashboardData,
    processedVocab,
    vocabTableHeaders,
  };
});