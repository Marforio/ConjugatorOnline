<template>
  <v-dialog
    v-model="internalOpen"
    fullscreen
    transition="dialog-bottom-transition"
    :scrim="true"
    persistent
  >
    <v-card class="d-flex flex-column h-100 bg-slate-50">
      <!-- TOP NAV BAR -->
      <div class="presentation-topbar border-b bg-white px-3 px-sm-5 py-2 d-flex align-center ga-2">
        <v-btn
          icon="mdi-close"
          variant="text"
          color="slate-600"
          @click="close"
          :aria-label="closeLabel"
        />

        <div class="min-w-0 flex-grow-1">
          <div class="text-caption text-slate-400 font-weight-bold text-uppercase tracking-wider">
            {{ listName || "Vocabulary Presentation" }}
          </div>
          <div class="text-body-2 text-slate-700 font-weight-bold text-truncate">
            {{ positionLabel }}
          </div>
        </div>

        <div class="d-flex align-center ga-1">
          <v-btn
            icon="mdi-chevron-left"
            variant="tonal"
            color="primary"
            :disabled="!hasPrev"
            @click="goPrev"
            aria-label="Previous slide"
          />
          <v-btn
            icon="mdi-chevron-right"
            variant="tonal"
            color="primary"
            :disabled="!hasNext"
            @click="goNext"
            aria-label="Next slide"
          />
        </div>
      </div>

      <!-- SLIDER BAR -->
      <div class="px-3 px-sm-5 py-2 bg-white border-b">
        <v-slider
          v-model="seekIndex"
          :min="0"
          :max="maxIndex"
          step="1"
          hide-details
          color="primary"
          track-color="slate-200"
          @end="commitSeek"
        />
      </div>

      <!-- CONTENT -->
      <div class="flex-grow-1 overflow-auto pa-2 pa-sm-6">
        <v-container class="max-width-slide pa-0" fluid>
          <v-card class="rounded-xl border bg-white pa-4 pa-sm-6" flat>
            <template v-if="current">
              <!-- Header block -->
              <div class="d-flex flex-column flex-md-row ga-4 ga-md-6">
                <div class="flex-grow-1 min-w-0">
                  <div class="text-overline text-slate-400 font-weight-bold mb-1">Term</div>
                  <div class="text-h4 text-slate-900 font-weight-black leading-tight break-word">
                    {{ slide.term || "—" }}
                  </div>

                  <div class="mt-4">
                    <div class="text-overline text-slate-400 font-weight-bold mb-1">Definition</div>
                    <div class="text-body-1 text-slate-800 break-word">
                      {{ slide.definition || "—" }}
                    </div>
                  </div>
                </div>

                <div class="image-wrap">
                  <v-img
                    v-if="slide.image"
                    :src="slide.image"
                    cover
                    class="rounded-xl border"
                    height="200"
                    width="200"
                  />
                  <div
                    v-else
                    class="rounded-xl border d-flex align-center justify-center text-caption text-slate-400 bg-slate-50"
                    style="height: 200px; width: 200px;"
                  >
                    No image
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <!-- Translations -->
                <div class="d-flex flex-wrap ga-8 align-start">
                <!-- Translations -->
                <div class="flex-1-1-0">
                    <div class="text-overline text-slate-400 font-weight-bold mb-2">
                    Translations
                    </div>
                    <div class="d-flex flex-wrap ga-2">
                    <v-chip
                        v-if="slide.french"
                        color="blue-lighten-2"
                        class="font-weight-bold"
                    >
                        FR: {{ slide.french }}
                    </v-chip>
                    <v-chip
                        v-if="slide.german"
                        color="green-lighten-2"
                        class="font-weight-bold"
                    >
                        DE: {{ slide.german }}
                    </v-chip>
                    <v-chip
                        v-if="slide.italian"
                        color="red-lighten-2"
                        class="font-weight-bold"
                    >
                        IT: {{ slide.italian }}
                    </v-chip>
                    <span
                        v-if="!slide.french && !slide.german && !slide.italian"
                        class="text-body-2 text-slate-500"
                    >
                        No translations provided.
                    </span>
                    </div>
                </div>

                <!-- Synonyms -->
                <div v-if="slide.synonyms?.length" class="flex-1-1-0">
                    <div class="text-overline text-slate-400 font-weight-bold mb-2">
                    Synonyms
                    </div>
                    <div v-if="slide.synonyms?.length" class="d-flex flex-wrap ga-2">
                    <v-chip
                        v-for="(syn, i) in slide.synonyms"
                        :key="`${slide.term}-syn-${i}`"
                        variant="tonal"
                        color="purple"
                        class="font-weight-medium"
                    >
                        {{ syn }}
                    </v-chip>
                    </div>
                    <div v-else class="text-body-2 text-slate-500">
                    No synonyms provided.
                    </div>
                </div>
                </div>

              <v-divider class="my-4" />

              <!-- Example -->
              <div>
                <div class="text-overline text-slate-400 font-weight-bold mb-1">Example sentence</div>
                <div class="text-body-1 font-italic text-slate-800 break-word">
                  {{ slide.exampleSentence || "No example sentence provided." }}
                </div>
              </div>

            </template>

            <template v-else>
              <div class="py-16 text-center text-slate-500 font-weight-bold">
                No vocabulary items available.
              </div>
            </template>
          </v-card>
        </v-container>
      </div>

      <!-- FOOTER -->
      <div class="border-t bg-white px-3 px-sm-5 py-2 d-flex align-center justify-space-between">
        <div class="text-caption text-slate-500">
          Use ← / → arrows to navigate
        </div>
        <div class="d-flex ga-2">
          <v-btn variant="outlined" color="slate-600" @click="goPrev" :disabled="!hasPrev" prepend-icon="mdi-chevron-left">
            Previous
          </v-btn>
          <v-btn color="primary" @click="goNext" :disabled="!hasNext" append-icon="mdi-chevron-right">
            Next
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

type AnyItem = Record<string, any>;

interface SlideData {
  term: string;
  definition: string;
  image: string;
  french: string;
  german: string;
  italian: string;
  exampleSentence: string;
  synonyms: string[];
}

const props = defineProps<{
  modelValue: boolean;
  items: AnyItem[];
  listName?: string;
  startIndex?: number;
  closeLabel?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "close"): void;
  (e: "indexChange", index: number): void;
}>();

const internalOpen = ref<boolean>(props.modelValue);
const currentIndex = ref<number>(Math.max(0, Number(props.startIndex ?? 0)));

watch(
  () => props.modelValue,
  (v) => {
    internalOpen.value = v;
    if (v) bindKeys();
    else unbindKeys();
  }
);

watch(internalOpen, (v) => {
  emit("update:modelValue", v);
  if (!v) emit("close");
});

watch(
  () => props.startIndex,
  (v) => {
    if (typeof v === "number" && Number.isFinite(v)) {
      currentIndex.value = clamp(v, 0, Math.max(0, props.items.length - 1));
    }
  }
);

watch(currentIndex, (i) => emit("indexChange", i));

const maxIndex = computed(() => Math.max(0, (props.items?.length ?? 0) - 1));
const current = computed(() => props.items?.[currentIndex.value] ?? null);
const hasPrev = computed(() => currentIndex.value > 0);
const hasNext = computed(() => currentIndex.value < maxIndex.value);
const positionLabel = computed(() => `${props.items?.length ? currentIndex.value + 1 : 0} / ${props.items?.length ?? 0}`);
const seekIndex = ref<number>(0);

watch(
  () => currentIndex.value,
  (i) => (seekIndex.value = i),
  { immediate: true }
);

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function asFirstString(v: any): string {
  if (Array.isArray(v)) return String(v[0] ?? "").trim();
  if (v == null) return "";
  return String(v).trim();
}

function asStringArray(v: any): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === "string") {
    return v.split(/[;,|]/g).map((x) => x.trim()).filter(Boolean);
  }
  return [];
}

function resolveImage(item: AnyItem): string {
  return String(
    item?.image ||
    item?.image_url ||
    item?.additional_data?.image ||
    item?.additional_data?.image_url ||
    ""
  ).trim();
}

function resolveTranslation(item: AnyItem, key: "French" | "German" | "Italian"): string {
  const data = item?.additional_data ?? {};
  const fields = item?.fields ?? {};

  return (
    asFirstString(item?.[key]) ||
    asFirstString(data?.[key]) ||
    asFirstString(fields?.[key]) ||
    ""
  );
}

function resolveSynonyms(item: AnyItem): string[] {
  const data = item?.additional_data ?? {};
  return (
    asStringArray(data?.synonyms).length ? asStringArray(data?.synonyms) :
    asStringArray(data?.synonym).length ? asStringArray(data?.synonym) :
    asStringArray(data?.related_terms)
  );
}

function resolveExample(item: AnyItem): string {
  const data = item?.additional_data ?? {};
  return (
    asFirstString(item?.context_usage) ||
    asFirstString(data?.example_sentence) ||
    asFirstString(data?.example) ||
    asFirstString(data?.usage_example) ||
    ""
  );
}

const slide = computed<SlideData>(() => {
  const it = current.value ?? {};

  return {
    term: asFirstString(it.term),
    definition: asFirstString(it.definition) || asFirstString(it?.fields?.definition),
    image: resolveImage(it),
    french: resolveTranslation(it, "French"),
    german: resolveTranslation(it, "German"),
    italian: resolveTranslation(it, "Italian"),
    exampleSentence: resolveExample(it),
    synonyms: resolveSynonyms(it),
  };
});

function goPrev() {
  if (!hasPrev.value) return;
  currentIndex.value -= 1;
}

function goNext() {
  if (!hasNext.value) return;
  currentIndex.value += 1;
}

function commitSeek() {
  currentIndex.value = clamp(Math.trunc(seekIndex.value), 0, maxIndex.value);
}

function close() {
  internalOpen.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (!internalOpen.value) return;
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    goPrev();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    goNext();
  } else if (e.key === "Escape") {
    e.preventDefault();
    close();
  }
}

function bindKeys() {
  window.addEventListener("keydown", onKeydown);
}
function unbindKeys() {
  window.removeEventListener("keydown", onKeydown);
}

onMounted(() => {
  if (internalOpen.value) bindKeys();
});
onBeforeUnmount(() => unbindKeys());

const closeLabel = computed(() => props.closeLabel || "Close presentation");
</script>

<style scoped>
.presentation-topbar {
  min-height: 54px;
}
.max-width-slide {
  max-width: 980px;
}
.break-word {
  word-break: break-word;
}
.image-wrap {
  width: 240px;
  min-width: 240px;
}
.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-50 { background-color: #f8fafc !important; }
.border-b { border-bottom: 1px solid #e2e8f0; }
.border-t { border-top: 1px solid #e2e8f0; }
</style>