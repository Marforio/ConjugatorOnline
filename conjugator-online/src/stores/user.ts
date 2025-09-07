import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getAccessToken, clearTokens } from "@/services/auth";
import api from "@/axios";

// --- Interfaces ---
interface User {
  id: number;
  username: string;
  is_staff: boolean;
}

interface Student {
  id: number;
  web_id: string;
  initials: string;
  user: User;
  total_correct_prompts: number;
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

interface VocabItem {
  vocab_id: string;
  correct: string;
  incorrect: string | null;
  times: number;
  comment: string;
  feedback: Feedback;
}

interface Feedback {
  feedback_id: string;
  student?: { name?: string };
  course?: { name?: string };
  date?: string;
  content?: string;
}

// --- Store ---
export const useUserStore = defineStore("user", () => {
  // 🔐 Auth state
  const student = ref<Student | null>(null);
  const accessToken = ref<string | null>(getAccessToken());

  const isAuthenticated = computed(() => !!accessToken.value);
  const isStaff = computed(() => student.value?.user?.is_staff ?? false);
  const studentId = computed(() => student.value?.id ?? null);
  const totalCorrect = computed(() => student.value?.total_correct_prompts ?? 0);

  function setStudent(data: Student) {
    student.value = data;
  }

  function clearStudent() {
    student.value = null;
    accessToken.value = null;
    clearTokens();
  }

  function setAccessToken(token: string) {
    accessToken.value = token;
  }

  // 📊 Verb usage state
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

  // 📚 Vocab state
  const vocab = ref<VocabItem[]>([]);
  const loadingVocab = ref(true);
  const vocabError = ref<string | null>(null);

  async function fetchVocabDashboardData() {
    loadingVocab.value = true;
    vocabError.value = null;

    try {
      const response = await api.get<VocabItem[]>("/vocab/");
      vocab.value = response.data;
    } catch (err: any) {
      console.error("Failed to fetch vocab:", err);
      vocabError.value = "Failed to fetch vocab";
    } finally {
      loadingVocab.value = false;
    }
  }

  const processedVocab = computed(() => {
    const map = new Map<string, { correct: string; incorrects: string[]; times: number; comment: string }>();

    for (const entry of vocab.value) {
      const key = entry.correct;
      if (!map.has(key)) {
        map.set(key, {
          correct: entry.correct,
          incorrects: entry.incorrect ? [entry.incorrect] : [],
          times: entry.times,
          comment: entry.comment || '',
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
      .map(entry => ({
        correct: entry.correct,
        incorrect: entry.incorrects.join(', '),
        times: entry.times,
        comment: entry.comment,
      }))
      .sort((a, b) => b.times - a.times);
  });

  const vocabTableHeaders = [
    { text: 'Correct', value: 'correct' },
    { text: 'Incorrect form or Translation', value: 'incorrect' },
    { text: 'Times', value: 'times' },
    { text: 'Comment', value: 'comment' },
  ];

  // 🧠 Return state + actions
  return {
    // Auth
    student, accessToken, isAuthenticated, isStaff, studentId, totalCorrect,
    setStudent, clearStudent, setAccessToken,

    // Verb usage
    verbUsage, tierStats, tenseStats, loadingVerbUsage, verbUsageError,
    fetchVerbUsageDashboardData,

    // Vocab
    vocab, loadingVocab, vocabError, fetchVocabDashboardData,
    processedVocab, vocabTableHeaders,
  };
});
