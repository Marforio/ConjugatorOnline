// stores/user.ts

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
}

interface ScoreSnapshot {
  total_correct_prompts: number;
  health_score: number;
}

interface Student {
  id: number;
  web_id: string;
  initials: string;
  total_correct_prompts: number;
  health_score: number;
  domain: string | null;
  user: User | number | null; // Updated to handle nested object or raw ID number safely
  score_history: Record<string, ScoreSnapshot>;
  linguistic_profile?: LinguisticProfile; 
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
  mastered_ps: boolean;
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

// --- Store ---
export const useUserStore = defineStore("user", () => {
  const auth = useAuthStore();

  // --- Core state ---
  const user = ref<User | null>(null);
  const student = ref<Student | null>(null);

  // Linguistic Profile state
  const linguisticProfile = ref<LinguisticProfile | null>(null);
  const loadingLinguisticProfile = ref(false);
  const linguisticProfileError = ref<string | null>(null);

  // NEW: Workout state
  const currentWorkout = ref<Workout | null>(null);
  const workoutHistory = ref<Workout[]>([]);
  const loadingWorkout = ref(false);
  const workoutError = ref<string | null>(null);

  // --- Computed ---
  const isStaff = computed(() => user.value?.is_staff ?? false);
  const isSuperuser = computed(() => user.value?.is_superuser ?? false);
  const studentId = computed(() => student.value?.id ?? null);
  const totalCorrect = computed(() => student.value?.total_correct_prompts ?? 0);
  const healthScore = computed(() => student.value?.health_score ?? 0);

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

  // NEW: Workout computed
  const hasCurrentWorkout = computed(() => currentWorkout.value !== null);

  const workoutDrillCount = computed(() => {
    return currentWorkout.value?.drills?.length ?? 0;
  });

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

  // --- Token exists check ---
  function hasAccessToken(): boolean {
    return !!auth.access;
  }

  // --- User bootstrap ---
  const userLoaded = ref(false);

  async function ensureUserLoaded() {
    if (userLoaded.value) return;
    if (!hasAccessToken()) return;

    try {
      const res = await api.get<User>("/users/me/");
      user.value = res.data;
      // Immediately cascade down to gather profile layers
      await fetchStudentData();
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      user.value = null;
    } finally {
      userLoaded.value = true;
    }
  }

  async function fetchUserData() {
    await ensureUserLoaded();
  }

  // --- Previous semester scores ---
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

  // ==========================================
  // 1. MODIFIED: fetchLinguisticProfile
  // ==========================================
  async function fetchLinguisticProfile() {
    if (!hasAccessToken()) return;

    loadingLinguisticProfile.value = true;
    linguisticProfileError.value = null;

    try {
      const params: any = {};
      if (isStaff.value) {
        params.user = user.value?.id;
      }

      const response = await api.get<LinguisticProfile>("/linguistic-profiles/me/", { params });
      linguisticProfile.value = response.data;
      console.log("Fetched linguistic profile context:", linguisticProfile.value);
    } catch (err: any) {
      console.error("Failed to fetch linguistic profile:", err);
      
      if (err?.response?.status === 404) {
        linguisticProfile.value = null;
        linguisticProfileError.value = null;
      } else {
        linguisticProfileError.value = "Failed to fetch linguistic profile";
      }
    } finally {
      loadingLinguisticProfile.value = false;
    }
  }

  // ==========================================
  // 2. MODIFIED: fetchCurrentWorkout
  // ==========================================
  async function fetchCurrentWorkout(payload?: { user_id?: number }) {
    if (!hasAccessToken()) return;

    let sid = studentId.value;

    if (isStaff.value && !sid) {
      console.log("Teacher sandbox mode: No linked student shadow record discovered. Skipping workout query.");
      currentWorkout.value = null;
      return;
    }

    loadingWorkout.value = true;
    workoutError.value = null;

    try {
      const response = await api.get<Workout>(`/workouts/current/${sid}/`);
      currentWorkout.value = response.data;
      console.log("Fetched current sandbox workout:", currentWorkout.value);
    } catch (err: any) {
      console.error("Failed to fetch current workout:", err);
      
      if (err?.response?.status === 404) {
        currentWorkout.value = null;
        workoutError.value = null; 
      } else {
        workoutError.value = "Failed to fetch current workout";
      }
    } finally {
      loadingWorkout.value = false;
    }
  }

  // ==========================================
  // 3. MODIFIED: fetchWorkoutHistory
  // ==========================================
  async function fetchWorkoutHistory(payload?: { user_id?: number }) {
    if (!hasAccessToken()) return;

    let sid = studentId.value;

    if (isStaff.value && !sid) {
      workoutHistory.value = [];
      return;
    }

    loadingWorkout.value = true;
    workoutError.value = null;

    try {
      const response = await api.get<Workout[]>(`/workouts/by_student/${sid}/`);
      workoutHistory.value = response.data;
      console.log("Fetched workout history data layout:", workoutHistory.value);
    } catch (err: any) {
      console.error("Failed to fetch workout history:", err);
      workoutError.value = "Failed to fetch workout history";
    } finally {
      loadingWorkout.value = false;
    }
  }

  // Create Workout
  async function createWorkout(workoutData: {
    student: number;
    focus_area: string;
    notes: string;
    drills: WorkoutDrill[];
  }) {
    if (!hasAccessToken()) return null;

    try {
      const response = await api.post<Workout>('/workouts/', workoutData);
      console.log("Created workout:", response.data);
      
      await fetchCurrentWorkout({ user_id: workoutData.student });
      
      return response.data;
    } catch (err: any) {
      console.error("Failed to create workout:", err);
      workoutError.value = "Failed to create workout";
      return null;
    }
  }

  // Update Workout Progress
  async function updateWorkoutProgress(workoutId: number, drills: WorkoutDrill[]) {
    if (!hasAccessToken()) return null;

    try {
      const response = await api.post<Workout>(
        `/workouts/${workoutId}/update_progress/`,
        { drills }
      );
      console.log("Updated workout progress:", response.data);
      
      if (currentWorkout.value?.id === workoutId) {
        currentWorkout.value = response.data;
      }
      
      return response.data;
    } catch (err: any) {
      console.error("Failed to update workout progress:", err);
      workoutError.value = "Failed to update workout progress";
      return null;
    }
  }

  // Update Workout Metadata
  async function updateWorkout(
    workoutId: number,
    updates: { focus_area?: string; notes?: string; drills?: WorkoutDrill[] }
  ) {
    if (!hasAccessToken()) return null;

    try {
      const response = await api.patch<Workout>(`/workouts/${workoutId}/`, updates);
      console.log("Updated workout:", response.data);
      
      if (currentWorkout.value?.id === workoutId) {
        currentWorkout.value = response.data;
      }
      
      return response.data;
    } catch (err: any) {
      console.error("Failed to update workout:", err);
      workoutError.value = "Failed to update workout";
      return null;
    }
  }

  // Archive Workout
  async function archiveWorkout(workoutId: number) {
    if (!hasAccessToken()) return false;

    try {
      await api.post(`/workouts/${workoutId}/archive/`);
      console.log("Archived workout:", workoutId);
      
      if (currentWorkout.value?.id === workoutId) {
        currentWorkout.value = null;
      }
      
      return true;
    } catch (err: any) {
      console.error("Failed to archive workout:", err);
      workoutError.value = "Failed to archive workout";
      return false;
    }
  }

  // --- Enrollments ---
  const enrollments = ref<StudentCourse[]>([]);
  const loadingEnrollments = ref(false);
  const enrollmentError = ref<string | null>(null);

  function setStudent(data: Student) {
    student.value = data;
  }

  function clearStudent() {
    student.value = null;
    user.value = null;
    userLoaded.value = false;
    enrollments.value = [];
    currentWorkout.value = null;
    workoutHistory.value = [];
    linguisticProfile.value = null;
  }

  // ==========================================
  // 4. MODIFIED: fetchStudentData
  // ==========================================
  async function fetchStudentData() {
    if (!hasAccessToken()) return;
    
    try {
      const res = await api.get<Student[]>("/students/");
      
      // Handle Django REST Framework paginated blocks vs flat arrays cleanly
      const rawArray = res.data && typeof res.data === 'object' && 'results' in res.data 
        ? (res.data as any).results 
        : res.data;

      console.log("--- 🕵️‍♂️ DATABASE PROFILE INSPECTOR ---");
      console.log("Your Logged-in User ID is:", user.value?.id);
      console.log("Raw students array length from server:", rawArray?.length);
      
      if (Array.isArray(rawArray)) {
        if (isStaff.value) {
          const targetId = user.value?.id;
          
          // Use robust cross-type String evaluations to safely catch the admin row
          const mySandboxProfile = rawArray.find(s => {
            if (!s.user) return false;
            if (typeof s.user === 'object') {
              return String(s.user.id) === String(targetId);
            }
            return String(s.user) === String(targetId);
          });
          
          if (mySandboxProfile) {
            student.value = mySandboxProfile;
            if (mySandboxProfile.linguistic_profile) {
              linguisticProfile.value = mySandboxProfile.linguistic_profile;
            }
            console.log("✨ Success! Bound your Admin Shadow Student profile row:", student.value);
          } else {
            console.warn("Admin warning: You are logged in as staff, but no profile row matches your user.id.");
            student.value = null;
          }
        } else {
          // Regular student fallback strategy
          student.value = rawArray[0] ?? null;
          if (student.value?.linguistic_profile) {
            linguisticProfile.value = student.value.linguistic_profile;
          }
        }
      }
      console.log("-------------------------------------");

    } catch (err: any) {
      console.error("Failed to fetch student data trace profiles:", err);
      student.value = null;
    }
  }

  // ==========================================
  // fetchEnrollments
  // ==========================================
// Inside stores/user.ts -> Simplify fetchEnrollments
async function fetchEnrollments() {
  if (!hasAccessToken()) return;

  loadingEnrollments.value = true;
  enrollmentError.value = null;

  try {
    // Pass parameters explicitly so the backend uses its SQL index tree trees
    const params: any = {};
    if (isStaff.value) {
      params.student = studentId.value;
    }

    const response = await api.get<StudentCourse[]>("/enrollment/", { params });
    
    const rawData = response.data && typeof response.data === 'object' && 'results' in response.data
      ? (response.data as any).results
      : response.data;

    // ✨ CLEANED UP: Directly assign the server's clean payload 
    enrollments.value = Array.isArray(rawData) ? rawData : [];
  } catch (err: any) {
    console.error("Failed to fetch enrollments:", err);
    enrollmentError.value = "Failed to fetch enrollments";
  } finally {
    loadingEnrollments.value = false;
  }
}

  const enrolledCourses = computed(() => enrollments.value.map((e) => e.course.slug));

  // --- Student domain ---
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

  // --- Verb usage ---
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
    if (!hasAccessToken()) return;

    loadingVerbUsage.value = true;
    verbUsageError.value = null;

    const url = isStaff.value ? "/verb-usage/" : `/${studentId.value}/verb-usage/`;
    const params: any = {};
    
    if (isStaff.value) {
      params.user = user.value?.id; 
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
      console.error("Verb usage fetch failed:", err);
      verbUsageError.value = "Failed to fetch verb usage";
    } finally {
      loadingVerbUsage.value = false;
    }
  }

  // --- Smart verb pool for conjugator ---
  async function fetchSmartConjVerbPool(params: { verbSet: string; batchSize: number }) {
    if (!hasAccessToken()) return null;

    const queryParams: any = {
      verb_set: params.verbSet,
      batch_size: params.batchSize,
    };

    if (isStaff.value) {
      queryParams.user = user.value?.id;
    }

    const sid = studentId.value;
    const candidates = [
      sid ? `/${sid}/verb-usage/` : null,
      "/verb-usage/",
      "/student-verb-usage/",
    ].filter(Boolean) as string[];

    for (const url of candidates) {
      try {
        const res = await api.get<{ smart_pool?: any }>(url, {
          params: queryParams,
        });

        if (res.data?.smart_pool) return res.data.smart_pool;
        return null;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) continue;

        console.error("fetchSmartConjVerbPool failed:", err);
        return null;
      }
    }

    return null;
  }

  // --- Vocab ---
  const vocab = ref<VocabItem[]>([]);
  const loadingVocab = ref(true);
  const vocabError = ref<string | null>(null);

  async function fetchVocabDashboardData() {
    if (!hasAccessToken()) return;
    
    if (!studentId.value && !isStaff.value) return;

    loadingVocab.value = true;
    vocabError.value = null;

    try {
      const queryParamKey = isStaff.value ? 'user' : 'student';
      const queryParamValue = isStaff.value ? user.value?.id : studentId.value;

      const response = await api.get<VocabItem[]>(`/vocab/?${queryParamKey}=${queryParamValue}`);
      
      vocab.value = response.data;
      console.log("Fetched sandbox preview vocab:", vocab.value);
    } catch (err: any) {
      console.error("Failed to fetch vocab:", err);
      vocabError.value = "Failed to fetch vocab";
    } finally {
      loadingVocab.value = false;
    }
  }

  const processedVocab = computed(() => {
    const map = new Map<
      string,
      {
        correct: string;
        incorrects: string[];
        times: number;
        comment: string;
        studentId?: number | null;
      }
    >();

    for (const entry of vocab.value) {
      const key = entry.correct;

      const sid =
        typeof entry.student === "number"
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

  return {
    // identity/role
    user,
    userLoaded,
    ensureUserLoaded,
    fetchUserData,
    isStaff,
    isSuperuser,

    // student
    student,
    studentId,
    totalCorrect,
    healthScore,
    setStudent,
    clearStudent,
    fetchStudentData,

    // previous semester / history
    previousHealthScore,
    previousTotalCorrectPrompts,
    previousDate,
    scoreHistory,

    // enrollments
    enrollments,
    loadingEnrollments,
    enrollmentError,
    enrolledCourses,
    fetchEnrollments,

    // domain
    studentDomain,
    studentDomainLabel,

    // linguistic profile
    linguisticProfile,
    loadingLinguisticProfile,
    linguisticProfileError,
    hasLinguisticProfile,
    assessmentStageLabel,
    fetchLinguisticProfile,

    // workouts
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

    // verb usage
    verbUsage,
    tierStats,
    tenseStats,
    loadingVerbUsage,
    verbUsageError,
    fetchVerbUsageDashboardData,

    // conjugator
    fetchSmartConjVerbPool,

    // vocab
    vocab,
    loadingVocab,
    vocabError,
    fetchVocabDashboardData,
    processedVocab,
    vocabTableHeaders,
  };
});