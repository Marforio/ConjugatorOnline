<template>
  <div>
    <slot name="activator" :open="openDialog" />

    <v-dialog v-model="isOpen" max-width="650" scrollable :persistent="isLoading">
      <v-card rounded="xl" class="text-slate-800 bg-white border">
        
        <v-card-title class="pa-4 d-flex align-center justify-space-between border-b bg-slate-50">
          <div class="d-flex align-center">
            <v-avatar color="blue-lighten-5" size="36" class="mr-3">
              <v-icon color="primary" size="20">mdi-robot-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-black line-height-tight">{{ title }}</div>
              <div class="text-caption text-slate-500">Translations</div>
            </div>
          </div>
          
          <div class="d-flex ga-2">
            <v-btn size="small" variant="tonal" color="slate-600" class="rounded-lg text-none font-weight-bold" @click="reload" :disabled="isLoading">
              Refresh
            </v-btn>
            <v-btn size="small" :variant="isLoading ? 'tonal' : 'text'" :color="isLoading ? 'error' : 'slate-500'" class="text-none font-weight-bold" @click="closeDialog">
              {{ isLoading ? 'Cancel' : 'Close' }}
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text class="pa-4">
          <div class="mb-5 bg-slate-50 rounded-xl border pa-4">
            
            <div class="text-subtitle-1 font-weight-bold text-slate-900 d-flex align-center flex-wrap mb-4" style="gap: 8px;">
              The verb <span class="text-primary text-uppercase font-weight-black decoration-underline">{{ ctx.verb }}</span> means:
              <div class="d-inline-flex ga-1 ml-auto">
                <v-chip size="small" color="blue-lighten-1" variant="flat" class="font-weight-bold text-white">FR: {{ verbTranslations.fr || "—" }}</v-chip>
                <v-chip size="small" color="green-lighten-1" variant="flat" class="font-weight-bold text-white">DE: {{ verbTranslations.de || "—" }}</v-chip>
                <v-chip size="small" color="deep-orange-lighten-1" variant="flat" class="font-weight-bold text-white">IT: {{ verbTranslations.it || "—" }}</v-chip>
              </div>
            </div>

            <v-divider class="mb-4 border-opacity-40"></v-divider>

            <v-row no-gutters class="bg-white border rounded-xl pa-2 text-center shadow-sm">
              <v-col cols="6" class="border-r border-b pb-2 mb-2">
                <div class="text-caption font-weight-medium text-slate-400">Verb Anchor</div>
                <div class="text-body-2 font-weight-black text-slate-800">{{ ctx.verb }}</div>
              </v-col>
              <v-col cols="6" class="border-b pb-2 mb-2">
                <div class="text-caption font-weight-medium text-slate-400">Target Subject</div>
                <div class="text-body-2 font-weight-bold text-slate-700">{{ ctx.person }}</div>
              </v-col>
              <v-col cols="6" class="border-r pt-1">
                <div class="text-caption font-weight-medium text-slate-400">Sentence Type</div>
                <div class="text-body-2 font-weight-bold text-slate-700">{{ ctx.sentence_type }}</div>
              </v-col>
              <v-col cols="6" class="pt-1 px-1 text-truncate">
                <div class="text-caption font-weight-medium text-slate-400">
                  {{ ctx.showing_keyword_mode ? 'Time Reference' : 'Target Tense' }}
                </div>
                <div class="text-body-2 font-weight-bold text-slate-700 text-truncate" :title="ctx.displayed_keyword || ctx.tense">
                  {{ ctx.displayed_keyword || ctx.tense }}
                </div>
              </v-col>
            </v-row>
            
          </div>

          <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="mb-4 rounded-xl">
            {{ errorMessage }}
          </v-alert>

          <div v-if="isLoading" class="d-flex flex-column align-center justify-center py-10 ga-3">
            <v-progress-circular indeterminate color="primary" size="36" />
            <v-btn size="x-small" color="error" variant="text" class="font-weight-bold" @click="abortCurrentRequest">
              Stop Translation Request
            </v-btn>
          </div>

          <div v-else class="ga-3 d-flex flex-column">
            <v-card variant="flat" class="bg-slate-50 border rounded-xl pa-4">
              <div class="text-overline font-weight-black text-blue-darken-2 mb-1 tracking-widest">French Target</div>
              <div class="text-body-1 font-weight-medium text-slate-800" style="white-space: pre-wrap;">
                {{ translations.fr || "—" }}
              </div>
            </v-card>

            <v-card variant="flat" class="bg-slate-50 border rounded-xl pa-4">
              <div class="text-overline font-weight-black text-green-darken-2 mb-1 tracking-widest">German Target</div>
              <div class="text-body-1 font-weight-medium text-slate-800" style="white-space: pre-wrap;">
                {{ translations.de || "—" }}
              </div>
            </v-card>

            <v-card variant="flat" class="bg-slate-50 border rounded-xl pa-4">
              <div class="text-overline font-weight-black text-deep-orange-darken-2 mb-1 tracking-widest">Italian Target</div>
              <div class="text-body-1 font-weight-medium text-slate-800" style="white-space: pre-wrap;">
                {{ translations.it || "—" }}
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 bg-slate-50 d-flex justify-end">
          <v-btn color="primary" variant="flat" height="40" class="px-6 rounded-xl font-weight-bold text-none" @click="closeDialog" :disabled="isLoading">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch, onBeforeUnmount } from "vue";
import api from "@/axios";

type HintCtx = {
  verb?: string;
  person?: string;
  tense?: string;
  sentence_type?: string;
  sentenceType?: string;
  displayed_keyword?: string;
  showing_keyword_mode?: boolean;
  acceptable_answers?: string[];
  acceptableAnswers?: string[];
  [k: string]: any;
};

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "Translation hint" },
  apiUrl: { type: String, default: "/llm/chat/" },
  model: { type: String, default: "google/gemma-4-31B-turbo-TEE" },
  temperature: { type: Number, default: 0.2 },
  maxTokens: { type: Number, default: 300 },
  context: { type: Object as () => HintCtx, default: () => ({}) },
  autoRunOnOpen: { type: Boolean, default: true },
});

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

const isLoading = ref(false);
const errorMessage = ref("");

// Reference tracker for the current network connection
const currentAbortController = ref<AbortController | null>(null);

const translations = reactive<{ fr: string; de: string; it: string }>({
  fr: "",
  de: "",
  it: "",
});

const ctx = computed(() => {
  const c = props.context || {};
  return {
    verb: c.verb ?? "",
    person: c.person ?? "",
    tense: c.tense ?? "",
    sentence_type: c.sentence_type ?? c.sentenceType ?? "",
    displayed_keyword: c.displayed_keyword ?? "",
    showing_keyword_mode: c.showing_keyword_mode ?? false,
    acceptable_answers: (c.acceptable_answers ?? c.acceptableAnswers ?? []) as string[],
  };
});

const verbTranslations = reactive<{ fr: string; de: string; it: string }>({ fr: "", de: "", it: "" });
const correctAnswer = computed(() => {
  const list = ctx.value.acceptable_answers || [];
  return list.length ? list[0] : "";
});

watch(
  () => isOpen.value,
  async (open) => {
    if (!open) {
      abortCurrentRequest();
      return;
    }
    if (props.autoRunOnOpen) await reload();
    await nextTick();
  }
);

function openDialog() { isOpen.value = true; }

function closeDialog() { 
  if (isLoading.value) {
    abortCurrentRequest();
  }
  isOpen.value = false; 
}

function abortCurrentRequest() {
  if (currentAbortController.value) {
    currentAbortController.value.abort();
    currentAbortController.value = null;
  }
}

function resetOutput() {
  verbTranslations.fr = ""; verbTranslations.de = ""; verbTranslations.it = "";
  translations.fr = ""; translations.de = ""; translations.it = "";
  errorMessage.value = "";
}

function buildPrompt(): string {
  const dynamicTimeContext = ctx.value.showing_keyword_mode && ctx.value.displayed_keyword
    ? `The student is seeing the time reference keyword "${ctx.value.displayed_keyword}" instead of a generic tense name.`
    : `The student is looking directly at the tense name "${ctx.value.tense}".`;

  return [
    "You are a translation helper for a language learning conjugation game.",
    "",
    "Task:",
    "1) Translate the base meaning of the English verb into French, German, and Italian (dictionary-style; short).",
    "2) Translate the MEANING of the correct answer into French, German, and Italian (natural full translation).",
    "",
    "CRITICAL TRANSLATION RULE:",
    `${ctx.value.showing_keyword_mode && ctx.value.displayed_keyword 
      ? `- You MUST explicitly include the meaning of the active time reference keyword "${ctx.value.displayed_keyword}" as part of the full answer translation for French, German, and Italian while placing it in parentheses. For example, if the keyword is "yesterday", make sure words like "hier", "gestern", or "ieri" are naturally integrated into the sentence in parentheses: "(hier)", "(gestern)", "(ieri)".` 
      : "- Translate the full conjugated phrase naturally into the target languages."
    }`,
    "",
    "Hard constraints:",
    "- Output ONLY valid minified JSON. No markdown backticks (```). No conversational extra text.",
    '- Exactly this shape: {"verb":{"fr":"...","de":"...","it":"..."},"answer":{"fr":"...","de":"...","it":"..."}}',
    "- Keep strings concise and natural.",
    "- If a translation has multiple good options, pick the most common one.",
    "",
    `Context: ${dynamicTimeContext}`,
    `Game prompt parameters: verb=${ctx.value.verb}, person=${ctx.value.person}, tense=${ctx.value.tense}, sentence_type=${ctx.value.sentence_type}`,
    `English verb: ${ctx.value.verb || "(missing)"}`,
    `Correct answer (English phrase): ${correctAnswer.value || "(missing)"}`,
  ].join("\n");
}

async function reload() {
  resetOutput();

  if (!correctAnswer.value) {
    errorMessage.value = "No acceptable answers were provided, so I can’t generate a translation hint.";
    return;
  }

  isLoading.value = true;
  currentAbortController.value = new AbortController();

  try {
    const userPrompt = buildPrompt();
    const payload = {
      model: props.model,
      messages: [{ role: "user", content: userPrompt }],
      max_tokens: props.maxTokens,
      temperature: props.temperature,
      stream: false,
    };

    const res = await api.post(props.apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
      signal: currentAbortController.value.signal
    });

    const out: string = res.data?.content ?? "";
    if (!out) throw new Error("LLM returned no content.");

    let parsed: any = null;
    try {
      parsed = JSON.parse(String(out ?? "").trim());
    } catch {
      throw new Error(`LLM did not return valid JSON. Raw output: ${out}`);
    }

    verbTranslations.fr = String(parsed?.verb?.fr ?? "");
    verbTranslations.de = String(parsed?.verb?.de ?? "");
    verbTranslations.it = String(parsed?.verb?.it ?? "");

    translations.fr = String(parsed?.answer?.fr ?? "");
    translations.de = String(parsed?.answer?.de ?? "");
    translations.it = String(parsed?.answer?.it ?? "");

    if (!verbTranslations.fr || !verbTranslations.de || !verbTranslations.it || !translations.fr || !translations.de || !translations.it) {
      throw new Error(`LLM JSON missing keys. Raw output: ${out}`);
    }
  } catch (e: any) {
    // Approach 1 Applied: Strict validation intercept against user cancellation exceptions
    if (e.code === 'ERR_CANCELED' || e.name === 'AbortError' || e.message === 'canceled') {
      errorMessage.value = "Translation hint generation stopped by user.";
    } else {
      const data = e?.response?.data;
      if (data) {
        errorMessage.value = `LLM error (${e?.response?.status}): ${typeof data === "string" ? data : JSON.stringify(data)}`;
      } else {
        errorMessage.value = e?.message || String(e);
      }
    }
  } finally {
    isLoading.value = false;
    currentAbortController.value = null;
  }
}

onBeforeUnmount(() => {
  abortCurrentRequest();
});
</script>

<style scoped>
.line-height-tight { line-height: 1.2; }
.decoration-underline { text-decoration: underline; text-underline-offset: 3px; }
.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-50 { background-color: #f8fafc !important; }
.blue-lighten-5 { background-color: rgba(59, 130, 246, 0.08) !important; }
</style>