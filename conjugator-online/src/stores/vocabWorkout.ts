// stores/vocabWorkout.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/axios";

export type VWMode = "write" | "quiz";
export type VWLevel = "essential" | "advanced" | null;

export interface VWSession {
  session_id: number;
  list_key: string;
  domain: string | null;
  mode: VWMode;

  // ✅ server expects snake_case; keep canonical snake_case here
  track_key: string | null;

  front_field: string;
  back_field: string;
  level: VWLevel;
  quiz_count?: number | null;

  // server-driven queue
  all_item_ids?: string[];
  unseen_item_ids?: string[];
  review_item_ids?: string[];
  mastered_item_ids?: string[];
  current_item_id?: string | null;
  prompt_number?: number;

  total_attempts: number;
  correct_count: number;
  wrong_count: number;

  last_index: number;
  total_items_planned: number;

  status: "active" | "finished" | "abandoned";
  started_at: string;
  finished_at: string | null;
  last_activity_at: string;
}

export interface VWAttempt {
  attempt_id: string;
  prompt_number: number;
  item_key: string;
  term: string;
  prompt_field: string;
  answer_field: string;
  prompt_text?: string | null;
  expected: string[];
  user_answer: string;
  is_correct: boolean | null;
  elapsed_time?: number | null;
}

export interface VWProgress {
  list_key: string;
  domain: string | null;
  mode: VWMode;
  track_key: string | null;
  level: VWLevel;
  sessions_started: number;
  sessions_finished: number;
  total_attempts: number;
  correct_count: number;
  wrong_count: number;
  accuracy: number;
  last_session_id: number | null;
  last_activity_at: string;
}

export interface VWQueueState {
  session: VWSession;
  next_item_id: string | null;
  done: boolean;
}


/** ---------- tolerant response helpers ---------- */
function looksLikeQueueState(x: any): x is { session: any; next_item_id?: any; done?: any } {
  return !!x && typeof x === "object" && !!x.session && ("done" in x || "next_item_id" in x);
}

function normalizeQueueState(data: any): VWQueueState {
  if (!looksLikeQueueState(data)) {
    throw new Error(
      `Detail endpoint did not return a queue state wrapper. Received keys: ${Object.keys(data ?? {}).join(", ")}`
    );
  }

  return {
    session: normalizeSession(data.session),
    next_item_id: data.next_item_id != null ? String(data.next_item_id) : null,
    done: Boolean(data.done),
  };
}


function normalizeSession(raw: any): VWSession {
  const sid = Number(raw?.session_id ?? raw?.id);
  if (!sid) {
    throw new Error(
      `Session payload missing id/session_id. Keys: ${Object.keys(raw ?? {}).join(", ")}`
    );
  }

  return {
    session_id: sid,

    list_key: raw.list_key,
    domain: raw.domain ?? null,
    mode: raw.mode,

    track_key: raw.track_key ?? null,

    front_field: raw.front_field,
    back_field: raw.back_field,
    level: raw.level ?? null,
    quiz_count: raw.quiz_count ?? null,

    // queue state (optional, depending on serializer)
    all_item_ids: Array.isArray(raw.all_item_ids) ? raw.all_item_ids : undefined,
    unseen_item_ids: Array.isArray(raw.unseen_item_ids) ? raw.unseen_item_ids : undefined,
    review_item_ids: Array.isArray(raw.review_item_ids) ? raw.review_item_ids : undefined,
    mastered_item_ids: Array.isArray(raw.mastered_item_ids) ? raw.mastered_item_ids : undefined,
    current_item_id: raw.current_item_id ?? null,
    prompt_number: raw.prompt_number ?? undefined,

    total_attempts: raw.total_attempts ?? 0,
    correct_count: raw.correct_count ?? 0,
    wrong_count: raw.wrong_count ?? 0,

    last_index: raw.last_index ?? 0,
    total_items_planned: raw.total_items_planned ?? 0,

    status: raw.status ?? "active",
    started_at: raw.started_at,
    finished_at: raw.finished_at ?? null,
    last_activity_at: raw.last_activity_at ?? raw.started_at,
  };
}

function coerceIds(x: any): string[] {
  if (!x) return [];
  if (Array.isArray(x)) return x.map(String).filter(Boolean);
  return [];
}

function looksLikeState(x: any): boolean {
  // new state shape: { session, all_item_ids, current_index }
  if (!x || typeof x !== "object") return false;
  if (!x.session) return false;

  // tolerate either key while migrating
  return Array.isArray(x.all_item_ids) || Array.isArray(x.plan_item_ids);
}


export const useVocabWorkoutStore = defineStore("vocabWorkout", () => {
  const progress = ref<VWProgress[]>([]);
  const activeSessions = ref<VWSession[]>([]);
  const loadingMyWork = ref(false);
  const errorMyWork = ref<string | null>(null);

  const activeByList = computed(() => {
    const map = new Map<string, VWSession[]>();
    for (const s of activeSessions.value) {
      const key = `${s.list_key}::${s.mode}::${s.level ?? "null"}::${s.track_key ?? "default"}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return map;
  });

  async function fetchMyWork() {
    loadingMyWork.value = true;
    errorMyWork.value = null;
    try {
      const res = await api.get("/vocab-workout-sessions/my-work/");
      progress.value = res.data.progress ?? [];
      activeSessions.value = (res.data.active_sessions ?? []).map(normalizeSession);
    } catch (e: any) {
      console.error("fetchMyWork failed", e);
      errorMyWork.value = "Failed to load vocab progress";
    } finally {
      loadingMyWork.value = false;
    }
  }

 async function getSessionState(sessionId: number): Promise<VWQueueState> {
  const res = await api.get(`/vocab-workout-sessions/${sessionId}/`);
  return normalizeQueueState(res.data);
}

async function startNewSession(payload: {
  listKey: string;
  mode: VWMode;
  level: VWLevel;
  frontField: string;
  backField: string;
  quizCount?: number;
  allItemIds: string[];
  trackKey?: string | null;
}): Promise<VWQueueState> {
  const res = await api.post("/vocab-workout-sessions/", {
    list_key: payload.listKey,
    mode: payload.mode,
    level: payload.level,
    front_field: payload.frontField,
    back_field: payload.backField,
    quiz_count: payload.quizCount ?? null,
    track_key: payload.trackKey ?? null,     // ✅ snake_case
    all_item_ids: payload.allItemIds ?? [],  // ✅ new
  });

  const state = normalizeQueueState(res.data);

  activeSessions.value = [
    state.session,
    ...activeSessions.value.filter((s) => s.session_id !== state.session.session_id),
  ];

  return state;
}

async function continueSession(sessionId: number): Promise<VWQueueState> {
  const state = await getSessionState(sessionId);

  activeSessions.value = [
    state.session,
    ...activeSessions.value.filter((s) => s.session_id !== state.session.session_id),
  ];

  return state;
}


  /**
   * Server-driven: ask backend for next item (id + done flag).
   * Backend decides based on queue/unmastered.
   */
  async function nextItem(sessionId: number): Promise<VWQueueState> {
    const res = await api.post(`/vocab-workout-sessions/${sessionId}/next/`);
    return normalizeQueueState(res.data);
  }

  async function appendAttempts(
    sessionId: number,
    attempts: VWAttempt[],
    meta?: { last_index?: number; total_items_planned?: number }
  ) {
    if (!attempts.length && !meta) return null;

    const res = await api.post(`/vocab-workout-sessions/${sessionId}/attempts/`, {
      attempts,
      ...(meta ?? {}),
    });

    const raw = res.data.session ?? res.data;
    const updated = normalizeSession(raw);

    const idx = activeSessions.value.findIndex((s) => s.session_id === sessionId);
    if (idx >= 0) activeSessions.value[idx] = updated;

    return updated;
  }

  async function finishSession(sessionId: number) {
    const res = await api.patch(`/vocab-workout-sessions/${sessionId}/finish/`);
    const raw = res.data.session ?? res.data;
    const finished = normalizeSession(raw);

    activeSessions.value = activeSessions.value.filter((s) => s.session_id !== sessionId);
    return finished;
  }

  // vocabWorkout.ts
  async function fetchSessionAttempts(sessionId: number) {
    const { data } = await api.get(`/vocab-workout-sessions/${sessionId}/attempts/`);
    return data; // { attempts: [...], correct_count, wrong_count, ... }
  }


  return {
    progress,
    activeSessions,
    activeByList,
    loadingMyWork,
    errorMyWork,
    fetchMyWork,
    startNewSession,
    continueSession,
    appendAttempts,
    nextItem,
    finishSession,
    fetchSessionAttempts
  };
});
