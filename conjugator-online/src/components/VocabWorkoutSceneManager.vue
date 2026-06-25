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

import api from "@/axios";


interface NormalizedCustomItem {
  id: string;
  term: string;
  definition: string;
  part_of_speech?: string;
  context_usage?: string;
  image?: string;
  additional_data: Record<string, any>;
}

async function loadCustomListItems(listId: string): Promise<NormalizedCustomItem[]> {
  try {
    const response = await api.get<any[]>(`/vocab-lists/${listId}/prompts/`);
    const items = Array.isArray(response.data) ? response.data : [];
    
    return items.map((item) => ({
      id: String(item.id), // Ensure string format for structural matching
      term: item.term,
      definition: item.definition,
      part_of_speech: item.part_of_speech,
      context_usage: item.context_usage,
      image: item.image_url,
      additional_data: item.additional_data || {},
    }));
  } catch (err) {
    console.error(`Failed to load custom list ${listId}:`, err);
    throw err;
  }
}

function isHardcodedList(listId: string): boolean {
  return (
    listId.startsWith("irregular_verbs") || 
    listId.startsWith("general") || 
    !listId.includes("-")
  );
}

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

function buildPlanItemsFromIds(listKey: string, ids: string[], loadedRawData: any[]): any[] {
  if (!ids || !ids.length) return [];

  // Branch A: Custom multi-tenant lists fetched from backend DB
  if (!isHardcodedList(listKey)) {
    const customMap = new Map(loadedRawData.map((it) => [String(it.id), it]));
    return ids
      .map((rawId) => {
        if (!rawId) return null;
        
        // Extract raw database UUID if it is wrapped in composite structure
        const pureUuid = String(rawId).includes("::") ? String(rawId).split("::")[1] : String(rawId);
        const match = customMap.get(pureUuid);
        if (!match) return null;

        // CRITICAL: Proxy the item object to match the compound format synthesized by the game component
        return {
          ...match,
          id: `${listKey}::${pureUuid}`
        };
      })
      .filter(Boolean);
  }

  // Branch B: Legacy hardcoded client registry mapping
  const listMeta = (vocabLists as any)[listKey];
  if (!listMeta) throw new Error(`Unknown listKey "${listKey}"`);

  const normalized = normalizeVocabDatasetWithListKey(listKey, listMeta.data);
  const legacyMap = new Map(normalized.items.map((it: any) => [it.id, it]));

  return ids
    .map((rawId) => {
      if (!rawId) return null;
      const id = String(rawId);
      const normalizedId = id.includes("::") ? id : `${listKey}::${id}`;
      return legacyMap.get(normalizedId) || null;
    })
    .filter(Boolean);
}

function getAllItemIdsFromState(state: any): string[] {
  const ids =
    state?.all_item_ids ??
    state?.session?.all_item_ids ??
    state?.plan_item_ids ??
    state?.session?.plan_item_ids ??
    [];
  return Array.isArray(ids) ? ids : [];
}

function getNextItemIdFromState(state: any): string | null {
  const v = state?.next_item_id ?? state?.session?.current_item_id ?? null;
  return v != null ? String(v) : null;
}


async function handleStartGame(selections: any) {
  try {
    gameSettings.value = markRaw(selections);

    // ==========================================
    // RESUME ACTION SEQUENCE
    // ==========================================
    if (selections?.resumeSessionId) {
      const resumeSessionId = Number(selections.resumeSessionId);
      const state = await vw.continueSession(resumeSessionId);

      const listKey = state?.session?.list_key;
      if (!listKey) throw new Error("Continue session: missing state.session.list_key");

      let planItems_data: any[] = [];
      if (isHardcodedList(listKey)) {
        const listMeta = (vocabLists as any)[listKey];
        if (!listMeta) throw new Error(`Unknown hardcoded listKey "${listKey}"`);
        planItems_data = normalizeVocabDatasetWithListKey(listKey, listMeta.data).items;
      } else {
        planItems_data = await loadCustomListItems(listKey);
      }

      const allIds = getAllItemIdsFromState(state);
      const nextId = getNextItemIdFromState(state);
      const idsToUse = allIds.length ? allIds : nextId ? [nextId] : [];

      // ✅ Map components using the compound format adapter
      planItems.value = buildPlanItemsFromIds(listKey, idsToUse, planItems_data);

      gameSettings.value = markRaw({
        ...selections,
        listId: listKey,
        listKey,
        mode: state.session.mode,
        level: state.session.level,
        frontField: state.session.front_field,
        backField: state.session.back_field,
        sessionId: state.session.session_id,
        nextItemId: nextId,
        currentItemId: state.session.current_item_id ?? nextId ?? null,
        promptNumber: state.session.prompt_number ?? 0,
        trackKey: state.session.track_key ?? null,
      });

      changeScene("VocabWorkoutScene01_Game");
      return;
    }

    // ==========================================
    // INITIALIZATION ACTION SEQUENCE (START NEW)
    // ==========================================
    const listId = selections?.listId;
    if (!listId) {
      throw new Error(`Missing listId in startGame payload.`);
    }

    let listMeta: any = null;
    let isHardcoded = false;
    let planItems_data: any[] = [];

    if (isHardcodedList(listId)) {
      isHardcoded = true;
      listMeta = (vocabLists as any)[listId];
      if (!listMeta) throw new Error(`Unknown hardcoded listId "${listId}"`);
      planItems_data = normalizeVocabDatasetWithListKey(listId, listMeta.data).items;
    } else {
      planItems_data = await loadCustomListItems(listId);
      listMeta = { supportsLevels: false };
    }

    const mode: string = selections?.mode ?? "cards";
    const isPersistedMode = mode === "write" || mode === "quiz";

    if (isHardcoded && listMeta.supportsLevels) {
      const lvl = selections?.level;
      if (lvl !== "essential" && lvl !== "advanced") {
        throw new Error(`Irregular verbs requires level essential/advanced`);
      }
    }

    // ==========================================
    // 🌟 ARCADE INTERCEPT: ASTEROIDZ GAME MODE
    // ==========================================
    if (mode === "asteroidz") {
      // Build dataset pool matching structural level criteria
      const pool = buildPool(planItems_data, {
        level: isHardcoded && listMeta.supportsLevels ? selections.level : null,
      });

      // Normalize unique key formats identical to the non-persisted fallback paths
      if (!isHardcoded) {
        planItems.value = pool.map((it: any) => ({ ...it, id: `${listId}::${it.id}` }));
      } else {
        planItems.value = pool ?? [];
      }

      gameSettings.value = markRaw({ 
        ...selections, 
        listId, 
        listKey: listId,
        mode: "asteroidz"
      });
      
      changeScene("VocabWorkoutScene01_Game");
      return;
    }

    // ==========================================
    // PERSISTED MODE ACTION SEQUENCE (START NEW)
    // ==========================================
    if (isPersistedMode) {
      const pool = buildPool(planItems_data, {
        level: isHardcoded && listMeta.supportsLevels ? selections.level : null,
      });

      const all_item_ids = pool.map((it: any) => String(it.id));

      const state = await vw.startNewSession({
        listKey: listId,
        mode,
        level: isHardcoded && listMeta.supportsLevels ? selections.level : null,
        frontField: selections.frontField,
        backField: selections.backField,
        quizCount: mode === "quiz" ? selections.quizCount : undefined,
        trackKey: selections?.trackKey ?? null,
        allItemIds: all_item_ids,
      });

      if (!state?.session?.session_id) {
        throw new Error("Session created but no session_id in response");
      }

      const stateAllIds = getAllItemIdsFromState(state);
      const idsToUse = stateAllIds.length ? stateAllIds : all_item_ids;

      // ✅ Dynamically inject proxy formatting matching target layout expectations
      planItems.value = buildPlanItemsFromIds(listId, idsToUse, planItems_data);

      const nextId = getNextItemIdFromState(state);

      gameSettings.value = markRaw({
        ...selections,
        listId,
        listKey: listId,
        sessionId: state.session.session_id,
        nextItemId: nextId,
        currentItemId: state.session.current_item_id ?? nextId ?? null,
        promptNumber: state.session.prompt_number ?? 0,
        trackKey: state.session.track_key ?? selections?.trackKey ?? null,
      });

      changeScene("VocabWorkoutScene01_Game");
      return;
    }

    // ==========================================
    // STANDARD NON-PERSISTED PATH (Cards / Match)
    // ==========================================
    const pool = buildPool(planItems_data, {
      level: isHardcoded && listMeta.supportsLevels ? selections.level : null,
    });

    // Ensure non-persisted custom list tracking works with expected IDs as well
    if (!isHardcoded) {
      planItems.value = pool.map((it: any) => ({ ...it, id: `${listId}::${it.id}` }));
    } else {
      planItems.value = pool ?? [];
    }

    gameSettings.value = markRaw({ ...selections, listId, listKey: listId });
    changeScene("VocabWorkoutScene01_Game");

  } catch (e) {
    console.error("[VocabWorkout] Failed to start:", e);
    planItems.value = [];
    gameSettings.value = null;
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

defineExpose({ handleStartGame, changeScene });


</script>
