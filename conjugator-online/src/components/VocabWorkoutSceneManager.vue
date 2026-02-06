<!-- src/components/vocab_workout/VocabWorkoutSceneManager.vue -->
<template>
  <component
    :is="currentSceneComponent"
    @startGame="handleStartGame"
    @gameOver="handleGameOver"
    @changeScene="changeScene"
    :gameSettings="gameSettings"
    :planItems="planItems"
    :results="results"
    :availableLists="availableLists"
  />
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from "vue";

import VocabWorkoutScene00_Settings from "./vocab_workout_scenes/VocabWorkoutScene00_Settings.vue";
import VocabWorkoutScene01_Game from "./vocab_workout_scenes/VocabWorkoutScene01_Game.vue";
import VocabWorkoutScene02_Results from "./vocab_workout_scenes/VocabWorkoutScene02_Results.vue";

import { vocabLists } from "@/assets/scripts/vocab_workout/VocabListRegistry";
import { normalizeVocabDatasetWithListKey } from "@/assets/scripts/vocab_workout/VocabWorkoutPromptEngine";
import { buildPool } from "@/assets/scripts/vocab_workout/VocabWorkoutPoolBuilder";

import { useVocabWorkoutStore } from "@/stores/vocabWorkout";

const vw = useVocabWorkoutStore();

const scenes = {
  VocabWorkoutScene00_Settings,
  VocabWorkoutScene01_Game,
  VocabWorkoutScene02_Results,
};

type SceneName = keyof typeof scenes;

const currentScene = ref<SceneName>("VocabWorkoutScene00_Settings");
const currentSceneComponent = computed(() => scenes[currentScene.value]);

const gameSettings = ref<any>(null);
const planItems = ref<any[]>([]);
const results = ref<any>(null);

function changeScene(sceneName: SceneName) {
  if (scenes[sceneName]) currentScene.value = sceneName;
}

/**
 * Dropdown data from registry:
 * { "Architecture": [{title,value,supportsLevels}, ...], ... }
 */
const availableLists = computed(() => {
  const out: Record<string, { title: string; value: string; supportsLevels: boolean }[]> = {};

  Object.entries(vocabLists).forEach(([key, meta]) => {
    const moduleName = meta.module || "General vocab";
    if (!out[moduleName]) out[moduleName] = [];
    out[moduleName].push({
      title: meta.title,
      value: key,
      supportsLevels: !!meta.supportsLevels,
    });
  });

  Object.keys(out).forEach((k) => out[k].sort((a, b) => a.title.localeCompare(b.title)));
  return out;
});

/**
 * Build planItems from a list of ids using normalized dataset lookup.
 * Supports both "listKey::term" ids and plain "term" ids.
 */
function buildPlanItemsFromIds(listKey: string, ids: string[]) {
  const listMeta = (vocabLists as any)[listKey];
  if (!listMeta) throw new Error(`Unknown listKey "${listKey}"`);

  const normalized = normalizeVocabDatasetWithListKey(listKey, listMeta.data);
  const map = new Map(normalized.items.map((it: any) => [it.id, it]));

  return (ids || [])
    .map((rawId) => {
      if (!rawId) return null;

      const id = String(rawId);
      const normalizedId = id.includes("::") ? id : `${listKey}::${id}`;
      return map.get(normalizedId) || null;
    })
    .filter(Boolean);
}

/**
 * Extract all_item_ids from state in a tolerant way (new API + fallbacks).
 * New server-driven session stores ids in session.all_item_ids.
 * Legacy fallbacks are kept so old sessions don't brick your UI.
 */
function getAllItemIdsFromState(state: any): string[] {
  const ids =
    state?.all_item_ids ??
    state?.session?.all_item_ids ??
    state?.plan_item_ids ??
    state?.session?.plan_item_ids ??
    [];

  return Array.isArray(ids) ? ids : [];
}

/**
 * Extract next_item_id in a tolerant way.
 * New API returns it at top-level: { session, next_item_id, done }
 * But some implementations also mirror it onto session.current_item_id.
 */
function getNextItemIdFromState(state: any): string | null {
  const v = state?.next_item_id ?? state?.session?.current_item_id ?? null;
  return v != null ? String(v) : null;
}


async function handleStartGame(selections: any) {
  try {
    gameSettings.value = markRaw(selections);

    // ----------------------------------------------------
    // 1) RESUME PATH FIRST (listKey comes from backend)
    // ----------------------------------------------------
    if (selections?.resumeSessionId) {
      const resumeSessionId = Number(selections.resumeSessionId);
      if (!Number.isFinite(resumeSessionId)) {
        throw new Error(`Invalid resumeSessionId "${selections.resumeSessionId}"`);
      }

      const state = await vw.continueSession(resumeSessionId);

      const listKey = state?.session?.list_key;
      if (!listKey) throw new Error("Continue session: missing state.session.list_key");

      const listMeta = (vocabLists as any)[listKey];
      if (!listMeta) throw new Error(`Unknown listKey "${listKey}"`);

      // ✅ Build local lookup table from ALL eligible ids (not just next)
      const allIds = getAllItemIdsFromState(state);

      // If server didn’t return them (should), fall back to "just next"
      const nextId = getNextItemIdFromState(state);
      const idsToUse = allIds.length ? allIds : nextId ? [nextId] : [];

      planItems.value = buildPlanItemsFromIds(listKey, idsToUse);

      gameSettings.value = markRaw({
        ...selections,

        listKey,
        mode: state.session.mode,
        level: state.session.level,
        frontField: state.session.front_field,
        backField: state.session.back_field,
        quizCount: state.session.quiz_count ?? undefined,
        domain: state.session.domain ?? null,

        sessionId: state.session.session_id,

        // server-driven queue info
        done: Boolean((state as any).done),
        nextItemId: nextId,
        currentItemId: (state.session as any).current_item_id ?? nextId ?? null,
        promptNumber: (state.session as any).prompt_number ?? 0,

        // ✅ snake_case on backend, camelCase in gameSettings is fine
        trackKey: (state.session as any).track_key ?? null,
      });

      changeScene("VocabWorkoutScene01_Game");
      return;
    }

    // ----------------------------------------------------
    // 2) START-NEW PATH: require listKey
    // ----------------------------------------------------
    const listKey = selections?.listKey;
    if (!listKey) {
      throw new Error(
        `Missing listKey in startGame payload. Received keys: ${Object.keys(selections ?? {}).join(", ")}`
      );
    }

    const listMeta = (vocabLists as any)[listKey];
    if (!listMeta) throw new Error(`Unknown listKey "${listKey}"`);

    const mode: string = selections?.mode ?? "cards";
    const isPersistedMode = mode === "write" || mode === "quiz";

    // enforce irregular verbs: no "all"
    if (listMeta.supportsLevels) {
      const lvl = selections?.level;
      if (lvl !== "essential" && lvl !== "advanced") {
        throw new Error(`Irregular verbs requires level essential/advanced (received "${lvl}")`);
      }
    }

    // ----------------------------------------------------
    // 3) PERSISTED MODES → create session on API
    //    ✅ send all_item_ids (NOT plan_item_ids)
    //    ✅ send track_key (snake_case) when available
    // ----------------------------------------------------
    if (isPersistedMode) {
      // Build local normalized -> pool to determine eligible items (level filtering)
      const normalized = normalizeVocabDatasetWithListKey(listKey, listMeta.data);

      const pool = buildPool(normalized.items, {
        level: listMeta.supportsLevels ? selections.level : null,
      });

      // ✅ all items eligible for this session/track
      const all_item_ids = pool.map((it: any) => it.id);

      const state = await vw.startNewSession({
        listKey,
        mode,
        level: listMeta.supportsLevels ? selections.level : null,
        frontField: selections.frontField,
        backField: selections.backField,
        quizCount: mode === "quiz" ? selections.quizCount : undefined,

        // ✅ NEW: backend expects snake_case track_key; store wrapper maps it
        trackKey: selections?.trackKey ?? null,

        // ✅ NEW: backend expects all_item_ids
        allItemIds: all_item_ids,
      });

      if (!state?.session || !state?.session?.session_id) {
        throw new Error("Session created but response did not include session.session_id");
      }

      // prefer server-normalized ids; fallback to local
      const stateAllIds = getAllItemIdsFromState(state);
      const idsToUse = stateAllIds.length ? stateAllIds : all_item_ids;

      planItems.value = buildPlanItemsFromIds(listKey, idsToUse);

      const nextId = getNextItemIdFromState(state);

      gameSettings.value = markRaw({
        ...selections,

        listKey,
        domain: state.session.domain ?? selections?.domain ?? null,
        sessionId: state.session.session_id,

        done: Boolean((state as any).done),
        nextItemId: nextId,
        currentItemId: (state.session as any).current_item_id ?? nextId ?? null,
        promptNumber: (state.session as any).prompt_number ?? 0,

        // carry forward for game scene logic
        trackKey: (state.session as any).track_key ?? selections?.trackKey ?? null,
      });

      changeScene("VocabWorkoutScene01_Game");
      return;
    }

    // ----------------------------------------------------
    // 4) NON-PERSISTED MODES → local pool only
    // ----------------------------------------------------
    const normalized = normalizeVocabDatasetWithListKey(listKey, listMeta.data);

    const pool = buildPool(normalized.items, {
      level: listMeta.supportsLevels ? selections.level : null,
    });

    planItems.value = pool ?? [];
    changeScene("VocabWorkoutScene01_Game");
  } catch (e) {
    console.error("[VocabWorkout] Failed to start:", e);
    console.log("Start failed response:", (e as any)?.response?.data);
    planItems.value = [];
    changeScene("VocabWorkoutScene01_Game");
  }
}

async function handleGameOver(payload: any) {
  results.value = payload;

  // ✅ refresh progress so Settings page shows completed
  try {
    await vw.fetchMyWork();
  } catch (e) {
    console.warn("[VocabWorkout] fetchMyWork after gameOver failed", e);
  }

  changeScene("VocabWorkoutScene02_Results");
}

</script>
