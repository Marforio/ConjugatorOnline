// src/stores/user.ts
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getAccessToken, clearTokens } from "@/services/auth";
import api from "@/axios";

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
  discovered: boolean;
  mastered: boolean;
  past_simple: { correct: number; incorrect: number; used_count: number };
  present_perfect: { correct: number; incorrect: number; used_count: number };
  total_used: number;
}

interface TierStats {
  tier_name: string;
  total: number;
  discovered_count: number;
  mastered_count: number;
  discovered_pct: number;
  mastered_pct: number;
  undiscovered_verbs: string[];
  unmastered_verbs: string[];
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
  student?: {
    name?: string;
    // Add other student fields if needed
  };
  course?: {
    name?: string;
    // Add other course fields if needed
  };
  date?: string;
  content?: string;
}

export const useUserStore = defineStore("user", () => {
  // --- Auth / student state ---
  const student = ref<Student | null>(null);
  const accessToken = ref<string | null>(getAccessToken());

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

  const isAuthenticated = computed(() => !!accessToken.value);
  const isStaff = computed(() => student.value?.user?.is_staff ?? false);
  const studentId = computed(() => student.value?.id ?? null);
  const totalCorrect = computed(() => student.value?.total_correct_prompts ?? null);

  // --- Verb usage state ---
  const verbUsage = ref<VerbUsage[]>([]);
  const tierStats = ref<TierStats[]>([]);
  const tenseStats = ref<TenseStats | null>(null);
  const loadingVerbUsage = ref(false);
  const verbUsageError = ref<string | null>(null);

  // --- Action: fetch verb usage data ---
  async function fetchVerbUsageDashboardData() {
    if (!studentId.value && !isStaff.value) {
      verbUsageError.value = "Student ID required.";
      return;
    }

    loadingVerbUsage.value = true;
    verbUsageError.value = null;

    const url = isStaff.value
      ? "/verb-usage/"
      : `/${studentId.value}/verb-usage/`;

    try {
      const res = await api.get(url);
      const { verbs, tier_stats, tense_stats } = res.data;

      verbUsage.value = verbs;
      tierStats.value = tier_stats;
      tenseStats.value = tense_stats;
    } catch (err: any) {
      console.error("Verb usage fetch failed:", err);
      verbUsageError.value = "Failed to fetch verb usage";
    } finally {
      loadingVerbUsage.value = false;
    }
  }
   // Vocab data state
  const vocab = ref<VocabItem[]>([]);
    const loadingVocab = ref(true);
    const vocabError = ref<string | null>(null);

  // -- fetch vocab data --
  const fetchVocabDashboardData = async () => {
      loadingVocab.value = true;
      vocabError.value = null;

      try {
        const response = await api.get<VocabItem[]>("/vocab/");
        vocab.value = response.data;
      } catch (err: any) {
        console.error("Failed to fetch errors:", err);
        vocabError.value = vocabError.value
          ? `${vocabError.value}; Failed to fetch errors`
          : "Failed to fetch errors";
      }

      loadingVocab.value = false;
    };

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

        return Array.from(map.values()).map(entry => ({
            correct: entry.correct,
            incorrect: entry.incorrects.join(', '),
            times: entry.times,
            comment: entry.comment,
        })).sort((a, b) => b.times - a.times);
        });


    const vocabTableHeaders = [
        { text: 'Correct', value: 'correct' },
        { text: 'Incorrect form or Translation', value: 'incorrect' },
        { text: 'Times', value: 'times' },
        { text: 'Comment', value: 'comment' },
    ];

  return {
    // auth
    student, accessToken, setStudent, clearStudent, setAccessToken,
    isAuthenticated, isStaff, studentId, totalCorrect,
    // verb usage
    verbUsage, tierStats, tenseStats, loadingVerbUsage, verbUsageError,
    fetchVerbUsageDashboardData,
    // vocab data
    fetchVocabDashboardData, processedVocab, vocabTableHeaders, loadingVocab, vocabError

  };
});
