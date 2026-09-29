import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/axios'
import { useUserStore } from '@/stores/user'

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

const STALE_MS = 2 * 60 * 1000 // 2 minutes

export const useWelcomeStore = defineStore('welcome', () => {
  const userStore = useUserStore()

  // loading flags
  const loadingBundle = ref(false)
  const loadingAssignments = ref(false)
  const loadingActivity = ref(false)
  const loadingWorkout = ref(false)
  const loadingCustomLists = ref(false)

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

  function resetWelcomeState() {
    allAssignments.value = []
    activityFeed.value = []
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
        if (id && name) map[id.toLowerCase()] = name
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

      activityFeed.value = targetFeed.map((activity: any) => ({
        type: activity.activity_type,
        title: activity.activity_name || activity.activity_type || 'Activity',
        description: resolveActivityDescription(activity),
        timestamp: activity.timestamp,
        raw: activity,
      }))
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
        userStore.fetchLinguisticProfile(),
        userStore.fetchEnrollmentBundle(
          userStore.isStaff ? { student: userStore.studentId } : {}
        ),
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

  const conjugationAssignments = computed(() =>
    allAssignments.value.filter(
      (a) =>
        a.task_type === 'achievement' &&
        (a.trigger_key.includes('correct_prompts') ||
          a.trigger_key.includes('health_tier') ||
          a.trigger_key.includes('discovery') ||
          a.trigger_key.includes('mastery'))
    )
  )
  const conjugationCompletedAssignments = computed(() =>
    conjugationAssignments.value.filter((a) => a.status === 'completed')
  )

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

    // actions
    fetchCustomListNames,
    fetchAssignments,
    fetchActivityFeed,
    fetchCurrentWorkout,
    fetchWelcomeBundle,
    refreshWelcomeBundle,
    resetWelcomeState,

    // computed
    pendingAssignments,
    completedAssignments,
    pendingCount,
    completedCount,
    vocabPendingAssignments,
    vocabCompletedAssignments,
    exercisePendingAssignments,
    exerciseCompletedAssignments,
    conjugationAssignments,
    conjugationCompletedAssignments,
    gamesPendingAssignments,
    gamesCompletedAssignments,
    completedDrills,
    inProgressDrills,
    notStartedDrills,
    workoutCompletionPercentage,
  }
})