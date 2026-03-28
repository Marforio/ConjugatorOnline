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
  user: User | null;
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
  student: Student;
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

export type SmartVerbPoolByTense = {
  verb_set: string;
  batch_size: number | null;
  "Past simple"?: string[];
  "Present perfect"?: string[];
};

// --- Store ---
export const useUserStore = defineStore("user", () => {
  const auth = useAuthStore(); // ✅ define once

  // --- Core state ---
  const user = ref<User | null>(null);
  const student = ref<Student | null>(null);

  // Linguistic Profile state
  const linguisticProfile = ref<LinguisticProfile | null>(null);
  const loadingLinguisticProfile = ref(false);
  const linguisticProfileError = ref<string | null>(null);

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

  // --- Token exists check (single source of truth: auth store) ---
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
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      user.value = null;
    } finally {
      userLoaded.value = true;
    }
  }

  // Optional: keep fetchUserData name if other parts of app call it
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

  // Fetch Linguistic Profile
  async function fetchLinguisticProfile() {
    if (!hasAccessToken()) return;

    loadingLinguisticProfile.value = true;
    linguisticProfileError.value = null;

    try {
      const response = await api.get<LinguisticProfile>("/linguistic-profiles/me/");
      linguisticProfile.value = response.data;
      console.log("Fetched linguistic profile:", linguisticProfile.value);
    } catch (err: any) {
      console.error("Failed to fetch linguistic profile:", err);
      
      // Don't treat 404 as an error - student just doesn't have a profile yet
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

  // --- Enrollments ---
  const enrollments = ref<StudentCourse[]>([]);
  const loadingEnrollments = ref(false);
  const enrollmentError = ref<string | null>(null);

  function setStudent(data: Student) {
    student.value = data;
  }

  // NOTE: do NOT clear tokens here anymore; auth store owns tokens
  function clearStudent() {
    student.value = null;
    user.value = null;
    userLoaded.value = false;
    enrollments.value = [];
  }

async function fetchStudentData() {
  try {
    const res = await api.get<Student[]>("/students/");
    console.log("fetchStudentData response:", res.data);

    const first = res.data?.[0] ?? null;  //  this is a hack where I'm taking the first element from a returned list. ideally the backend view should be changed to return a single student object under  /students/me/ endpoint
    student.value = first;

    console.log("fetchStudentData stored student:", student.value);
  } catch (err: any) {
    console.error("Failed to fetch student data:", err?.response?.status, err);
    student.value = null;
  }
}

  async function fetchEnrollments() {
    if (!hasAccessToken()) return;

    loadingEnrollments.value = true;
    enrollmentError.value = null;

    try {
      const response = await api.get<StudentCourse[]>("/enrollment/");
      enrollments.value = response.data;
      console.log("Fetched enrollments:", response.data);
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

    if (!studentId.value && !isStaff.value) {
      verbUsageError.value = "Student ID required.";
      return;
    }

    loadingVerbUsage.value = true;
    verbUsageError.value = null;

    const url = isStaff.value ? "/verb-usage/" : `/${studentId.value}/verb-usage/`;

    try {
      const res = await api.get<{
        verbs: VerbUsage[];
        tier_stats: TierStats[];
        tense_stats: TenseStats;
      }>(url);

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

    const sid = studentId.value;

    const candidates = [
      sid ? `/${sid}/verb-usage/` : null,
      "/verb-usage/",
      "/student-verb-usage/",
    ].filter(Boolean) as string[];

    for (const url of candidates) {
      try {
        const res = await api.get<{ smart_pool?: any }>(url, {
          params: {
            verb_set: params.verbSet,
            batch_size: params.batchSize,
          },
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
    if (!studentId.value) return;

    loadingVocab.value = true;
    vocabError.value = null;

    try {
      const response = await api.get<VocabItem[]>(`/vocab/?student=${studentId.value}`);
      vocab.value = response.data;
      console.log("Fetched vocab:", vocab.value);
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