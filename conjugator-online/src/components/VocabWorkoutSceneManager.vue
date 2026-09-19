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
      id: String(item.id),
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

function resolveListName(
  listId: string,
  selections?: any,
  state?: any,
  listMeta?: any
): string | null {
  const fromSelections = String(selections?.listName ?? "").trim();
  if (fromSelections) return fromSelections;

  const fromState = String(state?.session?.list_name ?? "").trim();
  if (fromState) return fromState;

  const fromMeta = String(listMeta?.title ?? "").trim();
  if (fromMeta) return fromMeta;

  const fromRegistry = String((vocabLists as any)?.[listId]?.title ?? "").trim();
  if (fromRegistry) return fromRegistry;

  return null;
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

function buildPlanItemsFromIds(listKey: string, ids: string[], loadedRawData: any[]): any[] {
  if (!ids || !ids.length) return [];

  if (!isHardcodedList(listKey)) {
    const customMap = new Map(loadedRawData.map((it) => [String(it.id), it]));
    return ids
      .map((rawId) => {
        if (!rawId) return null;
        const pureUuid = String(rawId).includes("::") ? String(rawId).split("::")[1] : String(rawId);
        const match = customMap.get(pureUuid);
        if (!match) return null;
        return {
          ...match,
          id: `${listKey}::${pureUuid}`,
        };
      })
      .filter(Boolean);
  }

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
    const normalizedSelections = {
      ...selections,
      listId: selections?.listId ?? selections?.listKey,
      listKey: selections?.listKey ?? selections?.listId,
    };
    gameSettings.value = markRaw(normalizedSelections);

    // RESUME FLOW
    if (normalizedSelections?.resumeSessionId) {
      const resumeSessionId = Number(normalizedSelections.resumeSessionId);
      const state = await vw.continueSession(resumeSessionId);

      const listKey = state?.session?.list_key;
      if (!listKey) throw new Error("Continue session: missing state.session.list_key");

      let planItemsData: any[] = [];
      let listMeta: any = null;

      if (isHardcodedList(listKey)) {
        listMeta = (vocabLists as any)[listKey];
        if (!listMeta) throw new Error(`Unknown hardcoded listKey "${listKey}"`);
        planItemsData = normalizeVocabDatasetWithListKey(listKey, listMeta.data).items;
      } else {
        planItemsData = await loadCustomListItems(listKey);
      }

      const allIds = getAllItemIdsFromState(state);
      const nextId = getNextItemIdFromState(state);
      const idsToUse = allIds.length ? allIds : nextId ? [nextId] : [];

      planItems.value = buildPlanItemsFromIds(listKey, idsToUse, planItemsData);

      gameSettings.value = markRaw({
        ...normalizedSelections,
        listId: listKey,
        listKey,
        listName: resolveListName(listKey, normalizedSelections, state, listMeta),
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

    // NEW START FLOW
    const listId = normalizedSelections?.listId ?? normalizedSelections?.listKey;
    if (!listId) {
      throw new Error("Missing listId/listKey in startGame payload.");
    }

    let listMeta: any = null;
    let isHardcoded = false;
    let planItemsData: any[] = [];

    if (isHardcodedList(listId)) {
      isHardcoded = true;
      listMeta = (vocabLists as any)[listId];
      if (!listMeta) throw new Error(`Unknown hardcoded listId "${listId}"`);
      planItemsData = normalizeVocabDatasetWithListKey(listId, listMeta.data).items;
    } else {
      planItemsData = await loadCustomListItems(listId);
      listMeta = { supportsLevels: false };
    }

    const mode: string = normalizedSelections?.mode ?? "write";
    const isPersistedMode = mode === "write" || mode === "quiz";
    const resolvedListName = resolveListName(listId, normalizedSelections, null, listMeta);

    if (isHardcoded && listMeta.supportsLevels) {
      const lvl = normalizedSelections?.level;
      if (lvl !== "essential" && lvl !== "advanced") {
        throw new Error("Irregular verbs requires level essential/advanced");
      }
    }

    // ASTEROIDZ
    if (mode === "asteroidz") {
      const pool = buildPool(planItemsData, {
        level: isHardcoded && listMeta.supportsLevels ? normalizedSelections.level : null,
      });

      planItems.value = !isHardcoded
        ? pool.map((it: any) => ({ ...it, id: `${listId}::${it.id}` }))
        : pool ?? [];

      gameSettings.value = markRaw({
        ...normalizedSelections,
        listId,
        listKey: listId,
        listName: resolvedListName,
        mode: "asteroidz",
      });

      changeScene("VocabWorkoutScene01_Game");
      return;
    }

    // PERSISTED MODES (WRITE / QUIZ)
    if (isPersistedMode) {
      const pool = buildPool(planItemsData, {
        level: isHardcoded && listMeta.supportsLevels ? normalizedSelections.level : null,
      });

      const all_item_ids = pool.map((it: any) => String(it.id));

      const state = await vw.startNewSession({
        listKey: listId,
        mode,
        level: isHardcoded && listMeta.supportsLevels ? normalizedSelections.level : null,
        frontField: normalizedSelections.frontField,
        backField: normalizedSelections.backField,
        quizCount: mode === "quiz" ? normalizedSelections.quizCount : undefined,
        trackKey: normalizedSelections?.trackKey ?? null,
        allItemIds: all_item_ids,
      });

      if (!state?.session?.session_id) {
        throw new Error("Session created but no session_id in response");
      }

      const stateAllIds = getAllItemIdsFromState(state);
      const idsToUse = stateAllIds.length ? stateAllIds : all_item_ids;

      planItems.value = buildPlanItemsFromIds(listId, idsToUse, planItemsData);

      const nextId = getNextItemIdFromState(state);

      gameSettings.value = markRaw({
        ...normalizedSelections,
        listId,
        listKey: listId,
        listName: resolveListName(listId, normalizedSelections, state, listMeta) ?? resolvedListName,
        sessionId: state.session.session_id,
        nextItemId: nextId,
        currentItemId: state.session.current_item_id ?? nextId ?? null,
        promptNumber: state.session.prompt_number ?? 0,
        trackKey: state.session.track_key ?? normalizedSelections?.trackKey ?? null,
      });

      changeScene("VocabWorkoutScene01_Game");
      return;
    }

    // NON-PERSISTED (CARDS / MATCH)
    const pool = buildPool(planItemsData, {
      level: isHardcoded && listMeta.supportsLevels ? normalizedSelections.level : null,
    });

    planItems.value = !isHardcoded
      ? pool.map((it: any) => ({ ...it, id: `${listId}::${it.id}` }))
      : pool ?? [];

    gameSettings.value = markRaw({
      ...normalizedSelections,
      listId,
      listKey: listId,
      listName: resolvedListName,
    });

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

  try {
    await vw.fetchMyWork();
  } catch (e) {
    console.warn("[VocabWorkout] fetchMyWork after gameOver failed", e);
  }

  changeScene("VocabWorkoutScene02_Results");
}

defineExpose({ handleStartGame, changeScene });
</script>