<template>
  <div>
    <slot name="activator" :open="openDialog" />

    <v-dialog v-model="isOpen" max-width="700">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="text-h6">{{ title }}</div>
          <div class="d-flex ga-2">
            <v-btn size="small" variant="text" @click="reload" :disabled="isLoading">
              Refresh
            </v-btn>
            <v-btn size="small" variant="text" @click="closeDialog" :disabled="isLoading">
              Close
            </v-btn>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-2">
          <div class="mb-4 text-body-2 text-grey-darken-1">
            <div class="text-subtitle-2">
              The verb <span class="font-weight-bold text-uppercase">{{ ctx.verb }}</span> means
              <v-chip size="small" color="blue-lighten-1" class="mx-3">{{ verbTranslations.fr || "—" }}</v-chip>
              <v-chip size="small" color="green-lighten-1" class="mx-3">{{ verbTranslations.de || "—" }}</v-chip>
              <v-chip size="small" color="deep-orange-lighten-1" class="mx-3">{{ verbTranslations.it || "—" }}</v-chip>
              .
            </div>
            <div class="my-3"><span class="font-weight-medium">The prompt is:</span> verb= {{ ctx.verb }}  |  person= {{ ctx.person }}  |  tense= {{ ctx.tense }}  |  sentence type= {{ ctx.sentence_type }}</div>
            <div class="mt-3"><span class="font-weight-bold">Your conjugation must match these translations:</span></div>
          </div>
          

          <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="mb-4">
            {{ errorMessage }}
          </v-alert>

          <div v-if="isLoading" class="d-flex align-center justify-center py-8">
            <v-progress-circular indeterminate color="primary" size="40" />
          </div>

          <div v-else>
            <v-card variant="outlined" class="mb-3">
              <v-card-title class="text-subtitle-1">French</v-card-title>
              <v-card-text class="text-body-1" style="white-space: pre-wrap;">
                {{ translations.fr || "—" }}
              </v-card-text>
            </v-card>

            <v-card variant="outlined" class="mb-3">
              <v-card-title class="text-subtitle-1">German</v-card-title>
              <v-card-text class="text-body-1" style="white-space: pre-wrap;">
                {{ translations.de || "—" }}
              </v-card-text>
            </v-card>

            <v-card variant="outlined">
              <v-card-title class="text-subtitle-1">Italian</v-card-title>
              <v-card-text class="text-body-1" style="white-space: pre-wrap;">
                {{ translations.it || "—" }}
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 d-flex justify-end">
          <v-btn color="primary" variant="flat" @click="closeDialog" :disabled="isLoading">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import api from "@/axios";

type HintCtx = {
  verb?: string;
  person?: string;
  tense?: string;
  sentence_type?: string;
  sentenceType?: string; // allow either key
  acceptable_answers?: string[];
  acceptableAnswers?: string[];
  [k: string]: any;
};

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "Translation hint" },

  apiUrl: { type: String, default: "/llm/chat/" },
  model: { type: String, default: "NousResearch/Hermes-4-14B" },
  temperature: { type: Number, default: 0.2 },
  maxTokens: { type: Number, default: 200 },

  // Provide the game prompt + acceptable answers
  context: { type: Object as () => HintCtx, default: () => ({}) },

  // Auto-run when opened
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
    acceptable_answers: (c.acceptable_answers ?? c.acceptableAnswers ?? []) as string[],
  };
});
const verbTranslations = reactive<{ fr: string; de: string; it: string }>({ fr: "", de: "", it: "" });
const correctAnswer = computed(() => {
  const list = ctx.value.acceptable_answers || [];
  // pick the first acceptable answer as canonical
  return list.length ? list[0] : "";
});

watch(
  () => isOpen.value,
  async (open) => {
    if (!open) return;
    if (props.autoRunOnOpen) await reload();
    await nextTick();
  }
);

function openDialog() {
  isOpen.value = true;
}
function closeDialog() {
  isOpen.value = false;
}

function resetOutput() {
  verbTranslations.fr = "";
  verbTranslations.de = "";
  verbTranslations.it = "";
  translations.fr = "";
  translations.de = "";
  translations.it = "";
  errorMessage.value = "";
}

function buildPrompt(): string {
  return [
    "You are a translation helper for a language learning conjugation game.",
    "",
    "Task:",
    "1) Translate the base meaning of the English verb into French, German, and Italian (dictionary-style; short).",
    "2) Translate the MEANING of the correct English answer into French, German, and Italian (natural full translation).",
    "",
    "Hard rules:",
    "- Output ONLY valid minified JSON. No markdown. No backticks. No extra text.",
    '- Exactly this shape: {"verb":{"fr":"...","de":"...","it":"..."},"answer":{"fr":"...","de":"...","it":"..."}}',
    "- Keep strings concise and natural.",
    "- If a translation has multiple good options, pick the most common one.",
    "",
    `Game prompt: verb=${ctx.value.verb}, person=${ctx.value.person}, tense=${ctx.value.tense}, sentence_type=${ctx.value.sentence_type}`,
    `English verb: ${ctx.value.verb || "(missing)"}`,
    `Correct answer (English): ${correctAnswer.value || "(missing)"}`,
  ].join("\n");
}

async function reload() {
  resetOutput();

  if (!correctAnswer.value) {
    errorMessage.value = "No acceptable answers were provided, so I can’t generate a translation hint.";
    return;
  }

  isLoading.value = true;

  try {
    const userPrompt = buildPrompt();

    const payload = {
      model: props.model,
      messages: [
        { role: "user", content: userPrompt },
      ],
      max_tokens: props.maxTokens,
      temperature: props.temperature,
      stream: false,
    };

    const res = await api.post(props.apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const out: string = res.data?.content ?? "";
    if (!out) throw new Error("LLM returned no content.");

let parsed: any = null;

try {
  parsed = JSON.parse(String(out ?? "").trim());
} catch {
  // Sometimes models add whitespace/newlines; still should parse if JSON. If not, show raw.
  throw new Error(`LLM did not return valid JSON. Raw output: ${out}`);
}

// NEW SHAPE:
// {
//   verb:   { fr, de, it },
//   answer: { fr, de, it }
// }

// verb translations (dictionary-style)
verbTranslations.fr = String(parsed?.verb?.fr ?? "");
verbTranslations.de = String(parsed?.verb?.de ?? "");
verbTranslations.it = String(parsed?.verb?.it ?? "");

// full answer meaning translations
translations.fr = String(parsed?.answer?.fr ?? "");
translations.de = String(parsed?.answer?.de ?? "");
translations.it = String(parsed?.answer?.it ?? "");

// validate
if (
  !verbTranslations.fr ||
  !verbTranslations.de ||
  !verbTranslations.it ||
  !translations.fr ||
  !translations.de ||
  !translations.it
) {
  throw new Error(`LLM JSON missing keys. Raw output: ${out}`);
}
  } catch (e: any) {
    const data = e?.response?.data;
    if (data) {
      errorMessage.value = `LLM error (${e?.response?.status}): ${
        typeof data === "string" ? data : JSON.stringify(data)
      }`;
    } else {
      errorMessage.value = e?.message || String(e);
    }
  } finally {
    isLoading.value = false;
  }
}
</script>