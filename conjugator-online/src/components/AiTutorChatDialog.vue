<template>
  <div>
    <v-dialog v-model="isOpen" max-width="900">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="text-h6">{{ title }}</div>

          <div class="d-flex ga-2">
            <v-btn size="small" variant="text" @click="resetChat" :disabled="isLoading">
              Reset
            </v-btn>
            <v-btn size="small" variant="text" @click="closeDialog" :disabled="isLoading">
              Close
            </v-btn>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-4">
          <slot name="context-summary" :ctx="context" />
          <v-alert
            v-if="shouldShowContextPreview"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            <div class="text-subtitle-2 mb-1">Initial prompt sent to tutor:</div>
            <pre class="context-preview">{{ initialUserMessage }}</pre>
          </v-alert>

          <div class="chat-window" ref="chatWindowRef">
            <div
              v-for="(m, idx) in messages.filter((msg) => !msg.hidden)"
              :key="idx"
              class="chat-row"
              :class="m.role"
            >
              <div class="bubble">
                <div class="role-label">
                  {{ m.role === "user" ? "You" : m.role === "assistant" ? "Tutor" : "System" }}
                </div>
                <div class="content" v-text="m.content"></div>
              </div>
            </div>

            <div v-if="isLoading" class="chat-row assistant">
              <div class="bubble">
                <div class="role-label">Tutor</div>
                <div class="content">Thinking…</div>
              </div>
            </div>
          </div>

          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            density="compact"
            class="mt-4"
          >
            {{ errorMessage }}
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 d-flex ga-3">
          <v-textarea
            v-model="draft"
            auto-grow
            rows="1"
            max-rows="6"
            class="flex-grow-1"
            label="Ask a follow-up question"
            :disabled="isLoading"
            @keydown.enter.exact.prevent="sendUserMessage"
          />
          <v-btn
            color="primary"
            :loading="isLoading"
            :disabled="!draft.trim() || isLoading"
            @click="sendUserMessage"
          >
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import api from "@/axios";

type ChatMsg = {
  role: "system" | "user" | "assistant";
  content: string;
  hidden?: boolean;
};

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "AI Tutor" },

  // IMPORTANT: with your axios baseURL likely ending in /api,
  // this should be "/llm/chat/" not "/api/llm/chat/"
  apiUrl: { type: String, default: "/llm/chat/" },

  model: { type: String, default: "NousResearch/Hermes-4-14B" },
  temperature: { type: Number, default: 0.4 },
  maxTokens: { type: Number, default: 400 },

  context: { type: Object, default: () => ({}) },

  buildInitialUserMessage: {
    type: Function,
    required: true,
  },

  systemMessage: {
    type: String,
    default:
      "Be brief, friendly, and specific. Focus on grammar. Always illustrate and give examples. Avoid long essays.",
  },

  autoSendOnOpen: { type: Boolean, default: true },

  // show the alert with the initial prompt (debugging)
  showContextPreview: { type: Boolean, default: false },

  // NEW: hide system / initial prompt in transcript
  hideSystemMessage: { type: Boolean, default: true },
  hideInitialUserMessage: { type: Boolean, default: true },

  resetOnContextChange: { type: Boolean, default: true },
});

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

const messages = ref<ChatMsg[]>([]);
const draft = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const didSendInitial = ref(false);
const chatWindowRef = ref<HTMLElement | null>(null);

const initialUserMessage = computed(() => props.buildInitialUserMessage(props.context || {}));

const shouldShowContextPreview = computed(() => {
  const ctx = props.context || {};
  return props.showContextPreview && Object.keys(ctx).length > 0;
});

const contextSignature = computed(() => {
  try {
    return JSON.stringify(props.context ?? {});
  } catch {
    return String(props.context ?? "");
  }
});

watch(
  () => isOpen.value,
  async (open) => {
    if (open) await onOpen();
  }
);

watch(contextSignature, async (newSig, oldSig) => {
  if (!props.resetOnContextChange) return;
  if (newSig === oldSig) return;

  if (!isOpen.value) {
    messages.value = [];
    didSendInitial.value = false;
    draft.value = "";
    errorMessage.value = "";
    return;
  }

  resetChat();
});

function openDialog() {
  isOpen.value = true;
}
function closeDialog() {
  isOpen.value = false;
}

function scrollToBottom() {
  const el = chatWindowRef.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

function initTranscriptIfNeeded() {
  if (messages.value.length === 0) {
    messages.value = [
      {
        role: "system",
        content: props.systemMessage,
        hidden: props.hideSystemMessage, // FIX: actually hide system message
      },
    ];
    didSendInitial.value = false;
  }
}

async function onOpen() {
  initTranscriptIfNeeded();

  if (props.autoSendOnOpen && !didSendInitial.value) {
    await sendInitialMessage();
  }

  await nextTick();
  scrollToBottom();
}

function resetChat() {
  messages.value = [
    {
      role: "system",
      content: props.systemMessage,
      hidden: props.hideSystemMessage, // FIX: also hide on reset
    },
  ];
  draft.value = "";
  errorMessage.value = "";
  didSendInitial.value = false;

  if (isOpen.value && props.autoSendOnOpen) {
    // fire-and-forget is OK, but keeping consistent with onOpen
    sendInitialMessage();
  }
}

async function sendInitialMessage() {
  didSendInitial.value = true;

  messages.value.push({
    role: "user",
    content: initialUserMessage.value,
    hidden: props.hideInitialUserMessage,
  });

  await nextTick();
  scrollToBottom();
  await callLlm();
}

async function sendUserMessage() {
  const text = draft.value.trim();
  if (!text) return;

  errorMessage.value = "";
  messages.value.push({ role: "user", content: text });
  draft.value = "";

  await nextTick();
  scrollToBottom();

  await callLlm();
}

async function callLlm() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const payload = {
      model: props.model,
      messages: messages.value.map(({ role, content }) => ({ role, content })),
      max_tokens: props.maxTokens,
      temperature: props.temperature,
      stream: false,
    };

    const res = await api.post(props.apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const out = res.data?.content ?? "";
    if (!out) throw new Error("LLM returned no content.");

    messages.value.push({ role: "assistant", content: out });
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
    await nextTick();
    scrollToBottom();
  }
}
</script>

<style scoped>
.chat-window {
  height: 420px;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 12px;
  background: #fafafa;
}
.chat-row {
  display: flex;
  margin-bottom: 10px;
}
.chat-row.user {
  justify-content: flex-end;
}
.chat-row.assistant,
.chat-row.system {
  justify-content: flex-start;
}
.bubble {
  max-width: 75%;
  padding: 10px 12px;
  border-radius: 12px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.12);
  white-space: pre-wrap;
}
.chat-row.user .bubble {
  background: #e3f2fd;
  border-color: #bbdefb;
}
.role-label {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 4px;
}
.context-preview {
  margin: 0;
  font-size: 12px;
  white-space: pre-wrap;
}
</style>