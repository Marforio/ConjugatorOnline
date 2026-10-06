import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/axios'
import { useUserStore } from '@/stores/user'
import { useVocabWorkoutStore } from '@/stores/vocabWorkout'

type Assignment = {
  assignment_id: string
  task_type: 'achievement' | 'exercise'
  trigger_key: string
  description: string
  status: 'pending' | 'completed' | 'expired'
  created_at: string
  completed_at: string | null
  deadline: string | null
  manually_created: boolean
  required_sessions: number
  min_days_between_sessions: number
  spaced_progress: number
  spaced_required: number
}

type ActivityItem = {
  type:
    | 'conjugation'
    | 'other_game'
    | 'exercise'
    | 'vocab_workout'
    | 'feedback'
    | 'profile_update'
    | 'achievement'
    | 'workout_drill'
  title: string
  description: string
  timestamp: string
  raw?: any
}

type WorkoutDrill = {
  id?: number
  type: 'pronunciation' | 'conjugation' | 'vocabulary' | 'grammar' | 'fluency' | 'listening' | 'other'
  name: string
  description: string
  target_reps?: number | null
  target_sessions?: number | null
  completed_sessions: number
  notes: string
  question_url?: string
}

type Workout = {
  id: number
  student: number
  student_initials: string
  created_at: string
  updated_at: string
  is_current: boolean
  focus_area: string
  notes: string
  drills: WorkoutDrill[]
}

type WrongVocabPrompt = {
  list_key: string
  list_name: string
  domain?: string | null
  item_key: string
  term: string
  prompt_field: string
  answer_field: string
  prompt_text: string
  wrong_count: number
  last_seen_at: string
  last_user_answer: string | null
  expected: string[] | null
}

type PortfolioLite = {
  id: number
  name: string
  competition?: number | null
  competition_detail?: {
    id: number
    name: string
    is_active?: boolean
    trading_is_open?: boolean
    end_time?: string | null
  } | null
  trading_is_open?: boolean
  end_time?: string | null
}

type PortfolioTickerItem = {
  id: number
  name: string
  isCompetition: boolean
  hasAssets: boolean
  netValue: number
  initialBudget: number
  pnlValue: number | null
  pnlPct: number | null
  direction: 'up' | 'down' | 'neutral'
  ctaInviteOnly: boolean
}

const STALE_MS = 2 * 60 * 1000 // 2 minutes

export const useWelcomeStore = defineStore('welcome', () => {
  const userStore = useUserStore()
  const vocabWorkoutStore = useVocabWorkoutStore()

  // loading flags
  const loadingBundle = ref(false)
  const loadingAssignments = ref(false)
  const loadingActivity = ref(false)
  const loadingWorkout = ref(false)
  const loadingCustomLists = ref(false)
  const loadingWrongVocab = ref(false)

  const wrongVocabPrompts = ref<WrongVocabPrompt[]>([])

  // data
  const allAssignments = ref<Assignment[]>([])
  const activityFeed = ref<ActivityItem[]>([])
  const currentWorkout = ref<Workout | null>(null)

  // UI filters/state
  const activityFilter = ref<string>('all')

  // custom list map for resolving vocab list IDs -> names
  const customListNameById = ref<Record<string, string>>({})
  const customListsReady = ref(false)

  // cache lifecycle
  const loadedOnce = ref(false)
  const lastLoadedAt = ref<number | null>(null)

  const isStale = computed(() => {
    if (!lastLoadedAt.value) return true
    return Date.now() - lastLoadedAt.value > STALE_MS
  })

  // Market masters portfolios
  const loadingPortfolioStatus = ref(false)
  const portfolios = ref<PortfolioLite[]>([])


  function resetWelcomeState() {
    allAssignments.value = []
    activityFeed.value = []
    wrongVocabPrompts.value = []
    portfolios.value = []
    currentWorkout.value = null
    customListNameById.value = {}
    customListsReady.value = false
    loadedOnce.value = false
    lastLoadedAt.value = null
  }

  // ---- helpers ----
  function normalizeArrayPayload(data: any): any[] {
    const payload = data && typeof data === 'object' && 'results' in data ? data.results : data
    return Array.isArray(payload) ? payload : []
  }

  function resolveActivityDescription(activity: any): string {
    const fallback = activity.description || 'Activity session updated successfully.'
    // example vocab list resolution (adjust regex/key to your real payload)
    const listId =
      activity.custom_list_id ||
      activity.list_id ||
      activity.vocab_list_id ||
      null

    if (!listId) return fallback
    const pretty = customListNameById.value[String(listId)]
    return pretty ? fallback.replace(String(listId), pretty) : fallback
  }

  const wrongVocabCount = computed(() => wrongVocabPrompts.value.length)

  const featuredWrongPrompt = computed<WrongVocabPrompt | null>(() => {
    if (!wrongVocabPrompts.value.length) return null
    // prioritize highest wrong_count, then most recent
    const sorted = [...wrongVocabPrompts.value].sort((a, b) => {
      if (b.wrong_count !== a.wrong_count) return b.wrong_count - a.wrong_count
      return new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime()
    })
    return sorted[0] ?? null
  })

  // ---- fetchers ----
  async function fetchCustomListNames() {
    loadingCustomLists.value = true
    try {
      const params: any = {}
      if (userStore.isStaff && userStore.studentId) params.student = userStore.studentId

      let res: any
      try {
        res = await api.get('/vocab-lists/', { params })
      } catch (e: any) {
        if (e?.response?.status === 404) {
          customListNameById.value = {}
          customListsReady.value = true
          return
        }
        throw e
      }

      const arr = normalizeArrayPayload(res.data)
      const map: Record<string, string> = {}
      for (const r of arr) {
        const id = String(r.id ?? r.list_id ?? '').trim()
        const name = String(r.name ?? r.title ?? '').trim()
        if (id && name) map[normalizeKey(id)] = name;
      }
      customListNameById.value = map
      customListsReady.value = true
    } catch (err) {
      console.warn('[welcomeStore] fetchCustomListNames non-fatal:', err)
      customListNameById.value = {}
      customListsReady.value = true
    } finally {
      loadingCustomLists.value = false
    }
  }

  async function fetchAssignments() {
    loadingAssignments.value = true
    try {
      const params: any = {}
      if (userStore.isStaff) params.student = userStore.studentId
      const res = await api.get('/assignment/', { params })
      allAssignments.value = normalizeArrayPayload(res.data)
    } catch (err) {
      console.error('[welcomeStore] fetchAssignments failed:', err)
      allAssignments.value = []
    } finally {
      loadingAssignments.value = false
    }
  }

  async function fetchWrongVocabPrompts() {
  loadingWrongVocab.value = true
  try {
    const params: any = {
      days: 120,
      limit: 300,
      mode: "write",
    }
    if (userStore.isStaff && userStore.studentId) params.student = userStore.studentId

    const res = await api.get("/vocab-workout-sessions/wrong-prompts/", { params })
    const arr = normalizeArrayPayload(res.data)

    wrongVocabPrompts.value = arr
      .map((r: any) => ({
        list_key: String(r.list_key ?? ""),
        list_name: String(r.list_name ?? ""),
        domain: r.domain ?? null,
        item_key: String(r.item_key ?? ""),
        term: String(r.term ?? ""),
        prompt_field: String(r.prompt_field ?? ""),
        answer_field: String(r.answer_field ?? ""),
        prompt_text: String(r.prompt_text ?? ""),
        wrong_count: Number(r.wrong_count ?? 0),
        last_seen_at: String(r.last_seen_at ?? ""),
        last_user_answer: r.last_user_answer != null ? String(r.last_user_answer) : null,
        expected: Array.isArray(r.expected) ? r.expected.map(String) : null,
      }))
      .sort(() => Math.random() - 0.5); // shuffle each load
  } catch (err) {
    console.error("[welcomeStore] fetchWrongVocabPrompts failed:", err)
    wrongVocabPrompts.value = []
  } finally {
    loadingWrongVocab.value = false
  }
}

// add fetcher near other fetchers
async function fetchPortfolioStatus() {
  loadingPortfolioStatus.value = true
  try {
    const res = await api.get('/market-masters/hub/')
    portfolios.value = Array.isArray(res.data?.portfolios) ? res.data.portfolios : []
  } catch (err) {
    console.warn('[welcomeStore] fetchPortfolioStatus failed (non-fatal):', err)
    portfolios.value = []
  } finally {
    loadingPortfolioStatus.value = false
  }
}

  async function fetchActivityFeed() {
    loadingActivity.value = true
    try {
      const params: any = { days: 90 }
      if (userStore.isStaff) params.student = userStore.studentId
      if (activityFilter.value && activityFilter.value !== 'all') {
        params.type = activityFilter.value
      }

      const res = await api.get('/student-activities/', { params })
      const rawData = normalizeArrayPayload(res.data)

      const targetFeed =
        userStore.isStaff && userStore.student
          ? rawData.filter(
              (act: any) =>
                act.student === userStore.studentId ||
                act.student_initials === userStore.student?.initials
            )
          : rawData

      activityFeed.value = targetFeed.map((activity: any) => {
        const rawTitle = activity.resolved_activity_name || activity.activity_name || activity.activity_type || 'Activity';
        const rawDesc = activity.resolved_description || activity.description || 'Activity session updated successfully.';
        return {
          type: activity.activity_type,
          title: replaceListIdsInText(rawTitle),
          description: replaceListIdsInText(rawDesc),
          timestamp: activity.timestamp,
          raw: activity,
        };
      });
    } catch (err) {
      console.error('[welcomeStore] fetchActivityFeed failed:', err)
      activityFeed.value = []
    } finally {
      loadingActivity.value = false
    }
  }

  async function fetchCurrentWorkout() {
    loadingWorkout.value = true
    try {
      if (userStore.isStaff) {
        await userStore.fetchCurrentWorkout({ user_id: userStore.user?.id })
      } else {
        await userStore.fetchCurrentWorkout()
      }
      currentWorkout.value = userStore.currentWorkout as Workout | null
    } catch (err) {
      console.error('[welcomeStore] fetchCurrentWorkout failed:', err)
      currentWorkout.value = null
    } finally {
      loadingWorkout.value = false
    }
  }

  // ---- one-shot loader for welcome page ----
  async function fetchWelcomeBundle(force = false) {
    if (loadingBundle.value) return
    if (!force && loadedOnce.value && !isStale.value) return

    loadingBundle.value = true
    try {
      // order matters: custom names first, then activity
      await fetchCustomListNames()
      await fetchActivityFeed()

      await Promise.all([
        fetchAssignments(),
        fetchCurrentWorkout(),
        fetchWrongVocabPrompts(),
        userStore.fetchLinguisticProfile(),
        userStore.fetchEnrollmentBundle(
          userStore.isStaff ? { student: userStore.studentId } : {}
        ),
        !userStore.isStaff ? vocabWorkoutStore.fetchMyWork() : Promise.resolve(),
        !userStore.isStaff ? fetchPortfolioStatus() : Promise.resolve(),
      ])

      loadedOnce.value = true
      lastLoadedAt.value = Date.now()
    } finally {
      loadingBundle.value = false
    }
  }

  async function refreshWelcomeBundle() {
    await fetchWelcomeBundle(true)
  }

  // ---- computed slices used by welcome page ----

function normalizeKey(v: string): string {
  return String(v ?? '').trim().toLowerCase();
}

function titleCaseWords(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

function replaceListIdsInText(text: string): string {
  let out = String(text ?? '');
  if (!out) return out;

  // UUID replacement
  out = out.replace(
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi,
    (uuid) => customListNameById.value[normalizeKey(uuid)] || uuid
  );

  // optional legacy prettifier
  out = out.replace(/\birregular_verbs(?:_[a-z0-9_]+)?\b/gi, (k) => titleCaseWords(k));
  return out;
}

const openPortfolios = computed(() =>
  portfolios.value.filter((p) => {
    const tradingOpen = p.trading_is_open ?? p.competition_detail?.trading_is_open ?? false
    const end = p.end_time ?? p.competition_detail?.end_time ?? null
    const notEnded = end ? new Date(end).getTime() > Date.now() : true
    return tradingOpen && notEnded
  })
)

const hasOpenPortfolio = computed(() => openPortfolios.value.length > 0)
const primaryOpenPortfolio = computed(() => openPortfolios.value[0] ?? null)

function num(v: any, fallback = 0): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

// add computed near your other computed slices
const portfolioTickerItems = computed<PortfolioTickerItem[]>(() => {
  const rows = Array.isArray(portfolios.value) ? portfolios.value : []

  return rows
    .map((p: any) => {
      const assets = Array.isArray(p.assets) ? p.assets : []
      const hasAssets = assets.length > 0
      const isCompetition = Boolean(p.competition)

      // show invite banner only when competition portfolio exists but has no assets
      const ctaInviteOnly = isCompetition && !hasAssets

      // Canonical baseline for PnL
        const initialBudget = num(p.initial_budget, 0)
        const netValue =
          num(p.net_equity, NaN) === num(p.net_equity, NaN)
            ? num(p.net_equity)
            : num(p.cash_balance)

        const pnlValue =
          p.pnl_value !== null && p.pnl_value !== undefined
            ? num(p.pnl_value, 0)
            : (initialBudget > 0 ? netValue - initialBudget : 0)

        // IMPORTANT: do not round here
        const pnlPct =
          p.pnl_pct !== null && p.pnl_pct !== undefined
            ? num(p.pnl_pct, 0)
            : (initialBudget > 0 ? (pnlValue / initialBudget) * 100 : 0)

      // Direction from pnlValue (more stable than tiny rounded pct)
      let direction: 'up' | 'down' | 'neutral' = 'neutral'
      if (pnlValue !== null) {
        if (pnlValue > 0) direction = 'up'
        else if (pnlValue < 0) direction = 'down'
      }

      return {
        id: num(p.id),
        name: String(p.name ?? `Portfolio #${p.id}`),
        isCompetition,
        hasAssets,
        netValue,
        initialBudget,
        pnlValue,
        pnlPct,
        direction,
        ctaInviteOnly,
      } as PortfolioTickerItem
    })
    // visibility rule:
    // - show if has assets
    // - or if competition invite (no assets yet)
    .filter((x) => x.hasAssets || x.ctaInviteOnly)
})




  const pendingAssignments = computed(() =>
    allAssignments.value.filter((a) => a.status === 'pending')
  )
  const completedAssignments = computed(() =>
    allAssignments.value.filter((a) => a.status === 'completed')
  )
  const pendingCount = computed(() => pendingAssignments.value.length)
  const completedCount = computed(() => completedAssignments.value.length)

  const vocabAssignments = computed(() =>
    allAssignments.value.filter(
      (a) => a.task_type === 'achievement' && a.trigger_key.includes('vw_write_complete')
    )
  )
  const vocabPendingAssignments = computed(() =>
    vocabAssignments.value.filter((a) => a.status === 'pending')
  )
  const vocabCompletedAssignments = computed(() =>
    vocabAssignments.value.filter((a) => a.status === 'completed')
  )

  const exerciseAssignments = computed(() =>
    allAssignments.value.filter((a) => a.task_type === 'exercise')
  )
  const exercisePendingAssignments = computed(() =>
    exerciseAssignments.value.filter((a) => a.status === 'pending')
  )
  const exerciseCompletedAssignments = computed(() =>
    exerciseAssignments.value.filter((a) => a.status === 'completed')
  )

function containsWord(hay: string, needle: string): boolean {
  return String(hay ?? '').toLowerCase().includes(needle.toLowerCase());
}

function extractNumberFromText(text: string): number {
  if (!text) return Number.POSITIVE_INFINITY;
  const m = text.match(/\d+/);
  return m ? parseInt(m[0], 10) : Number.POSITIVE_INFINITY;
}

function pickNextBySmallestNumericTarget(list: Assignment[]): Assignment[] {
  if (!list.length) return [];
  const sorted = [...list].sort(
    (a, b) => extractNumberFromText(a.description) - extractNumberFromText(b.description)
  );
  return [sorted[0]];
}

  const conjugationAssignments = computed(() =>
    allAssignments.value.filter(
      a =>
        a.task_type === 'achievement' &&
        (
          a.trigger_key.includes('correct_prompts') ||
          a.trigger_key.includes('health_tier') ||
          a.trigger_key.includes('discovery') ||
          a.trigger_key.includes('mastery')
        )
    )
  );

  const conjugationPendingAll = computed(() =>
    conjugationAssignments.value.filter(a => a.status === 'pending')
  );

  // Track 1: health
  const conjugationHealthPendingAssignments = computed(() => {
    const list = conjugationPendingAll.value.filter(a =>
      containsWord(a.trigger_key, 'health') || containsWord(a.description, 'health')
    );
    return pickNextBySmallestNumericTarget(list);
  });

  // Track 2: correct prompts
  const conjugationCorrectPendingAssignments = computed(() => {
    const list = conjugationPendingAll.value.filter(a =>
      containsWord(a.trigger_key, 'correct') || containsWord(a.description, 'correct')
    );
    return pickNextBySmallestNumericTarget(list);
  });

  // Final (max 2)
  const conjugationPendingAssignments = computed(() => {
    const merged = [
      ...conjugationHealthPendingAssignments.value,
      ...conjugationCorrectPendingAssignments.value,
    ];
    const dedup = new Map<string, Assignment>();
    merged.forEach(a => dedup.set(a.assignment_id, a));
    return Array.from(dedup.values());
  });

  const conjugationCompletedAssignments = computed(() =>
    conjugationAssignments.value.filter(a => a.status === 'completed')
  );

  const gamesAssignments = computed(() =>
    allAssignments.value.filter(
      (a) =>
        a.task_type === 'achievement' &&
        !a.trigger_key.includes('vw_write_complete') &&
        !a.trigger_key.includes('correct_prompts') &&
        !a.trigger_key.includes('health_tier') &&
        !a.trigger_key.includes('discovery') &&
        !a.trigger_key.includes('mastery')
    )
  )
  const gamesPendingAssignments = computed(() =>
    gamesAssignments.value.filter((a) => a.status === 'pending')
  )
  const gamesCompletedAssignments = computed(() =>
    gamesAssignments.value.filter((a) => a.status === 'completed')
  )

  const completedDrills = computed(() => {
    if (!currentWorkout.value?.drills) return []
    return currentWorkout.value.drills.filter(
      (d) => d.completed_sessions >= (d.target_sessions ?? 0) && (d.target_sessions ?? 0) > 0
    )
  })
  const inProgressDrills = computed(() => {
    if (!currentWorkout.value?.drills) return []
    return currentWorkout.value.drills.filter(
      (d) => d.completed_sessions > 0 && d.completed_sessions < (d.target_sessions ?? 0)
    )
  })
  const notStartedDrills = computed(() => {
    if (!currentWorkout.value?.drills) return []
    return currentWorkout.value.drills.filter((d) => d.completed_sessions === 0)
  })
  const workoutCompletionPercentage = computed(() => {
    if (!currentWorkout.value?.drills?.length) return 0
    const total = currentWorkout.value.drills.reduce((sum, d) => sum + (d.target_sessions || 0), 0)
    if (!total) return 0
    const done = currentWorkout.value.drills.reduce((sum, d) => sum + d.completed_sessions, 0)
    return Math.round((done / total) * 100)
  })

  return {
    // state
    loadingBundle,
    loadingAssignments,
    loadingActivity,
    loadingWrongVocab,
    loadingWorkout,
    loadingCustomLists,
    loadedOnce,
    lastLoadedAt,
    activityFilter,
    allAssignments,
    activityFeed,
    currentWorkout,
    customListNameById,
    customListsReady,
    wrongVocabPrompts,
    wrongVocabCount,
    featuredWrongPrompt,
    loadingPortfolioStatus,
    portfolios,
    portfolioTickerItems,

    // actions
    fetchCustomListNames,
    fetchAssignments,
    fetchActivityFeed,
    fetchCurrentWorkout,
    fetchWelcomeBundle,
    refreshWelcomeBundle,
    resetWelcomeState,
    fetchPortfolioStatus,

    // computed
    pendingAssignments,
    completedAssignments,
    pendingCount,
    completedCount,
    vocabPendingAssignments,
    vocabCompletedAssignments,
    exercisePendingAssignments,
    exerciseCompletedAssignments,
    conjugationPendingAssignments,
    conjugationCompletedAssignments,
    gamesPendingAssignments,
    gamesCompletedAssignments,
    completedDrills,
    inProgressDrills,
    notStartedDrills,
    workoutCompletionPercentage,
  }
})